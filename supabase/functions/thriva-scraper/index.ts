/**
 * Thriva scraper — CRUX rebuild.
 * Firecrawl map + scrape. Home finger-prick only; no clinic option.
 * Writes via shared provenance pipeline.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { logProtectedCall } from '../_shared/audit.ts';
import { getErrorMessage } from '../_shared/errors.ts';
import { firecrawlScrape, firecrawlMap, runInChunks } from '../_shared/firecrawl-helpers.ts';
import {
  upsertWithProvenance,
  parseTurnaround,
  normaliseBiomarkers,
  startScrapeRun,
  finishScrapeRun,
  newCounters,
} from '../_shared/scrape/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROVIDER_ID = 'thriva';
const HOME_KIT_FEE = 0; // included

const KNOWN_PRODUCTS = [
  { slug: 'womens-hormones-blood-test-insights', name: "Women's Hormones Blood Test" },
  { slug: 'mens-health-blood-test', name: "Men's Health Blood Test" },
  { slug: 'general-health-check', name: 'General Health Blood Test' },
  { slug: 'thyroid-blood-test', name: 'Thyroid Blood Test' },
  { slug: 'pcos-blood-test-insights', name: 'PCOS Blood Test' },
  { slug: 'fertility-insights-blood-test', name: 'Fertility Insights Blood Test' },
  { slug: 'menopause-insights-blood-test', name: 'Menopause Insights Blood Test' },
  { slug: 'amh-blood-test', name: 'AMH Blood Test' },
  { slug: 'cholesterol-blood-test', name: 'Cardiovascular Health Blood Test' },
  { slug: 'vitamins-blood-test', name: 'Vitamins Blood Test' },
  { slug: 'omega-3-6-blood-test', name: 'Omega-3 Index Blood Test' },
  { slug: 'sports-performance-blood-test', name: 'Sports Performance Blood Test' },
  { slug: 'psa-blood-test', name: 'PSA Blood Test' },
  { slug: 'lpa-cardiovascular-risk-profile', name: 'Lp(a) Cardiovascular Risk Profile' },
];

function inferCategory(name: string): string {
  const t = name.toLowerCase();
  if (/women|pcos|menopause|amh|fertility/.test(t)) return "Women's Health";
  if (/men's|psa|prostate/.test(t)) return "Men's Health";
  if (/thyroid/.test(t)) return 'Thyroid';
  if (/cardiovascular|cholesterol|lp\(a\)|omega/.test(t)) return 'Heart Health';
  if (/vitamin/.test(t)) return 'Vitamins & Minerals';
  if (/sport|performance/.test(t)) return 'Sports & Fitness';
  return 'General Health';
}

function extractTurnaround(text: string): string | null {
  const patterns: RegExp[] = [
    /results?\s+(?:in|within|typically\s+in)\s+((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /turnaround(?:\s+time)?[:\-]?\s*((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /(\d+\s*(?:-|to|–)\s*\d+\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /\b(\d+\s+working\s+days?)\b/i,
    /(next\s+working\s+day)/i,
    /(same[\s-]?day)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) {
      const num = m[1].match(/(\d+)/);
      if (num && (parseInt(num[1], 10) === 0 || parseInt(num[1], 10) > 60)) continue;
      return m[1].trim();
    }
  }
  return null;
}

function extractBiomarkersMd(md: string): string[] {
  const items = new Set<string>();
  const terms = /vitamin|b12|folate|iron|ferritin|calcium|magnesium|testosterone|oestradiol|progesterone|fsh|lh|prolactin|dhea|cortisol|tsh|t3|t4|cholesterol|hdl|ldl|triglyceride|liver|alt|ast|bilirubin|albumin|creatinine|urea|egfr|glucose|hba1c|crp|haemoglobin|platelet|psa|thyroid|omega/i;
  for (const line of md.split('\n')) {
    const clean = line.replace(/^[\s*•-]+/, '').trim();
    if (clean.length > 2 && clean.length < 80 && terms.test(clean)) items.add(clean);
  }
  return normaliseBiomarkers(Array.from(items));
}

async function mapThriva(apiKey: string): Promise<string[]> {
  const links = await firecrawlMap('https://thriva.co/shop', apiKey, { search: 'blood test', limit: 100 });
  return links.filter((l) => l.includes('/shop/blood-tests/') && !l.includes('?'));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${serviceKey}`) {
    await logProtectedCall({ functionName: 'thriva-scraper', status: 'denied', req });
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  await logProtectedCall({ functionName: 'thriva-scraper', status: 'allowed', req });

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);
  const counters = newCounters();
  const runId = await startScrapeRun(supabase, PROVIDER_ID, 'thriva-scraper', {
    started_at: new Date().toISOString(),
  });

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) throw new Error('FIRECRAWL_API_KEY not configured');

    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'running', last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    let productUrls: string[] = [];
    try { productUrls = await mapThriva(firecrawlApiKey); } catch (e) {
      console.error('[thriva] map failed:', getErrorMessage(e));
    }
    for (const p of KNOWN_PRODUCTS) {
      const url = `https://thriva.co/shop/blood-tests/${p.slug}`;
      if (!productUrls.includes(url)) productUrls.push(url);
    }
    productUrls = [...new Set(productUrls)];
    counters.tests_seen = productUrls.length;
    console.log(`[thriva] ${productUrls.length} URLs to scrape`);

    await runInChunks(productUrls, 6, async (url) => {
      const slug = url.split('/').pop() || '';
      const known = KNOWN_PRODUCTS.find(p => p.slug === slug);
      const result = await firecrawlScrape(url, firecrawlApiKey, {
        formats: ['markdown'], onlyMainContent: true, waitFor: 1500, timeout: 60000, proxy: 'stealth',
      });
      if (!result.success || !result.data) return;

      const markdown = result.data.markdown || '';
      const metadata = result.data.metadata || {};
      let title = metadata.title?.replace(/\s*[–|]\s*Thriva.*$/i, '').trim() || '';
      if (!title) {
        const h1 = markdown.match(/^#\s+(.+)$/m);
        title = h1 ? h1[1].trim() : (known?.name || slug.replace(/-/g, ' '));
      }

      const priceMatch = markdown.match(/£([\d,]+\.\d{2})/);
      const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null;
      const inStock = price !== null && price > 0;

      const biomarkers = extractBiomarkersMd(markdown);
      const biomarkersList = biomarkers.length > 0 ? biomarkers : null;
      const bioCountMatch = markdown.match(/(\d+)\s*biomarkers?/i);
      const biomarkerCount = biomarkersList?.length ?? (bioCountMatch ? parseInt(bioCountMatch[1]) : null);
      const turnaroundRaw = extractTurnaround(markdown);
      const parsedTurn = parseTurnaround(turnaroundRaw);

      const upsertResult = await upsertWithProvenance(supabase, {
        provider_id: PROVIDER_ID,
        provider_test_id: `thriva-${slug}`,
        test_name: title,
        url,
        price,
        collection_fee: HOME_KIT_FEE,
        home_visit_fee: null,
        gp_review_fee: 0,
        total_expected_cost: price,
        biomarker_count: biomarkerCount,
        biomarkers_list: biomarkersList,
        turnaround_raw: turnaroundRaw,
        turnaround_hours: parsedTurn.hours,
        turnaround_days: parsedTurn.days,
        turnaround_unit: parsedTurn.unit,
        sample_type: 'Finger-prick',
        collection_method: 'Home finger-prick kit',
        in_stock: inStock,
        scrape_source_url: url,
      }, { scrapeRunId: runId, outOfStock: !inStock });

      if (!upsertResult.ok) { counters.errors.push({ test: title, message: upsertResult.error ?? 'upsert failed' }); return; }
      if (upsertResult.action === 'inserted') counters.tests_new++;
      else if (upsertResult.action === 'updated') counters.tests_updated++;

      if (upsertResult.providerTestId) {
        await supabase.from('provider_tests').update({
          description: metadata.description || '',
          category: inferCategory(title),
          home_kit_available: true,
          clinic_visit_available: false,
          phlebotomy_included: true,
          url_verified: true,
          url_verified_at: new Date().toISOString(),
          scraped_at: new Date().toISOString(),
        }).eq('id', upsertResult.providerTestId);
      }
    });

    await supabase.from('scraping_jobs').update({
      status: 'completed', error_message: null,
      next_scrape: new Date(Date.now() + 12 * 3600000).toISOString(),
    }).eq('provider_id', PROVIDER_ID);

    await finishScrapeRun(supabase, runId, counters, counters.errors.length > 0 ? 'partial' : 'success');
    return new Response(JSON.stringify({
      success: true, provider: PROVIDER_ID, run_id: runId,
      tests_seen: counters.tests_seen, tests_new: counters.tests_new, tests_updated: counters.tests_updated,
      errors: counters.errors.slice(0, 10),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    const msg = getErrorMessage(err);
    console.error('[thriva] fatal:', msg);
    await supabase.from('scraping_jobs').update({ status: 'failed', error_message: msg }).eq('provider_id', PROVIDER_ID);
    await finishScrapeRun(supabase, runId, counters, 'error');
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
