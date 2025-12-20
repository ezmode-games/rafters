/**
 * Generator Tests
 *
 * Tests for the design token generators.
 * Validates config resolution, token generation, and mathematical relationships.
 */

import type { Token } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  BREAKPOINT_SCALE,
  // Defaults for generators
  DEFAULT_BREAKPOINTS,
  DEFAULT_COLOR_SCALES,
  DEFAULT_CONTAINER_BREAKPOINTS,
  DEFAULT_DELAY_MULTIPLIERS,
  DEFAULT_DEPTH_DEFINITIONS,
  DEFAULT_DURATION_DEFINITIONS,
  DEFAULT_EASING_DEFINITIONS,
  DEFAULT_ELEVATION_DEFINITIONS,
  DEFAULT_FOCUS_CONFIGS,
  DEFAULT_FONT_WEIGHTS,
  DEFAULT_RADIUS_DEFINITIONS,
  DEFAULT_SHADOW_DEFINITIONS,
  DEFAULT_SPACING_MULTIPLIERS,
  DEFAULT_SYSTEM_CONFIG,
  DEFAULT_TYPOGRAPHY_SCALE,
  DEPTH_LEVELS,
  EASING_CURVES,
  ELEVATION_LEVELS,
  // Orchestration
  generateBaseSystem,
  generateBreakpointTokens,
  // Individual generators
  generateColorTokens,
  generateDepthTokens,
  generateElevationTokens,
  generateFocusTokens,
  generateMotionTokens,
  generateNamespaces,
  generateRadiusTokens,
  generateSemanticTokens,
  generateShadowTokens,
  generateSpacingTokens,
  generateTypographyTokens,
  getAvailableNamespaces,
  getGeneratorInfo,
  MOTION_DURATION_SCALE,
  PURE_MATH_CONFIG,
  RADIUS_SCALE,
  // Config and types
  resolveConfig,
  SEMANTIC_INTENTS,
  SHADOW_SCALE,
  // Scale constants
  SPACING_SCALE,
  TYPOGRAPHY_SCALE,
  toNamespaceJSON,
  toTokenMap,
} from '../src/generators/index.js';

describe('Config Resolution', () => {
  describe('resolveConfig', () => {
    it('computes derived values from baseSpacingUnit when no overrides provided', () => {
      const resolved = resolveConfig(PURE_MATH_CONFIG);

      // baseFontSize = baseSpacingUnit * 4 = 4 * 4 = 16
      expect(resolved.baseFontSize).toBe(16);
      // baseRadius = baseSpacingUnit * 1.5 = 4 * 1.5 = 6
      expect(resolved.baseRadius).toBe(6);
      // focusRingWidth = baseSpacingUnit / 2 = 4 / 2 = 2
      expect(resolved.focusRingWidth).toBe(2);
      // baseTransitionDuration = baseSpacingUnit * 37.5 = 4 * 37.5 = 150
      expect(resolved.baseTransitionDuration).toBe(150);
    });

    it('uses override values when provided', () => {
      const resolved = resolveConfig(DEFAULT_SYSTEM_CONFIG);

      expect(resolved.baseFontSize).toBe(16);
      expect(resolved.baseRadius).toBe(6);
      expect(resolved.focusRingWidth).toBe(2);
      expect(resolved.baseTransitionDuration).toBe(150);
    });

    it('computes correct values for different base spacing unit', () => {
      const resolved = resolveConfig({
        ...PURE_MATH_CONFIG,
        baseSpacingUnit: 8,
      });

      // baseFontSize = 8 * 4 = 32
      expect(resolved.baseFontSize).toBe(32);
      // baseRadius = 8 * 1.5 = 12
      expect(resolved.baseRadius).toBe(12);
      // focusRingWidth = 8 / 2 = 4
      expect(resolved.focusRingWidth).toBe(4);
      // baseTransitionDuration = 8 * 37.5 = 300
      expect(resolved.baseTransitionDuration).toBe(300);
    });

    it('allows partial overrides', () => {
      const resolved = resolveConfig({
        ...PURE_MATH_CONFIG,
        baseFontSizeOverride: 18,
        // Other values remain computed
      });

      expect(resolved.baseFontSize).toBe(18);
      expect(resolved.baseRadius).toBe(6); // Computed: 4 * 1.5
    });
  });

  describe('DEFAULT_SYSTEM_CONFIG', () => {
    it('has baseSpacingUnit of 4', () => {
      expect(DEFAULT_SYSTEM_CONFIG.baseSpacingUnit).toBe(4);
    });

    it('uses minor-third progression', () => {
      expect(DEFAULT_SYSTEM_CONFIG.progressionRatio).toBe('minor-third');
    });

    it('has Rafters aesthetic overrides', () => {
      expect(DEFAULT_SYSTEM_CONFIG.baseFontSizeOverride).toBe(16);
      expect(DEFAULT_SYSTEM_CONFIG.baseRadiusOverride).toBe(6);
      expect(DEFAULT_SYSTEM_CONFIG.focusRingWidthOverride).toBe(2);
      expect(DEFAULT_SYSTEM_CONFIG.baseTransitionDurationOverride).toBe(150);
    });
  });

  describe('PURE_MATH_CONFIG', () => {
    it('has no overrides', () => {
      expect(PURE_MATH_CONFIG.baseFontSizeOverride).toBeUndefined();
      expect(PURE_MATH_CONFIG.baseRadiusOverride).toBeUndefined();
      expect(PURE_MATH_CONFIG.focusRingWidthOverride).toBeUndefined();
      expect(PURE_MATH_CONFIG.baseTransitionDurationOverride).toBeUndefined();
    });
  });
});

