/**
 * DiagnosticTestComparison
 * Drop-in comparison scaffold — reads the unified Supabase view
 * `unified_provider_tests` and renders search + filter + 7-row comparison table.
 * Uses src/lib/comparisonFormat.ts as the single label/fee/review source of truth.
 */
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Search, Building2, Layers, CheckCircle2, Check, Minus, X, ExternalLink,
  AlertCircle, Loader2,
} from "lucide-react";
import {
  type SampleType,
  type CollectionMethod,
  type CollectionFeeType,
  type ClinicalReviewType,
  SAMPLE_TYPE_LABELS,
  COLLECTION_METHOD_LABELS,
  formatPrice,
  formatCollectionFee,
  formatClinicalReview,
  computeTotalExpectedCost,
} from "@/lib/comparisonFormat";

/* ------------------------------------------------------------------ types */
export interface UnifiedTest {
  id: string;
  provider_id: string;
  provider_name: string;
  test_name: string;
  description: string | null;
  price: number | string | null;
  category_primary: string | null;
  body_system: string | null;
  sample_type: SampleType | null;
  collection_method: CollectionMethod | null;
  collection_fee_type: CollectionFeeType | null;
  collection_fee_amount: number | string | null;
  clinical_review_type: ClinicalReviewType | null;
  clinical_review_fee: number | string | null;
  total_expected_cost: number | string | null;
  biomarker_count: number | null;
  turnaround_days_text: string | null;
  url: string | null;
  url_verified: boolean | null;
  is_popular: boolean | null;
  popularity_rank: number | null;
}

const MAX_COMPARE = 5;
const DASH = "—";

const PROVIDER_COLOR: Record<string, string> = {
  "Randox Health": "#2f6fd0", "Medichecks": "#10a0a0", "Thriva": "#7c5cd6",
  "Lola Health": "#e0533d", "Goodbody Clinic": "#3a9a52",
  "London Medical Laboratory": "#2b66b8", "London Health Company": "#2f9ac4",
  "Medical Diagnosis": "#5b6bd6", "Clinilabs": "#8a9a2e",
};
const colorFor = (n: string) => PROVIDER_COLOR[n] ?? "#46566b";
const initials = (n: string) =>
  n.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const num = (v: number | string | null | undefined): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? null : n;
};

