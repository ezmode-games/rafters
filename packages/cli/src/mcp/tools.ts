/**
 * MCP Tools for Rafters Design Token System
 *
 * Provides tools for AI agents to interact with design tokens and components:
 *
 * Token Tools:
 * - rafters_list_namespaces: List available token namespaces
 * - rafters_get_tokens: Get tokens, filtered by namespace
 * - rafters_get_token: Get single token with full metadata
 * - rafters_search_tokens: Search by name or semantic meaning
 * - rafters_get_config: Get design system configuration
 *
 * Component Intelligence Tools:
 * - rafters_list_components: List all available UI components
 * - rafters_get_component: Get component intelligence and metadata
 * - rafters_search_components: Search components by name or cognitive load
 *
 * Design Decision Tools:
 * - rafters_get_design_decisions: Get tokens with user overrides (design decisions)
 */

import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { NodePersistenceAdapter, TokenRegistry } from '@rafters/design-tokens';
import {
  type ComponentMetadata,
  extractDependencies,
  extractPrimitiveDependencies,
  extractSizes,
  extractVariants,
  parseDescription,
  parseJSDocIntelligence,
  type Token,
  toDisplayName,
} from '@rafters/shared';
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
  // Component Intelligence Tools
  {
    name: 'rafters_list_components',
    description:
      'List all available UI components with their cognitive load scores and categories. Useful for understanding the component library at a glance.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string',
          description:
            'Optional category filter (layout, form, feedback, navigation, overlay, data-display, utility)',
        },
      },
      required: [],
    },
  },
  {
    name: 'rafters_get_component',
    description:
      'Get full intelligence metadata for a component including cognitive load, attention economics, accessibility requirements, trust-building patterns, usage guidelines (DO/NEVER), variants, sizes, and dependencies.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string',
          description: 'Component name (e.g., "button", "dialog", "popover")',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'rafters_search_components',
    description:
      'Search components by name, category, or cognitive load threshold. Useful for finding components that match specific criteria like "low cognitive load form components".',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query - matches component names and descriptions',
        },
        maxCognitiveLoad: {
          type: 'number',
          description: 'Maximum cognitive load score (0-10) to filter by',
        },
        category: {
          type: 'string',
          description: 'Optional category filter',
        },
      },
      required: [],
    },
  },
  // Design Decision Tools
  {
    name: 'rafters_get_design_decisions',
    description:
      'Get all design decisions (tokens with user overrides). Returns tokens where a designer made an explicit choice to deviate from computed values, including the reason, who made the decision, and context.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        namespace: {
          type: 'string',
          description: 'Optional namespace to filter design decisions',
        },
        tag: {
          type: 'string',
          description: 'Optional tag to filter by (e.g., "brand", "accessibility", "temporary")',
        },
      },
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
      case 'rafters_list_components':
        return this.listComponents(args.category as string | undefined);
      case 'rafters_get_component':
        return this.getComponent(args.name as string);
      case 'rafters_search_components':
        return this.searchComponents(
          args.query as string | undefined,
          args.maxCognitiveLoad as number | undefined,
          args.category as string | undefined,
        );
      case 'rafters_get_design_decisions':
        return this.getDesignDecisions(
          args.namespace as string | undefined,
          args.tag as string | undefined,
        );
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

  // ==================== Component Intelligence Tools ====================

  /**
   * Get path to UI components directory
   */
  private getComponentsPath(): string {
    // Try monorepo structure first, then fallback to node_modules
    const monorepoPath = join(this.projectRoot, 'packages/ui/src/components/ui');
    return monorepoPath;
  }

  /**
   * Load component metadata from source file
   */
  private async loadComponentMetadata(name: string): Promise<ComponentMetadata | null> {
    const componentsPath = this.getComponentsPath();
    const filePath = join(componentsPath, `${name}.tsx`);

    try {
      const source = await readFile(filePath, 'utf-8');
      const intelligence = parseJSDocIntelligence(source);
      const description = parseDescription(source);

      const metadata: ComponentMetadata = {
        name,
        displayName: toDisplayName(name),
        category: this.inferCategory(name),
        variants: extractVariants(source),
        sizes: extractSizes(source),
        dependencies: extractDependencies(source),
        primitives: extractPrimitiveDependencies(source),
        filePath: `packages/ui/src/components/ui/${name}.tsx`,
      };

      // Only add optional fields when they have values (exactOptionalPropertyTypes)
      if (description) {
        metadata.description = description;
      }
      if (intelligence) {
        metadata.intelligence = intelligence;
      }

      return metadata;
    } catch {
      return null;
    }
  }

  /**
   * Infer component category from name
   */
  private inferCategory(name: string): ComponentMetadata['category'] {
    const categoryMap: Record<string, ComponentMetadata['category']> = {
      // Layout
      card: 'layout',
      separator: 'layout',
      'aspect-ratio': 'layout',
      'scroll-area': 'layout',
      resizable: 'layout',
      // Form
      button: 'form',
      input: 'form',
      textarea: 'form',
      select: 'form',
      checkbox: 'form',
      radio: 'form',
      switch: 'form',
      slider: 'form',
      toggle: 'form',
      form: 'form',
      label: 'form',
      // Feedback
      alert: 'feedback',
      badge: 'feedback',
      progress: 'feedback',
      skeleton: 'feedback',
      spinner: 'feedback',
      toast: 'feedback',
      sonner: 'feedback',
      // Navigation
      breadcrumb: 'navigation',
      tabs: 'navigation',
      pagination: 'navigation',
      'navigation-menu': 'navigation',
      // Overlay
      dialog: 'overlay',
      drawer: 'overlay',
      popover: 'overlay',
      tooltip: 'overlay',
      'hover-card': 'overlay',
      sheet: 'overlay',
      'alert-dialog': 'overlay',
      'dropdown-menu': 'overlay',
      'context-menu': 'overlay',
      command: 'overlay',
      // Data Display
      table: 'data-display',
      avatar: 'data-display',
      accordion: 'data-display',
      calendar: 'data-display',
      carousel: 'data-display',
      collapsible: 'data-display',
    };

    return categoryMap[name] ?? 'utility';
  }

  /**
   * List all available components
   */
  private async listComponents(category?: string): Promise<CallToolResult> {
    try {
      const componentsPath = this.getComponentsPath();
      const files = await readdir(componentsPath);
      const componentFiles = files.filter((f) => f.endsWith('.tsx'));

      const components: Array<{
        name: string;
        displayName: string;
        category: string;
        cognitiveLoad?: number;
      }> = [];

      for (const file of componentFiles) {
        const name = basename(file, '.tsx');
        const metadata = await this.loadComponentMetadata(name);

        if (metadata) {
          if (category && metadata.category !== category) continue;

          const item: {
            name: string;
            displayName: string;
            category: string;
            cognitiveLoad?: number;
          } = {
            name: metadata.name,
            displayName: metadata.displayName,
            category: metadata.category,
          };
          if (metadata.intelligence?.cognitiveLoad !== undefined) {
            item.cognitiveLoad = metadata.intelligence.cognitiveLoad;
          }
          components.push(item);
        }
      }

      // Sort by category, then by name
      components.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.name.localeCompare(b.name);
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                components,
                count: components.length,
                categories: [...new Set(components.map((c) => c.category))],
                filter: category ?? 'all',
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.handleError('listComponents', error);
    }
  }

  /**
   * Get full component intelligence
   */
  private async getComponent(name: string): Promise<CallToolResult> {
    try {
      const metadata = await this.loadComponentMetadata(name);

      if (!metadata) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  error: `Component "${name}" not found`,
                  suggestion: 'Use rafters_list_components to see available components.',
                },
                null,
                2,
              ),
            },
          ],
          isError: true,
        };
      }

      // Format for AI agent consumption
      const formatted: Record<string, unknown> = {
        name: metadata.name,
        displayName: metadata.displayName,
        category: metadata.category,
        filePath: metadata.filePath,
      };

      if (metadata.description) {
        formatted.description = metadata.description;
      }

      if (metadata.intelligence) {
        const intel = metadata.intelligence;
        formatted.intelligence = {
          cognitiveLoad: intel.cognitiveLoad,
          attentionEconomics: intel.attentionEconomics,
          accessibility: intel.accessibility,
          trustBuilding: intel.trustBuilding,
          semanticMeaning: intel.semanticMeaning,
          usagePatterns: intel.usagePatterns,
        };
      }

      if (metadata.variants.length > 1 || metadata.variants[0] !== 'default') {
        formatted.variants = metadata.variants;
      }

      if (metadata.sizes.length > 1 || metadata.sizes[0] !== 'default') {
        formatted.sizes = metadata.sizes;
      }

      if (metadata.primitives.length > 0) {
        formatted.primitives = metadata.primitives;
      }

      if (metadata.dependencies.length > 0) {
        formatted.dependencies = metadata.dependencies;
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(formatted, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.handleError('getComponent', error);
    }
  }

  /**
   * Search components by various criteria
   */
  private async searchComponents(
    query?: string,
    maxCognitiveLoad?: number,
    category?: string,
  ): Promise<CallToolResult> {
    try {
      const componentsPath = this.getComponentsPath();
      const files = await readdir(componentsPath);
      const componentFiles = files.filter((f) => f.endsWith('.tsx'));

      const matches: Array<{
        name: string;
        displayName: string;
        category: string;
        cognitiveLoad?: number;
        description?: string;
      }> = [];

      const queryLower = query?.toLowerCase();

      for (const file of componentFiles) {
        const name = basename(file, '.tsx');
        const metadata = await this.loadComponentMetadata(name);

        if (!metadata) continue;

        // Apply filters
        if (category && metadata.category !== category) continue;

        if (
          maxCognitiveLoad !== undefined &&
          metadata.intelligence?.cognitiveLoad !== undefined &&
          metadata.intelligence.cognitiveLoad > maxCognitiveLoad
        ) {
          continue;
        }

        if (queryLower) {
          const nameMatch = metadata.name.toLowerCase().includes(queryLower);
          const displayMatch = metadata.displayName.toLowerCase().includes(queryLower);
          const descMatch = metadata.description?.toLowerCase().includes(queryLower);
          const categoryMatch = metadata.category.toLowerCase().includes(queryLower);

          if (!nameMatch && !displayMatch && !descMatch && !categoryMatch) {
            continue;
          }
        }

        const matchItem: {
          name: string;
          displayName: string;
          category: string;
          cognitiveLoad?: number;
          description?: string;
        } = {
          name: metadata.name,
          displayName: metadata.displayName,
          category: metadata.category,
        };
        if (metadata.intelligence?.cognitiveLoad !== undefined) {
          matchItem.cognitiveLoad = metadata.intelligence.cognitiveLoad;
        }
        if (metadata.description) {
          matchItem.description = metadata.description;
        }
        matches.push(matchItem);
      }

      // Sort by cognitive load (lower first), then name
      matches.sort((a, b) => {
        const loadA = a.cognitiveLoad ?? 5;
        const loadB = b.cognitiveLoad ?? 5;
        if (loadA !== loadB) return loadA - loadB;
        return a.name.localeCompare(b.name);
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                results: matches,
                count: matches.length,
                filters: {
                  query: query ?? null,
                  maxCognitiveLoad: maxCognitiveLoad ?? null,
                  category: category ?? null,
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.handleError('searchComponents', error);
    }
  }

  // ==================== Design Decision Tools ====================

  /**
   * Get design decisions (tokens with user overrides)
   */
  private async getDesignDecisions(namespace?: string, tag?: string): Promise<CallToolResult> {
    try {
      const namespaces = namespace ? [namespace] : await this.adapter.listNamespaces();
      const decisions: Array<{
        name: string;
        namespace: string;
        currentValue: unknown;
        previousValue: unknown;
        reason: string;
        overriddenBy?: string;
        overriddenAt: string;
        context?: string;
        tags?: string[];
        revertAfter?: string;
      }> = [];

      for (const ns of namespaces) {
        try {
          const tokens = await this.adapter.loadNamespace(ns);

          for (const token of tokens) {
            if (!token.userOverride) continue;

            // Filter by tag if specified
            if (tag && !token.userOverride.tags?.includes(tag)) {
              continue;
            }

            const decision: {
              name: string;
              namespace: string;
              currentValue: unknown;
              previousValue: unknown;
              reason: string;
              overriddenBy?: string;
              overriddenAt: string;
              context?: string;
              tags?: string[];
              revertAfter?: string;
            } = {
              name: token.name,
              namespace: token.namespace,
              currentValue: token.value,
              previousValue: token.userOverride.previousValue,
              reason: token.userOverride.reason,
              overriddenAt: token.userOverride.overriddenAt,
            };
            if (token.userOverride.overriddenBy) {
              decision.overriddenBy = token.userOverride.overriddenBy;
            }
            if (token.userOverride.context) {
              decision.context = token.userOverride.context;
            }
            if (token.userOverride.tags) {
              decision.tags = token.userOverride.tags;
            }
            if (token.userOverride.revertAfter) {
              decision.revertAfter = token.userOverride.revertAfter;
            }
            decisions.push(decision);
          }
        } catch {
          // Namespace may not exist, skip silently
        }
      }

      // Sort by most recent first
      decisions.sort(
        (a, b) => new Date(b.overriddenAt).getTime() - new Date(a.overriddenAt).getTime(),
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                decisions,
                count: decisions.length,
                filters: {
                  namespace: namespace ?? 'all',
                  tag: tag ?? null,
                },
                description:
                  'Design decisions represent intentional deviations from computed values. Each decision includes the reason and context for the override.',
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      return this.handleError('getDesignDecisions', error);
    }
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
