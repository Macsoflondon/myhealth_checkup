interface AssetPointer {
  url: string;
}

const pointers = import.meta.glob<AssetPointer>(
  "../assets/providers/lml-kits/*.asset.json",
  { eager: true, import: "default" },
);

/**
 * London Medical Laboratory tests whose stored photo is only 250px wide.
 * These map to the provider's own 800px product image, so cards stay sharp.
 */
const SHARP_FILES: Readonly<Record<string, string>> = {
  "allergy complete": "lml-allergy-complete.jpg",
  "cholesterol lipid profile": "lml-cholesterol-lipid-profile.jpg",
  "diabetes - diagnosis and monitoring (hba1c)": "lml-diabetes-diagnosis-and-monitoring-hba1c.jpg",
  "erectile dysfunction impotence profile": "lml-erectile-dysfunction-impotence-profile.jpg",
  "female hair loss advanced": "lml-female-hair-loss-advanced.jpg",
  "female sexual health - advanced screen": "lml-female-sexual-health-advanced-screen.jpg",
  "fertility hormones profile": "lml-fertility-hormones-profile.jpg",
  "general health profile": "lml-general-health-profile.jpg",
};

/** Higher-resolution provider photo for a London Medical Laboratory test, if one exists. */
export function lmlSharpKitImage(testName: string): string | null {
  const file = SHARP_FILES[testName.trim().toLowerCase().replace(/\u2019/g, "'")];
  if (!file) return null;
  return pointers[`../assets/providers/lml-kits/${file}.asset.json`]?.url ?? null;
}
