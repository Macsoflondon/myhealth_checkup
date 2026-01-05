/**
 * Offline Storage Service using IndexedDB for persistent storage
 * Falls back to localStorage if IndexedDB is not available
 */

interface StorageConfig {
  dbName: string;
  version: number;
  stores: string[];
}

export interface OfflineOperation<T = any> {
  id: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  data: T;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  error?: string;
}

export class OfflineStorageService {
  private static instance: OfflineStorageService;
  private db: IDBDatabase | null = null;
  private dbName: string = 'myhealth_offline_db';
  private version: number = 1;
  private useIndexedDB: boolean = true;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): OfflineStorageService {
    if (!OfflineStorageService.instance) {
      OfflineStorageService.instance = new OfflineStorageService();
    }
    return OfflineStorageService.instance;
  }

  private async initialize(): Promise<void> {
    if (!window.indexedDB) {
      console.warn('IndexedDB not available, falling back to localStorage');
      this.useIndexedDB = false;
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('IndexedDB initialization failed:', request.error);
        this.useIndexedDB = false;
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('operations')) {
          const operationStore = db.createObjectStore('operations', { keyPath: 'id' });
          operationStore.createIndex('status', 'status', { unique: false });
          operationStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('conflicts')) {
          const conflictStore = db.createObjectStore('conflicts', { keyPath: 'id' });
          conflictStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // ============================================================================
  // Queue Operations
  // ============================================================================

  public async queueOperation<T>(operation: Omit<OfflineOperation<T>, 'id' | 'timestamp' | 'retries' | 'status'>): Promise<string> {
    const fullOperation: OfflineOperation<T> = {
      ...operation,
      id: this.generateId(),
      timestamp: Date.now(),
      retries: 0,
      status: 'pending',
    };

    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['operations'], 'readwrite');
        const store = transaction.objectStore('operations');
        const request = store.add(fullOperation);

        request.onsuccess = () => resolve(fullOperation.id);
        request.onerror = () => reject(request.error);
      });
    } else {
      // Fallback to localStorage
      const key = `offline_ops_${fullOperation.id}`;
      localStorage.setItem(key, JSON.stringify(fullOperation));
      return fullOperation.id;
    }
  }

  public async getPendingOperations(): Promise<OfflineOperation[]> {
    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['operations'], 'readonly');
        const store = transaction.objectStore('operations');
        const index = store.index('status');
        const request = index.getAll('pending');

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } else {
      // Fallback to localStorage
      const operations: OfflineOperation[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('offline_ops_')) {
          const data = localStorage.getItem(key);
          if (data) {
            const op = JSON.parse(data);
            if (op.status === 'pending') {
              operations.push(op);
            }
          }
        }
      }
      return operations.sort((a, b) => a.timestamp - b.timestamp);
    }
  }

  public async updateOperationStatus(id: string, status: OfflineOperation['status'], error?: string): Promise<void> {
    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['operations'], 'readwrite');
        const store = transaction.objectStore('operations');
        const request = store.get(id);

        request.onsuccess = () => {
          const operation = request.result;
          if (operation) {
            operation.status = status;
            if (error) operation.error = error;
            if (status === 'syncing') operation.retries++;
            
            const updateRequest = store.put(operation);
            updateRequest.onsuccess = () => resolve();
            updateRequest.onerror = () => reject(updateRequest.error);
          } else {
            resolve();
          }
        };

        request.onerror = () => reject(request.error);
      });
    } else {
      const key = `offline_ops_${id}`;
      const data = localStorage.getItem(key);
      if (data) {
        const operation = JSON.parse(data);
        operation.status = status;
        if (error) operation.error = error;
        if (status === 'syncing') operation.retries++;
        localStorage.setItem(key, JSON.stringify(operation));
      }
    }
  }

  public async deleteOperation(id: string): Promise<void> {
    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['operations'], 'readwrite');
        const store = transaction.objectStore('operations');
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      localStorage.removeItem(`offline_ops_${id}`);
    }
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  public async setCache<T>(key: string, data: T, ttl?: number): Promise<void> {
    const cacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      ttl,
    };

    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        const request = store.put(cacheEntry);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheEntry));
    }
  }

  public async getCache<T>(key: string): Promise<T | null> {
    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');
        const request = store.get(key);

        request.onsuccess = () => {
          const entry = request.result;
          if (!entry) {
            resolve(null);
            return;
          }

          // Check TTL
          if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
            this.deleteCache(key);
            resolve(null);
            return;
          }

          resolve(entry.data);
        };

        request.onerror = () => reject(request.error);
      });
    } else {
      const data = localStorage.getItem(`cache_${key}`);
      if (!data) return null;

      const entry = JSON.parse(data);
      if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return entry.data;
    }
  }

  public async deleteCache(key: string): Promise<void> {
    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      localStorage.removeItem(`cache_${key}`);
    }
  }

  // ============================================================================
  // Conflict Management
  // ============================================================================

  public async storeConflict<T>(conflict: {
    operationId: string;
    table: string;
    localData: T;
    remoteData: T;
    timestamp: number;
  }): Promise<void> {
    const conflictEntry = {
      id: this.generateId(),
      ...conflict,
    };

    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['conflicts'], 'readwrite');
        const store = transaction.objectStore('conflicts');
        const request = store.add(conflictEntry);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      localStorage.setItem(`conflict_${conflictEntry.id}`, JSON.stringify(conflictEntry));
    }
  }

  public async getConflicts(): Promise<any[]> {
    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['conflicts'], 'readonly');
        const store = transaction.objectStore('conflicts');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } else {
      const conflicts: any[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('conflict_')) {
          const data = localStorage.getItem(key);
          if (data) conflicts.push(JSON.parse(data));
        }
      }
      return conflicts;
    }
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public async clearAll(): Promise<void> {
    if (this.useIndexedDB && this.db) {
      const stores = ['operations', 'cache', 'conflicts'];
      for (const storeName of stores) {
        await new Promise<void>((resolve, reject) => {
          const transaction = this.db!.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.clear();

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
    } else {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('offline_ops_') || key?.startsWith('cache_') || key?.startsWith('conflict_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }

  public async getStats() {
    const pending = await this.getPendingOperations();
    const conflicts = await this.getConflicts();

    return {
      pendingOperations: pending.length,
      conflicts: conflicts.length,
      storageType: this.useIndexedDB ? 'IndexedDB' : 'localStorage',
    };
  }
}
