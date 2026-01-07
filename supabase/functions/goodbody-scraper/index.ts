import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoodbodyProduct {
  test_name: string;
  provider_id: string;
  category: string;
  price: number;
  original_price: number | null;
  discount_percentage: number | null;
  description: string;
  url: string;
  provider_test_id: string;
  is_active: boolean;
  biomarkers_list: string[] | null;
  biomarker_count: number | null;
  sample_type: string | null;
  clinic_visit_available: boolean;
  home_kit_available: boolean;
  url_verified: boolean;
  url_verified_at: string;
  image_url: string | null;
}

function extractProductUrls(html: string): string[] {
  const urls: string[] = [];
  // Match Shopify product links /products/slug
  const productLinkRegex = /href="(\/products\/[a-z0-9-]+)"/gi;
  let match;
  while ((match = productLinkRegex.exec(html)) !== null) {
    const url = match[1];
    if (!urls.includes(url) && !url.includes('gift-card')) {
      urls.push(url);
    }
  }
  return urls;
}

function extractTitle(html: string): string {
  // Try og:title first
  const ogMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
  if (ogMatch) return ogMatch[1].trim();
  
  // Try h1
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1].trim();
  
  // Try title tag
  const titleMatch = html.match(/<title>([^<|]+)/i);
  if (titleMatch) return titleMatch[1].trim();
  
  return 'Unknown Test';
}

function extractDescription(html: string): string {
  const descMatch = html.match(/<meta\s+(?:name|property)="(?:description|og:description)"\s+content="([^"]+)"/i);
  if (descMatch) return descMatch[1].trim().substring(0, 500);
  return '';
}

function extractPrice(html: string): number {
  // Try to find price in various formats
  // Look for prices with decimal point first (e.g., £79.00, £175.00)
  const decimalMatch = html.match(/£([\d,]+\.\d{2})/);
  if (decimalMatch) {
    const price = parseFloat(decimalMatch[1].replace(',', ''));
    if (price > 0 && price < 10000) return price;
  }
  
  // Look for "from £XX.XX" format
  const fromMatch = html.match(/from\s*£([\d,]+(?:\.\d{2})?)/i);
  if (fromMatch) {
    const price = parseFloat(fromMatch[1].replace(',', ''));
    if (price > 0 && price < 10000) return price;
  }
  
  // Look for price in Shopify JSON data (price in pence)
  const jsonPriceMatch = html.match(/"price":\s*(\d+)/);
  if (jsonPriceMatch) {
    const priceInPence = parseInt(jsonPriceMatch[1]);
    const price = priceInPence / 100; // Convert pence to pounds
    if (price > 0 && price < 10000) return price;
  }
  
  // Try to find any pound price with decimal
  const anyDecimalMatch = html.match(/£([\d,]+\.\d{2})\s*GBP/i);
  if (anyDecimalMatch) {
    const price = parseFloat(anyDecimalMatch[1].replace(',', ''));
    if (price > 0 && price < 10000) return price;
  }
  
  return 0;
}

function extractBiomarkerCount(html: string): number | null {
  const countMatch = html.match(/(\d+)\s*(?:biomarkers?|tests?|markers?)/i);
  return countMatch ? parseInt(countMatch[1]) : null;
}

function extractImageUrl(html: string): string | null {
  // Try og:image meta tag first (most reliable)
  const ogMatch = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i);
  if (ogMatch) return ogMatch[1];
  
  // Try alternate og:image format
  const ogAltMatch = html.match(/<meta\s+content="([^"]+)"\s+(?:property|name)="og:image"/i);
  if (ogAltMatch) return ogAltMatch[1];
  
  // Look for Shopify product featured image in JSON
  const jsonMatch = html.match(/"featured_image":\s*"([^"]+)"/);
  if (jsonMatch) {
    const url = jsonMatch[1].replace(/\\\//g, '/');
    return url.startsWith('//') ? 'https:' + url : url;
  }
  
  // Try Shopify CDN images (cdn.shopify.com)
  const shopifyCdnMatch = html.match(/https:\/\/cdn\.shopify\.com\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/i);
  if (shopifyCdnMatch) return shopifyCdnMatch[0];
  
  // Try srcset for highest resolution image
  const srcsetMatch = html.match(/srcset="([^"]+)"/i);
  if (srcsetMatch) {
    const srcsetParts = srcsetMatch[1].split(',').map(s => s.trim());
    const lastPart = srcsetParts[srcsetParts.length - 1];
    const urlMatch = lastPart.match(/^(https?:\/\/[^\s]+)/);
    if (urlMatch) return urlMatch[1];
  }
  
  // Try product image from img tag with product in class
  const imgMatch = html.match(/<img[^>]+class="[^"]*product[^"]*"[^>]+src="([^"]+)"/i);
  if (imgMatch) return imgMatch[1];
  
  // Try any product-media image
  const mediaMatch = html.match(/<img[^>]+src="(https:\/\/cdn\.shopify\.com\/[^"]+)"/i);
  if (mediaMatch) return mediaMatch[1];
  
  return null;
}

