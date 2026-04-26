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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl animate-slideUp">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Selected Tests */}
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm whitespace-nowrap">
                Compare Tests
              </span>
              <Badge variant="default" className="bg-primary">
                {selectedTests.length}
              </Badge>
            </div>

            {/* Selected Test Pills */}
            <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
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
                    "draggable-element flex items-center gap-2 bg-muted rounded-full pl-2 pr-2 py-1 whitespace-nowrap text-xs",
                    draggedOverIndex === index && "drag-over"
                  )}
                >
                  <GripVertical className="drag-handle h-3 w-3 shrink-0" />
                  <span className="font-medium truncate max-w-[150px]">
                    {test.name}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-primary font-semibold">
                    £{test.price.toFixed(0)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveTest(test.id)}
                    className="h-5 w-5 rounded-full hover:bg-destructive/10 hover:text-destructive ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
            
            <Button
              onClick={onCompare}
              disabled={orderedTests.length < 2}
              className={cn(
                "gap-2 bg-primary hover:bg-primary/90",
                orderedTests.length < 2 && "opacity-50 cursor-not-allowed"
              )}
            >
              Compare {orderedTests.length > 1 ? `${orderedTests.length} Tests` : ''}
            </Button>
          </div>
        </div>

        {orderedTests.length === 1 && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Select at least one more test to compare
          </p>
        )}
      </div>
    </div>
  );
};
