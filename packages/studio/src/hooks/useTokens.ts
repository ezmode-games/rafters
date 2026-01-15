/**
 * Token Hooks for Studio
 *
 * React hooks for fetching and managing token data from the API.
 */

import { useCallback, useEffect, useState } from 'react';
import type { Token } from '../api/token-loader';

export interface TokensState {
  namespaces: string[];
  tokens: Record<string, Token[]>;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch all tokens from the Studio API
 */
export function useTokens(): TokensState & {
  refetch: () => Promise<void>;
} {
  const [state, setState] = useState<TokensState>({
    namespaces: [],
    tokens: {},
    loading: true,
    error: null,
  });

  const fetchTokens = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/tokens');
      if (!response.ok) {
        throw new Error(`Failed to fetch tokens: ${response.statusText}`);
      }

      const data = await response.json();
      setState({
        namespaces: data.namespaces,
        tokens: data.tokens,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return { ...state, refetch: fetchTokens };
}

/**
 * Get a specific token by name
 */
export function useToken(tokens: Record<string, Token[]>, tokenName: string | null): Token | null {
  if (!tokenName) return null;

  for (const namespaceTokens of Object.values(tokens)) {
    const token = namespaceTokens.find((t) => t.name === tokenName);
    if (token) return token;
  }

  return null;
}

/**
 * Save tokens to the API
 */
export function useSaveTokens(): {
  save: (namespace: string, tokens: Token[]) => Promise<void>;
  saving: boolean;
  error: string | null;
} {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (namespace: string, tokens: Token[]) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/save/${namespace}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save tokens: ${response.statusText}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return { save, saving, error };
}
