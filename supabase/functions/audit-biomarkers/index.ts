import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * audit-biomarkers
 *
 * Reconciles every active test in `provider_tests` against its live provider
 * page. Extracts the biomarker list from the page (provider-specific section
 * scoping) and records a row in `biomarker_audit_runs` whenever the stored
 * data differs from what the provider currently publishes.
 *
 * Nothing in `provider_tests` is mutated — the admin reviews the audit table
 * and approves corrections individually.
 *
 * Body:
 *   { provider_id?: string; limit?: number; run_id?: string }
 *
 * Auth: service-role only (called from admin dashboard via server proxy or
 * directly with the service-role key).
 */

const BIOMARKER_TERMS = [
  'vitamin', 'b12', 'folate', 'iron', 'ferritin', 'transferrin', 'calcium',
  'magnesium', 'zinc', 'copper', 'selenium', 'phosphate', 'sodium', 'potassium',
  'chloride', 'testosterone', 'oestradiol', 'estradiol', 'progesterone', 'fsh',
  'lh', 'prolactin', 'dhea', 'cortisol', 'shbg', 'free androgen', 'tsh', 't3',
  't4', 'cholesterol', 'hdl', 'ldl', 'triglyceride', 'liver', 'alt', 'ast',
  'ggt', 'alp', 'bilirubin', 'albumin', 'creatinine', 'urea', 'egfr', 'glucose',
  'hba1c', 'crp', 'esr', 'haemoglobin', 'platelet', 'psa', 'thyroid', 'tpo',
  'amh', 'insulin', 'cea', 'ca125', 'ca 125', 'ca19-9', 'afp', 'beta hcg',
  'homocysteine', 'uric acid', 'lipoprotein', 'apolipoprotein', 'fibrinogen',
];

/**
 * Provider-specific section anchors. The scraper scopes biomarker extraction
 * to the slice of markdown between an "include" anchor and the next "stop"
 * anchor (or end of doc).
 */
