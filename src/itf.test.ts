/**
 * Unit tests for ITF (Interleaved 2 of 5) barcode encoding module
 */

import { describe, it, expect } from 'vitest';
import { encode } from './itf.ts';

describe('encode', () => {
  it('should encode "01" correctly', () => {
    // For pair "01": black = WEIGHTS[0] = '11221', white = WEIGHTS[1] = '21112'
    // Interleaved: '1211212112'
    expect(encode('01')).toBe('1111' + '1211212112' + '211');
  });

  it('should encode "00" correctly', () => {
    // For pair "00": black = WEIGHTS[0] = '11221', white = WEIGHTS[0] = '11221'
    // Interleaved: '1111222211'
    expect(encode('00')).toBe('1111' + '1111222211' + '211');
  });

  it('should encode "99" correctly', () => {
    // For pair "99": black = WEIGHTS[9] = '12121', white = WEIGHTS[9] = '12121'
    // Interleaved: '1122112211'
    expect(encode('99')).toBe('1111' + '1122112211' + '211');
  });

  it('should encode multiple pairs', () => {
    const result = encode('0123');
    // START = '1111'
    // pair "01": '1211212112'
    // pair "23": black = WEIGHTS[2] = '12112', white = WEIGHTS[3] = '22111'
    //            Interleaved: '1222111121'
    // STOP = '211'
    expect(result).toBe('1111' + '1211212112' + '1222111121' + '211');
  });

  it('should handle empty string', () => {
    expect(encode('')).toBe('1111211');
  });

  it('should encode a typical barcode number', () => {
    // A real barcode example
    const barcode = '23791846600001234563381286000000000000000381';
    const result = encode(barcode);

    // Should start with START pattern
    expect(result.startsWith('1111')).toBe(true);
    // Should end with STOP pattern
    expect(result.endsWith('211')).toBe(true);
    // Result should be a string of 1s and 2s
    expect(result).toMatch(/^[12]+$/);
  });

  it('should produce correct length output', () => {
    // For n pairs: START(4) + n * 10 (each pair produces 10 characters) + STOP(3)
    // For 22 pairs (44 digits): 4 + 22 * 10 + 3 = 227
    const barcode = '23791846600001234563381286000000000000000381'; // 44 digits = 22 pairs
    const result = encode(barcode);
    expect(result.length).toBe(4 + 22 * 10 + 3);
  });

  it('should handle single digit (odd length)', () => {
    // When there's an odd number of digits, the regex will match '.' which is a single char
    // pair "5": parseInt('5') = 5, Math.floor(5/10) = 0, 5 % 10 = 5
    // black = WEIGHTS[0] = '11221', white = WEIGHTS[5] = '21211'
    // Interleaved: '1211222111'
    const result = encode('5');
    expect(result).toBe('1111' + '1211222111' + '211');
  });
});
