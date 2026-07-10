/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell } from "../SectionShell";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const EXPORTABLE: { table: string; label: string }[] = [
  { table: "provider_tests", label: "Provider tests" },
  { table: "tests_master", label: "Master tests" },
  { table: "provider_test_mapping", label: "Provider mappings" },
  { table: "scrape_run_log", label: "Scrape run log" },
  { table: "cron_run_log", label: "Cron run log" },
  { table: "scraper_alerts", label: "Scraper alerts" },
  { table: "audit_logs", label: "Audit logs" },
];

export default function ExportSection() {
  const [busy, setBusy] = useState<string | null>(null);

  const exportTable = async (table: string) => {
    setBusy(table);
    try {
      const { data } = await (supabase as any).from(table).select("*").limit(5000);
      const json = JSON.stringify(data ?? [], null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${table}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(null);
    }
  };

  return (
    <SectionShell title="Export Centre" description="Download snapshots of operational data (max 5000 rows / table)." status="stub">
      <div className="grid sm:grid-cols-2 gap-3">
        {EXPORTABLE.map((e) => (
          <div key={e.table} className="rounded-xl border bg-card p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{e.label}</div>
              <div className="text-xs text-muted-foreground font-mono">{e.table}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => exportTable(e.table)} disabled={busy === e.table}>
              <Download className="w-3.5 h-3.5 mr-1" />
              {busy === e.table ? "…" : "JSON"}
            </Button>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
