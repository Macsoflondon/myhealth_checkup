import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProviderTest {
  id: string;
  provider_id: string;
  test_name: string;
  category: string | null;
  description: string | null;
  price: number | null;
}

interface MasterTest {
  id: string;
  test_name: string;
  category: string;
  subcategory: string | null;
  description: string;
  biomarkers: any;
}

interface AIMapping {
  provider_test_name: string;
  master_test_id: string;
  master_test_name: string;
  confidence_score: number;
  reasoning: string;
}

interface MappingResult {
  total_processed: number;
  high_confidence_mapped: number;
  medium_confidence_review: number;
  low_confidence_skipped: number;
  mappings_created: Array<{
    provider: string;
    test: string;
    master: string;
    confidence: number;
  }>;
  review_needed: Array<{
    provider: string;
    test: string;
    suggestions: AIMapping[];
  }>;
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Provider ID to prefix mapping
const PROVIDER_PREFIXES: Record<string, string> = {
  'medichecks': 'MED',
  'lola-health': 'LOL',
  'goodbody-clinic': 'GOO',
  'thriva': 'THR',
  'london-medical-laboratory': 'LML',
  'randox': 'RAN',
};

async function generateProviderTestId(
  supabase: any,
  providerId: string
): Promise<string> {
  const prefix = PROVIDER_PREFIXES[providerId] || 'UNK';
  
  // Get highest existing sequence number for this provider
  const { data: existing } = await supabase
    .from('provider_test_mapping')
    .select('provider_test_id')
    .eq('provider_id', providerId)
    .like('provider_test_id', `${prefix}%`)
    .order('provider_test_id', { ascending: false })
    .limit(1);

  let nextSequence = 1;
  if (existing && existing.length > 0) {
    const match = existing[0].provider_test_id.match(/\d+$/);
    if (match) {
      nextSequence = parseInt(match[0]) + 1;
    }
  }

  return `${prefix}${nextSequence.toString().padStart(3, '0')}`;
}

async function callOpenAIWithRetry(
  prompt: string,
  maxRetries = 3
): Promise<{ mappings: AIMapping[] }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`OpenAI API call attempt ${attempt}/${maxRetries}`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5-2025-08-07',
          messages: [
            {
              role: 'system',
              content: 'You are a medical test mapping expert. Analyze blood tests and match them to standardized master tests based on semantic similarity, clinical purpose, and biomarker alignment. Always return valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_completion_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error (${response.status}):`, errorText);
        
        if (response.status === 429 || response.status >= 500) {
          // Retry on rate limits or server errors
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.log(`Retrying after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in OpenAI response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
  
  throw new Error('All retry attempts failed');
}

async function processBatch(
  providerTests: ProviderTest[],
  masterTests: MasterTest[],
  supabase: any,
  dryRun: boolean
): Promise<{
  mapped: number;
  review: number;
  skipped: number;
  mappingsCreated: any[];
  reviewNeeded: any[];
}> {
  console.log(`Processing batch of ${providerTests.length} tests`);
  
  const prompt = `You are a medical test mapping expert. Your task is to match provider blood tests to standardized master tests based on semantic similarity.

PROVIDER TESTS TO MAP:
${providerTests.map(t => `- ${t.test_name} (${t.category || 'Uncategorized'}): ${t.description || 'No description available'}`).join('\n')}

MASTER TESTS DATABASE:
${masterTests.map(t => {
  const biomarkers = Array.isArray(t.biomarkers) 
    ? t.biomarkers.join(', ') 
    : (typeof t.biomarkers === 'object' && t.biomarkers !== null)
      ? JSON.stringify(t.biomarkers)
      : 'No biomarkers listed';
  return `- ${t.test_name} (${t.category}${t.subcategory ? ' / ' + t.subcategory : ''}): ${t.description}\n  Biomarkers: ${biomarkers}`;
}).join('\n\n')}

For each provider test, identify the best matching master test. Return JSON in this exact format:
{
  "mappings": [
    {
      "provider_test_name": "exact name from provider test list",
      "master_test_id": "UUID from master test",
      "master_test_name": "name of matched master test",
      "confidence_score": 85,
      "reasoning": "brief explanation of match"
    }
  ]
}

Match criteria:
1. Test name similarity (exact > partial > semantic)
2. Category/subcategory alignment
3. Biomarker overlap (if available)
4. Clinical purpose similarity

Confidence scoring:
- 90-100: Exact or near-exact match (same name, same biomarkers)
- 80-89: Strong semantic match with category alignment
- 60-79: Possible match with some uncertainty
- 0-59: Poor match or no suitable master test exists

Only include matches with confidence ≥ 60. If no good match exists, omit that test from results.`;

  let aiResponse;
  try {
    aiResponse = await callOpenAIWithRetry(prompt);
  } catch (error) {
    console.error('Failed to get AI response:', error);
    throw error;
  }

  let mapped = 0;
  let review = 0;
  let skipped = 0;
  const mappingsCreated: any[] = [];
  const reviewNeeded: any[] = [];

  for (const mapping of aiResponse.mappings) {
    const providerTest = providerTests.find(t => t.test_name === mapping.provider_test_name);
    if (!providerTest) {
      console.warn(`Provider test not found: ${mapping.provider_test_name}`);
      continue;
    }

    console.log(`${providerTest.test_name} → ${mapping.master_test_name} (${mapping.confidence_score}%): ${mapping.reasoning}`);

    if (mapping.confidence_score >= 75) {
      // High confidence - auto-map (Day 1: 75% threshold for launch blitz)
      if (!dryRun) {
        try {
          const providerTestId = await generateProviderTestId(supabase, providerTest.provider_id);
          
          const { error: insertError } = await supabase
            .from('provider_test_mapping')
            .insert({
              provider_id: providerTest.provider_id,
              provider_test_id: providerTestId,
              provider_test_name: providerTest.test_name,
              test_master_id: mapping.master_test_id,
              current_price: providerTest.price,
              availability_status: 'available',
              last_scraped_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error(`Failed to insert mapping for ${providerTest.test_name}:`, insertError);
            continue;
          }

          console.log(`✓ Mapped: ${providerTest.test_name} → ${mapping.master_test_name}`);
        } catch (error) {
          console.error(`Error creating mapping for ${providerTest.test_name}:`, error);
          continue;
        }
      }

      mapped++;
      mappingsCreated.push({
        provider: providerTest.provider_id,
        test: providerTest.test_name,
        master: mapping.master_test_name,
        confidence: mapping.confidence_score,
      });
    } else if (mapping.confidence_score >= 60) {
      // Medium confidence - flag for review
      review++;
      reviewNeeded.push({
        provider: providerTest.provider_id,
        test: providerTest.test_name,
        suggestions: [mapping],
      });
      console.log(`? Review needed: ${providerTest.test_name} (${mapping.confidence_score}%)`);
    } else {
      // Low confidence - skip
      skipped++;
      console.log(`✗ Skipped: ${providerTest.test_name} (${mapping.confidence_score}% too low)`);
    }
  }

  // Handle provider tests with no AI suggestions (confidence < 60)
  const suggestedTests = new Set(aiResponse.mappings.map(m => m.provider_test_name));
  for (const providerTest of providerTests) {
    if (!suggestedTests.has(providerTest.test_name)) {
      skipped++;
      console.log(`✗ Skipped: ${providerTest.test_name} (no suitable match found)`);
    }
  }

  return { mapped, review, skipped, mappingsCreated, reviewNeeded };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Server-side admin role validation
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Create client with user's token to verify identity
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error('Failed to get user:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate admin role using has_role() database function
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError) {
      console.error('Failed to check admin role:', roleError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isAdmin) {
      console.error(`User ${user.id} attempted admin operation without admin role`);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin ${user.id} authorized for AI test mapper operation`);

    const { dryRun = true, confidenceThreshold = 75, batchSize = 10 } = await req.json();

    console.log('=== AI Test Mapper Started ===');
    console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
    console.log(`Confidence threshold: ${confidenceThreshold}`);
    console.log(`Batch size: ${batchSize}`);

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Fetch all master tests
    const { data: masterTests, error: masterError } = await supabase
      .from('tests_master')
      .select('id, test_name, category, subcategory, description, biomarkers')
      .eq('is_active', true);

    if (masterError) throw masterError;
    console.log(`Loaded ${masterTests.length} master tests`);

    // Fetch unmapped provider tests
    const { data: allProviderTests, error: providerError } = await supabase
      .from('provider_tests')
      .select('id, provider_id, test_name, category, description, price')
      .eq('is_active', true);

    if (providerError) throw providerError;

    // Filter out already mapped tests
    const { data: existingMappings } = await supabase
      .from('provider_test_mapping')
      .select('provider_id, provider_test_name');

    const mappedTestKeys = new Set(
      existingMappings?.map(m => `${m.provider_id}:${m.provider_test_name}`) || []
    );

    const unmappedTests = allProviderTests.filter(
      t => !mappedTestKeys.has(`${t.provider_id}:${t.test_name}`)
    );

    console.log(`Found ${unmappedTests.length} unmapped provider tests (${allProviderTests.length} total)`);

    if (unmappedTests.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No unmapped tests found',
          total_processed: 0,
          high_confidence_mapped: 0,
          medium_confidence_review: 0,
          low_confidence_skipped: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result: MappingResult = {
      total_processed: 0,
      high_confidence_mapped: 0,
      medium_confidence_review: 0,
      low_confidence_skipped: 0,
      mappings_created: [],
      review_needed: [],
    };

    // Process in batches
    for (let i = 0; i < unmappedTests.length; i += batchSize) {
      const batch = unmappedTests.slice(i, i + batchSize);
      console.log(`\n--- Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(unmappedTests.length / batchSize)} ---`);

      const batchResult = await processBatch(batch, masterTests, supabase, dryRun);

      result.total_processed += batch.length;
      result.high_confidence_mapped += batchResult.mapped;
      result.medium_confidence_review += batchResult.review;
      result.low_confidence_skipped += batchResult.skipped;
      result.mappings_created.push(...batchResult.mappingsCreated);
      result.review_needed.push(...batchResult.reviewNeeded);

      // Add delay between batches to respect rate limits
      if (i + batchSize < unmappedTests.length) {
        console.log('Waiting 2s before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('\n=== AI Test Mapper Complete ===');
    console.log(`Total processed: ${result.total_processed}`);
    console.log(`High confidence mapped: ${result.high_confidence_mapped}`);
    console.log(`Medium confidence (review): ${result.medium_confidence_review}`);
    console.log(`Low confidence (skipped): ${result.low_confidence_skipped}`);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('AI Test Mapper error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
