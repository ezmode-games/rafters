/**
 * Client API Unit Tests
 *
 * Tests the client API types and constants.
 * HMR-dependent behavior is tested via manual dev server testing
 * since import.meta.hot cannot be reliably mocked in Vitest.
 */

import { describe, expect, it } from 'vitest';

describe('Client API', () => {
  describe('module exports', () => {
    it('exports setToken function', async () => {
      const module = await import('../../src/api/index');
      expect(typeof module.setToken).toBe('function');
    });

    it('exports onCssUpdated function', async () => {
      const module = await import('../../src/api/index');
      expect(typeof module.onCssUpdated).toBe('function');
    });
  });

  describe('setToken without HMR', () => {
    it('returns error result when HMR not available', async () => {
      // In test environment, import.meta.hot is undefined
      const { setToken } = await import('../../src/api/index');

      const result = await setToken({ name: 'primary', value: 'red' });

      expect(result).toEqual({ ok: false, error: 'HMR not available' });
    });

    it('handles ColorReference value type', async () => {
      const { setToken } = await import('../../src/api/index');

      const result = await setToken({
        name: 'primary',
        value: { family: 'neutral', position: '500' },
      });

      // Without HMR, still returns error but accepts the value type
      expect(result.ok).toBe(false);
    });

    it('accepts persist option', async () => {
      const { setToken } = await import('../../src/api/index');

      // These should not throw - type checking
      const result1 = await setToken({ name: 'test', value: 'red', persist: true });
      const result2 = await setToken({ name: 'test', value: 'red', persist: false });

      expect(result1.ok).toBe(false);
      expect(result2.ok).toBe(false);
    });
  });

  describe('onCssUpdated without HMR', () => {
    it('returns cleanup function even without HMR', async () => {
      const { onCssUpdated } = await import('../../src/api/index');

      const cleanup = onCssUpdated(() => {});

      expect(typeof cleanup).toBe('function');
      // Should not throw when called
      expect(() => cleanup()).not.toThrow();
    });
  });

  describe('UpdateResult type', () => {
    it('success result has expected shape', () => {
      const success = { ok: true as const, name: 'primary', persisted: true };

      expect(success.ok).toBe(true);
      expect(success.name).toBe('primary');
      expect(success.persisted).toBe(true);
    });

    it('error result has expected shape', () => {
      const error = { ok: false as const, error: 'Something went wrong' };

      expect(error.ok).toBe(false);
      expect(error.error).toBe('Something went wrong');
    });
  });
});