describe('Token Structure Validation', () => {
  const resolvedConfig = resolveConfig(DEFAULT_SYSTEM_CONFIG);

  function validateTokenStructure(token: Token) {
    // Required fields
    expect(token.name).toBeDefined();
    expect(typeof token.name).toBe('string');
    expect(token.name.length).toBeGreaterThan(0);

    expect(token.value).toBeDefined();

    expect(token.category).toBeDefined();
    expect(typeof token.category).toBe('string');

    expect(token.namespace).toBeDefined();
    expect(typeof token.namespace).toBe('string');

    // Optional but commonly present fields should be correct type when present
    if (token.semanticMeaning !== undefined) {
      expect(typeof token.semanticMeaning).toBe('string');
    }

    if (token.usageContext !== undefined) {
      expect(Array.isArray(token.usageContext)).toBe(true);
    }

    if (token.dependsOn !== undefined) {
      expect(Array.isArray(token.dependsOn)).toBe(true);
    }

    if (token.generatedAt !== undefined) {
      expect(typeof token.generatedAt).toBe('string');
      // Should be ISO timestamp
      expect(() => new Date(token.generatedAt!)).not.toThrow();
    }
  }

  describe('generateColorTokens', () => {
    const result = generateColorTokens(resolvedConfig, DEFAULT_COLOR_SCALES);

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('color');
    });

    it('generates tokens array', () => {
      expect(Array.isArray(result.tokens)).toBe(true);
      expect(result.tokens.length).toBeGreaterThan(0);
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });

    it('generates neutral color scale', () => {
      const neutralTokens = result.tokens.filter(
        (t) => t.name.startsWith('neutral-') && t.name !== 'neutral',
      );
      expect(neutralTokens.length).toBeGreaterThanOrEqual(11); // 50-950
    });

    it('color tokens have OKLCH values', () => {
      const colorToken = result.tokens.find((t) => t.name === 'neutral-500');
      expect(colorToken?.value).toMatch(/oklch\(/);
    });
  });

  describe('generateSpacingTokens', () => {
    const result = generateSpacingTokens(resolvedConfig, DEFAULT_SPACING_MULTIPLIERS);

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('spacing');
    });

    it('generates tokens for all scale positions', () => {
      for (const scale of SPACING_SCALE) {
        const token = result.tokens.find((t) => t.name === `spacing-${scale}`);
        expect(token).toBeDefined();
      }
    });

    it('includes base spacing token', () => {
      const baseToken = result.tokens.find((t) => t.name === 'spacing-base');
      expect(baseToken).toBeDefined();
      expect(baseToken?.value).toBe('4px');
    });

    it('calculates correct spacing values', () => {
      const spacing4 = result.tokens.find((t) => t.name === 'spacing-4');
      expect(spacing4?.value).toBe('16px'); // 4 * 4 = 16

      const spacing8 = result.tokens.find((t) => t.name === 'spacing-8');
      expect(spacing8?.value).toBe('32px'); // 4 * 8 = 32
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });
  });

  describe('generateTypographyTokens', () => {
    const result = generateTypographyTokens(
      resolvedConfig,
      DEFAULT_TYPOGRAPHY_SCALE,
      DEFAULT_FONT_WEIGHTS,
    );

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('typography');
    });

    it('generates font size tokens for all scale positions', () => {
      for (const scale of TYPOGRAPHY_SCALE) {
        const token = result.tokens.find((t) => t.name === `font-size-${scale}`);
        expect(token).toBeDefined();
      }
    });

    it('generates line height tokens', () => {
      const lineHeightTokens = result.tokens.filter((t) => t.name.startsWith('line-height-'));
      expect(lineHeightTokens.length).toBeGreaterThan(0);
    });

    it('generates font weight tokens', () => {
      const fontWeightTokens = result.tokens.filter((t) => t.name.startsWith('font-weight-'));
      expect(fontWeightTokens.length).toBeGreaterThan(0);
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });
  });

  describe('generateSemanticTokens', () => {
    const result = generateSemanticTokens(resolvedConfig);

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('semantic');
    });

    it('generates tokens for semantic intents', () => {
      // Check for key semantic tokens
      const primaryToken = result.tokens.find((t) => t.name === 'primary');
      expect(primaryToken).toBeDefined();

      const destructiveToken = result.tokens.find((t) => t.name === 'destructive');
      expect(destructiveToken).toBeDefined();
    });

    it('generates sidebar tokens', () => {
      const sidebarTokens = result.tokens.filter((t) => t.name.startsWith('sidebar-'));
      expect(sidebarTokens.length).toBeGreaterThan(0);
    });

    it('generates chart tokens', () => {
      for (let i = 1; i <= 5; i++) {
        const chartToken = result.tokens.find((t) => t.name === `chart-${i}`);
        expect(chartToken).toBeDefined();
      }
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });
  });

  describe('generateRadiusTokens', () => {
    const result = generateRadiusTokens(resolvedConfig, DEFAULT_RADIUS_DEFINITIONS);

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('radius');
    });

    it('generates tokens for all scale positions', () => {
      for (const scale of RADIUS_SCALE) {
        const tokenName = scale === 'DEFAULT' ? 'radius' : `radius-${scale}`;
        const token = result.tokens.find((t) => t.name === tokenName);
        expect(token).toBeDefined();
      }
    });

    it('includes base radius token', () => {
      const baseToken = result.tokens.find((t) => t.name === 'radius-base');
      expect(baseToken).toBeDefined();
      expect(baseToken?.value).toBe('6px');
    });

    it('radius-none is 0', () => {
      const noneToken = result.tokens.find((t) => t.name === 'radius-none');
      expect(noneToken?.value).toBe('0');
    });

    it('radius-full is 9999px', () => {
      const fullToken = result.tokens.find((t) => t.name === 'radius-full');
      expect(fullToken?.value).toBe('9999px');
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });
  });

  describe('generateShadowTokens', () => {
    const result = generateShadowTokens(resolvedConfig, DEFAULT_SHADOW_DEFINITIONS);

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('shadow');
    });

    it('generates tokens for all scale positions', () => {
      for (const scale of SHADOW_SCALE) {
        const tokenName = scale === 'DEFAULT' ? 'shadow' : `shadow-${scale}`;
        const token = result.tokens.find((t) => t.name === tokenName);
        expect(token).toBeDefined();
      }
    });

    it('shadow-none has no shadow', () => {
      const noneToken = result.tokens.find((t) => t.name === 'shadow-none');
      expect(noneToken?.value).toBe('none');
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });
  });

  describe('generateDepthTokens', () => {
    const result = generateDepthTokens(resolvedConfig, DEFAULT_DEPTH_DEFINITIONS);

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('depth');
    });

    it('generates tokens for all depth levels', () => {
      for (const level of DEPTH_LEVELS) {
        const token = result.tokens.find((t) => t.name === `depth-${level}`);
        expect(token).toBeDefined();
      }
    });

    it('depth values increase appropriately', () => {
      const baseDepth = result.tokens.find((t) => t.name === 'depth-base');
      const tooltipDepth = result.tokens.find((t) => t.name === 'depth-tooltip');

      expect(Number(baseDepth?.value)).toBeLessThan(Number(tooltipDepth?.value));
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });
  });

  describe('generateElevationTokens', () => {
    const result = generateElevationTokens(resolvedConfig, DEFAULT_ELEVATION_DEFINITIONS);

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('elevation');
    });

    it('generates tokens for all elevation levels', () => {
      for (const level of ELEVATION_LEVELS) {
        const token = result.tokens.find((t) => t.name === `elevation-${level}`);
        expect(token).toBeDefined();
      }
    });

    it('elevation tokens have z-index and shadow components', () => {
      for (const level of ELEVATION_LEVELS) {
        const zToken = result.tokens.find((t) => t.name === `elevation-${level}-z`);
        const shadowToken = result.tokens.find((t) => t.name === `elevation-${level}-shadow`);
        expect(zToken).toBeDefined();
        expect(shadowToken).toBeDefined();
      }
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });
  });

  describe('generateMotionTokens', () => {
    const result = generateMotionTokens(
      resolvedConfig,
      DEFAULT_DURATION_DEFINITIONS,
      DEFAULT_EASING_DEFINITIONS,
      DEFAULT_DELAY_MULTIPLIERS,
    );

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('motion');
    });

    it('generates duration tokens for all scale positions', () => {
      for (const scale of MOTION_DURATION_SCALE) {
        const token = result.tokens.find((t) => t.name === `motion-duration-${scale}`);
        expect(token).toBeDefined();
      }
    });

    it('generates easing tokens for all curves', () => {
      for (const curve of EASING_CURVES) {
        const token = result.tokens.find((t) => t.name === `motion-easing-${curve}`);
        expect(token).toBeDefined();
      }
    });

    it('instant duration is 0ms', () => {
      const instantToken = result.tokens.find((t) => t.name === 'motion-duration-instant');
      expect(instantToken?.value).toBe('0ms');
    });

    it('normal duration matches base transition duration', () => {
      const normalToken = result.tokens.find((t) => t.name === 'motion-duration-normal');
      expect(normalToken?.value).toBe('150ms');
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });
  });

  describe('generateFocusTokens', () => {
    const result = generateFocusTokens(resolvedConfig, DEFAULT_FOCUS_CONFIGS);

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('focus');
    });

    it('includes focus ring width token', () => {
      const widthToken = result.tokens.find((t) => t.name === 'focus-ring-width');
      expect(widthToken).toBeDefined();
      expect(widthToken?.value).toBe('2px');
    });

    it('includes focus ring color token', () => {
      const colorToken = result.tokens.find((t) => t.name === 'focus-ring-color');
      expect(colorToken).toBeDefined();
      expect(colorToken?.value).toBe('var(--ring)');
    });

    it('includes default focus ring configuration', () => {
      const focusRing = result.tokens.find((t) => t.name === 'focus-ring');
      expect(focusRing).toBeDefined();
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });
  });

  describe('generateBreakpointTokens', () => {
    const result = generateBreakpointTokens(
      resolvedConfig,
      DEFAULT_BREAKPOINTS,
      DEFAULT_CONTAINER_BREAKPOINTS,
    );

    it('returns correct namespace', () => {
      expect(result.namespace).toBe('breakpoint');
    });

    it('generates viewport breakpoints for all scale positions', () => {
      for (const scale of BREAKPOINT_SCALE) {
        const token = result.tokens.find((t) => t.name === `breakpoint-${scale}`);
        expect(token).toBeDefined();
      }
    });

    it('generates container query breakpoints', () => {
      const cqTokens = result.tokens.filter((t) => t.name.startsWith('breakpoint-cq-'));
      expect(cqTokens.length).toBeGreaterThan(0);
    });

    it('includes accessibility media queries', () => {
      const reducedMotion = result.tokens.find((t) => t.name === 'breakpoint-motion-reduce');
      const dark = result.tokens.find((t) => t.name === 'breakpoint-dark');
      const highContrast = result.tokens.find((t) => t.name === 'breakpoint-high-contrast');

      expect(reducedMotion).toBeDefined();
      expect(dark).toBeDefined();
      expect(highContrast).toBeDefined();
    });

    it('all tokens have valid structure', () => {
      for (const token of result.tokens) {
        validateTokenStructure(token);
      }
    });
  });
});

