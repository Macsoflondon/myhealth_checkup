import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ConflictResolver } from '@/services/ConflictResolver';
import { useRealtimeConnection } from './useRealtimeConnection';
import { useRealtimeEvents, RealtimeEventConfig } from './useRealtimeEvents';
import { useOfflineQueue } from './useOfflineQueue';

export interface RealtimeSyncConfig<T> extends RealtimeEventConfig<T> {
  enableOfflineQueue?: boolean;
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
  const [syncing, setSyncing] = useState(false);
  const conflictResolver = useRef(new ConflictResolver<T>());

  const {
    status: connectionStatus,
    channelRef,
    updateStatus: updateConnectionStatus,
    cleanup,
    attemptReconnect,
    isOnline,
  } = useRealtimeConnection();

  const onSyncComplete = useCallback(() => {
    updateConnectionStatus({ lastSync: new Date() });
    setSyncing(false);
  }, [updateConnectionStatus]);

  const onSyncError = useCallback((error: Error) => {
    updateConnectionStatus({ 
      errors: [...connectionStatus.errors, error]
    });
  }, [connectionStatus.errors, updateConnectionStatus]);

  const { attachEventHandlers } = useRealtimeEvents(
    config,
    conflictResolver,
    onSyncComplete,
    onSyncError
  );

  const {
    queuedCount,
    processing,
    queueUpdate: queueOfflineUpdate,
    processQueue,
    clearQueue,
  } = useOfflineQueue({
    enabled: config.enableOfflineQueue || false,
    onInsert: config.onInsert,
    onUpdate: config.onUpdate,
    onDelete: config.onDelete,
  });

  const setupSubscription = useCallback(() => {
    const channel = supabase.channel(`realtime:${config.table}:${Date.now()}`);
    
    const channelWithEvents = attachEventHandlers(channel);
    
    channelWithEvents.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        updateConnectionStatus({ 
          connected: true, 
          errors: [] 
        });
        
        if (config.enableOfflineQueue) {
          processQueue();
        }
      } else if (status === 'CHANNEL_ERROR') {
        updateConnectionStatus({
          connected: false,
          errors: [...connectionStatus.errors, new Error('Channel subscription error')],
        });
        
        attemptReconnect(setupSubscription);
      } else if (status === 'TIMED_OUT') {
        updateConnectionStatus({
          connected: false,
          errors: [...connectionStatus.errors, new Error('Connection timed out')],
        });
      }
    });
    
    channelRef.current = channel;
  }, [
    config,
    attachEventHandlers,
    processQueue,
    updateConnectionStatus,
    connectionStatus.errors,
    attemptReconnect,
    channelRef,
  ]);

  useEffect(() => {
    if (isOnline) {
      setupSubscription();
    }
    
    return cleanup;
  }, [setupSubscription, cleanup, isOnline]);

  const queueUpdate = useCallback(
    (type: 'INSERT' | 'UPDATE' | 'DELETE', data: T) => {
      queueOfflineUpdate(type, data, connectionStatus.connected);
    },
    [queueOfflineUpdate, connectionStatus.connected]
  );

  const triggerSync = useCallback(async () => {
    if (!connectionStatus.connected) {
      console.warn('Cannot sync while offline');
      return;
    }
    
    setSyncing(true);
    await processQueue();
  }, [connectionStatus.connected, processQueue]);

  const clearErrors = useCallback(() => {
    updateConnectionStatus({ errors: [] });
  }, [updateConnectionStatus]);

  const status: SyncStatus = {
    connected: connectionStatus.connected,
    syncing: syncing || processing,
    lastSync: connectionStatus.lastSync,
    queuedUpdates: queuedCount,
    errors: connectionStatus.errors,
  };

  return {
    status,
    queueUpdate,
    triggerSync,
    clearErrors,
    isConnected: status.connected,
    isSyncing: status.syncing,
  };
}
