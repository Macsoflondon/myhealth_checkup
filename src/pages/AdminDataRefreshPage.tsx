import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Database, Globe, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { LiveDataService } from "@/services/LiveDataService";
import { supabase } from "@/integrations/supabase/client";

const AdminDataRefreshPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [isRefreshing, setIsRefreshing] = useState<Record<string, boolean>>({});
  const [refreshResults, setRefreshResults] = useState<Record<string, {
    success: boolean;
    message: string;
    timestamp: string;
    details?: string;
  }>>({});

  const providers = [
    { id: 'medichecks', name: 'Medichecks', hasLiveScraper: true, scraperFunction: 'medichecks-scraper' },
    { id: 'medichecks-firecrawl', name: 'Medichecks (Firecrawl)', hasLiveScraper: true, scraperFunction: 'medichecks-firecrawl' },
    { id: 'london-medical-laboratory', name: 'London Medical Laboratory', hasLiveScraper: true, scraperFunction: 'scrape-london-lab' },
    { id: 'goodbody', name: 'Goodbody Clinic', hasLiveScraper: true, scraperFunction: 'goodbody-scraper' },
    { id: 'thriva', name: 'Thriva', hasLiveScraper: true, scraperFunction: 'thriva-scraper' },
    { id: 'randox', name: 'Randox Health', hasLiveScraper: true, scraperFunction: 'randox-scraper' },
    { id: 'lola-health', name: 'Lola Health', hasLiveScraper: true, scraperFunction: 'lola-health-scraper' },
  ];

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const handleRunScraper = async (providerId: string, scraperFunction: string) => {
    setIsRefreshing(prev => ({ ...prev, [providerId]: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke(scraperFunction, {
        body: {}
      });
      
      if (error) {
        throw error;
      }
      
      setRefreshResults(prev => ({
        ...prev,
        [providerId]: {
          success: data?.success ?? true,
          message: data?.success 
            ? `Successfully scraped ${data.testsScraped || 0} tests, ${data.testsWithPrices || data.testsUpserted || 0} with prices` 
            : data?.error || 'Scraper completed with errors',
          timestamp: new Date().toISOString(),
          details: JSON.stringify(data, null, 2),
        }
      }));
    } catch (error: any) {
      setRefreshResults(prev => ({
        ...prev,
        [providerId]: {
          success: false,
          message: error.message || 'Error running scraper',
          timestamp: new Date().toISOString(),
        }
      }));
    } finally {
      setIsRefreshing(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const handleRefreshProvider = async (providerId: string) => {
    setIsRefreshing(prev => ({ ...prev, [providerId]: true }));
    
    try {
      const success = await LiveDataService.refreshProviderData(providerId);
      
      setRefreshResults(prev => ({
        ...prev,
        [providerId]: {
          success,
          message: success 
            ? 'Successfully refreshed live data' 
            : 'Failed to refresh - using database backup',
          timestamp: new Date().toISOString(),
        }
      }));
    } catch (error) {
      setRefreshResults(prev => ({
        ...prev,
        [providerId]: {
          success: false,
          message: 'Error refreshing data',
          timestamp: new Date().toISOString(),
        }
      }));
    } finally {
      setIsRefreshing(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const handleRunAllScrapers = async () => {
    setIsRefreshing(prev => ({ ...prev, 'all-scrapers': true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('run-all-scrapers', {
        body: {}
      });
      
      if (error) throw error;
      
      setRefreshResults(prev => ({
        ...prev,
        'all-scrapers': {
          success: data?.success ?? true,
          message: data?.success 
            ? 'All scrapers completed successfully' 
            : 'Some scrapers failed',
          timestamp: new Date().toISOString(),
          details: JSON.stringify(data, null, 2),
        }
      }));
    } catch (error: any) {
      setRefreshResults(prev => ({
        ...prev,
        'all-scrapers': {
          success: false,
          message: error.message || 'Error running all scrapers',
          timestamp: new Date().toISOString(),
        }
      }));
    } finally {
      setIsRefreshing(prev => ({ ...prev, 'all-scrapers': false }));
    }
  };

  const handleClearCache = () => {
    LiveDataService.clearCache();
    setRefreshResults({});
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Live Data Management
                </CardTitle>
                <CardDescription>
                  Run scrapers to update provider test data with current prices. Database backup is used when live scraping fails.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium mb-2">Data Source Priority:</p>
                    <ol className="text-sm space-y-1 ml-4 list-decimal">
                      <li><strong>Live Scraping</strong> - Fetch current prices and availability from provider websites</li>
                      <li><strong>Cache</strong> - Use cached data (1 hour validity)</li>
                      <li><strong>Database Backup</strong> - Fallback to stored data when live scraping fails</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={handleRunAllScrapers} 
                    disabled={Object.values(isRefreshing).some(v => v)}
                    size="lg"
                  >
                    {isRefreshing['all-scrapers'] ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running All Scrapers...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Run All Scrapers
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleClearCache} 
                    variant="outline"
                  >
                    Clear Cache
                  </Button>
                </div>

                {refreshResults['all-scrapers'] && (
                  <Alert variant={refreshResults['all-scrapers'].success ? "default" : "destructive"}>
                    {refreshResults['all-scrapers'].success ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      <p className="font-medium">{refreshResults['all-scrapers'].message}</p>
                      <p className="text-xs mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(refreshResults['all-scrapers'].timestamp).toLocaleString()}
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {providers.map(provider => (
                <Card key={provider.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <div className="flex gap-2">
                        {provider.hasLiveScraper ? (
                          <Badge variant="default" className="bg-primary">Live Scraper</Badge>
                        ) : (
                          <Badge variant="secondary">Database Only</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {refreshResults[provider.id] && (
                      <Alert variant={refreshResults[provider.id].success ? "default" : "destructive"}>
                        {refreshResults[provider.id].success ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>
                          <p className="font-medium">{refreshResults[provider.id].message}</p>
                          <p className="text-xs mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(refreshResults[provider.id].timestamp).toLocaleString()}
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRunScraper(provider.id, provider.scraperFunction)}
                        disabled={isRefreshing[provider.id] || !provider.hasLiveScraper}
                        className="flex-1"
                      >
                        {isRefreshing[provider.id] ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Running Scraper...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Run Scraper
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleRefreshProvider(provider.id)}
                        disabled={isRefreshing[provider.id]}
                        variant="outline"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AdminDataRefreshPage;
