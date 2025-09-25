/**
 * Dependency Intelligence Service
 *
 * Provides intelligent analysis of token dependencies, cascade impact prediction,
 * and rule-based token generation for Claude's design reasoning capabilities.
 *
 * Integrates with Rafters' existing TokenRegistry and dependency graph system
 * to provide mathematical precision in design token relationships.
 */

import {
  GenerationRuleExecutor,
  GenerationRuleParser,
  TokenRegistry,
} from '@rafters/design-tokens';
import type {
  ParsedRule,
} from '@rafters/design-tokens';
import { z } from 'zod';

// ===== SCHEMAS & TYPES =====

export const DependencyAnalysisOptionsSchema = z
  .object({
    includeIndirectDependencies: z.boolean().default(true),
    maxDepth: z.number().min(1).max(10).default(5),
    includeCascadeImpact: z.boolean().default(true),
    includeRuleAnalysis: z.boolean().default(true),
  })
  .partial();

export type DependencyAnalysisOptions = z.infer<typeof DependencyAnalysisOptionsSchema>;

export const ValidationOptionsSchema = z
  .object({
    checkCircularDependencies: z.boolean().default(true),
    validateRuleSyntax: z.boolean().default(true),
    checkMissingDependencies: z.boolean().default(true),
    performanceCheck: z.boolean().default(true),
  })
  .partial();

export type ValidationOptions = z.infer<typeof ValidationOptionsSchema>;

