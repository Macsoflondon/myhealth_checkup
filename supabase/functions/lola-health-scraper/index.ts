import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LolaHealthProduct {
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
  is_addon: boolean;
  image_url: string | null;
  biomarkers_list: string[] | null;
  biomarker_count: number | null;
  symptoms: string[] | null;
  conditions: string[] | null;
  who_should_test: string | null;
  url_verified: boolean;
  url_verified_at: string;
}

function extractProductUrls(html: string): string[] {
  const urls: string[] = [];
  // Match product links from collection page
  const productLinkRegex = /href="(\/products\/[^"]+)"/g;
  let match;
  while ((match = productLinkRegex.exec(html)) !== null) {
    const url = match[1];
    // Filter out duplicates and non-test products
    if (!urls.includes(url) && !url.includes('subscription')) {
      urls.push(url);
    }
  }
  return urls;
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<h1[^>]*class="[^"]*product__title[^"]*"[^>]*>([^<]+)<\/h1>/i);
  if (titleMatch) return titleMatch[1].trim();
  
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  return h1Match ? h1Match[1].trim() : 'Unknown Test';
}

function extractDescription(html: string): string {
  // Look for product description
  const descMatch = html.match(/<div[^>]*class="[^"]*product__description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (descMatch) {
    // Strip HTML tags and clean up
    return descMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500);
  }
  return '';
}

function extractPrice(html: string): number {
  // Look for sale price first
  const salePriceMatch = html.match(/class="[^"]*total_custom__price_item[^"]*"[^>]*>[\s\S]*?<span[^>]*class="[^"]*money[^"]*"[^>]*>£?([\d,.]+)/i);
  if (salePriceMatch) {
    return parseFloat(salePriceMatch[1].replace(',', ''));
  }
  
  // Fallback to regular price
  const priceMatch = html.match(/£([\d,.]+)/);
  return priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0;
}

function extractOriginalPrice(html: string): number | null {
  // Look for compare-at price (original price before sale)
  const compareMatch = html.match(/class="[^"]*custom__compare_at_price[^"]*"[^>]*>[\s\S]*?<span[^>]*class="[^"]*money[^"]*"[^>]*>£?([\d,.]+)/i);
  if (compareMatch) {
    return parseFloat(compareMatch[1].replace(',', ''));
  }
  return null;
}

function extractDiscount(html: string): number | null {
  // Look for discount badge
  const discountMatch = html.match(/(\d+)%\s*OFF/i);
  return discountMatch ? parseInt(discountMatch[1]) : null;
}

function extractIsAddon(html: string): boolean {
  // Check for add-on warning notice
  return html.includes('product__notice-card--warning') || 
         html.includes('Add-on') || 
         html.includes('add-on') ||
         html.includes('can only be added');
}

function extractImageUrl(html: string): string | null {
  // Look for product image
  const imgMatch = html.match(/<img[^>]*class="[^"]*product__media[^"]*"[^>]*src="([^"]+)"/i);
  if (imgMatch) {
    let url = imgMatch[1];
    if (url.startsWith('//')) url = 'https:' + url;
    return url;
  }
  
  // Fallback - look for any product image
  const fallbackMatch = html.match(/src="(https:\/\/[^"]*cdn\.shopify\.com[^"]*product[^"]*)"/i);
  return fallbackMatch ? fallbackMatch[1] : null;
}

function extractBiomarkers(html: string): string[] {
  const biomarkers: string[] = [];
  // Match biomarker pills/buttons
  const biomarkerRegex = /class="[^"]*biomarker[^"]*"[^>]*>([^<]+)</gi;
  let match;
  while ((match = biomarkerRegex.exec(html)) !== null) {
    const name = match[1].trim();
    if (name && !biomarkers.includes(name) && name.length < 100) {
      biomarkers.push(name);
    }
  }
  return biomarkers;
}

function extractBiomarkerCount(html: string): number | null {
  const countMatch = html.match(/(\d+)\s*Biomarkers?\s*Tested/i);
  return countMatch ? parseInt(countMatch[1]) : null;
}

function extractListItems(html: string, sectionId: string): string[] {
  const items: string[] = [];
  // Find the section content
  const sectionRegex = new RegExp(`id="${sectionId}"[^>]*>[\\s\\S]*?<ul[^>]*>([\\s\\S]*?)<\\/ul>`, 'i');
  const sectionMatch = html.match(sectionRegex);
  
  if (sectionMatch) {
    const listContent = sectionMatch[1];
    const liRegex = /<li[^>]*>([^<]+)<\/li>/gi;
    let match;
    while ((match = liRegex.exec(listContent)) !== null) {
      const item = match[1].trim();
      if (item && item.length < 200) {
        items.push(item);
      }
    }
  }
  return items;
}

function extractWhoShouldTest(html: string): string | null {
  // Look for tester section content
  const testerMatch = html.match(/id="tester"[^>]*>[\s\S]*?<div[^>]*class="[^"]*tabcontent[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (testerMatch) {
    return testerMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 1000);
  }
  return null;
}

function determineCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.match(/liver|albumin|alt|ast|alp|bilirubin|ggt/)) return 'Liver Function';
  if (text.match(/heart|cardiovascular|cholesterol|apolipoprotein|lipid/)) return 'Heart Health';
  if (text.match(/fertility|amh|antimullerian|ovarian/)) return 'Fertility';
  if (text.match(/thyroid|tsh|t3|t4|thyroxine/)) return 'Thyroid';
  if (text.match(/vitamin|mineral|b12|d3|folate|iron|ferritin/)) return 'Vitamins & Minerals';
  if (text.match(/diabetes|glucose|hba1c|insulin/)) return 'Diabetes';
  if (text.match(/women|female|menopause|oestrogen|progesterone/)) return "Women's Health";
  if (text.match(/men|male|testosterone|prostate|psa/)) return "Men's Health";
  if (text.match(/kidney|renal|creatinine|egfr|urea/)) return 'Kidney Function';
  if (text.match(/inflammation|crp|esr/)) return 'Inflammation';
  if (text.match(/hormone/)) return 'Hormones';
  if (text.match(/blood count|cbc|fbc|haemoglobin|wbc|rbc/)) return 'Blood Count';
  
  return 'General Health';
}

async function fetchWithDelay(url: string, delay: number = 500): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.5',
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
    console.log("Starting enhanced Lola Health scraper...");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Fetch collection page to get all product URLs
    const collectionUrl = "https://lolahealth.com/collections/blood-tests";
    console.log(`Fetching collection page: ${collectionUrl}`);
    
    const collectionHtml = await fetchWithDelay(collectionUrl, 0);
    const productUrls = extractProductUrls(collectionHtml);
    
    console.log(`Found ${productUrls.length} product URLs`);

    const products: LolaHealthProduct[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Step 2: Visit each product page and extract details
    for (const relativeUrl of productUrls) {
      const fullUrl = `https://lolahealth.com${relativeUrl}`;
      const slug = relativeUrl.split('/').pop() || '';
      
      try {
        console.log(`Scraping: ${slug}`);
        const productHtml = await fetchWithDelay(fullUrl, 500);
        
        const title = extractTitle(productHtml);
        const description = extractDescription(productHtml);
        const price = extractPrice(productHtml);
        const originalPrice = extractOriginalPrice(productHtml);
        const discount = extractDiscount(productHtml);
        const isAddon = extractIsAddon(productHtml);
        const imageUrl = extractImageUrl(productHtml);
        const biomarkers = extractBiomarkers(productHtml);
        const biomarkerCount = extractBiomarkerCount(productHtml) || biomarkers.length;
        const symptoms = extractListItems(productHtml, 'symptoms');
        const conditions = extractListItems(productHtml, 'test_when');
        const whoShouldTest = extractWhoShouldTest(productHtml);
        const category = determineCategory(title, description);
        
        products.push({
          test_name: title,
          provider_id: 'lola-health',
          category,
          price,
          original_price: originalPrice,
          discount_percentage: discount,
          description: description || `${title} blood test from Lola Health with at-home collection and doctor-reviewed results.`,
          url: fullUrl,
          provider_test_id: slug,
          is_active: true,
          is_addon: isAddon,
          image_url: imageUrl,
          biomarkers_list: biomarkers.length > 0 ? biomarkers : null,
          biomarker_count: biomarkerCount || null,
          symptoms: symptoms.length > 0 ? symptoms : null,
          conditions: conditions.length > 0 ? conditions : null,
          who_should_test: whoShouldTest,
          url_verified: true,
          url_verified_at: new Date().toISOString(),
        });
        
        successCount++;
        console.log(`✓ Scraped ${title} - £${price}${isAddon ? ' (Add-on)' : ''}${discount ? ` ${discount}% OFF` : ''}`);
        
      } catch (err) {
        errorCount++;
        console.error(`✗ Error scraping ${slug}:`, err.message);
      }
    }

    console.log(`\nScraping complete: ${successCount} success, ${errorCount} errors`);

    // Step 3: Upsert all products to database
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

      // Update scraping job status
      await supabase
        .from('scraping_jobs')
        .upsert({
          provider_id: 'lola-health',
          status: 'completed',
          last_scraped: new Date().toISOString(),
          next_scrape: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
          error_message: null,
        }, {
          onConflict: 'provider_id'
        });
    }

    // Log summary
    const addonCount = products.filter(p => p.is_addon).length;
    const saleCount = products.filter(p => p.discount_percentage).length;
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped ${products.length} Lola Health products`,
        summary: {
          total: products.length,
          addons: addonCount,
          onSale: saleCount,
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
    console.error('Error in lola-health-scraper:', error);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'lola-health',
        status: 'failed',
        error_message: error.message,
        last_scraped: new Date().toISOString(),
      }, {
        onConflict: 'provider_id'
      });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
