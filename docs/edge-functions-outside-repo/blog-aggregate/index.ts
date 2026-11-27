// Provider blog aggregation (edge function). Called daily by pg_cron job
// aggregate-provider-blogs via public.call_edge_with_automations. Reads public
// provider feeds and upserts into provider_blog_posts with the service-role
// client. Ported from src/lib/blog/aggregator.server.ts.
// Auth: service-role credential only. Accepts the runtime key, or a legacy
// service_role JWT that GoTrue itself verifies (pg_cron sends the legacy JWT
// from Vault, while the runtime key is the newer sb_secret_ format).
// Execution: providers run in parallel and the work continues in the
// background after a 202, because pg_cron's HTTP call gives up after 5 seconds
// and the run takes longer than that.
// Rate limits: Shopify-hosted blogs answer shared cloud IPs with HTTP 429, so
// feed requests retry with escalating waits before giving up.
// 2026-11-27 (platform screening): one complete entity decoder shared with the
// site; EDGE (sports-blood-tests) edge-index articles; a repair pass for stored
// titles and excerpts that still hold entities; article pages are fetched only
// for posts not already stored with an image and summary, and the backfill pass
// is limited to recent posts, so a run no longer re-reads hundreds of pages and
// meets Shopify rate limits.
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  BLOG_SOURCES,
  categoriseArticle,
  type BlogSource,
} from "../_shared/blog/sources.ts";
import { decodeEntities } from "../_shared/blog/decode-entities.ts";
import {
  edgeArticleLinks,
  edgeArticlePublicationDate,
} from "../_shared/blog/edge-articles.ts";
import { repairStoredEntities } from "../_shared/blog/entity-repair.ts";

declare const EdgeRuntime:
  | { waitUntil(promise: Promise<unknown>): void }
  | undefined;

const USER_AGENT =
  "Mozilla/5.0 (compatible; myhealthcheckup-aggregator/1.0; +https://myhealthcheckup.co.uk)";

interface AggregatedPost {
  provider_id: string;
  provider_name: string;
  title: string;
  excerpt: string;
  url: string;
  image_url: string | null;
  category: string;
  published_at: string;
  source_type: string;
  source_url: string;
}

interface ProviderRunResult {
  providerId: string;
  found: number;
  error?: string;
}

const stripHtml = (input: string): string =>
  decodeEntities(input.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

const stripCdata = (input: string): string =>
  input
    .replace(/^\s*<!\[CDATA\[/, "")
    .replace(/\]\]>\s*$/, "")
    .trim();

const truncate = (input: string, max = 220): string =>
  input.length <= max ? input : `${input.slice(0, max - 1).trimEnd()}…`;

/** Feed summaries commonly end in link boilerplate; drop it before truncating. */
const cleanSummary = (input: string): string =>
  input
    .replace(/\]\]>/g, " ")
    .replace(
      /\b(?:read|continue reading|learn|find out)\s+more\s*[.…>»]*\s*$/i,
      "",
    )
    .replace(/^\s*(?:read|continue reading)\s+more\s*$/i, "")
    .replace(/The post .+ appeared first on .+$/i, "")
    .replace(/\s+/g, " ")
    .trim();

const firstMatch = (xml: string, pattern: RegExp): string | null => {
  const match = pattern.exec(xml);
  return match?.[1] ? decodeEntities(stripCdata(match[1]).trim()) : null;
};

const toIsoDate = (value: string | null): string | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Posts published within this many days may still gain an image or summary. */
const RECENT_DAYS = 30;

