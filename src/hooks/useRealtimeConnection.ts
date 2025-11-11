import { useEffect, useState, useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ConnectionManager } from '@/services/ConnectionManager';

export interface ConnectionStatus {
  connected: boolean;
  lastSync: Date | null;
  errors: Error[];
}

export function useRealtimeConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    lastSync: null,
    errors: [],
  });

  const channelRef = useRef<RealtimeChannel | null>(null);
  const connectionManager = useRef(ConnectionManager.getInstance());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const updateStatus = useCallback((updates: Partial<ConnectionStatus>) => {
    setStatus(prev => ({ ...prev, ...updates }));
  }, []);

  const handleOnline = useCallback(() => {
    console.log('Connection restored');
    updateStatus({ connected: true, errors: [] });
  }, [updateStatus]);

  const handleOffline = useCallback(() => {
    console.log('Connection lost');
    updateStatus({ connected: false });
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [updateStatus]);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  const attemptReconnect = useCallback((setupFn: () => void, delay = 5000) => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    reconnectTimeoutRef.current = setTimeout(setupFn, delay);
  }, []);

  useEffect(() => {
    connectionManager.current.on('online', handleOnline);
    connectionManager.current.on('offline', handleOffline);
    
    return () => {
      connectionManager.current.off('online', handleOnline);
      connectionManager.current.off('offline', handleOffline);
      cleanup();
    };
  }, [handleOnline, handleOffline, cleanup]);

  return {
    status,
    channelRef,
    updateStatus,
    cleanup,
    attemptReconnect,
    isOnline: connectionManager.current.isOnline(),
  };
}
