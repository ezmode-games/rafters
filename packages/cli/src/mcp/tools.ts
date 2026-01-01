/**
 * MCP Tools for Rafters Design Token System
 *
 * Provides 5 tools for AI agents to interact with design tokens:
 * - rafters_list_namespaces: List available token namespaces
 * - rafters_get_tokens: Get tokens, filtered by namespace
 * - rafters_get_token: Get single token with full metadata
 * - rafters_search_tokens: Search by name or semantic meaning
 * - rafters_get_config: Get design system configuration
 */

import { readFile } from 'node:fs/promises';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { NodePersistenceAdapter, TokenRegistry } from '@rafters/design-tokens';
import type { Token } from '@rafters/shared';
import { getRaftersPaths } from '../utils/paths.js';

// Tool definitions for MCP server
export const TOOL_DEFINITIONS = [
  {
    name: 'rafters_list_namespaces',
    description:
      'List all available token namespaces in the design system. Returns an array of namespace names like color, spacing, typography, etc.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'rafters_get_tokens',
    description:
      'Get design tokens, optionally filtered by namespace. Returns tokens with full metadata including semantic meaning, usage patterns, and accessibility information.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        namespace: {
          type: 'string',
          description:
            'Optional namespace to filter tokens (e.g., "color", "spacing", "typography")',
        },
      },
      required: [],
    },
  },
  {
    name: 'rafters_get_token',
    description:
      'Get a single token by name with full metadata including semantic meaning, usage patterns, accessibility information, and why this token exists.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string',
          description: 'The exact token name to retrieve',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'rafters_search_tokens',
    description:
      'Search tokens by name or semantic meaning. Useful for finding tokens that match a concept like "primary action", "error state", or "heading text".',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query - matches token names and semantic meanings',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'rafters_get_config',
    description:
      'Get the design system configuration including framework detection, output paths, and generation settings.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
] as const;

