import React, { useState, useEffect } from 'react';
import type { User } from "@supabase/supabase-js";
import { Brain, Sparkles, Target, Clock, TrendingUp, AlertTriangle, Stethoscope, History, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { analytics } from '@/lib/analytics';
import ProviderTestCard from '@/components/providers/ProviderTestCard';
import { useResolvedRecommendations } from '@/hooks/queries/useResolvedRecommendations';



interface QueryHistoryItem {
  id?: string;
  query_text: string;
  age?: number | null;
  gender?: string | null;
  ai_response: AIAnalysisResult | null;
  created_at?: string;
}

interface RecommendationProps {
  testName: string;
  provider: string;
  providerId: string;
  price: number | null;
  reason: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  confidence: number;
  actualTestId?: string;
}

export interface AIAnalysisResult {
  medicalDisclaimer: string;
  analysis: string;
  recommendedTests: RecommendationProps[];
  generalGuidance: string;
  whenToSeeDoctor: string;
  hasRecommendations: boolean;
}

interface RecommendationEngineProps {
  surface?: 'homepage' | 'recommendations_page' | string;
  resultsOnly?: boolean;
  initialResult?: AIAnalysisResult | null;
}

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/** Results-only view \u2014 renders Wellness Analysis + Recommended Tests with total cost focal. */
export const RecommendationResults = ({ result }: { result: AIAnalysisResult }) => {
  const totalCost = result.recommendedTests.reduce(
    (sum, rec) => sum + (rec.price ?? 0),
    0
  );

  return (
    <div data-testid="ai-recommendation-results" className="space-y-6">
      {/* Total Expected Cost \u2014 focal point */}
      {result.recommendedTests.length > 0 && (
        <div className="text-center py-6 px-4 rounded-2xl border-2 border-[#22c0d4]/30 bg-gradient-to-br from-[#081129] to-[#0F2238]">
          <p
            className="text-sm uppercase tracking-widest text-[#22c0d4] mb-1"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
          >
            Total Expected Cost
          </p>
          <p
            className="text-5xl font-bold text-white"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            £{totalCost.toFixed(0)}
          </p>
          <p className="text-white/60 text-sm mt-1">
            {result.recommendedTests.length} test{result.recommendedTests.length !== 1 ? 's' : ''} recommended
          </p>
        </div>
      )}

      <Card className="p-6 border-[#22c0d4]/20 bg-[#081129]/[0.03]">
        <h2
          className="text-xl font-semibold flex items-center gap-2 mb-4 text-[#081129]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <Brain className="h-5 w-5 text-[#22c0d4]" />
          Wellness Analysis
        </h2>
        <p className="text-[#081129]/80 mb-4">{result.analysis}</p>

        {result.generalGuidance && (
          <div className="mt-4 p-4 bg-[#22c0d4]/10 border border-[#22c0d4]/20 rounded-lg">
            <h4 className="font-medium text-[#081129] mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              General Wellness Guidance:
            </h4>
            <p className="text-[#081129]/70 text-sm">{result.generalGuidance}</p>
          </div>
        )}
      </Card>

      <Alert className="border-red-200 bg-red-50">
        <Stethoscope className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>When to see a doctor:</strong> {result.whenToSeeDoctor}
        </AlertDescription>
      </Alert>

      {result.recommendedTests.length > 0 && (
        <div className="space-y-4">
          <h2
            className="text-xl font-semibold flex items-center gap-2 text-[#081129]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <TrendingUp className="h-5 w-5 text-[#22c0d4]" />
            Recommended Wellness Tests
          </h2>

          <ResolvedRecommendationList recs={result.recommendedTests} />
          <p className="text-xs text-[#081129]/60 italic">
            Tap any test card to view the full standardised details — biomarkers, collection method, turnaround and pricing — pulled directly from the provider.
          </p>
        </div>
      )}

      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          {result.medicalDisclaimer}
        </AlertDescription>
      </Alert>
    </div>
  );
};

const RecommendationEngine = ({ surface = 'recommendations_page', resultsOnly = false, initialResult = null }: RecommendationEngineProps) => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [methodPreference, setMethodPreference] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(initialResult);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);

  const showDemographics = symptoms.trim().length >= 3;

  useEffect(() => {
    if (resultsOnly) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadQueryHistory(user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadQueryHistory(session.user.id);
      } else {
        setQueryHistory([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [resultsOnly]);

  // Sync initialResult prop changes
  useEffect(() => {
    if (initialResult) setAnalysisResult(initialResult);
  }, [initialResult]);

  const loadQueryHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('health_queries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setQueryHistory(
        (data || []).map((row) => ({
          ...row,
          ai_response: row.ai_response as unknown as AIAnalysisResult | null,
        }))
      );
    } catch (error) {
      logger.error('Error loading query history:', error);
    }
  };

  const generateRecommendations = async () => {
    if (!symptoms.trim()) {
      toast.error('Please enter your symptoms or health goals');
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    const authenticated = !!user;
    const startedAt = performance.now();

    analytics.recommendationAttempt({
      surface,
      query_length: symptoms.trim().length,
      has_age: !!age,
      has_gender: !!gender,
      has_method_preference: !!methodPreference,
      authenticated,
    });

    try {
      const { data, error } = await supabase.functions.invoke('ai-human-context', {
        body: {
          query_text: symptoms,
          gender: gender || null,
          age: age ? parseInt(age) : null,
          method_preference: methodPreference || null,
        }
      });

      if (error) {
        throw error;
      }

      setAnalysisResult(data);
      analytics.recommendationSuccess({
        surface,
        latency_ms: Math.round(performance.now() - startedAt),
        recommendations_count: Array.isArray(data?.recommendedTests) ? data.recommendedTests.length : 0,
        authenticated,
      });
      if (user) {
        toast.success('Recommendation saved to your account');
        loadQueryHistory(user.id);
      }
    } catch (error) {
      const err = error as { message?: string; status?: number; context?: { status?: number } };
      const failureReason = err?.message || 'unknown_error';
      const statusCode = err?.status ?? err?.context?.status ?? null;

      logger.error('Error getting AI recommendations:', error);
      analytics.recommendationFailure({
        surface,
        latency_ms: Math.round(performance.now() - startedAt),
        failure_reason: failureReason.slice(0, 200),
        status_code: statusCode,
        authenticated,
      });
      toast.error('Unable to generate recommendations. Please try again.');
      setAnalysisResult({
        medicalDisclaimer: "This information is for educational purposes only and is not medical advice. Please consult your GP or healthcare professional regarding any health concerns or symptoms.",
        analysis: "Sorry, we couldn't analyse your request at the moment. Please try again or consult your healthcare professional.",
        recommendedTests: [],
        generalGuidance: "Please consult your healthcare professional for personalised health advice.",
        whenToSeeDoctor: "Seek immediate medical attention for urgent symptoms or persistent health concerns.",
        hasRecommendations: false
      });
    } finally {
      setIsLoading(false);
    }
  };


  const loadPreviousQuery = (query: QueryHistoryItem) => {
    setSymptoms(query.query_text);
    setAge(query.age?.toString() || '');
    setGender(query.gender || '');
    setAnalysisResult(query.ai_response);
    setShowHistory(false);
    toast.success('Previous query loaded');
  };

  // Results-only mode: skip the entire input form
  if (resultsOnly && analysisResult) {
    return (
      <div
        data-testid="ai-recommendation-engine"
        data-surface={surface}
        className="max-w-4xl mx-auto p-6 bg-background text-foreground rounded-2xl"
      >
        <RecommendationResults result={analysisResult} />
      </div>
    );
  }

  if (resultsOnly) return null;

  return (
    <div
      data-testid="ai-recommendation-engine"
      data-surface={surface}
      className="max-w-4xl mx-auto p-6 bg-background text-foreground rounded-2xl"
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">AI Wellness Recommendations</h2>
        </div>
        <p className="text-muted-foreground">
          Get personalised wellness test recommendations from our trusted providers
        </p>
      </div>

      {user && (
        <Alert className="mb-6 border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong>Your data is protected:</strong> All health queries are securely stored and encrypted. 
            Only you can access your data. You can delete your queries anytime.
          </AlertDescription>
        </Alert>
      )}

      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important:</strong> This tool provides general wellness information only and is not medical advice. 
          Always consult your GP or healthcare professional regarding any health concerns or symptoms.
        </AlertDescription>
      </Alert>

      {!user && (
        <Alert className="mb-6 border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground">
            <strong>Sign in to save your recommendations:</strong> Create an account to securely store 
            your health queries and access them anytime. <a href="/auth" className="underline font-medium text-primary hover:text-primary/80">Sign in now</a>
          </AlertDescription>
        </Alert>
      )}

      {user && queryHistory.length > 0 && (
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Your Recent Queries
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide' : 'Show'}
            </Button>
          </div>
          {showHistory && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {queryHistory.map((query) => (
                <Button
                  key={query.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => loadPreviousQuery(query)}
                >
                  <div className="space-y-1 w-full">
                    <p className="text-sm font-medium line-clamp-1">{query.query_text}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(query.created_at).toLocaleDateString()} • 
                      {query.age && ` Age: ${query.age}`}
                      {query.gender && ` • ${query.gender}`}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Tell us about your wellness goals
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Wellness Goals or General Health Interests
          </label>
          <textarea 
            className="w-full p-3 border rounded-md h-24 resize-none" 
            placeholder="Describe your wellness goals or general health interests (e.g., energy levels, preventive screening, fitness optimization, general wellness check)..." 
            value={symptoms} 
            onChange={e => setSymptoms(e.target.value)} 
          />
          <p className="text-xs text-muted-foreground mt-1">
            Note: For specific symptoms or medical concerns, please consult your healthcare professional directly.
          </p>
        </div>

        {showDemographics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <Input type="number" placeholder="Enter your age" value={age} onChange={e => setAge(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select className="w-full p-2 border rounded-md" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Collection Preference</label>
              <select className="w-full p-2 border rounded-md" value={methodPreference} onChange={e => setMethodPreference(e.target.value)}>
                <option value="">No preference</option>
                <option value="home">At-home kit</option>
                <option value="clinic">Clinic visit</option>
                <option value="either">Either</option>
              </select>
            </div>
          </div>
        )}

        <Button onClick={generateRecommendations} disabled={isLoading || !symptoms.trim()} className="w-full">
          {isLoading ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Analyzing your wellness needs...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Get Wellness Recommendations
            </>
          )}
        </Button>
      </Card>

      {analysisResult && <RecommendationResults result={analysisResult} />}
    </div>
  );
};

export default RecommendationEngine;
