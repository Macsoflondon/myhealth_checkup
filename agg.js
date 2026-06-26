const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

async function run() {
  try {
    // 1. canonical_category counts
    const { data: canonData, error: canonError } = await supabase
      .from('provider_tests')
      .select('canonical_category');
    
    if (canonError) throw canonError;
    const canonCounts = canonData.reduce((acc, curr) => {
      acc[curr.canonical_category] = (acc[curr.canonical_category] || 0) + 1;
      return acc;
    }, {});
    console.log('--- CANONICAL CATEGORY COUNTS ---');
    console.log(JSON.stringify(Object.entries(canonCounts).sort((a,b) => b[1] - a[1]), null, 2));

    // 1b. category counts
    const { data: catData, error: catError } = await supabase
      .from('provider_tests')
      .select('category');
    
    if (catError) throw catError;
    const catCounts = catData.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});
    console.log('\n--- CATEGORY COUNTS ---');
    console.log(JSON.stringify(Object.entries(catCounts).sort((a,b) => b[1] - a[1]), null, 2));

    // 2. source_section in provider_section_category_map
    const { data: sectionData, error: sectionError } = await supabase
      .from('provider_section_category_map')
      .select('source_section');
    
    if (sectionError) throw sectionError;
    const distinctSections = [...new Set(sectionData.map(d => d.source_section))];
    console.log('\n--- DISTINCT SOURCE SECTIONS ---');
    console.log(JSON.stringify(distinctSections.sort(), null, 2));

    // 4. Lola Health single-biomarker products
    const { data: lolaData, error: lolaError } = await supabase
      .from('provider_tests')
      .select('test_name, biomarker_count')
      .ilike('provider_id', '%lola%')
      .eq('biomarker_count', 1)
      .limit(30);
    
    if (lolaError) throw lolaError;
    console.log('\n--- LOLA HEALTH SINGLE BIOMARKER SAMPLES ---');
    console.log(JSON.stringify(lolaData, null, 2));

    // 5. Bowel/FIT/Microbiome tests
    const terms = ['bowel','fit','faecal','microbiome','colorectal','occult'];
    const { data: bowelData, error: bowelError } = await supabase
      .from('provider_tests')
      .select('id, test_name, provider_id');
    
    if (bowelError) throw bowelError;
    const filteredBowel = bowelData.filter(t => 
      (t.provider_id?.toLowerCase().includes('goodbody') || t.provider_id?.toLowerCase().includes('medichecks')) ||
      terms.some(term => t.test_name?.toLowerCase().includes(term))
    ).filter(t => terms.some(term => t.test_name?.toLowerCase().includes(term)));

    console.log('\n--- BOWEL/FIT/MICROBIOME TESTS ---');
    console.log(JSON.stringify(filteredBowel, null, 2));

  } catch (err) {
    console.error(err);
  }
}

run();
