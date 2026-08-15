import { CompareTestData } from "@/types";
import { PROVIDER_LOGOS, PROVIDER_NAMES } from "@/constants/providers";
import {
  resolveTurnaround,
  resolveCollection,
  resolveAccreditationsFromRow,
} from "@/lib/resolve-test-fields";

/**
 * Minimal structural shape the transformer needs. Database rows expose these
 * columns as nullable, so nullability is normalised here at the boundary.
 */
export interface LiveTestRow {
  id: string;
  test_name: string;
  provider_id: string;
  category: string | null;
  price: number | null;
  description: string | null;
  is_active: boolean | null;
  url: string | null;
  /** Authoritative stored biomarker total (provider_tests.biomarker_count). */
  biomarker_count?: number | null;
  biomarkers_list?: unknown;
  /** Real scraped turnaround, when the provider stated one. */
  turnaround_days_text?: string | null;
  turnaround_raw?: string | null;
  /** Real scraped collection info. */
  sample_type?: string | null;
  collection_method?: string | null;
  /** Real recorded collection fee, when the provider charges one. */
  collection_fee_type?: string | null;
  collection_fee_amount?: number | null;
  /** Real recorded clinical review position for this test. */
  clinical_review_type?: string | null;
  clinical_review_fee?: number | null;
  /** Real accreditation flags recorded against the row's lab. */
  lab_ukas_accredited?: boolean | null;
  lab_cqc_regulated?: boolean | null;
  lab_iso15189?: boolean | null;
}

const COLLECTION_FEE_TYPES = ['none', 'fixed', 'from', 'varies', 'self_arranged'] as const;
const CLINICAL_REVIEW_TYPES = [
  'included', 'optional', 'gp_included', 'consultant_included',
  'clinician_included', 'not_included', 'not_available',
] as const;

type CollectionFeeType = (typeof COLLECTION_FEE_TYPES)[number];
type ClinicalReviewType = (typeof CLINICAL_REVIEW_TYPES)[number];

/** Only accept values the comparison label maps understand; never guess. */
const toCollectionFeeType = (v: string | null | undefined): CollectionFeeType | null =>
  v && (COLLECTION_FEE_TYPES as readonly string[]).includes(v) ? (v as CollectionFeeType) : null;

const toClinicalReviewType = (v: string | null | undefined): ClinicalReviewType | null =>
  v && (CLINICAL_REVIEW_TYPES as readonly string[]).includes(v) ? (v as ClinicalReviewType) : null;

/** Pull a day count out of a real turnaround string, e.g. "2-3 days" -> 3. */
const parseTurnaroundDays = (text: string | null | undefined): number | null => {
  if (!text) return null;
  const numbers = text.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  const days = Number(numbers[numbers.length - 1]);
  return Number.isFinite(days) && days > 0 ? days : null;
};


/**
 * Normalise the stored biomarkers_list JSON into plain strings.
 */
const toBiomarkerNames = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      if (entry && typeof entry === 'object' && 'value' in entry) {
        const value = (entry as { value?: unknown }).value;
        return typeof value === 'string' ? value : '';
      }
      return '';
    })
    .filter((name) => name.trim().length > 0);
};

/**
 * Transform raw test data from database into CompareTestData format
 */
