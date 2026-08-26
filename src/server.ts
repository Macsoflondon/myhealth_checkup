import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { isClientAbort } from "./lib/is-client-abort";
import {
  beginRequest,
  endRequest,
  markResponseStarted,
  recordAbort,
} from "./lib/abort-diagnostics";

type ServerEntry = {
  fetch: (
    request: Request,
    env: unknown,
    ctx: unknown,
  ) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  const capturedError = consumeLastCapturedError();
  if (isClientAbort(capturedError)) {
    return new Response(null, { status: 499 });
  }
  console.error(capturedError ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as {
      unhandled?: unknown;
      message?: unknown;
    };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const requestId = beginRequest(request);
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      markResponseStarted(requestId);
      // The body may still be streaming; a cut mid-stream is a post-render abort.
      request.signal?.addEventListener("abort", () => {
        recordAbort(
          new Error("request signal aborted"),
          "post-render",
          requestId,
        );
      });
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      // Client went away mid-request: no error page, but keep a structured trace.
      if (isClientAbort(error)) {
        recordAbort(error, "during-render", requestId);
        return new Response(null, { status: 499 });
      }
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    } finally {
      endRequest(requestId);
    }
  },
};
