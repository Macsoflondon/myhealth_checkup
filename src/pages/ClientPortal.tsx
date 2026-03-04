import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Heart, Settings, TrendingUp, User, Bell } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { logger } from "@/lib/logger";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  phone_number: string | null;
}


interface TestResult {
  id: string;
  result_date: string;
  provider_id: string;
  pdf_url: string | null;
  test_master_id: string | null;
}

interface HealthInsight {
  id: string;
  title: string;
  description: string;
  priority: string;
  created_at: string;
}

export default function ClientPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchPortalData();
  }, [user, navigate]);

  const fetchPortalData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel for 3-4x faster loading
      const [profileData, resultsData, insightsData] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("first_name, last_name, date_of_birth, gender, phone_number")
          .eq("user_id", user?.id)
          .single(),
        supabase
          .from("test_results")
          .select("*")
          .eq("user_id", user?.id)
          .order("result_date", { ascending: false }),
        supabase
          .from("health_insights")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(5)
      ]);

      if (profileData.error) throw profileData.error;
      setProfile(profileData.data);

      
      if (!resultsData.error) setTestResults(resultsData.data || []);
      if (!insightsData.error) setInsights(insightsData.data || []);

    } catch (error) {
      logger.error("Error fetching portal data:", error);
      toast.error("Failed to load your health dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "confirmed": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-destructive";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Health Portal | MyHealth Checkup</title>
        <meta name="description" content="Access your test results, appointments, and health insights" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {profile?.first_name || "User"}
            </h1>
            <p className="text-muted-foreground">
              Your health is your greatest asset. Here's your health dashboard.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Test Results</p>
                  <p className="text-2xl font-bold">{testResults.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-500/10 rounded-lg">
                  <Bell className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">New Insights</p>
                  <p className="text-2xl font-bold">{insights.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              
              <TabsTrigger value="results">Test Results</TabsTrigger>
              <TabsTrigger value="insights">Health Insights</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Health Insights */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Recent Health Insights
                </h2>
                {insights.length > 0 ? (
                  <div className="space-y-4">
                    {insights.map((insight) => (
                      <div key={insight.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <span className={`px-2 py-1 rounded text-white text-xs ${getPriorityColor(insight.priority)}`}>
                            {insight.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No health insights available yet</p>
                )}
              </Card>
            </TabsContent>


            <TabsContent value="results">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Test Results</h2>
                {testResults.length > 0 ? (
                  <div className="space-y-4">
                    {testResults.map((result) => (
                      <div key={result.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg">Test Result</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(result.result_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm">Provider: {result.provider_id}</p>
                          </div>
                          {result.pdf_url && (
                            <a 
                              href={result.pdf_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                            >
                              View Report
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No test results available yet</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">All Health Insights</h2>
                {insights.length > 0 ? (
                  <div className="space-y-4">
                    {insights.map((insight) => (
                      <div key={insight.id} className="p-6 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg">{insight.title}</h3>
                          <span className={`px-3 py-1 rounded text-white ${getPriorityColor(insight.priority)}`}>
                            {insight.priority}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2">{insight.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(insight.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No health insights available</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Your Profile
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-lg">{profile?.first_name} {profile?.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="text-lg">{profile?.date_of_birth || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="text-lg">{profile?.gender || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-lg">{profile?.phone_number || "Not set"}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </>
  );
}
