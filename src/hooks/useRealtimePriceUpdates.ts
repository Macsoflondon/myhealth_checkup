
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PriceUpdate {
  test_id: string;
  provider: string;
  price: number;
  available: boolean;
}

export function useRealtimePriceUpdates(isRealtime: boolean) {
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([]);
  
  useEffect(() => {
    if (!isRealtime) return;
    
    // Fetch initial price updates
    const fetchPriceUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from("provider_price_updates")
          .select("*");
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPriceUpdates(data as PriceUpdate[]);
        }
      } catch (error) {
        console.error("Error fetching price updates:", error);
      }
    };
    
    fetchPriceUpdates();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('price-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'provider_price_updates'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setPriceUpdates(prev => {
              // Remove any existing update for this test/provider
              const filtered = prev.filter(
                p => !(p.test_id === payload.new.test_id && p.provider === payload.new.provider)
              );
              // Add the new update and ensure it conforms to PriceUpdate type
              return [...filtered, {
                test_id: payload.new.test_id,
                provider: payload.new.provider,
                price: payload.new.price,
                available: payload.new.available
              }];
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isRealtime]);
  
  return priceUpdates;
}
