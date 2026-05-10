import { z } from 'zod';

// Build a z.enum from a non-empty readonly array of literal string keys.
// Hides the [k, ...k[]] tuple cast required by Zod when the array is built
// dynamically (e.g. from Object.keys of a generator const).
export function enumOf<T extends string>(keys: readonly T[]): z.ZodEnum<Record<T, T>> {
  return z.enum(keys as unknown as [T, ...T[]]);
}
