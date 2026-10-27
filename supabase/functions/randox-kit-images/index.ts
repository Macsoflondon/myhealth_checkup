// randox-kit-images — myhealth checkup
// 2026-10-25: one source of truth for Randox kit box images. Every Randox
// customer is posted the Randox kit and takes it to the clinic, so every
// Randox test (clinic or home) shows a Randox kit box.
// 2026-10-26: map keyed by Randox product path ("clinic/x", "home/x"), not row
// id, so a re-scraped or newly inserted row picks up its box on the next run.
// Each run also reports every active Randox test with no mapped box, so a new
// Randox product never sits on the platform without an image unnoticed.
// Boxes are copied from Randox's own image store into
// provider-test-images/randox/kit/. mhc-randox-scrape never writes image_url.
// Auth: ?secret= against Vault mhc_sync_secret.
import { createClient } from "npm:@supabase/supabase-js@2";
import { checkMhcSyncSecret } from "../_shared/mhc-auth.ts";

const BLOB =
  "https://stesrhplatforma071.blob.core.windows.net/images/Images/HTK/";
const BUCKET = "provider-test-images";

// Randox kit box (path under HTK/) -> Randox product paths that show it.
// Where Randox publishes no box of its own for a product, the closest box is
// used (decided by Nathanial, 25 Oct 2026); those are marked "nearest".
export const KIT_MAP: Record<string, string[]> = {
  "female/AMH.webp": [
    "home/amh-home-test",
    "home/amh-home-test-finger",
    "clinic/amh-test",
    "clinic/simplyhealth-amh-test",
  ],
  "female/female-health.webp": [
    "home/female-hormone-quickdraw",
    "clinic/female-hormone-test",
    "clinic/simplyhealth-female-hormone-test",
    // nearest
    "clinic/fertility-test",
    "clinic/simplyhealth-fertility-test",
    "clinic/menopause-test",
    "clinic/ovulation-test",
    "clinic/polyendocrine-metabolic-ovarian-syndrome--test",
    "clinic/polycystic-ovary-syndrome-test",
  ],
  "female/Male_Hormone.webp": [
    "home/male-hormone-quickdraw",
    "clinic/male-hormone-test",
    "clinic/simplyhealth-male-hormone",
  ],
  "female/general-health.webp": [
    "home/general-health-test",
    // nearest
    "clinic/everyman-test",
    "clinic/everywoman-test",
    "clinic/everyman-everywoman-test",
    "clinic/discovery-health-check",
    "clinic/simplyhealth-discovery-health-check",
    "clinic/signature-platinum-test",
    "clinic/signature-platinum-plus-test",
    "clinic/signature-prestige-test",
    "clinic/sports-performance-test",
    "clinic/vitamins-minerals-test",
    "clinic/cold-cough-flu-test",
    "clinic/cancer-risk-test",
    "clinic/bowel-cancer-risk-test",
    "clinic/breast-ovarian-cancer-risk-test",
    "clinic/core-cancer-test",
    "clinic/liver-function-test",
    "clinic/digestive-bowel-health-test",
  ],
  "female/Heart_Health.webp": [
    "home/heart-health-test",
    "home/heart-health-test-finger",
    "clinic/cardiac-risk-test",
    "clinic/fh-test",
  ],
  "female/Thyroid.webp": [
    "home/thyroid-function-home-test",
    "clinic/thyroid-function-test",
  ],
  "female/Type1_Diabetes_Risk.webp": [
    "home/type-1-diabetes-home-test",
    "clinic/type-1-diabetes-test",
  ],
  "male/psa.webp": [
    "home/psa-home-test",
    "clinic/prostate-specific-antigen-psa",
    "clinic/advanced-psa-test",
    "clinic/prostate-cancer-risk-test",
  ],
  "female/Vitamin_B12.webp": ["home/vitamin-b12-test"],
  "female/VitaminD.webp": ["home/vitamin-d-test"],
  "female/genetic-coeliac-disease.webp": [
    "home/coeliac-disease-home-test-kit",
    "clinic/coeliac-disease-test",
  ],
  "female/genetic-haemochromotosis.webp": [
    "home/haemochromatosis-home-test-kit",
    "clinic/haemochromatosis-test",
  ],
  "female/Genetic_Lactose_Intolerance_Test.webp": [
    "home/lactose-intolerance-home-test-kit",
    "clinic/lactose-intolerance-test",
  ],
  "female/Confidante.webp": [
    "home/home-sti-test",
    "clinic/sti-test",
    "clinic/complete-sti-test",
    "clinic/blood-borne-sti-test",
    "clinic/simplyhealth-complete-sti-test",
    "clinic/simplyhealth-sti-urine-next-day",
  ],
  "female/gut-microbiome.webp": ["home/gut-microbiome-test"],
  "female/nutritional-lifestyle.webp": [
    "home/nutrition-lifestyle-dna-home-test-kit",
    "clinic/nutrition-lifestyle-dna-test",
  ],
  "female/Osentia_Fracture_Risk.webp": [
    "home/fracture-risk-assessment-test-kit",
  ],
  "female/Food_Sensitivity.webp": ["home/food-sensitivity-test"],
};

