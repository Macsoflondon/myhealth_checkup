import { useEffect, useState } from "react";
import { SectionShell, StatCard } from "../SectionShell";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface ConversionRow {
  category: string;
  starts: number;
  completes: number;
  rate: number;
}

interface ProviderClickRow {
  provider_id: string;
  clicks: number;
}

interface RevenueRow {
  provider_id: string;
  total: number;
}

const COLORS = ["#22c0d4", "#0a2540", "#e70d69", "#f59e0b", "#10b981", "#6366f1", "#ec4899", "#14b8a6"];

export default function AnalyticsSection() {
  const [conversionData, setConversionData] = useState<ConversionRow[]>([]);
  const [clickData, setClickData] = useState<ProviderClickRow[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // 1. Conversion Rate by Category
        const { data: starts } = await supabase
          .from("funnel_events")
          .select("entity_name")
          .eq("funnel_stage", "quiz_start");

        const { data: completes } = await supabase
          .from("funnel_events")
          .select("entity_name")
          .eq("funnel_stage", "quiz_complete");

        const startCounts: Record<string, number> = {};
        const completeCounts: Record<string, number> = {};

        (starts || []).forEach((r) => {
          const cat = r.entity_name || "General";
          startCounts[cat] = (startCounts[cat] || 0) + 1;
        });
        (completes || []).forEach((r) => {
          const cat = r.entity_name || "General";
          completeCounts[cat] = (completeCounts[cat] || 0) + 1;
        });

        const allCats = new Set([...Object.keys(startCounts), ...Object.keys(completeCounts)]);
        const convRows: ConversionRow[] = Array.from(allCats).map((cat) => {
          const s = startCounts[cat] || 0;
          const c = completeCounts[cat] || 0;
          return { category: cat, starts: s, completes: c, rate: s > 0 ? Math.round((c / s) * 100) : 0 };
        });
        setConversionData(convRows);

        // 2. Clicks by Provider
        const { data: clicks } = await supabase
          .from("funnel_events")
          .select("provider_id")
          .eq("funnel_stage", "provider_click")
          .not("provider_id", "is", null);

        const clickCounts: Record<string, number> = {};
        (clicks || []).forEach((r) => {
          const pid = r.provider_id || "unknown";
          clickCounts[pid] = (clickCounts[pid] || 0) + 1;
        });
        setClickData(Object.entries(clickCounts).map(([provider_id, clicks]) => ({ provider_id, clicks })));

        // 3. Revenue by Referral
        const { data: revenue } = await supabase
          .from("revenue_events")
          .select("provider_id, amount");

        const revCounts: Record<string, number> = {};
        (revenue || []).forEach((r) => {
          const pid = r.provider_id || "unknown";
          revCounts[pid] = (revCounts[pid] || 0) + Number(r.amount || 0);
        });
        setRevenueData(Object.entries(revCounts).map(([provider_id, total]) => ({ provider_id, total: Math.round(total * 100) / 100 })));
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalStarts = conversionData.reduce((a, r) => a + r.starts, 0);
  const totalCompletes = conversionData.reduce((a, r) => a + r.completes, 0);
  const overallRate = totalStarts > 0 ? Math.round((totalCompletes / totalStarts) * 100) : 0;
  const totalClicks = clickData.reduce((a, r) => a + r.clicks, 0);
  const totalRevenue = revenueData.reduce((a, r) => a + r.total, 0);

  if (loading) {
    return (
      <SectionShell title="Historical Analytics" description="Conversion, click & revenue dashboards." status="live">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell title="Historical Analytics" description="Conversion, click & revenue dashboards." status="live">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Quiz Starts" value={totalStarts} />
        <StatCard label="Quiz Completes" value={totalCompletes} />
        <StatCard label="Conversion Rate" value={`${overallRate}%`} tone={overallRate >= 50 ? "good" : overallRate >= 25 ? "warn" : "bad"} />
        <StatCard label="Total Revenue" value={`\u00a3${totalRevenue.toFixed(2)}`} tone={totalRevenue > 0 ? "good" : "default"} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Rate by Category */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Conversion Rate by Category</h3>
          {conversionData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No funnel data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={conversionData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="rate" fill="#22c0d4" radius={[4, 4, 0, 0]} name="Conversion %" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Clicks by Provider */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Clicks by Provider</h3>
          {clickData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No click data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={clickData} dataKey="clicks" nameKey="provider_id" cx="50%" cy="50%" outerRadius={100} label={({ provider_id, clicks }) => `${provider_id} (${clicks})`}>
                  {clickData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Revenue by Referral */}
        <div className="rounded-xl border bg-card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Revenue by Referral Source</h3>
          {revenueData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No revenue data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="provider_id" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="\u00a3" />
                <Tooltip formatter={(v: number) => `\u00a3${v.toFixed(2)}`} />
                <Bar dataKey="total" fill="#e70d69" radius={[4, 4, 0, 0]} name="Revenue (\u00a3)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6 text-center">
        Data sourced from <code>funnel_events</code> and <code>revenue_events</code> tables. Updates in real-time.
      </p>
    </SectionShell>
  );
}
