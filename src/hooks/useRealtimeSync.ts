import { useEffect, useState, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ConnectionManager } from '@/services/ConnectionManager';
import { ConflictResolver } from '@/services/ConflictResolver';

export interface RealtimeSyncConfig<T> {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onInsert?: (record: T) => void;
  onUpdate?: (record: T) => void;
  onDelete?: (record: T) => void;
  onError?: (error: Error) => void;
  enableOfflineQueue?: boolean;
  conflictResolution?: 'server-wins' | 'client-wins' | 'last-write-wins' | 'custom';
  customResolver?: (local: T, remote: T) => T;
}

export interface SyncStatus {
  connected: boolean;
  syncing: boolean;
  lastSync: Date | null;
  queuedUpdates: number;
  errors: Error[];
}

export function useRealtimeSync<T extends { id?: string; updated_at?: string }>(
  config: RealtimeSyncConfig<T>
) {
  const [status, setStatus] = useState<SyncStatus>({
    connected: false,
    syncing: false,
    lastSync: null,
    queuedUpdates: 0,
    errors: [],
  });

  const channelRef = useRef<RealtimeChannel | null>(null);
  const connectionManager = useRef(ConnectionManager.getInstance());
  const conflictResolver = useRef(new ConflictResolver<T>());
  const offlineQueue = useRef<Array<{ type: string; data: T }>>([]);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle incoming updates with conflict resolution
  const handleUpdate = useCallback(
    async (payload: any) => {
      const record = payload.new as T;
      
      if (config.conflictResolution && record.updated_at) {
        try {
          const resolved = await conflictResolver.current.resolve(
            record,
            config.conflictResolution,
            config.customResolver
          );
          
          if (config.onUpdate) {
            config.onUpdate(resolved);
          }
        } catch (error) {
          setStatus(prev => ({
            ...prev,
            errors: [...prev.errors, error as Error],
          }));
          
          if (config.onError) {
            config.onError(error as Error);
          }
        }
      } else {
        if (config.onUpdate) {
          config.onUpdate(record);
        }
      }
      
      setStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        syncing: false,
      }));
    },
    [config]
  );

  // Handle inserts
  const handleInsert = useCallback(
    (payload: any) => {
      const record = payload.new as T;
      
      if (config.onInsert) {
        config.onInsert(record);
      }
      
      setStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        syncing: false,
      }));
    },
    [config]
  );

  // Handle deletes
  const handleDelete = useCallback(
    (payload: any) => {
      const record = payload.old as T;
      
      if (config.onDelete) {
        config.onDelete(record);
      }
      
      setStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        syncing: false,
      }));
    },
    [config]
  );

  // Process offline queue
  const processOfflineQueue = useCallback(async () => {
    if (offlineQueue.current.length === 0) return;
    
    setStatus(prev => ({ ...prev, syncing: true }));
    
    const queue = [...offlineQueue.current];
    offlineQueue.current = [];
    
    for (const item of queue) {
      try {
        // Re-apply queued updates
        if (item.type === 'UPDATE' && config.onUpdate) {
          config.onUpdate(item.data);
        } else if (item.type === 'INSERT' && config.onInsert) {
          config.onInsert(item.data);
        } else if (item.type === 'DELETE' && config.onDelete) {
          config.onDelete(item.data);
        }
      } catch (error) {
        console.error('Error processing offline queue item:', error);
        // Re-add to queue if failed
        offlineQueue.current.push(item);
      }
    }
    
    setStatus(prev => ({
      ...prev,
      syncing: false,
      queuedUpdates: offlineQueue.current.length,
    }));
  }, [config]);

  // Setup realtime subscription
  const setupSubscription = useCallback(() => {
    const channel = supabase.channel(`realtime:${config.table}:${Date.now()}`);
    
    // Configure channel based on events
    let channelWithEvents = channel;
    
    const subscribeConfig: any = {
      event: config.event === '*' ? '*' : config.event || '*',
      schema: 'public',
      table: config.table,
    };
    
    if (config.filter) {
      subscribeConfig.filter = config.filter;
    }
    
    if (config.event === '*' || !config.event) {
      channelWithEvents
        .on('postgres_changes' as any, {
          event: 'INSERT',
          schema: 'public',
          table: config.table,
          ...(config.filter ? { filter: config.filter } : {}),
        }, handleInsert)
        .on('postgres_changes' as any, {
          event: 'UPDATE',
          schema: 'public',
          table: config.table,
          ...(config.filter ? { filter: config.filter } : {}),
        }, handleUpdate)
        .on('postgres_changes' as any, {
          event: 'DELETE',
          schema: 'public',
          table: config.table,
          ...(config.filter ? { filter: config.filter } : {}),
        }, handleDelete);
    } else {
      const handler = config.event === 'INSERT' ? handleInsert
        : config.event === 'UPDATE' ? handleUpdate
        : handleDelete;
      
      channelWithEvents.on('postgres_changes' as any, subscribeConfig, handler);
    }
    
    channelWithEvents.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setStatus(prev => ({
          ...prev,
          connected: true,
          errors: [],
        }));
        
        // Process any queued offline updates
        if (config.enableOfflineQueue) {
          processOfflineQueue();
        }
      } else if (status === 'CHANNEL_ERROR') {
        setStatus(prev => ({
          ...prev,
          connected: false,
          errors: [...prev.errors, new Error('Channel subscription error')],
        }));
        
        // Attempt reconnection
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          setupSubscription();
        }, 5000);
      } else if (status === 'TIMED_OUT') {
        setStatus(prev => ({
          ...prev,
          connected: false,
          errors: [...prev.errors, new Error('Connection timed out')],
        }));
      }
    });
    
    channelRef.current = channel;
  }, [config, handleInsert, handleUpdate, handleDelete, processOfflineQueue]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('Connection restored, resubscribing...');
      setupSubscription();
    };
    
    const handleOffline = () => {
      console.log('Connection lost, entering offline mode...');
      setStatus(prev => ({
        ...prev,
        connected: false,
      }));
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    
    connectionManager.current.on('online', handleOnline);
    connectionManager.current.on('offline', handleOffline);
    
    return () => {
      connectionManager.current.off('online', handleOnline);
      connectionManager.current.off('offline', handleOffline);
    };
  }, [setupSubscription]);

  // Initialize subscription
  useEffect(() => {
    if (connectionManager.current.isOnline()) {
      setupSubscription();
    }
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [setupSubscription]);

  // Queue updates when offline
  const queueUpdate = useCallback(
    (type: 'INSERT' | 'UPDATE' | 'DELETE', data: T) => {
      if (config.enableOfflineQueue && !status.connected) {
        offlineQueue.current.push({ type, data });
        setStatus(prev => ({
          ...prev,
          queuedUpdates: offlineQueue.current.length,
        }));
      }
    },
    [config.enableOfflineQueue, status.connected]
  );

  // Manual sync trigger
  const triggerSync = useCallback(async () => {
    if (!status.connected) {
      console.warn('Cannot sync while offline');
      return;
    }
    
    setStatus(prev => ({ ...prev, syncing: true }));
    await processOfflineQueue();
  }, [status.connected, processOfflineQueue]);

  // Clear errors
  const clearErrors = useCallback(() => {
    setStatus(prev => ({ ...prev, errors: [] }));
  }, []);

  return {
    status,
    queueUpdate,
    triggerSync,
    clearErrors,
    isConnected: status.connected,
    isSyncing: status.syncing,
  };
}
