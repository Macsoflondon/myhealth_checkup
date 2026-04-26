import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { EnhancedTestData, ComparisonResult, SavedComparison } from '@/types/comparison';
import { PROVIDER_NAMES, PROVIDER_LOGOS } from '@/constants/providers';


export function useEnhancedComparison() {
  const { user } = useAuth();
  const [selectedTests, setSelectedTests] = useState<EnhancedTestData[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Transform raw test data to enhanced format
  const transformToEnhanced = useCallback((test: any): EnhancedTestData => {
    const basePrice = test.price || 0;
    const gpCost = test.gp_consultation_included ? 0 : (test.gp_consultation_cost || 0);
    const phlebCost = test.phlebotomy_included ? 0 : (test.phlebotomy_cost || 0);
    
    const providerName = PROVIDER_NAMES[test.provider_id] || test.provider_id;
    const providerLogo = PROVIDER_LOGOS[test.provider_id] || '';
    return {
      id: test.id,
      testName: test.test_name,
      provider: providerName,
      providerId: test.provider_id,
      providerLogo: providerLogo,
      category: test.category || 'General Health',
      basePrice,
      gpConsultationIncluded: test.gp_consultation_included || false,
      gpConsultationCost: test.gp_consultation_cost,
      phlebotomyIncluded: test.phlebotomy_included || false,
      phlebotomyCost: test.phlebotomy_cost,
      totalEstimatedCost: basePrice + gpCost + phlebCost,
      turnaroundDays: test.turnaround_days || 3,
      sampleType: test.sample_type || 'finger-prick',
      homeKitAvailable: test.home_kit_available ?? true,
      clinicVisitAvailable: test.clinic_visit_available ?? false,
      biomarkerCount: test.biomarker_count || extractBiomarkerCount(test.description),
      biomarkersList: test.biomarkers_list || extractBiomarkers(test.description),
      accreditations: ['UKAS', 'CQC'],
      description: test.description || '',
      url: test.url,
      dataSource: 'database',
      lastUpdated: test.updated_at
    };
  }, []);

  // Add test to comparison
  const addToComparison = useCallback((test: EnhancedTestData) => {
    setSelectedTests(prev => {
      if (prev.find(t => t.id === test.id)) {
        return prev;
      }
      if (prev.length >= 4) {
        toast.error('Maximum 4 tests can be compared at once');
        return prev;
      }
      return [...prev, test];
    });
  }, []);

  // Remove test from comparison
  const removeFromComparison = useCallback((testId: string) => {
    setSelectedTests(prev => prev.filter(t => t.id !== testId));
  }, []);

  // Clear all selected tests
  const clearComparison = useCallback(() => {
    setSelectedTests([]);
  }, []);

  // Calculate comparison results
  const comparisonResult = useMemo((): ComparisonResult | null => {
    if (selectedTests.length < 2) return null;

    // Find best value (lowest total cost)
    const bestValue = selectedTests.reduce((best, test) => 
      test.totalEstimatedCost < (best?.totalEstimatedCost ?? Infinity) ? test : best
    , selectedTests[0]);

    // Find fastest results
    const fastestResults = selectedTests.reduce((fastest, test) =>
      test.turnaroundDays < (fastest?.turnaroundDays ?? Infinity) ? test : fastest
    , selectedTests[0]);

    // Find most comprehensive
    const mostComprehensive = selectedTests.reduce((most, test) =>
      test.biomarkerCount > (most?.biomarkerCount ?? 0) ? test : most
    , selectedTests[0]);

    // Calculate biomarker overlap
    const allBiomarkers = selectedTests.map(t => new Set(t.biomarkersList.map(b => b.toLowerCase())));
    const overlap = allBiomarkers.reduce((acc, set) => 
      new Set([...acc].filter(x => set.has(x)))
    );

    // Calculate unique biomarkers per test
    const uniqueBiomarkers: Record<string, string[]> = {};
    selectedTests.forEach(test => {
      const testBiomarkers = new Set(test.biomarkersList.map(b => b.toLowerCase()));
      const unique = [...testBiomarkers].filter(b => {
        const inOthers = selectedTests.filter(t => t.id !== test.id)
          .some(t => t.biomarkersList.map(x => x.toLowerCase()).includes(b));
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
      uniqueBiomarkers
    };
  }, [selectedTests]);

  // Save comparison
  const saveComparison = useCallback(async (name: string, notes?: string) => {
    if (!user) {
      toast.error('Please sign in to save comparisons');
      return null;
    }

    if (selectedTests.length < 2) {
      toast.error('Select at least 2 tests to save a comparison');
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_comparisons')
        .insert({
          user_id: user.id,
          comparison_name: name,
          test_ids: selectedTests.map(t => t.id),
          category: selectedTests[0]?.category || null,
          notes: notes || null
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Comparison saved successfully');
      return data;
    } catch (error) {
      console.error('Error saving comparison:', error);
      toast.error('Failed to save comparison');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedTests]);

  // Load saved comparisons
  const loadSavedComparisons = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_comparisons')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedComparisons(data?.map(item => ({
        id: item.id,
        userId: item.user_id,
        comparisonName: item.comparison_name,
        testIds: item.test_ids,
        category: item.category,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) || []);
    } catch (error) {
      console.error('Error loading saved comparisons:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Delete saved comparison
  const deleteSavedComparison = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_comparisons')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedComparisons(prev => prev.filter(c => c.id !== id));
      toast.success('Comparison deleted');
    } catch (error) {
      console.error('Error deleting comparison:', error);
      toast.error('Failed to delete comparison');
    }
  }, [user]);

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
    transformToEnhanced
  };
}

// Helper functions
function extractBiomarkerCount(description: string | null): number {
  if (!description) return 0;
  
  const match = description.match(/(\d+)\s*(biomarker|marker|test)/i);
  if (match) return parseInt(match[1], 10);
  
  // Count common biomarker keywords
  const keywords = ['cholesterol', 'glucose', 'hba1c', 'tsh', 'vitamin', 'iron', 'liver', 'kidney', 'testosterone', 'oestrogen', 'psa', 'crp'];
  return keywords.filter(k => description.toLowerCase().includes(k)).length || 5;
}

function extractBiomarkers(description: string | null): string[] {
  if (!description) return [];
  
  const commonBiomarkers = [
    'Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol', 'Triglycerides',
    'HbA1c', 'Fasting Glucose', 'TSH', 'Free T4', 'Free T3',
    'Vitamin D', 'Vitamin B12', 'Folate', 'Iron', 'Ferritin',
    'ALT', 'AST', 'GGT', 'Albumin', 'Bilirubin',
    'Creatinine', 'eGFR', 'Urea', 'Uric Acid',
    'Testosterone', 'Oestrogen', 'FSH', 'LH', 'Prolactin',
    'PSA', 'CEA', 'CA-125', 'AFP',
    'CRP', 'ESR', 'Full Blood Count'
  ];
  
  return commonBiomarkers.filter(b => 
    description.toLowerCase().includes(b.toLowerCase())
  );
}
