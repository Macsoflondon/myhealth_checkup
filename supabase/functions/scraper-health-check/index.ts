import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map scraping_jobs.provider_id → provider_tests.provider_id used for counting.
// Some scrapers use a different identifier in scraping_jobs (e.g. medichecks-firecrawl
// writes provider_id="medichecks" into provider_tests).
const PROVIDER_COUNT_MAP: Record<string, string> = {
  'medichecks': 'medichecks',
  'medichecks-firecrawl': 'medichecks',
  'thriva': 'thriva',
  'randox': 'randox',
  'london-medical-laboratory': 'london-medical-laboratory',
  'lola-health': 'lola-health',
  'goodbody-clinic': 'goodbody-clinic',
  'goodbody': 'goodbody-clinic',
  'london-health-company': 'london-health-company',
  'clinilabs': 'clinilabs',
  'medical-diagnosis': 'medical-diagnosis',
};

// Threshold: trigger 'sudden_drop' alert when current count is <= (1 - DROP_PCT) * previous
const DROP_PCT = 0.25;

interface AlertRow {
  provider_id: string;
  alert_type: 'below_floor' | 'sudden_drop' | 'scrape_failed' | 'no_data';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  current_count: number | null;
  previous_count: number | null;
  expected_min: number | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Running scraper health check...');

    const { data: jobs, error: jobsErr } = await supabase
      .from('scraping_jobs')
      .select('provider_id, status, expected_min_tests, last_test_count, last_scraped, error_message');

    if (jobsErr) throw jobsErr;

    const alerts: AlertRow[] = [];

    for (const job of jobs || []) {
      const countProviderId = PROVIDER_COUNT_MAP[job.provider_id] ?? job.provider_id;

      const { count, error: countErr } = await supabase
        .from('provider_tests')
        .select('id', { count: 'exact', head: true })
        .eq('provider_id', countProviderId)
        .eq('is_active', true);

      if (countErr) {
        console.error(`Count query failed for ${job.provider_id}: ${getErrorMessage(countErr)}`);
        continue;
      }

      const current = count ?? 0;
      const previous = job.last_test_count;
      const floor = job.expected_min_tests;

      // Persist current count for next comparison
      await supabase.from('scraping_jobs').update({
        last_test_count: current,
      }).eq('provider_id', job.provider_id);

      // Rule 1: hard floor breach
      if (typeof floor === 'number' && current < floor) {
        alerts.push({
          provider_id: job.provider_id,
          alert_type: 'below_floor',
          severity: current === 0 ? 'critical' : 'warning',
          message: `${job.provider_id}: only ${current} active tests (expected ≥ ${floor}).`,
          current_count: current,
          previous_count: previous,
          expected_min: floor,
        });
      }

      // Rule 2: no data at all
      if (current === 0) {
        alerts.push({
          provider_id: job.provider_id,
          alert_type: 'no_data',
          severity: 'critical',
          message: `${job.provider_id}: zero active tests in catalogue.`,
          current_count: 0,
          previous_count: previous,
          expected_min: floor,
        });
      }

      // Rule 3: sudden drop vs previous run
      if (typeof previous === 'number' && previous > 5 && current <= Math.floor(previous * (1 - DROP_PCT))) {
        const pct = Math.round(((previous - current) / previous) * 100);
        alerts.push({
          provider_id: job.provider_id,
          alert_type: 'sudden_drop',
          severity: pct >= 50 ? 'critical' : 'warning',
          message: `${job.provider_id}: dropped ${pct}% (was ${previous}, now ${current}).`,
          current_count: current,
          previous_count: previous,
          expected_min: floor,
        });
      }

      // Rule 4: scrape failed
      if (job.status === 'failed') {
        alerts.push({
          provider_id: job.provider_id,
          alert_type: 'scrape_failed',
          severity: 'critical',
          message: `${job.provider_id}: last scrape failed — ${job.error_message ?? 'unknown error'}`,
          current_count: current,
          previous_count: previous,
          expected_min: floor,
        });
      }
    }

    // Dedupe: don't re-create an unacknowledged identical alert from the last 24h
    let inserted = 0;
    for (const alert of alerts) {
      const { data: existing } = await supabase
        .from('scraper_alerts')
        .select('id')
        .eq('provider_id', alert.provider_id)
        .eq('alert_type', alert.alert_type)
        .eq('acknowledged', false)
        .gte('created_at', new Date(Date.now() - 24 * 3600000).toISOString())
        .limit(1)
        .maybeSingle();

      if (existing) continue;

      const { error: insErr } = await supabase.from('scraper_alerts').insert(alert);
      if (insErr) {
        console.error(`Failed to insert alert for ${alert.provider_id}: ${getErrorMessage(insErr)}`);
      } else {
        inserted++;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      providers_checked: jobs?.length ?? 0,
      alerts_raised: alerts.length,
      alerts_inserted: inserted,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    const errMsg = getErrorMessage(error);
    console.error('scraper-health-check error:', errMsg);
    return new Response(JSON.stringify({ success: false, error: errMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
