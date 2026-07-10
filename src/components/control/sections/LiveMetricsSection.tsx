import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard } from "../SectionShell";

export default function LiveMetricsSection() {
  const [stats, setStats] = useState({ rateLimitHits: 0, csp: 0, audits: 0 });

  useEffect(() => {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    Promise.all([
      supabase.from("api_rate_limits").select("id", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("csp_reports").select("id", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("audit_logs").select("id", { count: "exact", head: true }).gte("created_at", since),
    ]).then(([r, c, a]) => {
      setStats({ rateLimitHits: r.count ?? 0, csp: c.count ?? 0, audits: a.count ?? 0 });
    });
  }, []);

  return (
    <SectionShell title="Live Operational Metrics" description="Last 60 minutes across security & access surfaces." status="beta">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Rate-limit events (1h)" value={stats.rateLimitHits} tone={stats.rateLimitHits > 50 ? "warn" : "default"} />
        <StatCard label="CSP reports (1h)" value={stats.csp} tone={stats.csp > 0 ? "warn" : "good"} />
        <StatCard label="Audit log events (1h)" value={stats.audits} />
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Real-time traffic, conversions and error rates will plug in here once an analytics provider is wired.
      </p>
    </SectionShell>
  );
}
