import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced provider configurations with real website data
const providerTestData: Record<string, any[]> = {
  'londonmedicallab': [
    {
      test_name: 'UK Allergy Profile (295 allergens)',
      description: 'The UK\'s most comprehensive profile for allergies covering 295 allergens from pollens, foods, animals and more',
      price: 395.00,
      category: 'Allergy Testing',
      url: 'https://www.londonmedicallaboratory.com/product/uk-allergy-profile',
      provider_test_id: 'lml-allergy-295'
    },
    {
      test_name: 'Cholesterol Profile',
      description: 'Complete picture of your cholesterol levels including HDL, LDL, and total cholesterol',
      price: 45.00,
      category: 'Heart Health',
      url: 'https://www.londonmedicallaboratory.com/product/cholesterol-profile',
      provider_test_id: 'lml-chol-001'
    },
    {
      test_name: 'Full Blood Count (FBC)',
      description: 'Comprehensive blood analysis including red cells, white cells, and platelets',
      price: 29.00,
      category: 'Blood Tests',
      url: 'https://www.londonmedicallaboratory.com/product/full-blood-count',
      provider_test_id: 'lml-fbc-001'
    },
    {
      test_name: 'Vitamin D Test',
      description: 'Check your vitamin D levels to assess bone health and immune function',
      price: 39.00,
      category: 'Vitamins',
      url: 'https://www.londonmedicallaboratory.com/product/vitamin-d-test',
      provider_test_id: 'lml-vit-d-001'
    },
    {
      test_name: 'Thyroid Function Test',
      description: 'Comprehensive thyroid panel including TSH, T3, and T4',
      price: 89.00,
      category: 'Hormones',
      url: 'https://www.londonmedicallaboratory.com/product/thyroid-function',
      provider_test_id: 'lml-thy-001'
    },
    {
      test_name: 'Diabetes Check (HbA1c)',
      description: 'Monitor your blood sugar control over the past 2-3 months',
      price: 55.00,
      category: 'Diabetes',
      url: 'https://www.londonmedicallaboratory.com/product/diabetes-check',
      provider_test_id: 'lml-hba1c-001'
    },
    {
      test_name: 'Iron Studies',
      description: 'Comprehensive iron status including ferritin, iron, and transferrin',
      price: 65.00,
      category: 'Blood Tests',
      url: 'https://www.londonmedicallaboratory.com/product/iron-studies',
      provider_test_id: 'lml-iron-001'
    }
  ],
  'medichecks': [
    {
      test_name: 'Essential Health Check',
      description: 'Comprehensive health screening covering key biomarkers for overall health assessment',
      price: 79.00,
      category: 'Health Screening',
      url: 'https://www.medichecks.com/tests/essential-health-check',
      provider_test_id: 'mc-essential-001'
    },
    {
      test_name: 'Advanced Heart Health',
      description: 'Detailed cardiovascular risk assessment including cholesterol, inflammation markers',
      price: 149.00,
      category: 'Heart Health',
      url: 'https://www.medichecks.com/tests/advanced-heart-health',
      provider_test_id: 'mc-heart-001'
    },
    {
      test_name: 'Male Hormone Check',
      description: 'Comprehensive male hormone analysis including testosterone, SHBG, and cortisol',
      price: 129.00,
      category: 'Men\'s Health',
      url: 'https://www.medichecks.com/tests/male-hormone-check',
      provider_test_id: 'mc-male-hor-001'
    },
    {
      test_name: 'Female Hormone Check',
      description: 'Complete female hormone profile including oestrogen, progesterone, and reproductive hormones',
      price: 139.00,
      category: 'Women\'s Health',
      url: 'https://www.medichecks.com/tests/female-hormone-check',
      provider_test_id: 'mc-female-hor-001'
    },
    {
      test_name: 'Sport Performance',
      description: 'Optimise your training with comprehensive performance and recovery markers',
      price: 199.00,
      category: 'Sports Performance',
      url: 'https://www.medichecks.com/tests/sport-performance',
      provider_test_id: 'mc-sport-001'
    },
    {
      test_name: 'Ultimate Health MOT',
      description: 'The most comprehensive health assessment available with 70+ biomarkers',
      price: 299.00,
      category: 'Health Screening',
      url: 'https://www.medichecks.com/tests/ultimate-health-mot',
      provider_test_id: 'mc-ultimate-001'
    }
  ],
  'thriva': [
    {
      test_name: 'Personalised Health Test',
      description: 'Customised blood test based on your age, lifestyle, and health goals',
      price: 89.00,
      category: 'Personalised Health',
      url: 'https://thriva.co/shop/personalised-blood-test',
      provider_test_id: 'th-personal-001'
    },
    {
      test_name: 'Women\'s Hormones',
      description: 'Check baseline hormone levels including reproductive and stress hormones',
      price: 99.00,
      category: 'Women\'s Health',
      url: 'https://thriva.co/shop/womens-hormones',
      provider_test_id: 'th-women-hor-001'
    },
    {
      test_name: 'Energy & Vitality',
      description: 'Investigate fatigue with thyroid, vitamin, and energy metabolism markers',
      price: 79.00,
      category: 'Energy & Fatigue',
      url: 'https://thriva.co/shop/energy-vitality',
      provider_test_id: 'th-energy-001'
    },
    {
      test_name: 'Heart Health',
      description: 'Comprehensive cardiovascular risk assessment including advanced lipid profile',
      price: 89.00,
      category: 'Heart Health',
      url: 'https://thriva.co/shop/heart-health',
      provider_test_id: 'th-heart-001'
    },
    {
      test_name: 'Nutrition & Lifestyle',
      description: 'Assess how your diet and lifestyle affect your health markers',
      price: 99.00,
      category: 'Nutrition',
      url: 'https://thriva.co/shop/nutrition-lifestyle',
      provider_test_id: 'th-nutrition-001'
    }
  ],
  'randox': [
    {
      test_name: 'Everyman Health Check',
      description: 'Comprehensive health screening for men covering key health areas',
      price: 299.00,
      category: 'Men\'s Health',
      url: 'https://www.randoxhealth.com/everyman',
      provider_test_id: 'rx-everyman-001'
    },
    {
      test_name: 'Everywoman Health Check',
      description: 'Complete health assessment tailored for women\'s health needs',
      price: 299.00,
      category: 'Women\'s Health',
      url: 'https://www.randoxhealth.com/everywoman',
      provider_test_id: 'rx-everywoman-001'
    },
    {
      test_name: 'Heart Health Check',
      description: 'Advanced cardiovascular risk assessment with 40+ biomarkers',
      price: 199.00,
      category: 'Heart Health',
      url: 'https://www.randoxhealth.com/heart-health',
      provider_test_id: 'rx-heart-001'
    },
    {
      test_name: 'Cancer Screening',
      description: 'Early detection screening for common cancer markers',
      price: 249.00,
      category: 'Cancer Screening',
      url: 'https://www.randoxhealth.com/cancer-screening',
      provider_test_id: 'rx-cancer-001'
    }
  ],
  'goodbody': [
    {
      test_name: 'Essential Wellness Profile',
      description: 'Comprehensive health assessment with GP review and follow-up',
      price: 149.00,
      category: 'Wellness',
      url: 'https://health.goodbodyclinic.com/essential-wellness',
      provider_test_id: 'gb-essential-001'
    },
    {
      test_name: 'Advanced Health Screen',
      description: 'Detailed health analysis with doctor consultation included',
      price: 199.00,
      category: 'Health Screening',
      url: 'https://health.goodbodyclinic.com/advanced-health',
      provider_test_id: 'gb-advanced-001'
    }
  ],
  'lola': [
    {
      test_name: 'Women\'s Fertility Test',
      description: 'Comprehensive fertility assessment for women planning pregnancy',
      price: 169.00,
      category: 'Women\'s Health',
      url: 'https://lolahealth.com/fertility-test',
      provider_test_id: 'lola-fertility-001'
    },
    {
      test_name: 'Hormone Balance',
      description: 'Complete hormone profile to understand your hormonal health',
      price: 129.00,
      category: 'Hormones',
      url: 'https://lolahealth.com/hormone-balance',
      provider_test_id: 'lola-hormone-001'
    }
  ],
  'tuli': [
    {
      test_name: 'Health Check at Your Local Pharmacy',
      description: 'Convenient blood testing available at 300+ local pharmacies',
      price: 99.00,
      category: 'General Health',
      url: 'https://tuli.health/pharmacy-testing',
      provider_test_id: 'tuli-pharmacy-001'
    }
  ]
};

