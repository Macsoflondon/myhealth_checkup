/**
 * Admin: Unified Audit Console (C2–C4)
 * Consolidated read-only viewer across audit_logs, admin_activity_log,
 * role_audit_log, protected_call_log, csp_reports.
 */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Download } from "lucide-react";

type Source = "all" | "audit_logs" | "admin_activity_log" | "role_audit_log" | "protected_call_log" | "csp_reports";

interface UnifiedRow {
  id: string;
  source: Exclude<Source, "all">;
  at: string;
  actor: string | null;
  action: string;
  target: string;
  status: string | null;
  ip: string | null;
  detail: unknown;
}

const SOURCE_LABEL: Record<Exclude<Source, "all">, string> = {
  audit_logs: "Data",
  admin_activity_log: "Admin",
  role_audit_log: "Role",
  protected_call_log: "Protected call",
  csp_reports: "CSP",
};

const SOURCE_VARIANT: Record<Exclude<Source, "all">, "default" | "secondary" | "destructive" | "outline"> = {
  audit_logs: "outline",
  admin_activity_log: "default",
  role_audit_log: "secondary",
  protected_call_log: "destructive",
  csp_reports: "destructive",
};

function csvEscape(v: unknown): string {
  let s = v == null ? "" : typeof v === "string" ? v : JSON.stringify(v);
  // Strip control chars (incl. newlines, tabs) that would break CSV rows or hint CSV injection.
  s = s.replace(/[\u0000-\u001f\u007f]/g, " ");
  // Neutralise leading formula characters that Excel would evaluate.
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}


