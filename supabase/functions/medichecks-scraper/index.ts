import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MedichecksProduct {
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

// Category pages to discover products
const categoryPages = [
  'https://www.medichecks.com/blood-tests',
  'https://www.medichecks.com/blood-tests/thyroid',
  'https://www.medichecks.com/blood-tests/hormones',
  'https://www.medichecks.com/blood-tests/vitamins-and-minerals',
  'https://www.medichecks.com/blood-tests/heart-and-cholesterol',
  'https://www.medichecks.com/blood-tests/diabetes',
  'https://www.medichecks.com/blood-tests/mens-health',
  'https://www.medichecks.com/blood-tests/womens-health',
  'https://www.medichecks.com/blood-tests/sports-and-fitness',
  'https://www.medichecks.com/blood-tests/fertility',
  'https://www.medichecks.com/blood-tests/liver-function',
  'https://www.medichecks.com/blood-tests/kidney-function',
];

// Known product URLs as fallback
const knownProductUrls = [
  'https://www.medichecks.com/blood-tests/thyroid/thyroid-function-with-antibodies',
  'https://www.medichecks.com/blood-tests/general-health/ultimate-performance-test',
  'https://www.medichecks.com/blood-tests/vitamins-and-minerals/vitamin-d-test',
  'https://www.medichecks.com/blood-tests/hormones/testosterone-test',
  'https://www.medichecks.com/blood-tests/diabetes/diabetes-test',
  'https://www.medichecks.com/blood-tests/general-health/advanced-well-man-test',
  'https://www.medichecks.com/blood-tests/general-health/advanced-well-woman-test',
  'https://www.medichecks.com/blood-tests/heart-and-cholesterol/cholesterol-check',
  'https://www.medichecks.com/blood-tests/liver-function/liver-function-test',
  'https://www.medichecks.com/blood-tests/fertility/female-fertility-test',
  'https://www.medichecks.com/blood-tests/fertility/male-fertility-test',
  'https://www.medichecks.com/blood-tests/iron-studies/iron-status-test',
  'https://www.medichecks.com/blood-tests/sports-and-fitness/sports-hormone-test',
  'https://www.medichecks.com/blood-tests/tiredness-and-fatigue/tiredness-and-fatigue-test',
];

// Comprehensive biomarker keywords for extraction
const biomarkerPatterns = [
  // Thyroid
  'TSH', 'T3', 'T4', 'Free T3', 'Free T4', 'FT3', 'FT4', 'Thyroid Peroxidase', 'TPO', 'Thyroglobulin',
  // Hormones
  'Testosterone', 'Free Testosterone', 'Oestradiol', 'Estradiol', 'Progesterone', 'LH', 'FSH', 
  'Prolactin', 'DHEA', 'DHEA-S', 'Cortisol', 'SHBG', 'Free Androgen Index',
  // Vitamins & Minerals
  'Vitamin D', '25-OH', 'Vitamin B12', 'Folate', 'Ferritin', 'Iron', 'TIBC', 'Transferrin',
  'Magnesium', 'Zinc', 'Selenium', 'Vitamin B6',
  // Liver
  'ALT', 'AST', 'GGT', 'ALP', 'Bilirubin', 'Albumin', 'Total Protein', 'Globulin',
  // Kidney
  'Creatinine', 'eGFR', 'Urea', 'Uric Acid', 'Cystatin C',
  // Cholesterol
  'Total Cholesterol', 'HDL', 'LDL', 'Triglycerides', 'Non-HDL', 'Cholesterol Ratio',
  // Blood Count
  'Haemoglobin', 'Hemoglobin', 'RBC', 'WBC', 'Platelets', 'Haematocrit', 'MCV', 'MCH', 'MCHC',
  'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils',
  // Diabetes
  'HbA1c', 'Glucose', 'Fasting Glucose', 'Insulin', 'HOMA-IR',
  // Inflammation
  'CRP', 'ESR', 'hsCRP', 'Homocysteine',
  // PSA
  'PSA', 'Total PSA', 'Free PSA',
  // Other
  'Omega-3', 'Omega-6', 'ApoB', 'Lp(a)', 'Lipoprotein',
];

function extractProductUrls(html: string): string[] {
  const urls: string[] = [];
  
  // Match product links in category pages
  const linkPatterns = [
    /href="(\/blood-tests\/[^"]+\/[^"]+)"/gi,
    /href="(https:\/\/www\.medichecks\.com\/blood-tests\/[^"]+)"/gi,
    /<a[^>]+href="([^"]*\/blood-tests\/[^"]+)"[^>]*class="[^"]*product[^"]*"/gi,
  ];
  
  for (const pattern of linkPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];
      if (url.startsWith('/')) {
        url = `https://www.medichecks.com${url}`;
      }
      // Filter out category pages and keep only product pages
      if (url.includes('/blood-tests/') && url.split('/').length > 5) {
        urls.push(url);
      }
    }
  }
  
  return [...new Set(urls)];
}