function extractBiomarkersList(html: string): string[] | null {
  const biomarkers: string[] = [];
  
  // Terms to EXCLUDE - clinic locations and non-biomarker content
  const excludeTerms = ['location', 'clinic', 'aesthetic', 'pharmacy', 'health centre', 'surgery', 
    'appointment', 'book now', 'click here', 'read more', 'learn more', 'find out', 'delivery',
    'shipping', 'returns', 'contact', 'about us', 'privacy', 'terms', 'cookie'];
  
  // Expanded valid biomarker keywords
  const validBiomarkerTerms = [
    // Vitamins & Minerals
    'vitamin', 'b12', 'folate', 'folic acid', 'd3', 'vitamin d', 'vitamin a', 'vitamin e', 'vitamin c',
    'iron', 'ferritin', 'tibc', 'transferrin', 'calcium', 'magnesium', 'zinc', 'copper', 'selenium',
    'potassium', 'sodium', 'phosphate', 'chloride',
    // Hormones
    'hormone', 'testosterone', 'oestradiol', 'estradiol', 'oestrogen', 'estrogen', 'progesterone',
    'fsh', 'lh', 'prolactin', 'dhea', 'dheas', 'cortisol', 'shbg', 'free androgen index',
    'amh', 'anti-mullerian', 'tsh', 't3', 't4', 'free t3', 'free t4', 'ft3', 'ft4',
    'anti-tpo', 'tpo antibodies', 'thyroglobulin', 'growth hormone', 'igf-1',
    // Lipids & Heart
    'cholesterol', 'hdl', 'ldl', 'triglyceride', 'total cholesterol', 'non-hdl',
    'apolipoprotein', 'apob', 'apoa', 'lp(a)', 'lipoprotein', 'homocysteine', 'bnp',
    // Liver
    'liver', 'alt', 'ast', 'ggt', 'gamma gt', 'bilirubin', 'alkaline phosphatase', 'alp',
    'albumin', 'total protein', 'globulin',
    // Kidney
    'kidney', 'urea', 'creatinine', 'egfr', 'uric acid', 'cystatin c',
    // Diabetes
    'glucose', 'hba1c', 'blood sugar', 'fasting glucose', 'insulin', 'c-peptide',
    // Blood Count
    'blood count', 'haemoglobin', 'hemoglobin', 'hematocrit', 'haematocrit',
    'platelet', 'white blood', 'red blood', 'wbc', 'rbc', 'mcv', 'mch', 'mchc', 'rdw',
    'neutrophil', 'lymphocyte', 'monocyte', 'eosinophil', 'basophil', 'reticulocyte',
    // Inflammation
    'crp', 'c-reactive', 'esr', 'sed rate', 'inflammation',
    // Cancer Markers
    'psa', 'cea', 'ca125', 'ca19-9', 'afp', 'alpha-fetoprotein', 'ca15-3',
    // Other
    'omega-3', 'omega-6', 'fatty acid', 'coeliac', 'celiac', 'tissue transglutaminase',
    'rheumatoid factor', 'ana', 'antinuclear', 'thyroid'
  ];
  
  // Helper to check if text is a valid biomarker
  const isValidBiomarker = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    if (excludeTerms.some(term => lowerText.includes(term))) return false;
    return validBiomarkerTerms.some(term => lowerText.includes(term));
  };
  
  // Try to parse Shopify JSON-LD product data first (most structured)
  const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch) {
    for (const block of jsonLdMatch) {
      try {
        const jsonContent = block.replace(/<script[^>]*>|<\/script>/gi, '');
        const data = JSON.parse(jsonContent);
        if (data.description) {
          const descItems = data.description.split(/[,;•\n]/).map((s: string) => s.trim());
          for (const item of descItems) {
            if (item.length > 2 && item.length < 80 && isValidBiomarker(item)) {
              biomarkers.push(item);
            }
          }
        }
      } catch (e) {
        // JSON parse failed, continue with other methods
      }
    }
  }
  
  // Extract from meta description
  const metaDesc = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (metaDesc) {
    const descItems = metaDesc[1].split(/[,;•]/).map(s => s.trim());
    for (const item of descItems) {
      if (item.length > 2 && item.length < 80 && isValidBiomarker(item)) {
        biomarkers.push(item);
      }
    }
  }
  
  // Look for bullet point lists with biomarker keywords
  const bulletMatch = html.match(/<li[^>]*>([^<]+)<\/li>/gi);
  if (bulletMatch) {
    for (const match of bulletMatch) {
      const text = match.replace(/<[^>]+>/g, '').trim();
      if (text.length > 2 && text.length < 100 && isValidBiomarker(text)) {
        biomarkers.push(text);
      }
    }
  }
  
  // Look for product feature tables
  const tableMatch = html.match(/<td[^>]*>([^<]+)<\/td>/gi);
  if (tableMatch) {
    for (const match of tableMatch) {
      const text = match.replace(/<[^>]+>/g, '').trim();
      if (text.length > 2 && text.length < 80 && isValidBiomarker(text)) {
        biomarkers.push(text);
      }
    }
  }
  
  // Look for common biomarker list patterns
  const listMatch = html.match(/(?:includes|tests|measures|checks|analyses|covering)[:\s]+([^<.]+(?:,\s*[^<.]+)+)/gi);
  if (listMatch) {
    for (const match of listMatch) {
      const items = match.replace(/^[^:]+:\s*/, '').split(/,\s*/)
        .map(s => s.trim())
        .filter(s => s.length > 2 && s.length < 60 && isValidBiomarker(s));
      biomarkers.push(...items);
    }
  }
  
  // Clean up and deduplicate
  const cleanedBiomarkers = [...new Set(
    biomarkers.map(b => b.replace(/^\s*[-•]\s*/, '').trim())
      .filter(b => b.length > 2)
  )].slice(0, 60);
  
  return cleanedBiomarkers.length > 0 ? cleanedBiomarkers : null;
}

function determineCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  // Cancer screening - check first as these are specific
  if (text.match(/cancer|tumour|tumor|psa|ca125|cea|afp|bowel screen/)) return 'Cancer Screening';
  // Specific organ/function tests
  if (text.match(/liver/)) return 'Liver Function';
  if (text.match(/heart|cardiovascular|cholesterol|lipid|cardiac/)) return 'Heart Health';
  if (text.match(/fertility|amh|ovarian|egg reserve/)) return 'Fertility';
  if (text.match(/thyroid|tsh|t3|t4|hyperthyroid|hypothyroid/)) return 'Thyroid';
  if (text.match(/vitamin|mineral|b12|d3|folate|nutritional/)) return 'Vitamins & Minerals';
  if (text.match(/iron|ferritin|anaemia|anemia/)) return 'Iron & Anaemia';
  if (text.match(/diabetes|glucose|hba1c|blood sugar/)) return 'Diabetes';
  if (text.match(/well\s*woman|female|menopause|pcos|perimenopause/)) return "Women's Health";
  if (text.match(/well\s*man|male|testosterone|prostate|erectile/)) return "Men's Health";
  if (text.match(/kidney|renal/)) return 'Kidney Function';
  if (text.match(/inflammation|crp|autoimmune/)) return 'Inflammation';
  if (text.match(/hormone|cortisol|dhea|endocrine/)) return 'Hormones';
  if (text.match(/blood count|fbc|cbc|haematology/)) return 'Blood Count';
  if (text.match(/sti|std|sexual|chlamydia|gonorrhoea/)) return 'Sexual Health';
  if (text.match(/allergy|intolerance|food sensitivity/)) return 'Allergy';
  if (text.match(/sports|fitness|performance|athlete/)) return 'Sports & Fitness';
  if (text.match(/fatigue|tiredness|energy/)) return 'Fatigue & Energy';
  if (text.match(/essential|general|comprehensive|full body/)) return 'General Health';
  
  return 'General Health';
}

