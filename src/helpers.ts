/**
 * Helper functions for boleto calculations
 *
 * @module helpers
 */

/**
 * Calculates the modulo 11 checksum digit
 *
 * The specifications of the algorithm can be found at
 * https://portal.febraban.org.br/pagina/3166/33/pt-br/layour-arrecadacao
 *
 * @param number - The number to calculate checksum for (string or array of digit strings)
 * @returns The modulo 11 checksum digit
 *
 * @example
 * // Returns 7
 * modulo11('123456789');
 */
export function modulo11(number: string | string[]): number {
  let digits: string[];

  if (typeof number === 'string') {
    digits = number.split('');
  } else {
    digits = [...number];
  }

  digits.reverse();

  let sum = 0;

  for (let i = 0; i < digits.length; i += 1) {
    sum += ((i % 8) + 2) * parseInt(digits[i], 10);
  }

  return (11 - (sum % 11)) % 10 || 1;
}
