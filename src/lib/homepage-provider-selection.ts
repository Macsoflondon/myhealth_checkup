export const HOMEPAGE_PROVIDER_IDS = [
  "lola-health",
  "goodbody-clinic",
  "medichecks",
  "randox",
  "london-medical-laboratory",
  "london-health-company",
  "medical-diagnosis",
  "clinilabs",
] as const;

export interface ShowcaseCandidate {
  id: string;
  provider_id: string;
  test_name: string;
  price: number | null;
  url: string | null;
  is_addon?: boolean | null;
  is_popular?: boolean | null;
  popularity_rank?: number | null;
}

export function selectHomepageProviderTests<T extends ShowcaseCandidate>(
  tests: readonly T[],
  limit = 9,
): T[] {
  const providers = new Set<string>(HOMEPAGE_PROVIDER_IDS);
  const seen = new Set<string>();
  const eligible = tests.filter((test) => {
    const key = `${test.provider_id}:${test.test_name.trim().toLowerCase()}`;
    if (
      !providers.has(test.provider_id) ||
      !test.url ||
      test.price == null ||
      test.price <= 0 ||
      test.is_addon === true ||
      /appointment|consultation|microsuction|coming soon/i.test(
        test.test_name,
      ) ||
      seen.has(key)
    )
      return false;
    seen.add(key);
    return true;
  });
  const buckets = HOMEPAGE_PROVIDER_IDS.map((providerId) =>
    eligible
      .filter((test) => test.provider_id === providerId)
      .sort(
        (a, b) =>
          Number(b.is_popular === true) - Number(a.is_popular === true) ||
          (a.popularity_rank ?? Infinity) - (b.popularity_rank ?? Infinity) ||
          a.test_name.localeCompare(b.test_name, "en-GB") ||
          a.id.localeCompare(b.id),
      ),
  );
  const result: T[] = [];
  for (const round of [0, 1, 2]) {
    for (const bucket of buckets) {
      const next = bucket[round];
      if (next && result.length < limit) result.push(next);
    }
  }
  return result;
}
