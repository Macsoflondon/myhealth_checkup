/**
 * Randox Health scraper — CRUX rebuild.
 * Custom HTML product pages. Retains soft-hyphen/duplicate cleanup and
 * Firecrawl URL discovery. Writes via shared provenance pipeline.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { getErrorMessage } from '../_shared/errors.ts';
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

const PROVIDER_ID = 'randox';

// Randox: clinic-based tests include phlebotomy in listed price; home kits are finger-prick (no fee).
const HOME_KIT_FEE = 0;
const CLINIC_VISIT_FEE = 0;

const knownProductUrls = [
  'https://randoxhealth.com/en-GB/product/clinic/discovery-health-check',
  'https://randoxhealth.com/en-GB/product/clinic/everyman-test',
  'https://randoxhealth.com/en-GB/product/clinic/everywoman-test',
  'https://randoxhealth.com/en-GB/product/clinic/signature-platinum-test',
  'https://randoxhealth.com/en-GB/product/clinic/signature-platinum-plus-test',
  'https://randoxhealth.com/en-GB/product/clinic/signature-prestige-test',
  'https://randoxhealth.com/en-GB/product/clinic/essential-health-check',
  'https://randoxhealth.com/en-GB/product/home/general-health-test',
  'https://randoxhealth.com/en-GB/product/home/thyroid-function-home-test',
  'https://randoxhealth.com/en-GB/product/home/female-hormone-Quickdraw',
  'https://randoxhealth.com/en-GB/product/home/male-hormone-quickdraw',
  'https://randoxhealth.com/en-GB/product/home/home-sti-test',
  'https://randoxhealth.com/en-GB/product/home/food-sensitivity-test',
  'https://randoxhealth.com/en-GB/product/home/gut-microbiome-test',
  'https://randoxhealth.com/en-GB/product/home/nutrition-lifestyle-dna-home-test-kit',
  'https://randoxhealth.com/en-GB/product/home/amh-home-test',
  'https://randoxhealth.com/en-GB/product/home/psa-home-test',
  'https://randoxhealth.com/en-GB/product/home/haemochromatosis-home-test-kit',
  'https://randoxhealth.com/en-GB/product/home/coeliac-disease-home-test-kit',
  'https://randoxhealth.com/en-GB/product/home/vitamin-d-home-test',
  'https://randoxhealth.com/en-GB/product/home/liver-function-home-test',
];

const biomarkerPatterns = [
  'TSH','T3','T4','Free T3','Free T4','FT3','FT4','Thyroid Peroxidase','TPO','Thyroglobulin',
  'Testosterone','Free Testosterone','Oestradiol','Estradiol','Progesterone','LH','FSH',
  'Prolactin','DHEA','DHEA-S','Cortisol','SHBG','Free Androgen Index','AMH',
  'Vitamin D','25-OH','Vitamin B12','Folate','Ferritin','Iron','TIBC','Transferrin',
  'Magnesium','Zinc','Selenium','Vitamin B6','Active B12','Vitamin A','Vitamin E',
  'ALT','AST','GGT','ALP','Bilirubin','Albumin','Total Protein','Globulin',
  'Creatinine','eGFR','Urea','Uric Acid','Cystatin C',
  'Total Cholesterol','HDL','LDL','Triglycerides','Non-HDL','Cholesterol Ratio','VLDL',
  'Haemoglobin','Hemoglobin','RBC','WBC','Platelets','Haematocrit','MCV','MCH','MCHC',
  'Neutrophils','Lymphocytes','Monocytes','Eosinophils','Basophils','Reticulocytes',
  'HbA1c','Glucose','Fasting Glucose','Insulin','HOMA-IR','C-Peptide',
  'CRP','ESR','hsCRP','Homocysteine','Fibrinogen','PSA','Total PSA','Free PSA',
  'Omega-3','Omega-6','ApoB','ApoA1','Lp(a)','Lipoprotein','sdLDL',
];

const GARBAGE_NAMES = [
  'product not found','randox health',"we'll be back soon","we'll be back soon!",
  'page not found','404','error','maintenance',
];

function cleanTitle(raw: string): string {
  return raw
    .replace(/\u00AD/g, '').replace(/\u200B/g, '').replace(/\u200C/g, '')
    .replace(/\u200D/g, '').replace(/\uFEFF/g, '').replace(/\s+/g, ' ').trim();
}

function isGarbageName(name: string): boolean {
  const lower = name.toLowerCase().trim();
  return GARBAGE_NAMES.some(g => lower === g || lower.includes(g));
}

function extractTitle(html: string): string {
  const patterns = [
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /property="og:title"\s+content="([^"]+)"/i,
    /content="([^"]+)"\s+property="og:title"/i,
    /<title>([^|<]+)/i,
  ];
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m && m[1]) {
      const t = cleanTitle(m[1].replace(/\s*[|-]\s*Randox.*$/i, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'"));
      if (t && !isGarbageName(t)) return t;
    }
  }
  return '';
}

function extractDescription(html: string): string | null {
  const patterns = [
    /property="og:description"\s+content="([^"]+)"/i,
    /name="description"\s+content="([^"]+)"/i,
  ];
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m && m[1]) return cleanTitle(m[1]).substring(0, 500);
  }
  return null;
}

function extractPrice(html: string): { current: number | null; original: number | null } {
  let current: number | null = null;
  let original: number | null = null;

  const jsonLdBlocks = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdBlocks) {
    for (const block of jsonLdBlocks) {
      try {
        const json = block.replace(/<script[^>]*>|<\/script>/gi, '');
        const data = JSON.parse(json);
        if (data.offers?.price) current = parseFloat(data.offers.price);
        if (data['@graph']) {
          for (const item of data['@graph']) {
            if (item.offers?.price) { current = parseFloat(item.offers.price); break; }
          }
        }
      } catch { /* ignore */ }
    }
  }

  if (current === null) {
    // Anchored £ patterns only — never grab a bare number
    const pricePatterns = [
      /Total:\s*£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /class="[^"]*price[^"]*"[^>]*>[\s\S]*?£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      />\s*£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\s*</i,
      /£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/,
    ];
    for (const pattern of pricePatterns) {
      const m = html.match(pattern);
      if (m && m[1]) {
        const n = parseFloat(m[1].replace(',', ''));
        if (n >= 20 && n < 10000) { current = n; break; }
      }
    }
  }

  const originalPatterns = [
    /class="[^"]*was[^"]*"[^>]*>[\s\S]*?£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /<del[^>]*>[\s\S]*?£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /<s[^>]*>[\s\S]*?£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
  ];
  for (const pattern of originalPatterns) {
    const m = html.match(pattern);
    if (m && m[1]) {
      original = parseFloat(m[1].replace(',', ''));
      break;
    }
  }

  return { current, original };
}

