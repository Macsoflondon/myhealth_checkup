import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type AuditRow = {
  id: string;
  run_id: string;
  provider_id: string;
  provider_test_id: string | null;
  test_name: string;
  url: string | null;
  stored_list: string[] | null;
  stored_count: number | null;
  scraped_biomarkers: string[] | null;
  scraped_count: number | null;
  delta: string;
  notes: string | null;
  approved: boolean;
  created_at: string;
};

const PROVIDERS = [
  "all",
  "goodbody-clinic",
  "medichecks",
  "randox",
  "thriva",
  "lola-health",
  "london-medical-laboratory",
  "london-health-company",
  "clinilabs",
  "tuli-health",
];

const DELTA_COLOURS: Record<string, string> = {
  match: "bg-green-100 text-green-800",
  "count-mismatch": "bg-amber-100 text-amber-800",
  "list-mismatch": "bg-orange-100 text-orange-800",
  "extraction-failed": "bg-rose-100 text-rose-800",
  "missing-stored": "bg-blue-100 text-blue-800",
};

export default function AdminBiomarkerAuditPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [provider, setProvider] = useState<string>("goodbody-clinic");
  const [filterDelta, setFilterDelta] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("biomarker_audit_runs" as never)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      toast({ title: "Failed to load audit", description: error.message, variant: "destructive" });
    } else {
      setRows((data as unknown as AuditRow[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const runAudit = async () => {
    setRunning(true);
    const { data, error } = await supabase.functions.invoke("audit-biomarkers", {
      body: {
        provider_id: provider === "all" ? undefined : provider,
        limit: 25,
      },
    });
    setRunning(false);
    if (error) {
      toast({ title: "Audit failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Audit complete",
        description: `Audited ${data?.audited ?? 0}, ${data?.mismatches ?? 0} mismatches`,
      });
      await load();
    }
  };

  const applyCorrection = async (row: AuditRow) => {
    if (!row.scraped_biomarkers || row.scraped_biomarkers.length === 0) return;
    const { error } = await supabase
      .from("provider_tests" as never)
      .update({
        biomarkers_list: row.scraped_biomarkers as never,
        biomarker_count: row.scraped_biomarkers.length,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("provider_id", row.provider_id)
      .eq("test_name", row.test_name);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    await supabase
      .from("biomarker_audit_runs" as never)
      .update({ approved: true, approved_at: new Date().toISOString() } as never)
      .eq("id", row.id);
    toast({ title: "Applied", description: `${row.test_name} updated` });
    await load();
  };

  const filtered = useMemo(() => {
    return rows.filter(
      (r) =>
        (provider === "all" || r.provider_id === provider) &&
        (filterDelta === "all" || r.delta === filterDelta),
    );
  }, [rows, provider, filterDelta]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">Biomarker Audit</h1>
      <p className="text-muted-foreground mb-6">
        Reconcile stored biomarkers against each provider's live product page. Run an audit, then
        approve corrections individually.
      </p>

      <Card className="p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold mb-1">Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Delta</label>
          <select
            value={filterDelta}
            onChange={(e) => setFilterDelta(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {["all", "match", "count-mismatch", "list-mismatch", "extraction-failed", "missing-stored"].map(
              (d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ),
            )}
          </select>
        </div>
        <Button onClick={runAudit} disabled={running}>
          {running ? "Auditing…" : "Run audit (25 tests)"}
        </Button>
        <Button variant="outline" onClick={load} disabled={loading}>
          Refresh
        </Button>
        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} rows shown
        </span>
      </Card>

      <div className="space-y-3">
        {filtered.map((row) => (
          <Card key={row.id} className="p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
              <div>
                <h3 className="font-semibold text-lg">{row.test_name}</h3>
                <p className="text-xs text-muted-foreground">
                  {row.provider_id} · {new Date(row.created_at).toLocaleString()}
                </p>
                {row.url && (
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline break-all"
                  >
                    {row.url}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={DELTA_COLOURS[row.delta] ?? "bg-gray-100"}>{row.delta}</Badge>
                {row.approved && <Badge className="bg-green-100 text-green-800">approved</Badge>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Stored ({row.stored_count ?? 0})</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  {(row.stored_list ?? []).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                  {(!row.stored_list || row.stored_list.length === 0) && <li>—</li>}
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">Scraped from provider ({row.scraped_count ?? 0})</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  {(row.scraped_biomarkers ?? []).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                  {(!row.scraped_biomarkers || row.scraped_biomarkers.length === 0) && <li>—</li>}
                </ul>
                {row.notes && <p className="text-xs text-rose-600 mt-1">{row.notes}</p>}
              </div>
            </div>

            {!row.approved && row.delta !== "match" && row.scraped_biomarkers && row.scraped_biomarkers.length > 0 && (
              <div className="mt-3 flex justify-end">
                <Button size="sm" onClick={() => applyCorrection(row)}>
                  Apply scraped values to provider_tests
                </Button>
              </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && !loading && (
          <p className="text-muted-foreground text-center py-8">
            No audit rows yet — run an audit to populate.
          </p>
        )}
      </div>
    </div>
  );
}
