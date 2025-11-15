import { useMemo } from "react";
import { compareCategories } from "@/data/compare/categories";
import { goodbodyTests } from "@/data/goodbodyTests";
import { medichecksTests } from "@/data/medichecksTests";
import { londonLaboratoryTests } from "@/data/londonLaboratoryTests";

/**
 * Hook to provide navigation data and filtering logic
 */
export const useNavigationData = () => {
  /**
   * Get tests filtered by category for navigation dropdowns
   * Combines Goodbody, Medichecks, and London Laboratory tests
   */
  const getTestsForNavigation = (categoryFilter: string) => {
    const goodbodyFiltered = goodbodyTests.filter(test => 
      test.categories.some(cat => 
        cat.toUpperCase() === categoryFilter.toUpperCase()
      )
    );
    
    const medichecksFiltered = medichecksTests.filter(test => 
      test.category.toUpperCase() === categoryFilter.toUpperCase()
    ).map(test => ({
      id: test.id,
      name: test.name,
      provider: 'Medichecks',
      price: test.price,
      categories: [test.category],
      description: test.description
    }));
    
    const londonLabFiltered = londonLaboratoryTests.filter(test => 
      test.category.toUpperCase() === categoryFilter.toUpperCase()
    ).map(test => ({
      id: test.id,
      name: test.name,
      provider: 'London Medical Laboratory',
      price: test.price,
      categories: [test.category],
      description: test.description
    }));
    
    return [...goodbodyFiltered, ...medichecksFiltered, ...londonLabFiltered].slice(0, 10);
  };

  /**
   * Get filtered categories based on navigation section
   */
  const getFilteredCategories = (itemName: string) => {
    switch (itemName) {
      case "Women's Health":
        return compareCategories.filter(cat => 
          ['womens-health-checks', 'female-hormone-tests', 'female-fertility-tests', 
           'thyroid-tests', 'sports-performance-tests'].includes(cat.id)
        );
      
      case "Men's Health":
        return compareCategories.filter(cat => 
          ['mens-health-checks', 'male-hormone-tests', 'male-fertility-tests', 
           'sports-performance-tests'].includes(cat.id)
        );
      
      case "Sports/Fitness Health":
        return compareCategories.filter(cat => 
          ['sports-performance-tests', 'vitamins-tests', 'advanced-vitamins-tests',
           'energy-tests', 'nutrition-tests', 'hormones', 'iron-tests'].includes(cat.id)
        );
      
      case "At Home Tests":
        return compareCategories.filter(cat => 
          ['blood-tests', 'vitamins-tests', 'hormones', 'thyroid',
           'diabetes-tests', 'cholesterol-tests', 'allergy-testing', 'sexual-health'].includes(cat.id)
        );
      
      case "Fertility":
        return compareCategories.filter(cat => 
          ['prenatal-paternity-tests', 'gender-reveal-tests', 'nipt-tests'].includes(cat.id)
        );
      
      case "Cancer Screening":
        return compareCategories.filter(cat => 
          ['cancer-screening', 'general-health'].includes(cat.id)
        );
      
      case "General Wellness":
        return compareCategories.filter(cat => 
          ['weight-loss-tests', 'diabetes-tests', 'cholesterol-tests', 'vitamins-tests', 
           'advanced-vitamins-tests', 'allergy-testing', 'coeliac-tests',
           'antibody-tests', 'infection-tests', 'immunity-tests', 'autoimmunity-tests', 
           'liver-health', 'kidney-health', 'sexual-health', 'iron-tests', 'heart-health', 
           'energy-tests', 'nutrition-tests'].includes(cat.id)
        );
      
      default:
        return compareCategories.slice(0, 8);
    }
  };

  /**
   * Determine if an item should show Goodbody tests or categories
   */
  const shouldShowGoodbodyTests = (itemName: string): boolean => {
    return ['Cancer Screening', "Women's Health", "Men's Health", 'Fertility'].includes(itemName);
  };

  return useMemo(() => ({
    getTestsForNavigation,
    getFilteredCategories,
    shouldShowGoodbodyTests
  }), []);
};
