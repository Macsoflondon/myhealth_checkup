import { afterEach, describe, expect, it, vi } from "vitest";
import type { UIMessage } from "ai";
import { STORAGE_KEY, clearMessages, saveMessages } from "../site-assistant-panel";

const messages: UIMessage[] = [
  { id: "1", role: "user", parts: [{ type: "text", text: "Hello" }] },
];

describe("assistant chat storage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("saveMessages writes the history to localStorage", () => {
    saveMessages(messages);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")).toEqual(messages);
  });

  it("clearMessages removes the key", () => {
    window.localStorage.setItem(STORAGE_KEY, "[]");
    clearMessages();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("neither throws when localStorage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => saveMessages(messages)).not.toThrow();
    expect(() => clearMessages()).not.toThrow();
  });
});
