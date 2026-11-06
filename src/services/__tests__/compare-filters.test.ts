import { describe, expect, it } from "vitest";
import {
  biomarkerCompareHref,
  clearCompareFilterParams,
  hasInvalidBiomarkerParam,
  parseCompareUrlFilters,
  removeCompareParam,
  searchQueryToTerm,
  symptomCompareHref,
  symptomSearchTerms,
} from "@/services/compareFilters";
import { TestQueryBuilder } from "@/services/queryBuilders/testQueryBuilder";
import { getSupportedProviderIds } from "@/constants/providers";
import type { SymptomPageData } from "@/data/symptomPages";

const ID = "672fe286-7c9a-4fb2-8988-a199ad2e4a10";
const parse = (qs: string) => parseCompareUrlFilters(new URLSearchParams(qs));

describe("parseCompareUrlFilters", () => {
  it("reads a biomarker id and provider", () => {
    expect(parse(`biomarker=${ID}&provider=medichecks`)).toEqual({
      biomarkerId: ID,
      symptomSlug: null,
      provider: "medichecks",
    });
  });
  it("lower-cases a biomarker id", () => {
    expect(parse(`biomarker=${ID.toUpperCase()}`).biomarkerId).toBe(ID);
  });
  it("rejects a biomarker that is not a library id", () => {
    expect(parse("biomarker=ferritin").biomarkerId).toBeNull();
    expect(
      hasInvalidBiomarkerParam(new URLSearchParams("biomarker=ferritin")),
    ).toBe(true);
    expect(
      hasInvalidBiomarkerParam(new URLSearchParams(`biomarker=${ID}`)),
    ).toBe(false);
    expect(hasInvalidBiomarkerParam(new URLSearchParams(""))).toBe(false);
  });
  it("reads a symptom slug", () => {
    expect(parse("symptom=brain-fog")).toEqual({
      biomarkerId: null,
      symptomSlug: "brain-fog",
      provider: null,
    });
  });
  it("lets a biomarker take precedence over a symptom", () => {
    expect(parse(`biomarker=${ID}&symptom=fatigue`).symptomSlug).toBeNull();
  });
  it("drops unsafe slugs and the 'all' provider", () => {
    expect(parse("symptom=brain%20fog").symptomSlug).toBeNull();
    expect(parse("provider=<script>").provider).toBeNull();
    expect(parse("provider=all").provider).toBeNull();
  });
});

describe("compare hrefs and clearing", () => {
  it("builds biomarker links with and without a provider", () => {
    expect(biomarkerCompareHref(ID)).toBe(`/compare?biomarker=${ID}`);
    expect(biomarkerCompareHref(ID, "randox-health")).toBe(
      `/compare?biomarker=${ID}&provider=randox-health`,
    );
    expect(
      parse(biomarkerCompareHref(ID, "randox-health").split("?")[1]),
    ).toEqual({
      biomarkerId: ID,
      symptomSlug: null,
      provider: "randox-health",
    });
  });
  it("builds a symptom link", () => {
    expect(symptomCompareHref("brain-fog")).toBe("/compare?symptom=brain-fog");
  });
  it("clears every filter but keeps other params", () => {
    const next = clearCompareFilterParams(
      new URLSearchParams(
        `biomarker=${ID}&provider=medichecks&symptom=x&search=y&category=thyroid`,
      ),
    );
    expect(next.toString()).toBe("category=thyroid");
  });
  it("removes one filter", () => {
    const next = removeCompareParam(
      new URLSearchParams(`biomarker=${ID}&provider=medichecks`),
      "biomarker",
    );
    expect(next.toString()).toBe("provider=medichecks");
  });
});

describe("symptom search terms", () => {
  it("turns '+' into spaces", () => {
    expect(searchQueryToTerm("full+blood+count")).toBe("full blood count");
    expect(searchQueryToTerm("vitamin%20d")).toBe("vitamin d");
    expect(searchQueryToTerm("100%+bad")).toBe("100% bad");
  });
  it("deduplicates terms in order", () => {
    const symptom = {
      slug: "x",
      name: "X",
      recommendedTests: [
        { name: "A", searchQuery: "thyroid" },
        { name: "B", searchQuery: "full+blood+count" },
        { name: "C", searchQuery: "Thyroid" },
        { name: "D", searchQuery: "  " },
      ],
    } as unknown as SymptomPageData;
    expect(symptomSearchTerms(symptom)).toEqual([
      "thyroid",
      "full blood count",
    ]);
  });
});

type WithUrl = { url: URL };

describe("TestQueryBuilder.buildBiomarkerQuery", () => {
  it("inner-joins the biomarker links and keeps active supported tests", () => {
    const q = TestQueryBuilder.buildBiomarkerQuery(ID) as unknown as WithUrl;
    const p = q.url.searchParams;
    expect(q.url.pathname).toMatch(/\/provider_tests$/);
    expect(p.get("select")).toContain(
      "ptb:provider_test_biomarkers!provider_test_biomarkers_provider_test_id_fkey!inner(biomarker_id)",
    );
    expect(p.get("ptb.biomarker_id")).toBe(`eq.${ID}`);
    expect(p.get("is_active")).toBe("eq.true");
    expect(p.get("provider_id")).toBe(
      `in.(${getSupportedProviderIds().join(",")})`,
    );
    expect(p.get("limit")).toBe("1000");
  });
  it("narrows to one provider", () => {
    const q = TestQueryBuilder.buildBiomarkerQuery(ID, [
      "medichecks",
    ]) as unknown as WithUrl;
    expect(q.url.searchParams.get("provider_id")).toBe("in.(medichecks)");
  });
  it("matches nothing for an unsupported provider", () => {
    const q = TestQueryBuilder.buildBiomarkerQuery(ID, [
      "not-a-provider",
    ]) as unknown as WithUrl;
    expect(q.url.searchParams.get("provider_id")).toBe("in.()");
  });
});
