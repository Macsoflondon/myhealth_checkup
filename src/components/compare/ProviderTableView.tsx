import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  ExternalLink, 
  Check, 
  X as XIcon,
  Clock,
  Beaker,
  Home,
  Building2,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProviderTestRow } from "@/hooks/queries/useProvidersByTestType";
import { getProviderLogo, getProviderDisplayName } from "@/utils/providerUtils";

interface ProviderTableViewProps {
  tests: ProviderTestRow[];
  title?: string;
  showLiveUpdates?: boolean;
  onFavorite?: (testId: string) => void;
  favoriteIds?: string[];
}

type SortField = "price" | "biomarkers" | "turnaround" | "provider";
type SortDirection = "asc" | "desc";

export const ProviderTableView: React.FC<ProviderTableViewProps> = ({
  tests,
  title = "Compare Providers",
  showLiveUpdates = true,
  onFavorite,
  favoriteIds = [],
}) => {
  const [liveUpdates, setLiveUpdates] = useState(false);
  const [sortField, setSortField] = useState<SortField>("price");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Group tests by normalised name
  const groupedTests = useMemo(() => {
    const groups = new Map<string, ProviderTestRow[]>();
    
    tests.forEach((test) => {
      // Create a normalised key for grouping similar tests
      const key = test.testName
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(test);
    });
    
    // Sort each group by the selected field
    groups.forEach((groupTests) => {
      groupTests.sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case "price":
            comparison = a.price - b.price;
            break;
          case "biomarkers":
            comparison = (a.biomarkerCount || 0) - (b.biomarkerCount || 0);
            break;
          case "turnaround":
            comparison = (a.turnaroundDays || 99) - (b.turnaroundDays || 99);
            break;
          case "provider":
            comparison = a.provider.localeCompare(b.provider);
            break;
        }
        return sortDirection === "asc" ? comparison : -comparison;
      });
    });
    
    return groups;
  }, [tests, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleRowExpansion = (key: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const lowestPrice = useMemo(() => {
    return Math.min(...tests.map((t) => t.price));
  }, [tests]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3 ml-1" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1" />
    );
  };

  if (tests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No tests found for comparison.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {tests.length} {tests.length === 1 ? "result" : "results"} found
          </p>
        </div>
        
        {showLiveUpdates && (
          <div className="flex items-center gap-2">
            <Switch
              id="live-updates"
              checked={liveUpdates}
              onCheckedChange={setLiveUpdates}
            />
            <Label htmlFor="live-updates" className="text-sm cursor-pointer">
              Live Updates
            </Label>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[200px] font-semibold sticky left-0 bg-muted/50 z-10">
                  Test / Service
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => toggleSort("provider")}
                >
                  <span className="flex items-center">
                    Provider
                    <SortIcon field="provider" />
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => toggleSort("price")}
                >
                  <span className="flex items-center">
                    Price
                    <SortIcon field="price" />
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => toggleSort("biomarkers")}
                >
                  <span className="flex items-center">
                    <Beaker className="h-4 w-4 mr-1" />
                    Biomarkers
                    <SortIcon field="biomarkers" />
                  </span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Turnaround
                  </span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    Home Kit
                  </span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    Clinic
                  </span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center">
                    <Stethoscope className="h-4 w-4 mr-1" />
                    GP Review
                  </span>
                </TableHead>
                <TableHead className="text-center">Save</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from(groupedTests.entries()).map(([key, groupTests]) => (
                <React.Fragment key={key}>
                  {groupTests.map((test, idx) => {
                    const isLowestPrice = test.price === lowestPrice;
                    const isFavorite = favoriteIds.includes(test.id);
                    
                    return (
                      <TableRow 
                        key={test.id}
                        className={cn(
                          "hover:bg-muted/30 transition-colors",
                          idx === 0 && "border-t-2 border-border"
                        )}
                      >
                        <TableCell className="font-medium sticky left-0 bg-card z-10">
                          <div className="max-w-[180px]">
                            <p className="truncate font-semibold text-sm">
                              {test.testName}
                            </p>
                            {test.category && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {test.category}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img
                              src={getProviderLogo(test.provider)}
                              alt={test.provider}
                              className="h-6 w-auto object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <span className="text-sm font-medium">
                              {getProviderDisplayName(test.provider)}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-bold",
                              isLowestPrice ? "text-green-600 dark:text-green-400" : "text-foreground"
                            )}>
                              £{test.price.toFixed(2)}
                            </span>
                            {isLowestPrice && (
                              <Badge className="bg-green-600 text-xs py-0 h-5">
                                Best Price
                              </Badge>
                            )}
                            {test.originalPrice && test.originalPrice > test.price && (
                              <span className="text-xs text-muted-foreground line-through">
                                £{test.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {test.biomarkerCount ? (
                            <span className="font-medium">{test.biomarkerCount}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {test.turnaroundDays ? (
                            <span>{test.turnaroundDays} days</span>
                          ) : (
                            <span className="text-muted-foreground">2-5 days</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {test.homeKitAvailable ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <XIcon className="h-5 w-5 text-muted-foreground/50" />
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {test.clinicVisitAvailable ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <XIcon className="h-5 w-5 text-muted-foreground/50" />
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {test.gpReviewIncluded ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <XIcon className="h-5 w-5 text-muted-foreground/50" />
                          )}
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onFavorite?.(test.id)}
                            className={cn(
                              "h-8 w-8",
                              isFavorite && "text-red-500"
                            )}
                          >
                            <Heart 
                              className={cn(
                                "h-4 w-4",
                                isFavorite && "fill-current"
                              )} 
                            />
                          </Button>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          {test.url ? (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 gap-1"
                              asChild
                            >
                              <a 
                                href={test.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                Order Now
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <a href={`/${test.provider}/${encodeURIComponent(test.testName)}`}>
                                View Details
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProviderTableView;
