import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard } from "../SectionShell";
import { ExternalLink } from "lucide-react";

export default function AuditsSection() {
  const [biomarkerRuns, setBiomarkerRuns] = useState<any[]>([]);
  const [security, setSecurity] = useState<any | null>(null);

  useEffect(() => {
    supabase
      .from("biomarker_audit_runs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setBiomarkerRuns(data ?? []));
    supabase
      .from("security_scan_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setSecurity(data));
  }, []);

  const latest = biomarkerRuns[0];
  const totalStored = biomarkerRuns.reduce((s, r) => s + (r.stored_count ?? 0), 0);
  const totalScraped = biomarkerRuns.reduce((s, r) => s + (r.scraped_count ?? 0), 0);
  const matchRate = totalStored > 0 ? Math.round((Math.min(totalStored, totalScraped) / totalStored) * 100) : null;

  return (
    <SectionShell title="Audit Centre" description="SEO, security, accessibility, content and biomarker audits." status="live">
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
        <StatCard label="Security findings" value={security?.total_findings ?? "—"} tone={security?.total_findings > 0 ? "warn" : "good"} />
        <StatCard label="Last security scan" value={security?.scanned_at ? new Date(security.scanned_at).toLocaleDateString() : "—"} />
      </div>

      <div className="rounded-xl border bg-card divide-y">
        <AuditLink to="/admin/biomarker-audit" label="Biomarker Audit Dashboard" desc="Reconcile per-test biomarker mappings against the library." />
        <AuditLink to="/admin/biomarker-validation" label="Biomarker Validation" desc="Validate provider data and flag mismatches." />
        <AuditLink to="/admin/security-diff" label="Security Posture Diff" desc="Compare current security scan against baseline." />
        <AuditLink to="/admin/encryption-status" label="Encryption Status" desc="At-rest encryption coverage for sensitive data." />
      </div>
    </SectionShell>
  );
}

function AuditLink({ to, label, desc }: { to: string; label: string; desc: string }) {
  return (
    <Link to={to} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground" />
    </Link>
  );
}
