/**
 * Structured diagnostics for aborted socket closes.
 *
 * A client that navigates away, reloads, or times out closes the socket and Node
 * surfaces `Error: aborted`. That is usually benign, but when the homepage
 * blank-screens the same signature appears — so instead of swallowing aborts
 * silently we record who aborted, on which URL, at which point in the request
 * lifecycle, and how long the request had been running.
 */

import { isClientAbort } from "./is-client-abort";

export type AbortPhase =
  | "pre-render" // socket died before SSR produced a response
  | "during-render" // SSR handler threw the abort
  | "post-render" // response produced, stream cut while flushing
  | "process" // uncaught at process level, no request context
  | "vite-dev"; // Vite dev-server HTTP layer

export type AbortRecord = {
  at: string;
  phase: AbortPhase;
  requestId?: string;
  method?: string;
  url?: string;
  referer?: string;
  userAgent?: string;
  /** ms between request start and the abort */
  elapsedMs?: number;
  /** true when SSR had already started streaming HTML */
  responseStarted?: boolean;
  message?: string;
  stackHead?: string;
  /** number of other requests in flight when this one aborted */
  inFlight?: number;
};

type InFlight = {
  id: string;
  method: string;
  url: string;
  referer?: string;
  userAgent?: string;
  startedAt: number;
  responseStarted: boolean;
};

const RING_SIZE = 100;
const ring: AbortRecord[] = [];
const inFlight = new Map<string, InFlight>();

let counter = 0;

const isEnabled = (): boolean => {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  if (env?.["MHC_ABORT_LOG"] === "0") return false;
  return true;
};

const stackHead = (error: unknown): string | undefined => {
  if (!(error instanceof Error) || !error.stack) return undefined;
  return error.stack.split("\n").slice(0, 4).join(" | ");
};

export function beginRequest(request: Request): string {
  const id = `${Date.now().toString(36)}-${(counter++).toString(36)}`;
  inFlight.set(id, {
    id,
    method: request.method,
    url: request.url,
    referer: request.headers.get("referer") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
    startedAt: Date.now(),
    responseStarted: false,
  });
  return id;
}

export function markResponseStarted(id: string): void {
  const entry = inFlight.get(id);
  if (entry) entry.responseStarted = true;
}

export function endRequest(id: string): void {
  inFlight.delete(id);
}

export function recordAbort(
  error: unknown,
  phase: AbortPhase,
  requestId?: string,
): AbortRecord | undefined {
  if (!isEnabled()) return undefined;
  const entry = requestId ? inFlight.get(requestId) : undefined;
  const record: AbortRecord = {
    at: new Date().toISOString(),
    phase,
    requestId,
    method: entry?.method,
    url: entry?.url,
    referer: entry?.referer,
    userAgent: entry?.userAgent,
    elapsedMs: entry ? Date.now() - entry.startedAt : undefined,
    responseStarted: entry?.responseStarted,
    message: error instanceof Error ? error.message : String(error),
    stackHead: stackHead(error),
    inFlight: inFlight.size,
  };

  ring.push(record);
  if (ring.length > RING_SIZE) ring.shift();

  // Single-line JSON so it greps cleanly out of worker/dev-server logs.
  // console.warn (not error) keeps it out of the crash reporter.
  console.warn(`[abort] ${JSON.stringify(record)}`);
  return record;
}

/** Convenience: record only when the error really is a client abort. */
export function recordIfClientAbort(
  error: unknown,
  phase: AbortPhase,
  requestId?: string,
): boolean {
  if (!isClientAbort(error)) return false;
  recordAbort(error, phase, requestId);
  return true;
}

export function getRecentAborts(): AbortRecord[] {
  return [...ring].reverse();
}

export function getInFlightSnapshot(): Array<Omit<InFlight, "startedAt"> & { ageMs: number }> {
  const now = Date.now();
  return [...inFlight.values()].map(({ startedAt, ...rest }) => ({
    ...rest,
    ageMs: now - startedAt,
  }));
}
