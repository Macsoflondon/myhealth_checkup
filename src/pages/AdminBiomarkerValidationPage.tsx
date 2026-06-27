import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type Row = {
  id: string;
  provider_id: string;
  test_name: string;
  category: string | null;
  biomarker_count: number | null;
  biomarkers_list: unknown;
  url: string | null;
  scraped_at: string;
  updated_at: string;
  issue: "missing_list" | "empty_list" | "count_mismatch" | "unknown";
};

const ISSUE_COLOURS: Record<string, string> = {
  missing_list: "bg-rose-100 text-rose-800",
  empty_list: "bg-orange-100 text-orange-800",
  count_mismatch: "bg-amber-100 text-amber-800",
  unknown: "bg-gray-100 text-gray-800",
};

const ISSUE_LABELS: Record<string, string> = {
  missing_list: "Missing list",
  empty_list: "Empty list",
  count_mismatch: "Count mismatch",
  unknown: "Unknown",
};

export default function AdminBiomarkerValidationPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<string>("all");
  const [issue, setIssue] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_biomarker_validation_issues" as never);
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      setRows((data as unknown as Row[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const providers = useMemo(
    () => ["all", ...Array.from(new Set(rows.map((r) => r.provider_id))).sort()],
    [rows],
  );

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (provider === "all" || r.provider_id === provider) &&
          (issue === "all" || r.issue === issue),
      ),
    [rows, provider, issue],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { missing_list: 0, empty_list: 0, count_mismatch: 0, unknown: 0 };
    rows.forEach((r) => {
      c[r.issue] = (c[r.issue] ?? 0) + 1;
    });
    return c;
  }, [rows]);

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">Biomarker Data Validation</h1>
      <p className="text-muted-foreground mb-6">
        Active provider tests where <code>biomarker_count &gt; 0</code> but <code>biomarkers_list</code>{" "}
        is missing, empty, or doesn't match the stated count.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {(["missing_list", "empty_list", "count_mismatch", "unknown"] as const).map((k) => (
          <Card key={k} className="p-4">
            <p className="text-xs text-muted-foreground">{ISSUE_LABELS[k]}</p>
            <p className="text-2xl font-bold">{counts[k] ?? 0}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold mb-1">Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Issue</label>
          <select
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {["all", "missing_list", "empty_list", "count_mismatch", "unknown"].map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "all" : ISSUE_LABELS[d]}
              </option>
            ))}
          </select>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </Button>
        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} of {rows.length} rows
        </span>
      </Card>

      <div className="space-y-3">
        {filtered.map((row) => (
          <Card key={row.id} className="p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <h3 className="font-semibold text-lg break-words">{row.test_name}</h3>
                <p className="text-xs text-muted-foreground">
                  {row.provider_id}
                  {row.category ? ` · ${row.category}` : ""} · count={row.biomarker_count ?? 0}
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
                <p className="text-xs text-muted-foreground mt-1">
                  Updated {new Date(row.updated_at).toLocaleString()}
                </p>
              </div>
              <Badge className={ISSUE_COLOURS[row.issue]}>{ISSUE_LABELS[row.issue]}</Badge>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && !loading && (
          <p className="text-muted-foreground text-center py-8">No validation issues — nice.</p>
        )}
      </div>
    </div>
    </>
  );
}
