import { useMemo } from "react";
import { compareCategories } from "@/constants/categories";

/**
 * Hook to provide navigation data and filtering logic.
 *
 * NOTE: Previously this hook eagerly imported large static catalogues
 * (goodbodyTests, medichecksTests, londonLaboratoryTests) for a
 * `getTestsForNavigation` helper that no consumer actually called.
 * Those imports have been removed to slim every page's initial bundle —
 * the header used to drag ~1,400 lines of catalogue JSON into the main chunk.
 */
export const useNavigationData = () => {
  /**
   * Get filtered categories based on navigation section
   */
  const getFilteredCategories = (itemName: string) => {
    switch (itemName) {
      case "Most Popular Tests":
        return compareCategories.filter(cat =>
          ['general-health', 'blood-tests', 'hormones', 'thyroid', 'vitamins', 'heart-health', 'cancer-screening', 'fertility'].includes(cat.id)
        );

      case "Women's Health":
        return compareCategories.filter(cat =>
          ['womens-health', 'hormones', 'fertility', 'thyroid'].includes(cat.id)
        );

      case "Men's Health":
        return compareCategories.filter(cat =>
          ['mens-health', 'hormones', 'fertility', 'fitness-health'].includes(cat.id)
        );

      case "Sports-Fitness Health":
        return compareCategories.filter(cat =>
          ['fitness-health', 'vitamins', 'hormones', 'general-health', 'heart-health'].includes(cat.id)
        );

      case "At Home Tests":
        return compareCategories.filter(cat =>
          ['blood-tests', 'vitamins', 'hormones', 'thyroid', 'diabetes', 'heart-health', 'allergy-testing', 'general-health'].includes(cat.id)
        );

      case "Fertility - Prenatal":
        return compareCategories.filter(cat =>
          ['fertility', 'hormones', 'womens-health', 'mens-health'].includes(cat.id)
        );

      case "Cancer Screening":
        return compareCategories.filter(cat =>
          ['cancer-screening', 'general-health'].includes(cat.id)
        );

      case "General Wellness":
        return compareCategories.filter(cat =>
          ['weight-loss-tests', 'diabetes', 'heart-health', 'vitamins', 'allergy-testing', 'liver', 'general-health', 'longevity-tests'].includes(cat.id)
        );

      default:
        return compareCategories.slice(0, 8);
    }
  };

  // Kept as no-ops for backwards compatibility with destructuring consumers.
  const getTestsForNavigation = (_categoryFilter: string) => [] as never[];
  const shouldShowGoodbodyTests = (_itemName: string): boolean => false;

  return useMemo(() => ({
    getTestsForNavigation,
    getFilteredCategories,
    shouldShowGoodbodyTests
  }), []);
};
