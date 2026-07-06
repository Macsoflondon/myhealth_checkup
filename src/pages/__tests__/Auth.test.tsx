import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Auth from "@/pages/Auth";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: null, isLoading: false, session: null, signOut: vi.fn() }),
}));

vi.mock("@/components/layout/Header", () => ({ default: () => <header /> }));
vi.mock("@/components/layout/Footer", () => ({ default: () => <footer /> }));

const signInWithPassword = vi.fn();
const signUp = vi.fn();
const resetPasswordForEmail = vi.fn();
const signInWithOAuth = vi.fn();
const invoke = vi.fn().mockResolvedValue({ data: { allowed: true }, error: null });

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: (...a: unknown[]) => signInWithPassword(...a),
      signUp: (...a: unknown[]) => signUp(...a),
      resetPasswordForEmail: (...a: unknown[]) => resetPasswordForEmail(...a),
      signInWithOAuth: (...a: unknown[]) => signInWithOAuth(...a),
    },
    functions: { invoke: (...a: unknown[]) => invoke(...a) },
  },
}));

const toastError = vi.fn();
const toastSuccess = vi.fn();
vi.mock("@/components/ui/sonner", () => ({
  toast: { error: (m: string) => toastError(m), success: (m: string) => toastSuccess(m) },
}));
vi.mock("sonner", () => ({
  toast: { error: (m: string) => toastError(m), success: (m: string) => toastSuccess(m) },
}));

const renderAuth = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    </HelmetProvider>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  signInWithPassword.mockResolvedValue({ error: null });
  signUp.mockResolvedValue({ error: null });
  resetPasswordForEmail.mockResolvedValue({ error: null });
  signInWithOAuth.mockResolvedValue({ error: null });
});

describe("Auth page", () => {
  it("renders sign-in UI with remember-me and Google button", () => {
    renderAuth();
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /forgot password/i })).toBeInTheDocument();
  });

  it("signs in with valid credentials and navigates to dashboard", async () => {
    const user = userEvent.setup();
    renderAuth();
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "password123");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));
    await waitFor(() => expect(signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    }));
    expect(navigateMock).toHaveBeenCalledWith("/health-dashboard");
  });

  it("submits form when pressing Enter in the password field", async () => {
    const user = userEvent.setup();
    renderAuth();
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    const pw = screen.getByLabelText(/^password/i);
    await user.type(pw, "password123{Enter}");
    await waitFor(() => expect(signInWithPassword).toHaveBeenCalled());
  });

  it("shows invalid-credentials error toast", async () => {
    signInWithPassword.mockResolvedValue({ error: { message: "Invalid login credentials" } });
    const user = userEvent.setup();
    renderAuth();
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "password123");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));
    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(expect.stringMatching(/invalid email or password/i)),
    );
  });

  it("switches to sign-up mode and shows password strength indicator", async () => {
    const user = userEvent.setup();
    renderAuth();
    await user.click(screen.getByRole("button", { name: /don't have an account/i }));
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/^password/i), "Abcdef1!");
    await waitFor(() =>
      expect(screen.getByText(/password strength/i)).toBeInTheDocument(),
    );
  });

  it("signs up with valid data", async () => {
    const user = userEvent.setup();
    renderAuth();
    await user.click(screen.getByRole("button", { name: /don't have an account/i }));
    await user.type(screen.getByLabelText(/first name/i), "Jane");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/^password/i), "StrongPass1!");
    await user.click(screen.getByRole("button", { name: /^sign up$/i }));
    await waitFor(() => expect(signUp).toHaveBeenCalled());
    expect(signUp.mock.calls[0][0].email).toBe("jane@example.com");
  });

  it("triggers forgot-password flow", async () => {
    const user = userEvent.setup();
    renderAuth();
    await user.click(screen.getByRole("button", { name: /forgot password/i }));
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));
    await waitFor(() =>
      expect(resetPasswordForEmail).toHaveBeenCalledWith("test@example.com", {
        redirectTo: `${window.location.origin}/reset-password`,
      }),
    );
  });

  it("initiates Google sign-in", async () => {
    const user = userEvent.setup();
    renderAuth();
    await user.click(screen.getByRole("button", { name: /google/i }));
    await waitFor(() =>
      expect(signInWithOAuth).toHaveBeenCalledWith(expect.objectContaining({ provider: "google" })),
    );
  });
});
