export const CHECK_START_BUDGET_MS = 330_000;

export interface VerificationCounts {
  checked: number;
  ok: number;
  broken: number;
  rateLimited: number;
  inconclusive?: number;
}

export function oldestFirst<
  T extends { id: string; url_verified_at: string | null },
>(rows: T[]): T[] {
  const age = (value: string | null) => (value ? Date.parse(value) : -Infinity);
  return [...rows].sort(
    (a, b) =>
      age(a.url_verified_at) - age(b.url_verified_at) ||
      a.id.localeCompare(b.id),
  );
}

export function finalRunDetails(
  total: number,
  counts: VerificationCounts,
  failed: boolean,
) {
  const notReached = Math.max(0, total - counts.checked);
  return {
    status:
      failed ||
      notReached > 0 ||
      counts.rateLimited > 0 ||
      (counts.inconclusive ?? 0) > 0
        ? "partial"
        : "completed",
    checked: counts.checked,
    ok: counts.ok,
    broken: counts.broken,
    rate_limited: counts.rateLimited,
    not_reached: notReached,
    ...((counts.inconclusive ?? 0) > 0
      ? { inconclusive: counts.inconclusive }
      : {}),
  };
}

/** The cutoff governs new checks; in-flight requests retain their existing timeouts/retry. */
export async function runBudgetedPool<T>(
  rows: T[],
  options: {
    concurrency: number;
    staggerStartMs: number;
    staggerMaxMs: number;
    deadline: number;
    process: (row: T) => Promise<{ hit429: boolean }>;
    now: () => number;
    sleep: (ms: number) => Promise<unknown>;
  },
) {
  let cursor = 0;
  let lastStart = 0;
  let staggerMs = options.staggerStartMs;
  async function worker() {
    while (cursor < rows.length && options.now() < options.deadline) {
      const row = rows[cursor++];
      if (row === undefined) return;
      const wait = staggerMs - (options.now() - lastStart);
      if (wait > 0) await options.sleep(wait);
      // A stagger/retry in another worker may have taken us past the deadline.
      if (options.now() >= options.deadline) return;
      lastStart = options.now();
      const result = await options.process(row);
      if (result.hit429 && staggerMs < options.staggerMaxMs) {
        staggerMs = Math.min(staggerMs * 2, options.staggerMaxMs);
      }
    }
  }
  // Wait for every worker to settle before the final log, even if one fails.
  const settled = await Promise.allSettled(
    Array.from({ length: options.concurrency }, worker),
  );
  const failed = settled.find((result) => result.status === "rejected");
  if (failed?.status === "rejected") throw failed.reason;
}
