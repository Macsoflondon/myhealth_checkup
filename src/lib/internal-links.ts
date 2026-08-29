/**
 * Internal link graph.
 *
 * Builds contextual links between test categories, providers and comparison
 * hubs so related pages reinforce each other's topical relevance and users can
 * move sideways through the catalogue without returning to the homepage.
 *
 * Pure data + pure functions: no data fetching, safe to call during SSR.
 */

import { getCategoryContent } from '@/data/categoryContent';
import { goalPages } from '@/data/goalPages';
import { symptomPages } from '@/data/symptomPages';
import { PROVIDER_NAMES, normalizeProviderId } from '@/constants/providers';
import { SLUG_TO_DB_CATEGORIES } from '@/constants/categories';

export interface InternalLink {
  label: string;
  to: string;
  description?: string;
}

export interface RelatedLinkGroup {
  title: string;
  links: InternalLink[];
}

/** Canonical category slugs backed by a /tests/$category landing page. */
export const LINKABLE_CATEGORY_SLUGS = [
  'hormones',
  'thyroid',
  'general-health',
  'womens-health',
  'mens-health',
  'fertility',
  'heart-health',
  'diabetes',
  'vitamins',
  'cancer-screening',
] as const;

export type LinkableCategorySlug = (typeof LINKABLE_CATEGORY_SLUGS)[number];

/** Sibling categories a reader of the key category is most likely to want next. */
const RELATED_CATEGORIES: Record<LinkableCategorySlug, LinkableCategorySlug[]> = {
  hormones: ['thyroid', 'fertility', 'mens-health', 'womens-health'],
  thyroid: ['hormones', 'vitamins', 'general-health', 'womens-health'],
  'general-health': ['heart-health', 'diabetes', 'vitamins', 'thyroid'],
  'womens-health': ['hormones', 'fertility', 'thyroid', 'vitamins'],
  'mens-health': ['hormones', 'heart-health', 'fertility', 'general-health'],
  fertility: ['hormones', 'womens-health', 'mens-health', 'thyroid'],
  'heart-health': ['diabetes', 'general-health', 'vitamins', 'mens-health'],
  diabetes: ['heart-health', 'general-health', 'vitamins', 'hormones'],
  vitamins: ['general-health', 'thyroid', 'heart-health', 'womens-health'],
  'cancer-screening': ['general-health', 'mens-health', 'womens-health', 'hormones'],
};

/** Goal and symptom hubs that share subject matter with a category. */
const CATEGORY_HUBS: Record<LinkableCategorySlug, { goals: string[]; symptoms: string[] }> = {
  hormones: { goals: ['performance'], symptoms: ['low-libido', 'fatigue'] },
  thyroid: { goals: ['weight-loss'], symptoms: ['fatigue', 'hair-loss'] },
  'general-health': { goals: ['preventative-health', 'longevity'], symptoms: ['fatigue'] },
  'womens-health': { goals: ['preventative-health'], symptoms: ['hair-loss', 'low-mood'] },
  'mens-health': { goals: ['performance'], symptoms: ['low-libido', 'hair-loss'] },
  fertility: { goals: ['preventative-health'], symptoms: ['low-libido'] },
  'heart-health': { goals: ['longevity', 'preventative-health'], symptoms: ['weight-gain'] },
  diabetes: { goals: ['weight-loss'], symptoms: ['weight-gain', 'fatigue'] },
  vitamins: { goals: ['performance', 'longevity'], symptoms: ['fatigue', 'low-mood'] },
  'cancer-screening': { goals: ['preventative-health'], symptoms: [] },
};

/** Providers with a public profile page worth linking to. */
const LINKABLE_PROVIDER_IDS = [
  'medichecks',
  'randox',
  'london-medical-laboratory',
  'lola-health',
  'goodbody-clinic',
  'london-health-company',
  'medical-diagnosis',
  'clinilabs',
] as const;

const isLinkableCategory = (slug: string | null | undefined): slug is LinkableCategorySlug =>
  !!slug && (LINKABLE_CATEGORY_SLUGS as readonly string[]).includes(slug);

const categoryLabel = (slug: LinkableCategorySlug): string =>
  getCategoryContent(slug)?.name ?? slug.replace(/-/g, ' ');

export const getCategoryLink = (slug: string): InternalLink | null =>
  isLinkableCategory(slug) ? { label: categoryLabel(slug), to: `/tests/${slug}` } : null;

