import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChangePasswordCard from "../ChangePasswordCard";

// --- Mocks ---
const signInWithPassword = vi.fn();
const updateUser = vi.fn();
const resetPasswordForEmail = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: (...a: unknown[]) => signInWithPassword(...a),
      updateUser: (...a: unknown[]) => updateUser(...a),
      resetPasswordForEmail: (...a: unknown[]) => resetPasswordForEmail(...a),
    },
  },
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { id: "u1", email: "user@example.com" } }),
}));

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock("@/components/ui/sonner", () => ({
  toast: {
    success: (m: string) => toastSuccess(m),
    error: (m: string) => toastError(m),
  },
}));

const STRONG = "NewStrongP@ss1";

const fillForm = (current: string, next: string, confirm: string) => {
  fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: current } });
  fireEvent.change(screen.getByLabelText(/^new password/i), { target: { value: next } });
  fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: confirm } });
};

const submit = () => fireEvent.click(screen.getByTestId("update-password-btn"));

describe("ChangePasswordCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates password on success", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    updateUser.mockResolvedValue({ error: null });

    render(<ChangePasswordCard />);
    fillForm("OldPass123!", STRONG, STRONG);
    submit();

    await waitFor(() => expect(updateUser).toHaveBeenCalledWith({ password: STRONG }));
    expect(signInWithPassword).toHaveBeenCalledWith({ email: "user@example.com", password: "OldPass123!" });
    await waitFor(() => expect(toastSuccess).toHaveBeenCalledWith("Password updated successfully."));
  });

  it("shows error when current password is incorrect", async () => {
    signInWithPassword.mockResolvedValue({ error: { message: "Invalid login" } });

    render(<ChangePasswordCard />);
    fillForm("WrongOld!", STRONG, STRONG);
    submit();

    expect(await screen.findByText(/current password is incorrect/i)).toBeInTheDocument();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("shows error when new passwords do not match", async () => {
    render(<ChangePasswordCard />);
    fillForm("OldPass123!", STRONG, STRONG + "x");
    submit();

    expect(await screen.findByText(/new passwords do not match/i)).toBeInTheDocument();
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("shows error when new password equals current password", async () => {
    render(<ChangePasswordCard />);
    fillForm(STRONG, STRONG, STRONG);
    submit();

    expect(await screen.findByText(/different from your current password/i)).toBeInTheDocument();
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("shows error when new password is weak", async () => {
    render(<ChangePasswordCard />);
    fillForm("OldPass123!", "weakpass", "weakpass");
    submit();

    expect(await screen.findByText(/does not meet security requirements/i)).toBeInTheDocument();
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("surfaces updateUser errors", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    updateUser.mockResolvedValue({ error: { message: "Password too weak server-side" } });

    render(<ChangePasswordCard />);
    fillForm("OldPass123!", STRONG, STRONG);
    submit();

    expect(await screen.findByText(/password too weak server-side/i)).toBeInTheDocument();
  });

  it("sends a password reset email when the reset button is clicked", async () => {
    resetPasswordForEmail.mockResolvedValue({ error: null });

    render(<ChangePasswordCard />);
    fireEvent.click(screen.getByTestId("send-reset-email-btn"));

    await waitFor(() =>
      expect(resetPasswordForEmail).toHaveBeenCalledWith(
        "user@example.com",
        expect.objectContaining({ redirectTo: expect.stringContaining("/reset-password") })
      )
    );
    await waitFor(() =>
      expect(toastSuccess).toHaveBeenCalledWith("Password reset email sent. Please check your inbox.")
    );
  });

  it("shows a toast error if reset email fails", async () => {
    resetPasswordForEmail.mockResolvedValue({ error: { message: "Rate limited" } });

    render(<ChangePasswordCard />);
    fireEvent.click(screen.getByTestId("send-reset-email-btn"));

    await waitFor(() => expect(toastError).toHaveBeenCalledWith("Rate limited"));
  });
});
