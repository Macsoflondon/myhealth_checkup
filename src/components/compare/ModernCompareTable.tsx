import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Clock, Star, ShoppingCart, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useOrders } from "@/hooks/useOrders";
import type { CompareTestData } from "@/services/CompareService";
interface ModernCompareTableProps {
  tests: CompareTestData[];
  selectedCategory?: string;
}
export const ModernCompareTable = ({
  tests,
  selectedCategory
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
      {tests.length > 0 && <div className="grid gap-4 md:grid-cols-3 mb-8 bg-white">
          <Card className="border-health-primary/50 bg-white shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center gap-2 text-[#e70d69] text-lg font-bold">
                <Award className="h-4 w-4 text-health-primary" />
                <span className="text-health-primary font-semibold text-base">Best Value</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-[#081129] font-medium text-sm">
                Most comprehensive test for the price
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-health-secondary/50 bg-white shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center gap-2 text-lg font-bold">
                <Clock className="h-4 w-4 text-health-secondary" />
                <span className="text-health-secondary font-semibold text-base">Fastest Results</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center text-[#081129] font-medium">
                Get your results in 24-48 hours
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-health-accent/50 bg-white shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center gap-2 text-lg font-bold">
                <Star className="h-4 w-4 text-health-accent" />
                <span className="text-health-accent text-base font-semibold">Most Popular</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center font-medium text-[#081129]">
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
        return <Card key={test.id} className={cn("group hover:shadow-xl transition-all duration-300 border-border/50 bg-white", isOutOfStock && "opacity-60")}>
              <CardContent className="p-4 sm:p-6 bg-white">
                {/* Provider Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src={test.providerLogo} alt={test.provider} />
                      <AvatarFallback className="text-xs">{test.provider.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-bold sm:text-sm text-[#081129]">{test.provider}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm text-[#081129]">4.8</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={() => handleToggleFavorite(test.id)} className={cn("hover:bg-pink-50 min-h-[44px] min-w-[44px] p-0", isFavorite ? "text-pink-500" : "text-muted-foreground")} disabled={!user}>
                    <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                  </Button>
                </div>

                {/* Test Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-health-primary transition-colors text-[#081129]">
                    {test.name}
                  </h3>
                  <p className="text-sm sm:text-base line-clamp-2 mb-3 text-[#081129]">
                    {test.description || "Comprehensive health screening"}
                  </p>
                  
                  {/* Test Features - Responsive */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Biomarkers:</span>
                      <span className="font-medium text-sm text-[#081129]">{test.features?.bioMarkers || 'Multiple'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Turnaround:</span>
                      <Badge variant="secondary" className="text-xs h-5">
                        {test.features?.turnaround || '1-2 days'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Collection:</span>
                      <span className="font-medium text-sm text-[#081129]">{test.features?.collection || 'At home'}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-[#22c0d4]">
                        £{test.price.toFixed(2)}
                      </p>
                      {isOutOfStock && <Badge variant="destructive" className="text-xs mt-1">
                          Out of Stock
                        </Badge>}
                    </div>
                    
                    <Button onClick={() => handlePlaceOrder(test.id, test.provider)} disabled={isOutOfStock || !user} size="sm" className="bg-[#22c0d4] hover:bg-[#1aa8ba] text-sm sm:text-base px-4 sm:px-6 text-white min-h-[44px] touch-manipulation active:scale-95 transition-transform">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Select Test</span>
                      <span className="sm:hidden">Select</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-[#22c0d4]" />
                    <span className="font-medium text-[#081129]">Results in {test.features?.turnaround || '1-2 days'}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-medium text-[#081129]">Free shipping</span>
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>
    </div>;
};