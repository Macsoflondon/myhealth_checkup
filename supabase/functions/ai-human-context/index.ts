import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2.51.0";
import { generateText } from "npm:ai";
import { z } from "npm:zod";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
type SupabaseClient = ReturnType<typeof createClient<Database>>;

interface Database {
  public: {
    Tables: {
      api_rate_limits: {
        Row: { id: string; endpoint: string; client_key: string; request_count: number; window_start: string; created_at: string | null };
        Insert: { id?: string; endpoint: string; client_key: string; request_count?: number; window_start: string; created_at?: string | null };
        Update: { id?: string; endpoint?: string; client_key?: string; request_count?: number; window_start?: string; created_at?: string | null };
      };
      ai_operation_logs: {
        Row: { id: string; job_type: string; user_id: string | null; latency_ms: number | null; success: boolean | null; error_type: string | null; error_message: string | null; model: string | null; metadata: Json | null };
        Insert: { id?: string; job_type: string; user_id?: string | null; latency_ms?: number | null; success?: boolean | null; error_type?: string | null; error_message?: string | null; model?: string | null; metadata?: Json | null };
        Update: { id?: string; job_type?: string; user_id?: string | null; latency_ms?: number | null; success?: boolean | null; error_type?: string | null; error_message?: string | null; model?: string | null; metadata?: Json | null };
      };
      health_queries: {
        Row: { id: string; user_id: string; query_text: string; age: number | null; gender: string | null; ai_response: Json | null };
        Insert: { id?: string; user_id: string; query_text: string; age?: number | null; gender?: string | null; ai_response?: Json | null };
        Update: { id?: string; user_id?: string; query_text?: string; age?: number | null; gender?: string | null; ai_response?: Json | null };
      };
      provider_tests: {
        Row: ProviderTestRow;
        Insert: Record<string, never>;
        Update: Record<string, never>;
      };
    };
  };
}

type Gender = "male" | "female" | "other";
type MethodPreference = "home" | "clinic" | "either";
type Urgency = "low" | "medium" | "high";

interface AiHumanContextRequest {
  query_text: string;
  gender?: Gender | null;
  age?: number | null;
  method_preference?: MethodPreference | null;
}

interface CandidateTest {
  id: string;
  testName: string;
  provider: string;
  providerId: string;
  price: number | null;
  category: string;
  description: string;
  biomarkerCount: number;
  sampleType: string;
  homeKitAvailable: boolean;
  clinicVisitAvailable: boolean;
  biomarkers: string[];
  url: string | null;
  score: number;
}

interface AnalysisResult {
  medicalDisclaimer: string;
  analysis: string;
  recommendedTests: Array<{
    testName: string;
    provider: string;
    providerId: string;
    price: number | null;
    reason: string;
    category: string;
    urgency: Urgency;
    confidence: number;
    actualTestId?: string;
  }>;
  generalGuidance: string;
  whenToSeeDoctor: string;
  hasRecommendations: boolean;
}

interface ProviderTestRow {
  id: string;
  test_name: string;
  provider_id: string;
  price: number | null;
  category: string | null;
  canonical_category: string | null;
  description: string | null;
  biomarker_count: number | null;
  sample_type: string | null;
  home_kit_available: boolean | null;
  clinic_visit_available: boolean | null;
  biomarkers_list: unknown;
  url: string | null;
  is_popular: boolean | null;
  popularity_rank: number | null;
}

const requestSchema = z.object({
  query_text: z.string().trim().min(3).max(1_000),
  gender: z.enum(["male", "female", "other"]).nullable().optional(),
  age: z.number().int().min(16).max(120).nullable().optional(),
  method_preference: z.enum(["home", "clinic", "either"]).nullable().optional(),
});

const aiResponseSchema = z.object({
  analysis: z.string().min(20).max(900),
  generalGuidance: z.string().min(20).max(700),
  whenToSeeDoctor: z.string().min(20).max(700),
  recommendedTests: z.array(z.object({
    actualTestId: z.string().optional(),
    testName: z.string().min(1),
    provider: z.string().min(1),
    providerId: z.string().min(1),
    price: z.number().nullable(),
    reason: z.string().min(20).max(500),
    category: z.string().min(1),
    urgency: z.enum(["low", "medium", "high"]),
    confidence: z.number().min(0).max(100),
  })).min(1).max(3),
});

