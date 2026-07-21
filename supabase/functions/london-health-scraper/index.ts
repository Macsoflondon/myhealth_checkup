/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';
import { firecrawlScrape, firecrawlMap, runInChunks } from '../_shared/firecrawl-helpers.ts';
import {
  parsePrice,
  parseTurnaround,
  normaliseBiomarkers,
  upsertWithProvenance,
  startScrapeRun,
  finishScrapeRun,
  newCounters,
} from '../_shared/scrape/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROVIDER_ID = 'london-health-company';
const BASE_URL = 'https://www.londonhealthcompany.co.uk';

function determineCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  if (text.match(/cancer|tumour|psa|ca125|cea/)) return 'Cancer Screening';
  if (text.match(/liver/)) return 'Liver Function';
  if (text.match(/heart|cardiovascular|cholesterol|lipid|cardiac/)) return 'Heart Health';
  if (text.match(/fertility|amh|ovarian/)) return 'Fertility';
  if (text.match(/thyroid|tsh|t3|t4/)) return 'Thyroid';
  if (text.match(/vitamin|mineral|b12|d3|folate/)) return 'Vitamins & Minerals';
  if (text.match(/iron|ferritin|anaemia/)) return 'Iron & Anaemia';
  if (text.match(/diabetes|glucose|hba1c/)) return 'Diabetes';
  if (text.match(/women|female|menopause|pcos/)) return "Women's Health";
  if (text.match(/men|male|testosterone|prostate/)) return "Men's Health";
  if (text.match(/kidney|renal/)) return 'Kidney Function';
  if (text.match(/hormone|cortisol|dhea/)) return 'Hormones';
  if (text.match(/sports|fitness|performance/)) return 'Sports & Fitness';
  return 'General Health';
}

const LHC_BIOMARKER_TERMS = [
  'vitamin', 'b12', 'folate', 'iron', 'ferritin', 'calcium', 'magnesium',
  'testosterone', 'oestradiol', 'progesterone', 'fsh', 'lh', 'cortisol', 'dhea',
  'tsh', 't3', 't4', 'cholesterol', 'hdl', 'ldl', 'triglyceride', 'alt', 'ast',
  'bilirubin', 'albumin', 'creatinine', 'urea', 'egfr', 'glucose', 'hba1c', 'crp',
  'haemoglobin', 'platelet', 'psa', 'thyroid', 'shbg', 'prolactin', 'ca125', 'cea',
];

function extractBiomarkers(markdown: string): string[] {
  const out: string[] = [];
  for (const line of markdown.split('\n')) {
    const clean = line.replace(/^[\s*•\-]+/, '').trim();
    if (clean.length > 2 && clean.length < 80 && LHC_BIOMARKER_TERMS.some(t => clean.toLowerCase().includes(t))) {
      out.push(clean);
    }
  }
  return normaliseBiomarkers(out);
}

/** Look for anything that reads like turnaround language on the page. */
function extractTurnaroundText(markdown: string): string | null {
  const patterns = [
    /(?:turnaround|results?(?:\s+in)?|report(?:ed)?\s+within|delivered\s+within|available\s+within)[^.\n]{0,80}/i,
    /(?:next\s+(?:working\s+)?day|same\s+day|24[\s-]?48\s*hours?|\d+\s*[-–]\s*\d+\s*(?:hours?|working\s+days?|days?)|\d+\s*(?:hours?|working\s+days?|days?))/i,
  ];
  for (const p of patterns) {
    const m = markdown.match(p);
    if (m) return m[0].trim();
  }
  return null;
}

