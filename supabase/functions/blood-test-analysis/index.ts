import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BiomarkerReading {
  biomarkerName: string;
  value: number;
  unit: string;
}

interface AnalysisRequest {
  readings: BiomarkerReading[];
  gender?: "male" | "female";
  age?: number;
}

interface BiomarkerInfo {
  biomarker_name: string;
  biomarker_code: string;
  description: string;
  category: string;
  unit_of_measurement: string | null;
  normal_range_male: string | null;
  normal_range_female: string | null;
  clinical_significance: string | null;
  interpretation_guide: any;
  lifestyle_factors: string[] | null;
  related_conditions: string[] | null;
}

interface HistoricalReading {
  value: number;
  recorded_at: string;
  unit: string | null;
  status: string | null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request
    const { readings, gender, age }: AnalysisRequest = await req.json();

    if (!readings || !Array.isArray(readings) || readings.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one biomarker reading is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs
    const sanitizedReadings = readings.slice(0, 50).map(r => ({
      biomarkerName: String(r.biomarkerName).substring(0, 100).trim(),
      value: Number(r.value),
      unit: String(r.unit || "").substring(0, 20).trim()
    }));

    // Fetch biomarker definitions from library
    const biomarkerNames = sanitizedReadings.map(r => r.biomarkerName.toLowerCase());
    const { data: biomarkerLibrary } = await supabase
      .from("biomarkers_library")
      .select("*")
      .or(biomarkerNames.map(n => `biomarker_name.ilike.%${n}%`).join(","));

    // Create lookup map
    const biomarkerInfoMap: Record<string, BiomarkerInfo> = {};
    if (biomarkerLibrary) {
      for (const bio of biomarkerLibrary) {
        biomarkerInfoMap[bio.biomarker_name.toLowerCase()] = bio;
      }
    }

    // Fetch historical readings for this user
    const { data: historicalData } = await supabase
      .from("biomarker_readings")
      .select("biomarker_name, value, recorded_at, unit, status")
      .eq("user_id", user.id)
      .in("biomarker_name", sanitizedReadings.map(r => r.biomarkerName))
      .order("recorded_at", { ascending: false })
      .limit(100);

    // Group historical data by biomarker
    const historyMap: Record<string, HistoricalReading[]> = {};
    if (historicalData) {
      for (const reading of historicalData) {
        const key = reading.biomarker_name.toLowerCase();
        if (!historyMap[key]) historyMap[key] = [];
        historyMap[key].push({
          value: reading.value,
          recorded_at: reading.recorded_at,
          unit: reading.unit,
          status: reading.status
        });
      }
    }

    // Build context for AI
    const readingsContext = sanitizedReadings.map(reading => {
      const info = biomarkerInfoMap[reading.biomarkerName.toLowerCase()];
      const history = historyMap[reading.biomarkerName.toLowerCase()] || [];
      
      return {
        name: reading.biomarkerName,
        currentValue: reading.value,
        unit: reading.unit || info?.unit_of_measurement || "",
        referenceRange: gender === "female" 
          ? info?.normal_range_female || info?.normal_range_male || "Not available"
          : info?.normal_range_male || "Not available",
        description: info?.description || "No description available",
        clinicalSignificance: info?.clinical_significance || "",
        category: info?.category || "General",
        lifestyleFactors: info?.lifestyle_factors || [],
        relatedConditions: info?.related_conditions || [],
        previousReadings: history.slice(0, 5).map(h => ({
          value: h.value,
          date: h.recorded_at
        }))
      };
    });

    // Build AI prompt
    const systemPrompt = `You are a health analysis assistant for myhealth checkup, a UK-based health test comparison platform. 
You provide preliminary analysis of blood test results to help users understand their results.

CRITICAL RULES:
1. You are NOT a doctor. Always include medical disclaimers.
2. Never diagnose conditions - only explain what readings might indicate.
3. Use British English spelling (e.g., "colour", "analyse", "favour").
4. Reference NHS guidelines where appropriate.
5. Recommend seeing a GP for any concerning results.
6. Be supportive and educational, not alarming.
7. Always note that reference ranges can vary between laboratories.

When analysing results:
- Explain what each biomarker measures in plain English
- Indicate if values appear within, above, or below typical reference ranges
- Note any trends if historical data is available
- Provide general lifestyle recommendations
- Highlight when professional medical advice is recommended`;

    const userPrompt = `Please analyse the following blood test results for a ${age ? age + " year old" : ""} ${gender || "person"}.

BIOMARKER READINGS:
${JSON.stringify(readingsContext, null, 2)}

Please provide your analysis using the suggest_analysis function with structured output including:
1. An overall summary (2-3 sentences)
2. Individual analysis for each biomarker
3. General lifestyle recommendations
4. Clear indication of when to see a doctor
5. A prominent medical disclaimer`;

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_analysis",
              description: "Return structured blood test analysis",
              parameters: {
                type: "object",
                properties: {
                  medicalDisclaimer: {
                    type: "string",
                    description: "Clear medical disclaimer about the limitations of this analysis"
                  },
                  overallSummary: {
                    type: "string",
                    description: "2-3 sentence summary of the results"
                  },
                  biomarkerAnalysis: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        value: { type: "number" },
                        unit: { type: "string" },
                        status: { 
                          type: "string", 
                          enum: ["normal", "low", "high", "borderline-low", "borderline-high", "unknown"]
                        },
                        normalRange: { type: "string" },
                        explanation: { type: "string" },
                        implications: { type: "string" },
                        trend: { 
                          type: "string", 
                          enum: ["improving", "stable", "declining", "no-history", "insufficient-data"]
                        },
                        recommendations: {
                          type: "array",
                          items: { type: "string" }
                        }
                      },
                      required: ["name", "value", "status", "explanation"]
                    }
                  },
                  lifestyleRecommendations: {
                    type: "array",
                    items: { type: "string" }
                  },
                  whenToSeeDoctor: {
                    type: "string",
                    description: "Guidance on when professional medical advice is recommended"
                  }
                },
                required: ["medicalDisclaimer", "overallSummary", "biomarkerAnalysis", "whenToSeeDoctor"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "suggest_analysis" } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a few moments." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    
    // Extract structured response from tool call
    let analysisResult;
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        analysisResult = JSON.parse(toolCall.function.arguments);
      } catch {
        throw new Error("Failed to parse AI response");
      }
    } else {
      throw new Error("No structured response from AI");
    }

    // Enhance with historical data
    if (analysisResult.biomarkerAnalysis) {
      for (const analysis of analysisResult.biomarkerAnalysis) {
        const history = historyMap[analysis.name.toLowerCase()] || [];
        analysis.previousValues = history.slice(0, 5).map(h => ({
          value: h.value,
          date: h.recorded_at
        }));
      }
    }

    // Store the analysis in health_queries for history
    await supabase.from("health_queries").insert({
      user_id: user.id,
      query_text: `Blood test analysis: ${sanitizedReadings.map(r => r.biomarkerName).join(", ")}`,
      ai_response: analysisResult,
      age: age || null,
      gender: gender || null
    });

    console.log(`Blood test analysis completed for user ${user.id} with ${sanitizedReadings.length} biomarkers`);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Blood test analysis error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? (error instanceof Error ? error.message : String(error)) : "Analysis failed",
        medicalDisclaimer: "This service is temporarily unavailable. Please consult a healthcare professional for interpretation of your test results."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
