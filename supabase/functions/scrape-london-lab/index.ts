import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LondonLabProduct {
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

// London Medical Laboratory category pages
const categoryPages = [
  'https://www.londonmedicallaboratory.com/product-category/all',
  'https://www.londonmedicallaboratory.com/product-category/general-health',
  'https://www.londonmedicallaboratory.com/product-category/mens-health',
  'https://www.londonmedicallaboratory.com/product-category/womens-health',
  'https://www.londonmedicallaboratory.com/product-category/hormones',
  'https://www.londonmedicallaboratory.com/product-category/fertility',
  'https://www.londonmedicallaboratory.com/product-category/sports-fitness',
  'https://www.londonmedicallaboratory.com/product-category/sexual-health',
  'https://www.londonmedicallaboratory.com/product-category/allergy-and-intolerance',
];

// Known test URLs - verified 32 products from LML website
const knownProductUrls = [
  'https://www.londonmedicallaboratory.com/product/allergy-complete-295-allergens-tested',
  'https://www.londonmedicallaboratory.com/product/cholesterol-profile',
  'https://www.londonmedicallaboratory.com/product/diabetes-check',
  'https://www.londonmedicallaboratory.com/product/erectile-dysfunction-profile',
  'https://www.londonmedicallaboratory.com/product/female-hair-loss-pfoile-adv',
  'https://www.londonmedicallaboratory.com/product/female-sexual-health',
  'https://www.londonmedicallaboratory.com/product/fertility-hormones-profile',
  'https://www.londonmedicallaboratory.com/product/general-health',
  'https://www.londonmedicallaboratory.com/product/heart-health-profile',
  'https://www.londonmedicallaboratory.com/product/iron-status-profile',
  'https://www.londonmedicallaboratory.com/product/male-hair-loss-profile',
  'https://www.londonmedicallaboratory.com/product/male-hormone-profile',
  'https://www.londonmedicallaboratory.com/product/male-advanced-screen',
  'https://www.londonmedicallaboratory.com/product/menopause-hormones-profile',
  'https://www.londonmedicallaboratory.com/product/premier-health',
  'https://www.londonmedicallaboratory.com/product/progesterone',
  'https://www.londonmedicallaboratory.com/product/prostate-profile',
  'https://www.londonmedicallaboratory.com/product/premier-plus-sports-fitness-profile',
  'https://www.londonmedicallaboratory.com/product/premier-plus-sports-full-hormone-profile',
  'https://www.londonmedicallaboratory.com/product/testosterone-check',
  'https://www.londonmedicallaboratory.com/product/testosterone-plus',
  'https://www.londonmedicallaboratory.com/product/full-thyroid-profile',
  'https://www.londonmedicallaboratory.com/product/thyroid-function',
  'https://www.londonmedicallaboratory.com/product/tiredness-fatigue-profile',
  'https://www.londonmedicallaboratory.com/product/ultimate-athlete-performance',
  'https://www.londonmedicallaboratory.com/product/ultimate-athlete-performance-with-psa',
  'https://www.londonmedicallaboratory.com/product/vitamin-b12',
  'https://www.londonmedicallaboratory.com/product/vitamin-d',
  'https://www.londonmedicallaboratory.com/product/vitamin-profiled-b12-folate',
  'https://www.londonmedicallaboratory.com/product/weight-loss-monitoring',
  'https://www.londonmedicallaboratory.com/product/well-man-premier-plus-profile',
  'https://www.londonmedicallaboratory.com/product/well-person-premier-plus-profile',
  'https://www.londonmedicallaboratory.com/product/well-woman-premier-plus-profile',
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
  'Total Cholesterol', 'HDL', 'LDL', 'Triglycerides', 'Non-HDL', 'Cholesterol Ratio',
  'Haemoglobin', 'Hemoglobin', 'RBC', 'WBC', 'Platelets', 'Haematocrit', 'MCV', 'MCH', 'MCHC',
  'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils',
  'HbA1c', 'Glucose', 'Fasting Glucose', 'Insulin', 'HOMA-IR',
  'CRP', 'ESR', 'hsCRP', 'Homocysteine',
  'PSA', 'Total PSA', 'Free PSA',
  'Omega-3', 'Omega-6', 'ApoB', 'Lp(a)',
];

function extractProductUrls(html: string): string[] {
  const urls: string[] = [];
  
  const linkPatterns = [
    /href="(https:\/\/www\.londonmedicallaboratory\.com\/product\/[^"#?]+)"/gi,
    /href="(\/product\/[^"#?]+)"/gi,
  ];
  
  for (const pattern of linkPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];
      if (url.startsWith('/')) {
        url = `https://www.londonmedicallaboratory.com${url}`;
      }
      if (url.includes('/product/') && !url.includes('/product-category/')) {
        urls.push(url);
      }
    }
  }
  
  return [...new Set(urls)];
}

