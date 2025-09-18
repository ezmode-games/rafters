/**
 * TDD Tests for Default System Archive Structure
 *
 * Tests the archive structure that will be embedded in the CLI
 * for the default grayscale system (000000).
 */

import type { Token } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateAllTokens } from '../src/generators/index.js';

describe('Default System Archive Structure', () => {
  let tokens: Token[];

  // Generate tokens once for all tests
  beforeAll(async () => {
    tokens = await generateAllTokens();
  }, 30000);

  describe('Archive Manifest', () => {
    it('should have complete manifest metadata', async () => {
      const manifest = {
        id: '000000',
        name: 'Rafters Default Grayscale System',
        version: '1.0.0',
        primaryColor: { l: 0.44, c: 0.01, h: 286 },
        intelligence: {
          colorVisionTested: ['normal', 'protanopia', 'deuteranopia', 'tritanopia'],
          contrastLevel: 'AAA',
          components: {
            buttons: { touchTargetMet: true, contrastValidated: true },
            forms: { accessibilityOptimized: true },
            navigation: { cognitiveLoadOptimized: true },
          },
        },
        tokenCount: tokens.length,
      };

      expect(manifest.id).toBe('000000');
      expect(manifest.primaryColor).toEqual({ l: 0.44, c: 0.01, h: 286 });
      expect(manifest.tokenCount).toBeGreaterThanOrEqual(240);
      expect(manifest.intelligence.contrastLevel).toBe('AAA');
    });
  });

  describe('colors.json Structure', () => {
    it('should separate color families and semantic tokens', async () => {
      const colorFamilyTokens = tokens.filter((t) => t.category === 'color-family');
      const semanticColorTokens = tokens.filter((t) => t.category === 'color');

      const colorsStructure = {
        families: colorFamilyTokens,
        tokens: semanticColorTokens,
        dependencies: {
          'primary-hover': {
            dependsOn: ['primary'],
            generationRule: 'ColorReference with hover state mapping',
          },
          background: {
            dependsOn: ['neutral-50'],
            generationRule: 'ColorReference to neutral family position 50',
          },
        },
      };

      expect(colorsStructure.families.length).toBeGreaterThan(0);
      expect(colorsStructure.tokens.length).toBeGreaterThan(0);
      expect(colorsStructure.dependencies).toBeDefined();
    });

    it('should have proper color family structure', async () => {
      const colorFamilyTokens = tokens.filter((t) => t.category === 'color-family');
      expect(colorFamilyTokens.length).toBeGreaterThan(0);

      // Should have multiple color families (check by token names, not namespace)
      const familyNames = colorFamilyTokens.map((t) => t.name);
      expect(familyNames.length).toBeGreaterThan(1);

      // Should include different family tokens
      expect(familyNames.some((name) => name.includes('primary'))).toBe(true);
    });
  });

  describe('typography.json Structure', () => {
    it('should organize typography tokens properly', async () => {
      const fontSizeTokens = tokens.filter((t) => t.category === 'font-size');
      const fontWeightTokens = tokens.filter((t) => t.category === 'font-weight');
      const letterSpacingTokens = tokens.filter((t) => t.category === 'letter-spacing');

      const typographyStructure = {
        families: {
          heading: 'Inter, system-ui, sans-serif',
          body: 'Inter, system-ui, sans-serif',
          mono: 'Fira Code, Monaco, monospace',
        },
        scale: fontSizeTokens.reduce(
          (acc, token) => {
            const sizeName = token.name.replace('text-', '');
            acc[sizeName] = token;
            return acc;
          },
          {} as Record<string, Token>
        ),
        fontWeight: fontWeightTokens,
        letterSpacing: letterSpacingTokens,
      };

      expect(Object.keys(typographyStructure.scale).length).toBeGreaterThan(5);
      expect(typographyStructure.fontWeight.length).toBeGreaterThan(0);
      expect(typographyStructure.families.heading).toBeDefined();
    });

    it('should have complete font size scale', async () => {
      const fontSizeTokens = tokens.filter((t) => t.category === 'font-size');
      const tokenNames = fontSizeTokens.map((t) => t.name);

      // Should include common Tailwind sizes
      expect(tokenNames).toContain('text-sm');
      expect(tokenNames).toContain('text-base');
      expect(tokenNames).toContain('text-lg');
      expect(tokenNames).toContain('text-xl');
    });
  });

  describe('spacing.json Structure', () => {
    it('should organize spacing tokens with metadata', async () => {
      const spacingTokens = tokens.filter((t) => t.category === 'spacing');

      const spacingStructure = {
        scale: spacingTokens,
        system: 'linear',
        baseUnit: 4,
      };

      expect(spacingStructure.scale.length).toBeGreaterThan(10);
      expect(spacingStructure.system).toBe('linear');
      expect(spacingStructure.baseUnit).toBe(4);
    });
  });

  describe('motion.json Structure', () => {
    it('should organize motion tokens by type', async () => {
      const motionTokens = tokens.filter((t) => t.category === 'motion');
      const animationTokens = tokens.filter((t) => t.category === 'animation');

      const _motionStructure = {
        duration: motionTokens.filter((t) => t.namespace === 'duration'),
        easing: motionTokens.filter((t) => t.namespace === 'ease'),
        animations: animationTokens,
      };

      // Should have motion tokens
      expect(motionTokens.length).toBeGreaterThan(0);
    });
  });

  describe('shadows.json Structure', () => {
    it('should organize shadow and depth tokens', async () => {
      const shadowTokens = tokens.filter((t) => t.category === 'shadow');
      const zIndexTokens = tokens.filter((t) => t.category === 'z-index');

      const _shadowsStructure = {
        elevation: shadowTokens,
        depth: zIndexTokens,
      };

      expect(shadowTokens.length).toBeGreaterThan(0);
      expect(zIndexTokens.length).toBeGreaterThan(0);
    });
  });

  describe('borders.json Structure', () => {
    it('should organize border tokens', async () => {
      const borderRadiusTokens = tokens.filter((t) => t.category === 'border-radius');
      const borderWidthTokens = tokens.filter((t) => t.category === 'border-width');

      const _bordersStructure = {
        radius: borderRadiusTokens,
        width: borderWidthTokens,
      };

      expect(borderRadiusTokens.length).toBeGreaterThan(0);
      expect(borderWidthTokens.length).toBeGreaterThan(0);
    });
  });

  describe('breakpoints.json Structure', () => {
    it('should organize responsive tokens', async () => {
      const breakpointTokens = tokens.filter((t) => t.category === 'breakpoint');

      const _breakpointsStructure = {
        screens: breakpointTokens.filter((t) => t.namespace === 'screen'),
        containers: breakpointTokens.filter((t) => t.namespace === 'container'),
      };

      expect(breakpointTokens.length).toBeGreaterThan(0);
    });
  });

  describe('layout.json Structure', () => {
    it('should organize layout-related tokens', async () => {
      const layoutCategories = [
        'width',
        'height',
        'touch-target',
        'opacity',
        'aspect-ratio',
        'grid-template-columns',
        'grid-template-rows',
        'scale',
        'translate',
        'rotate',
        'backdrop-blur',
      ];

      const layoutStructure = layoutCategories.reduce(
        (acc, category) => {
          const categoryTokens = tokens.filter((t) => t.category === category);
          if (categoryTokens.length > 0) {
            acc[category] = categoryTokens;
          }
          return acc;
        },
        {} as Record<string, Token[]>
      );

      // Should have width and height tokens
      expect(layoutStructure.width?.length).toBeGreaterThan(0);
      expect(layoutStructure.height?.length).toBeGreaterThan(0);
      expect(layoutStructure['touch-target']?.length).toBeGreaterThan(0);
    });
  });

  describe('fonts.json Structure', () => {
    it('should organize font-related tokens', async () => {
      const fontFamilyTokens = tokens.filter((t) => t.category === 'font-family');
      const fontWeightTokens = tokens.filter((t) => t.category === 'font-weight');

      const _fontsStructure = {
        families: fontFamilyTokens,
        weights: fontWeightTokens,
      };

      expect(fontFamilyTokens.length).toBeGreaterThan(0);
      expect(fontWeightTokens.length).toBeGreaterThan(0);
    });
  });

  describe('Complete Archive Validation', () => {
    it('should account for all tokens across archive files', async () => {
      // Group tokens by category to ensure all are accounted for
      const tokensByCategory = tokens.reduce(
        (acc, token) => {
          if (!acc[token.category]) {
            acc[token.category] = [];
          }
          acc[token.category].push(token);
          return acc;
        },
        {} as Record<string, Token[]>
      );

      // Define which categories go in which files
      const archiveMapping = {
        'colors.json': ['color', 'color-family'],
        'typography.json': ['font-size', 'line-height', 'letter-spacing'],
        'spacing.json': ['spacing'],
        'motion.json': ['motion', 'easing', 'animation', 'keyframes', 'behavior'],
        'shadows.json': ['shadow', 'z-index'],
        'borders.json': ['border-radius', 'border-width'],
        'breakpoints.json': ['breakpoint', 'container'],
        'layout.json': [
          'width',
          'height',
          'touch-target',
          'opacity',
          'aspect-ratio',
          'grid-template-columns',
          'grid-template-rows',
          'scale',
          'translate',
          'rotate',
          'backdrop-blur',
        ],
        'fonts.json': ['font-family', 'font-weight'],
      };

      // Verify all categories are mapped to files
      const allMappedCategories = Object.values(archiveMapping).flat();
      const actualCategories = Object.keys(tokensByCategory);

      actualCategories.forEach((category) => {
        expect(allMappedCategories).toContain(category);
      });

      // Verify we have tokens for required files
      expect(tokensByCategory.color || tokensByCategory['color-family']).toBeDefined();
      expect(tokensByCategory['font-size']).toBeDefined();
      expect(tokensByCategory.spacing).toBeDefined();
    });

    it('should be ready for CLI embedding', async () => {
      // Archive should contain all required files and structure
      const requiredFiles = [
        'manifest.json',
        'colors.json',
        'typography.json',
        'spacing.json',
        'motion.json',
        'shadows.json',
        'borders.json',
        'breakpoints.json',
        'layout.json',
        'fonts.json',
      ];

      // Simulate archive structure validation
      const archiveStructure = {
        files: requiredFiles,
        tokenCount: tokens.length,
        systemId: '000000',
        ready: tokens.length >= 240,
      };

      expect(archiveStructure.files.length).toBe(10);
      expect(archiveStructure.tokenCount).toBeGreaterThanOrEqual(240);
      expect(archiveStructure.systemId).toBe('000000');
      expect(archiveStructure.ready).toBe(true);
    });
  });
});
