import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BIOMARKER_PAGE_SIZE,
  biomarkerProviderCompareHref,
  categoryFilterParts,
  countTestsByProvider,
  orderLibraryIndex,
  pageOfIndex,
  scopeLibraryIndex,
  summariseLibraryIndex,
} from "@/services/BiomarkerLibraryService";
import { CompareService } from "@/services/CompareService";
import { TestQueryBuilder } from "@/services/queryBuilders/testQueryBuilder";

const rows = [
  { slug: "allergen-a", category: "Allergy & Immunology" },
  { slug: "ferritin", category: "Haematology" },
  { slug: "free-t4", category: "Thyroid" },
  { slug: "haemoglobin", category: "Full Blood Count" },
  { slug: "hep-b", category: "Infectious Disease" },
  { slug: "iron", category: "Vitamins" },
  { slug: "troponin", category: "Cardiac Markers" },
  { slug: "tsh", category: "Thyroid" },
  { slug: "vitamin-d", category: "Vitamins" },
  { slug: "crp", category: "Cardiac" },
];

describe("library index", () => {
  const index = orderLibraryIndex(rows);

  it("orders by consumer category and keeps name order inside each", () => {
    expect(index.map((r) => r.slug)).toEqual([
      "free-t4",
      "tsh",
      "haemoglobin",
      "ferritin",
      "iron",
      "vitamin-d",
      "troponin",
      "crp",
      "allergen-a",
      "hep-b",
    ]);
  });

  it("counts header figures from the data", () => {
    const s = summariseLibraryIndex(index);
    expect(s.biomarkerTotal).toBe(8);
    expect(s.otherTotal).toBe(2);
    expect(s.categories).toEqual([
      { label: "Thyroid", count: 2 },
      { label: "Blood count", count: 1 },
      { label: "Iron", count: 2 },
      { label: "Vitamins and minerals", count: 1 },
      { label: "Heart", count: 2 },
    ]);
  });

  it("splits the main list from allergens and infection markers", () => {
    expect(
      scopeLibraryIndex(index, "biomarkers", "").map((r) => r.slug),
    ).not.toContain("hep-b");
    expect(scopeLibraryIndex(index, "other", "").map((r) => r.slug)).toEqual([
      "allergen-a",
      "hep-b",
    ]);
    // A chosen category lists all of its rows once, in the main list.
    expect(scopeLibraryIndex(index, "biomarkers", "Thyroid")).toHaveLength(10);
    expect(scopeLibraryIndex(index, "other", "Thyroid")).toHaveLength(0);
  });

  it("drops rows that a slug override moved out of the chosen category", () => {
    const blood = orderLibraryIndex(
      [
        { slug: "ferritin", category: "Haematology" },
        { slug: "haemoglobin", category: "Haematology" },
      ],
      "Blood count",
    );
    expect(blood.map((r) => r.slug)).toEqual(["haemoglobin"]);
  });

  it("pages the index", () => {
    const big = orderLibraryIndex(
      Array.from({ length: BIOMARKER_PAGE_SIZE + 5 }, (_, i) => ({
        slug: `m-${String(i).padStart(3, "0")}`,
        category: "Thyroid",
      })),
    );
    const first = pageOfIndex(big, 0);
    expect(first.slugs).toHaveLength(BIOMARKER_PAGE_SIZE);
    expect(first.total).toBe(BIOMARKER_PAGE_SIZE + 5);
    expect(first.nextOffset).toBe(BIOMARKER_PAGE_SIZE);
    const second = pageOfIndex(big, BIOMARKER_PAGE_SIZE);
    expect(second.slugs).toHaveLength(5);
    expect(second.nextOffset).toBeNull();
  });
});

describe("category filter parts", () => {
  it("uses .in on raw labels and excludes moved slugs", () => {
    const p = categoryFilterParts("Blood count");
    expect(p.inRaw).toEqual(["Full Blood Count", "Haematology"]);
    expect(p.or).toBeNull();
    expect(p.notSlugs).toContain('"ferritin"');
  });
  it("adds moved-in slugs with an or filter", () => {
    const p = categoryFilterParts("Iron");
    expect(p.inRaw).toBeNull();
    expect(p.or).toBe(
      'category.in.("Iron Status"),slug.in.("ferritin","iron-stores-ferritin","iron","serum-iron","transferrin","transferrin-saturation","tibc-total-iron-binding-capacity")',
    );
    expect(p.notSlugs).toBeNull();
  });
});

describe("biomarker provider counts", () => {
  afterEach(() => vi.restoreAllMocks());

  it("counts distinct tests per provider", () => {
    expect(
      countTestsByProvider([
        { id: "a", provider_id: "medichecks" },
        { id: "b", provider_id: "medichecks" },
        { id: "b", provider_id: "medichecks" },
        { id: "c", provider_id: "randox-health" },
      ]),
    ).toEqual([
      { providerId: "medichecks", testCount: 2 },
      { providerId: "randox-health", testCount: 1 },
    ]);
  });

  it("links to the biomarker mode of /compare", () => {
    expect(biomarkerProviderCompareHref("abc", "medichecks")).toBe(
      "/compare?biomarker=abc&provider=medichecks",
    );
  });

  it("drops junk and duplicate rows and strips the join column", async () => {
    const data = [
      {
        id: "1",
        test_name: "Ferritin Blood Test",
        provider_id: "medichecks",
        ptb: [{}],
      },
      {
        id: "1",
        test_name: "Ferritin Blood Test",
        provider_id: "medichecks",
        ptb: [{}],
      },
      {
        id: "2",
        test_name: "404 Not Found",
        provider_id: "medichecks",
        ptb: [{}],
      },
      {
        id: "3",
        test_name: "Iron Profile",
        provider_id: "randox-health",
        ptb: [{}],
      },
    ];
    vi.spyOn(TestQueryBuilder, "buildBiomarkerQuery").mockReturnValue({
      returns: () => Promise.resolve({ data, error: null }),
    } as never);
    const out = await CompareService.getBiomarkerTestRows("x");
    expect(out.map((r) => r.id)).toEqual(["1", "3"]);
    expect(out[0]).not.toHaveProperty("ptb");
    const tests = await CompareService.getBiomarkerTests("x");
    expect(tests).toHaveLength(2);
  });

  it("throws on a query error rather than reporting no tests", async () => {
    vi.spyOn(TestQueryBuilder, "buildBiomarkerQuery").mockReturnValue({
      returns: () =>
        Promise.resolve({ data: null, error: { message: "boom" } }),
    } as never);
    await expect(CompareService.getBiomarkerTestRows("x")).rejects.toEqual({
      message: "boom",
    });
  });
});
