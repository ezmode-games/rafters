/**
 * Font Family Generator Tests
 *
 * Tests for semantic font family token generation
 */

import { describe, expect, it } from 'vitest';
import { generateFontFamilyTokens } from '../../src/generators/font-family.js';
import { TokenSchema } from '../../src/index.js';

describe('generateFontFamilyTokens', () => {
  it('generates semantic font family tokens with fallbacks', () => {
    const tokens = generateFontFamilyTokens();

    expect(tokens.length).toBeGreaterThan(3);

    // Check sans serif
    const sans = tokens.find((t) => t.name === 'sans');
    expect(sans).toBeDefined();
    expect(sans?.value).toContain('Inter');
    expect(sans?.value).toContain('system-ui');
    expect(sans?.value).toContain('sans-serif');

    // Check serif
    const serif = tokens.find((t) => t.name === 'serif');
    expect(serif).toBeDefined();
    expect(serif?.value).toContain('serif');

    // Check mono
    const mono = tokens.find((t) => t.name === 'mono');
    expect(mono).toBeDefined();
    expect(mono?.value).toContain('monospace');
  });

  it('includes proper semantic meanings and personality', () => {
    const tokens = generateFontFamilyTokens();

    const sans = tokens.find((t) => t.name === 'sans');
    expect(sans?.semanticMeaning).toContain('Primary sans-serif');

    const serif = tokens.find((t) => t.name === 'serif');
    expect(serif?.semanticMeaning).toContain('editorial content');

    const mono = tokens.find((t) => t.name === 'mono');
    expect(mono?.semanticMeaning).toContain('code and data');
  });

  it('includes usage context for different font purposes', () => {
    const tokens = generateFontFamilyTokens();

    const sans = tokens.find((t) => t.name === 'sans');
    expect(sans?.usageContext).toContain('body-text');
    expect(sans?.usageContext).toContain('ui-text');

    const mono = tokens.find((t) => t.name === 'mono');
    expect(mono?.usageContext).toContain('code');
    expect(mono?.usageContext).toContain('technical');

    const display = tokens.find((t) => t.name === 'display');
    expect(display?.usageContext).toContain('headings');
    expect(display?.usageContext).toContain('hero-text');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateFontFamilyTokens();

    const sans = tokens.find((t) => t.name === 'sans');
    expect(sans?.cognitiveLoad).toBe(1); // Most readable

    const mono = tokens.find((t) => t.name === 'mono');
    expect(mono?.cognitiveLoad).toBeGreaterThan(1); // Requires more focus

    const display = tokens.find((t) => t.name === 'display');
    expect(display?.cognitiveLoad).toBeGreaterThan(2); // High impact
  });

  it('includes proper trust levels', () => {
    const tokens = generateFontFamilyTokens();

    const sans = tokens.find((t) => t.name === 'sans');
    expect(sans?.trustLevel).toBe('low'); // Safe for all content

    const display = tokens.find((t) => t.name === 'display');
    expect(display?.trustLevel).toBe('medium'); // Needs careful use
  });

  it('validates all font family tokens pass schema validation', () => {
    const tokens = generateFontFamilyTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components', () => {
    const tokens = generateFontFamilyTokens();

    const mono = tokens.find((t) => t.name === 'mono');
    expect(mono?.applicableComponents).toContain('code');
    expect(mono?.applicableComponents).toContain('pre');

    const display = tokens.find((t) => t.name === 'display');
    expect(display?.applicableComponents).toContain('h1');
    expect(display?.applicableComponents).toContain('hero');

    const sans = tokens.find((t) => t.name === 'sans');
    expect(sans?.applicableComponents).toContain('all');
  });
});
