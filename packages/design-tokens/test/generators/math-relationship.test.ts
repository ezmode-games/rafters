/**
 * TDD Tests for Mathematical Relationship Metadata
 *
 * These tests define how tokens should store their mathematical derivations
 * in the `generationRule` field to enable calc rule expressions.
 *
 * The tests verify:
 * 1. Tokens include generationRule metadata showing their mathematical derivation
 * 2. Calc expressions are valid and reference correct base tokens
 * 3. Complex progressions are captured accurately
 * 4. Different mathematical systems store appropriate expressions
 */

import { describe, expect, it } from 'vitest';
import { generateHeightScale } from '../../src/generators/height.js';
import { generateMotionTokens } from '../../src/generators/motion.js';
import { generateSpacingScale } from '../../src/generators/spacing.js';
// Import the generators we'll enhance with generationRule metadata
import { generateTypographyScale } from '../../src/generators/typography.js';

describe('Mathematical Relationship Metadata - TDD', () => {
  describe('Typography Generator - Mathematical Expressions', () => {
    it('should include generationRule for golden ratio typography progression', () => {
      const tokens = generateTypographyScale('golden', 1, false);

      // Base token should not have generationRule (it's the foundation)
      const baseToken = tokens.find((t) => t.name === 'text-base');
      expect(baseToken?.generationRule).toBeUndefined();

      // Derived tokens should have mathematical expressions
      const lgToken = tokens.find((t) => t.name === 'text-lg');
      const xlToken = tokens.find((t) => t.name === 'text-xl');
      const xl2Token = tokens.find((t) => t.name === 'text-2xl');

      expect(lgToken?.generationRule).toBe('{text-base} * golden^1');
      expect(xlToken?.generationRule).toBe('{text-base} * golden^2');
      expect(xl2Token?.generationRule).toBe('{text-base} * golden^3');
    });

    it('should include generationRule for major-third typography progression', () => {
      const tokens = generateTypographyScale('major-third', 1, false);

      const baseToken = tokens.find((t) => t.name === 'text-base');
      const lgToken = tokens.find((t) => t.name === 'text-lg');

      expect(baseToken?.generationRule).toBeUndefined(); // Base token
      expect(lgToken?.generationRule).toBe('{text-base} * major-third^1');
    });

    it('should include generationRule for smaller sizes (negative steps)', () => {
      const tokens = generateTypographyScale('golden', 1, false);

      const xsToken = tokens.find((t) => t.name === 'text-xs');
      const smToken = tokens.find((t) => t.name === 'text-sm');

      // These are smaller than base, so they use negative exponents
      expect(xsToken?.generationRule).toBe('{text-base} * golden^-2');
      expect(smToken?.generationRule).toBe('{text-base} * golden^-1');
    });
  });

  describe('Spacing Generator - Mathematical Expressions', () => {
    it('should include generationRule for golden ratio spacing progression', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 6, false);

      // Zero spacing should not have generationRule
      const spacing0 = tokens.find((t) => t.name === '0');
      expect(spacing0?.generationRule).toBeUndefined();

      // First non-zero spacing is the base unit
      const spacing1 = tokens.find((t) => t.name === '1');
      expect(spacing1?.generationRule).toBeUndefined(); // Base spacing

      // Derived spacings should have mathematical expressions
      const spacing2 = tokens.find((t) => t.name === '2');
      const spacing3 = tokens.find((t) => t.name === '3');
      const spacing4 = tokens.find((t) => t.name === '4');

      expect(spacing2?.generationRule).toBe('{1} * golden^1');
      expect(spacing3?.generationRule).toBe('{1} * golden^2');
      expect(spacing4?.generationRule).toBe('{1} * golden^3');
    });

    it('should include generationRule for linear spacing progression', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 5, false);

      const spacing0 = tokens.find((t) => t.name === '0');
      const spacing1 = tokens.find((t) => t.name === '1');
      const spacing2 = tokens.find((t) => t.name === '2');

      expect(spacing0?.generationRule).toBeUndefined(); // Zero value
      expect(spacing1?.generationRule).toBeUndefined(); // Base unit
      expect(spacing2?.generationRule).toBe('{1} * 2'); // Linear: baseUnit * step
    });

    it('should include generationRule for minor-third spacing progression', () => {
      const tokens = generateSpacingScale('minor-third', 4, 1.25, 4, false);

      const spacing1 = tokens.find((t) => t.name === '1');
      const spacing2 = tokens.find((t) => t.name === '2');

      expect(spacing1?.generationRule).toBeUndefined(); // Base
      expect(spacing2?.generationRule).toBe('{1} * minor-third^1');
    });
  });

  describe('Motion Generator - Mathematical Expressions', () => {
    it('should include generationRule for golden ratio motion progression', () => {
      const tokens = generateMotionTokens('golden', 75, false);

      // Find the base token (standard is at index 2 in the progression)
      const informToken = tokens.find((t) => t.name === 'inform');
      const guideToken = tokens.find((t) => t.name === 'guide');
      const standardToken = tokens.find((t) => t.name === 'standard');
      const engageToken = tokens.find((t) => t.name === 'engage');

      // Standard is the base duration (no generationRule)
      expect(standardToken?.generationRule).toBeUndefined();

      // Other durations derive from standard
      expect(informToken?.generationRule).toBe('{standard} * golden^-2');
      expect(guideToken?.generationRule).toBe('{standard} * golden^-1');
      expect(engageToken?.generationRule).toBe('{standard} * golden^1');
    });

    it('should include generationRule for major-third motion progression', () => {
      const tokens = generateMotionTokens('major-third', 75, false);

      const standardToken = tokens.find((t) => t.name === 'standard');
      const engageToken = tokens.find((t) => t.name === 'engage');

      expect(standardToken?.generationRule).toBeUndefined(); // Base
      expect(engageToken?.generationRule).toBe('{standard} * major-third^1');
    });
  });

  describe('Height Generator - Mathematical Expressions', () => {
    it('should include generationRule for golden ratio height progression', () => {
      const tokens = generateHeightScale('golden', 2.5, 1.25, false);

      // Verify we have height tokens
      expect(tokens.length).toBeGreaterThan(0);

      // First token is the base (no generationRule)
      const firstToken = tokens[0];
      expect(firstToken?.generationRule).toBeUndefined();

      // Second and subsequent tokens should have mathematical expressions
      if (tokens.length > 1) {
        const secondToken = tokens[1];
        expect(secondToken?.generationRule).toBe(`{${firstToken.name}} * golden^0.5`);
      }

      if (tokens.length > 2) {
        const thirdToken = tokens[2];
        expect(thirdToken?.generationRule).toBe(`{${firstToken.name}} * golden^1`);
      }
    });

    it('should include generationRule for linear height progression', () => {
      const tokens = generateHeightScale('linear', 2.5, 1.25, false);

      const firstToken = tokens[0];
      expect(firstToken?.generationRule).toBeUndefined(); // Base

      if (tokens.length > 1) {
        const secondToken = tokens[1];
        // Linear height uses addition, not multiplication
        expect(secondToken?.generationRule).toBe(`{${firstToken.name}} + 0.5rem`);
      }
    });
  });

  describe('Mathematical Expression Validation', () => {
    it('should generate valid calc expressions that reference existing tokens', () => {
      const tokens = generateTypographyScale('golden', 1, false);

      // Find tokens with generationRule
      const tokensWithMath = tokens.filter((t) => t.generationRule);

      for (const token of tokensWithMath) {
        // Should contain valid ratio names or token references
        expect(token.generationRule).toMatch(/\{[^}]+\}/); // Contains token reference

        // Should contain valid mathematical operators or ratio names
        const validPattern =
          /(\{[^}]+\}|\+|-|\*|\/|\^|\d+|golden|major-third|minor-third|perfect-fourth|perfect-fifth)/;
        expect(token.generationRule).toMatch(validPattern);
      }
    });

    it('should reference base tokens that actually exist', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 4, false);
      const tokensWithMath = tokens.filter((t) => t.generationRule);

      for (const token of tokensWithMath) {
        // Extract token references from generationRule
        const references = token.generationRule?.match(/\{([^}]+)\}/g);

        if (references) {
          for (const ref of references) {
            const tokenName = ref.slice(1, -1); // Remove braces
            const referencedToken = tokens.find((t) => t.name === tokenName);
            expect(referencedToken).toBeDefined();
          }
        }
      }
    });

    it('should use consistent mathematical notation', () => {
      const typographyTokens = generateTypographyScale('golden', 1, false);
      const spacingTokens = generateSpacingScale('minor-third', 4, 1.25, 4, false);

      const allTokensWithMath = [
        ...typographyTokens.filter((t) => t.generationRule),
        ...spacingTokens.filter((t) => t.generationRule),
      ];

      for (const token of allTokensWithMath) {
        // Should use consistent notation patterns:
        // - Token references: {token-name}
        // - Exponents: ratio^power or ratio^-power
        // - Operations: *, +, -, /
        const validNotation =
          /^(\{[^}]+\}\s*[*+/-]\s*)?[a-z-]+(\^-?\d+(\.\d+)?)?(\s*[*+/-]\s*[\d.]+[a-z]*)?$/;
        expect(token.generationRule).toMatch(validNotation);
      }
    });
  });

  describe('Integration with Calc Rule', () => {
    it('should create expressions that calc rule can execute', () => {
      // This test verifies that the generationRule expressions are valid
      // for the calc rule to parse and execute
      const tokens = generateTypographyScale('golden', 1, false);
      const lgToken = tokens.find((t) => t.name === 'text-lg');

      expect(lgToken?.generationRule).toBe('{text-base} * golden^1');

      // The expression should be parseable by math-utils
      // (We'll test actual execution separately)
      expect(lgToken?.generationRule).toMatch(/\{[^}]+\}\s*\*\s*[a-z-]+\^\d+/);
    });

    it('should enable token dependency resolution', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 4, false);
      const tokensWithMath = tokens.filter((t) => t.generationRule);

      // Each token with generationRule should be derivable from other tokens
      for (const token of tokensWithMath) {
        expect(token.generationRule).toBeDefined();
        expect(token.generationRule).toContain('{'); // Contains dependency reference
      }
    });
  });
});
