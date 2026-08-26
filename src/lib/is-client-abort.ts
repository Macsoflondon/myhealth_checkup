/**
 * A client that navigates away or cancels an in-flight request closes the
 * socket, and Node's HTTP server surfaces that as `Error: aborted` from
 * `abortIncoming`. It is not an application fault: nothing failed, there is no
 * one left to serve, and rendering or logging it only produces phantom
 * "runtime error / blank screen" reports.
 */
export function isClientAbort(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; depth < 5 && current != null; depth++) {
    if (current instanceof Error) {
      const code = (current as { code?: unknown }).code;
      if (
        current.name === "AbortError" ||
        code === "ECONNRESET" ||
        code === "ERR_STREAM_PREMATURE_CLOSE" ||
        /^aborted$/i.test(current.message) ||
        /aborted|socketOnClose|abortIncoming/i.test(current.stack ?? "") ||
        // Dev-only: in-memory imagetools cache lost after a dev-server restart,
        // requested by a page that was loaded before it.
        /vite-imagetools cannot find image with id/i.test(current.message)
      ) {
        return true;
      }
      current = current.cause;
      continue;
    }
    return false;
  }
  return false;
}
