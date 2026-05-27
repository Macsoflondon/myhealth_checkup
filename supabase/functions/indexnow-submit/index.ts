// IndexNow submission endpoint.
// Push URL changes (new tests, price updates, new providers, etc.) to
// Bing / Yandex / Seznam / Naver via the IndexNow protocol.
//
// Call from the frontend (admin only) or from other edge functions
// (scraper, price update jobs) using supabase.functions.invoke('indexnow-submit', { body: { urls: [...] } }).
//
// Docs: https://www.indexnow.org/documentation

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const HOST = "www.myhealthcheckup.co.uk";
const KEY = "7401dcec289a56ae576163fbf0313388";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

// IndexNow caps each request at 10,000 URLs. We cap lower for safety.
const MAX_URLS_PER_REQUEST = 1000;

interface SubmitBody {
  urls: string[];
  /**
   * If true, skips admin auth check. Only allowed when called from another
   * edge function via the service role key (server-to-server).
   */
  internal?: boolean;
}

function isValidUrl(u: string): boolean {
  try {
    const parsed = new URL(u);
    return parsed.host === HOST && parsed.protocol === "https:";
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const urls = Array.isArray(body?.urls) ? body.urls : [];
  if (urls.length === 0) {
    return new Response(JSON.stringify({ error: "urls array required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const cleanUrls = Array.from(new Set(urls.filter(isValidUrl))).slice(
    0,
    MAX_URLS_PER_REQUEST
  );
  if (cleanUrls.length === 0) {
    return new Response(
      JSON.stringify({
        error: `No valid URLs. Must be https://${HOST}/...`,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Auth gate: external callers must be admin. Server-to-server callers
  // present the service-role key in the Authorization header.
  const authHeader = req.headers.get("Authorization") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const isInternal =
    body.internal === true &&
    serviceKey.length > 0 &&
    authHeader === `Bearer ${serviceKey}`;

  if (!isInternal) {
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: cleanUrls,
  };

  const indexNowRes = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const text = await indexNowRes.text();

  // 200 = OK, 202 = accepted (async), 422 = invalid URLs, 429 = rate limit
  return new Response(
    JSON.stringify({
      submitted: cleanUrls.length,
      status: indexNowRes.status,
      indexNowResponse: text || null,
    }),
    {
      status: indexNowRes.ok ? 200 : indexNowRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
