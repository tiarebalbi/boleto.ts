/**
 * Unit tests for main module exports
 */

import { describe, it, expect } from 'vitest';
import { Boleto, SVG, encode, modulo11 } from './main.ts';
import type { Currency } from './main.ts';

describe('main exports', () => {
  it('should export Boleto class', () => {
    expect(Boleto).toBeDefined();
    expect(typeof Boleto).toBe('function');
  });

  it('should export SVG class', () => {
    expect(SVG).toBeDefined();
    expect(typeof SVG).toBe('function');
  });

  it('should export encode function', () => {
    expect(encode).toBeDefined();
    expect(typeof encode).toBe('function');
  });

  it('should export modulo11 function', () => {
    expect(modulo11).toBeDefined();
    expect(typeof modulo11).toBe('function');
  });

  it('should allow using Currency type', () => {
    const currency: Currency = {
      code: 'BRL',
      symbol: 'R$',
      decimal: ','
    };
    expect(currency.code).toBe('BRL');
  });
});
