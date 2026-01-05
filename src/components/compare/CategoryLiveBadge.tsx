import { Badge } from "@/components/ui/badge";
import { Wifi } from "lucide-react";

interface CategoryLiveBadgeProps {
  isLive?: boolean;
}

export const CategoryLiveBadge = ({ isLive }: CategoryLiveBadgeProps) => {
  if (!isLive) return null;

  return (
    <Badge variant="secondary" className="gap-1">
      <Wifi className="h-3 w-3" />
      <span>LIVE</span>
    </Badge>
  );
};
