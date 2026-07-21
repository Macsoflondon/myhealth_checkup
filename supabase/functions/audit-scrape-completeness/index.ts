/**
 * audit-scrape-completeness
 *
 * Reconciliation & acceptance report. Per-provider computes:
 *   - counts by data_status (complete/partial/not_stated)
 *   - active rows with price = 0 (BLOCKER)
 *   - active rows with null turnaround_unit (BLOCKER)
 *   - active rows with null biomarker_count
 *   - active rows with last_validated_at older than 7 days
 *
 * If any provider fails acceptance criteria, writes a scraper_alerts row
 * so the SOC surface picks it up.
 *
 * Called via cron (daily 04:00 UTC) or admin dashboard "Run audit" button.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProviderReport {
  provider_id: string;
  total_active: number;
  complete: number;
  partial: number;
  not_stated: number;
  zero_price_active: number;
  null_turnaround_active: number;
  null_biomarker_count_active: number;
  stale_active: number;
  passes_acceptance: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const authHeader = req.headers.get('Authorization') ?? '';
  if (authHeader !== `Bearer ${svc}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, svc);
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  try {
    const { data: providers, error: pErr } = await supabase
      .from('provider_tests')
      .select('provider_id')
      .eq('is_active', true);
    if (pErr) throw pErr;

    const providerIds = [...new Set((providers ?? []).map((r: { provider_id: string }) => r.provider_id))];
    const reports: ProviderReport[] = [];

    for (const providerId of providerIds) {
      const { data: rows, error } = await supabase
        .from('provider_tests')
        .select('id, price, biomarker_count, turnaround_unit, data_status, last_validated_at')
        .eq('provider_id', providerId)
        .eq('is_active', true);
      if (error) throw error;

      const active = rows ?? [];
      const r: ProviderReport = {
        provider_id: providerId,
        total_active: active.length,
        complete: active.filter(x => x.data_status === 'complete').length,
        partial: active.filter(x => x.data_status === 'partial').length,
        not_stated: active.filter(x => x.data_status === 'not_stated').length,
        zero_price_active: active.filter(x => x.price === 0).length,
        null_turnaround_active: active.filter(x => x.turnaround_unit === null || x.turnaround_unit === undefined).length,
        null_biomarker_count_active: active.filter(x => x.biomarker_count === null || x.biomarker_count === undefined).length,
        stale_active: active.filter(x => !x.last_validated_at || x.last_validated_at < sevenDaysAgo).length,
        passes_acceptance: false,
      };

      r.passes_acceptance =
        r.zero_price_active === 0 &&
        r.null_turnaround_active === 0 &&
        r.stale_active === 0;

      reports.push(r);

      // Fail loudly per provider
      if (!r.passes_acceptance) {
        await supabase.from('scraper_alerts').insert({
          provider_id: providerId,
          alert_type: 'completeness_audit_failure',
          severity: r.zero_price_active > 0 ? 'critical' : 'warning',
          message: `Audit: ${r.zero_price_active} £0 active, ${r.null_turnaround_active} null turnaround, ${r.stale_active} stale (>7d) out of ${r.total_active}`,
          current_count: r.zero_price_active + r.null_turnaround_active + r.stale_active,
          expected_min: 0,
        });
      }
    }

    // Recompute data_status / field_completeness_score is done live by upsertWithProvenance;
    // here we just backstop any active row that has never been touched by the new pipeline.
    // NB: intentionally no fabricated values — we only set data_status='not_stated' where
    // ALL required fields are absent.
    try {
      const { error: backstopErr } = await supabase.rpc('audit_backstop_data_status');
      if (backstopErr) console.warn('[audit] backstop RPC not present or failed (safe to ignore):', backstopErr);
    } catch (e) {
      console.warn('[audit] backstop RPC threw (safe to ignore):', e);
    }

    return new Response(JSON.stringify({
      success: true,
      generated_at: new Date().toISOString(),
      providers: reports,
      overall_pass: reports.every(r => r.passes_acceptance),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    const msg = getErrorMessage(err);
    console.error('audit-scrape-completeness error:', msg);
    return new Response(JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
