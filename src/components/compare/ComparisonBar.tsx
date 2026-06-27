import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompareTestData } from "@/services/CompareService";
import { X, ArrowRight, GitCompare, GripVertical } from "lucide-react";
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
  onClearAll
}: ComparisonBarProps) => {
  const [orderedTests, setOrderedTests] = React.useState(selectedTests);

  React.useEffect(() => {
    setOrderedTests(selectedTests);
  }, [selectedTests]);

  const { onDragStart, onDragEnd, onDragOver, onDrop, draggedOverIndex } = useDraggable({
    items: orderedTests,
    onReorder: setOrderedTests,
    getId: (test) => test.id,
  });

  if (selectedTests.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl animate-slideUp"
      role="region"
      aria-label="Comparison tray"
    >
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Selected Tests */}
          <div className="flex items-center gap-3 flex-1 overflow-hidden min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <GitCompare className="h-5 w-5 text-brand-navy" />
              <span className="font-heading font-bold text-sm whitespace-nowrap text-brand-navy hidden sm:inline">
                Comparing
              </span>
              <Badge className="bg-brand-navy text-white">
                {selectedTests.length}/5
              </Badge>
            </div>

            {/* Selected Test Pills — horizontal scroll on overflow */}
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
