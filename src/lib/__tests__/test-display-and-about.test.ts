import { describe, expect, it } from "vitest";
import {
  getRelatedTestLinks,
  getTestDisplayName,
} from "@/lib/test-display-name";
import { buildTestAboutCopy } from "@/lib/test-about-copy";
import { buildTestHead } from "@/lib/seo/route-head";

const PANEL = "routine health check that covers organ function.";

describe("getTestDisplayName", () => {
  it("maps OGTT to the plain-English name", () => {
    expect(getTestDisplayName("OGTT 0' 60' 120'")).toBe(
      "Oral Glucose Tolerance Test (OGTT)",
    );
  });

  it("leaves unmapped names unchanged", () => {
    expect(getTestDisplayName("Oestrone Blood Test")).toBe(
      "Oestrone Blood Test",
    );
  });

  it("links OGTT to diabetes, glucose and HbA1c pages", () => {
    expect(getRelatedTestLinks("OGTT 0' 60' 120'").map((l) => l.href)).toEqual(
      [
        "/tests/diabetes",
        "/biomarker-database?search=glucose",
        "/biomarker-database?search=HbA1c",
      ],
    );
  });
});

describe("buildTestHead", () => {
  const head = buildTestHead({
    providerId: "medical-diagnosis",
    providerName: "Medical Diagnosis",
    testId: "de8196f7-96d8-47d1-ac23-075178b765e4",
    testName: "OGTT 0' 60' 120'",
    priceGbp: 63,
    biomarkerCount: 1,
  });
  const meta = head.meta as unknown as Array<Record<string, string>>;
  const title = meta.find((m) => "title" in m)?.title ?? "";
  const ogTitle = meta.find((m) => m.property === "og:title")?.content ?? "";
  const description =
    meta.find((m) => m.name === "description")?.content ?? "";

  it("uses the display name in title, og:title and description", () => {
    expect(title).toContain("Oral Glucose Tolerance Test (OGTT)");
    expect(ogTitle).toContain("Oral Glucose Tolerance Test (OGTT)");
    expect(description).toContain("Oral Glucose Tolerance Test (OGTT)");
  });

  it("puts no price in the title or description", () => {
    expect(title).not.toMatch(/£/);
    expect(description).not.toMatch(/£/);
  });
});

describe("buildTestAboutCopy", () => {
  it("names the single biomarker instead of broad-coverage copy", () => {
    expect(
      buildTestAboutCopy({
        testName: "Oestrone Blood Test",
        providerName: "Medichecks",
        biomarkers: ["Oestrone"],
        biomarkerCount: 1,
        panelAboutText: PANEL,
      }),
    ).toBe("The Oestrone Blood Test from Medichecks measures 1 biomarker: Oestrone.");
  });

  it("lists up to three biomarkers", () => {
    expect(
      buildTestAboutCopy({
        testName: "Iron Test",
        providerName: "Medichecks",
        biomarkers: ["Iron", "Ferritin", "Transferrin"],
        panelAboutText: PANEL,
      }),
    ).toBe(
      "The Iron Test from Medichecks measures 3 biomarkers: Iron, Ferritin and Transferrin.",
    );
  });

  it("keeps broad-coverage copy for panels of four or more", () => {
    expect(
      buildTestAboutCopy({
        testName: "Well Man",
        providerName: "Medichecks",
        biomarkers: ["A", "B", "C", "D"],
        panelAboutText: PANEL,
      }),
    ).toBe(`The Well Man from Medichecks is a ${PANEL}`);
  });

  it("omits the paragraph when no biomarkers are known", () => {
    expect(
      buildTestAboutCopy({
        testName: "Unknown",
        providerName: "Medichecks",
        biomarkers: null,
        panelAboutText: PANEL,
      }),
    ).toBeNull();
  });
});