async function fetchWithDelay(url: string, delay: number = 500): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9',
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  
  return response.text();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Goodbody Clinic scraper...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Goodbody uses Shopify - fetch from collections
    const categoryPages = [
      'https://goodbodyclinic.com/collections/all',
      'https://goodbodyclinic.com/collections/blood-tests',
      'https://goodbodyclinic.com/collections/health-screens',
    ];

    const allProductUrls: Set<string> = new Set();
    
    for (const pageUrl of categoryPages) {
      try {
        console.log(`Fetching: ${pageUrl}`);
        const html = await fetchWithDelay(pageUrl, 300);
        const urls = extractProductUrls(html);
        urls.forEach(u => allProductUrls.add(u));
        console.log(`Found ${urls.length} products from ${pageUrl}`);
      } catch (err) {
        console.error(`Error fetching ${pageUrl}:`, err.message);
      }
    }

    // Add known Goodbody product slugs as fallback (Shopify /products/ format)
    const knownTests = [
      '/products/advanced-vitamins-blood-test',
      '/products/advanced-well-man-blood-test',
      '/products/advanced-well-woman-blood-test',
      '/products/anaemia-blood-test',
      '/products/basic-vitamins-blood-test',
      '/products/cardiac-health-blood-test',
      '/products/diabetes-blood-test',
      '/products/essential-blood-test',
      '/products/essential-vitamins-blood-test',
      '/products/female-fertility-blood-test',
      '/products/full-blood-count-test',
      '/products/gp-consultation',
      '/products/hormone-blood-test-female',
      '/products/hormone-blood-test-male',
      '/products/iron-blood-test',
      '/products/kidney-function-blood-test',
      '/products/lipid-profile-blood-test',
      '/products/liver-function-blood-test',
      '/products/menopause-blood-test',
      '/products/pcos-blood-test',
      '/products/prostate-psa-blood-test',
      '/products/testosterone-blood-test',
      '/products/thyroid-blood-test',
      '/products/thyroid-function-blood-test',
      '/products/vitamin-d-blood-test',
      '/products/well-man-blood-test',
      '/products/well-woman-blood-test',
    ];
    knownTests.forEach(t => allProductUrls.add(t));

    console.log(`Total unique products to scrape: ${allProductUrls.size}`);

    const products: GoodbodyProduct[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const relativeUrl of allProductUrls) {
      const fullUrl = `https://goodbodyclinic.com${relativeUrl}`;
      const slug = relativeUrl.split('/').pop() || '';
      
      try {
        console.log(`Scraping: ${slug}`);
        const productHtml = await fetchWithDelay(fullUrl, 400);
        
        const title = extractTitle(productHtml);
        const description = extractDescription(productHtml);
        const price = extractPrice(productHtml);
        const biomarkerCount = extractBiomarkerCount(productHtml);
        const category = determineCategory(title, description);
        const imageUrl = extractImageUrl(productHtml);
        const biomarkersList = extractBiomarkersList(productHtml);
        
        // Skip if no valid data
        if (title === 'Unknown Test' && price === 0) {
          console.log(`Skipping ${slug} - no valid data`);
          errorCount++;
          continue;
        }
        
        products.push({
          test_name: title.replace(' – Goodbody Clinic', '').replace(' | Goodbody Clinic', '').trim(),
          provider_id: 'goodbody-clinic',
          category,
          price: price || 0,
          original_price: null,
          discount_percentage: null,
          description: description || `${title} from Goodbody Clinic with same-day appointments available across the UK.`,
          url: fullUrl,
          provider_test_id: slug,
          is_active: true,
          biomarkers_list: biomarkersList,
          biomarker_count: biomarkerCount || (biomarkersList?.length || null),
          sample_type: 'Venous blood',
          clinic_visit_available: true,
          home_kit_available: true,
          url_verified: true,
          url_verified_at: new Date().toISOString(),
          image_url: imageUrl,
        });
        
        successCount++;
        console.log(`✓ Scraped: ${title} - £${price}`);
        
      } catch (err) {
        errorCount++;
        console.error(`✗ Error scraping ${slug}:`, err.message);
      }
    }

    console.log(`\nScraping complete: ${successCount} success, ${errorCount} errors`);

    if (products.length > 0) {
      const { error } = await supabase
        .from('provider_tests')
        .upsert(products, {
          onConflict: 'provider_id,provider_test_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error("Error upserting products:", error);
        throw error;
      }

      console.log(`Successfully updated ${products.length} products in database`);

      await supabase
        .from('scraping_jobs')
        .upsert({
          provider_id: 'goodbody-clinic',
          status: 'completed',
          last_scraped: new Date().toISOString(),
          next_scrape: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          error_message: null,
        }, {
          onConflict: 'provider_id'
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped ${products.length} Goodbody Clinic products`,
        summary: {
          total: products.length,
          errors: errorCount,
        },
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in goodbody-scraper:', error);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'goodbody-clinic',
        status: 'failed',
        error_message: error.message,
        last_scraped: new Date().toISOString(),
      }, {
        onConflict: 'provider_id'
      });

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
