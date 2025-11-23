import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2, CheckCircle2, XCircle, AlertCircle, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";

interface ScraperResult {
  provider: string;
  success: boolean;
  count: number;
  error?: string;
}

interface ScrapeResponse {
  success: boolean;
  summary?: {
    totalScrapers: number;
    successCount: number;
    failCount: number;
    totalClinics: number;
  };
  results?: ScraperResult[];
}

const AdminClinicScraperPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useUserRole();
  const [scraping, setScraping] = useState(false);
  const [results, setResults] = useState<ScraperResult[]>([]);
  const [summary, setSummary] = useState<ScrapeResponse['summary'] | null>(null);

  React.useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  const handleScrapeAll = async () => {
    setScraping(true);
    setResults([]);
    setSummary(null);

    try {
      toast.info('Starting automated clinic scraping...');

      const { data, error } = await supabase.functions.invoke('scrape-all-clinics');

      if (error) {
        console.error('Scraping error:', error);
        toast.error('Failed to scrape clinics. Check console for details.');
        return;
      }

      const response = data as ScrapeResponse;

      if (response.success && response.results) {
        setResults(response.results);
        setSummary(response.summary || null);
        
        toast.success(
          `Scraping complete! ${response.summary?.totalClinics || 0} clinics found from ${response.summary?.successCount || 0} providers`
        );
      } else {
        toast.error('Scraping completed with errors');
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during scraping');
    } finally {
      setScraping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Clinic Scraper Manager</h1>
          <p className="text-muted-foreground">
            Automatically scrape clinic locations from all provider websites
          </p>
        </div>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Automated Scraping
              </CardTitle>
              <CardDescription>
                Scrape all provider websites and automatically upload clinics to database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Technical Limitation:</strong> All provider websites use JavaScript-rendered content that cannot be scraped with basic HTML parsing.
                  This tool returns manually collected sample data for testing. For production, clinic data must be collected via:
                  (1) Manual website inspection, (2) Provider API integration, or (3) Direct provider partnerships.
                </AlertDescription>
              </Alert>

              {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold">{summary.totalScrapers}</div>
                      <div className="text-sm text-muted-foreground">Scrapers</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-green-600">{summary.successCount}</div>
                      <div className="text-sm text-muted-foreground">Success</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-red-600">{summary.failCount}</div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-primary">{summary.totalClinics}</div>
                      <div className="text-sm text-muted-foreground">Clinics</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Button
                onClick={handleScrapeAll}
                disabled={scraping}
                size="lg"
                className="w-full"
              >
                {scraping ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Scraping All Providers
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Scraping Results</CardTitle>
                <CardDescription>
                  Results from {results.length} provider scrapers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium capitalize">
                            {result.provider.replace(/-/g, ' ')}
                          </div>
                          {result.error && (
                            <div className="text-sm text-red-600 mt-1">{result.error}</div>
                          )}
                          {result.success && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Found and uploaded {result.count} clinics
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? `${result.count} clinics` : 'Failed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Provider websites use JavaScript-rendered content. These scrapers return manually collected sample data (3-4 clinics per provider).
              For the full "150+ clinics" target, you'll need to: (1) manually collect data from each provider's website, (2) request API access from providers, or (3) establish direct data partnerships.
              The existing 46 Medichecks clinics remain in the database.
            </AlertDescription>
          </Alert>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminClinicScraperPage;
