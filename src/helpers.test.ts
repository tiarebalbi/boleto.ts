/**
 * Unit tests for helpers module
 */

import { describe, it, expect } from 'vitest';
import { modulo11 } from './helpers.ts';

describe('modulo11', () => {
  it('should calculate correct checksum for string input', () => {
    // Test with example from bank slip number verification
    expect(modulo11('123456789')).toBe(7);
  });

  it('should calculate correct checksum for array input', () => {
    expect(modulo11(['1', '2', '3', '4', '5', '6', '7', '8', '9'])).toBe(7);
  });

  it('should return 1 when result would be 0 or 10', () => {
    // When (11 - (sum % 11)) % 10 equals 0, it should return 1
    // This is a specific rule for boleto validation
    expect(modulo11('0')).toBe(1);
  });

  it('should handle single digit input', () => {
    expect(modulo11('5')).toBe(1);
  });

  it('should handle barcode validation', () => {
    // Sample barcode without checksum digit (positions 0-3 and 5-43)
    // Barcode: 23791846600000123453381286000000000000000038
    // Without checksum at position 4: 2379846600000123453381286000000000000000038
    const barcodeWithoutChecksum = '2379846600000123453381286000000000000000038';
    expect(modulo11(barcodeWithoutChecksum)).toBe(1);
  });

  it('should apply weights correctly in sequence', () => {
    // The algorithm applies weights 2-9 in sequence, resetting after 9
    // For a longer number, verify the calculation
    expect(modulo11('12345678901234')).toBe(1);
  });

  it('should handle empty string', () => {
    expect(modulo11('')).toBe(1);
  });

  it('should handle empty array', () => {
    expect(modulo11([])).toBe(1);
  });
});
