import React, { useEffect, useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ShieldX,
  KeyRound,
  Database,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface PiiAuditRow {
  table: string;
  column: string;
  total_rows: number;
  encrypted_rows: number;
  plaintext_rows: number;
  null_rows: number;
  note?: string;
}

interface EncryptionStatusResponse {
  secrets: {
    encryption_key_present: boolean;
    legacy_vite_key_present: boolean;
    keys_match: boolean | null;
    active_key_fingerprint: string | null;
    legacy_key_fingerprint: string | null;
  };
  pii_audit: PiiAuditRow[];
  declared_but_missing_in_schema: string[];
  decryption_probe: {
    attempted: boolean;
    sample_table: string | null;
    sample_column: string | null;
    success: boolean;
    error: string | null;
  };
  totals: {
    encrypted_rows: number;
    plaintext_rows: number;
    profiles_total: number;
  };
  rotation_safety: "safe" | "data_at_risk" | "edge_function_broken";
  verdict_reason: string;
  plaintext_warning: string | null;
  generated_at: string;
}

const verdictMeta = {
  safe: {
    icon: ShieldCheck,
    title: "Safe to rotate",
    className: "border-green-600/40 bg-green-50 text-green-900 dark:bg-green-950/40 dark:text-green-200",
  },
  data_at_risk: {
    icon: ShieldAlert,
    title: "Data at risk",
    className: "border-amber-600/40 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  },
  edge_function_broken: {
    icon: ShieldX,
    title: "Edge function broken",
    className: "border-destructive/40 bg-destructive/10 text-destructive",
  },
} as const;

const AdminEncryptionStatusPage: React.FC = () => {
  const [data, setData] = useState<EncryptionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke<EncryptionStatusResponse>(
        "encryption-status",
        { body: {} },
      );
      if (fnError) throw fnError;
      if (!result) throw new Error("Empty response");
      setData(result);
    } catch (e) {
      logger.error("Encryption status fetch failed:", e);
      setError(e instanceof Error ? e.message : "Failed to load encryption status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const verdict = data ? verdictMeta[data.rotation_safety] : null;
  const VerdictIcon = verdict?.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Encryption Status</h1>
            <p className="text-muted-foreground mt-1">
              Verify encrypted PII coverage and active encryption secrets before rotating keys.
            </p>
          </div>
          <Button onClick={fetchStatus} disabled={loading} variant="outline">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Re-run check
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Could not load status</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && !data && (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Auditing database…
          </div>
        )}

        {data && verdict && VerdictIcon && (
          <div className={`rounded-lg border p-5 mb-6 ${verdict.className}`}>
            <div className="flex items-start gap-3">
              <VerdictIcon className="h-6 w-6 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{verdict.title}</h2>
                <p className="text-sm mt-1">{data.verdict_reason}</p>
                {data.plaintext_warning && (
                  <p className="text-sm mt-2 font-medium">
                    ⚠ {data.plaintext_warning}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {data && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <CardTitle>Encryption secrets</CardTitle>
                </div>
                <CardDescription>
                  Which secret the <code className="text-xs">encrypt-sensitive-data</code> edge function is reading.
                  Fingerprints are the first 8 hex chars of SHA-256 — safe to display.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-medium">ENCRYPTION_KEY</div>
                    <div className="text-xs text-muted-foreground">Active secret used by the edge function.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.secrets.encryption_key_present ? (
                      <>
                        <Badge className="bg-green-600 hover:bg-green-600">Set</Badge>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {data.secrets.active_key_fingerprint}
                        </code>
                      </>
                    ) : (
                      <Badge variant="destructive">Missing</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-medium">VITE_ENCRYPTION_KEY (legacy)</div>
                    <div className="text-xs text-muted-foreground">
                      Should be removed — the <code>VITE_</code> prefix risks bundling into client JS.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.secrets.legacy_vite_key_present ? (
                      <>
                        <Badge variant="destructive">Present (delete)</Badge>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {data.secrets.legacy_key_fingerprint}
                        </code>
                      </>
                    ) : (
                      <Badge className="bg-green-600 hover:bg-green-600">Removed</Badge>
                    )}
                  </div>
                </div>

                {data.secrets.keys_match !== null && (
                  <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t">
                    <div className="font-medium">Both keys identical?</div>
                    {data.secrets.keys_match ? (
                      <Badge variant="secondary">Yes — safe to delete the legacy one</Badge>
                    ) : (
                      <Badge variant="destructive">No — fingerprints differ</Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>PII audit</CardTitle>
                </div>
                <CardDescription>
                  Per-column scan of <code>user_profiles</code>. Encrypted values start with{" "}
                  <code>enc:</code>. Plaintext in a sensitive column means the encrypt step was skipped.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-3">
                  Total user profiles: <strong>{data.totals.profiles_total}</strong> · Encrypted values:{" "}
                  <strong>{data.totals.encrypted_rows}</strong> · Plaintext values:{" "}
                  <strong className={data.totals.plaintext_rows > 0 ? "text-destructive" : ""}>
                    {data.totals.plaintext_rows}
                  </strong>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column</TableHead>
                      <TableHead className="text-right">Encrypted</TableHead>
                      <TableHead className="text-right">Plaintext</TableHead>
                      <TableHead className="text-right">Empty</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.pii_audit.map((row) => (
                      <TableRow key={`${row.table}.${row.column}`}>
                        <TableCell className="font-mono text-xs">
                          {row.table}.{row.column}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.encrypted_rows > 0 ? (
                            <Badge className="bg-green-600 hover:bg-green-600">
                              {row.encrypted_rows}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.plaintext_rows > 0 ? (
                            <Badge variant="destructive">{row.plaintext_rows}</Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {row.null_rows}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.note ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {data.declared_but_missing_in_schema.length > 0 && (
                  <Alert className="mt-4">
                    <AlertTitle className="text-sm">Declared but not in schema</AlertTitle>
                    <AlertDescription className="text-xs">
                      These fields are listed as sensitive in the encryption function but no
                      matching column exists. Informational only — no action needed unless you
                      add them later:{" "}
                      <code>{data.declared_but_missing_in_schema.join(", ")}</code>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Live decryption probe</CardTitle>
                <CardDescription>
                  Picks the first encrypted value in the database and tries to decrypt it with the
                  active <code>ENCRYPTION_KEY</code>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!data.decryption_probe.attempted ? (
                  <p className="text-sm text-muted-foreground">
                    No encrypted values found to test against. Probe skipped.
                  </p>
                ) : data.decryption_probe.success ? (
                  <Alert className="border-green-600/40 bg-green-50 dark:bg-green-950/40">
                    <ShieldCheck className="h-4 w-4 text-green-700 dark:text-green-300" />
                    <AlertTitle>Decryption succeeded</AlertTitle>
                    <AlertDescription>
                      Sample from <code>{data.decryption_probe.sample_table}.{data.decryption_probe.sample_column}</code>{" "}
                      decrypted cleanly. The active key matches the data on disk.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <ShieldX className="h-4 w-4" />
                    <AlertTitle>Decryption failed</AlertTitle>
                    <AlertDescription>
                      Sample from <code>{data.decryption_probe.sample_table}.{data.decryption_probe.sample_column}</code>{" "}
                      could not be decrypted. The active key does not match the data on disk —
                      <strong> do not rotate</strong> until the original key is restored.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground text-right">
              Generated at {new Date(data.generated_at).toLocaleString("en-GB")}
            </p>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminEncryptionStatusPage;
