import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the encryption key environment variable
const mockEncryptionKey = 'test-encryption-key-for-unit-tests-32chars';

vi.stubEnv('VITE_ENCRYPTION_KEY', mockEncryptionKey);

// Import after mocking
import {
  encryptField,
  decryptField,
  encryptArray,
  decryptArray,
  encryptSensitiveFields,
  decryptSensitiveFields,
  encryptWearableTokens,
  decryptWearableTokens,
  isEncrypted,
  SENSITIVE_USER_PROFILE_FIELDS,
  SENSITIVE_WEARABLE_FIELDS,
} from '../EncryptionService';

describe('EncryptionService', () => {
  describe('encryptField', () => {
    it('should return null/empty for null or empty input', async () => {
      expect(await encryptField('')).toBe('');
      expect(await encryptField(null as unknown as string)).toBe(null);
    });

    it('should encrypt a string and produce enc: prefix', async () => {
      const plaintext = 'sensitive-data-12345';
      const encrypted = await encryptField(plaintext);
      
      expect(encrypted).toMatch(/^enc:/);
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted.length).toBeGreaterThan(plaintext.length);
    });

    it('should produce different ciphertext for same plaintext (random IV)', async () => {
      const plaintext = 'same-text';
      const encrypted1 = await encryptField(plaintext);
      const encrypted2 = await encryptField(plaintext);
      
      // Both should be encrypted but with different IVs
      expect(encrypted1).toMatch(/^enc:/);
      expect(encrypted2).toMatch(/^enc:/);
      expect(encrypted1).not.toBe(encrypted2);
    });
  });

  describe('decryptField', () => {
    it('should return null/empty for null or empty input', async () => {
      expect(await decryptField('')).toBe('');
      expect(await decryptField(null as unknown as string)).toBe(null);
    });

    it('should return non-encrypted values as-is', async () => {
      const plaintext = 'not-encrypted-value';
      const result = await decryptField(plaintext);
      
      expect(result).toBe(plaintext);
    });

    it('should correctly decrypt an encrypted value', async () => {
      const original = 'my-secret-data-NHS1234567890';
      const encrypted = await encryptField(original);
      const decrypted = await decryptField(encrypted);
      
      expect(decrypted).toBe(original);
    });

    it('should handle special characters in data', async () => {
      const original = 'Test with special chars: £€¥ & <script>alert("xss")</script>';
      const encrypted = await encryptField(original);
      const decrypted = await decryptField(encrypted);
      
      expect(decrypted).toBe(original);
    });

    it('should handle unicode data', async () => {
      const original = '健康データ 🏥 αβγδ';
      const encrypted = await encryptField(original);
      const decrypted = await decryptField(encrypted);
      
      expect(decrypted).toBe(original);
    });
  });

  describe('encryptArray / decryptArray', () => {
    it('should return null for null or empty array', async () => {
      expect(await encryptArray(null)).toBe(null);
      expect(await encryptArray([])).toBe(null);
    });

    it('should encrypt and decrypt an array correctly', async () => {
      const original = ['diabetes', 'hypertension', 'asthma'];
      const encrypted = await encryptArray(original);
      
      expect(encrypted).toMatch(/^enc:/);
      
      const decrypted = await decryptArray(encrypted);
      expect(decrypted).toEqual(original);
    });
  });

  describe('isEncrypted', () => {
    it('should return true for encrypted values', () => {
      expect(isEncrypted('enc:abc123...')).toBe(true);
    });

    it('should return false for non-encrypted values', () => {
      expect(isEncrypted('plain-text')).toBe(false);
      expect(isEncrypted('')).toBe(false);
      expect(isEncrypted(null)).toBe(false);
      expect(isEncrypted(undefined)).toBe(false);
    });
  });

  describe('encryptSensitiveFields / decryptSensitiveFields', () => {
    it('should encrypt only specified sensitive fields', async () => {
      const userData = {
        id: '123',
        first_name: 'John',
        last_name: 'Doe',
        nhs_number: 'NHS123456789',
        health_conditions: ['diabetes', 'asthma'],
        email: 'john@example.com',
      };

      const encrypted = await encryptSensitiveFields(userData, SENSITIVE_USER_PROFILE_FIELDS);

      // Non-sensitive fields should remain unchanged
      expect(encrypted.id).toBe('123');
      expect(encrypted.first_name).toBe('John');
      expect(encrypted.email).toBe('john@example.com');

      // Sensitive fields should be encrypted
      expect(encrypted.nhs_number).toMatch(/^enc:/);
      expect(encrypted.health_conditions).toMatch(/^enc:/);
    });

    it('should decrypt encrypted fields correctly', async () => {
      const original = {
        id: '123',
        nhs_number: 'NHS123456789',
        health_conditions: ['diabetes'],
        allergies: ['penicillin'],
      };

      const encrypted = await encryptSensitiveFields(original, SENSITIVE_USER_PROFILE_FIELDS);
      const decrypted = await decryptSensitiveFields(encrypted, SENSITIVE_USER_PROFILE_FIELDS);

      expect(decrypted.id).toBe('123');
      expect(decrypted.nhs_number).toBe('NHS123456789');
      expect(decrypted.health_conditions).toEqual(['diabetes']);
      expect(decrypted.allergies).toEqual(['penicillin']);
    });

    it('should handle null/undefined values gracefully', async () => {
      const userData = {
        id: '123',
        nhs_number: null,
        health_conditions: undefined,
      };

      const encrypted = await encryptSensitiveFields(userData, SENSITIVE_USER_PROFILE_FIELDS);
      expect(encrypted.nhs_number).toBe(null);
      expect(encrypted.health_conditions).toBe(undefined);
    });
  });

  describe('encryptWearableTokens / decryptWearableTokens', () => {
    it('should encrypt OAuth tokens', async () => {
      const connection = {
        id: '123',
        provider: 'fitbit',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'refresh_token_value_here',
        is_active: true,
      };

      const encrypted = await encryptWearableTokens(connection);

      expect(encrypted.id).toBe('123');
      expect(encrypted.provider).toBe('fitbit');
      expect(encrypted.is_active).toBe(true);
      expect(encrypted.access_token).toMatch(/^enc:/);
      expect(encrypted.refresh_token).toMatch(/^enc:/);
    });

    it('should decrypt OAuth tokens correctly', async () => {
      const original = {
        access_token: 'access_12345',
        refresh_token: 'refresh_67890',
      };

      const encrypted = await encryptWearableTokens(original);
      const decrypted = await decryptWearableTokens(encrypted);

      expect(decrypted.access_token).toBe('access_12345');
      expect(decrypted.refresh_token).toBe('refresh_67890');
    });
  });

  describe('Round-trip encryption', () => {
    it('should correctly round-trip user profile data', async () => {
      const profile = {
        id: 'user-123',
        user_id: 'auth-456',
        first_name: 'Jane',
        last_name: 'Smith',
        nhs_number: 'NHS9876543210',
        health_conditions: ['type-2-diabetes', 'high-cholesterol'],
        allergies: ['sulfa', 'latex'],
        medications: ['metformin', 'atorvastatin'],
        emergency_contact_name: 'John Smith',
        emergency_contact_phone: '+44 7700 900123',
        date_of_birth: '1985-03-15',
      };

      const encrypted = await encryptSensitiveFields(profile, SENSITIVE_USER_PROFILE_FIELDS);
      const decrypted = await decryptSensitiveFields(encrypted, SENSITIVE_USER_PROFILE_FIELDS);

      expect(decrypted).toEqual(profile);
    });

    it('should correctly round-trip wearable connection data', async () => {
      const connection = {
        id: 'conn-123',
        user_id: 'user-456',
        provider: 'apple-health',
        access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0',
        refresh_token: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4gdGhhdCBpcyByZWFsbHkgbG9uZw==',
        is_active: true,
        connected_at: '2024-01-15T10:30:00Z',
      };

      const encrypted = await encryptWearableTokens(connection);
      const decrypted = await decryptWearableTokens(encrypted);

      expect(decrypted).toEqual(connection);
    });
  });
});