describe('Orchestration', () => {
  describe('generateBaseSystem', () => {
    it('generates all namespaces', () => {
      const result = generateBaseSystem();
      const namespaces = getAvailableNamespaces();

      for (const namespace of namespaces) {
        expect(result.byNamespace.has(namespace)).toBe(true);
      }
    });

    it('returns metadata with generation timestamp', () => {
      const result = generateBaseSystem();

      expect(result.metadata.generatedAt).toBeDefined();
      expect(() => new Date(result.metadata.generatedAt)).not.toThrow();
    });

    it('returns metadata with resolved config', () => {
      const result = generateBaseSystem();

      expect(result.metadata.config).toBeDefined();
      expect(result.metadata.config.baseSpacingUnit).toBe(4);
      expect(result.metadata.config.baseFontSize).toBe(16);
    });

    it('returns correct token count', () => {
      const result = generateBaseSystem();

      expect(result.metadata.tokenCount).toBe(result.allTokens.length);
      expect(result.metadata.tokenCount).toBeGreaterThan(0);
    });

    it('generates many tokens', () => {
      const result = generateBaseSystem();

      // Should generate a significant number of tokens
      expect(result.allTokens.length).toBeGreaterThan(100);
    });

    it('accepts config overrides', () => {
      const result = generateBaseSystem({
        baseSpacingUnit: 8,
      });

      expect(result.metadata.config.baseSpacingUnit).toBe(8);

      // Spacing should be doubled
      const spacing4 = result.allTokens.find((t) => t.name === 'spacing-4');
      expect(spacing4?.value).toBe('32px'); // 8 * 4 = 32
    });
  });

  describe('generateNamespaces', () => {
    it('generates only requested namespaces', () => {
      const result = generateNamespaces(['color', 'spacing']);

      expect(result.byNamespace.size).toBe(2);
      expect(result.byNamespace.has('color')).toBe(true);
      expect(result.byNamespace.has('spacing')).toBe(true);
      expect(result.byNamespace.has('typography')).toBe(false);
    });

    it('returns empty result for empty namespace array', () => {
      const result = generateNamespaces([]);

      expect(result.byNamespace.size).toBe(0);
      expect(result.allTokens.length).toBe(0);
    });
  });

  describe('toNamespaceJSON', () => {
    it('converts Map to plain object', () => {
      const result = generateBaseSystem();
      const json = toNamespaceJSON(result);

      expect(typeof json).toBe('object');
      expect(Array.isArray(json)).toBe(false);
      expect(json.color).toBeDefined();
      expect(Array.isArray(json.color)).toBe(true);
    });
  });

  describe('toTokenMap', () => {
    it('creates name-to-token map', () => {
      const result = generateBaseSystem();
      const map = toTokenMap(result);

      expect(map instanceof Map).toBe(true);
      expect(map.get('spacing-4')).toBeDefined();
      expect(map.get('radius')).toBeDefined();
    });

    it('allows quick token lookups', () => {
      const result = generateBaseSystem();
      const map = toTokenMap(result);

      const spacing4 = map.get('spacing-4');
      expect(spacing4?.value).toBe('16px');
    });
  });

  describe('getAvailableNamespaces', () => {
    it('returns array of namespace names', () => {
      const namespaces = getAvailableNamespaces();

      expect(Array.isArray(namespaces)).toBe(true);
      expect(namespaces).toContain('color');
      expect(namespaces).toContain('spacing');
      expect(namespaces).toContain('typography');
    });
  });

  describe('getGeneratorInfo', () => {
    it('returns info for all generators', () => {
      const info = getGeneratorInfo();
      const namespaces = getAvailableNamespaces();

      expect(info.length).toBe(namespaces.length);
    });

    it('each generator has name and description', () => {
      const info = getGeneratorInfo();

      for (const gen of info) {
        expect(gen.name).toBeDefined();
        expect(typeof gen.name).toBe('string');
        expect(gen.description).toBeDefined();
        expect(typeof gen.description).toBe('string');
      }
    });
  });
});

