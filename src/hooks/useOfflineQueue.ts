import { useState, useCallback, useRef } from 'react';

export interface QueuedUpdate<T> {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  data: T;
}

export interface OfflineQueueConfig<T> {
  enabled: boolean;
  onInsert?: (data: T) => void;
  onUpdate?: (data: T) => void;
  onDelete?: (data: T) => void;
}

export function useOfflineQueue<T>(config: OfflineQueueConfig<T>) {
  const [queuedCount, setQueuedCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const offlineQueue = useRef<QueuedUpdate<T>[]>([]);

  const queueUpdate = useCallback(
    (type: 'INSERT' | 'UPDATE' | 'DELETE', data: T, isConnected: boolean) => {
      if (config.enabled && !isConnected) {
        offlineQueue.current.push({ type, data });
        setQueuedCount(offlineQueue.current.length);
      }
    },
    [config.enabled]
  );

  const processQueue = useCallback(async () => {
    if (offlineQueue.current.length === 0) return;
    
    setProcessing(true);
    
    const queue = [...offlineQueue.current];
    offlineQueue.current = [];
    
    for (const item of queue) {
      try {
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
    
    setQueuedCount(offlineQueue.current.length);
    setProcessing(false);
  }, [config]);

  const clearQueue = useCallback(() => {
    offlineQueue.current = [];
    setQueuedCount(0);
  }, []);

  return {
    queuedCount,
    processing,
    queueUpdate,
    processQueue,
    clearQueue,
  };
}
