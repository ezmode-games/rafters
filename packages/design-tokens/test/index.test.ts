/**
 * Tests for the main index exports
 */

import { describe, expect, it } from 'vitest';
import {
  DesignSystemSchema,
  SmartColorTokenSchema,
  TokenSchema,
  createColorDesignSystem,
  defaultGrayscaleSystem,
  designSystemsAPI,
  exportToTailwindTheme,
  generateMotionTokens,
  generateShadowTokens,
  generateSpacingTokens,
  getDesignSystem,
} from '../src/index';

describe('index exports', () => {
  it('exports all required schemas', () => {
    expect(TokenSchema).toBeDefined();
    expect(DesignSystemSchema).toBeDefined();
    expect(SmartColorTokenSchema).toBeDefined();
  });

  it('exports design system functions', () => {
    expect(getDesignSystem).toBeDefined();
    expect(generateSpacingTokens).toBeDefined();
    expect(generateShadowTokens).toBeDefined();
    expect(generateMotionTokens).toBeDefined();
    expect(exportToTailwindTheme).toBeDefined();
  });

  it('exports grayscale system', () => {
    expect(defaultGrayscaleSystem).toBeDefined();
    expect(defaultGrayscaleSystem.colors).toBeDefined();
    expect(defaultGrayscaleSystem.typography).toBeDefined();
    expect(defaultGrayscaleSystem.spacing).toBeDefined();
    expect(defaultGrayscaleSystem.state).toBeDefined();
    expect(defaultGrayscaleSystem.motion).toBeDefined();
    expect(defaultGrayscaleSystem.border).toBeDefined();
    expect(defaultGrayscaleSystem.shadow).toBeDefined();
    expect(defaultGrayscaleSystem.ring).toBeDefined();
    expect(defaultGrayscaleSystem.opacity).toBeDefined();
  });

  it('exports color tool functions', () => {
    expect(createColorDesignSystem).toBeDefined();
  });

  it('exports design systems API', () => {
    expect(designSystemsAPI).toBeDefined();
    expect(designSystemsAPI.get).toBeDefined();
    expect(designSystemsAPI.list).toBeDefined();
    expect(designSystemsAPI.create).toBeDefined();
    expect(designSystemsAPI.createFromColor).toBeDefined();
    expect(designSystemsAPI.update).toBeDefined();
    expect(designSystemsAPI.delete).toBeDefined();
    expect(designSystemsAPI.exportCSS).toBeDefined();
    expect(designSystemsAPI.exportTailwind).toBeDefined();
  });
});

describe('getDesignSystem', () => {
  it('returns default grayscale system for 000000', () => {
    const system = getDesignSystem('000000');
    expect(system).toBeDefined();
    expect(system.colors).toBeDefined();
    expect(system.meta).toBeDefined();
    expect(system.meta.name).toBe('Rafters Grayscale');
  });

  it('throws error for unknown system ID', () => {
    expect(() => getDesignSystem('unknown')).toThrow('Design system unknown not found');
  });
});

describe('generateSpacingTokens', () => {
  it('generates linear spacing tokens', () => {
    const tokens = generateSpacingTokens({ scale: 'linear' });
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0].category).toBe('spacing');
    expect(tokens.some((t) => t.name === '--spacing-0')).toBe(true);
    expect(tokens.some((t) => t.name === '--spacing-4')).toBe(true);
  });

  it('generates golden ratio spacing tokens', () => {
    const tokens = generateSpacingTokens({ scale: 'golden' });
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens.some((t) => t.semanticGroup === 'golden-ratio')).toBe(true);
  });
});

describe('generateShadowTokens', () => {
  it('generates shadow tokens', () => {
    const tokens = generateShadowTokens({ scale: 'linear' });
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0].category).toBe('shadow');
    expect(tokens.some((t) => t.name === '--shadow')).toBe(true);
    expect(tokens.some((t) => t.name === '--shadow-lg')).toBe(true);
  });
});

