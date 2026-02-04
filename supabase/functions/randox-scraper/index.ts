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

// Updated category pages - Randox restructured to /en-GB/ paths (verified Feb 2026)
const categoryPages = [
  'https://randoxhealth.com/en-GB/male-health',
  'https://randoxhealth.com/en-GB/female-health',
  'https://randoxhealth.com/en-GB/health-at-home',
  'https://randoxhealth.com/en-GB/clinic-tests',
];

// Known working product URLs - verified on live Randox site Feb 2026
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

function extractProductUrls(html: string): string[] {
  const urls: string[] = [];
  
  // Updated patterns for new /en-GB/product/ structure
  const linkPatterns = [
    /href="(\/en-GB\/product\/(?:clinic|home)\/[^"#?]+)"/gi,
    /href="(https:\/\/randoxhealth\.com\/en-GB\/product\/(?:clinic|home)\/[^"#?]+)"/gi,
  ];
  
  for (const pattern of linkPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];
      if (url.startsWith('/')) {
        url = `https://randoxhealth.com${url}`;
      }
      urls.push(url);
    }
  }
  
  return [...new Set(urls)];
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
      return match[1].trim()
        .replace(/\s*[\|\-]\s*Randox.*$/i, '')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .trim();
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
      return match[1].trim().substring(0, 500);
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
        if (data.offers?.price) {
          current = parseFloat(data.offers.price);
        }
        if (data['@graph']) {
          for (const item of data['@graph']) {
            if (item.offers?.price) {
              current = parseFloat(item.offers.price);
              break;
            }
          }
        }
      } catch { }
    }
  }
  
  // Fallback patterns for prices displayed on page
  if (current === null) {
    const pricePatterns = [
      /class="[^"]*price[^"]*"[^>]*>[\s\S]*?£(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      />\s*£(\d+(?:,\d{3})*(?:\.\d{2})?)\s*</i,
      /£(\d+(?:,\d{3})*(?:\.\d{2})?)/,
    ];
    
    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        current = parseFloat(match[1].replace(',', ''));
        if (current > 0 && current < 5000) break;
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

function extractImageUrl(html: string): string | null {
  const patterns = [
    /property="og:image"\s+content="([^"]+)"/i,
    /content="([^"]+)"\s+property="og:image"/i,
    /<img[^>]+class="[^"]*product[^"]*"[^>]+src="([^"]+)"/i,
    /<img[^>]+class="[^"]*hero[^"]*"[^>]+src="([^"]+)"/i,
    /src="(https:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let url = match[1];
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
  for (const pattern of sectionPatterns) {
    const match = html.match(pattern);
    if (match) {
      searchText = match[0];
      break;
    }
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
  if (biomarkersList && biomarkersList.length > 0) return biomarkersList.length;
  
  const patterns = [/(\d+)\s*biomarkers?/i, /(\d+)\s*tests?\s+included/i];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return parseInt(match[1], 10);
  }
  
  return null;
}

function determineCategory(title: string, description: string, url: string): string {
  const text = `${title} ${description} ${url}`.toLowerCase();
  
  const categoryMap: Record<string, string[]> = {
    'Thyroid': ['thyroid', 'tsh', 't3', 't4'],
    'Hormones': ['hormone', 'testosterone', 'oestrogen', 'progesterone', 'dhea', 'cortisol', 'quickdraw'],
    'Vitamins & Minerals': ['vitamin', 'mineral', 'iron', 'ferritin', 'b12', 'folate'],
    'Heart Health': ['heart', 'cholesterol', 'cardiovascular', 'lipid'],
    'Diabetes': ['diabetes', 'hba1c', 'glucose', 'insulin'],
    'Liver Health': ['liver', 'hepatic'],
    'Kidney Health': ['kidney', 'renal'],
    "Men's Health": ['men', 'male', 'everyman', 'prostate', 'psa'],
    "Women's Health": ['women', 'female', 'everywoman', 'menopause', 'amh'],
    'Fertility': ['fertility', 'amh', 'ovarian'],
    'Sports & Fitness': ['sport', 'fitness', 'performance', 'athlete'],
    'General Health': ['essential', 'premium', 'signature', 'comprehensive', 'discovery', 'general'],
    'Gut Health': ['gut', 'microbiome', 'coeliac', 'celiac'],
    'Sexual Health': ['sti', 'sexual'],
    'Genetic Testing': ['dna', 'genetic', 'haemochromatosis'],
    'Allergy & Sensitivity': ['allergy', 'sensitivity', 'food sensitivity'],
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting Randox Health scraper with updated /en-GB/product/ URL structure...');

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'randox',
      status: 'running',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: 'provider_id' });

    const allProductUrls = new Set<string>(knownProductUrls);
    
    console.log('Discovering products from category pages...');
    for (const categoryUrl of categoryPages) {
      try {
        const html = await fetchWithDelay(categoryUrl, 2000);
        const urls = extractProductUrls(html);
        urls.forEach(url => allProductUrls.add(url));
        console.log(`Found ${urls.length} products from ${categoryUrl}`);
      } catch (error) {
        console.error(`Failed to fetch category ${categoryUrl}:`, error.message);
      }
    }

    console.log(`Total unique product URLs: ${allProductUrls.size}`);

    const scrapedProducts: RandoxProduct[] = [];
    const productUrls = Array.from(allProductUrls).slice(0, 50);
    
    for (const url of productUrls) {
      try {
        console.log(`Scraping: ${url}`);
        const html = await fetchWithDelay(url, 1500);
        
        const title = extractTitle(html);
        if (!title) {
          console.log(`No title found for ${url}, skipping`);
          continue;
        }
        
        const description = extractDescription(html);
        const { current: price, original: originalPrice } = extractPrice(html);
        const imageUrl = extractImageUrl(html);
        const biomarkersList = extractBiomarkersList(html);
        const biomarkerCount = extractBiomarkerCount(html, biomarkersList);
        const category = determineCategory(title, description || '', url);
        const testType = determineTestType(url);
        
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
        
        console.log(`Scraped: ${title} - £${price} - ${testType} test`);
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
      }
    }

    console.log(`Successfully scraped ${scrapedProducts.length} products`);

    let upsertedCount = 0;
    for (const product of scrapedProducts) {
      // Use test_name lookup to match unique constraint
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
      else console.error(`Failed to upsert ${product.test_name}:`, error.message);
    }

    await supabase.from('scraping_jobs').update({
      status: 'completed',
      error_message: null
    }).eq('provider_id', 'randox');

    console.log(`Randox scraper completed. Upserted ${upsertedCount} tests.`);

    return new Response(
      JSON.stringify({
        success: true,
        provider: 'randox',
        testsScraped: scrapedProducts.length,
        testsUpserted: upsertedCount,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in Randox scraper:', error);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('scraping_jobs').update({
      status: 'failed',
      error_message: error.message
    }).eq('provider_id', 'randox');

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
