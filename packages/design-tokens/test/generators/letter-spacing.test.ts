/**
 * Letter Spacing Generator Tests
 *
 * Tests for letter spacing token generation for readability
 */

import { describe, expect, it } from 'vitest';
import { generateLetterSpacingTokens } from '../../src/generators/letter-spacing.js';
import { TokenSchema } from '../../src/index.js';

describe('generateLetterSpacingTokens', () => {
  it('generates letter spacing scale from tighter to widest', () => {
    const tokens = generateLetterSpacingTokens();

    expect(tokens.length).toBe(6); // tighter through widest

    // Check tighter
    const tighter = tokens.find((t) => t.name === 'tighter');
    expect(tighter).toBeDefined();
    expect(tighter?.value).toBe('-0.05em');

    // Check normal
    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal).toBeDefined();
    expect(normal?.value).toBe('0em');

    // Check widest
    const widest = tokens.find((t) => t.name === 'widest');
    expect(widest).toBeDefined();
    expect(widest?.value).toBe('0.1em');
  });

  it('includes proper semantic meanings for readability', () => {
    const tokens = generateLetterSpacingTokens();

    const tighter = tokens.find((t) => t.name === 'tighter');
    expect(tighter?.semanticMeaning).toContain('large text');

    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal?.semanticMeaning).toContain('Normal letter spacing');

    const wide = tokens.find((t) => t.name === 'wide');
    expect(wide?.semanticMeaning).toContain('readability');
  });

  it('includes usage context for different spacing purposes', () => {
    const tokens = generateLetterSpacingTokens();

    const tighter = tokens.find((t) => t.name === 'tighter');
    expect(tighter?.usageContext).toContain('headings');
    expect(tighter?.usageContext).toContain('display-text');

    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal?.usageContext).toContain('body-text');
    expect(normal?.usageContext).toContain('default');

    const wider = tokens.find((t) => t.name === 'wider');
    expect(wider?.usageContext).toContain('emphasis');
    expect(wider?.usageContext).toContain('call-to-action');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateLetterSpacingTokens();

    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal?.cognitiveLoad).toBe(1); // Most readable

    const widest = tokens.find((t) => t.name === 'widest');
    expect(widest?.cognitiveLoad).toBe(4); // Requires attention

    const tighter = tokens.find((t) => t.name === 'tighter');
    expect(tighter?.cognitiveLoad).toBeGreaterThan(1);
  });

  it('validates all letter spacing tokens pass schema validation', () => {
    const tokens = generateLetterSpacingTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components', () => {
    const tokens = generateLetterSpacingTokens();

    const wide = tokens.find((t) => t.name === 'wide');
    expect(wide?.applicableComponents).toContain('h1');
    expect(wide?.applicableComponents).toContain('display');

    const tight = tokens.find((t) => t.name === 'tight');
    expect(tight?.applicableComponents).toContain('body');
    expect(tight?.applicableComponents).toContain('caption');

    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal?.applicableComponents).toContain('text');
  });

  it('has proper namespace for tracking utilities', () => {
    const tokens = generateLetterSpacingTokens();

    for (const token of tokens) {
      expect(token.namespace).toBe('tracking');
      expect(token.category).toBe('letter-spacing');
    }
  });
});
