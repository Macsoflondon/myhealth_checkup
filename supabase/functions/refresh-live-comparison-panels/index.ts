// refresh-live-comparison-panels
// Refreshes every live comparison panel from the canonical provider_tests rows.
// Panel prices must be method-specific expected totals, not the first raw £ price
// scraped from a provider page.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type Row = {
  name: string;
  bio: string;
  badge: string;
  variant: string;
  price: string;
  url?: string;
  providerId?: string;
  sourceTestName?: string;
  method?: "at_home" | "clinic";
  methodLabel?: string;
};

type ProviderTest = {
  provider_id: string;
  test_name: string;
  price: number | null;
  url: string | null;
  collection_method: string | null;
  collection_fee_type: string | null;
  collection_fee_amount: number | null;
  clinical_review_type: string | null;
  clinical_review_fee: number | null;
  home_kit_available: boolean | null;
  clinic_visit_available: boolean | null;
};

const approvedMethodLabel: Record<"at_home" | "clinic", string> = {
  at_home: "At-home test kit",
  clinic: "In-clinic test",
};

function normaliseMethod(row: Row): "at_home" | "clinic" | null {
  if (row.method === "at_home" || row.method === "clinic") return row.method;
  const text = `${row.methodLabel ?? ""} ${row.bio ?? ""} ${row.badge ?? ""}`.toLowerCase();
  if (text.includes("at-home") || text.includes("home kit") || text.includes("home test")) return "at_home";
  if (text.includes("in-clinic") || text.includes("clinic")) return "clinic";
  return null;
}

function hasForbiddenWording(row: Row): boolean {
  const text = `${row.methodLabel ?? ""} ${row.bio ?? ""} ${row.badge ?? ""}`.toLowerCase();
  return text.includes("walk-in") || text.includes("walk in") || text.includes("clinic-based");
}

function providerKey(row: Row): string {
  return (row.providerId || row.name).trim().toLowerCase();
}

function sanitiseRows(rows: Row[]): Row[] {
  const firstMethod = rows.map(normaliseMethod).find((method): method is "at_home" | "clinic" => method !== null);
  if (!firstMethod) return [];

  const seenProviders = new Set<string>();
  const methodLabel = approvedMethodLabel[firstMethod];
  return rows.filter((row) => {
    const key = providerKey(row);
    const keep = normaliseMethod(row) === firstMethod && key !== "" && !seenProviders.has(key) && !hasForbiddenWording(row);
    if (keep) seenProviders.add(key);
    return keep;
  }).map((row) => ({ ...row, method: firstMethod, methodLabel, bio: methodLabel, badge: methodLabel }));
}

function normaliseText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function normaliseUrl(value: string | null | undefined): string {
  return normaliseText(value).replace(/\/$/, "");
}

function formatPrice(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? `£${rounded}` : `£${rounded.toFixed(2)}`;
}

function supportsMethod(test: ProviderTest, method: "at_home" | "clinic"): boolean {
  const collectionMethod = normaliseText(test.collection_method);
  if (method === "at_home") {
    return test.home_kit_available === true || collectionMethod === "home_kit" || collectionMethod === "self_arranged";
  }
  return test.clinic_visit_available === true || collectionMethod === "clinic_appointment" || collectionMethod === "home_visit";
}

function isMandatoryFee(type: string | null, amount: number | null): boolean {
  return amount !== null && amount > 0 && type !== null && type !== "none" && type !== "optional";
}

function expectedTotal(test: ProviderTest, method: "at_home" | "clinic"): number | null {
  if (test.price === null || test.price <= 0 || !supportsMethod(test, method)) return null;

  let total = test.price;
  const collectionMethod = normaliseText(test.collection_method);
  const feeAppliesToMethod = method === "clinic"
    ? collectionMethod === "clinic_appointment" || test.home_kit_available !== true
    : collectionMethod === "home_kit";

  if (feeAppliesToMethod && isMandatoryFee(test.collection_fee_type, test.collection_fee_amount)) {
    total += test.collection_fee_amount ?? 0;
  }
  if (test.clinical_review_type === "required" && test.clinical_review_fee !== null && test.clinical_review_fee > 0) {
    total += test.clinical_review_fee;
  }
  return total;
}

function findProviderTest(row: Row, tests: ProviderTest[]): ProviderTest | null {
  const providerId = normaliseText(row.providerId);
  if (!providerId) return null;
  const providerTests = tests.filter((test) => normaliseText(test.provider_id) === providerId);
  const rowUrl = normaliseUrl(row.url);
  const rowName = normaliseText(row.sourceTestName);

  return providerTests.find((test) => rowUrl !== "" && normaliseUrl(test.url) === rowUrl)
    ?? providerTests.find((test) => rowName !== "" && normaliseText(test.test_name) === rowName)
    ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Auth: service-role bearer only (called by pg_cron / internal jobs).
  const authHeader = req.headers.get("Authorization") ?? "";
  if (authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: panels, error } = await supabase
    .from("live_comparison_panels")
    .select("id, slug, rows");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: tests, error: testsError } = await supabase
    .from("provider_tests")
    .select("provider_id, test_name, price, url, collection_method, collection_fee_type, collection_fee_amount, clinical_review_type, clinical_review_fee, home_kit_available, clinic_visit_available")
    .eq("is_active", true)
    .not("price", "is", null)
    .limit(5000);

  if (testsError) {
    return new Response(JSON.stringify({ error: testsError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const providerTests = (tests ?? []) as ProviderTest[];
  const summary: Array<{ slug: string; updated: number; total: number; removed: number }> = [];

  for (const panel of panels ?? []) {
    const rows = sanitiseRows((panel.rows as Row[]) ?? []);
    const panelMethod = rows.map(normaliseMethod).find((method): method is "at_home" | "clinic" => method !== null);
    let updated = 0;
    const newRows: Row[] = [];
    for (const row of rows) {
      if (!panelMethod) continue;
      const sourceTest = findProviderTest(row, providerTests);
      const total = sourceTest ? expectedTotal(sourceTest, panelMethod) : null;
      if (total !== null) {
        const price = formatPrice(total);
        if (price !== row.price) updated++;
        newRows.push({ ...row, price });
        continue;
      }
      newRows.push(row);
    }
    await supabase
      .from("live_comparison_panels")
      .update({ rows: newRows, last_scraped_at: new Date().toISOString() })
      .eq("id", panel.id);
    summary.push({ slug: panel.slug, updated, total: newRows.length, removed: rows.length - newRows.length });
  }

  return new Response(JSON.stringify({ success: true, summary }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
