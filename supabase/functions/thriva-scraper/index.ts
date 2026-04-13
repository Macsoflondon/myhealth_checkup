import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const KNOWN_PRODUCTS = [
  { slug: 'womens-hormones-blood-test-insights', name: "Women's Hormones Blood Test" },
  { slug: 'mens-health-blood-test', name: "Men's Health Blood Test" },
  { slug: 'general-health-check', name: 'General Health Blood Test' },
  { slug: 'thyroid-blood-test', name: 'Thyroid Blood Test' },
  { slug: 'pcos-blood-test-insights', name: 'PCOS Blood Test' },
  { slug: 'fertility-insights-blood-test', name: 'Fertility Insights Blood Test' },
  { slug: 'menopause-insights-blood-test', name: 'Menopause Insights Blood Test' },
  { slug: 'amh-blood-test', name: 'AMH Blood Test' },
  { slug: 'cholesterol-blood-test', name: 'Cardiovascular Health Blood Test' },
  { slug: 'vitamins-blood-test', name: 'Vitamins Blood Test' },
  { slug: 'omega-3-6-blood-test', name: 'Omega-3 Index Blood Test' },
  { slug: 'sports-performance-blood-test', name: 'Sports Performance Blood Test' },
  { slug: 'psa-blood-test', name: 'PSA Blood Test' },
  { slug: 'lpa-cardiovascular-risk-profile', name: 'Lp(a) Cardiovascular Risk Profile' },
];

function inferCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('women') || lower.includes('pcos') || lower.includes('menopause') || lower.includes('amh') || lower.includes('fertility')) return "Women's Health";
  if (lower.includes("men's") || lower.includes('psa') || lower.includes('prostate')) return "Men's Health";
  if (lower.includes('thyroid')) return 'Thyroid';
  if (lower.includes('cardiovascular') || lower.includes('cholesterol') || lower.includes('lp(a)') || lower.includes('omega')) return 'Heart Health';
  if (lower.includes('vitamin')) return 'Vitamins & Minerals';
  if (lower.includes('sport') || lower.includes('performance')) return 'Sports & Fitness';
  if (lower.includes('general') || lower.includes('health check')) return 'General Health';
  return 'General Health';
}

async function firecrawlScrape(url: string, apiKey: string): Promise<any> {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true, waitFor: 3000 }),
  });
  if (!response.ok) throw new Error(`Firecrawl error: ${response.status}`);
  return response.json();
}

async function firecrawlMap(url: string, apiKey: string): Promise<string[]> {
  const response = await fetch('https://api.firecrawl.dev/v1/map', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, search: 'blood test', limit: 100, includeSubdomains: false }),
  });
  if (!response.ok) throw new Error(`Firecrawl map error: ${response.status}`);
  const data = await response.json();
  return (data.links || []).filter((l: string) => l.includes('/shop/blood-tests/') && !l.includes('?'));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) throw new Error('FIRECRAWL_API_KEY not configured');

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Starting Thriva Firecrawl scraper...');

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'thriva', status: 'running', last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    // Step 1: Map to discover product URLs
    let productUrls: string[] = [];
    try {
      productUrls = await firecrawlMap('https://thriva.co/shop', firecrawlApiKey);
      console.log(`Map discovered ${productUrls.length} URLs`);
    } catch (e) {
      console.error('Map failed:', e.message);
    }

    // Add known products as fallback
    for (const p of KNOWN_PRODUCTS) {
      const url = `https://thriva.co/shop/blood-tests/${p.slug}`;
      if (!productUrls.includes(url)) productUrls.push(url);
    }
    productUrls = [...new Set(productUrls)];
    console.log(`Total URLs to scrape: ${productUrls.length}`);

    // Step 2: Scrape each product
    const tests: any[] = [];
    for (const url of productUrls) {
      try {
        const slug = url.split('/').pop() || '';
        const knownProduct = KNOWN_PRODUCTS.find(p => p.slug === slug);
        console.log(`Scraping: ${slug}`);

        const result = await firecrawlScrape(url, firecrawlApiKey);
        if (!result.success || !result.data) continue;

        const markdown = result.data.markdown || '';
        const metadata = result.data.metadata || {};

        let title = metadata.title?.replace(/\s*[–|]\s*Thriva.*$/i, '').trim() || '';
        if (!title) {
          const h1 = markdown.match(/^#\s+(.+)$/m);
          title = h1 ? h1[1].trim() : '';
        }
        if (!title) title = knownProduct?.name || slug.replace(/-/g, ' ');

        const priceMatch = markdown.match(/£([\d,]+\.\d{2})/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null;

        const bioCountMatch = markdown.match(/(\d+)\s*biomarkers?/i);
        const biomarkerCount = bioCountMatch ? parseInt(bioCountMatch[1]) : null;

        tests.push({
          provider_id: 'thriva',
          provider_test_id: `thriva-${slug}`,
          test_name: title,
          description: metadata.description || '',
          price,
          category: inferCategory(title),
          url,
          is_active: true,
          biomarker_count: biomarkerCount,
          sample_type: 'Finger-prick',
          home_kit_available: true,
          clinic_visit_available: false,
          scraped_at: new Date().toISOString(),
          url_verified: true,
          url_verified_at: new Date().toISOString(),
        });
        console.log(`✓ ${title} - £${price ?? 'N/A'}`);
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.error(`✗ ${e.message}`);
      }
    }

    if (tests.length === 0) throw new Error('No tests scraped from Thriva');

    // Deduplicate
    const seen = new Set<string>();
    const unique = tests.filter(t => { if (seen.has(t.provider_test_id)) return false; seen.add(t.provider_test_id); return true; });

    const { error } = await supabase.from('provider_tests').upsert(unique, {
      onConflict: 'provider_id,provider_test_id', ignoreDuplicates: false,
    });
    if (error) throw error;

    // Deactivate old tests
    await supabase.from('provider_tests').update({ is_active: false })
      .eq('provider_id', 'thriva')
      .lt('scraped_at', new Date(Date.now() - 86400000).toISOString());

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'thriva', status: 'completed',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 12 * 3600000).toISOString(),
      error_message: null,
    }, { onConflict: 'provider_id' });

    return new Response(JSON.stringify({
      success: true, message: `Scraped ${unique.length} Thriva tests via Firecrawl`,
      testsUpdated: unique.length,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Thriva scraper error:', error);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    await supabase.from('scraping_jobs').upsert({
      provider_id: 'thriva', status: 'failed',
      error_message: error.message, last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });
    return new Response(JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
