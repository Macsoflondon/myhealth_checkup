/**
 * Shared error utilities for edge functions.
 *
 * TypeScript narrows `catch (e)` to `unknown`. Use these helpers instead of
 * sprinkling `e instanceof Error ? e.message : String(e)` everywhere.
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const m = (error as { message: unknown }).message;
    if (typeof m === "string") return m;
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
export function describeError(error: unknown): { message: string; name?: string } {
  if (error instanceof Error) {
    return { message: error.message, name: error.name };
  }
  return { message: getErrorMessage(error) };
}