function extractTitle(html: string): string {
  const patterns = [
    /<h1[^>]*class="[^"]*product[^"]*title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /property="og:title"\s+content="([^"]+)"/i,
    /<title>([^|<]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\s*[\|\-]\s*London.*$/i, '').trim();
    }
  }
  
  return '';
}

function extractDescription(html: string): string | null {
  const patterns = [
    /property="og:description"\s+content="([^"]+)"/i,
    /name="description"\s+content="([^"]+)"/i,
    /<meta[^>]+name="description"[^>]+content="([^"]+)"/i,
    /<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/<[^>]+>/g, '').trim().substring(0, 500);
    }
  }
  
  return null;
}

function extractPrice(html: string): { current: number | null; original: number | null } {
  let current: number | null = null;
  let original: number | null = null;
  
  // WooCommerce sale price
  const saleMatch = html.match(/class="[^"]*woocommerce-Price-amount[^"]*"[^>]*>[\s\S]*?<bdi>[\s\S]*?£([\d,.]+)/i);
  if (saleMatch) {
    current = parseFloat(saleMatch[1].replace(',', ''));
  }
  
  // JSON-LD
  const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch && current === null) {
    for (const script of jsonLdMatch) {
      try {
        const jsonContent = script.replace(/<script[^>]*>|<\/script>/gi, '');
        const data = JSON.parse(jsonContent);
        if (data.offers?.price) {
          current = parseFloat(data.offers.price);
        } else if (data['@graph']) {
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
  
  // Fallback
  if (current === null) {
    const priceMatch = html.match(/£([\d,.]+)/);
    if (priceMatch) current = parseFloat(priceMatch[1].replace(',', ''));
  }
  
  // Original price
  const delMatch = html.match(/<del[^>]*>[\s\S]*?£([\d,.]+)/i);
  if (delMatch) original = parseFloat(delMatch[1].replace(',', ''));
  
  return { current, original };
}

function extractImageUrl(html: string): string | null {
  const patterns = [
    /property="og:image"\s+content="([^"]+)"/i,
    /name="og:image"\s+content="([^"]+)"/i,
    /<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+)"/i,
    /<img[^>]+class="[^"]*woocommerce-product-gallery__image[^"]*"[^>]+src="([^"]+)"/i,
    /data-large_image="([^"]+)"/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let url = match[1];
      if (url.startsWith('//')) url = 'https:' + url;
      else if (url.startsWith('/')) url = 'https://www.londonmedicallaboratory.com' + url;
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
    /<div[^>]*class="[^"]*biomarker[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
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
  
  const patterns = [
    /(\d+)\s*biomarkers?/i,
    /(\d+)\s*tests?\s+included/i,
    /(\d+)\s*markers?/i,
    /(\d+)\s*parameters?/i,
  ];
  
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
    'Heart Health': ['heart', 'cholesterol', 'cardiovascular', 'lipid', 'cardiac'],
    'Diabetes': ['diabetes', 'hba1c', 'glucose', 'insulin'],
    'Liver Health': ['liver', 'hepatic'],
    'Kidney Health': ['kidney', 'renal'],
    'Mens Health': ['men', 'male', 'prostate', 'psa', 'erectile', 'impotence'],
    'Womens Health': ['women', 'female', 'menopause'],
    'Fertility': ['fertility', 'amh', 'ovarian', 'sperm'],
    'Sports & Fitness': ['sport', 'fitness', 'performance', 'athlete', 'ultimate athlete'],
    'General Health': ['general', 'comprehensive', 'advanced', 'health screen', 'premier health', 'well person'],
    'Fatigue': ['fatigue', 'tiredness', 'energy'],
    'Inflammation': ['inflammation', 'crp'],
    'Sexual Health': ['sexual', 'sti', 'std', 'sexual health'],
    'Allergy': ['allergy', 'intolerance', 'allergen'],
    'Weight Management': ['weight', 'weight-loss', 'ozempic', 'mounjaro', 'glp-1'],
    'Hair Loss': ['hair loss', 'hair'],
    'Wellness': ['well man', 'well woman', 'wellness'],
  };
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => text.includes(keyword))) return category;
  }
  
  return 'General Health';
}

