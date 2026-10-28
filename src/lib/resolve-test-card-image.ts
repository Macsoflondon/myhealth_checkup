import lolaAddonKit from "@/assets/providers/lola-addon-blood-test-kit.png.asset.json";
import clinilabsVenousKit from "@/assets/providers/clinilabs-venous-blood-test-kit.png.asset.json";
import clinilabsMenopauseBox from "@/assets/providers/clinilabs-menopause-box.png.asset.json";
import clinilabsMmrBox from "@/assets/providers/clinilabs-mmr-box.png.asset.json";
import clinilabsHepBBox from "@/assets/providers/clinilabs-hepb-box.png.asset.json";
import clinilabsQfitBox from "@/assets/providers/clinilabs-qfit-box.png";
import goodbodyBabyBox from "@/assets/providers/goodbody-baby-box.png.asset.json";
import goodbodyPaternityBox from "@/assets/providers/goodbody-paternity-box.png.asset.json";
import goodbodyStockholmBox from "@/assets/providers/goodbody-stockholm-box.png.asset.json";

interface TestCardImageInput {
  providerId?: string | null;
  isAddon?: boolean | null;
  imageUrl?: string | null;
  testName?: string | null;
}

/** Generic Clinilabs venous kit, used only when a Clinilabs test has no product photo of its own. */
export const CLINILABS_GENERIC_KIT_URL: string = clinilabsVenousKit.url;

type NamedBox = { pattern: RegExp; url: string };

/**
 * Tests whose provider image is a lifestyle photo rather than a kit box.
 * Each gets the provider's own box design with its test name printed on it.
 */
const NAMED_BOXES: ReadonlyArray<{ provider: RegExp; boxes: ReadonlyArray<NamedBox> }> = [
  {
    provider: /clinilabs/,
    boxes: [
      { pattern: /^menopause profile$/, url: clinilabsMenopauseBox.url },
      { pattern: /^measles, mumps (&|and) rubella \(mmr\)/, url: clinilabsMmrBox.url },
      { pattern: /^hepatitis b core antibody \(igm\)/, url: clinilabsHepBBox.url },
      { pattern: /^quantitative faecal immunochemical test(?:\s*\(qfit\))?$/, url: clinilabsQfitBox },
    ],
  },
  {
    provider: /goodbody/,
    boxes: [
      { pattern: /^early baby gender/, url: goodbodyBabyBox.url },
      { pattern: /^prenatal paternity/, url: goodbodyPaternityBox.url },
      { pattern: /^stockholm3 prostate/, url: goodbodyStockholmBox.url },
    ],
  },
];

function isClinilabs(providerId: string | null | undefined): boolean {
  return (providerId ?? "").toLowerCase().includes("clinilabs");
}

export function resolveTestCardImage({
  providerId,
  isAddon,
  imageUrl,
  testName,
}: TestCardImageInput): string | null {
  if (providerId === "lola-health" && isAddon) return lolaAddonKit.url;
  const provider = (providerId ?? "").toLowerCase();
  if (provider && testName) {
    const name = testName.trim().toLowerCase().replace(/\u2019/g, "'");
    const group = NAMED_BOXES.find((g) => g.provider.test(provider));
    const named = group?.boxes.find((b) => b.pattern.test(name));
    if (named) return named.url;
  }
  const own = imageUrl?.trim();
  if (own) return own;
  if (isClinilabs(providerId)) return CLINILABS_GENERIC_KIT_URL;
  return null;
}
