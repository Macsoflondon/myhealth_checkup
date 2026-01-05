import { useState, useEffect } from "react";

export interface PriceUpdate {
  test_id: string;
  provider: string;
  price: number;
  available: boolean;
}

export function useRealtimePriceUpdates(isRealtime: boolean) {
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  useEffect(() => {
    // Mock implementation - return empty array until database is set up
    setPriceUpdates([]);
    setLastUpdate(null);
  }, [isRealtime]);
  
  return { priceUpdates, lastUpdate };
}