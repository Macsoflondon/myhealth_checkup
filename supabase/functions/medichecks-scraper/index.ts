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
  sample_type: string | null;
}

// Updated category pages - Medichecks now uses /collections/ and /products/ structure (Shopify)
const categoryPages = [
  'https://www.medichecks.com/collections/blood-tests',
  'https://www.medichecks.com/collections/thyroid-tests',
  'https://www.medichecks.com/collections/hormone-tests',
  'https://www.medichecks.com/collections/vitamin-tests',
  'https://www.medichecks.com/collections/heart-tests',
  'https://www.medichecks.com/collections/diabetes-tests',
  'https://www.medichecks.com/collections/mens-health',
  'https://www.medichecks.com/collections/womens-health',
  'https://www.medichecks.com/collections/sports-tests',
  'https://www.medichecks.com/collections/fertility-tests',
  'https://www.medichecks.com/collections/liver-tests',
  'https://www.medichecks.com/collections/kidney-tests',
  'https://www.medichecks.com/collections/all',
];

// Known product URLs - updated to /products/ structure
const knownProductUrls = [
  'https://www.medichecks.com/products/thyroid-function-blood-test',
  'https://www.medichecks.com/products/advanced-thyroid-function-blood-test',
  'https://www.medichecks.com/products/ultimate-performance-blood-test',
  'https://www.medichecks.com/products/vitamin-d-blood-test',
  'https://www.medichecks.com/products/testosterone-blood-test',
  'https://www.medichecks.com/products/diabetes-hba1c-blood-test',
  'https://www.medichecks.com/products/advanced-well-man-blood-test',
  'https://www.medichecks.com/products/advanced-well-woman-blood-test',
  'https://www.medichecks.com/products/cholesterol-blood-test',
  'https://www.medichecks.com/products/liver-function-blood-test',
  'https://www.medichecks.com/products/female-fertility-blood-test',
  'https://www.medichecks.com/products/male-fertility-blood-test',
  'https://www.medichecks.com/products/iron-status-blood-test',
  'https://www.medichecks.com/products/sports-hormone-blood-test',
  'https://www.medichecks.com/products/tiredness-fatigue-blood-test',
  'https://www.medichecks.com/products/full-blood-count',
  'https://www.medichecks.com/products/menopause-health-blood-test',
  'https://www.medichecks.com/products/pcos-blood-test',
  'https://www.medichecks.com/products/cortisol-blood-test',
  'https://www.medichecks.com/products/vitamin-b12-blood-test',
  'https://www.medichecks.com/products/kidney-function-blood-test',
  'https://www.medichecks.com/products/inflammation-check-blood-test',
  'https://www.medichecks.com/products/psa-prostate-blood-test',
  'https://www.medichecks.com/products/male-hormone-blood-test',
  'https://www.medichecks.com/products/female-hormone-blood-test',
  'https://www.medichecks.com/products/baseline-health-blood-test',
  'https://www.medichecks.com/products/essential-health-blood-test',
  'https://www.medichecks.com/products/comprehensive-health-blood-test',
  'https://www.medichecks.com/products/optimal-health-blood-test',
  'https://www.medichecks.com/products/baseline-plus-blood-test',
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
  
  // Updated patterns for Shopify /products/ structure
  const linkPatterns = [
    /href="(\/products\/[^"?#]+)"/gi,
    /href="(https:\/\/www\.medichecks\.com\/products\/[^"?#]+)"/gi,
    /"url"\s*:\s*"(\/products\/[^"]+)"/gi,
    /"url"\s*:\s*"(https:\/\/www\.medichecks\.com\/products\/[^"]+)"/gi,
  ];
  
  for (const pattern of linkPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];
      if (url.startsWith('/')) {
        url = `https://www.medichecks.com${url}`;
      }
      // Filter to only product pages
      if (url.includes('/products/') && !url.includes('/collections/')) {
        urls.push(url);
      }
    }
  }
  
  return [...new Set(urls)];
}

function extractTitle(html: string): string {
  // Try multiple patterns - prioritize structured data
  const patterns = [
    /"name"\s*:\s*"([^"]+)"/i, // JSON-LD
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /<title>([^|<]+)/i,
    /property="og:title"\s+content="([^"]+)"/i,
    /content="([^"]+)"\s+property="og:title"/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const title = match[1].trim()
        .replace(/\s*\|\s*Medichecks.*$/i, '')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .trim();
      if (title && title.length > 3) {
        return title;
      }
    }
  }
  
  return '';
}

