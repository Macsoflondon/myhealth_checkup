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
    const { query } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get all available tests from our database
    const { data: availableTests, error: testsError } = await supabase
      .from('test_comparisons')
      .select('*');

    if (testsError) {
      console.error('Error fetching tests:', testsError);
    }

    // Create a comprehensive list of our available tests
    const testCategories = {
      bloodTests: ["Full Blood Count", "Basic Metabolic Panel", "Lipid Profile", "Liver Function", "Kidney Function"],
      hormones: ["Thyroid Function (TSH, T3, T4)", "Testosterone", "Estrogen", "Cortisol", "Insulin"],
      vitamins: ["Vitamin D", "Vitamin B12", "Folate", "Iron Studies", "Vitamin Profile"],
      cancerScreening: ["PSA (Prostate)", "CA-125 (Ovarian)", "CEA (Colorectal)", "AFP (Liver)"],
      diabetes: ["HbA1c", "Fasting Glucose", "Oral Glucose Tolerance Test", "C-Peptide"],
      gutHealth: ["Calprotectin", "H. Pylori", "SIBO Breath Test", "Food Intolerance Panel"]
    };

    const allTests = Object.values(testCategories).flat().join(', ');

    const prompt = `You are a health test recommendation assistant for a UK private health testing company. 

Our available tests include: ${allTests}

User query: "${query}"

Please analyze the user's health concern and respond in the following JSON format:

{
  "analysis": "Brief analysis of their health concern",
  "recommendedTests": [
    {
      "testName": "Test name from our available tests",
      "reason": "Why this test is relevant",
      "category": "Category of the test"
    }
  ],
  "alternativeProviders": [
    {
      "testName": "Test we don't offer",
      "suggestedProvider": "UK provider name",
      "disclaimer": "We have no affiliation with this provider and take no responsibility for their services"
    }
  ],
  "hasRecommendations": true/false
}

If we offer relevant tests, include them in recommendedTests. If we don't offer what they need, suggest UK alternative providers in alternativeProviders. Always include the disclaimer for alternative providers.`;

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
          { role: 'user', content: query }
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
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      analysisResult = {
        analysis: "I can help you find relevant health tests based on your query.",
        recommendedTests: [],
        alternativeProviders: [],
        hasRecommendations: false
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in health-ai-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: "Sorry, I'm unable to analyze your query at the moment. Please try again.",
      recommendedTests: [],
      alternativeProviders: [],
      hasRecommendations: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});