const AdminAuditConsolePage = () => {
  const [source, setSource] = useState<Source>("all");
  const [window, setWindow] = useState<"1h" | "24h" | "7d" | "30d">("24h");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<UnifiedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const ms = window === "1h" ? 3600e3 : window === "24h" ? 86400e3 : window === "7d" ? 7 * 86400e3 : 30 * 86400e3;
      const since = new Date(Date.now() - ms).toISOString();
      const per = 500;

      const queries: PromiseLike<UnifiedRow[]>[] = [];
      const includeAudit = source === "all" || source === "audit_logs";
      const includeAdmin = source === "all" || source === "admin_activity_log";
      const includeRole = source === "all" || source === "role_audit_log";
      const includeProt = source === "all" || source === "protected_call_log";
      const includeCsp = source === "all" || source === "csp_reports";

      if (includeAudit) queries.push(
        supabase.from("audit_logs").select("id,user_id,action,table_name,record_id,ip_address,new_data,created_at,reason_code").gte("created_at", since).order("created_at", { ascending: false }).limit(per)
          .then(({ data }) => (data ?? []).map((r): UnifiedRow => ({
            id: `au-${r.id}`, source: "audit_logs", at: r.created_at, actor: r.user_id, action: r.action,
            target: `${r.table_name}${r.record_id ? `:${r.record_id.slice(0, 8)}` : ""}`, status: r.reason_code, ip: r.ip_address as string | null,
            detail: r.new_data,
          })))
      );
      if (includeAdmin) queries.push(
        supabase.from("admin_activity_log").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(per)
          .then(({ data }) => (data ?? []).map((r): UnifiedRow => ({
            id: `ad-${r.id}`, source: "admin_activity_log", at: r.created_at, actor: r.admin_user_id, action: r.action,
            target: `${r.resource_type ?? "-"}${r.resource_name ? `:${r.resource_name}` : ""}`,
            status: r.success ? "ok" : "fail", ip: r.ip_address, detail: { old: r.old_value, new: r.new_value, error: r.error_message },
          })))
      );
      if (includeRole) queries.push(
        supabase.from("role_audit_log").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(per)
          .then(({ data }) => (data ?? []).map((r): UnifiedRow => ({
            id: `rl-${r.id}`, source: "role_audit_log", at: r.created_at, actor: r.actor_id, action: r.action,
            target: `${r.role}→${r.target_user_id?.slice(0, 8)}`, status: r.action, ip: null, detail: r.metadata,
          })))
      );
      if (includeProt) queries.push(
        supabase.from("protected_call_log").select("*").gte("created_at", since).order("created_at", { ascending: false }).limit(per)
          .then(({ data }) => (data ?? []).map((r): UnifiedRow => ({
            id: `pc-${r.id}`, source: "protected_call_log", at: r.created_at, actor: r.caller_id, action: r.status,
            target: r.function_name, status: r.status, ip: r.ip_address, detail: r.details,
          })))
      );
      if (includeCsp) queries.push(
        supabase.from("csp_reports").select("*").gte("received_at", since).order("received_at", { ascending: false }).limit(per)
          .then(({ data }) => (data ?? []).map((r): UnifiedRow => ({
            id: `cs-${r.id}`, source: "csp_reports", at: r.received_at, actor: null, action: "csp-violation",
            target: r.violated_directive ?? "unknown", status: r.blocked_uri, ip: r.ip_address, detail: r.report,
          })))
      );

      const results = await Promise.all(queries);
      if (cancelled) return;
      const merged = results.flat().sort((a, b) => (a.at < b.at ? 1 : -1));
      setRows(merged);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [source, window]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      r.action.toLowerCase().includes(q) ||
      r.target.toLowerCase().includes(q) ||
      (r.actor ?? "").toLowerCase().includes(q) ||
      (r.ip ?? "").toLowerCase().includes(q) ||
      JSON.stringify(r.detail ?? "").toLowerCase().includes(q)
    );
  }, [rows, search]);

  const exportCsv = async () => {
    const CAP = 10_000;
    const capped = filtered.slice(0, CAP);
    if (filtered.length > CAP) {
      // eslint-disable-next-line no-alert
      const ok = confirm(`Export is capped at ${CAP.toLocaleString()} rows (you have ${filtered.length.toLocaleString()}). Continue with the first ${CAP.toLocaleString()}?`);
      if (!ok) return;
    }
    const header = ["timestamp", "source", "actor", "action", "target", "status", "ip", "detail"];
    const lines = [header.join(",")];
    for (const r of capped) {
      lines.push([r.at, r.source, r.actor ?? "", r.action, r.target, r.status ?? "", r.ip ?? "", r.detail].map(csvEscape).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-${source}-${window}-${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    // Audit the export itself so the console reflects its own use.
    const { data: user } = await supabase.auth.getUser();
    await supabase.from("admin_activity_log").insert({
      admin_user_id: user.user?.id ?? null,
      action: "audit_console_export",
      resource_type: "audit_logs",
      resource_name: `${source}/${window}`,
      new_value: { rows_exported: capped.length, filter_search: search || null },
      success: true,
    });
  };


  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of filtered) c[r.source] = (c[r.source] ?? 0) + 1;
    return c;
  }, [filtered]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Audit console</h1>
          <p className="text-sm text-muted-foreground">Unified view across all audit surfaces.</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={source} onValueChange={(v) => setSource(v as Source)}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="audit_logs">Data (audit_logs)</SelectItem>
              <SelectItem value="admin_activity_log">Admin activity</SelectItem>
              <SelectItem value="role_audit_log">Role changes</SelectItem>
              <SelectItem value="protected_call_log">Protected calls</SelectItem>
              <SelectItem value="csp_reports">CSP violations</SelectItem>
            </SelectContent>
          </Select>
          <Select value={window} onValueChange={(v) => setWindow(v as typeof window)}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {(Object.keys(SOURCE_LABEL) as Array<keyof typeof SOURCE_LABEL>).map((k) => (
              <Badge key={k} variant={SOURCE_VARIANT[k]}>{SOURCE_LABEL[k]}: {counts[k] ?? 0}</Badge>
            ))}
            <span className="text-sm text-muted-foreground ml-auto">{filtered.length} of {rows.length} entries</span>
          </div>
        </CardHeader>
        <CardContent>
          <Input placeholder="Search action, target, actor, IP, detail…" value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>When</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 500).map((r) => (
                  <Collapsible key={r.id} asChild open={expanded === r.id} onOpenChange={(o) => setExpanded(o ? r.id : null)}>
                    <>
                      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                        <TableCell><ChevronRight className={`h-4 w-4 transition-transform ${expanded === r.id ? "rotate-90" : ""}`} /></TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">{new Date(r.at).toLocaleString("en-GB")}</TableCell>
                        <TableCell><Badge variant={SOURCE_VARIANT[r.source]}>{SOURCE_LABEL[r.source]}</Badge></TableCell>
                        <TableCell className="font-mono text-xs">{r.actor?.slice(0, 8) ?? "—"}</TableCell>
                        <TableCell>{r.action}</TableCell>
                        <TableCell className="font-mono text-xs max-w-[280px] truncate">{r.target}</TableCell>
                        <TableCell className="font-mono text-xs">{r.ip ?? "—"}</TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <TableRow>
                          <TableCell colSpan={7} className="bg-muted/30">
                            <pre className="text-xs overflow-auto max-h-64 whitespace-pre-wrap break-all">{JSON.stringify(r.detail ?? {}, null, 2)}</pre>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No audit entries in window</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
          {filtered.length > 500 && <p className="text-xs text-muted-foreground mt-2">Showing first 500 rows. Narrow filter or export CSV for the rest.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditConsolePage;
