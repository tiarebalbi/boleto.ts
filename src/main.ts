/**
 * boleto.ts
 *
 * A TypeScript library for parsing and rendering Brazilian bank payment slips (boletos bancários).
 *
 * @packageDocumentation
 */

export { Boleto, BoletoValidationError } from './boleto.js';
export type { Currency } from './boleto.js';
export { SVG } from './svg.js';
export type { BarcodeStripe, BarcodeData } from './svg.js';
export { encode } from './itf.js';
export { modulo11 } from './helpers.js';
