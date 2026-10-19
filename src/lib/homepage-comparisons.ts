import type { CatalogueComparisonPanel } from "@/design-system/live-catalogue-comparison";

/** Match whole words so female hormone tests cannot enter the male panel. */
export function matchesComparisonName(name: string, fragment: string): boolean {
  const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(name);
}

/** Reserve full blood count for the upper table; lower slots never share a panel. */
export function selectHomepageComparisons(
  panels: CatalogueComparisonPanel[],
  index: number,
) {
  const unique = [
    ...new Map(panels.map((panel) => [panel.slug, panel])).values(),
  ];
  const upper =
    unique.find((panel) => panel.slug === "full-blood-count") ?? null;
  const remaining = unique.filter((panel) => panel.slug !== "full-blood-count");
  const offset = remaining.length
    ? ((index % remaining.length) + remaining.length) % remaining.length
    : 0;
  return {
    upper,
    left: remaining[offset] ?? null,
    right:
      remaining.length > 1
        ? (remaining[(offset + 1) % remaining.length] ?? null)
        : null,
  };
}
