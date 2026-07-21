/**
 * backfill-turnaround
 *
 * One-shot backfill that re-parses any existing turnaround-adjacent text
 * on the 597 active provider_tests rows and populates turnaround_raw,
 * turnaround_hours, turnaround_days, turnaround_unit.
 *
 * Sources checked (in order, provider page's own text only — never inferred):
 *   1. existing turnaround_raw (if scraper already captured it)
 *   2. existing description
 *   3. existing test_name
 *
 * When no source contains parseable turnaround language, sets
 * turnaround_unit='not_stated' and turnaround_not_stated=true.
 * Never fabricates numeric values.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';
import { parseTurnaround } from '../_shared/scrape/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  const stats = { scanned: 0, updated: 0, not_stated: 0, errors: 0 };
  const errors: string[] = [];

  try {
    // Page through in chunks of 500.
    let from = 0;
    const pageSize = 500;

    while (true) {
      const { data: rows, error } = await supabase
        .from('provider_tests')
        .select('id, provider_id, test_name, description, turnaround_raw, turnaround_unit')
        .eq('is_active', true)
        .range(from, from + pageSize - 1);
      if (error) throw error;
      if (!rows || rows.length === 0) break;

      for (const row of rows) {
        stats.scanned++;

        // Skip rows that already have a parsed unit — don't overwrite scraper truth.
        if (row.turnaround_unit && row.turnaround_unit !== 'not_stated') continue;

        const sources = [row.turnaround_raw, row.description, row.test_name].filter(Boolean) as string[];
        let matched = null;
        for (const src of sources) {
          const parsed = parseTurnaround(src);
          if (parsed.unit && parsed.unit !== 'not_stated') {
            matched = { ...parsed, source: src };
            break;
          }
        }

        const update = matched
          ? {
              turnaround_raw: matched.raw ?? matched.source,
              turnaround_hours: matched.hours,
              turnaround_days: matched.days,
              turnaround_unit: matched.unit,
              turnaround_not_stated: false,
            }
          : {
              turnaround_raw: row.turnaround_raw ?? null,
              turnaround_hours: null,
              turnaround_days: null,
              turnaround_unit: 'not_stated',
              turnaround_not_stated: true,
            };

        const { error: uErr } = await supabase
          .from('provider_tests')
          .update(update)
          .eq('id', row.id);
        if (uErr) {
          stats.errors++;
          errors.push(`${row.id}: ${getErrorMessage(uErr)}`);
        } else if (matched) {
          stats.updated++;
        } else {
          stats.not_stated++;
        }
      }

      if (rows.length < pageSize) break;
      from += pageSize;
    }

    return new Response(JSON.stringify({
      success: true,
      stats,
      firstErrors: errors.slice(0, 10),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: getErrorMessage(err), stats }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
