/**
 * Favorites-related type definitions
 * Centralized types for favorites and saved items
 */

export interface Favorite {
  id: string;
  user_id: string;
  test_id: string;
  provider: string;
  category: string;
  name?: string | null;
  price?: number | null;
  created_at: string;
}

export interface FavoriteWithDetails extends Favorite {
  test_name?: string;
  provider_name?: string;
  current_price?: number;
  url?: string;
}

export interface CreateFavoriteInput {
  test_id: string;
  provider: string;
  category: string;
  name?: string;
  price?: number;
}

export interface PriceAlertPreference {
  id: string;
  user_id: string;
  test_id: string;
  provider: string;
  threshold_percentage: number;
  enabled: boolean;
  last_alerted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePriceAlertInput {
  test_id: string;
  provider: string;
  threshold_percentage?: number;
}

export interface SavedComparison {
  id: string;
  user_id: string;
  comparison_name: string;
  test_ids: string[];
  category?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateSavedComparisonInput {
  comparison_name: string;
  test_ids: string[];
  category?: string;
  notes?: string;
}

export interface FavoriteAction {
  type: 'add' | 'remove';
  testId: string;
  provider: string;
  category: string;
  name?: string;
  price?: number;
}

export interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
}

export interface PriceAlertState {
  alerts: PriceAlertPreference[];
  isLoading: boolean;
  error: string | null;
}
