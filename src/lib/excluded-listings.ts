/**
 * Catalogue rows that are services, not tests, and must not be listed.
 * Goodbody's "Blood Draw Appointment" is a blood-taking visit, not a test kit.
 */
const EXCLUDED: ReadonlyArray<{ provider: RegExp; name: RegExp }> = [
  { provider: /goodbody/, name: /^blood draw appointment$/ },
];

export function isExcludedListing(
  providerId: string | null | undefined,
  testName: string | null | undefined,
): boolean {
  const provider = (providerId ?? "").toLowerCase();
  const name = (testName ?? "").trim().toLowerCase();
  if (!provider || !name) return false;
  return EXCLUDED.some((e) => e.provider.test(provider) && e.name.test(name));
}
