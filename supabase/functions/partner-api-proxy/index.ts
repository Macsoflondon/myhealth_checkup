// Partner API adapter skeleton.
//
// Enforces the outbound security profile required for NHS-adjacent partners
// and pathology labs:
//   - OAuth 2.0 client_credentials with a signed JWT client-assertion
//     (private_key_jwt, RFC 7523) - no long-lived bearer tokens in code.
//   - Optional mTLS via a client certificate/key pair loaded from secrets.
//   - Token cache in-memory per invocation (edge functions are short-lived,
//     so we don't share tokens across instances - the partner should accept
//     opportunistic refresh).
//
// Configure per partner via secrets (prefix with partner id, e.g. `NHS_`):
//   <PREFIX>_TOKEN_URL          - OAuth token endpoint
//   <PREFIX>_CLIENT_ID          - client id issued by partner
//   <PREFIX>_JWT_PRIVATE_KEY    - PEM-encoded RSA/ECDSA private key
//   <PREFIX>_JWT_KID            - key id (kid) in the partner's JWKS
//   <PREFIX>_MTLS_CERT          - PEM client cert (optional)
//   <PREFIX>_MTLS_KEY           - PEM client key (optional)
//   <PREFIX>_SCOPE              - space-delimited scopes
//   <PREFIX>_AUDIENCE           - JWT `aud` claim (usually the token URL)
//
// This file is a stub: no partner is live yet. It exists so the pattern is
// codified and the P0 architecture item is met.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface PartnerConfig {
  tokenUrl: string;
  clientId: string;
  privateKeyPem: string;
  kid: string;
  audience: string;
  scope: string;
  mtlsCertPem?: string;
  mtlsKeyPem?: string;
}

function loadConfig(prefix: string): PartnerConfig | null {
  const env = (k: string) => Deno.env.get(`${prefix}_${k}`);
  const tokenUrl = env('TOKEN_URL');
  const clientId = env('CLIENT_ID');
  const privateKeyPem = env('JWT_PRIVATE_KEY');
  const kid = env('JWT_KID');
  if (!tokenUrl || !clientId || !privateKeyPem || !kid) return null;
  return {
    tokenUrl,
    clientId,
    privateKeyPem,
    kid,
    audience: env('AUDIENCE') ?? tokenUrl,
    scope: env('SCOPE') ?? '',
    mtlsCertPem: env('MTLS_CERT') ?? undefined,
    mtlsKeyPem: env('MTLS_KEY') ?? undefined,
  };
}

function b64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function pemToDer(pem: string): Uint8Array {
  const body = pem.replace(/-----BEGIN [^-]+-----|-----END [^-]+-----|\s+/g, '');
  const bin = atob(body);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function signClientAssertion(cfg: PartnerConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT', kid: cfg.kid };
  const payload = {
    iss: cfg.clientId,
    sub: cfg.clientId,
    aud: cfg.audience,
    jti: crypto.randomUUID(),
    iat: now,
    exp: now + 300,
  };
  const encHeader = b64url(new TextEncoder().encode(JSON.stringify(header)));
  const encPayload = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${encHeader}.${encPayload}`;

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToDer(cfg.privateKeyPem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput)));
  return `${signingInput}.${b64url(sig)}`;
}

async function fetchToken(cfg: PartnerConfig): Promise<string> {
  const assertion = await signClientAssertion(cfg);
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: assertion,
    ...(cfg.scope ? { scope: cfg.scope } : {}),
  });
  const res = await fetch(cfg.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`token endpoint ${res.status}`);
  const json = await res.json() as { access_token?: string };
  if (!json.access_token) throw new Error('no access_token in response');
  return json.access_token;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // Stub: partner configuration is opt-in. Until a partner is onboarded this
  // endpoint returns a discovery payload describing what secrets are needed.
  const url = new URL(req.url);
  const partner = url.searchParams.get('partner')?.toUpperCase() ?? '';
  if (!/^[A-Z0-9_]{2,32}$/.test(partner)) {
    return new Response(JSON.stringify({
      error: 'missing_or_invalid_partner_query_param',
      required_secrets: [
        '<PARTNER>_TOKEN_URL', '<PARTNER>_CLIENT_ID', '<PARTNER>_JWT_PRIVATE_KEY',
        '<PARTNER>_JWT_KID', '<PARTNER>_AUDIENCE', '<PARTNER>_SCOPE',
        '<PARTNER>_MTLS_CERT (optional)', '<PARTNER>_MTLS_KEY (optional)',
      ],
    }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const cfg = loadConfig(partner);
  if (!cfg) {
    return new Response(JSON.stringify({
      error: 'partner_not_configured',
      partner,
    }), { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    const token = await fetchToken(cfg);
    // Downstream call would go here with Authorization: Bearer <token>
    // and (when supported) a Deno.createHttpClient({ cert, key }) client for mTLS.
    return new Response(JSON.stringify({
      ok: true,
      partner,
      token_acquired: true,
      token_preview: `${token.slice(0, 8)}…`,
      mtls_configured: Boolean(cfg.mtlsCertPem && cfg.mtlsKeyPem),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({
      error: 'token_acquisition_failed',
      detail: e instanceof Error ? e.message : String(e),
    }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
