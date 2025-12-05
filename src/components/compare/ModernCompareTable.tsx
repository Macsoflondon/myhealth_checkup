import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Clock, Star, ShoppingCart, TrendingUp, Award, TestTube, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useOrders } from "@/hooks/useOrders";
import type { CompareTestData } from "@/services/CompareService";
import { DataSourceIndicator } from "./DataSourceIndicator";
import { AddPriceAlertButton } from "./AddPriceAlertButton";

interface ModernCompareTableProps {
  tests: CompareTestData[];
  selectedCategory?: string;
  selectedTestIds?: string[];
  onTestSelect?: (testId: string) => void;
}
export const ModernCompareTable = ({
  tests,
  selectedCategory,
  selectedTestIds = [],
  onTestSelect
}: ModernCompareTableProps) => {
  const {
    user
  } = useAuth();
  const {
    favorites,
    toggleFavorite
  } = useFavorites(user, selectedCategory || 'general');
  const {
    placeOrder
  } = useOrders(user);
  const handleToggleFavorite = async (testId: string) => {
    if (!user) return;
    const test = tests.find(t => t.id === testId);
    if (test) {
      await toggleFavorite(testId, test);
    }
  };
  const handlePlaceOrder = (testId: string, provider: string) => {
    if (!user) return;
    const test = tests.find(t => t.id === testId);
    if (test) {
      placeOrder(test.id, provider, test.name, test.price);
    }
  };
  if (tests.length === 0) {
    return <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No tests found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search terms to find more tests.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset Filters
          </Button>
        </div>
      </div>;
  }
  
  return <div className="space-y-4">
      {/* Featured/Best Value Cards */}
      {tests.length > 0 && <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-primary shadow-elevation-2 hover:shadow-elevation-3">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-headline-small font-medium text-primary">Best Value</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-body-medium font-medium">
                Most comprehensive test for the price
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-secondary shadow-elevation-2 hover:shadow-elevation-3">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                <span className="text-headline-small font-medium text-secondary">Fastest Results</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-body-medium text-center font-medium">
                Get your results in 24-48 hours
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-tertiary shadow-elevation-2 hover:shadow-elevation-3">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-tertiary" />
                <span className="text-headline-small font-medium text-tertiary">Most Popular</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-body-medium text-center font-medium">
                Chosen by thousands of customers
              </p>
            </CardContent>
          </Card>
        </div>}

      {/* Test Cards Grid - Mobile-first Responsive */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tests.map(test => {
        const isFavorite = favorites.includes(test.id);
        const isOutOfStock = test.available === false;
        const isSelected = selectedTestIds.includes(test.id);
        return <Card 
          key={test.id} 
          interactive
          className={cn(
            "group transition-all shadow-elevation-2 bg-surface relative rounded-xl",
            "touch-manipulation", // Better touch response on mobile
            isOutOfStock && "opacity-60", 
            isSelected && "ring-2 ring-primary shadow-elevation-4"
          )}
        >
              {/* Selection Checkbox */}
              {onTestSelect && (
                <div className="absolute top-3 left-3 z-10">
                  <div className={cn("bg-surface rounded-md border-2 p-1 shadow-elevation-1 transition-all", isSelected && "border-primary bg-primary-container")}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onTestSelect(test.id)}
                      className="h-5 w-5"
                    />
                  </div>
                </div>
              )}
              
              <CardContent className="p-4 sm:p-5 md:p-6 bg-surface">
                {/* Provider Header - Optimized for mobile */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={cn("flex items-center gap-2 sm:gap-3", onTestSelect && "ml-8 sm:ml-10")}>
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shadow-elevation-1 flex-shrink-0">
                      <AvatarImage 
                        src={test.providerLogo} 
                        alt={test.provider}
                        loading="lazy"
                        decoding="async"
                      />
                      <AvatarFallback className="text-xs">{test.provider.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-body-small sm:text-body-medium font-medium truncate">{test.provider}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-body-small font-semibold">4.8</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(test.id)} className={cn("hover:bg-secondary-container", isFavorite ? "text-secondary" : "text-muted-foreground")} disabled={!user}>
                    <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                  </Button>
                </div>
                
                {/* Data Source Indicator */}
                {test.dataSource && (
                  <div className="mb-3">
                    <DataSourceIndicator 
                      source={test.dataSource}
                      timestamp={test.lastUpdated}
                      providerName={test.provider}
                    />
                  </div>
                )}

                {/* Badges: Popular, Accreditations, Biomarkers, Fast Turnaround - Mobile optimized */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                  {test.popularityScore && test.popularityScore >= 70 && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px] sm:text-xs px-1.5 py-0.5">
                      <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      Popular
                    </Badge>
                  )}
                  
                  {test.accreditations?.slice(0, 2).map(acc => (
                    <Badge key={acc} variant="outline" className="text-[10px] sm:text-xs border-blue-200 text-blue-700 px-1.5 py-0.5">
                      <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      {acc}
                    </Badge>
                  ))}
                  
                  {test.biomarkerCount && test.biomarkerCount >= 15 && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-[10px] sm:text-xs px-1.5 py-0.5">
                      <TestTube className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      <span className="hidden xs:inline">{test.biomarkerCount} biomarkers</span>
                      <span className="xs:hidden">{test.biomarkerCount}</span>
                    </Badge>
                  )}
                  
                  {test.turnaroundDays && test.turnaroundDays <= 2 && (
                    <Badge className="bg-green-100 text-green-800 text-[10px] sm:text-xs px-1.5 py-0.5">
                      <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      Fast
                    </Badge>
                  )}
                </div>

                {/* Test Info - Mobile optimized */}
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-headline-small font-medium mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                    {test.name}
                  </h3>
                  <p className="text-xs sm:text-body-medium text-muted-foreground line-clamp-2 mb-2 sm:mb-3">
                    {test.description || "Comprehensive health screening"}
                  </p>
                  
                  {/* Test Features - Compact on mobile */}
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-body-medium">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Biomarkers:</span>
                      <span className="font-medium">{test.features?.bioMarkers || 'Multiple'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Turnaround:</span>
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">
                        {test.features?.turnaround || '1-2 days'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Collection:</span>
                      <span className="font-medium">{test.features?.collection || 'At home'}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Actions - Mobile optimized */}
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                    <div className="flex-shrink-0">
                      <p className="text-lg sm:text-headline-large font-bold text-primary">
                        £{test.price.toFixed(2)}
                      </p>
                      {isOutOfStock && <Badge variant="destructive" className="mt-1 text-[10px] sm:text-xs">
                          Out of Stock
                        </Badge>}
                    </div>
                    
                  <Button 
                    onClick={() => handlePlaceOrder(test.id, test.provider)} 
                    disabled={isOutOfStock || !user} 
                    size="sm"
                    className="bg-primary hover:bg-primary/92 text-primary-foreground text-xs sm:text-sm px-3 sm:px-4"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    <span className="hidden xs:inline">Select Test</span>
                    <span className="xs:hidden">Select</span>
                  </Button>
                </div>
                
                {/* Price Alert Button - Hidden on smallest screens */}
                {user && (
                  <div className="mb-2 sm:mb-3 hidden xs:block">
                    <AddPriceAlertButton
                      testId={test.id}
                      testName={test.name}
                      provider={test.provider}
                      userId={user.id}
                      currentPrice={test.price}
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-body-medium text-muted-foreground flex-wrap">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <span className="font-medium">{test.features?.turnaround || '1-2 days'}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="font-medium hidden sm:inline">Free shipping</span>
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>
    </div>;
};