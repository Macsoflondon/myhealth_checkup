/**
 * refresh-trustpilot-ratings
 *
 * Weekly (Sundays 03:00 UTC) refresh of Trustpilot ratings for all 9
 * providers. Uses the shared fetchTrustpilot helper (JSON-LD, 24h cache).
 * Writes trustpilot_rating / trustpilot_review_count / trustpilot_last_checked
 * onto every active provider_tests row for that provider.
 *
 * Also updates the frontend constants source of truth by writing an
 * ai_operation_log row so the weekly report picks up drift; the actual
 * PROVIDER_RATINGS constant refresh is handled by the reconciliation agent.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';
import { fetchTrustpilot } from '../_shared/scrape/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Canonical mapping: provider_id -> Trustpilot business domain
const PROVIDER_DOMAINS: Record<string, string> = {
  'medichecks': 'medichecks.com',
  'medical-diagnosis': 'medicaldiagnosis.co.uk',
  'lola-health': 'lolahealth.com',
  'london-medical-laboratory': 'londonmedicallaboratory.com',
  'london-health-company': 'londonhealthcompany.co.uk',
  'goodbody-clinic': 'goodbodyclinic.com',
  'clinilabs': 'clinilabs.co.uk',
  'randox': 'randoxhealth.com',
  'thriva': 'thriva.co',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const svc = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${svc}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, svc);
  const results: Array<Record<string, unknown>> = [];

  for (const [providerId, domain] of Object.entries(PROVIDER_DOMAINS)) {
    try {
      const tp = await fetchTrustpilot(domain);
      if (!tp || (tp.rating === null && tp.reviewCount === null)) {
        results.push({ providerId, domain, ok: false, reason: 'no_data' });
        continue;
      }

      const nowIso = new Date().toISOString();
      const { error, count } = await supabase
        .from('provider_tests')
        .update({
          trustpilot_rating: tp.rating,
          trustpilot_review_count: tp.reviewCount,
          trustpilot_last_checked: nowIso,
        }, { count: 'exact' })
        .eq('provider_id', providerId)
        .eq('is_active', true);

      if (error) throw error;
      results.push({
        providerId, domain, ok: true,
        rating: tp.rating, reviewCount: tp.reviewCount, rowsUpdated: count,
      });
    } catch (err) {
      results.push({ providerId, domain, ok: false, error: getErrorMessage(err) });
    }
    // Politeness delay between providers.
    await new Promise(r => setTimeout(r, 1500));
  }

  return new Response(JSON.stringify({
    success: true,
    checked_at: new Date().toISOString(),
    results,
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