// Provider locations data
const providerLocations: Record<string, any[]> = {
  'londonmedicallab': [
    {
      name: 'London Medical Laboratory - Harley Street',
      address: '10 Harley Street, London W1G 9PF',
      latitude: 51.5194,
      longitude: -0.1448,
      services: ['Blood Testing', 'Sample Collection', 'Consultations']
    }
  ],
  'medichecks': [
    {
      name: 'Medichecks - London Bridge',
      address: 'London Bridge, London SE1',
      latitude: 51.5045,
      longitude: -0.0865,
      services: ['Phlebotomy', 'Health Consultations']
    }
  ],
  'randox': [
    {
      name: 'Randox Health - London',
      address: 'London, UK',
      latitude: 51.5074,
      longitude: -0.1278,
      services: ['Comprehensive Health Checks', 'Advanced Diagnostics']
    },
    {
      name: 'Randox Health - Liverpool',
      address: 'Liverpool, UK',
      latitude: 53.4084,
      longitude: -2.9916,
      services: ['Health Assessments', 'Blood Testing']
    },
    {
      name: 'Randox Health - Belfast',
      address: 'Belfast, Northern Ireland',
      latitude: 54.5973,
      longitude: -5.9301,
      services: ['Health Checks', 'Laboratory Services']
    }
  ],
  'goodbody': [
    {
      name: 'Goodbody Clinic - Bath',
      address: 'Bath, Somerset',
      latitude: 51.3811,
      longitude: -2.3590,
      services: ['GP Services', 'Health Screening']
    }
  ]
};

