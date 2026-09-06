import { describe, expect, it } from "vitest";
import {
  fromCategoryTestItem,
  fromLegacyUnified,
  fromProviderTest,
} from "@/lib/universalTestAdapter";
import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";
import type { CategoryTestItem } from "@/components/category/CategoryPageLayout";

const NOTE = "Add-on biomarker only. Must be purchased with a full blood panel kit.";

const providerRow: ProviderTestCardData = {
  id: "abc",
  provider_id: "lola-health",
  test_name: "Ferritin add-on",
  description: null,
  price: 12,
  is_addon: true,
  purchase_notes: NOTE,
};

describe("add-on flag survives card adapters", () => {
  it("fromProviderTest keeps is_addon and purchase_notes", () => {
    const out = fromProviderTest(providerRow);
    expect(out.is_addon).toBe(true);
    expect(out.purchase_notes).toBe(NOTE);
  });

  it("fromLegacyUnified keeps is_addon and purchase_notes", () => {
    const out = fromLegacyUnified({
      category: "Hormones",
      name: "Ferritin add-on",
      description: "",
      biomarkers: 1,
      results: "2 working days",
      collection: "Home Kit",
      price: 12,
      provider: "Lola Health",
      testDetails: providerRow,
    });
    expect(out.is_addon).toBe(true);
    expect(out.purchase_notes).toBe(NOTE);
  });

  it("fromCategoryTestItem keeps is_addon and purchase_notes", () => {
    const item = {
      id: "abc",
      providerId: "lola-health",
      badgeColor: "#22c0d4",
      provider: "Lola Health",
      priceNum: 12,
      price: "£12",
      turnaround: "2 working days",
      turnaroundDays: 2,
      biomarkerCount: 1,
      title: "Ferritin add-on",
      desc: "",
      biomarkers: [],
      tag: "All",
      isAddon: true,
      purchaseNotes: NOTE,
    } satisfies CategoryTestItem;
    const out = fromCategoryTestItem(item);
    expect(out.is_addon).toBe(true);
    expect(out.purchase_notes).toBe(NOTE);
  });
});
