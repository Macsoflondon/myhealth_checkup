/**
 * Single switch for the homepage AI test explainer. Client-safe: no server
 * imports, so the section component and the server functions read the same
 * value.
 *
 * The explainer is archived (unmounted from src/pages/Index.tsx since the
 * 3 November 2026 review). While TEST_EXPLAINER_ENABLED is false:
 * - explainTestForVisitor validates its input, then refuses without reading
 *   the catalogue or calling the model;
 * - listExplainableTests returns [] without reading the catalogue;
 * - TestExplainerSection renders nothing, even if it is mounted again.
 *
 * To restore it:
 * 1. Replace the in-memory per-instance limiter in test-explainer.server.ts
 *    with a shared, database-backed counter (atomic increment keyed by the
 *    trusted client address from client-address.ts), then set
 *    TEST_EXPLAINER_SHARED_RATE_LIMIT to true.
 * 2. Set TEST_EXPLAINER_ENABLED to true.
 * 3. Mount <TestExplainerSection /> in src/pages/Index.tsx.
 * Setting only TEST_EXPLAINER_ENABLED keeps the explainer off: the check
 * below fails closed until the shared limiter exists.
 */
export const TEST_EXPLAINER_ENABLED = false;

/**
 * True only once explainTest rate-limits through shared storage. The current
 * limiter is a per-server-instance Map, so each instance (and each cold start)
 * grants a fresh allowance and anonymous traffic is not bounded globally.
 */
export const TEST_EXPLAINER_SHARED_RATE_LIMIT = false;

export interface TestExplainerFlags {
  enabled: boolean;
  sharedRateLimit: boolean;
}

/** Fails closed: both the switch and the shared limiter must be in place. */
export function isTestExplainerEnabled(
  flags: TestExplainerFlags = {
    enabled: TEST_EXPLAINER_ENABLED,
    sharedRateLimit: TEST_EXPLAINER_SHARED_RATE_LIMIT,
  },
): boolean {
  return flags.enabled === true && flags.sharedRateLimit === true;
}
