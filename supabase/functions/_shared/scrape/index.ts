/**
 * Barrel export for the shared scrape library.
 *
 * Usage in a provider scraper:
 *   import {
 *     parsePrice, parseTurnaround, normaliseBiomarkers,
 *     upsertWithProvenance, startScrapeRun, finishScrapeRun,
 *   } from "../_shared/scrape/index.ts";
 */

export { parsePrice, type PriceParseResult } from "./parsePrice.ts";
export {
  parseTurnaround,
  turnaroundColumns,
  type TurnaroundParseResult,
  type TurnaroundColumns,
} from "./parseTurnaround.ts";
export { normaliseBiomarkers } from "./normaliseBiomarkers.ts";
export {
  sanitiseBiomarkerEntries,
  isBiomarkerDebris,
} from "./sanitiseBiomarkerEntries.ts";
export { isJunkTestName } from "./isJunkTestName.ts";
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
export {
  isAllowedByRobots,
  acquireRateToken,
  getProviderRateLimit,
  PROVIDER_RATE_LIMITS,
  type RateLimitConfig,
} from "./robots.ts";
