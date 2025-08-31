/**
 * Rafters MCP (Model Context Protocol) Server
 *
 * Provides AI agents with direct access to design token intelligence,
 * component metadata, and design system reasoning.
 *
 * Based on shadcn's approach - embedded directly in CLI for single source of truth.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { createTokenRegistry } from '@rafters/design-tokens';
import type { ColorValue, Token } from '@rafters/shared';
import { fetchComponent } from '../utils/registry.js';

// Tool definitions for design intelligence queries
const TOOLS: Tool[] = [
  {
    name: 'get_color_intelligence',
    description:
      'Get complete intelligence for a color token including scale, states, harmonies, and psychological impact',
    inputSchema: {
      type: 'object',
      properties: {
        tokenName: {
          type: 'string',
          description: 'Name of the color token (e.g., "primary", "destructive")',
        },
      },
      required: ['tokenName'],
    },
  },
  {
    name: 'get_token_by_category',
    description: 'Get all tokens in a specific category',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Token category (e.g., "color", "spacing", "motion")',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_component_intelligence',
    description:
      'Get design intelligence for a component including cognitive load, trust patterns, and accessibility',
    inputSchema: {
      type: 'object',
      properties: {
        componentName: {
          type: 'string',
          description: 'Name of the component (e.g., "Button", "Dialog")',
        },
      },
      required: ['componentName'],
    },
  },
  {
    name: 'validate_color_combination',
    description: 'Validate if colors work together considering cognitive load and accessibility',
    inputSchema: {
      type: 'object',
      properties: {
        colors: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of color token names to validate together',
        },
      },
      required: ['colors'],
    },
  },
  {
    name: 'get_accessible_colors',
    description: 'Find colors that meet WCAG standards on a given background',
    inputSchema: {
      type: 'object',
      properties: {
        background: {
          type: 'string',
          description: 'Background color token name',
        },
        level: {
          type: 'string',
          enum: ['AA', 'AAA'],
          description: 'WCAG compliance level',
        },
      },
      required: ['background'],
    },
  },
  {
    name: 'get_tokens_by_trust_level',
    description: 'Get all tokens with a specific trust level',
    inputSchema: {
      type: 'object',
      properties: {
        trustLevel: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical'],
          description: 'Trust level to filter by',
        },
      },
      required: ['trustLevel'],
    },
  },
  {
    name: 'calculate_cognitive_load',
    description: 'Calculate total cognitive load for a set of components',
    inputSchema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of component names',
        },
      },
      required: ['components'],
    },
  },
];

export async function startMCPServer() {
  const server = new Server(
    {
      name: 'rafters-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Load token registry from .rafters/tokens if it exists
  let tokenRegistry: ReturnType<typeof createTokenRegistry> | null = null;
  const tokensDir = join(process.cwd(), '.rafters', 'tokens');
  if (existsSync(tokensDir)) {
    tokenRegistry = createTokenRegistry(tokensDir);
  }

  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  // Handle tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'get_color_intelligence': {
          if (!tokenRegistry) {
            throw new Error('Token registry not found. Run "rafters init" first.');
          }

          const { tokenName } = args as { tokenName: string };
          const token = tokenRegistry.get(tokenName);

          if (!token || token.category !== 'color') {
            throw new Error(`Color token "${tokenName}" not found`);
          }

          // Extract ColorValue if it exists
          const colorValue = typeof token.value === 'object' ? (token.value as ColorValue) : null;

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    token,
                    intelligence: colorValue?.intelligence || 'Not yet populated from API',
                    harmonies: colorValue?.harmonies || {},
                    accessibility: colorValue?.accessibility || {},
                    scale: colorValue?.scale || [],
                    states: colorValue?.states || {},
                    use: colorValue?.use || token.semanticMeaning,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        case 'get_token_by_category': {
          if (!tokenRegistry) {
            throw new Error('Token registry not found. Run "rafters init" first.');
          }

          const { category } = args as { category: string };
          const tokens = tokenRegistry.list().filter((t: Token) => t.category === category);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    category,
                    count: tokens.length,
                    tokens: tokens.map((t: Token) => ({
                      name: t.name,
                      value: typeof t.value === 'string' ? t.value : 'ColorValue object',
                      semanticMeaning: t.semanticMeaning,
                      cognitiveLoad: t.cognitiveLoad,
                      trustLevel: t.trustLevel,
                    })),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        case 'get_component_intelligence': {
          const { componentName } = args as { componentName: string };

          try {
            const component = await fetchComponent(componentName);

            if (!component) {
              throw new Error(`Component "${componentName}" not found`);
            }

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      name: component.name,
                      intelligence: component.meta?.rafters?.intelligence,
                      description: component.description,
                      dependencies: component.dependencies,
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          } catch (error) {
            throw new Error(`Failed to fetch component: ${error}`);
          }
        }

        case 'validate_color_combination': {
          if (!tokenRegistry) {
            throw new Error('Token registry not found. Run "rafters init" first.');
          }

          const { colors } = args as { colors: string[] };
          const colorTokens = colors
            .map((c) => tokenRegistry.get(c))
            .filter((t): t is NonNullable<typeof t> => Boolean(t));

          const totalCognitiveLoad = colorTokens.reduce(
            (sum, t) => sum + (t.cognitiveLoad || 0),
            0
          );
          const criticalCount = colorTokens.filter((t) => t.trustLevel === 'critical').length;
          const highCount = colorTokens.filter((t) => t.trustLevel === 'high').length;

          const warnings = [];
          if (totalCognitiveLoad > 15) {
            warnings.push(`High cognitive load (${totalCognitiveLoad}/15) - may overwhelm users`);
          }
          if (criticalCount > 1) {
            warnings.push(
              `Multiple critical trust levels (${criticalCount}) - avoid competing for attention`
            );
          }
          if (highCount > 2) {
            warnings.push(`Many high trust elements (${highCount}) - consider hierarchy`);
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    valid: warnings.length === 0,
                    totalCognitiveLoad,
                    trustLevels: {
                      critical: criticalCount,
                      high: highCount,
                      medium: colorTokens.filter((t) => t.trustLevel === 'medium').length,
                      low: colorTokens.filter((t) => t.trustLevel === 'low').length,
                    },
                    warnings,
                    recommendation:
                      warnings.length === 0
                        ? 'Color combination is well-balanced'
                        : 'Consider simplifying or reorganizing color hierarchy',
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        case 'get_accessible_colors': {
          if (!tokenRegistry) {
            throw new Error('Token registry not found. Run "rafters init" first.');
          }

          const { background, level = 'AA' } = args as { background: string; level?: string };
          const bgToken = tokenRegistry.get(background);

          if (!bgToken) {
            throw new Error(`Background token "${background}" not found`);
          }

          // This would need actual contrast calculation logic
          // For now, return a placeholder
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    background,
                    level,
                    message: 'Contrast calculation requires color-utils integration',
                    placeholder: true,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        case 'get_tokens_by_trust_level': {
          if (!tokenRegistry) {
            throw new Error('Token registry not found. Run "rafters init" first.');
          }

          const { trustLevel } = args as { trustLevel: string };
          const tokens = tokenRegistry.list().filter((t: Token) => t.trustLevel === trustLevel);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    trustLevel,
                    count: tokens.length,
                    tokens: tokens.map((t: Token) => ({
                      name: t.name,
                      category: t.category,
                      semanticMeaning: t.semanticMeaning,
                      cognitiveLoad: t.cognitiveLoad,
                    })),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        case 'calculate_cognitive_load': {
          const { components } = args as { components: string[] };

          const componentData = await Promise.all(
            components.map(async (name) => {
              const component = await fetchComponent(name);
              return {
                name,
                cognitiveLoad: component?.meta?.rafters?.intelligence?.cognitiveLoad || 0,
              };
            })
          );

          const totalLoad = componentData.reduce((sum, c) => sum + c.cognitiveLoad, 0);
          const budget = 15; // Standard cognitive budget

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    components: componentData,
                    totalLoad,
                    budget,
                    remaining: budget - totalLoad,
                    status: totalLoad <= budget ? 'within-budget' : 'over-budget',
                    recommendation:
                      totalLoad <= budget
                        ? 'Cognitive load is manageable'
                        : `Reduce complexity by ${totalLoad - budget} points`,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: error instanceof Error ? error.message : 'Unknown error',
            }),
          },
        ],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Rafters MCP server started');
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startMCPServer().catch(console.error);
}
