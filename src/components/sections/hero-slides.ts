import joggingWoman from "@/assets/hero/hero-jogging-woman.png";
import bloodTestKit from "@/assets/hero/hero-blood-test-kit.jpg";
import joggingWoman480Avif from "@/assets/hero/generated/jogging-woman-480.avif";
import joggingWoman768Avif from "@/assets/hero/generated/jogging-woman-768.avif";
import joggingWoman1200Avif from "@/assets/hero/generated/jogging-woman-1200.avif";
import joggingWoman1920Avif from "@/assets/hero/generated/jogging-woman-1920.avif";
import joggingWoman480Webp from "@/assets/hero/generated/jogging-woman-480.webp";
import joggingWoman768Webp from "@/assets/hero/generated/jogging-woman-768.webp";
import joggingWoman1200Webp from "@/assets/hero/generated/jogging-woman-1200.webp";
import joggingWoman1920Webp from "@/assets/hero/generated/jogging-woman-1920.webp";
import bloodTestKit480Avif from "@/assets/hero/generated/blood-test-kit-480.avif";
import bloodTestKit768Avif from "@/assets/hero/generated/blood-test-kit-768.avif";
import bloodTestKit1200Avif from "@/assets/hero/generated/blood-test-kit-1200.avif";
import bloodTestKit1590Avif from "@/assets/hero/generated/blood-test-kit-1590.avif";
import bloodTestKit480Webp from "@/assets/hero/generated/blood-test-kit-480.webp";
import bloodTestKit768Webp from "@/assets/hero/generated/blood-test-kit-768.webp";
import bloodTestKit1200Webp from "@/assets/hero/generated/blood-test-kit-1200.webp";
import bloodTestKit1590Webp from "@/assets/hero/generated/blood-test-kit-1590.webp";
import gymSelfie from "@/assets/hero/hero-gym-selfie.png";
import gymSelfie480Avif from "@/assets/hero/generated/gym-selfie-480.avif";
import gymSelfie768Avif from "@/assets/hero/generated/gym-selfie-768.avif";
import gymSelfie1200Avif from "@/assets/hero/generated/gym-selfie-1200.avif";
import gymSelfie480Webp from "@/assets/hero/generated/gym-selfie-480.webp";
import gymSelfie768Webp from "@/assets/hero/generated/gym-selfie-768.webp";
import gymSelfie1200Webp from "@/assets/hero/generated/gym-selfie-1200.webp";
import wellnessChoiceAsset from "@/assets/hero/stock/wellness-choice.jpg.asset.json";
import wellnessChoice480AvifAsset from "@/assets/hero/stock/wellness-choice-480.avif.asset.json";
import wellnessChoice768AvifAsset from "@/assets/hero/stock/wellness-choice-768.avif.asset.json";
import wellnessChoice1200AvifAsset from "@/assets/hero/stock/wellness-choice-1200.avif.asset.json";
import wellnessChoice480WebpAsset from "@/assets/hero/stock/wellness-choice-480.webp.asset.json";
import wellnessChoice768WebpAsset from "@/assets/hero/stock/wellness-choice-768.webp.asset.json";
import wellnessChoice1200WebpAsset from "@/assets/hero/stock/wellness-choice-1200.webp.asset.json";
import healthyAgeingAsset from "@/assets/hero/stock/healthy-ageing.jpg.asset.json";
import healthyAgeing480AvifAsset from "@/assets/hero/stock/healthy-ageing-480.avif.asset.json";
import healthyAgeing768AvifAsset from "@/assets/hero/stock/healthy-ageing-768.avif.asset.json";
import healthyAgeing1200AvifAsset from "@/assets/hero/stock/healthy-ageing-1200.avif.asset.json";
import healthyAgeing480WebpAsset from "@/assets/hero/stock/healthy-ageing-480.webp.asset.json";
import healthyAgeing768WebpAsset from "@/assets/hero/stock/healthy-ageing-768.webp.asset.json";
import healthyAgeing1200WebpAsset from "@/assets/hero/stock/healthy-ageing-1200.webp.asset.json";
import screeningClarityAsset from "@/assets/hero/stock/screening-clarity.jpg.asset.json";
import screeningClarity480AvifAsset from "@/assets/hero/stock/screening-clarity-480.avif.asset.json";
import screeningClarity768AvifAsset from "@/assets/hero/stock/screening-clarity-768.avif.asset.json";
import screeningClarity1200AvifAsset from "@/assets/hero/stock/screening-clarity-1200.avif.asset.json";
import screeningClarity480WebpAsset from "@/assets/hero/stock/screening-clarity-480.webp.asset.json";
import screeningClarity768WebpAsset from "@/assets/hero/stock/screening-clarity-768.webp.asset.json";
import screeningClarity1200WebpAsset from "@/assets/hero/stock/screening-clarity-1200.webp.asset.json";

