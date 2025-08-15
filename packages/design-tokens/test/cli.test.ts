/**
 * Tests for CLI integration functions
 */

import { describe, expect, it } from 'vitest';
import { createDefaultRegistry } from '../src/cli';

describe('CLI Integration', () => {
  it('creates default registry with all token types', () => {
    const registry = createDefaultRegistry();

    expect(registry.id).toBe('000000');
    expect(registry.name).toBe('Rafters Grayscale');
    expect(registry.description).toBe('AI-intelligent grayscale design system');
    expect(registry.css).toBeDefined();
    expect(registry.tailwind).toBeDefined();
    expect(registry.json).toBeDefined();
    expect(registry.meta).toBeDefined();
  });

  it('includes motion tokens in JSON export', () => {
    const registry = createDefaultRegistry();
    const json = registry.json;

    // Check motion timing tokens
    const timingTokens = Object.keys(json).filter((key) => key.startsWith('--duration-'));
    expect(timingTokens.length).toBeGreaterThan(0);
    expect(timingTokens).toContain('--duration-fast');
    expect(timingTokens).toContain('--duration-standard');
    expect(timingTokens).toContain('--duration-slow');

    // Check motion easing tokens
    const easingTokens = Object.keys(json).filter((key) => key.startsWith('--ease-'));
    expect(easingTokens.length).toBeGreaterThan(0);
    expect(easingTokens).toContain('--ease-linear');
    expect(easingTokens).toContain('--ease-smooth');
    expect(easingTokens).toContain('--ease-bouncy');
  });

  it('includes all token categories in JSON export', () => {
    const registry = createDefaultRegistry();
    const json = registry.json;
    const tokenKeys = Object.keys(json);

    // Check each token category is represented
    const hasColorTokens = tokenKeys.some((key) => key.startsWith('--color-'));
    const hasSpacingTokens = tokenKeys.some((key) => key.startsWith('--spacing-'));
    const hasOpacityTokens = tokenKeys.some((key) => key.startsWith('--opacity-'));
    const hasScaleTokens = tokenKeys.some((key) => key.startsWith('--scale-'));
    const hasDurationTokens = tokenKeys.some((key) => key.startsWith('--duration-'));
    const hasEaseTokens = tokenKeys.some((key) => key.startsWith('--ease-'));

    expect(hasColorTokens).toBe(true);
    expect(hasSpacingTokens).toBe(true);
    expect(hasOpacityTokens).toBe(true);
    expect(hasScaleTokens).toBe(true);
    expect(hasDurationTokens).toBe(true);
    expect(hasEaseTokens).toBe(true);
  });

  it('includes motion tokens in CSS export', () => {
    const registry = createDefaultRegistry();
    const css = registry.css;

    expect(css).toContain('--duration-');
    expect(css).toContain('--ease-');

    // Check specific motion token values
    expect(css).toMatch(/--duration-fast:\s*\d+ms/);
    expect(css).toMatch(/--ease-smooth:\s*ease-in-out/);
    expect(css).toMatch(/--ease-bouncy:\s*cubic-bezier/);
  });

  it('includes motion tokens in Tailwind export', () => {
    const registry = createDefaultRegistry();
    const tailwind = registry.tailwind;

    expect(tailwind).toContain('@theme {');
    expect(tailwind).toContain('--duration-');
    expect(tailwind).toContain('--ease-');

    // Check category organization
    expect(tailwind).toContain('/* timing */');
    expect(tailwind).toContain('/* easing */');
  });

  it('validates motion token values are properly formatted', () => {
    const registry = createDefaultRegistry();
    const json = registry.json;

    // Check duration values are in milliseconds
    const durationTokens = Object.entries(json).filter(([key]) => key.startsWith('--duration-'));
    for (const [key, value] of durationTokens) {
      expect(value).toMatch(/^\d+ms$/);
    }

    // Check easing values are valid CSS
    const easingTokens = Object.entries(json).filter(([key]) => key.startsWith('--ease-'));
    for (const [key, value] of easingTokens) {
      expect(value).toMatch(/^(ease-in-out|ease-in|ease-out|ease-linear|cubic-bezier\([^)]+\))$/);
    }
  });

  it('has proper metadata structure', () => {
    const registry = createDefaultRegistry();
    const meta = registry.meta;

    expect(meta.version).toBeDefined();
    expect(meta.designCoherence).toBeGreaterThanOrEqual(1);
    expect(meta.designCoherence).toBeLessThanOrEqual(10);
    expect(meta.accessibilityScore).toBeGreaterThanOrEqual(1);
    expect(meta.accessibilityScore).toBeLessThanOrEqual(10);
  });
});
