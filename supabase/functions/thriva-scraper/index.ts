import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedTest {
  test_name: string;
  description: string;
  price: number;
  url: string;
  provider_test_id: string;
}

function inferCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('women') || lower.includes('pcos') || lower.includes('menopause') || lower.includes('amh') || lower.includes('fertility')) return "Women's Health";
  if (lower.includes('men\'s') || lower.includes('psa') || lower.includes('prostate')) return "Men's Health";
  if (lower.includes('thyroid')) return "Hormones";
  if (lower.includes('cardiovascular') || lower.includes('cholesterol') || lower.includes('lp(a)') || lower.includes('omega')) return "Heart Health";
  if (lower.includes('vitamin')) return "Vitamins & Minerals";
  if (lower.includes('sport') || lower.includes('performance')) return "Sports Performance";
  if (lower.includes('general') || lower.includes('health check')) return "General Health";
  return "General Health";
}

function parseTestsFromHtml(html: string): ScrapedTest[] {
  const tests: ScrapedTest[] = [];

  // Parse product links with pattern: [**Name**\\\n\\\nDescription\\\n\\\n£Price](url)
  // Use regex to extract from markdown-like link patterns in the raw HTML
  const linkPattern = /\[(?:\*\*)?([^*\]]+?)(?:\*\*)?\s*\\+\s*\\+\s*([\s\S]*?)\\+\s*\\+\s*£([\d,.]+)\]\((https:\/\/thriva\.co\/shop\/[^\)]+)\)/g;

  let match;
  while ((match = linkPattern.exec(html)) !== null) {
    const testName = match[1].trim();
    const description = match[2].replace(/\\+/g, ' ').replace(/\s+/g, ' ').trim();
    const priceStr = match[3].replace(',', '');
    const price = parseFloat(priceStr);
    const url = match[4].trim();

    if (testName && !isNaN(price) && url) {
      const slug = url.split('/').pop() || testName.toLowerCase().replace(/\s+/g, '-');
      tests.push({
        test_name: testName,
        description,
        price,
        url,
        provider_test_id: `thriva-${slug}`,
      });
    }
  }

  return tests;
}

async function scrapeThrivaShop(): Promise<ScrapedTest[]> {
  console.log("Fetching Thriva shop page...");
  const response = await fetch("https://thriva.co/shop", {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Thriva shop: HTTP ${response.status}`);
  }

  const html = await response.text();
  console.log(`Fetched ${html.length} chars from thriva.co/shop`);

  // Extract product data from the HTML
  // Thriva uses Nuxt/Vue SSR - products are embedded as links with prices
  const tests: ScrapedTest[] = [];

  // Pattern: href="/shop/blood-tests/xxx" with nearby text containing test name and price
  // Try structured extraction from the SSR HTML
  const productPattern = /href="(\/shop\/blood-tests\/[^"]+)"[^>]*>.*?<[^>]*>([^<]+)<.*?£([\d,.]+)/gs;
  let match;

  while ((match = productPattern.exec(html)) !== null) {
    const path = match[1];
    const name = match[2].trim();
    const price = parseFloat(match[3].replace(',', ''));
    if (name && !isNaN(price)) {
      const slug = path.split('/').pop() || '';
      tests.push({
        test_name: name,
        description: '',
        price,
        url: `https://thriva.co${path}`,
        provider_test_id: `thriva-${slug}`,
      });
    }
  }

  // If structured extraction didn't work, try extracting from JSON-LD or Nuxt payload
  if (tests.length === 0) {
    console.log("Structured extraction found 0 tests, trying Nuxt payload...");

    // Look for __NUXT_DATA__ or similar payload
    const nuxtPayload = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (nuxtPayload) {
      console.log("Found Nuxt payload, parsing...");
      try {
        const payloadText = nuxtPayload[1];
        // Extract prices and names from the payload
        const priceMatches = [...payloadText.matchAll(/(\d+\.\d{2})/g)];
        const nameMatches = [...payloadText.matchAll(/([\w\s'-]+blood test|[\w\s'-]+health check)/gi)];
        console.log(`Found ${priceMatches.length} prices, ${nameMatches.length} names in payload`);
      } catch (e) {
        console.log("Nuxt payload parse failed:", e);
      }
    }

    // Fallback: extract all shop links with prices from the raw text
    const linkPricePattern = /thriva\.co\/shop\/blood-tests\/([\w-]+)/g;
    const slugs = new Set<string>();
    let linkMatch;
    while ((linkMatch = linkPricePattern.exec(html)) !== null) {
      slugs.add(linkMatch[1]);
    }
    console.log(`Found ${slugs.size} unique product slugs`);
  }

  return tests;
}

