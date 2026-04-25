import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PROVIDER_ID = 'medical-diagnosis';
const BASE_URL = 'https://www.medicaldiagnosis.co.uk';

function determineCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  if (text.match(/cancer|tumour|psa|ca125|cea/)) return 'Cancer Screening';
  if (text.match(/liver/)) return 'Liver Function';
  if (text.match(/heart|cardiovascular|cholesterol|lipid|cardiac/)) return 'Heart Health';
  if (text.match(/fertility|amh|ovarian/)) return 'Fertility';
  if (text.match(/thyroid|tsh|t3|t4/)) return 'Thyroid';
  if (text.match(/vitamin|mineral|b12|d3|folate/)) return 'Vitamins & Minerals';
  if (text.match(/iron|ferritin|anaemia/)) return 'Iron & Anaemia';
  if (text.match(/diabetes|glucose|hba1c/)) return 'Diabetes';
  if (text.match(/women|female|menopause|pcos/)) return "Women's Health";
  if (text.match(/men|male|testosterone|prostate/)) return "Men's Health";
  if (text.match(/kidney|renal/)) return 'Kidney Function';
  if (text.match(/hormone|cortisol|dhea/)) return 'Hormones';
  if (text.match(/sports|fitness|performance/)) return 'Sports & Fitness';
  if (text.match(/sti|std|sexual/)) return 'Sexual Health';
  if (text.match(/allergy|intolerance/)) return 'Allergy';
  return 'General Health';
}

async function firecrawlScrape(url: string, apiKey: string): Promise<any> {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true, waitFor: 2000 }),
  });
  if (!response.ok) throw new Error(`Firecrawl error: ${response.status}`);
  return response.json();
}

async function firecrawlMap(url: string, apiKey: string): Promise<string[]> {
  const response = await fetch('https://api.firecrawl.dev/v1/map', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, search: 'blood test health screening', limit: 300, includeSubdomains: false }),
  });
  if (!response.ok) throw new Error(`Firecrawl map error: ${response.status}`);
  const data = await response.json();
  return (data.links || []).filter((l: string) =>
    (l.includes('/product') || l.includes('/test') || l.includes('/blood-test') || l.includes('/health-screen') || l.includes('/shop'))
    && !l.includes('?') && !l.includes('#') && !l.includes('/cart') && !l.includes('/account')
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) throw new Error('FIRECRAWL_API_KEY not configured');

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Starting Medical Diagnosis Firecrawl scraper...');

    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'running', last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    let productUrls: string[] = [];
    try {
      productUrls = await firecrawlMap(BASE_URL, firecrawlApiKey);
      console.log(`Map discovered ${productUrls.length} URLs`);
    } catch (e) {
      console.error('Map failed:', (e instanceof Error ? e.message : String(e)));
    }

    if (productUrls.length < 5) {
      try {
        const homeResult = await firecrawlScrape(BASE_URL, firecrawlApiKey);
        if (homeResult.success && homeResult.data?.markdown) {
          const urlMatches = homeResult.data.markdown.matchAll(/\((https?:\/\/[^)]+)\)/g);
          for (const m of urlMatches) {
            if (m[1].includes('medicaldiagnosis') && (m[1].includes('test') || m[1].includes('product') || m[1].includes('health'))) {
              productUrls.push(m[1]);
            }
          }
        }
      } catch (e) {
        console.error('Homepage scrape failed:', (e instanceof Error ? e.message : String(e)));
      }
    }

    productUrls = [...new Set(productUrls)];
    console.log(`Total URLs: ${productUrls.length}`);

    const products: any[] = [];
    for (const url of productUrls.slice(0, 80)) {
      try {
        const slug = new URL(url).pathname.split('/').filter(Boolean).pop() || '';
        console.log(`Scraping: ${slug}`);
        const result = await firecrawlScrape(url, firecrawlApiKey);
        if (!result.success || !result.data) continue;

        const markdown = result.data.markdown || '';
        const metadata = result.data.metadata || {};

        let title = metadata.title?.replace(/\s*[–|]\s*Medical\s*Diagnosis.*$/i, '').trim() || '';
        if (!title) {
          const h1 = markdown.match(/^#\s+(.+)$/m);
          title = h1 ? h1[1].trim() : '';
        }
        if (!title || title.length < 3) continue;

        const priceMatch = markdown.match(/£([\d,]+\.\d{2})/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : null;

        const bioCountMatch = markdown.match(/(\d+)\s*(?:biomarkers?|tests?|markers?)/i);
        const biomarkerCount = bioCountMatch ? parseInt(bioCountMatch[1]) : null;

        products.push({
          test_name: title,
          provider_id: PROVIDER_ID,
          provider_test_id: `meddiag-${slug}`,
          category: determineCategory(title, metadata.description || ''),
          price,
          description: metadata.description || `${title} from Medical Diagnosis.`,
          url,
          is_active: true,
          biomarker_count: biomarkerCount,
          sample_type: 'Venous blood',
          clinic_visit_available: true,
          home_kit_available: true,
          scraped_at: new Date().toISOString(),
          url_verified: true,
          url_verified_at: new Date().toISOString(),
        });
        console.log(`✓ ${title} - £${price ?? 'N/A'}`);
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.error(`✗ ${(e instanceof Error ? e.message : String(e))}`);
      }
    }

    if (products.length > 0) {
      const { error } = await supabase.from('provider_tests').upsert(products, {
        onConflict: 'provider_id,provider_test_id', ignoreDuplicates: false,
      });
      if (error) throw error;
    }

    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'completed',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 12 * 3600000).toISOString(),
      error_message: null,
    }, { onConflict: 'provider_id' });

    return new Response(JSON.stringify({
      success: true, message: `Scraped ${products.length} Medical Diagnosis tests`, testsUpdated: products.length,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Medical Diagnosis scraper error:', error);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    await supabase.from('scraping_jobs').upsert({
      provider_id: PROVIDER_ID, status: 'failed',
      error_message: (error instanceof Error ? error.message : String(error)), last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });
    return new Response(JSON.stringify({ success: false, error: (error instanceof Error ? error.message : String(error)) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
