import { buildCollectionHead } from "@/lib/seo/route-head";

/** Search params accepted by category routes that support ?subcategory=. */
export type SubcategorySearch = { subcategory?: string };

export const validateSubcategorySearch = (raw: Record<string, unknown>): SubcategorySearch => {
  const v = raw["subcategory"];
  return typeof v === "string" && /^[a-z0-9-]{1,60}$/.test(v) ? { subcategory: v } : {};
};

type SubcategoryHeadInput = {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  /** Sentence-case label of the selected subcategory, when one is selected. */
  readonly subLabel?: string | null;
};

/**
 * Category head that names the selected subcategory in the title and
 * description, so the menu label, page heading and search title agree. The
 * canonical stays on the parent path (the shared builder strips queries).
 */
export const buildSubcategoryHead = ({ title, description, path, subLabel }: SubcategoryHeadInput) => {
  if (!subLabel) return buildCollectionHead({ title, description, path });
  const root = title.split("|")[0]?.trim() ?? title;
  return buildCollectionHead({
    title: `${subLabel} — ${root} | myhealth checkup`,
    description: `Compare ${subLabel.toLowerCase()} from UKAS-accredited UK providers. ${description}`,
    path,
  });
};
