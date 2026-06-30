import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompareTestData } from "@/services/CompareService";
import { X, ArrowRight, GitCompare, GripVertical, ChevronDown, ChevronUp, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDraggable } from "@/hooks";

interface ComparisonBarProps {
  selectedTests: CompareTestData[];
  onRemoveTest: (testId: string) => void;
  onCompare: () => void;
  onClearAll: () => void;
}

export const ComparisonBar = ({
  selectedTests,
  onRemoveTest,
  onCompare,
  onClearAll,
}: ComparisonBarProps) => {
  const [orderedTests, setOrderedTests] = React.useState(selectedTests);
  const [mobileCollapsed, setMobileCollapsed] = React.useState(true);
  const [hasReached, setHasReached] = React.useState(false);

  React.useEffect(() => {
    setOrderedTests(selectedTests);
    // Auto-expand when first test added
    if (selectedTests.length === 1) setMobileCollapsed(false);
  }, [selectedTests]);

  // Scroll-gated visibility: on pages with a #comparison-anchor sentinel
  // (currently the homepage), keep the bar hidden until the comparison
  // section is in view, and hide it again once scrolled past #comparison-end.
  React.useEffect(() => {
    const anchor = document.getElementById("comparison-anchor");
    const end = document.getElementById("comparison-end");
    if (!anchor) {
      setHasReached(true);
      return;
    }

    let anchorReached = false;
    let endPassed = false;
    const update = () => setHasReached(anchorReached && !endPassed);

    const anchorObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            anchorReached = true;
          } else if (entry.boundingClientRect.top > 0) {
            // anchor scrolled back below viewport (user scrolled up past it)
            anchorReached = false;
          }
        }
        update();
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    anchorObs.observe(anchor);

    let endObs: IntersectionObserver | undefined;
    if (end) {
      endObs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            endPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          }
          update();
        },
        { rootMargin: "0px 0px 0px 0px" }
      );
      endObs.observe(end);
    }

    return () => {
      anchorObs.disconnect();
      endObs?.disconnect();
    };
  }, []);

  const revealClass = hasReached
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-full pointer-events-none";



  const { onDragStart, onDragEnd, onDragOver, onDrop, draggedOverIndex } = useDraggable({
    items: orderedTests,
    onReorder: setOrderedTests,
    getId: (test) => test.id,
  });

  const isEmpty = selectedTests.length === 0;

  // === GHOST EMPTY STATE ===========================================
  if (isEmpty) {
    return (
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 pointer-events-none transition-all duration-500 ease-out",
          revealClass
        )}

        role="region"
        aria-label="Comparison tray (empty)"
        aria-live="polite"
      >
        {/* Mobile: floating badge bottom-right */}
        <div className="sm:hidden flex justify-end px-3 pb-3">
          <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand-navy/40 bg-white/90 backdrop-blur px-3 py-1.5 shadow-md text-xs font-semibold text-brand-navy/70">
            <Scale className="h-3.5 w-3.5" aria-hidden="true" />
            0/5
          </div>
        </div>

        {/* Desktop: dashed onboarding strip */}
        <div className="hidden sm:block">
          <div className="container mx-auto max-w-7xl px-4 pb-3">
            <div className="pointer-events-auto rounded-t-2xl border-2 border-dashed border-brand-navy/25 border-b-0 bg-white/80 backdrop-blur-sm px-5 py-3 flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
              <Scale className="h-4 w-4 text-brand-navy/60" aria-hidden="true" />
              <span>
                Select up to 5 tests to compare prices, biomarkers &amp; collection methods.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === ACTIVE TRAY ================================================
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl animate-slideUp transition-all duration-500 ease-out",
        revealClass
      )}

      role="region"
      aria-label="Comparison tray"
      aria-live="polite"
    >
      {/* Mobile collapsed pill */}
      <div className={cn("sm:hidden", !mobileCollapsed && "hidden")}>
        <button
          onClick={() => setMobileCollapsed(false)}
          className="w-full flex items-center justify-between px-4 py-3 text-brand-navy"
          aria-expanded="false"
          aria-label={`Expand comparison tray, ${selectedTests.length} of 5 selected`}
        >
          <span className="flex items-center gap-2 font-bold text-sm">
            <Scale className="h-4 w-4" />
            Comparing
            <Badge className="bg-brand-navy text-white">{selectedTests.length}/5</Badge>
          </span>
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>

      <div className={cn("container mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4", mobileCollapsed && "hidden sm:block")}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Selected Tests */}
          <div className="flex items-center gap-3 flex-1 overflow-hidden min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <GitCompare className="h-5 w-5 text-brand-navy" />
              <span className="font-heading font-bold text-sm whitespace-nowrap text-brand-navy hidden sm:inline">
                Comparing
              </span>
              <Badge className="bg-brand-navy text-white">{selectedTests.length}/5</Badge>
              <button
                onClick={() => setMobileCollapsed(true)}
                className="sm:hidden ml-1 p-1 rounded hover:bg-muted"
                aria-label="Collapse comparison tray"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide -mx-1 px-1">
              {orderedTests.map((test, index) => (
                <div
                  key={test.id}
                  draggable
                  data-index={index}
                  onDragStart={(e) => onDragStart(e, { id: test.id, index })}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, index)}
                  className={cn(
                    "draggable-element flex items-center gap-1.5 bg-muted rounded-full pl-2 pr-1 py-1 whitespace-nowrap text-xs shrink-0",
                    draggedOverIndex === index && "drag-over"
                  )}
                >
                  <GripVertical className="drag-handle h-3 w-3 shrink-0 text-muted-foreground" />
                  <span className="font-medium truncate max-w-[110px] sm:max-w-[150px]">
                    {test.name}
                  </span>
                  <span className="text-muted-foreground hidden sm:inline">•</span>
                  <span className="text-brand-pink font-semibold hidden sm:inline">
                    £{test.price.toFixed(0)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveTest(test.id)}
                    aria-label={`Remove ${test.name}`}
                    className="h-5 w-5 rounded-full hover:bg-destructive/10 hover:text-destructive ml-0.5 shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
            <Button
              onClick={onCompare}
              disabled={orderedTests.length < 2}
              className={cn(
                "gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white font-heading font-bold",
                orderedTests.length < 2 && "opacity-50 cursor-not-allowed"
              )}
            >
              Compare Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {orderedTests.length === 1 && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Tip: add at least one more test to compare side-by-side.
          </p>
        )}
      </div>
    </div>
  );
};
