import React from 'react';
import { Check, X, Clock, Beaker, Stethoscope, Syringe, Home, Building2, Award, TrendingDown, Zap, FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ComparisonResult, EnhancedTestData } from '@/types/comparison';

interface EnhancedComparisonTableProps {
  result: ComparisonResult;
  onRemoveTest: (testId: string) => void;
  onBookTest: (test: EnhancedTestData) => void;
}

export function EnhancedComparisonTable({ result, onRemoveTest, onBookTest }: EnhancedComparisonTableProps) {
  const { tests, bestValue, fastestResults, mostComprehensive, biomarkerOverlap, uniqueBiomarkers } = result;

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return 'N/A';
    return `£${price.toFixed(2)}`;
  };

  const getBadges = (test: EnhancedTestData) => {
    const badges = [];
    if (test.id === bestValue) {
      badges.push(
        <Badge key="value" className="bg-green-500/20 text-green-700 border-green-500/30">
          <TrendingDown className="w-3 h-3 mr-1" />
          Best Value
        </Badge>
      );
    }
    if (test.id === fastestResults) {
      badges.push(
        <Badge key="fast" className="bg-blue-500/20 text-blue-700 border-blue-500/30">
          <Zap className="w-3 h-3 mr-1" />
          Fastest
        </Badge>
      );
    }
    if (test.id === mostComprehensive) {
      badges.push(
        <Badge key="comprehensive" className="bg-purple-500/20 text-purple-700 border-purple-500/30">
          <FlaskConical className="w-3 h-3 mr-1" />
          Most Comprehensive
        </Badge>
      );
    }
    return badges;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header Row */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
          <div className="p-4 font-heading font-semibold text-foreground">Feature</div>
          {tests.map(test => (
            <Card key={test.id} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => onRemoveTest(test.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardHeader className="pb-2">
                {test.providerLogo && (
                  <img 
                    src={test.providerLogo} 
                    alt={test.provider} 
                    className="h-8 object-contain mb-2"
                  />
                )}
                <CardTitle className="text-lg font-heading">{test.testName}</CardTitle>
                <p className="text-sm text-muted-foreground">{test.provider}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {getBadges(test)}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Pricing Section */}
        <div className="space-y-2">
          <h3 className="font-heading font-semibold text-foreground px-4 py-2 bg-muted/50 rounded-lg">
            Pricing Breakdown
          </h3>
          
          {/* Base Price */}
          <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium">Base Price</div>
            {tests.map(test => (
              <div key={test.id} className="p-4 text-center font-semibold">
                {formatPrice(test.basePrice)}
              </div>
            ))}
          </div>

          {/* GP Consultation */}
          <div className="grid gap-4 items-center bg-muted/30" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-muted-foreground" />
              GP Consultation
            </div>
            {tests.map(test => (
              <div key={test.id} className="p-4 text-center">
                {test.gpConsultationIncluded ? (
                  <span className="inline-flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    Included
                  </span>
                ) : test.gpConsultationCost ? (
                  <span className="text-amber-600">+{formatPrice(test.gpConsultationCost)}</span>
                ) : (
                  <span className="text-muted-foreground">Not available</span>
                )}
              </div>
            ))}
          </div>

          {/* Phlebotomy */}
          <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Syringe className="w-4 h-4 text-muted-foreground" />
              Phlebotomy (Blood Draw)
            </div>
            {tests.map(test => (
              <div key={test.id} className="p-4 text-center">
                {test.phlebotomyIncluded ? (
                  <span className="inline-flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    Included
                  </span>
                ) : test.phlebotomyCost ? (
                  <span className="text-amber-600">+{formatPrice(test.phlebotomyCost)}</span>
                ) : (
                  <span className="text-muted-foreground">Self-collect</span>
                )}
              </div>
            ))}
          </div>

          {/* Total Estimated Cost */}
          <div className="grid gap-4 items-center bg-primary/5 rounded-lg" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
            <div className="p-4 text-sm font-bold">Total Estimated Cost</div>
            {tests.map(test => (
              <div key={test.id} className={`p-4 text-center text-xl font-bold ${test.id === bestValue ? 'text-green-600' : ''}`}>
                {formatPrice(test.totalEstimatedCost)}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Features Section */}
        <div className="space-y-2">
          <h3 className="font-heading font-semibold text-foreground px-4 py-2 bg-muted/50 rounded-lg">
            Test Features
          </h3>
          
          {/* Turnaround Time */}
          <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Results Turnaround
            </div>
            {tests.map(test => (
              <div key={test.id} className={`p-4 text-center ${test.id === fastestResults ? 'text-blue-600 font-semibold' : ''}`}>
                {test.turnaroundDays} {test.turnaroundDays === 1 ? 'day' : 'days'}
              </div>
            ))}
          </div>

          {/* Sample Type */}
          <div className="grid gap-4 items-center bg-muted/30" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Beaker className="w-4 h-4 text-muted-foreground" />
              Sample Type
            </div>
            {tests.map(test => (
              <div key={test.id} className="p-4 text-center capitalize">
                {test.sampleType.replace('-', ' ')}
              </div>
            ))}
          </div>

          {/* Collection Options */}
          <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium">Collection Options</div>
            {tests.map(test => (
              <div key={test.id} className="p-4 text-center space-x-2">
                {test.homeKitAvailable && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="inline-flex items-center text-green-600">
                          <Home className="w-4 h-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Home kit available</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {test.clinicVisitAvailable && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="inline-flex items-center text-blue-600">
                          <Building2 className="w-4 h-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Clinic visit available</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))}
          </div>

          {/* Accreditations */}
          <div className="grid gap-4 items-center bg-muted/30" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4 text-muted-foreground" />
              Accreditations
            </div>
            {tests.map(test => (
              <div key={test.id} className="p-4 text-center">
                <div className="flex flex-wrap gap-1 justify-center">
                  {test.accreditations.map(acc => (
                    <Badge key={acc} variant="outline" className="text-xs">
                      {acc}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Biomarkers Section */}
        <div className="space-y-2">
          <h3 className="font-heading font-semibold text-foreground px-4 py-2 bg-muted/50 rounded-lg">
            Biomarkers Tested
          </h3>
          
          {/* Biomarker Count */}
          <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-muted-foreground" />
              Number of Biomarkers
            </div>
            {tests.map(test => (
              <div key={test.id} className={`p-4 text-center text-lg font-semibold ${test.id === mostComprehensive ? 'text-purple-600' : ''}`}>
                {test.biomarkerCount}
              </div>
            ))}
          </div>

          {/* Common Biomarkers */}
          {biomarkerOverlap.length > 0 && (
            <div className="px-4 py-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                Common to all ({biomarkerOverlap.length}):
              </p>
              <div className="flex flex-wrap gap-1">
                {biomarkerOverlap.slice(0, 10).map(b => (
                  <Badge key={b} variant="secondary" className="text-xs capitalize">
                    {b}
                  </Badge>
                ))}
                {biomarkerOverlap.length > 10 && (
                  <Badge variant="secondary" className="text-xs">
                    +{biomarkerOverlap.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Unique Biomarkers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium">Unique Biomarkers</div>
            {tests.map(test => {
              const unique = uniqueBiomarkers[test.id] || [];
              return (
                <div key={test.id} className="p-4">
                  {unique.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {unique.slice(0, 5).map(b => (
                        <Badge key={b} variant="outline" className="text-xs capitalize bg-purple-50 dark:bg-purple-950/20">
                          {b}
                        </Badge>
                      ))}
                      {unique.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{unique.length - 5} more
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">None unique</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` }}>
          <div className="p-4" />
          {tests.map(test => (
            <div key={test.id} className="p-4 text-center">
              <Button 
                className="w-full bg-[#e70d69] hover:bg-[#e70d69]/90"
                onClick={() => onBookTest(test)}
              >
                Book This Test
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
