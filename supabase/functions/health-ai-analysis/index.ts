import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use verified user ID from the authenticated token
    const verifiedUserId = user.id;

    const { query, age, gender } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Input validation to prevent prompt injection
    if (!query || typeof query !== 'string') {
      throw new Error('Query is required and must be a string');
    }

    // Limit query length to prevent abuse
    if (query.length > 500) {
      throw new Error('Query is too long. Please limit to 500 characters');
    }

    // Sanitize query - remove potentially harmful patterns
    const sanitizedQuery = query
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      .substring(0, 500); // Ensure max length

    // Check for suspicious prompt injection patterns
    const suspiciousPatterns = [
      /ignore\s+(previous|all|above)\s+instructions/i,
      /system\s*:/i,
      /\[INST\]/i,
      /<<SYS>>/i,
    ];

    const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
      pattern.test(sanitizedQuery)
    );

    if (hasSuspiciousContent) {
      throw new Error('Query contains invalid content. Please rephrase your question');
    }

    // Validate age and gender if provided
    if (age !== null && age !== undefined && (typeof age !== 'number' || age < 0 || age > 120)) {
      throw new Error('Invalid age value');
    }

    if (gender && typeof gender !== 'string') {
      throw new Error('Invalid gender value');
    }

    // Get all available tests from our trusted providers
    const { data: availableTests, error: testsError } = await supabase
      .from('provider_tests')
      .select(`
        test_name,
        provider_id,
        price,
        category,
        description,
        is_active
      `)
      .eq('is_active', true)
      .in('provider_id', ['medichecks', 'lola-health', 'goodbody-clinic']);

    if (testsError) {
      console.error('Error fetching tests:', testsError);
      throw new Error('Unable to fetch available tests');
    }

    // Group tests by provider for the AI prompt
    const testsByProvider = availableTests?.reduce((acc, test) => {
      if (!acc[test.provider_id]) {
        acc[test.provider_id] = [];
      }
      acc[test.provider_id].push({
        name: test.test_name,
        price: test.price,
        category: test.category
      });
      return acc;
    }, {}) || {};

    const providersInfo = {
      'medichecks': 'Medichecks',
      'lola-health': 'Lola Health', 
      'goodbody-clinic': 'GoodBody Clinic'
    };

    const testListForAI = Object.entries(testsByProvider)
      .map(([providerId, tests]) => 
        `${providersInfo[providerId]}: ${tests.map(t => `${t.name} (${t.category})`).join(', ')}`
      ).join('\n');

    const prompt = `You are a wellness information assistant for a UK private health testing company. 

CRITICAL MEDICAL DISCLAIMERS:
- You provide general wellness information only, NOT medical advice
- Users must consult healthcare professionals for medical concerns
- Never diagnose or suggest medical treatments
- Focus on preventive wellness and general health screening

Our trusted providers and available tests:
${testListForAI}

User query: "${sanitizedQuery}"

Provide general wellness guidance and suggest relevant preventive health tests from our trusted providers ONLY. 

Respond in this JSON format:

{
  "medicalDisclaimer": "This information is for educational purposes only and is not medical advice. Please consult your GP or healthcare professional regarding any health concerns or symptoms.",
  "analysis": "General wellness guidance related to their query",
  "recommendedTests": [
    {
      "testName": "Exact test name from our available tests",
      "provider": "Provider name (Medichecks, Lola Health, or GoodBody Clinic)",
      "providerId": "Provider ID from our system", 
      "reason": "General wellness reason for this test",
      "category": "Test category",
      "urgency": "low/medium/high",
      "confidence": 70-95
    }
  ],
  "generalGuidance": "General lifestyle and wellness advice",
  "whenToSeeDoctor": "Clear guidance on when to seek professional medical attention",
  "hasRecommendations": true/false
}

Guidelines:
- Only recommend tests we actually offer from our 3 trusted providers
- Keep urgency mostly "low" or "medium" for wellness screening
- Include confidence scores based on relevance
- Always emphasize consulting healthcare professionals
- Focus on preventive wellness, not diagnostic advice`;

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
          { role: 'user', content: sanitizedQuery }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;

    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
      
      // Enhance recommendations with actual database pricing
      if (analysisResult.recommendedTests) {
        analysisResult.recommendedTests = analysisResult.recommendedTests.map(rec => {
          const dbTest = availableTests?.find(t => 
            t.test_name.toLowerCase().includes(rec.testName.toLowerCase()) &&
            t.provider_id === rec.providerId
          );
          
          return {
            ...rec,
            price: dbTest?.price || null,
            actualTestId: dbTest?.id || null
          };
        });
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      analysisResult = {
        medicalDisclaimer: "This information is for educational purposes only and is not medical advice. Please consult your GP or healthcare professional regarding any health concerns or symptoms.",
        analysis: "I can help you find relevant wellness tests based on your query.",
        recommendedTests: [],
        generalGuidance: "Maintain a balanced diet, regular exercise, and adequate sleep for optimal wellness.",
        whenToSeeDoctor: "Consult your GP if you have persistent symptoms or health concerns.",
        hasRecommendations: false
      };
    }

    // Validate responses contain medical disclaimers
    if (!analysisResult.medicalDisclaimer || 
        !analysisResult.medicalDisclaimer.includes('not medical advice')) {
      console.error('AI response missing medical disclaimer');
      analysisResult.medicalDisclaimer = "This information is for educational purposes only and is not medical advice. Please consult your GP or healthcare professional regarding any health concerns or symptoms.";
    }

    // Store query in database if user is authenticated (GDPR compliant)
    // Note: Queries are automatically deleted after 90 days via cleanup_old_health_queries()
    // Using verified user ID from JWT token for security
    try {
      const { error: dbError } = await supabase
        .from('health_queries')
        .insert({
          user_id: verifiedUserId,
          query_text: sanitizedQuery,
          age: age || null,
          gender: gender || null,
          ai_response: analysisResult
        });
      
      if (dbError) {
        console.error('Error storing health query:', dbError);
        // Don't fail the request if storage fails
      }
    } catch (storageError) {
      console.error('Failed to store health query:', storageError);
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in health-ai-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: (error instanceof Error ? error.message : String(error)),
      medicalDisclaimer: "This information is for educational purposes only and is not medical advice. Please consult your GP or healthcare professional regarding any health concerns or symptoms.",
      analysis: "Sorry, I'm unable to analyze your query at the moment. Please try again.",
      recommendedTests: [],
      generalGuidance: "Please consult your healthcare professional for personalized health advice.",
      whenToSeeDoctor: "Seek immediate medical attention for urgent symptoms or persistent health concerns.",
      hasRecommendations: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});