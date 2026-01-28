/**
 * TanStack Query Setup
 *
 * Query client configuration and typed query hooks for Studio.
 */

import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Token } from '../api/token-loader';

/**
 * Studio query client with sensible defaults for a local dev tool.
 * No aggressive refetching - data only changes when the designer acts.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export interface TokensResponse {
  namespaces: string[];
  tokens: Record<string, Token[]>;
}

/**
 * Query key factories for type-safe cache management.
 */
export const tokenKeys = {
  all: ['tokens'] as const,
  namespace: (ns: string) => ['tokens', ns] as const,
  single: (ns: string, name: string) => ['tokens', ns, name] as const,
};

/**
 * Fetch all tokens from the Studio API.
 */
export async function fetchAllTokens(): Promise<TokensResponse> {
  const response = await fetch('/api/tokens');
  if (!response.ok) {
    throw new Error(`Failed to fetch tokens: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Update a single token with a reason.
 */
export async function updateToken(
  namespace: string,
  name: string,
  value: unknown,
  reason: string,
): Promise<Token> {
  const response = await fetch(`/api/token/${namespace}/${name}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value, reason }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to save token');
  }

  return data.token as Token;
}

export interface DependentInfo {
  name: string;
  namespace: string;
  currentValue: unknown;
  hasUserOverride: boolean;
  overrideReason?: string;
}

/**
 * Fetch tokens that depend on the given token name.
 */
export async function fetchTokenDependents(tokenName: string): Promise<DependentInfo[]> {
  const response = await fetch(`/api/dependents/${encodeURIComponent(tokenName)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch dependents: ${response.statusText}`);
  }
  const data = await response.json();
  return data.dependents as DependentInfo[];
}

/**
 * Mutation hook for updating a token with reason.
 * Automatically invalidates the token cache on success.
 */
export function useTokenMutation() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({
      namespace,
      name,
      value,
      reason,
    }: {
      namespace: string;
      name: string;
      value: unknown;
      reason: string;
    }) => updateToken(namespace, name, value, reason),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: tokenKeys.all });
    },
  });
}