describe('generateMotionTokens', () => {
  it('generates timing tokens from motion objects', () => {
    const tokens = generateMotionTokens();
    const timingTokens = tokens.filter((t) => t.category === 'timing');

    expect(timingTokens.length).toBeGreaterThan(0);
    expect(timingTokens.some((t) => t.name === '--duration-fast')).toBe(true);
    expect(timingTokens.some((t) => t.name === '--duration-standard')).toBe(true);
    expect(timingTokens.some((t) => t.name === '--duration-slow')).toBe(true);

    // Check values are parsed from timing objects (e.g., "duration-150" -> "150ms")
    const fastToken = timingTokens.find((t) => t.name === '--duration-fast');
    expect(fastToken?.value).toMatch(/^\d+ms$/);
  });

  it('generates easing tokens from motion objects', () => {
    const tokens = generateMotionTokens();
    const easingTokens = tokens.filter((t) => t.category === 'easing');

    expect(easingTokens.length).toBeGreaterThan(0);
    expect(easingTokens.some((t) => t.name === '--ease-linear')).toBe(true);
    expect(easingTokens.some((t) => t.name === '--ease-smooth')).toBe(true);
    expect(easingTokens.some((t) => t.name === '--ease-bouncy')).toBe(true);

    // Check cubic-bezier values are extracted properly
    const bouncyToken = easingTokens.find((t) => t.name === '--ease-bouncy');
    expect(bouncyToken?.value).toContain('cubic-bezier');
  });

  it('ensures all motion tokens have semantic group', () => {
    const tokens = generateMotionTokens();
    expect(tokens.every((t) => t.semanticGroup === 'interactive')).toBe(true);
  });

  it('ensures all motion tokens have descriptions', () => {
    const tokens = generateMotionTokens();
    expect(tokens.every((t) => t.description && t.description.length > 0)).toBe(true);
  });
});

describe('exportToTailwindTheme', () => {
  it('exports design system as Tailwind v4 theme', () => {
    const designSystem = {
      id: 'test',
      name: 'Test System',
      tokens: [
        {
          name: '--color-primary',
          value: 'oklch(0.5 0.2 220)',
          category: 'color' as const,
          type: 'static' as const,
        },
        {
          name: '--spacing-4',
          value: '1rem',
          category: 'spacing' as const,
          type: 'static' as const,
        },
      ],
    };

    const theme = exportToTailwindTheme(designSystem);
    expect(theme).toContain('@theme {');
    expect(theme).toContain('--color-primary: oklch(0.5 0.2 220)');
    expect(theme).toContain('--spacing-4: 1rem');
    expect(theme).toContain('/* Color tokens */');
    expect(theme).toContain('/* Spacing tokens */');
  });
});

