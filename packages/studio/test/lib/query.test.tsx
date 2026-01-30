/**
 * Query Hooks Tests
 *
 * Exhaustive tests for React Query hooks.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  tokenKeys,
  usePrimaryColorMutation,
  useTokenMutation,
  useTokens,
} from '../../src/lib/query';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Query Hooks', () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
    mockFetch.mockReset();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('tokenKeys', () => {
    it('generates all tokens key', () => {
      expect(tokenKeys.all).toEqual(['tokens']);
    });

    it('generates namespace-specific key', () => {
      expect(tokenKeys.namespace('color')).toEqual(['tokens', 'color']);
    });

    it('generates different keys for different namespaces', () => {
      expect(tokenKeys.namespace('color')).not.toEqual(tokenKeys.namespace('spacing'));
    });
  });

  describe('useTokens', () => {
    it('fetches tokens from /api/tokens', async () => {
      const mockTokens = {
        tokens: {
          color: [{ name: 'primary', value: 'blue' }],
        },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokens),
      });

      const { result } = renderHook(() => useTokens(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockFetch).toHaveBeenCalledWith('/api/tokens');
      expect(result.current.data).toEqual(mockTokens);
    });

    it('handles fetch errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      const { result } = renderHook(() => useTokens(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error?.message).toBe('Server error');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failed'));

      const { result } = renderHook(() => useTokens(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('provides loading state', async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ tokens: {} }),
                }),
              100,
            ),
          ),
      );

      const { result } = renderHook(() => useTokens(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });
  });

  describe('useTokenMutation', () => {
    it('sends PATCH request with token data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() => useTokenMutation(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          namespace: 'color',
          name: 'primary',
          value: 'red',
          reason: 'brand update',
        });
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/token/color/primary', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 'red', reason: 'brand update' }),
      });
    });

    it('invalidates token queries on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useTokenMutation(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          namespace: 'color',
          name: 'primary',
          value: 'red',
        });
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: tokenKeys.all });
    });

    it('handles mutation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Token not found' }),
      });

      const { result } = renderHook(() => useTokenMutation(), { wrapper });

      await expect(
        act(async () => {
          await result.current.mutateAsync({
            namespace: 'color',
            name: 'nonexistent',
            value: 'red',
          });
        }),
      ).rejects.toThrow('Token not found');
    });

    it('handles missing reason (optional)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() => useTokenMutation(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          namespace: 'color',
          name: 'primary',
          value: 'blue',
          // No reason provided
        });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/token/color/primary',
        expect.objectContaining({
          body: JSON.stringify({ value: 'blue', reason: undefined }),
        }),
      );
    });

    it('tracks pending state', async () => {
      let resolvePromise: () => void;
      const pendingPromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      mockFetch.mockImplementation(async () => {
        await pendingPromise;
        return {
          ok: true,
          json: () => Promise.resolve({ success: true }),
        };
      });

      const { result } = renderHook(() => useTokenMutation(), { wrapper });

      act(() => {
        result.current.mutate({
          namespace: 'color',
          name: 'primary',
          value: 'red',
        });
      });

      await waitFor(() => expect(result.current.isPending).toBe(true));

      act(() => {
        resolvePromise?.();
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));
    });
  });

  describe('usePrimaryColorMutation', () => {
    const mockColor = { l: 0.6, c: 0.15, h: 180, alpha: 1 };
    const mockScale = {
      '50': { l: 0.98, c: 0.02, h: 180, alpha: 1 },
      '500': { l: 0.6, c: 0.15, h: 180, alpha: 1 },
      '900': { l: 0.08, c: 0.12, h: 180, alpha: 1 },
    };

    it('sends POST request to /api/tokens/primary', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, scale: mockScale }),
      });

      const { result } = renderHook(() => usePrimaryColorMutation(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          color: mockColor,
          reason: 'brand color',
        });
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/tokens/primary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color: mockColor, reason: 'brand color' }),
      });
    });

    it('returns scale in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, scale: mockScale }),
      });

      const { result } = renderHook(() => usePrimaryColorMutation(), { wrapper });

      let response: { success: boolean; scale: typeof mockScale } | undefined;
      await act(async () => {
        response = await result.current.mutateAsync({
          color: mockColor,
          reason: 'test',
        });
      });

      expect(response?.scale).toEqual(mockScale);
    });

    it('invalidates token queries on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, scale: mockScale }),
      });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => usePrimaryColorMutation(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          color: mockColor,
          reason: 'test',
        });
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: tokenKeys.all });
    });

    it('handles server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid color format' }),
      });

      const { result } = renderHook(() => usePrimaryColorMutation(), { wrapper });

      await expect(
        act(async () => {
          await result.current.mutateAsync({
            color: mockColor,
            reason: 'test',
          });
        }),
      ).rejects.toThrow('Invalid color format');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failed'));

      const { result } = renderHook(() => usePrimaryColorMutation(), { wrapper });

      await expect(
        act(async () => {
          await result.current.mutateAsync({
            color: mockColor,
            reason: 'test',
          });
        }),
      ).rejects.toThrow('Network failed');
    });

    it('tracks pending state', async () => {
      let resolvePromise: () => void;
      const pendingPromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      mockFetch.mockImplementation(async () => {
        await pendingPromise;
        return {
          ok: true,
          json: () => Promise.resolve({ success: true, scale: mockScale }),
        };
      });

      const { result } = renderHook(() => usePrimaryColorMutation(), { wrapper });

      act(() => {
        result.current.mutate({
          color: mockColor,
          reason: 'test',
        });
      });

      await waitFor(() => expect(result.current.isPending).toBe(true));

      act(() => {
        resolvePromise?.();
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));
    });

    it('supports onSuccess callback', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, scale: mockScale }),
      });

      const onSuccess = vi.fn();
      const { result } = renderHook(() => usePrimaryColorMutation(), { wrapper });

      await act(async () => {
        result.current.mutate({ color: mockColor, reason: 'test' }, { onSuccess });
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it('supports onError callback', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed' }),
      });

      const onError = vi.fn();
      const { result } = renderHook(() => usePrimaryColorMutation(), { wrapper });

      await act(async () => {
        result.current.mutate({ color: mockColor, reason: 'test' }, { onError });
      });

      await waitFor(() => expect(onError).toHaveBeenCalled());
    });
  });

  describe('integration', () => {
    it('useTokens and useTokenMutation work together', async () => {
      // Initial fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            tokens: { color: [{ name: 'primary', value: 'blue' }] },
          }),
      });

      // Mutation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      // Refetch after invalidation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            tokens: { color: [{ name: 'primary', value: 'red' }] },
          }),
      });

      const { result: tokensResult } = renderHook(() => useTokens(), { wrapper });
      const { result: mutationResult } = renderHook(() => useTokenMutation(), {
        wrapper,
      });

      // Wait for initial fetch
      await waitFor(() => expect(tokensResult.current.isSuccess).toBe(true));
      expect(tokensResult.current.data?.tokens.color[0].value).toBe('blue');

      // Mutate
      await act(async () => {
        await mutationResult.current.mutateAsync({
          namespace: 'color',
          name: 'primary',
          value: 'red',
        });
      });

      // Wait for refetch after invalidation
      await waitFor(() => expect(tokensResult.current.data?.tokens.color[0].value).toBe('red'));
    });
  });
});