async function mapLondonHealth(baseUrl: string, apiKey: string): Promise<string[]> {
  const links = await firecrawlMap(baseUrl, apiKey, { search: 'blood test health', limit: 200 });
  return links.filter((l) =>
    (l.includes('/product') || l.includes('/test') || l.includes('/blood-test') || l.includes('/health'))
    && !l.includes('?') && !l.includes('#') && !l.includes('/cart') && !l.includes('/account')
    && !l.includes('/blog') && !l.includes('/contact') && !l.includes('/about')
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const _serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${_serviceKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');

  const supabase = createClient(supabaseUrl, supabaseKey);
  const runId = await startScrapeRun(supabase, PROVIDER_ID, 'london-health-scraper');
  const counters = newCounters();

  try {
    if (!firecrawlApiKey) throw new Error('FIRECRAWL_API_KEY not configured');

    console.log('Starting London Health Company Firecrawl scraper...');
    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'running', last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    let productUrls: string[] = [];
    try {
      productUrls = await mapLondonHealth(BASE_URL, firecrawlApiKey);
    } catch (e) {
      console.error('Map failed:', getErrorMessage(e));
    }

    if (productUrls.length < 5) {
      try {
        const homeResult = await firecrawlScrape(BASE_URL, firecrawlApiKey, {
          formats: ['markdown'], onlyMainContent: true, waitFor: 1500, timeout: 60000, proxy: 'stealth',
        });
        if (homeResult.success && homeResult.data?.markdown) {
          for (const m of homeResult.data.markdown.matchAll(/\((https?:\/\/[^)]+)\)/g)) {
            if (m[1].includes('londonhealthcompany') && !m[1].includes('/blog') && !m[1].includes('/about')) {
              productUrls.push(m[1]);
            }
          }
        }
      } catch (e) {
        console.error('Homepage scrape failed:', getErrorMessage(e));
      }
    }

    productUrls = [...new Set(productUrls)];
    console.log(`Total URLs: ${productUrls.length}`);

    type Product = {
      test_name: string; provider_test_id: string; url: string;
      price: number | null; category: string; description: string;
      biomarker_count: number | null; biomarkers_list: string[] | null;
      turnaround_raw: string | null;
    };
    const products: Product[] = [];

    await runInChunks(productUrls.slice(0, 60), 8, async (url) => {
      const slug = new URL(url).pathname.split('/').filter(Boolean).pop() || '';
      const result = await firecrawlScrape(url, firecrawlApiKey, {
        formats: ['markdown'], onlyMainContent: true, waitFor: 1500, timeout: 60000, proxy: 'stealth',
      });
      if (!result.success || !result.data) return;

      const markdown: string = result.data.markdown || '';
      const metadata: any = result.data.metadata || {};

      let title = metadata.title?.replace(/\s*[–|]\s*London\s*Health.*$/i, '').trim() || '';
      if (!title) {
        const h1 = markdown.match(/^#\s+(.+)$/m);
        title = h1 ? h1[1].trim() : '';
      }
      if (!title || title.length < 3) return;

      const priceParsed = parsePrice(markdown);
      const biomarkers = extractBiomarkers(markdown);
      const bioCountMatch = markdown.match(/(\d+)\s*(?:biomarkers?|tests?|markers?)/i);
      const biomarkerCount = bioCountMatch
        ? parseInt(bioCountMatch[1])
        : (biomarkers.length || null);

      const turnaroundRaw = extractTurnaroundText(markdown);

      products.push({
        test_name: title,
        provider_test_id: `lhc-${slug}`,
        url,
        price: priceParsed.price,
        category: determineCategory(title, metadata.description || ''),
        description: metadata.description || `${title} from London Health Company.`,
        biomarker_count: biomarkerCount,
        biomarkers_list: biomarkers.length ? biomarkers : null,
        turnaround_raw: turnaroundRaw,
      });
    });

    // Dedupe by test_name (case-insensitive).
    const seen = new Set<string>();
    const deduped = products.filter(p => {
      const k = p.test_name.toLowerCase().trim();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    counters.tests_seen = deduped.length;

    const errors: string[] = [];
    const deactivatedForZeroPrice: string[] = [];

    for (const p of deduped) {
      const turnaround = parseTurnaround(p.turnaround_raw ?? '');

      // Blocker fix: never publish an active row with £0. If the provider page
      // shows no price, deactivate the row and log the reason.
      if (p.price === null || p.price === 0) {
        deactivatedForZeroPrice.push(p.provider_test_id);
        const { error: deactivateErr } = await supabase
          .from('provider_tests')
          .update({
            is_active: false,
            in_stock: false,
            price_not_stated: true,
            last_validated_at: new Date().toISOString(),
            scrape_source_url: p.url,
            data_status: 'not_stated',
          })
          .eq('provider_id', PROVIDER_ID)
          .eq('provider_test_id', p.provider_test_id);
        if (deactivateErr) {
          errors.push(`${p.provider_test_id}: deactivate failed - ${getErrorMessage(deactivateErr)}`);
        }
        counters.tests_deactivated++;
        continue;
      }

      const res = await upsertWithProvenance(supabase, {
        provider_id: PROVIDER_ID,
        provider_test_id: p.provider_test_id,
        test_name: p.test_name,
        price: p.price,
        biomarker_count: p.biomarker_count,
        biomarkers_list: p.biomarkers_list,
        turnaround_raw: p.turnaround_raw,
        turnaround_hours: turnaround.hours,
        turnaround_days: turnaround.days,
        turnaround_unit: turnaround.unit,
        sample_type: 'Venous blood',
        collection_method: 'Clinic',
        in_stock: true,
        scrape_source_url: p.url,
      }, { scrapeRunId: runId });

      if (!res.ok) {
        errors.push(`${p.provider_test_id}: ${res.error}`);
      } else if (res.action === 'inserted') counters.tests_new++;
      else if (res.action === 'updated') counters.tests_updated++;

      // Extra provenance fields not owned by upsertWithProvenance.
      if (res.providerTestId) {
        await supabase.from('provider_tests').update({
          category: p.category,
          description: p.description,
          clinic_visit_available: true,
          home_kit_available: false,
        }).eq('id', res.providerTestId);
      }
    }

    if (deactivatedForZeroPrice.length) {
      console.warn(`[lhc] Deactivated ${deactivatedForZeroPrice.length} rows with £0 price: ${deactivatedForZeroPrice.slice(0, 5).join(', ')}`);
    }

    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'completed',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 12 * 3600000).toISOString(),
      error_message: errors.length ? `${errors.length} row errors` : null,
    }, { onConflict: 'provider_id' });

    await finishScrapeRun(supabase, runId, counters, errors.length ? 'partial' : 'success');

    return new Response(JSON.stringify({
      success: true,
      testsSeen: counters.tests_seen,
      testsNew: counters.tests_new,
      testsUpdated: counters.tests_updated,
      deactivatedZeroPrice: deactivatedForZeroPrice.length,
      errors: errors.slice(0, 10),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    const msg = getErrorMessage(error);
    console.error('London Health scraper error:', msg);
    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'failed',
      error_message: msg, last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });
    await finishScrapeRun(supabase, runId, counters, 'error');
    return new Response(JSON.stringify({ success: false, error: msg }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
