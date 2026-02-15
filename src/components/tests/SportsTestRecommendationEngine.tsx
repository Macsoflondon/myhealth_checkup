import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SportsTestRecommendationEngine() {
  const [athleteType, setAthleteType] = useState("");
  const [trainingGoals, setTrainingGoals] = useState("");
  const [experience, setExperience] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const streamRecommendations = async () => {
    if (!athleteType || !trainingGoals) {
      toast({
        title: "Missing Information",
        description: "Please select athlete type and describe your training goals.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRecommendations("");

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/sports-test-recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          athleteType,
          trainingGoals,
          experience,
          age: age ? parseInt(age) : null,
          gender,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Too many requests. Please try again in a moment.");
        }
        if (response.status === 402) {
          throw new Error("Service temporarily unavailable. Please try again later.");
        }
        throw new Error("Failed to get recommendations");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              setRecommendations((prev) => prev + content);
            }
          } catch (err) {
            console.warn("Failed to parse SSE line:", err);
          }
        }
      }

      // Flush remaining buffer
      if (buffer.trim()) {
        const lines = buffer.split("\n");
        for (const raw of lines) {
          if (!raw || raw.startsWith(":")) continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              setRecommendations((prev) => prev + content);
            }
          } catch {
            // Ignore parse errors in final flush
          }
        }
      }

      toast({
        title: "Recommendations Generated",
        description: "Your personalized test recommendations are ready.",
      });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate recommendations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#FA6980]/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#FA6980]/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#FA6980]" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI-Powered Test Recommendations</CardTitle>
              <CardDescription>
                Get personalized blood test suggestions based on your sport and goals
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="athleteType">Athlete Type *</Label>
              <Select value={athleteType} onValueChange={setAthleteType}>
                <SelectTrigger id="athleteType">
                  <SelectValue placeholder="Select your sport category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="endurance">Endurance (Running, Cycling, Triathlon)</SelectItem>
                  <SelectItem value="strength">Strength (Powerlifting, Bodybuilding, CrossFit)</SelectItem>
                  <SelectItem value="team-sports">Team Sports (Football, Rugby, Basketball)</SelectItem>
                  <SelectItem value="mixed">Mixed / Multiple Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                  <SelectItem value="elite">Elite / Professional (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age (Optional)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="15"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender (Optional)</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainingGoals">Training Goals *</Label>
            <Textarea
              id="trainingGoals"
              placeholder="Describe your training goals and any specific concerns (e.g., 'Improve marathon time, struggling with fatigue during long runs' or 'Build muscle mass, recovery seems slow between workouts')"
              value={trainingGoals}
              onChange={(e) => setTrainingGoals(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            onClick={streamRecommendations}
            disabled={isLoading || !athleteType || !trainingGoals}
            className="w-full bg-[#FA6980] hover:bg-[#E70D69] text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-5 w-5" />
                Get Personalized Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recommendations && (
        <Card className="border-2 border-[#22C0D4]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#22C0D4]" />
              Your Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {recommendations}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!recommendations && !isLoading && (
        <Card className="border-2 border-muted">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Fill in your athlete profile above to receive personalized test recommendations
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
