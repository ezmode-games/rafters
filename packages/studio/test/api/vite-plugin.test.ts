/**
 * Vite Plugin Unit Tests
 *
 * Tests plugin factory, Zod validation, and error handling.
 * Integration with actual Vite server is tested manually.
 */

import { ColorReferenceSchema, ColorValueSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { studioApiPlugin } from '../../src/api/vite-plugin';

// Replicate the schema from vite-plugin.ts to test validation logic
const SetTokenMessageSchema = z.object({
  name: z.string().min(1),
  value: z.union([z.string(), ColorValueSchema, ColorReferenceSchema]),
  persist: z.boolean().optional(),
});

describe('studioApiPlugin', () => {
  describe('plugin factory', () => {
    it('exports a function', () => {
      expect(typeof studioApiPlugin).toBe('function');
    });

    it('returns plugin with correct name', () => {
      const plugin = studioApiPlugin();
      expect(plugin.name).toBe('rafters-studio-api');
    });

    it('has configureServer hook', () => {
      const plugin = studioApiPlugin();
      expect(typeof plugin.configureServer).toBe('function');
    });
  });

  describe('SetTokenMessageSchema validation', () => {
    it('accepts valid string value', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: 'primary',
        value: 'oklch(0.5 0.2 250)',
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid ColorReference value', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: 'primary',
        value: { family: 'neutral', position: '500' },
      });
      expect(result.success).toBe(true);
    });

    it('accepts persist: true', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: 'primary',
        value: 'red',
        persist: true,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.persist).toBe(true);
      }
    });

    it('accepts persist: false', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: 'primary',
        value: 'red',
        persist: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.persist).toBe(false);
      }
    });

    it('defaults persist to undefined when not provided', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: 'primary',
        value: 'red',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.persist).toBeUndefined();
      }
    });

    it('rejects empty name', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: '',
        value: 'red',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing name', () => {
      const result = SetTokenMessageSchema.safeParse({
        value: 'red',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing value', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: 'primary',
      });
      expect(result.success).toBe(false);
    });

    it('rejects null value', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: 'primary',
        value: null,
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid ColorReference (missing family)', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: 'primary',
        value: { position: '500' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid ColorReference (missing position)', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: 'primary',
        value: { family: 'neutral' },
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-string persist', () => {
      const result = SetTokenMessageSchema.safeParse({
        name: 'primary',
        value: 'red',
        persist: 'true',
      });
      expect(result.success).toBe(false);
    });

    it('rejects completely invalid payload', () => {
      const result = SetTokenMessageSchema.safeParse('not an object');
      expect(result.success).toBe(false);
    });

    it('rejects array payload', () => {
      const result = SetTokenMessageSchema.safeParse([{ name: 'test', value: 'red' }]);
      expect(result.success).toBe(false);
    });
  });
});
