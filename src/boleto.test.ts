/**
 * Unit tests for Boleto class
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Boleto, BoletoValidationError } from './boleto.ts';

// Valid bank slip numbers for testing
// Format: 00000.00000 00000.000000 00000.000000 0 00000000000000
// This is a properly calculated valid boleto with correct checksums
const VALID_BOLETO = '23793.38128 86000.000009 00000.000380 1 84660000012345';
const VALID_BOLETO_CLEAN = '23793381288600000000900000000380184660000012345';
// Pre-computed barcode: $1+$5+$2+$3+$4 rearrangement of VALID_BOLETO_CLEAN
const VALID_BOLETO_BARCODE = '23791846600000123453381286000000000000000038';

// Additional valid boleto fixtures for different banks
// Banco do Brasil (001): R$ 500.00, 9000 days after epoch
const BB_BOLETO = '00190000090000000000000000000000890000000050000';
// Itaú Unibanco (341): R$ 99.90, 7500 days after epoch
const ITAU_BOLETO = '34191234546789012345767890123457675000000009990';

describe('BoletoValidationError', () => {
  it('should be an instance of Error', () => {
    const error = new BoletoValidationError('Test error', '12345');
    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct name', () => {
    const error = new BoletoValidationError('Test error', '12345');
    expect(error.name).toBe('BoletoValidationError');
  });

  it('should store the bank slip number', () => {
    const error = new BoletoValidationError('Test error', '12345');
    expect(error.bankSlipNumber).toBe('12345');
  });

  it('should have the correct message', () => {
    const error = new BoletoValidationError('Invalid boleto', '12345');
    expect(error.message).toBe('Invalid boleto');
  });
});

describe('Boleto', () => {
  describe('constructor', () => {
    it('should strip non-digit characters from input', () => {
      const boleto = new Boleto(VALID_BOLETO);
      expect(boleto.bankSlipNumber).toBe(VALID_BOLETO_CLEAN);
    });

    it('should accept clean number input', () => {
      const boleto = new Boleto(VALID_BOLETO_CLEAN);
      expect(boleto.bankSlipNumber).toBe(VALID_BOLETO_CLEAN);
    });

    it('should throw BoletoValidationError for invalid bank slip number', () => {
      expect(
        () => new Boleto('12345678901234567890123456789012345678901234567'),
      ).toThrow(BoletoValidationError);
    });

    it('should throw BoletoValidationError for wrong length', () => {
      expect(() => new Boleto('1234567890')).toThrow(BoletoValidationError);
    });

    it('should include bank slip number in error', () => {
      try {
        new Boleto('1234567890');
      } catch (error) {
        expect(error).toBeInstanceOf(BoletoValidationError);
        expect((error as BoletoValidationError).bankSlipNumber).toBe(
          '1234567890',
        );
      }
    });
  });

  describe('valid', () => {
    it('should return true for valid bank slip number', () => {
      const boleto = new Boleto(VALID_BOLETO);
      expect(boleto.valid()).toBe(true);
    });

    it('should return false for number with wrong length', () => {
      // Create a boleto-like object to test validation directly
      const invalidBoleto = { bankSlipNumber: '1234567890' } as Boleto;
      expect(Boleto.prototype.valid.call(invalidBoleto)).toBe(false);
    });

    it('should return false for correct-length number with wrong checksum', () => {
      // Flip the barcode checksum digit (position 32 in VALID_BOLETO_CLEAN)
      const wrongChecksum =
        VALID_BOLETO_CLEAN.slice(0, 32) +
        ((parseInt(VALID_BOLETO_CLEAN[32], 10) + 1) % 10).toString() +
        VALID_BOLETO_CLEAN.slice(33);
      // Use Object.create so the object inherits barcode() from the prototype
      const invalidBoleto = Object.assign(
        Object.create(Boleto.prototype) as Boleto,
        { bankSlipNumber: wrongChecksum },
      );
      expect(invalidBoleto.valid()).toBe(false);
    });

    it('should return false when barcode checksum digit is 0 (modulo11 never returns 0)', () => {
      // Barcode with '0' at position 4 is always invalid by spec
      // bankSlipNumber length: 4 + 1 + 42 = 47 characters (BANK_SLIP_NUMBER_LENGTH)
      const mockBoleto = Object.assign(
        Object.create(Boleto.prototype) as Boleto,
        {
          bankSlipNumber: '2379' + '0' + '0'.repeat(42), // length 47, checksum = '0'
        },
      );
      expect(mockBoleto.valid()).toBe(false);
    });
  });

  describe('barcode', () => {
    it('should convert bank slip number to barcode format', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const barcode = boleto.barcode();

      // Barcode should be 44 digits
      expect(barcode.length).toBe(44);
      // Barcode should only contain digits
      expect(barcode).toMatch(/^\d+$/);
    });

    it('should rearrange digits according to specification', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const barcode = boleto.barcode();

      // Bank code should be first 3 digits
      expect(barcode.substring(0, 3)).toBe('237');
    });

    it('should produce the known full barcode for VALID_BOLETO', () => {
      const boleto = new Boleto(VALID_BOLETO);
      expect(boleto.barcode()).toBe(VALID_BOLETO_BARCODE);
    });
  });

  describe('number', () => {
    it('should return raw bank slip number', () => {
      const boleto = new Boleto(VALID_BOLETO);
      expect(boleto.number()).toBe(VALID_BOLETO_CLEAN);
    });
  });

  describe('prettyNumber', () => {
    it('should format number with proper mask', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const pretty = boleto.prettyNumber();

      // Should match format: 00000.00000 00000.000000 00000.000000 0 00000000000000
      expect(pretty).toMatch(
        /^\d{5}\.\d{5} \d{5}\.\d{6} \d{5}\.\d{6} \d \d{14}$/,
      );
    });

    it('should produce the expected formatted string', () => {
      const boleto = new Boleto(VALID_BOLETO_CLEAN);
      expect(boleto.prettyNumber()).toBe(
        '23793.38128 86000.000009 00000.000380 1 84660000012345',
      );
    });
  });

  describe('bank', () => {
    it('should return bank name for known bank code', () => {
      const boleto = new Boleto(VALID_BOLETO);
      expect(boleto.bank()).toBe('BCO BRADESCO S.A.'); // Bank code 237
    });

    it('should return "Unknown" for unrecognised bank code', () => {
      // Use a barcode starting with a code not present in BANK_CODES ('999')
      const unknownBankBoleto = {
        barcode: () => '999' + '9'.repeat(41),
      } as unknown as Boleto;
      expect(Boleto.prototype.bank.call(unknownBankBoleto)).toBe('Unknown');
    });

    it('should return correct name for Santander (033)', () => {
      const santanderBoleto = {
        barcode: () => '033' + '9'.repeat(41),
      } as unknown as Boleto;
      expect(Boleto.prototype.bank.call(santanderBoleto)).toBe(
        'BCO SANTANDER (BRASIL) S.A.',
      );
    });

    it('should return correct name for Caixa Econômica Federal (104)', () => {
      const caixaBoleto = {
        barcode: () => '104' + '9'.repeat(41),
      } as unknown as Boleto;
      expect(Boleto.prototype.bank.call(caixaBoleto)).toBe(
        'CAIXA ECONOMICA FEDERAL',
      );
    });

    it('should return correct name for Sicoob (756)', () => {
      const sicoobBoleto = {
        barcode: () => '756' + '9'.repeat(41),
      } as unknown as Boleto;
      expect(Boleto.prototype.bank.call(sicoobBoleto)).toBe('BANCO SICOOB S.A.');
    });
  });

  describe('currency', () => {
    it('should return BRL currency info for currency code 9', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const currency = boleto.currency();

      expect(currency).toEqual({
        code: 'BRL',
        symbol: 'R$',
        decimal: ',',
      });
    });

    it('should return the same object reference for BRL currency', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const currency1 = boleto.currency();
      const currency2 = boleto.currency();

      // Both calls should return the same cached object
      expect(currency1).toBe(currency2);
    });

    it('should return null for unknown currency code', () => {
      // Craft a boleto-like object whose barcode 4th digit is not '9'
      const invalidCurrencyBoleto = {
        barcode: () => '2370' + '0'.repeat(40),
      } as unknown as Boleto;
      expect(Boleto.prototype.currency.call(invalidCurrencyBoleto)).toBeNull();
    });
  });

  describe('checksum', () => {
    it('should return the barcode checksum digit', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const checksum = boleto.checksum();

      expect(checksum).toMatch(/^\d$/);
      expect(checksum).toBe(boleto.barcode()[4]);
    });

    it('should return the known checksum digit for VALID_BOLETO', () => {
      const boleto = new Boleto(VALID_BOLETO);
      // VALID_BOLETO_BARCODE = '23791846600000123453381286000000000000000038'
      // position 4 (0-indexed) = '1'
      expect(boleto.checksum()).toBe('1');
    });
  });

  describe('expirationDate', () => {
    it('should calculate expiration date based on barcode', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const date = boleto.expirationDate();

      expect(date).toBeInstanceOf(Date);
      // The date should be after the epoch (1997-10-07)
      expect(date.getTime()).toBeGreaterThan(876236400000);
    });

    it('should return a valid date object', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const date = boleto.expirationDate();

      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('should compute the correct expiration date', () => {
      const boleto = new Boleto(VALID_BOLETO);
      // barcode days field (positions 5-8): "8466" days after the boleto epoch
      // Boleto epoch = 1997-10-07 12:00:00 GMT-0300 (876236400000 ms)
      const expected = new Date(876236400000 + 8466 * 86400000);
      expect(boleto.expirationDate().toDateString()).toBe(
        expected.toDateString(),
      );
    });

    it('should return the epoch date when days field is 0000', () => {
      // Barcode with positions 5-8 = '0000' → 0 days after epoch
      const mockBoleto = {
        barcode: () => '23791000000000000000000000000000000000000000',
      } as unknown as Boleto;
      const date = Boleto.prototype.expirationDate.call(mockBoleto);
      expect(date.getTime()).toBe(876236400000); // BOLETO_EPOCH
    });

    it('should return 1 day after epoch when days field is 0001', () => {
      // Barcode positions 5-8 = '0001' → 1 day after epoch
      const mockBoleto = {
        barcode: () => '23791000100000000000000000000000000000000000',
      } as unknown as Boleto;
      const date = Boleto.prototype.expirationDate.call(mockBoleto);
      expect(date.getTime()).toBe(876236400000 + 1 * 86400000);
    });

    it('should return correct date when days field is 9999 (maximum)', () => {
      // Barcode positions 5-8 = '9999' → maximum days after epoch
      const mockBoleto = {
        barcode: () => '23791999900000000000000000000000000000000000',
      } as unknown as Boleto;
      const date = Boleto.prototype.expirationDate.call(mockBoleto);
      expect(date.getTime()).toBe(876236400000 + 9999 * 86400000);
    });

    it('should handle a days offset that spans a leap year (Feb 29)', () => {
      // 874 days after 1997-10-07 = 2000-02-29 (leap day)
      const mockBoleto = {
        barcode: () => '237910874000000000000000000000000000000000000',
      } as unknown as Boleto;
      const date = Boleto.prototype.expirationDate.call(mockBoleto);
      const expected = new Date(876236400000 + 874 * 86400000);
      expect(date.toDateString()).toBe(expected.toDateString());
      expect(isNaN(date.getTime())).toBe(false);
    });
  });

  describe('amount', () => {
    it('should return amount with 2 decimal places', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const amount = boleto.amount();

      expect(amount).toMatch(/^\d+\.\d{2}$/);
    });

    it('should correctly parse amount from barcode', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const amount = boleto.amount();

      // Amount is from positions 9-18 of barcode, divided by 100
      expect(parseFloat(amount)).toBeGreaterThanOrEqual(0);
    });

    it('should compute the correct amount', () => {
      const boleto = new Boleto(VALID_BOLETO);
      // barcode amount field (positions 9-18): "0000012345" → 123.45
      expect(boleto.amount()).toBe('123.45');
    });

    it('should return "0.00" for a zero-amount boleto', () => {
      // Barcode with positions 9-18 = '0000000000' → amount 0
      const mockBoleto = {
        barcode: () => '23791000000000000000000000000000000000000000',
      } as unknown as Boleto;
      expect(Boleto.prototype.amount.call(mockBoleto)).toBe('0.00');
    });

    it('should return the maximum amount correctly (99999999.99)', () => {
      // Barcode positions 9-18 = '9999999999' → 99999999.99
      const mockBoleto = {
        barcode: () => '237910000999999999900000000000000000000000000',
      } as unknown as Boleto;
      expect(Boleto.prototype.amount.call(mockBoleto)).toBe('99999999.99');
    });

    it('should return "0.01" for a one-cent amount', () => {
      // Barcode positions 9-18 = '0000000001' → 0.01
      const mockBoleto = {
        barcode: () => '23791000000000000010000000000000000000000000',
      } as unknown as Boleto;
      expect(Boleto.prototype.amount.call(mockBoleto)).toBe('0.01');
    });
  });

  describe('prettyAmount', () => {
    it('should return formatted amount with BRL symbol', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const prettyAmount = boleto.prettyAmount();

      expect(prettyAmount).toContain('R$');
      expect(prettyAmount).toContain(',');
    });

    it('should format BRL amount as "R$ 123,45"', () => {
      const boleto = new Boleto(VALID_BOLETO);
      expect(boleto.prettyAmount()).toBe('R$ 123,45');
    });

    it('should return plain amount when currency is null', () => {
      const mockBoleto = {
        currency: () => null,
        amount: () => '123.45',
      } as unknown as Boleto;
      expect(Boleto.prototype.prettyAmount.call(mockBoleto)).toBe('123.45');
    });
  });

  describe('barcodeData', () => {
    it('should return structured barcode data', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const data = boleto.barcodeData();

      expect(data.stripes).toBeDefined();
      expect(Array.isArray(data.stripes)).toBe(true);
      expect(data.stripes.length).toBeGreaterThan(0);
      expect(data.viewBoxWidth).toBeGreaterThan(0);
      expect(data.viewBoxHeight).toBe(100);
    });

    it('should return stripes with correct properties', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const data = boleto.barcodeData();

      const firstStripe = data.stripes[0];
      expect(firstStripe).toHaveProperty('x');
      expect(firstStripe).toHaveProperty('width');
      expect(firstStripe).toHaveProperty('height');
      expect(firstStripe).toHaveProperty('color');
      expect(firstStripe.x).toBe(0);
      expect(firstStripe.height).toBe(100);
    });

    it('should alternate colors between black and white', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const data = boleto.barcodeData();

      expect(data.stripes[0].color).toBe('#000000');
      expect(data.stripes[1].color).toBe('#ffffff');
      expect(data.stripes[2].color).toBe('#000000');
    });
  });

  describe('toSVG', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should return SVG string when no selector is provided', () => {
      const boleto = new Boleto(VALID_BOLETO);
      const result = boleto.toSVG();

      expect(result).not.toBeNull();
      expect(result).toContain('<svg');
      expect(result).toContain('<rect');
    });

    it('should append SVG to DOM when selector is provided', () => {
      document.body.innerHTML = '<div id="barcode"></div>';
      const boleto = new Boleto(VALID_BOLETO);
      const result = boleto.toSVG('#barcode');

      expect(result).toBeNull();
      const container = document.querySelector('#barcode');
      expect(container?.querySelector('svg')).not.toBeNull();
    });

    it('should set correct attributes on the SVG element appended to DOM', () => {
      document.body.innerHTML = '<div id="barcode"></div>';
      const boleto = new Boleto(VALID_BOLETO);
      boleto.toSVG('#barcode');

      const container = document.querySelector('#barcode')!;
      const svgEl = container.querySelector('svg')!;

      expect(svgEl.getAttribute('width')).toBe('100%');
      expect(svgEl.getAttribute('height')).toBe('100%');

      const rects = svgEl.querySelectorAll('rect');
      expect(rects.length).toBeGreaterThan(0);
      expect(rects[0].getAttribute('fill')).toBe('#000000');
      expect(rects[0].getAttribute('height')).toBe('100');
      expect(rects[0].getAttribute('y')).toBe('0');
      expect(rects[1].getAttribute('fill')).toBe('#ffffff');
    });

    it('should throw when selector does not match any element', () => {
      const boleto = new Boleto(VALID_BOLETO);
      expect(() => boleto.toSVG('#nonexistent')).toThrow(
        'SVG render target not found: "#nonexistent"',
      );
    });
  });

  describe('additional bank fixtures', () => {
    it('should correctly parse a Banco do Brasil (001) boleto', () => {
      const boleto = new Boleto(BB_BOLETO);

      expect(boleto.valid()).toBe(true);
      expect(boleto.bank()).toBe('BCO DO BRASIL S.A.');
      expect(boleto.amount()).toBe('500.00');
      expect(boleto.prettyAmount()).toBe('R$ 500,00');
    });

    it('should correctly parse an Itaú Unibanco (341) boleto', () => {
      const boleto = new Boleto(ITAU_BOLETO);

      expect(boleto.valid()).toBe(true);
      expect(boleto.bank()).toBe('ITAÚ UNIBANCO S.A.');
      expect(boleto.amount()).toBe('99.90');
      expect(boleto.prettyAmount()).toBe('R$ 99,90');
    });

    it('should have a different expiration date than Bradesco boleto', () => {
      const bbBoleto = new Boleto(BB_BOLETO);
      const bradescoBoleto = new Boleto(VALID_BOLETO);

      expect(bbBoleto.expirationDate().getTime()).not.toBe(
        bradescoBoleto.expirationDate().getTime(),
      );
    });
  });
});
