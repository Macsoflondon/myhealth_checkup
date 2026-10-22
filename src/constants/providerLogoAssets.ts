/**
 * Provider logos, imported through the bundler.
 *
 * Imported files are emitted to /assets/ with a content hash, which the host
 * serves with a one-year immutable cache. The copies in public/lovable-uploads
 * stay for external references (stored rows, emails, older pages) but are
 * served with no cache lifetime, so site components should use these URLs.
 *
 * To change a logo, replace the file under src/assets/providers/. The hash,
 * and so the URL, changes with it.
 */
import medichecksLogo from "@/assets/providers/logos/provider-medichecks-light.webp?no-inline";
import randoxLogo from "@/assets/providers/logos/provider-randox.webp?no-inline";
import londonMedicalLogo from "@/assets/providers/logos/provider-london-medical.webp?no-inline";
import lolaHealthLogo from "@/assets/providers/logos/provider-lola-health.webp?no-inline";
import goodbodyLogo from "@/assets/providers/logos/provider-goodbody-slate-2026.webp?no-inline";
import londonHealthCompanyLogo from "@/assets/providers/logos/provider-london-health-company.webp?no-inline";
import medicalDiagnosisLogo from "@/assets/providers/logos/provider-medical-diagnosis.webp?no-inline";
import clinilabsLogo from "@/assets/providers/logos/provider-clinilabs.webp?no-inline";

import lola160 from "@/assets/providers/responsive/lola-health@160.webp?no-inline";
import lola320 from "@/assets/providers/responsive/lola-health@320.webp?no-inline";
import lola480 from "@/assets/providers/responsive/lola-health@480.webp?no-inline";
import goodbody160 from "@/assets/providers/responsive/goodbody-clinic@160.webp?no-inline";
import goodbody320 from "@/assets/providers/responsive/goodbody-clinic@320.webp?no-inline";
import goodbody480 from "@/assets/providers/responsive/goodbody-clinic@480.webp?no-inline";
import lhc160 from "@/assets/providers/responsive/london-health-company@160.webp?no-inline";
import lhc320 from "@/assets/providers/responsive/london-health-company@320.webp?no-inline";
import lhc480 from "@/assets/providers/responsive/london-health-company@480.webp?no-inline";
import medicalDiagnosis160 from "@/assets/providers/responsive/medical-diagnosis@160.webp?no-inline";
import medicalDiagnosis320 from "@/assets/providers/responsive/medical-diagnosis@320.webp?no-inline";
import medicalDiagnosis480 from "@/assets/providers/responsive/medical-diagnosis@480.webp?no-inline";
import clinilabs160 from "@/assets/providers/responsive/clinilabs@160.webp?no-inline";
import clinilabs320 from "@/assets/providers/responsive/clinilabs@320.webp?no-inline";
import clinilabs480 from "@/assets/providers/responsive/clinilabs@480.webp?no-inline";

export interface LogoAsset {
  src: string;
  /** Intrinsic size of `src`, for width/height attributes. */
  width: number;
  height: number;
}

/** One logo file per provider, keyed by canonical provider id. */
export const PROVIDER_LOGO_ASSETS = {
  medichecks: { src: medichecksLogo, width: 460, height: 160 },
  randox: { src: randoxLogo, width: 480, height: 344 },
  "london-medical-laboratory": {
    src: londonMedicalLogo,
    width: 480,
    height: 483,
  },
  "lola-health": { src: lolaHealthLogo, width: 480, height: 474 },
  "goodbody-clinic": { src: goodbodyLogo, width: 480, height: 75 },
  "london-health-company": {
    src: londonHealthCompanyLogo,
    width: 429,
    height: 270,
  },
  "medical-diagnosis": { src: medicalDiagnosisLogo, width: 480, height: 204 },
  clinilabs: { src: clinilabsLogo, width: 422, height: 140 },
} as const satisfies Record<string, LogoAsset>;

export interface ResponsiveLogoAsset extends LogoAsset {
  /** 1x/2x/3x density candidates; `src` is the 1x file (160px tall). */
  srcSet: string;
}

const density = (
  x1: string,
  x2: string,
  x3: string,
  width: number,
): ResponsiveLogoAsset => ({
  src: x1,
  srcSet: `${x1} 1x, ${x2} 2x, ${x3} 3x`,
  width,
  height: 160,
});

/** 160/320/480px-tall logo sets, for logos shown large (the partners strip). */
export const PROVIDER_RESPONSIVE_LOGO_ASSETS: Record<
  string,
  ResponsiveLogoAsset
> = {
  "lola-health": density(lola160, lola320, lola480, 162),
  "goodbody-clinic": density(goodbody160, goodbody320, goodbody480, 249),
  "london-health-company": density(lhc160, lhc320, lhc480, 254),
  "medical-diagnosis": density(
    medicalDiagnosis160,
    medicalDiagnosis320,
    medicalDiagnosis480,
    376,
  ),
  clinilabs: density(clinilabs160, clinilabs320, clinilabs480, 482),
};