const SECTION_BOUNDS: Record<string, { include: RegExp[]; stop: RegExp[] }> = {
  'goodbody-clinic': {
    include: [/what biomarkers do we test/i, /biomarkers included/i, /## understanding/i],
    stop: [/available testing locations/i, /related products/i, /^## /m],
  },
  medichecks: {
    include: [/biomarkers/i, /what's measured/i, /what is included/i],
    stop: [/why choose medichecks/i, /how it works/i, /related/i],
  },
  thriva: {
    include: [/what we test/i, /biomarkers/i],
    stop: [/why thriva/i, /how it works/i, /faqs/i],
  },
  randox: {
    include: [/biomarkers/i, /what's tested/i, /what is tested/i, /parameters/i],
    stop: [/why randox/i, /how it works/i, /faqs/i],
  },
  'london-medical-laboratory': {
    include: [/biomarkers/i, /what's measured/i, /what is included/i, /test profile includes/i],
    stop: [/why choose/i, /how it works/i],
  },
  'lola-health': {
    include: [/biomarkers/i, /what's tested/i],
    stop: [/how it works/i, /why lola/i],
  },
  'london-health-company': {
    include: [/biomarkers/i, /what's tested/i],
    stop: [/how it works/i],
  },
  clinilabs: {
    include: [/biomarkers/i, /what's tested/i, /test includes/i],
    stop: [/how it works/i],
  },
  'tuli-health': {
    include: [/biomarkers/i, /what's tested/i],
    stop: [/how it works/i],
  },
};

function extractSection(markdown: string, providerId: string): string {
  const bounds = SECTION_BOUNDS[providerId];
  if (!bounds) return markdown;
  let startIdx = -1;
  for (const re of bounds.include) {
    const m = markdown.match(re);
    if (m && m.index !== undefined) {
      startIdx = m.index;
      break;
    }
  }
  if (startIdx < 0) return '';
  const sliced = markdown.slice(startIdx + 1);
  let endIdx = sliced.length;
  for (const re of bounds.stop) {
    const m = sliced.match(re);
    if (m && m.index !== undefined && m.index < endIdx) {
      endIdx = m.index;
    }
  }
  return markdown.slice(startIdx, startIdx + endIdx);
}

function extractBiomarkers(section: string): string[] {
  if (!section) return [];
  const out = new Set<string>();
  for (const rawLine of section.split('\n')) {
    const line = rawLine.replace(/^[\s*•\-]+/, '').replace(/[*_`]/g, '').trim();
    if (!line) continue;
    if (line.length < 2 || line.length > 90) continue;
    if (/^#/.test(line)) continue;
    const lc = line.toLowerCase();
    if (BIOMARKER_TERMS.some((t) => lc.includes(t))) {
      // strip trailing prices, parentheticals are kept
      const cleaned = line.replace(/\s*£\d.*$/, '').trim();
      if (cleaned.length >= 2) out.add(cleaned);
    }
  }
  return [...out];
}

async function firecrawlScrape(url: string, apiKey: string): Promise<any> {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true, waitFor: 1500 }),
  });
  if (!response.ok) throw new Error(`Firecrawl ${response.status}`);
  return response.json();
}

function classifyDelta(
  storedList: string[] | null,
  storedCount: number | null,
  scraped: string[],
): string {
  if (!scraped.length) return 'extraction-failed';
  const sc = scraped.length;
  const has = storedList && storedList.length > 0;
  if (!has && storedCount == null) return 'missing-stored';
  if (has && storedList!.length === sc && storedCount === sc) {
    // basic name overlap check
    const a = new Set(storedList!.map((s) => s.toLowerCase()));
    const overlap = scraped.filter((s) => a.has(s.toLowerCase())).length;
    if (overlap === sc) return 'match';
    return 'list-mismatch';
  }
  if (storedCount !== sc) return 'count-mismatch';
  return 'list-mismatch';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const authHeader = req.headers.get('Authorization') ?? '';

  // Accept either the service-role bearer (cron / server callers) or an
  // authenticated admin user's JWT (Control Centre UI).
  const isServiceRole = serviceKey.length > 0 && authHeader === `Bearer ${serviceKey}`;
  let isAdmin = false;
  if (!isServiceRole) {
    if (!authHeader || !supabaseUrl || !anonKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized: missing bearer token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: invalid session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { data: hasAdmin } = await userClient.rpc('has_role', { _user_id: user.id, _role: 'admin' });
    if (!hasAdmin) {
      return new Response(JSON.stringify({ error: 'Admin role required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    isAdmin = true;
  }
  void isAdmin;


  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) throw new Error('FIRECRAWL_API_KEY not configured');

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);

    const body = await req.json().catch(() => ({}));
    const providerFilter: string | undefined = body.provider_id;
    const limit: number = Math.min(Math.max(body.limit ?? 25, 1), 100);
    const runId: string = body.run_id ?? crypto.randomUUID();

    let query = supabase
      .from('provider_tests')
      .select('id, provider_id, provider_test_id, test_name, url, biomarkers_list, biomarker_count')
      .eq('is_active', true)
      .not('url', 'is', null)
      .order('updated_at', { ascending: true })
      .limit(limit);
    if (providerFilter) query = query.eq('provider_id', providerFilter);

    const { data: tests, error } = await query;
    if (error) throw error;

    const results: any[] = [];
    for (const t of tests ?? []) {
      try {
        const scrape = await firecrawlScrape(t.url!, firecrawlApiKey);
        const markdown = scrape?.data?.markdown ?? scrape?.markdown ?? '';
        const section = extractSection(markdown, t.provider_id);
        const biomarkers = extractBiomarkers(section);
        const storedList: string[] | null = Array.isArray(t.biomarkers_list)
          ? (t.biomarkers_list as any[]).map((b) =>
              typeof b === 'string' ? b : b?.name || b?.biomarker_name || String(b),
            )
          : null;
        const delta = classifyDelta(storedList, t.biomarker_count, biomarkers);

        results.push({
          run_id: runId,
          provider_id: t.provider_id,
          provider_test_id: t.provider_test_id,
          test_name: t.test_name,
          url: t.url,
          stored_list: storedList,
          stored_count: t.biomarker_count,
          scraped_biomarkers: biomarkers,
          scraped_count: biomarkers.length,
          delta,
        });
      } catch (e) {
        results.push({
          run_id: runId,
          provider_id: t.provider_id,
          provider_test_id: t.provider_test_id,
          test_name: t.test_name,
          url: t.url,
          stored_list: t.biomarkers_list,
          stored_count: t.biomarker_count,
          scraped_biomarkers: null,
          scraped_count: 0,
          delta: 'extraction-failed',
          notes: e instanceof Error ? e.message : String(e),
        });
      }
      await new Promise((r) => setTimeout(r, 700));
    }

    if (results.length) {
      const { error: insertErr } = await supabase.from('biomarker_audit_runs').insert(results);
      if (insertErr) throw insertErr;
    }

    return new Response(
      JSON.stringify({
        success: true,
        run_id: runId,
        audited: results.length,
        mismatches: results.filter((r) => r.delta !== 'match').length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
