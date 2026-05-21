import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RandoxProduct {
  test_name: string;
  price: number | null;
  original_price: number | null;
  url: string;
  category: string;
  description: string | null;
  biomarker_count: number | null;
  biomarkers_list: string[] | null;
  image_url: string | null;
  test_type: 'clinic' | 'home';
}

// Known working product URLs - verified on live Randox site March 2026
const knownProductUrls = [
  // Clinic tests
  'https://randoxhealth.com/en-GB/product/clinic/discovery-health-check',
  'https://randoxhealth.com/en-GB/product/clinic/everyman-test',
  'https://randoxhealth.com/en-GB/product/clinic/everywoman-test',
  'https://randoxhealth.com/en-GB/product/clinic/signature-platinum-test',
  'https://randoxhealth.com/en-GB/product/clinic/signature-platinum-plus-test',
  'https://randoxhealth.com/en-GB/product/clinic/signature-prestige-test',
  'https://randoxhealth.com/en-GB/product/clinic/essential-health-check',
  // Home tests
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

// Comprehensive biomarker keywords
const biomarkerPatterns = [
  'TSH', 'T3', 'T4', 'Free T3', 'Free T4', 'FT3', 'FT4', 'Thyroid Peroxidase', 'TPO', 'Thyroglobulin',
  'Testosterone', 'Free Testosterone', 'Oestradiol', 'Estradiol', 'Progesterone', 'LH', 'FSH',
  'Prolactin', 'DHEA', 'DHEA-S', 'Cortisol', 'SHBG', 'Free Androgen Index', 'AMH',
  'Vitamin D', '25-OH', 'Vitamin B12', 'Folate', 'Ferritin', 'Iron', 'TIBC', 'Transferrin',
  'Magnesium', 'Zinc', 'Selenium', 'Vitamin B6', 'Active B12', 'Vitamin A', 'Vitamin E',
  'ALT', 'AST', 'GGT', 'ALP', 'Bilirubin', 'Albumin', 'Total Protein', 'Globulin',
  'Creatinine', 'eGFR', 'Urea', 'Uric Acid', 'Cystatin C',
  'Total Cholesterol', 'HDL', 'LDL', 'Triglycerides', 'Non-HDL', 'Cholesterol Ratio', 'VLDL',
  'Haemoglobin', 'Hemoglobin', 'RBC', 'WBC', 'Platelets', 'Haematocrit', 'MCV', 'MCH', 'MCHC',
  'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils', 'Reticulocytes',
  'HbA1c', 'Glucose', 'Fasting Glucose', 'Insulin', 'HOMA-IR', 'C-Peptide',
  'CRP', 'ESR', 'hsCRP', 'Homocysteine', 'Fibrinogen',
  'PSA', 'Total PSA', 'Free PSA',
  'Omega-3', 'Omega-6', 'ApoB', 'ApoA1', 'Lp(a)', 'Lipoprotein', 'sdLDL',
];

// Garbage test names that should never be stored
const GARBAGE_NAMES = [
  'product not found',
  'randox health',
  "we'll be back soon",
  "we'll be back soon!",
  'page not found',
  '404',
  'error',
  'maintenance',
];

/**
 * Strip soft hyphens (U+00AD / \xAD) and other invisible characters from text.
 * This prevents duplicate entries caused by HTML soft-hyphen rendering.
 */
function cleanTitle(raw: string): string {
  return raw
    .replace(/\u00AD/g, '')   // soft hyphen
    .replace(/\u200B/g, '')   // zero-width space
    .replace(/\u200C/g, '')   // zero-width non-joiner
    .replace(/\u200D/g, '')   // zero-width joiner
    .replace(/\uFEFF/g, '')   // BOM / zero-width no-break space
    .replace(/\s+/g, ' ')     // collapse whitespace
    .trim();
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
    const match = html.match(pattern);
    if (match && match[1]) {
      const title = cleanTitle(
        match[1]
          .replace(/\s*[\|\-]\s*Randox.*$/i, '')
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'")
      );
      if (title && !isGarbageName(title)) return title;
    }
  }
  
  return '';
}