const providerNames: Record<string, string> = {
  medichecks: "Medichecks",
  thriva: "Thriva",
  randox: "Randox Health",
  "lola-health": "Lola Health",
  "goodbody-clinic": "GOODBODY Clinic",
  "london-medical-laboratory": "London Medical Laboratory",
  "london-health-company": "London Health Company",
  clinilabs: "Clinilabs",
  "medical-diagnosis": "Medical Diagnosis",
  "blood-tests-london": "Blood Tests London",
};

const queryGroups: Array<{ keywords: string[]; boosts: string[] }> = [
  { keywords: ["fatigue", "tired", "energy", "hair", "weight", "cold"], boosts: ["thyroid", "iron", "ferritin", "vitamin", "b12", "folate", "wellness"] },
  { keywords: ["thyroid", "tsh", "t3", "t4"], boosts: ["thyroid", "tsh", "t3", "t4"] },
  { keywords: ["hormone", "menopause", "cycle", "period", "fertility", "testosterone"], boosts: ["hormone", "menopause", "fertility", "testosterone", "oestradiol", "amh"] },
  { keywords: ["heart", "cholesterol", "cardio", "blood pressure"], boosts: ["heart", "cholesterol", "lipid", "cardio", "hba1c"] },
  { keywords: ["gut", "digest", "bowel", "stomach"], boosts: ["gut", "digest", "microbiome", "stool"] },
  { keywords: ["cancer", "screening", "prostate", "psa", "tumour", "tumor"], boosts: ["psa", "prostate", "tumour", "tumor", "cancer", "cea", "ca-125", "afp"] },
  { keywords: ["fitness", "sport", "performance", "training"], boosts: ["sport", "performance", "fitness", "testosterone", "cortisol"] },
  { keywords: ["general", "wellness", "prevent", "check", "overall"], boosts: ["general", "wellness", "advanced", "ultimate", "comprehensive"] },
];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function cleanText(value: string): string {
  return value.replace(/[\x00-\x1F\x7F]/g, " ").replace(/\s+/g, " ").trim();
}

function readBiomarkers(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => typeof item === "string" ? cleanText(item) : "")
    .filter(Boolean)
    .slice(0, 20);
}

function clampConfidence(value: number): number {
  return Math.max(55, Math.min(98, Math.round(value)));
}

function stripJsonFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

function scoreCandidate(row: ProviderTestRow, request: AiHumanContextRequest): CandidateTest {
  const biomarkers = readBiomarkers(row.biomarkers_list);
  const category = row.canonical_category || row.category || "general-health";
  const provider = providerNames[row.provider_id] || row.provider_id;
  const haystack = [
    row.test_name,
    row.provider_id,
    category,
    row.description || "",
    row.sample_type || "",
    biomarkers.join(" "),
  ].join(" ").toLowerCase();
  const query = request.query_text.toLowerCase();
  const tokens = query.split(/[^a-z0-9]+/).filter((token) => token.length > 2);

  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 9;
  }
  for (const group of queryGroups) {
    if (group.keywords.some((keyword) => query.includes(keyword))) {
      score += group.boosts.filter((boost) => haystack.includes(boost)).length * 12;
    }
  }
  if (row.is_popular) score += 8;
  if (row.popularity_rank) score += Math.max(0, 7 - row.popularity_rank);
  score += Math.min(row.biomarker_count || 0, 60) / 6;
  if (request.method_preference === "home" && row.home_kit_available) score += 10;
  if (request.method_preference === "clinic" && row.clinic_visit_available) score += 10;
  if (request.gender === "male" && /female|women|ovarian|menopause|amh|pregnancy/.test(haystack)) score -= 25;
  if (request.gender === "female" && /male|men's|prostate|psa|testosterone/.test(haystack)) score -= 18;
  if (row.price != null && row.price <= 100) score += 3;

  return {
    id: row.id,
    testName: row.test_name,
    provider,
    providerId: row.provider_id,
    price: row.price,
    category,
    description: row.description || "",
    biomarkerCount: row.biomarker_count || 0,
    sampleType: row.sample_type || "Blood sample",
    homeKitAvailable: row.home_kit_available === true,
    clinicVisitAvailable: row.clinic_visit_available === true,
    biomarkers,
    url: row.url,
    score,
  };
}

