import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScrapingJob {
  id: string;
  provider_id: string;
  status: string;
  last_scraped: string | null;
  next_scrape: string | null;
  error_message: string | null;
  updated_at: string;
}

interface Provider {
  id: string;
  name: string;
  functionName: string;
}

const PROVIDERS: Provider[] = [
  { id: 'lola-health', name: 'Lola Health', functionName: 'lola-health-scraper' },
  { id: 'medichecks', name: 'Medichecks', functionName: 'medichecks-scraper' },
  { id: 'goodbody-clinic', name: 'GoodBody', functionName: 'goodbody-scraper' },
  { id: 'thriva', name: 'Thriva', functionName: 'thriva-scraper' },
  { id: 'randox', name: 'Randox', functionName: 'randox-scraper' },
  { id: 'london-medical-laboratory', name: 'London Medical Lab', functionName: 'scrape-london-lab' },
];

const AdminScraperDashboardPage: React.FC = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<ScrapingJob[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [runningScrapers, setRunningScrapers] = useState<Set<string>>(new Set());
  const [testCounts, setTestCounts] = useState<Record<string, number>>({});

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('scraping_jobs')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (!error && data) {
      setJobs(data);
    }
    setIsLoadingJobs(false);
  };

  const fetchTestCounts = async () => {
    const counts: Record<string, number> = {};
    for (const provider of PROVIDERS) {
      const { count } = await supabase
        .from('provider_tests')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', provider.id)
        .eq('is_active', true);
      counts[provider.id] = count || 0;
    }
    setTestCounts(counts);
  };

  useEffect(() => {
    fetchJobs();
    fetchTestCounts();
  }, []);

  const runScraper = async (provider: Provider) => {
    setRunningScrapers(prev => new Set(prev).add(provider.id));
    
    try {
      const { data, error } = await supabase.functions.invoke(provider.functionName, {
        body: { replace: true }
      });

      if (error) throw error;

      toast({
        title: "Scraper completed",
        description: `${provider.name}: ${data?.message || 'Scraping finished'}`,
      });

      // Refresh data
      await fetchJobs();
      await fetchTestCounts();
    } catch (error) {
      console.error(`Error running ${provider.name} scraper:`, error);
      toast({
        title: "Scraper failed",
        description: `${provider.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setRunningScrapers(prev => {
        const next = new Set(prev);
        next.delete(provider.id);
        return next;
      });
    }
  };

  const runAllScrapers = async () => {
    for (const provider of PROVIDERS) {
      await runScraper(provider);
    }
  };

  const getJobForProvider = (providerId: string) => {
    return jobs.find(j => j.provider_id === providerId);
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'running':
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Running</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Never Run</Badge>;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Scraper Dashboard</h1>
              <p className="text-muted-foreground">Manage and monitor provider data scrapers</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchJobs} disabled={isLoadingJobs}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingJobs ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={runAllScrapers} disabled={runningScrapers.size > 0}>
                <Play className="h-4 w-4 mr-2" />
                Run All Scrapers
              </Button>
            </div>
          </div>

          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Scheduled scraping:</strong> All scrapers run automatically at 06:00 and 14:00 daily (UK time).
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {PROVIDERS.map(provider => {
              const job = getJobForProvider(provider.id);
              const isRunning = runningScrapers.has(provider.id);
              const testCount = testCounts[provider.id] || 0;

              return (
                <Card key={provider.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <CardDescription>
                          {testCount} active tests • Last scraped: {formatDate(job?.last_scraped || null)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(job?.status)}
                        <Button
                          size="sm"
                          onClick={() => runScraper(provider)}
                          disabled={isRunning || runningScrapers.size > 0}
                        >
                          {isRunning ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Run Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {job?.error_message && job.status === 'failed' && (
                    <CardContent className="pt-0">
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {job.error_message}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Scraping Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No scraping activity recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {jobs.slice(0, 10).map(job => (
                    <div key={job.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.status)}
                        <span className="font-medium">
                          {PROVIDERS.find(p => p.id === job.provider_id)?.name || job.provider_id}
                        </span>
                      </div>
                      <span className="text-muted-foreground">{formatDate(job.updated_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminScraperDashboardPage;