function extractDescription(html: string): string | null {
  const patterns = [
    /property="og:description"\s+content="([^"]+)"/i,
    /content="([^"]+)"\s+property="og:description"/i,
    /name="description"\s+content="([^"]+)"/i,
    /content="([^"]+)"\s+name="description"/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return cleanTitle(match[1]).substring(0, 500);
    }
  }
  
  return null;
}

function extractPrice(html: string): { current: number | null; original: number | null } {
  let current: number | null = null;
  let original: number | null = null;
  
  // Try JSON-LD structured data first
  const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch) {
    for (const script of jsonLdMatch) {
      try {
        const jsonContent = script.replace(/<script[^>]*>|<\/script>/gi, '');
        const data = JSON.parse(jsonContent);
        if (data.offers?.price) current = parseFloat(data.offers.price);
        if (data['@graph']) {
          for (const item of data['@graph']) {
            if (item.offers?.price) { current = parseFloat(item.offers.price); break; }
          }
        }
      } catch { }
    }
  }
  
  // Fallback: look for £ prices in page content
  if (current === null) {
    // Match "Total: £257.00" or "£257.00" patterns
    const pricePatterns = [
      /Total:\s*£(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /class="[^"]*price[^"]*"[^>]*>[\s\S]*?£(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      />\s*£(\d+(?:,\d{3})*(?:\.\d{2})?)\s*</i,
      /£(\d+(?:,\d{3})*(?:\.\d{2})?)/,
    ];
    
    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        current = parseFloat(match[1].replace(',', ''));
        if (current > 0 && current < 10000) break;
        current = null;
      }
    }
  }
  
  // Original/was price
  const originalPatterns = [
    /class="[^"]*was[^"]*"[^>]*>[\s\S]*?£(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /<del[^>]*>[\s\S]*?£(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /<s[^>]*>[\s\S]*?£(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
  ];
  
  for (const pattern of originalPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      original = parseFloat(match[1].replace(',', ''));
      break;
    }
  }
  
  return { current, original };
}

// Known Randox placeholders that aren't real product imagery (e.g. UK-flag stand-ins, logos, blanks).
function isRandoxPlaceholderImage(url: string): boolean {
  const u = url.toLowerCase();
  // UK flag stand-ins
  if (u.endsWith('/gb.png')) return true;
  if (u.includes('rdxhealthfrontdoor') && u.includes('/image/gb')) return true;
  // Other known non-product assets
  const blocked = [
    '/placeholder', '/no-image', '/noimage', '/default', '/blank',
    '/logo', '/favicon', '/spacer', '/pixel', '/transparent',
    '/og-default', '/og-image', '/share-image', '/social-default',
    '/flag', '/icon-', '/icons/',
  ];
  if (blocked.some(token => u.includes(token))) return true;
  // 1x1 / tiny sized assets (common CDN sizing hints)
  if (/[?&](w|width|h|height)=(1|2|3|4|5|10|16|24|32)\b/.test(u)) return true;
  return false;
}

// Canonicalize: decode entities, strip tracking, drop CDN resize query params,
// upgrade to https. Returns null for clearly bogus inputs.
function canonicalizeImageUrl(raw: string): string | null {
  let url = raw.trim()
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  if (!url) return null;
  if (url.startsWith('//')) url = 'https:' + url;
  else if (url.startsWith('/')) url = 'https://randoxhealth.com' + url;
  if (url.startsWith('http://')) url = 'https://' + url.slice(7);
  if (!/^https:\/\//i.test(url)) return null;

  try {
    const u = new URL(url);
    // Strip tracking + sizing params that produce duplicates
    const drop = new Set([
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'gclid', 'fbclid', 'ref', 'source',
      'w', 'h', 'width', 'height', 'quality', 'q', 'fit', 'auto', 'fm', 'dpr',
    ]);
    for (const key of Array.from(u.searchParams.keys())) {
      if (drop.has(key.toLowerCase())) u.searchParams.delete(key);
    }
    u.hash = '';
    return u.toString();
  } catch {
    return null;
  }
}

// HEAD-check a URL to confirm it actually serves a real image (correct content-type
// and meaningful payload size). Falls back to ranged GET if HEAD is unsupported.
async function validateImageUrl(url: string): Promise<boolean> {
  const MIN_BYTES = 2048; // < 2KB is almost always a spacer / placeholder
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 8000);
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 myhealthcheckup-scraper' },
    }).catch(() => null);

    if (!res || res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: ctrl.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 myhealthcheckup-scraper',
          'Range': 'bytes=0-4095',
        },
      }).catch(() => null);
    }
    clearTimeout(timeout);

    if (!res || !res.ok) return false;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.startsWith('image/')) return false;
    const len = parseInt(res.headers.get('content-length') || '0', 10);
    if (len && len < MIN_BYTES) return false;
    return true;
  } catch {
    return false;
  }
}

