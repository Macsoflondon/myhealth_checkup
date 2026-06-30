// Edge function: AI-powered batch translation with Supabase caching.
// Uses Lovable AI Gateway (Gemini) — no user-supplied keys.
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LANG_NAMES: Record<string, string> = {
  fr: 'French', es: 'Spanish', de: 'German', it: 'Italian', pt: 'Portuguese',
  nl: 'Dutch', pl: 'Polish', ar: 'Arabic', zh: 'Simplified Chinese', ja: 'Japanese',
};

async function sha1(s: string) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const MAX_TEXTS = 50;
const MAX_TEXT_LEN = 2000;
const RATE_LIMIT_MAX = 300;
const RATE_LIMIT_WINDOW_MIN = 5;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { texts, language } = await req.json();
    if (!Array.isArray(texts) || !language || language === 'en' || !LANG_NAMES[language]) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (texts.length === 0 || texts.length > MAX_TEXTS) {
      return new Response(JSON.stringify({ error: `texts must be 1..${MAX_TEXTS} items` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    for (const t of texts) {
      if (typeof t !== 'string' || t.length > MAX_TEXT_LEN) {
        return new Response(JSON.stringify({ error: `each text must be a string <= ${MAX_TEXT_LEN} chars` }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Per-IP rate limiting via api_rate_limits
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000).toISOString();
    const { count } = await supabase
      .from('api_rate_limits')
      .select('id', { count: 'exact', head: true })
      .eq('client_key', `translate:${ip}`)
      .gte('window_start', windowStart);
    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': String(RATE_LIMIT_WINDOW_MIN * 60) },
      });
    }
    await supabase.from('api_rate_limits').insert({
      client_key: `translate:${ip}`,
      endpoint: 'translate',
      window_start: new Date().toISOString(),
    });

    // Look up cache
    const hashes = await Promise.all((texts as string[]).map(sha1));
    const { data: cached } = await supabase
      .from('translations_cache')
      .select('source_hash, translated_text')
      .eq('language', language)
      .in('source_hash', hashes);

    const cacheMap = new Map((cached ?? []).map(r => [r.source_hash, r.translated_text]));
    const out: Record<string, string> = {};
    const todoIdx: number[] = [];
    texts.forEach((t: string, i: number) => {
      const hit = cacheMap.get(hashes[i]);
      if (hit) out[t] = hit;
      else todoIdx.push(i);
    });

    if (todoIdx.length === 0) {
      return new Response(JSON.stringify({ translations: out, cached: texts.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Batch-translate via Lovable AI Gateway
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'AI gateway not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const todo = todoIdx.map(i => texts[i]);
    const prompt =
      `Translate the following JSON array of UK-English strings to ${LANG_NAMES[language]}. ` +
      `Preserve placeholders like {{name}}, HTML tags, and punctuation exactly. ` +
      `Return ONLY a JSON array of the same length, same order, no commentary.\n\n` +
      JSON.stringify(todo);

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': apiKey,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: 'You are a precise translator. Output JSON only.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      return new Response(JSON.stringify({ error: 'AI gateway error', detail: txt }), {
        status: aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiJson = await aiRes.json();
    const raw = aiJson?.choices?.[0]?.message?.content ?? '[]';
    // Strip markdown fences if model added them
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    let translated: string[] = [];
    try { translated = JSON.parse(cleaned); } catch { translated = []; }

    if (!Array.isArray(translated) || translated.length !== todo.length) {
      return new Response(JSON.stringify({ error: 'Bad AI response shape', raw }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Persist
    const rows = todo.map((src, i) => ({
      source_hash: hashes[todoIdx[i]],
      language,
      source_text: src,
      translated_text: translated[i],
    }));
    if (rows.length) {
      await supabase.from('translations_cache').upsert(rows, { onConflict: 'source_hash,language' });
    }
    todo.forEach((src, i) => { out[src] = translated[i]; });

    return new Response(
      JSON.stringify({ translations: out, cached: texts.length - todo.length, translated: todo.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
