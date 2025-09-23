/**
 * TDD Tests for Mathematical Relationship Metadata
 *
 * These tests define how tokens should store their mathematical derivations
 * in the `mathRelationship` field to enable calc rule expressions.
 *
 * The tests verify:
 * 1. Tokens include mathRelationship metadata showing their mathematical derivation
 * 2. Calc expressions are valid and reference correct base tokens
 * 3. Complex progressions are captured accurately
 * 4. Different mathematical systems store appropriate expressions
 */

import { describe, expect, it } from 'vitest';
import { generateHeightScale } from '../../src/generators/height.js';
import { generateMotionTokens } from '../../src/generators/motion.js';
import { generateSpacingScale } from '../../src/generators/spacing.js';
// Import the generators we'll enhance with mathRelationship metadata
import { generateTypographyScale } from '../../src/generators/typography.js';

describe('Mathematical Relationship Metadata - TDD', () => {
  describe('Typography Generator - Mathematical Expressions', () => {
    it('should include mathRelationship for golden ratio typography progression', () => {
      const tokens = generateTypographyScale('golden', 1, false);

      // Base token should not have mathRelationship (it's the foundation)
      const baseToken = tokens.find((t) => t.name === 'text-base');
      expect(baseToken?.mathRelationship).toBeUndefined();

      // Derived tokens should have mathematical expressions
      const lgToken = tokens.find((t) => t.name === 'text-lg');
      const xlToken = tokens.find((t) => t.name === 'text-xl');
      const xl2Token = tokens.find((t) => t.name === 'text-2xl');

      expect(lgToken?.mathRelationship).toBe('{text-base} * golden^1');
      expect(xlToken?.mathRelationship).toBe('{text-base} * golden^2');
      expect(xl2Token?.mathRelationship).toBe('{text-base} * golden^3');
    });

    it('should include mathRelationship for major-third typography progression', () => {
      const tokens = generateTypographyScale('major-third', 1, false);

      const baseToken = tokens.find((t) => t.name === 'text-base');
      const lgToken = tokens.find((t) => t.name === 'text-lg');

      expect(baseToken?.mathRelationship).toBeUndefined(); // Base token
      expect(lgToken?.mathRelationship).toBe('{text-base} * major-third^1');
    });

    it('should include mathRelationship for smaller sizes (negative steps)', () => {
      const tokens = generateTypographyScale('golden', 1, false);

      const xsToken = tokens.find((t) => t.name === 'text-xs');
      const smToken = tokens.find((t) => t.name === 'text-sm');

      // These are smaller than base, so they use negative exponents
      expect(xsToken?.mathRelationship).toBe('{text-base} * golden^-2');
      expect(smToken?.mathRelationship).toBe('{text-base} * golden^-1');
    });
  });

  describe('Spacing Generator - Mathematical Expressions', () => {
    it('should include mathRelationship for golden ratio spacing progression', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 6, false);

      // Zero spacing should not have mathRelationship
      const spacing0 = tokens.find((t) => t.name === '0');
      expect(spacing0?.mathRelationship).toBeUndefined();

      // First non-zero spacing is the base unit
      const spacing1 = tokens.find((t) => t.name === '1');
      expect(spacing1?.mathRelationship).toBeUndefined(); // Base spacing

      // Derived spacings should have mathematical expressions
      const spacing2 = tokens.find((t) => t.name === '2');
      const spacing3 = tokens.find((t) => t.name === '3');
      const spacing4 = tokens.find((t) => t.name === '4');

      expect(spacing2?.mathRelationship).toBe('{1} * golden^1');
      expect(spacing3?.mathRelationship).toBe('{1} * golden^2');
      expect(spacing4?.mathRelationship).toBe('{1} * golden^3');
    });

    it('should include mathRelationship for linear spacing progression', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 5, false);

      const spacing0 = tokens.find((t) => t.name === '0');
      const spacing1 = tokens.find((t) => t.name === '1');
      const spacing2 = tokens.find((t) => t.name === '2');

      expect(spacing0?.mathRelationship).toBeUndefined(); // Zero value
      expect(spacing1?.mathRelationship).toBeUndefined(); // Base unit
      expect(spacing2?.mathRelationship).toBe('{1} * 2'); // Linear: baseUnit * step
    });

    it('should include mathRelationship for minor-third spacing progression', () => {
      const tokens = generateSpacingScale('minor-third', 4, 1.25, 4, false);

      const spacing1 = tokens.find((t) => t.name === '1');
      const spacing2 = tokens.find((t) => t.name === '2');

      expect(spacing1?.mathRelationship).toBeUndefined(); // Base
      expect(spacing2?.mathRelationship).toBe('{1} * minor-third^1');
    });
  });

  describe('Motion Generator - Mathematical Expressions', () => {
    it('should include mathRelationship for golden ratio motion progression', () => {
      const tokens = generateMotionTokens('golden', 75, false);

      // Find the base token (standard is at index 2 in the progression)
      const informToken = tokens.find((t) => t.name === 'inform');
      const guideToken = tokens.find((t) => t.name === 'guide');
      const standardToken = tokens.find((t) => t.name === 'standard');
      const engageToken = tokens.find((t) => t.name === 'engage');

      // Standard is the base duration (no mathRelationship)
      expect(standardToken?.mathRelationship).toBeUndefined();

      // Other durations derive from standard
      expect(informToken?.mathRelationship).toBe('{standard} * golden^-2');
      expect(guideToken?.mathRelationship).toBe('{standard} * golden^-1');
      expect(engageToken?.mathRelationship).toBe('{standard} * golden^1');
    });

    it('should include mathRelationship for major-third motion progression', () => {
      const tokens = generateMotionTokens('major-third', 75, false);

      const standardToken = tokens.find((t) => t.name === 'standard');
      const engageToken = tokens.find((t) => t.name === 'engage');

      expect(standardToken?.mathRelationship).toBeUndefined(); // Base
      expect(engageToken?.mathRelationship).toBe('{standard} * major-third^1');
    });
  });

  describe('Height Generator - Mathematical Expressions', () => {
    it('should include mathRelationship for golden ratio height progression', () => {
      const tokens = generateHeightScale('golden', 2.5, 1.25, false);

      // Verify we have height tokens
      expect(tokens.length).toBeGreaterThan(0);

      // First token is the base (no mathRelationship)
      const firstToken = tokens[0];
      expect(firstToken?.mathRelationship).toBeUndefined();

      // Second and subsequent tokens should have mathematical expressions
      if (tokens.length > 1) {
        const secondToken = tokens[1];
        expect(secondToken?.mathRelationship).toBe(`{${firstToken.name}} * golden^0.5`);
      }

      if (tokens.length > 2) {
        const thirdToken = tokens[2];
        expect(thirdToken?.mathRelationship).toBe(`{${firstToken.name}} * golden^1`);
      }
    });

    it('should include mathRelationship for linear height progression', () => {
      const tokens = generateHeightScale('linear', 2.5, 1.25, false);

      const firstToken = tokens[0];
      expect(firstToken?.mathRelationship).toBeUndefined(); // Base

      if (tokens.length > 1) {
        const secondToken = tokens[1];
        // Linear height uses addition, not multiplication
        expect(secondToken?.mathRelationship).toBe(`{${firstToken.name}} + 0.5rem`);
      }
    });
  });

  describe('Mathematical Expression Validation', () => {
    it('should generate valid calc expressions that reference existing tokens', () => {
      const tokens = generateTypographyScale('golden', 1, false);

      // Find tokens with mathRelationship
      const tokensWithMath = tokens.filter((t) => t.mathRelationship);

      for (const token of tokensWithMath) {
        // Should contain valid ratio names or token references
        expect(token.mathRelationship).toMatch(/\{[^}]+\}/); // Contains token reference

        // Should contain valid mathematical operators or ratio names
        const validPattern =
          /(\{[^}]+\}|\+|-|\*|\/|\^|\d+|golden|major-third|minor-third|perfect-fourth|perfect-fifth)/;
        expect(token.mathRelationship).toMatch(validPattern);
      }
    });

    it('should reference base tokens that actually exist', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 4, false);
      const tokensWithMath = tokens.filter((t) => t.mathRelationship);

      for (const token of tokensWithMath) {
        // Extract token references from mathRelationship
        const references = token.mathRelationship?.match(/\{([^}]+)\}/g);

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
        ...typographyTokens.filter((t) => t.mathRelationship),
        ...spacingTokens.filter((t) => t.mathRelationship),
      ];

      for (const token of allTokensWithMath) {
        // Should use consistent notation patterns:
        // - Token references: {token-name}
        // - Exponents: ratio^power or ratio^-power
        // - Operations: *, +, -, /
        const validNotation =
          /^(\{[^}]+\}\s*[*+/-]\s*)?[a-z-]+(\^-?\d+(\.\d+)?)?(\s*[*+/-]\s*[\d.]+[a-z]*)?$/;
        expect(token.mathRelationship).toMatch(validNotation);
      }
    });
  });

  describe('Integration with Calc Rule', () => {
    it('should create expressions that calc rule can execute', () => {
      // This test verifies that the mathRelationship expressions are valid
      // for the calc rule to parse and execute
      const tokens = generateTypographyScale('golden', 1, false);
      const lgToken = tokens.find((t) => t.name === 'text-lg');

      expect(lgToken?.mathRelationship).toBe('{text-base} * golden^1');

      // The expression should be parseable by math-utils
      // (We'll test actual execution separately)
      expect(lgToken?.mathRelationship).toMatch(/\{[^}]+\}\s*\*\s*[a-z-]+\^\d+/);
    });

    it('should enable token dependency resolution', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 4, false);
      const tokensWithMath = tokens.filter((t) => t.mathRelationship);

      // Each token with mathRelationship should be derivable from other tokens
      for (const token of tokensWithMath) {
        expect(token.mathRelationship).toBeDefined();
        expect(token.mathRelationship).toContain('{'); // Contains dependency reference
      }
    });
  });
});