const srcSet = (...candidates: ReadonlyArray<readonly [string, number]>): string =>
  candidates.map(([url, width]) => `${url} ${width}w`).join(", ");

const joggingWomanAvifSrcSet = srcSet(
  [joggingWoman480Avif, 480], [joggingWoman768Avif, 768],
  [joggingWoman1200Avif, 1200], [joggingWoman1920Avif, 1920],
);
const joggingWomanWebpSrcSet = srcSet(
  [joggingWoman480Webp, 480], [joggingWoman768Webp, 768],
  [joggingWoman1200Webp, 1200], [joggingWoman1920Webp, 1920],
);
const wellnessChoiceAvif = srcSet(
  [wellnessChoice480AvifAsset.url, 480], [wellnessChoice768AvifAsset.url, 768], [wellnessChoice1200AvifAsset.url, 1200],
);
const wellnessChoiceWebp = srcSet(
  [wellnessChoice480WebpAsset.url, 480], [wellnessChoice768WebpAsset.url, 768], [wellnessChoice1200WebpAsset.url, 1200],
);
const healthyAgeingAvif = srcSet(
  [healthyAgeing480AvifAsset.url, 480], [healthyAgeing768AvifAsset.url, 768], [healthyAgeing1200AvifAsset.url, 1200],
);
const healthyAgeingWebp = srcSet(
  [healthyAgeing480WebpAsset.url, 480], [healthyAgeing768WebpAsset.url, 768], [healthyAgeing1200WebpAsset.url, 1200],
);
const screeningClarityAvif = srcSet(
  [screeningClarity480AvifAsset.url, 480], [screeningClarity768AvifAsset.url, 768], [screeningClarity1200AvifAsset.url, 1200],
);
const screeningClarityWebp = srcSet(
  [screeningClarity480WebpAsset.url, 480], [screeningClarity768WebpAsset.url, 768], [screeningClarity1200WebpAsset.url, 1200],
);
const bloodTestKitAvif = srcSet(
  [bloodTestKit480Avif, 480], [bloodTestKit768Avif, 768],
  [bloodTestKit1200Avif, 1200], [bloodTestKit1590Avif, 1590],
);
const bloodTestKitWebp = srcSet(
  [bloodTestKit480Webp, 480], [bloodTestKit768Webp, 768],
  [bloodTestKit1200Webp, 1200], [bloodTestKit1590Webp, 1590],
);
const gymSelfieAvif = srcSet(
  [gymSelfie480Avif, 480], [gymSelfie768Avif, 768], [gymSelfie1200Avif, 1200],
);
const gymSelfieWebp = srcSet(
  [gymSelfie480Webp, 480], [gymSelfie768Webp, 768], [gymSelfie1200Webp, 1200],
);

export type HeroSlide = {
  src: string;
  /** Responsive AVIF candidates, used as the first <source> of the slide. */
  avifSrcSet: string;
  /** Responsive WebP candidates, the fallback for browsers without AVIF. */
  webpSrcSet: string;
  label: string;
  /** Descriptive alt text describing the scene, not the marketing slogan. */
  alt: string;
  posMobile: string;
  posTablet: string;
  posDesktop: string;
  /** Preserve the complete frame where a portrait image should not be cropped. */
  fit?: "cover" | "contain";
};

