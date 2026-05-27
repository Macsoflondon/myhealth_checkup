/**
 * Centralised SEO title + description templates.
 *
 * Audit "Per-Page Unique Titles and Meta Descriptions" — every route must
 * emit a distinct <title> and meta description so pages can rank
 * independently. All builders enforce the agreed templates and the brand
 * suffix " | myhealth checkup" so we never drift.
 */

const SITE = "myhealth checkup";
const BASE_URL = "https://www.myhealthcheckup.co.uk";

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

const withSuffix = (s: string) => `${clean(s)} | ${SITE}`;

/** Truncate description to ≤160 chars without cutting words. */
const trimDesc = (s: string, max = 158) => {
  const t = clean(s);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trim()}…`;
};

export const seo = {
  category: (name: string, opts?: { priceFrom?: number }) => {
    const price = opts?.priceFrom ? ` from £${opts.priceFrom}` : "";
    return {
      title: withSuffix(`${name} Tests in the UK — Compare Prices${price}`),
      description: trimDesc(
        `Compare ${name.toLowerCase()} tests from accredited UK providers${price}. Side-by-side prices, biomarkers and turnaround times to help you choose with confidence.`
      ),
    };
  },

  symptom: (name: string, shortDescription?: string) => ({
    title: withSuffix(`Blood Test for ${name} — Compare UK Private Tests`),
    description: trimDesc(
      `Compare private blood tests for ${name.toLowerCase()}.${
        shortDescription ? ` ${shortDescription}.` : ""
      } See recommended panels, key biomarkers and prices from accredited UK providers.`
    ),
  }),

  goal: (name: string, shortDescription?: string) => ({
    title: withSuffix(`Blood Test for ${name} — Compare UK Private Tests`),
    description: trimDesc(
      `Compare private blood tests for ${name.toLowerCase()}.${
        shortDescription ? ` ${shortDescription}.` : ""
      } See recommended panels, key biomarkers and prices from accredited UK providers.`
    ),
  }),

  test: (testName: string, opts?: { providerName?: string; priceGbp?: number | null }) => {
    const priceBit =
      opts?.priceGbp != null
        ? ` from £${opts.priceGbp.toFixed(2)}`
        : "";
    const providerBit = opts?.providerName ? ` Available from ${opts.providerName}.` : "";
    return {
      title: withSuffix(`${testName} — Compare Providers & Prices in the UK`),
      description: trimDesc(
        `Compare the ${testName} across accredited UK providers${priceBit}. View biomarkers, sample method, turnaround and pricing side-by-side.${providerBit}`
      ),
    };
  },

  provider: (
    providerName: string,
    opts?: { rating?: number | null; reviewCount?: number | null }
  ) => {
    const ratingBit =
      opts?.rating && opts?.reviewCount
        ? ` Rated ${opts.rating}/5 from ${opts.reviewCount.toLocaleString()} reviews.`
        : "";
    return {
      title: withSuffix(`${providerName} Reviews & Tests`),
      description: trimDesc(
        `${providerName} private health tests reviewed and compared.${ratingBit} Browse the full test range, prices, accreditations and turnaround times.`
      ),
    };
  },

  providerCatalog: (providerName: string, testCount?: number) => ({
    title: withSuffix(`${providerName} Tests — Browse the Full Range`),
    description: trimDesc(
      `Browse ${
        testCount ? `${testCount}+ ` : ""
      }${providerName} blood tests and health screenings. Compare prices, biomarkers and turnaround times across accredited UK providers.`
    ),
  }),

  blogPost: (postTitle: string) => ({
    title: withSuffix(postTitle),
    description: trimDesc(postTitle),
  }),
};

export const canonical = (path: string) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${p}`;
};

export { BASE_URL, SITE };
