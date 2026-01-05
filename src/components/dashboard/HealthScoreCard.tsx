import { useEffect, useState } from "react";
import { Activity, Heart, Zap, Droplet, Apple } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { healthDataApi, HealthScore } from "@/api/supabase/healthData.api";
import { useAuth } from "@/context/AuthContext";

export const HealthScoreCard = () => {
  const { user } = useAuth();
  const [score, setScore] = useState<HealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScore = async () => {
      if (!user) return;
      
      setLoading(true);
      const { data } = await healthDataApi.getLatestHealthScore(user.id);
      setScore(data);
      setLoading(false);
    };

    loadScore();
  }, [user]);

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-muted";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-[#22C0D4]";
    if (score >= 40) return "bg-yellow-500";
    return "bg-[#e70d69]";
  };

  const getScoreLabel = (score?: number) => {
    if (!score) return "No data";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs attention";
  };

  if (loading) {
    return (
      <Card className="p-6 border-2">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2">
      <h3 className="text-xl font-semibold mb-6 text-[#081129]">Health Scores</h3>

      {!score ? (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            Upload test results to calculate your health scores
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (score.overall_score || 0) / 100)}`}
                  className={getScoreColor(score.overall_score)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#081129]">
                  {score.overall_score || "--"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Health Score</p>
              <p className="text-lg font-semibold text-[#081129]">
                {getScoreLabel(score.overall_score)}
              </p>
            </div>
          </div>

          {/* Category Scores */}
          <div className="space-y-4">
            <ScoreBar
              icon={Heart}
              label="Heart Health"
              score={score.heart_score}
              color="text-[#e70d69]"
            />
            <ScoreBar
              icon={Zap}
              label="Metabolic Health"
              score={score.metabolic_score}
              color="text-[#22C0D4]"
            />
            <ScoreBar
              icon={Droplet}
              label="Hormonal Balance"
              score={score.hormonal_score}
              color="text-primary"
            />
            <ScoreBar
              icon={Apple}
              label="Nutritional Status"
              score={score.nutritional_score}
              color="text-green-600"
            />
          </div>
        </div>
      )}
    </Card>
  );
};

interface ScoreBarProps {
  icon: React.ElementType;
  label: string;
  score?: number;
  color: string;
}

const ScoreBar = ({ icon: Icon, label, score, color }: ScoreBarProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium text-[#081129]">{label}</span>
        </div>
        <span className="text-sm font-semibold text-[#081129]">
          {score || "--"}/100
        </span>
      </div>
      <Progress value={score || 0} className="h-2" />
    </div>
  );
};