export class TestDataTransformer {
  /**
   * Transform a single test record
   */
  static transformSingle(test: LiveTestRow): CompareTestData {
    const biomarkersList = toBiomarkerNames(test.biomarkers_list);
    // The stored count is the source of truth; never estimate it from copy.
    const biomarkerCount =
      typeof test.biomarker_count === 'number' && test.biomarker_count > 0
        ? test.biomarker_count
        : biomarkersList.length;
    const category = test.category ?? 'General';

    return {
      id: test.id,
      name: test.test_name,
      provider: PROVIDER_NAMES[test.provider_id] || test.provider_id,
      price: test.price || 0,
      category,
      description: test.description || '',
      features: {
        turnaround: resolveTurnaround(test, test.provider_id),
        collection: resolveCollection(test, test.provider_id),
        bioMarkers: biomarkersList.slice(0, 3).join(', ') || this.extractBioMarkers(test.description || '')
      },
      providerLogo: PROVIDER_LOGOS[test.provider_id] || '/placeholder.svg',
      available: test.is_active ?? true,
      accreditations: this.getAccreditations(test),
      popularityScore: this.estimatePopularity(test.test_name, category),
      biomarkerCount,
      biomarkersList,
      turnaroundDays: this.resolveTurnaroundDays(test),
      userRating: undefined,
      url: test.url || undefined
    };
  }

  /**
   * Transform multiple test records
   */
  static transformMultiple(tests: LiveTestRow[]): CompareTestData[] {
    return tests.map(test => this.transformSingle(test));
  }

  /**
   * Extract biomarker information from description
   */
  private static extractBioMarkers(description: string): string {
    if (!description) return '';
    
    const commonMarkers = [
      'cholesterol', 'hdl', 'ldl', 'triglycerides',
      'glucose', 'hba1c', 'insulin',
      'tsh', 't3', 't4',
      'vitamin d', 'b12', 'folate', 'iron',
      'testosterone', 'estrogen', 'progesterone',
      'cortisol', 'dhea'
    ];
    
    const found = commonMarkers.filter(marker => 
      description.toLowerCase().includes(marker)
    );
    
    return found.length > 0 ? found.slice(0, 3).join(', ') : '';
  }

  /**
   * Accreditations: the row's real flags win; the provider-level map is only
   * used when the row states none of them.
   */
  private static getAccreditations(test: LiveTestRow): string[] {
    const fromRow = resolveAccreditationsFromRow(test);
    if (fromRow) return fromRow;

    const accreditationMap: Record<string, string[]> = {
      'medichecks': ['UKAS', 'CQC'],
      'goodbody-clinic': ['UKAS', 'ISO 15189'],
      'randox': ['UKAS', 'ISO 15189'],
      'thriva': ['CQC'],
      'london-medical-laboratory': ['CQC', 'ISO 15189'],
      'lola-health': ['CQC']
    };
    
    return accreditationMap[test.provider_id] || [];
  }

  /**
   * Estimate test popularity based on name and category
   */
  private static estimatePopularity(testName: string, category: string): number {
    const nameLower = testName.toLowerCase();
    
    // High popularity tests
    if (nameLower.includes('vitamin d') || 
        nameLower.includes('thyroid') ||
        nameLower.includes('testosterone') ||
        nameLower.includes('full blood count') ||
        nameLower.includes('hba1c')) {
      return 85;
    }
    
    // Medium-high popularity
    if (nameLower.includes('cholesterol') ||
        nameLower.includes('liver') ||
        nameLower.includes('kidney') ||
        nameLower.includes('hormone')) {
      return 75;
    }
    
    // Standard popularity for common categories
    if (category.toLowerCase().includes('general') ||
        category.toLowerCase().includes('wellness') ||
        category.toLowerCase().includes('heart')) {
      return 65;
    }
    
    return 50; // Default popularity
  }

  /**
   * Turnaround in days: derived from the row's real turnaround text when it
   * states one, otherwise the provider-level estimate.
   */
  private static resolveTurnaroundDays(test: LiveTestRow): number {
    const fromRow =
      parseTurnaroundDays(test.turnaround_days_text) ??
      parseTurnaroundDays(test.turnaround_raw);
    if (fromRow !== null) return fromRow;

    const turnaroundMap: Record<string, number> = {
      'medichecks': 2,
      'goodbody-clinic': 1,
      'randox': 2,
      'thriva': 3,
      'london-medical-laboratory': 1,
      'lola-health': 2
    };
    
    return turnaroundMap[test.provider_id] || 3;
  }
}
