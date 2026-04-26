import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Info,
  Heart,
  Lightbulb,
  Stethoscope,
  Activity
} from "lucide-react";

export interface BiomarkerAnalysisItem {
  name: string;
  value: number;
  unit?: string;
  status: "normal" | "low" | "high" | "borderline-low" | "borderline-high" | "unknown";
  normalRange?: string;
  explanation: string;
  implications?: string;
  trend?: "improving" | "stable" | "declining" | "no-history" | "insufficient-data";
  recommendations?: string[];
  previousValues?: Array<{ value: number; date: string }>;
}

export interface AnalysisResult {
  medicalDisclaimer: string;
  overallSummary: string;
  biomarkerAnalysis: BiomarkerAnalysisItem[];
  lifestyleRecommendations?: string[];
  whenToSeeDoctor: string;
}

interface BiomarkerAnalysisResultProps {
  result: AnalysisResult;
}

function getStatusColor(status: BiomarkerAnalysisItem["status"]): string {
  switch (status) {
    case "normal":
      return "bg-green-500";
    case "low":
    case "high":
      return "bg-red-500";
    case "borderline-low":
    case "borderline-high":
      return "bg-amber-500";
    default:
      return "bg-muted";
  }
}

function getStatusBadge(status: BiomarkerAnalysisItem["status"]) {
  const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
    normal: "default",
    low: "destructive",
    high: "destructive",
    "borderline-low": "secondary",
    "borderline-high": "secondary",
    unknown: "outline"
  };

  const labels: Record<string, string> = {
    normal: "Normal",
    low: "Low",
    high: "High",
    "borderline-low": "Borderline Low",
    "borderline-high": "Borderline High",
    unknown: "Unknown"
  };

  return (
    <Badge variant={variants[status] || "outline"}>
      {labels[status] || status}
    </Badge>
  );
}

function getTrendIcon(trend?: BiomarkerAnalysisItem["trend"]) {
  switch (trend) {
    case "improving":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "declining":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case "stable":
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
}

function getStatusIcon(status: BiomarkerAnalysisItem["status"]) {
  switch (status) {
    case "normal":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "low":
    case "high":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case "borderline-low":
    case "borderline-high":
      return <Info className="h-5 w-5 text-amber-500" />;
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
}

export function BiomarkerAnalysisResult({ result }: BiomarkerAnalysisResultProps) {
  const normalCount = result.biomarkerAnalysis.filter(b => b.status === "normal").length;
  const concernCount = result.biomarkerAnalysis.filter(b => 
    b.status === "low" || b.status === "high"
  ).length;
  const borderlineCount = result.biomarkerAnalysis.filter(b => 
    b.status === "borderline-low" || b.status === "borderline-high"
  ).length;

  return (
    <div className="space-y-6">
      {/* Medical Disclaimer */}
      <Alert variant="destructive" className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 dark:text-amber-200">Important Medical Disclaimer</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          {result.medicalDisclaimer}
        </AlertDescription>
      </Alert>

      {/* Overall Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Results Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">{result.overallSummary}</p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{normalCount}</div>
              <div className="text-sm text-muted-foreground">Normal</div>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{borderlineCount}</div>
              <div className="text-sm text-muted-foreground">Borderline</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{concernCount}</div>
              <div className="text-sm text-muted-foreground">Needs Attention</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Biomarker Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Detailed Biomarker Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {result.biomarkerAnalysis.map((biomarker, index) => (
              <AccordionItem key={index} value={`biomarker-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full pr-4">
                    {getStatusIcon(biomarker.status)}
                    <div className="flex-1 text-left">
                      <span className="font-medium">{biomarker.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {biomarker.value} {biomarker.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(biomarker.trend)}
                      {getStatusBadge(biomarker.status)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {/* Reference Range Visual */}
                  {biomarker.normalRange && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Reference Range</span>
                        <span>{biomarker.normalRange}</span>
                      </div>
                      <div className="relative h-2 bg-gradient-to-r from-red-200 via-green-200 to-red-200 rounded-full">
                        <div 
                          className={`absolute w-3 h-3 rounded-full -top-0.5 ${getStatusColor(biomarker.status)} border-2 border-white shadow`}
                          style={{ 
                            left: biomarker.status === "normal" ? "50%" : 
                                  biomarker.status === "low" || biomarker.status === "borderline-low" ? "15%" : "85%",
                            transform: "translateX(-50%)"
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">What This Means</h4>
                    <p className="text-sm text-muted-foreground">{biomarker.explanation}</p>
                  </div>

                  {/* Implications */}
                  {biomarker.implications && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Potential Implications</h4>
                      <p className="text-sm text-muted-foreground">{biomarker.implications}</p>
                    </div>
                  )}

                  {/* Historical Trend */}
                  {biomarker.previousValues && biomarker.previousValues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        Historical Values
                        {getTrendIcon(biomarker.trend)}
                        <span className="text-xs text-muted-foreground font-normal">
                          ({biomarker.trend === "improving" ? "Improving" : 
                            biomarker.trend === "declining" ? "Declining" : "Stable"})
                        </span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {biomarker.previousValues.slice(0, 5).map((prev, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {prev.value} • {new Date(prev.date).toLocaleDateString("en-GB", { 
                              day: "numeric", month: "short", year: "2-digit" 
                            })}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {biomarker.recommendations && biomarker.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recommendations</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {biomarker.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Lifestyle Recommendations */}
      {result.lifestyleRecommendations && result.lifestyleRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Lifestyle Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.lifestyleRecommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* When to See Doctor */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            When to See Your Doctor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{result.whenToSeeDoctor}</p>
        </CardContent>
      </Card>
    </div>
  );
}
