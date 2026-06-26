import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell } from "../SectionShell";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface AuditLogRow {
  id: string;
  user_id: string | null;
  action: string | null;
  resource_type: string | null;
  resource_id: string | null;
  created_at: string | null;
  ip_address: string | null;
  metadata: any;
}

export default function LogsSection() {
  const [rows, setRows] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setRows((data ?? []) as any);
        setLoading(false);
      });
  }, []);

  const filtered = query
    ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(query.toLowerCase()))
    : rows;

  return (
    <SectionShell
      title="System Logs"
      description="Searchable audit log (last 200 events)."
      status="live"
      actions={
        <Input
          placeholder="Filter…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 w-56"
        />
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
                <th className="text-left px-3 py-2">Action</th>
                <th className="text-left px-3 py-2">Resource</th>
                <th className="text-left px-3 py-2">User</th>
                <th className="text-left px-3 py-2">IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-1.5 tabular-nums text-muted-foreground">{r.created_at ? new Date(r.created_at).toLocaleString() : "—"}</td>
                  <td className="px-3 py-1.5 font-medium">{r.action ?? "—"}</td>
                  <td className="px-3 py-1.5">{r.resource_type}{r.resource_id ? ` · ${r.resource_id.slice(0, 8)}` : ""}</td>
                  <td className="px-3 py-1.5 font-mono text-[10px]">{r.user_id?.slice(0, 8) ?? "—"}</td>
                  <td className="px-3 py-1.5 font-mono text-[10px]">{r.ip_address ?? "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">No matching log events.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </SectionShell>
  );
}
