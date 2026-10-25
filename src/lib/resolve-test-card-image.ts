interface TestCardImageInput {
  providerId?: string | null;
  isAddon?: boolean | null;
  imageUrl?: string | null;
}

export function resolveTestCardImage({
  imageUrl,
}: TestCardImageInput): string | null {
  return imageUrl?.trim() || null;
}
