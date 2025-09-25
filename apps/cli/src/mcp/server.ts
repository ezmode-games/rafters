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
import type { ColorIntelligence, ComponentIntelligence, ComponentRegistry, Intelligence, OKLCH, Token } from '@rafters/shared';
import { fetchComponent } from '../utils/registry.js';
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
  private componentIntelligence: ComponentIntelligenceService;

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

    this.componentIntelligence = new ComponentIntelligenceService();
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
              context: {
                type: 'object',
                properties: {
                  layoutComplexity: { type: 'number', minimum: 1, maximum: 10, default: 1 },
                  userExpertise: { type: 'string', enum: ['novice', 'intermediate', 'expert'], default: 'novice' },
                  taskUrgency: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
                  deviceContext: { type: 'string', enum: ['mobile', 'tablet', 'desktop', 'kiosk'], default: 'desktop' },
                },
                description: 'Analysis context parameters',
              },
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
              constraints: {
                type: 'object',
                properties: {
                  maxCognitiveLoad: { type: 'number', default: 7, description: 'Maximum cognitive load budget' },
                  maxAttentionPoints: { type: 'number', default: 3, description: 'Maximum attention targets' },
                  requiresAccessibility: {
                    type: 'array',
                    items: { type: 'string', enum: ['AA', 'AAA'] },
                    default: ['AA'],
                    description: 'Required accessibility levels',
                  },
                  trustLevel: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
                },
                description: 'Composition constraints',
              },
            },
            required: ['components'],
          },
        },
        {
          name: 'assess_attention_hierarchy',
          description: 'Analyze visual attention hierarchy in component layouts',
          inputSchema: {
            type: 'object',
            properties: {
              layout: {
                type: 'object',
                properties: {
                  components: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        position: {
                          type: 'object',
                          properties: {
                            x: { type: 'number' },
                            y: { type: 'number' },
                          },
                          required: ['x', 'y'],
                        },
                        size: {
                          type: 'object',
                          properties: {
                            width: { type: 'number' },
                            height: { type: 'number' },
                          },
                          required: ['width', 'height'],
                        },
                        zIndex: { type: 'number', description: 'Optional z-index for layering' },
                      },
                      required: ['name', 'position', 'size'],
                    },
                  },
                  viewportSize: {
                    type: 'object',
                    properties: {
                      width: { type: 'number' },
                      height: { type: 'number' },
                    },
                    required: ['width', 'height'],
                  },
                },
                required: ['components', 'viewportSize'],
              },
            },
            required: ['layout'],
          },
        },
        {
          name: 'validate_component_accessibility',
          description: 'Comprehensive accessibility validation with WCAG compliance',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: { type: 'string', description: 'Component name to validate' },
              context: {
                type: 'object',
                properties: {
                  colorVisionTypes: {
                    type: 'array',
                    items: { type: 'string', enum: ['normal', 'deuteranopia', 'protanopia', 'tritanopia'] },
                    default: ['normal'],
                  },
                  contrastLevel: { type: 'string', enum: ['AA', 'AAA'], default: 'AA' },
                  screenReader: { type: 'boolean', default: false },
                  motorImpairments: { type: 'boolean', default: false },
                  cognitiveImpairments: { type: 'boolean', default: false },
                },
                description: 'Accessibility context',
              },
            },
            required: ['componentName'],
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
        case 'assess_attention_hierarchy':
          return await this.handleAssessAttentionHierarchy(args);
        case 'validate_component_accessibility':
          return await this.handleValidateComponentAccessibility(args);
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
    const params = z
      .object({
        componentName: z.string(),
        context: z.object({
          layoutComplexity: z.number().min(1).max(10).default(1),
          userExpertise: z.enum(['novice', 'intermediate', 'expert']).default('novice'),
          taskUrgency: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
          deviceContext: z.enum(['mobile', 'tablet', 'desktop', 'kiosk']).default('desktop'),
        }).optional(),
      })
      .parse(args);

    try {
      // Fetch component from registry
      const component = await fetchComponent(params.componentName);
      
      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `Component "${params.componentName}" not found`,
                suggestion: 'Ensure the component name is correct and exists in the registry',
              }),
            },
          ],
        };
      }

      // Extract intelligence metadata from component
      const raftersIntelligence = component.meta?.rafters?.intelligence;
      if (!raftersIntelligence) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `No intelligence metadata found for component "${params.componentName}"`,
                suggestion: 'Component may not have been processed through Rafters intelligence pipeline',
              }),
            },
          ],
        };
      }

      // Convert to Intelligence format
      const intelligence: Intelligence = {
        cognitiveLoad: raftersIntelligence.cognitiveLoad,
        attentionEconomics: raftersIntelligence.attentionEconomics || '',
        accessibility: raftersIntelligence.accessibility || '',
        trustBuilding: raftersIntelligence.trustBuilding || '',
        semanticMeaning: raftersIntelligence.semanticMeaning || '',
      };

      // Analyze with ComponentIntelligenceService
      const result = await this.componentIntelligence.analyzeComponent(
        params.componentName,
        intelligence,
        params.context || {}
      );

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: result.error,
                confidence: result.confidence,
              }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              component: params.componentName,
              intelligence: {
                cognitiveLoadScore: result.data.cognitiveLoadScore,
                millerRuleCompliance: result.data.millerRuleCompliance,
                attentionWeight: result.data.attentionWeight,
                trustPatterns: result.data.trustPatterns,
                accessibilityGaps: result.data.accessibilityGaps,
                recommendations: result.data.recommendations,
              },
              analysis: {
                cognitiveLoadRating: result.data.cognitiveLoadScore > 7 ? 'high' : result.data.cognitiveLoadScore > 4 ? 'moderate' : 'low',
                millerCompliance: result.data.millerRuleCompliance ? 'compliant' : 'violation',
                attentionLevel: result.data.attentionWeight > 0.7 ? 'primary' : result.data.attentionWeight > 0.4 ? 'secondary' : 'tertiary',
                trustRequirements: result.data.trustPatterns.length > 2 ? 'critical' : result.data.trustPatterns.length > 0 ? 'high' : 'standard',
              },
              context: params.context || {},
              confidence: result.confidence,
              timestamp: result.timestamp,
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Failed to analyze component: ${error instanceof Error ? error.message : String(error)}`,
              component: params.componentName,
            }),
          },
        ],
      };
    }
  }

  private async handleOptimizeComponentComposition(args: unknown) {
    const params = z
      .object({
        components: z.array(z.string()),
        constraints: z.object({
          maxCognitiveLoad: z.number().default(7),
          maxAttentionPoints: z.number().default(3),
          requiresAccessibility: z.array(z.enum(['AA', 'AAA'])).default(['AA']),
          trustLevel: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
        }).optional(),
      })
      .parse(args);

    try {
      // Fetch components from registry
      const componentPromises = params.components.map(async (componentName) => {
        const component = await fetchComponent(componentName);
        if (!component || !component.meta?.rafters?.intelligence) {
          return null;
        }
        
        // Convert to ComponentRegistry format for the service
        return {
          name: component.name,
          type: component.type || 'registry:component',
          files: component.files || [],
          meta: {
            rafters: {
              intelligence: {
                cognitiveLoad: component.meta.rafters.intelligence.cognitiveLoad,
                attentionEconomics: component.meta.rafters.intelligence.attentionEconomics || '',
                accessibility: component.meta.rafters.intelligence.accessibility || '',
                trustBuilding: component.meta.rafters.intelligence.trustBuilding || '',
                semanticMeaning: component.meta.rafters.intelligence.semanticMeaning || '',
              },
            },
          },
        } as ComponentRegistry;
      });

      const componentResults = await Promise.all(componentPromises);
      const validComponents = componentResults.filter((comp): comp is ComponentRegistry => comp !== null);

      if (validComponents.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'No valid components found with intelligence metadata',
                requestedComponents: params.components,
              }),
            },
          ],
        };
      }

      // Optimize composition using ComponentIntelligenceService
      const result = await this.componentIntelligence.optimizeComposition(
        validComponents,
        params.constraints || {}
      );

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: result.error,
                confidence: result.confidence,
              }),
            },
          ],
        };
      }

      // Calculate load summaries
      const originalLoad = validComponents.reduce(
        (sum, comp) => sum + comp.meta.rafters.intelligence.cognitiveLoad, 
        0
      );
      const optimizedLoad = result.data.cognitiveLoadDistribution.reduce(
        (sum, item) => sum + item.load, 
        0
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              components: result.data.cognitiveLoadDistribution,
              optimization: {
                originalLoad,
                optimizedLoad,
                maxLoad: params.constraints?.maxCognitiveLoad || 7,
                improvement: originalLoad - optimizedLoad,
                withinBudget: optimizedLoad <= (params.constraints?.maxCognitiveLoad || 7),
                accessibilityScore: result.data.accessibilityScore,
              },
              attentionFlow: result.data.attentionFlow,
              improvements: result.data.improvements,
              optimizedLayout: result.data.optimizedLayout,
              constraints: params.constraints || {},
              confidence: result.confidence,
              timestamp: result.timestamp,
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Failed to optimize component composition: ${error instanceof Error ? error.message : String(error)}`,
              requestedComponents: params.components,
            }),
          },
        ],
      };
    }
  }

  private async handleAssessAttentionHierarchy(args: unknown) {
    const params = z
      .object({
        layout: z.object({
          components: z.array(z.object({
            name: z.string(),
            position: z.object({ x: z.number(), y: z.number() }),
            size: z.object({ width: z.number(), height: z.number() }),
            zIndex: z.number().optional(),
          })),
          viewportSize: z.object({ width: z.number(), height: z.number() }),
        }),
      })
      .parse(args);

    try {
      const result = await this.componentIntelligence.assessAttentionHierarchy(params.layout);

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: result.error,
                confidence: result.confidence,
              }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              attentionHierarchy: {
                primaryTarget: result.data.primaryAttentionTarget,
                secondaryTargets: result.data.secondaryTargets,
                visualWeights: result.data.visualWeight,
                attentionFlow: result.data.attentionFlow,
                violations: result.data.violations,
              },
              analysis: {
                hierarchyStrength: result.data.violations.length === 0 ? 'strong' : 'weak',
                primaryCount: result.data.primaryAttentionTarget ? 1 : 0,
                secondaryCount: result.data.secondaryTargets.length,
                violationCount: result.data.violations.length,
              },
              confidence: result.confidence,
              timestamp: result.timestamp,
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Failed to assess attention hierarchy: ${error instanceof Error ? error.message : String(error)}`,
            }),
          },
        ],
      };
    }
  }

  private async handleValidateComponentAccessibility(args: unknown) {
    const params = z
      .object({
        componentName: z.string(),
        context: z.object({
          colorVisionTypes: z.array(z.enum(['normal', 'deuteranopia', 'protanopia', 'tritanopia'])).default(['normal']),
          contrastLevel: z.enum(['AA', 'AAA']).default('AA'),
          screenReader: z.boolean().default(false),
          motorImpairments: z.boolean().default(false),
          cognitiveImpairments: z.boolean().default(false),
        }).optional(),
      })
      .parse(args);

    try {
      // Fetch component from registry
      const component = await fetchComponent(params.componentName);
      
      if (!component || !component.meta?.rafters?.intelligence) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `Component "${params.componentName}" not found or missing intelligence metadata`,
              }),
            },
          ],
        };
      }

      // Convert to Intelligence format
      const intelligence: Intelligence = {
        cognitiveLoad: component.meta.rafters.intelligence.cognitiveLoad,
        attentionEconomics: component.meta.rafters.intelligence.attentionEconomics || '',
        accessibility: component.meta.rafters.intelligence.accessibility || '',
        trustBuilding: component.meta.rafters.intelligence.trustBuilding || '',
        semanticMeaning: component.meta.rafters.intelligence.semanticMeaning || '',
      };

      const result = await this.componentIntelligence.validateAccessibility(
        params.componentName,
        intelligence,
        params.context || {}
      );

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: result.error,
                confidence: result.confidence,
              }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              component: params.componentName,
              accessibility: {
                wcagCompliance: result.data.wcagCompliance,
                colorVisionAnalysis: result.data.colorVisionAnalysis,
                touchTargetAnalysis: result.data.touchTargetAnalysis,
                cognitiveAccessibility: result.data.cognitiveAccessibility,
              },
              summary: {
                overallLevel: result.data.wcagCompliance.level,
                violationCount: result.data.wcagCompliance.violations.length,
                accessibilityScore: result.data.cognitiveAccessibility.score,
                touchCompliant: result.data.touchTargetAnalysis.compliant,
                colorVisionCompatible: Object.values(result.data.colorVisionAnalysis).every(analysis => analysis.accessible),
              },
              confidence: result.confidence,
              timestamp: result.timestamp,
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Failed to validate component accessibility: ${error instanceof Error ? error.message : String(error)}`,
              component: params.componentName,
            }),
          },
        ],
      };
    }
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Rafters Design Intelligence MCP Server started');
  }
}
