/**
 * React Query hooks for Studio token management
 *
 * Studio is a THIN UI on the registry. All token generation happens CLIENT-SIDE
 * using @rafters/color-utils and @rafters/design-tokens, then POSTed to /api/tokens.
 */

import {
  buildColorValue,
  generateOKLCHScale,
  generateRaftersHarmony,
} from '@rafters/color-utils';
import {
  DEFAULT_SYSTEM_CONFIG,
  generateColorTokens,
  resolveConfig,
} from '@rafters/design-tokens';
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
  config: ['config'] as const,
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

/**
 * Rafters config structure
 */
export interface RaftersConfig {
  framework?: string;
  componentsPath?: string;
  primitivesPath?: string;
  cssPath?: string | null;
  shadcn?: boolean;
  exports?: {
    tailwind?: boolean;
    typescript?: boolean;
    dtcg?: boolean;
    compiled?: boolean;
  };
  onboarded?: boolean;
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

interface ColorMutationVars {
  color: OKLCH;
  reason: string;
}

interface ColorMutationResponse {
  colorValue: ColorValue;
  families: Record<string, OKLCH>;
}

/**
 * The 11 Rafters color families derived from a primary color
 */
interface RaftersFamilies {
  // From generateRaftersHarmony (7)
  primary: OKLCH;
  secondary: OKLCH;
  tertiary: OKLCH;
  accent: OKLCH;
  highlight: OKLCH;
  surface: OKLCH;
  neutral: OKLCH;
  // From semanticSuggestions (4)
  destructive: OKLCH;
  success: OKLCH;
  warning: OKLCH;
  info: OKLCH;
}

/**
 * Generate all 11 Rafters families from a primary color
 */
function generateAllFamilies(primaryOklch: OKLCH): RaftersFamilies {
  const harmony = generateRaftersHarmony(primaryOklch);
  const colorValue = buildColorValue(primaryOklch);

  return {
    // From harmony
    primary: harmony.primary,
    secondary: harmony.secondary,
    tertiary: harmony.tertiary,
    accent: harmony.accent,
    highlight: harmony.highlight,
    surface: harmony.surface,
    neutral: harmony.neutral,
    // From semantic suggestions (pick first option as default)
    destructive: colorValue.semanticSuggestions.danger[0],
    success: colorValue.semanticSuggestions.success[0],
    warning: colorValue.semanticSuggestions.warning[0],
    info: colorValue.semanticSuggestions.info[0],
  };
}

/**
 * Fetch ColorValue with AI intelligence from Rafters API (async enrichment)
 */
async function fetchColorIntelligence(oklch: OKLCH): Promise<ColorValue> {
  const params = new URLSearchParams({
    l: oklch.l.toString(),
    c: oklch.c.toString(),
    h: oklch.h.toString(),
    sync: 'true',
  });

  const res = await fetch(`/api/tokens/color?${params}`);
  if (!res.ok) {
    throw new Error('Failed to fetch color intelligence');
  }

  const data = await res.json();
  return data.color;
}

/**
 * Enrich a family token with AI intelligence (async, non-blocking)
 */
function enrichFamilyWithIntelligence(
  familyName: string,
  oklch: OKLCH,
  queryClient: ReturnType<typeof useQueryClient>,
): void {
  fetchColorIntelligence(oklch)
    .then(async (enrichedColorValue) => {
      if (enrichedColorValue.intelligence) {
        const enrichedToken: Token = {
          name: familyName,
          value: enrichedColorValue,
          category: 'color',
          namespace: 'color',
          generatedAt: new Date().toISOString(),
        };

        await fetch('/api/tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([enrichedToken]),
        });

        queryClient.invalidateQueries({ queryKey: tokenKeys.all });
      }
    })
    .catch((err) => {
      // Non-fatal - math already written, intelligence is optional
      console.warn(`Failed to fetch intelligence for ${familyName}:`, err);
    });
}

/**
 * Mutation to set the primary color and generate all 11 families
 *
 * Two-phase approach:
 * 1. INSTANT: Generate all 11 families locally (math from color-utils)
 * 2. ASYNC: Fetch AI intelligence for each family from Rafters API
 *
 * Only primary requires userOverride (user's arbitrary choice).
 * Other families are mathematically derived - no explanation needed.
 */
export function usePrimaryColorMutation(): UseMutationResult<
  ColorMutationResponse,
  Error,
  ColorMutationVars
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ color, reason }: ColorMutationVars) => {
      // PHASE 1: Generate all 11 families instantly
      const families = generateAllFamilies(color);
      const colorValue = buildColorValue(color);
      const config = resolveConfig(DEFAULT_SYSTEM_CONFIG);
      const timestamp = new Date().toISOString();

      // Generate tokens for all families
      const allTokens: Token[] = [];

      for (const [familyName, familyOklch] of Object.entries(families)) {
        const scale = generateOKLCHScale(familyOklch);
        const familyTokens = generateColorTokens(config, [
          { name: familyName, scale, description: `${familyName} color family` },
        ]);

        // Only primary gets userOverride (user's arbitrary choice)
        // Other families are mathematically derived - no explanation needed
        if (familyName === 'primary') {
          allTokens.push(
            ...familyTokens.tokens.map((t) => ({
              ...t,
              userOverride: {
                reason,
                overriddenAt: timestamp,
              },
            })),
          );
        } else {
          allTokens.push(...familyTokens.tokens);
        }
      }

      // Write all tokens to registry
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allTokens),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to write tokens');
      }

      // PHASE 2: Async enrichment - fetch AI intelligence for each family
      // Fire and forget - don't block the UI
      for (const [familyName, familyOklch] of Object.entries(families)) {
        enrichFamilyWithIntelligence(familyName, familyOklch, queryClient);
      }

      return { colorValue, families };
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

/**
 * Fetch rafters config
 */
export function useConfig(): UseQueryResult<RaftersConfig> {
  return useQuery({
    queryKey: tokenKeys.config,
    queryFn: async (): Promise<RaftersConfig> => {
      const res = await fetch('/api/config');
      if (!res.ok) {
        // Return default if not found
        return { onboarded: false };
      }
      return res.json();
    },
  });
}

/**
 * Mutation to update rafters config
 */
export function useConfigMutation(): UseMutationResult<
  { success: boolean; config: RaftersConfig },
  Error,
  Partial<RaftersConfig>
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<RaftersConfig>) => {
      const res = await fetch('/api/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update config');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.config });
    },
  });
}
