/**
 * SVG rendering for barcode stripes
 *
 * @module SVG
 */

/**
 * SVG namespace URI for creating SVG elements
 */
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * Default stripe width in pixels
 */
const DEFAULT_STRIPE_WIDTH = 4;

/**
 * Default barcode height in pixels
 */
const DEFAULT_BARCODE_HEIGHT = 100;

/**
 * Barcode colors for alternating stripes
 */
const BarcodeColors = {
  BLACK: '#000000',
  WHITE: '#ffffff',
} as const;

/**
 * SVG Renderer for barcode stripes
 */
export class SVG {
  /**
   * The list of stripes (weights) to be drawn
   */
  readonly stripes: number[];

  /**
   * The width of a single-weighted stripe
   */
  readonly stripeWidth: number;

  /**
   * Initializes the SVG renderer
   *
   * @param stripes - The list of stripes to be drawn as a string of digits
   * @param stripeWidth - The width of a single-weighted stripe (default: 4)
   */
  constructor(stripes: string, stripeWidth: number = DEFAULT_STRIPE_WIDTH) {
    this.stripes = stripes.split('').map((a) => parseInt(a, 10));
    this.stripeWidth = stripeWidth;
  }

  /**
   * Appends an SVG object and renders the barcode inside it
   *
   * The structure of the SVG is a series of parallel rectangular stripes whose
   * colors alternate between black or white.
   * These stripes are placed from left to right. Their width will vary
   * depending on their weight, which can be either 1 or 2.
   *
   * @param selector - The selector to the object where the SVG must be appended.
   *                   If omitted, returns the SVG as a string.
   * @returns null if selector is provided (SVG is appended to DOM), otherwise returns SVG string
   */
  render(selector?: string): string | null {
    const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
    let pos = 0;
    let width = 0;

    for (let i = 0; i < this.stripes.length; i += 1, pos += width) {
      width = this.stripeWidth * this.stripes[i];

      const shape = document.createElementNS(SVG_NAMESPACE, 'rect');
      shape.setAttribute('width', String(width));
      shape.setAttribute('height', String(DEFAULT_BARCODE_HEIGHT));
      shape.setAttribute('fill', SVG.color(i));
      shape.setAttribute('x', String(pos));
      shape.setAttribute('y', '0');
      svg.appendChild(shape);
    }

    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute(
      'viewBox',
      `0 0 ${this.viewBoxWidth()} ${DEFAULT_BARCODE_HEIGHT}`,
    );

    if (selector === undefined) {
      return new XMLSerializer().serializeToString(svg);
    }

    const element = document.querySelector(selector);
    if (element) {
      element.appendChild(svg);
    }
    return null;
  }

  /**
   * Calculates the total width of the barcode
   *
   * The calculation method is the sum of the weight of the stripes multiplied
   * by the width of a single-weighted stripe
   *
   * @returns The width of a view box that fits the barcode
   */
  viewBoxWidth(): number {
    return this.stripes.reduce((a, b) => a + b, 0) * this.stripeWidth;
  }

  /**
   * Returns the appropriate color for each stripe
   *
   * Odd numbers will return white, even will return black
   *
   * @param i - The index of the stripe
   * @returns The stripe color in hex format
   *
   * @example
   * // Returns "#ffffff"
   * SVG.color(1);
   * // Returns "#000000"
   * SVG.color(2);
   */
  static color(i: number): string {
    return i % 2 ? BarcodeColors.WHITE : BarcodeColors.BLACK;
  }
}
