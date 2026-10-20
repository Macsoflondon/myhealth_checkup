import { describe, expect, it } from "vitest";
import { formatTurnaround } from "@/components/providers/ProviderTestDetailModal";

/**
 * Regression guard for the Randox turnaround-honesty fix (2026-10-20 test-card
 * audit, finding #14, fixed on explicit request after being flagged as a
 * data/product question earlier in the same audit).
 *
 * `formatTurnaround` is the last link in `test.turnaround_days_text ||
 * goodbodyStatic?.turnaround || formatTurnaround(test.provider_id) || "Not
 * stated"` in `ProviderTestDetailModal.tsx` — reached only when a test has
 * no real turnaround data of its own. Randox's real-data coverage was 28/65
 * (43%) at the time this was found; the other 37 tests were all showing a
 * blanket "24 hours" that was never backed by that specific test's data.
 * Randox (and its `randox-health` alias) must now return null here, letting
 * the call site's own `|| "Not stated"` take over — never silently re-guess
 * through a generic fallback, which is exactly the bug the `||` operator
 * would reintroduce if this function used it instead of the `in` check.
 */
describe("formatTurnaround honesty", () => {
  it("returns null for randox, not a guessed turnaround", () => {
    expect(formatTurnaround("randox")).toBeNull();
  });

  it("returns null for the randox-health alias too", () => {
    expect(formatTurnaround("randox-health")).toBeNull();
  });

  it("is case-insensitive for the randox null case", () => {
    expect(formatTurnaround("Randox")).toBeNull();
    expect(formatTurnaround("RANDOX-HEALTH")).toBeNull();
  });

  it("other providers with their own entries are unaffected", () => {
    expect(formatTurnaround("medichecks")).toBe("2-3 working days");
    expect(formatTurnaround("lola-health")).toBe("3–5 working days");
  });

  it("a provider with no entry at all still gets the generic guess", () => {
    // Deliberately not Randox: confirms `in defaults` correctly
    // distinguishes "explicitly null" from "not in the map at all" —
    // the bug a naive `defaults[id] || "2–5 working days"` would have
    // reintroduced for the null case.
    expect(formatTurnaround("some-new-provider")).toBe("2–5 working days");
  });
});