function extractDescription(html: string): string | null {
  const patterns = [
    /"description"\s*:\s*"([^"]+)"/i, // JSON-LD
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
  
  // Shopify JSON-LD price patterns
  const pricePatterns = [
    /"price"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/gi,
    /"offers"\s*:\s*\{[^}]*"price"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/i,
    /"lowPrice"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/i,
    /data-product-price[^>]*>\s*£?(\d+(?:\.\d{1,2})?)/i,
    /class="[^"]*price[^"]*"[^>]*>[\s\S]*?£(\d+(?:\.\d{1,2})?)/i,
    />£(\d+(?:\.\d{1,2})?)</i,
    /£(\d+(?:\.\d{1,2})?)/i,
  ];
  
  for (const pattern of pricePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      if (price > 0 && price < 2000) { // Reasonable price range
        current = price;
        break;
      }
    }
  }
  
  // Look for original/compare-at price
  const originalPatterns = [
    /"compareAtPrice"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/i,
    /"compare_at_price"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/i,
    /class="[^"]*was[^"]*"[^>]*>[\s\S]*?£(\d+(?:\.\d{1,2})?)/i,
    /<del[^>]*>[\s\S]*?£(\d+(?:\.\d{1,2})?)/i,
    /class="[^"]*compare[^"]*"[^>]*>[\s\S]*?£(\d+(?:\.\d{1,2})?)/i,
  ];
  
  for (const pattern of originalPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      if (price > 0 && price < 2000) {
        original = price;
        break;
      }
    }
  }
  
  return { current, original };
}

function extractImageUrl(html: string): string | null {
  const patterns = [
    /"image"\s*:\s*"([^"]+)"/i, // JSON-LD
    /property="og:image"\s+content="([^"]+)"/i,
    /content="([^"]+)"\s+property="og:image"/i,
    /data-product-featured-image[^>]+src="([^"]+)"/i,
    /<img[^>]+class="[^"]*product[^"]*"[^>]+src="([^"]+)"/i,
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
    /what['']?s\s+included[\s\S]{0,3000}/i,
    /biomarkers?\s+tested[\s\S]{0,3000}/i,
    /<div[^>]*class="[^"]*biomarker[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    /included\s+in\s+this\s+test[\s\S]{0,3000}/i,
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
      const normalized = biomarker
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      if (!biomarkers.includes(normalized)) {
        biomarkers.push(normalized);
      }
    }
  }
  
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
    /measures?\s+(\d+)\s+biomarkers?/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  
  return null;
}

function extractSampleType(html: string): string | null {
  const patterns = [
    /sample\s+type[:\s]+([^<,\.]+)/i,
    /collection\s+method[:\s]+([^<,\.]+)/i,
    /(finger[- ]?prick|venous|blood\s+draw)/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Default for blood tests
  return 'Finger-prick or Venous';
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
    'General Health': ['general', 'comprehensive', 'full body', 'health check', 'mot', 'baseline', 'essential', 'optimal'],
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
      'Cache-Control': 'no-cache',
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

    console.log('Starting enhanced Medichecks scraper with updated URL patterns...');

    // Update scraping job status
    await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'medichecks',
        status: 'running',
        last_scraped: new Date().toISOString(),
        next_scrape: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
      }, {
        onConflict: 'provider_id'
      });

    // Collect all product URLs
    const allProductUrls = new Set<string>(knownProductUrls);
    
    // Discover products from category pages
    console.log('Discovering products from collection pages...');
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

    console.log(`Total unique product URLs to scrape: ${allProductUrls.size}`);

    // Scrape individual products - increased limit to 150 for comprehensive coverage
    const scrapedProducts: MedichecksProduct[] = [];
    const productUrls = Array.from(allProductUrls).slice(0, 150);
    
    for (const url of productUrls) {
      try {
        console.log(`Scraping: ${url}`);
        const html = await fetchWithDelay(url, 1000);
        
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
        const sampleType = extractSampleType(html);
        
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
          sample_type: sampleType,
        });
        
        console.log(`Scraped: ${title} - £${price ?? 'N/A'} - ${biomarkerCount || 0} biomarkers`);
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
      }
    }

    console.log(`Successfully scraped ${scrapedProducts.length} products`);

    // Upsert to database
    let upsertedCount = 0;
    let priceUpdateCount = 0;
    
    for (const product of scrapedProducts) {
      // Only upsert if we have a valid price
      const dataToUpsert = {
        provider_id: 'medichecks',
        test_name: product.test_name,
        url: product.url,
        category: product.category,
        description: product.description,
        biomarker_count: product.biomarker_count,
        biomarkers_list: product.biomarkers_list,
        image_url: product.image_url,
        sample_type: product.sample_type,
        is_active: true,
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        url_verified: true,
        url_verified_at: new Date().toISOString(),
      };

      // Include price if we found one
      if (product.price !== null) {
        Object.assign(dataToUpsert, {
          price: product.price,
          original_price: product.original_price,
        });
        priceUpdateCount++;
      }

      const { error } = await supabase
        .from('provider_tests')
        .upsert(dataToUpsert, {
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

    console.log(`Medichecks scraper completed. Upserted ${upsertedCount} tests, ${priceUpdateCount} with prices.`);

    return new Response(
      JSON.stringify({
        success: true,
        provider: 'medichecks',
        testsScraped: scrapedProducts.length,
        testsUpserted: upsertedCount,
        testsWithPrices: priceUpdateCount,
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
