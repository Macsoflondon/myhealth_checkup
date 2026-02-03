import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, FileText, TrendingUp, Upload, Sparkles, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestResultUploader } from "./TestResultUploader";
import { TestResultsTimeline } from "./TestResultsTimeline";
import { HealthScoreCard } from "./HealthScoreCard";
import { StoredBiomarkerAnalysis } from "./StoredBiomarkerAnalysis";
import PageHeading from "@/components/ui/page-heading";
export const HealthDataHub = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab("results");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left">
        <PageHeading 
          title="Health" 
          accent="Dashboard" 
          centered={false}
        />
        <p className="text-muted-foreground mt-2">
          Track your health journey with test results, biomarkers, and wellness data all in one place
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-pink/10 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-brand-pink" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-navy">--</p>
              <p className="text-sm text-muted-foreground">Health Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-turquoise/10 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-turquoise" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-navy" key={refreshKey}>0</p>
              <p className="text-sm text-muted-foreground">Test Results</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-navy/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-brand-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-navy">--</p>
              <p className="text-sm text-muted-foreground">Biomarkers Tracked</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI Analysis Feature Card */}
          <Card className="p-6 border-2 border-brand-pink/30 bg-gradient-to-br from-brand-pink/5 to-transparent">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-brand-pink/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-brand-pink" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-brand-navy mb-2">
                  AI Blood Test Analysis
                </h3>
                <p className="text-muted-foreground mb-4">
                  Get instant AI-powered explanations of your biomarker readings. Understand what your results mean, 
                  track trends over time, and receive personalised health recommendations.
                </p>
                <Button asChild className="bg-brand-pink hover:bg-brand-pink/90">
                  <Link to="/blood-test-analysis">
                    Analyse Your Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          <HealthScoreCard />

          {/* Stored Biomarker Analysis */}
          <StoredBiomarkerAnalysis />
          
          <Card className="p-6 border-2">
            <h3 className="text-xl font-semibold mb-4 text-brand-navy">Getting Started</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-brand-pink rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-brand-navy">Upload Your Test Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Start by uploading previous blood test results or health reports. We accept PDFs and images.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-brand-turquoise rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-brand-navy">Track Your Biomarkers</h4>
                  <p className="text-sm text-muted-foreground">
                    View trends for key health markers like cholesterol, vitamin D, and thyroid function over time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-brand-navy rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-brand-navy">Get AI-Powered Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Use our AI analysis tool to understand your results and receive personalised recommendations.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="results" key={refreshKey}>
          <TestResultsTimeline />
        </TabsContent>

        <TabsContent value="upload">
          <TestResultUploader onUploadComplete={handleUploadComplete} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
