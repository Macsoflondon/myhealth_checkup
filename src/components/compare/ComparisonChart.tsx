import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { EnhancedTestData } from "@/types/comparison";
import { BarChart3 } from "lucide-react";

interface ComparisonChartProps {
  tests: EnhancedTestData[];
}

const COLORS = [
  "hsl(var(--primary))",
  "#22c0d4",
  "#e70d69",
  "#fbbf24"
];

export function ComparisonChart({ tests }: ComparisonChartProps) {
  const chartData = useMemo(() => {
    if (tests.length === 0) return [];

    // Find max values for normalization
    const maxPrice = Math.max(...tests.map(t => t.totalEstimatedCost || t.basePrice));
    const maxTurnaround = Math.max(...tests.map(t => t.turnaroundDays));
    const maxBiomarkers = Math.max(...tests.map(t => t.biomarkerCount));
    const maxValueRatio = Math.max(...tests.map(t => 
      t.biomarkerCount / (t.totalEstimatedCost || t.basePrice)
    ));

    // Create normalized data for radar chart
    // For price and turnaround, we invert (100 - value) so lower is better
    const metrics = [
      { metric: "Value for Money", key: "value" },
      { metric: "Speed", key: "speed" },
      { metric: "Comprehensiveness", key: "biomarkers" },
      { metric: "Affordability", key: "affordability" },
      { metric: "Home Collection", key: "homeKit" }
    ];

    return metrics.map(({ metric, key }) => {
      const dataPoint: Record<string, any> = { metric };
      
      tests.forEach((test, index) => {
        let score = 0;
        
        switch (key) {
          case "value":
            // Value = biomarkers per pound (normalized 0-100)
            const valueRatio = test.biomarkerCount / (test.totalEstimatedCost || test.basePrice);
            score = (valueRatio / maxValueRatio) * 100;
            break;
          case "speed":
            // Speed = inverse of turnaround (lower is better)
            score = ((maxTurnaround - test.turnaroundDays + 1) / maxTurnaround) * 100;
            break;
          case "biomarkers":
            // Biomarkers normalized
            score = (test.biomarkerCount / maxBiomarkers) * 100;
            break;
          case "affordability":
            // Affordability = inverse of price
            score = ((maxPrice - (test.totalEstimatedCost || test.basePrice) + 1) / maxPrice) * 100;
            break;
          case "homeKit":
            // Home kit availability
            score = test.homeKitAvailable ? 100 : 0;
            break;
        }
        
        dataPoint[test.testName] = Math.round(score);
      });
      
      return dataPoint;
    });
  }, [tests]);

  if (tests.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Visual Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select at least 2 tests to see a visual comparison.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Visual Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid className="stroke-muted" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10 }}
                tickCount={5}
              />
              
              {tests.map((test, index) => (
                <Radar
                  key={test.id}
                  name={test.testName.length > 25 ? test.testName.substring(0, 25) + "..." : test.testName}
                  dataKey={test.testName}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              ))}
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
              <Legend 
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value: string) => (
                  <span className="text-xs">{value}</span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend explanation */}
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p><strong>Value for Money:</strong> Biomarkers per pound spent</p>
          <p><strong>Speed:</strong> Results turnaround time (faster is better)</p>
          <p><strong>Comprehensiveness:</strong> Number of biomarkers included</p>
          <p><strong>Affordability:</strong> Price comparison (lower is better)</p>
          <p><strong>Home Collection:</strong> Whether home kit is available</p>
        </div>
      </CardContent>
    </Card>
  );
}
