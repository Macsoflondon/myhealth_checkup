import { describe, expect, it } from "vitest";
import { toUnifiedCardProps } from "@/lib/unifiedCardAdapter";
import { fromLegacyUnified } from "@/lib/universalTestAdapter";
import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";

/**
 * Regression guard for a real bug found during the 2026-09-14 test-card
 * audit: `toUnifiedCardProps` defaulted a genuinely-null `price` to `0`,
 * which `UniversalTestCard` then rendered as the literal, false claim
 * "£0.00" instead of its own honest "POA" fallback for missing prices.
 *
 * A null price must survive `toUnifiedCardProps` → `fromLegacyUnified`
 * unchanged, so `UniversalTestData.price` stays null and the card's own
 * `displayPrice != null` check can do its job.
 */

const rowWithNoPrice: ProviderTestCardData = {
  id: "no-price-test",
  provider_id: "medichecks",
  test_name: "Example Unpriced Test",
  description: null,
  price: null,
};

const rowWithZeroPrice: ProviderTestCardData = {
  id: "zero-price-test",
  provider_id: "medichecks",
  test_name: "Example Zero-Price Test",
  description: null,
  price: 0,
};

describe("toUnifiedCardProps price honesty", () => {
  it("keeps a null price null, never defaulting to 0", () => {
    const props = toUnifiedCardProps(rowWithNoPrice, { provider: "Medichecks" });
    expect(props.price).toBeNull();
  });

  it("a null price stays null through fromLegacyUnified too", () => {
    const props = toUnifiedCardProps(rowWithNoPrice, { provider: "Medichecks" });
    const universal = fromLegacyUnified(props);
    expect(universal.price).toBeNull();
  });

  it("a genuine price of 0 is preserved as 0, not confused with missing", () => {
    const props = toUnifiedCardProps(rowWithZeroPrice, { provider: "Medichecks" });
    expect(props.price).toBe(0);
    const universal = fromLegacyUnified(props);
    expect(universal.price).toBe(0);
  });

  it("a real price passes through unchanged", () => {
    const props = toUnifiedCardProps(
      { ...rowWithNoPrice, price: 149.99 },
      { provider: "Medichecks" },
    );
    expect(props.price).toBe(149.99);
  });
});
