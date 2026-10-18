import { forwardRef, type HTMLAttributes } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getHomepageComparison } from "@/services/homepage-comparison-service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HomepageLiveComparisonProps extends HTMLAttributes<HTMLDivElement> {}

/** Compact, live clinic catalogue preview for the homepage mission section. */
export const HomepageLiveComparison = forwardRef<HTMLDivElement, HomepageLiveComparisonProps>(
  ({ className, ...props }, ref) => {
    const { data: tests = [], isPending, isError } = useQuery({
      queryKey: ["homepage", "clinic-full-blood-count"],
      queryFn: getHomepageComparison,
      staleTime: 10 * 60 * 1000,
    });
    return (
      <div ref={ref} {...props} className={cn("w-full max-w-sm rounded-xl border border-brand-turquoise/20 bg-surface p-5 text-brand-navy shadow-e4", className)}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div><h3 className="font-heading text-sm font-bold">Full blood count</h3><p className="mt-1 text-xs text-brand-navy/60">Clinic blood draw</p></div>
          <span className="shrink-0 rounded-sm bg-brand-turquoise/10 px-2 py-1 text-[10px] font-semibold">Live catalogue</span>
        </div>
        <div className="min-h-64" aria-live="polite">
          {isPending ? <p className="py-8 text-sm text-brand-navy/60">Loading current prices…</p> : isError || !tests.length ? <p className="py-8 text-sm text-brand-navy/60">Live prices are unavailable. View the comparison for current options.</p> : tests.map((test, index) => (
            <div key={test.id} className={cn("border-b border-brand-navy/10 px-2 py-4 last:border-b-0", index === 0 && "rounded-lg border border-brand-turquoise/20 bg-brand-turquoise/5")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-1.5"><span className="font-heading text-xs font-bold">{test.provider_name}</span>{index === 0 && <span className="rounded-sm bg-brand-pink px-1.5 py-0.5 text-[9px] font-bold text-white">Lowest shown</span>}</div><p className="mt-1 text-[10px] leading-relaxed text-brand-navy/65">{test.test_name}</p></div>
                <div className="shrink-0 text-right"><p className="font-heading text-base font-bold">{test.total_expected_cost?.toLocaleString("en-GB", { style: "currency", currency: "GBP" })}</p><p className="text-[9px] text-brand-navy/60">Total cost</p></div>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-brand-navy/60">{test.biomarker_count !== null && `${test.biomarker_count} biomarkers`}{test.turnaround_days_text && ` · Typical results: ${test.turnaround_days_text}`}</p>
              {test.updated_at && <p className="mt-1 text-[9px] text-brand-navy/50">Updated {new Date(test.updated_at).toLocaleDateString("en-GB")}</p>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-brand-navy/60">Coverage and result times vary. Confirm current prices and any additional charges with the provider.</p>
        <Button asChild variant="link" size="sm" className="mt-4 h-auto whitespace-normal p-0 text-[11px] text-brand-pink">
          <Link to="/compare/results" search={{ panel: "full-blood-count" }}>Compare full blood count tests <ArrowRight aria-hidden="true" className="size-3" /></Link>
        </Button>
      </div>
    );
  },
);
HomepageLiveComparison.displayName = "HomepageLiveComparison";