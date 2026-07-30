import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, RefreshCw } from "lucide-react";

type CheckState = "pending" | "ok" | "fail" | "warn";

interface RouteCheck {
  path: string;
  status: CheckState;
  httpStatus?: number;
  note?: string;
}

const BASE_URL = "https://myhealthcheckup.co.uk";

async function fetchText(url: string): Promise<{ ok: boolean; status: number; text: string }> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  } catch (err) {
    return { ok: false, status: 0, text: err instanceof Error ? err.message : String(err) };
  }
}

function parseSitemap(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) out.push(m[1].trim());
  return out;
}

function parseRobots(text: string) {
  const groups: { agent: string; disallow: string[]; allow: string[] }[] = [];
  let current: { agent: string; disallow: string[]; allow: string[] } | null = null;
  let sitemap: string | undefined;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      current = { agent: value, disallow: [], allow: [] };
      groups.push(current);
    } else if (key === "disallow" && current) current.disallow.push(value);
    else if (key === "allow" && current) current.allow.push(value);
    else if (key === "sitemap") sitemap = value;
  }
  return { groups, sitemap };
}

const StatusIcon = ({ state }: { state: CheckState }) => {
  if (state === "ok") return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (state === "fail") return <XCircle className="h-4 w-4 text-red-600" />;
  if (state === "warn") return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
};

export function SeoStatusDashboard() {
  const [sitemapUrls, setSitemapUrls] = useState<string[] | null>(null);
  const [sitemapErr, setSitemapErr] = useState<string | null>(null);
  const [robotsText, setRobotsText] = useState<string | null>(null);
  const [robotsErr, setRobotsErr] = useState<string | null>(null);
  const [checks, setChecks] = useState<RouteCheck[]>([]);
  const [running, setRunning] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sm = await fetchText("/sitemap.xml");
      if (cancelled) return;
      if (sm.ok) setSitemapUrls(parseSitemap(sm.text));
      else setSitemapErr(`HTTP ${sm.status}: ${sm.text.slice(0, 200)}`);

      const rb = await fetchText("/robots.txt");
      if (cancelled) return;
      if (rb.ok) setRobotsText(rb.text);
      else setRobotsErr(`HTTP ${rb.status}: ${rb.text.slice(0, 200)}`);
    })();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const sitemapPaths = useMemo(() => {
    if (!sitemapUrls) return null;
    return sitemapUrls.map((u) => (u.startsWith(BASE_URL) ? u.slice(BASE_URL.length) || "/" : u));
  }, [sitemapUrls]);

  const robots = useMemo(() => (robotsText ? parseRobots(robotsText) : null), [robotsText]);

  const runCrawlChecks = async () => {
    if (!sitemapPaths || sitemapPaths.length === 0) return;
    setRunning(true);
    const initial: RouteCheck[] = sitemapPaths.map((p) => ({ path: p, status: "pending" }));
    setChecks(initial);
    const results: RouteCheck[] = [];
    const concurrency = 6;
    let idx = 0;
    async function worker() {
      while (sitemapPaths && idx < sitemapPaths.length) {
        const my = idx++;
        const path = sitemapPaths[my];
        const r = await fetchText(path);
        const status: CheckState = r.ok ? "ok" : r.status === 0 ? "warn" : "fail";
        results[my] = {
          path,
          status,
          httpStatus: r.status || undefined,
          note: r.ok ? undefined : r.text.slice(0, 140),
        };
        setChecks([...results, ...initial.slice(results.length)]);
      }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
    setChecks(results);
    setRunning(false);
  };

  const failedCount = checks.filter((c) => c.status === "fail").length;
  const okCount = checks.filter((c) => c.status === "ok").length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Status</h1>
          <p className="text-sm text-muted-foreground">
            Crawlability signals — sitemap, robots.txt, and live 404 checks for public routes.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setNonce((n) => n + 1)}>
          <RefreshCw className="h-4 w-4 mr-2" /> Reload
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon state={sitemapErr ? "fail" : sitemapPaths ? "ok" : "pending"} />
              sitemap.xml
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {sitemapErr && <p className="text-red-600">{sitemapErr}</p>}
            {sitemapPaths && (
              <>
                <p>
                  <strong>{sitemapPaths.length}</strong> URLs published to <code>/sitemap.xml</code>.
                </p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">Show all entries</summary>
                  <ul className="mt-2 max-h-64 overflow-auto font-mono space-y-0.5">
                    {sitemapPaths.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </details>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon state={robotsErr ? "fail" : robots ? "ok" : "pending"} />
              robots.txt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {robotsErr && <p className="text-red-600">{robotsErr}</p>}
            {robots && (
              <>
                <p>
                  <strong>{robots.groups.length}</strong> user-agent groups ·{" "}
                  {robots.sitemap ? (
                    <>
                      sitemap: <code>{robots.sitemap}</code>
                    </>
                  ) : (
                    <span className="text-amber-600">no Sitemap: directive</span>
                  )}
                </p>
                <div className="space-y-2 max-h-64 overflow-auto">
                  {robots.groups.map((g, i) => (
                    <div key={i} className="border rounded p-2 text-xs font-mono">
                      <div className="font-semibold">User-agent: {g.agent}</div>
                      {g.disallow.map((d, k) => (
                        <div key={`d${k}`}>Disallow: {d || "(empty)"}</div>
                      ))}
                      {g.allow.map((a, k) => (
                        <div key={`a${k}`}>Allow: {a}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live crawlability check</span>
            <div className="flex items-center gap-2">
              {checks.length > 0 && (
                <>
                  <Badge variant="secondary">{okCount} OK</Badge>
                  <Badge variant={failedCount ? "destructive" : "secondary"}>{failedCount} failed</Badge>
                </>
              )}
              <Button
                size="sm"
                onClick={runCrawlChecks}
                disabled={running || !sitemapPaths}
              >
                {running ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Running…
                  </>
                ) : (
                  "Run checks"
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Fetches every sitemap URL against the current origin and reports HTTP status. Runs
            client-side; results reflect what a browser (not a bot) would see.
          </p>
          {checks.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No results yet — click "Run checks".</p>
          ) : (
            <div className="max-h-[480px] overflow-auto border rounded">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted">
                  <tr className="text-left">
                    <th className="p-2 w-8"></th>
                    <th className="p-2">Path</th>
                    <th className="p-2 w-20">Status</th>
                    <th className="p-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {checks.map((c) => (
                    <tr key={c.path} className="border-t">
                      <td className="p-2">
                        <StatusIcon state={c.status} />
                      </td>
                      <td className="p-2 font-mono">{c.path}</td>
                      <td className="p-2 font-mono">{c.httpStatus ?? "—"}</td>
                      <td className="p-2 text-muted-foreground truncate max-w-[280px]">{c.note ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
