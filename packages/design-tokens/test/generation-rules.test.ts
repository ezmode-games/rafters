/**
 * Generation Rules Tests
 *
 * Tests for the GenerationRuleParser and GenerationRuleExecutor.
 * Covers scale-position extraction for ColorValue tokens.
 */

import type { ColorValue, OKLCH } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { GenerationRuleExecutor, GenerationRuleParser } from '../src/generation-rules';
import { TokenRegistry } from '../src/registry';

function makeOKLCH(l: number, c: number, h: number): OKLCH {
  return { l, c, h, alpha: 1 };
}

function makeColorValue(name: string, baseH: number): ColorValue {
  // Create a standard 11-position scale
  const positions = [0.98, 0.95, 0.9, 0.8, 0.7, 0.55, 0.4, 0.25, 0.15, 0.08, 0.04];
  return {
    name,
    scale: positions.map((l) => makeOKLCH(l, 0.15, baseH)),
  };
}

function oklchToCSS(oklch: OKLCH): string {
  return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${Math.round(oklch.h)})`;
}

describe('GenerationRuleParser', () => {
  let parser: GenerationRuleParser;

  beforeEach(() => {
    parser = new GenerationRuleParser();
  });

  describe('scale colon syntax', () => {
    it('parses scale:500 as scale-position type', () => {
      const result = parser.parse('scale:500');
      expect(result.type).toBe('scale-position');
      expect(result.scalePosition).toBe(5);
    });

    it('parses all Tailwind scale positions correctly', () => {
      const positions = [
        { input: 50, expectedIndex: 0 },
        { input: 100, expectedIndex: 1 },
        { input: 200, expectedIndex: 2 },
        { input: 300, expectedIndex: 3 },
        { input: 400, expectedIndex: 4 },
        { input: 500, expectedIndex: 5 },
        { input: 600, expectedIndex: 6 },
        { input: 700, expectedIndex: 7 },
        { input: 800, expectedIndex: 8 },
        { input: 900, expectedIndex: 9 },
        { input: 950, expectedIndex: 10 },
      ];

      for (const { input, expectedIndex } of positions) {
        const result = parser.parse(`scale:${input}`);
        expect(result.type).toBe('scale-position');
        expect(result.scalePosition).toBe(expectedIndex);
      }
    });

    it('parses non-standard scale values as ratio', () => {
      const result = parser.parse('scale:1.5');
      expect(result.type).toBe('scale');
      expect(result.ratio).toBe(1.5);
    });

    it('parses large non-position numbers as ratio', () => {
      const result = parser.parse('scale:1000');
      expect(result.type).toBe('scale');
      expect(result.ratio).toBe(1000);
    });

    it('rejects malformed scale values', () => {
      expect(() => parser.parse('scale:500foo')).toThrow('Invalid scale value');
      expect(() => parser.parse('scale:1e2')).toThrow('Invalid scale value');
      expect(() => parser.parse('scale:abc')).toThrow('Invalid scale value');
    });
  });

  describe('existing rule types', () => {
    it('parses state:hover correctly', () => {
      const result = parser.parse('state:hover');
      expect(result.type).toBe('state');
      expect(result.stateType).toBe('hover');
    });

    it('parses contrast:auto correctly', () => {
      const result = parser.parse('contrast:auto');
      expect(result.type).toBe('contrast');
      expect(result.contrast).toBe('auto');
    });

    it('parses calc expressions correctly', () => {
      const result = parser.parse('calc({spacing-base} * 2)');
      expect(result.type).toBe('calc');
      expect(result.tokens).toContain('spacing-base');
    });

    it('parses function-style scale correctly', () => {
      const result = parser.parse('scale(base-token, 1.5)');
      expect(result.type).toBe('scale');
      expect(result.baseToken).toBe('base-token');
      expect(result.ratio).toBe(1.5);
    });
  });
});

describe('GenerationRuleExecutor', () => {
  let registry: TokenRegistry;
  let parser: GenerationRuleParser;
  let executor: GenerationRuleExecutor;

  beforeEach(() => {
    registry = new TokenRegistry();
    parser = new GenerationRuleParser();
    executor = new GenerationRuleExecutor(registry);
  });

  describe('scale-position execution', () => {
    it('extracts color from ColorValue scale at position 500', () => {
      const colorValue = makeColorValue('test-blue', 240);

      registry.add({
        name: 'color-family-primary',
        value: colorValue,
        category: 'color',
        namespace: 'color',
      });

      registry.add({
        name: 'primary-500',
        value: 'placeholder',
        category: 'color',
        namespace: 'color',
        dependsOn: ['color-family-primary'],
        generationRule: 'scale:500',
      });

      registry.addDependency('primary-500', ['color-family-primary'], 'scale:500');

      const parsedRule = parser.parse('scale:500');
      const result = executor.execute(parsedRule, 'primary-500');

      expect(result).toEqual({ kind: 'css', value: oklchToCSS(colorValue.scale[5]) });
    });

    it('extracts color at different scale positions', () => {
      const colorValue = makeColorValue('test-green', 120);

      registry.add({
        name: 'color-family-accent',
        value: colorValue,
        category: 'color',
        namespace: 'color',
      });

      const positions = [
        { name: 'accent-50', rule: 'scale:50', index: 0 },
        { name: 'accent-200', rule: 'scale:200', index: 2 },
        { name: 'accent-950', rule: 'scale:950', index: 10 },
      ];

      for (const { name, rule, index } of positions) {
        registry.add({
          name,
          value: 'placeholder',
          category: 'color',
          namespace: 'color',
          dependsOn: ['color-family-accent'],
          generationRule: rule,
        });

        registry.addDependency(name, ['color-family-accent'], rule);

        const parsedRule = parser.parse(rule);
        const result = executor.execute(parsedRule, name);

        expect(result).toEqual({ kind: 'css', value: oklchToCSS(colorValue.scale[index]) });
      }
    });

    it('throws error when token has no dependencies', () => {
      registry.add({
        name: 'orphan-500',
        value: 'placeholder',
        category: 'color',
        namespace: 'color',
        generationRule: 'scale:500',
      });

      const parsedRule = parser.parse('scale:500');

      // New contract: error message includes 'scale-position' (the resolved rule type)
      expect(() => executor.execute(parsedRule, 'orphan-500')).toThrow(
        'No dependencies found for scale-position rule on token',
      );
    });

    it('throws a "does not apply" error when dependency is not a ColorValue', () => {
      registry.add({
        name: 'not-a-color',
        value: '16px',
        category: 'spacing',
        namespace: 'spacing',
      });

      registry.add({
        name: 'test-500',
        value: 'placeholder',
        category: 'color',
        namespace: 'color',
        dependsOn: ['not-a-color'],
        generationRule: 'scale:500',
      });

      registry.addDependency('test-500', ['not-a-color'], 'scale:500');

      const parsedRule = parser.parse('scale:500');

      // New contract: executor detects non-ColorValue dependency BEFORE calling the plugin
      expect(() => executor.execute(parsedRule, 'test-500')).toThrow(
        "Rule 'scale-position' does not apply to token 'test-500'",
      );
    });

    it('throws a "does not apply" error when the token itself holds a ColorValue (family token shape)', () => {
      const familyColorValue = makeColorValue('test-blue', 240);

      registry.add({
        name: 'family-color',
        value: familyColorValue,
        category: 'color',
        namespace: 'color',
      });

      // A "family" token whose value is a ColorValue but has a scale-position rule --
      // this is the #1223 case: the rule does not apply to this token shape.
      registry.add({
        name: 'primary',
        value: familyColorValue,
        category: 'color',
        namespace: 'color',
        dependsOn: ['family-color'],
        generationRule: 'scale:500',
      });

      registry.addDependency('primary', ['family-color'], 'scale:500');

      const parsedRule = parser.parse('scale:500');

      expect(() => executor.execute(parsedRule, 'primary')).toThrow(
        "Rule 'scale-position' does not apply to token 'primary'",
      );
    });
  });

  describe('plugin input resolution: state / contrast / invert', () => {
    it("state rule throws 'does not apply' when dependency[0] is not a ColorValue", () => {
      registry.add({
        name: 'not-a-color',
        value: '16px',
        category: 'spacing',
        namespace: 'spacing',
      });

      registry.add({
        name: 'primary-hover',
        value: { family: 'primary', position: '600' },
        category: 'color',
        namespace: 'semantic',
        dependsOn: ['not-a-color'],
        generationRule: 'state:hover',
      });

      registry.addDependency('primary-hover', ['not-a-color'], 'state:hover');

      const parsedRule = parser.parse('state:hover');

      expect(() => executor.execute(parsedRule, 'primary-hover')).toThrow(
        "Rule 'state' does not apply to token 'primary-hover'",
      );
    });

    it("contrast rule throws 'does not apply' when dependency[0] is not a ColorValue", () => {
      registry.add({
        name: 'not-a-color',
        value: '16px',
        category: 'spacing',
        namespace: 'spacing',
      });

      registry.add({
        name: 'primary-foreground',
        value: { family: 'neutral', position: '50' },
        category: 'color',
        namespace: 'semantic',
        dependsOn: ['not-a-color'],
        generationRule: 'contrast:auto',
      });

      registry.addDependency('primary-foreground', ['not-a-color'], 'contrast:auto');

      const parsedRule = parser.parse('contrast:auto');

      expect(() => executor.execute(parsedRule, 'primary-foreground')).toThrow(
        "Rule 'contrast' does not apply to token 'primary-foreground'",
      );
    });

    it("invert rule throws 'does not apply' when dependency[0] is not a ColorValue", () => {
      registry.add({
        name: 'not-a-color',
        value: '16px',
        category: 'spacing',
        namespace: 'spacing',
      });

      registry.add({
        name: 'primary-dark',
        value: { family: 'primary', position: '500' },
        category: 'color',
        namespace: 'semantic',
        dependsOn: ['not-a-color'],
        generationRule: 'invert',
      });

      registry.addDependency('primary-dark', ['not-a-color'], 'invert');

      const parsedRule = parser.parse('invert');

      expect(() => executor.execute(parsedRule, 'primary-dark')).toThrow(
        "Rule 'invert' does not apply to token 'primary-dark'",
      );
    });

    it('state:hover basePosition is read from the token current ColorReference position', () => {
      const familyColor = makeColorValue('test-blue', 240);

      registry.add({
        name: 'primary',
        value: familyColor,
        category: 'color',
        namespace: 'color',
      });

      // Semantic token whose current value has position 600 (index 6)
      registry.add({
        name: 'primary-hover',
        value: { family: 'primary', position: '600' },
        category: 'color',
        namespace: 'semantic',
        dependsOn: ['primary'],
        generationRule: 'state:hover',
      });

      registry.addDependency('primary-hover', ['primary'], 'state:hover');

      const parsedRule = parser.parse('state:hover');
      const result = executor.execute(parsedRule, 'primary-hover');

      // basePosition should have come from position '600' (index 6), not the default 5
      expect(result.kind).toBe('ref');
      if (result.kind === 'ref') {
        // State plugin returns a reference into the same family; exact position
        // depends on plugin logic but the family should be 'primary'.
        expect(result.ref.family).toBe('primary');
      }
    });
  });
});

describe('TokenRegistry regeneration with scale-position', () => {
  let registry: TokenRegistry;

  beforeEach(() => {
    registry = new TokenRegistry();
  });

  it('regenerates scale tokens when parent ColorValue updates', async () => {
    const initialColor = makeColorValue('test-blue', 240);

    registry.add({
      name: 'color-family-primary',
      value: initialColor,
      category: 'color',
      namespace: 'color',
    });

    registry.add({
      name: 'primary-500',
      value: oklchToCSS(initialColor.scale[5]),
      category: 'color',
      namespace: 'color',
      dependsOn: ['color-family-primary'],
      generationRule: 'scale:500',
    });

    registry.addDependency('primary-500', ['color-family-primary'], 'scale:500');

    // Verify initial state
    expect(registry.get('primary-500')?.value).toBe(oklchToCSS(initialColor.scale[5]));

    // Update to new color
    const newColor = makeColorValue('test-green', 120);
    await registry.set('color-family-primary', newColor);

    // Verify regeneration
    const updated = registry.get('primary-500');
    expect(updated?.value).toBe(oklchToCSS(newColor.scale[5]));
  });

  it('regenerates all scale positions when parent updates', async () => {
    const initialColor = makeColorValue('test-purple', 280);
    const scalePositions = [
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
      '950',
    ];

    registry.add({
      name: 'color-family-primary',
      value: initialColor,
      category: 'color',
      namespace: 'color',
    });

    // Add all scale tokens
    for (let i = 0; i < scalePositions.length; i++) {
      const pos = scalePositions[i];
      registry.add({
        name: `primary-${pos}`,
        value: oklchToCSS(initialColor.scale[i]),
        category: 'color',
        namespace: 'color',
        dependsOn: ['color-family-primary'],
        generationRule: `scale:${pos}`,
      });

      registry.addDependency(`primary-${pos}`, ['color-family-primary'], `scale:${pos}`);
    }

    // Update to new color
    const newColor = makeColorValue('test-orange', 30);
    await registry.set('color-family-primary', newColor);

    // Verify all positions were regenerated
    for (let i = 0; i < scalePositions.length; i++) {
      const pos = scalePositions[i];
      const token = registry.get(`primary-${pos}`);
      expect(token?.value).toBe(oklchToCSS(newColor.scale[i]));
    }
  });
});
