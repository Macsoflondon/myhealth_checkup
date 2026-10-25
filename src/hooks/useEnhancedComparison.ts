import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type {
  EnhancedTestData,
  ComparisonResult,
  SavedComparison,
} from "@/types/comparison";
import { PROVIDER_NAMES, PROVIDER_LOGOS } from "@/constants/providers";
import { computeTotalExpectedCost } from "@/lib/comparisonFormat";
import { resolveAccreditationsFromRow } from "@/lib/resolve-test-fields";

export interface RawTestRow {
  id?: string;
  test_name?: string;
  category?: string | null;
  description?: string | null;
  price?: number | null;
  provider_id?: string;
  sample_type?: string | null;
  biomarker_count?: number | null;
  biomarkers_list?: unknown;
  turnaround_days_text?: string | null;
  home_kit_available?: boolean | null;
  clinic_visit_available?: boolean | null;
  gp_consultation_included?: boolean | null;
  gp_consultation_cost?: number | null;
  phlebotomy_included?: boolean | null;
  phlebotomy_cost?: number | null;
  url?: string | null;
  image_url?: string | null;
  updated_at?: string | null;
  lab_ukas_accredited?: boolean | null;
  lab_cqc_regulated?: boolean | null;
  lab_iso15189?: boolean | null;
}

/** Pull a day count out of a real turnaround string, e.g. "2-3 days" -> 3. */
const parseTurnaroundDays = (
  text: string | null | undefined,
): number | null => {
  if (!text) return null;
  const numbers = text.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  const days = Number(numbers[numbers.length - 1]);
  return Number.isFinite(days) && days > 0 ? days : null;
};

/**
 * Transform a raw `provider_tests` row into the comparison system's display
 * shape. Exported standalone (not just as a `useCallback` inside the hook)
 * so the honesty of each field can be tested directly — see
 * `useEnhancedComparison.honesty.test.ts`. Missing real data must come
 * through as `null`/`[]`, never a plausible-looking invented value: this
 * function used to default a missing biomarker count/list by keyword-
 * matching the test's free-text description, default turnaround to a flat
 * 3 days, and hardcode `["UKAS", "CQC"]` as every test's accreditations
 * regardless of its real `lab_*` flags (2026-10-23 test-card audit, pass 4).
 */
export function transformRawTestToEnhanced(
  rawTest: RawTestRow,
): EnhancedTestData {
  const test = rawTest as RawTestRow & Record<string, any>;
  const basePrice = test.price ?? null;
  const gpCost = test.gp_consultation_included
    ? 0
    : test.gp_consultation_cost || 0;
  const phlebCost = test.phlebotomy_included ? 0 : test.phlebotomy_cost || 0;

  const providerId = test.provider_id ?? "";
  const providerName = PROVIDER_NAMES[providerId] || providerId;
  const providerLogo = PROVIDER_LOGOS[providerId] || "";

  const sampleTypeCode = test.sample_type ?? null;
  const collectionMethod = test.collection_method ?? null;
  const collectionFeeType = test.collection_fee_type ?? null;
  const collectionFeeAmount =
    test.collection_fee_amount != null
      ? Number(test.collection_fee_amount)
      : null;
  const clinicalReviewType = test.clinical_review_type ?? null;
  const clinicalReviewFee =
    test.clinical_review_fee != null ? Number(test.clinical_review_fee) : null;

  const totalExpectedCost = computeTotalExpectedCost(
    basePrice,
    collectionFeeType,
    collectionFeeAmount,
    clinicalReviewType,
    clinicalReviewFee,
  );

  return {
    id: test.id ?? "",
    testName: test.test_name ?? "",
    provider: providerName,
    providerId: providerId,
    providerLogo: providerLogo,
    image_url: rawTest.image_url ?? null,
    category: test.category || "General Health",
    basePrice,
    gpConsultationIncluded: test.gp_consultation_included || false,
    gpConsultationCost: test.gp_consultation_cost ?? null,
    phlebotomyIncluded: test.phlebotomy_included || false,
    phlebotomyCost: test.phlebotomy_cost ?? null,
    // Dead/unrendered legacy field — kept null-safe, never shown to users
    totalEstimatedCost: (basePrice ?? 0) + gpCost + phlebCost,
    turnaroundDays: parseTurnaroundDays(test.turnaround_days_text) ?? null,
    sampleType: (test.sample_type ||
      "finger-prick") as EnhancedTestData["sampleType"],
    homeKitAvailable: test.home_kit_available ?? null,
    clinicVisitAvailable: test.clinic_visit_available ?? null,
    sampleTypeCode: sampleTypeCode as EnhancedTestData["sampleTypeCode"],
    collectionMethod,
    collectionFeeType,
    collectionFeeAmount,
    clinicalReviewType,
    clinicalReviewFee,
    totalExpectedCost,
    biomarkerCount: test.biomarker_count ?? null,
    biomarkersList: (test.biomarkers_list as string[] | null) ?? null,
    accreditations: resolveAccreditationsFromRow(test) ?? [],
    description: test.description || "",
    url: test.url ?? null,
    dataSource: "database",
    lastUpdated: test.updated_at ?? undefined,
  };
}

