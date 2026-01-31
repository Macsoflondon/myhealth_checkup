/**
 * Server-Side Encryption Service
 * 
 * SECURITY NOTICE: All encryption operations are performed server-side
 * via an Edge Function. The encryption key is stored in edge function secrets
 * and is NEVER exposed to the client-side JavaScript bundle.
 * 
 * This service provides a client-side wrapper that calls the server-side
 * encryption endpoint for all cryptographic operations.
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Sensitive field definitions for user_profiles table
 * Includes all PII fields that should be encrypted at rest
 */
export const SENSITIVE_USER_PROFILE_FIELDS = [
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

interface EncryptionResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Encrypts a string value using server-side AES-GCM encryption
 * Returns base64 encoded string: enc:salt+iv+ciphertext
 * 
 * SECURITY: The encryption key is stored in edge function secrets
 * and never exposed to the client.
 */
export async function encryptField(plaintext: string): Promise<string> {
  if (!plaintext) return plaintext;

  try {
    const { data, error } = await supabase.functions.invoke<EncryptionResponse>(
      'encrypt-sensitive-data',
      {
        body: { action: 'encrypt', data: plaintext }
      }
    );

    if (error) {
      console.error('Server encryption failed:', error);
      throw new Error('Failed to encrypt sensitive data');
    }

    if (!data?.success) {
      console.error('Server encryption returned error:', data?.error);
      throw new Error(data?.error || 'Failed to encrypt sensitive data');
    }

    return data.data as string;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
}

/**
 * Decrypts an AES-GCM encrypted string using server-side decryption
 * Expects base64 encoded string: enc:salt+iv+ciphertext
 * 
 * SECURITY: The decryption key is stored in edge function secrets
 * and never exposed to the client.
 */
export async function decryptField(encryptedText: string): Promise<string> {
  if (!encryptedText) return encryptedText;
  
  // Check if the value is actually encrypted
  if (!encryptedText.startsWith('enc:')) {
    return encryptedText; // Return as-is if not encrypted
  }

  try {
    const { data, error } = await supabase.functions.invoke<EncryptionResponse>(
      'encrypt-sensitive-data',
      {
        body: { action: 'decrypt', data: encryptedText }
      }
    );

    if (error) {
      console.error('Server decryption failed:', error);
      throw new Error('Failed to decrypt sensitive data');
    }

    if (!data?.success) {
      console.error('Server decryption returned error:', data?.error);
      throw new Error(data?.error || 'Failed to decrypt sensitive data');
    }

    return data.data as string;
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
 * Encrypts sensitive fields in a user profile object before storage
 * Uses server-side encryption for security.
 */
export async function encryptSensitiveFields<T extends Record<string, unknown>>(
  data: T,
  fieldsToEncrypt: readonly string[] = SENSITIVE_FIELDS
): Promise<Record<string, unknown>> {
  try {
    const { data: responseData, error } = await supabase.functions.invoke<EncryptionResponse>(
      'encrypt-sensitive-data',
      {
        body: { 
          action: 'encryptFields', 
          data,
          fields: fieldsToEncrypt
        }
      }
    );

    if (error) {
      console.error('Server encryptFields failed:', error);
      throw new Error('Failed to encrypt sensitive fields');
    }

    if (!responseData?.success) {
      console.error('Server encryptFields returned error:', responseData?.error);
      throw new Error(responseData?.error || 'Failed to encrypt sensitive fields');
    }

    return responseData.data as Record<string, unknown>;
  } catch (error) {
    console.error('encryptSensitiveFields failed:', error);
    throw new Error('Failed to encrypt sensitive fields');
  }
}

/**
 * Decrypts sensitive fields in a user profile object after retrieval
 * Uses server-side decryption for security.
 */
export async function decryptSensitiveFields<T extends Record<string, unknown>>(
  data: T,
  fieldsToDecrypt: readonly string[] = SENSITIVE_FIELDS
): Promise<Record<string, unknown>> {
  try {
    const { data: responseData, error } = await supabase.functions.invoke<EncryptionResponse>(
      'encrypt-sensitive-data',
      {
        body: { 
          action: 'decryptFields', 
          data,
          fields: fieldsToDecrypt
        }
      }
    );

    if (error) {
      console.error('Server decryptFields failed:', error);
      throw new Error('Failed to decrypt sensitive fields');
    }

    if (!responseData?.success) {
      console.error('Server decryptFields returned error:', responseData?.error);
      throw new Error(responseData?.error || 'Failed to decrypt sensitive fields');
    }

    return responseData.data as Record<string, unknown>;
  } catch (error) {
    console.error('decryptSensitiveFields failed:', error);
    throw new Error('Failed to decrypt sensitive fields');
  }
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
