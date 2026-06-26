import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell } from "../SectionShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Result {
  table: string;
  rows: any[];
}

export default function SearchSection() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const search = async () => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const [tests, providers, logs] = await Promise.all([
        supabase.from("tests_master").select("id,test_name,category").ilike("test_name", `%${q}%`).limit(10),
        supabase.from("provider_tests").select("id,provider_name,test_name").ilike("test_name", `%${q}%`).limit(10),
        supabase.from("audit_logs").select("id,action,resource_type,created_at").ilike("action", `%${q}%`).limit(10),
      ]);
      setResults([
        { table: "tests_master", rows: tests.data ?? [] },
        { table: "provider_tests", rows: providers.data ?? [] },
        { table: "audit_logs", rows: logs.data ?? [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionShell title="Global Search" description="Search across tests, providers and logs." status="stub">
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <Button onClick={search} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
      </div>
      <div className="space-y-6">
        {results.map((r) => (
          <div key={r.table} className="rounded-xl border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
              {r.table} · {r.rows.length} result{r.rows.length === 1 ? "" : "s"}
            </div>
            <pre className="text-[11px] overflow-x-auto">{JSON.stringify(r.rows, null, 2)}</pre>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
