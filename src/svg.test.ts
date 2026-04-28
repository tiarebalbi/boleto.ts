/**
 * Unit tests for SVG rendering module
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SVG } from './svg.ts';
import type { BarcodeData, BarcodeStripe } from './svg.ts';

describe('SVG', () => {
  describe('constructor', () => {
    it('should parse stripes string into array of numbers', () => {
      const svg = new SVG('1234');
      expect(svg.stripes).toEqual([1, 2, 3, 4]);
    });

    it('should use default stripe width of 4', () => {
      const svg = new SVG('12');
      expect(svg.stripeWidth).toBe(4);
    });

    it('should accept custom stripe width', () => {
      const svg = new SVG('12', 8);
      expect(svg.stripeWidth).toBe(8);
    });

    it('should handle stripeWidth of 0 gracefully', () => {
      const svg = new SVG('1234', 0);
      expect(svg.viewBoxWidth()).toBe(0);
      const data = svg.toBarcodeData();
      expect(data.viewBoxWidth).toBe(0);
      data.stripes.forEach((s) => expect(s.width).toBe(0));
    });
  });

  describe('constructor – invalid input', () => {
    it('should throw TypeError for empty string', () => {
      expect(() => new SVG('')).toThrow(TypeError);
      expect(() => new SVG('')).toThrow(
        'SVG: expected a non-empty string of digits, got ""',
      );
    });

    it('should throw TypeError for non-digit string', () => {
      expect(() => new SVG('abc')).toThrow(TypeError);
      expect(() => new SVG('abc')).toThrow(
        'SVG: expected a non-empty string of digits, got "abc"',
      );
    });

    it('should throw TypeError for string with spaces', () => {
      expect(() => new SVG('12 34')).toThrow(TypeError);
    });

    it('should throw TypeError for string with dots', () => {
      expect(() => new SVG('12.34')).toThrow(TypeError);
    });
  });

  describe('viewBoxWidth', () => {
    it('should calculate width as sum of stripes times stripe width', () => {
      const svg = new SVG('1234', 4); // sum = 1+2+3+4 = 10, * 4 = 40
      expect(svg.viewBoxWidth()).toBe(40);
    });

    it('should handle single stripe', () => {
      const svg = new SVG('5', 4);
      expect(svg.viewBoxWidth()).toBe(20);
    });
  });

  describe('color', () => {
    it('should return black for even indices', () => {
      expect(SVG.color(0)).toBe('#000000');
      expect(SVG.color(2)).toBe('#000000');
      expect(SVG.color(100)).toBe('#000000');
    });

    it('should return white for odd indices', () => {
      expect(SVG.color(1)).toBe('#ffffff');
      expect(SVG.color(3)).toBe('#ffffff');
      expect(SVG.color(99)).toBe('#ffffff');
    });

    it('SVG.color() with negative index behaves consistently', () => {
      // -1 % 2 === -1 in JavaScript, which is truthy, so returns white
      expect(SVG.color(-1)).toBe('#ffffff');
      // -2 % 2 === 0, which is falsy, so returns black
      expect(SVG.color(-2)).toBe('#000000');
    });
  });

  describe('toBarcodeData', () => {
    it('should return structured barcode data', () => {
      const svg = new SVG('12', 4);
      const data: BarcodeData = svg.toBarcodeData();

      expect(data.viewBoxWidth).toBe(12); // (1+2)*4 = 12
      expect(data.viewBoxHeight).toBe(100);
      expect(data.stripes).toHaveLength(2);
    });

    it('should calculate correct stripe positions and dimensions', () => {
      const svg = new SVG('12', 4);
      const data = svg.toBarcodeData();

      const first: BarcodeStripe = data.stripes[0];
      expect(first.x).toBe(0);
      expect(first.width).toBe(4); // 4 * 1
      expect(first.height).toBe(100);
      expect(first.color).toBe('#000000'); // even index = black

      const second: BarcodeStripe = data.stripes[1];
      expect(second.x).toBe(4);
      expect(second.width).toBe(8); // 4 * 2
      expect(second.height).toBe(100);
      expect(second.color).toBe('#ffffff'); // odd index = white
    });

    it('should handle multiple stripes with correct cumulative positions', () => {
      const svg = new SVG('1234', 4);
      const data = svg.toBarcodeData();

      expect(data.stripes[0].x).toBe(0);
      expect(data.stripes[1].x).toBe(4); // 0 + 4*1
      expect(data.stripes[2].x).toBe(12); // 4 + 4*2
      expect(data.stripes[3].x).toBe(24); // 12 + 4*3
    });

    it('should use custom stripe width', () => {
      const svg = new SVG('12', 8);
      const data = svg.toBarcodeData();

      expect(data.stripes[0].width).toBe(8); // 8 * 1
      expect(data.stripes[1].width).toBe(16); // 8 * 2
      expect(data.viewBoxWidth).toBe(24); // (1+2)*8
    });
  });

  describe('toSVGString', () => {
    it('should return valid SVG markup as string', () => {
      const svg = new SVG('12', 4);
      const result = svg.toSVGString();

      expect(result).toContain('<svg');
      expect(result).toContain('</svg>');
      expect(result).toContain('<rect');
      expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('should include correct viewBox', () => {
      const svg = new SVG('12', 4);
      const result = svg.toSVGString();

      expect(result).toContain('viewBox="0 0 12 100"');
    });

    it('should include correct dimensions', () => {
      const svg = new SVG('12', 4);
      const result = svg.toSVGString();

      expect(result).toContain('width="100%"');
      expect(result).toContain('height="100%"');
    });

    it('should include correct rect attributes', () => {
      const svg = new SVG('12', 4);
      const result = svg.toSVGString();

      // Parse as XML to verify structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(result, 'image/svg+xml');
      const rects = doc.querySelectorAll('rect');

      expect(rects).toHaveLength(2);

      expect(rects[0].getAttribute('width')).toBe('4');
      expect(rects[0].getAttribute('x')).toBe('0');
      expect(rects[0].getAttribute('fill')).toBe('#000000');
      expect(rects[0].getAttribute('height')).toBe('100');

      expect(rects[1].getAttribute('width')).toBe('8');
      expect(rects[1].getAttribute('x')).toBe('4');
      expect(rects[1].getAttribute('fill')).toBe('#ffffff');
    });

    it('should produce consistent output with render() when no selector', () => {
      const svg = new SVG('12', 4);
      const stringResult = svg.toSVGString();
      const renderResult = svg.render();

      // Both should return the same SVG string
      expect(renderResult).toBe(stringResult);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      // Reset document body before each test
      document.body.innerHTML = '';
    });

    it('should return SVG string when no selector is provided', () => {
      const svg = new SVG('12', 4);
      const result = svg.render();

      expect(result).not.toBeNull();
      expect(result).toContain('<svg');
      expect(result).toContain('<rect');
      expect(result).toContain('viewBox="0 0 12 100"'); // (1+2)*4 = 12
    });

    it('should append SVG to DOM when selector is provided', () => {
      document.body.innerHTML = '<div id="barcode"></div>';
      const svg = new SVG('12', 4);
      const result = svg.render('#barcode');

      expect(result).toBeNull();
      const container = document.querySelector('#barcode');
      expect(container?.querySelector('svg')).not.toBeNull();
    });

    it('should set correct attributes on the SVG element appended to DOM', () => {
      document.body.innerHTML = '<div id="barcode"></div>';
      const svg = new SVG('12', 4);
      svg.render('#barcode');

      const container = document.querySelector('#barcode')!;
      const svgEl = container.querySelector('svg')!;

      expect(svgEl.getAttribute('viewBox')).toBe('0 0 12 100');
      expect(svgEl.getAttribute('width')).toBe('100%');
      expect(svgEl.getAttribute('height')).toBe('100%');

      const rects = svgEl.querySelectorAll('rect');
      expect(rects).toHaveLength(2);
      expect(rects[0].getAttribute('width')).toBe('4');
      expect(rects[0].getAttribute('x')).toBe('0');
      expect(rects[0].getAttribute('fill')).toBe('#000000');
      expect(rects[0].getAttribute('height')).toBe('100');
      expect(rects[0].getAttribute('y')).toBe('0');
      expect(rects[1].getAttribute('width')).toBe('8');
      expect(rects[1].getAttribute('x')).toBe('4');
      expect(rects[1].getAttribute('fill')).toBe('#ffffff');
    });

    it('should create correct number of rect elements', () => {
      const svg = new SVG('1234', 4);
      const result = svg.render();

      // Should have 4 rect elements
      const matches = result?.match(/<rect/g) || [];
      expect(matches.length).toBe(4);
    });

    it('should set correct rect attributes', () => {
      const svg = new SVG('12', 4);
      const result = svg.render()!;

      // Parse the SVG to check rect attributes
      const parser = new DOMParser();
      const doc = parser.parseFromString(result, 'image/svg+xml');
      const rects = doc.querySelectorAll('rect');

      // First rect: width = 4*1 = 4, x = 0, fill = black
      expect(rects[0].getAttribute('width')).toBe('4');
      expect(rects[0].getAttribute('x')).toBe('0');
      expect(rects[0].getAttribute('fill')).toBe('#000000');
      expect(rects[0].getAttribute('height')).toBe('100');
      expect(rects[0].getAttribute('y')).toBe('0');

      // Second rect: width = 4*2 = 8, x = 4, fill = white
      expect(rects[1].getAttribute('width')).toBe('8');
      expect(rects[1].getAttribute('x')).toBe('4');
      expect(rects[1].getAttribute('fill')).toBe('#ffffff');
    });

    it('should set SVG dimensions correctly', () => {
      const svg = new SVG('12', 4);
      const result = svg.render()!;

      expect(result).toContain('width="100%"');
      expect(result).toContain('height="100%"');
    });

    it('should throw when selector does not match any element', () => {
      const svg = new SVG('12', 4);

      expect(() => svg.render('#nonexistent')).toThrow(
        'SVG render target not found: "#nonexistent"',
      );
    });

    it('should append SVG to the first matching element when multiple elements match', () => {
      document.body.innerHTML =
        '<div class="target"></div><div class="target"></div>';
      const svg = new SVG('12', 4);
      svg.render('.target');

      // Only one SVG should exist in the document
      expect(document.querySelectorAll('svg').length).toBe(1);
      // The SVG should be in the first matching element
      const targets = document.querySelectorAll('.target');
      expect(targets[0].querySelector('svg')).not.toBeNull();
      expect(targets[1].querySelector('svg')).toBeNull();
    });
  });
});
