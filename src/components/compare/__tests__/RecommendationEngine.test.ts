import { describe, it, expect, vi } from 'vitest';

/**
 * RecommendationEngine scoring logic tests
 * 
 * The RecommendationEngine uses a weighted scoring algorithm to rank tests.
 * We extract and test the scoring function independently.
 */

interface TestData {
  id: string;
  test_name: string;
  price: number | null;
  biomarker_count: number | null;
  turnaround_time_days: number | null;
  home_kit_available: boolean;
  clinic_visit_available: boolean;
}

interface Preferences {
  priceWeight: number;
  speedWeight: number;
  comprehensivenessWeight: number;
}

// Extracted scoring logic from RecommendationEngine
function calculateTestScore(test: TestData, preferences: Preferences): number {
  const { priceWeight, speedWeight, comprehensivenessWeight } = preferences;
  
  let score = 0;
  
  // Price score (lower is better, normalized 0-100)
  if (test.price != null) {
    const priceScore = Math.max(0, 100 - (test.price / 5)); // £500 = 0, £0 = 100
    score += priceScore * (priceWeight / 100);
  }
  
  // Speed score (faster is better)
  if (test.turnaround_time_days != null) {
    const speedScore = Math.max(0, 100 - (test.turnaround_time_days * 10));
    score += speedScore * (speedWeight / 100);
  }
  
  // Comprehensiveness score (more biomarkers is better)
  if (test.biomarker_count != null) {
    const compScore = Math.min(100, test.biomarker_count * 2);
    score += compScore * (comprehensivenessWeight / 100);
  }
  
  return score;
}

describe('RecommendationEngine: Scoring Algorithm', () => {
  const defaultPreferences: Preferences = {
    priceWeight: 33,
    speedWeight: 33,
    comprehensivenessWeight: 34,
  };

  it('scores cheaper tests higher when price weight is dominant', () => {
    const prefs: Preferences = { priceWeight: 80, speedWeight: 10, comprehensivenessWeight: 10 };
    
    const cheapTest: TestData = {
      id: '1', test_name: 'Basic', price: 50, biomarker_count: 10,
      turnaround_time_days: 5, home_kit_available: true, clinic_visit_available: false,
    };
    const expensiveTest: TestData = {
      id: '2', test_name: 'Premium', price: 300, biomarker_count: 50,
      turnaround_time_days: 2, home_kit_available: true, clinic_visit_available: true,
    };
    
    const cheapScore = calculateTestScore(cheapTest, prefs);
    const expensiveScore = calculateTestScore(expensiveTest, prefs);
    
    expect(cheapScore).toBeGreaterThan(expensiveScore);
  });

  it('scores faster tests higher when speed weight is dominant', () => {
    const prefs: Preferences = { priceWeight: 10, speedWeight: 80, comprehensivenessWeight: 10 };
    
    const fastTest: TestData = {
      id: '1', test_name: 'Quick', price: 200, biomarker_count: 10,
      turnaround_time_days: 1, home_kit_available: true, clinic_visit_available: false,
    };
    const slowTest: TestData = {
      id: '2', test_name: 'Thorough', price: 100, biomarker_count: 50,
      turnaround_time_days: 7, home_kit_available: true, clinic_visit_available: true,
    };
    
    const fastScore = calculateTestScore(fastTest, prefs);
    const slowScore = calculateTestScore(slowTest, prefs);
    
    expect(fastScore).toBeGreaterThan(slowScore);
  });

  it('scores comprehensive tests higher when comprehensiveness weight is dominant', () => {
    const prefs: Preferences = { priceWeight: 10, speedWeight: 10, comprehensivenessWeight: 80 };
    
    const basicTest: TestData = {
      id: '1', test_name: 'Basic', price: 30, biomarker_count: 5,
      turnaround_time_days: 1, home_kit_available: true, clinic_visit_available: false,
    };
    const comprehensiveTest: TestData = {
      id: '2', test_name: 'Comprehensive', price: 300, biomarker_count: 50,
      turnaround_time_days: 7, home_kit_available: true, clinic_visit_available: true,
    };
    
    const basicScore = calculateTestScore(basicTest, prefs);
    const compScore = calculateTestScore(comprehensiveTest, prefs);
    
    expect(compScore).toBeGreaterThan(basicScore);
  });

  it('returns 0 for test with all null values', () => {
    const test: TestData = {
      id: '1', test_name: 'Empty', price: null, biomarker_count: null,
      turnaround_time_days: null, home_kit_available: false, clinic_visit_available: false,
    };
    const score = calculateTestScore(test, defaultPreferences);
    expect(score).toBe(0);
  });

  it('produces non-negative scores', () => {
    const expensiveSlowTest: TestData = {
      id: '1', test_name: 'Worst Case', price: 1000, biomarker_count: 1,
      turnaround_time_days: 30, home_kit_available: false, clinic_visit_available: false,
    };
    const score = calculateTestScore(expensiveSlowTest, defaultPreferences);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('equal weights produce balanced scoring', () => {
    const balanced: Preferences = { priceWeight: 33, speedWeight: 33, comprehensivenessWeight: 34 };
    
    const test: TestData = {
      id: '1', test_name: 'Balanced', price: 100, biomarker_count: 25,
      turnaround_time_days: 3, home_kit_available: true, clinic_visit_available: true,
    };
    
    const score = calculateTestScore(test, balanced);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });
});

describe('RecommendationEngine: Test Ranking', () => {
  it('ranks multiple tests correctly based on preferences', () => {
    const prefs: Preferences = { priceWeight: 50, speedWeight: 25, comprehensivenessWeight: 25 };
    
    const tests: TestData[] = [
      { id: '1', test_name: 'Budget', price: 39, biomarker_count: 8, turnaround_time_days: 5, home_kit_available: true, clinic_visit_available: false },
      { id: '2', test_name: 'Mid-Range', price: 99, biomarker_count: 25, turnaround_time_days: 3, home_kit_available: true, clinic_visit_available: true },
      { id: '3', test_name: 'Premium', price: 299, biomarker_count: 50, turnaround_time_days: 2, home_kit_available: true, clinic_visit_available: true },
    ];

    const scored = tests
      .map(t => ({ ...t, score: calculateTestScore(t, prefs) }))
      .sort((a, b) => b.score - a.score);

    // With heavy price weighting, budget should rank first
    expect(scored[0].test_name).toBe('Budget');
  });
});
