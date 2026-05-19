// Automated verification: for every active provider test, confirm the
// stored image_url is present, not a placeholder, hosted by the provider,
// reachable, and serves an image content-type. Results land in
// public.provider_image_audit, scoped by run_id.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLACEHOLDER_PATTERNS = [/gb\.png/i, /flag/i, /placeholder/i, /no[-_ ]image/i, /default/i];

// Expected hostnames per provider (anything outside flags as wrong_host).
const PROVIDER_HOST_ALLOWLIST: Record<string, RegExp[]> = {
  randox: [/randoxhealth\.com/i, /randox\.com/i, /blob\.core\.windows\.net/i, /azurefd\.net/i],
  medichecks: [/medichecks\.com/i, /cloudinary\.com/i],
  thriva: [/thriva\.co/i],
  "goodbody-clinic": [/goodbodyclinic\.com/i],
  clinilabs: [/clinilabs\./i, /cdn\.shopify\.com/i],
  "lola-health": [/lola\.health/i, /lolahealth\./i],
  "london-health-company": [/londonhealthcompany\.com/i, /londonhealth\./i],
  "london-medical-laboratory": [/londonmedicallaboratory\.com/i, /lml\./i],
  "medical-diagnosis": [/medical-diagnosis\.co\.uk/i],
  bluecrest: [/bluecrestwellness\.com/i],
};

interface Row {
  id: string;
  provider_id: string;
  category: string | null;
  provider_test_id: string | null;
  test_name: string | null;
  image_url: string | null;
}

interface Result {
  status: "ok" | "missing" | "placeholder" | "unreachable" | "wrong_type" | "wrong_host";
  http_status?: number;
  content_type?: string;
  issue?: string;
}

async function checkOne(row: Row): Promise<Result> {
  const url = row.image_url?.trim();
  if (!url) return { status: "missing", issue: "image_url is null/empty" };

  if (PLACEHOLDER_PATTERNS.some((re) => re.test(url))) {
    return { status: "placeholder", issue: `matches placeholder pattern (${url})` };
  }

  const allow = PROVIDER_HOST_ALLOWLIST[row.provider_id];
  if (allow && !allow.some((re) => re.test(url))) {
    return { status: "wrong_host", issue: `host not in allowlist for ${row.provider_id}` };
  }

  try {
    const ctrl = AbortSignal.timeout(8000);
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl });
    // Some CDNs don't allow HEAD — fall back to ranged GET.
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });
    }
    const ct = res.headers.get("content-type") ?? "";
    if (!res.ok) {
      return { status: "unreachable", http_status: res.status, content_type: ct, issue: `HTTP ${res.status}` };
    }
    if (!/^image\//i.test(ct) && !/octet-stream/i.test(ct)) {
      return { status: "wrong_type", http_status: res.status, content_type: ct, issue: `content-type ${ct}` };
    }
    return { status: "ok", http_status: res.status, content_type: ct };
  } catch (e) {
    return { status: "unreachable", issue: (e as Error).message };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const url = new URL(req.url);
  const providerFilter = url.searchParams.get("provider"); // optional
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 2000), 5000);
  const concurrency = Math.min(Number(url.searchParams.get("concurrency") ?? 12), 24);

  let q = admin
    .from("provider_tests")
    .select("id, provider_id, category, provider_test_id, test_name, image_url")
    .eq("is_active", true)
    .limit(limit);
  if (providerFilter) q = q.eq("provider_id", providerFilter);

  const { data: rows, error } = await q;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }

  const run_id = crypto.randomUUID();
  const records: any[] = [];
  let i = 0;

  async function worker() {
    while (i < rows!.length) {
      const idx = i++;
      const row = rows![idx] as Row;
      const r = await checkOne(row);
      records.push({
        run_id,
        provider_id: row.provider_id,
        category: row.category,
        provider_test_id: row.provider_test_id,
        test_name: row.test_name,
        image_url: row.image_url,
        status: r.status,
        http_status: r.http_status ?? null,
        content_type: r.content_type ?? null,
        issue: r.issue ?? null,
      });
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));

  // Bulk insert in chunks of 500
  for (let c = 0; c < records.length; c += 500) {
    const chunk = records.slice(c, c + 500);
    const { error: insErr } = await admin.from("provider_image_audit").insert(chunk);
    if (insErr) console.error("insert err", insErr.message);
  }

  const summary: Record<string, Record<string, number>> = {};
  for (const r of records) {
    const key = `${r.provider_id}::${r.category ?? "Uncategorised"}`;
    summary[key] ??= { total: 0, ok: 0, missing: 0, placeholder: 0, unreachable: 0, wrong_type: 0, wrong_host: 0 };
    summary[key].total++;
    summary[key][r.status]++;
  }

  return new Response(
    JSON.stringify({ run_id, checked: records.length, summary }, null, 2),
    { headers: { ...corsHeaders, "content-type": "application/json" } },
  );
});
