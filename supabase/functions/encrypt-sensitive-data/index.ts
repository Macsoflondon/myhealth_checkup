import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Encryption configuration
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

/**
 * Get encryption key from environment (securely stored in edge function secrets).
 * This key is NEVER sent to the client.
 *
 * SECURITY: We deliberately do NOT read VITE_* prefixed env vars here. Vite
 * inlines any VITE_* variable into the client JS bundle, so naming an
 * encryption secret with that prefix would risk leaking the AES-GCM key
 * to every browser visitor. Use ENCRYPTION_KEY only.
 */
function getEncryptionSecret(): string {
  const key = Deno.env.get('ENCRYPTION_KEY');
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not configured');
  }
  return key;
}

/**
 * Derives a cryptographic key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a string value using AES-GCM
 * Returns base64 encoded string: enc:salt+iv+ciphertext
 */
async function encryptField(plaintext: string): Promise<string> {
  if (!plaintext) return plaintext;

  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  const key = await deriveKey(getEncryptionSecret(), salt);
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv.buffer as ArrayBuffer },
    key,
    encoder.encode(plaintext)
  );

  // Combine salt + iv + ciphertext and encode as base64
  const ciphertextArray = new Uint8Array(ciphertext);
  const combined = new Uint8Array(salt.length + iv.length + ciphertextArray.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(ciphertextArray, salt.length + iv.length);

  // Use standard btoa for base64 encoding
  const binaryStr = Array.from(combined).map(b => String.fromCharCode(b)).join('');
  return 'enc:' + btoa(binaryStr);
}

/**
 * Decrypts an AES-GCM encrypted string
 * Expects base64 encoded string: enc:salt+iv+ciphertext
 */
async function decryptField(encryptedText: string): Promise<string> {
  if (!encryptedText) return encryptedText;
  
  // Check if the value is actually encrypted
  if (!encryptedText.startsWith('enc:')) {
    return encryptedText; // Return as-is if not encrypted
  }

  const decoder = new TextDecoder();
  const binaryStr = atob(encryptedText.slice(4));
  const combined = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    combined[i] = binaryStr.charCodeAt(i);
  }

  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(getEncryptionSecret(), salt);

  const plaintext = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: iv.buffer as ArrayBuffer },
    key,
    ciphertext.buffer as ArrayBuffer
  );

  return decoder.decode(plaintext);
}

/**
 * Sensitive field definitions - all PII fields requiring encryption
 */
const SENSITIVE_USER_PROFILE_FIELDS = [
  // Medical information
  'nhs_number',
  'health_conditions',
  'allergies',
  'medications',
  // Contact information
  'phone_number',
  'emergency_contact_name',
  'emergency_contact_phone',
  // Address information (PII)
  'address_line1',
  'address_line2',
  'postal_code',
  // Date of birth (PII)
  'date_of_birth',
];

const SENSITIVE_WEARABLE_FIELDS = [
  'access_token',
  'refresh_token',
];

const SENSITIVE_FIELDS = [
  ...SENSITIVE_USER_PROFILE_FIELDS,
  ...SENSITIVE_WEARABLE_FIELDS,
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Create client with user's JWT to verify authentication
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { action, data, fields } = body;

    if (!action || !['encrypt', 'decrypt', 'encryptFields', 'decryptFields'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be one of: encrypt, decrypt, encryptFields, decryptFields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For decrypt actions we must prove the caller owns the ciphertext.
    // We build the set of ciphertexts the authenticated user is allowed to
    // decrypt by pulling their own rows from user_profiles + wearable_connections.
    // Anything not in this set is rejected — preventing this endpoint from acting
    // as a decryption oracle for stolen blobs.
    let allowedCiphertexts: Set<string> | null = null;
    if (action === 'decrypt' || action === 'decryptFields') {
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      allowedCiphertexts = new Set<string>();

      const profileCols = SENSITIVE_USER_PROFILE_FIELDS.join(',');
      const { data: profileRows } = await admin
        .from('user_profiles')
        .select(profileCols)
        .eq('user_id', user.id);
      for (const row of (profileRows ?? []) as Array<Record<string, unknown>>) {
        for (const f of SENSITIVE_USER_PROFILE_FIELDS) {
          const v = row?.[f];
          if (typeof v === 'string' && v.startsWith('enc:')) allowedCiphertexts.add(v);
        }
      }

      const wearableCols = SENSITIVE_WEARABLE_FIELDS.join(',');
      const { data: wearableRows } = await admin
        .from('wearable_connections')
        .select(wearableCols)
        .eq('user_id', user.id);
      for (const row of (wearableRows ?? []) as Array<Record<string, unknown>>) {
        for (const f of SENSITIVE_WEARABLE_FIELDS) {
          const v = row?.[f];
          if (typeof v === 'string' && v.startsWith('enc:')) allowedCiphertexts.add(v);
        }
      }
    }

    const isOwned = (v: unknown): v is string =>
      typeof v === 'string' && (!v.startsWith('enc:') || (allowedCiphertexts?.has(v) ?? false));

    let result: unknown;

    switch (action) {
      case 'encrypt':
        if (typeof data !== 'string') {
          return new Response(
            JSON.stringify({ error: 'Data must be a string for encrypt action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        result = await encryptField(data);
        break;

      case 'decrypt':
        if (typeof data !== 'string') {
          return new Response(
            JSON.stringify({ error: 'Data must be a string for decrypt action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (data.startsWith('enc:') && !allowedCiphertexts!.has(data)) {
          return new Response(
            JSON.stringify({ error: 'Forbidden: ciphertext is not owned by the authenticated user' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        result = await decryptField(data);
        break;

      case 'encryptFields': {
        if (typeof data !== 'object' || data === null) {
          return new Response(
            JSON.stringify({ error: 'Data must be an object for encryptFields action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const fieldsToEncrypt = fields || SENSITIVE_FIELDS;
        const encrypted: Record<string, unknown> = { ...data };
        for (const field of fieldsToEncrypt) {
          if (field in encrypted && encrypted[field] !== null && encrypted[field] !== undefined) {
            const value = encrypted[field];
            if (Array.isArray(value)) {
              encrypted[field] = await encryptField(JSON.stringify(value));
            } else if (typeof value === 'string') {
              encrypted[field] = await encryptField(value);
            }
          }
        }
        result = encrypted;
        break;
      }

      case 'decryptFields': {
        if (typeof data !== 'object' || data === null) {
          return new Response(
            JSON.stringify({ error: 'Data must be an object for decryptFields action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const fieldsToDecrypt = fields || SENSITIVE_FIELDS;
        const decrypted: Record<string, unknown> = { ...data };
        for (const field of fieldsToDecrypt) {
          if (field in decrypted && decrypted[field] !== null && decrypted[field] !== undefined) {
            const value = decrypted[field];
            if (typeof value !== 'string') continue;
            if (!isOwned(value)) {
              // Silently drop blobs the caller doesn't own rather than leak existence.
              decrypted[field] = null;
              continue;
            }
            const decryptedValue = await decryptField(value);
            try {
              const parsed = JSON.parse(decryptedValue);
              if (Array.isArray(parsed)) {
                decrypted[field] = parsed;
                continue;
              }
            } catch {
              // Not JSON, treat as string
            }
            decrypted[field] = decryptedValue;
          }
        }
        result = decrypted;
        break;
      }
    }


    console.log(`Encryption action '${action}' completed for user ${user.id}`);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Encryption service error:', error);
    return new Response(
      JSON.stringify({ error: 'Encryption operation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
