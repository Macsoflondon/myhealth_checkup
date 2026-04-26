/**
 * Cloudflare Pages middleware: bot detection + prerendered HTML serving.
 *
 * Architecture
 *   - Humans (regular browsers): get the SPA shell as normal — zero UX change.
 *   - Bots (AI crawlers, search bots, social embed fetchers): get the
 *     prerendered HTML snapshot for the route, with full content visible
 *     in the initial response.
 *
 * Snapshots live at `dist/<route>/index.html` and are produced by
 * `scripts/prerender.mjs`. Routes not in the snapshot list fall through
 * to the SPA — bots will still see the empty shell for those, which is
 * the same behaviour as today (acceptable for phase 1).
 *
 * Lives under /functions so Cloudflare Pages picks it up automatically.
 */

const BOT_UA_PATTERNS = [
  // OpenAI
  /GPTBot/i,
  /OAI-SearchBot/i,
  /ChatGPT-User/i,
  // Anthropic
  /ClaudeBot/i,
  /Claude-Web/i,
  /anthropic-ai/i,
  // Perplexity
  /PerplexityBot/i,
  // Google
  /Googlebot/i,
  /Google-Extended/i,
  // Microsoft / Bing
  /Bingbot/i,
  /BingPreview/i,
  // Apple
  /Applebot/i,
  /Applebot-Extended/i,
  // Others
  /DuckDuckBot/i,
  /YandexBot/i,
  /Baiduspider/i,
  // Social / link previews (need OG tags rendered)
  /facebookexternalhit/i,
  /Twitterbot/i,
  /LinkedInBot/i,
  /Slackbot/i,
  /WhatsApp/i,
  /TelegramBot/i,
  /Discordbot/i,
];

function isBot(ua: string | null): boolean {
  if (!ua) return false;
  return BOT_UA_PATTERNS.some((re) => re.test(ua));
}

function isHtmlNavigation(url: URL, accept: string | null): boolean {
  // Skip asset paths
  const ext = url.pathname.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase();
  if (ext && ext !== ".html") return false;
  // Browsers / bots requesting an HTML page send Accept: text/html
  // (or */*). Anything obviously non-HTML, skip.
  if (accept && !accept.includes("text/html") && !accept.includes("*/*")) {
    return false;
  }
  return true;
}

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const ua = ctx.request.headers.get("user-agent");
  const accept = ctx.request.headers.get("accept");

  // Always skip non-GET/HEAD or non-HTML requests
  if (!["GET", "HEAD"].includes(ctx.request.method)) {
    return ctx.next();
  }
  if (!isHtmlNavigation(url, accept)) {
    return ctx.next();
  }

  // Humans → normal SPA flow
  if (!isBot(ua)) {
    return ctx.next();
  }

  // Bots → look for a prerendered snapshot at <route>/index.html.
  // ctx.env.ASSETS serves files from /dist; if the snapshot exists for this
  // path it returns 200, otherwise 404 → fall through to the SPA shell.
  const snapshotPath =
    url.pathname === "/"
      ? "/index.html"
      : `${url.pathname.replace(/\/$/, "")}/index.html`;

  const snapshotUrl = new URL(snapshotPath, url.origin);
  const snapshotReq = new Request(snapshotUrl.toString(), {
    method: "GET",
    headers: { Accept: "text/html" },
  });

  const snapshotRes = await ctx.env.ASSETS.fetch(snapshotReq);

  if (snapshotRes.ok) {
    // Serve the snapshot with bot-friendly cache headers.
    // Vary on User-Agent so CDN doesn't serve bot HTML to humans.
    const headers = new Headers(snapshotRes.headers);
    headers.set("X-Prerendered", "true");
    headers.set("Vary", "User-Agent");
    headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
    return new Response(snapshotRes.body, {
      status: 200,
      headers,
    });
  }

  // No snapshot → fall back to SPA shell (same as today's behaviour for bots).
  return ctx.next();
};
