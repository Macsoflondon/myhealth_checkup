// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

import { isClientAbort } from "./is-client-abort";
import { recordAbort } from "./abort-diagnostics";

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 5_000;

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

// h3's HTTPError serializes to {"status":500,"unhandled":true,"message":"HTTPError"} —
// no stack, no cause — so a plain console.error(error) reaches the log pipeline with
// the failure detail stripped. Expand Error-like args into a string that keeps the
// message, stack, and the full cause chain.
const CAUSE_DEPTH_LIMIT = 5;
const DESCRIPTION_LENGTH_LIMIT = 8_000;

export function describeError(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;
  for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
    if (!(current instanceof Error)) {
      parts.push(
        typeof current === "string" ? current : safeStringify(current),
      );
      break;
    }
    const label = depth === 0 ? "" : "caused by: ";
    const status = describeStatus(current);
    parts.push(
      `${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`,
    );
    current = current.cause;
  }
  return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}

function describeStatus(error: Error): string {
  const { status, statusCode } = error as {
    status?: unknown;
    statusCode?: unknown;
  };
  const value = status ?? statusCode;
  return typeof value === "number" ? ` (status ${value})` : "";
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

function isErrorLike(value: unknown): value is Error {
  return value instanceof Error;
}

// Wrap console.error so errors logged by any layer — including h3's internal
// unhandled-error logging, which this file cannot hook directly — are both
// recorded for consumeLastCapturedError and expanded before serialization.
const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  // Client disconnects are not failures — never record or surface them.
  const abortArg = args.find((arg) => isErrorLike(arg) && isClientAbort(arg));
  if (abortArg) {
    // Never record: a stale abort in lastCapturedError would make a later, real
    // 500 look like a disconnect and return an empty body instead of an error page.
    recordAbort(abortArg, "process");
    return;
  }
  const expanded = args.map((arg) => {
    if (!isErrorLike(arg)) return arg;
    record(arg);
    return describeError(arg);
  });
  originalConsoleError(...expanded);
};

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => {
    const error = (event as ErrorEvent).error ?? event;
    if (isClientAbort(error)) {
      event.preventDefault?.();
      recordAbort(error, "process");
      return;
    }
    record(error);
  });
  globalThis.addEventListener("unhandledrejection", (event) => {
    const reason = (event as PromiseRejectionEvent).reason;
    if (isClientAbort(reason)) {
      event.preventDefault?.();
      recordAbort(reason, "process");
      return;
    }
    record(reason);
  });
}

// Node raises `Error: aborted` from abortIncoming as an uncaught exception that
// never reaches request middleware. Without this guard a single abandoned page
// load kills the SSR process. Only present on a Node host (no-op on workerd).
const nodeProcess = (globalThis as { process?: NodeJS.Process }).process;
if (nodeProcess && typeof nodeProcess.on === "function") {
  nodeProcess.on("uncaughtException", (error: unknown) => {
    if (isClientAbort(error)) {
      recordAbort(error, "process");
      return;
    }
    record(error);
    originalConsoleError(describeError(error));
  });
  nodeProcess.on("unhandledRejection", (reason: unknown) => {
    if (isClientAbort(reason)) {
      recordAbort(reason, "process");
      return;
    }
    record(reason);
    originalConsoleError(describeError(reason));
  });
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
