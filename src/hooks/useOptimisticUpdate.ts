import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OfflineStorageService } from '@/services/OfflineStorageService';
import { ConnectionManager } from '@/services/ConnectionManager';
import { useToast } from './use-toast';

export interface OptimisticUpdate<T> {
  id: string;
  data: T;
  status: 'pending' | 'success' | 'error';
  timestamp: number;
}

export interface UseOptimisticUpdateConfig {
  table: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  enableOfflineSupport?: boolean;
}

export function useOptimisticUpdate<T extends { id?: string }>(config: UseOptimisticUpdateConfig) {
  const { toast } = useToast();
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, OptimisticUpdate<T>>>(new Map());
  const storage = useRef(OfflineStorageService.getInstance());
  const connectionManager = useRef(ConnectionManager.getInstance());

  // Add optimistic update
  const addOptimisticUpdate = useCallback((id: string, data: T) => {
    setOptimisticUpdates(prev => {
      const next = new Map(prev);
      next.set(id, {
        id,
        data,
        status: 'pending',
        timestamp: Date.now(),
      });
      return next;
    });
  }, []);

  // Update status
  const updateStatus = useCallback((id: string, status: 'success' | 'error') => {
    setOptimisticUpdates(prev => {
      const next = new Map(prev);
      const update = next.get(id);
      if (update) {
        next.set(id, { ...update, status });
        
        // Remove after animation
        if (status === 'success') {
          setTimeout(() => {
            setOptimisticUpdates(current => {
              const updated = new Map(current);
              updated.delete(id);
              return updated;
            });
          }, 1000);
        }
      }
      return next;
    });
  }, []);

  // Insert with optimistic update
  const insert = useCallback(async (data: Omit<T, 'id'>): Promise<T | null> => {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const optimisticData = { ...data, id: tempId } as T;

    addOptimisticUpdate(tempId, optimisticData);

    try {
      if (!connectionManager.current.isOnline() && config.enableOfflineSupport) {
        // Queue for offline sync
        await storage.current.queueOperation({
          type: 'INSERT',
          table: config.table,
          data: optimisticData,
        });

        toast({
          title: "Saved offline",
          description: "Your changes will sync when you're back online.",
        });

        updateStatus(tempId, 'success');
        return optimisticData;
      }

      const { data: result, error } = await supabase
        .from(config.table as any)
        .insert(data as any)
        .select()
        .single();

      if (error) throw error;

      updateStatus(tempId, 'success');
      config.onSuccess?.();

      return result as unknown as T;
    } catch (error) {
      console.error('Insert failed:', error);
      updateStatus(tempId, 'error');
      
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });

      config.onError?.(error as Error);
      return null;
    }
  }, [config, addOptimisticUpdate, updateStatus, toast]);

  // Update with optimistic update
  const update = useCallback(async (id: string, updates: Partial<T>): Promise<T | null> => {
    const optimisticData = updates as T;
    addOptimisticUpdate(id, optimisticData);

    try {
      if (!connectionManager.current.isOnline() && config.enableOfflineSupport) {
        await storage.current.queueOperation({
          type: 'UPDATE',
          table: config.table,
          data: { id, ...updates },
        });

        toast({
          title: "Updated offline",
          description: "Your changes will sync when you're back online.",
        });

        updateStatus(id, 'success');
        return optimisticData;
      }

      const { data: result, error } = await supabase
        .from(config.table as any)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      updateStatus(id, 'success');
      config.onSuccess?.();

      return result as unknown as T;
    } catch (error) {
      console.error('Update failed:', error);
      updateStatus(id, 'error');
      
      toast({
        title: "Failed to update",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });

      config.onError?.(error as Error);
      return null;
    }
  }, [config, addOptimisticUpdate, updateStatus, toast]);

  // Delete with optimistic update
  const remove = useCallback(async (id: string): Promise<boolean> => {
    addOptimisticUpdate(id, { id } as T);

    try {
      if (!connectionManager.current.isOnline() && config.enableOfflineSupport) {
        await storage.current.queueOperation({
          type: 'DELETE',
          table: config.table,
          data: { id },
        });

        toast({
          title: "Deleted offline",
          description: "Your changes will sync when you're back online.",
        });

        updateStatus(id, 'success');
        return true;
      }

      const { error } = await supabase
        .from(config.table as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      updateStatus(id, 'success');
      config.onSuccess?.();

      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      updateStatus(id, 'error');
      
      toast({
        title: "Failed to delete",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });

      config.onError?.(error as Error);
      return false;
    }
  }, [config, addOptimisticUpdate, updateStatus, toast]);

  return {
    insert,
    update,
    remove,
    optimisticUpdates: Array.from(optimisticUpdates.values()),
    hasOptimisticUpdates: optimisticUpdates.size > 0,
  };
}
