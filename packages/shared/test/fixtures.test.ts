/**
 * Fixture Generator Tests
 * Validates our fixture generation system with zod-schema-faker
 */

import { describe, it, expect } from 'vitest';
import {
  createComponentManifestFixture,
  createPreviewFixture,
  createColorValueFixture,
  createTokenFixture,
  createOKLCHFixture,
  createIntelligenceFixture,
  createFixtures,
} from './fixtures.js';
import {
  ComponentManifestSchema,
  PreviewSchema,
  ColorValueSchema,
  TokenSchema,
  OKLCHSchema,
  IntelligenceSchema,
} from '../src/types.js';

describe('Fixture Generation System', () => {
  describe('OKLCH Fixtures', () => {
    it('should generate valid OKLCH color', () => {
      const color = createOKLCHFixture();

      expect(OKLCHSchema.safeParse(color).success).toBe(true);
      expect(color.l).toBeGreaterThanOrEqual(0);
      expect(color.l).toBeLessThanOrEqual(1);
      expect(color.c).toBeGreaterThanOrEqual(0);
      expect(color.h).toBeGreaterThanOrEqual(0);
      expect(color.h).toBeLessThanOrEqual(360);
    });

    it('should respect overrides', () => {
      const color = createOKLCHFixture({
        overrides: { h: 180 },
      });

      expect(color.h).toBe(180);
    });

    it('should be deterministic with seed', () => {
      const color1 = createOKLCHFixture({ seed: 42 });
      const color2 = createOKLCHFixture({ seed: 42 });

      expect(color1).toEqual(color2);
    });
  });

  describe('ColorValue Fixtures', () => {
    it('should generate valid color value with scale', () => {
      const colorValue = createColorValueFixture();

      expect(ColorValueSchema.safeParse(colorValue).success).toBe(true);
      expect(colorValue.name).toBe('ocean-blue');
      expect(colorValue.scale).toHaveLength(10);
      expect(colorValue.token).toBe('primary');
    });

    it('should allow custom overrides', () => {
      const colorValue = createColorValueFixture({
        overrides: {
          name: 'sunset-orange',
          token: 'accent',
        },
      });

      expect(colorValue.name).toBe('sunset-orange');
      expect(colorValue.token).toBe('accent');
    });
  });

  describe('Token Fixtures', () => {
    it('should generate valid semantic token', () => {
      const token = createTokenFixture();

      expect(TokenSchema.safeParse(token).success).toBe(true);
      expect(token.category).toBe('color');
      expect(token.namespace).toBe('semantic');
      expect(token.cognitiveLoad).toBeDefined();
    });

    it('should generate spacing token', () => {
      const token = createTokenFixture({
        overrides: {
          name: 'spacing-md',
          value: '1rem',
          category: 'spacing',
        },
      });

      expect(token.name).toBe('spacing-md');
      expect(token.value).toBe('1rem');
      expect(token.category).toBe('spacing');
    });
  });

  describe('Intelligence Fixtures', () => {
    it('should generate valid intelligence metadata', () => {
      const intelligence = createIntelligenceFixture();

      expect(IntelligenceSchema.safeParse(intelligence).success).toBe(true);
      expect(intelligence.cognitiveLoad).toBeGreaterThanOrEqual(0);
      expect(intelligence.cognitiveLoad).toBeLessThanOrEqual(10);
      expect(intelligence.attentionEconomics).toBeDefined();
      expect(intelligence.accessibility).toBeDefined();
    });

    it('should include CVA intelligence', () => {
      const intelligence = createIntelligenceFixture();

      expect(intelligence.cva).toBeDefined();
      expect(intelligence.cva?.baseClasses).toContain('inline-flex');
      expect(intelligence.cva?.propMappings).toBeDefined();
    });
  });

  describe('Preview Fixtures', () => {
    it('should generate valid component preview', () => {
      const preview = createPreviewFixture();

      expect(PreviewSchema.safeParse(preview).success).toBe(true);
      expect(preview.framework).toBe('react');
      expect(preview.compiledJs).toBeDefined();
      expect(preview.cva).toBeDefined();
      expect(preview.css).toBeDefined();
    });

    it('should support different frameworks', () => {
      const vuePreview = createPreviewFixture({
        overrides: { framework: 'vue' },
      });

      expect(vuePreview.framework).toBe('vue');
    });

    it('should include dependencies', () => {
      const preview = createPreviewFixture();

      expect(preview.dependencies).toContain('react');
      expect(preview.dependencies).toContain('clsx');
    });
  });

  describe('ComponentManifest Fixtures', () => {
    it('should generate valid component manifest', () => {
      const manifest = createComponentManifestFixture();

      expect(ComponentManifestSchema.safeParse(manifest).success).toBe(true);
      expect(manifest.name).toBe('button');
      expect(manifest.type).toBe('registry:component');
    });

    it('should include rafters metadata', () => {
      const manifest = createComponentManifestFixture();

      expect(manifest.meta?.rafters).toBeDefined();
      expect(manifest.meta?.rafters?.intelligence).toBeDefined();
      expect(manifest.meta?.rafters?.usagePatterns).toBeDefined();
      expect(manifest.meta?.rafters?.previews).toBeDefined();
    });

    it('should have valid file structure', () => {
      const manifest = createComponentManifestFixture();

      expect(manifest.files).toHaveLength(1);
      expect(manifest.files[0].path).toBe('components/ui/button.tsx');
      expect(manifest.files[0].type).toBe('registry:component');
    });

    it('should allow customization', () => {
      const manifest = createComponentManifestFixture({
        overrides: {
          name: 'input',
          description: 'A text input field',
        },
      });

      expect(manifest.name).toBe('input');
      expect(manifest.description).toBe('A text input field');
    });
  });

  describe('Bulk Fixture Generation', () => {
    it('should generate multiple fixtures', () => {
      const tokens = createFixtures(createTokenFixture, 5);

      expect(tokens).toHaveLength(5);
      tokens.forEach((token) => {
        expect(TokenSchema.safeParse(token).success).toBe(true);
      });
    });

    it('should generate unique fixtures without seed', () => {
      const previews = createFixtures(createPreviewFixture, 3);

      // All should be valid but not necessarily identical
      previews.forEach((preview) => {
        expect(PreviewSchema.safeParse(preview).success).toBe(true);
      });
    });

    it('should generate consistent fixtures with seed', () => {
      const batch1 = createFixtures(createOKLCHFixture, 3, { seed: 100 });
      const batch2 = createFixtures(createOKLCHFixture, 3, { seed: 100 });

      expect(batch1).toEqual(batch2);
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('should create button manifest with all variants', () => {
      const manifest = createComponentManifestFixture({
        overrides: {
          name: 'button',
          meta: {
            rafters: {
              version: '1.0.0',
              intelligence: createIntelligenceFixture({
                overrides: { cognitiveLoad: 2 },
              }),
              previews: [
                createPreviewFixture({ overrides: { variant: 'default' } }),
                createPreviewFixture({ overrides: { variant: 'destructive' } }),
                createPreviewFixture({ overrides: { variant: 'outline' } }),
              ],
            },
          },
        },
      });

      expect(manifest.meta?.rafters?.previews).toHaveLength(3);
      expect(manifest.meta?.rafters?.intelligence.cognitiveLoad).toBe(2);
    });

    it('should create color token with full intelligence', () => {
      const token = createTokenFixture({
        overrides: {
          name: 'color-primary-500',
          value: createColorValueFixture({
            overrides: {
              name: 'ocean-blue',
              token: 'primary',
            },
          }),
          category: 'color',
          cognitiveLoad: 1,
          accessibilityLevel: 'AA',
        },
      });

      expect(token.name).toBe('color-primary-500');
      expect(token.cognitiveLoad).toBe(1);
      expect(token.accessibilityLevel).toBe('AA');
    });
  });
});
