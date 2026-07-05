import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell } from "../SectionShell";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface UnifiedRow {
  source: string;
  id: string;
  event_time: string | null;
  actor_id: string | null;
  action: string | null;
  target_table: string | null;
  target_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  severity: string | null;
  payload: unknown;
}

const SOURCES = [
  "all",
  "audit_logs",
  "role_audit_log",
  "admin_activity_log",
  "edge_function_logs",
  "protected_call_log",
  "csp_reports",
  "cron_run_log",
  "ai_operation_logs",
] as const;

const SEVERITY_TONE: Record<string, string> = {
  C0: "bg-muted text-muted-foreground",
  C1: "bg-emerald-500/10 text-emerald-600",
  C2: "bg-amber-500/10 text-amber-600",
  C3: "bg-orange-500/10 text-orange-600",
  C4: "bg-red-500/10 text-red-600",
};

export default function LogsSection() {
  const [rows, setRows] = useState<UnifiedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<(typeof SOURCES)[number]>("all");

  useEffect(() => {
    setLoading(true);
    let q = supabase
      // unified_audit_log is a view; not in generated types
      .from("unified_audit_log" as never)
      .select("*")
      .order("event_time", { ascending: false })
      .limit(300);
    if (source !== "all") q = q.eq("source", source);
    void q.then(({ data }) => {
      setRows((data ?? []) as UnifiedRow[]);
      setLoading(false);
    });
  }, [source]);

  const filtered = query
    ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(query.toLowerCase()))
    : rows;

  return (
    <SectionShell
      title="System Logs"
      description="Unified audit view across every source (last 300 events)."
      status="live"
      actions={
        <div className="flex items-center gap-2">
          <Select value={source} onValueChange={(v) => setSource(v as typeof source)}>
            <SelectTrigger className="h-8 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOURCES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "all" ? "All sources" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 w-56"
          />
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-12">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading logs…
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">When</th>
                <th className="text-left px-3 py-2">Source</th>
                <th className="text-left px-3 py-2">Sev</th>
                <th className="text-left px-3 py-2">Action</th>
                <th className="text-left px-3 py-2">Target</th>
                <th className="text-left px-3 py-2">Actor</th>
                <th className="text-left px-3 py-2">IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={`${r.source}:${r.id}`} className="border-t align-top">
                  <td className="px-3 py-1.5 tabular-nums text-muted-foreground whitespace-nowrap">
                    {r.event_time ? new Date(r.event_time).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-1.5 font-mono text-[10px] text-muted-foreground">{r.source}</td>
                  <td className="px-3 py-1.5">
                    {r.severity ? (
                      <Badge variant="secondary" className={SEVERITY_TONE[r.severity] ?? ""}>
                        {r.severity}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-1.5 font-medium">{r.action ?? "—"}</td>
                  <td className="px-3 py-1.5">
                    {r.target_table}
                    {r.target_id ? ` · ${r.target_id.slice(0, 8)}` : ""}
                  </td>
                  <td className="px-3 py-1.5 font-mono text-[10px]">{r.actor_id?.slice(0, 8) ?? "—"}</td>
                  <td className="px-3 py-1.5 font-mono text-[10px]">{r.ip_address ?? "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    No matching log events.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </SectionShell>
  );
}