async function resolveValidImageUrl(raw: string | null): Promise<string | null> {
  if (!raw) return null;
  const canonical = canonicalizeImageUrl(raw);
  if (!canonical) return null;
  if (isRandoxPlaceholderImage(canonical)) return null;
  const ok = await validateImageUrl(canonical);
  return ok ? canonical : null;
}

// Randox stores real product kit imagery on a single Azure blob host. Home test kits
// live under /HTK/, clinic/services products live under /Services/. We harvest every
// candidate then pick the one whose filename best matches the test's URL slug + title.
const RANDOX_IMG_HOST = 'stesrhplatforma071.blob.core.windows.net';

function slugTokens(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')          // strip extension
    .replace(/[_\-]+/g, ' ')               // separators → space
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter(t => t && !['the','a','an','and','of','for','test','kit','home','clinic','check','blood','health','-f','-m','f','m','imgs','female','male'].includes(t));
}

function harvestRandoxBlobImages(html: string): string[] {
  const re = new RegExp(`https?://${RANDOX_IMG_HOST.replace(/\./g, '\\.')}/[^"')\\s]+\\.(?:webp|jpg|jpeg|png)`, 'gi');
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const canonical = canonicalizeImageUrl(m[0]);
    if (canonical) seen.add(canonical);
  }
  return Array.from(seen);
}

function pickBestKitImage(html: string, testUrl: string, title: string): string | null {
  const candidates = harvestRandoxBlobImages(html);
  if (!candidates.length) return null;

  const isHome = testUrl.includes('/product/home/');
  const isClinic = testUrl.includes('/product/clinic/');

  // Prefer the matching catalogue tree
  const tierFilter = (url: string) => {
    if (isHome && url.includes('/HTK/')) return 2;
    if (isClinic && url.includes('/Services/')) return 2;
    if (url.includes('/HTK/') || url.includes('/Services/')) return 1;
    return 0;
  };

  // Build search tokens from the URL slug and the test title
  const slugFromUrl = testUrl.split('/').filter(Boolean).pop() || '';
  const tokens = new Set<string>([...slugTokens(slugFromUrl), ...slugTokens(title)]);

  let best: { url: string; score: number } | null = null;
  for (const url of candidates) {
    const filename = decodeURIComponent(url.split('/').pop() || '');
    const fileTokens = slugTokens(filename);
    let overlap = 0;
    for (const t of fileTokens) if (tokens.has(t)) overlap++;

    // Exact slug match in filename is a strong signal
    const baseSlug = slugFromUrl.replace(/-test$|-home-test$|-home-test-kit$|-kit$/i, '');
    const fileBase = filename.replace(/\.(webp|jpg|jpeg|png)$/i, '').toLowerCase();
    const exactBonus = baseSlug && (fileBase === baseSlug.toLowerCase() || fileBase.replace(/[-_]/g, '') === baseSlug.replace(/[-_]/g, '').toLowerCase()) ? 5 : 0;

    const score = tierFilter(url) * 10 + overlap * 2 + exactBonus;
    if (!best || score > best.score) best = { url, score };
  }

  // Require at least minimal relevance — tier match OR token overlap
  if (!best || best.score < 2) return null;
  return best.url;
}

