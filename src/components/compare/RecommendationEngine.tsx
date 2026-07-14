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

export const RecommendationEngine = React.memo(({ 
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