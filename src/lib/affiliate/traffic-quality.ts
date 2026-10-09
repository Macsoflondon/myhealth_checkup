/**
 * Labels outbound clicks that are probably not a person, at ingest time.
 * The endpoint reads the user agent here and discards it; only the label is
 * stored (affiliate_clicks.traffic_flag). Flagged clicks stay in the table
 * and in the dashboard's raw totals, but not in qualified clicks.
 */

export type TrafficFlag = "headless" | "bot" | "burst";

/** Clicks from one address within a minute before later ones count as a burst. */
export const AFFILIATE_BURST_THRESHOLD = 10;

const HEADLESS_UA =
  /HeadlessChrome|Playwright|Puppeteer|PhantomJS|Lighthouse|Selenium|webdriver|Cypress/i;

// "bot" only as a whole word or as a crawler name before "/", so handset
// names such as "CUBOT X30" are not caught.
const BOT_UA =
  /(?:^|[^a-z])bot(?:[^a-z]|$)|[a-z]bot\/|crawler|spider|crawling|slurp|facebookexternalhit|embedly|curl\/|wget\/|python-requests|go-http-client|node-fetch|axios\/|okhttp/i;

export function classifyTraffic(
  userAgent: string | null | undefined,
  overBurstThreshold: boolean,
): TrafficFlag | null {
  const ua = (userAgent ?? "").trim();
  if (HEADLESS_UA.test(ua)) return "headless";
  // Browsers always send a user agent; an empty one is a script.
  if (ua === "" || BOT_UA.test(ua)) return "bot";
  return overBurstThreshold ? "burst" : null;
}
