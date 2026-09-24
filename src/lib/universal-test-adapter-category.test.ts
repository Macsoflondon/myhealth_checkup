import { describe, expect, it } from "vitest";
import {
  fromAtHomeTest,
  fromCategoryTestItem,
  fromLegacyUnified,
  fromMedichecksTest,
  fromProviderTest,
} from "@/lib/universalTestAdapter";
import type { AtHomeTest } from "@/hooks/queries/useAtHomeTests";
import type { CategoryTestItem } from "@/components/category/CategoryPageLayout";

describe("universal card category accents", () => {
  it("colours at-home rows with the parent route accent", () => {
    const row = {
      id: "home",
      provider_id: "medichecks",
      test_name: "Thyroid test",
      category: "Thyroid",
      canonical_category: "thyroid",
      price: 39,
      sample_type: "Finger-prick",
      turnaround_days_text: null,
      biomarker_count: 3,
      biomarkers_list: null,
      description: null,
      who_should_test: null,
      symptoms: null,
      conditions: null,
      url: null,
      url_verified: null,
      image_url: null,
      home_kit_available: true,
      clinic_visit_available: false,
      is_popular: false,
      is_addon: false,
      collection_options: null,
      clinic_phlebotomy_cost: null,
      home_phlebotomy_cost: null,
    } satisfies AtHomeTest;

    const adapted = fromAtHomeTest(row);
    expect(adapted.category).toBe("At Home Test Kits");
    expect(adapted.category_color).toBe("#C2410C");
  });

  it("resolves provider and Medichecks cards through the shared map", () => {
    expect(
      fromProviderTest({
        id: "provider",
        provider_id: "clinilabs",
        test_name: "Sports profile",
        category: "sports-performance",
      }).category_color,
    ).toBe("#2563EB");
    expect(
      fromMedichecksTest({
        id: "medichecks",
        testName: "Health check",
        description: null,
        biomarkerCount: 1,
        price: 20,
        sampleType: "Blood",
        slug: "health-check",
      }).category_color,
    ).toBe("#22c0d4");
  });

  it("preserves category-page and legacy colour overrides", () => {
    const item = {
      id: "category",
      badgeColor: "#7C3AED",
      provider: "Medichecks",
      priceNum: 50,
      price: "£50",
      turnaround: "3 days",
      turnaroundDays: 3,
      biomarkerCount: 2,
      title: "Women's health test",
      desc: "Provider description",
      biomarkers: [],
      tag: "All",
    } satisfies CategoryTestItem;
    expect(fromCategoryTestItem(item).category_color).toBe("#7C3AED");
    expect(
      fromLegacyUnified({
        category: "All",
        categoryColor: "#C2410C",
        name: "At-home test",
        description: "Provider description",
        biomarkers: 2,
        results: "3 days",
        collection: "Finger-prick",
        price: 50,
        provider: "Medichecks",
      }).category_color,
    ).toBe("#C2410C");
  });
});
