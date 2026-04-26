import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, FlaskConical, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { healthDataApi, BiomarkerReading } from "@/api/supabase/healthData.api";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface AnalysisResult {
  overallSummary: string;
  biomarkerAnalysis: Array<{
    name: string;
    value: number;
    unit: string;
    status: string;
    interpretation: string;
    recommendations: string[];
  }>;
  keyFindings: string[];
  recommendations: string[];
}

export const StoredBiomarkerAnalysis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [readings, setReadings] = useState<BiomarkerReading[]>([]);
  const [selectedReadings, setSelectedReadings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysing, setAnalysing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    loadBiomarkerReadings();
  }, [user]);

  const loadBiomarkerReadings = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await healthDataApi.getBiomarkerReadings(user.id);
    
    if (error) {
      toast({
        title: "Failed to load biomarkers",
        description: "Could not retrieve your stored biomarker readings.",
        variant: "destructive"
      });
    } else {
      setReadings(data || []);
    }
    setLoading(false);
  };

  const handleSelectReading = (id: string) => {
    setSelectedReadings(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedReadings.length === readings.length) {
      setSelectedReadings([]);
    } else {
      setSelectedReadings(readings.map(r => r.id));
    }
  };

  const handleAnalyse = async () => {
    if (selectedReadings.length === 0) {
      toast({
        title: "No biomarkers selected",
        description: "Please select at least one biomarker reading to analyse.",
        variant: "destructive"
      });
      return;
    }

    setAnalysing(true);
    setAnalysisResult(null);

    try {
      const selectedData = readings.filter(r => selectedReadings.includes(r.id));
      
      const biomarkerEntries = selectedData.map(r => ({
        name: r.biomarker_name,
        value: r.value,
        unit: r.unit || "",
        referenceMin: r.reference_range_min,
        referenceMax: r.reference_range_max
      }));

      const { data, error } = await supabase.functions.invoke(
        "blood-test-analysis",
        {
          body: { readings: biomarkerEntries }
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: "Your stored biomarker readings have been analysed."
      });
    } catch (err) {
      console.error("Analysis error:", err);
      const message = err instanceof Error ? err.message : "Analysis failed";
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setAnalysing(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-2">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (readings.length === 0) {
    return (
      <Card className="p-6 border-2">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="flex items-center gap-2 text-brand-navy">
            <Sparkles className="w-5 h-5 text-brand-pink" />
            Analyse Your Stored Biomarkers
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <p className="text-muted-foreground mb-4">
            You don't have any stored biomarker readings yet. Upload test results or manually enter biomarker values to get started.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/blood-test-analysis">
                Enter Biomarkers Manually
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group readings by date for better organisation
  const groupedReadings = readings.reduce((acc, reading) => {
    const date = format(new Date(reading.recorded_at), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reading);
    return acc;
  }, {} as Record<string, BiomarkerReading[]>);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-navy">
          <Sparkles className="w-5 h-5 text-brand-pink" />
          Analyse Your Stored Biomarkers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysisResult ? (
          <>
            <p className="text-sm text-muted-foreground">
              Select the biomarker readings you'd like to analyse with AI. Our system will provide insights and recommendations based on your results.
            </p>

            {/* Selection Controls */}
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSelectAll}
              >
                {selectedReadings.length === readings.length ? "Deselect All" : "Select All"}
              </Button>
              <Badge variant="secondary">
                {selectedReadings.length} of {readings.length} selected
              </Badge>
            </div>

            {/* Readings List */}
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
              {Object.entries(groupedReadings).map(([date, dateReadings]) => (
                <div key={date}>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    {format(new Date(date), "dd MMMM yyyy")}
                  </p>
                  <div className="space-y-2">
                    {dateReadings.map((reading) => (
                      <div 
                        key={reading.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                          selectedReadings.includes(reading.id) 
                            ? "border-brand-pink bg-brand-pink/5" 
                            : "border-border hover:border-brand-pink/50"
                        }`}
                        onClick={() => handleSelectReading(reading.id)}
                      >
                        <Checkbox 
                          checked={selectedReadings.includes(reading.id)}
                          onCheckedChange={() => handleSelectReading(reading.id)}
                        />
                        <FlaskConical className="w-4 h-4 text-brand-turquoise" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-brand-navy truncate">
                            {reading.biomarker_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reading.value} {reading.unit}
                            {reading.status && (
                              <Badge 
                                variant="outline" 
                                className={`ml-2 text-xs ${
                                  reading.status === 'normal' 
                                    ? 'border-green-500 text-green-600' 
                                    : reading.status === 'high' 
                                    ? 'border-orange-500 text-orange-600'
                                    : reading.status === 'low'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-red-500 text-red-600'
                                }`}
                              >
                                {reading.status}
                              </Badge>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Analyse Button */}
            <Button 
              onClick={handleAnalyse}
              disabled={selectedReadings.length === 0 || analysing}
              className="w-full bg-brand-pink hover:bg-brand-pink/90"
            >
              {analysing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analysing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyse Selected Biomarkers ({selectedReadings.length})
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Analysis Results */}
            <Alert className="border-brand-turquoise bg-brand-turquoise/10">
              <Sparkles className="h-4 w-4 text-brand-turquoise" />
              <AlertDescription className="text-brand-navy">
                {analysisResult.overallSummary}
              </AlertDescription>
            </Alert>

            {/* Key Findings */}
            {analysisResult.keyFindings && analysisResult.keyFindings.length > 0 && (
              <div>
                <h4 className="font-semibold text-brand-navy mb-2">Key Findings</h4>
                <ul className="space-y-1">
                  {analysisResult.keyFindings.map((finding, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-brand-pink">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-brand-navy mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-brand-turquoise">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setAnalysisResult(null)}
              >
                Analyse Different Biomarkers
              </Button>
              <Button asChild className="bg-brand-pink hover:bg-brand-pink/90">
                <Link to="/blood-test-analysis">
                  Full Analysis Tool
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
