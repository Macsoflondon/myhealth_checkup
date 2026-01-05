import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, Minus, ExternalLink, Award } from "lucide-react";

interface Provider {
  name: string;
  price: number;
  turnaround: string;
  biomarkers: number;
  bookingUrl: string;
}

interface ProviderPriceComparisonProps {
  providers: Provider[];
  testName: string;
}

const ProviderPriceComparison = ({ providers, testName }: ProviderPriceComparisonProps) => {
  if (providers.length < 2) return null;

  const sortedByPrice = [...providers].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedByPrice[0].price;
  const highestPrice = sortedByPrice[sortedByPrice.length - 1].price;
  const averagePrice = providers.reduce((sum, p) => sum + p.price, 0) / providers.length;
  const priceDifference = highestPrice - lowestPrice;
  const savingsPercentage = Math.round((priceDifference / highestPrice) * 100);

  const getPriceIndicator = (price: number) => {
    if (price === lowestPrice) {
      return { icon: TrendingDown, color: "text-green-600", label: "Lowest", bg: "bg-green-50" };
    }
    if (price === highestPrice) {
      return { icon: TrendingUp, color: "text-amber-600", label: "Highest", bg: "bg-amber-50" };
    }
    return { icon: Minus, color: "text-muted-foreground", label: "Mid-range", bg: "bg-muted/50" };
  };

  return (
    <Card className="mt-6 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Price Comparison
          </span>
          {savingsPercentage > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Save up to {savingsPercentage}%
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Price Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Lowest</p>
            <p className="font-bold text-green-600">£{lowestPrice}</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="font-bold text-foreground">£{averagePrice.toFixed(0)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Highest</p>
            <p className="font-bold text-amber-600">£{highestPrice}</p>
          </div>
        </div>

        {/* Provider List */}
        <div className="space-y-2">
          {sortedByPrice.map((provider, index) => {
            const indicator = getPriceIndicator(provider.price);
            const IconComponent = indicator.icon;
            const isLowest = provider.price === lowestPrice;
            
            return (
              <div 
                key={provider.name}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isLowest ? 'border-green-200 bg-green-50/50' : 'border-border hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isLowest ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{provider.name}</span>
                      {isLowest && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Best Value
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{provider.biomarkers} biomarkers</span>
                      <span>•</span>
                      <span>{provider.turnaround}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <IconComponent className={`w-4 h-4 ${indicator.color}`} />
                      <span className={`font-bold ${isLowest ? 'text-green-600' : 'text-foreground'}`}>
                        £{provider.price}
                      </span>
                    </div>
                    {!isLowest && (
                      <span className="text-xs text-muted-foreground">
                        +£{provider.price - lowestPrice} more
                      </span>
                    )}
                  </div>
                  <Button size="sm" variant={isLowest ? "default" : "outline"} asChild>
                    <a href={provider.bookingUrl} target="_blank" rel="noopener noreferrer">
                      Book
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Prices shown are for standard home test kits. Clinic visit costs may vary.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderPriceComparison;
