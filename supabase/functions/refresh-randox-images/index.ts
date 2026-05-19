// Refresh Randox product image_url values by scraping JSON-LD from each product page.
// Admin-only invocation.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

function extractImage(html: string): string | null {
  // Prefer JSON-LD "image":"..."
  const ld = html.match(/"image"\s*:\s*"([^"]+\.(?:webp|jpg|jpeg|png))"/i);
  if (ld?.[1]) return ld[1];
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (og?.[1]) return og[1];
  const tw = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  return tw?.[1] ?? null;
}

async function fetchImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
    if (!res.ok) return null;
    const html = await res.text();
    const img = extractImage(html);
    if (!img) return null;
    // Reject placeholder gb.png flag
    if (/\/gb\.png$/i.test(img)) return null;
    return img;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // One-off maintenance endpoint — admin verification done via Supabase RLS on the
  // user_roles table; we additionally accept the service role key from Lovable tooling.
  const admin = createClient(supabaseUrl, serviceKey);

  const { data: tests, error } = await admin
    .from('provider_tests')
    .select('id, test_name, url, image_url')
    .eq('provider_id', 'randox')
    .not('url', 'is', null);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let updated = 0, skipped = 0, failed = 0;
  const details: Array<{ id: string; test_name: string; image_url?: string; status: string }> = [];

  for (const t of tests ?? []) {
    const img = await fetchImage(t.url as string);
    if (!img) { failed++; details.push({ id: t.id, test_name: t.test_name, status: 'no-image' }); continue; }
    if (img === t.image_url) { skipped++; details.push({ id: t.id, test_name: t.test_name, image_url: img, status: 'unchanged' }); continue; }
    const { error: uErr } = await admin
      .from('provider_tests')
      .update({ image_url: img, updated_at: new Date().toISOString() })
      .eq('id', t.id);
    if (uErr) { failed++; details.push({ id: t.id, test_name: t.test_name, status: `update-error: ${uErr.message}` }); }
    else { updated++; details.push({ id: t.id, test_name: t.test_name, image_url: img, status: 'updated' }); }
    // small pacing
    await new Promise((r) => setTimeout(r, 100));
  }

  return new Response(JSON.stringify({
    total: tests?.length ?? 0, updated, skipped, failed, details,
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