async function fetchOnce(
  url: string,
  timeoutMs: number,
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
      signal: controller.signal,
    });
    if (!response.ok) {
      console.warn(`blog-aggregate: HTTP ${response.status} for ${url}`);
      await response.body?.cancel();
      return null;
    }
    return await response.text();
  } catch (error) {
    console.warn(`blog-aggregate: fetch failed for ${url}: ${String(error)}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Providers throttle bursts, so retry with an escalating wait. */
async function fetchText(
  url: string,
  timeoutMs = 20000,
  attempts = 2,
  backoffMs = 800,
): Promise<string | null> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const text = await fetchOnce(url, timeoutMs);
    if (text) return text;
    if (attempt < attempts - 1) await sleep(backoffMs * (attempt + 1));
  }
  return null;
}

function parseAtom(
  xml: string,
  source: BlogSource,
  feedUrl: string,
): AggregatedPost[] {
  const entries = xml.split(/<entry[\s>]/).slice(1);
  const posts: AggregatedPost[] = [];

  for (const rawEntry of entries) {
    const entry = rawEntry.slice(0, rawEntry.indexOf("</entry>") + 1);
    const title = firstMatch(entry, /<title[^>]*>([\s\S]*?)<\/title>/);
    const link =
      firstMatch(entry, /<link[^>]*rel="alternate"[^>]*href="([^"]+)"/) ??
      firstMatch(entry, /<link[^>]*href="([^"]+)"/);
    const published = toIsoDate(
      firstMatch(entry, /<published>([\s\S]*?)<\/published>/) ??
        firstMatch(entry, /<updated>([\s\S]*?)<\/updated>/),
    );
    if (!title || !link || !published) continue;

    const summaryHtml =
      firstMatch(entry, /<summary[^>]*>([\s\S]*?)<\/summary>/) ?? "";
    const contentHtml =
      firstMatch(entry, /<content[^>]*>([\s\S]*?)<\/content>/) ?? "";
    const image =
      /<img[^>]+src="([^"]+)"/.exec(contentHtml || summaryHtml)?.[1] ?? null;
    const summaryText = cleanSummary(stripHtml(summaryHtml));
    const contentText = cleanSummary(stripHtml(contentHtml));
    const excerpt = truncate(
      summaryText.length >= 60 ? summaryText : contentText || summaryText,
    );

    posts.push({
      provider_id: source.providerId,
      provider_name: source.providerName,
      title: stripHtml(title),
      excerpt,
      url: link,
      image_url: image ? image.replace(/^\/\//, "https://") : null,
      category: categoriseArticle(`${title} ${excerpt} ${feedUrl}`),
      published_at: published,
      source_type: "atom",
      source_url: feedUrl,
    });
  }

  return posts;
}

function parseRss(
  xml: string,
  source: BlogSource,
  feedUrl: string,
): AggregatedPost[] {
  const items = xml.split(/<item[\s>]/).slice(1);
  const posts: AggregatedPost[] = [];

  for (const rawItem of items) {
    const item = rawItem.slice(0, rawItem.indexOf("</item>") + 1);
    const title = firstMatch(
      item,
      /<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/,
    );
    const link = firstMatch(item, /<link>([\s\S]*?)<\/link>/);
    const published = toIsoDate(
      firstMatch(item, /<pubDate>([\s\S]*?)<\/pubDate>/),
    );
    if (!title || !link || !published) continue;

    const descriptionHtml =
      firstMatch(
        item,
        /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/,
      ) ?? "";
    const contentHtml =
      firstMatch(
        item,
        /<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/,
      ) ?? "";
    const image =
      /<img[^>]+src="([^"]+)"/.exec(contentHtml || descriptionHtml)?.[1] ??
      null;
    const excerpt = truncate(
      cleanSummary(stripHtml(descriptionHtml)) ||
        cleanSummary(stripHtml(contentHtml)),
    );

    posts.push({
      provider_id: source.providerId,
      provider_name: source.providerName,
      title: stripHtml(title),
      excerpt,
      url: link.trim(),
      image_url: image,
      category: categoriseArticle(`${title} ${excerpt}`),
      published_at: published,
      source_type: "rss",
      source_url: feedUrl,
    });
  }

  return posts;
}

interface SitemapEntry {
  loc: string;
  lastmod: string | null;
}

function parseSitemapEntries(xml: string, pathFilter: string): SitemapEntry[] {
  const blocks = xml.split(/<url[\s>]/).slice(1);
  const entries: SitemapEntry[] = [];

  for (const block of blocks) {
    const loc = firstMatch(block, /<loc>([\s\S]*?)<\/loc>/);
    if (!loc || !loc.includes(pathFilter)) continue;
    entries.push({
      loc: loc.trim(),
      lastmod: toIsoDate(firstMatch(block, /<lastmod>([\s\S]*?)<\/lastmod>/)),
    });
  }

  return entries;
}

async function parseSitemapOg(
  source: BlogSource,
  sitemapUrl: string,
): Promise<AggregatedPost[]> {
  const xml = await fetchText(sitemapUrl, 30000);
  if (!xml) return [];

  const entries = parseSitemapEntries(xml, source.pathFilter ?? "/")
    .sort((a, b) => (b.lastmod ?? "").localeCompare(a.lastmod ?? ""))
    .slice(0, source.maxPages ?? 40);

  const posts: AggregatedPost[] = [];
  const batchSize = 6;

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const pages = await Promise.all(
      batch.map((entry) => fetchText(entry.loc, 15000)),
    );

    pages.forEach((html, index) => {
      const entry = batch[index];
      if (!html || !entry) return;

      const meta = (property: string): string | null =>
        firstMatch(
          html,
          new RegExp(
            `<meta[^>]+(?:property|name)="${property}"[^>]+content="([^"]*)"`,
            "i",
          ),
        ) ??
        firstMatch(
          html,
          new RegExp(
            `<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="${property}"`,
            "i",
          ),
        );

      const title =
        meta("og:title") ?? firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/);
      if (!title) return;

      const excerpt = truncate(
        stripHtml(meta("og:description") ?? meta("description") ?? ""),
      );
      const published =
        toIsoDate(meta("article:published_time")) ??
        entry.lastmod ??
        new Date().toISOString().slice(0, 10);

      posts.push({
        provider_id: source.providerId,
        provider_name: source.providerName,
        title: stripHtml(title),
        excerpt,
        url: entry.loc,
        image_url: meta("og:image"),
        category: categoriseArticle(`${title} ${excerpt} ${entry.loc}`),
        published_at: published,
        source_type: "sitemap-og",
        source_url: sitemapUrl,
      });
    });
  }

  return posts;
}

