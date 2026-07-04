/**
 * Envelope encryption helpers.
 *
 * Wire format for every encrypted value:
 *   { alg: 'AES-256-GCM', kid: string, iv: base64, ct: base64, tag: base64, aad?: base64 }
 *
 * - `alg` is fixed to AES-256-GCM in this build; new algorithms bump the shape.
 * - `kid` (key id) resolves to a Data Encryption Key (DEK). We look up the
 *   active KEK by purpose in the `encryption_keys` registry and derive/fetch
 *   the DEK server-side; the actual key material never lives in the client
 *   bundle.
 * - `iv` MUST be 12 random bytes, unique per ciphertext.
 * - `tag` is the GCM authentication tag (16 bytes) split from ciphertext so
 *   receivers can verify before decrypt.
 * - `aad` is optional additional-authenticated-data (record id, table name,
 *   classification) so ciphertexts can't be moved between rows.
 *
 * Rotation:
 *   1. Insert a new `encryption_keys` row with status='active', mark the old
 *      one 'rotating' then 'retired' once no ciphertext with the old kid
 *      remains.
 *   2. `reencryptEnvelope()` reads with the old kid and writes with the new.
 */

const ALG = 'AES-256-GCM' as const;

export interface Envelope {
  alg: typeof ALG;
  kid: string;
  iv: string;
  ct: string;
  tag: string;
  aad?: string;
}

function b64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
function unb64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bs(u: Uint8Array): BufferSource {
  // Workaround for TS lib.dom's ArrayBufferLike / ArrayBuffer mismatch under strict mode.
  return u as unknown as BufferSource;
}

async function importKey(rawKey: Uint8Array): Promise<CryptoKey> {
  if (rawKey.byteLength !== 32) throw new Error('DEK must be 32 bytes');
  return crypto.subtle.importKey('raw', bs(rawKey), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export interface SealOpts {
  kid: string;
  key: Uint8Array; // 32-byte DEK, sourced from server; never hardcode
  aad?: Uint8Array;
}

export async function seal(plaintext: string, opts: SealOpts): Promise<Envelope> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importKey(opts.key);
  const buf = new TextEncoder().encode(plaintext);
  const cipherWithTag = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: bs(iv), additionalData: opts.aad ? bs(opts.aad) : undefined, tagLength: 128 },
      key,
      bs(buf),
    ),
  );
  const tag = cipherWithTag.slice(cipherWithTag.byteLength - 16);
  const ct = cipherWithTag.slice(0, cipherWithTag.byteLength - 16);
  return {
    alg: ALG,
    kid: opts.kid,
    iv: b64(iv),
    ct: b64(ct),
    tag: b64(tag),
    aad: opts.aad ? b64(opts.aad) : undefined,
  };
}

export interface OpenOpts {
  key: Uint8Array;
  aad?: Uint8Array;
}

export async function open(env: Envelope, opts: OpenOpts): Promise<string> {
  if (env.alg !== ALG) throw new Error(`unsupported alg ${env.alg}`);
  const key = await importKey(opts.key);
  const ct = unb64(env.ct);
  const tag = unb64(env.tag);
  const combined = new Uint8Array(ct.byteLength + tag.byteLength);
  combined.set(ct, 0);
  combined.set(tag, ct.byteLength);
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: bs(unb64(env.iv)), additionalData: opts.aad ? bs(opts.aad) : undefined, tagLength: 128 },
    key,
    bs(combined),
  );
  return new TextDecoder().decode(plain);
}

export function isEnvelope(value: unknown): value is Envelope {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return v.alg === ALG && typeof v.kid === 'string' && typeof v.iv === 'string'
    && typeof v.ct === 'string' && typeof v.tag === 'string';
}

/**
 * Re-encrypts an envelope under a new DEK/kid. Callers pass the resolved
 * old and new keys (fetched from the server-side KEK registry).
 */
export async function reencryptEnvelope(
  env: Envelope,
  oldKey: Uint8Array,
  newKid: string,
  newKey: Uint8Array,
  aad?: Uint8Array,
): Promise<Envelope> {
  const plaintext = await open(env, { key: oldKey, aad });
  return seal(plaintext, { kid: newKid, key: newKey, aad });
}
