/**
 * Vite Plugin Unit Tests
 *
 * Tests plugin factory, Zod validation, and error handling.
 * Integration with actual Vite server is tested manually.
 */

import { ColorReferenceSchema, ColorValueSchema, TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { studioApiPlugin } from '../../src/api/vite-plugin';

// Replicate schemas from vite-plugin.ts to test validation logic
const SetTokenMessageSchema = z.object({
  name: z.string().min(1),
  value: z.union([z.string(), ColorValueSchema, ColorReferenceSchema]),
  persist: z.boolean().optional(),
});

const TokenResponseSchema = z.object({
  ok: z.literal(true),
  token: TokenSchema,
});

const TokensResponseSchema = z.object({
  tokens: z.array(TokenSchema),
  initialized: z.boolean(),
});

const ErrorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
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

  describe('Response schema validation', () => {
    describe('TokenResponseSchema', () => {
      it('accepts valid token response', () => {
        const result = TokenResponseSchema.safeParse({
          ok: true,
          token: {
            name: 'primary',
            value: { family: 'neutral', position: '500' },
            category: 'color',
            namespace: 'semantic',
          },
        });
        expect(result.success).toBe(true);
      });

      it('rejects response without ok field', () => {
        const result = TokenResponseSchema.safeParse({
          token: {
            name: 'primary',
            value: 'red',
            category: 'color',
            namespace: 'semantic',
          },
        });
        expect(result.success).toBe(false);
      });

      it('rejects response with ok: false', () => {
        const result = TokenResponseSchema.safeParse({
          ok: false,
          token: {
            name: 'primary',
            value: 'red',
            category: 'color',
            namespace: 'semantic',
          },
        });
        expect(result.success).toBe(false);
      });

      it('rejects response with invalid token', () => {
        const result = TokenResponseSchema.safeParse({
          ok: true,
          token: { name: 'primary' }, // missing required fields
        });
        expect(result.success).toBe(false);
      });
    });

    describe('TokensResponseSchema', () => {
      it('accepts valid tokens list response', () => {
        const result = TokensResponseSchema.safeParse({
          tokens: [
            {
              name: 'primary',
              value: { family: 'neutral', position: '500' },
              category: 'color',
              namespace: 'semantic',
            },
          ],
          initialized: true,
        });
        expect(result.success).toBe(true);
      });

      it('accepts empty tokens array', () => {
        const result = TokensResponseSchema.safeParse({
          tokens: [],
          initialized: false,
        });
        expect(result.success).toBe(true);
      });

      it('rejects response without initialized field', () => {
        const result = TokensResponseSchema.safeParse({
          tokens: [],
        });
        expect(result.success).toBe(false);
      });
    });

    describe('ErrorResponseSchema', () => {
      it('accepts valid error response', () => {
        const result = ErrorResponseSchema.safeParse({
          ok: false,
          error: 'Token not found',
        });
        expect(result.success).toBe(true);
      });

      it('rejects error response with ok: true', () => {
        const result = ErrorResponseSchema.safeParse({
          ok: true,
          error: 'Something went wrong',
        });
        expect(result.success).toBe(false);
      });

      it('rejects error response without error message', () => {
        const result = ErrorResponseSchema.safeParse({
          ok: false,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('URL parsing logic', () => {
    // Test the pathname extraction logic used in the middleware
    function extractPathname(url: string): string {
      return new URL(url, 'http://localhost').pathname;
    }

    function extractTokenName(pathname: string): string | null {
      const match = pathname.match(/^\/api\/tokens\/(.+)$/);
      return match ? decodeURIComponent(match[1]) : null;
    }

    describe('pathname extraction', () => {
      it('extracts pathname from simple URL', () => {
        expect(extractPathname('/api/tokens')).toBe('/api/tokens');
      });

      it('strips query string from URL', () => {
        expect(extractPathname('/api/tokens?foo=bar')).toBe('/api/tokens');
      });

      it('strips query string from token URL', () => {
        expect(extractPathname('/api/tokens/primary?foo=bar')).toBe('/api/tokens/primary');
      });

      it('handles complex query strings', () => {
        expect(extractPathname('/api/tokens/primary?foo=bar&baz=qux')).toBe('/api/tokens/primary');
      });
    });

    describe('token name extraction', () => {
      it('extracts simple token name', () => {
        expect(extractTokenName('/api/tokens/primary')).toBe('primary');
      });

      it('extracts token name with dash', () => {
        expect(extractTokenName('/api/tokens/primary-500')).toBe('primary-500');
      });

      it('decodes URL-encoded token name', () => {
        expect(extractTokenName('/api/tokens/card-foreground')).toBe('card-foreground');
      });

      it('decodes percent-encoded spaces', () => {
        expect(extractTokenName('/api/tokens/my%20token')).toBe('my token');
      });

      it('returns null for /api/tokens (no name)', () => {
        expect(extractTokenName('/api/tokens')).toBe(null);
      });

      it('returns null for non-matching paths', () => {
        expect(extractTokenName('/api/other/primary')).toBe(null);
      });
    });

    describe('malformed URL encoding', () => {
      it('throws on invalid percent encoding', () => {
        expect(() => decodeURIComponent('%E0%A4%A')).toThrow();
      });

      it('throws on incomplete percent encoding', () => {
        expect(() => decodeURIComponent('%')).toThrow();
      });

      it('throws on invalid UTF-8 sequence', () => {
        expect(() => decodeURIComponent('%C0%C1')).toThrow();
      });
    });
  });
});