// Fallback: known Thriva products with live price lookup
const KNOWN_THRIVA_PRODUCTS = [
  { slug: "womens-hormones-blood-test-insights", name: "Women's Hormones Blood Test" },
  { slug: "mens-health-blood-test", name: "Men's Health Blood Test" },
  { slug: "general-health-check", name: "General Health Blood Test" },
  { slug: "thyroid-blood-test", name: "Thyroid Blood Test" },
  { slug: "pcos-blood-test-insights", name: "PCOS Blood Test" },
  { slug: "fertility-insights-blood-test", name: "Fertility Insights Blood Test" },
  { slug: "menopause-insights-blood-test", name: "Menopause Insights Blood Test" },
  { slug: "amh-blood-test", name: "AMH Blood Test" },
  { slug: "cholesterol-blood-test", name: "Cardiovascular Health Blood Test" },
  { slug: "vitamins-blood-test", name: "Vitamins Blood Test" },
  { slug: "omega-3-6-blood-test", name: "Omega-3 Index Blood Test" },
  { slug: "sports-performance-blood-test", name: "Sports Performance Blood Test" },
  { slug: "psa-blood-test", name: "PSA Blood Test" },
  { slug: "lpa-cardiovascular-risk-profile", name: "Lp(a) Cardiovascular Risk Profile" },
];

async function scrapeIndividualProduct(slug: string, fallbackName: string): Promise<ScrapedTest | null> {
  const url = `https://thriva.co/shop/blood-tests/${slug}`;
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });
    if (!resp.ok) return null;
    const html = await resp.text();

    // Extract price from product page
    const priceMatch = html.match(/£([\d,.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null;

    // Extract description from meta tag
    const metaDesc = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const description = metaDesc ? metaDesc[1] : '';

    if (price && price > 0) {
      return {
        test_name: fallbackName,
        description,
        price,
        url,
        provider_test_id: `thriva-${slug}`,
      };
    }
  } catch (e) {
    console.error(`Failed to scrape ${slug}:`, e);
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting Thriva live scraper");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update scraping job status
    await supabase.from('scraping_jobs').upsert({
      provider_id: 'thriva',
      status: 'in_progress',
      last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    // Step 1: Try bulk scrape from shop page
    let scrapedTests = await scrapeThrivaShop();
    console.log(`Shop page scrape found ${scrapedTests.length} tests`);

    // Step 2: If shop page didn't yield results (SPA), scrape individual product pages
    if (scrapedTests.length < 5) {
      console.log("Shop page insufficient, scraping individual product pages...");
      const individualResults = await Promise.all(
        KNOWN_THRIVA_PRODUCTS.map(p => scrapeIndividualProduct(p.slug, p.name))
      );
      const validResults = individualResults.filter((t): t is ScrapedTest => t !== null);
      if (validResults.length > scrapedTests.length) {
        scrapedTests = validResults;
      }
      console.log(`Individual page scrape found ${validResults.length} tests`);
    }

    if (scrapedTests.length === 0) {
      throw new Error("No tests scraped from Thriva - site structure may have changed");
    }

    // Deduplicate by provider_test_id
    const seen = new Set<string>();
    const uniqueTests = scrapedTests.filter(t => {
      if (seen.has(t.provider_test_id)) return false;
      seen.add(t.provider_test_id);
      return true;
    });

    const testsToUpsert = uniqueTests.map(test => ({
      provider_id: 'thriva',
      provider_test_id: test.provider_test_id,
      test_name: test.test_name,
      description: test.description,
      price: test.price,
      category: inferCategory(test.test_name),
      url: test.url,
      is_active: true,
      scraped_at: new Date().toISOString(),
      url_verified: true,
      url_verified_at: new Date().toISOString(),
    }));

    console.log(`Upserting ${testsToUpsert.length} Thriva tests`);

    const { error: upsertError } = await supabase
      .from('provider_tests')
      .upsert(testsToUpsert, {
        onConflict: 'provider_id,provider_test_id',
        ignoreDuplicates: false
      });

    if (upsertError) {
      console.error("Error upserting tests:", upsertError);
      throw upsertError;
    }

    // Mark old tests as inactive
    const { error: deactivateError } = await supabase
      .from('provider_tests')
      .update({ is_active: false })
      .eq('provider_id', 'thriva')
      .lt('scraped_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (deactivateError) {
      console.error("Error deactivating old tests:", deactivateError);
    }

    // Update scraping job status
    await supabase.from('scraping_jobs').upsert({
      provider_id: 'thriva',
      status: 'completed',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      error_message: null
    }, { onConflict: 'provider_id' });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Thriva tests scraped successfully (live)`,
        testsUpdated: testsToUpsert.length,
        tests: testsToUpsert.map(t => ({ name: t.test_name, price: t.price })),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error("Scraping error:", error);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'thriva',
      status: 'failed',
      error_message: error.message,
      last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
