import lolaAddonKitAsset from "@/assets/providers/lola-health-addon-kit.png.asset.json";

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
  if (providerId === "lola-health" && isAddon === true) {
    return lolaAddonKitAsset.url;
  }

  return imageUrl ?? null;
}