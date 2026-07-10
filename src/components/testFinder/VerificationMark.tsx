import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { FieldStatus } from "@/types/testFinder";

interface Props {
  status: FieldStatus;
  children: React.ReactNode;
}

/** Subtle marker for `needs_verification` data (spec §10). */
export const VerificationMark = ({ status, children }: Props) => {
  if (status === "verified") return <>{children}</>;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="border-b border-dotted border-amber-400/70 cursor-help"
            aria-label="Pending verification"
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[240px] text-xs">
          Pending verification against the provider's live site.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const VerificationLegend = () => (
  <div className="flex items-center gap-2 text-[11px] text-white/55">
    <span className="border-b border-dotted border-amber-400/70 px-1">value</span>
    <span>= pending verification against the provider's live site</span>
  </div>
);
