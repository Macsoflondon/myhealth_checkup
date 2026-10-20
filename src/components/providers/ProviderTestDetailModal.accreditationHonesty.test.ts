import { describe, expect, it } from "vitest";
import { getAccreditations } from "@/components/providers/ProviderTestDetailModal";

/**
 * Regression guard for the accreditation-fallback cleanup (2026-10-20 test-card
 * audit, finding #7), fixed the same day the Randox turnaround gap (finding
 * #14) was, on explicit request to fix follow-up issues as they're found
 * rather than defer them.
 *
 * `getAccreditations` previously fell back to a hardcoded per-provider guess
 * (e.g. "UKAS accredited lab" for every Medichecks test) whenever a row had
 * none of the three real flags set. By the time this was removed, real-data
 * coverage was ≥96% for every provider, and the 5 remaining zero-flag rows
 * (all `clinilabs`) weren't even in the map — `clinilabs` had no entry — so
 * they were silently getting a second fabricated guess from the map's own
 * generic fallback. The function must now return an honest `[]` instead.
 */
describe("getAccreditations honesty", () => {
  it("returns real flags when any are set, regardless of provider", () => {
    expect(
      getAccreditations({
        provider_id: "medichecks",
        lab_ukas_accredited: true,
        lab_cqc_regulated: false,
        lab_iso15189: null,
      }),
    ).toEqual(["UKAS accredited lab"]);
  });

  it("combines all real flags that are set", () => {
    expect(
      getAccreditations({
        provider_id: "clinilabs",
        lab_ukas_accredited: true,
        lab_cqc_regulated: true,
        lab_iso15189: true,
      }),
    ).toEqual(["UKAS accredited lab", "CQC regulated", "ISO 15189"]);
  });

  it("returns an empty array, never a guessed badge, when a row has no real flags — even for a provider the old map guessed for", () => {
    expect(
      getAccreditations({
        provider_id: "medichecks",
        lab_ukas_accredited: false,
        lab_cqc_regulated: null,
        lab_iso15189: null,
      }),
    ).toEqual([]);
  });

  it("returns an empty array for a provider the old map had no entry for either", () => {
    expect(
      getAccreditations({
        provider_id: "clinilabs",
        lab_ukas_accredited: null,
        lab_cqc_regulated: null,
        lab_iso15189: null,
      }),
    ).toEqual([]);
  });
});
