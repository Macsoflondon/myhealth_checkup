import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, CheckCircle, XCircle } from 'lucide-react';
import { CANCER_BIOMARKERS, CancerBiomarker } from '@/data/compare/cancerBiomarkers';
import { EnhancedTestData } from '@/types/comparison';

interface CancerBiomarkerGroupProps {
  selectedTests: EnhancedTestData[];
  cancerTypeFilter?: string;
}

const CANCER_TYPE_COLORS: Record<string, string> = {
  prostate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  ovarian: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  bowel: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  breast: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  liver: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  testicular: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  pancreatic: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  lung: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
  colorectal: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

function testIncludesBiomarker(test: EnhancedTestData, biomarker: CancerBiomarker): boolean {
  const biomarkersList = test.biomarkersList.map(b => b.toLowerCase());
  const testName = test.testName.toLowerCase();
  const description = test.description.toLowerCase();
  
  const searchTerms = [
    biomarker.name.toLowerCase(),
    biomarker.id.replace(/-/g, ' '),
    ...biomarker.name.toLowerCase().split(' '),
  ];
  
  return searchTerms.some(term => 
    biomarkersList.some(b => b.includes(term)) ||
    testName.includes(term) ||
    description.includes(term)
  );
}

export function CancerBiomarkerGroup({ selectedTests, cancerTypeFilter }: CancerBiomarkerGroupProps) {
  const filteredBiomarkers = cancerTypeFilter && cancerTypeFilter !== 'all'
    ? CANCER_BIOMARKERS.filter(b => b.cancerTypes.includes(cancerTypeFilter))
    : CANCER_BIOMARKERS;

  if (selectedTests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cancer Biomarker Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Select tests to compare their cancer biomarker coverage.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Cancer Biomarker Coverage
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Shows which cancer biomarkers are included in each selected test.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredBiomarkers.map(biomarker => (
            <div key={biomarker.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{biomarker.name}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="font-medium mb-1">{biomarker.name}</p>
                          <p className="text-sm mb-2">{biomarker.description}</p>
                          <p className="text-sm text-muted-foreground">{biomarker.clinicalSignificance}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {biomarker.cancerTypes.map(type => (
                      <Badge 
                        key={type} 
                        variant="secondary"
                        className={`text-xs ${CANCER_TYPE_COLORS[type] || ''}`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
                {selectedTests.map(test => {
                  const included = testIncludesBiomarker(test, biomarker);
                  return (
                    <div 
                      key={test.id}
                      className={`flex items-center gap-2 p-2 rounded text-sm ${
                        included 
                          ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300' 
                          : 'bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      {included ? (
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate">{test.provider}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