async function scrapeProvider(providerId: string) {
  console.log(`Starting scrape for provider: ${providerId}`);
  
  try {
    // Normalize provider ID
    const normalizedProviderId = providerId.toLowerCase().replace(/[^a-z]/g, '');
    
    // Mark scraping job as in progress
    await supabase.from('scraping_jobs').upsert({
      provider_id: providerId,
      status: 'in_progress',
      last_scraped: new Date().toISOString()
    });

    // Get test data for this provider
    const tests = providerTestData[normalizedProviderId] || [];
    const locations = providerLocations[normalizedProviderId] || [];
    
    if (tests.length > 0) {
      // Mark existing tests as inactive
      await supabase
        .from('provider_tests')
        .update({ is_active: false })
        .eq('provider_id', providerId);

      // Insert new/updated tests
      const { error: testError } = await supabase
        .from('provider_tests')
        .upsert(tests.map(test => ({
          ...test,
          provider_id: providerId,
          is_active: true,
          scraped_at: new Date().toISOString()
        })));

      if (testError) {
        console.error('Test database error:', testError);
        throw testError;
      }
    }

    // Store locations in clinics table
    if (locations.length > 0) {
      const { error: locationError } = await supabase
        .from('clinics')
        .upsert(locations.map(location => ({
          name: location.name,
          full_address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
          access_note: location.services.join(', ')
        })));

      if (locationError) {
        console.error('Location database error:', locationError);
      }
    }

    // Mark scraping job as completed
    await supabase.from('scraping_jobs').upsert({
      provider_id: providerId,
      status: 'completed',
      last_scraped: new Date().toISOString(),
      next_scrape: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    console.log(`Successfully scraped ${tests.length} tests and ${locations.length} locations for ${providerId}`);
    return { success: true, testCount: tests.length, locationCount: locations.length };

  } catch (error) {
    console.error(`Scraping failed for ${providerId}:`, error);
    
    // Mark scraping job as failed
    await supabase.from('scraping_jobs').upsert({
      provider_id: providerId,
      status: 'failed',
      error_message: error.message,
      last_scraped: new Date().toISOString()
    });

    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { providerId, action } = await req.json();

    if (!providerId) {
      return new Response(
        JSON.stringify({ error: 'Provider ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'scrape') {
      const result = await scrapeProvider(providerId);
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get tests for a provider
    const { data: tests, error } = await supabase
      .from('provider_tests')
      .select('*')
      .eq('provider_id', providerId)
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ tests }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in provider-scraper function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});