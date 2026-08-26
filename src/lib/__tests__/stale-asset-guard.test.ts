import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearStaleAssetRetries,
  installStaleAssetGuard,
  isAssetUrl,
} from "../stale-asset-guard";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("stale-asset-guard", () => {
  let replace: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sessionStorage.clear();
    clearStaleAssetRetries();
    replace = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "http://localhost/", origin: "http://localhost", replace },
    });
  });

  it("recognises same-origin asset URLs only", () => {
    expect(isAssetUrl("http://localhost/assets/hero-a1b2.avif")).toBe(true);
    expect(isAssetUrl("/@imagetools/abc123")).toBe(true);
    expect(isAssetUrl("http://cdn.example.com/x.png")).toBe(false);
    expect(isAssetUrl("/compare")).toBe(false);
  });

  it("reloads once with a cache-busting marker when an asset is gone", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 404 }));
    const teardown = installStaleAssetGuard();

    const img = document.createElement("img");
    img.src = "http://localhost/assets/hero-a1b2.avif";
    document.body.appendChild(img);
    img.dispatchEvent(new Event("error"));
    await flush();

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace.mock.calls[0][0]).toContain("__assets=");

    // Budget is spent: a second failure must not loop.
    img.dispatchEvent(new Event("error"));
    await flush();
    expect(replace).toHaveBeenCalledTimes(1);
    teardown();
  });

  it("ignores assets that still resolve", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 200 }));
    const teardown = installStaleAssetGuard();

    const img = document.createElement("img");
    img.src = "http://localhost/assets/hero-a1b2.avif";
    document.body.appendChild(img);
    img.dispatchEvent(new Event("error"));
    await flush();

    expect(replace).not.toHaveBeenCalled();
    teardown();
  });
});
