import React, { useEffect, useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Minus,
  Pencil,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface Finding {
  key: string;
  level: "error" | "warn";
  category: string;
  title: string;
  detail: string;
}

interface ModifiedFinding {
  key: string;
  before: Finding;
  after: Finding;
}

interface Snapshot {
  id: string;
  scanned_at: string;
  total_findings: number;
  error_count: number;
  warn_count: number;
  findings: Finding[];
  added_findings: Finding[];
  removed_findings: Finding[];
  modified_findings: ModifiedFinding[];
  has_diff: boolean;
  acknowledged_at: string | null;
}

const fmtTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

const LevelBadge = ({ level }: { level: "error" | "warn" }) => (
  <Badge
    variant={level === "error" ? "destructive" : "secondary"}
    className="uppercase text-[10px] tracking-wide"
  >
    {level}
  </Badge>
);

export default function AdminSecurityDiffPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSnapshots = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: dbErr } = await supabase
      .from("security_scan_snapshots")
      .select(
        "id, scanned_at, total_findings, error_count, warn_count, findings, added_findings, removed_findings, modified_findings, has_diff, acknowledged_at",
      )
      .order("scanned_at", { ascending: false })
      .limit(25);

    if (dbErr) {
      logger.error("Failed to load security snapshots", { message: dbErr.message });
      setError(dbErr.message);
    } else {
      setSnapshots((data ?? []) as Snapshot[]);
    }
    setLoading(false);
  }, []);

  const runScan = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const { error: fnErr } = await supabase.functions.invoke(
        "security-scan-snapshot",
        { body: { trigger: "manual" } },
      );
      if (fnErr) throw fnErr;
      await loadSnapshots();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      logger.error("Manual security scan failed", { message: msg });
      setError(msg);
    } finally {
      setScanning(false);
    }
  }, [loadSnapshots]);

  const acknowledge = useCallback(
    async (id: string) => {
      const { error: updErr } = await supabase
        .from("security_scan_snapshots")
        .update({
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", id);
      if (updErr) {
        setError(updErr.message);
        return;
      }
      await loadSnapshots();
    },
    [loadSnapshots],
  );

  useEffect(() => {
    loadSnapshots();
  }, [loadSnapshots]);

  const latest = snapshots[0];
  const unackDiffs = snapshots.filter((s) => s.has_diff && !s.acknowledged_at);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">Security Scan Diff</h1>
            <p className="text-muted-foreground">
              Hourly snapshots of database security posture. Alerts surface here
              when errors/warnings change between runs.
            </p>
          </div>
          <Button onClick={runScan} disabled={scanning}>
            {scanning
              ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
              : <RefreshCw className="h-4 w-4 mr-2" />}
            Run scan now
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading
          ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
            </div>
          )
          : (
            <>
              {/* Summary banner */}
              {latest && (
                <Alert
                  className={`mb-6 ${
                    unackDiffs.length > 0
                      ? "border-amber-600/40 bg-amber-50 dark:bg-amber-950/30"
                      : "border-green-600/40 bg-green-50 dark:bg-green-950/30"
                  }`}
                >
                  {unackDiffs.length > 0
                    ? <ShieldAlert className="h-5 w-5" />
                    : <ShieldCheck className="h-5 w-5" />}
                  <AlertTitle>
                    {unackDiffs.length > 0
                      ? `${unackDiffs.length} unacknowledged diff${
                        unackDiffs.length === 1 ? "" : "s"
                      }`
                      : "No new changes since last acknowledgement"}
                  </AlertTitle>
                  <AlertDescription>
                    Last scan {fmtTime(latest.scanned_at)} —{" "}
                    {latest.error_count} error
                    {latest.error_count === 1 ? "" : "s"}, {latest.warn_count}
                    {" "}
                    warning{latest.warn_count === 1 ? "" : "s"}.
                  </AlertDescription>
                </Alert>
              )}

              {/* Snapshot list */}
              <div className="space-y-4">
                {snapshots.map((snap, idx) => (
                  <Card
                    key={snap.id}
                    className={snap.has_diff && !snap.acknowledged_at
                      ? "border-amber-600/40"
                      : ""}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {fmtTime(snap.scanned_at)}
                            {idx === 0 && (
                              <Badge variant="outline" className="ml-2">
                                Latest
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {snap.total_findings} finding
                            {snap.total_findings === 1 ? "" : "s"} —{" "}
                            {snap.error_count} error · {snap.warn_count} warn
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {snap.has_diff
                            ? (
                              <Badge variant="destructive">
                                Diff vs previous
                              </Badge>
                            )
                            : (
                              <Badge variant="secondary">
                                No change
                              </Badge>
                            )}
                          {snap.has_diff && !snap.acknowledged_at && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => acknowledge(snap.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                          {snap.acknowledged_at && (
                            <Badge variant="outline">
                              Acked {fmtTime(snap.acknowledged_at)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {snap.has_diff && (
                      <CardContent className="space-y-4">
                        {snap.added_findings.length > 0 && (
                          <DiffSection
                            icon={<Plus className="h-4 w-4 text-destructive" />}
                            label={`Added (${snap.added_findings.length})`}
                            rows={snap.added_findings}
                          />
                        )}
                        {snap.removed_findings.length > 0 && (
                          <DiffSection
                            icon={<Minus className="h-4 w-4 text-green-600" />}
                            label={`Resolved (${snap.removed_findings.length})`}
                            rows={snap.removed_findings}
                          />
                        )}
                        {snap.modified_findings.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                              <Pencil className="h-4 w-4 text-amber-600" />
                              Modified ({snap.modified_findings.length})
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Finding</TableHead>
                                  <TableHead>Before</TableHead>
                                  <TableHead>After</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {snap.modified_findings.map((m) => (
                                  <TableRow key={m.key}>
                                    <TableCell className="font-mono text-xs">
                                      {m.key}
                                    </TableCell>
                                    <TableCell>
                                      <LevelBadge level={m.before.level} />{" "}
                                      <span className="text-xs text-muted-foreground">
                                        {m.before.title}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <LevelBadge level={m.after.level} />{" "}
                                      <span className="text-xs">
                                        {m.after.title}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    )}

                    {!snap.has_diff && snap.findings.length > 0 && idx === 0 && (
                      <CardContent>
                        <details>
                          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                            Show current findings ({snap.findings.length})
                          </summary>
                          <div className="mt-3">
                            <DiffSection rows={snap.findings} />
                          </div>
                        </details>
                      </CardContent>
                    )}
                  </Card>
                ))}

                {snapshots.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      No scans yet. Click <strong>Run scan now</strong>{" "}
                      to take the first snapshot. The hourly cron will then
                      maintain history automatically.
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
      </main>
      <Footer />
    </div>
  );
}

function DiffSection({
  icon,
  label,
  rows,
}: {
  icon?: React.ReactNode;
  label?: string;
  rows: Finding[];
}) {
  return (
    <div>
      {label && (
        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
          {icon}
          {label}
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Level</TableHead>
            <TableHead className="w-32">Category</TableHead>
            <TableHead>Finding</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((f) => (
            <TableRow key={f.key}>
              <TableCell><LevelBadge level={f.level} /></TableCell>
              <TableCell className="text-xs">{f.category}</TableCell>
              <TableCell>
                <div className="font-medium">{f.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {f.detail}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
