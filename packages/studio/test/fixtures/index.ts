/**
 * Studio test fixtures generated from Zod schemas using zocker
 *
 * Zero drift - fixtures always match schema definitions
 */

import { ColorValueSchema, OKLCHSchema } from '@rafters/shared';
import { zocker } from 'zocker';

// Create generators with seed for reproducibility
const oklchGenerator = zocker(OKLCHSchema).setSeed(42);
const colorValueGenerator = zocker(ColorValueSchema).setSeed(42);

/**
 * Generate a mock OKLCH scale array (11 positions)
 * ColorValue.scale is an array, not a record
 */
function createMockScaleArray() {
  const positions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  return positions.map((pos) => {
    const lightness = 1 - pos / 1000; // 50 -> 0.95, 500 -> 0.5, 950 -> 0.05
    return oklchGenerator
      .supply(OKLCHSchema.shape.l, Math.max(0.05, Math.min(0.95, lightness)))
      .supply(OKLCHSchema.shape.alpha, 1)
      .generate();
  });
}

/**
 * Generate a full ColorValue from schema
 * This is what the registry returns - complete with scale, name, and all intelligence
 */
export function createMockColorValue() {
  return colorValueGenerator
    .supply(ColorValueSchema.shape.name, 'test-blue')
    .supply(ColorValueSchema.shape.scale, createMockScaleArray())
    .supply(ColorValueSchema.shape.token, 'primary')
    .supply(ColorValueSchema.shape.use, 'test reason')
    .generate();
}

/**
 * Pre-generated ColorValue for tests that need stable values
 */
export const mockColorValue = createMockColorValue();
