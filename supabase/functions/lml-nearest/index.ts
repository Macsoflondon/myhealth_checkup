/**
 * LML Nearest Clinics API Proxy
 * 
 * SECURITY NOTICE: This endpoint is intentionally PUBLIC (verify_jwt=false)
 * 
 * Rationale for Public Access:
 * - Users need to search for nearby testing locations BEFORE authentication
 * - Clinic location data is non-sensitive, publicly available information
 * - Enables better user experience for clinic discovery
 * 
 * Security Measures Implemented:
 * 1. Database-backed rate limiting: 10 requests per minute per client (persists across cold starts)
 * 2. Strict maxPages validation: Maximum 1 page to prevent API quota exhaustion
 * 3. Input validation for latitude/longitude coordinates
 * 4. Rate limit headers in responses for transparency
 * 5. Automatic cleanup of old rate limit entries via database function
 * 6. Bearer token stored securely in Supabase secrets (not exposed to client)
 * 
 * Protection Against:
 * - API quota exhaustion (maxPages limit + rate limiting)
 * - Denial of service attacks (per-IP rate limiting with persistence)
 * - Cold start bypass (database-backed rate limiting)
 * - Excessive data retrieval (strict page limits)
 * - Invalid coordinate injection (range validation)
 * 
 * Monitoring:
 * - All requests logged with coordinates and page counts
 * - Rate limit violations logged with client identifiers
 * - API errors captured for debugging
 * 
 * Last Security Review: 2026-01-07
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LML_ENDPOINT = "https://api.londonmedicallaboratory.com/api/test_location/nearest";

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_PAGES_ALLOWED = 1; // Reduced from 3 - most users only need nearby clinics

// Get client identifier for rate limiting
function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwarded?.split(',')[0]?.trim() || realIp || "unknown";
}

// Database-backed rate limiting (persists across cold starts)
async function checkRateLimit(
  supabaseClient: any, 
  clientKey: string, 
  endpoint: string
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  try {
    // Try to get existing rate limit entry for this window
    const { data: existing, error: selectError } = await supabaseClient
      .from('api_rate_limits')
      .select('id, request_count')
      .eq('endpoint', endpoint)
      .eq('client_key', clientKey)
      .gte('window_start', windowStart.toISOString())
      .order('window_start', { ascending: false })
      .limit(1)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // Error other than "no rows" - allow request but log
      console.error('Rate limit check error:', selectError);
      return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW };
    }

    if (existing) {
      // Entry exists in current window
      if (existing.request_count >= MAX_REQUESTS_PER_WINDOW) {
        return { allowed: false, remaining: 0 };
      }

      // Increment count
      await supabaseClient
        .from('api_rate_limits')
        .update({ request_count: existing.request_count + 1 })
        .eq('id', existing.id);

      return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - existing.request_count - 1 };
    }

    // No entry exists - create new one
    await supabaseClient
      .from('api_rate_limits')
      .insert({
        endpoint,
        client_key: clientKey,
        request_count: 1,
        window_start: now.toISOString()
      });

    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow request to prevent blocking legitimate users
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW };
  }
}

// Cleanup old rate limit entries (runs periodically)
async function cleanupOldRateLimits(supabaseClient: any): Promise<void> {
  try {
    // Run cleanup ~10% of the time to reduce database load
    if (Math.random() < 0.1) {
      await supabaseClient.rpc('cleanup_old_rate_limits');
      console.log('Rate limit cleanup completed');
    }
  } catch (error) {
    console.error('Rate limit cleanup error:', error);
  }
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client with service role for rate limiting
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

  // Cleanup old rate limit entries (probabilistic)
  cleanupOldRateLimits(supabaseClient);

  try {
    // Rate limiting check (database-backed)
    const clientKey = getRateLimitKey(req);
    const rateLimitCheck = await checkRateLimit(supabaseClient, clientKey, 'lml-nearest');
    
    if (!rateLimitCheck.allowed) {
      console.warn(`Rate limit exceeded for client: ${clientKey}`);
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)
        }), 
        {
          status: 429,
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
            "X-RateLimit-Remaining": "0",
            "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000))
          },
        }
      );
    }

    const token = Deno.env.get("LML_BEARER_TOKEN");
    if (!token) {
      console.error("LML_BEARER_TOKEN not configured");
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { lat, lon, maxPages = 1 } = await req.json();
    
    // Validate input types
    if (typeof lat !== "number" || typeof lon !== "number") {
      return new Response(JSON.stringify({ error: "lat and lon are required numbers" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return new Response(JSON.stringify({ error: "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // CRITICAL: Enforce strict maxPages limit to prevent API quota exhaustion
    const validatedMaxPages = Math.max(1, Math.min(MAX_PAGES_ALLOWED, Math.floor(maxPages)));
    
    if (maxPages > MAX_PAGES_ALLOWED) {
      console.warn(`Client requested ${maxPages} pages, capped to ${MAX_PAGES_ALLOWED} for security`);
    }

    async function fetchPage(page: number) {
      const url = `${LML_ENDPOINT}/${lat}/${lon}?page=${page}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain",
        },
      });
      if (!res.ok) throw new Error(`LML API error: ${res.status}`);
      return res.json();
    }

    // Collect and dedupe across pages
    let all: any[] = [];
    console.log(`Fetching up to ${validatedMaxPages} pages for coordinates: ${lat}, ${lon}`);
    
    for (let p = 1; p <= validatedMaxPages; p++) {
      try {
        const data = await fetchPage(p);
        const items = Array.isArray(data.items) ? data.items : [];
        all = all.concat(items);
        console.log(`Page ${p}: Retrieved ${items.length} items`);
        if (items.length < 20) break; // pagination heuristic
      } catch (e) {
        console.error(`Error fetching page ${p}:`, e);
        if (p === 1) throw e;
        break;
      }
    }

    const seen = new Set<string>();
    const dedup: any[] = [];
    for (const it of all) {
      const key = it.id || `${(it.name || "").toLowerCase()}|${(it.postal_code || "").toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        dedup.push(it);
      }
    }

    console.log(`Returning ${dedup.length} deduplicated clinic locations`);
    
    return new Response(JSON.stringify({ items: dedup }), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
        "X-RateLimit-Remaining": String(rateLimitCheck.remaining)
      },
    });
  } catch (error: any) {
    console.error("lml-nearest error:", error?.message || error, error?.stack);
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch clinic locations. Please try again later." 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