async function fetchWithDelay(url: string, delay: number = 800): Promise<string> {
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

    console.log('Starting enhanced London Medical Laboratory scraper...');

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'london-medical-laboratory',
      status: 'running',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: 'provider_id' });

    const allProductUrls = new Set<string>(knownProductUrls);
    
    console.log('Discovering products from category pages...');
    for (const categoryUrl of categoryPages.slice(0, 5)) {
      try {
        const html = await fetchWithDelay(categoryUrl, 1500);
        const urls = extractProductUrls(html);
        urls.forEach(url => allProductUrls.add(url));
        console.log(`Found ${urls.length} products from ${categoryUrl}`);
      } catch (error) {
        console.error(`Failed to fetch category ${categoryUrl}:`, (error instanceof Error ? error.message : String(error)));
      }
    }

    console.log(`Total unique product URLs: ${allProductUrls.size}`);

    const scrapedProducts: LondonLabProduct[] = [];
    const productUrls = Array.from(allProductUrls).slice(0, 50);
    
    for (const url of productUrls) {
      try {
        console.log(`Scraping: ${url}`);
        const html = await fetchWithDelay(url, 1000);
        
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
        console.error(`Failed to scrape ${url}:`, (error instanceof Error ? error.message : String(error)));
      }
    }

    console.log(`Successfully scraped ${scrapedProducts.length} products`);

    let upsertedCount = 0;
    for (const product of scrapedProducts) {
      const slug = product.url.replace(/^.*\/product\//, '').replace(/\/$/, '');
      
      const { error } = await supabase.from('provider_tests').upsert({
        provider_id: 'london-medical-laboratory',
        provider_test_id: slug,
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
        home_kit_available: true,
        clinic_visit_available: true,
        sample_type: 'Finger-prick or Venous',
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        url_verified: true,
        url_verified_at: new Date().toISOString(),
      }, { onConflict: 'provider_id,provider_test_id' });
      
      if (!error) upsertedCount++;
      else console.error(`Failed to upsert ${product.test_name}:`, (error instanceof Error ? error.message : String(error)));
    }

    // Deactivate stale tests
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('provider_tests')
      .update({ is_active: false })
      .eq('provider_id', 'london-medical-laboratory')
      .lt('scraped_at', sevenDaysAgo);

    await supabase.from('scraping_jobs').update({
      status: 'completed',
      error_message: null
    }).eq('provider_id', 'london-medical-laboratory');

    console.log(`London Medical Laboratory scraper completed. Upserted ${upsertedCount} tests.`);

    return new Response(
      JSON.stringify({
        success: true,
        provider: 'london-medical-laboratory',
        testsScraped: scrapedProducts.length,
        testsUpserted: upsertedCount,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in London Medical Laboratory scraper:', error);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('scraping_jobs').update({
      status: 'failed',
      error_message: (error instanceof Error ? error.message : String(error))
    }).eq('provider_id', 'london-medical-laboratory');

    return new Response(
      JSON.stringify({ success: false, error: (error instanceof Error ? error.message : String(error)) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
