import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Droplet, MapPin, Star, TrendingUp, Info } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Biomarker {
  code: string;
  name: string;
  category: string;
}

interface EnhancedTestCardProps {
  id: string;
  name: string;
  provider: string;
  providerLogo: string;
  price: number;
  originalPrice?: number;
  description: string;
  biomarkers: Biomarker[];
  turnaroundTime: string;
  sampleType: string;
  collectionMethod: string;
  category: string;
  url: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookNow?: () => void;
  popularityScore?: number;
  clinicalSignificance?: string;
  whoShouldTake?: string;
  preparationInstructions?: string;
}

export function EnhancedTestCard({
  id,
  name,
  provider,
  providerLogo,
  price,
  originalPrice,
  description,
  biomarkers,
  turnaroundTime,
  sampleType,
  collectionMethod,
  category,
  url,
  isFavorite = false,
  onToggleFavorite,
  onBookNow,
  popularityScore = 0,
  clinicalSignificance,
  whoShouldTake,
  preparationInstructions,
}: EnhancedTestCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <img src={providerLogo} alt={provider} className="h-6 w-auto" />
              <Badge variant="outline" className="text-xs">{category}</Badge>
              {popularityScore > 70 && (
                <Badge variant="default" className="text-xs bg-accent">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
          
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFavorite}
              className="ml-2"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-pink-500 text-pink-500" : ""}`} />
            </Button>
          )}
        </div>

        {/* Biomarkers Preview */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{biomarkers.length} Biomarkers Tested</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {biomarkers.slice(0, 5).map((biomarker) => (
              <Badge key={biomarker.code} variant="secondary" className="text-xs">
                {biomarker.name}
              </Badge>
            ))}
            {biomarkers.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{biomarkers.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Test Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{turnaroundTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{sampleType}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{collectionMethod}</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4 pt-4 border-t">
          <div>
            {originalPrice && discountPercentage > 0 && (
              <>
                <span className="text-sm line-through text-muted-foreground mr-2">
                  £{originalPrice.toFixed(2)}
                </span>
                <Badge variant="destructive" className="text-xs">
                  Save {discountPercentage}%
                </Badge>
              </>
            )}
            <div className="text-3xl font-bold text-primary mt-1">
              £{price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Info className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{name}</DialogTitle>
                <DialogDescription>Complete test information and biomarker details</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>

                {clinicalSignificance && (
                  <div>
                    <h4 className="font-semibold mb-2">Clinical Significance</h4>
                    <p className="text-sm text-muted-foreground">{clinicalSignificance}</p>
                  </div>
                )}

                {whoShouldTake && (
                  <div>
                    <h4 className="font-semibold mb-2">Who Should Take This Test?</h4>
                    <p className="text-sm text-muted-foreground">{whoShouldTake}</p>
                  </div>
                )}

                {preparationInstructions && (
                  <div>
                    <h4 className="font-semibold mb-2">Preparation Instructions</h4>
                    <p className="text-sm text-muted-foreground">{preparationInstructions}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-3">All Biomarkers ({biomarkers.length})</h4>
                  <Accordion type="single" collapsible className="w-full">
                    {biomarkers.map((biomarker, index) => (
                      <AccordionItem key={biomarker.code} value={`item-${index}`}>
                        <AccordionTrigger className="text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{biomarker.category}</Badge>
                            <span>{biomarker.name}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">
                            Biomarker code: {biomarker.code}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Turnaround Time</p>
                    <p className="font-semibold">{turnaroundTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sample Type</p>
                    <p className="font-semibold">{sampleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Collection Method</p>
                    <p className="font-semibold">{collectionMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-semibold">{provider}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            className="flex-1"
            onClick={onBookNow || (() => window.open(url, "_blank", "noopener,noreferrer"))}
          >
            Book Now - £{price.toFixed(2)}
          </Button>
        </div>
      </div>
    </Card>
  );
}
