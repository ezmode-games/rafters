/**
 * TokenRegistry Tests
 *
 * Comprehensive tests for the core TokenRegistry class functionality
 */

import { describe, expect, it } from 'vitest';
import type { Token } from '../src/index.js';
import { TokenRegistry } from '../src/registry.js';

// Test fixtures
const primaryToken: Token = {
  name: 'primary',
  value: 'oklch(0.45 0.12 240)',
  category: 'color',
  namespace: 'color',
  semanticMeaning: 'Primary brand color for main actions',
  trustLevel: 'high',
  applicableComponents: ['button', 'link', 'badge'],
  cognitiveLoad: 3,
  accessibilityLevel: 'AA',
};

const secondaryToken: Token = {
  name: 'secondary',
  value: 'oklch(0.65 0.08 180)',
  category: 'color',
  namespace: 'color',
  semanticMeaning: 'Secondary brand color for supporting actions',
  trustLevel: 'medium',
  applicableComponents: ['card', 'popover'],
  mathRelationship: 'derived from primary',
  scalePosition: 2,
};

describe('TokenRegistry', () => {
  describe('constructor', () => {
    it('creates empty registry when no initial tokens provided', () => {
      const registry = new TokenRegistry();
      expect(registry.size()).toBe(0);
      expect(registry.list()).toEqual([]);
    });

    it('creates registry with initial tokens', () => {
      const registry = new TokenRegistry([primaryToken, secondaryToken]);
      expect(registry.size()).toBe(2);
      expect(registry.has('primary')).toBe(true);
      expect(registry.has('secondary')).toBe(true);
    });

    it('maintains insertion order in list', () => {
      const registry = new TokenRegistry([primaryToken, secondaryToken]);
      const tokens = registry.list();
      expect(tokens[0].name).toBe('primary');
      expect(tokens[1].name).toBe('secondary');
    });
  });

  describe('get method', () => {
    it('returns token with full metadata', () => {
      const registry = new TokenRegistry([primaryToken]);
      const token = registry.get('primary');

      expect(token?.value).toBe('oklch(0.45 0.12 240)');
      expect(token?.semanticMeaning).toBe('Primary brand color for main actions');
      expect(token?.trustLevel).toBe('high');
      expect(token?.applicableComponents).toEqual(['button', 'link', 'badge']);
      expect(token?.cognitiveLoad).toBe(3);
      expect(token?.accessibilityLevel).toBe('AA');
    });

    it('returns undefined for non-existent token', () => {
      const registry = new TokenRegistry([primaryToken]);
      expect(registry.get('nonexistent')).toBeUndefined();
    });

    it('returns complete Token object structure', () => {
      const registry = new TokenRegistry([secondaryToken]);
      const token = registry.get('secondary');

      expect(token?.name).toBe('secondary');
      expect(token?.category).toBe('color');
      expect(token?.namespace).toBe('color');
      expect(token?.mathRelationship).toBe('derived from primary');
      expect(token?.scalePosition).toBe(2);
    });
  });

  describe('set method', () => {
    it('updates existing token value while preserving metadata', () => {
      const registry = new TokenRegistry([primaryToken]);
      registry.set('primary', '#ff0000');

      const updatedToken = registry.get('primary');
      expect(updatedToken?.value).toBe('#ff0000');
      expect(updatedToken?.semanticMeaning).toBe('Primary brand color for main actions');
      expect(updatedToken?.trustLevel).toBe('high');
      expect(updatedToken?.applicableComponents).toEqual(['button', 'link', 'badge']);
    });

    it('throws descriptive error for non-existent token', () => {
      const registry = new TokenRegistry([primaryToken]);
      expect(() => registry.set('nonexistent', '#000')).toThrow(
        'Token "nonexistent" does not exist. Cannot update non-existent token.'
      );
    });

    it('preserves all metadata fields when updating value', () => {
      const registry = new TokenRegistry([secondaryToken]);
      registry.set('secondary', 'oklch(0.70 0.10 190)');

      const updatedToken = registry.get('secondary');
      expect(updatedToken?.value).toBe('oklch(0.70 0.10 190)');
      expect(updatedToken?.mathRelationship).toBe('derived from primary');
      expect(updatedToken?.scalePosition).toBe(2);
      expect(updatedToken?.trustLevel).toBe('medium');
    });

    it('allows multiple updates to same token', () => {
      const registry = new TokenRegistry([primaryToken]);
      registry.set('primary', '#ff0000');
      registry.set('primary', '#00ff00');

      expect(registry.get('primary')?.value).toBe('#00ff00');
    });
  });

  describe('has method', () => {
    it('returns true for existing tokens', () => {
      const registry = new TokenRegistry([primaryToken, secondaryToken]);
      expect(registry.has('primary')).toBe(true);
      expect(registry.has('secondary')).toBe(true);
    });

    it('returns false for non-existent tokens', () => {
      const registry = new TokenRegistry([primaryToken]);
      expect(registry.has('nonexistent')).toBe(false);
      expect(registry.has('fake')).toBe(false);
    });

    it('returns false for empty registry', () => {
      const registry = new TokenRegistry();
      expect(registry.has('anything')).toBe(false);
    });
  });

  describe('list method', () => {
    it('returns all tokens as array', () => {
      const registry = new TokenRegistry([primaryToken, secondaryToken]);
      const allTokens = registry.list();

      expect(allTokens).toHaveLength(2);
      expect(allTokens.find((t) => t.name === 'primary')).toBeDefined();
      expect(allTokens.find((t) => t.name === 'secondary')).toBeDefined();
    });

    it('returns empty array for empty registry', () => {
      const registry = new TokenRegistry();
      expect(registry.list()).toEqual([]);
    });

    it('maintains insertion order', () => {
      const tokens = [primaryToken, secondaryToken];
      const registry = new TokenRegistry(tokens);
      const result = registry.list();

      expect(result[0].name).toBe('primary');
      expect(result[1].name).toBe('secondary');
    });

    it('reflects updated values in list', () => {
      const registry = new TokenRegistry([primaryToken]);
      registry.set('primary', '#updated');

      const tokens = registry.list();
      expect(tokens[0].value).toBe('#updated');
    });
  });

  describe('size method', () => {
    it('returns correct count for tokens', () => {
      const registry = new TokenRegistry([primaryToken, secondaryToken]);
      expect(registry.size()).toBe(2);
    });

    it('returns zero for empty registry', () => {
      const registry = new TokenRegistry();
      expect(registry.size()).toBe(0);
    });

    it('maintains correct size after operations', () => {
      const registry = new TokenRegistry([primaryToken]);
      expect(registry.size()).toBe(1);

      // Set operation doesn't change size
      registry.set('primary', '#new');
      expect(registry.size()).toBe(1);
    });
  });

  describe('performance requirements', () => {
    it('provides O(1) get operation', () => {
      // Create large registry to test performance characteristics
      const largeTokenSet: Token[] = [];
      for (let i = 0; i < 1000; i++) {
        largeTokenSet.push({
          name: `token-${i}`,
          value: `value-${i}`,
          category: 'test',
          namespace: 'test',
        });
      }

      const registry = new TokenRegistry(largeTokenSet);

      // Get operation should be immediate regardless of size
      const start = performance.now();
      const token = registry.get('token-500');
      const end = performance.now();

      expect(token?.value).toBe('value-500');
      expect(end - start).toBeLessThan(1); // Should be well under 1ms
    });

    it('provides O(1) set operation', () => {
      const largeTokenSet: Token[] = [];
      for (let i = 0; i < 1000; i++) {
        largeTokenSet.push({
          name: `token-${i}`,
          value: `value-${i}`,
          category: 'test',
          namespace: 'test',
        });
      }

      const registry = new TokenRegistry(largeTokenSet);

      const start = performance.now();
      registry.set('token-500', 'new-value');
      const end = performance.now();

      expect(registry.get('token-500')?.value).toBe('new-value');
      expect(end - start).toBeLessThan(1); // Should be well under 1ms
    });
  });

  describe('integration with existing Token type', () => {
    it('works with all Token schema fields', () => {
      const complexToken: Token = {
        name: 'complex',
        value: 'oklch(0.5 0.1 200)',
        category: 'color',
        namespace: 'semantic',
        darkValue: 'oklch(0.8 0.1 200)',
        semanticMeaning: 'Complex token for testing',
        usageContext: ['testing', 'validation'],
        trustLevel: 'critical',
        cognitiveLoad: 5,
        accessibilityLevel: 'AAA',
        consequence: 'significant',
        generatedFrom: 'base-token',
        mathRelationship: 'base * 1.25',
        scalePosition: 3,
        containerQueryAware: true,
        pointerTypeAware: false,
        reducedMotionAware: true,
        viewportAware: true,
        applicableComponents: ['button', 'card', 'modal'],
        requiredForComponents: ['button'],
        interactionType: 'hover',
        animationSafe: true,
        highContrastMode: 'oklch(0.9 0.2 200)',
        generateUtilityClass: true,
        tailwindOverride: false,
        customPropertyOnly: false,
        contrastRatio: 4.5,
        touchTargetSize: 44,
        motionDuration: 200,
        pairedWith: ['primary', 'secondary'],
        conflictsWith: ['danger'],
        description: 'A complex token for comprehensive testing',
        deprecated: false,
        version: '1.0.0',
        lastModified: '2024-01-01T00:00:00Z',
      };

      const registry = new TokenRegistry([complexToken]);
      expect(registry.get('complex')).toEqual(complexToken);

      registry.set('complex', 'updated-value');
      const updated = registry.get('complex');
      expect(updated?.value).toBe('updated-value');
      expect(updated?.semanticMeaning).toBe('Complex token for testing');
      expect(updated?.applicableComponents).toEqual(['button', 'card', 'modal']);
    });
  });
});
