import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecommendationResults, type AIAnalysisResult } from "../RecommendationEngine";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: vi.fn() },
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null }),
            ilike: () => ({
              limit: () => Promise.resolve({ data: [] }),
            }),
          }),
        }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

vi.mock("@/stores/compareStore", () => ({
  compareStore: { toggle: vi.fn() },
  useCompareItems: () => [],
}));

vi.mock("@/constants/providerMeta", () => ({
  getProviderMeta: () => ({ displayName: "Test Provider", color: "#22c0d4", cqc: true, ukas: true }),
}));

vi.mock("@/constants/providers", () => ({
  getProviderLogo: () => "",
}));

vi.mock("@/constants/providerRatings", () => ({
  getProviderRating: () => ({ rating: 4.5, reviews: 100 }),
}));

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

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("RecommendationResults", () => {
  it("renders total cost as focal point", () => {
    render(<RecommendationResults result={mockResult} />, { wrapper: createWrapper() });
    expect(screen.getByText("\u00a368")).toBeInTheDocument();
    expect(screen.getByText("Total Expected Cost")).toBeInTheDocument();
    expect(screen.getByText("2 tests recommended")).toBeInTheDocument();
  });

  it("renders wellness analysis section", () => {
    render(<RecommendationResults result={mockResult} />, { wrapper: createWrapper() });
    expect(screen.getByText("Wellness Analysis")).toBeInTheDocument();
    expect(screen.getByText(mockResult.analysis)).toBeInTheDocument();
  });

  it("renders urgency badges and confidence in fallback cards", async () => {
    render(<RecommendationResults result={mockResult} />, { wrapper: createWrapper() });
    // When resolution fails, fallback card shows urgency badge (just urgency name) and confidence inline
    await waitFor(() => {
      expect(screen.getByText("high")).toBeInTheDocument();
      expect(screen.getByText("medium")).toBeInTheDocument();
    });
    // Confidence is rendered as "{confidence}% match" inside the fallback card text
    expect(screen.getByText(/95.*% match/)).toBeInTheDocument();
    expect(screen.getByText(/88.*% match/)).toBeInTheDocument();
  });

  it("renders general guidance and doctor warning", () => {
    render(<RecommendationResults result={mockResult} />, { wrapper: createWrapper() });
    expect(screen.getByText(/Consider regular testing/)).toBeInTheDocument();
    expect(screen.getByText(/persistent fatigue/)).toBeInTheDocument();
  });

  it("renders medical disclaimer", () => {
    render(<RecommendationResults result={mockResult} />, { wrapper: createWrapper() });
    expect(screen.getByText(mockResult.medicalDisclaimer)).toBeInTheDocument();
  });

  it("renders fallback card with test name when resolution fails", async () => {
    render(<RecommendationResults result={mockResult} />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText("Thyroid Function Test")).toBeInTheDocument();
      expect(screen.getByText("Vitamin D Test")).toBeInTheDocument();
    });
  });

  it("renders reason text in fallback cards for AI-added value", async () => {
    render(<RecommendationResults result={mockResult} />, { wrapper: createWrapper() });
    // In fallback cards, the reason is shown directly (without the styled \"Why:\" prefix)
    await waitFor(() => {
      expect(screen.getByText("Covers T3, T4 and TSH")).toBeInTheDocument();
      expect(screen.getByText("Common deficiency in UK")).toBeInTheDocument();
    });
  });

  it("handles empty recommendations gracefully", () => {
    const emptyResult: AIAnalysisResult = {
      ...mockResult,
      recommendedTests: [],
    };
    render(<RecommendationResults result={emptyResult} />, { wrapper: createWrapper() });
    expect(screen.queryByText("Total Expected Cost")).not.toBeInTheDocument();
    expect(screen.queryByText("Recommended Wellness Tests")).not.toBeInTheDocument();
  });

  it("uses UniversalTestCard import (no ProviderTestCard reference)", async () => {
    // Verify that the component file imports UniversalTestCard
    const fs = await import("fs");
    const path = await import("path");
    const content = fs.readFileSync(
      path.resolve(__dirname, "../RecommendationEngine.tsx"),
      "utf-8"
    );
    expect(content).toContain("import { UniversalTestCard }");
    expect(content).toContain("from '@/components/cards/UniversalTestCard'");
    expect(content).not.toContain("import ProviderTestCard");
    expect(content).toContain("<UniversalTestCard test={test as any} />");
  });
});
