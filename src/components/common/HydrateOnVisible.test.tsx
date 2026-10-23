import { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  HydrateOnVisible,
  lazyPreloadable,
} from "@/components/common/HydrateOnVisible";

describe("lazyPreloadable", () => {
  it("renders synchronously once preloaded, with no Suspense fallback", async () => {
    const Section = lazyPreloadable(async () => ({
      default: ({ label }: { label: string }) => <p>{label}</p>,
    }));
    await Section.preload();
    render(
      <Suspense fallback={<p>loading</p>}>
        <Section label="ready" />
      </Suspense>,
    );
    expect(screen.getByText("ready")).toBeInTheDocument();
    expect(screen.queryByText("loading")).not.toBeInTheDocument();
  });

  it("suspends like React.lazy when not preloaded", async () => {
    const Section = lazyPreloadable(async () => ({
      default: () => <p>late</p>,
    }));
    render(
      <Suspense fallback={<p>loading</p>}>
        <Section />
      </Suspense>,
    );
    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(await screen.findByText("late")).toBeInTheDocument();
  });
});

describe("HydrateOnVisible", () => {
  it("renders children straight away on a client render (no hydration)", () => {
    render(
      <HydrateOnVisible load={() => Promise.resolve()}>
        <p>section</p>
      </HydrateOnVisible>,
    );
    expect(screen.getByText("section")).toBeInTheDocument();
  });
});
