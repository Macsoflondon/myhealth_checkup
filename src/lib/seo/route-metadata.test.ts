import { describe, expect, it } from "vitest";
import {
  buildProviderHead,
  buildRouteHead,
  buildTestHead,
  canonicalUrl,
} from "@/lib/seo/route-head";
import { validateJsonLd } from "@/lib/seo/structured-data";

const SITE = "https://myhealthcheckup.co.uk";

interface HeadLike {
  meta: readonly Record<string, unknown>[];
  links?: readonly Record<string, unknown>[];
  scripts?: readonly { type: string; children: string }[];
}

const metaByName = (head: HeadLike, key: "name" | "property", value: string) =>
  head.meta.find((m) => m[key] === value)?.["content"] as string | undefined;

const titleOf = (head: HeadLike) => head.meta.find((m) => "title" in m)?.["title"] as string;
const canonicalOf = (head: HeadLike) =>
  head.links?.find((l) => l["rel"] === "canonical")?.["href"] as string | undefined;

const assertCoreTags = (head: HeadLike, expectedUrl: string) => {
  expect(titleOf(head)).toBeTruthy();
  expect(titleOf(head).length).toBeLessThanOrEqual(75);
  const description = metaByName(head, "name", "description");
  expect(description).toBeTruthy();
  expect((description ?? "").length).toBeLessThanOrEqual(200);
  expect(metaByName(head, "property", "og:title")).toBe(titleOf(head));
  expect(metaByName(head, "property", "og:description")).toBe(description);
  expect(metaByName(head, "property", "og:url")).toBe(expectedUrl);
  expect(canonicalOf(head)).toBe(expectedUrl);
  expect(expectedUrl).not.toContain("www.myhealthcheckup.co.uk");
};

describe("canonicalUrl", () => {
  it("normalises leading slashes, trailing slashes, query and hash", () => {
    expect(canonicalUrl("/")).toBe(SITE);
    expect(canonicalUrl("about")).toBe(`${SITE}/about`);
    expect(canonicalUrl("/about/")).toBe(`${SITE}/about`);
    expect(canonicalUrl("/compare?search=thyroid")).toBe(`${SITE}/compare`);
    expect(canonicalUrl("/compare#results")).toBe(`${SITE}/compare`);
  });
});

describe("homepage metadata", () => {
  const head = buildRouteHead({
    title: "myhealth checkup | Private Blood Tests & Health Checks UK",
    description:
      "Compare private blood tests, health checks and cancer screening from UKAS-accredited labs and CQC-regulated clinics.",
    path: "/",
  });

  it("emits self-referencing canonical and Open Graph tags", () => {
    assertCoreTags(head, SITE);
  });
});

describe("provider page metadata", () => {
  const head = buildProviderHead({
    providerId: "medichecks",
    providerName: "Medichecks",
    rating: 4.6,
    reviewCount: 12000,
  });
  const url = `${SITE}/provider/medichecks`;

  it("emits self-referencing metadata", () => {
    assertCoreTags(head, url);
    expect(titleOf(head)).toContain("Medichecks");
  });

  it("emits valid, non-duplicated JSON-LD pinned to the provider path", () => {
    const graph = (head.scripts ?? []).map((s) => JSON.parse(s.children));
    expect(graph.map((n) => n["@type"])).toEqual(["MedicalBusiness", "BreadcrumbList"]);
    expect(validateJsonLd(graph[0], { expectedUrl: url })).toEqual([]);
    expect(validateJsonLd(graph[1])).toEqual([]);
  });

  it("omits aggregateRating when no ratings exist", () => {
    const bare = buildProviderHead({ providerId: "thriva", providerName: "Thriva" });
    const node = JSON.parse((bare.scripts ?? [])[0].children);
    expect(node.aggregateRating).toBeUndefined();
    expect(validateJsonLd(node, { expectedUrl: `${SITE}/provider/thriva` })).toEqual([]);
  });
});

describe("test detail metadata", () => {
  const head = buildTestHead({
    providerId: "medichecks",
    providerName: "Medichecks",
    testId: "80e3f02e-c65c-4ba3-8ce9-df49983e8a9b",
    testName: "Thalassaemia Screen Blood Test",
    priceGbp: 69,
    biomarkerCount: 12,
  });
  const url = `${SITE}/provider/medichecks/tests/80e3f02e-c65c-4ba3-8ce9-df49983e8a9b`;

  it("never points at the provider or homepage path", () => {
    assertCoreTags(head, url);
    expect(canonicalOf(head)).not.toBe(`${SITE}/provider/medichecks`);
  });

  it("emits a valid MedicalTest graph with a GBP offer", () => {
    const graph = (head.scripts ?? []).map((s) => JSON.parse(s.children));
    expect(graph.map((n) => n["@type"])).toEqual(["MedicalTest", "BreadcrumbList"]);
    expect(validateJsonLd(graph[0], { expectedUrl: url })).toEqual([]);
    expect(graph[0].offers.priceCurrency).toBe("GBP");
    expect(graph[0].offers.price).toBe("69.00");
    expect(graph[1].itemListElement).toHaveLength(3);
  });

  it("drops the offer when no price is known rather than shipping an empty field", () => {
    const noPrice = buildTestHead({
      providerId: "thriva",
      providerName: "Thriva",
      testId: "abc",
      testName: "Vitamin D Test",
    });
    const node = JSON.parse((noPrice.scripts ?? [])[0].children);
    expect(node.offers).toBeUndefined();
    expect(validateJsonLd(node, { expectedUrl: `${SITE}/provider/thriva/tests/abc` })).toEqual([]);
  });
});

describe("metadata uniqueness across routes", () => {
  const heads = [
    buildRouteHead({ title: "Home | myhealth checkup", description: "Home page.", path: "/" }),
    buildProviderHead({ providerId: "medichecks", providerName: "Medichecks" }),
    buildProviderHead({ providerId: "thriva", providerName: "Thriva" }),
    buildTestHead({
      providerId: "medichecks",
      providerName: "Medichecks",
      testId: "test-a",
      testName: "Test A",
    }),
    buildTestHead({
      providerId: "medichecks",
      providerName: "Medichecks",
      testId: "test-b",
      testName: "Test B",
    }),
  ];

  it("gives every route a unique title and canonical", () => {
    expect(new Set(heads.map(titleOf)).size).toBe(heads.length);
    expect(new Set(heads.map(canonicalOf)).size).toBe(heads.length);
  });

  it("never emits duplicate canonical links or og:url tags", () => {
    for (const head of heads) {
      expect((head.links ?? []).filter((l) => l["rel"] === "canonical")).toHaveLength(1);
      expect(head.meta.filter((m) => m["property"] === "og:url")).toHaveLength(1);
    }
  });
});

describe("validateJsonLd", () => {
  it("flags missing context, empty fields and mismatched urls", () => {
    const issues = validateJsonLd(
      { "@type": "MedicalTest", name: "", url: "/relative" },
      { expectedUrl: `${SITE}/provider/x/tests/y` },
    );
    const messages = issues.map((i) => i.message).join(" | ");
    expect(messages).toContain('missing or invalid "@context"');
    expect(messages).toContain('field "name" is empty');
    expect(messages).toContain("url must be absolute");
  });

  it("flags duplicate root types", () => {
    const node = { "@context": "https://schema.org", "@type": "MedicalTest", name: "A" };
    const issues = validateJsonLd([node, { ...node, name: "B" }]);
    expect(issues.some((i) => i.message.includes("duplicate root @type"))).toBe(true);
  });
});
