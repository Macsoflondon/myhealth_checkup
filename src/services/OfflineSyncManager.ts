import { supabase } from "@/integrations/supabase/client";
import { OfflineStorageService, OfflineOperation } from "./OfflineStorageService";
import { ConnectionManager } from "./ConnectionManager";

export type SyncEventType = 'sync-start' | 'sync-progress' | 'sync-complete' | 'sync-error' | 'conflict-detected';

interface SyncEvent {
  type: SyncEventType;
  data?: any;
}

export class OfflineSyncManager {
  private static instance: OfflineSyncManager;
  private storage = OfflineStorageService.getInstance();
  private connectionManager = ConnectionManager.getInstance();
  private isSyncing = false;
  private listeners: Array<(event: SyncEvent) => void> = [];
  private syncInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.setupAutoSync();
  }

  public static getInstance(): OfflineSyncManager {
    if (!OfflineSyncManager.instance) {
      OfflineSyncManager.instance = new OfflineSyncManager();
    }
    return OfflineSyncManager.instance;
  }

  private setupAutoSync(): void {
    // Sync when connection is restored
    this.connectionManager.on('online', () => {
      console.log('Connection restored, starting sync...');
      this.sync();
    });

    // Periodic sync check (every 30 seconds when online)
    this.syncInterval = setInterval(() => {
      if (this.connectionManager.isOnline() && !this.isSyncing) {
        this.sync();
      }
    }, 30000);
  }

  public on(callback: (event: SyncEvent) => void): void {
    this.listeners.push(callback);
  }

  public off(callback: (event: SyncEvent) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private emit(event: SyncEvent): void {
    this.listeners.forEach(listener => listener(event));
  }

  public async sync(): Promise<void> {
    if (this.isSyncing || !this.connectionManager.isOnline()) {
      return;
    }

    this.isSyncing = true;
    this.emit({ type: 'sync-start' });

    try {
      const operations = await this.storage.getPendingOperations();

      if (operations.length === 0) {
        this.emit({ type: 'sync-complete', data: { synced: 0, failed: 0 } });
        return;
      }

      let synced = 0;
      let failed = 0;

      for (let i = 0; i < operations.length; i++) {
        const operation = operations[i];

        try {
          await this.storage.updateOperationStatus(operation.id, 'syncing');

          await this.executeOperation(operation);

          await this.storage.deleteOperation(operation.id);
          synced++;

          this.emit({
            type: 'sync-progress',
            data: { current: i + 1, total: operations.length, synced, failed },
          });
        } catch (error) {
          console.error('Operation sync failed:', error);
          failed++;

          await this.storage.updateOperationStatus(
            operation.id,
            operation.retries >= 3 ? 'failed' : 'pending',
            error instanceof Error ? error.message : 'Unknown error'
          );

          // Store conflict if it's a conflict error
          if (error instanceof Error && error.message.includes('conflict')) {
            await this.handleConflict(operation, error);
          }
        }
      }

      this.emit({ type: 'sync-complete', data: { synced, failed } });
    } catch (error) {
      console.error('Sync process failed:', error);
      this.emit({ type: 'sync-error', data: error });
    } finally {
      this.isSyncing = false;
    }
  }

  private async executeOperation(operation: OfflineOperation): Promise<void> {
    const { table, type, data } = operation;

    switch (type) {
      case 'INSERT': {
        const { error } = await supabase.from(table as any).insert(data as any);
        if (error) throw error;
        break;
      }

      case 'UPDATE': {
        if (!data.id) throw new Error('Update operation requires an id');
        const { error } = await supabase
          .from(table as any)
          .update(data as any)
          .eq('id', data.id);
        if (error) throw error;
        break;
      }

      case 'DELETE': {
        if (!data.id) throw new Error('Delete operation requires an id');
        const { error } = await supabase
          .from(table as any)
          .delete()
          .eq('id', data.id);
        if (error) throw error;
        break;
      }

      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  private async handleConflict(operation: OfflineOperation, error: Error): Promise<void> {
    // Fetch current server data
    const { data: remoteData } = await supabase
      .from(operation.table as any)
      .select('*')
      .eq('id', operation.data.id)
      .single();

    await this.storage.storeConflict({
      operationId: operation.id,
      table: operation.table,
      localData: operation.data,
      remoteData: remoteData || {},
      timestamp: Date.now(),
    });

    this.emit({
      type: 'conflict-detected',
      data: {
        operation,
        remoteData,
      },
    });
  }

  public async forceSyncOperation(operationId: string): Promise<void> {
    const operations = await this.storage.getPendingOperations();
    const operation = operations.find(op => op.id === operationId);

    if (!operation) {
      throw new Error('Operation not found');
    }

    await this.executeOperation(operation);
    await this.storage.deleteOperation(operationId);
  }

  public async getStats() {
    return await this.storage.getStats();
  }

  public async clearAllData(): Promise<void> {
    await this.storage.clearAll();
  }

  public destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.listeners = [];
  }
}