function fallbackResult(request: AiHumanContextRequest, candidates: CandidateTest[]): AnalysisResult {
  const selected = candidates.slice(0, 3);
  return {
    medicalDisclaimer: "This information is for educational purposes only and is not medical advice. myhealth checkup does not provide medical care, diagnosis, or treatment. Always discuss symptoms or test results with your GP or another qualified healthcare professional.",
    analysis: "Based on your stated wellness interests, these tests appear most relevant for comparing private diagnostic options. The suggestions prioritise matching biomarkers, sample method preference, transparent pricing and provider availability.",
    generalGuidance: "Use these recommendations as a comparison starting point. Check each provider page for the full biomarker list, sample requirements, typical turnaround and any separate phlebotomy or clinical review costs before booking.",
    whenToSeeDoctor: "Speak to your GP or a qualified healthcare professional if symptoms are persistent, worsening, unexplained, or affecting daily life. Seek urgent medical help for severe, sudden, or concerning symptoms.",
    hasRecommendations: selected.length > 0,
    recommendedTests: selected.map((test, index) => ({
      testName: test.testName,
      provider: test.provider,
      providerId: test.providerId,
      price: test.price,
      reason: `${test.testName} matches the themes in your query and includes ${test.biomarkerCount || "multiple"} listed biomarker${test.biomarkerCount === 1 ? "" : "s"} for comparison.`,
      category: test.category,
      urgency: index === 0 ? "medium" : "low",
      confidence: clampConfidence(86 - index * 7 + Math.min(test.score, 20) / 2),
      actualTestId: test.id,
    })),
  };
}

async function getOptionalUserId(supabaseUrl: string, supabaseAnonKey: string, req: Request): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

async function checkRateLimit(supabase: SupabaseClient, clientKey: string): Promise<boolean> {
  const endpoint = "ai-human-context";
  const windowStart = new Date(Date.now() - 60_000).toISOString();
  const { data, error } = await supabase
    .from("api_rate_limits")
    .select("id, request_count")
    .eq("endpoint", endpoint)
    .eq("client_key", clientKey)
    .gte("window_start", windowStart)
    .maybeSingle();

  if (error) return true;
  if (!data) {
    await supabase.from("api_rate_limits").insert({
      endpoint,
      client_key: clientKey,
      request_count: 1,
      window_start: new Date().toISOString(),
    });
    return true;
  }
  const row = data as { id: string; request_count: number };
  if (Number(row.request_count) >= 8) return false;
  await supabase
    .from("api_rate_limits")
    .update({ request_count: Number(row.request_count) + 1 })
    .eq("id", row.id);
  return true;
}

