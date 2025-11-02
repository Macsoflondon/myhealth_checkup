import { useState } from "react";
import { Activity, FileText, TrendingUp, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TestResultUploader } from "./TestResultUploader";
import { TestResultsTimeline } from "./TestResultsTimeline";
import { HealthScoreCard } from "./HealthScoreCard";

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
      <div>
        <h1 className="text-3xl font-bold text-[#081129] mb-2">Health Dashboard</h1>
        <p className="text-muted-foreground">
          Track your health journey with test results, biomarkers, and wellness data all in one place
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#e70d69]/10 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#e70d69]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#081129]">--</p>
              <p className="text-sm text-muted-foreground">Health Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#22C0D4]/10 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#22C0D4]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#081129]" key={refreshKey}>0</p>
              <p className="text-sm text-muted-foreground">Test Results</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#081129]">--</p>
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
          <HealthScoreCard />
          
          <Card className="p-6 border-2">
            <h3 className="text-xl font-semibold mb-4 text-[#081129]">Getting Started</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-[#e70d69] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-[#081129]">Upload Your Test Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Start by uploading previous blood test results or health reports. We accept PDFs and images.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-[#22C0D4] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-[#081129]">Track Your Biomarkers</h4>
                  <p className="text-sm text-muted-foreground">
                    View trends for key health markers like cholesterol, vitamin D, and thyroid function over time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-[#081129]">Get Personalized Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive AI-powered recommendations for tests based on your health history and trends.
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
