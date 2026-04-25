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

// Collection pages to discover all products (Shopify-style)
const collectionUrls = [
  'https://www.medichecks.com/collections/all',
  'https://www.medichecks.com/collections/blood-tests',
  'https://www.medichecks.com/collections/hormones',
  'https://www.medichecks.com/collections/thyroid',
  'https://www.medichecks.com/collections/vitamins',
  'https://www.medichecks.com/collections/health-checks',
  'https://www.medichecks.com/collections/mens-health',
  'https://www.medichecks.com/collections/womens-health',
  'https://www.medichecks.com/collections/sports-fitness',
  'https://www.medichecks.com/collections/fertility',
];

// Verified product URLs from Medichecks Shopify store
const knownProductUrls = [
  'https://www.medichecks.com/products/testosterone-blood-test',
  'https://www.medichecks.com/products/male-hormone-check-blood-test',
  'https://www.medichecks.com/products/ultimate-performance-blood-test',
  'https://www.medichecks.com/products/advanced-thyroid-function-blood-test',
  'https://www.medichecks.com/products/well-woman-advanced-blood-test',
  'https://www.medichecks.com/products/well-man-advanced-blood-test',
  'https://www.medichecks.com/products/trt-check-plus-testosterone-replacement-therapy-blood-test',
  'https://www.medichecks.com/products/thyroid-function-blood-test',
  'https://www.medichecks.com/products/vitamin-d-25-oh-blood-test',
  'https://www.medichecks.com/products/female-hormone-check-blood-test',
  'https://www.medichecks.com/products/health-and-lifestyle-check-blood-test',
  'https://www.medichecks.com/products/thyroid-function-antibodies-blood-test',
  'https://www.medichecks.com/products/sports-hormone-check-blood-test',
  'https://www.medichecks.com/products/liver-check-blood-test',
  'https://www.medichecks.com/products/optimal-health-blood-test',
  'https://www.medichecks.com/products/psa-prostate-specific-antigen-blood-test',
  'https://www.medichecks.com/products/iron-deficiency-check-blood-test',
  'https://www.medichecks.com/products/essential-blood-test',
  'https://www.medichecks.com/products/essential-blood-ultravit',
  'https://www.medichecks.com/products/diabetes-hba1c-blood-test',
  'https://www.medichecks.com/products/cholesterol-blood-test',
  'https://www.medichecks.com/products/menopause-blood-test',
  'https://www.medichecks.com/products/full-blood-count-blood-test',
  'https://www.medichecks.com/products/vitamin-b12-active-blood-test',
  'https://www.medichecks.com/products/vitamin-b12-folate-blood-test',
  'https://www.medichecks.com/products/kidney-function-blood-test',
  'https://www.medichecks.com/products/fatigue-check-blood-test',
  'https://www.medichecks.com/products/cortisol-blood-test',
  'https://www.medichecks.com/products/oestradiol-blood-test',
  'https://www.medichecks.com/products/progesterone-blood-test',
  'https://www.medichecks.com/products/dhea-sulphate-blood-test',
  'https://www.medichecks.com/products/fsh-blood-test',
  'https://www.medichecks.com/products/lh-blood-test',
  'https://www.medichecks.com/products/prolactin-blood-test',
  'https://www.medichecks.com/products/shbg-blood-test',
  'https://www.medichecks.com/products/free-testosterone-blood-test',
  'https://www.medichecks.com/products/amh-blood-test',
  'https://www.medichecks.com/products/coeliac-disease-blood-test',
  'https://www.medichecks.com/products/crp-high-sensitivity-blood-test',
  'https://www.medichecks.com/products/homocysteine-blood-test',
  'https://www.medichecks.com/products/ferritin-blood-test',
  'https://www.medichecks.com/products/folate-blood-test',
  'https://www.medichecks.com/products/magnesium-blood-test',
  'https://www.medichecks.com/products/zinc-blood-test',
  'https://www.medichecks.com/products/selenium-blood-test',
  'https://www.medichecks.com/products/uric-acid-blood-test',
  'https://www.medichecks.com/products/igf-1-blood-test',
  'https://www.medichecks.com/products/testosterone-and-shbg-blood-test',
  'https://www.medichecks.com/products/sports-performance-blood-test',
  'https://www.medichecks.com/products/perimenopause-blood-test',
  'https://www.medichecks.com/products/polycystic-ovary-syndrome-pcos-blood-test',
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

function extractPrice(html: string, markdown: string): { current: number | null; original: number | null } {
  let current: number | null = null;
  let original: number | null = null;
  
  // Combine HTML and markdown for searching
  const text = `${html} ${markdown}`;
  
  // Pattern 1: Simple £ price (most common on Medichecks)
  const simplePriceMatch = text.match(/£(\d+(?:\.\d{1,2})?)/);
  if (simplePriceMatch) {
    const price = parseFloat(simplePriceMatch[1]);
    if (price > 0 && price < 2000) {
      current = price;
    }
  }
  
  // Pattern 2: JSON-LD structured data
  if (current === null) {
    const jsonLdMatches = html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of jsonLdMatches) {
      try {
        const data = JSON.parse(match[1]);
        if (data.offers?.price) {
          current = parseFloat(data.offers.price);
          break;
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
  
  // Pattern 3: Look for price after product title context
  if (current === null) {
    const priceContextMatch = text.match(/(?:price|cost|from)[:\s]*£(\d+(?:\.\d{1,2})?)/i);
    if (priceContextMatch) {
      current = parseFloat(priceContextMatch[1]);
    }
  }
  
  // Look for original/was price
  const originalPatterns = [
    /<del[^>]*>[\s\S]*?£(\d+(?:\.\d{1,2})?)/i,
    /was\s*£(\d+(?:\.\d{1,2})?)/i,
    /"compareAtPrice"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?/i,
  ];
  
  for (const pattern of originalPatterns) {
    const match = text.match(pattern);
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

    // Step 1: Start with known verified product URLs
    console.log('Starting with verified product URLs...');
    let productUrls: string[] = [...knownProductUrls];
    
    // Step 2: Map the website to discover additional product URLs
    console.log('Mapping Medichecks website for additional product URLs...');
    
    for (const collectionUrl of collectionUrls.slice(0, 5)) {
      try {
        const urls = await mapWebsiteUrls(collectionUrl, firecrawlApiKey);
        // Only add URLs with /products/ pattern
        const validUrls = urls.filter((url: string) => url.includes('/products/'));
        productUrls = [...productUrls, ...validUrls];
        console.log(`Found ${validUrls.length} products from ${collectionUrl}`);
      } catch (error) {
        console.error(`Failed to map ${collectionUrl}:`, (error instanceof Error ? error.message : String(error)));
      }
    }
    
    // Deduplicate and filter to only /products/ URLs
    productUrls = [...new Set(productUrls)].filter(url => url.includes('/products/'));
    console.log(`Total unique product URLs: ${productUrls.length}`);

    // Step 3: Scrape individual product pages
    const scrapedProducts: ScrapedProduct[] = [];
    const urlsToScrape = productUrls.slice(0, 120); // Increased limit to 120 products
    
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
        const { current: price, original: originalPrice } = extractPrice(html || '', markdown || '');
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
        console.error(`Failed to scrape ${url}:`, (error instanceof Error ? error.message : String(error)));
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
        console.error(`Failed to upsert ${product.test_name}:`, (error instanceof Error ? error.message : String(error)));
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
        error_message: (error instanceof Error ? error.message : String(error))
      })
      .eq('provider_id', 'medichecks-firecrawl');

    return new Response(
      JSON.stringify({
        success: false,
        error: (error instanceof Error ? error.message : String(error))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
