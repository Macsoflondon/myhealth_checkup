import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RecommendationResults, type AIAnalysisResult } from "../RecommendationEngine";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: vi.fn() },
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockResult: AIAnalysisResult = {
  medicalDisclaimer: "This is for educational purposes only.",
  analysis: "Based on your profile, we recommend the following tests.",
  recommendedTests: [
    {
      testName: "Thyroid Function Test",
      provider: "Medichecks",
      providerId: "medichecks",
      price: 39,
      reason: "Covers T3, T4 and TSH",
      category: "Thyroid",
      urgency: "high",
      confidence: 95,
    },
    {
      testName: "Vitamin D Test",
      provider: "Goodbody Clinic",
      providerId: "goodbody",
      price: 29,
      reason: "Common deficiency in UK",
      category: "Vitamins",
      urgency: "medium",
      confidence: 88,
    },
  ],
  generalGuidance: "Consider regular testing annually.",
  whenToSeeDoctor: "If experiencing persistent fatigue or weight changes.",
  hasRecommendations: true,
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe("RecommendationResults", () => {
  it("renders total cost as focal point", () => {
    render(<RecommendationResults result={mockResult} />, { wrapper });
    expect(screen.getByText("£68")).toBeInTheDocument();
    expect(screen.getByText("Total Expected Cost")).toBeInTheDocument();
    expect(screen.getByText("2 tests recommended")).toBeInTheDocument();
  });

  it("renders wellness analysis section", () => {
    render(<RecommendationResults result={mockResult} />, { wrapper });
    expect(screen.getByText("Wellness Analysis")).toBeInTheDocument();
    expect(screen.getByText(mockResult.analysis)).toBeInTheDocument();
  });

  it("renders each recommended test", () => {
    render(<RecommendationResults result={mockResult} />, { wrapper });
    expect(screen.getByText("Thyroid Function Test")).toBeInTheDocument();
    expect(screen.getByText("Vitamin D Test")).toBeInTheDocument();
    expect(screen.getByText("£39")).toBeInTheDocument();
    expect(screen.getByText("£29")).toBeInTheDocument();
    expect(screen.getByText("95% match")).toBeInTheDocument();
    expect(screen.getByText("88% match")).toBeInTheDocument();
  });

  it("renders general guidance and doctor warning", () => {
    render(<RecommendationResults result={mockResult} />, { wrapper });
    expect(screen.getByText(/Consider regular testing/)).toBeInTheDocument();
    expect(screen.getByText(/persistent fatigue/)).toBeInTheDocument();
  });

  it("renders medical disclaimer", () => {
    render(<RecommendationResults result={mockResult} />, { wrapper });
    expect(screen.getByText(mockResult.medicalDisclaimer)).toBeInTheDocument();
  });

  it("handles null price gracefully", () => {
    const withNullPrice: AIAnalysisResult = {
      ...mockResult,
      recommendedTests: [
        { ...mockResult.recommendedTests[0], price: null },
      ],
    };
    render(<RecommendationResults result={withNullPrice} />, { wrapper });
    expect(screen.getByText("Price TBC")).toBeInTheDocument();
  });
});
