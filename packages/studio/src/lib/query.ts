/**
 * React Query hooks for Studio token management
 */

import type { Token } from '@rafters/shared';
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
} as const;

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
