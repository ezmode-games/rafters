/**
 * TDD Tests for Generation Rules Parser and Executor
 *
 * Tests the complete generation rule system including parsing and execution
 * for all supported rule types: calc, state, scale, contrast, and invert.
 */

import type { Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { GenerationRuleExecutor, GenerationRuleParser } from '../src/generation-rules.js';
import { TokenRegistry } from '../src/registry.js';

describe('GenerationRuleParser', () => {
  let parser: GenerationRuleParser;

  beforeEach(() => {
    parser = new GenerationRuleParser();
  });

  describe('Calc Rules', () => {
    it('should parse simple calc rule with single token', () => {
      const rule = 'calc({spacing-base} * 2)';
      const parsed = parser.parse(rule);

      expect(parsed.type).toBe('calc');
      expect(parsed.expression).toBe('{spacing-base} * 2');
      expect(parsed.tokens).toEqual(['spacing-base']);
    });

    it('should parse calc rule with multiple tokens', () => {
      const rule = 'calc({spacing-base} + {spacing-xs})';
      const parsed = parser.parse(rule);

      expect(parsed.type).toBe('calc');
      expect(parsed.expression).toBe('{spacing-base} + {spacing-xs}');
      expect(parsed.tokens).toEqual(['spacing-base', 'spacing-xs']);
    });

    it('should parse calc rule with units', () => {
      const rule = 'calc({spacing-base} + 4px)';
      const parsed = parser.parse(rule);

      expect(parsed.type).toBe('calc');
      expect(parsed.expression).toBe('{spacing-base} + 4px');
      expect(parsed.tokens).toEqual(['spacing-base']);
    });

    it('should parse complex calc rule', () => {
      const rule = 'calc(({width-base} * 2) + ({height-base} / 3) - 8px)';
      const parsed = parser.parse(rule);

      expect(parsed.type).toBe('calc');
      expect(parsed.tokens).toEqual(['width-base', 'height-base']);
    });

    it('should throw error for invalid calc syntax', () => {
      expect(() => parser.parse('calc(')).toThrow('Invalid calc rule');
      expect(() => parser.parse('calc(invalid')).toThrow('Invalid calc rule');
    });
  });

  describe('State Rules', () => {
    it('should parse hover state rule', () => {
      const rule = 'state:hover';
      const parsed = parser.parse(rule);

      expect(parsed.type).toBe('state');
      expect(parsed.state).toBe('hover');
      expect(parsed.baseToken).toBe('');
    });

    it('should parse all valid state types', () => {
      const states = ['hover', 'active', 'focus', 'disabled'];

      states.forEach((state) => {
        const rule = `state:${state}`;
        const parsed = parser.parse(rule);

        expect(parsed.type).toBe('state');
        expect(parsed.state).toBe(state);
      });
    });

    it('should throw error for invalid state', () => {
      expect(() => parser.parse('state:invalid')).toThrow('Invalid state: invalid');
    });

    it('should throw error for malformed state rule', () => {
      expect(() => parser.parse('state:')).toThrow('Invalid state rule');
      expect(() => parser.parse('state')).toThrow('Unknown rule type');
    });
  });

  describe('Scale Rules', () => {
    it('should parse scale rule with numeric position', () => {
      const rule = 'scale:600';
      const parsed = parser.parse(rule);

      expect(parsed.type).toBe('scale');
      expect(parsed.position).toBe('600');
      expect(parsed.baseToken).toBe('');
    });

    it('should parse different scale positions', () => {
      const positions = ['50', '100', '300', '500', '700', '900'];

      positions.forEach((position) => {
        const rule = `scale:${position}`;
        const parsed = parser.parse(rule);

        expect(parsed.type).toBe('scale');
        expect(parsed.position).toBe(position);
      });
    });

    it('should throw error for invalid scale format', () => {
      expect(() => parser.parse('scale:abc')).toThrow('Invalid scale rule');
      expect(() => parser.parse('scale:')).toThrow('Invalid scale rule');
    });
  });

  describe('Contrast Rules', () => {
    it('should parse contrast auto rule', () => {
      const rule = 'contrast:auto';
      const parsed = parser.parse(rule);

      expect(parsed.type).toBe('contrast');
      expect(parsed.mode).toBe('auto');
      expect(parsed.baseToken).toBe('');
    });

    it('should throw error for invalid contrast mode', () => {
      expect(() => parser.parse('contrast:manual')).toThrow('Invalid contrast mode: manual');
    });

    it('should throw error for malformed contrast rule', () => {
      expect(() => parser.parse('contrast:')).toThrow('Invalid contrast rule');
    });
  });

  describe('Invert Rules', () => {
    it('should parse invert rule', () => {
      const rule = 'invert';
      const parsed = parser.parse(rule);

      expect(parsed.type).toBe('invert');
      expect(parsed.baseToken).toBe('');
    });

    it('should throw error for malformed invert rule', () => {
      expect(() => parser.parse('invert:something')).toThrow('Unknown rule type');
      expect(() => parser.parse('invertcolor')).toThrow('Unknown rule type');
    });
  });

  describe('Unknown Rules', () => {
    it('should throw error for unknown rule types', () => {
      expect(() => parser.parse('unknown:rule')).toThrow('Unknown rule type');
      expect(() => parser.parse('invalid')).toThrow('Unknown rule type');
      expect(() => parser.parse('')).toThrow('Unknown rule type');
    });
  });
});

describe('GenerationRuleExecutor', () => {
  let executor: GenerationRuleExecutor;
  let registry: TokenRegistry;
  let parser: GenerationRuleParser;

  beforeEach(() => {
    registry = new TokenRegistry();
    executor = new GenerationRuleExecutor(registry);
    parser = new GenerationRuleParser();

    // Add test tokens to registry
    const testTokens: Token[] = [
      { name: 'spacing-base', value: '16px', category: 'spacing', namespace: 'spacing' },
      { name: 'spacing-xs', value: '4px', category: 'spacing', namespace: 'spacing' },
      { name: 'spacing-lg', value: '32px', category: 'spacing', namespace: 'spacing' },
      { name: 'primary', value: 'oklch(0.6 0.15 240)', category: 'color', namespace: 'color' },
      { name: 'secondary', value: 'oklch(0.7 0.12 120)', category: 'color', namespace: 'color' },
      {
        name: 'neutral-family',
        value: {
          scale: [
            { l: 0.95, c: 0.01, h: 240 }, // position 0 (50)
            { l: 0.9, c: 0.01, h: 240 }, // position 1 (100)
            { l: 0.85, c: 0.01, h: 240 }, // position 2 (200)
            { l: 0.8, c: 0.01, h: 240 }, // position 3 (300)
            { l: 0.7, c: 0.01, h: 240 }, // position 4 (400)
            { l: 0.6, c: 0.01, h: 240 }, // position 5 (500)
            { l: 0.5, c: 0.01, h: 240 }, // position 6 (600)
            { l: 0.4, c: 0.01, h: 240 }, // position 7 (700)
            { l: 0.3, c: 0.01, h: 240 }, // position 8 (800)
            { l: 0.2, c: 0.01, h: 240 }, // position 9 (900)
          ],
        },
        category: 'color-family',
        namespace: 'neutral',
      },
    ];

    for (const token of testTokens) {
      registry.add(token);
    }
  });

  describe('Calc Rule Execution', () => {
    it('should execute simple multiplication calc rule', () => {
      const rule = parser.parse('calc({spacing-base} * 2)');
      const result = executor.execute(rule, 'spacing-xl');

      expect(result).toBe('32px');
    });

    it('should execute addition calc rule', () => {
      const rule = parser.parse('calc({spacing-base} + {spacing-xs})');
      const result = executor.execute(rule, 'spacing-custom');

      expect(result).toBe('20px');
    });

    it('should execute calc rule with mixed operations', () => {
      const rule = parser.parse('calc({spacing-lg} / 2 + {spacing-xs})');
      const result = executor.execute(rule, 'spacing-mixed');

      expect(result).toBe('20px');
    });

    it('should handle calc rule with units', () => {
      const rule = parser.parse('calc({spacing-base} + 8px)');
      const result = executor.execute(rule, 'spacing-plus');

      expect(result).toBe('24px');
    });

    it('should handle calc rule with decimal results', () => {
      const rule = parser.parse('calc({spacing-lg} / 3)');
      const result = executor.execute(rule, 'spacing-third');

      expect(result).toBe('10.666666666666666px');
    });

    it('should throw error when referenced token does not exist', () => {
      const rule = parser.parse('calc({nonexistent-token} * 2)');

      expect(() => executor.execute(rule, 'test-token')).toThrow(
        'Token nonexistent-token not found'
      );
    });

    it('should throw error for unsafe expressions', () => {
      const rule = { type: 'calc', expression: 'eval("malicious")', tokens: [] } as {
        type: 'calc';
        expression: string;
        tokens: string[];
      };

      expect(() => executor.execute(rule, 'test-token')).toThrow('Unsafe expression');
    });
  });

  describe('State Rule Execution', () => {
    it('should execute hover state rule', () => {
      // Add primary token and dependent hover token
      registry.add({ name: 'primary-hover', value: '', category: 'color', namespace: 'color' });

      const rule = parser.parse('state:hover');
      const result = executor.execute(rule, 'primary-hover');

      expect(result).toBe('oklch(0.650 0.15 240)');
    });

    it('should execute active state rule', () => {
      registry.add({ name: 'primary-active', value: '', category: 'color', namespace: 'color' });

      const rule = parser.parse('state:active');
      const result = executor.execute(rule, 'primary-active');

      expect(result).toBe('oklch(0.550 0.15 240)');
    });

    it('should execute focus state rule', () => {
      registry.add({ name: 'primary-focus', value: '', category: 'color', namespace: 'color' });

      const rule = parser.parse('state:focus');
      const result = executor.execute(rule, 'primary-focus');

      expect(result).toBe('oklch(0.630 0.15 240)');
    });

    it('should execute disabled state rule', () => {
      registry.add({ name: 'primary-disabled', value: '', category: 'color', namespace: 'color' });

      const rule = parser.parse('state:disabled');
      const result = executor.execute(rule, 'primary-disabled');

      expect(result).toBe('oklch(0.800 0.15 240)');
    });

    it('should handle non-OKLCH colors by returning as-is', () => {
      registry.add({ name: 'hex-color', value: '#ff0000', category: 'color', namespace: 'color' });
      registry.add({ name: 'hex-color-hover', value: '', category: 'color', namespace: 'color' });

      const rule = parser.parse('state:hover');
      const result = executor.execute(rule, 'hex-color-hover');

      expect(result).toBe('#ff0000');
    });

    it('should throw error when base token does not exist', () => {
      registry.add({ name: 'nonexistent-hover', value: '', category: 'color', namespace: 'color' });

      const rule = parser.parse('state:hover');

      expect(() => executor.execute(rule, 'nonexistent-hover')).toThrow(
        'Base token nonexistent not found'
      );
    });
  });

  describe('Scale Rule Execution', () => {
    it('should execute scale rule for position 600', () => {
      // Add scale token with dependency
      registry.add({ name: 'neutral-600', value: '', category: 'color', namespace: 'color' });
      registry.dependencyGraph.addDependency('neutral-600', ['neutral-family'], 'scale:600');

      const rule = parser.parse('scale:600');
      const result = executor.execute(rule, 'neutral-600');

      expect(result).toBe('oklch(0.500 0.010 240.0)');
    });

    it('should execute scale rule for position 300', () => {
      registry.add({ name: 'neutral-300', value: '', category: 'color', namespace: 'color' });
      registry.dependencyGraph.addDependency('neutral-300', ['neutral-family'], 'scale:300');

      const rule = parser.parse('scale:300');
      const result = executor.execute(rule, 'neutral-300');

      expect(result).toBe('oklch(0.800 0.010 240.0)');
    });

    it('should throw error when no dependencies found', () => {
      registry.add({ name: 'isolated-token', value: '', category: 'color', namespace: 'color' });

      const rule = parser.parse('scale:500');

      expect(() => executor.execute(rule, 'isolated-token')).toThrow(
        'No dependencies found for scale rule'
      );
    });

    it('should throw error when base token is not ColorValue', () => {
      registry.add({ name: 'text-token', value: 'some text', category: 'text', namespace: 'text' });
      registry.add({ name: 'derived-token', value: '', category: 'color', namespace: 'color' });
      registry.dependencyGraph.addDependency('derived-token', ['text-token'], 'scale:500');

      const rule = parser.parse('scale:500');

      expect(() => executor.execute(rule, 'derived-token')).toThrow(
        'ColorValue token text-token not found'
      );
    });

    it('should throw error when scale position does not exist', () => {
      registry.add({ name: 'neutral-1000', value: '', category: 'color', namespace: 'color' });
      registry.dependencyGraph.addDependency('neutral-1000', ['neutral-family'], 'scale:1000');

      const rule = parser.parse('scale:1000');

      expect(() => executor.execute(rule, 'neutral-1000')).toThrow('Scale position 1000 not found');
    });
  });

  describe('Contrast Rule Execution', () => {
    it('should execute contrast rule for light color (return dark)', () => {
      registry.add({
        name: 'light-base',
        value: 'oklch(0.8 0.1 120)',
        category: 'color',
        namespace: 'color',
      });
      registry.add({ name: 'light-contrast', value: '', category: 'color', namespace: 'color' });
      registry.dependencyGraph.addDependency('light-contrast', ['light-base'], 'contrast:auto');

      const rule = parser.parse('contrast:auto');
      const result = executor.execute(rule, 'light-contrast');

      expect(result).toBe('oklch(0 0 0)'); // Black for light base
    });

    it('should execute contrast rule for dark color (return light)', () => {
      registry.add({
        name: 'dark-base',
        value: 'oklch(0.2 0.1 240)',
        category: 'color',
        namespace: 'color',
      });
      registry.add({ name: 'dark-contrast', value: '', category: 'color', namespace: 'color' });
      registry.dependencyGraph.addDependency('dark-contrast', ['dark-base'], 'contrast:auto');

      const rule = parser.parse('contrast:auto');
      const result = executor.execute(rule, 'dark-contrast');

      expect(result).toBe('oklch(1 0 0)'); // White for dark base
    });

    it('should handle non-OKLCH colors by returning black', () => {
      registry.add({ name: 'hex-base', value: '#ff0000', category: 'color', namespace: 'color' });
      registry.add({ name: 'hex-contrast', value: '', category: 'color', namespace: 'color' });
      registry.dependencyGraph.addDependency('hex-contrast', ['hex-base'], 'contrast:auto');

      const rule = parser.parse('contrast:auto');
      const result = executor.execute(rule, 'hex-contrast');

      expect(result).toBe('oklch(0 0 0)');
    });

    it('should throw error when no dependencies found', () => {
      registry.add({ name: 'isolated-contrast', value: '', category: 'color', namespace: 'color' });

      const rule = parser.parse('contrast:auto');

      expect(() => executor.execute(rule, 'isolated-contrast')).toThrow(
        'No dependencies found for contrast rule'
      );
    });
  });

  describe('Invert Rule Execution', () => {
    it('should execute invert rule for OKLCH color', () => {
      registry.add({
        name: 'light-token',
        value: 'oklch(0.7 0.15 120)',
        category: 'color',
        namespace: 'color',
      });
      registry.add({ name: 'light-inverted', value: '', category: 'color', namespace: 'color' });
      registry.dependencyGraph.addDependency('light-inverted', ['light-token'], 'invert');

      const rule = parser.parse('invert');
      const result = executor.execute(rule, 'light-inverted');

      expect(result).toBe('oklch(0.300 0.15 120)'); // Inverted lightness
    });

    it('should execute invert rule for dark color', () => {
      registry.add({
        name: 'dark-token',
        value: 'oklch(0.2 0.1 240)',
        category: 'color',
        namespace: 'color',
      });
      registry.add({ name: 'dark-inverted', value: '', category: 'color', namespace: 'color' });
      registry.dependencyGraph.addDependency('dark-inverted', ['dark-token'], 'invert');

      const rule = parser.parse('invert');
      const result = executor.execute(rule, 'dark-inverted');

      expect(result).toBe('oklch(0.800 0.1 240)');
    });

    it('should handle non-OKLCH colors by returning unchanged', () => {
      registry.add({ name: 'hex-token', value: '#ff0000', category: 'color', namespace: 'color' });
      registry.add({ name: 'hex-inverted', value: '', category: 'color', namespace: 'color' });
      registry.dependencyGraph.addDependency('hex-inverted', ['hex-token'], 'invert');

      const rule = parser.parse('invert');
      const result = executor.execute(rule, 'hex-inverted');

      expect(result).toBe('#ff0000');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for unknown rule types', () => {
      const unknownRule = { type: 'unknown' } as { type: string };

      expect(() => executor.execute(unknownRule, 'test-token')).toThrow(
        'Unknown rule type: unknown'
      );
    });
  });
});
