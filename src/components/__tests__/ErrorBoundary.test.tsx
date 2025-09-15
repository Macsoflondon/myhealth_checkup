/* @vitest-environment jsdom */
import { describe, it, expect } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import ErrorBoundary from "../ErrorBoundary";

const Bomb = () => {
  throw new Error("Boom");
};

describe("ErrorBoundary", () => {
  it("renders fallback UI when child throws", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    act(() => {
      root.render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>
      );
    });
    expect(div.innerHTML).toContain("Something went wrong");
  });
});