describe('Token Schema Validation', () => {
  it('validates all token categories are supported', () => {
    const validCategories = [
      'color',
      'typography',
      'spacing',
      'state',
      'timing',
      'easing',
      'opacity',
      'scaling',
      'border',
      'shadow',
      'aspect',
      'grid',
    ];

    // Test each category can be used in a token
    for (const category of validCategories) {
      const token = {
        name: `--test-${category}`,
        value: 'test-value',
        category,
        type: 'static' as const,
      };

      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('validates semantic groups are supported', () => {
    const validGroups = [
      'core',
      'brand',
      'interactive',
      'semantic-state',
      'consequence',
      'sensitivity',
      'validation',
      'component',
      'golden-ratio',
    ];

    for (const group of validGroups) {
      const token = {
        name: '--test-token',
        value: 'test-value',
        category: 'color' as const,
        type: 'static' as const,
        semanticGroup: group,
      };

      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });
});

describe('Grayscale System Completeness', () => {
  it('contains all required token systems', () => {
    const system = defaultGrayscaleSystem;

    // Check all systems exist
    expect(system.colors).toBeDefined();
    expect(system.typography).toBeDefined();
    expect(system.spacing).toBeDefined();
    expect(system.state).toBeDefined();
    expect(system.motion).toBeDefined();
    expect(system.border).toBeDefined();
    expect(system.shadow).toBeDefined();
    expect(system.ring).toBeDefined();
    expect(system.opacity).toBeDefined();
    expect(system.meta).toBeDefined();
  });

  it('has motion system with timing and easing', () => {
    const motion = defaultGrayscaleSystem.motion;

    expect(motion.timing).toBeDefined();
    expect(motion.easing).toBeDefined();

    // Check some key timing tokens exist
    expect(motion.timing.fast).toBeDefined();
    expect(motion.timing.standard).toBeDefined();
    expect(motion.timing.slow).toBeDefined();

    // Check some key easing tokens exist
    expect(motion.easing.linear).toBeDefined();
    expect(motion.easing.smooth).toBeDefined();
    expect(motion.easing.bouncy).toBeDefined();
  });

  it('has state system with opacity and scale tokens', () => {
    const state = defaultGrayscaleSystem.state;

    // Check opacity states
    expect(state.hover).toBeDefined();
    expect(state.active).toBeDefined();
    expect(state.disabled).toBeDefined();
    expect(state.loading).toBeDefined();

    // Check scale states
    expect(state.scaleActive).toBeDefined();
    expect(state.scalePressed).toBeDefined();
    expect(state.scaleHoverSubtle).toBeDefined();
  });

  it('has proper AI intelligence metadata', () => {
    const meta = defaultGrayscaleSystem.meta;

    expect(meta.version).toBeDefined();
    expect(meta.name).toBe('Rafters Grayscale');
    expect(meta.overallCognitiveLoad).toBeGreaterThanOrEqual(0);
    expect(meta.designCoherence).toBeGreaterThanOrEqual(1);
    expect(meta.designCoherence).toBeLessThanOrEqual(10);
    expect(meta.accessibilityScore).toBeGreaterThanOrEqual(1);
    expect(meta.accessibilityScore).toBeLessThanOrEqual(10);
    expect(meta.intelligenceFeatures).toContain('cognitive-load-tracking');
    expect(meta.intelligenceFeatures).toContain('accessibility-compliance');
  });
});

describe('API Token Export Coverage', () => {
  it('exports CSS with all token categories', () => {
    const css = designSystemsAPI.exportCSS('000000');
    expect(css).toBeDefined();

    // Check motion tokens are included
    expect(css).toContain('--duration-');
    expect(css).toContain('--ease-');

    // Check other token categories
    expect(css).toContain('--color-');
    expect(css).toContain('--spacing-');
    expect(css).toContain('--opacity-');
  });

  it('exports Tailwind with all token categories organized by category', () => {
    const tailwind = designSystemsAPI.exportTailwind('000000');
    expect(tailwind).toBeDefined();
    expect(tailwind).toContain('@theme {');

    // Check category sections exist
    expect(tailwind).toContain('/* timing */');
    expect(tailwind).toContain('/* easing */');
    expect(tailwind).toContain('/* color */');
    expect(tailwind).toContain('/* spacing */');
    expect(tailwind).toContain('/* state */');

    // Check motion tokens are properly included
    expect(tailwind).toContain('--duration-');
    expect(tailwind).toContain('--ease-');
  });
});

describe('integration', () => {
  it('works end-to-end with API and color tool', () => {
    // Create a color system
    const primaryColor = { l: 0.5, c: 0.15, h: 240, alpha: 1 };
    const system = designSystemsAPI.createFromColor(primaryColor, 'Integration Test');

    expect(system.id).toBeDefined();
    expect(system.name).toBe('Integration Test');
    expect(system.colorTokens).toBeDefined();

    // Export to CSS
    const css = designSystemsAPI.exportCSS(system.id);
    expect(css).toContain('--color-primary-');
    expect(css).toContain('oklch(');

    // Export to Tailwind
    const tailwind = designSystemsAPI.exportTailwind(system.id);
    expect(tailwind).toContain('@theme {');

    // Clean up
    designSystemsAPI.delete(system.id);
  });

  it('includes motion tokens in all system exports', () => {
    const system = designSystemsAPI.get('000000');
    expect(system).toBeDefined();

    // Check that motion tokens are accessible through the system
    expect(system!.system.motion.timing).toBeDefined();
    expect(system!.system.motion.easing).toBeDefined();

    // Check exports include motion
    const css = designSystemsAPI.exportCSS('000000');
    const tailwind = designSystemsAPI.exportTailwind('000000');

    expect(css).toContain('--duration-');
    expect(css).toContain('--ease-');
    expect(tailwind).toContain('--duration-');
    expect(tailwind).toContain('--ease-');
  });
});
