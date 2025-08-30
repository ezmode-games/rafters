/**
 * All Generators Tests
 *
 * Integration tests for all token generators
 */

import { describe, expect, it } from 'vitest';
import { generateAllTokens } from '../../src/generators/index.js';
import {
  generateAspectRatioTokens,
  generateBackdropTokens,
  generateBorderRadiusTokens,
  generateBorderWidthTokens,
  generateBreakpointTokens,
  generateColorTokens,
  generateDepthScale,
  generateFontFamilyTokens,
  generateFontWeightTokens,
  generateGridTokens,
  generateHeightScale,
  generateLetterSpacingTokens,
  generateMotionTokens,
  generateOpacityTokens,
  generateSpacingScale,
  generateTouchTargetTokens,
  generateTransformTokens,
  generateTypographyScale,
  generateWidthTokens,
} from '../../src/generators/index.js';
import { TokenSchema } from '../../src/index.js';

describe('Token validation', () => {
  it('all generated tokens pass schema validation', () => {
    const spacingTokens = generateSpacingScale('linear', 4, 1.25, 2, false);
    const depthTokens = generateDepthScale('linear', 10);
    const heightTokens = generateHeightScale('linear', 2.5, 1.25, false);
    const typographyTokens = generateTypographyScale('golden', 1, false);

    const allTokens = [...spacingTokens, ...depthTokens, ...heightTokens, ...typographyTokens];

    allTokens.forEach((token, index) => {
      expect(
        () => TokenSchema.parse(token),
        `Token at index ${index} failed validation: ${JSON.stringify(token)}`
      ).not.toThrow();
    });
  });

  it('all individual generators produce valid tokens', () => {
    const generators = [
      () => generateSpacingScale('linear', 4, 1.25, 2, false),
      () => generateDepthScale('linear', 10),
      () => generateHeightScale('linear', 2.5, 1.25, false),
      () => generateTypographyScale('golden', 1, false),
      generateColorTokens,
      generateMotionTokens,
      generateBorderRadiusTokens,
      generateTouchTargetTokens,
      generateOpacityTokens,
      generateFontFamilyTokens,
      generateFontWeightTokens,
      generateLetterSpacingTokens,
      generateBreakpointTokens,
      generateAspectRatioTokens,
      generateGridTokens,
      generateTransformTokens,
      generateWidthTokens,
      generateBackdropTokens,
      generateBorderWidthTokens,
    ];

    generators.forEach((generator, generatorIndex) => {
      const tokens = generator();
      expect(tokens.length).toBeGreaterThan(0);

      tokens.forEach((token, tokenIndex) => {
        expect(
          () => TokenSchema.parse(token),
          `Generator ${generatorIndex}, Token ${tokenIndex} failed validation: ${JSON.stringify(token)}`
        ).not.toThrow();
      });
    });
  });

  it('generateAllTokens produces comprehensive token set', () => {
    const allTokens = generateAllTokens();

    expect(allTokens.length).toBeGreaterThan(0);

    // Validate all tokens pass schema validation
    for (const token of allTokens) {
      expect(() => TokenSchema.parse(token)).not.toThrow();
    }

    // Check that we have tokens from multiple categories
    const categories = new Set(allTokens.map((t) => t.category));
    expect(categories.size).toBeGreaterThan(5);
  });
});