export function useEnhancedComparison() {
  const { user } = useAuth();
  const [selectedTests, setSelectedTests] = useState<EnhancedTestData[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  // Transform raw test data to enhanced format
  const transformToEnhanced = useCallback(transformRawTestToEnhanced, []);

  // Add test to comparison
  const addToComparison = useCallback((test: EnhancedTestData) => {
    setSelectedTests((prev) => {
      if (prev.find((t) => t.id === test.id)) {
        return prev;
      }
      if (prev.length >= 4) {
        toast.error("Maximum 4 tests can be compared at once");
        return prev;
      }
      return [...prev, test];
    });
  }, []);

  // Remove test from comparison
  const removeFromComparison = useCallback((testId: string) => {
    setSelectedTests((prev) => prev.filter((t) => t.id !== testId));
  }, []);

  // Clear all selected tests
  const clearComparison = useCallback(() => {
    setSelectedTests([]);
  }, []);

  // Calculate comparison results
  const comparisonResult = useMemo((): ComparisonResult | null => {
    if (selectedTests.length < 2) return null;

    // Find best value (lowest total expected cost). A null cost means the
    // real price isn't known — it must never win "Best Value" just because
    // `null < someNumber` coerces null to 0.
    const bestValue = selectedTests.reduce(
      (best, test) =>
        test.totalExpectedCost != null &&
        test.totalExpectedCost < (best?.totalExpectedCost ?? Infinity)
          ? test
          : best,
      selectedTests[0],
    );

    // Find fastest results — same null-coercion trap as above.
    const fastestResults = selectedTests.reduce(
      (fastest, test) =>
        test.turnaroundDays != null &&
        test.turnaroundDays < (fastest?.turnaroundDays ?? Infinity)
          ? test
          : fastest,
      selectedTests[0],
    );

    // Find most comprehensive
    const mostComprehensive = selectedTests.reduce(
      (most, test) =>
        (test.biomarkerCount ?? 0) > (most?.biomarkerCount ?? 0) ? test : most,
      selectedTests[0],
    );

    // Calculate biomarker overlap — a null biomarkersList means no real list
    // is known, treated as an empty set rather than crashing on `.map`.
    const allBiomarkers = selectedTests.map(
      (t) => new Set((t.biomarkersList ?? []).map((b) => b.toLowerCase())),
    );
    const overlap = allBiomarkers.reduce(
      (acc, set) => new Set([...acc].filter((x) => set.has(x))),
    );

    // Calculate unique biomarkers per test
    const uniqueBiomarkers: Record<string, string[]> = {};
    selectedTests.forEach((test) => {
      const testBiomarkers = new Set(
        (test.biomarkersList ?? []).map((b) => b.toLowerCase()),
      );
      const unique = [...testBiomarkers].filter((b) => {
        const inOthers = selectedTests
          .filter((t) => t.id !== test.id)
          .some((t) =>
            (t.biomarkersList ?? []).map((x) => x.toLowerCase()).includes(b),
          );
        return !inOthers;
      });
      uniqueBiomarkers[test.id] = unique;
    });

    return {
      tests: selectedTests,
      bestValue: bestValue?.id || null,
      fastestResults: fastestResults?.id || null,
      mostComprehensive: mostComprehensive?.id || null,
      biomarkerOverlap: [...overlap],
      uniqueBiomarkers,
    };
  }, [selectedTests]);

  // Save comparison
  const saveComparison = useCallback(
    async (name: string, notes?: string) => {
      if (!user) {
        toast.error("Please sign in to save comparisons");
        return null;
      }

      if (selectedTests.length < 2) {
        toast.error("Select at least 2 tests to save a comparison");
        return null;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("saved_comparisons")
          .insert({
            user_id: user.id,
            comparison_name: name,
            test_ids: selectedTests.map((t) => t.id),
            category: selectedTests[0]?.category || null,
            notes: notes || null,
          })
          .select()
          .single();

        if (error) throw error;

        toast.success("Comparison saved successfully");
        return data;
      } catch (error) {
        console.error("Error saving comparison:", error);
        toast.error("Failed to save comparison");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, selectedTests],
  );

  // Load saved comparisons
  const loadSavedComparisons = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_comparisons")
        .select(
          "id, user_id, comparison_name, test_ids, category, notes, created_at, updated_at",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSavedComparisons(
        data?.map((item) => ({
          id: item.id,
          userId: item.user_id,
          comparisonName: item.comparison_name,
          testIds: item.test_ids,
          category: item.category,
          notes: item.notes,
          createdAt: item.created_at ?? "",
          updatedAt: item.updated_at ?? "",
        })) || [],
      );
    } catch (error) {
      console.error("Error loading saved comparisons:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Delete saved comparison
  const deleteSavedComparison = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from("saved_comparisons")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        setSavedComparisons((prev) => prev.filter((c) => c.id !== id));
        toast.success("Comparison deleted");
      } catch (error) {
        console.error("Error deleting comparison:", error);
        toast.error("Failed to delete comparison");
      }
    },
    [user],
  );

  return {
    selectedTests,
    comparisonResult,
    savedComparisons,
    isLoading,
    addToComparison,
    removeFromComparison,
    clearComparison,
    saveComparison,
    loadSavedComparisons,
    deleteSavedComparison,
    transformToEnhanced,
  };
}
