
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface RealtimeToggleProps {
  isRealtime: boolean;
  toggleRealtime: () => void;
}

const RealtimeToggle = ({ isRealtime, toggleRealtime }: RealtimeToggleProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Button
      variant="outline" 
      size="sm"
      className="flex items-center gap-2"
      onClick={toggleRealtime}
    >
      <RefreshCw className={cn("h-4 w-4", isRealtime && "animate-spin")} />
      {isMobile ? (isRealtime ? "Live" : "Off") : (isRealtime ? "Live Updates On" : "Live Updates Off")}
    </Button>
  );
};

export default RealtimeToggle;
