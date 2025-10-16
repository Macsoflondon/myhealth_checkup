import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { User } from "@supabase/supabase-js";
import { favoritesApi } from "@/api";
import { logger } from "@/lib/logger";

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
        toast.success("Added to favorites");
      }
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };
  
  return { favorites, toggleFavorite };
}
