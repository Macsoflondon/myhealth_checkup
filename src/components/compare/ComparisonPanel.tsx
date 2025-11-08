import React, { useState } from "react";
import { CompareTestData } from "@/services/CompareService";
import { RecommendationEngine } from "./RecommendationEngine";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  PoundSterling,
  Beaker,
  TrendingUp,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonPanelProps {
  tests: CompareTestData[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveTest: (testId: string) => void;
}

export const ComparisonPanel = ({
  tests,
  isOpen,
  onClose,
  onRemoveTest
}: ComparisonPanelProps) => {
  const [highlightedTestId, setHighlightedTestId] = useState<string | null>(null);
  
  if (tests.length === 0) return null;

  const comparisonFeatures = [
    { 
      key: 'price', 
      label: 'Price', 
      icon: PoundSterling,
      render: (test: CompareTestData) => `£${test.price.toFixed(2)}`
    },
    { 
      key: 'provider', 
      label: 'Provider', 
      icon: TrendingUp,
      render: (test: CompareTestData) => test.provider
    },
    { 
      key: 'turnaround', 
      label: 'Turnaround Time', 
      icon: Clock,
      render: (test: CompareTestData) => test.features.turnaround
    },
    { 
      key: 'collection', 
      label: 'Sample Collection', 
      icon: Beaker,
      render: (test: CompareTestData) => test.features.collection
    },
    { 
      key: 'bioMarkers', 
      label: 'Key Biomarkers', 
      icon: Beaker,
      render: (test: CompareTestData) => test.features.bioMarkers || 'See full description'
    },
  ];

  // Find best value (lowest price)
  const lowestPrice = Math.min(...tests.map(t => t.price));
  
  // Find fastest turnaround
  const turnaroundValues = tests.map(t => {
    const turnaround = t.features.turnaround.toLowerCase();
    if (turnaround.includes('same day') || turnaround.includes('24h')) return 1;
    if (turnaround.includes('48') || turnaround.includes('2 day')) return 2;
    if (turnaround.includes('3') || turnaround.includes('5 day')) return 5;
    if (turnaround.includes('week')) return 7;
    return 14;
  });
  const fastestTurnaround = Math.min(...turnaroundValues);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-background">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Test Comparison
              </DialogTitle>
              <DialogDescription className="mt-1">
                Compare {tests.length} selected tests side-by-side
              </DialogDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="comparison" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Side-by-Side
              </TabsTrigger>
              <TabsTrigger value="recommendation" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Recommendation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-6">
              {/* Test Headers */}
              <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${tests.length}, minmax(250px, 1fr))` }}>
                <div className="font-semibold text-muted-foreground sticky left-0 bg-background z-10">
                  Test Details
                </div>
                {tests.map((test) => (
                  <div 
                    key={test.id}
                    className={cn(
                      "relative bg-card rounded-lg border border-border p-4 shadow-sm transition-all",
                      highlightedTestId === test.id && "ring-2 ring-green-500 shadow-lg"
                    )}
                  >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveTest(test.id)}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  <div className="mb-2">
                    <img 
                      src={test.providerLogo} 
                      alt={test.provider}
                      className="h-8 object-contain mb-2"
                    />
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-2 pr-6 line-clamp-2">
                    {test.name}
                  </h3>
                  
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {test.category}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Comparison Rows */}
            <div className="space-y-0 border border-border rounded-lg overflow-hidden">
              {comparisonFeatures.map((feature, idx) => (
                <div 
                  key={feature.key}
                  className={cn(
                    "grid gap-4 py-3 px-4",
                    idx % 2 === 0 ? "bg-muted/30" : "bg-background"
                  )}
                  style={{ gridTemplateColumns: `200px repeat(${tests.length}, minmax(250px, 1fr))` }}
                >
                  <div className="flex items-center gap-2 font-medium text-sm sticky left-0 z-10" style={{ backgroundColor: idx % 2 === 0 ? 'hsl(var(--muted) / 0.3)' : 'hsl(var(--background))' }}>
                    <feature.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{feature.label}</span>
                  </div>
                  
                  {tests.map((test, testIdx) => {
                    const value = feature.render(test);
                    const isBestPrice = feature.key === 'price' && test.price === lowestPrice;
                    const isFastestTurnaround = feature.key === 'turnaround' && 
                      turnaroundValues[testIdx] === fastestTurnaround;
                    
                    return (
                      <div 
                        key={test.id}
                        className={cn(
                          "flex items-center gap-2 text-sm px-4 py-2 rounded",
                          isBestPrice && "bg-green-50 dark:bg-green-950/30 font-semibold",
                          isFastestTurnaround && "bg-blue-50 dark:bg-blue-950/30 font-semibold"
                        )}
                      >
                        {isBestPrice && (
                          <Badge variant="default" className="bg-green-600 text-xs h-5">
                            Best Price
                          </Badge>
                        )}
                        {isFastestTurnaround && !isBestPrice && (
                          <Badge variant="default" className="bg-blue-600 text-xs h-5">
                            Fastest
                          </Badge>
                        )}
                        <span className={cn(
                          feature.key === 'bioMarkers' && "line-clamp-3",
                          isBestPrice || isFastestTurnaround ? "font-semibold" : ""
                        )}>
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Descriptions */}
            <div className="space-y-4 mt-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Beaker className="h-5 w-5 text-primary" />
                Full Descriptions
              </h3>
              
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${tests.length}, minmax(300px, 1fr))` }}>
                {tests.map((test) => (
                  <div 
                    key={test.id}
                    className="bg-card rounded-lg border border-border p-4 space-y-3"
                  >
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{test.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-4">
                        {test.description || 'No detailed description available.'}
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full gap-2"
                      asChild
                    >
                      <a href={`#`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                        View Full Details
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendation" className="space-y-6">
            <RecommendationEngine 
              tests={tests}
              onRecommendationGenerated={setHighlightedTestId}
            />
          </TabsContent>
        </Tabs>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Comparing {tests.length} {tests.length === 1 ? 'test' : 'tests'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close Comparison
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
