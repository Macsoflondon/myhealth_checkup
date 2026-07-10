import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard } from "../SectionShell";
import { Button } from "@/components/ui/button";
import { Loader2, Play, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { edgeInvoke } from "@/lib/edgeInvoke";

interface AuditTask {
  id: string;
  label: string;
  description: string;
  fn: string;
  body?: Record<string, unknown>;
  detailsTo?: string;
}

const TASKS: AuditTask[] = [
  {
    id: "biomarkers",
    label: "Biomarker reconciliation",
    description: "Re-scrape live provider pages and flag biomarker mismatches.",
    fn: "audit-biomarkers",
    body: { limit: 25 },
    detailsTo: "/admin/biomarker-audit",
  },
  {
    id: "normalize-categories",
    label: "Category normaliser",
    description: "Re-classify provider tests into the canonical category taxonomy.",
    fn: "normalize-test-categories",
  },
  {
    id: "verify-images",
    label: "Provider image verification",
    description: "Check that every provider hero/logo asset still resolves.",
    fn: "verify-provider-images",
  },
  {
    id: "security-snapshot",
    label: "Security scan snapshot",
    description: "Capture current Supabase advisor findings and diff against baseline.",
    fn: "security-scan-snapshot",
    detailsTo: "/admin/security-diff",
  },
  {
    id: "leaked-passwords",
    label: "Leaked password protection",
    description: "Confirm HIBP-backed protection is enabled on the auth provider.",
    fn: "check-leaked-password-protection",
  },
  {
    id: "indexnow",
    label: "IndexNow resubmit",
    description: "Push current sitemap URLs to IndexNow-participating engines.",
    fn: "indexnow-submit",
  },
  {
    id: "gsc-sitemap",
    label: "Google Search Console — resubmit sitemap",
    description: "Re-submit sitemap.xml to GSC and capture coverage stats.",
    fn: "gsc-resubmit-sitemap",
  },
];

export default function AuditsSection() {
  const [biomarkerRuns, setBiomarkerRuns] = useState<{ created_at: string; stored_count: number | null; scraped_count: number | null }[]>([]);
  const [security, setSecurity] = useState<{ total_findings: number | null; scanned_at: string | null } | null>(null);
  const [running, setRunning] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [bio, sec] = await Promise.all([
      supabase
        .from("biomarker_audit_runs")
        .select("created_at, stored_count, scraped_count")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("security_scan_snapshots")
        .select("total_findings, scanned_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    setBiomarkerRuns((bio.data ?? []) as never);
    setSecurity((sec.data ?? null) as never);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const latest = biomarkerRuns[0];
  const totalStored = biomarkerRuns.reduce((s, r) => s + (r.stored_count ?? 0), 0);
  const totalScraped = biomarkerRuns.reduce((s, r) => s + (r.scraped_count ?? 0), 0);
  const matchRate = totalStored > 0 ? Math.round((Math.min(totalStored, totalScraped) / totalStored) * 100) : null;

  const runTask = async (task: AuditTask) => {
    setRunning(task.id);
    try {
      const result = (await edgeInvoke(task.fn, task.body)) as Record<string, unknown>;
      toast.success(`${task.label} complete`, {
        description: JSON.stringify(result).slice(0, 220),
      });
      await load();
    } catch (err) {
      toast.error(`${task.label} failed`, {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setRunning(null);
    }
  };

  return (
    <SectionShell
      title="Audit Centre"
      description="One-click audits across data quality, content, security and SEO."
      status="live"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Biomarker audits (recent)"
          value={biomarkerRuns.length}
          hint={latest ? `Last: ${new Date(latest.created_at).toLocaleDateString()}` : undefined}
        />
        <StatCard
          label="Biomarker match rate"
          value={matchRate != null ? `${matchRate}%` : "—"}
          tone={matchRate == null ? "default" : matchRate >= 90 ? "good" : matchRate >= 70 ? "warn" : "bad"}
        />
        <StatCard
          label="Security findings"
          value={security?.total_findings ?? "—"}
          tone={(security?.total_findings ?? 0) > 0 ? "warn" : "good"}
        />
        <StatCard
          label="Last security scan"
          value={security?.scanned_at ? new Date(security.scanned_at).toLocaleDateString() : "—"}
        />
      </div>

      <div className="rounded-xl border bg-card divide-y">
        {TASKS.map((task) => {
          const isRunning = running === task.id;
          return (
            <div key={task.id} className="flex items-center justify-between px-4 py-3 gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{task.label}</div>
                <div className="text-xs text-muted-foreground truncate">{task.description}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {task.detailsTo && (
                  <Button asChild variant="ghost" size="sm">
                    <Link to={task.detailsTo}>
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Details
                    </Link>
                  </Button>
                )}
                <Button size="sm" disabled={isRunning} onClick={() => void runTask(task)}>
                  {isRunning ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
                  Run
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
