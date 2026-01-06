/**
 * Custom hook for Dashboard data fetching
 * Centralises all dashboard-related data operations with React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { favoritesApi, ordersApi, savedProvidersApi } from "@/api";
import { UserPreferencesService } from "@/services/UserPreferencesService";
import { toast } from "@/components/ui/sonner";
import { logger } from "@/lib/logger";
import type { Favorite, Order, SavedProvider } from "@/api";

// Query keys for cache invalidation
export const dashboardQueryKeys = {
  favorites: (userId: string) => ['dashboard', 'favorites', userId] as const,
  orders: (userId: string) => ['dashboard', 'orders', userId] as const,
  savedProviders: (userId: string) => ['dashboard', 'savedProviders', userId] as const,
};

// Helper to apply saved order from localStorage
function applyStoredOrder<T extends { id: string }>(
  items: T[],
  storedOrderIds: string[]
): T[] {
  if (!storedOrderIds.length) return items;
  
  const orderedItems = storedOrderIds
    .map(id => items.find(item => item.id === id))
    .filter(Boolean) as T[];
  
  const remainingItems = items.filter(
    item => !storedOrderIds.includes(item.id)
  );
  
  return [...orderedItems, ...remainingItems];
}

export function useDashboardData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Favorites query
  const favoritesQuery = useQuery({
    queryKey: dashboardQueryKeys.favorites(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await favoritesApi.getUserFavorites(userId);
      if (error) throw error;
      
      const storedOrder = UserPreferencesService.getFavoriteOrder(userId);
      return applyStoredOrder(data || [], storedOrder);
    },
    enabled: !!userId,
  });

  // Orders query
  const ordersQuery = useQuery({
    queryKey: dashboardQueryKeys.orders(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await ordersApi.getUserOrders(userId);
      if (error) throw error;
      
      const storedOrder = UserPreferencesService.getOrderSort(userId);
      return applyStoredOrder(data || [], storedOrder);
    },
    enabled: !!userId,
  });

  // Saved providers query
  const savedProvidersQuery = useQuery({
    queryKey: dashboardQueryKeys.savedProviders(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await savedProvidersApi.getUserSavedProviders(userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (favorite: Favorite) => {
      if (!userId) throw new Error('User not authenticated');
      const { error } = await favoritesApi.removeFavorite(
        userId,
        favorite.test_id,
        favorite.category
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.favorites(userId || '') });
      toast.success("Removed from favorites");
    },
    onError: (error) => {
      logger.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    },
  });

  // Remove saved provider mutation
  const removeSavedProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      if (!userId) throw new Error('User not authenticated');
      const { error } = await savedProvidersApi.removeSavedProvider(userId, providerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.savedProviders(userId || '') });
      toast.success("Removed from saved providers");
    },
    onError: (error) => {
      logger.error('Error removing saved provider:', error);
      toast.error('Failed to remove provider');
    },
  });

  // Reorder favorites (with localStorage persistence)
  const reorderFavorites = (reorderedFavorites: Favorite[]) => {
    if (!userId) return;
    
    // Update cache optimistically
    queryClient.setQueryData(
      dashboardQueryKeys.favorites(userId),
      reorderedFavorites
    );
    
    // Persist order to localStorage
    UserPreferencesService.setFavoriteOrder(
      userId,
      reorderedFavorites.map(f => f.id)
    );
  };

  // Reorder orders (with localStorage persistence)
  const reorderOrders = (reorderedOrders: Order[]) => {
    if (!userId) return;
    
    queryClient.setQueryData(
      dashboardQueryKeys.orders(userId),
      reorderedOrders
    );
    
    UserPreferencesService.setOrderSort(
      userId,
      reorderedOrders.map(o => o.id)
    );
  };

  return {
    // Data
    favorites: favoritesQuery.data || [],
    orders: ordersQuery.data || [],
    savedProviders: savedProvidersQuery.data || [],
    
    // Loading states
    isLoading: favoritesQuery.isLoading || ordersQuery.isLoading || savedProvidersQuery.isLoading,
    isFavoritesLoading: favoritesQuery.isLoading,
    isOrdersLoading: ordersQuery.isLoading,
    isSavedProvidersLoading: savedProvidersQuery.isLoading,
    
    // Error states
    favoritesError: favoritesQuery.error,
    ordersError: ordersQuery.error,
    savedProvidersError: savedProvidersQuery.error,
    
    // Mutations
    removeFavorite: (favorite: Favorite) => removeFavoriteMutation.mutate(favorite),
    removeSavedProvider: (providerId: string) => removeSavedProviderMutation.mutate(providerId),
    
    // Reorder functions
    reorderFavorites,
    reorderOrders,
    
    // Refetch
    refetchAll: () => {
      favoritesQuery.refetch();
      ordersQuery.refetch();
      savedProvidersQuery.refetch();
    },
  };
}
