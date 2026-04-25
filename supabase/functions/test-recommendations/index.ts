import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

// Input validation schema
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

// Validation limits
const MAX_TESTS = 50;
const MAX_STRING_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 2000;

function sanitizeString(str: string, maxLength: number): string {
  if (typeof str !== 'string') return '';
  // Remove potential prompt injection patterns and limit length
  return str.slice(0, maxLength).replace(/[\x00-\x1F\x7F]/g, '');
}

function validateTest(test: unknown): test is Test {
  if (!test || typeof test !== 'object') return false;
  const t = test as Record<string, unknown>;
  
  return (
    typeof t.id === 'string' && t.id.length <= 100 &&
    typeof t.name === 'string' && t.name.length <= MAX_STRING_LENGTH &&
    typeof t.provider === 'string' && t.provider.length <= 100 &&
    typeof t.price === 'number' && t.price >= 0 && t.price <= 10000 &&
    typeof t.category === 'string' && t.category.length <= 100 &&
    (t.description === undefined || (typeof t.description === 'string' && t.description.length <= MAX_DESCRIPTION_LENGTH)) &&
    (t.features === undefined || typeof t.features === 'object')
  );
}

function validatePreferences(prefs: unknown): prefs is Preferences {
  if (!prefs || typeof prefs !== 'object') return false;
  const p = prefs as Record<string, unknown>;
  
  return (
    typeof p.price === 'number' && p.price >= 1 && p.price <= 5 &&
    typeof p.speed === 'number' && p.speed >= 1 && p.speed <= 5 &&
    typeof p.comprehensiveness === 'number' && p.comprehensiveness >= 1 && p.comprehensiveness <= 5
  );
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
    const body = await req.json();
    const { tests, preferences } = body as { tests: unknown[], preferences: unknown };

    // Validate input structure
    if (!Array.isArray(tests)) {
      return new Response(
        JSON.stringify({ error: "Tests must be an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (tests.length === 0) {
      return new Response(
        JSON.stringify({ error: "No tests provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (tests.length > MAX_TESTS) {
      return new Response(
        JSON.stringify({ error: `Maximum ${MAX_TESTS} tests allowed` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate each test
    const validatedTests: Test[] = [];
    for (const test of tests) {
      if (!validateTest(test)) {
        console.error('Invalid test format:', JSON.stringify(test).slice(0, 200));
        return new Response(
          JSON.stringify({ error: "Invalid test format in request" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      validatedTests.push(test);
    }

    // Validate preferences
    if (!validatePreferences(preferences)) {
      return new Response(
        JSON.stringify({ error: "Invalid preferences format. Price, speed, and comprehensiveness must be numbers between 1-5" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build a detailed prompt for the AI with sanitized inputs
    const testsDescription = validatedTests.map((test, idx) => `
Test ${idx + 1}: ${sanitizeString(test.name, 200)}
- Provider: ${sanitizeString(test.provider, 100)}
- Price: £${test.price}
- Turnaround Time: ${sanitizeString(test.features?.turnaround || 'Unknown', 50)}
- Sample Collection: ${sanitizeString(test.features?.collection || 'Unknown', 50)}
- Key Biomarkers: ${sanitizeString(test.features?.bioMarkers || 'Multiple biomarkers', 200)}
- Description: ${sanitizeString(test.description || 'Comprehensive health screening', 300)}
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

    console.log(`Processing recommendation request with ${validatedTests.length} tests`);

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
    const scoredTests = validatedTests.map(test => {
      const priceScore = preferences.price * (1 - (test.price / Math.max(...validatedTests.map(t => t.price))));
      
      const turnaroundDays = parseTurnaroundDays(test.features?.turnaround || '');
      const speedScore = preferences.speed * (1 - (turnaroundDays / Math.max(...validatedTests.map(t => parseTurnaroundDays(t.features?.turnaround || '')))));
      
      const biomarkerCount = test.features?.bioMarkers?.split(',').length || 5;
      const comprehensivenessScore = preferences.comprehensiveness * (biomarkerCount / Math.max(...validatedTests.map(t => (t.features?.bioMarkers?.split(',').length || 5))));
      
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
        error: error instanceof Error ? (error instanceof Error ? error.message : String(error)) : "Unknown error" 
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
