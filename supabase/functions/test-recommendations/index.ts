import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Test {
  id: string;
  name: string;
  provider: string;
  price: number;
  category: string;
  description: string;
  features: {
    turnaround: string;
    collection: string;
    bioMarkers?: string;
  };
}

interface Preferences {
  price: number; // 1-5 weight
  speed: number; // 1-5 weight
  comprehensiveness: number; // 1-5 weight
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tests, preferences } = await req.json() as { tests: Test[], preferences: Preferences };

    if (!tests || tests.length === 0) {
      return new Response(
        JSON.stringify({ error: "No tests provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build a detailed prompt for the AI
    const testsDescription = tests.map((test, idx) => `
Test ${idx + 1}: ${test.name}
- Provider: ${test.provider}
- Price: £${test.price}
- Turnaround Time: ${test.features.turnaround}
- Sample Collection: ${test.features.collection}
- Key Biomarkers: ${test.features.bioMarkers || 'Multiple biomarkers'}
- Description: ${test.description || 'Comprehensive health screening'}
`).join('\n');

    const preferencesDescription = `
User Preferences (1-5 scale, 5 = highest priority):
- Price Importance: ${preferences.price}/5
- Speed Importance: ${preferences.speed}/5
- Comprehensiveness Importance: ${preferences.comprehensiveness}/5
`;

    const systemPrompt = `You are a health testing advisor helping users choose the best blood test from their comparison list. 
Analyze the tests based on the user's stated preferences and provide a clear, evidence-based recommendation.

Guidelines:
- Consider price sensitivity: lower prices score higher when price is important
- Consider speed: faster turnaround times score higher when speed is important
- Consider comprehensiveness: more biomarkers and detailed testing score higher when comprehensiveness is important
- Provide a balanced recommendation weighing all factors
- Be honest about trade-offs
- Keep response concise (200 words max)
- Structure your response with: Recommended Test, Key Reasons (3-4 bullet points), Trade-offs (if any)`;

    const userPrompt = `Based on these tests and user preferences, which test should they choose?

${testsDescription}

${preferencesDescription}

Provide a clear recommendation with reasoning.`;

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
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const recommendation = data.choices?.[0]?.message?.content || "Unable to generate recommendation";

    // Calculate simple scores for each test based on preferences
    const scoredTests = tests.map(test => {
      const priceScore = preferences.price * (1 - (test.price / Math.max(...tests.map(t => t.price))));
      
      const turnaroundDays = parseTurnaroundDays(test.features.turnaround);
      const speedScore = preferences.speed * (1 - (turnaroundDays / Math.max(...tests.map(t => parseTurnaroundDays(t.features.turnaround)))));
      
      const biomarkerCount = test.features.bioMarkers?.split(',').length || 5;
      const comprehensivenessScore = preferences.comprehensiveness * (biomarkerCount / Math.max(...tests.map(t => (t.features.bioMarkers?.split(',').length || 5))));
      
      const totalScore = priceScore + speedScore + comprehensivenessScore;
      
      return {
        testId: test.id,
        testName: test.name,
        score: totalScore
      };
    });

    // Sort by score
    scoredTests.sort((a, b) => b.score - a.score);
    const topRecommendation = scoredTests[0];

    return new Response(
      JSON.stringify({
        recommendation,
        topChoice: topRecommendation,
        allScores: scoredTests
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("test-recommendations error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function parseTurnaroundDays(turnaround: string): number {
  const lower = turnaround.toLowerCase();
  if (lower.includes('same day') || lower.includes('24h')) return 1;
  if (lower.includes('48') || lower.includes('2 day')) return 2;
  if (lower.includes('3') || lower.includes('5 day')) return 5;
  if (lower.includes('week') || lower.includes('7 day')) return 7;
  return 14;
}
