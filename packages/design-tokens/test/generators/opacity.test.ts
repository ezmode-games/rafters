/**
 * Opacity Generator Tests
 *
 * Tests for semantic opacity token generation
 */

import { describe, expect, it } from 'vitest';
import { generateOpacityTokens } from '../../src/generators/opacity.js';
import { TokenSchema } from '../../src/index.js';

describe('generateOpacityTokens', () => {
  it('generates semantic opacity scale for states and overlays', () => {
    const tokens = generateOpacityTokens();

    expect(tokens.length).toBeGreaterThan(5);

    // Check disabled state
    const disabled = tokens.find((t) => t.name === 'disabled');
    expect(disabled).toBeDefined();
    expect(disabled?.value).toBe('0.5');
    expect(disabled?.semanticMeaning).toContain('Disabled state opacity');

    // Check overlay
    const overlay = tokens.find((t) => t.name === 'overlay');
    expect(overlay).toBeDefined();
    expect(overlay?.value).toBe('0.8');
    expect(overlay?.semanticMeaning).toContain('Modal overlay');
  });

  it('includes proper interaction types', () => {
    const tokens = generateOpacityTokens();

    const hover = tokens.find((t) => t.name === 'hover');
    expect(hover?.interactionType).toBe('hover');

    const focus = tokens.find((t) => t.name === 'focus');
    expect(focus?.interactionType).toBe('focus');

    const disabled = tokens.find((t) => t.name === 'disabled');
    expect(disabled?.interactionType).toBe('disabled');
  });

  it('includes proper trust levels based on impact', () => {
    const tokens = generateOpacityTokens();

    const overlay = tokens.find((t) => t.name === 'overlay');
    expect(overlay?.trustLevel).toBe('high'); // High impact on UX

    const hover = tokens.find((t) => t.name === 'hover');
    expect(hover?.trustLevel).toBe('low'); // Low risk interaction
  });

  it('includes usage context for different opacity purposes', () => {
    const tokens = generateOpacityTokens();

    const disabled = tokens.find((t) => t.name === 'disabled');
    expect(disabled?.usageContext).toContain('disabled-buttons');
    expect(disabled?.usageContext).toContain('inactive-elements');

    const loading = tokens.find((t) => t.name === 'loading');
    expect(loading?.usageContext).toContain('loading-states');
    expect(loading?.usageContext).toContain('processing');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateOpacityTokens();

    const focus = tokens.find((t) => t.name === 'focus');
    expect(focus?.cognitiveLoad).toBe(1); // Full opacity, no cognitive load

    const overlay = tokens.find((t) => t.name === 'overlay');
    expect(overlay?.cognitiveLoad).toBeGreaterThan(3); // High impact on attention
  });

  it('validates all opacity tokens pass schema validation', () => {
    const tokens = generateOpacityTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components', () => {
    const tokens = generateOpacityTokens();

    const disabled = tokens.find((t) => t.name === 'disabled');
    expect(disabled?.applicableComponents).toContain('button');
    expect(disabled?.applicableComponents).toContain('input');

    const overlay = tokens.find((t) => t.name === 'overlay');
    expect(overlay?.applicableComponents).toContain('modal');
    expect(overlay?.applicableComponents).toContain('dialog');
  });
});
