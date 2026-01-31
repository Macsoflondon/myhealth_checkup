import React, { useState } from "react";
import { CompareTestData } from "@/services/CompareService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  X, 
  Check,
  Heart,
  ExternalLink,
  RefreshCw
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
  const [liveUpdates, setLiveUpdates] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (testId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testId)) {
        newSet.delete(testId);
      } else {
        newSet.add(testId);
      }
      return newSet;
    });
  };
  
  if (tests.length === 0) return null;

  // Helper to get service location text
  const getServiceLocation = (test: CompareTestData) => {
    const collection = test.features?.collection?.toLowerCase() || "";
    if (collection.includes("home") && collection.includes("clinic")) {
      return "Home kit or clinic";
    }
    if (collection.includes("home")) {
      return "Home kit";
    }
    if (collection.includes("clinic")) {
      return "Clinic only";
    }
    return "Home kit or clinic";
  };

  // Helper to get biomarker count text
  const getBiomarkerText = (test: CompareTestData) => {
    if (test.biomarkerCount) {
      return `${test.biomarkerCount}+ markers`;
    }
    return "Multiple markers";
  };

  // Helper to get turnaround time text
  const getTurnaroundText = (test: CompareTestData) => {
    if (test.turnaroundDays) {
      if (test.turnaroundDays === 1) return "1-2 days";
      if (test.turnaroundDays <= 3) return `${test.turnaroundDays}-${test.turnaroundDays + 1} days`;
      return `${test.turnaroundDays}-${test.turnaroundDays + 2} days`;
    }
    return test.features?.turnaround || "2-5 days";
  };

  // Row labels matching reference image
  const rows = [
    { 
      key: "biomarkers", 
      label: "Bio Markers",
      render: (test: CompareTestData) => getBiomarkerText(test)
    },
    { 
      key: "turnaround", 
      label: "Turnaround Time",
      render: (test: CompareTestData) => getTurnaroundText(test)
    },
    { 
      key: "location", 
      label: "Service Location",
      render: (test: CompareTestData) => getServiceLocation(test)
    },
    { 
      key: "doctorReview", 
      label: "Doctor Review",
      render: (test: CompareTestData) => (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      )
    },
    { 
      key: "detailedReport", 
      label: "Detailed report",
      render: (test: CompareTestData) => (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      )
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] p-0 bg-background">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                {tests.length} results found
              </DialogTitle>
              <DialogDescription className="sr-only">
                Compare {tests.length} selected tests side-by-side
              </DialogDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <RefreshCw className={cn(
                  "h-4 w-4 text-muted-foreground",
                  liveUpdates && "animate-spin"
                )} />
                <span className="text-sm text-muted-foreground">Live Updates {liveUpdates ? "On" : "Off"}</span>
                <Switch
                  id="live-updates"
                  checked={liveUpdates}
                  onCheckedChange={setLiveUpdates}
                />
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
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="min-w-[800px]">
            {/* Table */}
            <table className="w-full border-collapse">
              <thead>
                {/* Test/Service Header Row */}
                <tr className="border-b border-border">
                  <th className="py-4 px-4 text-left text-sm font-medium text-muted-foreground w-[160px] bg-background sticky left-0 z-10">
                    Test / Service
                  </th>
                  {tests.map((test) => (
                    <th key={test.id} className="py-4 px-4 text-center min-w-[180px]">
                      <div className="flex flex-col items-center gap-2">
                        {/* Provider Logo / Test Image */}
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {test.providerLogo ? (
                            <img 
                              src={test.providerLogo} 
                              alt={test.provider}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                          )}
                        </div>
                        {/* Test Name */}
                        <span className="font-semibold text-sm text-foreground line-clamp-2">
                          {test.name}
                        </span>
                        {/* Price */}
                        <span className="font-bold text-primary text-lg">
                          £{test.price.toFixed(2)}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr 
                    key={row.key}
                    className={cn(
                      "border-b border-border",
                      idx % 2 === 0 ? "bg-muted/20" : "bg-background"
                    )}
                  >
                    <td className={cn(
                      "py-4 px-4 text-sm font-medium text-foreground sticky left-0 z-10",
                      idx % 2 === 0 ? "bg-muted/20" : "bg-background"
                    )}>
                      {row.label}
                    </td>
                    {tests.map((test) => (
                      <td key={test.id} className="py-4 px-4 text-center text-sm text-foreground">
                        {row.render(test)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Save Row */}
                <tr className="border-b border-border">
                  <td className="py-4 px-4 text-sm font-medium text-foreground bg-background sticky left-0 z-10">
                    Save
                  </td>
                  {tests.map((test) => (
                    <td key={test.id} className="py-4 px-4 text-center">
                      <button 
                        onClick={() => toggleFavorite(test.id)}
                        className="mx-auto block"
                      >
                        <Heart 
                          className={cn(
                            "h-5 w-5 transition-colors",
                            favorites.has(test.id) 
                              ? "text-red-500 fill-red-500" 
                              : "text-muted-foreground hover:text-red-500"
                          )} 
                        />
                      </button>
                    </td>
                  ))}
                </tr>

                {/* Order Row */}
                <tr>
                  <td className="py-6 px-4 text-sm font-medium text-foreground bg-background sticky left-0 z-10">
                    Order
                  </td>
                  {tests.map((test) => (
                    <td key={test.id} className="py-6 px-4 text-center">
                      <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
                        asChild
                      >
                        <a 
                          href={test.url || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Order Now
                        </a>
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Compare health services across leading providers
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
