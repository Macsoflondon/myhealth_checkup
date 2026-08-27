/**
 * Stale asset guard.
 *
 * A browser tab can outlive the asset map it was served with: a dev-server
 * restart or a redeploy invalidates hashed asset ids (images, chunks, CSS),
 * and the tab then requests URLs that no longer resolve. The visible symptom
 * is a broken hero image or, worse, aborted module requests and a blank page.
 *
 * This guard watches for failed same-origin asset loads, confirms the asset is
 * genuinely gone (404/410/5xx on a cache-bypassing re-fetch), and reloads the
 * page once with a cache-busting marker so the document — and with it a fresh
 * asset map — is fetched from the network instead of the bfcache/HTTP cache.
 */

const RETRY_KEY = "mhc:stale-asset-retry";
const RETRY_PARAM = "__assets";
const MAX_RETRIES = 1;
const RETRY_WINDOW_MS = 60_000;

const ASSET_PATH_PATTERN =
  /(\/@imagetools|\/@fs\/|\/@vite\/|\/_build\/|\/assets\/|\/node_modules\/\.vite\/)/;
const ASSET_EXTENSION_PATTERN =
  /\.(avif|webp|png|jpe?g|gif|svg|css|m?js|woff2?)(\?|$)/i;

type RetryRecord = { count: number; at: number };

let installed = false;
let checking = false;
// Set when this page load actually triggered a recovery reload. Used to keep
// the retry budget intact across the reload so a persistently missing asset
// cannot bounce the visitor through an endless reload loop.
let reloadTriggeredThisLoad = false;

/** True while a form field holds user input that a reload would destroy. */
const hasDirtyFormInput = (): boolean => {
  if (!isBrowser()) return false;
  const active = document.activeElement;
  if (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement
  ) {
    if (active.value.trim() !== "") return true;
  }
  // Also protect any field with user-entered content anywhere on the page.
  const fields = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea",
  );
  for (const field of fields) {
    if (field.value.trim() !== "") return true;
  }
  return false;
};

const isBrowser = () => typeof window !== "undefined";

const readRetryRecord = (): RetryRecord => {
  try {
    const raw = window.sessionStorage.getItem(RETRY_KEY);
    if (!raw) return { count: 0, at: 0 };
    const parsed = JSON.parse(raw) as Partial<RetryRecord>;
    if (typeof parsed?.count !== "number" || typeof parsed?.at !== "number") {
      return { count: 0, at: 0 };
    }
    // Retries older than the window are treated as unrelated to this incident.
    if (Date.now() - parsed.at > RETRY_WINDOW_MS) return { count: 0, at: 0 };
    return { count: parsed.count, at: parsed.at };
  } catch {
    return { count: 0, at: 0 };
  }
};

const writeRetryRecord = (record: RetryRecord): void => {
  try {
    window.sessionStorage.setItem(RETRY_KEY, JSON.stringify(record));
  } catch {
    // Private-mode storage failures must not block the reload.
  }
};

/** Clears the retry budget — call once the page has rendered successfully. */
export const clearStaleAssetRetries = (): void => {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(RETRY_KEY);
  } catch {
    // ignore
  }
};

export const isAssetUrl = (rawUrl: string): boolean => {
  if (!rawUrl || !isBrowser()) return false;
  let url: URL;
  try {
    url = new URL(rawUrl, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  return (
    ASSET_PATH_PATTERN.test(url.pathname) ||
    ASSET_EXTENSION_PATTERN.test(url.pathname)
  );
};

/** True when the asset really is gone rather than momentarily unreachable. */
const isAssetStale = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { cache: "reload", credentials: "same-origin" });
    return response.status === 404 || response.status === 410 || response.status >= 500;
  } catch {
    // Network-level failure (offline, aborted): not provably stale.
    return false;
  }
};

const reloadWithFreshAssetMap = (): void => {
  const record = readRetryRecord();
  if (record.count >= MAX_RETRIES) return;
  writeRetryRecord({ count: record.count + 1, at: Date.now() });

  const target = new URL(window.location.href);
  target.searchParams.set(RETRY_PARAM, String(Date.now()));
  window.location.replace(target.toString());
};

const handleStaleCandidate = async (url: string): Promise<void> => {
  if (checking || !isAssetUrl(url)) return;
  if (readRetryRecord().count >= MAX_RETRIES) return;
  checking = true;
  try {
    if (await isAssetStale(url)) reloadWithFreshAssetMap();
  } finally {
    checking = false;
  }
};

const resourceUrl = (target: EventTarget | null): string | null => {
  if (!(target instanceof HTMLElement)) return null;
  if (target instanceof HTMLImageElement) return target.currentSrc || target.src;
  if (target instanceof HTMLScriptElement) return target.src;
  if (target instanceof HTMLLinkElement) return target.href;
  if (target instanceof HTMLSourceElement) return target.src || target.srcset;
  return null;
};

/**
 * Installs the guard. Safe to call multiple times; no-ops on the server.
 * Returns a teardown function (used by tests).
 */
export const installStaleAssetGuard = (): (() => void) => {
  if (!isBrowser() || installed) return () => {};
  installed = true;

  const onResourceError = (event: Event) => {
    const url = resourceUrl(event.target);
    if (url) void handleStaleCandidate(url);
  };

  const onPreloadError = (event: Event) => {
    const payload = event as Event & { payload?: { message?: string } };
    const match = payload.payload?.message?.match(/https?:\/\/\S+/);
    if (match) void handleStaleCandidate(match[0]);
  };

  const onRejection = (event: PromiseRejectionEvent) => {
    const message = String(
      (event.reason as Error | undefined)?.message ?? event.reason ?? "",
    );
    if (!/dynamically imported module|module script failed|ChunkLoadError/i.test(message)) {
      return;
    }
    const match = message.match(/https?:\/\/\S+?(?=\s|$|\))/);
    if (match) void handleStaleCandidate(match[0]);
  };

  // Resource errors do not bubble — listen in the capture phase.
  window.addEventListener("error", onResourceError, true);
  window.addEventListener("vite:preloadError", onPreloadError);
  window.addEventListener("unhandledrejection", onRejection);

  // A load that reaches this point rendered fine: release the retry budget.
  window.setTimeout(clearStaleAssetRetries, 5_000);

  return () => {
    window.removeEventListener("error", onResourceError, true);
    window.removeEventListener("vite:preloadError", onPreloadError);
    window.removeEventListener("unhandledrejection", onRejection);
    installed = false;
  };
};
