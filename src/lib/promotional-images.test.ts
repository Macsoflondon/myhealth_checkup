import { describe, expect, it } from "vitest";
import { isPromotionalImage } from "@/lib/promotional-images";
import { resolveTestCardImage } from "@/lib/resolve-test-card-image";

const BADGED =
  "https://clvuioagsgfadynuvodj.supabase.co/storage/v1/object/public/provider-test-images/medichecks/be04a2b5-6605-4bab-a10f-012f0c788c1b-box.webp?v=1788348435";
const CLEAN =
  "https://clvuioagsgfadynuvodj.supabase.co/storage/v1/object/public/provider-test-images/medichecks/b730a989-f471-4cae-9a57-29bc8b23e856-box.webp?v=1";

describe("promotional product images", () => {
  it("flags the Medichecks Bestseller/Save artwork regardless of cache query", () => {
    expect(isPromotionalImage(BADGED)).toBe(true);
    expect(isPromotionalImage(BADGED.replace(/\?v=\d+/, "?v=2"))).toBe(true);
  });

  it("does not flag a clean product photo", () => {
    expect(isPromotionalImage(CLEAN)).toBe(false);
  });

  it("never returns a promotional image for a comparison card", () => {
    const resolved = resolveTestCardImage({
      providerId: "medichecks",
      imageUrl: BADGED,
      testName: "Ultimate Performance Blood Test",
    });
    expect(resolved).not.toBe(BADGED);
    expect(isPromotionalImage(resolved)).toBe(false);
    expect(resolved).toContain("ultimate-performance-blood-test.webp");
  });
});
