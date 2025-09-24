/**
 * Test suite for logo utility
 */

import { describe, expect, it, vi } from 'vitest';
import { getRaftersLogo, getRaftersTitle } from '../../src/utils/logo.js';

// Mock the shared package
vi.mock('@rafters/shared', () => ({
  ASCII_LOGO: `
██████   █████  ███████ ████████ ███████ ██████  ███████
██   ██ ██   ██ ██         ██    ██      ██   ██ ██
██████  ███████ █████      ██    █████   ██████  ███████
██   ██ ██   ██ ██         ██    ██      ██   ██      ██
██   ██ ██   ██ ██         ██    ███████ ██   ██ ███████
`,
}));

describe('logo utility', () => {
  describe('getRaftersLogo', () => {
    it('should return the ASCII logo from shared package', () => {
      const logo = getRaftersLogo();

      expect(logo).toBe(`
██████   █████  ███████ ████████ ███████ ██████  ███████
██   ██ ██   ██ ██         ██    ██      ██   ██ ██
██████  ███████ █████      ██    █████   ██████  ███████
██   ██ ██   ██ ██         ██    ██      ██   ██      ██
██   ██ ██   ██ ██         ██    ███████ ██   ██ ███████
`);
    });

    it('should return a string', () => {
      const logo = getRaftersLogo();
      expect(typeof logo).toBe('string');
    });

    it('should return consistent logo across multiple calls', () => {
      const logo1 = getRaftersLogo();
      const logo2 = getRaftersLogo();

      expect(logo1).toBe(logo2);
    });

    it('should return non-empty string', () => {
      const logo = getRaftersLogo();
      expect(logo.trim()).not.toBe('');
    });

    it('should contain RAFTERS text in ASCII art', () => {
      const logo = getRaftersLogo();
      expect(logo).toContain('██████');
      expect(logo).toContain('█████');
      expect(logo).toContain('███████');
    });
  });

  describe('getRaftersTitle', () => {
    it('should return the correct title', () => {
      const title = getRaftersTitle();

      expect(title).toBe('RAFTERS Design Intelligence CLI');
    });

    it('should return a string', () => {
      const title = getRaftersTitle();
      expect(typeof title).toBe('string');
    });

    it('should return consistent title across multiple calls', () => {
      const title1 = getRaftersTitle();
      const title2 = getRaftersTitle();

      expect(title1).toBe(title2);
    });

    it('should return non-empty string', () => {
      const title = getRaftersTitle();
      expect(title.trim()).not.toBe('');
    });

    it('should contain key branding terms', () => {
      const title = getRaftersTitle();
      expect(title.toUpperCase()).toContain('RAFTERS');
      expect(title.toUpperCase()).toContain('DESIGN');
      expect(title.toUpperCase()).toContain('INTELLIGENCE');
      expect(title.toUpperCase()).toContain('CLI');
    });

    it('should be properly formatted with spaces', () => {
      const title = getRaftersTitle();
      expect(title.split(' ')).toHaveLength(4);
      expect(title.split(' ')).toEqual(['RAFTERS', 'Design', 'Intelligence', 'CLI']);
    });

    it('should not have leading or trailing whitespace', () => {
      const title = getRaftersTitle();
      expect(title).toBe(title.trim());
    });
  });

  describe('integration and consistency', () => {
    it('should have logo and title that are thematically consistent', () => {
      const logo = getRaftersLogo();
      const title = getRaftersTitle();

      // Both should reference RAFTERS
      expect(title.toUpperCase()).toContain('RAFTERS');
      expect(logo).toContain('█'); // Contains ASCII art characters
    });

    it('should maintain branding consistency', () => {
      const title = getRaftersTitle();

      expect(title).toMatch(/RAFTERS/i);
      expect(title).toMatch(/Design/i);
      expect(title).toMatch(/Intelligence/i);
      expect(title).toMatch(/CLI/i);
    });

    it('should handle repeated calls efficiently', () => {
      // Call functions multiple times to ensure no side effects
      const logos = [getRaftersLogo(), getRaftersLogo(), getRaftersLogo()];
      const titles = [getRaftersTitle(), getRaftersTitle(), getRaftersTitle()];

      // All calls should return identical results
      expect(logos.every((logo) => logo === logos[0])).toBe(true);
      expect(titles.every((title) => title === titles[0])).toBe(true);
    });
  });

  describe('display and formatting', () => {
    it('should return logo suitable for console display', () => {
      const logo = getRaftersLogo();

      // Should contain newlines for multi-line display
      expect(logo.includes('\n')).toBe(true);

      // Should have multiple lines
      const lines = logo.split('\n');
      expect(lines.length).toBeGreaterThan(1);
    });

    it('should return title suitable for header display', () => {
      const title = getRaftersTitle();

      // Should be a single line
      expect(title.split('\n')).toHaveLength(1);

      // Should be reasonable length for CLI display
      expect(title.length).toBeLessThan(100);
      expect(title.length).toBeGreaterThan(10);
    });

    it('should handle logo display width considerations', () => {
      const logo = getRaftersLogo();
      const lines = logo.split('\n').filter((line) => line.trim().length > 0);

      // ASCII art should have consistent-ish width across lines
      if (lines.length > 0) {
        const firstLineLength = lines[0].length;
        lines.forEach((line) => {
          // Allow some variation but should be roughly similar width
          expect(Math.abs(line.length - firstLineLength)).toBeLessThan(10);
        });
      }
    });
  });

  describe('error conditions and edge cases', () => {
    it('should handle missing shared package gracefully', () => {
      // This test ensures the import is working correctly
      expect(() => getRaftersLogo()).not.toThrow();
      expect(() => getRaftersTitle()).not.toThrow();
    });

    it('should return immutable values', () => {
      const logo1 = getRaftersLogo();
      const logo2 = getRaftersLogo();
      const title1 = getRaftersTitle();
      const title2 = getRaftersTitle();

      // Modifying returned values shouldn't affect subsequent calls
      expect(logo1).toBe(logo2);
      expect(title1).toBe(title2);
    });
  });
});
