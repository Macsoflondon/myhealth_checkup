import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createPublicCatalogueMemo,
  PUBLIC_CATALOGUE_TTL_MS,
} from "./public-catalogue-memo";
afterEach(() => vi.useRealTimers());
describe("public catalogue memo", () => {
  it("coalesces concurrent reads and expires after exactly five minutes", async () => {
    vi.useFakeTimers();
    const read = createPublicCatalogueMemo();
    const load = vi.fn(async () => [{ price: 75 }]);
    await Promise.all([read("heart", load), read("heart", load)]);
    expect(load).toHaveBeenCalledTimes(1);
    expect(PUBLIC_CATALOGUE_TTL_MS).toBe(300000);
    vi.advanceTimersByTime(299999);
    await read("heart", load);
    expect(load).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    await read("heart", load);
    expect(load).toHaveBeenCalledTimes(2);
  });
  it("never caches failures or shares different filters", async () => {
    const read = createPublicCatalogueMemo();
    await expect(
      read("thyroid", async () => {
        throw new Error("unavailable");
      }),
    ).rejects.toThrow("unavailable");
    expect(await read("thyroid", async () => [45])).toEqual([45]);
    expect(await read("heart", async () => [65])).toEqual([65]);
  });
});
