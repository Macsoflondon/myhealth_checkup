import React, { useState } from 'react';
import { Brain, Sparkles, Target, Clock, TrendingUp, AlertTriangle, Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
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

interface AIAnalysisResult {
  medicalDisclaimer: string;
  analysis: string;
  recommendedTests: RecommendationProps[];
  generalGuidance: string;
  whenToSeeDoctor: string;
  hasRecommendations: boolean;
}
const RecommendationEngine = () => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const generateRecommendations = async () => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const query = `${symptoms}${age ? ` Age: ${age}` : ''}${gender ? ` Gender: ${gender}` : ''}`;
      
      const { data, error } = await supabase.functions.invoke('health-ai-analysis', {
        body: { query }
      });

      if (error) {
        throw error;
      }

      setAnalysisResult(data);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      setAnalysisResult({
        medicalDisclaimer: "This information is for educational purposes only and is not medical advice. Please consult your GP or healthcare professional regarding any health concerns or symptoms.",
        analysis: "Sorry, we couldn't analyze your request at the moment. Please try again or consult your healthcare professional.",
        recommendedTests: [],
        generalGuidance: "Please consult your healthcare professional for personalized health advice.",
        whenToSeeDoctor: "Seek immediate medical attention for urgent symptoms or persistent health concerns.",
        hasRecommendations: false
      });
    } finally {
      setIsLoading(false);
    }
  };
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
  return <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Wellness Recommendations</h1>
        </div>
        <p className="text-muted-foreground">
          Get personalized wellness test recommendations from our trusted providers
        </p>
      </div>

      {/* Medical Disclaimer */}
      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important:</strong> This tool provides general wellness information only and is not medical advice. 
          Always consult your GP or healthcare professional regarding any health concerns or symptoms.
        </AlertDescription>
      </Alert>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Tell us about your wellness goals
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <label className="block text-sm font-medium mb-2">Lifestyle</label>
            <select className="w-full p-2 border rounded-md">
              <option value="">Select lifestyle</option>
              <option value="sedentary">Sedentary</option>
              <option value="active">Active</option>
              <option value="very-active">Very Active</option>
            </select>
          </div>
        </div>

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

        <Button onClick={generateRecommendations} disabled={isLoading || !symptoms.trim()} className="w-full">
          {isLoading ? <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Analyzing your wellness needs...
            </> : <>
              <Brain className="h-4 w-4 mr-2" />
              Get Wellness Recommendations
            </>}
        </Button>
      </Card>

      {analysisResult && <div className="space-y-6">
          {/* AI Analysis */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              Wellness Analysis
            </h2>
            <p className="text-foreground mb-4">{analysisResult.analysis}</p>
            
            {analysisResult.generalGuidance && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">General Wellness Guidance:</h4>
                <p className="text-green-700 text-sm">{analysisResult.generalGuidance}</p>
              </div>
            )}
          </Card>

          {/* Medical Guidance */}
          <Alert className="border-red-200 bg-red-50">
            <Stethoscope className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>When to see a doctor:</strong> {analysisResult.whenToSeeDoctor}
            </AlertDescription>
          </Alert>

          {/* Test Recommendations */}
          {analysisResult.recommendedTests.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recommended Wellness Tests
              </h2>
              
              {analysisResult.recommendedTests.map((rec, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{rec.testName}</h3>
                        <Badge className={getUrgencyColor(rec.urgency)}>
                          {rec.urgency} priority
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{rec.provider}</p>
                      <p className="text-sm text-foreground mb-2">{rec.reason}</p>
                      <Badge variant="outline" className="text-xs">
                        {rec.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {rec.price ? `£${rec.price}` : 'Price TBC'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rec.confidence}% match
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">2-5 working days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">At-home collection</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                      <Button size="sm">
                        View Test Details
                      </Button>
                    </div>
                  </div>
                  
                  {/* Medical Disclaimer for each test */}
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                    This test recommendation is for wellness screening purposes only. Results should be discussed with your healthcare professional.
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Bottom Medical Disclaimer */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              {analysisResult.medicalDisclaimer}
            </AlertDescription>
          </Alert>
        </div>}
    </div>;
};
export default RecommendationEngine;