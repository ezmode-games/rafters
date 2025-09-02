import { describe, expect, it } from 'vitest';
import { ColorValueSchema, OKLCHSchema } from './types';

describe('ColorValueSchema', () => {
  describe('basic structure', () => {
    it('should validate a minimal ColorValue object', () => {
      const minimal = {
        name: 'Ocean Blue',
        value: 'blue-500',
        scale: [],
      };

      const result = ColorValueSchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });

    it('should validate a complete ColorValue object', () => {
      const complete = {
        name: 'Ocean Blue',
        scale: [
          { l: 0.95, c: 0.05, h: 240 }, // blue-50
          { l: 0.9, c: 0.1, h: 240 }, // blue-100
          { l: 0.85, c: 0.12, h: 240 }, // blue-200
          { l: 0.7, c: 0.15, h: 240 }, // blue-300
          { l: 0.6, c: 0.18, h: 240 }, // blue-400
          { l: 0.5, c: 0.2, h: 240 }, // blue-500
          { l: 0.4, c: 0.22, h: 240 }, // blue-600
          { l: 0.3, c: 0.2, h: 240 }, // blue-700
          { l: 0.2, c: 0.18, h: 240 }, // blue-800
          { l: 0.15, c: 0.15, h: 240 }, // blue-900
        ],
        token: 'primary',
        value: '500',
        use: 'Primary brand color for CTAs',
        states: {
          hover: 'ocean-blue-600',
          focus: 'ocean-blue-700',
          disabled: 'ocean-blue-400',
        },
        intelligence: {
          suggestedName: 'Ocean Blue',
          reasoning: 'Ocean blue conveys professional trust without appearing cold',
          emotionalImpact: 'Calming yet authoritative, builds user confidence',
          culturalContext: 'Universally positive in business contexts',
          accessibilityNotes: 'AAA contrast on white, use 600+ for dark backgrounds',
          usageGuidance: 'Ideal for primary CTAs, avoid for warnings or errors',
        },
        harmonies: {
          complementary: { l: 0.65, c: 0.15, h: 60 },
          triadic: [
            { l: 0.55, c: 0.14, h: 0 },
            { l: 0.55, c: 0.14, h: 120 },
          ],
          analogous: [
            { l: 0.52, c: 0.18, h: 210 },
            { l: 0.52, c: 0.18, h: 270 },
          ],
          tetradic: [
            { l: 0.5, c: 0.2, h: 150 },
            { l: 0.5, c: 0.2, h: 60 },
            { l: 0.5, c: 0.2, h: 330 },
          ],
          monochromatic: [
            { l: 0.7, c: 0.15, h: 240 },
            { l: 0.6, c: 0.18, h: 240 },
            { l: 0.4, c: 0.22, h: 240 },
          ],
        },
        accessibility: {
          onWhite: {
            wcagAA: true,
            wcagAAA: true,
            contrastRatio: 8.59,
          },
          onBlack: {
            wcagAA: false,
            wcagAAA: false,
            contrastRatio: 2.45,
          },
        },
        analysis: {
          temperature: 'cool',
          isLight: true,
          name: 'ocean-blue',
        },
      };

      const result = ColorValueSchema.safeParse(complete);
      expect(result.success).toBe(true);
    });

    it('should fail without required fields', () => {
      const invalid = {
        // missing name and scale
      };

      const result = ColorValueSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('scale field', () => {
    it('should accept empty scale array', () => {
      const withEmptyScale = {
        name: 'Brand Blue',
        scale: [],
      };

      const result = ColorValueSchema.safeParse(withEmptyScale);
      expect(result.success).toBe(true);
    });

    it('should validate OKLCH values in scale', () => {
      const withScale = {
        name: 'Brand Blue',
        scale: [
          { l: 0.95, c: 0.05, h: 240 },
          { l: 0.5, c: 0.2, h: 240 },
        ],
      };

      const result = ColorValueSchema.safeParse(withScale);
      expect(result.success).toBe(true);
    });

    it('should reject invalid OKLCH values in scale', () => {
      const withBadScale = {
        name: 'Brand Blue',
        value: 'blue',
        scale: [
          [{ l: 1.5, c: 0.05, h: 240 }], // l > 1 is invalid
        ],
      };

      const result = ColorValueSchema.safeParse(withBadScale);
      expect(result.success).toBe(false);
    });
  });

  describe('confusing aspects', () => {
    // This is where we'll discover if the schema makes sense

    it('has confusing redundancy between value and baseColor', () => {
      // If value is "blue-500" and baseColor is "oklch(...)",
      // which one is the actual color value?
      const confusing = {
        name: 'Ocean Blue',
        value: 'blue-500', // What is this?
        baseColor: 'oklch(0.50 0.20 240)', // And this?
        scale: [],
      };

      // This passes but it's not clear what each field means
      const result = ColorValueSchema.safeParse(confusing);
      expect(result.success).toBe(true);

      // TODO: This is confusing - what's the difference between value and baseColor?
    });

    it('scale structure is overcomplicated', () => {
      // Why is scale a 2D array of OKLCH arrays?
      // z.array(z.array(OKLCHSchema))
      // This means: [[{l,c,h}], [{l,c,h}]]
      // Why the extra nesting?

      const scale = [
        [{ l: 0.95, c: 0.05, h: 240 }], // Why array wrapping single OKLCH?
        [{ l: 0.9, c: 0.1, h: 240 }],
      ];

      // Should it just be:
      // [{ l: 0.95, c: 0.05, h: 240 }, { l: 0.90, c: 0.10, h: 240 }]
      // Or even simpler with shade names:
      // { '50': { l: 0.95, c: 0.05, h: 240 }, '100': { l: 0.90, c: 0.10, h: 240 }}
    });
  });
});
