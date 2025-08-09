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

    it('returns null for non-existent system', () => {
      const theme = designSystemsAPI.exportTailwind('doesnotexist');
      expect(theme).toBeNull();
    });
  });
});
