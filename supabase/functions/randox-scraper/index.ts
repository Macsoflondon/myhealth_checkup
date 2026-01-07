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
}

// Randox Health category pages
const categoryPages = [
  'https://www.randoxhealth.com/tests',
  'https://www.randoxhealth.com/tests/general-health',
  'https://www.randoxhealth.com/tests/heart-health',
  'https://www.randoxhealth.com/tests/diabetes',
  'https://www.randoxhealth.com/tests/thyroid',
  'https://www.randoxhealth.com/tests/vitamins-minerals',
  'https://www.randoxhealth.com/tests/liver',
  'https://www.randoxhealth.com/tests/kidney',
  'https://www.randoxhealth.com/tests/mens-health',
  'https://www.randoxhealth.com/tests/womens-health',
  'https://www.randoxhealth.com/tests/sports-fitness',
];

// Known test URLs as fallback
const knownProductUrls = [
  'https://www.randoxhealth.com/tests/essential-health-check',
  'https://www.randoxhealth.com/tests/premium-health',
  'https://www.randoxhealth.com/tests/signature',
  'https://www.randoxhealth.com/tests/everyman',
  'https://www.randoxhealth.com/tests/everywoman',
  'https://www.randoxhealth.com/tests/heart-health',
  'https://www.randoxhealth.com/tests/advanced-lipid',
  'https://www.randoxhealth.com/tests/diabetes-screen',
  'https://www.randoxhealth.com/tests/hba1c',
  'https://www.randoxhealth.com/tests/thyroid',
  'https://www.randoxhealth.com/tests/thyroid-advanced',
  'https://www.randoxhealth.com/tests/vitamin-d',
  'https://www.randoxhealth.com/tests/vitamin-b12-folate',
  'https://www.randoxhealth.com/tests/iron-status',
  'https://www.randoxhealth.com/tests/liver-function',
  'https://www.randoxhealth.com/tests/kidney-function',
  'https://www.randoxhealth.com/tests/testosterone',
  'https://www.randoxhealth.com/tests/male-hormone',
  'https://www.randoxhealth.com/tests/female-hormone',
  'https://www.randoxhealth.com/tests/fertility',
  'https://www.randoxhealth.com/tests/menopause',
  'https://www.randoxhealth.com/tests/sports-performance',
  'https://www.randoxhealth.com/tests/inflammation',
  'https://www.randoxhealth.com/tests/fatigue',
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
  
  const linkPatterns = [
    /href="(\/tests\/[^"#?]+)"/gi,
    /href="(https:\/\/www\.randoxhealth\.com\/tests\/[^"#?]+)"/gi,
  ];
  
  for (const pattern of linkPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];
      if (url.startsWith('/')) {
        url = `https://www.randoxhealth.com${url}`;
      }
      // Exclude category pages
      if (url.split('/').length > 4) {
        urls.push(url);
      }
    }
  }
  
  return [...new Set(urls)];
}

function extractTitle(html: string): string {
  const patterns = [
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /property="og:title"\s+content="([^"]+)"/i,
    /<title>([^|<]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\s*[\|\-]\s*Randox.*$/i, '').trim();
    }
  }
  
  return '';
}

function extractDescription(html: string): string | null {
  const patterns = [
    /property="og:description"\s+content="([^"]+)"/i,
    /name="description"\s+content="([^"]+)"/i,
    /<meta[^>]+name="description"[^>]+content="([^"]+)"/i,
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
  
  // Try JSON-LD
  const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch) {
    for (const script of jsonLdMatch) {
      try {
        const jsonContent = script.replace(/<script[^>]*>|<\/script>/gi, '');
        const data = JSON.parse(jsonContent);
        if (data.offers?.price) {
          current = parseFloat(data.offers.price);
        }
      } catch { }
    }
  }
  
  // Fallback patterns
  if (current === null) {
    const pricePatterns = [
      /class="[^"]*price[^"]*"[^>]*>£(\d+(?:\.\d{2})?)/i,
      />£(\d+(?:\.\d{2})?)<\/span>/i,
      /£(\d+(?:\.\d{2})?)/,
    ];
    
    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        current = parseFloat(match[1]);
        break;
      }
    }
  }
  
  // Original price
  const originalPatterns = [
    /class="[^"]*was[^"]*"[^>]*>£(\d+(?:\.\d{2})?)/i,
    /<del[^>]*>£(\d+(?:\.\d{2})?)/i,
  ];
  
  for (const pattern of originalPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      original = parseFloat(match[1]);
      break;
    }
  }
  
  return { current, original };
}

function extractImageUrl(html: string): string | null {
  const patterns = [
    /property="og:image"\s+content="([^"]+)"/i,
    /name="og:image"\s+content="([^"]+)"/i,
    /<img[^>]+class="[^"]*product[^"]*"[^>]+src="([^"]+)"/i,
    /<img[^>]+class="[^"]*hero[^"]*"[^>]+src="([^"]+)"/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let url = match[1];
      if (url.startsWith('//')) url = 'https:' + url;
      else if (url.startsWith('/')) url = 'https://www.randoxhealth.com' + url;
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
    'Hormones': ['hormone', 'testosterone', 'oestrogen', 'progesterone', 'dhea', 'cortisol'],
    'Vitamins & Minerals': ['vitamin', 'mineral', 'iron', 'ferritin', 'b12', 'folate'],
    'Heart Health': ['heart', 'cholesterol', 'cardiovascular', 'lipid'],
    'Diabetes': ['diabetes', 'hba1c', 'glucose', 'insulin'],
    'Liver Health': ['liver', 'hepatic'],
    'Kidney Health': ['kidney', 'renal'],
    'Mens Health': ['men', 'male', 'everyman', 'prostate'],
    'Womens Health': ['women', 'female', 'everywoman', 'menopause'],
    'Fertility': ['fertility', 'amh', 'ovarian'],
    'Sports & Fitness': ['sport', 'fitness', 'performance', 'athlete'],
    'General Health': ['essential', 'premium', 'signature', 'comprehensive'],
    'Fatigue': ['fatigue', 'tiredness', 'energy'],
    'Inflammation': ['inflammation', 'crp'],
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => text.includes(keyword))) return category;
  }
  
  return 'General Health';
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

    console.log('Starting enhanced Randox Health scraper...');

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'randox',
      status: 'running',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: 'provider_id' });

    const allProductUrls = new Set<string>(knownProductUrls);
    
    console.log('Discovering products from category pages...');
    for (const categoryUrl of categoryPages.slice(0, 5)) {
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
    const productUrls = Array.from(allProductUrls).slice(0, 25);
    
    for (const url of productUrls) {
      try {
        console.log(`Scraping: ${url}`);
        const html = await fetchWithDelay(url, 1500);
        
        const title = extractTitle(html);
        if (!title) continue;
        
        const description = extractDescription(html);
        const { current: price, original: originalPrice } = extractPrice(html);
        const imageUrl = extractImageUrl(html);
        const biomarkersList = extractBiomarkersList(html);
        const biomarkerCount = extractBiomarkerCount(html, biomarkersList);
        const category = determineCategory(title, description || '', url);
        
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
        });
        
        console.log(`Scraped: ${title} - £${price} - ${biomarkerCount || 0} biomarkers`);
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
      }
    }

    console.log(`Successfully scraped ${scrapedProducts.length} products`);

    let upsertedCount = 0;
    for (const product of scrapedProducts) {
      const { error } = await supabase.from('provider_tests').upsert({
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
      }, { onConflict: 'provider_id,test_name' });
      
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
