import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);

    // Pull all active tests (capped at 5k for safety)
    const { data: rows } = await supabase
      .from("provider_tests")
      .select("id,provider_id,test_name,canonical_category,source_section,category,url,image_url")
      .eq("is_active", true)
      .limit(5000);

    const list = rows ?? [];
    const byCat = new Map<string, CategoryStat>();
    const missingCanonical: Issue["sample"] = [];
    const missingUrl: Issue["sample"] = [];
    const missingImage: Issue["sample"] = [];

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
    setIssues([
      { kind: "missing_canonical", count: totalMissingCanonical, sample: missingCanonical },
      { kind: "missing_url", count: totalMissingUrl, sample: missingUrl },
      { kind: "missing_image", count: totalMissingImage, sample: missingImage },
    ]);
    setLoading(false);
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
          <Button size="sm" variant="outline" onClick={run} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Re-check</span>
          </Button>
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
