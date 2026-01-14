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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  ChevronRight,
  ArrowUpDown,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProviderTestRow } from "@/hooks/queries/useProvidersByTestType";
import { getProviderLogo, getProviderDisplayName } from "@/utils/providerUtils";

interface GroupedTestsTableProps {
  tests: ProviderTestRow[];
  title?: string;
  onFavorite?: (testId: string) => void;
  favoriteIds?: string[];
}

type SortField = "name" | "lowestPrice" | "providers" | "biomarkers";
type SortDirection = "asc" | "desc";

interface TestGroup {
  normalisedName: string;
  displayName: string;
  category: string | undefined;
  providers: ProviderTestRow[];
  lowestPrice: number;
  highestPrice: number;
  avgBiomarkers: number;
}

export const GroupedTestsTable: React.FC<GroupedTestsTableProps> = ({
  tests,
  title = "Tests by Type",
  onFavorite,
  favoriteIds = [],
}) => {
  const [sortField, setSortField] = useState<SortField>("providers");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group tests by normalised name
  const groupedTests = useMemo((): TestGroup[] => {
    const groups = new Map<string, ProviderTestRow[]>();
    
    tests.forEach((test) => {
      // Create a normalised key for grouping similar tests
      const key = test.testName
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[^\w\s]/g, "")
        .trim();
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(test);
    });
    
    // Convert to array with computed stats
    const groupArray: TestGroup[] = Array.from(groups.entries()).map(([key, providers]) => {
      const prices = providers.map(p => p.price);
      const biomarkers = providers.map(p => p.biomarkerCount || 0).filter(b => b > 0);
      
      return {
        normalisedName: key,
        displayName: providers[0].testName,
        category: providers[0].category,
        providers: providers.sort((a, b) => a.price - b.price),
        lowestPrice: Math.min(...prices),
        highestPrice: Math.max(...prices),
        avgBiomarkers: biomarkers.length > 0 
          ? Math.round(biomarkers.reduce((a, b) => a + b, 0) / biomarkers.length)
          : 0,
      };
    });

    // Sort groups
    groupArray.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.displayName.localeCompare(b.displayName);
          break;
        case "lowestPrice":
          comparison = a.lowestPrice - b.lowestPrice;
          break;
        case "providers":
          comparison = a.providers.length - b.providers.length;
          break;
        case "biomarkers":
          comparison = a.avgBiomarkers - b.avgBiomarkers;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return groupArray;
  }, [tests, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "lowestPrice" ? "asc" : "desc");
    }
  };

  const toggleGroupExpansion = (key: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedGroups(new Set(groupedTests.map(g => g.normalisedName)));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return (
      <ChevronDown 
        className={cn(
          "h-3 w-3 ml-1 transition-transform",
          sortDirection === "asc" && "rotate-180"
        )} 
      />
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {groupedTests.length} test types • {tests.length} total options
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      {/* Grouped Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead 
                  className="min-w-[200px] cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => toggleSort("name")}
                >
                  <span className="flex items-center font-semibold">
                    Test Type
                    <SortIcon field="name" />
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => toggleSort("providers")}
                >
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Providers
                    <SortIcon field="providers" />
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => toggleSort("lowestPrice")}
                >
                  <span className="flex items-center">
                    Price Range
                    <SortIcon field="lowestPrice" />
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
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedTests.map((group) => {
                const isExpanded = expandedGroups.has(group.normalisedName);
                const cheapestProvider = group.providers[0];
                
                return (
                  <Collapsible
                    key={group.normalisedName}
                    open={isExpanded}
                    onOpenChange={() => toggleGroupExpansion(group.normalisedName)}
                    asChild
                  >
                    <React.Fragment>
                      {/* Main Row */}
                      <CollapsibleTrigger asChild>
                        <TableRow 
                          className={cn(
                            "cursor-pointer hover:bg-muted/30 transition-colors",
                            isExpanded && "bg-muted/20"
                          )}
                        >
                          <TableCell className="py-4">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-semibold text-foreground">
                                {group.displayName}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Click to compare {group.providers.length} provider{group.providers.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Badge variant="secondary" className="font-semibold">
                                {group.providers.length}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {group.providers.length === 1 ? 'provider' : 'providers'}
                              </span>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-600 dark:text-green-400">
                                £{group.lowestPrice.toFixed(2)}
                              </span>
                              {group.providers.length > 1 && group.lowestPrice !== group.highestPrice && (
                                <>
                                  <span className="text-muted-foreground">-</span>
                                  <span className="text-muted-foreground">
                                    £{group.highestPrice.toFixed(2)}
                                  </span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            {group.avgBiomarkers > 0 ? (
                              <span className="font-medium">{group.avgBiomarkers}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          
                          <TableCell>
                            {group.category && (
                              <Badge variant="outline" className="text-xs">
                                {group.category}
                              </Badge>
                            )}
                          </TableCell>
                          
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                            >
                              Compare
                              <ChevronDown className={cn(
                                "h-3 w-3 transition-transform",
                                isExpanded && "rotate-180"
                              )} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      
                      {/* Expanded Provider Rows */}
                      <CollapsibleContent asChild>
                        <React.Fragment>
                          {group.providers.map((test, idx) => {
                            const isCheapest = test.price === group.lowestPrice;
                            const isFavorite = favoriteIds.includes(test.id);
                            
                            return (
                              <TableRow 
                                key={test.id}
                                className="bg-muted/10 hover:bg-muted/20 border-l-4 border-l-primary/30"
                              >
                                <TableCell></TableCell>
                                
                                <TableCell className="pl-8">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={getProviderLogo(test.provider)}
                                      alt={test.provider}
                                      className="h-6 w-auto object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                    <span className="font-medium">
                                      {getProviderDisplayName(test.provider)}
                                    </span>
                                    {isCheapest && group.providers.length > 1 && (
                                      <Badge className="bg-green-600 text-xs py-0 h-5">
                                        Best Price
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                
                                <TableCell>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Home className="h-3 w-3" />
                                      {test.homeKitAvailable ? (
                                        <Check className="h-3 w-3 text-green-600" />
                                      ) : (
                                        <XIcon className="h-3 w-3 text-muted-foreground/50" />
                                      )}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Building2 className="h-3 w-3" />
                                      {test.clinicVisitAvailable ? (
                                        <Check className="h-3 w-3 text-green-600" />
                                      ) : (
                                        <XIcon className="h-3 w-3 text-muted-foreground/50" />
                                      )}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Stethoscope className="h-3 w-3" />
                                      {test.gpReviewIncluded ? (
                                        <Check className="h-3 w-3 text-green-600" />
                                      ) : (
                                        <XIcon className="h-3 w-3 text-muted-foreground/50" />
                                      )}
                                    </span>
                                  </div>
                                </TableCell>
                                
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <span className={cn(
                                      "font-bold",
                                      isCheapest ? "text-green-600 dark:text-green-400" : "text-foreground"
                                    )}>
                                      £{test.price.toFixed(2)}
                                    </span>
                                    {test.originalPrice && test.originalPrice > test.price && (
                                      <span className="text-xs text-muted-foreground line-through">
                                        £{test.originalPrice.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                
                                <TableCell>
                                  {test.biomarkerCount ? (
                                    <span>{test.biomarkerCount}</span>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                
                                <TableCell>
                                  {test.turnaroundDays ? (
                                    <span className="text-sm flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {test.turnaroundDays} days
                                    </span>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">2-5 days</span>
                                  )}
                                </TableCell>
                                
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onFavorite?.(test.id);
                                      }}
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
                                    
                                    {test.url ? (
                                      <Button
                                        size="sm"
                                        className="bg-primary hover:bg-primary/90 gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                        asChild
                                      >
                                        <a 
                                          href={test.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                        >
                                          Order
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => e.stopPropagation()}
                                        asChild
                                      >
                                        <a href={`/${test.provider}/${encodeURIComponent(test.testName)}`}>
                                          View
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </React.Fragment>
                      </CollapsibleContent>
                    </React.Fragment>
                  </Collapsible>
                );
              })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default GroupedTestsTable;
