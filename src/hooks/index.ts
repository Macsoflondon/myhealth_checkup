// Barrel export for custom hooks

// Core hooks
export { useFavorites, useFavoritesApi } from "./useFavoritesApi";
export { useOrders } from "./useOrders";
export { useClinicsData } from "./useClinicsData";
export { useGeocoding } from "./useGeocoding";
export { useUserLocation } from "./useUserLocation";
export { useNavigationData } from "./useNavigationData";
export { useDraggable } from "./useDraggable";

// Realtime hooks
export { useRealtimeSync } from "./useRealtimeSync";
export { useRealtimeConnection } from "./useRealtimeConnection";
export { useRealtimeEvents } from "./useRealtimeEvents";
export { useRealtimePriceUpdates } from "./useRealtimePriceUpdates";
export { useCategoryRealtimeStatus } from "./useCategoryRealtimeStatus";

// Offline hooks
export { useOfflineQueue } from "./useOfflineQueue";
export { useOfflineSync } from "./useOfflineSync";

// Performance hooks
export { usePerformanceOptimization } from "./usePerformanceOptimization";
export { useMobileOptimization } from "./useMobileOptimization";
export { useOptimizedImage } from "./useOptimizedImage";
export { useFastImageOptimization } from "./useFastImageOptimization";
export { useOptimisticUpdate } from "./useOptimisticUpdate";

// UI hooks
export { useIsMobile } from "./use-mobile";
export { useToast } from "./use-toast";
export { useScrollDirection } from "./useScrollDirection";
export { useRipple } from "./useRipple";

// Data sync hooks
export { useBloodTestsSync } from "./useBloodTestsSync";
export { useCancerScreeningSync } from "./useCancerScreeningSync";
export { useClinicTests } from "./useClinicTests";
export { useProviderTestCounts } from "./useProviderTestCounts";
export { useSavedProviders } from "./useSavedProviders";
export { useUserRole } from "./useUserRole";
export { useEnhancedComparison } from "./useEnhancedComparison";

// React Query hooks (from queries folder)
export { useDashboardData, dashboardQueryKeys } from "./queries/useDashboardData";
export { useCompareTestsData, compareQueryKeys, defaultFilters, type CompareFilters } from "./queries/useCompareTestsData";
export { useFavoritesQuery, useAddFavorite, useRemoveFavorite, useIsFavorite, favoritesQueryKeys } from "./queries/useFavoritesQuery";
export { useOrdersQuery, useCreateOrder, useUpdateOrderStatus, ordersQueryKeys } from "./queries/useOrdersQuery";
export { useProviderTestsQuery, useProviderCatalogQuery, providersQueryKeys } from "./queries/useProvidersQuery";
export { useActiveTestsQuery, useTestsByCategoryQuery, useSearchTestsQuery, usePopularTestsQuery, testsQueryKeys } from "./queries/useTestsQuery";
export { useClinicsQuery } from "./queries/useClinicsQuery";
