import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Database, Globe, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { LiveDataService } from "@/services/LiveDataService";

const AdminDataRefreshPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [isRefreshing, setIsRefreshing] = useState<Record<string, boolean>>({});
  const [refreshResults, setRefreshResults] = useState<Record<string, {
    success: boolean;
    message: string;
    timestamp: string;
  }>>({});

  const providers = [
    { id: 'medichecks', name: 'Medichecks', hasLiveScraper: true },
    { id: 'london-medical-laboratory', name: 'London Medical Laboratory', hasLiveScraper: true },
    { id: 'goodbody', name: 'Goodbody Clinic', hasLiveScraper: false },
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

  const handleRefreshAll = async () => {
    for (const provider of providers.filter(p => p.hasLiveScraper)) {
      await handleRefreshProvider(provider.id);
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
                  Refresh provider test data from live sources. Database backup is used when live scraping fails.
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

                <div className="flex gap-2">
                  <Button 
                    onClick={handleRefreshAll} 
                    disabled={Object.values(isRefreshing).some(v => v)}
                    size="lg"
                  >
                    {Object.values(isRefreshing).some(v => v) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Refreshing All...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh All Providers
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
                          <Badge variant="default">Live Scraper</Badge>
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

                    <Button
                      onClick={() => handleRefreshProvider(provider.id)}
                      disabled={isRefreshing[provider.id] || !provider.hasLiveScraper}
                      className="w-full"
                    >
                      {isRefreshing[provider.id] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh {provider.name} Data
                        </>
                      )}
                    </Button>
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
