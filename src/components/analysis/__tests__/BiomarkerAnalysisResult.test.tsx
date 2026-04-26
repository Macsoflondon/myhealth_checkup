import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BiomarkerAnalysisResult, AnalysisResult } from '../BiomarkerAnalysisResult';

function createMockResult(overrides?: Partial<AnalysisResult>): AnalysisResult {
  return {
    medicalDisclaimer: 'This is for educational purposes only.',
    overallSummary: 'Overall your results look good.',
    whenToSeeDoctor: 'See your GP if symptoms persist.',
    biomarkerAnalysis: [
      {
        name: 'Cholesterol',
        value: 5.2,
        unit: 'mmol/L',
        status: 'normal',
        normalRange: '3.5-6.5 mmol/L',
        explanation: 'Your cholesterol is within the normal range.',
        trend: 'stable',
      },
      {
        name: 'HbA1c',
        value: 48,
        unit: 'mmol/mol',
        status: 'high',
        normalRange: '20-42 mmol/mol',
        explanation: 'Your HbA1c is elevated.',
        implications: 'May indicate pre-diabetes.',
        recommendations: ['Reduce sugar intake', 'Exercise regularly'],
        trend: 'declining',
      },
      {
        name: 'Vitamin D',
        value: 25,
        unit: 'nmol/L',
        status: 'borderline-low',
        normalRange: '25-75 nmol/L',
        explanation: 'Your vitamin D is on the lower end.',
        trend: 'improving',
      },
    ],
    lifestyleRecommendations: [
      'Increase daily physical activity',
      'Eat more oily fish for vitamin D',
    ],
    ...overrides,
  };
}

describe('BiomarkerAnalysisResult', () => {
  it('renders the medical disclaimer', () => {
    const result = createMockResult();
    const { getByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(getByText('This is for educational purposes only.')).toBeInTheDocument();
  });

  it('renders the overall summary', () => {
    const result = createMockResult();
    const { getByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(getByText('Overall your results look good.')).toBeInTheDocument();
  });

  it('renders when to see doctor section', () => {
    const result = createMockResult();
    const { getByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(getByText('See your GP if symptoms persist.')).toBeInTheDocument();
    expect(getByText('When to See Your Doctor')).toBeInTheDocument();
  });

  it('displays status labels', () => {
    const result = createMockResult();
    const { getByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(getByText('Normal')).toBeInTheDocument();
    expect(getByText('Borderline')).toBeInTheDocument();
    expect(getByText('Needs Attention')).toBeInTheDocument();
  });

  it('renders all biomarker names', () => {
    const result = createMockResult();
    const { getByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(getByText('Cholesterol')).toBeInTheDocument();
    expect(getByText('HbA1c')).toBeInTheDocument();
    expect(getByText('Vitamin D')).toBeInTheDocument();
  });

  it('renders biomarker values with units', () => {
    const result = createMockResult();
    const { getByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(getByText('5.2 mmol/L')).toBeInTheDocument();
    expect(getByText('48 mmol/mol')).toBeInTheDocument();
    expect(getByText('25 nmol/L')).toBeInTheDocument();
  });

  it('renders status badges correctly', () => {
    const result = createMockResult();
    const { getByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(getByText('High')).toBeInTheDocument();
    expect(getByText('Borderline Low')).toBeInTheDocument();
  });

  it('renders lifestyle recommendations when provided', () => {
    const result = createMockResult();
    const { getByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(getByText('Lifestyle Recommendations')).toBeInTheDocument();
    expect(getByText('Increase daily physical activity')).toBeInTheDocument();
    expect(getByText('Eat more oily fish for vitamin D')).toBeInTheDocument();
  });

  it('does not render lifestyle section when empty', () => {
    const result = createMockResult({ lifestyleRecommendations: [] });
    const { queryByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(queryByText('Lifestyle Recommendations')).not.toBeInTheDocument();
  });

  it('does not render lifestyle section when undefined', () => {
    const result = createMockResult({ lifestyleRecommendations: undefined });
    const { queryByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(queryByText('Lifestyle Recommendations')).not.toBeInTheDocument();
  });

  it('renders with unknown status biomarker', () => {
    const result = createMockResult({
      biomarkerAnalysis: [
        {
          name: 'CRP',
          value: 3,
          unit: 'mg/L',
          status: 'unknown',
          explanation: 'Unable to determine status.',
        },
      ],
    });
    const { getByText } = render(<BiomarkerAnalysisResult result={result} />);
    expect(getByText('CRP')).toBeInTheDocument();
    expect(getByText('Unknown')).toBeInTheDocument();
  });
});
