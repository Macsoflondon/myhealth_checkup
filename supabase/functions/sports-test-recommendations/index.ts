import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation limits
const MAX_STRING_LENGTH = 500;
const VALID_ATHLETE_TYPES = ['endurance', 'strength', 'team sports', 'recreational', 'other'];
const VALID_EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced', 'professional'];
const VALID_GENDERS = ['male', 'female', 'other', 'prefer not to say'];

interface ValidatedInput {
  athleteType: string;
  trainingGoals: string;
  experience?: string;
  age?: number;
  gender?: string;
}

function sanitizeString(str: unknown, maxLength: number): string {
  if (typeof str !== 'string') return '';
  // Remove potential prompt injection patterns and limit length
  return str.slice(0, maxLength).replace(/[\x00-\x1F\x7F]/g, '').trim();
}

function validateInput(body: Record<string, unknown>): { valid: true; data: ValidatedInput } | { valid: false; error: string } {
  const athleteType = sanitizeString(body.athleteType, 100);
  const trainingGoals = sanitizeString(body.trainingGoals, MAX_STRING_LENGTH);
  const experience = body.experience ? sanitizeString(body.experience, 50) : undefined;
  const gender = body.gender ? sanitizeString(body.gender, 30) : undefined;
  
  // Validate required fields
  if (!athleteType || athleteType.length < 2) {
    return { valid: false, error: "Athlete type is required and must be at least 2 characters" };
  }
  
  if (!trainingGoals || trainingGoals.length < 10) {
    return { valid: false, error: "Training goals are required and must be at least 10 characters" };
  }
  
  if (trainingGoals.length > MAX_STRING_LENGTH) {
    return { valid: false, error: `Training goals must be less than ${MAX_STRING_LENGTH} characters` };
  }
  
  // Validate age if provided
  let validatedAge: number | undefined;
  if (body.age !== undefined && body.age !== null) {
    const age = Number(body.age);
    if (isNaN(age) || age < 1 || age > 120) {
      return { valid: false, error: "Age must be a number between 1 and 120" };
    }
    validatedAge = Math.floor(age);
  }
  
  return {
    valid: true,
    data: {
      athleteType,
      trainingGoals,
      experience,
      age: validatedAge,
      gender,
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication - require valid user session
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await authSupabase.auth.getClaims(token);

    if (authError || !claimsData?.claims) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    const body = await req.json();
    
    // Validate and sanitize input
    const validation = validateInput(body);
    if (!validation.valid) {
      console.error('Validation error:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { athleteType, trainingGoals, experience, age, gender } = validation.data;
    
    console.log('Received validated recommendation request:', { athleteType, trainingGoals: trainingGoals.slice(0, 50), experience });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch available sports performance tests from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: tests, error: testsError } = await supabase
      .from('tests_master')
      .select(`
        id,
        test_name,
        category,
        description,
        biomarkers,
        clinical_significance,
        who_should_take
      `)
      .or('category.ilike.%sport%,category.ilike.%performance%,category.ilike.%fitness%,category.ilike.%vitamin%,category.ilike.%hormone%,category.ilike.%thyroid%,category.ilike.%heart%')
      .eq('is_active', true)
      .limit(30);

    if (testsError) {
      console.error('Error fetching tests:', testsError);
      throw testsError;
    }

    console.log(`Found ${tests?.length || 0} relevant tests`);

    // Build system prompt with test catalog
    const testCatalog = tests?.map(t => 
      `- ${t.test_name}: ${t.description} (Category: ${t.category})`
    ).join('\n') || '';

    const systemPrompt = `You are an expert sports performance nutritionist and health advisor specializing in blood test recommendations for athletes. Your role is to provide personalized, evidence-based test recommendations.

AVAILABLE TESTS:
${testCatalog}

CRITICAL GUIDELINES:
- Only recommend tests from the available test catalog above
- Provide 3-5 specific test recommendations ranked by priority
- Explain WHY each test is relevant for their specific athlete type and goals
- Focus on biomarkers that directly impact their sport and training goals
- Consider recovery, injury prevention, and performance optimization
- Be specific about what each test will reveal and how it helps their training

ATHLETE TYPES:
- Endurance: Marathon runners, cyclists, triathletes (focus: VO2 max, iron status, thyroid, inflammation)
- Strength: Powerlifters, bodybuilders, CrossFit (focus: testosterone, cortisol, vitamin D, muscle recovery)
- Team Sports: Football, rugby, basketball (focus: balanced approach, recovery markers, injury prevention)

RESPONSE FORMAT:
Structure your response as:
1. Brief personalized introduction (2-3 sentences)
2. Top Priority Tests (2-3 tests with detailed explanations)
3. Additional Recommended Tests (2-3 tests)
4. Training & Nutrition Insights (actionable advice based on their profile)

Keep explanations clear, scientific but accessible, and actionable.`;

    const userPrompt = `Athlete Profile:
- Type: ${athleteType}
- Training Goals: ${trainingGoals}
- Experience Level: ${experience || 'Not specified'}
${age ? `- Age: ${age}` : ''}
${gender ? `- Gender: ${gender}` : ''}

Based on this athlete's profile, recommend the most relevant blood tests to optimize their performance, recovery, and health. Focus on tests that will provide actionable insights for their specific sport and goals.`;

    console.log('Calling Lovable AI for recommendations...');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "AI service temporarily unavailable. Please contact support." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    console.log('Streaming AI response back to client');

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (e) {
    console.error('Sports test recommendation error:', e);
    return new Response(JSON.stringify({ 
      error: e instanceof Error ? e.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
