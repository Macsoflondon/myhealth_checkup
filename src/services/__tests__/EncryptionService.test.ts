import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the encryption key environment variable
const mockEncryptionKey = 'test-encryption-key-for-unit-tests-32chars';
vi.stubEnv('VITE_ENCRYPTION_KEY', mockEncryptionKey);

// Use vi.hoisted so the mock fn is available when vi.mock is hoisted
const { mockFunctionsInvoke } = vi.hoisted(() => {
  function mockEncrypt(value: string): string {
    if (!value) return value;
    return `enc:${Buffer.from(value).toString('base64')}`;
  }
  function mockDecrypt(value: string): string {
    if (!value || !value.startsWith('enc:')) return value;
    return Buffer.from(value.slice(4), 'base64').toString('utf-8');
  }

  const mockFunctionsInvoke = vi.fn().mockImplementation(async (_name: string, options: { body: { action: string; data: unknown; fields?: readonly string[] } }) => {
    const { action, data, fields } = options.body;
    if (action === 'encrypt') {
      return { data: { success: true, data: mockEncrypt(data as string) }, error: null };
    }
    if (action === 'decrypt') {
      return { data: { success: true, data: mockDecrypt(data as string) }, error: null };
    }
    if (action === 'encryptFields') {
      const result = { ...(data as Record<string, unknown>) };
      for (const field of (fields || [])) {
        if (result[field] && typeof result[field] === 'string') {
          result[field] = mockEncrypt(result[field] as string);
        } else if (result[field] && Array.isArray(result[field])) {
          result[field] = mockEncrypt(JSON.stringify(result[field]));
        }
      }
      return { data: { success: true, data: result }, error: null };
    }
    if (action === 'decryptFields') {
      const result = { ...(data as Record<string, unknown>) };
      for (const field of (fields || [])) {
        if (result[field] && typeof result[field] === 'string' && (result[field] as string).startsWith('enc:')) {
          const decrypted = mockDecrypt(result[field] as string);
          try { result[field] = JSON.parse(decrypted); } catch { result[field] = decrypted; }
        }
      }
      return { data: { success: true, data: result }, error: null };
    }
    return { data: { success: false, error: 'Unknown action' }, error: null };
  });

  return { mockFunctionsInvoke };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: mockFunctionsInvoke,
    },
  },
}));

// Import after mocking
import {
  encryptField,
  decryptField,
  encryptArray,
  decryptArray,
  encryptSensitiveFields,
  decryptSensitiveFields,
  isEncrypted,
  SENSITIVE_USER_PROFILE_FIELDS,
} from '../EncryptionService';

describe('EncryptionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    it('should produce different output for different input', async () => {
      const encrypted1 = await encryptField('text-one');
      const encrypted2 = await encryptField('text-two');
      
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
        phone_number: '+447123456789',
        email: 'john@example.com',
      };

      const encrypted = await encryptSensitiveFields(userData, SENSITIVE_USER_PROFILE_FIELDS);

      // Non-sensitive fields should remain unchanged
      expect(encrypted.id).toBe('123');
      expect(encrypted.first_name).toBe('John');
      expect(encrypted.email).toBe('john@example.com');

      // Sensitive fields should be encrypted
      expect(encrypted.phone_number).toMatch(/^enc:/);
    });

    it('should decrypt encrypted fields correctly', async () => {
      const original = {
        id: '123',
        phone_number: '+447123456789',
        date_of_birth: '1990-01-15',
      };

      const encrypted = await encryptSensitiveFields(original, SENSITIVE_USER_PROFILE_FIELDS);
      const decrypted = await decryptSensitiveFields(encrypted, SENSITIVE_USER_PROFILE_FIELDS);

      expect(decrypted.id).toBe('123');
      expect(decrypted.phone_number).toBe('+447123456789');
      expect(decrypted.date_of_birth).toBe('1990-01-15');
    });

    it('should handle null/undefined values gracefully', async () => {
      const userData = {
        id: '123',
        phone_number: null,
        date_of_birth: undefined,
      };

      const encrypted = await encryptSensitiveFields(userData, SENSITIVE_USER_PROFILE_FIELDS);
      expect(encrypted.phone_number).toBe(null);
      expect(encrypted.date_of_birth).toBe(undefined);
    });
  });
});
