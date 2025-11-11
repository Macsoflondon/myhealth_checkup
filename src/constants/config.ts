/**
 * Application configuration constants
 * Single source of truth for all magic numbers and strings
 */

export const CACHE_CONFIG = {
  DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 100,
} as const;

export const MAP_CONFIG = {
  DEFAULT_CENTER: [51.5074, -0.1278] as [number, number], // London
  DEFAULT_ZOOM: 10,
  MAX_ZOOM: 18,
  MIN_ZOOM: 6,
} as const;

export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 50,
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;

export const DISTANCE_CONFIG = {
  EARTH_RADIUS_MILES: 3959,
  EARTH_RADIUS_KM: 6371,
  DEFAULT_RADIUS_MILES: 25,
  RADIUS_OPTIONS: [5, 10, 25, 50] as const,
} as const;

export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const REALTIME_CONFIG = {
  RECONNECT_DELAY: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
  HEARTBEAT_INTERVAL: 30000,
} as const;
