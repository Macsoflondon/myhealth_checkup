import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type MapRow = {
  provider_id: string;
  source_section: string;
  canonical_category: string;
  needs_review: boolean;
};
type TestRow = {
  id: string;
  provider_id: string;
  test_name: string;
  category: string | null;
  source_section: string | null;
  canonical_category: string | null;
};

const norm = (s: string | null | undefined) =>
  (s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface Conflict {
  provider_id: string;
  source_section: string;
  expected: string; // map rule
  actual: string;   // stored canonical on row
  rows: TestRow[];
}
interface Unmapped {
  provider_id: string;
  source_section: string;
  example_test: string;
  row_count: number;
}

export const SectionMappingAuditPanel = () => {
  const [loading, setLoading] = useState(false);
  const [mapRules, setMapRules] = useState<MapRow[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [unmapped, setUnmapped] = useState<Unmapped[]>([]);
  const [missingCanonical, setMissingCanonical] = useState<TestRow[]>([]);
  const [activeCount, setActiveCount] = useState(0);

  const run = async () => {
    setLoading(true);
    const [{ data: rules }, { data: tests }] = await Promise.all([
      supabase.from("provider_section_category_map").select("*").order("provider_id"),
      supabase
        .from("provider_tests")
        .select("id,provider_id,test_name,category,source_section,canonical_category")
        .eq("is_active", true)
        .limit(5000),
    ]);

    const ruleMap = new Map<string, string>();
    (rules ?? []).forEach((r: any) =>
      ruleMap.set(`${r.provider_id}::${r.source_section}`, r.canonical_category)
    );

    const conflictMap = new Map<string, Conflict>();
    const unmappedMap = new Map<string, Unmapped>();
    const missing: TestRow[] = [];

    (tests ?? []).forEach((t: any) => {
      const section = norm(t.source_section ?? t.category);
      if (!section) {
        if (!t.canonical_category) missing.push(t);
        return;
      }
      const key = `${t.provider_id}::${section}`;
      const expected = ruleMap.get(key);

      if (!t.canonical_category) missing.push(t);

      if (!expected) {
        const u = unmappedMap.get(key) ?? {
          provider_id: t.provider_id,
          source_section: section,
          example_test: t.test_name,
          row_count: 0,
        };
        u.row_count++;
        unmappedMap.set(key, u);
      } else if (t.canonical_category && expected !== t.canonical_category) {
        const c = conflictMap.get(key) ?? {
          provider_id: t.provider_id,
          source_section: section,
          expected,
          actual: t.canonical_category,
          rows: [],
        };
        c.rows.push(t);
        conflictMap.set(key, c);
      }
    });

    setMapRules((rules ?? []) as MapRow[]);
    setConflicts([...conflictMap.values()].sort((a, b) => b.rows.length - a.rows.length));
    setUnmapped([...unmappedMap.values()].sort((a, b) => b.row_count - a.row_count));
    setMissingCanonical(missing);
    setActiveCount((tests ?? []).length);
    setLoading(false);
  };

  useEffect(() => {
    run();
  }, []);

  const needsReview = mapRules.filter((r) => r.needs_review);
  const clean =
    !loading &&
    conflicts.length === 0 &&
    unmapped.length === 0 &&
    missingCanonical.length === 0;

  const perProviderCounts = Object.entries(
    mapRules.reduce<Record<string, number>>((acc, r) => {
      acc[r.provider_id] = (acc[r.provider_id] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Section → Canonical Audit (per provider)
            </CardTitle>
            <CardDescription>
              {mapRules.length} per-provider rules across {perProviderCounts.length} providers •{" "}
              {activeCount} active tests audited
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={run} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Re-run audit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {clean && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              No conflicts, no unmapped sections, no missing canonical categories. All providers route via explicit per-provider rules.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Stat label="Rules" value={mapRules.length} />
          <Stat label="Needs review" value={needsReview.length} tone={needsReview.length ? "warn" : "ok"} />
          <Stat label="Conflicts" value={conflicts.length} tone={conflicts.length ? "err" : "ok"} />
          <Stat label="Unmapped sections" value={unmapped.length} tone={unmapped.length ? "warn" : "ok"} />
        </div>

        <Section title={`Conflicting rules (${conflicts.length})`}>
          {conflicts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rows disagree with their provider's mapping rule.</p>
          ) : (
            <div className="space-y-3">
              {conflicts.map((c) => (
                <div key={`${c.provider_id}::${c.source_section}`} className="border rounded-md p-3">
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <Badge variant="outline">{c.provider_id}</Badge>
                    <code className="text-xs">{c.source_section}</code>
                    <span className="text-muted-foreground">rule says</span>
                    <Badge>{c.expected}</Badge>
                    <span className="text-muted-foreground">but rows have</span>
                    <Badge variant="destructive">{c.actual}</Badge>
                    <span className="text-muted-foreground">({c.rows.length} rows)</span>
                  </div>
                  <ul className="mt-2 text-xs text-muted-foreground space-y-1 max-h-40 overflow-auto">
                    {c.rows.slice(0, 25).map((r) => (
                      <li key={r.id}>
                        <code>{r.id.slice(0, 8)}</code> — {r.test_name}
                      </li>
                    ))}
                    {c.rows.length > 25 && <li>… +{c.rows.length - 25} more</li>}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title={`Unmapped sections (${unmapped.length})`}>
          {unmapped.length === 0 ? (
            <p className="text-sm text-muted-foreground">Every active row's section has an explicit per-provider rule.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-auto">
              {unmapped.map((u) => (
                <div
                  key={`${u.provider_id}::${u.source_section}`}
                  className="flex items-center gap-2 text-sm border rounded-md p-2"
                >
                  <Badge variant="outline">{u.provider_id}</Badge>
                  <code className="text-xs">{u.source_section}</code>
                  <span className="text-muted-foreground truncate">— e.g. {u.example_test}</span>
                  <span className="ml-auto text-muted-foreground">{u.row_count} rows</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title={`Rules pending review (${needsReview.length})`}>
          {needsReview.length === 0 ? (
            <p className="text-sm text-muted-foreground">All rules are confirmed.</p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-auto text-sm">
              {needsReview.map((r) => (
                <div key={`${r.provider_id}::${r.source_section}`} className="flex items-center gap-2">
                  <Badge variant="outline">{r.provider_id}</Badge>
                  <code className="text-xs">{r.source_section}</code>
                  <span>→</span>
                  <Badge variant="secondary">{r.canonical_category}</Badge>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title={`Rules per provider`}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {perProviderCounts.map(([p, n]) => (
              <div key={p} className="flex justify-between border rounded px-2 py-1">
                <code className="text-xs">{p}</code>
                <span className="text-muted-foreground">{n}</span>
              </div>
            ))}
          </div>
        </Section>
      </CardContent>
    </Card>
  );
};

const Stat = ({ label, value, tone = "ok" }: { label: string; value: number; tone?: "ok" | "warn" | "err" }) => (
  <div
    className={`rounded-md border p-3 ${
      tone === "err" ? "border-destructive/50" : tone === "warn" ? "border-yellow-500/50" : ""
    }`}
  >
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-sm font-semibold mb-2">{title}</h4>
    {children}
  </div>
);

export default SectionMappingAuditPanel;
