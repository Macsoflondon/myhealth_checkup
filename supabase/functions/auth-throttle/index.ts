// Cyber Essentials: brute-force protection for sign-in.
// Call BEFORE supabase.auth.signInWithPassword from the client.
// Returns { allowed: boolean, retryAfter?: number }.
//
// Throttling key combines IP + lowercased email so attackers cannot lock
// victims out by guessing the email alone (we still throttle that bucket,
// but never lock anyone out of their own account from a different IP).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_ATTEMPTS = 10;
const WINDOW_MIN = 15;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { email, outcome } = await req.json().catch(() => ({}));
    if (typeof email !== 'string' || email.length > 254) {
      return new Response(JSON.stringify({ error: 'bad email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const ip = (req.headers.get('cf-connecting-ip')
      ?? req.headers.get('x-forwarded-for')?.split(',')[0]
      ?? 'unknown').trim();
    const key = `auth:signin:${email.toLowerCase()}|${ip}`;
    const windowStart = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();

    // Record failed attempt if the client tells us the sign-in failed.
    if (outcome === 'failure') {
      await supabase.from('api_rate_limits').insert({
        client_key: key,
        endpoint: 'auth:signin',
        window_start: new Date().toISOString(),
      });
    }

    const { count } = await supabase
      .from('api_rate_limits')
      .select('id', { count: 'exact', head: true })
      .eq('client_key', key)
      .eq('endpoint', 'auth:signin')
      .gte('window_start', windowStart);

    const used = count ?? 0;
    const allowed = used < MAX_ATTEMPTS;
    return new Response(JSON.stringify({
      allowed,
      remaining: Math.max(0, MAX_ATTEMPTS - used),
      retryAfter: allowed ? 0 : WINDOW_MIN * 60,
    }), {
      status: allowed ? 200 : 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        ...(allowed ? {} : { 'Retry-After': String(WINDOW_MIN * 60) }),
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
