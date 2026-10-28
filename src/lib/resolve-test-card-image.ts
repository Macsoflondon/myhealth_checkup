import lolaAddonKit from "@/assets/providers/lola-addon-blood-test-kit.png.asset.json";
import clinilabsVenousKit from "@/assets/providers/clinilabs-venous-blood-test-kit.png.asset.json";

interface TestCardImageInput {
  providerId?: string | null;
  isAddon?: boolean | null;
  imageUrl?: string | null;
}

/** Generic Clinilabs venous kit, used only when a Clinilabs test has no product photo of its own. */
export const CLINILABS_GENERIC_KIT_URL: string = clinilabsVenousKit.url;

export function resolveTestCardImage({
  providerId,
  isAddon,
  imageUrl,
}: TestCardImageInput): string | null {
  if (providerId === "lola-health" && isAddon) return lolaAddonKit.url;
  const own = imageUrl?.trim();
  if (own) return own;
  if (providerId === "clinilabs") return CLINILABS_GENERIC_KIT_URL;
  return null;
}
