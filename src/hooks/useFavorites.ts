
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { User } from "@supabase/supabase-js";

export function useFavorites(user: User | null, category: string) {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    // Fetch favorites for the currently logged-in user
    const fetchFavorites = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("test_id")
          .eq("category", category)
          // Only fetch favorites belonging to the current user
          .eq("user_id", user.id);
          
        if (error) throw error;
        setFavorites(data.map(f => f.test_id));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    
    fetchFavorites();
  }, [user, category]);
  
  const toggleFavorite = async (testId: string, item: any) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return false;
    }
    
    const isFavorite = favorites.includes(testId);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("test_id", testId)
          .eq("user_id", user.id);
          
        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== testId));
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            test_id: testId,
            category: item.category,
            provider: item.provider
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
