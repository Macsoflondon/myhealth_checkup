import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StageOneHealthRecords } from "../StageOneHealthRecords";

const { deleteTestResult } = vi.hoisted(() => ({ deleteTestResult: vi.fn() }));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/api/supabase/healthData.api", () => ({
  healthDataApi: {
    getUploadedTestResults: vi.fn().mockResolvedValue({
      data: [
        {
          id: "result-1",
          user_id: "user-1",
          test_name: "Full blood count",
          test_date: "2026-11-01",
          uploaded_at: "2026-11-02T09:00:00Z",
          file_url: "https://example.test/signed-result",
          created_at: "2026-11-02T09:00:00Z",
          updated_at: "2026-11-02T09:00:00Z",
        },
      ],
      error: null,
    }),
    getLegacyTestResults: vi.fn().mockResolvedValue({ data: [], error: null }),
    getBiomarkerReadings: vi.fn().mockResolvedValue({ data: [], error: null }),
    getUserHealthData: vi.fn().mockResolvedValue({ data: [], error: null }),
    getHealthScoreHistory: vi.fn().mockResolvedValue({ data: [], error: null }),
    deleteTestResult,
    deleteLegacyTestResult: vi.fn(),
    deleteBiomarkerReading: vi.fn(),
    deleteHealthData: vi.fn(),
    deleteHealthScore: vi.fn(),
  },
}));

describe("stage 1 stored health records", () => {
  beforeEach(() => {
    deleteTestResult.mockReset().mockResolvedValue({ data: null, error: null });
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("shows no uploader and lists an existing file with View and Delete only", async () => {
    render(<StageOneHealthRecords />);

    expect(
      screen.getByText("Your account does not store test results yet."),
    ).toBeTruthy();
    expect(document.querySelector('input[type="file"]')).toBeNull();
    expect(screen.queryByRole("button", { name: /upload/i })).toBeNull();
    expect(await screen.findByText("Full blood count")).toBeTruthy();
    expect(screen.getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "https://example.test/signed-result",
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() =>
      expect(deleteTestResult).toHaveBeenCalledWith("result-1"),
    );
    await waitFor(() =>
      expect(screen.queryByText("Full blood count")).toBeNull(),
    );
  });
});
