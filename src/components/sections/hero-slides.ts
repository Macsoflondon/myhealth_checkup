import joggingWoman from "@/assets/hero/hero-jogging-woman.png";
// Build-time responsive variants (vite-imagetools).
// A 390px phone pulls the 480w AVIF instead of the full-width original.
import joggingWomanAvifSrcSet from "@/assets/hero/hero-jogging-woman.png?w=480;768;1200;1920&format=avif&as=srcset";
import joggingWomanWebpSrcSet from "@/assets/hero/hero-jogging-woman.png?w=480;768;1200;1920&format=webp&as=srcset";
import seniorCouple from "@/assets/hero/hero-senior-couple.jpg";
import seniorCoupleAvif from "@/assets/hero/hero-senior-couple.jpg?w=480;768;1200&format=avif&as=srcset";
import seniorCoupleWebp from "@/assets/hero/hero-senior-couple.jpg?w=480;768;1200&format=webp&as=srcset";
import benchPhone from "@/assets/hero/hero-bench-phone.jpg";
import benchPhoneAvif from "@/assets/hero/hero-bench-phone.jpg?w=480;768;1200&format=avif&as=srcset";
import benchPhoneWebp from "@/assets/hero/hero-bench-phone.jpg?w=480;768;1200&format=webp&as=srcset";
import bloodTestKit from "@/assets/hero/hero-blood-test-kit.jpg";
import bloodTestKitAvif from "@/assets/hero/hero-blood-test-kit.jpg?w=480;768;1200;1590&format=avif&as=srcset";
import bloodTestKitWebp from "@/assets/hero/hero-blood-test-kit.jpg?w=480;768;1200;1590&format=webp&as=srcset";

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
};

/** URL of the first hero slide — preloaded from the home route head(). */
export const FIRST_SLIDE_SRC: string = joggingWoman;

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
    label: "Know Your Health. Own Your Future.",
    alt: "Woman jogging along a coastal path on a bright morning",
    posMobile: "35% 55%",
    posTablet: "center 32%",
    posDesktop: "center 35%",
  },
  {
    src: seniorCoupleAsset.url,
    label: "Proactive Health for Every Stage of Life",
    alt: "Older couple walking together outdoors in the sunshine",
    posMobile: "50% 40%",
    posTablet: "center 28%",
    posDesktop: "center 30%",
  },
  {
    src: benchPhoneAsset.url,
    label: "Find the Right Test for You, Compare. Choose. Book.",
    alt: "Man sitting on a park bench comparing health tests on his phone",
    posMobile: "55% 50%",
    posTablet: "center 40%",
    posDesktop: "center 40%",
  },
  {
    src: bloodTestKitAsset.url,
    label: "Test from the Comfort of Home",
    alt: "At-home finger-prick blood test kit laid out on a kitchen worktop",
    posMobile: "40% 15%",
    posTablet: "40% 32%",
    posDesktop: "50% 45%",
  },
];
