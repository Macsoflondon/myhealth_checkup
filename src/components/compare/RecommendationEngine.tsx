import React, { useState, useEffect, useCallback } from "react";
import { CompareTestData } from "@/services/CompareService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Sparkles, 
  Loader2, 
  PoundSterling, 
  Clock, 
  Beaker,
  TrendingUp,
  AlertCircle,
  Save,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { preferencesApi, RecommendationPreferences } from "@/api/supabase/preferences.api";

interface RecommendationEngineProps {
  tests: CompareTestData[];
  onRecommendationGenerated?: (testId: string) => void;
}

interface Preferences {
  price: number;
  speed: number;
  comprehensiveness: number;
}

interface RecommendationResult {
  recommendation: string;
  topChoice: {
    testId: string;
    testName: string;
    score: number;
  };
  allScores: Array<{
    testId: string;
    testName: string;
    score: number;
  }>;
}

export const RecommendationEngine = ({ 
  tests,
  onRecommendationGenerated 
}: RecommendationEngineProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>({
    price: 3,
    speed: 3,
    comprehensiveness: 3
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferencesChanged, setPreferencesChanged] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [saveTimeoutId, setSaveTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Load saved preferences when component mounts
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutId) {
        clearTimeout(saveTimeoutId);
      }
    };
  }, [saveTimeoutId]);

  const loadPreferences = async () => {
    if (!user) return;
    
    setIsLoadingPreferences(true);
    try {
      const savedPrefs = await preferencesApi.getRecommendationPreferences(user.id);
      if (savedPrefs) {
        setPreferences(savedPrefs);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setIsLoadingPreferences(false);
    }
  };

  const savePreferences = async (newPreferences: Preferences) => {
    if (!user) return;
    
    setIsSavingPreferences(true);
    try {
      const result = await preferencesApi.saveRecommendationPreferences(user.id, newPreferences);
      
      if (result.success) {
        setPreferencesChanged(false);
        toast({
          title: "Preferences Saved",
          description: "Your recommendation preferences have been saved.",
        });
      } else {
        toast({
          title: "Save Failed",
          description: result.error || "Failed to save preferences.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving preferences.",
        variant: "destructive"
      });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  // Debounced auto-save when preferences change
  const debouncedSave = useCallback((newPreferences: Preferences) => {
    if (!user) return;

    // Clear existing timeout
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
    }

    // Set new timeout for auto-save after 2 seconds of inactivity
    const timeoutId = setTimeout(() => {
      savePreferences(newPreferences);
    }, 2000);

    setSaveTimeoutId(timeoutId);
  }, [user, saveTimeoutId]);

  const handlePreferenceChange = (key: keyof Preferences, value: number[]) => {
    const newPreferences = { ...preferences, [key]: value[0] };
    setPreferences(newPreferences);
    setPreferencesChanged(true);
    
    // Auto-save for logged-in users
    if (user) {
      debouncedSave(newPreferences);
    }
  };

  const handleManualSave = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save your preferences.",
        variant: "destructive"
      });
      return;
    }
    
    // Clear debounce timeout and save immediately
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
      setSaveTimeoutId(null);
    }
    
    savePreferences(preferences);
  };

  const generateRecommendation = async () => {
    setIsGenerating(true);
    setRecommendation(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            tests,
            preferences
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive"
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Credits Exhausted",
            description: "AI credits have been exhausted. Please contact support.",
            variant: "destructive"
          });
          return;
        }
        throw new Error("Failed to generate recommendation");
      }

      const data = await response.json();
      setRecommendation(data);
      
      if (onRecommendationGenerated && data.topChoice) {
        onRecommendationGenerated(data.topChoice.testId);
      }

      toast({
        title: "Recommendation Generated",
        description: "AI has analyzed your preferences and suggested the best test.",
      });
    } catch (error) {
      console.error("Error generating recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to generate recommendation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getPreferenceLabel = (value: number) => {
    if (value === 1) return "Not Important";
    if (value === 2) return "Slightly Important";
    if (value === 3) return "Moderately Important";
    if (value === 4) return "Very Important";
    return "Extremely Important";
  };

  const getTopTest = () => {
    if (!recommendation) return null;
    return tests.find(t => t.id === recommendation.topChoice.testId);
  };

  const topTest = getTopTest();

  return (
    <div className="space-y-6">
      {/* Preferences Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered Recommendation
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Set your priorities and let AI suggest the best test for you
              </p>
            </div>
            
            {user && (
              <div className="flex items-center gap-2">
                {isLoadingPreferences && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading...
                  </div>
                )}
                
                {isSavingPreferences && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </div>
                )}
                
                {!isSavingPreferences && !isLoadingPreferences && !preferencesChanged && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Check className="h-3 w-3" />
                    Saved
                  </div>
                )}
                
                {preferencesChanged && !isSavingPreferences && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManualSave}
                    className="gap-1 h-7 text-xs"
                  >
                    <Save className="h-3 w-3" />
                    Save
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Preference */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <PoundSterling className="h-4 w-4 text-muted-foreground" />
                Price Importance
              </Label>
              <Badge variant="secondary" className="text-xs">
                {getPreferenceLabel(preferences.price)}
              </Badge>
            </div>
            <Slider
              value={[preferences.price]}
              onValueChange={(value) => handlePreferenceChange('price', value)}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not Important</span>
              <span>Extremely Important</span>
            </div>
          </div>

          {/* Speed Preference */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Speed Importance
              </Label>
              <Badge variant="secondary" className="text-xs">
                {getPreferenceLabel(preferences.speed)}
              </Badge>
            </div>
            <Slider
              value={[preferences.speed]}
              onValueChange={(value) => handlePreferenceChange('speed', value)}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not Important</span>
              <span>Extremely Important</span>
            </div>
          </div>

          {/* Comprehensiveness Preference */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Beaker className="h-4 w-4 text-muted-foreground" />
                Comprehensiveness Importance
              </Label>
              <Badge variant="secondary" className="text-xs">
                {getPreferenceLabel(preferences.comprehensiveness)}
              </Badge>
            </div>
            <Slider
              value={[preferences.comprehensiveness]}
              onValueChange={(value) => handlePreferenceChange('comprehensiveness', value)}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not Important</span>
              <span>Extremely Important</span>
            </div>
          </div>

          <Button
            onClick={generateRecommendation}
            disabled={isGenerating || tests.length < 2}
            className="w-full gap-2 bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Tests...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Get AI Recommendation
              </>
            )}
          </Button>

          {tests.length < 2 && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Select at least 2 tests to get a personalized recommendation</span>
            </div>
          )}
          
          {!user && (
            <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Tip:</strong> Log in to automatically save your preferences for next time!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendation Result */}
      {recommendation && topTest && (
        <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle className="text-green-900 dark:text-green-100">
                Recommended Test
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Top Choice Highlight */}
            <div className="bg-card rounded-lg border-2 border-green-500/50 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{topTest.name}</h3>
                  <p className="text-sm text-muted-foreground">{topTest.provider}</p>
                </div>
                <Badge className="bg-green-600">
                  Best Match
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold ml-2">£{topTest.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Turnaround:</span>
                  <span className="font-semibold ml-2">{topTest.features.turnaround}</span>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Analysis
              </h4>
              <div className="bg-card rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line border">
                {recommendation.recommendation}
              </div>
            </div>

            {/* All Scores */}
            {recommendation.allScores.length > 1 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Other Options (by score)</h4>
                <div className="space-y-2">
                  {recommendation.allScores.slice(1).map((score, idx) => (
                    <div 
                      key={score.testId}
                      className="flex items-center justify-between text-sm p-2 rounded bg-muted/30"
                    >
                      <span className="font-medium">#{idx + 2} {score.testName}</span>
                      <Badge variant="outline" className="text-xs">
                        Score: {score.score.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
