/**
 * Font Weight Generator Tests
 *
 * Tests for font weight token generation with readability guidance
 */

import { describe, expect, it } from 'vitest';
import { generateFontWeightTokens } from '../../src/generators/font-weight.js';
import { TokenSchema } from '../../src/index.js';

describe('generateFontWeightTokens', () => {
  it('generates font weight scale from thin to black', () => {
    const tokens = generateFontWeightTokens();

    expect(tokens.length).toBe(9); // thin through black

    // Check thin
    const thin = tokens.find((t) => t.name === 'thin');
    expect(thin).toBeDefined();
    expect(thin?.value).toBe('100');

    // Check normal
    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal).toBeDefined();
    expect(normal?.value).toBe('400');

    // Check bold
    const bold = tokens.find((t) => t.name === 'bold');
    expect(bold).toBeDefined();
    expect(bold?.value).toBe('700');

    // Check black
    const black = tokens.find((t) => t.name === 'black');
    expect(black).toBeDefined();
    expect(black?.value).toBe('900');
  });

  it('includes proper semantic meanings with readability guidance', () => {
    const tokens = generateFontWeightTokens();

    const thin = tokens.find((t) => t.name === 'thin');
    expect(thin?.semanticMeaning).toContain('use sparingly');

    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal?.semanticMeaning).toContain('optimal readability');

    const bold = tokens.find((t) => t.name === 'bold');
    expect(bold?.semanticMeaning).toContain('strong hierarchy');
  });

  it('includes proper accessibility levels', () => {
    const tokens = generateFontWeightTokens();

    const thin = tokens.find((t) => t.name === 'thin');
    expect(thin?.accessibilityLevel).toBe('AA'); // Lower contrast

    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal?.accessibilityLevel).toBe('AAA'); // Best readability

    const bold = tokens.find((t) => t.name === 'bold');
    expect(bold?.accessibilityLevel).toBe('AAA'); // Good contrast
  });

  it('includes usage context for different weights', () => {
    const tokens = generateFontWeightTokens();

    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal?.usageContext).toContain('body-text');
    expect(normal?.usageContext).toContain('paragraphs');

    const bold = tokens.find((t) => t.name === 'bold');
    expect(bold?.usageContext).toContain('headings');
    expect(bold?.usageContext).toContain('buttons');

    const light = tokens.find((t) => t.name === 'light');
    expect(light?.usageContext).toContain('captions');
    expect(light?.usageContext).toContain('secondary-text');
  });

  it('includes proper cognitive load ratings', () => {
    const tokens = generateFontWeightTokens();

    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal?.cognitiveLoad).toBe(1); // Easiest to read

    const black = tokens.find((t) => t.name === 'black');
    expect(black?.cognitiveLoad).toBe(8); // High impact, use carefully

    const thin = tokens.find((t) => t.name === 'thin');
    expect(thin?.cognitiveLoad).toBeGreaterThan(1); // Harder to read
  });

  it('validates all font weight tokens pass schema validation', () => {
    const tokens = generateFontWeightTokens();

    for (const token of tokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }
  });

  it('includes proper applicable components', () => {
    const tokens = generateFontWeightTokens();

    const bold = tokens.find((t) => t.name === 'bold');
    expect(bold?.applicableComponents).toContain('h1');
    expect(bold?.applicableComponents).toContain('strong');
    expect(bold?.applicableComponents).toContain('button');

    const normal = tokens.find((t) => t.name === 'normal');
    expect(normal?.applicableComponents).toContain('p');
    expect(normal?.applicableComponents).toContain('body');

    const light = tokens.find((t) => t.name === 'light');
    expect(light?.applicableComponents).toContain('text');
  });
});
