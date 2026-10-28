import { beforeEach, describe, expect, it, vi } from "vitest";
import { isVerifiedDiagnosticsAdmin, verifyErrorDiagnosticsAccess } from "../error-diagnostics-access";

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), invoke: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { getUser: mocks.getUser }, functions: { invoke: mocks.invoke } },
}));

const verified = { userId: "owner-id", isAdmin: true, hasMFA: true, mfaVerified: true };

describe("technical diagnostics permissions", () => {
  beforeEach(() => vi.resetAllMocks());

  it("permits only a server-verified administrator with MFA for the same user", () => {
    expect(isVerifiedDiagnosticsAdmin(verified, "owner-id")).toBe(true);
    expect(isVerifiedDiagnosticsAdmin(verified, "other-id")).toBe(false);
  });

  it("denies ordinary users and moderators", () => {
    expect(isVerifiedDiagnosticsAdmin({ ...verified, isAdmin: false }, "owner-id")).toBe(false);
  });

  it("denies administrators without verified MFA", () => {
    expect(isVerifiedDiagnosticsAdmin({ ...verified, hasMFA: false }, "owner-id")).toBe(false);
    expect(isVerifiedDiagnosticsAdmin({ ...verified, mfaVerified: false }, "owner-id")).toBe(false);
  });

  it("denies malformed or missing permissions", () => {
    for (const value of [null, {}, { ...verified, isAdmin: "true" }]) {
      expect(isVerifiedDiagnosticsAdmin(value, "owner-id")).toBe(false);
    }
  });

  it("never asks for diagnostics permission for a signed-out visitor", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect(await verifyErrorDiagnosticsAccess()).toBe(false);
    expect(mocks.invoke).not.toHaveBeenCalled();
  });

  it("verifies signed-in access through the existing server endpoint", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "owner-id" } }, error: null });
    mocks.invoke.mockResolvedValue({ data: verified, error: null });
    expect(await verifyErrorDiagnosticsAccess()).toBe(true);
    expect(mocks.invoke).toHaveBeenCalledWith("verify-admin-mfa");
  });

  it("fails closed on failed server verification", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "owner-id" } }, error: null });
    mocks.invoke.mockResolvedValue({ data: verified, error: new Error("unavailable") });
    expect(await verifyErrorDiagnosticsAccess()).toBe(false);
    mocks.invoke.mockRejectedValue(new Error("offline"));
    expect(await verifyErrorDiagnosticsAccess()).toBe(false);
  });
});