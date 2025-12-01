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
 * Regex pattern to split number into digit pairs
 */
const DIGIT_PAIR_PATTERN = /(..?)/g;

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
 * ITF Barcode Encoder
 *
 * Encapsulates the logic for encoding numbers into Interleaved 2 of 5 format.
 */
class ITFEncoder {
  /**
   * Converts a pair of digits into their ITF representation and interleaves them
   *
   * @param pair - The digit pair to be interleaved
   * @returns The input pair encoded into its ITF representation
   *
   * @example
   * // Returns "1211212112"
   * ITFEncoder.interleavePair('01');
   */
  static interleavePair(pair: string): string {
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
   * Encodes a base-10 number into its Interleaved 2 of 5 (ITF) representation
   *
   * @param number - The number to be encoded
   * @returns The input number encoded into its ITF representation
   *
   * @example
   * // Returns "111121121111222121121112211222111112111122211121122211211"
   * ITFEncoder.encode('1234567890');
   */
  static encode(number: string): string {
    const pairs = number.match(DIGIT_PAIR_PATTERN);
    if (!pairs) {
      return ITFMarkers.START + ITFMarkers.STOP;
    }
    return (
      ITFMarkers.START +
      pairs.map(ITFEncoder.interleavePair).join('') +
      ITFMarkers.STOP
    );
  }
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
  return ITFEncoder.encode(number);
}
