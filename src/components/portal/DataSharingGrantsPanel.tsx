import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Copy, Trash2, ShieldCheck, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface Grant {
  id: string;
  recipient_email: string;
  recipient_org: string | null;
  purpose: string;
  status: "active" | "revoked" | "expired" | "consumed";
  granted_at: string;
  expires_at: string;
  revoked_at: string | null;
  revoked_reason: string | null;
  last_accessed_at: string | null;
  access_count: number;
}

export function DataSharingGrantsPanel() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ recipient_email: "", recipient_org: "", purpose: "", expires_in_days: 30 });

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("fhir-export/grants", { method: "GET" });
      if (error) throw error;
      setGrants(((data as { grants?: Grant[] })?.grants) ?? []);
    } catch (e) {
      logger.error("grants load failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const create = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("fhir-export/grants", {
        method: "POST",
        body: form,
      });
      if (error) throw error;
      const share = (data as { share_url?: string })?.share_url ?? "";
      await navigator.clipboard.writeText(share).catch(() => {});
      toast.success("Grant created — share link copied to clipboard");
      setOpen(false);
      setForm({ recipient_email: "", recipient_org: "", purpose: "", expires_in_days: 30 });
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create grant");
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (id: string) => {
    const reason = window.prompt("Reason for revoking this grant (required, min 3 chars):");
    if (!reason || reason.trim().length < 3) return;
    try {
      const { error } = await supabase.functions.invoke(`fhir-export/grants/${id}/revoke`, {
        method: "POST",
        body: { reason: reason.trim() },
      });
      if (error) throw error;
      toast.success("Grant revoked");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Revoke failed");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LinkIcon className="h-6 w-6" />
            Consent-based data sharing
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Grant a named recipient time-limited, revocable access to a FHIR export of your uploaded results.
            All access is audit-logged and can be withdrawn at any time (GDPR Art. 7(3)).
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><ShieldCheck className="h-4 w-4" /> New grant</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create data sharing grant</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Recipient email</Label>
                <Input type="email" value={form.recipient_email}
                  onChange={(e) => setForm({ ...form, recipient_email: e.target.value })} />
              </div>
              <div>
                <Label>Recipient organisation (optional)</Label>
                <Input value={form.recipient_org}
                  onChange={(e) => setForm({ ...form, recipient_org: e.target.value })} />
              </div>
              <div>
                <Label>Purpose (min 10 chars)</Label>
                <Textarea rows={3} value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
              </div>
              <div>
                <Label>Expires in (days, max 90)</Label>
                <Input type="number" min={1} max={90} value={form.expires_in_days}
                  onChange={(e) => setForm({ ...form, expires_in_days: Number(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={create} disabled={busy}>Create grant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading grants…</div>
      ) : grants.length === 0 ? (
        <div className="text-sm text-muted-foreground">No sharing grants yet.</div>
      ) : (
        <div className="space-y-3">
          {grants.map((g) => (
            <div key={g.id} className="border rounded-lg p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{g.recipient_email}</span>
                  {g.recipient_org && <span className="text-sm text-muted-foreground">· {g.recipient_org}</span>}
                  <Badge variant={g.status === "active" ? "default" : "secondary"}>{g.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{g.purpose}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Granted {new Date(g.granted_at).toLocaleString("en-GB")} ·
                  Expires {new Date(g.expires_at).toLocaleDateString("en-GB")} ·
                  Accessed {g.access_count}×
                  {g.last_accessed_at && ` · last ${new Date(g.last_accessed_at).toLocaleString("en-GB")}`}
                  {g.revoked_reason && ` · revoked: ${g.revoked_reason}`}
                </p>
              </div>
              {g.status === "active" && (
                <Button size="sm" variant="ghost" onClick={() => revoke(g.id)} className="gap-1">
                  <Trash2 className="h-4 w-4" /> Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
