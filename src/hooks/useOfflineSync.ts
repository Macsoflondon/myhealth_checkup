import { useState, useEffect, useCallback } from 'react';
import { OfflineSyncManager, SyncEventType } from '@/services/OfflineSyncManager';
import { ConnectionManager } from '@/services/ConnectionManager';
import { useToast } from './use-toast';

export interface SyncState {
  isSyncing: boolean;
  isOnline: boolean;
  pendingOperations: number;
  conflicts: number;
  lastSyncTime: Date | null;
  syncProgress: {
    current: number;
    total: number;
    synced: number;
    failed: number;
  } | null;
}

export function useOfflineSync() {
  const { toast } = useToast();
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    isOnline: navigator.onLine,
    pendingOperations: 0,
    conflicts: 0,
    lastSyncTime: null,
    syncProgress: null,
  });

  const syncManager = OfflineSyncManager.getInstance();
  const connectionManager = ConnectionManager.getInstance();

  // Update stats
  const updateStats = useCallback(async () => {
    const stats = await syncManager.getStats();
    setSyncState(prev => ({
      ...prev,
      pendingOperations: stats.pendingOperations,
      conflicts: stats.conflicts,
    }));
  }, [syncManager]);

  // Handle sync events
  useEffect(() => {
    const handleSyncEvent = (event: { type: SyncEventType; data?: any }) => {
      switch (event.type) {
        case 'sync-start':
          setSyncState(prev => ({ ...prev, isSyncing: true }));
          break;

        case 'sync-progress':
          setSyncState(prev => ({
            ...prev,
            syncProgress: event.data,
          }));
          break;

        case 'sync-complete':
          setSyncState(prev => ({
            ...prev,
            isSyncing: false,
            lastSyncTime: new Date(),
            syncProgress: null,
          }));

          if (event.data.synced > 0) {
            toast({
              title: "Sync complete",
              description: `Successfully synced ${event.data.synced} operation(s)`,
            });
          }

          updateStats();
          break;

        case 'sync-error':
          setSyncState(prev => ({
            ...prev,
            isSyncing: false,
            syncProgress: null,
          }));

          toast({
            title: "Sync error",
            description: "Failed to sync some operations. Will retry later.",
            variant: "destructive",
          });
          break;

        case 'conflict-detected':
          toast({
            title: "Conflict detected",
            description: "Some changes conflict with server data. Please review.",
            variant: "destructive",
          });
          updateStats();
          break;
      }
    };

    syncManager.on(handleSyncEvent);

    return () => {
      syncManager.off(handleSyncEvent);
    };
  }, [syncManager, toast, updateStats]);

  // Handle connection status
  useEffect(() => {
    const handleOnline = () => {
      setSyncState(prev => ({ ...prev, isOnline: true }));
      toast({
        title: "Back online",
        description: "Syncing your offline changes...",
      });
    };

    const handleOffline = () => {
      setSyncState(prev => ({ ...prev, isOnline: false }));
      toast({
        title: "You're offline",
        description: "Your changes will be saved and synced when you're back online.",
      });
    };

    connectionManager.on('online', handleOnline);
    connectionManager.on('offline', handleOffline);

    // Initial stats load
    updateStats();

    return () => {
      connectionManager.off('online', handleOnline);
      connectionManager.off('offline', handleOffline);
    };
  }, [connectionManager, toast, updateStats]);

  // Manual sync trigger
  const triggerSync = useCallback(async () => {
    if (!syncState.isOnline) {
      toast({
        title: "Cannot sync",
        description: "You're currently offline. Please check your connection.",
        variant: "destructive",
      });
      return;
    }

    await syncManager.sync();
  }, [syncManager, syncState.isOnline, toast]);

  // Clear all offline data
  const clearOfflineData = useCallback(async () => {
    await syncManager.clearAllData();
    await updateStats();
    
    toast({
      title: "Offline data cleared",
      description: "All offline operations and cache have been removed.",
    });
  }, [syncManager, updateStats, toast]);

  return {
    syncState,
    triggerSync,
    clearOfflineData,
    isOnline: syncState.isOnline,
    isSyncing: syncState.isSyncing,
    hasPendingChanges: syncState.pendingOperations > 0,
    hasConflicts: syncState.conflicts > 0,
  };
}
