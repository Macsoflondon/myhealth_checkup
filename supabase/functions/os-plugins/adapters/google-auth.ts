// Google service account OAuth for the GA4 and Search Console adapters.
// Signs a JWT with the account's private key through Web Crypto and swaps it
// for an access token (the OAuth 2.0 JWT bearer flow). No npm packages, so it
// runs under Deno and Node alike. Error messages never carry the key, the
// signed assertion or the access token.
import { HttpError, redact, type Http } from "../lib/http.ts";
import { ConfigError } from "./types.ts";

export const GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token";

const JWT_BEARER = "urn:ietf:params:oauth:grant-type:jwt-bearer";
const TOKEN_LIFETIME_S = 3600;
/** Fetch a new token once the cached one has less than this left. */
const REFRESH_MARGIN_MS = 60_000;

export type GoogleServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri: string;
};

type CachedToken = { token: string; expiresAt: number };

/** An HttpError whose message has already been reworded for the sync log. */
export class GoogleApiError extends HttpError {
  constructor(status: number, message: string, body: string) {
    super(status, message, body);
    this.name = "GoogleApiError";
  }
}

const tokenCache = new Map<string, CachedToken>();

/** Empties the token cache. For tests. */
export function clearGoogleTokenCache(): void {
  tokenCache.clear();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonObject(text: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(text);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Accepts the JSON key file as pasted, or base64-encoded as some hosts store it. */
function decodeKeyFile(raw: string): Record<string, unknown> | null {
  // trim() also removes a leading byte order mark.
  const text = raw.trim();
  const direct = parseJsonObject(text);
  if (direct) return direct;
  if (/^[A-Za-z0-9+/=_\-\s]+$/.test(text)) {
    try {
      const b64 = text
        .replace(/\s+/g, "")
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      return parseJsonObject(atob(b64));
    } catch {
      return null;
    }
  }
  return null;
}

function isGoogleTokenUri(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "googleapis.com" ||
        url.hostname.endsWith(".googleapis.com"))
    );
  } catch {
    return false;
  }
}

export function parseServiceAccount(json: string): GoogleServiceAccount {
  const key = decodeKeyFile(json);
  if (!key) {
    throw new ConfigError("The Google service account key is not valid JSON.");
  }
  if (typeof key.type === "string" && key.type !== "service_account") {
    throw new ConfigError(
      "The Google key is not a service account key. Create a JSON key for a service account in Google Cloud and paste the whole file.",
    );
  }
  const privateKey =
    typeof key.private_key === "string" ? key.private_key.trim() : "";
  if (!privateKey) {
    throw new ConfigError(
      "The Google service account key has no private_key. Paste the whole JSON key file from Google Cloud.",
    );
  }
  const clientEmail =
    typeof key.client_email === "string" ? key.client_email.trim() : "";
  if (!clientEmail) {
    throw new ConfigError(
      "The Google service account key has no client_email. Paste the whole JSON key file from Google Cloud.",
    );
  }
  let tokenUri = GOOGLE_TOKEN_URI;
  if (typeof key.token_uri === "string" && key.token_uri.trim() !== "") {
    tokenUri = key.token_uri.trim();
    // The signed assertion is a credential, so only send it to Google.
    if (!isGoogleTokenUri(tokenUri)) {
      throw new ConfigError(
        "The Google service account key has a token_uri that is not a Google address.",
      );
    }
  }
  return {
    client_email: clientEmail,
    private_key: privateKey,
    token_uri: tokenUri,
  };
}

