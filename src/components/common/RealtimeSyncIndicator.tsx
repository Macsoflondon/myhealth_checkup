import { useEffect, useState } from "react";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SyncStatus } from "@/hooks/useRealtimeSync";

interface RealtimeSyncIndicatorProps {
  status: SyncStatus;
  compact?: boolean;
}

export function RealtimeSyncIndicator({ status, compact = false }: RealtimeSyncIndicatorProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (status.errors.length > 0) {
      setShowDetails(true);
    }
  }, [status.errors]);

  const getStatusIcon = () => {
    if (!status.connected) {
      return <WifiOff className="h-3 w-3" />;
    }
    if (status.syncing) {
      return <RefreshCw className="h-3 w-3 animate-spin" />;
    }
    if (status.errors.length > 0) {
      return <AlertCircle className="h-3 w-3" />;
    }
    return <Wifi className="h-3 w-3" />;
  };

  const getStatusText = () => {
    if (!status.connected) return "Offline";
    if (status.syncing) return "Syncing...";
    if (status.errors.length > 0) return "Error";
    return "Live";
  };

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (!status.connected) return "secondary";
    if (status.errors.length > 0) return "destructive";
    return "default";
  };

  const getTooltipContent = () => {
    const parts = [];
    
    if (status.connected) {
      parts.push("Connected to live updates");
    } else {
      parts.push("Working offline");
    }
    
    if (status.lastSync) {
      const lastSyncStr = new Date(status.lastSync).toLocaleTimeString();
      parts.push(`Last sync: ${lastSyncStr}`);
    }
    
    if (status.queuedUpdates > 0) {
      parts.push(`${status.queuedUpdates} updates queued`);
    }
    
    if (status.errors.length > 0) {
      parts.push(`${status.errors.length} error(s)`);
    }
    
    return parts.join(" • ");
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "flex items-center gap-1.5 text-xs",
              !status.connected && "text-muted-foreground",
              status.errors.length > 0 && "text-destructive"
            )}>
              {getStatusIcon()}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{getTooltipContent()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip open={showDetails} onOpenChange={setShowDetails}>
        <TooltipTrigger asChild>
          <Badge 
            variant={getStatusVariant()} 
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {getStatusIcon()}
            <span className="text-xs">{getStatusText()}</span>
            {status.queuedUpdates > 0 && (
              <span className="ml-1 px-1 py-0.5 rounded-full bg-background/20 text-[10px]">
                {status.queuedUpdates}
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1 text-xs">
            <p>{getTooltipContent()}</p>
            {status.errors.length > 0 && (
              <div className="pt-1 border-t border-border/50">
                <p className="font-medium">Recent errors:</p>
                {status.errors.slice(-3).map((error, idx) => (
                  <p key={idx} className="text-destructive">{error.message}</p>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
