/**
 * Goodbody Clinic scraper — CRUX rebuild.
 * Firecrawl map + scrape. Clinic + optional home visit.
 * Writes via shared provenance pipeline. Biomarkers curated manually in
 * src/data/goodbodyTestDetails.ts — this scraper does NOT overwrite them.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';
import { firecrawlScrape, firecrawlMap, runInChunks } from '../_shared/firecrawl-helpers.ts';
import {
  upsertWithProvenance,
  parseTurnaround,
  startScrapeRun,
  finishScrapeRun,
  newCounters,
} from '../_shared/scrape/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROVIDER_ID = 'goodbody-clinic';
const CLINIC_VISIT_FEE = 0; // included in listed price
const HOME_NURSE_FEE = null; // not offered as standard

function determineCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  if (/cancer|tumour|tumor|psa|ca125|cea|afp|bowel screen/.test(text)) return 'Cancer Screening';
  if (/liver/.test(text)) return 'Liver Function';
  if (/heart|cardiovascular|cholesterol|lipid|cardiac/.test(text)) return 'Heart Health';
  if (/fertility|amh|ovarian|egg reserve/.test(text)) return 'Fertility';
  if (/thyroid|tsh|t3|t4/.test(text)) return 'Thyroid';
  if (/vitamin|mineral|b12|d3|folate|nutritional/.test(text)) return 'Vitamins & Minerals';
  if (/iron|ferritin|anaemia|anemia/.test(text)) return 'Iron & Anaemia';
  if (/diabetes|glucose|hba1c|blood sugar/.test(text)) return 'Diabetes';
  if (/well\s*woman|female|menopause|pcos|perimenopause/.test(text)) return "Women's Health";
  if (/well\s*man|male|testosterone|prostate|erectile/.test(text)) return "Men's Health";
  if (/kidney|renal/.test(text)) return 'Kidney Function';
  if (/inflammation|crp|autoimmune/.test(text)) return 'Inflammation';
  if (/hormone|cortisol|dhea|endocrine/.test(text)) return 'Hormones';
  if (/blood count|fbc|cbc|haematology/.test(text)) return 'Blood Count';
  if (/sti|std|sexual|chlamydia|gonorrhoea/.test(text)) return 'Sexual Health';
  if (/allergy|intolerance|food sensitivity/.test(text)) return 'Allergy';
  if (/sports|fitness|performance|athlete/.test(text)) return 'Sports & Fitness';
  if (/fatigue|tiredness|energy/.test(text)) return 'Fatigue & Energy';
  return 'General Health';
}

function extractPriceFromHtml(html: string): number | null {
  if (!html) return null;
  const dataAmountMatches = [...html.matchAll(/data-amount=["'](\d+(?:\.\d{1,2})?)["']/gi)];
  if (dataAmountMatches.length) {
    const amounts = dataAmountMatches.map(m => parseFloat(m[1])).filter(n => n > 10 && n < 5000);
    if (amounts.length) return Math.max(...amounts);
  }
  const jsonPrice = html.match(/"price"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/i);
  if (jsonPrice) {
    const p = parseFloat(jsonPrice[1]);
    if (p > 10 && p < 5000) return p;
  }
  const og = html.match(/property=["']og:price:amount["'][^>]*content=["']([\d.]+)["']/i);
  if (og) {
    const p = parseFloat(og[1]);
    if (p > 10 && p < 5000) return p;
  }
  return null;
}

function stripShopifySizeSuffix(url: string): string {
  return url.replace(/_(\d+)x(\d+)?(?:_[a-z_]+)?(\.(?:jpe?g|png|webp|gif|avif))/i, '$3');
}

function extractImageFromHtml(html: string, markdown: string): string | null {
  const candidates: string[] = [];
  const og = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
  if (og) candidates.push(og[1]);
  const featured = html.match(/"featured_image"\s*:\s*"([^"]+\.(?:jpe?g|png|webp))"/i);
  if (featured) candidates.push(featured[1].replace(/\\\//g, '/'));
  const mdImg = markdown.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+\.(?:jpe?g|png|webp)[^)\s]*)\)/i);
  if (mdImg) candidates.push(mdImg[1]);
  for (let raw of candidates) {
    if (!raw) continue;
    if (raw.startsWith('//')) raw = 'https:' + raw;
    raw = raw.replace(/([?&])width=\d+&?/gi, '$1').replace(/[?&]$/, '');
    raw = stripShopifySizeSuffix(raw);
    if (/^https?:\/\//i.test(raw)) return raw;
  }
  return null;
}

function extractTurnaround(md: string): string | null {
  const patterns: RegExp[] = [
    /results?\s+(?:in|within|typically\s+in)\s+((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /turnaround(?:\s+time)?[:\-]?\s*((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /(\d+\s*(?:-|to|–)\s*\d+\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /\b(\d+\s+working\s+days?)\b/i,
    /(next\s+working\s+day)/i,
    /(same[\s-]?day)/i,
  ];
  for (const re of patterns) {
    const m = md.match(re);
    if (m && m[1]) {
      const num = m[1].match(/(\d+)/);
      if (num && (parseInt(num[1], 10) === 0 || parseInt(num[1], 10) > 60)) continue;
      return m[1].trim();
    }
  }
  return null;
}

async function mapGoodbody(apiKey: string): Promise<string[]> {
  const links = await firecrawlMap('https://goodbodyclinic.com/collections/all', apiKey, { search: 'blood test', limit: 200 });
  return links.filter((l) => l.includes('/products/') && !l.includes('?') && !l.includes('gift-card'));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const authHeader = req.headers.get('Authorization') ?? '';
  const supabaseUrlEnv = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const isServiceRole = serviceKey.length > 0 && authHeader === `Bearer ${serviceKey}`;

  if (!isServiceRole) {
    if (!authHeader || !supabaseUrlEnv || !anonKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userClient = createClient(supabaseUrlEnv, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { data: hasAdminRole } = await userClient.rpc('has_role', { _user_id: user.id, _role: 'admin' });
    if (!hasAdminRole) {
      return new Response(JSON.stringify({ error: 'Admin only' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  const supabase = createClient(supabaseUrlEnv, serviceKey);
  const counters = newCounters();
  const runId = await startScrapeRun(supabase, PROVIDER_ID, 'goodbody-scraper', {
    started_at: new Date().toISOString(),
  });

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) throw new Error('FIRECRAWL_API_KEY not configured');

    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'running', last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    let productUrls: string[] = [];
    try { productUrls = await mapGoodbody(firecrawlApiKey); } catch (e) {
      console.error('[goodbody] map failed:', getErrorMessage(e));
    }
    const knownSlugs = [
      'advanced-vitamins-blood-test', 'advanced-well-man-blood-test', 'advanced-well-woman-blood-test',
      'anaemia-blood-test', 'iron-blood-test', 'menopause-blood-test', 'prostate-psa-blood-test',
      'testosterone-blood-test', 'thyroid-function-blood-test', 'gp-consultation',
    ];
    for (const slug of knownSlugs) {
      const url = `https://goodbodyclinic.com/products/${slug}`;
      if (!productUrls.includes(url)) productUrls.push(url);
    }
    productUrls = [...new Set(productUrls)];
    counters.tests_seen = productUrls.length;
    console.log(`[goodbody] ${productUrls.length} URLs to scrape`);

    await runInChunks(productUrls, 6, async (url) => {
      const slug = url.split('/products/').pop() || '';
      const result = await firecrawlScrape(url, firecrawlApiKey, {
        formats: ['markdown', 'html'], onlyMainContent: false, waitFor: 1500, timeout: 60000, proxy: 'stealth',
      });
      if (!result.success || !result.data) return;

      const markdown = result.data.markdown || '';
      const html = result.data.html || result.data.rawHtml || '';
      const metadata = result.data.metadata || {};

      let title = '';
      const h1 = markdown.match(/^#\s+(.+)$/m);
      if (h1) title = h1[1].replace(/\s*[–|]\s*Goodbody.*$/i, '').trim();
      title = title || metadata.title?.replace(/\s*[–|]\s*Goodbody.*$/i, '').trim() || '';
      if (!title || title === 'Unknown Test') return;

      let price = extractPriceFromHtml(html);
      if (!price) {
        const instalment = markdown.match(/4\s*(?:interest-free\s*)?payments?\s*of\s*£([\d,]+(?:\.\d{1,2})?)/i);
        const inst = instalment ? parseFloat(instalment[1].replace(',', '')) : 0;
        if (inst > 0) price = +(inst * 4).toFixed(2);
      }
      const inStock = price !== null && price > 10;
      const description = markdown.substring(0, 500).replace(/[#*[\]]/g, '').trim();
      const category = determineCategory(title, description);
      const turnaroundRaw = extractTurnaround(markdown);
      const parsedTurn = parseTurnaround(turnaroundRaw);
      const imageUrl = extractImageFromHtml(html, markdown)
        || (metadata.ogImage ? stripShopifySizeSuffix(metadata.ogImage) : null);

      const upsertResult = await upsertWithProvenance(supabase, {
        provider_id: PROVIDER_ID,
        provider_test_id: slug,
        test_name: title,
        url,
        price,
        collection_fee: CLINIC_VISIT_FEE,
        home_visit_fee: HOME_NURSE_FEE,
        gp_review_fee: 0,
        total_expected_cost: price,
        // biomarkers curated manually — do NOT overwrite
        biomarker_count: undefined,
        biomarkers_list: undefined,
        turnaround_raw: turnaroundRaw,
        turnaround_hours: parsedTurn.hours,
        turnaround_days: parsedTurn.days,
        turnaround_unit: parsedTurn.unit,
        sample_type: 'Venous blood',
        collection_method: 'Clinic phlebotomy; home visit on request',
        in_stock: inStock,
        scrape_source_url: url,
      }, { scrapeRunId: runId, outOfStock: !inStock });

      if (!upsertResult.ok) { counters.errors.push({ test: title, message: upsertResult.error ?? 'upsert failed' }); return; }
      if (upsertResult.action === 'inserted') counters.tests_new++;
      else if (upsertResult.action === 'updated') counters.tests_updated++;

      if (upsertResult.providerTestId) {
        const extras: Record<string, unknown> = {
          description: metadata.description || description || `${title} from Goodbody Clinic.`,
          category,
          clinic_visit_available: true,
          home_kit_available: true,
          phlebotomy_included: true,
          url_verified: true,
          url_verified_at: new Date().toISOString(),
          scraped_at: new Date().toISOString(),
        };
        if (imageUrl) extras.image_url = imageUrl;
        await supabase.from('provider_tests').update(extras).eq('id', upsertResult.providerTestId);
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
    console.error('[goodbody] fatal:', msg);
    await supabase.from('scraping_jobs').update({ status: 'failed', error_message: msg }).eq('provider_id', PROVIDER_ID);
    await finishScrapeRun(supabase, runId, counters, 'error');
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