function extractTitle(html: string): string {
  // Try multiple patterns
  const patterns = [
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /<title>([^|<]+)/i,
    /property="og:title"\s+content="([^"]+)"/i,
    /name="og:title"\s+content="([^"]+)"/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\s*\|\s*Medichecks.*$/i, '').trim();
    }
  }
  
  return '';
}

function extractDescription(html: string): string | null {
  const patterns = [
    /property="og:description"\s+content="([^"]+)"/i,
    /name="description"\s+content="([^"]+)"/i,
    /<meta[^>]+name="description"[^>]+content="([^"]+)"/i,
    /<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)<\/p>/i,
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
  
  // Look for sale price first
  const salePatterns = [
    /"price":\s*"?(\d+(?:\.\d{2})?)"?/i,
    /class="[^"]*sale[^"]*"[^>]*>£(\d+(?:\.\d{2})?)/i,
    /class="[^"]*current[^"]*price[^"]*"[^>]*>£(\d+(?:\.\d{2})?)/i,
    />£(\d+(?:\.\d{2})?)<\/span>/i,
  ];
  
  for (const pattern of salePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      current = parseFloat(match[1]);
      break;
    }
  }
  
  // Look for original/RRP price
  const originalPatterns = [
    /class="[^"]*was[^"]*"[^>]*>£(\d+(?:\.\d{2})?)/i,
    /class="[^"]*original[^"]*"[^>]*>£(\d+(?:\.\d{2})?)/i,
    /class="[^"]*rrp[^"]*"[^>]*>£(\d+(?:\.\d{2})?)/i,
    /<del[^>]*>£(\d+(?:\.\d{2})?)/i,
  ];
  
  for (const pattern of originalPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      original = parseFloat(match[1]);
      break;
    }
  }
  
  // If no current price found, look for any price
  if (current === null) {
    const priceMatch = html.match(/£(\d+(?:\.\d{2})?)/);
    if (priceMatch) {
      current = parseFloat(priceMatch[1]);
    }
  }
  
  return { current, original };
}

function extractImageUrl(html: string): string | null {
  const patterns = [
    /property="og:image"\s+content="([^"]+)"/i,
    /name="og:image"\s+content="([^"]+)"/i,
    /<img[^>]+class="[^"]*product[^"]*"[^>]+src="([^"]+)"/i,
    /<img[^>]+src="([^"]+)"[^>]+class="[^"]*product[^"]*"/i,
    /srcset="([^\s"]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let url = match[1];
      if (url.startsWith('//')) {
        url = 'https:' + url;
      } else if (url.startsWith('/')) {
        url = 'https://www.medichecks.com' + url;
      }
      return url;
    }
  }
  
  return null;
}