async function collectEdgeIndex(source: BlogSource): Promise<AggregatedPost[]> {
  const indexUrl = source.urls[0];
  const index = indexUrl ? await fetchText(indexUrl, 20000) : null;
  if (!index) throw new Error("EDGE article index unavailable");
  const posts: AggregatedPost[] = [];
  const links = edgeArticleLinks(index).slice(0, source.maxPages ?? 100);
  for (const url of links) {
    const html = await fetchText(url, 15000);
    if (!html) continue;
    const published = edgeArticlePublicationDate(html);
    // The table requires a date. Never invent one when the provider omits it.
    if (!published) continue;
    const title = firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (!title) continue;
    const intro = firstMatch(
      html,
      /<h1[^>]*>[\s\S]*?<\/h1>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i,
    );
    const excerpt = truncate(
      stripHtml(intro ?? metaFrom(html, "description") ?? ""),
    );
    const image = metaFrom(html, "og:image");
    posts.push({
      provider_id: source.providerId,
      provider_name: source.providerName,
      title: stripHtml(title),
      excerpt,
      url,
      image_url:
        image && !isGenericImage(image) && !/edge-icon/i.test(image)
          ? image
          : null,
      category: categoriseArticle(`${title} ${excerpt}`),
      published_at: published,
      source_type: "edge-index",
      source_url: indexUrl,
    });
    await sleep(250);
  }
  return posts;
}

async function collectForSource(source: BlogSource): Promise<AggregatedPost[]> {
  if (source.type === "edge-index") return collectEdgeIndex(source);
  if (source.type === "sitemap-og") {
    const results = await Promise.all(
      source.urls.map((url) => parseSitemapOg(source, url)),
    );
    return results.flat();
  }

  // Fetch feeds a few at a time; providers reject large parallel bursts.
  // Feeds retry up to five times with waits of 6, 12, 18 and 24 seconds.
  const posts: AggregatedPost[] = [];
  const batchSize = 3;

  for (let i = 0; i < source.urls.length; i += batchSize) {
    const batch = source.urls.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (url) => {
        const xml = await fetchText(url, 20000, 5, 6000);
        if (!xml) return [] as AggregatedPost[];
        return source.type === "atom"
          ? parseAtom(xml, source, url)
          : parseRss(xml, source, url);
      }),
    );
    posts.push(...results.flat());
    await sleep(300);
  }

  return posts;
}

