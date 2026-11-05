import "./lib/zod-jitless";
import {
  createStart,
  createCsrfMiddleware,
  createMiddleware,
} from "@tanstack/react-start";

// Arms the process-level client-abort guard in the dev/SSR process too — in dev
// the Vite Node server, not src/server.ts, owns the HTTP socket that emits
// `Error: aborted` from abortIncoming when a client navigates away.
import "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { isClientAbort } from "./lib/is-client-abort";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { applySecurityHeadersForRequest } from "./lib/security-headers";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    if (isClientAbort(error)) return new Response(null, { status: 499 });
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Lovable hosting ignores public/_headers and vercel.json, so security
// headers are attached here to every server response (pages, server routes,
// server functions).
// src/server.ts applies the same headers again to every outgoing response,
// including thrown errors and its own fallback 500/499 responses.
const securityHeadersMiddleware = createMiddleware().server(async ({ next, request }) => {
  const result = await next();
  return { ...result, response: applySecurityHeadersForRequest(result.response, request) };
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [securityHeadersMiddleware, errorMiddleware, csrfMiddleware],
}));
