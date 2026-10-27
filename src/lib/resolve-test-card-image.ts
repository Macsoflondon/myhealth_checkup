import lolaAddonKit from "@/assets/providers/lola-addon-blood-test-kit.png.asset.json";

interface TestCardImageInput {
  providerId?: string | null;
  isAddon?: boolean | null;
  imageUrl?: string | null;
}

export function resolveTestCardImage({
  providerId,
  isAddon,
  imageUrl,
}: TestCardImageInput): string | null {
  if (providerId === "lola-health" && isAddon) return lolaAddonKit.url;
  return imageUrl?.trim() || null;
}