const productPath = (u: string | null) =>
  (u || "")
    .replace(/[?#].*$/, "")
    .replace(/^.*?\/product\//i, "")
    .replace(/\/+$/, "")
    .toLowerCase();
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });

Deno.serve(async (req) => {
  const u = new URL(req.url);
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const auth = await checkMhcSyncSecret(u, supabase, "randox-kit-images");
  if (!auth.ok) return new Response("unauthorized", { status: 401 });

  const { data: rows, error: readErr } = await supabase
    .from("provider_tests")
    .select("id,test_name,url,image_url")
    .eq("provider_id", "randox")
    .eq("is_active", true);
  if (readErr || !rows)
    return json({ ok: false, error: readErr?.message ?? "no rows" }, 500);

  const kitFor = new Map<string, string>();
  for (const [kit, paths] of Object.entries(KIT_MAP))
    for (const p of paths) kitFor.set(p, kit);

  const byKit = new Map<string, string[]>();
  const unmapped: Array<{ id: string; test_name: string; path: string }> = [];
  for (const r of rows) {
    const kit = kitFor.get(productPath(r.url));
    if (!kit) {
      unmapped.push({
        id: r.id,
        test_name: r.test_name,
        path: productPath(r.url),
      });
      continue;
    }
    byKit.set(kit, [...(byKit.get(kit) ?? []), r.id]);
  }

  const results: Array<Record<string, unknown>> = [];
  for (const [kit, ids] of byKit) {
    const src = await fetch(BLOB + kit);
    if (!src.ok) {
      results.push({ kit, error: `source ${src.status}` });
      continue;
    }
    const bytes = new Uint8Array(await src.arrayBuffer());
    const objectPath = `randox/kit/${kit.split("/").pop()!.toLowerCase()}`;
    const up = await supabase.storage.from(BUCKET).upload(objectPath, bytes, {
      contentType: "image/webp",
      upsert: true,
      cacheControl: "31536000",
    });
    if (up.error) {
      results.push({ kit, error: up.error.message });
      continue;
    }
    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(objectPath)
      .data.publicUrl;
    const { data, error } = await supabase
      .from("provider_tests")
      .update({ image_url: publicUrl, image_is_stock: false })
      .in("id", ids)
      .eq("provider_id", "randox")
      .select("id");
    results.push({
      kit,
      bytes: bytes.length,
      url: publicUrl,
      expected: ids.length,
      updated: data?.length ?? 0,
      error: error?.message,
    });
  }
  const ok =
    unmapped.length === 0 &&
    results.every((x) => !x.error && x.updated === x.expected);
  if (unmapped.length)
    console.error(
      `[randox-kit-images] ${unmapped.length} active Randox tests have no kit box mapped: ${unmapped.map((x) => x.path).join(", ")}`,
    );
  return json({ ok, active: rows.length, unmapped, results });
});
