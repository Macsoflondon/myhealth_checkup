
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RealtimeToggleProps {
  isRealtime: boolean;
  toggleRealtime: () => void;
}

const RealtimeToggle = ({ isRealtime, toggleRealtime }: RealtimeToggleProps) => {
  return (
    <Button
      variant="outline" 
      size="sm"
      className="flex items-center gap-2"
      onClick={toggleRealtime}
    >
      <RefreshCw className={cn("h-4 w-4", isRealtime && "animate-spin")} />
      {isRealtime ? "Live Updates On" : "Live Updates Off"}
    </Button>
  );
};

export default RealtimeToggle;
