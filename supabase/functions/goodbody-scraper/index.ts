import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function determineCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  if (text.match(/cancer|tumour|tumor|psa|ca125|cea|afp|bowel screen/)) return 'Cancer Screening';
  if (text.match(/liver/)) return 'Liver Function';
  if (text.match(/heart|cardiovascular|cholesterol|lipid|cardiac/)) return 'Heart Health';
  if (text.match(/fertility|amh|ovarian|egg reserve/)) return 'Fertility';
  if (text.match(/thyroid|tsh|t3|t4/)) return 'Thyroid';
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

function extractFromMarkdown(markdown: string, url: string): any {
  let title = '';
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  if (h1Match) title = h1Match[1].replace(/\s*[–|]\s*Goodbody.*$/i, '').trim();

  let price = 0;
  const priceMatch = markdown.match(/£([\d,]+\.\d{2})/);
  if (priceMatch) price = parseFloat(priceMatch[1].replace(',', ''));

  let biomarkerCount: number | null = null;
  const countMatch = markdown.match(/(\d+)\s*(?:biomarkers?|tests?|markers?)/i);
  if (countMatch) biomarkerCount = parseInt(countMatch[1]);

  const biomarkers: string[] = [];
  const biomarkerTerms = ['vitamin', 'b12', 'folate', 'iron', 'ferritin', 'calcium', 'magnesium',
    'testosterone', 'oestradiol', 'progesterone', 'fsh', 'lh', 'prolactin', 'dhea', 'cortisol',
    'tsh', 't3', 't4', 'cholesterol', 'hdl', 'ldl', 'triglyceride', 'liver', 'alt', 'ast',
    'bilirubin', 'albumin', 'creatinine', 'urea', 'egfr', 'glucose', 'hba1c', 'crp',
    'haemoglobin', 'platelet', 'psa', 'thyroid'];

  const lines = markdown.split('\n');
  for (const line of lines) {
    const clean = line.replace(/^[\s*•-]+/, '').trim();
    if (clean.length > 2 && clean.length < 80 && biomarkerTerms.some(t => clean.toLowerCase().includes(t))) {
      biomarkers.push(clean);
    }
  }

  const description = markdown.substring(0, 500).replace(/[#*\[\]]/g, '').trim();

  return { title, price, biomarkerCount, biomarkers, description };
}

async function firecrawlScrape(url: string, apiKey: string): Promise<any> {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true, waitFor: 2000 }),
  });
  if (!response.ok) throw new Error(`Firecrawl scrape error: ${response.status}`);
  return response.json();
}

async function firecrawlMap(url: string, apiKey: string): Promise<string[]> {
  const response = await fetch('https://api.firecrawl.dev/v1/map', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, search: 'blood test', limit: 200, includeSubdomains: false }),
  });
  if (!response.ok) throw new Error(`Firecrawl map error: ${response.status}`);
  const data = await response.json();
  return (data.links || []).filter((l: string) => l.includes('/products/') && !l.includes('?') && !l.includes('gift-card'));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) throw new Error('FIRECRAWL_API_KEY not configured');

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Starting GoodBody Firecrawl scraper...');

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'goodbody-clinic', status: 'running',
      last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });

    // Step 1: Discover product URLs via Firecrawl map
    console.log('Mapping goodbodyclinic.com for products...');
    let productUrls: string[] = [];
    try {
      productUrls = await firecrawlMap('https://goodbodyclinic.com/collections/all', firecrawlApiKey);
      console.log(`Map discovered ${productUrls.length} product URLs`);
    } catch (e) {
      console.error('Map failed, using known URLs:', e.message);
    }

    // Add known product slugs as fallback
    const knownSlugs = [
      'advanced-vitamins-blood-test', 'advanced-well-man-blood-test', 'advanced-well-woman-blood-test',
      'anaemia-blood-test', 'iron-blood-test', 'menopause-blood-test', 'prostate-psa-blood-test',
      'testosterone-blood-test', 'thyroid-function-blood-test', 'gp-consultation',
    ];
    for (const slug of knownSlugs) {
      const url = `https://goodbodyclinic.com/products/${slug}`;
      if (!productUrls.includes(url)) productUrls.push(url);
    }

    productUrls = [...new Set(productUrls)];
    console.log(`Total unique products to scrape: ${productUrls.length}`);

    // Step 2: Scrape each product page
    const products: any[] = [];
    for (const url of productUrls) {
      try {
        const slug = url.split('/products/').pop() || '';
        console.log(`Scraping: ${slug}`);
        const result = await firecrawlScrape(url, firecrawlApiKey);
        if (!result.success || !result.data) { console.log(`No data for ${slug}`); continue; }

        const markdown = result.data.markdown || '';
        const metadata = result.data.metadata || {};
        const extracted = extractFromMarkdown(markdown, url);

        const title = extracted.title || metadata.title?.replace(/\s*[–|]\s*Goodbody.*$/i, '').trim() || '';
        if (!title || title === 'Unknown Test') continue;

        products.push({
          test_name: title,
          provider_id: 'goodbody-clinic',
          provider_test_id: slug,
          category: determineCategory(title, extracted.description),
          price: extracted.price || null,
          description: metadata.description || extracted.description || `${title} from Goodbody Clinic.`,
          url,
          is_active: true,
          biomarkers_list: extracted.biomarkers.length > 0 ? extracted.biomarkers : null,
          biomarker_count: extracted.biomarkerCount || extracted.biomarkers.length || null,
          sample_type: 'Venous blood',
          clinic_visit_available: true,
          home_kit_available: true,
          url_verified: true,
          url_verified_at: new Date().toISOString(),
          scraped_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        console.log(`✓ ${title} - £${extracted.price}`);
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.error(`✗ Error: ${e.message}`);
      }
    }

    // Step 3: Upsert
    if (products.length > 0) {
      const { error } = await supabase.from('provider_tests').upsert(products, {
        onConflict: 'provider_id,provider_test_id', ignoreDuplicates: false,
      });
      if (error) throw error;
    }

    await supabase.from('scraping_jobs').upsert({
      provider_id: 'goodbody-clinic', status: 'completed',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 12 * 3600000).toISOString(),
      error_message: null,
    }, { onConflict: 'provider_id' });

    return new Response(JSON.stringify({
      success: true, message: `Scraped ${products.length} GoodBody tests via Firecrawl`,
      testsUpdated: products.length,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('GoodBody scraper error:', error);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    await supabase.from('scraping_jobs').upsert({
      provider_id: 'goodbody-clinic', status: 'failed',
      error_message: error.message, last_scraped: new Date().toISOString(),
    }, { onConflict: 'provider_id' });
    return new Response(JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
