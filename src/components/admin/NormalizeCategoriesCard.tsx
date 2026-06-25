import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wand2, Eye, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NormalizeResponse {
  success?: boolean;
  dryRun?: boolean;
  scanned: number;
  updated?: number;
  wouldUpdate?: number;
  shifts: Record<string, number>;
  sample: Array<{ id: string; provider_id: string; from: string; to: string; test_name: string }>;
  error?: string;
}

export const NormalizeCategoriesCard = () => {
  const { toast } = useToast();
  const [busy, setBusy] = useState<null | "preview" | "apply">(null);
  const [result, setResult] = useState<NormalizeResponse | null>(null);

  const run = async (dryRun: boolean) => {
    setBusy(dryRun ? "preview" : "apply");
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("normalize-test-categories", {
        body: { dryRun },
      });
      if (error) throw error;
      setResult(data as NormalizeResponse);
      toast({
        title: dryRun ? "Preview ready" : "Normalisation applied",
        description: dryRun
          ? `${(data as NormalizeResponse).wouldUpdate ?? 0} of ${(data as NormalizeResponse).scanned} rows would change.`
          : `${(data as NormalizeResponse).updated ?? 0} rows updated.`,
      });
    } catch (err) {
      toast({
        title: "Normalisation failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          Normalise Test Categories
        </CardTitle>
        <CardDescription>
          Re-parses every active provider test in place and re-derives its category from the test name. Use this to fix
          mistags (e.g. cardiovascular panels sitting under Liver Health) without a full purge or re-scrape.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => run(true)} disabled={busy !== null}>
            {busy === "preview" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
            Preview changes (dry run)
          </Button>
          <Button onClick={() => run(false)} disabled={busy !== null}>
            {busy === "apply" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
            Apply normalisation
          </Button>
        </div>

        {result?.error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        )}

        {result && !result.error && (
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Scanned: {result.scanned}</Badge>
              <Badge variant={result.dryRun ? "secondary" : "default"}>
                {result.dryRun ? `Would update: ${result.wouldUpdate ?? 0}` : `Updated: ${result.updated ?? 0}`}
              </Badge>
            </div>

            {Object.keys(result.shifts).length > 0 && (
              <div>
                <h4 className="font-semibold mb-1">Category shifts</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {Object.entries(result.shifts).map(([shift, count]) => (
                    <li key={shift} className="flex justify-between border-b py-1">
                      <span>{shift}</span>
                      <span className="font-mono">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.sample.length > 0 && (
              <div>
                <h4 className="font-semibold mb-1">Sample (first 20)</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {result.sample.map((s) => (
                    <li key={s.id}>
                      <span className="font-medium">{s.provider_id}</span> · {s.test_name} ·{" "}
                      <span className="text-destructive">{s.from || "∅"}</span> →{" "}
                      <span className="text-primary">{s.to}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NormalizeCategoriesCard;
