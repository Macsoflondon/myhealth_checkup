import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchAffiliatePerformance,
  importAffiliateConversions,
  type PerformanceBucket,
} from "@/api/supabase/affiliate.api";
import { parseConversionsCsv } from "@/lib/affiliate/parse-conversions-csv";
import { AFFILIATE_PROVIDERS } from "@/lib/affiliate/affiliate-config";
import { londonDayStart, nextLondonDayStart } from "@/lib/affiliate/london-day";

const isoDay = (d: Date): string => d.toISOString().slice(0, 10);
const gbp = (n: number): string =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    n,
  );
const pct = (n: number | null): string =>
  n === null ? "–" : `${(n * 100).toFixed(1)}%`;

function BucketTable({
  title,
  rows,
  keyName,
}: {
  title: string;
  rows: PerformanceBucket[];
  keyName: "provider_id" | "placement";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No data for this range.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2">
                  {keyName === "provider_id" ? "Provider" : "Placement"}
                </th>
                <th className="py-2 text-right">Clicks</th>
                <th className="py-2 text-right">Conversions</th>
                <th className="py-2 text-right">Rate</th>
                <th className="py-2 text-right">Commission</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r[keyName] ?? "none"}
                  className="border-t border-border"
                >
                  <td className="py-2">{r[keyName] ?? "–"}</td>
                  <td className="py-2 text-right">
                    {r.clicks.toLocaleString("en-GB")}
                  </td>
                  <td className="py-2 text-right">
                    {r.conversions.toLocaleString("en-GB")}
                  </td>
                  <td className="py-2 text-right">{pct(r.conversion_rate)}</td>
                  <td className="py-2 text-right">{gbp(r.commission_gbp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminAffiliatePage() {
  const today = new Date();
  const [from, setFrom] = useState(
    isoDay(new Date(today.getTime() - 30 * 86_400_000)),
  );
  const [to, setTo] = useState(isoDay(today));
  const [provider, setProvider] = useState("");
  const [importProvider, setImportProvider] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const qc = useQueryClient();

  const perf = useQuery({
    queryKey: ["affiliate-performance", from, to, provider],
    queryFn: () =>
      fetchAffiliatePerformance(
        londonDayStart(from),
        nextLondonDayStart(to),
        provider || null,
      ),
  });

  const importer = useMutation({
    mutationFn: importAffiliateConversions,
    onSuccess: (s) => {
      setMessages((m) => [
        `Imported ${s.imported} rows: ${s.matched} matched to a click, ${s.unmatched} unmatched.`,
        ...m,
      ]);
      void qc.invalidateQueries({ queryKey: ["affiliate-performance"] });
    },
    onError: (e: unknown) =>
      setMessages([e instanceof Error ? e.message : "Import failed."]),
  });

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const { rows, errors, duplicatesDropped } = parseConversionsCsv(
      await file.text(),
      importProvider || null,
    );
    setMessages(
      duplicatesDropped > 0
        ? [
            `Dropped ${duplicatesDropped} duplicate rows (kept the last of each).`,
            ...errors,
          ]
        : errors,
    );
    if (rows.length) importer.mutate(rows);
  };

  const t = perf.data?.totals;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Affiliate performance</h1>
        <p className="text-sm text-muted-foreground">
          Clicks on booking links and conversions imported from affiliate
          networks. Commission never affects ranking.
        </p>
      </div>

      <Card>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
          <div>
            <Label htmlFor="aff-from">From</Label>
            <Input
              id="aff-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="aff-to">To</Label>
            <Input
              id="aff-to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="aff-provider">Provider</Label>
            <select
              id="aff-provider"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="">All providers</option>
              {Object.keys(AFFILIATE_PROVIDERS).map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {perf.isError && (
        <p className="text-sm text-destructive">
          {perf.error instanceof Error
            ? perf.error.message
            : "Could not load figures."}
        </p>
      )}

      {t && (
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            ["Clicks", t.clicks.toLocaleString("en-GB")],
            ["Conversions", t.conversions.toLocaleString("en-GB")],
            ["Conversion rate", pct(t.conversion_rate)],
            ["Commission", gbp(t.commission_gbp)],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {perf.data && (
        <div className="grid gap-4 lg:grid-cols-2">
          <BucketTable
            title="By provider"
            rows={perf.data.by_provider}
            keyName="provider_id"
          />
          <BucketTable
            title="By placement"
            rows={perf.data.by_placement}
            keyName="placement"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import conversions (CSV)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Needs a reference and date column; click ID (subid, clickref),
            status, order value and commission are optional. Dates may be
            DD/MM/YYYY. Re-importing updates existing rows.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="aff-import-provider">
                Provider for this file
              </Label>
              <select
                id="aff-import-provider"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={importProvider}
                onChange={(e) => setImportProvider(e.target.value)}
              >
                <option value="">Use provider column</option>
                {Object.keys(AFFILIATE_PROVIDERS).map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="aff-file">CSV file</Label>
              <Input
                id="aff-file"
                type="file"
                accept=".csv,text/csv"
                disabled={importer.isPending}
                onChange={(e) => void onFile(e.target.files?.[0])}
              />
            </div>
          </div>
          {importer.isPending && <Button disabled>Importing…</Button>}
          {messages.length > 0 && (
            <ul className="list-disc pl-5 text-sm">
              {messages.slice(0, 20).map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
