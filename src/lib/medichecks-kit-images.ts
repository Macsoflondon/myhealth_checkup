import kit0 from "@/assets/providers/medichecks/advanced-female-hormone-blood-test.webp.asset.json";
import kit1 from "@/assets/providers/medichecks/advanced-thyroid-function-blood-test.webp.asset.json";
import kit2 from "@/assets/providers/medichecks/advanced-trt-testosterone-replacement-therapy-blood-test.webp.asset.json";
import kit3 from "@/assets/providers/medichecks/advanced-well-man-blood-test.webp.asset.json";
import kit4 from "@/assets/providers/medichecks/advanced-well-woman-blood-test.webp.asset.json";
import kit5 from "@/assets/providers/medichecks/female-hormone-blood-test.webp.asset.json";
import kit6 from "@/assets/providers/medichecks/male-hormone-blood-test.webp.asset.json";
import kit7 from "@/assets/providers/medichecks/optimal-health-blood-test.webp.asset.json";
import kit8 from "@/assets/providers/medichecks/psa-prostate-specific-antigen-blood-test.webp.asset.json";
import kit9 from "@/assets/providers/medichecks/skin-iq-blood-test.webp.asset.json";
import kit10 from "@/assets/providers/medichecks/ultimate-performance-blood-test.webp.asset.json";

/** Audited official product photographs; isolated boxes omit provider promotional artwork. */
const KITS: ReadonlyMap<string, string> = new Map([
  ["advanced female hormone blood test", kit0.url],
  ["advanced thyroid function blood test", kit1.url],
  ["advanced trt (testosterone replacement therapy) blood test", kit2.url],
  ["advanced well man blood test", kit3.url],
  ["advanced well woman blood test", kit4.url],
  ["female hormone blood test", kit5.url],
  ["male hormone blood test", kit6.url],
  ["optimal health blood test", kit7.url],
  ["psa (prostate specific antigen) blood test", kit8.url],
  ["skin iq blood test", kit9.url],
  ["ultimate performance blood test", kit10.url],
]);

export function medichecksKitImage(testName: string): string | null {
  return KITS.get(testName.trim().toLowerCase()) ?? null;
}
