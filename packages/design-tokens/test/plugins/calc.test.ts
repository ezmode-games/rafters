/**
 * Calc Plugin Tests
 *
 * Tests the calc plugin that evaluates mathematical expressions with token references
 * and mathematical progression systems integration.
 */

import type { Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import calcPlugin from '../../src/plugins/calc.js';
import { TokenRegistry } from '../../src/registry.js';

describe('Calc Plugin', () => {
  let registry: TokenRegistry;

  beforeEach(() => {
    registry = new TokenRegistry();

    const mockTokens: Token[] = [
      { name: 'spacing-base', value: '16px', category: 'spacing', namespace: 'spacing' },
      { name: 'spacing-xs', value: '4px', category: 'spacing', namespace: 'spacing' },
      { name: 'rounded-sm', value: '0.25rem', category: 'border-radius', namespace: 'border' },
      {
        name: 'spacing-double',
        value: '', // Will be calculated
        category: 'spacing',
        namespace: 'spacing',
        mathRelationship: '{spacing-base} * 2',
      },
      {
        name: 'rounded-golden',
        value: '', // Will be calculated
        category: 'border-radius',
        namespace: 'border',
        mathRelationship: '{rounded-sm} * golden',
      },
      {
        name: 'spacing-base-2x', // Pattern-based naming
        value: '',
        category: 'spacing',
        namespace: 'spacing',
      },
    ];

    for (const token of mockTokens) {
      registry.add(token);
    }
  });

  describe('Mathematical Relationship Execution', () => {
    it('should execute mathRelationship from token metadata', () => {
      const result = calcPlugin(registry, 'spacing-double', ['spacing-base']);
      expect(result).toBe('32px');
    });

    it('should execute golden ratio calculations', () => {
      const result = calcPlugin(registry, 'rounded-golden', ['rounded-sm']);
      expect(Number.parseFloat(result)).toBeCloseTo(0.4045, 3);
    });
  });

  describe('Token Name Pattern Inference', () => {
    it('should infer multiplication from token name pattern', () => {
      const result = calcPlugin(registry, 'spacing-base-2x', ['spacing-base']);
      expect(result).toBe('32px');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when token has no calc expression', () => {
      expect(() => {
        calcPlugin(registry, 'spacing-base', []); // No mathRelationship or pattern
      }).toThrow('Unsafe expression'); // The fallback pattern creates an unsafe expression
    });

    it('should throw error when dependency token not found', () => {
      expect(() => {
        calcPlugin(registry, 'spacing-double', ['nonexistent-token']);
      }).toThrow('Dependency token nonexistent-token not found for calc rule');
    });
  });

  describe('Mathematical Constants Integration', () => {
    it('should support golden ratio constant', () => {
      // Token with golden ratio in mathRelationship
      const goldenToken: Token = {
        name: 'test-golden',
        value: '',
        category: 'test',
        namespace: 'test',
        mathRelationship: '{spacing-base} * golden',
      };
      registry.add(goldenToken);

      const result = calcPlugin(registry, 'test-golden', ['spacing-base']);
      expect(Number.parseFloat(result)).toBeCloseTo(25.89, 1); // 16 * 1.618
    });

    it('should support musical ratio constants', () => {
      const majorThirdToken: Token = {
        name: 'test-major-third',
        value: '',
        category: 'test',
        namespace: 'test',
        mathRelationship: '{spacing-base} * major-third',
      };
      registry.add(majorThirdToken);

      const result = calcPlugin(registry, 'test-major-third', ['spacing-base']);
      expect(result).toBe('20px'); // 16 * 1.25
    });
  });

  describe('Cross-Category Operations', () => {
    it('should handle mixed unit calculations', () => {
      const mixedToken: Token = {
        name: 'mixed-units',
        value: '',
        category: 'test',
        namespace: 'test',
        mathRelationship: '{spacing-base} + {rounded-sm}',
      };
      registry.add(mixedToken);

      const result = calcPlugin(registry, 'mixed-units', ['spacing-base', 'rounded-sm']);
      expect(result).toBe('16.25px'); // px takes precedence as the first unit found
    });
  });

  describe('Pattern-Based Inference', () => {
    it('should handle double/2x patterns', () => {
      const patterns = ['spacing-base-double', 'spacing-base-2x'];

      patterns.forEach((pattern) => {
        const token: Token = {
          name: pattern,
          value: '',
          category: 'spacing',
          namespace: 'spacing',
        };
        registry.add(token);

        const result = calcPlugin(registry, pattern, ['spacing-base']);
        expect(result).toBe('32px');
      });
    });

    it('should handle musical ratio patterns', () => {
      const token: Token = {
        name: 'spacing-base-major-third',
        value: '',
        category: 'spacing',
        namespace: 'spacing',
      };
      registry.add(token);

      const result = calcPlugin(registry, 'spacing-base-major-third', ['spacing-base']);
      expect(result).toBe('20px'); // 16 * 1.25
    });

    it('should handle golden ratio patterns', () => {
      const token: Token = {
        name: 'spacing-base-golden',
        value: '',
        category: 'spacing',
        namespace: 'spacing',
      };
      registry.add(token);

      const result = calcPlugin(registry, 'spacing-base-golden', ['spacing-base']);
      expect(Number.parseFloat(result)).toBeCloseTo(25.89, 1); // 16 * 1.618
    });
  });
});
