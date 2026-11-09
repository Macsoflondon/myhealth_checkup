import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("https://esm.sh/@supabase/supabase-js@2.51.0", () => ({
  createClient: vi.fn(),
}));

let readAalClaim: (jwt: string) => string | null;

const EDGE_MODULE = "../../../supabase/functions/admin-recovery/index.ts";

beforeAll(async () => {
  (globalThis as unknown as { Deno: unknown }).Deno = {
    serve: vi.fn(),
    env: { get: () => undefined },
  };
  ({ readAalClaim } = await import(
    // Non-literal path keeps the Deno module out of the app typecheck.
    /* @vite-ignore */ new URL(EDGE_MODULE, import.meta.url).href
  ));
});

const b64url = (o: unknown) =>
  btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const token = (payload: unknown) => `${b64url({ alg: "HS256" })}.${b64url(payload)}.sig`;

describe("readAalClaim", () => {
  it("returns aal2 from the payload", () => {
    expect(readAalClaim(token({ sub: "u", aal: "aal2" }))).toBe("aal2");
  });
  it("returns aal1 so the caller is refused", () => {
    expect(readAalClaim(token({ aal: "aal1" }))).toBe("aal1");
  });
  it("returns null when the claim is missing", () => {
    expect(readAalClaim(token({ sub: "u" }))).toBeNull();
  });
  it("returns null for malformed tokens", () => {
    expect(readAalClaim("not-a-jwt")).toBeNull();
    expect(readAalClaim("a.%%%.c")).toBeNull();
  });
  it("decodes base64url characters", () => {
    expect(readAalClaim(token({ aal: "aal2", n: "??>>~~" }))).toBe("aal2");
  });
});