function extractImageUrl(html: string): string | null {
  const patterns = [
    /property="og:image"\s+content="([^"]+)"/i,
    /src="(https:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i,
  ];
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m && m[1]) {
      let url = m[1];
      if (url.startsWith('//')) url = 'https:' + url;
      else if (url.startsWith('/')) url = 'https://randoxhealth.com' + url;
      return url;
    }
  }
  return null;
}

function extractBiomarkersList(html: string): string[] | null {
  const biomarkers: string[] = [];
  const sectionPatterns = [
    /what['']?s\s+included[\s\S]{0,3000}/i,
    /biomarkers?\s+tested[\s\S]{0,2000}/i,
    /tests?\s+included[\s\S]{0,2000}/i,
  ];
  let searchText = html;
  for (const p of sectionPatterns) {
    const m = html.match(p);
    if (m) { searchText = m[0]; break; }
  }
  for (const b of biomarkerPatterns) {
    const re = new RegExp(`\\b${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (re.test(searchText)) {
      const norm = b.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      if (!biomarkers.includes(norm)) biomarkers.push(norm);
    }
  }
  return biomarkers.length > 0 ? biomarkers : null;
}

function extractBiomarkerCount(html: string, list: string[] | null): number | null {
  const countPatterns = [
    /up\s+to\s+(\d+)\s*biomarkers?/i,
    /(\d+)\s*biomarkers?/i,
    /(\d+)\s*tests?\s+included/i,
    /(\d+)\s*data\s+points/i,
  ];
  for (const p of countPatterns) {
    const m = html.match(p);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > 0 && n <= 500) return n;
    }
  }
  return list && list.length > 0 ? list.length : null;
}

function extractTurnaround(html: string): string | null {
  const patterns: RegExp[] = [
    /results?\s+(?:in|within|typically\s+in)\s+((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /turnaround(?:\s+time)?[:\-]?\s*((?:up\s+to\s+)?\d+\s*(?:-|to|–)?\s*\d*\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /(\d+\s*(?:-|to|–)\s*\d+\s*(?:working\s+)?(?:day|hour)s?)\b/i,
    /\b(\d+\s+working\s+days?)\b/i,
    /(next\s+working\s+day)/i,
    /(same[\s-]?day)/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) {
      const num = m[1].match(/(\d+)/);
      if (num && (parseInt(num[1], 10) === 0 || parseInt(num[1], 10) > 60)) continue;
      return m[1].trim();
    }
  }
  return null;
}

function determineCategory(title: string, description: string, url: string): string {
  const text = `${title} ${description} ${url}`.toLowerCase();
  const map: Record<string, string[]> = {
    'Thyroid': ['thyroid', 'tsh', 't3', 't4'],
    'Hormones': ['hormone', 'testosterone', 'oestrogen', 'progesterone', 'dhea', 'cortisol', 'quickdraw'],
    'Vitamins & Minerals': ['vitamin', 'mineral', 'iron', 'ferritin', 'b12', 'folate', 'haemochromatosis'],
    'Heart Health': ['heart', 'cholesterol', 'cardiovascular', 'lipid'],
    'Diabetes': ['diabetes', 'hba1c', 'glucose', 'insulin'],
    'Liver Health': ['liver', 'hepatic'],
    'Kidney Health': ['kidney', 'renal'],
    "Men's Health": ['everyman', 'prostate', 'psa'],
    "Women's Health": ['everywoman', 'menopause', 'amh'],
    'Fertility': ['fertility'],
    'Sports & Fitness': ['sport', 'fitness', 'performance', 'athlete'],
    'Gut Health': ['gut', 'microbiome', 'coeliac', 'celiac'],
    'Sexual Health': ['sti', 'sexual', 'confidante'],
    'Genetic Testing': ['dna', 'genetic'],
    'Allergy & Sensitivity': ['allergy', 'sensitivity'],
    'General Health': ['essential', 'premium', 'signature', 'comprehensive', 'discovery', 'general'],
  };
  for (const [cat, kws] of Object.entries(map)) {
    if (kws.some(k => text.includes(k))) return cat;
  }
  return 'General Health';
}

function determineTestType(url: string): 'clinic' | 'home' {
  return url.includes('/product/home/') ? 'home' : 'clinic';
}

function providerTestIdFromUrl(url: string): string {
  const parts = url.split('/');
  const slug = parts[parts.length - 1] || url;
  const kind = url.includes('/product/home/') ? 'home' : 'clinic';
  return `randox-${kind}-${slug}`.toLowerCase();
}

async function fetchWithDelay(url: string, delay = 1500): Promise<string> {
  await new Promise(r => setTimeout(r, delay));
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function discoverUrlsWithFirecrawl(firecrawlApiKey: string): Promise<string[]> {
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${firecrawlApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://randoxhealth.com/en-GB', search: 'product', limit: 200 }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const links: string[] = data.links || [];
    return links.filter((u: string) => u.includes('/en-GB/product/') && (u.includes('/clinic/') || u.includes('/home/')));
  } catch { return []; }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);
  const counters = newCounters();
  const runId = await startScrapeRun(supabase, PROVIDER_ID, 'randox-scraper', {
    started_at: new Date().toISOString(),
  });

  try {
    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'running', last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 24 * 3600000).toISOString(),
    }, { onConflict: 'provider_id' });

    // Cleanup: garbage names + old broken /test/ URLs
    const { data: allTests } = await supabase
      .from('provider_tests')
      .select('id, test_name')
      .eq('provider_id', PROVIDER_ID)
      .eq('is_active', true);

    if (allTests) {
      for (const t of allTests) {
        const cleaned = cleanTitle(t.test_name);
        if (isGarbageName(t.test_name) || isGarbageName(cleaned)) {
          await supabase.from('provider_tests').update({ is_active: false }).eq('id', t.id);
        } else if (cleaned !== t.test_name) {
          const dupe = allTests.find(x => x.id !== t.id && cleanTitle(x.test_name) === cleaned && x.test_name === cleaned);
          if (dupe) await supabase.from('provider_tests').update({ is_active: false }).eq('id', t.id);
          else await supabase.from('provider_tests').update({ test_name: cleaned }).eq('id', t.id);
        }
      }
    }
    await supabase.from('provider_tests').update({ is_active: false })
      .eq('provider_id', PROVIDER_ID).eq('is_active', true).like('url', '%www.randoxhealth.com/test/%');

    // Discover
    const allUrls = new Set<string>(knownProductUrls);
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (firecrawlApiKey) {
      const fUrls = await discoverUrlsWithFirecrawl(firecrawlApiKey);
      fUrls.forEach(u => allUrls.add(u));
    }
    const productUrls = Array.from(allUrls).slice(0, 60);
    counters.tests_seen = productUrls.length;
    console.log(`[randox] scraping ${productUrls.length} URLs`);

    for (const url of productUrls) {
      try {
        const html = await fetchWithDelay(url, 1500);
        const title = extractTitle(html);
        if (!title) continue;

        const description = extractDescription(html);
        const { current: price, original: wasPrice } = extractPrice(html);
        const inStock = price !== null && price > 0;
        const imageUrl = extractImageUrl(html);
        const biomarkersList = extractBiomarkersList(html);
        const biomarkerCount = extractBiomarkerCount(html, biomarkersList);
        const category = determineCategory(title, description || '', url);
        const testType = determineTestType(url);
        const turnaroundRaw = extractTurnaround(html);
        const parsedTurn = parseTurnaround(turnaroundRaw);
        const collectionMethod = testType === 'home'
          ? 'Home finger-prick kit'
          : 'Clinic phlebotomy';

        const result = await upsertWithProvenance(supabase, {
          provider_id: PROVIDER_ID,
          provider_test_id: providerTestIdFromUrl(url),
          test_name: title,
          url,
          price,
          was_price: wasPrice,
          collection_fee: testType === 'home' ? HOME_KIT_FEE : CLINIC_VISIT_FEE,
          home_visit_fee: null,
          gp_review_fee: 0,
          total_expected_cost: price,
          biomarker_count: biomarkerCount,
          biomarkers_list: biomarkersList,
          turnaround_raw: turnaroundRaw,
          turnaround_hours: parsedTurn.hours,
          turnaround_days: parsedTurn.days,
          turnaround_unit: parsedTurn.unit,
          sample_type: testType === 'home' ? 'Finger-prick' : 'Venous blood',
          collection_method: collectionMethod,
          in_stock: inStock,
          scrape_source_url: url,
        }, { scrapeRunId: runId, outOfStock: !inStock });

        if (!result.ok) { counters.errors.push({ test: title, message: result.error ?? 'upsert failed' }); continue; }
        if (result.action === 'inserted') counters.tests_new++;
        else if (result.action === 'updated') counters.tests_updated++;

        if (result.providerTestId) {
          await supabase.from('provider_tests').update({
            description,
            category,
            image_url: imageUrl,
            original_price: wasPrice,
            home_kit_available: testType === 'home',
            clinic_visit_available: testType === 'clinic',
            phlebotomy_included: true,
            lab_ukas_accredited: true,
            url_verified: true,
            url_verified_at: new Date().toISOString(),
            scraped_at: new Date().toISOString(),
          }).eq('id', result.providerTestId);
        }
      } catch (err) {
        counters.errors.push({ test: url, message: getErrorMessage(err) });
      }
    }

    await supabase.from('scraping_jobs').update({
      status: 'completed', error_message: null,
    }).eq('provider_id', PROVIDER_ID);

    await finishScrapeRun(supabase, runId, counters, counters.errors.length > 0 ? 'partial' : 'success');
    return new Response(JSON.stringify({
      success: true, provider: PROVIDER_ID, run_id: runId,
      tests_seen: counters.tests_seen, tests_new: counters.tests_new, tests_updated: counters.tests_updated,
      errors: counters.errors.slice(0, 10),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    const msg = getErrorMessage(err);
    console.error('[randox] fatal:', msg);
    await supabase.from('scraping_jobs').update({ status: 'failed', error_message: msg }).eq('provider_id', PROVIDER_ID);
    await finishScrapeRun(supabase, runId, counters, 'error');
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
