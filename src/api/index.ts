/**
 * Centralized API exports
 * 
 * Import APIs like this:
 * import { testsApi, favoritesApi, ordersApi } from '@/api';
 */

export { testsApi } from './supabase/tests.api';
export { favoritesApi } from './supabase/favorites.api';
export { ordersApi } from './supabase/orders.api';
export { providersApi } from './supabase/providers.api';
export { clinicsApi } from './supabase/clinics.api';
export { usersApi } from './supabase/users.api';
export { healthDataApi } from './supabase/healthData.api';
export { preferencesApi } from './supabase/preferences.api';

export type { Test, ProviderTest } from './supabase/tests.api';
export type { Favorite } from './supabase/favorites.api';
export type { Order } from './supabase/orders.api';
export type { ProviderTestData, PriceUpdate } from './supabase/providers.api';
export type { Clinic } from './supabase/clinics.api';
export type { UserProfile, UserPreferences } from './supabase/users.api';
export type { UploadedTestResult, BiomarkerReading, UserHealthData, HealthScore } from './supabase/healthData.api';
export type { RecommendationPreferences, EmailNotificationPreferences, SmsNotificationPreferences } from './supabase/preferences.api';
export type { ApiResponse, PaginationParams, FilterParams } from './supabase/base';
