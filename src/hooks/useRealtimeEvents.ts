import { useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ConflictResolver } from '@/services/ConflictResolver';

export interface RealtimeEventConfig<T> {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onInsert?: (record: T) => void;
  onUpdate?: (record: T) => void;
  onDelete?: (record: T) => void;
  onError?: (error: Error) => void;
  conflictResolution?: 'server-wins' | 'client-wins' | 'last-write-wins' | 'custom';
  customResolver?: (local: T, remote: T) => T;
}

export function useRealtimeEvents<T extends { id?: string; updated_at?: string }>(
  config: RealtimeEventConfig<T>,
  conflictResolver: React.MutableRefObject<ConflictResolver<T>>,
  onSyncComplete: () => void,
  onSyncError: (error: Error) => void
) {
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
          onSyncError(error as Error);
          if (config.onError) {
            config.onError(error as Error);
          }
        }
      } else {
        if (config.onUpdate) {
          config.onUpdate(record);
        }
      }
      
      onSyncComplete();
    },
    [config, conflictResolver, onSyncComplete, onSyncError]
  );

  const handleInsert = useCallback(
    (payload: any) => {
      const record = payload.new as T;
      
      if (config.onInsert) {
        config.onInsert(record);
      }
      
      onSyncComplete();
    },
    [config, onSyncComplete]
  );

  const handleDelete = useCallback(
    (payload: any) => {
      const record = payload.old as T;
      
      if (config.onDelete) {
        config.onDelete(record);
      }
      
      onSyncComplete();
    },
    [config, onSyncComplete]
  );

  const attachEventHandlers = useCallback(
    (channel: RealtimeChannel) => {
      if (config.event === '*' || !config.event) {
        channel
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
        
        channel.on('postgres_changes' as any, {
          event: config.event,
          schema: 'public',
          table: config.table,
          ...(config.filter ? { filter: config.filter } : {}),
        }, handler);
      }
      
      return channel;
    },
    [config, handleInsert, handleUpdate, handleDelete]
  );

  return { attachEventHandlers };
}
