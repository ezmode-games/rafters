/**
 * Tests for the design systems API
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { designSystemsAPI } from '../src/api';

describe('designSystemsAPI', () => {
  beforeEach(() => {
    // Clean up any test systems (keep default)
    const systems = designSystemsAPI.list();
    for (const s of systems) {
      if (s.id !== '000000') {
        designSystemsAPI.delete(s.id);
      }
    }
  });

  describe('get', () => {
    it('returns default grayscale system', () => {
      const system = designSystemsAPI.get('000000');
      expect(system).toBeDefined();
      expect(system?.name).toBe('Grayscale Default');
    });

    it('returns null for non-existent system', () => {
      const system = designSystemsAPI.get('doesnotexist');
      expect(system).toBeNull();
    });
  });

  describe('list', () => {
    it('returns at least the default system', () => {
      const systems = designSystemsAPI.list();
      expect(systems.length).toBeGreaterThanOrEqual(1);
      expect(systems.some((s) => s.id === '000000')).toBe(true);
    });
  });

  describe('createFromColor', () => {
    it('creates a new design system from a primary color', () => {
      const primaryColor = { l: 0.5, c: 0.2, h: 220, alpha: 1 };
      const system = designSystemsAPI.createFromColor(
        primaryColor,
        'Blue Theme',
        'A blue-based design system'
      );

      expect(system.id).toBeDefined();
      expect(system.name).toBe('Blue Theme');
      expect(system.description).toBe('A blue-based design system');
      expect(system.colorTokens).toBeDefined();
      expect(system.colorTokens?.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('updates an existing system', () => {
      const primaryColor = { l: 0.5, c: 0.2, h: 220, alpha: 1 };
      const system = designSystemsAPI.createFromColor(primaryColor, 'Test System');

      const updated = designSystemsAPI.update(system.id, {
        name: 'Updated Name',
        description: 'New description',
      });

      expect(updated?.name).toBe('Updated Name');
      expect(updated?.description).toBe('New description');
      expect(updated?.id).toBe(system.id); // Verify same system
    });

    it('returns null for non-existent system', () => {
      const result = designSystemsAPI.update('doesnotexist', { name: 'New' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('deletes a custom system', () => {
      const primaryColor = { l: 0.5, c: 0.2, h: 220, alpha: 1 };
      const system = designSystemsAPI.createFromColor(primaryColor, 'To Delete');

      const deleted = designSystemsAPI.delete(system.id);
      expect(deleted).toBe(true);

      const retrieved = designSystemsAPI.get(system.id);
      expect(retrieved).toBeNull();
    });

    it('cannot delete the default system', () => {
      const deleted = designSystemsAPI.delete('000000');
      expect(deleted).toBe(false);

      const system = designSystemsAPI.get('000000');
      expect(system).toBeDefined();
    });
  });

  describe('exportCSS', () => {
    it('exports system as CSS variables', () => {
      const css = designSystemsAPI.exportCSS('000000');
      expect(css).toBeDefined();
      expect(css).toContain(':root {');
      expect(css).toContain('--color-');
      expect(css).toContain('--spacing-');
      expect(css).toContain('--font-'); // Typography uses font prefix
    });

    it('includes motion tokens in CSS export', () => {
      const css = designSystemsAPI.exportCSS('000000');
      expect(css).toBeDefined();

      // Check motion timing tokens
      expect(css).toContain('--duration-');
      expect(css).toMatch(/--duration-fast:\s*\d+ms/);
      expect(css).toMatch(/--duration-standard:\s*\d+ms/);
      expect(css).toMatch(/--duration-slow:\s*\d+ms/);

      // Check motion easing tokens
      expect(css).toContain('--ease-');
      expect(css).toMatch(/--ease-linear:\s*ease-linear/);
      expect(css).toMatch(/--ease-smooth:\s*ease-in-out/);
      expect(css).toMatch(/--ease-bouncy:\s*cubic-bezier/);
    });

    it('includes all token categories in CSS export', () => {
      const css = designSystemsAPI.exportCSS('000000');
      expect(css).toBeDefined();

      // Check various token categories are present
      expect(css).toContain('--color-'); // Colors
      expect(css).toContain('--spacing-'); // Spacing
      expect(css).toContain('--opacity-'); // State opacities
      expect(css).toContain('--scale-'); // State scales
      expect(css).toContain('--duration-'); // Motion timing
      expect(css).toContain('--ease-'); // Motion easing
      expect(css).toContain('--border-'); // Border tokens
      expect(css).toContain('--shadow-'); // Shadow tokens
      expect(css).toContain('--ring-'); // Ring tokens
    });

    it('includes custom color tokens', () => {
      const primaryColor = { l: 0.5, c: 0.2, h: 220, alpha: 1 };
      const system = designSystemsAPI.createFromColor(primaryColor, 'Color System');

      const css = designSystemsAPI.exportCSS(system.id);
      expect(css).toContain('/* Custom Colors */');
      expect(css).toContain('--color-primary-');
      expect(css).toContain('-hover:');
      expect(css).toContain('-focus:');
      expect(css).toContain('-active:');
    });

    it('returns null for non-existent system', () => {
      const css = designSystemsAPI.exportCSS('doesnotexist');
      expect(css).toBeNull();
    });
  });

  describe('exportTailwind', () => {
    it('exports system as Tailwind v4 theme', () => {
      const theme = designSystemsAPI.exportTailwind('000000');
      expect(theme).toBeDefined();
      expect(theme).toContain('@theme {');
      expect(theme).toContain('/* color */');
      expect(theme).toContain('/* spacing */');
      expect(theme).toContain('/* typography */');
    });

    it('includes motion tokens in Tailwind export with proper categories', () => {
      const theme = designSystemsAPI.exportTailwind('000000');
      expect(theme).toBeDefined();
      expect(theme).toContain('@theme {');

      // Check motion category sections
      expect(theme).toContain('/* timing */');
      expect(theme).toContain('/* easing */');

      // Check motion tokens are present
      expect(theme).toContain('--duration-');
      expect(theme).toContain('--ease-');

      // Check tokens are properly categorized
      const timingSection = theme.split('/* timing */')[1];
      const easingSection = theme.split('/* easing */')[1];

      expect(timingSection).toContain('--duration-fast:');
      expect(easingSection).toContain('--ease-smooth:');
    });

    it('includes all token categories organized properly', () => {
      const theme = designSystemsAPI.exportTailwind('000000');
      expect(theme).toBeDefined();

      // Check all expected category sections
      expect(theme).toContain('/* color */');
      expect(theme).toContain('/* typography */');
      expect(theme).toContain('/* spacing */');
      expect(theme).toContain('/* state */');
      expect(theme).toContain('/* timing */');
      expect(theme).toContain('/* easing */');
      expect(theme).toContain('/* border */');
      expect(theme).toContain('/* shadow */');
      expect(theme).toContain('/* ring */');
      expect(theme).toContain('/* opacity */');
    });

    it('returns null for non-existent system', () => {
      const theme = designSystemsAPI.exportTailwind('doesnotexist');
      expect(theme).toBeNull();
    });
  });
});
