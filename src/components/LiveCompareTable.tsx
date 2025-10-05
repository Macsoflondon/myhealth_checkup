import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CompareTestData } from "@/services/LiveCompareService";
import { useFavorites } from "@/hooks/useFavorites";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/context/AuthContext";

interface LiveCompareTableProps {
  tests: CompareTestData[];
  isLoading?: boolean;
  selectedCategory?: string;
}

const LiveCompareTable = ({ tests, isLoading, selectedCategory = "all" }: LiveCompareTableProps) => {
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites(user, selectedCategory);
  const { placeOrder } = useOrders(user);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse overflow-hidden">
            <div className="h-16 bg-muted"></div>
            <CardContent className="p-6 space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-6 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-10 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No tests found matching your criteria.</p>
          <p className="text-muted-foreground mt-2">Try adjusting your search or category selection.</p>
        </CardContent>
      </Card>
    );
  }

  const handleToggleFavorite = async (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (test) {
      await toggleFavorite(testId, {
        provider: test.provider,
        name: test.name,
        price: test.price
      });
    }
  };

  const handlePlaceOrder = async (testId: string, provider: string) => {
    const test = tests.find(t => t.id === testId);
    if (test) {
      await placeOrder(testId, provider, test.name, test.price);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests.map((test) => {
        const isFavorite = favorites.includes(test.id);
        
        return (
          <Card key={test.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Provider Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={test.providerLogo} 
                    alt={test.provider}
                    className="h-8 w-auto object-contain brightness-0 invert"
                  />
                  <span className="font-semibold">{test.provider}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleFavorite(test.id)}
                  className={cn(
                    "shrink-0 hover:bg-white/20",
                    isFavorite ? "text-health-accent" : "text-white"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                </Button>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Test Name */}
              <h3 className="text-lg font-semibold text-foreground leading-tight">
                {test.name}
              </h3>

              {/* Description */}
              {test.description && (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {test.description}
                </p>
              )}

              {/* Results timeframe and biomarkers */}
              <div className="text-sm text-muted-foreground">
                {test.features.turnaround && (
                  <div>Results estimated in {test.features.turnaround}</div>
                )}
                {test.features.bioMarkers && (
                  <div className="mt-1">{test.features.bioMarkers}</div>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {"★".repeat(4)}{"☆".repeat(1)}
                </div>
                <span className="text-sm text-muted-foreground">(234)</span>
              </div>

              {/* Price */}
              <div className="text-center py-2">
                <div className="text-2xl font-bold text-foreground">
                  £{test.price.toFixed(2)}
                </div>
              </div>

              {/* Collection Method */}
              {test.features.collection && (
                <div className="text-center text-sm text-muted-foreground">
                  {test.features.collection}
                </div>
              )}

              {/* Action Button */}
              <Button
                className="w-full bg-gradient-to-r from-health-primary to-health-secondary text-white hover:opacity-90"
                onClick={() => handlePlaceOrder(test.id, test.provider)}
                disabled={!test.available}
              >
                {test.available ? "Select test" : "Out of Stock"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LiveCompareTable;