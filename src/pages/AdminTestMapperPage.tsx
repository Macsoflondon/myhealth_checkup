import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MappingResult {
  total_processed: number;
  high_confidence_mapped: number;
  medium_confidence_review: number;
  low_confidence_skipped: number;
  mappings_created: Array<{
    provider: string;
    test: string;
    master: string;
    confidence: number;
  }>;
  review_needed: Array<{
    provider: string;
    test: string;
    suggestions: any[];
  }>;
}

export default function AdminTestMapperPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<MappingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runMapper = async (dryRun: boolean) => {
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      toast.info(`Starting AI Test Mapper in ${dryRun ? 'DRY RUN' : 'LIVE'} mode...`);

      const { data, error: functionError } = await supabase.functions.invoke('ai-test-mapper', {
        body: {
          dryRun,
          batchSize: 10,
          confidenceThreshold: 80,
        },
      });

      if (functionError) {
        throw functionError;
      }

      setResult(data);
      toast.success(`AI Test Mapper completed successfully!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Mapper failed: ${errorMessage}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Test Mapper</h1>
        <p className="text-muted-foreground">
          Automatically map provider tests to master tests using OpenAI GPT-5 semantic analysis
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Execute Mapping</CardTitle>
            <CardDescription>
              Run the AI test mapper to automatically create mappings between provider tests and master tests.
              Dry run mode previews results without making database changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={() => runMapper(true)}
                disabled={isRunning}
                variant="outline"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  'Run Dry Run (Preview)'
                )}
              </Button>

              <Button
                onClick={() => runMapper(false)}
                disabled={isRunning}
                size="lg"
                variant="default"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  'Run Live Mapping'
                )}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>Dry Run:</strong> Analyzes tests and shows what would be mapped (no database changes)</p>
              <p>• <strong>Live Mapping:</strong> Creates actual mappings in the database (≥80% confidence)</p>
              <p>• Batch size: 10 tests per batch with 2s delays</p>
              <p>• Confidence threshold: 80% for auto-mapping, 60-79% flagged for review</p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <XCircle className="mr-2 h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Mapping Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-foreground">{result.total_processed}</div>
                    <div className="text-sm text-muted-foreground">Total Processed</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{result.high_confidence_mapped}</div>
                    <div className="text-sm text-green-700 dark:text-green-400">High Confidence</div>
                    <div className="text-xs text-green-600 dark:text-green-500">≥80% Auto-mapped</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">{result.medium_confidence_review}</div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-400">Needs Review</div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-500">60-79% Confidence</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-3xl font-bold text-gray-600">{result.low_confidence_skipped}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-400">Skipped</div>
                    <div className="text-xs text-gray-600 dark:text-gray-500">&lt;60% Confidence</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {result.mappings_created.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>High Confidence Mappings Created</CardTitle>
                  <CardDescription>
                    {result.mappings_created.length} test mappings with ≥80% confidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {result.mappings_created.map((mapping, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{mapping.test}</div>
                          <div className="text-xs text-muted-foreground">
                            {mapping.provider} → {mapping.master}
                          </div>
                        </div>
                        <Badge variant="default" className="ml-4">
                          {mapping.confidence}% match
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {result.review_needed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-yellow-600" />
                    Medium Confidence - Manual Review Needed
                  </CardTitle>
                  <CardDescription>
                    {result.review_needed.length} tests require manual verification (60-79% confidence)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {result.review_needed.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                      >
                        <div className="font-medium text-sm mb-2">{item.test}</div>
                        <div className="text-xs text-muted-foreground mb-2">Provider: {item.provider}</div>
                        {item.suggestions.map((suggestion: any, sIdx: number) => (
                          <div key={sIdx} className="text-xs pl-4 border-l-2 border-yellow-400">
                            <div className="font-medium">→ {suggestion.master_test_name}</div>
                            <div className="text-muted-foreground">{suggestion.reasoning}</div>
                            <Badge variant="outline" className="mt-1">
                              {suggestion.confidence_score}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
