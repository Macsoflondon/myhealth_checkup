import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logApiError } from "@/services/errorLogger";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries - 1) {
        await new Promise((resolve) => 
          setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt))
        );
      }
    }
  }
  
  throw lastError;
}

export function useFavorites(user: User | null, category: string) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await withRetry(async () => {
        const response = await supabase
          .from('favorites')
          .select('test_id')
          .eq('user_id', user.id)
          .eq('category', category);
        
        if (response.error) throw response.error;
        return response.data;
      });
      
      setFavorites(result?.map(f => f.test_id) || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logApiError(error, 'favorites/fetch', { userId: user.id, category });
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, category]);
  
  useEffect(() => {
    if (user && category) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user, category, fetchFavorites]);
  
  const toggleFavorite = async (testId: string, item: any) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return false;
    }
    
    const isFavorite = favorites.includes(testId);
    
    // Optimistic update
    const previousFavorites = [...favorites];
    setFavorites(prev => 
      isFavorite ? prev.filter(id => id !== testId) : [...prev, testId]
    );
    
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('test_id', testId)
          .eq('category', category);
        
        if (error) throw error;
        toast.success("Removed from favorites");
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            test_id: testId,
            category: category,
            provider: item.provider,
            name: item.name,
            price: item.price,
          });
        
        if (error) throw error;
        toast.success("Added to favorites");
      }
      return true;
    } catch (err) {
      // Rollback on error
      setFavorites(previousFavorites);
      const error = err instanceof Error ? err : new Error(String(err));
      logApiError(error, 'favorites/toggle', { testId, action: isFavorite ? 'remove' : 'add' });
      toast.error("Failed to update favorites. Please try again.");
      return false;
    }
  };
  
  return { favorites, toggleFavorite, isLoading, error, refetch: fetchFavorites };
}