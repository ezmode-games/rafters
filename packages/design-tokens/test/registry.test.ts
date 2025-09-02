/**
 * Unit tests for TokenRegistry
 */

import type { Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { TokenRegistry } from '../src/registry.js';

describe('TokenRegistry', () => {
  let sampleTokens: Token[];

  beforeEach(() => {
    sampleTokens = [
      {
        name: 'primary',
        value: 'oklch(0.5 0.1 240)',
        category: 'color',
        namespace: 'color',
        semanticMeaning: 'Primary brand color',
      },
      {
        name: '4',
        value: '1rem',
        category: 'spacing',
        namespace: 'spacing',
        semanticMeaning: 'Base spacing unit',
      },
    ];
  });

  it('should create empty registry', () => {
    const registry = new TokenRegistry();
    expect(registry.size()).toBe(0);
    expect(registry.list()).toEqual([]);
  });

  it('should create registry with initial tokens', () => {
    const registry = new TokenRegistry(sampleTokens);
    expect(registry.size()).toBe(2);

    const tokens = registry.list();
    expect(tokens).toHaveLength(2);
    expect(tokens.find((t) => t.name === 'primary')).toBeDefined();
  });

  it('should get token by name', () => {
    const registry = new TokenRegistry(sampleTokens);

    const token = registry.get('primary');
    expect(token).toBeDefined();
    expect(token?.name).toBe('primary');

    const missing = registry.get('nonexistent');
    expect(missing).toBeUndefined();
  });

  it('should check if token exists', () => {
    const registry = new TokenRegistry(sampleTokens);

    expect(registry.has('primary')).toBe(true);
    expect(registry.has('nonexistent')).toBe(false);
  });

  it('should update existing token values', () => {
    const registry = new TokenRegistry(sampleTokens);

    // Update existing token
    registry.set('primary', 'oklch(0.6 0.1 240)');

    const token = registry.get('primary');
    expect(token?.value).toBe('oklch(0.6 0.1 240)');
    expect(token?.semanticMeaning).toBe('Primary brand color'); // Metadata preserved
  });

  it('should throw error when setting non-existent token', () => {
    const registry = new TokenRegistry(sampleTokens);

    expect(() => {
      registry.set('nonexistent', 'some value');
    }).toThrow('Token "nonexistent" does not exist');
  });
});
