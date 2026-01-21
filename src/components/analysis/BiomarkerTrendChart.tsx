import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from "recharts";
import { TrendingUp } from "lucide-react";

interface TrendDataPoint {
  value: number;
  date: string;
}

interface BiomarkerTrendChartProps {
  biomarkerName: string;
  data: TrendDataPoint[];
  unit?: string;
  referenceMin?: number;
  referenceMax?: number;
  currentValue?: number;
}

export function BiomarkerTrendChart({
  biomarkerName,
  data,
  unit = "",
  referenceMin,
  referenceMax,
  currentValue
}: BiomarkerTrendChartProps) {
  const chartData = useMemo(() => {
    const sortedData = [...data]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(point => ({
        ...point,
        formattedDate: new Date(point.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short"
        })
      }));

    // Add current value if provided
    if (currentValue !== undefined) {
      sortedData.push({
        value: currentValue,
        date: new Date().toISOString(),
        formattedDate: "Today"
      });
    }

    return sortedData;
  }, [data, currentValue]);

  const yDomain = useMemo(() => {
    const allValues = chartData.map(d => d.value);
    if (referenceMin !== undefined) allValues.push(referenceMin);
    if (referenceMax !== undefined) allValues.push(referenceMax);
    
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1;
    
    return [Math.max(0, min - padding), max + padding];
  }, [chartData, referenceMin, referenceMax]);

  if (chartData.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            {biomarkerName} Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Not enough historical data to show a trend. 
            At least 2 readings are required.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          {biomarkerName} Trend
          {unit && <span className="text-xs font-normal text-muted-foreground">({unit})</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              
              {/* Normal range area */}
              {referenceMin !== undefined && referenceMax !== undefined && (
                <ReferenceArea
                  y1={referenceMin}
                  y2={referenceMax}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  stroke="none"
                />
              )}
              
              {/* Reference lines */}
              {referenceMin !== undefined && (
                <ReferenceLine 
                  y={referenceMin} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
              )}
              {referenceMax !== undefined && (
                <ReferenceLine 
                  y={referenceMax} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />
              )}
              
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <YAxis 
                domain={yDomain}
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`${value} ${unit}`, biomarkerName]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        {(referenceMin !== undefined || referenceMax !== undefined) && (
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-8 h-0.5 bg-primary opacity-50" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, hsl(var(--primary)) 3px, hsl(var(--primary)) 6px)" }} />
              <span>Normal Range</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Your Values</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
