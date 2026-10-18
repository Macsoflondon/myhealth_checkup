/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LeakedPasswordProtectionStatus } from "@/components/admin/LeakedPasswordProtectionStatus";
import { ScraperAlertsPanel } from "@/components/admin/ScraperAlertsPanel";
import { NormalizeCategoriesCard } from "@/components/admin/NormalizeCategoriesCard";
import { ScrapeRunLogPanel } from "@/components/admin/ScrapeRunLogPanel";
import { CategoryVerificationPanel } from "@/components/admin/CategoryVerificationPanel";
import { SectionMappingAuditPanel } from "@/components/admin/SectionMappingAuditPanel";
import { PriceSyncPanel } from "@/components/control/PriceSyncPanel";

const AdminScraperDashboardPage: React.FC = () => {
  const { toast } = useToast();
  const [isRefreshingPopular, setIsRefreshingPopular] = useState(false);
  const [popularResult, setPopularResult] = useState<string | null>(null);

  const refreshPopularTests = async () => {
    setIsRefreshingPopular(true);
    setPopularResult(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "scrape-popular-tests",
        {
          body: {},
        },
      );
      if (error) throw error;
      const summary = Array.isArray(data?.providers)
        ? data.providers
            .map((p: any) => `${p.provider}: ${p.matched ?? 0} matched`)
            .join(" • ")
        : data?.message || "Done.";
      setPopularResult(summary);
      toast({ title: "Popular tests refreshed", description: summary });
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setPopularResult(`Failed: ${msg}`);
      toast({
        title: "Refresh failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsRefreshingPopular(false);
    }
  };

  return (
    <div className="space-y-6">
      <PriceSyncPanel />

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <strong>Scheduled sync:</strong> every provider syncs automatically
          every 6 hours, and a daily health check raises an alert when a
          provider drops below its expected test count.
        </AlertDescription>
      </Alert>

      <LeakedPasswordProtectionStatus />

      <ScraperAlertsPanel />

      <NormalizeCategoriesCard />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Refresh Popular Tests
              </CardTitle>
              <CardDescription>
                Scrape each provider's curated best-sellers page and update{" "}
                <code>is_popular</code>, <code>popularity_rank</code> and{" "}
                <code>image_url</code>. Runs as your admin user.
              </CardDescription>
            </div>
            <Button
              onClick={refreshPopularTests}
              disabled={isRefreshingPopular}
            >
              {isRefreshingPopular ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Refresh Popular Tests
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {popularResult && (
          <CardContent className="pt-0">
            <Alert>
              <AlertDescription className="text-sm">
                {popularResult}
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      <ScrapeRunLogPanel />

      <SectionMappingAuditPanel />

      <CategoryVerificationPanel />
    </div>
  );
};

export default AdminScraperDashboardPage;
