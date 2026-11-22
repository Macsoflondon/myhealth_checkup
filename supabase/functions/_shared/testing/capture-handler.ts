// Capture the deployed entry point without starting a listener in tests.
export async function captureHandler(load: () => Promise<unknown>) {
  const original = Deno.serve;
  const handlers: Array<(request: Request) => Promise<Response> | Response> =
    [];
  Deno.serve = ((
    handler: (request: Request) => Promise<Response> | Response,
  ) => {
    handlers.push(handler);
    return {};
  }) as unknown as typeof Deno.serve;
  try {
    await load();
  } finally {
    Deno.serve = original;
  }
  const handler = handlers[0];
  if (!handler) throw new Error("Entry point did not register a handler");
  return handler;
}
