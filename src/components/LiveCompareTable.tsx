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
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
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
    <div className="space-y-4">
      {tests.map((test) => {
        const isFavorite = favorites.includes(test.id);
        
        return (
          <Card key={test.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-health-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Test Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">{test.name}</h3>
                      <div className="flex items-center gap-2">
                        <img 
                          src={test.providerLogo} 
                          alt={test.provider}
                          className="h-6 w-auto object-contain"
                        />
                        <span className="text-sm font-medium text-muted-foreground">{test.provider}</span>
                        <Badge variant="secondary" className="text-xs">
                          {test.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(test.id)}
                      className={cn(
                        "shrink-0",
                        isFavorite ? "text-health-accent" : "text-muted-foreground"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </Button>
                  </div>

                  {test.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {test.description}
                    </p>
                  )}

                  {/* Test Features */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {test.features.turnaround && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{test.features.turnaround}</span>
                      </div>
                    )}
                    {test.features.collection && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{test.features.collection}</span>
                      </div>
                    )}
                    {test.features.bioMarkers && (
                      <Badge variant="outline" className="text-xs">
                        {test.features.bioMarkers}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="lg:w-48 shrink-0 space-y-4">
                  <div className="text-center lg:text-right">
                    <div className="text-3xl font-bold text-health-primary">
                      £{test.price.toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {test.available ? "Available now" : "Out of stock"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-gradient-to-r from-health-primary to-health-secondary text-white hover:opacity-90"
                      onClick={() => handlePlaceOrder(test.id, test.provider)}
                      disabled={!test.available}
                    >
                      {test.available ? "Order Test" : "Out of Stock"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a 
                        href={`/test/${test.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LiveCompareTable;