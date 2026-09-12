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

import wellnessDesktop480Avif from "@/assets/hero/stock/wellness-desktop-480.avif.asset.json";
import wellnessDesktop768Avif from "@/assets/hero/stock/wellness-desktop-768.avif.asset.json";
import wellnessDesktop1200Avif from "@/assets/hero/stock/wellness-desktop-1200.avif.asset.json";
import wellnessDesktop480Webp from "@/assets/hero/stock/wellness-desktop-480.webp.asset.json";
import wellnessDesktop768Webp from "@/assets/hero/stock/wellness-desktop-768.webp.asset.json";
import wellnessDesktop1200Webp from "@/assets/hero/stock/wellness-desktop-1200.webp.asset.json";
import wellnessMobile480Avif from "@/assets/hero/stock/wellness-mobile-480.avif.asset.json";
import wellnessMobile768Avif from "@/assets/hero/stock/wellness-mobile-768.avif.asset.json";
import wellnessMobile480Webp from "@/assets/hero/stock/wellness-mobile-480.webp.asset.json";
import wellnessMobile768Webp from "@/assets/hero/stock/wellness-mobile-768.webp.asset.json";
import ageingDesktop480Avif from "@/assets/hero/stock/ageing-desktop-480.avif.asset.json";
import ageingDesktop768Avif from "@/assets/hero/stock/ageing-desktop-768.avif.asset.json";
import ageingDesktop1200Avif from "@/assets/hero/stock/ageing-desktop-1200.avif.asset.json";
import ageingDesktop480Webp from "@/assets/hero/stock/ageing-desktop-480.webp.asset.json";
import ageingDesktop768Webp from "@/assets/hero/stock/ageing-desktop-768.webp.asset.json";
import ageingDesktop1200Webp from "@/assets/hero/stock/ageing-desktop-1200.webp.asset.json";
import ageingMobile480Avif from "@/assets/hero/stock/ageing-mobile-480.avif.asset.json";
import ageingMobile768Avif from "@/assets/hero/stock/ageing-mobile-768.avif.asset.json";
import ageingMobile480Webp from "@/assets/hero/stock/ageing-mobile-480.webp.asset.json";
import ageingMobile768Webp from "@/assets/hero/stock/ageing-mobile-768.webp.asset.json";
import screeningDesktop480Avif from "@/assets/hero/stock/screening-desktop-480.avif.asset.json";
import screeningDesktop768Avif from "@/assets/hero/stock/screening-desktop-768.avif.asset.json";
import screeningDesktop1200Avif from "@/assets/hero/stock/screening-desktop-1200.avif.asset.json";
import screeningDesktop480Webp from "@/assets/hero/stock/screening-desktop-480.webp.asset.json";
import screeningDesktop768Webp from "@/assets/hero/stock/screening-desktop-768.webp.asset.json";
import screeningDesktop1200Webp from "@/assets/hero/stock/screening-desktop-1200.webp.asset.json";
import screeningMobile480Avif from "@/assets/hero/stock/screening-mobile-480.avif.asset.json";
import screeningMobile768Avif from "@/assets/hero/stock/screening-mobile-768.avif.asset.json";
import screeningMobile480Webp from "@/assets/hero/stock/screening-mobile-480.webp.asset.json";
import screeningMobile768Webp from "@/assets/hero/stock/screening-mobile-768.webp.asset.json";

const srcSet = (...candidates: ReadonlyArray<readonly [string, number]>): string =>
  candidates.map(([url, width]) => `${url} ${width}w`).join(", ");

const localSrcSet = (
  mobile480: string,
  mobile768: string,
  desktop480: string,
  desktop768: string,
  desktop1200: string,
) => ({
  mobile: srcSet([mobile480, 480], [mobile768, 768]),
  desktop: srcSet([desktop480, 480], [desktop768, 768], [desktop1200, 1200]),
});

const wellnessAvif = localSrcSet(wellnessMobile480Avif.url, wellnessMobile768Avif.url, wellnessDesktop480Avif.url, wellnessDesktop768Avif.url, wellnessDesktop1200Avif.url);
const wellnessWebp = localSrcSet(wellnessMobile480Webp.url, wellnessMobile768Webp.url, wellnessDesktop480Webp.url, wellnessDesktop768Webp.url, wellnessDesktop1200Webp.url);
const ageingAvif = localSrcSet(ageingMobile480Avif.url, ageingMobile768Avif.url, ageingDesktop480Avif.url, ageingDesktop768Avif.url, ageingDesktop1200Avif.url);
const ageingWebp = localSrcSet(ageingMobile480Webp.url, ageingMobile768Webp.url, ageingDesktop480Webp.url, ageingDesktop768Webp.url, ageingDesktop1200Webp.url);
const screeningAvif = localSrcSet(screeningMobile480Avif.url, screeningMobile768Avif.url, screeningDesktop480Avif.url, screeningDesktop768Avif.url, screeningDesktop1200Avif.url);
const screeningWebp = localSrcSet(screeningMobile480Webp.url, screeningMobile768Webp.url, screeningDesktop480Webp.url, screeningDesktop768Webp.url, screeningDesktop1200Webp.url);

