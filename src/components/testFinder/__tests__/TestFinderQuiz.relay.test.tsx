import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TestFinderQuiz } from "../TestFinderQuiz";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterDomProps(props)}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

function filterDomProps(props: Record<string, any>) {
  const { initial, animate, exit, transition, custom, whileHover, whileTap, variants, ...rest } = props;
  return rest;
}

// Mock supabase
const mockInvoke = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: (...args: unknown[]) => mockInvoke(...args) },
  },
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe("TestFinderQuiz — Medichecks Decision Tree", () => {
  beforeEach(() => {
    mockInvoke.mockReset();
  });

  it("renders gender question as the first step", () => {
    render(<TestFinderQuiz />);
    expect(screen.getByText("How would you describe your gender?")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("Female")).toBeInTheDocument();
    expect(screen.getByText("Neither")).toBeInTheDocument();
    expect(screen.getByText("Prefer not to say")).toBeInTheDocument();
  });

  it("shows progress bar starting at 19%", () => {
    render(<TestFinderQuiz />);
    expect(screen.getByText("19%")).toBeInTheDocument();
  });

  it("navigates Male → health concerns when Male is selected", () => {
    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Male"));
    expect(screen.getByText("Do you have any health concerns or areas of interest?")).toBeInTheDocument();
    expect(screen.getByText("Hormones")).toBeInTheDocument();
    expect(screen.getByText("Thyroid")).toBeInTheDocument();
    expect(screen.getByText("Prostate")).toBeInTheDocument();
  });

  it("navigates Female → health concerns when Female is selected", () => {
    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Female"));
    expect(screen.getByText("Do you have any health concerns or areas of interest?")).toBeInTheDocument();
    expect(screen.getByText("Hormones")).toBeInTheDocument();
    expect(screen.getByText("Thyroid")).toBeInTheDocument();
    // No Prostate for females
    expect(screen.queryByText("Prostate")).not.toBeInTheDocument();
  });

  it("shows contact fallback for Neither/Prefer not to say", () => {
    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Neither"));
    expect(screen.getByText(/direct you to the correct test/i)).toBeInTheDocument();
    expect(screen.getByText("Contact us")).toBeInTheDocument();
  });

  it("navigates back correctly", () => {
    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Male"));
    expect(screen.getByText("Do you have any health concerns or areas of interest?")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("How would you describe your gender?")).toBeInTheDocument();
  });

  it("progresses through Male → Thyroid → No → symptoms branch", () => {
    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Male"));
    fireEvent.click(screen.getByText("Thyroid"));
    expect(screen.getByText("Have you been diagnosed with a thyroid condition?")).toBeInTheDocument();

    fireEvent.click(screen.getByText("No"));
    expect(screen.getByText("Are you experiencing any of the following symptoms?")).toBeInTheDocument();
    expect(screen.getByText(/Weight gain, fatigue, low mood/)).toBeInTheDocument();
  });

  it("shows Additional Context step on terminal node before AI handover", () => {
    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Male"));
    fireEvent.click(screen.getByText("Bowel"));

    // Should show the Additional Context step
    expect(screen.getByText("Additional Context")).toBeInTheDocument();
    expect(screen.getByText(/Any specific concerns or details about your lifestyle/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /See Results/ })).toBeInTheDocument();
  });

  it("calls ai-human-context with path and user context on See Results", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        medicalDisclaimer: "Disclaimer",
        analysis: "Analysis",
        recommendedTests: [
          { testName: "Thyroid Function", provider: "Medichecks", providerId: "mc", price: 39, reason: "Thyroid check", category: "Thyroid", urgency: "high", confidence: 92 },
        ],
        generalGuidance: "Guidance",
        whenToSeeDoctor: "See GP if symptoms persist",
        hasRecommendations: true,
      },
      error: null,
    });

    render(<TestFinderQuiz />);

    // Navigate: Male → Thyroid → No → "Weight gain, fatigue..."
    fireEvent.click(screen.getByText("Male"));
    fireEvent.click(screen.getByText("Thyroid"));
    fireEvent.click(screen.getByText("No"));
    fireEvent.click(screen.getByText(/Weight gain, fatigue, low mood, sensitivity to cold/));

    // Should show Additional Context step
    expect(screen.getByText("Additional Context")).toBeInTheDocument();

    // Type in specific concerns
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "I have been feeling very cold and tired for 6 months" } });

    // Click See Results
    fireEvent.click(screen.getByRole("button", { name: /See Results/ }));

    // Should show analysing state
    await waitFor(() => {
      expect(screen.getByText(/Clinically analysing your results/)).toBeInTheDocument();
    });

    // Verify call to ai-human-context with combined path and user context
    expect(mockInvoke).toHaveBeenCalledWith("ai-human-context", {
      body: {
        query_text: "Path: Male \u2192 Thyroid \u2192 No \u2192 Weight gain, fatigue, low mood, sensitivity to cold | User Context: I have been feeling very cold and tired for 6 months",
        gender: "male",
        age: null,
        method_preference: null,
      },
    });

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("Your Personalised Results")).toBeInTheDocument();
    });
    expect(screen.getByText("Thyroid Function")).toBeInTheDocument();
  });

  it("calls ai-human-context with path only when textarea is empty", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        medicalDisclaimer: "Disclaimer",
        analysis: "Bowel analysis",
        recommendedTests: [
          { testName: "qFIT Test", provider: "Medichecks", providerId: "mc", price: 49, reason: "Bowel screening", category: "Bowel", urgency: "medium", confidence: 88 },
        ],
        generalGuidance: "Guidance",
        whenToSeeDoctor: "See GP",
        hasRecommendations: true,
      },
      error: null,
    });

    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Male"));
    fireEvent.click(screen.getByText("Bowel"));

    // Context step appears
    expect(screen.getByText("Additional Context")).toBeInTheDocument();

    // Click See Results without typing anything
    fireEvent.click(screen.getByRole("button", { name: /See Results/ }));

    await waitFor(() => {
      expect(screen.getByText(/Clinically analysing your results/)).toBeInTheDocument();
    });

    expect(mockInvoke).toHaveBeenCalledWith("ai-human-context", {
      body: {
        query_text: "Path: Male \u2192 Bowel",
        gender: "male",
        age: null,
        method_preference: null,
      },
    });
  });

  it("allows going back from Additional Context step", () => {
    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Male"));
    fireEvent.click(screen.getByText("Bowel"));

    // Context step
    expect(screen.getByText("Additional Context")).toBeInTheDocument();

    // Click Back
    fireEvent.click(screen.getByText("Back"));

    // Should be back at health concerns
    expect(screen.getByText("Do you have any health concerns or areas of interest?")).toBeInTheDocument();
    expect(screen.getByText("Bowel")).toBeInTheDocument();
  });

  it("shows error toast on API failure and returns from loading", async () => {
    mockInvoke.mockResolvedValue({ data: null, error: new Error("Network error") });
    const { toast } = await import("sonner");

    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Male"));
    fireEvent.click(screen.getByText(/General health check/));

    // Context step appears, click See Results
    fireEvent.click(screen.getByRole("button", { name: /See Results/ }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Unable to generate recommendations. Please try again.");
    });
  });

  it("allows retaking the quiz after results", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        medicalDisclaimer: "D",
        analysis: "A",
        recommendedTests: [],
        generalGuidance: "G",
        whenToSeeDoctor: "S",
        hasRecommendations: false,
      },
      error: null,
    });

    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Male"));
    fireEvent.click(screen.getByText("Prostate"));

    // Context step
    fireEvent.click(screen.getByRole("button", { name: /See Results/ }));

    await waitFor(() => {
      expect(screen.getByText("Your Personalised Results")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Retake quiz"));
    expect(screen.getByText("How would you describe your gender?")).toBeInTheDocument();
  });

  it("navigates Female → Hormones → menopause branch correctly", () => {
    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Female"));
    fireEvent.click(screen.getByText("Hormones"));
    expect(screen.getByText("Which of these most applies to you?")).toBeInTheDocument();
    expect(screen.getByText(/menopause/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/menopause/i));
    expect(screen.getByText("I am taking HRT")).toBeInTheDocument();
  });

  it("increments progress by ~10% per step", () => {
    render(<TestFinderQuiz />);
    expect(screen.getByText("19%")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Male"));
    expect(screen.getByText("29%")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Thyroid"));
    expect(screen.getByText("39%")).toBeInTheDocument();

    fireEvent.click(screen.getByText("No"));
    expect(screen.getByText("49%")).toBeInTheDocument();
  });

  it("textarea preserves user input when navigating back and forward", () => {
    render(<TestFinderQuiz />);
    fireEvent.click(screen.getByText("Male"));
    fireEvent.click(screen.getByText("Bowel"));

    // Type in textarea
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "My specific concern" } });
    expect(textarea).toHaveValue("My specific concern");

    // Go back
    fireEvent.click(screen.getByText("Back"));

    // Go forward again
    fireEvent.click(screen.getByText("Bowel"));

    // Textarea should still have the value (state persists)
    const textareaAgain = screen.getByRole("textbox");
    expect(textareaAgain).toHaveValue("My specific concern");
  });
});
