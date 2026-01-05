import { useCallback, useEffect, useState } from 'react';
import { useRealtimeSync } from './useRealtimeSync';
import { useToast } from './use-toast';

interface BloodTest {
  id: string;
  test_name: string;
  category: string;
  price: number;
  provider_id: string;
  is_active: boolean;
  updated_at: string;
}

export function useBloodTestsSync(providerId?: string) {
  const { toast } = useToast();
  const [tests, setTests] = useState<BloodTest[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleInsert = useCallback((record: BloodTest) => {
    setTests(prev => {
      const exists = prev.find(t => t.id === record.id);
      if (exists) return prev;
      return [...prev, record];
    });
    
    if (!isInitialLoad) {
      toast({
        title: "New test available",
        description: `${record.test_name} has been added`,
      });
    }
  }, [toast, isInitialLoad]);

  const handleUpdate = useCallback((record: BloodTest) => {
    setTests(prev => {
      const index = prev.findIndex(t => t.id === record.id);
      if (index === -1) return [...prev, record];
      
      const updated = [...prev];
      updated[index] = record;
      return updated;
    });
    
    if (!isInitialLoad) {
      toast({
        title: "Test updated",
        description: `${record.test_name} information has been updated`,
      });
    }
  }, [toast, isInitialLoad]);

  const handleDelete = useCallback((record: BloodTest) => {
    setTests(prev => prev.filter(t => t.id !== record.id));
    
    if (!isInitialLoad) {
      toast({
        title: "Test removed",
        description: `${record.test_name} is no longer available`,
        variant: "destructive",
      });
    }
  }, [toast, isInitialLoad]);

  const handleError = useCallback((error: Error) => {
    console.error('Blood tests sync error:', error);
    toast({
      title: "Sync error",
      description: "Failed to sync test data. Please refresh the page.",
      variant: "destructive",
    });
  }, [toast]);

  const { status, isConnected, isSyncing } = useRealtimeSync<BloodTest>({
    table: 'provider_tests',
    filter: providerId ? `provider_id=eq.${providerId}` : undefined,
    event: '*',
    onInsert: handleInsert,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onError: handleError,
    enableOfflineQueue: true,
    conflictResolution: 'last-write-wins',
  });

  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  // Show connection status changes
  useEffect(() => {
    if (status.connected && !isInitialLoad) {
      toast({
        title: "Connected",
        description: "Real-time updates enabled",
      });
    } else if (!status.connected && !isInitialLoad) {
      toast({
        title: "Offline mode",
        description: "Working offline. Changes will sync when online.",
      });
    }
  }, [status.connected, toast, isInitialLoad]);

  return {
    tests,
    isConnected,
    isSyncing,
    status,
    queuedUpdates: status.queuedUpdates,
  };
}
