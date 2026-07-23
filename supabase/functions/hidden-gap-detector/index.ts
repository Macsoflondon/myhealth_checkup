import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

const RATE_LIMIT_MAX = 5; // per IP per window
const RATE_LIMIT_WINDOW_MIN = 10;

const HEALTH_CATEGORIES = [
  'Heart Health',
  'Metabolic Health',
  'Cancer Screening',
  'Hormonal Health',
  'Thyroid Health',
  'Nutritional Deficiencies',
  'Liver & Kidney Health',
  'Bone Health',
  'Sexual Health',
  'Mental Wellbeing Markers',
  'Immune Health',
  'Diabetes Risk',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Per-IP rate limit to prevent abuse of the paid OpenAI endpoint
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('cf-connecting-ip') ??
      'unknown';
    const windowStart = new Date(
      Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000
    ).toISOString();
    const { count: recentCount } = await supabase
      .from('api_rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('client_key', ip)
      .eq('endpoint', 'hidden-gap-detector')
      .gte('window_start', windowStart);
    if ((recentCount ?? 0) >= RATE_LIMIT_MAX) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again shortly.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    await supabase.from('api_rate_limits').insert({
      client_key: ip,
      endpoint: 'hidden-gap-detector',
      window_start: new Date().toISOString(),
      request_count: 1,
    });

    const body = await req.json();
    const { age, gender, lifestyle, lastCheckupYears, existingConditions } = body;

    // Derive user id ONLY from a verified JWT; never trust a client-supplied id.
    let verifiedUserId: string | null = null;
    const authHeader = req.headers.get('Authorization') ?? '';
    if (authHeader.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.slice(7).trim();
      if (token) {
        try {
          const { data: userData, error: userErr } = await supabase.auth.getUser(token);
          if (!userErr && userData?.user?.id) {
            verifiedUserId = userData.user.id;
          }
        } catch (e) {
          console.warn('hidden-gap-detector: failed to verify JWT', e);
        }
      }
    }

    if (!age || typeof age !== 'number' || age < 18 || age > 120) {
      return new Response(
        JSON.stringify({ error: 'A valid age (18–120) is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!gender || !['male', 'female', 'other'].includes(gender)) {
      return new Response(
        JSON.stringify({ error: 'A valid gender is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch available tests from trusted providers
    const { data: availableTests, error: testsError } = await supabase
      .from('provider_tests')
      .select('test_name, provider_id, price, category, description, is_active')
      .eq('is_active', true)
      .in('provider_id', ['medichecks', 'lola-health', 'goodbody-clinic']);

    if (testsError) {
      console.error('Error fetching tests:', testsError);
      throw new Error('Unable to fetch available tests');
    }

    const testsByCategory = (availableTests ?? []).reduce<Record<string, Array<{ name: string; provider: string; price: number | null }>>>((acc, test: any) => {
      const cat = test.category ?? 'General';
      if (!acc[cat]) acc[cat] = [];
      const providerNames: Record<string, string> = {
        'medichecks': 'Medichecks',
        'lola-health': 'Lola Health',
        'goodbody-clinic': 'GoodBody Clinic',
      };
      acc[cat].push({
        name: test.test_name,
        provider: providerNames[test.provider_id] ?? test.provider_id,
        price: test.price,
      });
      return acc;
    }, {});

    const availableTestsForPrompt = (availableTests ?? [])
      .slice(0, 80)
      .map((t: any) => {
        const providerNames: Record<string, string> = {
          'medichecks': 'Medichecks',
          'lola-health': 'Lola Health',
          'goodbody-clinic': 'GoodBody Clinic',
        };
        return `- ${t.test_name} (${providerNames[t.provider_id] ?? t.provider_id}, £${t.price ?? 'TBC'}, category: ${t.category ?? 'General'})`;
      })
      .join('\n');

    const sanitizedConditions = (existingConditions ?? '')
      .toString()
      .replace(/[<>]/g, '')
      .substring(0, 200);

    const prompt = `You are a UK preventive health screening advisor. Analyse the following patient profile and identify which of these health categories represent GAPS in their preventive health screening. Base your analysis on NHS and NICE preventive screening guidelines for the UK.

PATIENT PROFILE:
- Age: ${age}
- Gender: ${gender}
- Lifestyle: ${lifestyle ?? 'not specified'}
- Years since last full health check: ${lastCheckupYears ?? 'unknown'}
- Existing conditions or known concerns: ${sanitizedConditions || 'none specified'}

HEALTH CATEGORIES TO ASSESS: ${HEALTH_CATEGORIES.join(', ')}

AVAILABLE TESTS FROM OUR PROVIDERS (use ONLY these — do not invent tests):
${availableTestsForPrompt}

For each health category, determine:
1. Whether it is a gap (unchecked), partial (some coverage but gaps exist), or likely covered based on age/gender norms
2. The urgency of addressing this gap
3. Which specific available tests from our providers would address it

Return ONLY valid JSON in this exact structure:

{
  "medicalDisclaimer": "This analysis is for general wellness information only and does not constitute medical advice. Please consult your GP or healthcare professional for personalised medical guidance.",
  "overallSummary": "Brief 2–3 sentence overview of this person's preventive health coverage picture",
  "coverageScore": <integer 0–100 representing estimated percentage of key screenings covered>,
  "gaps": [
    {
      "category": "<one of the 12 categories>",
      "status": "unchecked" | "partial" | "likely-covered",
      "urgency": "low" | "medium" | "high",
      "explanation": "<1–2 sentence explanation of why this is a gap for this profile>",
      "recommendedTests": [
        {
          "testName": "<exact test name from available tests list>",
          "provider": "<provider name>",
          "price": <number or null>,
          "reason": "<brief reason this test addresses the gap>"
        }
      ]
    }
  ],
  "topPriority": "<name of the single most important category to address first>",
  "generalAdvice": "<2–3 sentences of general preventive health advice for this profile>"
}

Rules:
- Only include tests that appear in the available tests list above
- Prioritise gaps with "unchecked" status and "high" urgency first
- Be age and gender appropriate (e.g. cervical screening for females 25–64, PSA for males 50+)
- Do not diagnose — focus on preventive screening gaps
- Include all 12 categories in your response
- coverageScore should reflect how well-screened this profile likely is`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: `Analyse preventive health gaps for a ${age}-year-old ${gender} with ${lifestyle ?? 'unspecified'} lifestyle.` },
        ],
        max_tokens: 2000,
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;

    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response');
    }

    // Validate and sanitise the disclaimer
    if (!result.medicalDisclaimer?.includes('not') && !result.medicalDisclaimer?.includes('advice')) {
      result.medicalDisclaimer = "This analysis is for general wellness information only and does not constitute medical advice. Please consult your GP or healthcare professional for personalised medical guidance.";
    }

    // Clamp coverage score
    if (typeof result.coverageScore === 'number') {
      result.coverageScore = Math.max(0, Math.min(100, result.coverageScore));
    } else {
      result.coverageScore = 0;
    }

    // Enrich with actual prices from DB where possible
    if (Array.isArray(result.gaps)) {
      result.gaps = result.gaps.map((gap: any) => ({
        ...gap,
        recommendedTests: (gap.recommendedTests ?? []).map((rec: any) => {
          const dbTest = (availableTests ?? []).find((t: any) =>
            t.test_name?.toLowerCase().includes(rec.testName?.toLowerCase()?.substring(0, 20))
          ) as any;
          return {
            ...rec,
            price: dbTest?.price ?? rec.price ?? null,
          };
        }),
      }));
    }

    // Store result if user is authenticated (GDPR: auto-deleted after 90 days via cleanup policy)
    if (userId) {
      try {
        await supabase.from('health_queries').insert({
          user_id: userId,
          query_text: `Hidden Gap Detector — age:${age} gender:${gender} lifestyle:${lifestyle ?? 'unknown'}`,
          age,
          gender,
          ai_response: result,
        });
      } catch (storageError) {
        console.error('Failed to store gap analysis:', storageError);
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in hidden-gap-detector:', error);
    return new Response(
      JSON.stringify({
        error: 'Unable to run gap analysis at this time. Please try again.',
        medicalDisclaimer: "This analysis is for general wellness information only and does not constitute medical advice. Please consult your GP or healthcare professional for personalised medical guidance.",
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
