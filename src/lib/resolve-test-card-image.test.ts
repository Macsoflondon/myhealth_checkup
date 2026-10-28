import { describe, expect, it } from "vitest";
import {
  CLINILABS_GENERIC_KIT_URL,
  resolveTestCardImage,
} from "@/lib/resolve-test-card-image";
import { fromCategoryTestItem } from "@/lib/universalTestAdapter";
import lolaAddonKit from "@/assets/providers/lola-addon-blood-test-kit.png.asset.json";
import clinilabsQfitBox from "@/assets/providers/clinilabs-qfit-box-accreditation.png.asset.json";

describe("resolveTestCardImage", () => {
  it("uses the owner's uploaded kit image for Lola Health add-ons", () => {
    expect(
      resolveTestCardImage({
        providerId: "lola-health",
        isAddon: true,
        imageUrl: "https://provider.example/unwanted.jpg",
      }),
    ).toBe(lolaAddonKit.url);
    expect(
      resolveTestCardImage({
        providerId: "lola-health",
        isAddon: true,
        imageUrl: null,
      }),
    ).toBe(lolaAddonKit.url);
  });

  it("keeps a Lola Health standalone test image", () => {
    const imageUrl = "https://provider.example/standalone.jpg";
    expect(
      resolveTestCardImage({
        providerId: "lola-health",
        isAddon: false,
        imageUrl,
      }),
    ).toBe(imageUrl);
  });

  it("does not replace another provider's add-on image", () => {
    const imageUrl = "https://provider.example/add-on.jpg";
    expect(
      resolveTestCardImage({
        providerId: "london-health-company",
        isAddon: true,
        imageUrl,
      }),
    ).toBe(imageUrl);
  });

  it("returns null for a test with no image so the card shows the neutral placeholder", () => {
    expect(
      resolveTestCardImage({ providerId: "medichecks", imageUrl: null }),
    ).toBeNull();
  });

  it("falls back to the generic Clinilabs box only when no product photo exists", () => {
    expect(
      resolveTestCardImage({ providerId: "clinilabs", imageUrl: null }),
    ).toBe(CLINILABS_GENERIC_KIT_URL);
    const own = "https://provider.example/clinilabs-box.webp";
    expect(
      resolveTestCardImage({ providerId: "clinilabs", imageUrl: own }),
    ).toBe(own);
  });

  it("carries a missing category-page image through as null, not a broken URL", () => {
    const adapted = fromCategoryTestItem({
      id: "no-image",
      provider: "Clinilabs",
      providerId: "clinilabs",
      priceNum: 99,
      price: "£99",
      turnaround: "2 days",
      turnaroundDays: 2,
      biomarkerCount: 5,
      title: "PCOS Blood Test",
      desc: "Provider description",
      biomarkers: [],
      tag: "Women's Health",
      badgeColor: "#7C3AED",
    });
    expect(adapted.image_url).toBeNull();
  });
});

describe("Clinilabs named boxes", () => {
  it("uses the matching stool-test box for Clinilabs qFIT only", () => {
    const testName = "Quantitative Faecal Immunochemical Test (qFIT)";
    expect(
      resolveTestCardImage({
        providerId: "clinilabs",
        testName,
        imageUrl: "https://x/old.webp",
      }),
    ).toBe(clinilabsQfitBox.url);
    expect(
      resolveTestCardImage({
        providerId: "medichecks",
        testName,
        imageUrl: "https://x/own.webp",
      }),
    ).toBe("https://x/own.webp");
  });
  it("replaces lifestyle photos with a named box for the three affected tests", () => {
    for (const testName of [
      "Menopause Profile",
      "Measles, Mumps & Rubella (MMR) Blood Test",
      "Hepatitis B Core Antibody (IgM) Blood Test",
    ]) {
      const url = resolveTestCardImage({
        providerId: "clinilabs",
        imageUrl: "https://x/photo.webp",
        testName,
      });
      expect(url).not.toBe("https://x/photo.webp");
      expect(url).not.toBe(CLINILABS_GENERIC_KIT_URL);
    }
  });

  it("leaves other Clinilabs tests with their own box", () => {
    expect(
      resolveTestCardImage({
        providerId: "clinilabs",
        imageUrl: "https://x/own.webp",
        testName: "Menopause Blood Test",
      }),
    ).toBe("https://x/own.webp");
  });
});

describe("Goodbody named boxes", () => {
  it("replaces lifestyle photos with a named box", () => {
    for (const testName of [
      "Early Baby Gender Blood Test",
      "Prenatal Paternity Test",
      "Stockholm3 Prostate Cancer Screening Blood Test",
    ]) {
      expect(
        resolveTestCardImage({
          providerId: "goodbody-clinic",
          imageUrl: "https://x/p.webp",
          testName,
        }),
      ).not.toBe("https://x/p.webp");
    }
  });

  it("keeps real kit photos for other Goodbody tests", () => {
    expect(
      resolveTestCardImage({
        providerId: "goodbody-clinic",
        imageUrl: "https://x/own.webp",
        testName: "Testosterone Blood Test",
      }),
    ).toBe("https://x/own.webp");
  });
});
