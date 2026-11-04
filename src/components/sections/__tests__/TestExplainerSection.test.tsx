import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TestProviders } from "@/test/test-providers";
import { TestExplainerSection } from "@/components/sections/TestExplainerSection";

describe("TestExplainerSection", () => {
  it("renders nothing while the explainer is disabled", () => {
    const { container } = render(<TestExplainerSection />, {
      wrapper: TestProviders,
    });
    expect(container).toBeEmptyDOMElement();
  });
});
