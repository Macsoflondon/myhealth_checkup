import joggingWoman from "@/assets/hero/hero-jogging-woman.png";
import joggingWoman480Avif from "@/assets/hero/generated/jogging-woman-480.avif";
import joggingWoman768Avif from "@/assets/hero/generated/jogging-woman-768.avif";
import joggingWoman1200Avif from "@/assets/hero/generated/jogging-woman-1200.avif";
import joggingWoman1920Avif from "@/assets/hero/generated/jogging-woman-1920.avif";
import joggingWoman480Webp from "@/assets/hero/generated/jogging-woman-480.webp";
import joggingWoman768Webp from "@/assets/hero/generated/jogging-woman-768.webp";
import joggingWoman1200Webp from "@/assets/hero/generated/jogging-woman-1200.webp";
import joggingWoman1920Webp from "@/assets/hero/generated/jogging-woman-1920.webp";

const srcSet = (
  ...candidates: ReadonlyArray<readonly [string, number]>
): string => candidates.map(([url, width]) => `${url} ${width}w`).join(", ");

const joggingWomanAvifSrcSet = srcSet(
  [joggingWoman480Avif, 480],
  [joggingWoman768Avif, 768],
  [joggingWoman1200Avif, 1200],
  [joggingWoman1920Avif, 1920],
);
const joggingWomanWebpSrcSet = srcSet(
  [joggingWoman480Webp, 480],
  [joggingWoman768Webp, 768],
  [joggingWoman1200Webp, 1200],
  [joggingWoman1920Webp, 1920],
);

export type HeroCopy = {
  alt: string;
  eyebrow?: string;
  headline?: string;
  /** Explicit line breaks for the headline, so wording never wraps awkwardly. */
  headlineLines?: readonly string[];
  supportingCopy?: string;
  /** Which side of the frame the copy sits on. Defaults to left. */
  align?: "left" | "right";
  copyWidthTablet: string;
  copyWidthDesktop: string;
  copyPlacementMobile: "top" | "bottom";
};

/** The single copy block shown over the looping hero video. */
export const HERO_COPY: HeroCopy = {
  alt: "Woman running on a riverside path at sunrise with a city skyline behind her",
  eyebrow: "UK private blood tests",
  headline: "Compare private blood tests.",
  headlineLines: ["Compare private", "blood tests."],
  supportingCopy:
    "Prices, biomarkers and turnaround for UK blood tests and cancer screening.",
  align: "right",
  copyWidthTablet: "56%",
  copyWidthDesktop: "40%",
  copyPlacementMobile: "top",
};

/** Poster shown while the hero video loads, and if autoplay is blocked. */
export const HERO_POSTER_SRC: string = joggingWoman;
export const HERO_POSTER_WEBP_SRCSET: string = joggingWomanWebpSrcSet;

export const FIRST_SLIDE_PRELOAD_HREF: string = joggingWoman1200Avif;
export const FIRST_SLIDE_AVIF_SRCSET: string = joggingWomanAvifSrcSet;

export const FIRST_SLIDE_LQIP =
  "data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAADwBACdASogABUAPu1cq04ppKQiMBgMATAdiWYAsOwQ8K9HyiX4F5aT3lgrt7OcrHAA/uqDRKnL5YU7cmWJ8ia6JPvg2tpXgVF0QsnGzmDF8hRV8CcPjGNzBIn08ReUQBwSA1Ey1HIn4cyRS5s6pKpTzoDBRAS/DpxFyby/9d26U7c0n6lUmar9erfa0gkbaOCI+mur9hZDz4naSj6Fx8WJHBxkoAAA";

export const HERO_CAPTION =
  "Your trusted platform for comparing private health and cancer screening tests.";