/* ------------------------------------------------------------------ data */
function useUnifiedTests() {
  return useQuery({
    queryKey: ["unified_provider_tests"],
    queryFn: async (): Promise<UnifiedTest[]> => {
      const { data, error } = await (supabase as any)
        .from("unified_provider_tests")
        .select(
          "id,provider_id,provider_name,test_name,description,price,category_primary,body_system," +
            "sample_type,collection_method,collection_fee_type,collection_fee_amount," +
            "clinical_review_type,clinical_review_fee,total_expected_cost,biomarker_count," +
            "turnaround_days_text,url,url_verified,is_popular,popularity_rank"
        )
        .order("price", { ascending: true });
      if (error) throw error;
      return (data ?? []) as UnifiedTest[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* ============================================================== component */
export default function DiagnosticTestComparison() {
  const { data, isLoading, error } = useUnifiedTests();
  const tests = data ?? [];

  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("all");
  const [provider, setProvider] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);

  const systems = useMemo(() => {
    const m = new Map<string, { n: number; providers: Set<string>; min: number; max: number }>();
    for (const t of tests) {
      const s = t.body_system ?? "Other";
      const p = num(t.price);
      const e = m.get(s) ?? { n: 0, providers: new Set(), min: Infinity, max: -Infinity };
      e.n++; e.providers.add(t.provider_name);
      if (p != null) { e.min = Math.min(e.min, p); e.max = Math.max(e.max, p); }
      m.set(s, e);
    }
    return [...m.entries()]
      .map(([name, v]) => ({ name, n: v.n, providers: v.providers.size, min: v.min, max: v.max }))
      .sort((a, b) => b.n - a.n);
  }, [tests]);

  const providers = useMemo(
    () => [...new Set(tests.map((t) => t.provider_name))].sort(),
    [tests]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tests.filter((t) => {
      if (system !== "all" && (t.body_system ?? "Other") !== system) return false;
      if (provider !== "all" && t.provider_name !== provider) return false;
      if (q && !`${t.test_name} ${t.provider_name}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tests, query, provider, system]);

  const selectedTests = useMemo(() => {
    const list = selected.map((id) => tests.find((t) => t.id === id)).filter(Boolean) as UnifiedTest[];
    return list;
  }, [selected, tests]);

  const bestValueId = useMemo(() => {
    let best: { id: string; total: number } | null = null;
    for (const t of selectedTests) {
      const total = computeTotalExpectedCost(
        num(t.price) ?? 0, t.collection_fee_type, num(t.collection_fee_amount),
        t.clinical_review_type, num(t.clinical_review_fee)
      );
      if (!best || total < best.total) best = { id: t.id, total };
    }
    return best?.id ?? null;
  }, [selectedTests]);

  const toggle = (id: string) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= MAX_COMPARE ? cur : [...cur, id]
    );

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading unified catalogue…
      </div>
    );
  if (error)
    return (
      <div className="mx-auto my-12 flex max-w-md flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="text-sm text-red-700">
          Couldn't load <code>unified_provider_tests</code>. Check the view exists and is granted to anon.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-slate-800">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Diagnostic test comparison</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Unified, live catalogue across every platform provider — one normalised source, primary
          category plus a body-system lens.
        </p>
        <div className="mt-4 flex flex-wrap gap-6">
          <Stat value={providers.length} label="providers" icon={<Building2 className="h-4 w-4" />} />
          <Stat value={systems.length} label="body systems" icon={<Layers className="h-4 w-4" />} />
          <Stat value={tests.length} label="active tests" icon={<CheckCircle2 className="h-4 w-4" />} />
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tests or providers…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
          />
        </div>
        <SelectFilter value={system} onChange={setSystem} label="System"
          options={[["all", "All systems"], ...systems.map((s) => [s.name, s.name] as [string, string])]} />
        <SelectFilter value={provider} onChange={setProvider} label="Provider"
          options={[["all", "All providers"], ...providers.map((p) => [p, p] as [string, string])]} />
      </div>

      {system === "all" && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {systems.map((s) => (
            <button key={s.name} onClick={() => setSystem(s.name)}
              className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-400 hover:shadow-sm">
              <span className="text-sm font-semibold text-slate-900">{s.name}</span>
              <span className="mt-1 whitespace-nowrap text-xs text-slate-500">{s.n} tests · {s.providers} providers</span>
              <span className="mt-2 text-xs font-medium text-slate-700">{formatPrice(s.min)}–{formatPrice(s.max)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <span className="text-sm font-medium text-slate-600">
            {filtered.length} {filtered.length === 1 ? "test" : "tests"}{system !== "all" ? ` · ${system}` : ""}
          </span>
          <span className="text-xs text-slate-400">Pick up to {MAX_COMPARE} to compare</span>
        </div>
        <ul className="divide-y divide-slate-100">
          {filtered.slice(0, 200).map((t) => {
            const on = selected.includes(t.id);
            const full = !on && selected.length >= MAX_COMPARE;
            return (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-[11px] font-extrabold text-white"
                  style={{ background: colorFor(t.provider_name) }}>{initials(t.provider_name)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">{t.test_name}</span>
                    {t.is_popular && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Popular</span>}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {t.provider_name} · {t.biomarker_count ? `${t.biomarker_count} biomarkers` : DASH} ·{" "}
                    {t.sample_type ? SAMPLE_TYPE_LABELS[t.sample_type] : "Not specified"}
                  </div>
                </div>
                <span className="flex-none text-sm font-bold" style={{ color: colorFor(t.provider_name) }}>{formatPrice(num(t.price))}</span>
                <button onClick={() => toggle(t.id)} disabled={full}
                  className={"flex-none rounded-lg border px-2.5 py-1.5 text-xs font-medium transition " +
                    (on ? "border-rose-200 bg-rose-50 text-rose-600"
                      : full ? "cursor-not-allowed border-slate-100 text-slate-300"
                      : "border-slate-200 text-slate-600 hover:border-slate-400")}>
                  {on ? "Remove" : "Compare"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {selectedTests.length > 0 && (
        <ComparisonTable tests={selectedTests} bestValueId={bestValueId} onRemove={toggle} onClear={() => setSelected([])} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------ subcomponents */
function Stat({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{icon}</span>
      <span className="text-xl font-bold text-slate-900">{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}

function SelectFilter({ value, onChange, options, label }: {
  value: string; onChange: (v: string) => void; options: [string, string][]; label: string;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-medium text-slate-700 outline-none">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

function ComparisonTable({ tests, bestValueId, onRemove, onClear }: {
  tests: UnifiedTest[]; bestValueId: string | null;
  onRemove: (id: string) => void; onClear: () => void;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="text-sm font-semibold text-slate-900">Comparing {tests.length} of {MAX_COMPARE}</span>
        <button onClick={onClear} className="text-xs font-medium text-slate-500 underline">Clear all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-40 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Provider</th>
              {tests.map((t) => (
                <th key={t.id} className="min-w-[210px] border-l border-slate-100 px-4 py-3 align-top">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-[10px] font-extrabold text-white"
                        style={{ background: colorFor(t.provider_name) }}>{initials(t.provider_name)}</span>
                      <div className="text-left">
                        <div className="text-xs font-semibold" style={{ color: colorFor(t.provider_name) }}>{t.provider_name}</div>
                        <div className="text-xs font-medium leading-tight text-slate-700">{t.test_name}</div>
                        {t.id === bestValueId && (
                          <span className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">Best value</span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => onRemove(t.id)} className="flex-none text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Biomarkers" tests={tests} render={(t) => t.biomarker_count
              ? <span className="font-semibold text-slate-900">{t.biomarker_count}</span> : <NotSpec />} />
            <Row label="Turnaround Time" tests={tests} zebra render={(t) =>
              t.turnaround_days_text ? <span>{t.turnaround_days_text}</span> : <NotSpec />} />
            <Row label="Sample Type" tests={tests} render={(t) =>
              t.sample_type ? <span>{SAMPLE_TYPE_LABELS[t.sample_type]}</span> : <NotSpec />} />
            <Row label="Collection Method" tests={tests} zebra render={(t) =>
              t.collection_method
                ? <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" />{COLLECTION_METHOD_LABELS[t.collection_method]}</span>
                : <NotSpec />} />
            <Row label="Additional Collection Fees" tests={tests} render={(t) => {
              const fee = formatCollectionFee(t.collection_fee_type, num(t.collection_fee_amount));
              if (t.collection_fee_type == null) return <NotSpec />;
              return fee.isFree
                ? <span className="text-slate-600">{fee.label}</span>
                : <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">{fee.label}</span>;
            }} />
            <tr className="bg-slate-50">
              <td className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700">Total Expected Cost</td>
              {tests.map((t) => {
                const total = computeTotalExpectedCost(
                  num(t.price) ?? 0, t.collection_fee_type, num(t.collection_fee_amount),
                  t.clinical_review_type, num(t.clinical_review_fee));
                const optionalNote = t.clinical_review_type === "optional" && num(t.clinical_review_fee) != null;
                return (
                  <td key={t.id} className="border-l border-slate-100 px-4 py-3">
                    <span className="text-base font-bold" style={{ color: colorFor(t.provider_name) }}>{formatPrice(total)}</span>
                    {optionalNote && (
                      <span className="mt-0.5 block text-[10px] text-slate-400">+{formatPrice(num(t.clinical_review_fee))} if you add review</span>
                    )}
                  </td>
                );
              })}
            </tr>
            <Row label="Clinical Review" tests={tests} render={(t) => {
              if (t.clinical_review_type == null) return <NotSpec />;
              const r = formatClinicalReview(t.clinical_review_type, num(t.clinical_review_fee));
              return (
                <span className="inline-flex items-center gap-1.5">
                  {r.isIncluded
                    ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                    : <Minus className="h-3.5 w-3.5 text-slate-300" />}
                  {r.label}
                </span>
              );
            }} />
            <tr>
              <td className="sticky left-0 z-10 bg-white px-4 py-3" />
              {tests.map((t) => (
                <td key={t.id} className="border-l border-slate-100 px-4 py-3">
                  {t.url ? (
                    <a href={t.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-white"
                      style={{ background: colorFor(t.provider_name) }}>Book <ExternalLink className="h-3 w-3" /></a>
                  ) : <span className="text-xs text-slate-400">{DASH}</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, tests, render, zebra }: {
  label: string; tests: UnifiedTest[]; render: (t: UnifiedTest) => React.ReactNode; zebra?: boolean;
}) {
  return (
    <tr className={zebra ? "bg-slate-50/60" : ""}>
      <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-xs font-medium text-slate-500">{label}</td>
      {tests.map((t) => (
        <td key={t.id} className="border-l border-slate-100 px-4 py-3 text-slate-700">{render(t)}</td>
      ))}
    </tr>
  );
}

const NotSpec = () => <span className="text-slate-400">Not specified</span>;
