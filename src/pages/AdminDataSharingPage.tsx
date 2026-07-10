import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Row {
  id: string;
  user_id: string;
  recipient_email: string;
  recipient_org: string | null;
  purpose: string;
  status: string;
  granted_at: string;
  expires_at: string;
  last_accessed_at: string | null;
  access_count: number;
  revoked_reason: string | null;
}

export default function AdminDataSharingPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    document.title = "Admin · Data sharing grants";
    void (async () => {
      let q = supabase
        .from("data_sharing_grants")
        .select("id, user_id, recipient_email, recipient_org, purpose, status, granted_at, expires_at, last_accessed_at, access_count, revoked_reason")
        .order("granted_at", { ascending: false })
        .limit(500);
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const { data } = await q;
      setRows((data as Row[] | null) ?? []);
      setLoading(false);
    })();
  }, [statusFilter]);

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Data sharing grants</h1>
        <p className="text-sm text-muted-foreground">
          Audit trail of every patient-issued FHIR sharing grant. Read-only — patients manage their own revocations.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "active", "revoked", "expired", "consumed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-sm border ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-background"}`}
          >
            {s} {s !== "all" && counts[s] ? `(${counts[s]})` : ""}
          </button>
        ))}
      </div>

      <Card className="p-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-muted-foreground">No grants recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground border-b">
                <tr>
                  <th className="py-2 pr-4">Granted</th>
                  <th className="py-2 pr-4">Patient (uid)</th>
                  <th className="py-2 pr-4">Recipient</th>
                  <th className="py-2 pr-4">Purpose</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Access</th>
                  <th className="py-2 pr-4">Expires</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 align-top">
                    <td className="py-2 pr-4 whitespace-nowrap">{new Date(r.granted_at).toLocaleString("en-GB")}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{r.user_id.slice(0, 8)}…</td>
                    <td className="py-2 pr-4">
                      <div>{r.recipient_email}</div>
                      {r.recipient_org && <div className="text-xs text-muted-foreground">{r.recipient_org}</div>}
                    </td>
                    <td className="py-2 pr-4 max-w-md">
                      {r.purpose}
                      {r.revoked_reason && <div className="text-xs text-destructive mt-1">Revoked: {r.revoked_reason}</div>}
                    </td>
                    <td className="py-2 pr-4"><Badge variant={r.status === "active" ? "default" : "secondary"}>{r.status}</Badge></td>
                    <td className="py-2 pr-4">
                      {r.access_count}×
                      {r.last_accessed_at && <div className="text-xs text-muted-foreground">{new Date(r.last_accessed_at).toLocaleDateString("en-GB")}</div>}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">{new Date(r.expires_at).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
