import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const medichecksTests = [
      { provider_id: 'medichecks', test_name: 'Testosterone Blood Test', price: 29, url: 'https://www.medichecks.com/products/testosterone-blood-test', category: 'Hormone', description: 'Comprehensive testosterone level assessment for hormonal health monitoring.' },
      { provider_id: 'medichecks', test_name: 'Male Hormone Blood Test', price: 79, url: 'https://www.medichecks.com/products/male-hormone-check-blood-test', category: 'Hormone', description: 'Complete male hormone panel for comprehensive hormonal health assessment.' },
      { provider_id: 'medichecks', test_name: 'Ultimate Performance Blood Test', price: 199, url: 'https://www.medichecks.com/products/ultimate-performance-blood-test', category: 'Sports Performance', description: 'Advanced testing for athletes and active individuals seeking optimal performance.' },
      { provider_id: 'medichecks', test_name: 'Advanced Thyroid Function Blood Test', price: 89, url: 'https://www.medichecks.com/products/advanced-thyroid-function-blood-test', category: 'Thyroid', description: 'Comprehensive thyroid function assessment including key thyroid hormones.' },
      { provider_id: 'medichecks', test_name: 'Advanced Well Woman Blood Test', price: 159, url: 'https://www.medichecks.com/products/well-woman-advanced-blood-test', category: "Women's Health", description: 'Comprehensive health check tailored specifically for women\'s health needs.' },
      { provider_id: 'medichecks', test_name: 'Advanced Well Man Blood Test', price: 159, url: 'https://www.medichecks.com/products/well-man-advanced-blood-test', category: "Men's Health", description: 'Complete health assessment designed specifically for men\'s health monitoring.' },
      { provider_id: 'medichecks', test_name: 'Advanced TRT Blood Test', price: 149, url: 'https://www.medichecks.com/products/trt-check-plus-testosterone-replacement-therapy-blood-test', category: 'Hormone', description: 'Specialized testing for individuals on testosterone replacement therapy.' },
      { provider_id: 'medichecks', test_name: 'Thyroid Function Blood Test', price: 45, url: 'https://www.medichecks.com/products/thyroid-function-blood-test', category: 'Thyroid', description: 'Essential thyroid function screening to monitor thyroid health.' },
      { provider_id: 'medichecks', test_name: 'Female Hormone Blood Test', price: 79, url: 'https://www.medichecks.com/products/female-hormone-check-blood-test', category: 'Hormone', description: 'Comprehensive female hormone panel for hormonal health assessment.' },
      { provider_id: 'medichecks', test_name: 'Health and Lifestyle Blood Test', price: 89, url: 'https://www.medichecks.com/products/health-and-lifestyle-check-blood-test', category: 'General Health', description: 'Comprehensive health check covering key lifestyle and wellness markers.' },
      { provider_id: 'medichecks', test_name: 'Thyroid Function with Antibodies Blood Test', price: 65, url: 'https://www.medichecks.com/products/thyroid-function-antibodies-blood-test', category: 'Thyroid', description: 'Thyroid assessment including antibody testing for autoimmune conditions.' },
      { provider_id: 'medichecks', test_name: 'Sports Hormone Blood Test', price: 109, url: 'https://www.medichecks.com/products/sports-hormone-check-blood-test', category: 'Sports Performance', description: 'Hormone panel designed for athletes and active individuals.' },
      { provider_id: 'medichecks', test_name: 'Liver Function Blood Test', price: 39, url: 'https://www.medichecks.com/products/liver-check-blood-test', category: 'Liver', description: 'Essential liver function screening to monitor liver health.' },
      { provider_id: 'medichecks', test_name: 'Optimal Health Blood Test', price: 249, url: 'https://www.medichecks.com/products/optimal-health-blood-test', category: 'General Health', description: 'Most comprehensive health assessment covering all major health markers.' },
      { provider_id: 'medichecks', test_name: 'Vitamin D Blood Test', price: 39, url: 'https://www.medichecks.com/products/vitamin-d-25-oh-blood-test', category: 'Vitamins', description: 'Essential vitamin D level testing for bone and immune health.' },
      { provider_id: 'medichecks', test_name: 'Advanced Female Hormone Blood Test', price: 99, url: 'https://www.medichecks.com/products/female-hormone-check-advanced-blood-test', category: 'Hormone', description: 'Comprehensive female hormone assessment for detailed hormonal analysis.' },
      { provider_id: 'medichecks', test_name: 'PSA Blood Test', price: 45, url: 'https://www.medichecks.com/products/psa-prostate-specific-antigen-blood-test', category: "Men's Health", description: 'Prostate health screening for men to monitor PSA levels.' },
      { provider_id: 'medichecks', test_name: 'Iron Blood Test', price: 49, url: 'https://www.medichecks.com/products/iron-deficiency-check-blood-test', category: 'General Health', description: 'Iron status assessment to detect iron deficiency or overload.' }
    ];

    const londonLabTests = [
      { provider_id: 'london-medical-laboratory', test_name: 'General Health Screen', price: 89, url: 'https://www.londonmedicallaboratory.com/', category: 'General Health', description: 'Comprehensive health screening covering essential health markers.' },
      { provider_id: 'london-medical-laboratory', test_name: 'Vitamin Profile', price: 129, url: 'https://www.londonmedicallaboratory.com/', category: 'Vitamins', description: 'Complete vitamin status assessment including key vitamins.' },
      { provider_id: 'london-medical-laboratory', test_name: 'Hormone Check', price: 149, url: 'https://www.londonmedicallaboratory.com/', category: 'Hormone', description: 'Comprehensive hormone panel for hormonal health assessment.' },
      { provider_id: 'london-medical-laboratory', test_name: 'Advanced Thyroid Function', price: 99, url: 'https://www.londonmedicallaboratory.com/', category: 'Thyroid', description: 'Detailed thyroid function assessment with comprehensive markers.' },
      { provider_id: 'london-medical-laboratory', test_name: 'Female Fertility Profile', price: 179, url: 'https://www.londonmedicallaboratory.com/', category: 'Fertility', description: 'Comprehensive fertility assessment for women planning pregnancy.' },
      { provider_id: 'london-medical-laboratory', test_name: 'Male Fertility Profile', price: 169, url: 'https://www.londonmedicallaboratory.com/', category: 'Fertility', description: 'Complete fertility screening for men assessing reproductive health.' },
      { provider_id: 'london-medical-laboratory', test_name: 'Heart Health Profile', price: 119, url: 'https://www.londonmedicallaboratory.com/', category: 'Heart Health', description: 'Cardiovascular health assessment including key cardiac markers.' },
      { provider_id: 'london-medical-laboratory', test_name: 'Diabetes Screening', price: 79, url: 'https://www.londonmedicallaboratory.com/', category: 'Diabetes', description: 'Essential diabetes screening to monitor blood sugar levels.' }
    ];

    const allTests = [...medichecksTests, ...londonLabTests];
    let insertedCount = 0;
    let updatedCount = 0;

    for (const test of allTests) {
      // Check if test already exists
      const { data: existing } = await supabase
        .from('provider_tests')
        .select('id')
        .eq('provider_id', test.provider_id)
        .eq('test_name', test.test_name)
        .single();

      if (existing) {
        // Update existing test
        await supabase
          .from('provider_tests')
          .update({
            price: test.price,
            url: test.url,
            category: test.category,
            description: test.description,
            is_active: true
          })
          .eq('id', existing.id);
        updatedCount++;
      } else {
        // Insert new test
        await supabase
          .from('provider_tests')
          .insert({
            provider_id: test.provider_id,
            test_name: test.test_name,
            price: test.price,
            url: test.url,
            category: test.category,
            description: test.description,
            is_active: true
          });
        insertedCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully processed ${allTests.length} tests`,
        inserted: insertedCount,
        updated: updatedCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating provider tests:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
