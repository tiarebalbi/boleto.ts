/**
 * Boleto (Brazilian Bank Slip) Parser and Renderer
 *
 * @module Boleto
 */

import { SVG } from './svg.ts';
import { encode } from './itf.ts';
import { modulo11 } from './helpers.ts';

/**
 * Currency information returned by the currency method
 */
export interface Currency {
  /** ISO 4217 currency code */
  code: string;
  /** Currency symbol */
  symbol: string;
  /** Decimal separator character */
  decimal: string;
}

/**
 * Bank codes and their corresponding names
 */
const BANK_CODES: Record<string, string> = {
  '001': 'Banco do Brasil',
  '007': 'BNDES',
  '033': 'Santander',
  '069': 'Crefisa',
  '077': 'Banco Inter',
  '102': 'XP Investimentos',
  '104': 'Caixa Econômica Federal',
  '140': 'Easynvest',
  '197': 'Stone',
  '208': 'BTG Pactual',
  '212': 'Banco Original',
  '237': 'Bradesco',
  '260': 'Nu Pagamentos',
  '341': 'Itaú',
  '389': 'Banco Mercantil do Brasil',
  '422': 'Banco Safra',
  '505': 'Credit Suisse',
  '633': 'Banco Rendimento',
  '652': 'Itaú Unibanco',
  '735': 'Banco Neon',
  '739': 'Banco Cetelem',
  '745': 'Citibank',
};

/**
 * Boleto class for parsing and rendering Brazilian bank payment slips
 */
export class Boleto {
  /**
   * The raw bank slip number (digits only)
   */
  readonly bankSlipNumber: string;

  /**
   * Initializes the Boleto class
   *
   * @param bankSlipNumber - The bank slip number (can include non-digit characters which will be stripped)
   * @throws Error if the bank slip number is invalid
   */
  constructor(bankSlipNumber: string) {
    this.bankSlipNumber = bankSlipNumber.replace(/[^\d]/g, '');

    if (!this.valid()) {
      throw new Error('Invalid bank slip number');
    }
  }

  /**
   * Validates whether the bank slip number is valid or not
   *
   * The validation function ensures that the bank slip number is exactly 47
   * characters long, then applies the modulo-11 algorithm to the bank slip's
   * barcode. Finally, it verifies that the result of the algorithm equals the
   * checksum digit from the bank slip number.
   *
   * @returns Whether the bank slip number is valid or not
   */
  valid(): boolean {
    if (this.bankSlipNumber.length !== 47) return false;

    const barcodeDigits = this.barcode().split('');
    const checksum = barcodeDigits.splice(4, 1);

    return modulo11(barcodeDigits).toString() === checksum.toString();
  }

  /**
   * Converts the printed bank slip number into the barcode number
   *
   * The bank slip's number is a rearrangement of its barcode, plus three
   * checksum digits. This function executes the inverse process and returns the
   * original arrangement of the code. Specifications can be found at
   * https://portal.febraban.org.br/pagina/3166/33/pt-br/layour-arrecadacao
   *
   * @returns The barcode extracted from the bank slip number
   */
  barcode(): string {
    return this.bankSlipNumber.replace(
      /^(\d{4})(\d{5})\d{1}(\d{10})\d{1}(\d{10})\d{1}(\d{15})$/,
      '$1$5$2$3$4'
    );
  }

  /**
   * Returns the bank slip's raw number
   *
   * @returns The raw bank slip number
   */
  number(): string {
    return this.bankSlipNumber;
  }

  /**
   * Returns the bank slip number with the usual, easy-to-read mask:
   * 00000.00000 00000.000000 00000.000000 0 00000000000000
   *
   * @returns The formatted bank slip number
   */
  prettyNumber(): string {
    return this.bankSlipNumber.replace(
      /^(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})$/,
      '$1.$2 $3.$4 $5.$6 $7 $8'
    );
  }

  /**
   * Returns the name of the bank that issued the bank slip
   *
   * This function is able to identify the most popular or commonly used banks
   * in Brazil, but not all of them are included here.
   *
   * A comprehensive list of all Brazilian banks and their codes can be found at
   * http://www.buscabanco.org.br/AgenciasBancos.asp
   *
   * @returns The bank name
   */
  bank(): string {
    const bankCode = this.barcode().substring(0, 3);
    return BANK_CODES[bankCode] ?? 'Unknown';
  }

  /**
   * Returns the currency of the bank slip
   *
   * The currency is determined by the currency code, the fourth digit of the
   * barcode. A list of values other than 9 (Brazilian Real) could not be found.
   *
   * @returns The currency object or 'Unknown' string
   */
  currency(): Currency | 'Unknown' {
    const currencyCode = this.barcode()[3];
    if (currencyCode === '9') {
      return { code: 'BRL', symbol: 'R$', decimal: ',' };
    }
    return 'Unknown';
  }

  /**
   * Returns the verification digit of the barcode
   *
   * The barcode has its own checksum digit, which is the fifth digit of itself.
   *
   * @returns The checksum of the barcode
   */
  checksum(): string {
    return this.barcode()[4];
  }

  /**
   * Returns the date when the bank slip is due
   *
   * The portion of the barcode ranging from its sixth to its ninth digits
   * represent the number of days since the 7th of October, 1997 up to when the
   * bank slip is good to be paid. Attempting to pay a bank slip after this date
   * may incur extra fees.
   *
   * @returns The expiration date of the bank slip
   */
  expirationDate(): Date {
    const refDate = new Date(876236400000); // 1997-10-07 12:00:00 GMT-0300
    const days = parseInt(this.barcode().substring(5, 9), 10);

    return new Date(refDate.getTime() + days * 86400000);
  }

  /**
   * Returns the bank slip's nominal amount
   *
   * @returns The bank slip's raw amount as a string with 2 decimal places
   */
  amount(): string {
    const amountStr = this.barcode().substring(9, 19);
    return (parseInt(amountStr, 10) / 100.0).toFixed(2);
  }

  /**
   * Returns the bank slip's formatted nominal amount
   *
   * @returns The bank slip's formatted amount with currency symbol
   */
  prettyAmount(): string {
    const currencyResult = this.currency();

    if (currencyResult === 'Unknown') {
      return this.amount();
    }

    return `${currencyResult.symbol} ${this.amount().replace('.', currencyResult.decimal)}`;
  }

  /**
   * Renders the bank slip as a child of the provided selector
   *
   * @param selector - The selector to the object where the SVG must be appended.
   *                   If omitted, returns the SVG as a string.
   * @returns null if selector is provided (SVG is appended to DOM), otherwise returns SVG string
   *
   * @see {@link SVG.render}
   */
  toSVG(selector?: string): string | null {
    const stripes = encode(this.barcode());
    return new SVG(stripes).render(selector);
  }
}
