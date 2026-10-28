import lolaAddonKit from "@/assets/providers/lola-addon-blood-test-kit.png.asset.json";
import clinilabsVenousKit from "@/assets/providers/clinilabs-venous-blood-test-kit.png.asset.json";
import clinilabsMenopauseBox from "@/assets/providers/clinilabs-menopause-box.png.asset.json";
import clinilabsMmrBox from "@/assets/providers/clinilabs-mmr-box.png.asset.json";
import clinilabsHepBBox from "@/assets/providers/clinilabs-hepb-box.png.asset.json";

interface TestCardImageInput {
  providerId?: string | null;
  isAddon?: boolean | null;
  imageUrl?: string | null;
  testName?: string | null;
}

/** Generic Clinilabs venous kit, used only when a Clinilabs test has no product photo of its own. */
export const CLINILABS_GENERIC_KIT_URL: string = clinilabsVenousKit.url;

/**
 * Clinilabs venous tests whose provider image is a lifestyle photo rather than a kit box.
 * Each gets the generic venous box with its own test name printed on it.
 */
const CLINILABS_NAMED_BOXES: ReadonlyArray<{ pattern: RegExp; url: string }> = [
  { pattern: /^menopause profile$/, url: clinilabsMenopauseBox.url },
  { pattern: /^measles, mumps (&|and) rubella \(mmr\)/, url: clinilabsMmrBox.url },
  { pattern: /^hepatitis b core antibody \(igm\)/, url: clinilabsHepBBox.url },
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
  if (isClinilabs(providerId) && testName) {
    const name = testName.trim().toLowerCase().replace(/\u2019/g, "'");
    const named = CLINILABS_NAMED_BOXES.find((b) => b.pattern.test(name));
    if (named) return named.url;
  }
  const own = imageUrl?.trim();
  if (own) return own;
  if (isClinilabs(providerId)) return CLINILABS_GENERIC_KIT_URL;
  return null;
}