/** URL of the first hero slide — the original, used as the <img> fallback. */
export const FIRST_SLIDE_SRC: string = joggingWoman;

/**
 * Preload target for the AVIF candidate set. The route head() declares
 * type="image/avif", so the href must be an AVIF too — pointing it at the
 * original PNG made the hint inconsistent and risked a second download.
 */
export const FIRST_SLIDE_PRELOAD_HREF: string = joggingWoman1200Avif;

/** Responsive candidate sets for the first slide, widest-format first. */
export const FIRST_SLIDE_AVIF_SRCSET: string = joggingWomanAvifSrcSet;
export const FIRST_SLIDE_WEBP_SRCSET: string = joggingWomanWebpSrcSet;



/**
 * Tiny blurred placeholder (32px WebP) of the first slide, shown behind the
 * hero until that slide decodes so users never see a bare navy block.
 */
export const FIRST_SLIDE_LQIP =
  "data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAADwBACdASogABUAPu1cq04ppKQiMBgMATAdiWYAsOwQ8K9HyiX4F5aT3lgrt7OcrHAA/uqDRKnL5YU7cmWJ8ia6JPvg2tpXgVF0QsnGzmDF8hRV8CcPjGNzBIn08ReUQBwSA1Ey1HIn4cyRS5s6pKpTzoDBRAS/DpxFyby/9d26U7c0n6lUmar9erfa0gkbaOCI+mur9hZDz4naSj6Fx8WJHBxkoAAA";

/** Single fixed caption shown over every hero slide. */
export const HERO_CAPTION =
  "Your trusted platform for comparing private health and cancer screening tests.";

export const SLIDES: HeroSlide[] = [
  {
    src: joggingWoman,
    avifSrcSet: joggingWomanAvifSrcSet,
    webpSrcSet: joggingWomanWebpSrcSet,
    label: "Know Your Health. Own Your Future.",
    alt: "Woman jogging along a coastal path on a bright morning",
    posMobile: "35% 55%",
    posTablet: "center 32%",
    posDesktop: "center 35%",
  },
  {
    src: wellnessChoiceAsset.url,
    avifSrcSet: wellnessChoiceAvif,
    webpSrcSet: wellnessChoiceWebp,
    label: "Your health. Your choice. Compare with confidence.",
    alt: "Woman stretching before a run on a sunny country road",
    posMobile: "42% center",
    posTablet: "center center",
    posDesktop: "center center",
  },
  {
    src: bloodTestKit,
    avifSrcSet: bloodTestKitAvif,
    webpSrcSet: bloodTestKitWebp,
    label: "Test from the Comfort of Home",
    alt: "At-home finger-prick blood test kit laid out on a kitchen worktop",
    posMobile: "40% 15%",
    posTablet: "40% 32%",
    posDesktop: "50% 45%",
  },
  {
    src: healthyAgeingAsset.url,
    avifSrcSet: healthyAgeingAvif,
    webpSrcSet: healthyAgeingWebp,
    label: "Plan well for the years ahead.",
    alt: "Older couple carrying exercise mats while walking in a park",
    posMobile: "38% center",
    posTablet: "center center",
    posDesktop: "center center",
  },
  {
    src: gymSelfie,
    avifSrcSet: gymSelfieAvif,
    webpSrcSet: gymSelfieWebp,
    label: "Train Hard. Test Smarter.",
    alt: "Man in gym wear taking a progress photo after a workout",
    posMobile: "50% 20%",
    posTablet: "50% 25%",
    posDesktop: "50% 30%",
    fit: "contain",
  },
  {
    src: screeningClarityAsset.url,
    avifSrcSet: screeningClarityAvif,
    webpSrcSet: screeningClarityWebp,
    label: "Private screening, made clearer.",
    alt: "Patient discussing private screening options with a clinician",
    posMobile: "45% center",
    posTablet: "center center",
    posDesktop: "center center",
  },
];