describe('Mathematical Relationships', () => {
  describe('Pure Math Config', () => {
    const pureResult = generateBaseSystem({
      ...PURE_MATH_CONFIG,
    });

    it('derived values match formulas from baseSpacingUnit', () => {
      const config = pureResult.metadata.config;

      // baseFontSize = baseSpacingUnit * 4
      expect(config.baseFontSize).toBe(config.baseSpacingUnit * 4);

      // baseRadius = baseSpacingUnit * 1.5
      expect(config.baseRadius).toBe(config.baseSpacingUnit * 1.5);

      // focusRingWidth = baseSpacingUnit / 2
      expect(config.focusRingWidth).toBe(config.baseSpacingUnit / 2);

      // baseTransitionDuration = baseSpacingUnit * 37.5
      expect(config.baseTransitionDuration).toBe(config.baseSpacingUnit * 37.5);
    });
  });

  describe('Different Base Spacing Unit', () => {
    it('scales all values proportionally', () => {
      const base4Result = generateBaseSystem({ baseSpacingUnit: 4 });
      const base8Result = generateBaseSystem({ baseSpacingUnit: 8 });

      // Spacing should scale
      const spacing4_base4 = base4Result.allTokens.find((t) => t.name === 'spacing-4');
      const spacing4_base8 = base8Result.allTokens.find((t) => t.name === 'spacing-4');

      expect(spacing4_base4?.value).toBe('16px'); // 4 * 4
      expect(spacing4_base8?.value).toBe('32px'); // 8 * 4
    });
  });

  describe('Progression Ratio', () => {
    it('can use different progression ratios', () => {
      const minorThird = generateBaseSystem({
        progressionRatio: 'minor-third',
      });
      const perfectFourth = generateBaseSystem({
        progressionRatio: 'perfect-fourth',
      });

      // Both should generate successfully
      expect(minorThird.allTokens.length).toBeGreaterThan(0);
      expect(perfectFourth.allTokens.length).toBeGreaterThan(0);

      // Metadata should reflect the ratio
      expect(minorThird.metadata.config.progressionRatio).toBe('minor-third');
      expect(perfectFourth.metadata.config.progressionRatio).toBe('perfect-fourth');
    });
  });
});

