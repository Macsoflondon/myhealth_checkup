/* @vitest-environment jsdom */
import { describe, it, expect } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";

const AlwaysBomb = () => {
  throw new Error("Boom");
};


describe("ErrorBoundary", () => {
  it("renders fallback UI with retry option when child throws", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    act(() => {
      root.render(
        <MemoryRouter>
          <ErrorBoundary>
            <AlwaysBomb />
          </ErrorBoundary>
        </MemoryRouter>
      );
    });
    expect(div.innerHTML).toContain("Something went wrong");
    expect(div.innerHTML).toContain("Try again");
  });

  it("resets error state when 'Try again' is clicked", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    let boundary: ErrorBoundary | null = null;
    act(() => {
      root.render(
        <MemoryRouter>
          <ErrorBoundary ref={(ref) => (boundary = ref)}>
            <div>All good</div>
          </ErrorBoundary>
        </MemoryRouter>
      );
    });
    act(() => {
      boundary?.setState({ hasError: true });
    });
    const button = div.querySelector("button");
    expect(button).not.toBeNull();
    act(() => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(div.innerHTML).toContain("All good");
  });
});
