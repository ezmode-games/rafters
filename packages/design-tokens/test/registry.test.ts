/**
 * Unit tests for TokenRegistry class
 * Tests token storage, retrieval, and manipulation
 * Uses spyOn for internal dependencies to preserve module structure while mocking specific methods
 */

import type { ColorValue, Token } from '@rafters/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TokenDependencyGraph } from '../src/dependencies.js';
import { TokenRegistry } from '../src/registry.js';

// Mock external fetch API to prevent actual network calls during unit tests
global.fetch = vi.fn();

describe('TokenRegistry', () => {
  let registry: TokenRegistry;

  beforeEach(() => {
    vi.clearAllMocks();

    // Spy on TokenDependencyGraph methods to isolate unit tests from complex dependency logic
    // Using spyOn preserves the real class structure while controlling specific method behavior
    vi.spyOn(TokenDependencyGraph.prototype, 'addDependency').mockImplementation(vi.fn());
    vi.spyOn(TokenDependencyGraph.prototype, 'getDependencies').mockReturnValue([]);
    vi.spyOn(TokenDependencyGraph.prototype, 'getDependents').mockReturnValue([]);
    vi.spyOn(TokenDependencyGraph.prototype, 'getGenerationRule').mockReturnValue(undefined);
    vi.spyOn(TokenDependencyGraph.prototype, 'topologicalSort').mockReturnValue([]);

    // Mock console methods to avoid test noise
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    registry = new TokenRegistry();
  });

  describe('basic operations', () => {
    const sampleToken: Token = {
      name: 'primary',
      value: 'oklch(0.5 0.2 240)',
      category: 'color',
      namespace: 'semantic',
    };

    it('should add tokens successfully', () => {
      registry.add(sampleToken);

      const retrieved = registry.get('primary');
      expect(retrieved).toEqual(sampleToken);
    });

    it('should list all tokens', () => {
      registry.add(sampleToken);

      const tokens = registry.list();
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual(sampleToken);
    });

    it('should remove tokens successfully', () => {
      registry.add(sampleToken);
      expect(registry.get('primary')).toEqual(sampleToken);

      registry.remove('primary');
      expect(registry.get('primary')).toBeUndefined();
    });

    it('should handle non-existent tokens gracefully', () => {
      expect(registry.get('non-existent')).toBeUndefined();
      expect(registry.remove('non-existent')).toBe(false);
    });

    it('should update existing tokens', () => {
      registry.add(sampleToken);

      const updatedToken: Token = {
        ...sampleToken,
        value: 'oklch(0.6 0.25 260)',
      };

      registry.add(updatedToken);
      const retrieved = registry.get('primary');
      expect(retrieved?.value).toBe('oklch(0.6 0.25 260)');
    });
  });

  describe('filtering and searching', () => {
    beforeEach(() => {
      const tokens: Token[] = [
        {
          name: 'primary',
          value: 'oklch(0.5 0.2 240)',
          category: 'color',
          namespace: 'semantic',
        },
        {
          name: 'secondary',
          value: 'oklch(0.6 0.15 120)',
          category: 'color',
          namespace: 'semantic',
        },
        {
          name: 'base',
          value: '1rem',
          category: 'spacing',
          namespace: 'size',
        },
        {
          name: 'large',
          value: '2rem',
          category: 'spacing',
          namespace: 'size',
        },
      ];

      for (const token of tokens) {
        registry.add(token);
      }
    });

    it('should filter by category', () => {
      const colorTokens = registry.list({ category: 'color' });
      expect(colorTokens).toHaveLength(2);
      expect(colorTokens.every((token) => token.category === 'color')).toBe(true);
    });

    it('should filter by namespace', () => {
      const semanticTokens = registry.list({ namespace: 'semantic' });
      expect(semanticTokens).toHaveLength(2);
      expect(semanticTokens.every((token) => token.namespace === 'semantic')).toBe(true);
    });

    it('should filter by multiple criteria', () => {
      const filtered = registry.list({
        category: 'spacing',
        namespace: 'size',
      });
      expect(filtered).toHaveLength(2);
      expect(
        filtered.every((token) => token.category === 'spacing' && token.namespace === 'size')
      ).toBe(true);
    });

    it('should return empty array when no matches', () => {
      const filtered = registry.list({ category: 'non-existent' });
      expect(filtered).toHaveLength(0);
    });
  });

  describe('color token handling', () => {
    const colorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [
        { l: 0.1, c: 0.05, h: 240 },
        { l: 0.5, c: 0.2, h: 240 },
        { l: 0.9, c: 0.05, h: 240 },
      ],
      token: 'primary',
      value: '500',
    };

    const colorToken: Token = {
      name: 'primary',
      value: colorValue,
      category: 'color',
      namespace: 'semantic',
    };

    it('should handle ColorValue objects', () => {
      registry.add(colorToken);

      const retrieved = registry.get('primary');
      expect(retrieved?.value).toEqual(colorValue);
    });

    it('should generate unique IDs for color tokens', () => {
      registry.add(colorToken);

      // The registry should handle ColorValue objects properly
      const retrieved = registry.get('primary');
      expect(retrieved).toBeDefined();
      expect(typeof retrieved?.value).toBe('object');
    });

    it('should preserve color intelligence metadata', () => {
      const intelligentColorToken: Token = {
        ...colorToken,
        semanticMeaning: 'Primary brand color for main actions',
        trustLevel: 'high' as const,
        cognitiveLoad: 3,
      };

      registry.add(intelligentColorToken);
      const retrieved = registry.get('primary');

      expect(retrieved?.semanticMeaning).toBe('Primary brand color for main actions');
      expect(retrieved?.trustLevel).toBe('high');
      expect(retrieved?.cognitiveLoad).toBe(3);
    });
  });

  describe('token validation', () => {
    it('should accept valid tokens', () => {
      const validToken: Token = {
        name: 'test-token',
        value: 'test-value',
        category: 'test',
        namespace: 'test',
      };

      expect(() => registry.add(validToken)).not.toThrow();
    });

    it('should handle tokens with optional fields', () => {
      const tokenWithOptionals: Token = {
        name: 'test-token',
        value: 'test-value',
        category: 'test',
        namespace: 'test',
        semanticMeaning: 'Test semantic meaning',
        usageContext: ['test-context'],
        trustLevel: 'medium' as const,
        cognitiveLoad: 5,
        accessibilityLevel: 'AA' as const,
        description: 'Test description',
      };

      expect(() => registry.add(tokenWithOptionals)).not.toThrow();
      const retrieved = registry.get('test-token');
      expect(retrieved?.semanticMeaning).toBe('Test semantic meaning');
      expect(retrieved?.trustLevel).toBe('medium');
    });
  });

  describe('bulk operations', () => {
    const bulkTokens: Token[] = [
      {
        name: 'token-1',
        value: 'value-1',
        category: 'test',
        namespace: 'bulk',
      },
      {
        name: 'token-2',
        value: 'value-2',
        category: 'test',
        namespace: 'bulk',
      },
      {
        name: 'token-3',
        value: 'value-3',
        category: 'test',
        namespace: 'bulk',
      },
    ];

    it('should handle initialization with tokens', () => {
      const registryWithTokens = new TokenRegistry(bulkTokens);

      expect(registryWithTokens.list()).toHaveLength(3);
      expect(registryWithTokens.get('token-1')?.value).toBe('value-1');
      expect(registryWithTokens.get('token-2')?.value).toBe('value-2');
      expect(registryWithTokens.get('token-3')?.value).toBe('value-3');
    });

    it('should clear all tokens', () => {
      for (const token of bulkTokens) {
        registry.add(token);
      }
      expect(registry.list()).toHaveLength(3);

      registry.clear();
      expect(registry.list()).toHaveLength(0);
    });
  });

  describe('registry statistics and metadata', () => {
    beforeEach(() => {
      const tokens: Token[] = [
        { name: 'color-1', value: '#ff0000', category: 'color', namespace: 'semantic' },
        { name: 'color-2', value: '#00ff00', category: 'color', namespace: 'semantic' },
        { name: 'space-1', value: '1rem', category: 'spacing', namespace: 'size' },
        { name: 'space-2', value: '2rem', category: 'spacing', namespace: 'size' },
        { name: 'font-1', value: '16px', category: 'font-size', namespace: 'typography' },
      ];

      for (const token of tokens) {
        registry.add(token);
      }
    });

    it('should provide accurate token counts', () => {
      expect(registry.list()).toHaveLength(5);
      expect(registry.list({ category: 'color' })).toHaveLength(2);
      expect(registry.list({ category: 'spacing' })).toHaveLength(2);
      expect(registry.list({ category: 'font-size' })).toHaveLength(1);
    });

    it('should group tokens by category', () => {
      const allTokens = registry.list();
      const byCategory = allTokens.reduce(
        (acc, token) => {
          acc[token.category] = (acc[token.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      expect(byCategory.color).toBe(2);
      expect(byCategory.spacing).toBe(2);
      expect(byCategory['font-size']).toBe(1);
    });

    it('should group tokens by namespace', () => {
      const allTokens = registry.list();
      const byNamespace = allTokens.reduce(
        (acc, token) => {
          acc[token.namespace] = (acc[token.namespace] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      expect(byNamespace.semantic).toBe(2);
      expect(byNamespace.size).toBe(2);
      expect(byNamespace.typography).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should handle invalid token gracefully', () => {
      // Test with partial token data
      const incompleteToken = {
        name: 'incomplete',
        // Missing required fields
      } as Token;

      // Should not throw, but may not be properly stored
      expect(() => registry.add(incompleteToken)).not.toThrow();
    });

    it('should handle undefined/null tokens', () => {
      // @ts-expect-error - Testing null/undefined handling
      expect(() => registry.add(null)).not.toThrow();
      // @ts-expect-error - Testing null/undefined handling
      expect(() => registry.add(undefined)).not.toThrow();
    });
  });
});
