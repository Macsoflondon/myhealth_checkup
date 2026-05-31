import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertTriangle, RefreshCw, Loader2, Download } from "lucide-react";

const PROVIDER_NAMES: Record<string, string> = {
  "medichecks": "Medichecks",
  "thriva": "Thriva",
  "goodbody-clinic": "GoodBody Clinic",
  "lola-health": "Lola Health",
  "randox": "Randox Health",
  "london-medical-laboratory": "London Medical Laboratory",
  "london-health-company": "London Health Company",
  "clinilabs": "Clinilabs",
  "medical-diagnosis": "Medical Diagnosis",
};

interface MismatchRow {
  id: string;
  provider_id: string;
  provider_name: string;
  provider_test_id: string | null;
  test_name: string;
  canonical_category: string | null;
  source_section: string | null;
  category: string | null;
  url: string | null;
  image_url: string | null;
  issues: string[];
}

interface CategoryStat {
  canonical_category: string | null;
  total: number;
  with_url: number;
  with_image: number;
  renderable: number;
}

interface Issue {
  kind: "missing_canonical" | "missing_url" | "missing_image" | "section_mismatch";
  count: number;
  sample: Array<{ id: string; provider_id: string; test_name: string; source_section?: string | null; category?: string | null }>;
}

export const CategoryVerificationPanel = () => {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [mismatches, setMismatches] = useState<MismatchRow[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);

    const { data: rows } = await supabase
      .from("provider_tests")
      .select("id,provider_id,provider_test_id,test_name,canonical_category,source_section,category,url,image_url")
      .eq("is_active", true)
      .limit(5000);

    const list = rows ?? [];
    const byCat = new Map<string, CategoryStat>();
    const missingCanonical: Issue["sample"] = [];
    const missingUrl: Issue["sample"] = [];
    const missingImage: Issue["sample"] = [];
    const allMismatches: MismatchRow[] = [];

    for (const r of list) {
      const key = r.canonical_category ?? "__null__";
      const cur = byCat.get(key) ?? {
        canonical_category: r.canonical_category,
        total: 0,
        with_url: 0,
        with_image: 0,
        renderable: 0,
      };
      cur.total++;
      if (r.url) cur.with_url++;
      if (r.image_url) cur.with_image++;
      if (r.url && r.image_url && r.canonical_category) cur.renderable++;
      byCat.set(key, cur);

      const rowIssues: string[] = [];
      if (!r.canonical_category) rowIssues.push("missing_canonical");
      if (!r.url) rowIssues.push("missing_url");
      if (!r.image_url) rowIssues.push("missing_image");
      // Section mismatch: source_section explicitly mentions women but landed elsewhere
      if (r.source_section && /women|female/i.test(r.source_section) && r.canonical_category !== "womens-health") {
        rowIssues.push("section_mismatch:womens-health");
      }
      if (r.source_section && /(^|[^a-z])men([^a-z]|$)|male|prostate/i.test(r.source_section) && r.canonical_category && r.canonical_category !== "mens-health") {
        rowIssues.push("section_mismatch:mens-health");
      }

      if (rowIssues.length > 0) {
        allMismatches.push({
          id: r.id,
          provider_id: r.provider_id,
          provider_name: PROVIDER_NAMES[r.provider_id] || r.provider_id,
          provider_test_id: (r as any).provider_test_id ?? null,
          test_name: r.test_name,
          canonical_category: r.canonical_category,
          source_section: r.source_section,
          category: r.category,
          url: r.url,
          image_url: r.image_url,
          issues: rowIssues,
        });
      }

      if (!r.canonical_category && missingCanonical.length < 10) {
        missingCanonical.push({
          id: r.id,
          provider_id: r.provider_id,
          test_name: r.test_name,
          source_section: r.source_section,
          category: r.category,
        });
      }
      if (!r.url && missingUrl.length < 10) {
        missingUrl.push({ id: r.id, provider_id: r.provider_id, test_name: r.test_name });
      }
      if (!r.image_url && missingImage.length < 10) {
        missingImage.push({ id: r.id, provider_id: r.provider_id, test_name: r.test_name });
      }
    }

    const sorted = [...byCat.values()].sort((a, b) => b.total - a.total);

    const totalMissingCanonical = list.filter((r) => !r.canonical_category).length;
    const totalMissingUrl = list.filter((r) => !r.url).length;
    const totalMissingImage = list.filter((r) => !r.image_url).length;

    setStats(sorted);
    setMismatches(allMismatches);
    setIssues([
      { kind: "missing_canonical", count: totalMissingCanonical, sample: missingCanonical },
      { kind: "missing_url", count: totalMissingUrl, sample: missingUrl },
      { kind: "missing_image", count: totalMissingImage, sample: missingImage },
    ]);
    setLoading(false);
  };

  const triggerDownload = (filename: string, mime: string, content: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    triggerDownload(
      `category-mismatches-${ts}.json`,
      "application/json",
      JSON.stringify({ generated_at: new Date().toISOString(), count: mismatches.length, rows: mismatches }, null, 2)
    );
  };

  const exportCsv = () => {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const header = [
      "provider_name",
      "provider_id",
      "provider_test_id",
      "id",
      "test_name",
      "canonical_category",
      "source_section",
      "category",
      "url",
      "image_url",
      "issues",
    ];
    const esc = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = mismatches.map((m) =>
      [
        m.provider_name,
        m.provider_id,
        m.provider_test_id,
        m.id,
        m.test_name,
        m.canonical_category,
        m.source_section,
        m.category,
        m.url,
        m.image_url,
        m.issues.join("|"),
      ]
        .map(esc)
        .join(",")
    );
    triggerDownload(
      `category-mismatches-${ts}.csv`,
      "text/csv",
      [header.join(","), ...rows].join("\n")
    );
  };

  useEffect(() => {
    run();
  }, []);

  const issueLabel = (k: Issue["kind"]) =>
    ({
      missing_canonical: "No canonical_category",
      missing_url: "Missing product URL",
      missing_image: "Missing image",
      section_mismatch: "Source section mismatch",
    }[k]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Category Mapping Verification
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={exportCsv} disabled={loading || mismatches.length === 0}>
              <Download className="h-4 w-4" />
              <span className="ml-2">CSV ({mismatches.length})</span>
            </Button>
            <Button size="sm" variant="outline" onClick={exportJson} disabled={loading || mismatches.length === 0}>
              <Download className="h-4 w-4" />
              <span className="ml-2">JSON</span>
            </Button>
            <Button size="sm" variant="outline" onClick={run} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Re-check</span>
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Confirms every active provider_tests row resolves to a canonical category and has a real URL + image so the
          CTA, card and link render on the matching category page.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {issues.some((i) => i.count > 0) ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {issues
                .filter((i) => i.count > 0)
                .map((i) => `${i.count} × ${issueLabel(i.kind)}`)
                .join(" · ")}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>All active tests have a canonical_category, URL and image.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-2">
          {stats.map((s) => (
            <div
              key={s.canonical_category ?? "null"}
              className="flex items-center justify-between rounded-md border border-border bg-background p-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <Badge variant={s.canonical_category ? "default" : "destructive"}>
                  {s.canonical_category ?? "UNMAPPED"}
                </Badge>
                <span className="text-muted-foreground">{s.total} total</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>URL {s.with_url}/{s.total}</span>
                <span>Image {s.with_image}/{s.total}</span>
                <span className="font-medium text-foreground">Renderable {s.renderable}</span>
              </div>
            </div>
          ))}
        </div>

        {issues
          .filter((i) => i.count > 0 && i.sample.length > 0)
          .map((i) => (
            <details key={i.kind} className="rounded-md border border-border p-3 text-sm">
              <summary className="cursor-pointer font-medium">
                {issueLabel(i.kind)} — first {i.sample.length} of {i.count}
              </summary>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {i.sample.map((s) => (
                  <li key={s.id}>
                    <code>{s.provider_id}</code> · {s.test_name}
                    {s.source_section ? ` · section=${s.source_section}` : ""}
                    {s.category ? ` · category=${s.category}` : ""}
                  </li>
                ))}
              </ul>
            </details>
          ))}
      </CardContent>
    </Card>
  );
};
