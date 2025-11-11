import { Cloud, CloudOff, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useOfflineSync } from "@/hooks/useOfflineSync";

interface OfflineSyncIndicatorProps {
  showDetails?: boolean;
  compact?: boolean;
}

export function OfflineSyncIndicator({ showDetails = true, compact = false }: OfflineSyncIndicatorProps) {
  const { syncState, triggerSync, isOnline, isSyncing, hasPendingChanges, hasConflicts } = useOfflineSync();

  const getStatusIcon = () => {
    if (!isOnline) return <CloudOff className="h-4 w-4" />;
    if (isSyncing) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (hasConflicts) return <AlertTriangle className="h-4 w-4" />;
    if (hasPendingChanges) return <Cloud className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (isSyncing) return "Syncing...";
    if (hasConflicts) return "Conflicts";
    if (hasPendingChanges) return `${syncState.pendingOperations} pending`;
    return "Synced";
  };

  const getStatusColor = () => {
    if (!isOnline) return "text-muted-foreground";
    if (hasConflicts) return "text-destructive";
    if (hasPendingChanges) return "text-yellow-600 dark:text-yellow-500";
    return "text-green-600 dark:text-green-500";
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={triggerSync}
              disabled={!isOnline || isSyncing}
              className={cn("flex items-center gap-2 p-2 rounded-lg transition-colors", getStatusColor())}
            >
              {getStatusIcon()}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{getStatusText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <div className={cn("flex items-center gap-2", getStatusColor())}>
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>

      {showDetails && (
        <>
          {hasPendingChanges && (
            <Badge variant="secondary" className="text-xs">
              {syncState.pendingOperations} {syncState.pendingOperations === 1 ? 'change' : 'changes'}
            </Badge>
          )}

          {hasConflicts && (
            <Badge variant="destructive" className="text-xs">
              {syncState.conflicts} {syncState.conflicts === 1 ? 'conflict' : 'conflicts'}
            </Badge>
          )}

          {syncState.lastSyncTime && !isSyncing && (
            <span className="text-xs text-muted-foreground">
              Last sync: {syncState.lastSyncTime.toLocaleTimeString()}
            </span>
          )}
        </>
      )}

      {isOnline && !isSyncing && hasPendingChanges && (
        <Button
          variant="outline"
          size="sm"
          onClick={triggerSync}
          className="ml-auto"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Sync Now
        </Button>
      )}

      {isSyncing && syncState.syncProgress && (
        <div className="ml-auto flex items-center gap-2 min-w-[200px]">
          <Progress 
            value={(syncState.syncProgress.current / syncState.syncProgress.total) * 100} 
            className="h-2"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {syncState.syncProgress.current}/{syncState.syncProgress.total}
          </span>
        </div>
      )}
    </div>
  );
}
