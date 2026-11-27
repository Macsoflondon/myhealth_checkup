// provider-test-image-sync — copies provider product images into the
// provider-test-images bucket and links them on provider_tests, so the
// platform never hot-links a provider's site (hot-linked images broke when
// providers moved files: 108 Medical Diagnosis images were 404 on 2026-10-25).
//
// Modes (GET ?provider=<id>&mode=<mode>[&after=<uuid>][&limit=25][&dry=1],
// with the Vault mhc_sync_secret in the x-mhc-sync-secret request header):
//
//   pair (default; Clinilabs only) — two images per test chosen by the
//     provider's own Shopify file naming:
//       slot 0 "<handle>-<n>-hero.<ext>"   plain box shot -> image_url (cards)
//       slot 1 "<handle>-<n>-covers.<ext>" biomarker breakdown (detail gallery)
//     Every other product image (reviews, lifestyle photos, claims) is provider
//     marketing and is never copied.
//
//   rehost (any provider) — copies the test's existing external image_url as is.
//
//   og (any provider) — for tests with no image or a generated data: tile,
//     copies the og:image from the test's own provider product page.
//
// Every mode re-hosts, never hot-links, and asks the provider CDN for WebP at
// 1200px where it supports it. Paging is keyset: pass the returned next_after.
//
// 2026-10-25: created (pair); rehost and og modes added the same day.
// 2026-11-27 (platform screening): the secret moved from ?secret= to the
// x-mhc-sync-secret header, checked by the repository's shared mhc-auth.ts,
// so it no longer appears in the edge logs.
import { createClient } from "npm:@supabase/supabase-js@2";
import { internalErrorResponse } from "../_shared/errors.ts";
import { checkMhcSyncSecret } from "../_shared/mhc-auth.ts";

const PAIR_PROVIDERS: Record<string, { base: string }> = {
  clinilabs: { base: "https://www.clinilabs.co.uk" },
};

const BUCKET = "provider-test-images";
const MAX_BYTES = 8 * 1024 * 1024;
const WIDTH = 1200;
const BOX_RE = /-\d+-hero\.(png|jpe?g|webp)$/i;
const BIOMARKER_RE = /-\d+-covers\.(png|jpe?g|webp)$/i;
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

type ShopifyImage = { src: string; position: number };
type ShopifyProduct = { handle: string; images: ShopifyImage[] };
type TestRow = {
  id: string;
  test_name: string;
  url: string | null;
  image_url: string | null;
  gallery_image_urls: string[] | null;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function fileName(src: string): string {
  return new URL(src).pathname.split("/").pop() ?? "";
}

function pick(images: ShopifyImage[], re: RegExp): ShopifyImage | undefined {
  return [...images]
    .sort((a, b) => a.position - b.position)
    .find((i) => re.test(fileName(i.src)));
}

/** Rejects anything that is not a public https host. */
function safeUrl(raw: string): URL {
  const u = new URL(raw.startsWith("//") ? `https:${raw}` : raw);
  if (u.protocol !== "https:") throw new Error(`refused protocol ${u.protocol}`);
  const h = u.hostname.toLowerCase();
  if (
    h === "localhost" ||
    h.endsWith(".local") ||
    h.endsWith(".internal") ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(h) ||
    h.includes(":")
  ) {
    throw new Error(`refused host ${h}`);
  }
  return u;
}

async function fetchCatalogue(base: string): Promise<Map<string, ShopifyProduct>> {
  const out = new Map<string, ShopifyProduct>();
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(`${base}/products.json?limit=250&page=${page}`);
    if (!res.ok) throw new Error(`catalogue page ${page}: HTTP ${res.status}`);
    const { products } = (await res.json()) as { products: ShopifyProduct[] };
    if (!products?.length) break;
    for (const p of products) out.set(p.handle, p);
    if (products.length < 250) break;
  }
  return out;
}

