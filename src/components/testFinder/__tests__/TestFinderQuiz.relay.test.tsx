import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TestFinderQuiz } from "../TestFinderQuiz";

// Mock supabase
const mockInvoke = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: (...args: unknown[]) => mockInvoke(...args) },
    auth: {
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

/** Helper to advance through quiz steps quickly */
function advanceToFinalStep(screen: ReturnType<typeof import("@testing-library/react").render>["container"] & typeof import("@testing-library/react").screen) {
  // Step 1: select sex
  fireEvent.click(screen.getByText("Male"));
  fireEvent.click(screen.getByText("Next"));
  // Step 2: select age
  fireEvent.click(screen.getByText(/30.39/));
  fireEvent.click(screen.getByText("Next"));
  // Step 3: select goal
  fireEvent.click(screen.getByText("Preventative health"));
  fireEvent.click(screen.getByText("Next"));
  // Step 4: concerns — skip
  fireEvent.click(screen.getByText("Next"));
  // Step 5: preferences — skip
  fireEvent.click(screen.getByText("Next"));
}

describe("TestFinderQuiz Relay Integration", () => {
  beforeEach(() => {
    mockInvoke.mockReset();
  });

  it("renders 6 steps including Specific Concerns", () => {
    render(<TestFinderQuiz />, { wrapper });
    expect(screen.getByText(/Step 1 of 6/i)).toBeInTheDocument();
  });

  it("shows Specific Concerns step as final step", async () => {
    render(<TestFinderQuiz />, { wrapper });
    advanceToFinalStep(screen);

    // Step 6: Specific Concerns
    expect(screen.getByText(/Step 6 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Anything else we should know/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/feeling tired/i)).toBeInTheDocument();
  });

  it("calls ai-human-context on submit with quiz state", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        medicalDisclaimer: "Test disclaimer",
        analysis: "Test analysis",
        recommendedTests: [
          {
            testName: "Full Blood Count",
            provider: "Medichecks",
            providerId: "medichecks",
            price: 59,
            reason: "Good for fatigue",
            category: "General Health",
            urgency: "high",
            confidence: 92,
          },
        ],
        generalGuidance: "Stay hydrated",
        whenToSeeDoctor: "If symptoms persist",
        hasRecommendations: true,
      },
      error: null,
    });

    render(<TestFinderQuiz />, { wrapper });
    advanceToFinalStep(screen);

    // Type specific concerns
    const textarea = screen.getByPlaceholderText(/feeling tired/i);
    fireEvent.change(textarea, { target: { value: "Low energy, weight gain" } });

    // Submit
    fireEvent.click(screen.getByText(/Get my AI recommendations/i));

    // Should show analysing state
    await waitFor(() => {
      expect(screen.getByText(/Analysing 597 tests/i)).toBeInTheDocument();
    });

    // Verify the function was called with correct params
    expect(mockInvoke).toHaveBeenCalledWith("ai-human-context", {
      body: {
        query_text: expect.stringContaining("Preventative health"),
        gender: "male",
        age: 35,
        method_preference: null,
      },
    });

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("Your Personalised Results")).toBeInTheDocument();
    });
  });

  it("shows total expected cost as focal point in results", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        medicalDisclaimer: "Disclaimer",
        analysis: "Analysis text",
        recommendedTests: [
          {
            testName: "Test A",
            provider: "Provider A",
            providerId: "a",
            price: 59,
            reason: "Reason A",
            category: "General",
            urgency: "high",
            confidence: 90,
          },
          {
            testName: "Test B",
            provider: "Provider B",
            providerId: "b",
            price: 89,
            reason: "Reason B",
            category: "Hormone",
            urgency: "medium",
            confidence: 85,
          },
        ],
        generalGuidance: "Guidance",
        whenToSeeDoctor: "See GP",
        hasRecommendations: true,
      },
      error: null,
    });

    render(<TestFinderQuiz />, { wrapper });

    // Fast-forward through quiz (female path)
    fireEvent.click(screen.getByText("Female"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText(/40.49/));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText(/Longevity/));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText(/Get my AI recommendations/i));

    await waitFor(() => {
      expect(screen.getByText("Total Expected Cost")).toBeInTheDocument();
    });

    // 59 + 89 = 148
    expect(screen.getByText("£148")).toBeInTheDocument();
    expect(screen.getByText("2 tests recommended")).toBeInTheDocument();
  });

  it("shows error toast on API failure", async () => {
    mockInvoke.mockResolvedValue({ data: null, error: new Error("Network error") });
    const { toast } = await import("sonner");

    render(<TestFinderQuiz />, { wrapper });
    advanceToFinalStep(screen);
    fireEvent.click(screen.getByText(/Get my AI recommendations/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Unable to generate recommendations. Please try again.");
    });
  });
});
