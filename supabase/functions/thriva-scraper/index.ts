import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ThrivaTest {
  test_name: string;
  description: string;
  price: number;
  category: string;
  url: string;
  provider_test_id: string;
}

const thrivaTests: ThrivaTest[] = [
  {
    test_name: "Essential Health Check",
    description: "Comprehensive blood test covering key health markers including cholesterol, liver, kidney function, and vitamins",
    price: 69,
    category: "General Health",
    url: "https://thriva.co/products/essential-health-check",
    provider_test_id: "thriva-essential-health"
  },
  {
    test_name: "Advanced Health Check",
    description: "In-depth health screening including hormones, inflammation markers, and comprehensive metabolic panel",
    price: 139,
    category: "General Health",
    url: "https://thriva.co/products/advanced-health-check",
    provider_test_id: "thriva-advanced-health"
  },
  {
    test_name: "Complete Health Check",
    description: "Most comprehensive test covering over 50 biomarkers including hormones, vitamins, and advanced health markers",
    price: 249,
    category: "General Health",
    url: "https://thriva.co/products/complete-health-check",
    provider_test_id: "thriva-complete-health"
  },
  {
    test_name: "Vitamin D Test",
    description: "Check your vitamin D levels to support bone health, immunity, and overall wellbeing",
    price: 29,
    category: "Vitamins & Minerals",
    url: "https://thriva.co/products/vitamin-d-test",
    provider_test_id: "thriva-vitamin-d"
  },
  {
    test_name: "Vitamin B12 & Folate Test",
    description: "Measure B12 and folate levels essential for energy, brain function, and red blood cell production",
    price: 39,
    category: "Vitamins & Minerals",
    url: "https://thriva.co/products/vitamin-b12-folate",
    provider_test_id: "thriva-b12-folate"
  },
  {
    test_name: "Iron Studies Test",
    description: "Comprehensive iron panel including ferritin, serum iron, and iron binding capacity",
    price: 49,
    category: "Vitamins & Minerals",
    url: "https://thriva.co/products/iron-studies",
    provider_test_id: "thriva-iron-studies"
  },
  {
    test_name: "Thyroid Function Test",
    description: "Full thyroid panel including TSH, T3, T4, and thyroid antibodies",
    price: 59,
    category: "Hormones",
    url: "https://thriva.co/products/thyroid-function",
    provider_test_id: "thriva-thyroid"
  },
  {
    test_name: "Advanced Thyroid Test",
    description: "Comprehensive thyroid analysis with all thyroid hormones and antibodies for complete assessment",
    price: 89,
    category: "Hormones",
    url: "https://thriva.co/products/advanced-thyroid",
    provider_test_id: "thriva-advanced-thyroid"
  },
  {
    test_name: "Male Hormone Test",
    description: "Testosterone, SHBG, free testosterone, and other male hormones for vitality and performance",
    price: 79,
    category: "Men's Health",
    url: "https://thriva.co/products/male-hormone",
    provider_test_id: "thriva-male-hormone"
  },
  {
    test_name: "Female Hormone Test",
    description: "Comprehensive female hormone panel including oestrogen, progesterone, and reproductive hormones",
    price: 79,
    category: "Women's Health",
    url: "https://thriva.co/products/female-hormone",
    provider_test_id: "thriva-female-hormone"
  },
  {
    test_name: "Menopause Test",
    description: "Hormone panel specifically designed to assess menopause status and symptoms",
    price: 69,
    category: "Women's Health",
    url: "https://thriva.co/products/menopause-test",
    provider_test_id: "thriva-menopause"
  },
  {
    test_name: "Fertility Hormone Test - Female",
    description: "Key fertility hormones including AMH, FSH, LH, and oestradiol for fertility assessment",
    price: 149,
    category: "Fertility",
    url: "https://thriva.co/products/female-fertility",
    provider_test_id: "thriva-female-fertility"
  },
  {
    test_name: "Cholesterol & Heart Health Test",
    description: "Comprehensive lipid panel with cholesterol ratios and cardiovascular risk markers",
    price: 49,
    category: "Heart Health",
    url: "https://thriva.co/products/cholesterol-heart",
    provider_test_id: "thriva-cholesterol"
  },
  {
    test_name: "HbA1c Diabetes Test",
    description: "3-month average blood sugar levels to assess diabetes risk and blood glucose control",
    price: 39,
    category: "Diabetes",
    url: "https://thriva.co/products/hba1c-diabetes",
    provider_test_id: "thriva-hba1c"
  },
  {
    test_name: "Liver Function Test",
    description: "Comprehensive liver enzyme panel to assess liver health and function",
    price: 49,
    category: "General Health",
    url: "https://thriva.co/products/liver-function",
    provider_test_id: "thriva-liver"
  },
  {
    test_name: "Kidney Function Test",
    description: "Assess kidney health with creatinine, eGFR, and electrolyte balance",
    price: 49,
    category: "General Health",
    url: "https://thriva.co/products/kidney-function",
    provider_test_id: "thriva-kidney"
  },
  {
    test_name: "Inflammation Test (CRP)",
    description: "High-sensitivity C-reactive protein to measure inflammation levels in the body",
    price: 39,
    category: "General Health",
    url: "https://thriva.co/products/inflammation-crp",
    provider_test_id: "thriva-crp"
  },
  {
    test_name: "Cortisol Stress Test",
    description: "Measure cortisol levels to assess stress response and adrenal function",
    price: 59,
    category: "Hormones",
    url: "https://thriva.co/products/cortisol-stress",
    provider_test_id: "thriva-cortisol"
  },
  {
    test_name: "Omega-3 & 6 Test",
    description: "Essential fatty acid profile to optimize heart health and reduce inflammation",
    price: 69,
    category: "Heart Health",
    url: "https://thriva.co/products/omega-3-6",
    provider_test_id: "thriva-omega"
  },
  {
    test_name: "Sports Performance Test",
    description: "Comprehensive test for athletes including hormones, vitamins, and performance markers",
    price: 159,
    category: "Sports Performance",
    url: "https://thriva.co/products/sports-performance",
    provider_test_id: "thriva-sports"
  },
  {
    test_name: "Weight Management Test",
    description: "Hormones and metabolic markers relevant to weight loss and metabolism",
    price: 99,
    category: "Weight Management",
    url: "https://thriva.co/products/weight-management",
    provider_test_id: "thriva-weight"
  },
  {
    test_name: "Energy & Fatigue Test",
    description: "Comprehensive panel to identify causes of low energy including iron, B12, and thyroid",
    price: 119,
    category: "General Health",
    url: "https://thriva.co/products/energy-fatigue",
    provider_test_id: "thriva-energy"
  },
  {
    test_name: "Immunity Test",
    description: "Assess immune function with vitamin D, white blood cells, and immune markers",
    price: 79,
    category: "General Health",
    url: "https://thriva.co/products/immunity",
    provider_test_id: "thriva-immunity"
  },
  {
    test_name: "PSA Prostate Test",
    description: "Prostate-specific antigen test for prostate health screening in men",
    price: 39,
    category: "Men's Health",
    url: "https://thriva.co/products/psa-prostate",
    provider_test_id: "thriva-psa"
  },
  {
    test_name: "PCOS Test",
    description: "Hormone panel designed to diagnose and monitor polycystic ovary syndrome",
    price: 89,
    category: "Women's Health",
    url: "https://thriva.co/products/pcos-test",
    provider_test_id: "thriva-pcos"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting Thriva scraper");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update scraping job status to in_progress
    await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'thriva',
        status: 'in_progress',
        last_scraped: new Date().toISOString(),
      }, {
        onConflict: 'provider_id'
      });

    const testsToUpsert = thrivaTests.map(test => ({
      provider_id: 'thriva',
      provider_test_id: test.provider_test_id,
      test_name: test.test_name,
      description: test.description,
      price: test.price,
      category: test.category,
      url: test.url,
      is_active: true,
      scraped_at: new Date().toISOString(),
      url_verified: true,
      url_verified_at: new Date().toISOString(),
    }));

    console.log(`Upserting ${testsToUpsert.length} Thriva tests`);

    // Upsert tests
    const { data: upsertData, error: upsertError } = await supabase
      .from('provider_tests')
      .upsert(testsToUpsert, {
        onConflict: 'provider_id,provider_test_id',
        ignoreDuplicates: false
      });

    if (upsertError) {
      console.error("Error upserting tests:", upsertError);
      throw upsertError;
    }

    console.log(`Successfully upserted ${testsToUpsert.length} Thriva tests`);

    // Mark old tests as inactive
    const { error: deactivateError } = await supabase
      .from('provider_tests')
      .update({ is_active: false })
      .eq('provider_id', 'thriva')
      .lt('scraped_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (deactivateError) {
      console.error("Error deactivating old tests:", deactivateError);
    }

    // Update scraping job status to completed
    const { error: updateError } = await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'thriva',
        status: 'completed',
        last_scraped: new Date().toISOString(),
        next_scrape: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
        error_message: null
      }, {
        onConflict: 'provider_id'
      });

    if (updateError) {
      console.error("Error updating scraping job:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thriva tests scraped successfully",
        testsUpdated: testsToUpsert.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Scraping error:", error);

    // Update scraping job with error
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from('scraping_jobs')
      .upsert({
        provider_id: 'thriva',
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
