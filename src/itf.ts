/**
 * Interleaved 2 of 5 (ITF) barcode encoding
 *
 * @module ITF
 */

/**
 * Representations of each decimal digit (0-9) in ITF encoding
 * Each digit is represented by 5 bars: 1 = narrow, 2 = wide
 */
const DIGIT_WEIGHTS: readonly string[] = [
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
 * Number of bars per digit in ITF encoding
 */
const BARS_PER_DIGIT = 5;

/**
 * ITF barcode markers
 */
const ITFMarkers = {
  /** Start marker pattern for ITF barcode */
  START: '1111',
  /** Stop marker pattern for ITF barcode */
  STOP: '211',
} as const;

/**
 * Converts a pair of digits into their ITF representation and interleaves them
 *
 * @param pair - The digit pair to be interleaved
 * @returns The input pair encoded into its ITF representation
 *
 * @example
 * // Returns "1211212112"
 * interleavePair('01');
 */
function interleavePair(pair: string): string {
  const pairNum = parseInt(pair, 10);
  const black = DIGIT_WEIGHTS[Math.floor(pairNum / 10)];
  const white = DIGIT_WEIGHTS[pairNum % 10];

  let result = '';

  for (let i = 0; i < BARS_PER_DIGIT; i += 1) {
    result += black[i];
    result += white[i];
  }

  return result;
}

/**
 * Encodes a pre-validated even-length digit string into its ITF representation
 *
 * @param number - The even-length digit string to be encoded
 * @returns The input number encoded into its ITF representation
 */
function encodeITF(number: string): string {
  const pairs = number.match(/(..?)/g);
  if (!pairs) {
    return ITFMarkers.START + ITFMarkers.STOP;
  }
  return (
    ITFMarkers.START + pairs.map(interleavePair).join('') + ITFMarkers.STOP
  );
}

/**
 * Encodes a base-10 number into its Interleaved 2 of 5 (ITF) representation
 *
 * @param number - The number to be encoded (must contain digits only)
 * @returns The input number encoded into its ITF representation
 * @throws {TypeError} If the input contains non-digit characters
 *
 * @example
 * // Returns "111121121111222121121112211222111112111122211121122211211"
 * encode('1234567890');
 */
export function encode(number: string): string {
  if (!/^\d+$/.test(number)) {
    throw new TypeError(
      `encode: expected a non-empty string of digits, got "${number}"`,
    );
  }
  const paddedNumber = number.length % 2 !== 0 ? '0' + number : number;
  return encodeITF(paddedNumber);
}
