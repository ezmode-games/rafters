/**
 * Border Radius Generator Tests
 *
 * Tests for border radius token generation
 */

import { describe, expect, it } from 'vitest';
import { generateBorderRadiusTokens } from '../../src/generators/border-radius.js';
import { TokenSchema } from '../../src/index.js';

describe('generateBorderRadiusTokens', () => {
  it('generates border radius scale from none to full', () => {
    const tokens = generateBorderRadiusTokens();

    expect(tokens.length).toBeGreaterThan(6);

    // Check none radius
    const none = tokens.find((t) => t.name === 'none');
    expect(none).toBeDefined();
    expect(none?.value).toBe('0px');

    // Check small radius
    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm).toBeDefined();
    expect(sm?.value).toBe('2px');

    // Check full radius
    const full = tokens.find((t) => t.name === 'full');
    expect(full).toBeDefined();
    expect(full?.value).toBe('9999px');
  });

  it('includes proper semantic meanings', () => {
    const tokens = generateBorderRadiusTokens();

    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm?.semanticMeaning).toContain('Subtle rounding');

    const full = tokens.find((t) => t.name === 'full');
    expect(full?.semanticMeaning).toContain('Fully rounded');
  });

  it('includes semantic meanings for different radius sizes', () => {
    const tokens = generateBorderRadiusTokens();

    const sm = tokens.find((t) => t.name === 'sm');
    expect(sm?.semanticMeaning).toContain('buttons');
    expect(sm?.semanticMeaning).toContain('inputs');

    const full = tokens.find((t) => t.name === 'full');
    expect(full?.semanticMeaning).toContain('pills');
    expect(full?.semanticMeaning).toContain('circles');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateBorderRadiusTokens();

    const none = tokens.find((t) => t.name === 'none');
    expect(none?.cognitiveLoad).toBe(1);

    const xl = tokens.find((t) => t.name === 'xl');
    expect(xl?.cognitiveLoad).toBe(1); // All have same cognitive load in current implementation
  });

  it('validates all border radius tokens pass schema validation', () => {
    const tokens = generateBorderRadiusTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components', () => {
    const tokens = generateBorderRadiusTokens();

    const md = tokens.find((t) => t.name === 'md');
    expect(md?.applicableComponents).toContain('card');
    expect(md?.applicableComponents).toContain('modal');

    const full = tokens.find((t) => t.name === 'full');
    expect(full?.applicableComponents).toContain('button');
    expect(full?.applicableComponents).toContain('image'); // All have same components in current implementation
  });
});
