import { afterEach, describe, expect, it, vi } from "vitest";
import { observeVisibleActivity } from "./use-visible-activity";

const originalObserver = window.IntersectionObserver;
afterEach(() => {
  window.IntersectionObserver = originalObserver;
  vi.unstubAllGlobals();
});
describe("visible animation activity", () => {
  it("stops outside the viewport, in hidden tabs and with reduced motion", () => {
    const media = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal("matchMedia", () => media);
    const callbacks: { intersection?: IntersectionObserverCallback } = {};
    const observer = { observe: vi.fn(), disconnect: vi.fn() };
    window.IntersectionObserver = class extends originalObserver {
      constructor(callback: IntersectionObserverCallback) {
        super(callback);
        callbacks.intersection = callback;
      }
      observe = observer.observe;
      disconnect = observer.disconnect;
    };
    const visible = vi
      .spyOn(document, "visibilityState", "get")
      .mockReturnValue("visible");
    const onChange = vi.fn();
    const stop = observeVisibleActivity(
      document.createElement("section"),
      onChange,
    );
    const intersect = (value: boolean) =>
      callbacks.intersection?.(
        [{ isIntersecting: value } as IntersectionObserverEntry],
        observer as unknown as IntersectionObserver,
      );
    intersect(true);
    expect(onChange).toHaveBeenLastCalledWith(true);
    intersect(false);
    expect(onChange).toHaveBeenLastCalledWith(false);
    intersect(true);
    visible.mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(onChange).toHaveBeenLastCalledWith(false);
    visible.mockReturnValue("visible");
    media.matches = true;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(onChange).toHaveBeenLastCalledWith(false);
    stop();
    expect(observer.disconnect).toHaveBeenCalledOnce();
    visible.mockRestore();
  });
});