function extractImageUrl(html: string, testUrl?: string, title?: string): string | null {
  // 1. Prefer best-matching Randox blob kit image
  if (testUrl) {
    const kit = pickBestKitImage(html, testUrl, title || '');
    if (kit) return kit;
  }

  // 2. Fall back to og:image / generic <img> scan
  const patterns = [
    /property="og:image"\s+content="([^"]+)"/i,
    /content="([^"]+)"\s+property="og:image"/i,
    /src="(https:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i,
  ];

  for (const pattern of patterns) {
    const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
    let match: RegExpExecArray | null;
    while ((match = re.exec(html)) !== null) {
      const canonical = canonicalizeImageUrl(match[1]);
      if (!canonical) continue;
      if (isRandoxPlaceholderImage(canonical)) continue;
      return canonical;
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
  for (const pattern of sectionPatterns) {
    const match = html.match(pattern);
    if (match) { searchText = match[0]; break; }
  }
  
  for (const biomarker of biomarkerPatterns) {
    const regex = new RegExp(`\\b${biomarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(searchText)) {
      const normalized = biomarker.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      if (!biomarkers.includes(normalized)) biomarkers.push(normalized);
    }
  }
  
  return biomarkers.length > 0 ? biomarkers : null;
}

function extractBiomarkerCount(html: string, biomarkersList: string[] | null): number | null {
  // First check for explicit biomarker count in page text (e.g., "up to 150 biomarkers")
  const countPatterns = [
    /up\s+to\s+(\d+)\s*biomarkers?/i,
    /(\d+)\s*biomarkers?/i,
    /(\d+)\s*tests?\s+included/i,
    /(\d+)\s*data\s+points/i,
  ];
  for (const pattern of countPatterns) {
    const match = html.match(pattern);
    if (match) {
      const count = parseInt(match[1], 10);
      if (count > 0 && count <= 500) return count;
    }
  }
  
  if (biomarkersList && biomarkersList.length > 0) return biomarkersList.length;
  return null;
}

function determineCategory(title: string, description: string, url: string): string {
  const text = `${title} ${description} ${url}`.toLowerCase();
  
  const categoryMap: Record<string, string[]> = {
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
    'Allergy & Sensitivity': ['allergy', 'sensitivity', 'food sensitivity'],
    'General Health': ['essential', 'premium', 'signature', 'comprehensive', 'discovery', 'general'],
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => text.includes(keyword))) return category;
  }
  
  return 'General Health';
}

function determineTestType(url: string): 'clinic' | 'home' {
  return url.includes('/product/home/') ? 'home' : 'clinic';
}

async function fetchWithDelay(url: string, delay: number = 1500): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  });
  
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  return response.text();
}

/**
 * Try to discover additional product URLs using Firecrawl map API
 */
async function discoverUrlsWithFirecrawl(firecrawlApiKey: string): Promise<string[]> {
  try {
    console.log('Discovering Randox product URLs via Firecrawl map...');
    const response = await fetch('https://api.firecrawl.dev/v1/map', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://randoxhealth.com/en-GB',
        search: 'product',
        limit: 200,
        includeSubdomains: false,
      }),
    });

    if (!response.ok) {
      console.error(`Firecrawl map error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const links: string[] = data.links || [];
    
    // Filter to only product pages
    const productLinks = links.filter((url: string) => 
      url.includes('/en-GB/product/') && 
      (url.includes('/clinic/') || url.includes('/home/'))
    );
    
    console.log(`Firecrawl discovered ${productLinks.length} product URLs`);
    return productLinks;
  } catch (error) {
    console.error('Firecrawl discovery failed:', (error instanceof Error ? error.message : String(error)));
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const _serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if ((req.headers.get('Authorization') ?? '') !== `Bearer ${_serviceKey}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting Randox Health scraper v2 with cleanup...');

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'randox',
      status: 'running',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: 'provider_id' });

    // ═══════════════════════════════════════════════════════════
    // STEP 1: CLEANUP - Remove garbage and duplicate entries
    // ═══════════════════════════════════════════════════════════
    console.log('Step 1: Cleaning up garbage and duplicate entries...');

    // 1a. Deactivate entries with garbage names
    const { data: allTests } = await supabase
      .from('provider_tests')
      .select('id, test_name')
      .eq('provider_id', 'randox')
      .eq('is_active', true);

    let deactivatedCount = 0;
    if (allTests) {
      for (const test of allTests) {
        const cleaned = cleanTitle(test.test_name);
        const hasInvisibleChars = cleaned !== test.test_name;
        const isGarbage = isGarbageName(test.test_name) || isGarbageName(cleaned);

        if (isGarbage) {
          // Deactivate garbage entries
          await supabase.from('provider_tests')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', test.id);
          deactivatedCount++;
          console.log(`Deactivated garbage: "${test.test_name}"`);
        } else if (hasInvisibleChars) {
          // This is a soft-hyphen duplicate - check if clean version exists
          const cleanName = cleaned;
          const cleanVersion = allTests.find(t => 
            t.id !== test.id && cleanTitle(t.test_name) === cleanName && t.test_name === cleanName
          );
          
          if (cleanVersion) {
            // Clean version exists, deactivate this duplicate
            await supabase.from('provider_tests')
              .update({ is_active: false, updated_at: new Date().toISOString() })
              .eq('id', test.id);
            deactivatedCount++;
            console.log(`Deactivated soft-hyphen duplicate: "${test.test_name}" (clean version: "${cleanVersion.test_name}")`);
          } else {
            // No clean version exists - clean the name on this entry instead
            await supabase.from('provider_tests')
              .update({ test_name: cleanName, updated_at: new Date().toISOString() })
              .eq('id', test.id);
            console.log(`Cleaned title: "${test.test_name}" → "${cleanName}"`);
          }
        }
      }
    }
    console.log(`Cleanup complete: deactivated ${deactivatedCount} entries`);

    // 1b. Deactivate entries with old broken URLs (www.randoxhealth.com/test/ pattern)
    const { data: oldUrlTests } = await supabase
      .from('provider_tests')
      .select('id, test_name, url')
      .eq('provider_id', 'randox')
      .eq('is_active', true)
      .like('url', '%www.randoxhealth.com/test/%');

    let oldUrlDeactivated = 0;
    if (oldUrlTests) {
      for (const test of oldUrlTests) {
        await supabase.from('provider_tests')
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('id', test.id);
        oldUrlDeactivated++;
        console.log(`Deactivated old URL entry: "${test.test_name}" (${test.url})`);
      }
    }
    console.log(`Deactivated ${oldUrlDeactivated} entries with broken old URLs`);

    // ═══════════════════════════════════════════════════════════
    // STEP 2: DISCOVER product URLs
    // ═══════════════════════════════════════════════════════════
    console.log('Step 2: Discovering product URLs...');
    const allProductUrls = new Set<string>(knownProductUrls);

    // Try Firecrawl discovery if available
    if (firecrawlApiKey) {
      const firecrawlUrls = await discoverUrlsWithFirecrawl(firecrawlApiKey);
      firecrawlUrls.forEach(url => allProductUrls.add(url));
    }

    console.log(`Total unique product URLs to scrape: ${allProductUrls.size}`);

    // ═══════════════════════════════════════════════════════════
    // STEP 3: SCRAPE each product page
    // ═══════════════════════════════════════════════════════════
    console.log('Step 3: Scraping product pages...');
    const scrapedProducts: RandoxProduct[] = [];
    const productUrls = Array.from(allProductUrls).slice(0, 50);
    
    for (const url of productUrls) {
      try {
        console.log(`Scraping: ${url}`);
        const html = await fetchWithDelay(url, 1500);
        
        const title = extractTitle(html);
        if (!title) {
          console.log(`No valid title for ${url}, skipping`);
          continue;
        }
        
        const description = extractDescription(html);
        const { current: price, original: originalPrice } = extractPrice(html);
        const rawImageUrl = extractImageUrl(html);
        const imageUrl = await resolveValidImageUrl(rawImageUrl);
        if (rawImageUrl && !imageUrl) {
          console.log(`Rejected unverified image for ${url}: ${rawImageUrl}`);
        }
        const biomarkersList = extractBiomarkersList(html);
        const biomarkerCount = extractBiomarkerCount(html, biomarkersList);
        const category = determineCategory(title, description || '', url);
        const testType = determineTestType(url);
        
        // Skip if we already scraped a test with this exact name
        if (scrapedProducts.some(p => p.test_name === title)) {
          console.log(`Duplicate title "${title}", skipping`);
          continue;
        }

        scrapedProducts.push({
          test_name: title,
          price,
          original_price: originalPrice,
          url,
          category,
          description,
          biomarker_count: biomarkerCount,
          biomarkers_list: biomarkersList,
          image_url: imageUrl,
          test_type: testType,
        });
        
        console.log(`Scraped: ${title} - £${price} - ${biomarkerCount || '?'} biomarkers - ${testType}`);
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, (error instanceof Error ? error.message : String(error)));
      }
    }

    console.log(`Successfully scraped ${scrapedProducts.length} products`);

    // ═══════════════════════════════════════════════════════════
    // STEP 4: UPSERT scraped products into database
    // ═══════════════════════════════════════════════════════════
    console.log('Step 4: Upserting products...');
    let upsertedCount = 0;
    for (const product of scrapedProducts) {
      // Look for existing entry by cleaned test_name
      const { data: existing } = await supabase
        .from('provider_tests')
        .select('id')
        .eq('provider_id', 'randox')
        .eq('test_name', product.test_name)
        .eq('is_active', true)
        .maybeSingle();

      const dataToUpsert = {
        provider_id: 'randox',
        test_name: product.test_name,
        price: product.price,
        original_price: product.original_price,
        url: product.url,
        category: product.category,
        description: product.description,
        biomarker_count: product.biomarker_count,
        biomarkers_list: product.biomarkers_list,
        image_url: product.image_url,
        is_active: true,
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        url_verified: true,
        url_verified_at: new Date().toISOString(),
        home_kit_available: product.test_type === 'home',
        clinic_visit_available: product.test_type === 'clinic',
        sample_type: product.test_type === 'home' ? 'Finger-prick' : 'Venous',
      };

      let error;
      if (existing) {
        const result = await supabase
          .from('provider_tests')
          .update(dataToUpsert)
          .eq('id', existing.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('provider_tests')
          .insert(dataToUpsert);
        error = result.error;
      }
      
      if (!error) upsertedCount++;
      else console.error(`Failed to upsert ${product.test_name}:`, (error instanceof Error ? error.message : String(error)));
    }

    await supabase.from('scraping_jobs').update({
      status: 'completed',
      error_message: null
    }).eq('provider_id', 'randox');

    const summary = {
      success: true,
      provider: 'randox',
      cleanup: {
        garbageDeactivated: deactivatedCount,
        oldUrlDeactivated: oldUrlDeactivated,
      },
      scraping: {
        urlsDiscovered: allProductUrls.size,
        testsScraped: scrapedProducts.length,
        testsUpserted: upsertedCount,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('Randox scraper v2 completed:', JSON.stringify(summary));

    return new Response(
      JSON.stringify(summary),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in Randox scraper:', error);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('scraping_jobs').update({
      status: 'failed',
      error_message: (error instanceof Error ? error.message : String(error))
    }).eq('provider_id', 'randox');

    return new Response(
      JSON.stringify({ success: false, error: (error instanceof Error ? error.message : String(error)) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
