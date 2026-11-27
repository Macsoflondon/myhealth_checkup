import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  HeadContent,
  RouterContextProvider,
  Scripts,
} from "@tanstack/react-router";

describe("router ssr nonce", () => {
  it("puts the nonce on inline head scripts and Scripts output", async () => {
    const nonce = "CCCCCCCCCCCCCCCCCCCCCC==";
    const rootRoute = createRootRoute({
      head: () => ({
        scripts: [
          { type: "application/ld+json", children: '{"@type":"Organization"}' },
        ],
      }),
    });
    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory({ initialEntries: ["/"] }),
      ssr: { nonce },
    });
    await router.load();
    const html = renderToString(
      <RouterContextProvider router={router}>
        <HeadContent />
        <Scripts />
      </RouterContextProvider>,
    );
    const scripts = html.match(/<script\b[^>]*>/g) ?? [];
    expect(scripts.length).toBeGreaterThan(0);
    for (const tag of scripts) expect(tag).toContain(`nonce="${nonce}"`);
  });
});
