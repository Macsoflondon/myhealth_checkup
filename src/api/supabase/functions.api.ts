/**
 * Edge Functions API wrapper
 * Centralizes all Supabase Edge Function calls with consistent error handling
 */

import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export interface FunctionInvokeOptions<T = unknown> {
  body?: T;
  headers?: Record<string, string>;
}

export interface FunctionResponse<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Generic edge function invoker with error handling and logging
 */
async function invokeFunction<TResponse, TBody = unknown>(
  functionName: string,
  options?: FunctionInvokeOptions<TBody>
): Promise<FunctionResponse<TResponse>> {
  try {
    logger.debug(`Invoking edge function: ${functionName}`, options?.body);
    
    const { data, error } = await supabase.functions.invoke<TResponse>(
      functionName,
      options
    );
    
    if (error) {
      logger.error(`Edge function ${functionName} error:`, error);
      return { data: null, error };
    }
    
    logger.debug(`Edge function ${functionName} success`);
    return { data, error: null };
  } catch (error) {
    logger.error(`Edge function ${functionName} exception:`, error);
    return { data: null, error: error as Error };
  }
}

// ============================================================================
// AI Analysis Functions
// ============================================================================

export interface HealthAIAnalysisRequest {
  query: string;
  age?: number;
  gender?: string;
}

export interface RecommendedTest {
  testName: string;
  category: string;
  reason: string;
}

export interface AlternativeProvider {
  testName: string;
  suggestedProvider: string;
  disclaimer: string;
}

export interface HealthAIAnalysisResponse {
  analysis: string;
  hasRecommendations: boolean;
  recommendedTests?: RecommendedTest[];
  alternativeProviders?: AlternativeProvider[];
}

export const healthAIAnalysis = (
  request: HealthAIAnalysisRequest
): Promise<FunctionResponse<HealthAIAnalysisResponse>> => {
  return invokeFunction<HealthAIAnalysisResponse, HealthAIAnalysisRequest>(
    'health-ai-analysis',
    { body: request }
  );
};

// ============================================================================
// Test Recommendations Functions
// ============================================================================

export interface TestRecommendationsRequest {
  query: string;
  preferences?: {
    priceWeight?: number;
    speedWeight?: number;
    comprehensivenessWeight?: number;
  };
}

export interface TestRecommendationsResponse {
  recommendations: Array<{
    testId: string;
    testName: string;
    score: number;
    reason: string;
  }>;
}

export const getTestRecommendations = (
  request: TestRecommendationsRequest
): Promise<FunctionResponse<TestRecommendationsResponse>> => {
  return invokeFunction<TestRecommendationsResponse, TestRecommendationsRequest>(
    'test-recommendations',
    { body: request }
  );
};

// ============================================================================
// Sports Test Recommendations Functions
// ============================================================================

export interface SportsRecommendationsRequest {
  sport: string;
  goals?: string[];
  fitnessLevel?: string;
}

export interface SportsRecommendationsResponse {
  recommendations: Array<{
    testId: string;
    testName: string;
    relevance: string;
    priority: 'essential' | 'recommended' | 'optional';
  }>;
}

export const getSportsRecommendations = (
  request: SportsRecommendationsRequest
): Promise<FunctionResponse<SportsRecommendationsResponse>> => {
  return invokeFunction<SportsRecommendationsResponse, SportsRecommendationsRequest>(
    'sports-test-recommendations',
    { body: request }
  );
};

// ============================================================================
// Price Updates Functions
// ============================================================================

export interface PriceUpdatesRequest {
  testId?: string;
  provider?: string;
}

export interface PriceUpdatesResponse {
  updates: Array<{
    testId: string;
    provider: string;
    price: number;
    previousPrice?: number;
    updatedAt: string;
  }>;
}

export const getPriceUpdates = (
  request?: PriceUpdatesRequest
): Promise<FunctionResponse<PriceUpdatesResponse>> => {
  return invokeFunction<PriceUpdatesResponse, PriceUpdatesRequest>(
    'price-updates',
    request ? { body: request } : undefined
  );
};

// ============================================================================
// Price Alert Checker Functions
// ============================================================================

export interface PriceAlertCheckRequest {
  userId: string;
}

export interface PriceAlertCheckResponse {
  alerts: Array<{
    testId: string;
    provider: string;
    currentPrice: number;
    thresholdPrice: number;
  }>;
}

export const checkPriceAlerts = (
  request: PriceAlertCheckRequest
): Promise<FunctionResponse<PriceAlertCheckResponse>> => {
  return invokeFunction<PriceAlertCheckResponse, PriceAlertCheckRequest>(
    'price-alert-checker',
    { body: request }
  );
};

// ============================================================================
// Test Mapper Functions
// ============================================================================

export interface AITestMapperRequest {
  testName: string;
  provider: string;
  biomarkers?: string[];
}

export interface AITestMapperResponse {
  mappedTestId: string | null;
  confidence: number;
  suggestions?: string[];
}

export const mapTestWithAI = (
  request: AITestMapperRequest
): Promise<FunctionResponse<AITestMapperResponse>> => {
  return invokeFunction<AITestMapperResponse, AITestMapperRequest>(
    'ai-test-mapper',
    { body: request }
  );
};

// ============================================================================
// Notification Functions
// ============================================================================

export interface SendNotificationRequest {
  userId: string;
  type: 'email' | 'sms' | 'push';
  subject?: string;
  message: string;
  category: string;
}

export interface SendNotificationResponse {
  success: boolean;
  notificationId?: string;
}

export const sendNotification = (
  request: SendNotificationRequest
): Promise<FunctionResponse<SendNotificationResponse>> => {
  return invokeFunction<SendNotificationResponse, SendNotificationRequest>(
    'send-test-notification',
    { body: request }
  );
};

// ============================================================================
// Geocoding Functions
// ============================================================================

export interface GeocodeClinicRequest {
  address: string;
  postalCode?: string;
}

export interface GeocodeClinicResponse {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export const geocodeClinic = (
  request: GeocodeClinicRequest
): Promise<FunctionResponse<GeocodeClinicResponse>> => {
  return invokeFunction<GeocodeClinicResponse, GeocodeClinicRequest>(
    'geocode-clinic',
    { body: request }
  );
};

// ============================================================================
// LML Nearest Clinic Functions
// ============================================================================

export interface LMLNearestRequest {
  latitude: number;
  longitude: number;
  maxDistance?: number;
}

export interface LMLNearestResponse {
  clinics: Array<{
    id: string;
    name: string;
    distance: number;
    address: string;
  }>;
}

export const findNearestLMLClinics = (
  request: LMLNearestRequest
): Promise<FunctionResponse<LMLNearestResponse>> => {
  return invokeFunction<LMLNearestResponse, LMLNearestRequest>(
    'lml-nearest',
    { body: request }
  );
};

// ============================================================================
// Export all functions
// ============================================================================

export const functionsApi = {
  // AI Functions
  healthAIAnalysis,
  getTestRecommendations,
  getSportsRecommendations,
  mapTestWithAI,
  
  // Price Functions
  getPriceUpdates,
  checkPriceAlerts,
  
  // Notification Functions
  sendNotification,
  
  // Location Functions
  geocodeClinic,
  findNearestLMLClinics,
};
