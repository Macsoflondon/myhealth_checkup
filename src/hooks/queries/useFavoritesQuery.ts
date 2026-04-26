/**
 * React Query hooks for Favorites API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { favoritesApi, type Favorite } from "@/api";
import { toast } from "@/components/ui/sonner";
import { logger } from "@/lib/logger";

export const favoritesQueryKeys = {
  all: ['favorites'] as const,
  user: (userId: string) => ['favorites', userId] as const,
  byTest: (userId: string, testId: string) => ['favorites', userId, testId] as const,
};

export function useFavoritesQuery() {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: favoritesQueryKeys.user(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await favoritesApi.getUserFavorites(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useAddFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      testId: string;
      provider: string;
      category: string;
      name?: string;
      price?: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      const { error } = await favoritesApi.addFavorite({
        user_id: user.id,
        test_id: params.testId,
        provider: params.provider,
        category: params.category,
        name: params.name,
        price: params.price,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.user(user?.id || '') });
      toast.success("Added to favorites");
    },
    onError: (error) => {
      logger.error('Error adding favorite:', error);
      toast.error('Failed to add favorite');
    },
  });
}

export function useRemoveFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { testId: string; category: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      const { error } = await favoritesApi.removeFavorite(
        user.id,
        params.testId,
        params.category
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.user(user?.id || '') });
      toast.success("Removed from favorites");
    },
    onError: (error) => {
      logger.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    },
  });
}

export function useIsFavorite(testId: string, category: string) {
  const { data: favorites = [] } = useFavoritesQuery();
  return favorites.some(f => f.test_id === testId && f.category === category);
}