describe('Token Dependencies', () => {
  const result = generateBaseSystem();
  const tokenMap = toTokenMap(result);

  it('spacing tokens depend on spacing-base', () => {
    const spacing4 = tokenMap.get('spacing-4');
    expect(spacing4?.dependsOn).toContain('spacing-base');
  });

  it('elevation tokens depend on depth and shadow', () => {
    const elevationModal = tokenMap.get('elevation-modal');
    expect(elevationModal?.dependsOn).toBeDefined();
    expect(elevationModal?.dependsOn?.length).toBeGreaterThan(0);
  });

  it('focus tokens depend on ring', () => {
    const focusRing = tokenMap.get('focus-ring');
    expect(focusRing?.dependsOn).toContain('ring');
  });
});

describe('Accessibility Metadata', () => {
  const result = generateBaseSystem();
  const tokenMap = toTokenMap(result);

  it('focus tokens have accessibility level', () => {
    const focusRingWidth = tokenMap.get('focus-ring-width');
    expect(focusRingWidth?.accessibilityLevel).toBe('AA');
  });

  it('motion tokens are reduced motion aware', () => {
    const motionDuration = tokenMap.get('motion-duration-normal');
    expect(motionDuration?.reducedMotionAware).toBe(true);
  });

  it('breakpoint tokens include accessibility queries', () => {
    const reducedMotion = tokenMap.get('breakpoint-motion-reduce');
    expect(reducedMotion?.value).toBe('(prefers-reduced-motion: reduce)');
  });
});
