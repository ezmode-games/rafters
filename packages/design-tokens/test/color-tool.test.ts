/**
 * Tests for the smart color tool
 */

import { describe, expect, it } from 'vitest';
import {
  SmartColorTokenSchema,
  createColorDesignSystem,
  generateIntelligentColorScale,
} from '../src/color-tool';

describe('SmartColorTokenSchema', () => {
  it('generates accessible color states automatically', () => {
    const testColor = {
      name: '--color-primary',
      base: { l: 0.3, c: 0.15, h: 220, alpha: 1 }, // Darker base for better contrast
      background: { l: 1, c: 0, h: 0, alpha: 1 },
      category: 'color' as const,
      type: 'dynamic' as const,
      semanticGroup: 'brand' as const,
      aiIntelligence: {
        cognitiveLoad: 3,
        trustLevel: 'high' as const,
        accessibilityLevel: 'aaa' as const,
      },
    };

    const result = SmartColorTokenSchema.parse(testColor);

    expect(result.name).toBe('--color-primary');
    expect(result.base.l).toBe(0.3);
    expect(result.states).toBeDefined();
    expect(result.states.base).toBeDefined();
    expect(result.states.hover).toBeDefined();
    expect(result.states.focus).toBeDefined();
    expect(result.states.active).toBeDefined();
    expect(result.accessibility).toBeDefined();
    expect(result.accessibility.baseContrast).toBeGreaterThan(4.5);
  });
});

describe('generateIntelligentColorScale', () => {
  it('creates a complete color scale with semantic suggestions', () => {
    const baseColor = { l: 0.6, c: 0.2, h: 210, alpha: 1 };
    const background = { l: 1, c: 0, h: 0, alpha: 1 };

    const result = generateIntelligentColorScale(baseColor, background);

    expect(result.scale).toBeDefined();
    expect(Object.keys(result.scale)).toEqual([
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
    ]);
    expect(result.semantic).toBeDefined();
    expect(result.semantic.danger).toHaveLength(3);
    expect(result.semantic.success).toHaveLength(3);
    expect(result.semantic.warning).toHaveLength(3);
    expect(result.semantic.info).toHaveLength(3);
    expect(result.smartTokens).toHaveLength(6); // Only accessible weights: 400-900
  });
});

describe('createColorDesignSystem', () => {
  it('generates a complete design system with primary and semantic colors', () => {
    const primaryColor = { l: 0.55, c: 0.18, h: 240, alpha: 1 };

    const system = createColorDesignSystem(primaryColor);

    expect(system.primary).toBeDefined();
    expect(system.semantic).toBeDefined();
    expect(system.allTokens).toBeDefined();

    // Should have primary tokens (6) + semantic tokens (12 = 4 types × 3 options)
    expect(system.allTokens).toHaveLength(18);

    // All tokens should have accessibility data
    for (const token of system.allTokens) {
      expect(token.accessibility).toBeDefined();
      expect(token.accessibility.baseContrast).toBeGreaterThan(3); // At least AA level
      expect(token.states).toBeDefined();
    }
  });
});