export type HeroSlide = {
  src: string;
  avifSrcSet: string;
  webpSrcSet: string;
  mobileAvifSrcSet?: string;
  mobileWebpSrcSet?: string;
  label: string;
  alt: string;
  posMobile: string;
  posTablet: string;
  posDesktop: string;
  fit?: "cover" | "contain";
  eyebrow?: string;
  headline?: string;
  supportingCopy?: string;
};

const joggingWomanAvifSrcSet = srcSet([joggingWoman480Avif, 480], [joggingWoman768Avif, 768], [joggingWoman1200Avif, 1200], [joggingWoman1920Avif, 1920]);
const joggingWomanWebpSrcSet = srcSet([joggingWoman480Webp, 480], [joggingWoman768Webp, 768], [joggingWoman1200Webp, 1200], [joggingWoman1920Webp, 1920]);
const bloodTestKitAvif = srcSet([bloodTestKit480Avif, 480], [bloodTestKit768Avif, 768], [bloodTestKit1200Avif, 1200], [bloodTestKit1590Avif, 1590]);
const bloodTestKitWebp = srcSet([bloodTestKit480Webp, 480], [bloodTestKit768Webp, 768], [bloodTestKit1200Webp, 1200], [bloodTestKit1590Webp, 1590]);
const gymSelfieAvif = srcSet([gymSelfie480Avif, 480], [gymSelfie768Avif, 768], [gymSelfie1200Avif, 1200]);
const gymSelfieWebp = srcSet([gymSelfie480Webp, 480], [gymSelfie768Webp, 768], [gymSelfie1200Webp, 1200]);

export const FIRST_SLIDE_SRC: string = joggingWoman;
export const FIRST_SLIDE_PRELOAD_HREF: string = joggingWoman1200Avif;
export const FIRST_SLIDE_AVIF_SRCSET: string = joggingWomanAvifSrcSet;
export const FIRST_SLIDE_WEBP_SRCSET: string = joggingWomanWebpSrcSet;

export const FIRST_SLIDE_LQIP =
  "data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAADwBACdASogABUAPu1cq04ppKQiMBgMATAdiWYAsOwQ8K9HyiX4F5aT3lgrt7OcrHAA/uqDRKnL5YU7cmWJ8ia6JPvg2tpXgVF0QsnGzmDF8hRV8CcPjGNzBIn08ReUQBwSA1Ey1HIn4cyRS5s6pKpTzoDBRAS/DpxFyby/9d26U7c0n6lUmar9erfa0gkbaOCI+mur9hZDz4naSj6Fx8WJHBxkoAAA";

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
    src: wellnessDesktop1200Webp.url,
    avifSrcSet: wellnessAvif.desktop,
    webpSrcSet: wellnessWebp.desktop,
    mobileAvifSrcSet: wellnessAvif.mobile,
    mobileWebpSrcSet: wellnessWebp.mobile,
    label: "Your health. Your choice. Compare with confidence.",
    alt: "Woman stretching before a run on a sunny country road",
    posMobile: "center center",
    posTablet: "center center",
    posDesktop: "center center",
    eyebrow: "Your health. Your choice.",
    headline: "Compare with confidence.",
    supportingCopy: "Private health tests, clearly compared.",
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
    src: ageingDesktop1200Webp.url,
    avifSrcSet: ageingAvif.desktop,
    webpSrcSet: ageingWebp.desktop,
    mobileAvifSrcSet: ageingAvif.mobile,
    mobileWebpSrcSet: ageingWebp.mobile,
    label: "Plan well for the years ahead.",
    alt: "Older couple carrying exercise mats while walking in a park",
    posMobile: "center center",
    posTablet: "center center",
    posDesktop: "center center",
    eyebrow: "Healthy ageing",
    headline: "Plan well for the years ahead.",
    supportingCopy: "Compare tests for health, wellbeing and longevity.",
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
    src: screeningDesktop1200Webp.url,
    avifSrcSet: screeningAvif.desktop,
    webpSrcSet: screeningWebp.desktop,
    mobileAvifSrcSet: screeningAvif.mobile,
    mobileWebpSrcSet: screeningWebp.mobile,
    label: "Private screening, made clearer.",
    alt: "Patient discussing private screening options with a clinician",
    posMobile: "center center",
    posTablet: "center center",
    posDesktop: "center center",
    eyebrow: "Private screening",
    headline: "Private screening, made clearer.",
    supportingCopy: "Compare options, prices and providers in one place.",
  },
];