function base64UrlBytes(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlJson(value: unknown): string {
  return base64UrlBytes(new TextEncoder().encode(JSON.stringify(value)));
}

/** PKCS#8 PEM to DER bytes. Tolerates keys whose newlines arrived as literal "\n". */
function pemToDer(pem: string): ArrayBuffer {
  const text = pem.replace(/\\r/g, "").replace(/\\n/g, "\n");
  const match =
    /-----BEGIN PRIVATE KEY-----([\s\S]*?)-----END PRIVATE KEY-----/.exec(text);
  if (!match) {
    throw new ConfigError(
      /BEGIN (RSA |ENCRYPTED )?PRIVATE KEY/.test(text)
        ? "The Google service account private_key is not in the PKCS#8 format Google issues. Download a new JSON key from Google Cloud."
        : "The Google service account private_key is not a PEM private key. Paste the whole JSON key file from Google Cloud.",
    );
  }
  let binary: string;
  try {
    binary = atob(match[1].replace(/\s+/g, ""));
  } catch {
    throw new ConfigError(
      "The Google service account private_key is damaged. Download a new JSON key from Google Cloud.",
    );
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/** Builds and signs the RS256 JWT assertion. Exported for tests. */
export async function signServiceAccountJwt(
  account: GoogleServiceAccount,
  scopes: string[],
  now: Date,
): Promise<string> {
  const iat = Math.floor(now.getTime() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: account.client_email,
    scope: scopes.join(" "),
    aud: account.token_uri,
    iat,
    exp: iat + TOKEN_LIFETIME_S,
  };
  const signingInput = `${base64UrlJson(header)}.${base64UrlJson(claims)}`;

  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      "pkcs8",
      pemToDer(account.private_key),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
  } catch (e) {
    if (e instanceof ConfigError) throw e;
    throw new ConfigError(
      "The Google service account private_key could not be read. Download a new JSON key from Google Cloud.",
    );
  }
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );
  return `${signingInput}.${base64UrlBytes(new Uint8Array(signature))}`;
}

/** The useful sentence from a Google error body, or null. */
export function googleErrorDetail(body: string): string | null {
  const text = body.trim();
  if (!text || text.startsWith("<")) return null;
  const parsed = parseJsonObject(text);
  if (parsed) {
    const error = parsed.error;
    if (isRecord(error) && typeof error.message === "string") {
      return error.message.trim() || null;
    }
    if (typeof parsed.error_description === "string") {
      return parsed.error_description.trim() || null;
    }
    if (typeof error === "string") return error.trim() || null;
    if (typeof parsed.message === "string") {
      return parsed.message.trim() || null;
    }
    return null;
  }
  // HttpError keeps only the first 400 characters, so the JSON is often cut
  // short. Pull the first message-like field out of what is left.
  const field = /"(?:message|error_description)"\s*:\s*"((?:[^"\\]|\\.)*)/.exec(
    text,
  );
  if (field) {
    const value = field[1].replace(/\\(["\\/])/g, "$1").replace(/\\n/g, " ");
    return value.trim() || null;
  }
  return null;
}

/**
 * Rewrites an HttpError from a Google API into a plain message naming the
 * service, keeping the status. Other errors, and errors already reworded,
 * pass through unchanged.
 */
export function describeGoogleError(e: unknown, service: string): Error {
  if (e instanceof GoogleApiError) return e;
  if (e instanceof HttpError) {
    // Status 0 is a timeout or network failure, already worded plainly.
    if (e.status === 0) return e;
    const detail = googleErrorDetail(e.body);
    return new GoogleApiError(
      e.status,
      `${service} answered ${e.status}${detail ? `: ${redact(detail)}` : "."}`,
      e.body,
    );
  }
  return e instanceof Error ? e : new Error("The Google token request failed.");
}

/**
 * An OAuth access token for the service account, cached per account and
 * scope set until a minute before it expires.
 */
export async function googleAccessToken(
  http: Http,
  serviceAccountJson: string,
  scopes: string[],
  now = new Date(),
): Promise<string> {
  const account = parseServiceAccount(serviceAccountJson);
  const cacheKey = `${account.client_email}|${[...scopes].sort().join(" ")}`;
  const cached = tokenCache.get(cacheKey);
  if (cached && now.getTime() < cached.expiresAt - REFRESH_MARGIN_MS) {
    return cached.token;
  }

  const assertion = await signServiceAccountJwt(account, scopes, now);
  const body = new URLSearchParams({
    grant_type: JWT_BEARER,
    assertion,
  }).toString();

  let res: unknown;
  try {
    res = await http.json<unknown>(account.token_uri, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      timeoutMs: 15_000,
    });
  } catch (e) {
    if (e instanceof HttpError && e.status !== 0) {
      const detail = googleErrorDetail(e.body);
      throw new GoogleApiError(
        e.status,
        `Google did not issue an access token for the service account (${e.status})${
          detail ? `: ${redact(detail, [assertion])}` : "."
        }`,
        e.body,
      );
    }
    throw e;
  }

  const token = isRecord(res) ? res.access_token : undefined;
  if (typeof token !== "string" || token === "") {
    throw new Error(
      "Google's token endpoint answered without an access token.",
    );
  }
  const reported = isRecord(res) ? Number(res.expires_in) : Number.NaN;
  const expiresIn =
    Number.isFinite(reported) && reported > 0 ? reported : TOKEN_LIFETIME_S;
  tokenCache.set(cacheKey, {
    token,
    expiresAt: now.getTime() + expiresIn * 1000,
  });
  return token;
}
