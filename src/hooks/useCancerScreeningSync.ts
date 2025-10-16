import { useCallback, useEffect, useState } from 'react';
import { useRealtimeSync } from './useRealtimeSync';
import { useToast } from './use-toast';

interface CancerScreening {
  id: string;
  test_name: string;
  category: string;
  price: number;
  provider_id: string;
  description?: string;
  is_active: boolean;
  updated_at: string;
}

export function useCancerScreeningSync() {
  const { toast } = useToast();
  const [screenings, setScreenings] = useState<CancerScreening[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleInsert = useCallback((record: CancerScreening) => {
    setScreenings(prev => {
      const exists = prev.find(s => s.id === record.id);
      if (exists) return prev;
      return [...prev, record];
    });
    
    if (!isInitialLoad) {
      toast({
        title: "New screening available",
        description: `${record.test_name} has been added`,
      });
    }
  }, [toast, isInitialLoad]);

  const handleUpdate = useCallback((record: CancerScreening) => {
    setScreenings(prev => {
      const index = prev.findIndex(s => s.id === record.id);
      if (index === -1) return [...prev, record];
      
      const updated = [...prev];
      updated[index] = record;
      return updated;
    });
    
    if (!isInitialLoad) {
      toast({
        title: "Screening updated",
        description: `${record.test_name} information has been updated`,
      });
    }
  }, [toast, isInitialLoad]);

  const handleDelete = useCallback((record: CancerScreening) => {
    setScreenings(prev => prev.filter(s => s.id !== record.id));
    
    if (!isInitialLoad) {
      toast({
        title: "Screening removed",
        description: `${record.test_name} is no longer available`,
        variant: "destructive",
      });
    }
  }, [toast, isInitialLoad]);

  const handleError = useCallback((error: Error) => {
    console.error('Cancer screening sync error:', error);
    toast({
      title: "Sync error",
      description: "Failed to sync screening data. Please refresh the page.",
      variant: "destructive",
    });
  }, [toast]);

  const { status, isConnected, isSyncing } = useRealtimeSync<CancerScreening>({
    table: 'provider_tests',
    filter: 'category=eq.Cancer Screening',
    event: '*',
    onInsert: handleInsert,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onError: handleError,
    enableOfflineQueue: true,
    conflictResolution: 'server-wins',
  });

  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  // Show connection status with more details for critical cancer screenings
  useEffect(() => {
    if (status.connected && !isInitialLoad) {
      toast({
        title: "Connected",
        description: "Real-time cancer screening updates enabled",
      });
    } else if (!status.connected && !isInitialLoad) {
      toast({
        title: "Offline mode",
        description: "Screening data will sync when connection is restored.",
        variant: "destructive",
      });
    }
  }, [status.connected, toast, isInitialLoad]);

  return {
    screenings,
    isConnected,
    isSyncing,
    status,
    queuedUpdates: status.queuedUpdates,
  };
}