async function download(
  src: string,
): Promise<{ bytes: Uint8Array; type: string; ext: string; version: string }> {
  const original = safeUrl(src);
  const version = original.searchParams.get("v") ?? "";
  const ua = "myhealthcheckup-sync/1.0";
  // CDNs that negotiate format return WebP (~15x smaller than PNG).
  const webp = { Accept: "image/webp,image/avif,image/*;q=0.8", "User-Agent": ua };
  const plain = { Accept: "*/*", "User-Agent": ua };
  // Shopify CDNs (cdn.shopify.com and <store>/cdn/shop/) resize and convert on
  // request, and return 502 for some source files. Try the light version
  // first, then fall back step by step to the untouched original file.
  const attempts: { url: string; headers: Record<string, string> }[] = [];
  if (original.hostname === "cdn.shopify.com" || original.pathname.startsWith("/cdn/shop/")) {
    const resized = new URL(original.toString());
    resized.searchParams.set("width", String(WIDTH));
    attempts.push({ url: resized.toString(), headers: webp });
  }
  attempts.push({ url: original.toString(), headers: webp });
  attempts.push({ url: original.toString(), headers: plain });
  // Some provider CDNs also fail intermittently, so go round up to 3 times.
  let res: Response | null = null;
  outer: for (let round = 0; round < 3; round++) {
    if (round > 0) await new Promise((r) => setTimeout(r, 1500 * round));
    for (const a of attempts) {
      res = await fetch(a.url, { headers: a.headers, redirect: "follow" });
      if (res.ok) break outer;
      await res.body?.cancel();
    }
  }
  if (!res || !res.ok) throw new Error(`image HTTP ${res?.status ?? "no response"}`);
  const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const ext = EXT[type];
  if (!ext) throw new Error(`unexpected content-type ${type || "none"}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_BYTES) {
    throw new Error(`image size ${bytes.byteLength} out of range`);
  }
  return { bytes, type, ext, version };
}

async function findOgImage(pageUrl: string): Promise<string | null> {
  const res = await fetch(safeUrl(pageUrl).toString(), {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; myhealthcheckup-sync/1.0)" },
    redirect: "follow",
  });
  if (!res.ok) return null;
  const html = await res.text();
  const m =
    html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]*content=["']([^"']+)["']/i) ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (!m) return null;
  return new URL(m[1].replace(/&amp;/g, "&"), res.url).toString();
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const auth = await checkMhcSyncSecret(req, supabase, "provider-test-image-sync");
  if (!auth.ok) return json({ error: "unauthorised" }, 401);

  const provider = url.searchParams.get("provider") ?? "";
  const mode = url.searchParams.get("mode") ?? "pair";
  if (!/^[a-z0-9-]{2,60}$/.test(provider)) return json({ error: "bad provider" }, 400);
  if (!["pair", "rehost", "og"].includes(mode)) return json({ error: "bad mode" }, 400);
  if (mode === "pair" && !PAIR_PROVIDERS[provider]) {
    return json({ error: `pair mode not configured for '${provider}'` }, 400);
  }
  const after = url.searchParams.get("after") ?? "00000000-0000-0000-0000-000000000000";
  if (!/^[0-9a-f-]{36}$/i.test(after)) return json({ error: "bad after" }, 400);
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") ?? "25", 10) || 25));
  const dry = url.searchParams.get("dry") === "1";

  const publicBase = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/${BUCKET}/`;

  try {
    let q = supabase
      .from("provider_tests")
      .select("id, test_name, url, image_url, gallery_image_urls")
      .eq("provider_id", provider)
      .eq("is_active", true)
      .gt("id", after)
      .order("id")
      .limit(limit);
    if (mode === "pair") q = q.like("url", `${PAIR_PROVIDERS[provider].base}/products/%`);
    if (mode === "rehost") q = q.like("image_url", "http%").not("image_url", "like", `${publicBase}%`);
    if (mode === "og") q = q.or("image_url.is.null,image_url.like.data:%");
    const { data, error } = await q;
    if (error) throw error;
    const tests = (data ?? []) as TestRow[];

    const catalogue = mode === "pair" ? await fetchCatalogue(PAIR_PROVIDERS[provider].base) : null;
    const report: Record<string, unknown>[] = [];

    for (const t of tests) {
      // Resolve the source image(s) for this test.
      let sources: { slot: string; src: string }[] = [];
      if (mode === "pair") {
        const handle = (t.url ?? "").split("/products/")[1]?.split(/[?#]/)[0] ?? "";
        const product = catalogue!.get(handle);
        if (!product) {
          report.push({ id: t.id, test: t.test_name, status: "not_on_provider_site" });
          continue;
        }
        const box = pick(product.images, BOX_RE);
        const biomarkers = pick(product.images, BIOMARKER_RE);
        if (!box) {
          report.push({ id: t.id, test: t.test_name, status: "no_box_image_on_provider_site" });
          continue;
        }
        sources = [{ slot: "box", src: box.src }];
        if (biomarkers) sources.push({ slot: "biomarkers", src: biomarkers.src });
      } else if (mode === "rehost") {
        sources = [{ slot: "box", src: t.image_url! }];
      } else {
        const og = t.url ? await findOgImage(t.url).catch(() => null) : null;
        if (!og) {
          report.push({ id: t.id, test: t.test_name, status: "no_og_image" });
          continue;
        }
        sources = [{ slot: "box", src: og }];
      }

      if (dry) {
        report.push({ id: t.id, test: t.test_name, status: "dry_run", sources });
        continue;
      }

      try {
        const urls: string[] = [];
        const paths: string[] = [];
        for (const s of sources) {
          const d = await download(s.src);
          const path = `${provider}/${t.id}-${s.slot}.${d.ext}`;
          const { error: upErr } = await supabase.storage
            .from(BUCKET)
            .upload(path, d.bytes, { contentType: d.type, upsert: true, cacheControl: "86400" });
          if (upErr) throw upErr;
          paths.push(path);
          urls.push(`${publicBase}${path}${d.version ? `?v=${d.version}` : `?v=${Date.now()}`}`);
        }

        const { error: updErr } = await supabase
          .from("provider_tests")
          .update({ image_url: urls[0], gallery_image_urls: urls, image_is_stock: false })
          .eq("id", t.id);
        if (updErr) throw updErr;

        // Remove superseded copies only when they lived in our own bucket under
        // this provider's folder and are not among the files just written.
        const stale = [
          ...new Set(
            [t.image_url, ...(t.gallery_image_urls ?? [])]
              .filter((u): u is string => typeof u === "string" && u.startsWith(publicBase))
              .map((u) => u.slice(publicBase.length).split("?")[0])
              .filter((p) => p.startsWith(`${provider}/`) && !paths.includes(p)),
          ),
        ];
        let removed: string[] = [];
        if (stale.length) {
          const { error: rmErr } = await supabase.storage.from(BUCKET).remove(stale);
          if (!rmErr) removed = stale;
        }
        report.push({
          id: t.id,
          test: t.test_name,
          status: urls.length === 2 ? "box_and_biomarkers" : "box_only",
          removed_old: removed,
        });
      } catch (e) {
        console.error(`[provider-test-image-sync] ${t.id}`, e);
        report.push({ id: t.id, test: t.test_name, status: "error", error: String(e) });
      }
    }

    return json({
      provider,
      mode,
      processed: tests.length,
      next_after: tests.length === limit ? tests[tests.length - 1].id : null,
      report,
    });
  } catch (e) {
    return internalErrorResponse("provider-test-image-sync", e);
  }
});
