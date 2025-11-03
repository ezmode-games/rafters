import { zocker } from 'zocker';
import { z } from 'zod';

/**
 * Test utilities for generating fixtures with Zocker
 * Uses schema-driven test data generation for deterministic, valid test data
 */

/**
 * Generate test data from a Zod schema with optional seed for determinism
 */
export function generateTestData<T extends z.ZodTypeAny>(
  schema: T,
  options: { seed?: number } = {},
): z.infer<T> {
  return zocker(schema, { seed: options.seed ?? 42 }).generate();
}

/**
 * Generate an array of test data from a Zod schema
 */
export function generateTestArray<T extends z.ZodTypeAny>(
  schema: T,
  count: number,
  options: { seed?: number } = {},
): Array<z.infer<T>> {
  const arraySchema = z.array(schema).length(count);
  return zocker(arraySchema, { seed: options.seed ?? 42 }).generate();
}

/**
 * Create a test fixture factory for a given schema
 * Returns a function that generates new instances with incremental seeds
 */
export function createFixtureFactory<T extends z.ZodTypeAny>(schema: T, baseSeed = 42) {
  let counter = 0;

  return {
    generate: (overrides?: Partial<z.infer<T>>): z.infer<T> => {
      const generated = zocker(schema, { seed: baseSeed + counter }).generate();
      counter++;
      return overrides ? { ...generated, ...overrides } : generated;
    },
    generateMany: (count: number): Array<z.infer<T>> => {
      const items: Array<z.infer<T>> = [];
      for (let i = 0; i < count; i++) {
        items.push(zocker(schema, { seed: baseSeed + counter }).generate());
        counter++;
      }
      return items;
    },
    reset: () => {
      counter = 0;
    },
  };
}
