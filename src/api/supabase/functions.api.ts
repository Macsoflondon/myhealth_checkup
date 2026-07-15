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
  methodPreference?: string;
}

interface AiHumanContextRequest {
  query_text: string;
  age?: number | null;
  gender?: string | null;
  method_preference?: string | null;
}

export interface RecommendedTest {
  testName: string;
  provider: string;
  providerId: string;
  price: number | null;
  category: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  confidence: number;
  actualTestId?: string;
}

export interface AlternativeProvider {
  testName: string;
  suggestedProvider: string;
  disclaimer: string;
}

export interface HealthAIAnalysisResponse {
  medicalDisclaimer: string;
  analysis: string;
  hasRecommendations: boolean;
  recommendedTests: RecommendedTest[];
  generalGuidance: string;
  whenToSeeDoctor: string;
  alternativeProviders?: AlternativeProvider[];
}

export const healthAIAnalysis = (
  request: HealthAIAnalysisRequest
): Promise<FunctionResponse<HealthAIAnalysisResponse>> => {
  return invokeFunction<HealthAIAnalysisResponse, AiHumanContextRequest>(
    'ai-human-context',
    {
      body: {
        query_text: request.query,
        age: request.age ?? null,
        gender: request.gender ?? null,
        method_preference: request.methodPreference ?? null,
      },
    }
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

export interface TestRecommendationsResponse extends HealthAIAnalysisResponse {}

export const getTestRecommendations = (
  request: TestRecommendationsRequest
): Promise<FunctionResponse<TestRecommendationsResponse>> => {
  return invokeFunction<TestRecommendationsResponse, AiHumanContextRequest>(
    'ai-human-context',
    {
      body: {
        query_text: request.query,
        age: null,
        gender: null,
        method_preference: null,
      },
    }
  );
};
