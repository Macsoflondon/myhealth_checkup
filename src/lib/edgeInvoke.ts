import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";

/**
 * Wrapper around supabase.functions.invoke that surfaces real error messages
 * instead of the opaque "Edge Function returned a non-2xx status code".
 *
 * It reads the function's response body when it errors and returns the JSON
 * `error` field (or raw text) as the thrown message.
 */
export async function edgeInvoke<T = unknown>(
  name: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(name, { body });
  if (!error) return data as T;

  let message = error.message || `Edge function ${name} failed`;
  let status: number | undefined;

  if (error instanceof FunctionsHttpError) {
    status = error.context?.status;
    try {
      // context.body can be a ReadableStream / Response — clone it as text
      const raw = await error.context.text?.();
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          message = parsed.error || parsed.message || raw;
        } catch {
          message = raw;
        }
      }
    } catch {
      /* swallow */
    }
  } else if (error instanceof FunctionsRelayError) {
    message = `Relay error: ${error.message}`;
  } else if (error instanceof FunctionsFetchError) {
    message = `Network error reaching ${name}: ${error.message}`;
  }

  const err = new Error(`${name}${status ? ` [${status}]` : ""}: ${message}`);
  // eslint-disable-next-line no-console
  console.error("[edgeInvoke]", name, status, message);
  throw err;
}