const metaFrom = (html: string, property: string): string | null =>
  firstMatch(
    html,
    new RegExp(
      `<meta[^>]+(?:property|name)="${property}"[^>]+content="([^"]*)"`,
      "i",
    ),
  ) ??
  firstMatch(
    html,
    new RegExp(
      `<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="${property}"`,
      "i",
    ),
  );

const absoluteUrl = (value: string, base: string): string | null => {
  try {
    const resolved = new URL(value.replace(/^\/\//, "https://"), base);
    resolved.protocol = "https:";
    return resolved.toString();
  } catch {
    return null;
  }
};

/** Provider logos and placeholder banners are not article imagery. */
const isGenericImage = (url: string): boolean =>
  /logo|placeholder|default[-_]?(?:image|banner)|favicon|og[-_]?default/i.test(
    url,
  );

const applyMeta = (post: AggregatedPost, html: string): void => {
  if (!post.image_url) {
    const image =
      metaFrom(html, "og:image:secure_url") ??
      metaFrom(html, "og:image") ??
      metaFrom(html, "twitter:image");
    const resolved = image ? absoluteUrl(image, post.url) : null;
    if (resolved && !isGenericImage(resolved)) post.image_url = resolved;
  }

  if (post.excerpt.length < 60) {
    const description = cleanSummary(
      stripHtml(
        metaFrom(html, "og:description") ?? metaFrom(html, "description") ?? "",
      ),
    );
    if (description.length > post.excerpt.length)
      post.excerpt = truncate(description);
  }
};

const needsEnrichment = (post: AggregatedPost): boolean =>
  !post.image_url || post.excerpt.length < 60;

/**
 * Feed summaries are often empty or boilerplate and Shopify feeds carry no
 * hero image, so fill the gaps from each article's own Open Graph tags. Two
 * passes, because providers throttle bursts of requests.
 */
async function enrichFromArticlePages(posts: AggregatedPost[]): Promise<void> {
  const batchSize = 4;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const needy = posts.filter(needsEnrichment);
    if (needy.length === 0) return;

    for (let i = 0; i < needy.length; i += batchSize) {
      const batch = needy.slice(i, i + batchSize);
      const pages = await Promise.all(
        batch.map((post) => fetchText(post.url, 20000)),
      );

      pages.forEach((html, index) => {
        const post = batch[index];
        if (html && post) applyMeta(post, html);
      });

      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
}

/**
 * Self-healing pass over rows already stored: any article still missing a hero
 * image or carrying a stub summary is re-read from its own page. Providers
 * sometimes throttle a run, so this catches up on the next one.
 */
async function backfillStoredPosts(
  supabase: SupabaseClient,
  limit = 50,
): Promise<number> {
  const since = new Date(Date.now() - RECENT_DAYS * 86400000)
    .toISOString()
    .slice(0, 10);
  const { data, error } = await supabase
    .from("provider_blog_posts")
    .select(
      "url, provider_id, provider_name, title, excerpt, image_url, category, published_at, source_type, source_url",
    )
    .or("image_url.is.null,excerpt.is.null")
    .gte("published_at", since)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) return 0;

  const posts = (data as Array<Omit<AggregatedPost, "excerpt"> & { excerpt: string | null }>).map(
    (row) => ({ ...row, excerpt: row.excerpt ?? "" }),
  );
  await enrichFromArticlePages(posts);

  const improved = posts.filter(
    (post) => post.image_url || post.excerpt.length >= 60,
  );
  if (improved.length === 0) return 0;

  const { error: upsertError } = await supabase
    .from("provider_blog_posts")
    .upsert(
      improved.map((post) => ({
        ...post,
        last_seen_at: new Date().toISOString(),
      })),
      { onConflict: "url" },
    );

  return upsertError ? 0 : improved.length;
}

/**
 * Copy the stored image and summary onto feed posts already in the table, so
 * article pages are fetched only for posts that are new or still incomplete
 * and recent. Re-reading every stored article each day met Shopify's rate
 * limits (1,792 refusals in the 22 Nov 04:00 UTC run).
 */
async function mergeStoredDetails(
  supabase: SupabaseClient,
  posts: AggregatedPost[],
): Promise<AggregatedPost[]> {
  const stored = new Map<string, { image_url: string | null; excerpt: string | null; published_at: string }>();
  for (let i = 0; i < posts.length; i += 100) {
    const urls = posts.slice(i, i + 100).map((post) => post.url);
    const { data, error } = await supabase
      .from("provider_blog_posts")
      .select("url, image_url, excerpt, published_at")
      .in("url", urls);
    if (error) throw new Error(error.message);
    for (const row of (data ?? []) as Array<{ url: string; image_url: string | null; excerpt: string | null; published_at: string }>) {
      stored.set(row.url, row);
    }
  }
  const recent = Date.now() - RECENT_DAYS * 86400000;
  const needsFetch: AggregatedPost[] = [];
  for (const post of posts) {
    const row = stored.get(post.url);
    if (row) {
      if (!post.image_url && row.image_url) post.image_url = row.image_url;
      if (post.excerpt.length < 60 && (row.excerpt ?? "").length > post.excerpt.length) {
        post.excerpt = row.excerpt ?? post.excerpt;
      }
    }
    const isRecent = Date.parse(post.published_at) >= recent;
    if (needsEnrichment(post) && (!row || isRecent)) needsFetch.push(post);
  }
  return needsFetch;
}

/** Fetch one provider's blog and upsert the results. */
async function runSource(
  supabase: SupabaseClient,
  source: BlogSource,
): Promise<ProviderRunResult & { upserted: number }> {
  try {
    const posts = await collectForSource(source);
    const deduped = Array.from(
      new Map(posts.map((post) => [post.url, post])).values(),
    ).filter((post) => post.title.length > 3);

    await enrichFromArticlePages(await mergeStoredDetails(supabase, deduped));

    let upserted = 0;
    if (deduped.length > 0) {
      const rows = deduped.map((post) => ({
        ...post,
        last_seen_at: new Date().toISOString(),
      }));
      const { error } = await supabase
        .from("provider_blog_posts")
        .upsert(rows, { onConflict: "url" });
      if (error) throw new Error(error.message);
      upserted = rows.length;
    }

    return { providerId: source.providerId, found: deduped.length, upserted };
  } catch (error) {
    return {
      providerId: source.providerId,
      found: 0,
      upserted: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/** Run every configured provider in parallel, then the backfill pass. */
async function runBlogAggregation(supabase: SupabaseClient): Promise<{
  totalUpserted: number;
  backfilled: number;
  repaired: number;
  providers: ProviderRunResult[];
}> {
  const results = await Promise.all(
    BLOG_SOURCES.map((source) => runSource(supabase, source)),
  );
  const providers: ProviderRunResult[] = results.map(
    ({ providerId, found, error }) => ({ providerId, found, error }),
  );
  const totalUpserted = results.reduce((sum, r) => sum + r.upserted, 0);
  const backfilled = await backfillStoredPosts(supabase);
  const repaired = await repairStoredEntities(supabase);

  return { totalUpserted, backfilled, repaired, providers };
}

/** Constant-time string comparison (avoids leaking the key via timing). */
function timingSafeEqualStr(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ab.length ^ bb.length;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i += 1) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

/** GoTrue admin endpoints only accept a verified service_role credential. */
async function isServiceRoleToken(
  supabaseUrl: string,
  token: string,
): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=1`,
      { headers: { apikey: token, Authorization: `Bearer ${token}` } },
    );
    await res.body?.cancel();
    return res.ok;
  } catch {
    return false;
  }
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("blog-aggregate: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
    return json({ error: "Server misconfigured" }, 500);
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer /, "");
  const allowed =
    timingSafeEqualStr(authHeader, `Bearer ${serviceKey}`) ||
    (await isServiceRoleToken(supabaseUrl, token));
  if (!allowed) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const job = runBlogAggregation(supabase)
    .then((result) => {
      console.log("blog-aggregate: done", JSON.stringify(result));
      if (result.providers.every((p) => p.found === 0)) {
        console.error(
          "blog-aggregate: every provider returned zero posts",
          JSON.stringify(result.providers),
        );
      }
      return result;
    })
    .catch((error) => {
      console.error("blog-aggregate: run failed", String(error));
    });

  if (typeof EdgeRuntime !== "undefined") {
    EdgeRuntime.waitUntil(job);
    return json({ ok: true, status: "started" }, 202);
  }

  const result = await job;
  return json({ ok: true, ...(result ?? {}) });
});
