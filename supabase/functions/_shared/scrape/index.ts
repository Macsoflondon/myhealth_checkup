/**
 * Barrel export for the shared scrape library.
 *
 * Usage in a provider scraper:
 *   import {
 *     parsePrice, parseTurnaround, normaliseBiomarkers,
 *     upsertWithProvenance, startScrapeRun, finishScrapeRun,
 *     fetchTrustpilot, acquireRateToken, getProviderRateLimit, isAllowedByRobots,
 *   } from "../_shared/scrape/index.ts";
 */

export { parsePrice, type PriceParseResult } from "./parsePrice.ts";
export { parseTurnaround, type TurnaroundParseResult } from "./parseTurnaround.ts";
export { normaliseBiomarkers } from "./normaliseBiomarkers.ts";
export {
  writeHistorySnapshot,
  TRACKED_FIELDS,
  type ProviderTestSnapshot,
  type TrackedField,
} from "./history.ts";
export {
  upsertWithProvenance,
  type UpsertResult,
  type UpsertOptions,
} from "./upsertWithProvenance.ts";
export {
  startScrapeRun,
  finishScrapeRun,
  newCounters,
  type RunCounters,
} from "./runs.ts";
export { fetchTrustpilot, type TrustpilotResult } from "./fetchTrustpilot.ts";
export {
  isAllowedByRobots,
  acquireRateToken,
  getProviderRateLimit,
  PROVIDER_RATE_LIMITS,
  type RateLimitConfig,
} from "./robots.ts";
