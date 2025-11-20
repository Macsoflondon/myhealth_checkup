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

      {/* Test Cards Grid - Responsive */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tests.map(test => {
        const isFavorite = favorites.includes(test.id);
        const isOutOfStock = test.available === false;
        const isSelected = selectedTestIds.includes(test.id);
        return <Card 
          key={test.id} 
          interactive
          className={cn("group transition-all shadow-elevation-2 bg-surface relative rounded-xl", isOutOfStock && "opacity-60", isSelected && "ring-2 ring-primary shadow-elevation-4")}
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
              
              <CardContent className="p-6 bg-surface">
                {/* Provider Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("flex items-center gap-3", onTestSelect && "ml-10")}>
                    <Avatar className="h-10 w-10 shadow-elevation-1">
                      <AvatarImage src={test.providerLogo} alt={test.provider} />
                      <AvatarFallback className="text-xs">{test.provider.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-body-medium font-medium">{test.provider}</p>
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

                {/* Badges: Popular, Accreditations, Biomarkers, Fast Turnaround */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {test.popularityScore && test.popularityScore >= 70 && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  
                  {test.accreditations?.map(acc => (
                    <Badge key={acc} variant="outline" className="text-xs border-blue-200 text-blue-700">
                      <Award className="h-3 w-3 mr-1" />
                      {acc}
                    </Badge>
                  ))}
                  
                  {test.biomarkerCount && test.biomarkerCount >= 15 && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                      <TestTube className="h-3 w-3 mr-1" />
                      {test.biomarkerCount} biomarkers
                    </Badge>
                  )}
                  
                  {test.turnaroundDays && test.turnaroundDays <= 2 && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Fast results
                    </Badge>
                  )}
                </div>

                {/* Test Info */}
                <div className="mb-4">
                  <h3 className="text-headline-small font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {test.name}
                  </h3>
                  <p className="text-body-medium text-muted-foreground line-clamp-2 mb-3">
                    {test.description || "Comprehensive health screening"}
                  </p>
                  
                  {/* Test Features */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-body-medium text-muted-foreground">Biomarkers:</span>
                      <span className="text-body-medium font-medium">{test.features?.bioMarkers || 'Multiple'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-medium text-muted-foreground">Turnaround:</span>
                      <Badge variant="secondary">
                        {test.features?.turnaround || '1-2 days'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-medium text-muted-foreground">Collection:</span>
                      <span className="text-body-medium font-medium">{test.features?.collection || 'At home'}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-headline-large font-bold text-primary">
                        £{test.price.toFixed(2)}
                      </p>
                      {isOutOfStock && <Badge variant="destructive" className="mt-1">
                          Out of Stock
                        </Badge>}
                    </div>
                    
                  <Button onClick={() => handlePlaceOrder(test.id, test.provider)} disabled={isOutOfStock || !user} size="default" className="bg-primary hover:bg-primary/92 text-primary-foreground">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Select Test
                  </Button>
                </div>
                
                {/* Price Alert Button */}
                {user && (
                  <div className="mb-3">
                    <AddPriceAlertButton
                      testId={test.id}
                      testName={test.name}
                      provider={test.provider}
                      userId={user.id}
                      currentPrice={test.price}
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-body-medium text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Results in {test.features?.turnaround || '1-2 days'}</span>
                    <span>•</span>
                    <span className="font-medium">Free shipping</span>
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>
    </div>;
};