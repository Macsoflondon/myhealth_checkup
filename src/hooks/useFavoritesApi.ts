import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { User } from "@supabase/supabase-js";
import { favoritesApi } from "@/api";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

/**
 * Unified favorites hook with price alert creation
 * This is the single source of truth for favorites functionality
 */
export function useFavoritesApi(user: User | null, category: string) {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    if (user && category) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user, category]);
  
  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await favoritesApi.getFavoriteTestIds(user.id, category);
      
      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      logger.error('Error fetching favorites:', error);
    }
  };
  
  const toggleFavorite = async (testId: string, item: any) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return false;
    }
    
    const isFavorite = favorites.includes(testId);
    
    try {
      if (isFavorite) {
        const { error } = await favoritesApi.removeFavorite(user.id, testId, category);
        
        if (error) throw error;
        setFavorites(prev => prev.filter(id => id !== testId));
        toast.success("Removed from favorites");
      } else {
        const { error } = await favoritesApi.addFavorite({
          user_id: user.id,
          test_id: testId,
          category: category,
          provider: item.provider,
          name: item.name,
          price: item.price,
        });
        
        if (error) throw error;
        setFavorites(prev => [...prev, testId]);
        
        // Automatically create a price alert with 10% threshold
        try {
          await supabase
            .from('price_alert_preferences')
            .insert({
              user_id: user.id,
              test_id: testId,
              provider: item.provider,
              threshold_percentage: 10,
              enabled: true,
            });
        } catch (alertError) {
          // Ignore if alert already exists (unique constraint)
          logger.debug('Price alert creation skipped:', alertError);
        }
        
        toast.success("Added to favorites with price alert enabled");
      }
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };
  
  return { favorites, toggleFavorite };
}

// Re-export as useFavorites for backward compatibility
export const useFavorites = useFavoritesApi;
