/**
 * Cloudflare Pages middleware: bot detection + prerendered HTML serving
 * + soft-404 elimination.
 *
 * Architecture
 *   - Humans (regular browsers): get the SPA shell as normal — zero UX change.
 *   - Bots (AI crawlers, search bots, social embed fetchers): get the
 *     prerendered HTML snapshot for the route, with full content visible
 *     in the initial response.
 *   - Unknown routes (whether bot or human): get the SPA shell with a real
 *     HTTP 404 status so crawlers stop wasting budget on them.
 *
 * Snapshots live at `dist/<route>/index.html` and are produced by
 * `scripts/prerender.mjs`. Routes not in the snapshot list fall through
 * to the SPA — bots will still see the empty shell for those.
 *
 * Lives under /functions so Cloudflare Pages picks it up automatically.
 */

import { isKnownRoute } from "./_known-routes";

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

/** Fetch the SPA shell (dist/index.html) so we can return it as a 404 body. */
async function fetchSpaShell(
  ctx: { env: Env; request: Request },
  origin: string,
): Promise<Response> {
  const shellReq = new Request(`${origin}/index.html`, {
    method: "GET",
    headers: { Accept: "text/html" },
  });
  return ctx.env.ASSETS.fetch(shellReq);
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

  const known = isKnownRoute(url.pathname);

  // ── Soft-404 fix ──────────────────────────────────────────────────────────
  // Unknown route → serve the SPA shell BODY but with HTTP 404 status.
  // The React app's NotFound component handles in-app rendering for humans;
  // crawlers see the 404 status and drop the URL from their queue.
  if (!known) {
    const shellRes = await fetchSpaShell(ctx, url.origin);
    const headers = new Headers(shellRes.headers);
    headers.set("X-Robots-Tag", "noindex, follow");
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    return new Response(shellRes.body, {
      status: 404,
      statusText: "Not Found",
      headers,
    });
  }

  // ── Known route ───────────────────────────────────────────────────────────
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
