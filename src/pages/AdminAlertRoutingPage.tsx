/**
 * Admin: Alert routing (IR-3 follow-up).
 * CRUD over security_alert_recipients + optional test-alert trigger.
 */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import {
  alertRecipientsApi,
  ALERT_TYPE_OPTIONS,
  type AlertRecipient,
} from "@/api/supabase/alertRecipients.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Bell, Pencil, Plus, Send, Trash2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().trim().email().max(255),
  label: z.string().trim().max(80).optional(),
  alert_types: z.array(z.string()).min(1, "Pick at least one alert type"),
  enabled: z.boolean(),
});
type FormValues = z.infer<typeof formSchema>;

const AdminAlertRoutingPage = () => {
  const [rows, setRows] = useState<AlertRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AlertRecipient | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AlertRecipient | null>(null);
  const [testing, setTesting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", label: "", alert_types: ["critical", "high"], enabled: true },
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await alertRecipientsApi.list();
    if (error) toast.error(error.message ?? "Failed to load recipients");
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.reset({ email: "", label: "", alert_types: ["critical", "high"], enabled: true });
    setDialogOpen(true);
  };

  const openEdit = (row: AlertRecipient) => {
    setEditing(row);
    form.reset({
      email: row.email,
      label: row.label ?? "",
      alert_types: row.alert_types ?? [],
      enabled: row.enabled,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    const payload = {
      email: values.email,
      label: values.label ?? null,
      alert_types: values.alert_types,
      enabled: values.enabled,
    };
    const { error } = editing
      ? await alertRecipientsApi.update(editing.id, payload)
      : await alertRecipientsApi.create(payload);
    if (error) {
      toast.error(error.message ?? "Save failed");
      return;
    }
    toast.success(editing ? "Recipient updated" : "Recipient added");
    setDialogOpen(false);
    load();
  };


  const onToggle = async (row: AlertRecipient, enabled: boolean) => {
    const { error } = await alertRecipientsApi.toggle(row.id, enabled);
    if (error) { toast.error(error.message ?? "Toggle failed"); return; }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, enabled } : r)));
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { error } = await alertRecipientsApi.remove(pendingDelete.id, pendingDelete.email);
    if (error) { toast.error(error.message ?? "Delete failed"); return; }
    toast.success("Recipient removed");
    setPendingDelete(null);
    load();
  };

  const sendTestAlert = async () => {
    setTesting(true);
    try {
      const { error } = await supabase.functions.invoke("security-alert-notify", {
        body: {
          alert_type: "test_alert",
          subject: "[MHC] Test alert from admin console",
          severity: "info",
          source: "admin",
          summary: `Test alert triggered by admin at ${new Date().toISOString()}. If you received this, routing works.`,
          dry_run: false,
        },
      });
      if (error) throw error;
      toast.success("Test alert dispatched");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send test alert");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Helmet>
        <title>Alert routing — myhealth checkup</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Alert routing</h1>
          <p className="text-sm text-muted-foreground">
            Who gets paged for which alerts. Changes are logged in the audit console.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={sendTestAlert} disabled={testing}>
            <Send className="h-4 w-4 mr-1" /> {testing ? "Sending…" : "Send test alert"}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-1" /> Add recipient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit recipient" : "Add recipient"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register("email")} placeholder="ops@example.com" />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="label">Label (optional)</Label>
                  <Input id="label" {...form.register("label")} placeholder="On-call rotation" />
                </div>
                <div className="space-y-2">
                  <Label>Alert types</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto border rounded p-3">
                    {ALERT_TYPE_OPTIONS.map((opt) => {
                      const checked = form.watch("alert_types").includes(opt.value);
                      return (
                        <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => {
                              const cur = form.getValues("alert_types");
                              form.setValue(
                                "alert_types",
                                v ? [...cur, opt.value] : cur.filter((x) => x !== opt.value),
                                { shouldValidate: true },
                              );
                            }}
                          />
                          <span className="font-mono text-xs">{opt.value}</span>
                          <Badge variant="outline" className="ml-auto text-[10px]">{opt.group}</Badge>
                        </label>
                      );
                    })}
                  </div>
                  {form.formState.errors.alert_types && (
                    <p className="text-xs text-destructive">{form.formState.errors.alert_types.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="enabled"
                    checked={form.watch("enabled")}
                    onCheckedChange={(v) => form.setValue("enabled", v)}
                  />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {editing ? "Save" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Recipients ({rows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recipients yet. Add one so critical incidents get delivered.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Enabled</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Alert types</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Switch checked={r.enabled} onCheckedChange={(v) => onToggle(r, v)} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.email}</TableCell>
                    <TableCell className="text-sm">{r.label ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {(r.alert_types ?? []).map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] font-mono">{t}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(r.updated_at).toLocaleString("en-GB")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setPendingDelete(r)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove recipient?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.email} will stop receiving all security alerts. This can be reversed by adding them again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAlertRoutingPage;