function extractBiomarkersList(html: string): string[] | null {
  const biomarkers: string[] = [];
  const lowerHtml = html.toLowerCase();
  
  // Try to find biomarker section
  const biomarkerSectionPatterns = [
    /<div[^>]*class="[^"]*biomarker[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    /<ul[^>]*class="[^"]*biomarker[^"]*"[^>]*>([\s\S]*?)<\/ul>/gi,
    /what['']?s\s+included[\s\S]{0,2000}/i,
    /biomarkers?\s+tested[\s\S]{0,2000}/i,
  ];
  
  let searchText = html;
  for (const pattern of biomarkerSectionPatterns) {
    const match = html.match(pattern);
    if (match) {
      searchText = match[0];
      break;
    }
  }
  
  // Match known biomarker patterns
  for (const biomarker of biomarkerPatterns) {
    const regex = new RegExp(`\\b${biomarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(searchText)) {
      // Normalize the biomarker name
      const normalized = biomarker
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      if (!biomarkers.includes(normalized)) {
        biomarkers.push(normalized);
      }
    }
  }
  
  // Try to extract count from page
  const countMatch = html.match(/(\d+)\s*biomarkers?/i);
  
  return biomarkers.length > 0 ? biomarkers : null;
}

function extractBiomarkerCount(html: string, biomarkersList: string[] | null): number | null {
  // First check if we found biomarkers in the list
  if (biomarkersList && biomarkersList.length > 0) {
    return biomarkersList.length;
  }
  
  // Try to extract from page content
  const patterns = [
    /(\d+)\s*biomarkers?/i,
    /tests?\s+(\d+)\s+biomarkers?/i,
    /includes?\s+(\d+)\s+biomarkers?/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  
  return null;
}

function determineCategory(title: string, description: string, url: string): string {
  const text = `${title} ${description} ${url}`.toLowerCase();
  
  const categoryMap: Record<string, string[]> = {
    'Thyroid': ['thyroid', 'tsh', 't3', 't4'],
    'Hormones': ['hormone', 'testosterone', 'oestrogen', 'estrogen', 'progesterone', 'dhea', 'cortisol'],
    'Vitamins & Minerals': ['vitamin', 'mineral', 'iron', 'ferritin', 'b12', 'folate', 'magnesium', 'zinc'],
    'Heart Health': ['heart', 'cholesterol', 'cardiovascular', 'cardiac', 'lipid'],
    'Diabetes': ['diabetes', 'hba1c', 'glucose', 'insulin', 'blood sugar'],
    'Liver Health': ['liver', 'hepatic', 'alt', 'ast', 'bilirubin'],
    'Kidney Health': ['kidney', 'renal', 'creatinine', 'egfr', 'urea'],
    'Mens Health': ['men', 'male', 'prostate', 'psa', 'well man'],
    'Womens Health': ['women', 'female', 'menopause', 'well woman', 'pcos'],
    'Fertility': ['fertility', 'ovarian', 'amh', 'sperm', 'conception'],
    'Sports & Fitness': ['sport', 'fitness', 'athlete', 'performance', 'muscle'],
    'General Health': ['general', 'comprehensive', 'full body', 'health check', 'mot'],
    'Fatigue': ['fatigue', 'tiredness', 'energy', 'exhaustion'],
    'Inflammation': ['inflammation', 'crp', 'esr', 'autoimmune'],
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
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
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
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

    console.log('Starting enhanced Medichecks scraper...');

    // Update scraping job status
    await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'medichecks',
        status: 'running',
        last_scraped: new Date().toISOString(),
        next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: 'provider_id'
      });

    // Collect all product URLs
    const allProductUrls = new Set<string>(knownProductUrls);
    
    // Discover products from category pages
    console.log('Discovering products from category pages...');
    for (const categoryUrl of categoryPages.slice(0, 5)) { // Limit to first 5 categories for rate limiting
      try {
        const html = await fetchWithDelay(categoryUrl, 2000);
        const urls = extractProductUrls(html);
        urls.forEach(url => allProductUrls.add(url));
        console.log(`Found ${urls.length} products from ${categoryUrl}`);
      } catch (error) {
        console.error(`Failed to fetch category ${categoryUrl}:`, error.message);
      }
    }

    console.log(`Total unique product URLs to scrape: ${allProductUrls.size}`);

    // Scrape individual products
    const scrapedProducts: MedichecksProduct[] = [];
    const productUrls = Array.from(allProductUrls).slice(0, 25); // Limit to 25 products
    
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

    // Upsert to database
    let upsertedCount = 0;
    for (const product of scrapedProducts) {
      const { error } = await supabase
        .from('provider_tests')
        .upsert({
          provider_id: 'medichecks',
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
        }, {
          onConflict: 'provider_id,test_name',
        });
      
      if (error) {
        console.error(`Failed to upsert ${product.test_name}:`, error.message);
      } else {
        upsertedCount++;
      }
    }

    // Update scraping job to completed
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        error_message: null
      })
      .eq('provider_id', 'medichecks');

    console.log(`Medichecks scraper completed. Upserted ${upsertedCount} tests.`);

    return new Response(
      JSON.stringify({
        success: true,
        provider: 'medichecks',
        testsScraped: scrapedProducts.length,
        testsUpserted: upsertedCount,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in Medichecks scraper:', error);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from('scraping_jobs')
      .update({
        status: 'failed',
        error_message: error.message
      })
      .eq('provider_id', 'medichecks');

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
