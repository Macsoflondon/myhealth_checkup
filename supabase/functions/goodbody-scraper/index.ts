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
}

function extractProductUrls(html: string): string[] {
  const urls: string[] = [];
  // Match product/test links from Goodbody Clinic
  const productLinkRegex = /href="(\/(?:tests?|products?)\/[^"#?]+)"/gi;
  let match;
  while ((match = productLinkRegex.exec(html)) !== null) {
    const url = match[1];
    if (!urls.includes(url)) {
      urls.push(url);
    }
  }
  return urls;
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  return titleMatch ? titleMatch[1].trim() : 'Unknown Test';
}

function extractDescription(html: string): string {
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (descMatch) return descMatch[1].trim().substring(0, 500);
  return '';
}

function extractPrice(html: string): number {
  const priceMatch = html.match(/£([\d,.]+)/);
  return priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0;
}

function extractBiomarkerCount(html: string): number | null {
  const countMatch = html.match(/(\d+)\s*(?:biomarkers?|tests?|markers?)/i);
  return countMatch ? parseInt(countMatch[1]) : null;
}

function determineCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.match(/liver/)) return 'Liver Function';
  if (text.match(/heart|cardiovascular|cholesterol/)) return 'Heart Health';
  if (text.match(/fertility|amh|ovarian/)) return 'Fertility';
  if (text.match(/thyroid|tsh|t3|t4/)) return 'Thyroid';
  if (text.match(/vitamin|mineral|b12|d3|folate|iron|ferritin/)) return 'Vitamins & Minerals';
  if (text.match(/diabetes|glucose|hba1c/)) return 'Diabetes';
  if (text.match(/women|female|menopause/)) return "Women's Health";
  if (text.match(/men|male|testosterone|prostate/)) return "Men's Health";
  if (text.match(/kidney|renal/)) return 'Kidney Function';
  if (text.match(/inflammation|crp/)) return 'Inflammation';
  if (text.match(/hormone/)) return 'Hormones';
  if (text.match(/blood count|fbc/)) return 'Blood Count';
  if (text.match(/sti|std|sexual/)) return 'Sexual Health';
  if (text.match(/allergy|intolerance/)) return 'Allergy';
  if (text.match(/cancer|tumour/)) return 'Cancer Screening';
  
  return 'General Health';
}

async function fetchWithDelay(url: string, delay: number = 500): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
    console.log('Starting Goodbody Clinic scraper...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Goodbody Clinic test pages
    const categoryPages = [
      'https://www.goodbodyclinic.com/blood-tests',
      'https://www.goodbodyclinic.com/health-checks',
      'https://www.goodbodyclinic.com/private-gp',
    ];

    const allProductUrls: Set<string> = new Set();
    
    for (const pageUrl of categoryPages) {
      try {
        console.log(`Fetching: ${pageUrl}`);
        const html = await fetchWithDelay(pageUrl, 300);
        const urls = extractProductUrls(html);
        urls.forEach(u => allProductUrls.add(u));
        console.log(`Found ${urls.length} tests`);
      } catch (err) {
        console.error(`Error fetching ${pageUrl}:`, err.message);
      }
    }

    // Add known Goodbody test slugs as fallback
    const knownTests = [
      '/tests/full-blood-count',
      '/tests/liver-function',
      '/tests/kidney-function',
      '/tests/thyroid-function',
      '/tests/vitamin-d',
      '/tests/iron-studies',
      '/tests/lipid-profile',
      '/tests/diabetes-check',
      '/tests/testosterone',
      '/tests/female-hormones',
    ];
    knownTests.forEach(t => allProductUrls.add(t));

    console.log(`Total unique tests found: ${allProductUrls.size}`);

    const products: GoodbodyProduct[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const relativeUrl of allProductUrls) {
      const fullUrl = `https://www.goodbodyclinic.com${relativeUrl}`;
      const slug = relativeUrl.split('/').pop() || '';
      
      try {
        console.log(`Scraping: ${slug}`);
        const productHtml = await fetchWithDelay(fullUrl, 500);
        
        const title = extractTitle(productHtml);
        const description = extractDescription(productHtml);
        const price = extractPrice(productHtml);
        const biomarkerCount = extractBiomarkerCount(productHtml);
        const category = determineCategory(title, description);
        
        if (price > 0 || title !== 'Unknown Test') {
          products.push({
            test_name: title,
            provider_id: 'goodbody-clinic',
            category,
            price: price || 0,
            original_price: null,
            discount_percentage: null,
            description: description || `${title} from Goodbody Clinic with same-day appointments available.`,
            url: fullUrl,
            provider_test_id: slug,
            is_active: true,
            biomarkers_list: null,
            biomarker_count: biomarkerCount,
            sample_type: 'Venous blood',
            clinic_visit_available: true,
            home_kit_available: false,
            url_verified: true,
            url_verified_at: new Date().toISOString(),
          });
          
          successCount++;
          console.log(`✓ Scraped ${title} - £${price}`);
        }
        
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
