/**
 * Provider blog aggregation. Server-only: reads public feeds and writes the
 * results to provider_blog_posts with the service-role client.
 */
import { BLOG_SOURCES, categoriseArticle, type BlogSource } from "./sources";

const USER_AGENT =
  "Mozilla/5.0 (compatible; myhealthcheckup-aggregator/1.0; +https://myhealthcheckup.co.uk)";

export interface AggregatedPost {
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

export interface ProviderRunResult {
  providerId: string;
  found: number;
  error?: string;
}

const decodeEntities = (input: string): string =>
  input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const stripHtml = (input: string): string =>
  decodeEntities(input.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

const truncate = (input: string, max = 220): string =>
  input.length <= max ? input : `${input.slice(0, max - 1).trimEnd()}…`;

const firstMatch = (xml: string, pattern: RegExp): string | null => {
  const match = pattern.exec(xml);
  return match?.[1] ? decodeEntities(match[1].trim()) : null;
};

const toIsoDate = (value: string | null): string | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

async function fetchText(url: string, timeoutMs = 20000): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function parseAtom(xml: string, source: BlogSource, feedUrl: string): AggregatedPost[] {
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
      firstMatch(entry, /<summary[^>]*>([\s\S]*?)<\/summary>/) ??
      firstMatch(entry, /<content[^>]*>([\s\S]*?)<\/content>/) ??
      "";
    const image = /<img[^>]+src="([^"]+)"/.exec(summaryHtml)?.[1] ?? null;
    const excerpt = truncate(stripHtml(summaryHtml));

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

function parseRss(xml: string, source: BlogSource, feedUrl: string): AggregatedPost[] {
  const items = xml.split(/<item[\s>]/).slice(1);
  const posts: AggregatedPost[] = [];

  for (const rawItem of items) {
    const item = rawItem.slice(0, rawItem.indexOf("</item>") + 1);
    const title = firstMatch(item, /<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const link = firstMatch(item, /<link>([\s\S]*?)<\/link>/);
    const published = toIsoDate(firstMatch(item, /<pubDate>([\s\S]*?)<\/pubDate>/));
    if (!title || !link || !published) continue;

    const descriptionHtml =
      firstMatch(item, /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/) ?? "";
    const contentHtml =
      firstMatch(item, /<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/) ?? "";
    const image = /<img[^>]+src="([^"]+)"/.exec(contentHtml || descriptionHtml)?.[1] ?? null;
    const excerpt = truncate(stripHtml(descriptionHtml));

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
    entries.push({ loc: loc.trim(), lastmod: toIsoDate(firstMatch(block, /<lastmod>([\s\S]*?)<\/lastmod>/)) });
  }

  return entries;
}

async function parseSitemapOg(source: BlogSource, sitemapUrl: string): Promise<AggregatedPost[]> {
  const xml = await fetchText(sitemapUrl, 30000);
  if (!xml) return [];

  const entries = parseSitemapEntries(xml, source.pathFilter ?? "/")
    .sort((a, b) => (b.lastmod ?? "").localeCompare(a.lastmod ?? ""))
    .slice(0, source.maxPages ?? 40);

  const posts: AggregatedPost[] = [];
  const batchSize = 6;

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const pages = await Promise.all(batch.map((entry) => fetchText(entry.loc, 15000)));

    pages.forEach((html, index) => {
      const entry = batch[index];
      if (!html || !entry) return;

      const meta = (property: string): string | null =>
        firstMatch(html, new RegExp(`<meta[^>]+(?:property|name)="${property}"[^>]+content="([^"]*)"`, "i")) ??
        firstMatch(html, new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="${property}"`, "i"));

      const title = meta("og:title") ?? firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/);
      if (!title) return;

      const excerpt = truncate(stripHtml(meta("og:description") ?? meta("description") ?? ""));
      const published =
        toIsoDate(meta("article:published_time")) ?? entry.lastmod ?? new Date().toISOString().slice(0, 10);

      posts.push({
        provider_id: source.providerId,
        provider_name: source.providerName,
        title: stripHtml(title).replace(/\s*\|\s*Thriva\s*$/i, ""),
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

async function collectForSource(source: BlogSource): Promise<AggregatedPost[]> {
  if (source.type === "sitemap-og") {
    const results = await Promise.all(source.urls.map((url) => parseSitemapOg(source, url)));
    return results.flat();
  }

  const feeds = await Promise.all(
    source.urls.map(async (url) => {
      const xml = await fetchText(url);
      if (!xml) return [];
      return source.type === "atom" ? parseAtom(xml, source, url) : parseRss(xml, source, url);
    }),
  );

  return feeds.flat();
}

/** Fetch every configured provider blog and upsert the results. */
export async function runBlogAggregation(): Promise<{
  totalUpserted: number;
  providers: ProviderRunResult[];
}> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const providers: ProviderRunResult[] = [];
  let totalUpserted = 0;

  for (const source of BLOG_SOURCES) {
    try {
      const posts = await collectForSource(source);
      const deduped = Array.from(new Map(posts.map((post) => [post.url, post])).values()).filter(
        (post) => post.title.length > 3,
      );

      if (deduped.length > 0) {
        const rows = deduped.map((post) => ({ ...post, last_seen_at: new Date().toISOString() }));
        const { error } = await supabaseAdmin
          .from("provider_blog_posts")
          .upsert(rows, { onConflict: "url" });
        if (error) throw new Error(error.message);
        totalUpserted += rows.length;
      }

      providers.push({ providerId: source.providerId, found: deduped.length });
    } catch (error) {
      providers.push({
        providerId: source.providerId,
        found: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return { totalUpserted, providers };
}
