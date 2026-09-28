/**
 * Booking-link state derived from provider_tests.url / url_verified.
 * url_verified: null = never checked, true = passed, false = last check failed.
 * Only a missing URL or an explicit failed check yields "Enquire".
 */
export type BookingLinkState = "no_url" | "unchecked" | "verified" | "failed";

export function getBookingLinkState(
  url: string | null | undefined,
  urlVerified: boolean | null | undefined,
): BookingLinkState {
  if (!url || url === "#") return "no_url";
  if (urlVerified === true) return "verified";
  if (urlVerified === false) return "failed";
  return "unchecked";
}

export function canBookDirect(
  url: string | null | undefined,
  urlVerified: boolean | null | undefined,
): boolean {
  const state = getBookingLinkState(url, urlVerified);
  return state === "verified" || state === "unchecked";
}
