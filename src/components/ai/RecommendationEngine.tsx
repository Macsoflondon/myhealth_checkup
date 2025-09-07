import React, { useState } from 'react';
import { Brain, Sparkles, Target, Clock, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
interface RecommendationProps {
  test: string;
  provider: string;
  price: number;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  confidence: number;
}
const RecommendationEngine = () => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendationProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const generateRecommendations = async () => {
    setIsLoading(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI recommendations based on input
    const mockRecommendations: RecommendationProps[] = [{
      test: "Full Blood Count & Biochemistry",
      provider: "Medichecks",
      price: 79,
      reason: "Comprehensive health overview recommended for your age group",
      urgency: "medium",
      confidence: 85
    }, {
      test: "Thyroid Function Test",
      provider: "Thriva",
      price: 59,
      reason: "Fatigue symptoms may indicate thyroid issues",
      urgency: "high",
      confidence: 92
    }, {
      test: "Vitamin D Test",
      provider: "Superdrug Health",
      price: 29,
      reason: "Common deficiency causing fatigue",
      urgency: "low",
      confidence: 78
    }];
    setRecommendations(mockRecommendations);
    setIsLoading(false);
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
          <Brain className="h-8 w-8 text-health-600" />
          <h1 className="text-3xl font-bold">AI Health Recommendations</h1>
        </div>
        <p className="text-[#e70d69]">
          Get personalised test recommendations based on your symptoms and health goals
        </p>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-health-600" />
          Tell us about your health
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
            Symptoms or Health Concerns
          </label>
          <textarea className="w-full p-3 border rounded-md h-24 resize-none" placeholder="Describe any symptoms you're experiencing or health goals you have (e.g., fatigue, weight management, preventive screening)..." value={symptoms} onChange={e => setSymptoms(e.target.value)} />
        </div>

        <Button onClick={generateRecommendations} disabled={isLoading || !symptoms.trim()} className="w-full bg-health-600 hover:bg-health-700">
          {isLoading ? <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Analysing your health needs...
            </> : <>
              <Brain className="h-4 w-4 mr-2" />
              Get AI Recommendations
            </>}
        </Button>
      </Card>

      {recommendations.length > 0 && <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-health-600" />
            Personalised Recommendations
          </h2>
          
          {recommendations.map((rec, index) => <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{rec.test}</h3>
                    <Badge className={getUrgencyColor(rec.urgency)}>
                      {rec.urgency} priority
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{rec.provider}</p>
                  <p className="text-sm text-gray-700">{rec.reason}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-health-600 mb-1">
                    £{rec.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    {rec.confidence}% confidence
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">2-3 days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">At-home kit</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                  <Button size="sm" className="bg-health-600 hover:bg-health-700">
                    Book Test
                  </Button>
                </div>
              </div>
            </Card>)}
        </div>}
    </div>;
};
export default RecommendationEngine;