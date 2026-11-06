import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  act,
  fireEvent,
  cleanup,
} from "@testing-library/react";

/**
 * Guards the 28 October performance fix that later edits removed: the hero
 * video must not mount until the window "load" event and an idle callback,
 * must stay transparent until it plays, and must never mount for visitors who
 * prefer reduced motion or asked to save data.
 */

vi.mock("@/components/sections/TestCategoryTicker", () => ({
  default: () => null,
}));
vi.mock("@/components/layout/BrowseByCategoryBar", () => ({
  default: () => null,
}));

import HeroMasthead from "../HeroMasthead";

type IdleCb = () => void;
let idleCallbacks: IdleCb[] = [];
let readyState: DocumentReadyState = "loading";
let reducedMotionMatches = false;
const mqListeners = new Set<(e: MediaQueryListEvent) => void>();

const video = () => document.querySelector("video");

function setReducedMotion(matches: boolean) {
  reducedMotionMatches = matches;
  act(() => {
    mqListeners.forEach((cb) => cb({ matches } as MediaQueryListEvent));
  });
}

function fireLoadThenIdle() {
  act(() => {
    readyState = "complete";
    window.dispatchEvent(new Event("load"));
  });
  expect(video(), "video must wait for idle time after load").toBeNull();
  act(() => {
    const pending = idleCallbacks;
    idleCallbacks = [];
    pending.forEach((cb) => cb());
  });
}

beforeEach(() => {
  idleCallbacks = [];
  readyState = "loading";
  reducedMotionMatches = false;
  mqListeners.clear();
  vi.spyOn(document, "readyState", "get").mockImplementation(() => readyState);
  Object.defineProperty(window, "requestIdleCallback", {
    configurable: true,
    writable: true,
    value: (cb: IdleCb) => idleCallbacks.push(cb),
  });
  Object.defineProperty(window, "cancelIdleCallback", {
    configurable: true,
    writable: true,
    value: () => undefined,
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      get matches() {
        return query.includes("reduce") ? reducedMotionMatches : false;
      },
      media: query,
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
        mqListeners.add(cb),
      removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
        mqListeners.delete(cb),
    }),
  });
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() =>
    Promise.resolve(),
  );
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
    () => undefined,
  );
});

afterEach(() => {
  // Unmount while play() and pause() are still stubbed: jsdom has neither.
  cleanup();
  vi.restoreAllMocks();
  Reflect.deleteProperty(navigator, "connection");
});

describe("HeroMasthead video gate", () => {
  it("shows only the photo until window load plus idle time, then mounts the video", () => {
    render(<HeroMasthead />);
    expect(screen.getByRole("img", { name: /woman resting/i })).toBeVisible();
    expect(video(), "video must be absent before load").toBeNull();

    fireLoadThenIdle();

    const el = video();
    expect(el, "video must be present after load and idle").not.toBeNull();
    expect(el!.getAttribute("preload")).toBe("auto");
    expect(el!.muted).toBe(true);
    expect(el!.playbackRate).toBe(1);
  });

  it("keeps the video transparent until it fires playing, then fades it in", () => {
    render(<HeroMasthead />);
    fireLoadThenIdle();
    const el = video()!;
    expect(el.className).toContain("opacity-0");
    expect(el.className).toContain("transition-opacity");
    fireEvent.playing(el);
    expect(el.className).toContain("opacity-100");
    expect(el.className).not.toContain("opacity-0");
  });

  it("lists the smaller H.264 MP4 first and keeps the WebM as a fallback", () => {
    render(<HeroMasthead />);
    fireLoadThenIdle();
    const types = Array.from(video()!.querySelectorAll("source")).map((s) =>
      s.getAttribute("type"),
    );
    expect(types).toEqual(["video/mp4", "video/webm"]);
  });

  it("mounts straight after idle time when the page has already loaded", () => {
    readyState = "complete";
    render(<HeroMasthead />);
    expect(video()).toBeNull();
    act(() => idleCallbacks.splice(0).forEach((cb) => cb()));
    expect(video()).not.toBeNull();
  });

  it("never mounts the video when reduced motion is on", () => {
    reducedMotionMatches = true;
    render(<HeroMasthead />);
    fireLoadThenIdle();
    expect(video()).toBeNull();
  });

  it("pauses and removes the video when reduced motion switches on later", () => {
    render(<HeroMasthead />);
    fireLoadThenIdle();
    expect(video()).not.toBeNull();
    const pause = vi.mocked(HTMLMediaElement.prototype.pause);
    pause.mockClear();

    setReducedMotion(true);

    expect(pause).toHaveBeenCalled();
    expect(video()).toBeNull();
    expect(screen.getByRole("img", { name: /woman resting/i })).toBeVisible();
  });

  it.each([
    ["Save-Data", { saveData: true, effectiveType: "4g" }],
    ["2G", { saveData: false, effectiveType: "2g" }],
    ["slow 2G", { saveData: false, effectiveType: "slow-2g" }],
  ])("never mounts the video on %s connections", (_, connection) => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: connection,
    });
    render(<HeroMasthead />);
    fireLoadThenIdle();
    expect(video()).toBeNull();
  });

  it("resumes playback when the tab becomes visible again", () => {
    render(<HeroMasthead />);
    fireLoadThenIdle();
    const el = video()!;
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    play.mockClear();
    vi.spyOn(el, "paused", "get").mockReturnValue(true);
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(play).toHaveBeenCalledTimes(1);
  });
});
