interface AddonSource {
  provider_id?: string | null;
  is_addon?: boolean | null;
  category?: string | null;
  description?: string | null;
  source_section_label?: string | null;
}

/** Explicit provider evidence takes precedence over Lola's conflicting flag. */
export function isTestAddon(test: AddonSource): boolean {
  if (test.is_addon === true) return true;
  if (test.provider_id?.trim().toLowerCase() !== "lola-health") return false;
  const isAddonLabel = (label?: string | null): boolean =>
    /^add[\s-]?ons?$/i.test(label?.trim() ?? "");
  return (
    isAddonLabel(test.category) ||
    isAddonLabel(test.source_section_label) ||
    /^\s*(?:this|the)\s+add[\s-]?on\b/i.test(test.description ?? "")
  );
}