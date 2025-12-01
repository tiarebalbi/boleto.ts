/**
 * Interleaved 2 of 5 (ITF) barcode encoding
 *
 * @module ITF
 */

/**
 * Representations of each decimal digit
 */
const WEIGHTS: readonly string[] = [
  '11221', // 0
  '21112', // 1
  '12112', // 2
  '22111', // 3
  '11212', // 4
  '21211', // 5
  '12211', // 6
  '11122', // 7
  '21121', // 8
  '12121', // 9
];

/**
 * Representation of Start portion of the barcode
 */
const START = '1111';

/**
 * Representation of Stop portion of the barcode
 */
const STOP = '211';

/**
 * Converts a pair of digits into their ITF representation and interleave them
 *
 * @param pair - The pair to be interleaved
 * @returns The input pair encoded into its ITF representation
 *
 * @example
 * // Returns "1211212112"
 * interleavePair('01');
 */
function interleavePair(pair: string): string {
  const pairNum = parseInt(pair, 10);
  const black = WEIGHTS[Math.floor(pairNum / 10)];
  const white = WEIGHTS[pairNum % 10];

  let result = '';

  for (let i = 0; i < 5; i += 1) {
    result += black[i];
    result += white[i];
  }

  return result;
}

/**
 * Encodes a base-10 number into its Interleaved 2 of 5 (ITF) representation
 *
 * @param number - The number to be encoded
 * @returns The input number encoded into its ITF representation
 *
 * @example
 * // Returns "111121121111222121121112211222111112111122211121122211211"
 * encode('1234567890');
 */
export function encode(number: string): string {
  const pairs = number.match(/(..?)/g);
  if (!pairs) {
    return START + STOP;
  }
  return START + pairs.map(interleavePair).join('') + STOP;
}
