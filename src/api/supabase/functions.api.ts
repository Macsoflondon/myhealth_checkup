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
    'ai-human-context',
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
    'ai-human-context',
    { body: request }
  );
};
