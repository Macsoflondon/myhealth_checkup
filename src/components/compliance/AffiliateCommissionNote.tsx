import { cn } from "@/lib/utils";

export const AFFILIATE_COMMISSION_TEXT =
  "We may earn a commission if you book through this link. This does not change the price you pay or how we rank results.";

export function AffiliateCommissionNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-[11px] leading-snug text-muted-foreground", className)}>
      {AFFILIATE_COMMISSION_TEXT}
    </p>
  );
}
