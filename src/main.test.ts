/**
 * Unit tests for main module exports
 */

import { describe, it, expect } from 'vitest';
import {
  Boleto,
  BoletoValidationError,
  SVG,
  encode,
  modulo11,
} from './main.ts';
import type { Currency, BarcodeStripe, BarcodeData } from './main.ts';

describe('main exports', () => {
  it('should export Boleto class', () => {
    expect(Boleto).toBeDefined();
    expect(typeof Boleto).toBe('function');
  });

  it('should export BoletoValidationError class', () => {
    expect(BoletoValidationError).toBeDefined();
    expect(typeof BoletoValidationError).toBe('function');
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
      decimal: ',',
    };
    expect(currency.code).toBe('BRL');
  });

  it('should allow using BarcodeStripe type', () => {
    const stripe: BarcodeStripe = {
      x: 0,
      width: 4,
      height: 100,
      color: '#000000',
    };
    expect(stripe.x).toBe(0);
    expect(stripe.width).toBe(4);
  });

  it('should allow using BarcodeData type', () => {
    const data: BarcodeData = {
      stripes: [{ x: 0, width: 4, height: 100, color: '#000000' }],
      viewBoxWidth: 4,
      viewBoxHeight: 100,
    };
    expect(data.stripes).toHaveLength(1);
    expect(data.viewBoxWidth).toBe(4);
  });
});

describe('public API integration', () => {
  const VALID = '23793.38128 86000.000009 00000.000380 1 84660000012345';

  it('full Boleto lifecycle through public API', () => {
    const boleto = new Boleto(VALID);
    expect(boleto.valid()).toBe(true);
    expect(boleto.bank()).toBe('BCO BRADESCO S.A.');
    expect(boleto.amount()).toBe('123.45');
    expect(boleto.prettyAmount()).toBe('R$ 123,45');
    expect(boleto.prettyNumber()).toBe(VALID);
    expect(boleto.checksum()).toBe('1');
    expect(boleto.expirationDate()).toBeInstanceOf(Date);
  });

  it('encode and modulo11 round-trip via public API', () => {
    const boleto = new Boleto(VALID);
    const barcode = boleto.barcode();
    const encoded = encode(barcode);
    expect(encoded).toMatch(/^[12]+$/);

    const barcodeDigits = barcode.split('');
    barcodeDigits.splice(4, 1); // remove checksum
    expect(modulo11(barcodeDigits).toString()).toBe(boleto.checksum());
  });

  it('barcodeData returns renderable data through public API', () => {
    const boleto = new Boleto(VALID);
    const data = boleto.barcodeData();
    expect(data.stripes.length).toBeGreaterThan(0);
    expect(data.viewBoxWidth).toBeGreaterThan(0);
    expect(data.viewBoxHeight).toBe(100);
  });

  it('SVG.render and toSVGString produce identical output via public API', () => {
    const stripes = encode(new Boleto(VALID).barcode());
    const svg = new SVG(stripes);
    expect(svg.render()).toBe(svg.toSVGString());
  });
});
