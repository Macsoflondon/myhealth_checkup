import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface LivePriceBadgeProps {
  priceChange?: number;
  showIcon?: boolean;
}

export const LivePriceBadge = ({ priceChange, showIcon = true }: LivePriceBadgeProps) => {
  if (!priceChange || priceChange === 0) return null;

  const isIncrease = priceChange > 0;

  return (
    <Badge
      variant={isIncrease ? "destructive" : "secondary"}
      className="gap-1 text-xs"
    >
      {showIcon && (
        isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
      )}
      <span>{isIncrease ? "+" : ""}{priceChange.toFixed(2)}%</span>
    </Badge>
  );
};
