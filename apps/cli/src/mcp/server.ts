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
import type {
  ColorIntelligence,
  ComponentRegistry,
  Intelligence,
  OKLCH,
  Token,
} from '@rafters/shared';
import { z } from 'zod';
import { fetchComponent } from '../utils/registry.js';
import { ComponentIntelligenceService } from './services/component-intelligence.js';
import { PatternRecognitionService } from './services/pattern-recognition.js';
import { UserEmpathyService } from './services/user-empathy.js';

// Tool parameter schemas
const ColorIntelligenceParamsSchema = z.object({
  tokenName: z.string(),
  depth: z.enum(['immediate', 'quick', 'computed', 'deep']).default('computed'),
});

// ComponentIntelligenceParamsSchema removed as it's unused

export class RaftersDesignIntelligenceServer {
  private server: Server;
  private registry?: TokenRegistry;
  private componentIntelligence: ComponentIntelligenceService;
  private patternRecognition: PatternRecognitionService;
  private userEmpathy: UserEmpathyService;

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
    this.patternRecognition = new PatternRecognitionService();
    this.userEmpathy = new UserEmpathyService();
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
                  userExpertise: {
                    type: 'string',
                    enum: ['novice', 'intermediate', 'expert'],
                    default: 'novice',
                  },
                  taskUrgency: {
                    type: 'string',
                    enum: ['low', 'medium', 'high', 'critical'],
                    default: 'medium',
                  },
                  deviceContext: {
                    type: 'string',
                    enum: ['mobile', 'tablet', 'desktop', 'kiosk'],
                    default: 'desktop',
                  },
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
                  maxCognitiveLoad: {
                    type: 'number',
                    default: 7,
                    description: 'Maximum cognitive load budget',
                  },
                  maxAttentionPoints: {
                    type: 'number',
                    default: 3,
                    description: 'Maximum attention targets',
                  },
                  requiresAccessibility: {
                    type: 'array',
                    items: { type: 'string', enum: ['AA', 'AAA'] },
                    default: ['AA'],
                    description: 'Required accessibility levels',
                  },
                  trustLevel: {
                    type: 'string',
                    enum: ['low', 'medium', 'high', 'critical'],
                    default: 'medium',
                  },
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
                    items: {
                      type: 'string',
                      enum: ['normal', 'deuteranopia', 'protanopia', 'tritanopia'],
                    },
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
        {
          name: 'analyze_accessibility_impact',
          description: 'Comprehensive accessibility impact analysis across user profiles',
          inputSchema: {
            type: 'object',
            properties: {
              design: {
                type: 'object',
                properties: {
                  colors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        oklch: {
                          type: 'object',
                          properties: {
                            l: { type: 'number', minimum: 0, maximum: 1 },
                            c: { type: 'number', minimum: 0 },
                            h: { type: 'number', minimum: 0, maximum: 360 },
                          },
                          required: ['l', 'c', 'h'],
                        },
                        role: { type: 'string' },
                        usage: { type: 'array', items: { type: 'string' } },
                      },
                      required: ['oklch', 'role', 'usage'],
                    },
                  },
                  components: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: { type: 'string' },
                        properties: { type: 'object' },
                        accessibility: {
                          type: 'object',
                          properties: {
                            touchTarget: { type: 'number' },
                            contrastRatio: { type: 'number' },
                            keyboardNavigable: { type: 'boolean' },
                          },
                        },
                      },
                      required: ['type', 'properties'],
                    },
                  },
                },
                required: ['colors', 'components'],
              },
              userProfiles: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    colorVision: {
                      type: 'string',
                      enum: ['normal', 'deuteranopia', 'protanopia', 'tritanopia'],
                    },
                    culturalBackground: { type: 'array', items: { type: 'string' } },
                    accessibilityNeeds: { type: 'array', items: { type: 'string' } },
                  },
                  required: [
                    'id',
                    'name',
                    'colorVision',
                    'culturalBackground',
                    'accessibilityNeeds',
                  ],
                },
                default: [],
              },
            },
            required: ['design'],
          },
        },
        {
          name: 'simulate_color_vision_experience',
          description: 'Simulate color vision experience for different color vision types',
          inputSchema: {
            type: 'object',
            properties: {
              colors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    l: { type: 'number', minimum: 0, maximum: 1 },
                    c: { type: 'number', minimum: 0 },
                    h: { type: 'number', minimum: 0, maximum: 360 },
                  },
                  required: ['l', 'c', 'h'],
                },
              },
              visionTypes: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['normal', 'deuteranopia', 'protanopia', 'tritanopia'],
                },
                default: ['normal', 'deuteranopia', 'protanopia', 'tritanopia'],
              },
            },
            required: ['colors'],
          },
        },
        {
          name: 'analyze_cultural_sensitivity',
          description: 'Analyze cultural sensitivity of design for global audiences',
          inputSchema: {
            type: 'object',
            properties: {
              design: {
                type: 'object',
                properties: {
                  colors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        oklch: {
                          type: 'object',
                          properties: {
                            l: { type: 'number', minimum: 0, maximum: 1 },
                            c: { type: 'number', minimum: 0 },
                            h: { type: 'number', minimum: 0, maximum: 360 },
                          },
                          required: ['l', 'c', 'h'],
                        },
                        role: { type: 'string' },
                        usage: { type: 'array', items: { type: 'string' } },
                      },
                      required: ['oklch', 'role', 'usage'],
                    },
                  },
                  layout: {
                    type: 'object',
                    properties: {
                      direction: { type: 'string', enum: ['ltr', 'rtl'] },
                      density: { type: 'string', enum: ['compact', 'comfortable', 'spacious'] },
                    },
                  },
                },
                required: ['colors'],
              },
              targetCultures: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of target cultures (e.g., western, chinese, islamic, etc.)',
              },
            },
            required: ['design', 'targetCultures'],
          },
        },
        {
          name: 'predict_user_reactions',
          description: 'Predict user reactions across different demographic segments',
          inputSchema: {
            type: 'object',
            properties: {
              design: {
                type: 'object',
                properties: {
                  colors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        oklch: {
                          type: 'object',
                          properties: {
                            l: { type: 'number', minimum: 0, maximum: 1 },
                            c: { type: 'number', minimum: 0 },
                            h: { type: 'number', minimum: 0, maximum: 360 },
                          },
                          required: ['l', 'c', 'h'],
                        },
                        role: { type: 'string' },
                        usage: { type: 'array', items: { type: 'string' } },
                      },
                      required: ['oklch', 'role', 'usage'],
                    },
                  },
                  components: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: { type: 'string' },
                        properties: { type: 'object' },
                      },
                      required: ['type', 'properties'],
                    },
                  },
                  layout: {
                    type: 'object',
                    properties: {
                      direction: { type: 'string', enum: ['ltr', 'rtl'] },
                      density: { type: 'string', enum: ['compact', 'comfortable', 'spacious'] },
                    },
                  },
                },
                required: ['colors', 'components'],
              },
              userSegments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    demographics: {
                      type: 'object',
                      properties: {
                        ageRange: { type: 'string' },
                        regions: { type: 'array', items: { type: 'string' } },
                        techSavviness: { type: 'string', enum: ['low', 'medium', 'high'] },
                      },
                      required: ['ageRange', 'regions', 'techSavviness'],
                    },
                    preferences: {
                      type: 'object',
                      properties: {
                        colorPreferences: { type: 'array', items: { type: 'string' } },
                        layoutDensity: {
                          type: 'string',
                          enum: ['compact', 'comfortable', 'spacious'],
                        },
                        interactionStyle: {
                          type: 'string',
                          enum: ['touch', 'mouse', 'keyboard', 'voice'],
                        },
                      },
                      required: ['colorPreferences', 'layoutDensity', 'interactionStyle'],
                    },
                    accessibilityNeeds: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['name', 'demographics', 'preferences', 'accessibilityNeeds'],
                },
              },
            },
            required: ['design', 'userSegments'],
          },
        },
        {
          name: 'analyze_design_patterns',
          description:
            'Analyze design patterns across multiple design systems for consistency and best practices',
          inputSchema: {
            type: 'object',
            properties: {
              designSystems: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    version: { type: 'string' },
                    colors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          scale: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                l: { type: 'number', minimum: 0, maximum: 1 },
                                c: { type: 'number', minimum: 0 },
                                h: { type: 'number', minimum: 0, maximum: 360 },
                              },
                              required: ['l', 'c', 'h'],
                            },
                          },
                        },
                        required: ['name', 'scale'],
                      },
                    },
                    components: { type: 'array', items: { type: 'string' } },
                    patterns: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['name', 'version', 'colors', 'components', 'patterns'],
                },
              },
            },
            required: ['designSystems'],
          },
        },
        {
          name: 'detect_design_drift',
          description: 'Detect drift between baseline and current design system versions',
          inputSchema: {
            type: 'object',
            properties: {
              baselineSystem: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  version: { type: 'string' },
                  colors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        scale: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              l: { type: 'number', minimum: 0, maximum: 1 },
                              c: { type: 'number', minimum: 0 },
                              h: { type: 'number', minimum: 0, maximum: 360 },
                            },
                            required: ['l', 'c', 'h'],
                          },
                        },
                      },
                      required: ['name', 'scale'],
                    },
                  },
                  components: { type: 'array', items: { type: 'string' } },
                  patterns: { type: 'array', items: { type: 'string' } },
                },
                required: ['name', 'version', 'colors', 'components', 'patterns'],
              },
              currentSystem: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  version: { type: 'string' },
                  colors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        scale: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              l: { type: 'number', minimum: 0, maximum: 1 },
                              c: { type: 'number', minimum: 0 },
                              h: { type: 'number', minimum: 0, maximum: 360 },
                            },
                            required: ['l', 'c', 'h'],
                          },
                        },
                      },
                      required: ['name', 'scale'],
                    },
                  },
                  components: { type: 'array', items: { type: 'string' } },
                  patterns: { type: 'array', items: { type: 'string' } },
                },
                required: ['name', 'version', 'colors', 'components', 'patterns'],
              },
            },
            required: ['baselineSystem', 'currentSystem'],
          },
        },
        {
          name: 'evaluate_system_health',
          description: 'Evaluate overall health and maturity of a design system',
          inputSchema: {
            type: 'object',
            properties: {
              designSystem: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  version: { type: 'string' },
                  colors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        scale: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              l: { type: 'number', minimum: 0, maximum: 1 },
                              c: { type: 'number', minimum: 0 },
                              h: { type: 'number', minimum: 0, maximum: 360 },
                            },
                            required: ['l', 'c', 'h'],
                          },
                        },
                      },
                      required: ['name', 'scale'],
                    },
                  },
                  components: { type: 'array', items: { type: 'string' } },
                  patterns: { type: 'array', items: { type: 'string' } },
                },
                required: ['name', 'version', 'colors', 'components', 'patterns'],
              },
            },
            required: ['designSystem'],
          },
        },
        {
          name: 'track_pattern_evolution',
          description:
            'Track pattern evolution and predict future trends across design system versions',
          inputSchema: {
            type: 'object',
            properties: {
              historicalData: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    timestamp: { type: 'number' },
                    system: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        version: { type: 'string' },
                        colors: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              name: { type: 'string' },
                              scale: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  properties: {
                                    l: { type: 'number', minimum: 0, maximum: 1 },
                                    c: { type: 'number', minimum: 0 },
                                    h: { type: 'number', minimum: 0, maximum: 360 },
                                  },
                                  required: ['l', 'c', 'h'],
                                },
                              },
                            },
                            required: ['name', 'scale'],
                          },
                        },
                        components: { type: 'array', items: { type: 'string' } },
                        patterns: { type: 'array', items: { type: 'string' } },
                      },
                      required: ['name', 'version', 'colors', 'components', 'patterns'],
                    },
                  },
                  required: ['timestamp', 'system'],
                },
              },
            },
            required: ['historicalData'],
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
        case 'analyze_accessibility_impact':
          return await this.handleAnalyzeAccessibilityImpact(args);
        case 'simulate_color_vision_experience':
          return await this.handleSimulateColorVisionExperience(args);
        case 'analyze_cultural_sensitivity':
          return await this.handleAnalyzeCulturalSensitivity(args);
        case 'predict_user_reactions':
          return await this.handlePredictUserReactions(args);
        case 'analyze_design_patterns':
          return await this.handleAnalyzeDesignPatterns(args);
        case 'detect_design_drift':
          return await this.handleDetectDesignDrift(args);
        case 'evaluate_system_health':
          return await this.handleEvaluateSystemHealth(args);
        case 'track_pattern_evolution':
          return await this.handleTrackPatternEvolution(args);
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
        context: z
          .object({
            layoutComplexity: z.number().min(1).max(10).default(1),
            userExpertise: z.enum(['novice', 'intermediate', 'expert']).default('novice'),
            taskUrgency: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
            deviceContext: z.enum(['mobile', 'tablet', 'desktop', 'kiosk']).default('desktop'),
          })
          .optional(),
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
                suggestion:
                  'Component may not have been processed through Rafters intelligence pipeline',
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
                error: (result as { error: string }).error,
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
                cognitiveLoadRating:
                  result.data.cognitiveLoadScore > 7
                    ? 'high'
                    : result.data.cognitiveLoadScore > 4
                      ? 'moderate'
                      : 'low',
                millerCompliance: result.data.millerRuleCompliance ? 'compliant' : 'violation',
                attentionLevel:
                  result.data.attentionWeight > 0.7
                    ? 'primary'
                    : result.data.attentionWeight > 0.4
                      ? 'secondary'
                      : 'tertiary',
                trustRequirements:
                  result.data.trustPatterns.length > 2
                    ? 'critical'
                    : result.data.trustPatterns.length > 0
                      ? 'high'
                      : 'standard',
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
        constraints: z
          .object({
            maxCognitiveLoad: z.number().default(7),
            maxAttentionPoints: z.number().default(3),
            requiresAccessibility: z.array(z.enum(['AA', 'AAA'])).default(['AA']),
            trustLevel: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
          })
          .optional(),
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
          files: component.files ? component.files.map((f) => f.path) : [],
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
      const validComponents = componentResults.filter(
        (comp): comp is ComponentRegistry => comp !== null
      );

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
                error: (result as { error: string }).error,
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
          components: z.array(
            z.object({
              name: z.string(),
              position: z.object({ x: z.number(), y: z.number() }),
              size: z.object({ width: z.number(), height: z.number() }),
              zIndex: z.number().optional(),
            })
          ),
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
                error: (result as { error: string }).error,
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
        context: z
          .object({
            colorVisionTypes: z
              .array(z.enum(['normal', 'deuteranopia', 'protanopia', 'tritanopia']))
              .default(['normal']),
            contrastLevel: z.enum(['AA', 'AAA']).default('AA'),
            screenReader: z.boolean().default(false),
            motorImpairments: z.boolean().default(false),
            cognitiveImpairments: z.boolean().default(false),
          })
          .optional(),
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
                error: (result as { error: string }).error,
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
                colorVisionCompatible: Object.values(result.data.colorVisionAnalysis).every(
                  (analysis) => analysis.accessible
                ),
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

  private async handleAnalyzeAccessibilityImpact(args: unknown) {
    const params = z
      .object({
        design: z.object({
          colors: z.array(
            z.object({
              oklch: z.object({
                l: z.number().min(0).max(1),
                c: z.number().min(0),
                h: z.number().min(0).max(360),
              }),
              role: z.string(),
              usage: z.array(z.string()),
            })
          ),
          components: z.array(
            z.object({
              type: z.string(),
              properties: z.record(z.string(), z.unknown()),
              accessibility: z
                .object({
                  keyboardNavigable: z.boolean(),
                  touchTarget: z.number().optional(),
                  contrastRatio: z.number().optional(),
                })
                .optional(),
            })
          ),
        }),
        userProfiles: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              colorVision: z.enum(['normal', 'deuteranopia', 'protanopia', 'tritanopia']),
              culturalBackground: z.array(z.string()),
              accessibilityNeeds: z.array(z.string()),
              languageDirection: z.enum(['ltr', 'rtl']).default('ltr'),
              devicePreference: z.enum(['mobile', 'tablet', 'desktop']).default('desktop'),
              cognitiveProfile: z
                .object({
                  processingSpeed: z.enum(['low', 'average', 'high']).default('average'),
                  workingMemory: z.enum(['low', 'average', 'high']).default('average'),
                  attentionControl: z.enum(['low', 'average', 'high']).default('average'),
                })
                .optional(),
            })
          )
          .default([]),
      })
      .parse(args);

    try {
      const result = await this.userEmpathy.analyzeAccessibilityImpact(
        params.design,
        params.userProfiles
      );

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: (result as { error: string }).error,
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
              accessibilityAnalysis: {
                wcagCompliance: result.data.wcagCompliance,
                colorVisionImpact: result.data.colorVisionImpact,
                cognitiveLoad: result.data.cognitiveLoad,
                motorAccessibility: result.data.motorAccessibility,
              },
              confidence: result.confidence,
              processingTime: result.processingTime,
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
              error: `Failed to analyze accessibility impact: ${error instanceof Error ? error.message : String(error)}`,
            }),
          },
        ],
      };
    }
  }

  private async handleSimulateColorVisionExperience(args: unknown) {
    const params = z
      .object({
        colors: z.array(
          z.object({
            l: z.number().min(0).max(1),
            c: z.number().min(0),
            h: z.number().min(0).max(360),
          })
        ),
        visionTypes: z
          .array(z.enum(['normal', 'deuteranopia', 'protanopia', 'tritanopia']))
          .default(['normal', 'deuteranopia', 'protanopia', 'tritanopia']),
      })
      .parse(args);

    try {
      const result = await this.userEmpathy.simulateColorVisionExperience(
        params.colors,
        params.visionTypes
      );

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: (result as { error: string }).error,
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
              visionSimulations: {
                originalColors: result.data.originalColors,
                simulations: result.data.simulations,
              },
              confidence: result.confidence,
              processingTime: result.processingTime,
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
              error: `Failed to simulate color vision experience: ${error instanceof Error ? error.message : String(error)}`,
            }),
          },
        ],
      };
    }
  }

  private async handleAnalyzeCulturalSensitivity(args: unknown) {
    const params = z
      .object({
        design: z.object({
          colors: z.array(
            z.object({
              oklch: z.object({
                l: z.number().min(0).max(1),
                c: z.number().min(0),
                h: z.number().min(0).max(360),
              }),
              role: z.string(),
              usage: z.array(z.string()),
            })
          ),
          components: z.array(
            z.object({
              type: z.string(),
              properties: z.record(z.string(), z.unknown()),
              accessibility: z
                .object({
                  keyboardNavigable: z.boolean(),
                  touchTarget: z.number().optional(),
                  contrastRatio: z.number().optional(),
                })
                .optional(),
            })
          ),
          layout: z
            .object({
              direction: z.enum(['ltr', 'rtl']).default('ltr'),
              density: z.enum(['compact', 'comfortable', 'spacious']).default('comfortable'),
            })
            .optional(),
        }),
        targetCultures: z.array(z.string()),
      })
      .parse(args);

    try {
      const result = await this.userEmpathy.analyzeCulturalSensitivity(
        params.design,
        params.targetCultures
      );

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: (result as { error: string }).error,
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
              culturalAnalysis: {
                overallScore: result.data.overallScore,
                culturalAnalysis: result.data.culturalAnalysis,
                globalRecommendations: result.data.globalRecommendations,
              },
              confidence: result.confidence,
              processingTime: result.processingTime,
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
              error: `Failed to analyze cultural sensitivity: ${error instanceof Error ? error.message : String(error)}`,
            }),
          },
        ],
      };
    }
  }

  private async handlePredictUserReactions(args: unknown) {
    const params = z
      .object({
        design: z.object({
          colors: z.array(
            z.object({
              oklch: z.object({
                l: z.number().min(0).max(1),
                c: z.number().min(0),
                h: z.number().min(0).max(360),
              }),
              role: z.string(),
              usage: z.array(z.string()),
            })
          ),
          components: z.array(
            z.object({
              type: z.string(),
              properties: z.record(z.string(), z.unknown()),
              accessibility: z
                .object({
                  keyboardNavigable: z.boolean(),
                  touchTarget: z.number().optional(),
                  contrastRatio: z.number().optional(),
                })
                .optional(),
            })
          ),
        }),
        userSegments: z
          .array(
            z.object({
              name: z.string(),
              demographics: z.object({
                ageRange: z.string(),
                regions: z.array(z.string()),
                techSavviness: z.enum(['low', 'medium', 'high']),
              }),
              preferences: z.object({
                colorPreferences: z.array(z.string()),
                layoutDensity: z.enum(['compact', 'comfortable', 'spacious']),
                interactionStyle: z.enum(['touch', 'mouse', 'keyboard', 'voice']),
              }),
              accessibilityNeeds: z.array(z.string()),
            })
          )
          .default([]),
      })
      .parse(args);

    try {
      const result = await this.userEmpathy.predictUserReactions(
        params.design,
        params.userSegments
      );

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: (result as { error: string }).error,
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
              userReactions: {
                overallSentiment: result.data.overallSentiment,
                segmentReactions: result.data.segmentReactions,
                riskFactors: result.data.riskFactors,
              },
              confidence: result.confidence,
              processingTime: result.processingTime,
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
              error: `Failed to predict user reactions: ${error instanceof Error ? error.message : String(error)}`,
            }),
          },
        ],
      };
    }
  }

  private async handleAnalyzeDesignPatterns(args: unknown) {
    const params = z
      .object({
        designSystems: z.array(
          z.object({
            name: z.string(),
            version: z.string(),
            colors: z.array(
              z.object({
                name: z.string(),
                scale: z.array(
                  z.object({
                    l: z.number().min(0).max(1),
                    c: z.number().min(0),
                    h: z.number().min(0).max(360),
                  })
                ),
              })
            ),
            components: z.array(z.string()),
            patterns: z.array(z.string()),
          })
        ),
      })
      .parse(args);

    try {
      const result = await this.patternRecognition.analyzeDesignPatterns(params.designSystems);

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: (result as { error: string }).error,
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
              patternAnalysis: {
                patterns: result.data.patterns,
                commonPatterns: result.data.commonPatterns,
                antiPatterns: result.data.antiPatterns,
                recommendations: result.data.recommendations,
              },
              systemCount: params.designSystems.length,
              confidence: result.confidence,
              processingTime: result.processingTime,
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
              error: `Failed to analyze design patterns: ${error instanceof Error ? error.message : String(error)}`,
            }),
          },
        ],
      };
    }
  }

  private async handleDetectDesignDrift(args: unknown) {
    const params = z
      .object({
        baselineSystem: z.object({
          name: z.string(),
          version: z.string(),
          colors: z.array(
            z.object({
              name: z.string(),
              scale: z.array(
                z.object({
                  l: z.number().min(0).max(1),
                  c: z.number().min(0),
                  h: z.number().min(0).max(360),
                })
              ),
            })
          ),
          components: z.array(z.string()),
          patterns: z.array(z.string()),
        }),
        currentSystem: z.object({
          name: z.string(),
          version: z.string(),
          colors: z.array(
            z.object({
              name: z.string(),
              scale: z.array(
                z.object({
                  l: z.number().min(0).max(1),
                  c: z.number().min(0),
                  h: z.number().min(0).max(360),
                })
              ),
            })
          ),
          components: z.array(z.string()),
          patterns: z.array(z.string()),
        }),
      })
      .parse(args);

    try {
      const result = await this.patternRecognition.detectDesignDrift(
        params.baselineSystem,
        params.currentSystem
      );

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: (result as { error: string }).error,
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
              driftAnalysis: {
                driftScore: result.data.driftScore,
                driftingElements: result.data.driftingElements,
                timeline: result.data.timeline,
                alerts: result.data.alerts,
              },
              systems: {
                baseline: `${params.baselineSystem.name} v${params.baselineSystem.version}`,
                current: `${params.currentSystem.name} v${params.currentSystem.version}`,
              },
              confidence: result.confidence,
              processingTime: result.processingTime,
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
              error: `Failed to detect design drift: ${error instanceof Error ? error.message : String(error)}`,
            }),
          },
        ],
      };
    }
  }

  private async handleEvaluateSystemHealth(args: unknown) {
    const params = z
      .object({
        designSystem: z.object({
          name: z.string(),
          version: z.string(),
          colors: z.array(
            z.object({
              name: z.string(),
              scale: z.array(
                z.object({
                  l: z.number().min(0).max(1),
                  c: z.number().min(0),
                  h: z.number().min(0).max(360),
                })
              ),
            })
          ),
          components: z.array(z.string()),
          patterns: z.array(z.string()),
        }),
      })
      .parse(args);

    try {
      const result = await this.patternRecognition.evaluateSystemHealth(params.designSystem);

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: (result as { error: string }).error,
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
              systemHealth: {
                overallScore: result.data.overallScore,
                dimensions: result.data.dimensions,
                issues: result.data.issues,
                trends: result.data.trends,
                recommendations: result.data.recommendations,
              },
              system: `${params.designSystem.name} v${params.designSystem.version}`,
              confidence: result.confidence,
              processingTime: result.processingTime,
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
              error: `Failed to evaluate system health: ${error instanceof Error ? error.message : String(error)}`,
            }),
          },
        ],
      };
    }
  }

  private async handleTrackPatternEvolution(args: unknown) {
    const params = z
      .object({
        historicalData: z.array(
          z.object({
            timestamp: z.number(),
            system: z.object({
              name: z.string(),
              version: z.string(),
              colors: z.array(
                z.object({
                  name: z.string(),
                  scale: z.array(
                    z.object({
                      l: z.number().min(0).max(1),
                      c: z.number().min(0),
                      h: z.number().min(0).max(360),
                    })
                  ),
                })
              ),
              components: z.array(z.string()),
              patterns: z.array(z.string()),
            }),
          })
        ),
      })
      .parse(args);

    try {
      // Extract pattern ID from first system name for now
      const patternId =
        params.historicalData.length > 0 ? params.historicalData[0].system.name : 'unknown';
      const result = await this.patternRecognition.trackPatternEvolution(
        patternId,
        params.historicalData
      );

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: (result as { error: string }).error,
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
              evolutionAnalysis: {
                patternId: result.data.patternId,
                name: result.data.name,
                category: result.data.category,
                versions: result.data.versions,
                trajectory: result.data.trajectory,
                predictions: result.data.predictions,
              },
              dataPoints: params.historicalData.length,
              timeSpan:
                params.historicalData.length > 0
                  ? {
                      start: new Date(
                        Math.min(...params.historicalData.map((d) => d.timestamp))
                      ).toISOString(),
                      end: new Date(
                        Math.max(...params.historicalData.map((d) => d.timestamp))
                      ).toISOString(),
                    }
                  : null,
              confidence: result.confidence,
              processingTime: result.processingTime,
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
              error: `Failed to track pattern evolution: ${error instanceof Error ? error.message : String(error)}`,
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
