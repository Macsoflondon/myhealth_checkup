// fetch wrapper for os-plugins adapters: per-request timeout, JSON parsing,
// and errors that carry the status and a short body with anything that looks
// like a credential removed. Pure: runs under Deno and Node.

export type HttpInit = {
  method?: "GET" | "POST" | "PUT";
  headers?: Record<string, string>;
  body?: string | URLSearchParams;
  /** Default 20 s. */
  timeoutMs?: number;
  redirect?: "follow" | "manual";
};

export type RawResponse = {
  status: number;
  headers: Headers;
  /** Final URL after redirects. */
  url: string;
  text: string;
  ms: number;
};

export type Http = {
  json<T = unknown>(url: string, init?: HttpInit): Promise<T>;
  /** Never throws on HTTP status; throws only on network failure or timeout. */
  raw(url: string, init?: HttpInit): Promise<RawResponse>;
};

export class HttpError extends Error {
  readonly status: number;
  readonly body: string;
  constructor(status: number, message: string, body: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

/** Removes query strings and token-like substrings from text bound for logs. */
export function redact(text: string, secrets: string[] = []): string {
  let out = text;
  for (const s of secrets) {
    if (s && s.length >= 6) out = out.split(s).join("[redacted]");
  }
  return out
    .replace(/(https?:\/\/[^\s?"']+)\?[^\s"']*/g, "$1?[query removed]")
    .replace(/\b(Bearer\s+)[A-Za-z0-9._~+/=-]{8,}/gi, "$1[redacted]")
    .replace(/\b(sk|rk|pk)_(live|test)_[A-Za-z0-9]{6,}/g, "[redacted]")
    .replace(
      /-----BEGIN [A-Z ]+-----[\s\S]*?-----END [A-Z ]+-----/g,
      "[redacted key]",
    );
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "the API";
  }
}

export function createHttp(
  fetchImpl: typeof fetch = fetch,
  secrets: string[] = [],
): Http {
  const raw = async (
    url: string,
    init: HttpInit = {},
  ): Promise<RawResponse> => {
    const controller = new AbortController();
    const timeoutMs = init.timeoutMs ?? 20_000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const started = Date.now();
    try {
      const res = await fetchImpl(url, {
        method: init.method ?? "GET",
        headers: init.headers,
        body: init.body,
        redirect: init.redirect ?? "follow",
        signal: controller.signal,
      });
      const text = await res.text();
      return {
        status: res.status,
        headers: res.headers,
        url: res.url || url,
        text,
        ms: Date.now() - started,
      };
    } catch (e) {
      if (controller.signal.aborted) {
        throw new HttpError(
          0,
          `${hostOf(url)} did not answer within ${Math.round(timeoutMs / 1000)} s.`,
          "",
        );
      }
      const msg = e instanceof Error ? e.message : String(e);
      throw new HttpError(
        0,
        redact(`Could not reach ${hostOf(url)}: ${msg}`, secrets),
        "",
      );
    } finally {
      clearTimeout(timer);
    }
  };

  const json = async <T>(url: string, init: HttpInit = {}): Promise<T> => {
    const res = await raw(url, {
      ...init,
      headers: { accept: "application/json", ...(init.headers ?? {}) },
    });
    const body = redact(res.text.slice(0, 400), secrets);
    if (res.status < 200 || res.status >= 300) {
      throw new HttpError(
        res.status,
        `${hostOf(url)} answered ${res.status}${body ? `: ${body}` : ""}`,
        body,
      );
    }
    if (res.text.trim() === "") return null as T;
    try {
      return JSON.parse(res.text) as T;
    } catch {
      throw new HttpError(
        res.status,
        `${hostOf(url)} returned something other than JSON.`,
        body,
      );
    }
  };

  return { json, raw };
}
