/**
 * React Query hooks for Studio token management
 */

import type { ColorValue, OKLCH, Token } from '@rafters/shared';
import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

/**
 * Query keys for token data
 */
export const tokenKeys = {
  all: ['tokens'] as const,
  namespace: (ns: string) => ['tokens', ns] as const,
  log: ['registry', 'log'] as const,
} as const;

/**
 * Registry activity log entry
 */
export interface LogEntry {
  timestamp: string;
  type: 'load' | 'add' | 'update' | 'change' | 'persist' | 'init';
  message: string;
  details?: unknown;
}

interface LogResponse {
  log: LogEntry[];
}

interface TokensResponse {
  tokens: Record<string, Token[]>;
}

interface TokenMutationVars {
  namespace: string;
  name: string;
  value: unknown;
  reason?: string;
}

/**
 * Fetch all tokens grouped by namespace
 */
export function useTokens(): UseQueryResult<TokensResponse> {
  return useQuery({
    queryKey: tokenKeys.all,
    queryFn: async (): Promise<TokensResponse> => {
      const res = await fetch('/api/tokens');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch tokens');
      }
      return res.json();
    },
  });
}

/**
 * Fetch registry activity log - polls every 2 seconds
 */
export function useRegistryLog(): UseQueryResult<LogResponse> {
  return useQuery({
    queryKey: tokenKeys.log,
    queryFn: async (): Promise<LogResponse> => {
      const res = await fetch('/api/registry/log');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch log');
      }
      return res.json();
    },
    refetchInterval: 2000, // Poll every 2 seconds
  });
}

/**
 * Mutation to update a token value
 */
export function useTokenMutation(): UseMutationResult<
  { success: boolean },
  Error,
  TokenMutationVars
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ namespace, name, value, reason }: TokenMutationVars) => {
      const res = await fetch(`/api/token/${namespace}/${name}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, reason }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update token');
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate token queries to refetch
      queryClient.invalidateQueries({ queryKey: tokenKeys.all });
    },
  });
}

interface PrimaryColorMutationVars {
  color: OKLCH;
  reason: string;
}

interface PrimaryColorResponse {
  success: boolean;
  colorValue: ColorValue;
}

/**
 * Mutation to set the primary color
 * Builds full ColorValue (scale, harmonies, accessibility, etc.) and writes to registry
 */
export function usePrimaryColorMutation(): UseMutationResult<
  PrimaryColorResponse,
  Error,
  PrimaryColorMutationVars
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ color, reason }: PrimaryColorMutationVars) => {
      const res = await fetch('/api/tokens/primary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color, reason }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to set primary color');
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate token queries to refetch - CSS will update via HMR
      queryClient.invalidateQueries({ queryKey: tokenKeys.all });
    },
  });
}

interface SemanticColorChoice {
  color: OKLCH;
  reason: string;
}

interface SemanticColorsMutationVars {
  colors: Record<string, SemanticColorChoice>;
}

interface SemanticColorsResponse {
  success: boolean;
  updated: string[];
}

/**
 * Mutation to set all semantic colors at once
 * Updates secondary, tertiary, accent, highlight, surface, neutral,
 * danger, success, warning, and info color tokens
 */
export function useSemanticColorsMutation(): UseMutationResult<
  SemanticColorsResponse,
  Error,
  SemanticColorsMutationVars
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ colors }: SemanticColorsMutationVars) => {
      const res = await fetch('/api/tokens/semantics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to set semantic colors');
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate token queries to refetch - CSS will update via HMR
      queryClient.invalidateQueries({ queryKey: tokenKeys.all });
    },
  });
}
