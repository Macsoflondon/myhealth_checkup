import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory rate limiter: 5 requests per IP per 60 seconds
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting by IP
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a minute before trying again." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { who, gender, ageRange, goal, concerns, symptoms, sampleMethod, budget, speed } =
      await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch active provider tests with relevant fields
    const { data: tests, error: dbError } = await supabase
      .from("provider_tests")
      .select(
        "id, test_name, provider_id, price, category, description, biomarker_count, sample_type, home_kit_available, clinic_visit_available, biomarkers_list, who_should_test, url"
      )
      .eq("is_active", true)
      .not("price", "is", null)
      .order("price", { ascending: true })
      .limit(500);

    if (dbError) {
      console.error("DB error:", dbError);
      return new Response(JSON.stringify({ error: "Failed to fetch tests" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pre-filter by budget
    let filtered = tests || [];
    if (budget && budget !== "no-preference") {
      const budgetMap: Record<string, number> = {
        "under-50": 50,
        "50-100": 100,
        "100-200": 200,
        "200-500": 500,
      };
      const max = budgetMap[budget];
      if (max) {
        const budgetFiltered = filtered.filter((t: any) => t.price && t.price <= max);
        // Only apply if there are enough results
        if (budgetFiltered.length >= 5) {
          filtered = budgetFiltered;
        }
      }
    }

    // Pre-filter by sample method
    if (sampleMethod === "home-kit") {
      const homeFiltered = filtered.filter((t: any) => t.home_kit_available);
      if (homeFiltered.length >= 5) filtered = homeFiltered;
    } else if (sampleMethod === "clinic-visit") {
      const clinicFiltered = filtered.filter((t: any) => t.clinic_visit_available);
      if (clinicFiltered.length >= 5) filtered = clinicFiltered;
    }

    // Limit to top 80 tests for AI context (sorted by relevance signals)
    const testsForAI = filtered.slice(0, 80).map((t: any) => ({
      id: t.id,
      name: t.test_name,
      provider: t.provider_id,
      price: t.price,
      category: t.category,
      biomarkers: t.biomarker_count || 0,
      sampleType: t.sample_type,
      homeKit: t.home_kit_available,
      clinicVisit: t.clinic_visit_available,
      description: t.description?.slice(0, 200),
      url: t.url,
    }));

    const userProfile = {
      who,
      gender,
      ageRange,
      goal,
      concerns: concerns || [],
      symptoms: symptoms || [],
      sampleMethod,
      budget,
      speed,
    };

    const systemPrompt = `You are a UK health screening adviser for myhealth checkup, a comparison platform for private diagnostic services. You are NOT a doctor and must NEVER provide a medical diagnosis.

Your task: Given a user's health profile and a list of available health tests from UK providers, recommend the 3 most clinically relevant tests.

RULES:
1. Rank by clinical relevance to the user's specific concerns, symptoms, age, and gender
2. Weight symptom combinations (e.g. fatigue + hair loss + weight gain strongly suggests thyroid testing)
3. For general health checks, prefer comprehensive panels with high biomarker counts
4. Respect budget preferences but note when a slightly higher-priced test offers significantly better coverage
5. Never claim a test can diagnose or treat a condition
6. Always recommend consulting a GP for concerning symptoms
7. Consider age-appropriate screening (e.g. PSA for men 50+, comprehensive panels for 40+)
8. For "preventive screening" goals, prioritise broad panels covering cardiovascular, metabolic, and nutritional markers

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "recommendations": [
    {
      "testId": "uuid",
      "testName": "string",
      "provider": "string",
      "price": number,
      "biomarkers": number,
      "url": "string or null",
      "badge": "Best Match" | "Best Value" | "Most Comprehensive",
      "reasons": ["reason1 tied to user answers", "reason2", "reason3"],
      "caveat": "optional note e.g. 'Requires clinic visit' or 'Higher cost but covers 3x more markers'"
    }
  ],
  "disclaimer": "A brief personalised disclaimer based on their symptoms, always ending with 'Consult your GP for personalised medical advice.'"
}

The first recommendation MUST have badge "Best Match". Assign "Best Value" and "Most Comprehensive" to the other two as appropriate.`;

    const userMessage = `USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

AVAILABLE TESTS (${testsForAI.length} tests):
${JSON.stringify(testsForAI, null, 2)}

Based on this profile, recommend the 3 best tests. Return ONLY the JSON object.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Our recommendation service is busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Recommendation service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "Failed to generate recommendations" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "No recommendations generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse JSON from AI response (handle markdown code blocks)
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse recommendations" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("quiz-recommendations error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