// Tool handler class
export class RaftersToolHandler {
  private readonly adapter: NodePersistenceAdapter;
  private readonly projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.adapter = new NodePersistenceAdapter(projectRoot);
  }

  /**
   * Handle a tool call from MCP
   */
  async handleToolCall(name: string, args: Record<string, unknown>): Promise<CallToolResult> {
    switch (name) {
      case 'rafters_list_namespaces':
        return this.listNamespaces();
      case 'rafters_get_tokens':
        return this.getTokens(args.namespace as string | undefined);
      case 'rafters_get_token':
        return this.getToken(args.name as string);
      case 'rafters_search_tokens':
        return this.searchTokens(args.query as string, args.limit as number | undefined);
      case 'rafters_get_config':
        return this.getConfig();
      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  }

  /**
   * List all available token namespaces
   */
  private async listNamespaces(): Promise<CallToolResult> {
    try {
      const namespaces = await this.adapter.listNamespaces();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                namespaces,
                count: namespaces.length,
                description:
                  'Available token namespaces in the design system. Use rafters_get_tokens with a namespace to get tokens from a specific category.',
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.handleError('listNamespaces', error);
    }
  }

  /**
   * Get tokens, optionally filtered by namespace
   */
  private async getTokens(namespace?: string): Promise<CallToolResult> {
    try {
      const namespaces = namespace ? [namespace] : await this.adapter.listNamespaces();

      const allTokens: Token[] = [];

      for (const ns of namespaces) {
        try {
          const tokens = await this.adapter.loadNamespace(ns);
          allTokens.push(...tokens);
        } catch {
          // Namespace may not exist, skip silently
        }
      }

      // Create a registry to organize tokens
      const registry = new TokenRegistry(allTokens);
      const tokenList = registry.list(namespace ? { namespace } : undefined);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                tokens: tokenList.map((token) => this.formatTokenForAgent(token)),
                count: tokenList.length,
                namespace: namespace ?? 'all',
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.handleError('getTokens', error);
    }
  }

  /**
   * Get a single token by name
   */
  private async getToken(name: string): Promise<CallToolResult> {
    try {
      const namespaces = await this.adapter.listNamespaces();
      let foundToken: Token | undefined;

      for (const ns of namespaces) {
        try {
          const tokens = await this.adapter.loadNamespace(ns);
          foundToken = tokens.find((t) => t.name === name);
          if (foundToken) break;
        } catch {
          // Namespace may not exist, skip silently
        }
      }

      if (!foundToken) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  error: `Token "${name}" not found`,
                  suggestion:
                    'Use rafters_list_namespaces to see available namespaces, then rafters_get_tokens to list tokens.',
                },
                null,
                2,
              ),
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(this.formatTokenForAgent(foundToken), null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError('getToken', error);
    }
  }

  /**
   * Search tokens by name or semantic meaning
   */
  private async searchTokens(query: string, limit: number = 10): Promise<CallToolResult> {
    try {
      const namespaces = await this.adapter.listNamespaces();
      const allTokens: Token[] = [];

      for (const ns of namespaces) {
        try {
          const tokens = await this.adapter.loadNamespace(ns);
          allTokens.push(...tokens);
        } catch {
          // Namespace may not exist, skip silently
        }
      }

      const queryLower = query.toLowerCase();

      // Search by name, semantic meaning, and description
      const matches = allTokens.filter((token) => {
        const nameMatch = token.name.toLowerCase().includes(queryLower);
        const semanticMatch = token.semanticMeaning?.toLowerCase().includes(queryLower);
        const descriptionMatch = token.description?.toLowerCase().includes(queryLower);
        const categoryMatch = token.category.toLowerCase().includes(queryLower);
        const usageMatch = token.usageContext?.some((ctx) =>
          ctx.toLowerCase().includes(queryLower),
        );

        return nameMatch || semanticMatch || descriptionMatch || categoryMatch || usageMatch;
      });

      // Score and sort matches
      const scored = matches.map((token) => {
        let score = 0;
        const nameLower = token.name.toLowerCase();

        // Exact name match gets highest score
        if (nameLower === queryLower) score += 100;
        // Name starts with query
        else if (nameLower.startsWith(queryLower)) score += 50;
        // Name contains query
        else if (nameLower.includes(queryLower)) score += 25;

        // Semantic meaning match
        if (token.semanticMeaning?.toLowerCase().includes(queryLower)) {
          score += 30;
        }

        // Description match
        if (token.description?.toLowerCase().includes(queryLower)) {
          score += 10;
        }

        return { token, score };
      });

      scored.sort((a, b) => b.score - a.score);

      const results = scored.slice(0, limit).map(({ token }) => token);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                query,
                results: results.map((token) => this.formatTokenForAgent(token)),
                count: results.length,
                totalMatches: matches.length,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.handleError('searchTokens', error);
    }
  }

  /**
   * Get design system configuration
   */
  private async getConfig(): Promise<CallToolResult> {
    try {
      const paths = getRaftersPaths(this.projectRoot);

      let config: Record<string, unknown> = {};
      try {
        const configContent = await readFile(paths.config, 'utf-8');
        config = JSON.parse(configContent);
      } catch {
        // Config may not exist
        config = {
          error: 'Configuration file not found',
          suggestion: 'Run "rafters init" to initialize the design system in this project.',
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                projectRoot: this.projectRoot,
                paths: {
                  raftersDir: paths.root,
                  config: paths.config,
                  tokens: paths.tokens,
                  output: paths.output,
                },
                config,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.handleError('getConfig', error);
    }
  }

  /**
   * Format a token with intelligence for AI agent consumption
   */
  private formatTokenForAgent(token: Token): Record<string, unknown> {
    // Build a comprehensive view of the token for AI agents
    const formatted: Record<string, unknown> = {
      name: token.name,
      value: token.value,
      category: token.category,
      namespace: token.namespace,
    };

    // Add semantic intelligence - the "why" for AI agents
    if (token.semanticMeaning) {
      formatted.semanticMeaning = token.semanticMeaning;
    }

    if (token.usageContext && token.usageContext.length > 0) {
      formatted.usageContext = token.usageContext;
    }

    if (token.usagePatterns) {
      formatted.usagePatterns = token.usagePatterns;
    }

    if (token.appliesWhen && token.appliesWhen.length > 0) {
      formatted.appliesWhen = token.appliesWhen;
    }

    // Add accessibility information
    if (token.accessibilityLevel) {
      formatted.accessibilityLevel = token.accessibilityLevel;
    }

    // Add trust and consequence information for UI decisions
    if (token.trustLevel) {
      formatted.trustLevel = token.trustLevel;
    }

    if (token.consequence) {
      formatted.consequence = token.consequence;
    }

    // Add cognitive load for design decisions
    if (token.cognitiveLoad) {
      formatted.cognitiveLoad = token.cognitiveLoad;
    }

    // Add dependency information
    if (token.dependsOn && token.dependsOn.length > 0) {
      formatted.dependsOn = token.dependsOn;
    }

    if (token.generationRule) {
      formatted.generationRule = token.generationRule;
    }

    // Add component associations
    if (token.applicableComponents && token.applicableComponents.length > 0) {
      formatted.applicableComponents = token.applicableComponents;
    }

    // Add user override information if present
    if (token.userOverride) {
      formatted.userOverride = {
        reason: token.userOverride.reason,
        overriddenAt: token.userOverride.overriddenAt,
        previousValue: token.userOverride.previousValue,
        context: token.userOverride.context,
      };
    }

    // Add computed vs actual value comparison if different
    if (
      token.computedValue &&
      JSON.stringify(token.computedValue) !== JSON.stringify(token.value)
    ) {
      formatted.computedValue = token.computedValue;
      formatted.hasDeviation = true;
    }

    // Add description if present
    if (token.description) {
      formatted.description = token.description;
    }

    return formatted;
  }

  /**
   * Handle errors consistently
   */
  private handleError(operation: string, error: unknown): CallToolResult {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: `Failed to ${operation}: ${message}`,
              operation,
              suggestion:
                'Ensure you are in a project with .rafters/ directory. Run "rafters init" to initialize.',
            },
            null,
            2,
          ),
        },
      ],
      isError: true,
    };
  }
}
