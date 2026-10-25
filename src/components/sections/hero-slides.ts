// Still of the hero video's first frame, so the photo that paints first
// matches the loop that fades in over it. Source is 1280x720, so no larger
// candidate is generated.
import heroStill480Avif from "@/assets/hero/generated/hero-video-still-480.avif";
import heroStill768Avif from "@/assets/hero/generated/hero-video-still-768.avif";
import heroStill1280Avif from "@/assets/hero/generated/hero-video-still-1280.avif";
import heroStill480Webp from "@/assets/hero/generated/hero-video-still-480.webp";
import heroStill768Webp from "@/assets/hero/generated/hero-video-still-768.webp";
import heroStill1280Webp from "@/assets/hero/generated/hero-video-still-1280.webp";

const srcSet = (
  ...candidates: ReadonlyArray<readonly [string, number]>
): string => candidates.map(([url, width]) => `${url} ${width}w`).join(", ");

const heroStillAvifSrcSet = srcSet(
  [heroStill480Avif, 480],
  [heroStill768Avif, 768],
  [heroStill1280Avif, 1280],
);
const heroStillWebpSrcSet = srcSet(
  [heroStill480Webp, 480],
  [heroStill768Webp, 768],
  [heroStill1280Webp, 1280],
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
  alt: "Woman resting with a towel in a gym after a workout",
  eyebrow: "UK private blood tests",
  headline: "Compare private blood tests.",
  headlineLines: ["Compare private", "blood tests."],
  supportingCopy:
    "Compare UK private blood tests by price, biomarkers and typical turnaround time.",
  align: "right",
  copyWidthTablet: "56%",
  copyWidthDesktop: "40%",
  copyPlacementMobile: "top",
};

/** Hero photo shown from first paint and while the video loads. */
export const HERO_POSTER_SRC: string = heroStill1280Webp;
export const HERO_POSTER_WEBP_SRCSET: string = heroStillWebpSrcSet;

export const FIRST_SLIDE_PRELOAD_HREF: string = heroStill1280Avif;
export const FIRST_SLIDE_AVIF_SRCSET: string = heroStillAvifSrcSet;

export const FIRST_SLIDE_LQIP =
  "data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAACQBQCdASogABIAPu1oq08ppiOiMBgIATAdiWcAADFw/x+iqfkBaAMQqMx6ScAJYwahBOfgAAD+1cZyaMXnnmixG/OkDLfX+3wwwh3p3r79Hv2D8m2WRvmnBoFR/goA1zkwvfGkT3NSwI8BWPyEyx5ivIExx2v8Yji1Alvi03e+VxF+PR87f6wH88/c+LSBT+uqqNGiaakpQuvpAl35NuGTXGvQnY9j9lQtZA3JeY7xIAAA";

export const HERO_CAPTION =
  "Your trusted platform for comparing private health and cancer screening tests.";
