import { describe, it, expect } from 'vitest';
import { getRandomPrice } from './getRandomPrice';

describe('getRandomPrice', () => {
  it('returns a value between 95% and 105% of the base price', () => {
    const basePrice = 100;

    for (let i = 0; i < 50; i++) {
      const price = getRandomPrice(basePrice);
      expect(price).toBeGreaterThanOrEqual(basePrice * 0.95);
      expect(price).toBeLessThanOrEqual(basePrice * 1.05);
    }
  });
});
