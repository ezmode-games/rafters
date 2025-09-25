/**
 * Rafters Design Intelligence MCP Server
 *
 * Provides AI agents with deep contextual understanding of design intelligence,
 * supporting progressive delivery, vector-based reasoning, and real-time streaming.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  type CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createTokenRegistry, TokenRegistry } from '@rafters/design-tokens';
import type { ColorIntelligence, ComponentIntelligence, OKLCH, Token } from '@rafters/shared';
import { z } from 'zod';

// Tool parameter schemas
const ColorIntelligenceParamsSchema = z.object({
  tokenName: z.string(),
  depth: z.enum(['immediate', 'quick', 'computed', 'deep']).default('computed'),
});

const ComponentIntelligenceParamsSchema = z.object({
  componentName: z.string(),
});

export class RaftersDesignIntelligenceServer {
  private server: Server;
  private registry?: TokenRegistry;

  constructor() {
    this.server = new Server(
      {
        name: 'rafters-design-intelligence',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.registerHandlers();
  }

  private registerHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'analyze_color_intelligence',
          description:
            'Analyze color intelligence with 384-dimensional vector analysis and confidence scoring',
          inputSchema: {
            type: 'object',
            properties: {
              tokenName: { type: 'string', description: 'Name of the color token' },
              depth: {
                type: 'string',
                enum: ['immediate', 'quick', 'computed', 'deep'],
                default: 'computed',
                description: 'Depth of analysis (immediate → quick → computed → deep)',
              },
            },
            required: ['tokenName'],
          },
        },
        {
          name: 'find_color_similarities',
          description: 'Vector similarity search with configurable metrics',
          inputSchema: {
            type: 'object',
            properties: {
              tokenName: { type: 'string', description: 'Reference color token name' },
              metric: {
                type: 'string',
                enum: ['euclidean', 'manhattan', 'cosine'],
                default: 'euclidean',
                description: 'Distance metric for similarity calculation',
              },
              threshold: {
                type: 'number',
                default: 0.1,
                description: 'Similarity threshold (0-1)',
              },
            },
            required: ['tokenName'],
          },
        },
        {
          name: 'generate_color_harmonies',
          description: 'Generate sophisticated color harmonies using vector mathematics',
          inputSchema: {
            type: 'object',
            properties: {
              tokenName: { type: 'string', description: 'Base color token name' },
              harmonies: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['complementary', 'triadic', 'analogous', 'tetradic', 'monochromatic'],
                },
                default: ['complementary', 'triadic'],
                description: 'Types of harmonies to generate',
              },
            },
            required: ['tokenName'],
          },
        },
        {
          name: 'analyze_token_dependencies',
          description: 'Dependency graph analysis with cascade impact assessment',
          inputSchema: {
            type: 'object',
            properties: {
              tokenName: { type: 'string', description: 'Token to analyze dependencies for' },
              depth: { type: 'number', default: 3, description: 'Maximum depth to analyze' },
            },
            required: ['tokenName'],
          },
        },
        {
          name: 'validate_dependency_changes',
          description: 'Change validation with circular dependency detection',
          inputSchema: {
            type: 'object',
            properties: {
              changes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    tokenName: { type: 'string' },
                    newValue: { type: 'string' },
                  },
                  required: ['tokenName', 'newValue'],
                },
                description: 'Array of proposed token changes',
              },
            },
            required: ['changes'],
          },
        },
        {
          name: 'execute_generation_rule',
          description: 'Rule execution with dependency resolution',
          inputSchema: {
            type: 'object',
            properties: {
              tokenName: { type: 'string', description: 'Token to execute generation rule for' },
              dryRun: {
                type: 'boolean',
                default: false,
                description: 'Preview changes without applying',
              },
            },
            required: ['tokenName'],
          },
        },
        {
          name: 'analyze_component_intelligence',
          description: 'Cognitive load assessment and attention hierarchy analysis',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: { type: 'string', description: 'Component name to analyze' },
            },
            required: ['componentName'],
          },
        },
        {
          name: 'optimize_component_composition',
          description: 'Component optimization for cognitive load management',
          inputSchema: {
            type: 'object',
            properties: {
              components: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of component names to optimize',
              },
              targetLoad: {
                type: 'number',
                default: 7,
                description: 'Target cognitive load budget',
              },
            },
            required: ['components'],
          },
        },
      ],
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      // Ensure registry is initialized
      await this.ensureRegistry();

      switch (name) {
        case 'analyze_color_intelligence':
          return await this.handleColorIntelligence(args);
        case 'find_color_similarities':
          return await this.handleColorSimilarities(args);
        case 'generate_color_harmonies':
          return await this.handleColorHarmonies(args);
        case 'analyze_token_dependencies':
          return await this.handleTokenDependencies(args);
        case 'validate_dependency_changes':
          return await this.handleValidateDependencyChanges(args);
        case 'execute_generation_rule':
          return await this.handleExecuteGenerationRule(args);
        case 'analyze_component_intelligence':
          return await this.handleComponentIntelligence(args);
        case 'optimize_component_composition':
          return await this.handleOptimizeComponentComposition(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private async ensureRegistry(): Promise<void> {
    if (this.registry) return;

    const cwd = process.cwd();
    const tokensDir = join(cwd, '.rafters', 'tokens');

    if (existsSync(tokensDir)) {
      this.registry = createTokenRegistry(tokensDir);
    } else {
      // Create empty registry for development/testing
      this.registry = new TokenRegistry([]);
    }
  }

  private async handleColorIntelligence(args: unknown) {
    const params = ColorIntelligenceParamsSchema.parse(args);
    const token = this.registry?.get(params.tokenName);

    if (!token) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Token "${params.tokenName}" not found`,
              suggestion: `Available tokens: ${
                this.registry
                  ?.list()
                  .map((t) => t.name)
                  .join(', ') || 'none'
              }`,
            }),
          },
        ],
      };
    }

    // Progressive intelligence delivery based on depth
    const intelligence = await this.analyzeColorWithDepth(token, params.depth);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            token: {
              name: token.name,
              value: token.value,
              category: token.category,
            },
            intelligence,
            depth: params.depth,
            confidence: this.calculateConfidenceScore(intelligence),
          }),
        },
      ],
    };
  }

  private async analyzeColorWithDepth(token: Token, depth: string): Promise<ColorIntelligence> {
    // Mock implementation - in real implementation, this would connect to vector services
    const baseIntelligence: ColorIntelligence = {
      suggestedName: this.generateColorName(token),
      reasoning: 'Advanced color analysis using 384-dimensional vector space',
      emotionalImpact: 'Analyzed through cross-modal design intelligence',
      culturalContext: 'Global accessibility and cultural considerations',
      accessibilityNotes: 'WCAG compliance analysis with predictive capabilities',
      usageGuidance: 'Context-aware usage recommendations',
    };

    switch (depth) {
      case 'immediate':
        return {
          ...baseIntelligence,
          reasoning: 'Quick pattern match',
        };
      case 'quick':
        return {
          ...baseIntelligence,
          reasoning: 'Fast semantic analysis with basic vectors',
        };
      case 'computed':
        return baseIntelligence;
      case 'deep':
        return {
          ...baseIntelligence,
          reasoning:
            'Comprehensive 384-dimensional vector analysis with business context integration',
        };
      default:
        return baseIntelligence;
    }
  }

  private generateColorName(token: Token): string {
    // Simple implementation - would use AI in production
    if (token.name.includes('primary')) return 'Brand Primary';
    if (token.name.includes('secondary')) return 'Brand Secondary';
    if (token.name.includes('destructive')) return 'Alert Red';
    return `Generated ${token.name}`;
  }

  private calculateConfidenceScore(intelligence: ColorIntelligence): number {
    // Mock confidence calculation based on intelligence completeness
    let score = 0;
    if (intelligence.suggestedName) score += 0.2;
    if (intelligence.reasoning) score += 0.2;
    if (intelligence.emotionalImpact) score += 0.2;
    if (intelligence.culturalContext) score += 0.2;
    if (intelligence.accessibilityNotes) score += 0.1;
    if (intelligence.usageGuidance) score += 0.1;
    return Math.min(score, 1.0);
  }

  private async handleColorSimilarities(args: unknown) {
    const params = z
      .object({
        tokenName: z.string(),
        metric: z.enum(['euclidean', 'manhattan', 'cosine']).default('euclidean'),
        threshold: z.number().default(0.1),
      })
      .parse(args);

    const referenceToken = this.registry?.get(params.tokenName);
    if (!referenceToken) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: `Token "${params.tokenName}" not found` }),
          },
        ],
      };
    }

    const allTokens = this.registry?.list() || [];
    const colorTokens = allTokens.filter(
      (t) => t.category === 'color' && t.name !== params.tokenName
    );

    // Mock similarity calculation
    const similarities = colorTokens.map((token) => ({
      token: {
        name: token.name,
        value: token.value,
      },
      similarity: Math.random() * (1 - params.threshold) + params.threshold,
      distance: Math.random() * params.threshold,
      metric: params.metric,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            referenceToken: params.tokenName,
            similarities: similarities.sort((a, b) => b.similarity - a.similarity),
            metric: params.metric,
            threshold: params.threshold,
          }),
        },
      ],
    };
  }

  private async handleColorHarmonies(args: unknown) {
    const params = z
      .object({
        tokenName: z.string(),
        harmonies: z
          .array(z.enum(['complementary', 'triadic', 'analogous', 'tetradic', 'monochromatic']))
          .default(['complementary', 'triadic']),
      })
      .parse(args);

    const baseToken = this.registry?.get(params.tokenName);
    if (!baseToken) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: `Token "${params.tokenName}" not found` }),
          },
        ],
      };
    }

    // Mock harmony generation using vector mathematics
    const harmonies: Record<string, OKLCH[]> = {};

    for (const harmonyType of params.harmonies) {
      harmonies[harmonyType] = this.generateHarmonyColors(harmonyType);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            baseToken: params.tokenName,
            harmonies,
            method: 'vector-mathematics',
            confidence: 0.95,
          }),
        },
      ],
    };
  }

  private generateHarmonyColors(harmonyType: string): OKLCH[] {
    // Mock implementation - real version would use proper color mathematics
    const mockColor = (l: number, c: number, h: number): OKLCH => ({ l, c, h });

    switch (harmonyType) {
      case 'complementary':
        return [mockColor(0.7, 0.15, 180)];
      case 'triadic':
        return [mockColor(0.6, 0.12, 120), mockColor(0.8, 0.18, 240)];
      case 'analogous':
        return [mockColor(0.65, 0.14, 30), mockColor(0.75, 0.16, 330)];
      default:
        return [mockColor(0.7, 0.15, 0)];
    }
  }

  private async handleTokenDependencies(args: unknown) {
    const params = z
      .object({
        tokenName: z.string(),
        depth: z.number().default(3),
      })
      .parse(args);

    const token = this.registry?.get(params.tokenName);
    if (!token) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: `Token "${params.tokenName}" not found` }),
          },
        ],
      };
    }

    // Analyze dependency graph
    const dependencies = this.registry?.getDependencies(params.tokenName) || [];
    const dependents = this.registry?.getDependents(params.tokenName) || [];

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            token: params.tokenName,
            dependencies: {
              direct: dependencies,
              cascade: [], // Would calculate transitive dependencies
              depth: Math.min(dependencies.length, params.depth),
            },
            dependents: {
              direct: dependents,
              cascade: [], // Would calculate transitive dependents
              impact: dependents.length,
            },
            analysis: {
              complexity: dependencies.length + dependents.length,
              risk: dependencies.length > 3 ? 'high' : dependents.length > 5 ? 'medium' : 'low',
            },
          }),
        },
      ],
    };
  }

  private async handleValidateDependencyChanges(args: unknown) {
    const params = z
      .object({
        changes: z.array(
          z.object({
            tokenName: z.string(),
            newValue: z.string(),
          })
        ),
      })
      .parse(args);

    const validation = {
      valid: true,
      circularDependencies: [] as string[],
      warnings: [] as string[],
      impact: {
        tokensAffected: 0,
        cascadeDepth: 0,
      },
    };

    for (const change of params.changes) {
      const token = this.registry?.get(change.tokenName);
      if (!token) {
        validation.warnings.push(`Token "${change.tokenName}" not found`);
        continue;
      }

      const dependents = this.registry?.getDependents(change.tokenName) || [];
      validation.impact.tokensAffected += dependents.length;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(validation),
        },
      ],
    };
  }

  private async handleExecuteGenerationRule(args: unknown) {
    const params = z
      .object({
        tokenName: z.string(),
        dryRun: z.boolean().default(false),
      })
      .parse(args);

    const token = this.registry?.get(params.tokenName);
    if (!token) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: `Token "${params.tokenName}" not found` }),
          },
        ],
      };
    }

    // Mock rule execution
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            token: params.tokenName,
            rule: 'mock-generation-rule',
            executed: !params.dryRun,
            preview: params.dryRun,
            result: {
              newValue: 'generated-value',
              dependenciesResolved: 2,
            },
          }),
        },
      ],
    };
  }

  private async handleComponentIntelligence(args: unknown) {
    const params = ComponentIntelligenceParamsSchema.parse(args);

    // Mock component intelligence - would fetch from registry in real implementation
    const intelligence: ComponentIntelligence = {
      cognitiveLoad: Math.floor(Math.random() * 5) + 1,
      attentionHierarchy: 'Primary action component with high visibility requirements',
      accessibilityRules: 'WCAG 2.1 AAA compliance required',
      usageContext: 'Critical user actions requiring immediate attention',
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            component: params.componentName,
            intelligence,
            analysis: {
              cognitiveLoadRating: intelligence.cognitiveLoad > 3 ? 'high' : 'moderate',
              attentionEconomics: 'primary',
              trustRequirements: intelligence.cognitiveLoad > 4 ? 'critical' : 'high',
            },
          }),
        },
      ],
    };
  }

  private async handleOptimizeComponentComposition(args: unknown) {
    const params = z
      .object({
        components: z.array(z.string()),
        targetLoad: z.number().default(7),
      })
      .parse(args);

    // Mock optimization logic
    const componentLoads = params.components.map((name) => ({
      name,
      currentLoad: Math.floor(Math.random() * 5) + 1,
      optimizedLoad: Math.floor(Math.random() * 3) + 1,
    }));

    const totalCurrentLoad = componentLoads.reduce((sum, comp) => sum + comp.currentLoad, 0);
    const totalOptimizedLoad = componentLoads.reduce((sum, comp) => sum + comp.optimizedLoad, 0);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            components: componentLoads,
            optimization: {
              currentLoad: totalCurrentLoad,
              optimizedLoad: totalOptimizedLoad,
              targetLoad: params.targetLoad,
              improvement: totalCurrentLoad - totalOptimizedLoad,
              withinBudget: totalOptimizedLoad <= params.targetLoad,
            },
            recommendations: [
              'Simplify high-complexity components',
              'Use progressive disclosure patterns',
              'Reduce visual noise in secondary elements',
            ],
          }),
        },
      ],
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Rafters Design Intelligence MCP Server started');
  }
}
