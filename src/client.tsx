import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

// Client entry: TanStack Start's default, plus one change. Hydration waits
// until the browser has painted the server-rendered page once.
//
// PageSpeed runs sometimes showed a blank screen for ~2.5s on mobile although
// the HTML and stylesheet were ready in under a second: the entry script and
// hydration (plus the data requests it starts) ran ahead of the first frame.
// Lighthouse then counts all of that work towards First Contentful Paint and
// Largest Contentful Paint.
//
// requestAnimationFrame fires just before the next frame; the setTimeout
// inside it runs once that frame has been painted. The fallback timer covers
// background tabs, where requestAnimationFrame does not fire.
let started = false;

function hydrate() {
  if (started) return;
  started = true;
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>,
    );
  });
}

requestAnimationFrame(() => setTimeout(hydrate, 0));
setTimeout(hydrate, 150);
