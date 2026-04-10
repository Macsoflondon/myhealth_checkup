import { useMemo } from "react";
import { compareCategories } from "@/constants/categories";
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
      
      case "Fertility":
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

  /**
   * Determine if an item should show Goodbody tests or categories
   */
  const shouldShowGoodbodyTests = (itemName: string): boolean => {
    // All navigation items now use category layout
    return false;
  };

  return useMemo(() => ({
    getTestsForNavigation,
    getFilteredCategories,
    shouldShowGoodbodyTests
  }), []);
};