async function logOperation(
  supabase: SupabaseClient,
  details: { userId: string | null; latencyMs: number; success: boolean; errorType?: string; errorMessage?: string; model?: string; recommendationsCount?: number },
): Promise<void> {
  await supabase.from("ai_operation_logs").insert({
    job_type: "ai-human-context",
    user_id: details.userId,
    latency_ms: details.latencyMs,
    success: details.success,
    error_type: details.errorType || null,
    error_message: details.errorMessage || null,
    model: details.model || "google/gemini-3.5-flash",
    metadata: { recommendations_count: details.recommendationsCount || 0 },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const startedAt = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const lovableKey = Deno.env.get("LOVABLE_API_KEY") || "";

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    return jsonResponse({ error: "Recommendation service is not configured" }, 500);
  }
  if (!lovableKey) {
    return jsonResponse({ error: "AI recommendation service is not configured" }, 500);
  }

  const serviceClient = createClient<Database>(supabaseUrl, supabaseServiceKey);
  const userId = await getOptionalUserId(supabaseUrl, supabaseAnonKey, req);
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const clientKey = userId ? `user:${userId}` : `ip:${clientIp}`;

  try {
    const rawBody = await req.json();
    const parsed = requestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return jsonResponse({ error: "Please enter a short wellness goal or health interest before generating recommendations." }, 400);
    }
    const body = parsed.data;

    const allowed = await checkRateLimit(serviceClient, clientKey);
    if (!allowed) {
      return jsonResponse({ error: "Too many recommendation requests. Please wait a minute before trying again." }, 429);
    }

    const { data: rows, error: testsError } = await serviceClient
      .from("provider_tests")
      .select("id, test_name, provider_id, price, category, canonical_category, description, biomarker_count, sample_type, home_kit_available, clinic_visit_available, biomarkers_list, url, is_popular, popularity_rank")
      .eq("is_active", true)
      .not("price", "is", null)
      .order("is_popular", { ascending: false, nullsFirst: false })
      .order("price", { ascending: true })
      .limit(700);

    if (testsError) {
      throw new Error(`provider test lookup failed: ${testsError.message}`);
    }

    const candidates = ((rows || []) as ProviderTestRow[])
      .map((row) => scoreCandidate(row, body))
      .sort((a, b) => b.score - a.score || (a.price || 0) - (b.price || 0));

    if (candidates.length === 0) {
      return jsonResponse({
        medicalDisclaimer: "This information is for educational purposes only and is not medical advice. Please consult your GP or healthcare professional regarding any health concerns or symptoms.",
        analysis: "No matching active tests are available to compare at the moment.",
        recommendedTests: [],
        generalGuidance: "Please try a broader wellness goal or check back once provider data has refreshed.",
        whenToSeeDoctor: "Speak to your GP or a qualified healthcare professional if symptoms are persistent, worsening, unexplained, or affecting daily life.",
        hasRecommendations: false,
      });
    }

    const fallback = fallbackResult(body, candidates);
    let result = fallback;

    const gateway = createLovableAiGatewayProvider(lovableKey);
    const candidatesForAi = candidates.slice(0, 30).map((candidate) => ({
      actualTestId: candidate.id,
      testName: candidate.testName,
      provider: candidate.provider,
      providerId: candidate.providerId,
      price: candidate.price,
      category: candidate.category,
      biomarkerCount: candidate.biomarkerCount,
      sampleType: candidate.sampleType,
      homeKitAvailable: candidate.homeKitAvailable,
      clinicVisitAvailable: candidate.clinicVisitAvailable,
      biomarkers: candidate.biomarkers.slice(0, 12),
    }));

    const { text } = await generateText({
      model: gateway("google/gemini-3.5-flash"),
      system: `You are Lovable AI powering myhealth checkup's AI Wellness Recommendations. myhealth checkup is a UK private diagnostics comparison platform, not a medical provider. Use British English. Never diagnose, never claim a test confirms or rules out disease, and never imply NHS integration. Recommend only tests from the supplied candidate list.`,
      prompt: `User request:\n${JSON.stringify(body)}\n\nCandidate tests:\n${JSON.stringify(candidatesForAi)}\n\nReturn ONLY a valid JSON object matching this TypeScript shape, with no markdown or commentary:\n{\n  "analysis": string,\n  "generalGuidance": string,\n  "whenToSeeDoctor": string,\n  "recommendedTests": [\n    {\n      "actualTestId": string,\n      "testName": string,\n      "provider": string,\n      "providerId": string,\n      "price": number | null,\n      "reason": string,\n      "category": string,\n      "urgency": "low" | "medium" | "high",\n      "confidence": number\n    }\n  ]\n}\n\nRecommend 1 to 3 tests.`,
      temperature: 0.2,
    });

    const parsedAi = aiResponseSchema.safeParse(JSON.parse(stripJsonFences(text)));
    if (!parsedAi.success) {
      throw new Error("AI response did not match recommendation schema");
    }
    const object = parsedAi.data;

    const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
    const normalisedRecommendations = object.recommendedTests.map((recommendation, index) => {
      const candidate = recommendation.actualTestId ? candidateById.get(recommendation.actualTestId) : candidates[index];
      const safeCandidate = candidate || candidates[index] || candidates[0];
      return {
        testName: safeCandidate.testName,
        provider: safeCandidate.provider,
        providerId: safeCandidate.providerId,
        price: safeCandidate.price,
        reason: recommendation.reason,
        category: safeCandidate.category,
        urgency: recommendation.urgency,
        confidence: clampConfidence(recommendation.confidence),
        actualTestId: safeCandidate.id,
      };
    });

    result = {
      medicalDisclaimer: fallback.medicalDisclaimer,
      analysis: object.analysis,
      recommendedTests: normalisedRecommendations,
      generalGuidance: object.generalGuidance,
      whenToSeeDoctor: object.whenToSeeDoctor,
      hasRecommendations: normalisedRecommendations.length > 0,
    };

    if (userId) {
      await serviceClient.from("health_queries").insert({
        user_id: userId,
        query_text: cleanText(body.query_text),
        age: body.age || null,
        gender: body.gender || null,
        ai_response: result,
      });
    }

    await logOperation(serviceClient, {
      userId,
      latencyMs: Date.now() - startedAt,
      success: true,
      recommendationsCount: result.recommendedTests.length,
    });

    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown recommendation error";
    await logOperation(serviceClient, {
      userId,
      latencyMs: Date.now() - startedAt,
      success: false,
      errorType: "generation_error",
      errorMessage: message.slice(0, 500),
    });
    return jsonResponse({ error: "Unable to generate recommendations. Please try again." }, 500);
  }
});