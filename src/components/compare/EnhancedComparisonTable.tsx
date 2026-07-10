import React from 'react';
import { Check, X, Clock, Beaker, Stethoscope, Award, TrendingDown, Zap, FlaskConical, Wallet, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { ComparisonResult, EnhancedTestData } from '@/types/comparison';
import {
  SAMPLE_TYPE_LABELS,
  COLLECTION_METHOD_LABELS,
  formatPrice,
  formatCollectionFee,
  formatClinicalReview,
} from '@/lib/comparisonFormat';

interface EnhancedComparisonTableProps {
  result: ComparisonResult;
  onRemoveTest: (testId: string) => void;
  onBookTest: (test: EnhancedTestData) => void;
}

const Dash = () => <span className="text-muted-foreground">—</span>;

export function EnhancedComparisonTable({ result, onRemoveTest, onBookTest }: EnhancedComparisonTableProps) {
  const { tests, bestValue, fastestResults, mostComprehensive } = result;

  const getBadges = (test: EnhancedTestData) => {
    const badges = [];
    if (test.id === bestValue) {
      badges.push(
        <Badge key="value" className="bg-green-500/20 text-green-700 border-green-500/30">
          <TrendingDown className="w-3 h-3 mr-1" /> Best Value
        </Badge>,
      );
    }
    if (test.id === fastestResults) {
      badges.push(
        <Badge key="fast" className="bg-blue-500/20 text-blue-700 border-blue-500/30">
          <Zap className="w-3 h-3 mr-1" /> Fastest
        </Badge>,
      );
    }
    if (test.id === mostComprehensive) {
      badges.push(
        <Badge key="comprehensive" className="bg-purple-500/20 text-purple-700 border-purple-500/30">
          <FlaskConical className="w-3 h-3 mr-1" /> Most Comprehensive
        </Badge>,
      );
    }
    return badges;
  };

  const gridCols = { gridTemplateColumns: `200px repeat(${tests.length}, 1fr)` } as const;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header Row */}
        <div className="grid gap-4" style={gridCols}>
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
                    loading="lazy"
                    decoding="async"
                    className="h-8 object-contain mb-2"
                  />
                )}
                <CardTitle className="text-lg font-heading">{test.testName}</CardTitle>
                <p className="text-sm text-muted-foreground">{test.provider}</p>
                <div className="text-xl font-bold text-[#e70d69] mt-1">
                  {formatPrice(test.basePrice)}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">{getBadges(test)}</div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Standardised rows */}
        <div className="space-y-2">
          {/* 1. Biomarkers */}
          <div className="grid gap-4 items-center" style={gridCols}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-muted-foreground" />
              Biomarkers
            </div>
            {tests.map(test => (
              <div key={test.id} className={`p-4 text-center text-lg font-semibold ${test.id === mostComprehensive ? 'text-purple-600' : ''}`}>
                {test.biomarkerCount || <Dash />}
              </div>
            ))}
          </div>

          {/* 2. Turnaround Time */}
          <div className="grid gap-4 items-center bg-muted/30" style={gridCols}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Turnaround Time
            </div>
            {tests.map(test => (
              <div key={test.id} className={`p-4 text-center ${test.id === fastestResults ? 'text-blue-600 font-semibold' : ''}`}>
                {test.turnaroundDays
                  ? `${test.turnaroundDays} ${test.turnaroundDays === 1 ? 'day' : 'days'} (typical)`
                  : <Dash />}
              </div>
            ))}
          </div>

          {/* 3. Sample Type */}
          <div className="grid gap-4 items-center" style={gridCols}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Beaker className="w-4 h-4 text-muted-foreground" />
              Sample Type
            </div>
            {tests.map(test => (
              <div key={test.id} className="p-4 text-center text-sm">
                {test.sampleTypeCode ? SAMPLE_TYPE_LABELS[test.sampleTypeCode] : <Dash />}
              </div>
            ))}
          </div>

          {/* 4. Collection Method */}
          <div className="grid gap-4 items-center bg-muted/30" style={gridCols}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-muted-foreground" />
              Collection Method
            </div>
            {tests.map(test => (
              <div key={test.id} className="p-4 text-center text-sm">
                {test.collectionMethod ? (
                  <span className="inline-flex items-center gap-1.5 text-green-700">
                    <Check className="w-4 h-4" />
                    {COLLECTION_METHOD_LABELS[test.collectionMethod]}
                  </span>
                ) : <Dash />}
              </div>
            ))}
          </div>

          {/* 5. Additional Collection Fees */}
          <div className="grid gap-4 items-center" style={gridCols}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              Additional Collection Fees
            </div>
            {tests.map(test => {
              const fee = formatCollectionFee(test.collectionFeeType, test.collectionFeeAmount);
              return (
                <div key={test.id} className="p-4 text-center">
                  {fee.isFree ? (
                    <span className="text-green-700 inline-flex items-center gap-1">
                      <Check className="w-4 h-4" /> {fee.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                      {fee.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 6. Total Expected Cost — flagship row */}
          <div className="grid gap-4 items-center bg-primary/5 rounded-lg" style={gridCols}>
            <div className="p-4 text-sm font-bold flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Total Expected Cost
            </div>
            {tests.map(test => (
              <div key={test.id} className={`p-4 text-center text-xl font-bold ${test.id === bestValue ? 'text-green-600' : 'text-foreground'}`}>
                {formatPrice(test.totalExpectedCost)}
              </div>
            ))}
          </div>

          {/* 7. Clinical Review */}
          <div className="grid gap-4 items-center bg-muted/30" style={gridCols}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-muted-foreground" />
              Clinical Review
            </div>
            {tests.map(test => {
              const r = formatClinicalReview(test.clinicalReviewType, test.clinicalReviewFee);
              if (!r.isAvailable) return <div key={test.id} className="p-4 text-center"><Dash /></div>;
              return (
                <div key={test.id} className="p-4 text-center text-sm">
                  {r.isIncluded ? (
                    <span className="text-green-700 inline-flex items-center gap-1">
                      <Check className="w-4 h-4" /> {r.label}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                      {r.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Accreditations (kept) */}
          <div className="grid gap-4 items-center" style={gridCols}>
            <div className="p-4 text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4 text-muted-foreground" />
              Accreditations
            </div>
            {tests.map(test => (
              <div key={test.id} className="p-4 text-center">
                <div className="flex flex-wrap gap-1 justify-center">
                  {test.accreditations?.length ? test.accreditations.map(acc => (
                    <Badge key={acc} variant="outline" className="text-xs">{acc}</Badge>
                  )) : <Dash />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="grid gap-4" style={gridCols}>
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
