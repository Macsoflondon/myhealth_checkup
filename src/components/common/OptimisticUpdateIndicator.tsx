import { Loader2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OptimisticUpdate } from "@/hooks/useOptimisticUpdate";

interface OptimisticUpdateIndicatorProps<T> {
  updates: OptimisticUpdate<T>[];
  className?: string;
}

export function OptimisticUpdateIndicator<T>({ updates, className }: OptimisticUpdateIndicatorProps<T>) {
  if (updates.length === 0) return null;

  const pendingCount = updates.filter(u => u.status === 'pending').length;
  const errorCount = updates.filter(u => u.status === 'error').length;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {pendingCount > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1.5 animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span className="text-xs">Saving {pendingCount}...</span>
        </Badge>
      )}

      {errorCount > 0 && (
        <Badge variant="destructive" className="flex items-center gap-1.5">
          <X className="h-3 w-3" />
          <span className="text-xs">{errorCount} failed</span>
        </Badge>
      )}

      {updates.some(u => u.status === 'success') && (
        <Badge variant="default" className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700">
          <Check className="h-3 w-3" />
          <span className="text-xs">Saved</span>
        </Badge>
      )}
    </div>
  );
}
