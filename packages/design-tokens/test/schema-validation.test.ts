/**
 * Schema Validation Tests
 *
 * Ensures all generated tokens with mathematical metadata properly validate
 * against the TokenSchema from @rafters/shared.
 */

import { TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateBorderRadiusScale } from '../src/generators/border-radius.js';
import { generateHeightScale } from '../src/generators/height.js';
import { generateMotionTokens } from '../src/generators/motion.js';
import { generateSpacingScale } from '../src/generators/spacing.js';
import { generateTypographyScale } from '../src/generators/typography.js';

describe('Schema Validation for Mathematical Metadata', () => {
  it('should validate typography tokens with mathRelationship metadata', () => {
    const tokens = generateTypographyScale('golden', 1, false);

    for (const token of tokens) {
      // Validate each token against the schema
      const result = TokenSchema.safeParse(token);
      expect(result.success).toBe(true);

      // Token validation checked above
    }

    // Verify some tokens have mathRelationship
    const tokensWithMath = tokens.filter((t) => t.mathRelationship);
    expect(tokensWithMath.length).toBeGreaterThan(0);
  });

  it('should validate spacing tokens with mathRelationship metadata', () => {
    const tokens = generateSpacingScale('golden', 4, 1.25, 6, false);

    for (const token of tokens) {
      const result = TokenSchema.safeParse(token);
      expect(result.success).toBe(true);

      // Token validation checked above
    }

    // Verify some tokens have mathRelationship
    const tokensWithMath = tokens.filter((t) => t.mathRelationship);
    expect(tokensWithMath.length).toBeGreaterThan(0);
  });

  it('should validate motion tokens with mathRelationship and motionDuration metadata', () => {
    const tokens = generateMotionTokens('golden', 75, false);

    for (const token of tokens) {
      const result = TokenSchema.safeParse(token);
      expect(result.success).toBe(true);

      // Token validation checked above
    }

    // Verify duration tokens have mathRelationship and motionDuration
    const durationTokens = tokens.filter((t) => t.category === 'motion');
    expect(durationTokens.length).toBeGreaterThan(0);

    const tokensWithMath = durationTokens.filter((t) => t.mathRelationship);
    expect(tokensWithMath.length).toBeGreaterThan(0);

    const tokensWithDuration = durationTokens.filter((t) => t.motionDuration);
    expect(tokensWithDuration.length).toBeGreaterThan(0);
  });

  it('should validate height tokens with mathRelationship metadata', () => {
    const tokens = generateHeightScale('golden', 2.5, 1.25, false);

    for (const token of tokens) {
      const result = TokenSchema.safeParse(token);
      expect(result.success).toBe(true);

      // Token validation checked above
    }

    // Verify some tokens have mathRelationship
    const tokensWithMath = tokens.filter((t) => t.mathRelationship);
    expect(tokensWithMath.length).toBeGreaterThan(0);
  });

  it('should validate border-radius tokens with mathRelationship metadata', () => {
    const tokens = generateBorderRadiusScale('golden', 4, 1.5, 6);

    for (const token of tokens) {
      const result = TokenSchema.safeParse(token);
      expect(result.success).toBe(true);

      // Token validation checked above
    }

    // Verify some tokens have mathRelationship
    const tokensWithMath = tokens.filter((t) => t.mathRelationship);
    expect(tokensWithMath.length).toBeGreaterThan(0);
  });

  it('should validate all mathematical metadata fields exist in schema', () => {
    // Generate tokens with various metadata
    const tokens = [
      ...generateTypographyScale('golden', 1, false),
      ...generateSpacingScale('golden', 4, 1.25, 4, false),
      ...generateMotionTokens('golden', 75, false),
      ...generateHeightScale('golden', 2.5, 1.25, false),
      ...generateBorderRadiusScale('golden', 4, 1.5, 6),
    ];

    // Collect all the mathematical metadata fields being used
    const fieldsUsed = new Set<string>();
    for (const token of tokens) {
      if (token.mathRelationship) fieldsUsed.add('mathRelationship');
      if (token.scalePosition !== undefined) fieldsUsed.add('scalePosition');
      if (token.motionDuration !== undefined) fieldsUsed.add('motionDuration');
      if (token.progressionSystem) fieldsUsed.add('progressionSystem');
      if (token.generatedFrom) fieldsUsed.add('generatedFrom');
    }

    // Verify we found the expected mathematical metadata fields
    expect(fieldsUsed.has('mathRelationship')).toBe(true);
    expect(fieldsUsed.has('scalePosition')).toBe(true);
    expect(fieldsUsed.has('motionDuration')).toBe(true);
    expect(fieldsUsed.has('progressionSystem')).toBe(true);
  });
});
