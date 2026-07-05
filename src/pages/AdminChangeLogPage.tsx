import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, RefreshCw, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatSocDateTime } from "@/lib/socWatchUtils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DAY_OPTIONS = ["1", "3", "7", "30"];

export default function AdminChangeLogPage() {
  const [days, setDays] = useState("7");
  const [search, setSearch] = useState("");
  const [resourceType, setResourceType] = useState<string>("all");

  const since = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000).toISOString();

  const listQuery = useQuery({
    queryKey: ["admin-change-log", days, resourceType],
    queryFn: async () => {
      let q = supabase
        .from("admin_activity_log")
        .select("id, action, admin_user_id, resource_type, resource_id, resource_name, old_value, new_value, success, error_message, created_at, ip_address")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(500);
      if (resourceType !== "all") q = q.eq("resource_type", resourceType);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 60_000,
  });

  const typesQuery = useQuery({
    queryKey: ["admin-change-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_activity_log")
        .select("resource_type")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return Array.from(new Set((data ?? []).map((r) => r.resource_type))).sort();
    },
    staleTime: 5 * 60 * 1000,
  });

  const filtered = (listQuery.data ?? []).filter((row) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      row.action.toLowerCase().includes(s) ||
      (row.resource_name ?? "").toLowerCase().includes(s) ||
      (row.resource_id ?? "").toLowerCase().includes(s) ||
      (row.admin_user_id ?? "").toLowerCase().includes(s)
    );
  });

  return (
    <>
      <Helmet>
        <title>Admin change log — myhealth checkup</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <ClipboardList className="h-6 w-6 text-primary" />Admin change log
            </h1>
            <p className="text-sm text-muted-foreground">Every admin action recorded in admin_activity_log, newest first.</p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-32">
              <Label className="text-xs">Window</Label>
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAY_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d} day{d === "1" ? "" : "s"}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label className="text-xs">Resource type</Label>
              <Select value={resourceType} onValueChange={setResourceType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {(typesQuery.data ?? []).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-72">
              <Label className="text-xs" htmlFor="chg-search">Search</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="chg-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Action, resource, admin id…" className="pl-9" />
              </div>
            </div>
            <Button variant="outline" onClick={() => { void listQuery.refetch(); void typesQuery.refetch(); }}>
              <RefreshCw className="mr-2 h-4 w-4" />Refresh
            </Button>
          </div>
        </header>

        <Card variant="outlined" className="p-4">
          {listQuery.isLoading ? (
            <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Diff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatSocDateTime(row.created_at)}</TableCell>
                    <TableCell className="font-mono text-xs">{row.admin_user_id ? row.admin_user_id.slice(0, 8) + "…" : "system"}</TableCell>
                    <TableCell className="text-sm text-foreground">{row.action}</TableCell>
                    <TableCell className="text-sm">
                      <div className="text-foreground">{row.resource_type}</div>
                      <div className="text-xs text-muted-foreground">{row.resource_name ?? row.resource_id ?? "—"}</div>
                    </TableCell>
                    <TableCell>
                      {row.success === false ? (
                        <Badge className="bg-error text-error-foreground">Failed</Badge>
                      ) : (
                        <Badge className="bg-primary-container text-primary-on-container">OK</Badge>
                      )}
                      {row.error_message && <div className="mt-1 max-w-xs text-xs text-error">{row.error_message}</div>}
                    </TableCell>
                    <TableCell className="max-w-md">
                      {(row.old_value || row.new_value) ? (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-muted-foreground">show</summary>
                          <div className="mt-1 grid gap-1 md:grid-cols-2">
                            {row.old_value && (
                              <div>
                                <div className="text-[10px] uppercase text-muted-foreground">Old</div>
                                <pre className="max-h-32 overflow-y-auto rounded bg-muted/30 p-1 text-[11px]">{JSON.stringify(row.old_value, null, 2)}</pre>
                              </div>
                            )}
                            {row.new_value && (
                              <div>
                                <div className="text-[10px] uppercase text-muted-foreground">New</div>
                                <pre className="max-h-32 overflow-y-auto rounded bg-muted/30 p-1 text-[11px]">{JSON.stringify(row.new_value, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        </details>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No admin actions match these filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </>
  );
}
