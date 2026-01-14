import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedProduct {
  test_name: string;
  price: number | null;
  original_price: number | null;
  url: string;
  category: string;
  description: string | null;
  biomarker_count: number | null;
  sample_type: string | null;
}

// Collection pages to discover all products
const collectionUrls = [
  'https://www.medichecks.com/collections/blood-tests',
  'https://www.medichecks.com/collections/all',
];

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

async function scrapeWithFirecrawl(url: string, apiKey: string): Promise<any> {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown', 'html'],
      onlyMainContent: false,
      waitFor: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Firecrawl API error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function mapWebsiteUrls(baseUrl: string, apiKey: string): Promise<string[]> {
  const response = await fetch('https://api.firecrawl.dev/v1/map', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: baseUrl,
      search: 'blood test',
      limit: 200,
      includeSubdomains: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Firecrawl map error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  // Filter to only product URLs
  const productUrls = (data.links || []).filter((link: string) => 
    link.includes('/products/') && !link.includes('?')
  );
  
  return productUrls;
}

function extractPrice(html: string): { current: number | null; original: number | null } {
  let current: number | null = null;
  let original: number | null = null;
  
  // Shopify JSON-LD and HTML price patterns
  const pricePatterns = [
    /"price"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/gi,
    /"lowPrice"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/i,
    /£(\d+(?:\.\d{1,2})?)/gi,
  ];
  
  for (const pattern of pricePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      if (price > 0 && price < 2000) {
        current = price;
        break;
      }
    } else if (match && match[0]) {
      const priceMatch = match[0].match(/(\d+(?:\.\d{1,2})?)/);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1]);
        if (price > 0 && price < 2000) {
          current = price;
          break;
        }
      }
    }
  }
  
  // Look for original price
  const originalPatterns = [
    /"compareAtPrice"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/i,
    /class="[^"]*was[^"]*"[^>]*>[\s\S]*?£(\d+(?:\.\d{1,2})?)/i,
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

function extractBiomarkerCount(markdown: string, html: string): number | null {
  const patterns = [
    /(\d+)\s*biomarkers?/i,
    /tests?\s+(\d+)\s+biomarkers?/i,
    /includes?\s+(\d+)\s+biomarkers?/i,
    /measures?\s+(\d+)\s+biomarkers?/i,
  ];
  
  const text = `${markdown} ${html}`;
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting Medichecks Firecrawl scraper...');

    // Update scraping job status
    await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'medichecks-firecrawl',
        status: 'running',
        last_scraped: new Date().toISOString(),
        next_scrape: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      }, {
        onConflict: 'provider_id'
      });

    // Step 1: Map the website to discover all product URLs
    console.log('Mapping Medichecks website for product URLs...');
    let productUrls: string[] = [];
    
    for (const collectionUrl of collectionUrls) {
      try {
        const urls = await mapWebsiteUrls(collectionUrl, firecrawlApiKey);
        productUrls = [...productUrls, ...urls];
        console.log(`Found ${urls.length} products from ${collectionUrl}`);
      } catch (error) {
        console.error(`Failed to map ${collectionUrl}:`, error.message);
      }
    }
    
    // Deduplicate
    productUrls = [...new Set(productUrls)];
    console.log(`Total unique product URLs: ${productUrls.length}`);

    // Step 2: Scrape individual product pages
    const scrapedProducts: ScrapedProduct[] = [];
    const urlsToScrape = productUrls.slice(0, 100); // Limit to 100 products
    
    for (const url of urlsToScrape) {
      try {
        console.log(`Scraping: ${url}`);
        
        const result = await scrapeWithFirecrawl(url, firecrawlApiKey);
        
        if (!result.success || !result.data) {
          console.log(`No data for ${url}, skipping`);
          continue;
        }
        
        const { markdown, html, metadata } = result.data;
        
        // Extract title from metadata or markdown
        let title = metadata?.title || '';
        if (!title && markdown) {
          const titleMatch = markdown.match(/^#\s+(.+)$/m);
          if (titleMatch) {
            title = titleMatch[1];
          }
        }
        title = title.replace(/\s*\|\s*Medichecks.*$/i, '').trim();
        
        if (!title) {
          console.log(`No title found for ${url}, skipping`);
          continue;
        }
        
        // Extract data
        const description = metadata?.description || null;
        const { current: price, original: originalPrice } = extractPrice(html || '');
        const biomarkerCount = extractBiomarkerCount(markdown || '', html || '');
        const category = determineCategory(title, description || '', url);
        
        scrapedProducts.push({
          test_name: title,
          price,
          original_price: originalPrice,
          url,
          category,
          description,
          biomarker_count: biomarkerCount,
          sample_type: 'Finger-prick or Venous',
        });
        
        console.log(`Scraped: ${title} - £${price ?? 'N/A'} - ${biomarkerCount || 0} biomarkers`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
      }
    }

    console.log(`Successfully scraped ${scrapedProducts.length} products`);

    // Step 3: Upsert to database
    let upsertedCount = 0;
    let priceUpdateCount = 0;
    
    for (const product of scrapedProducts) {
      const dataToUpsert: any = {
        provider_id: 'medichecks',
        test_name: product.test_name,
        url: product.url,
        category: product.category,
        description: product.description,
        biomarker_count: product.biomarker_count,
        sample_type: product.sample_type,
        is_active: true,
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        url_verified: true,
        url_verified_at: new Date().toISOString(),
      };

      if (product.price !== null) {
        dataToUpsert.price = product.price;
        dataToUpsert.original_price = product.original_price;
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
      .eq('provider_id', 'medichecks-firecrawl');

    console.log(`Firecrawl scraper completed. Upserted ${upsertedCount} tests, ${priceUpdateCount} with prices.`);

    return new Response(
      JSON.stringify({
        success: true,
        provider: 'medichecks',
        method: 'firecrawl',
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
    console.error('Error in Firecrawl scraper:', error);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from('scraping_jobs')
      .update({
        status: 'failed',
        error_message: error.message
      })
      .eq('provider_id', 'medichecks-firecrawl');

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
