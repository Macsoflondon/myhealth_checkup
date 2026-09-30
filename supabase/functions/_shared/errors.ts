/**
 * Shared error utilities for edge functions.
 *
 * TypeScript narrows `catch (e)` to `unknown`. Use these helpers instead of
 * sprinkling `e instanceof Error ? e.message : String(e)` everywhere.
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const e = error as Record<string, unknown>;
    const parts = [
      typeof e.message === "string" ? e.message : null,
      typeof e.details === "string" ? e.details : null,
      typeof e.hint === "string" ? e.hint : null,
      typeof e.code === "string" ? `(code ${e.code})` : null,
    ].filter(Boolean) as string[];
    if (parts.length) return parts.join(" — ");
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) return error.stack;
  return undefined;
}

/**
 * Convenience wrapper that returns a structured object suitable for logging
 * or for serialising into a JSON response without leaking stack traces in prod.
 */
export function describeError(error: unknown): {
  message: string;
  name?: string;
} {
  if (error instanceof Error) {
    return { message: error.message, name: error.name };
  }
  return { message: getErrorMessage(error) };
}

export const GENERIC_ERROR_MESSAGE =
  "Internal error. Details are in the function logs.";

/**
 * Logs the full error (message and stack) server side and returns a JSON error
 * response that never exposes either to the caller. Pass the function's CORS
 * headers so browser callers still see the response. `body` carries any extra
 * non-sensitive fields the caller expects (e.g. `{ success: false }`).
 */
export function internalErrorResponse(
  context: string,
  error: unknown,
  headers: Record<string, string> = {},
  {
    status = 500,
    body = {},
  }: { status?: number; body?: Record<string, unknown> } = {},
): Response {
  console.error(`[${context}]`, error);
  return new Response(
    JSON.stringify({ ...body, error: GENERIC_ERROR_MESSAGE }),
    {
      status,
      headers: { ...headers, "Content-Type": "application/json" },
    },
  );
}
