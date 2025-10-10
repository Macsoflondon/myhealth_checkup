import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export function useFavorites(user: User | null, category: string) {
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
      const { data, error } = await supabase
        .from('favorites')
        .select('test_id')
        .eq('user_id', user.id)
        .eq('category', category);
      
      if (error) throw error;
      setFavorites(data?.map(f => f.test_id) || []);
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
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('test_id', testId)
          .eq('category', category);
        
        if (error) throw error;
        setFavorites(prev => prev.filter(id => id !== testId));
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