/** Sibling category pages for a given category slug. */
export function getRelatedCategoryLinks(slug: string, limit = 4): InternalLink[] {
  if (!isLinkableCategory(slug)) return [];
  return RELATED_CATEGORIES[slug]
    .slice(0, limit)
    .map((related) => ({
      label: categoryLabel(related),
      to: `/tests/${related}`,
      description: getCategoryContent(related)?.heroSubtitle,
    }));
}

/** Provider profile links, optionally excluding the provider already in view. */
export function getProviderLinks(excludeProviderId?: string, limit = 6): InternalLink[] {
  const exclude = excludeProviderId ? normalizeProviderId(excludeProviderId) : null;
  return LINKABLE_PROVIDER_IDS.filter((id) => id !== exclude)
    .slice(0, limit)
    .map((id) => ({
      label: PROVIDER_NAMES[id] ?? id,
      to: `/provider/${id}`,
    }));
}

/** Comparison surfaces: category comparison, goal hubs and symptom hubs. */
export function getCompareLinks(categorySlug?: string | null, limit = 5): InternalLink[] {
  const links: InternalLink[] = [];

  if (isLinkableCategory(categorySlug ?? undefined)) {
    const slug = categorySlug as LinkableCategorySlug;
    links.push({
      label: `Compare ${categoryLabel(slug)} across providers`,
      to: `/compare?category=${slug}`,
    });

    for (const goalSlug of CATEGORY_HUBS[slug].goals) {
      const goal = goalPages.find((g) => g.slug === goalSlug);
      if (goal) {
        links.push({
          label: `Tests for ${goal.name.toLowerCase()}`,
          to: `/compare/goals/${goal.slug}`,
          description: goal.shortDescription,
        });
      }
    }

    for (const symptomSlug of CATEGORY_HUBS[slug].symptoms) {
      const symptom = symptomPages.find((s) => s.slug === symptomSlug);
      if (symptom) {
        links.push({
          label: `Tests for ${symptom.name.toLowerCase()}`,
          to: `/compare/symptoms/${symptom.slug}`,
        });
      }
    }
  }

  links.push(
    { label: 'Compare all providers', to: '/providers/compare' },
    { label: 'Compare by goal', to: '/compare/goals' },
    { label: 'Compare by symptom', to: '/compare/symptoms' },
  );

  // De-duplicate by destination, keeping the most specific link first.
  const seen = new Set<string>();
  return links.filter((link) => (seen.has(link.to) ? false : (seen.add(link.to), true))).slice(0, limit);
}

/**
 * Maps a raw provider_tests category value (e.g. "Hormone Tests") onto the
 * canonical slug used by /tests/$category. Returns null when unmappable.
 */
export function resolveCategorySlug(dbCategory: string | null | undefined): LinkableCategorySlug | null {
  if (!dbCategory) return null;
  const normalized = dbCategory.toLowerCase().trim().replace(/[\s&]+/g, '-').replace(/-+/g, '-');
  if (isLinkableCategory(normalized)) return normalized;

  for (const [slug, dbValues] of Object.entries(SLUG_TO_DB_CATEGORIES)) {
    if (!isLinkableCategory(slug)) continue;
    if (dbValues.some((value) => value.toLowerCase() === dbCategory.toLowerCase())) return slug;
  }

  // Fall back to a keyword match so unmapped provider wording still links out.
  const haystack = dbCategory.toLowerCase();
  const found = LINKABLE_CATEGORY_SLUGS.find((slug) => haystack.includes(slug.replace(/-/g, ' ')));
  return found ?? null;
}

export interface RelatedLinksInput {
  categorySlug?: string | null;
  providerId?: string | null;
  /** Max links per group. */
  limit?: number;
}

/** Builds the grouped link set rendered by <RelatedLinks />. */
export function buildRelatedLinks({
  categorySlug,
  providerId,
  limit = 5,
}: RelatedLinksInput): RelatedLinkGroup[] {
  const groups: RelatedLinkGroup[] = [];

  const categories = getRelatedCategoryLinks(categorySlug ?? '', limit);
  if (categories.length > 0) {
    groups.push({ title: 'Related test categories', links: categories });
  }

  const compare = getCompareLinks(categorySlug, limit);
  if (compare.length > 0) {
    groups.push({ title: 'Compare side by side', links: compare });
  }

  const providers = getProviderLinks(providerId ?? undefined, limit);
  if (providers.length > 0) {
    groups.push({ title: 'Other accredited providers', links: providers });
  }

  return groups;
}
