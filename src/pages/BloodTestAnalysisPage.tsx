import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BiomarkerInputForm, BiomarkerEntry } from "@/components/analysis/BiomarkerInputForm";
import { BiomarkerAnalysisResult, AnalysisResult } from "@/components/analysis/BiomarkerAnalysisResult";
import { BiomarkerTrendChart } from "@/components/analysis/BiomarkerTrendChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  FlaskConical, 
  History, 
  LogIn, 
  AlertTriangle,
  Sparkles,
  TrendingUp
} from "lucide-react";

interface HistoricalQuery {
  id: string;
  query_text: string;
  ai_response: AnalysisResult;
  created_at: string;
}

export default function BloodTestAnalysisPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previousQueries, setPreviousQueries] = useState<HistoricalQuery[]>([]);
  const [activeTab, setActiveTab] = useState("input");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        loadPreviousQueries();
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadPreviousQueries();
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const loadPreviousQueries = async () => {
    const { data, error } = await supabase
      .from("health_queries")
      .select("*")
      .ilike("query_text", "Blood test analysis:%")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (!error && data) {
      // Type assertion to handle the ai_response JSON field
      const typedQueries = data.map(q => ({
        ...q,
        ai_response: q.ai_response as unknown as AnalysisResult
      }));
      setPreviousQueries(typedQueries);
    }
  };

  const handleSubmit = async (
    readings: BiomarkerEntry[], 
    gender?: "male" | "female", 
    age?: number
  ) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use the AI analysis feature.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        "blood-test-analysis",
        {
          body: { readings, gender, age }
        }
      );

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data);
      setActiveTab("results");
      loadPreviousQueries();

      toast({
        title: "Analysis Complete",
        description: "Your blood test results have been analysed."
      });
    } catch (err) {
      console.error("Analysis error:", err);
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreviousAnalysis = (query: HistoricalQuery) => {
    setAnalysisResult(query.ai_response);
    setActiveTab("results");
  };

  return (
    <>
      <Helmet>
        <title>AI Blood Test Analysis | myhealth checkup</title>
        <meta 
          name="description" 
          content="Get AI-powered analysis of your blood test results. Understand what your biomarkers mean and receive personalised health insights." 
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 sm:py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Analysis</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Understand Your Blood Test Results
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Enter your biomarker readings and receive instant, AI-powered explanations 
              of what they mean for your health. Track trends over time and get personalised recommendations.
            </p>

            {/* Medical Disclaimer Banner */}
            <Alert className="max-w-3xl mx-auto border-amber-500 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
                This tool provides educational information only and is not a substitute for professional 
                medical advice. Always consult your GP or healthcare provider for interpretation of test results.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {!user ? (
              <Card className="max-w-xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Sign In Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Please sign in to use the AI blood test analysis feature. 
                    Your data is stored securely and only you can access your results.
                  </p>
                  <Button onClick={() => navigate("/auth")}>
                    Sign In to Continue
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="max-w-4xl mx-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="input" className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4" />
                      Enter Results
                    </TabsTrigger>
                    <TabsTrigger value="results" className="flex items-center gap-2" disabled={!analysisResult}>
                      <Sparkles className="h-4 w-4" />
                      Analysis
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      History
                    </TabsTrigger>
                  </TabsList>

                  {/* Input Tab */}
                  <TabsContent value="input" className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <BiomarkerInputForm 
                      onSubmit={handleSubmit} 
                      isLoading={isLoading} 
                    />
                  </TabsContent>

                  {/* Results Tab */}
                  <TabsContent value="results" className="space-y-6">
                    {analysisResult ? (
                      <>
                        <BiomarkerAnalysisResult result={analysisResult} />
                        
                        {/* Trend Charts for biomarkers with history */}
                        {analysisResult.biomarkerAnalysis.some(b => 
                          b.previousValues && b.previousValues.length > 1
                        ) && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Your Biomarker Trends
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                              {analysisResult.biomarkerAnalysis
                                .filter(b => b.previousValues && b.previousValues.length > 1)
                                .slice(0, 4)
                                .map((biomarker, index) => (
                                  <BiomarkerTrendChart
                                    key={index}
                                    biomarkerName={biomarker.name}
                                    data={biomarker.previousValues || []}
                                    unit={biomarker.unit}
                                    currentValue={biomarker.value}
                                  />
                                ))
                              }
                            </CardContent>
                          </Card>
                        )}
                        
                        <div className="flex justify-center">
                          <Button 
                            variant="outline" 
                            onClick={() => setActiveTab("input")}
                          >
                            Analyse More Results
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Card>
                        <CardContent className="text-center py-12">
                          <p className="text-muted-foreground">
                            No analysis results yet. Enter your biomarker readings to get started.
                          </p>
                          <Button 
                            className="mt-4" 
                            onClick={() => setActiveTab("input")}
                          >
                            Enter Results
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* History Tab */}
                  <TabsContent value="history">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <History className="h-5 w-5 text-primary" />
                          Previous Analyses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {previousQueries.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            No previous analyses found. Your analysis history will appear here.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {previousQueries.map((query) => (
                              <button
                                key={query.id}
                                onClick={() => loadPreviousAnalysis(query)}
                                className="w-full text-left p-4 rounded-lg border hover:bg-accent transition-colors"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-sm">
                                      {query.ai_response?.biomarkerAnalysis?.length || 0} biomarkers analysed
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(query.created_at).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })}
                                    </p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
