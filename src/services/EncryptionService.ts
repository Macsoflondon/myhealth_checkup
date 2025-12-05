/**
 * Field-Level Encryption Service
 * Uses AES-GCM encryption for sensitive data protection
 * Key is derived from environment secret using PBKDF2
 */

// Encryption configuration
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

// Get encryption key from environment variable
const getEncryptionSecret = (): string => {
  const key = import.meta.env.VITE_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('VITE_ENCRYPTION_KEY environment variable is not configured. Please add this secret to enable encryption.');
  }
  return key;
};

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
export async function encryptField(plaintext: string): Promise<string> {
  if (!plaintext) return plaintext;

  try {
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

    return 'enc:' + btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
}

/**
 * Decrypts an AES-GCM encrypted string
 * Expects base64 encoded string: enc:salt+iv+ciphertext
 */
export async function decryptField(encryptedText: string): Promise<string> {
  if (!encryptedText) return encryptedText;
  
  // Check if the value is actually encrypted
  if (!encryptedText.startsWith('enc:')) {
    return encryptedText; // Return as-is if not encrypted
  }

  try {
    const decoder = new TextDecoder();
    const combined = new Uint8Array(
      atob(encryptedText.slice(4)).split('').map(c => c.charCodeAt(0))
    );

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
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt sensitive data');
  }
}

/**
 * Encrypts an array of strings
 */
export async function encryptArray(arr: string[] | null): Promise<string | null> {
  if (!arr || arr.length === 0) return null;
  return encryptField(JSON.stringify(arr));
}

/**
 * Decrypts an encrypted array
 */
export async function decryptArray(encryptedArr: string | null): Promise<string[] | null> {
  if (!encryptedArr) return null;
  const decrypted = await decryptField(encryptedArr);
  try {
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

/**
 * Sensitive field definitions for user_profiles table
 */
export const SENSITIVE_USER_PROFILE_FIELDS = [
  'nhs_number',
  'health_conditions',
  'allergies',
  'medications',
  'emergency_contact_name',
  'emergency_contact_phone',
] as const;

/**
 * Sensitive field definitions for wearable_connections table
 * OAuth tokens must be encrypted to prevent token theft in case of database breach
 */
export const SENSITIVE_WEARABLE_FIELDS = [
  'access_token',
  'refresh_token',
] as const;

/**
 * Combined sensitive fields for backward compatibility
 */
export const SENSITIVE_FIELDS = [
  ...SENSITIVE_USER_PROFILE_FIELDS,
  ...SENSITIVE_WEARABLE_FIELDS,
] as const;

export type SensitiveField = typeof SENSITIVE_FIELDS[number];

/**
 * Encrypts sensitive fields in a user profile object before storage
 */
export async function encryptSensitiveFields<T extends Record<string, unknown>>(
  data: T,
  fieldsToEncrypt: readonly string[] = SENSITIVE_FIELDS
): Promise<Record<string, unknown>> {
  const encrypted: Record<string, unknown> = { ...data };

  for (const field of fieldsToEncrypt) {
    if (field in encrypted && encrypted[field] !== null && encrypted[field] !== undefined) {
      const value = encrypted[field];
      
      if (Array.isArray(value)) {
        encrypted[field] = await encryptArray(value as string[]);
      } else if (typeof value === 'string') {
        encrypted[field] = await encryptField(value);
      }
    }
  }

  return encrypted;
}

/**
 * Decrypts sensitive fields in a user profile object after retrieval
 */
export async function decryptSensitiveFields<T extends Record<string, unknown>>(
  data: T,
  fieldsToDecrypt: readonly string[] = SENSITIVE_FIELDS
): Promise<Record<string, unknown>> {
  const decrypted: Record<string, unknown> = { ...data };

  for (const field of fieldsToDecrypt) {
    if (field in decrypted && decrypted[field] !== null && decrypted[field] !== undefined) {
      const value = decrypted[field];
      
      if (typeof value === 'string') {
        // Check if it's an encrypted array or string
        const decryptedValue = await decryptField(value);
        
        // Try to parse as JSON array
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
  }

  return decrypted;
}

/**
 * Utility to check if a value is encrypted
 */
export function isEncrypted(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.startsWith('enc:');
}

/**
 * Encrypts wearable connection tokens before storage
 */
export async function encryptWearableTokens<T extends Record<string, unknown>>(
  data: T
): Promise<Record<string, unknown>> {
  return encryptSensitiveFields(data, SENSITIVE_WEARABLE_FIELDS);
}

/**
 * Decrypts wearable connection tokens after retrieval
 */
export async function decryptWearableTokens<T extends Record<string, unknown>>(
  data: T
): Promise<Record<string, unknown>> {
  return decryptSensitiveFields(data, SENSITIVE_WEARABLE_FIELDS);
}

// Export service instance
export const encryptionService = {
  encryptField,
  decryptField,
  encryptArray,
  decryptArray,
  encryptSensitiveFields,
  decryptSensitiveFields,
  encryptWearableTokens,
  decryptWearableTokens,
  isEncrypted,
  SENSITIVE_FIELDS,
  SENSITIVE_USER_PROFILE_FIELDS,
  SENSITIVE_WEARABLE_FIELDS,
};

export default encryptionService;
