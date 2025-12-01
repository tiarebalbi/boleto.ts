/**
 * Unit tests for SVG rendering module
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SVG } from './svg.ts';

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
  });

  describe('viewBoxWidth', () => {
    it('should calculate width as sum of stripes times stripe width', () => {
      const svg = new SVG('1234', 4); // sum = 1+2+3+4 = 10, * 4 = 40
      expect(svg.viewBoxWidth()).toBe(40);
    });

    it('should handle empty stripes', () => {
      const svg = new SVG('', 4);
      expect(svg.viewBoxWidth()).toBe(0);
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

    it('should handle non-existent selector gracefully', () => {
      const svg = new SVG('12', 4);
      const result = svg.render('#nonexistent');

      expect(result).toBeNull();
    });
  });
});