export const RuleExecutionContextSchema = z.object({
  tokenName: z.string(),
  dependencies: z.array(z.string()),
  currentValue: z.string().optional(),
  targetValue: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type RuleExecutionContext = z.infer<typeof RuleExecutionContextSchema>;

export const TokenChangeSchema = z.object({
  tokenName: z.string(),
  oldValue: z.string().optional(),
  newValue: z.string(),
  rule: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

export type TokenChange = z.infer<typeof TokenChangeSchema>;

export const DependencyAnalysisSchema = z.object({
  tokenName: z.string(),
  directDependencies: z.array(z.string()),
  indirectDependencies: z.array(z.string()),
  dependents: z.array(z.string()),
  cascadeScope: z.array(z.string()),
  depth: z.number(),
  ruleType: z.string().optional(),
  ruleExpression: z.string().optional(),
  circularDependencies: z.array(z.array(z.string())),
  performanceMetrics: z.object({
    complexity: z.number().min(0).max(10),
    regenerationTime: z.number().optional(),
    impactScope: z.number(),
  }),
});

export type DependencyAnalysis = z.infer<typeof DependencyAnalysisSchema>;

export const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(
    z.object({
      tokenName: z.string(),
      errorType: z.enum([
        'circular-dependency',
        'missing-dependency',
        'invalid-rule',
        'syntax-error',
      ]),
      message: z.string(),
      severity: z.enum(['error', 'warning', 'info']),
      suggestedFix: z.string().optional(),
    })
  ),
  warnings: z.array(
    z.object({
      tokenName: z.string(),
      message: z.string(),
      recommendation: z.string().optional(),
    })
  ),
  performanceImpact: z.object({
    complexity: z.number().min(0).max(10),
    estimatedRegenerationTime: z.number(),
    potentialBottlenecks: z.array(z.string()),
  }),
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;

export const RuleExecutionResultSchema = z.object({
  success: z.boolean(),
  result: z.string().optional(),
  confidence: z.number().min(0).max(1),
  executionTime: z.number(),
  dependencies: z.array(z.string()),
  error: z.string().optional(),
  metadata: z.object({
    ruleType: z.string(),
    inputTokens: z.array(z.string()),
    mathExpression: z.string().optional(),
    reasoning: z.string().optional(),
  }),
});

export type RuleExecutionResult = z.infer<typeof RuleExecutionResultSchema>;

export const CascadeImpactAnalysisSchema = z.object({
  tokenName: z.string(),
  newValue: z.string(),
  affectedTokens: z.array(
    z.object({
      tokenName: z.string(),
      currentValue: z.string(),
      predictedValue: z.string(),
      confidence: z.number().min(0).max(1),
      ruleUsed: z.string().optional(),
    })
  ),
  cascadePath: z.array(z.array(z.string())), // Array of dependency chains
  totalImpact: z.number().min(0).max(10), // Overall impact score
  riskAssessment: z.object({
    breakingChanges: z.number().min(0).max(10),
    visualImpact: z.number().min(0).max(10),
    accessibilityImpact: z.number().min(0).max(10),
    semanticConsistency: z.number().min(0).max(10),
  }),
  recommendations: z.array(z.string()),
});

export type CascadeImpactAnalysis = z.infer<typeof CascadeImpactAnalysisSchema>;

export const IntelligenceResultSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  executionTime: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type IntelligenceResult<T> =
  | {
      success: true;
      data: T;
      confidence: number;
      executionTime: number;
      metadata?: Record<string, unknown>;
    }
  | {
      success: false;
      error: string;
      executionTime: number;
      metadata?: Record<string, unknown>;
    };

// ===== DEPENDENCY INTELLIGENCE SERVICE =====

export class DependencyIntelligenceService {
  private tokenRegistry: TokenRegistry;
  private ruleParser: GenerationRuleParser;
  private ruleExecutor: GenerationRuleExecutor;
  private performanceCache: Map<string, { value: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60000; // 1 minute cache

  constructor(tokenRegistry: TokenRegistry) {
    this.tokenRegistry = tokenRegistry;
    this.ruleParser = new GenerationRuleParser();
    this.ruleExecutor = new GenerationRuleExecutor(tokenRegistry);
  }

  /**
   * Analyze token dependencies with intelligent cascade impact analysis
   */
  async analyzeDependencies(
    tokenName: string,
    options: DependencyAnalysisOptions = {}
  ): Promise<IntelligenceResult<DependencyAnalysis>> {
    const startTime = performance.now();

    try {
      const defaultOptions = {
        includeIndirectDependencies: true,
        maxDepth: 5,
        includeCascadeImpact: true,
        includeRuleAnalysis: true,
      };
      const opts = { ...defaultOptions, ...options };
      const dependencyGraph = this.tokenRegistry.dependencyGraph;

      // Get direct dependencies
      const directDependencies = dependencyGraph.getDependencies(tokenName);
      const dependents = dependencyGraph.getDependents(tokenName);

      // Get indirect dependencies if requested
      let indirectDependencies: string[] = [];
      if (opts.includeIndirectDependencies) {
        indirectDependencies = this.getIndirectDependencies(tokenName, opts.maxDepth);
      }

      // Calculate cascade scope
      const cascadeScope = this.calculateCascadeScope(tokenName);

      // Calculate dependency depth
      const depth = this.calculateDependencyDepth(tokenName);

      // Get rule information
      const rule = dependencyGraph.getGenerationRule(tokenName);
      let ruleType: string | undefined;
      let ruleExpression: string | undefined;

      if (rule) {
        ruleType = rule.split(':')[0] || rule.split('(')[0];
        ruleExpression = rule;
      }

      // Check for circular dependencies
      const circularDependencies = this.findCircularDependencies(tokenName);

      // Calculate performance metrics
      const complexity = this.calculateComplexity(
        tokenName,
        directDependencies,
        indirectDependencies
      );
      const impactScope = cascadeScope.length;

      const analysis: DependencyAnalysis = {
        tokenName,
        directDependencies,
        indirectDependencies,
        dependents,
        cascadeScope,
        depth,
        ruleType,
        ruleExpression,
        circularDependencies,
        performanceMetrics: {
          complexity,
          impactScope,
        },
      };

      const executionTime = performance.now() - startTime;
      const confidence = this.calculateAnalysisConfidence(analysis);

      return {
        success: true,
        data: analysis,
        confidence,
        executionTime,
        metadata: {
          tokenExists: this.tokenRegistry.has(tokenName),
          hasRule: !!rule,
        },
      };
    } catch (error) {
      const executionTime = performance.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during dependency analysis',
        executionTime,
      };
    }
  }

  /**
   * Validate token changes for circular dependencies and rule consistency
   */
  async validateChanges(
    changes: readonly TokenChange[],
    _options: ValidationOptions = {}
  ): Promise<IntelligenceResult<ValidationResult>> {
    const startTime = performance.now();

    try {
      // Apply options (simplified - we'll use all checks for now)
      const errors: ValidationResult['errors'] = [];
      const warnings: ValidationResult['warnings'] = [];

      // Validate each change
      for (const change of changes) {
        if (change.dependencies) {
          const wouldCreateCircular = this.wouldCreateCircularDependency(
            change.tokenName,
            change.dependencies
          );
          if (wouldCreateCircular) {
            errors.push({
              tokenName: change.tokenName,
              errorType: 'circular-dependency',
              message: 'This change would create a circular dependency',
              severity: 'error',
              suggestedFix: 'Remove dependencies that create cycles',
            });
          }
        }

        if (change.rule) {
          // Simplified rule validation - basic syntax check
          if (!change.rule.includes(':') && !change.rule.includes('(')) {
            errors.push({
              tokenName: change.tokenName,
              errorType: 'invalid-rule',
              message: `Invalid rule syntax: ${change.rule}`,
              severity: 'error',
              suggestedFix: 'Check rule syntax - should be like "scale:2" or "calc(...)"',
            });
          }
        }

        if (change.dependencies) {
          for (const dep of change.dependencies) {
            if (!this.tokenRegistry.has(dep)) {
              errors.push({
                tokenName: change.tokenName,
                errorType: 'missing-dependency',
                message: `Dependency token '${dep}' does not exist`,
                severity: 'error',
                suggestedFix: `Create token '${dep}' before setting up this dependency`,
              });
            }
          }
        }
      }

      // Calculate performance impact
      const complexity = this.calculateBatchComplexity(changes);
      const estimatedRegenerationTime = this.estimateRegenerationTime(changes);
      const potentialBottlenecks = this.identifyPotentialBottlenecks(changes);

      const result: ValidationResult = {
        isValid: errors.length === 0,
        errors,
        warnings,
        performanceImpact: {
          complexity,
          estimatedRegenerationTime,
          potentialBottlenecks,
        },
      };

      const executionTime = performance.now() - startTime;
      const confidence = errors.length === 0 ? 0.95 : Math.max(0.1, 1 - errors.length * 0.2);

      return {
        success: true,
        data: result,
        confidence,
        executionTime,
      };
    } catch (error) {
      const executionTime = performance.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during validation',
        executionTime,
      };
    }
  }

  /**
   * Execute a specific rule with confidence scoring
   */
  async executeRule(
    rule: string,
    tokenName: string,
    context: RuleExecutionContext
  ): Promise<IntelligenceResult<RuleExecutionResult>> {
    const startTime = performance.now();

    try {
      // Parse the rule using the real parser
      const parsedRule = this.ruleParser.parse(rule);
      
      // Set base token from context dependencies for rules that need it
      if (this.needsBaseToken(parsedRule) && context.dependencies.length > 0) {
        parsedRule.baseToken = context.dependencies[0];
      }
      
      // Execute the rule using the real executor
      const result = this.ruleExecutor.execute(parsedRule, tokenName);
      
      // Calculate confidence based on rule complexity and dependency availability
      const confidence = this.calculateExecutionConfidence(parsedRule, context);

      const executionTime = performance.now() - startTime;

      const executionResult: RuleExecutionResult = {
        success: true,
        result,
        confidence,
        executionTime,
        dependencies: context.dependencies,
        metadata: {
          ruleType: parsedRule.type,
          inputTokens: parsedRule.tokens || context.dependencies,
          mathExpression: parsedRule.expression || rule,
          reasoning: this.generateExecutionReasoning(parsedRule, result),
          baseToken: parsedRule.baseToken,
        },
      };

      return {
        success: true,
        data: executionResult,
        confidence,
        executionTime,
      };
    } catch (error) {
      const executionTime = performance.now() - startTime;

      // Return error result directly instead of creating unused variable

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during rule execution',
        executionTime,
      };
    }
  }

  /**
   * Predict cascade impact of changing a token value
   */
  async predictCascadeImpact(
    tokenName: string,
    newValue: string
  ): Promise<IntelligenceResult<CascadeImpactAnalysis>> {
    const startTime = performance.now();

    try {
      const dependencyGraph = this.tokenRegistry.dependencyGraph;

      // Get all tokens that would be affected by this change
      const affectedTokens = this.getAffectedTokens(tokenName);

      // Predict new values for each affected token
      const affectedTokensWithPredictions = await Promise.all(
        affectedTokens.map(async (affectedToken) => {
          const rule = dependencyGraph.getGenerationRule(affectedToken);
          let predictedValue = 'unknown';
          let confidence = 0.5;

          if (rule) {
            try {
              // Parse and execute the rule with the new base value
              const parsedRule = this.ruleParser.parse(rule);
              
              // Create a temporary registry with the updated value for prediction
              const tempRegistry = this.createTempRegistry(tokenName, newValue);
              const tempExecutor = new GenerationRuleExecutor(tempRegistry);
              
              // Set base token if needed
              if (this.needsBaseToken(parsedRule)) {
                const dependencies = dependencyGraph.getDependencies(affectedToken);
                if (dependencies.length > 0) {
                  parsedRule.baseToken = dependencies[0];
                }
              }
              
              predictedValue = tempExecutor.execute(parsedRule, affectedToken);
              confidence = 0.85; // High confidence for successful rule execution
            } catch (error) {
              // Fallback to pattern-based prediction
              const ruleType = rule.split(':')[0] || rule.split('(')[0];
              predictedValue = `${ruleType}(${newValue})`;
              confidence = 0.4; // Medium confidence for fallback
            }
          }

          return {
            tokenName: affectedToken,
            currentValue: String(this.tokenRegistry.get(affectedToken)?.value || 'unknown'),
            predictedValue,
            confidence,
            ruleUsed: rule,
          };
        })
      );

      // Calculate cascade paths
      const cascadePath = this.calculateCascadePaths(tokenName);

      // Calculate impact scores
      const totalImpact = this.calculateTotalImpact(affectedTokensWithPredictions);
      const riskAssessment = this.assessRisks(tokenName, newValue, affectedTokensWithPredictions);

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        tokenName,
        newValue,
        affectedTokensWithPredictions
      );

      const analysis: CascadeImpactAnalysis = {
        tokenName,
        newValue,
        affectedTokens: affectedTokensWithPredictions,
        cascadePath,
        totalImpact,
        riskAssessment,
        recommendations,
      };

      const executionTime = performance.now() - startTime;
      const confidence = this.calculateCascadeConfidence(analysis);

      return {
        success: true,
        data: analysis,
        confidence,
        executionTime,
        metadata: {
          affectedCount: affectedTokensWithPredictions.length,
          cascadeDepth: Math.max(...cascadePath.map((path) => path.length)),
        },
      };
    } catch (error) {
      const executionTime = performance.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during cascade prediction',
        executionTime,
      };
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  private getIndirectDependencies(tokenName: string, maxDepth: number): string[] {
    const visited = new Set<string>();
    const result = new Set<string>();

    const traverse = (token: string, depth: number) => {
      if (depth >= maxDepth || visited.has(token)) return;

      visited.add(token);
      const deps = this.tokenRegistry.dependencyGraph.getDependencies(token);

      for (const dep of deps) {
        result.add(dep);
        traverse(dep, depth + 1);
      }
    };

    traverse(tokenName, 0);
    return Array.from(result);
  }

  /**
   * Calculate cascade scope with memoization for performance
   */
  private calculateCascadeScope(tokenName: string): string[] {
    const cacheKey = `cascade_${tokenName}`;
    
    // Check cache first
    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      return cached as string[];
    }

    const visited = new Set<string>();
    const result = new Set<string>();

    const traverse = (token: string) => {
      if (visited.has(token)) return;
      visited.add(token);

      const dependents = this.tokenRegistry.dependencyGraph.getDependents(token);
      for (const dependent of dependents) {
        result.add(dependent);
        traverse(dependent);
      }
    };

    traverse(tokenName);
    const cascadeScope = Array.from(result);
    
    // Cache the result
    this.setCachedResult(cacheKey, cascadeScope);
    
    return cascadeScope;
  }

  /**
   * Calculate dependency depth with memoization
   */
  private calculateDependencyDepth(tokenName: string): number {
    const cacheKey = `depth_${tokenName}`;
    
    // Check cache first
    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      return cached as number;
    }

    const visited = new Set<string>();

    const getDepth = (token: string): number => {
      if (visited.has(token)) return 0;
      visited.add(token);

      const deps = this.tokenRegistry.dependencyGraph.getDependencies(token);
      if (deps.length === 0) return 0;

      return 1 + Math.max(...deps.map((dep: string) => getDepth(dep)));
    };

    const result = getDepth(tokenName);
    
    // Cache the result
    this.setCachedResult(cacheKey, result);
    
    return result;
  }

  /**
   * Find circular dependencies using proper DFS with correct visited set management
   */
  private findCircularDependencies(tokenName: string): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const currentPath: string[] = [];

    const dfs = (token: string): boolean => {
      if (recursionStack.has(token)) {
        // Found a cycle - extract it from current path
        const cycleStart = currentPath.indexOf(token);
        if (cycleStart >= 0) {
          cycles.push([...currentPath.slice(cycleStart), token]);
        }
        return true;
      }

      if (visited.has(token)) {
        return false; // Already processed, no cycle from this path
      }

      visited.add(token);
      recursionStack.add(token);
      currentPath.push(token);

      const dependencies = this.tokenRegistry.dependencyGraph.getDependencies(token);
      for (const dep of dependencies) {
        if (dfs(dep)) {
          // Cycle found, but don't return true unless this token is part of it
          // This prevents false positives when cycles exist elsewhere
        }
      }

      recursionStack.delete(token);
      currentPath.pop();
      return false;
    };

    dfs(tokenName);
    return cycles;
  }

  private calculateComplexity(
    tokenName: string,
    directDeps: string[],
    indirectDeps: string[]
  ): number {
    const baseComplexity = Math.min(directDeps.length * 0.5, 3);
    const indirectComplexity = Math.min(indirectDeps.length * 0.1, 2);
    const rule = this.tokenRegistry.dependencyGraph.getGenerationRule(tokenName);
    const ruleComplexity = rule ? this.getRuleComplexity(rule) : 0;

    return Math.min(baseComplexity + indirectComplexity + ruleComplexity, 10);
  }

  private getRuleComplexity(rule: string): number {
    // Simplified rule complexity calculation
    if (rule.includes('calc(')) return 2;
    if (rule.includes('scale:')) return 1;
    if (rule.includes('state:')) return 1;
    if (rule.includes('contrast:')) return 3;
    if (rule.includes('invert')) return 1;
    return 0.5; // Unknown rule gets low complexity
  }

  private calculateAnalysisConfidence(analysis: DependencyAnalysis): number {
    let confidence = 0.7; // Base confidence

    // Boost confidence if we have rule information
    if (analysis.ruleType && analysis.ruleExpression) {
      confidence += 0.1;
    }

    // Reduce confidence if there are circular dependencies
    if (analysis.circularDependencies.length > 0) {
      confidence -= 0.3;
    }

    // Reduce confidence based on complexity
    confidence -= Math.min(analysis.performanceMetrics.complexity * 0.05, 0.2);

    return Math.max(Math.min(confidence, 1), 0);
  }

  /**
   * Check if adding dependencies would create circular dependencies
   * Uses proper graph algorithm with correct visited set management
   */
  private wouldCreateCircularDependency(tokenName: string, dependencies: string[]): boolean {
    // Use the TokenDependencyGraph's built-in method if available
    const dependencyGraph = this.tokenRegistry.dependencyGraph;
    
    // Create a temporary copy to test the change
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (token: string, targetDeps: string[]): boolean => {
      if (recursionStack.has(token)) {
        return true; // Found a cycle
      }

      if (visited.has(token)) {
        return false; // Already processed
      }

      visited.add(token);
      recursionStack.add(token);

      // Get dependencies - use provided dependencies if this is the target token
      const deps = token === tokenName ? targetDeps : dependencyGraph.getDependencies(token);
      
      for (const dep of deps) {
        if (hasCycle(dep, [])) {
          recursionStack.delete(token);
          return true;
        }
      }

      recursionStack.delete(token);
      return false;
    };

    return hasCycle(tokenName, dependencies);
  }

  private calculateBatchComplexity(changes: readonly TokenChange[]): number {
    const totalTokens = changes.length;
    const totalDependencies = changes.reduce(
      (sum, change) => sum + (change.dependencies?.length || 0),
      0
    );
    const rulesCount = changes.filter((change) => change.rule).length;

    const baseComplexity = Math.min(totalTokens * 0.3, 4);
    const depComplexity = Math.min(totalDependencies * 0.1, 3);
    const ruleComplexity = Math.min(rulesCount * 0.5, 3);

    return Math.min(baseComplexity + depComplexity + ruleComplexity, 10);
  }

  private estimateRegenerationTime(changes: readonly TokenChange[]): number {
    // Estimate based on number of changes and their complexity
    const baseTime = changes.length * 2; // 2ms per token change
    const ruleTime = changes.filter((c) => c.rule).length * 5; // 5ms per rule execution
    const dependencyTime = changes.reduce((sum, c) => sum + (c.dependencies?.length || 0), 0) * 1;

    return baseTime + ruleTime + dependencyTime;
  }

  private identifyPotentialBottlenecks(changes: readonly TokenChange[]): string[] {
    const bottlenecks: string[] = [];

    // Check for tokens with many dependents
    for (const change of changes) {
      const dependents = this.tokenRegistry.dependencyGraph.getDependents(change.tokenName);
      if (dependents.length > 10) {
        bottlenecks.push(`${change.tokenName} has ${dependents.length} dependents`);
      }

      // Check for complex rules
      if (change.rule) {
        if (change.rule.includes('calc(') && change.rule.length > 50) {
          bottlenecks.push(`${change.tokenName} has complex calculation rule`);
        } else if (!change.rule.includes(':') && !change.rule.includes('(')) {
          bottlenecks.push(`${change.tokenName} has invalid rule syntax`);
        }
      }
    }

    return bottlenecks;
  }

  // Remove unused confidence calculation method

  /**
   * Check if a parsed rule needs a base token
   */
  private needsBaseToken(parsedRule: ParsedRule): boolean {
    return ['state', 'scale', 'contrast', 'invert'].includes(parsedRule.type);
  }

  /**
   * Calculate execution confidence based on rule complexity and available dependencies
   */
  private calculateExecutionConfidence(parsedRule: ParsedRule, context: RuleExecutionContext): number {
    let confidence = 0.8; // Base confidence

    // Check if all required dependencies are available
    const requiredTokens = parsedRule.tokens || [];
    const missingTokens = requiredTokens.filter((token: string) => !this.tokenRegistry.has(token));
    confidence -= missingTokens.length * 0.2;

    // Check if base token is available for rules that need it
    if (this.needsBaseToken(parsedRule)) {
      if (!parsedRule.baseToken || !this.tokenRegistry.has(parsedRule.baseToken)) {
        confidence -= 0.3;
      }
    }

    // Boost confidence for simpler rules
    switch (parsedRule.type) {
      case 'scale':
      case 'state':
      case 'invert':
        confidence += 0.1;
        break;
      case 'calc':
        confidence -= 0.1; // Calculations are more prone to errors
        break;
    }

    // Factor in context dependencies
    if (context.dependencies.length === 0 && requiredTokens.length > 0) {
      confidence -= 0.2; // Missing context dependencies
    }

    return Math.max(Math.min(confidence, 1), 0);
  }

  private generateExecutionReasoning(parsedRule: ParsedRule, result: string): string {
    switch (parsedRule.type) {
      case 'calc':
        return `Calculated result using mathematical expression: ${parsedRule.expression || 'unknown'}`;
      case 'scale':
        return `Scaled base token '${parsedRule.baseToken}' by ratio: ${parsedRule.ratio || 'default'}`;
      case 'state':
        return `Applied ${parsedRule.stateType || 'default'} state transformation to '${parsedRule.baseToken}'`;
      case 'contrast':
        return `Generated ${parsedRule.contrast || 'auto'} contrast variant for '${parsedRule.baseToken}'`;
      case 'invert':
        return `Applied color inversion transformation to '${parsedRule.baseToken}'`;
      default:
        return `Executed ${parsedRule.type} rule transformation: ${result}`;
    }
  }

  private getAffectedTokens(tokenName: string): string[] {
    return this.calculateCascadeScope(tokenName);
  }

  // Remove unused method

  /**
   * Create a temporary registry with updated token value for prediction
   */
  private createTempRegistry(tokenName: string, newValue: string): TokenRegistry {
    // Create a copy of all tokens
    const allTokens = this.tokenRegistry.getAll();
    
    // Update the specific token with new value
    const updatedTokens = allTokens.map(token => 
      token.name === tokenName 
        ? { ...token, value: newValue }
        : token
    );
    
    return new TokenRegistry(updatedTokens);
  }

  private calculateCascadePaths(tokenName: string): string[][] {
    const paths: string[][] = [];
    const visited = new Set<string>();

    const traverse = (token: string, path: string[]) => {
      if (visited.has(token) && path.length > 0) {
        paths.push([...path]);
        return;
      }

      if (path.length > 10) return; // Prevent infinite loops

      visited.add(token);
      const dependents = this.tokenRegistry.dependencyGraph.getDependents(token);

      if (dependents.length === 0) {
        if (path.length > 0) paths.push([...path]);
        return;
      }

      for (const dependent of dependents) {
        traverse(dependent, [...path, dependent]);
      }

      visited.delete(token);
    };

    traverse(tokenName, []);
    return paths;
  }

  private calculateTotalImpact(
    affectedTokens: Array<{
      tokenName: string;
      currentValue: string;
      predictedValue: string;
      confidence: number;
      ruleUsed?: string;
    }>
  ): number {
    // Calculate based on number of affected tokens and their confidence
    const count = affectedTokens.length;
    const avgConfidence = affectedTokens.reduce((sum, t) => sum + t.confidence, 0) / count;

    return Math.min(count * 0.5 + (1 - avgConfidence) * 2, 10);
  }

  private assessRisks(
    tokenName: string,
    _newValue: string,
    affectedTokens: Array<{
      tokenName: string;
      currentValue: string;
      predictedValue: string;
      confidence: number;
      ruleUsed?: string;
    }>
  ) {
    // Simplified risk assessment
    const breakingChanges = Math.min(affectedTokens.filter((t) => t.confidence < 0.5).length, 10);
    const visualImpact = Math.min(affectedTokens.length * 0.3, 10);
    const accessibilityImpact =
      tokenName.includes('contrast') || tokenName.includes('color')
        ? Math.min(affectedTokens.length * 0.5, 10)
        : 2;
    const semanticConsistency =
      (affectedTokens.filter((t) => t.ruleUsed).length / affectedTokens.length) * 10;

    return {
      breakingChanges,
      visualImpact,
      accessibilityImpact,
      semanticConsistency,
    };
  }

  private generateRecommendations(
    tokenName: string,
    _newValue: string,
    affectedTokens: Array<{
      tokenName: string;
      currentValue: string;
      predictedValue: string;
      confidence: number;
      ruleUsed?: string;
    }>
  ): string[] {
    const recommendations: string[] = [];

    const lowConfidenceTokens = affectedTokens.filter((t) => t.confidence < 0.5);
    if (lowConfidenceTokens.length > 0) {
      recommendations.push(
        `Review ${lowConfidenceTokens.length} tokens with uncertain predictions`
      );
    }

    const noRuleTokens = affectedTokens.filter((t) => !t.ruleUsed);
    if (noRuleTokens.length > 0) {
      recommendations.push(
        `Consider adding generation rules for ${noRuleTokens.length} manually managed tokens`
      );
    }

    if (affectedTokens.length > 20) {
      recommendations.push('This change affects many tokens - consider testing in isolation first');
    }

    if (tokenName.includes('primary') || tokenName.includes('base')) {
      recommendations.push('This appears to be a foundational token - verify brand consistency');
    }

    return recommendations;
  }

  private calculateCascadeConfidence(analysis: CascadeImpactAnalysis): number {
    const avgTokenConfidence =
      analysis.affectedTokens.reduce((sum, t) => sum + t.confidence, 0) /
      analysis.affectedTokens.length;

    let confidence = avgTokenConfidence;

    // Boost confidence if risks are low
    const avgRisk =
      (analysis.riskAssessment.breakingChanges +
        analysis.riskAssessment.visualImpact +
        analysis.riskAssessment.accessibilityImpact) /
      3;

    confidence -= Math.min(avgRisk * 0.05, 0.3);

    return Math.max(Math.min(confidence, 1), 0);
  }

  /**
   * Get cached result if still valid
   */
  private getCachedResult(key: string): unknown | null {
    const cached = this.performanceCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.value;
    }
    return null;
  }

  /**
   * Set cached result with timestamp
   */
  private setCachedResult(key: string, value: unknown): void {
    this.performanceCache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }
}
