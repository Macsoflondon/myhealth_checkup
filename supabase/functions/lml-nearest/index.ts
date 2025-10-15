import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LML_ENDPOINT = "https://api.londonmedicallaboratory.com/api/test_location/nearest";

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_PAGES_ALLOWED = 3; // Maximum pages to prevent API quota exhaustion

// In-memory rate limiter (resets on cold start)
const requestLog = new Map<string, number[]>();

function getRateLimitKey(req: Request): string {
  // Use client IP from headers
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwarded?.split(',')[0] || realIp || "unknown";
}

function checkRateLimit(clientKey: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  
  // Get existing requests for this client
  let timestamps = requestLog.get(clientKey) || [];
  
  // Remove old requests outside the window
  timestamps = timestamps.filter(ts => ts > windowStart);
  
  // Check if limit exceeded
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(clientKey, timestamps);
    return { allowed: false, remaining: 0 };
  }
  
  // Add current request
  timestamps.push(now);
  requestLog.set(clientKey, timestamps);
  
  return { 
    allowed: true, 
    remaining: MAX_REQUESTS_PER_WINDOW - timestamps.length 
  };
}

// Cleanup old entries periodically (runs on each request)
function cleanupRateLimitCache() {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  
  for (const [key, timestamps] of requestLog.entries()) {
    const validTimestamps = timestamps.filter(ts => ts > windowStart);
    if (validTimestamps.length === 0) {
      requestLog.delete(key);
    } else {
      requestLog.set(key, validTimestamps);
    }
  }
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Cleanup rate limit cache
  cleanupRateLimitCache();

  try {
    // Rate limiting check
    const clientKey = getRateLimitKey(req);
    const rateLimitCheck = checkRateLimit(clientKey);
    
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
