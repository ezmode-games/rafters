/**
 * TokenRegistry - Core data structure for design token storage and retrieval
 *
 * Provides O(1) get/set operations with intelligent metadata preservation
 * Built for AI-first design token system with comprehensive intelligence metadata
 * Automatically enriches color tokens with intelligence from Color Intelligence API
 */

import type { Token } from '@rafters/shared';
import { TokenDependencyGraph } from './dependencies';
import { GenerationRuleExecutor, GenerationRuleParser } from './generation-rules';

// Event types (inline to replace deleted types/events.js)
export type TokenChangeEvent =
  | {
      type: 'add' | 'update' | 'delete' | 'token-changed';
      tokenName: string;
      oldValue?: string | unknown;
      newValue?: string | unknown;
      timestamp: number;
    }
  | {
      type: 'tokens-batch-changed';
      changes: Array<{
        type: 'add' | 'update' | 'delete' | 'token-changed';
        tokenName: string;
        oldValue?: string | unknown;
        newValue?: string | unknown;
        timestamp: number;
      }>;
      timestamp: number;
    }
  | {
      type: 'registry-initialized';
      tokenCount: number;
      timestamp: number;
    };

export type RegistryChangeCallback = (event: TokenChangeEvent) => void | Promise<void>;

// Helper function to convert token values to CSS (simple inline implementation)

// Generate a unique token ID for colors based on OKLCH values

// Extract OKLCH from ColorValue or Token

// Fetch color intelligence from the API

export class TokenRegistry {
  private tokens: Map<string, Token> = new Map();
  public dependencyGraph: TokenDependencyGraph = new TokenDependencyGraph();
  private ruleParser = new GenerationRuleParser();
  private ruleExecutor = new GenerationRuleExecutor(this);
  private changeCallback?: RegistryChangeCallback;

  constructor(initialTokens?: Token[]) {
    if (initialTokens) {
      // Process tokens synchronously; async enrichment is available via enrichColorToken and should be called after registry creation if needed
      for (const token of initialTokens) {
        this.addToken(token);
      }
    }
  }

  /**
   * Add a token to the registry, enriching color tokens with intelligence if needed
   */
  private addToken(token: Token): void {
    // For now, store as-is. Async enrichment will be added via enrichColorToken method
    this.tokens.set(token.name, token);
  }

  /**
   * Public method to add a token to the registry
   */
  add(token: Token): void {
    this.addToken(token);
  }

  /**
   * Remove a token from the registry and clean up all dependencies
   */
  remove(tokenName: string): boolean {
    // Remove from dependency graph first
    this.dependencyGraph.removeToken(tokenName);

    // Remove from token registry
    return this.tokens.delete(tokenName);
  }

  /**
   * Clear all tokens from the registry and dependency graph
   */
  clear(): void {
    this.tokens.clear();
    this.dependencyGraph.clear();
  }

  get(tokenName: string): Token | undefined {
    return this.tokens.get(tokenName);
  }

  /**
   * Set change callback for real-time notifications
   */
  setChangeCallback(callback: RegistryChangeCallback): void {
    this.changeCallback = callback;
  }

  /**
   * Update a single token and fire change event
   */
  updateToken(name: string, value: string): void {
    const oldValue = this.tokens.get(name)?.value;
    const existingToken = this.tokens.get(name);

    if (!existingToken) {
      throw new Error(`Token "${name}" does not exist. Cannot update non-existent token.`);
    }

    // Update the token
    const updatedToken: Token = {
      ...existingToken,
      value,
    };

    this.tokens.set(name, updatedToken);

    // Fire change callback
    if (this.changeCallback) {
      this.changeCallback({
        type: 'token-changed',
        tokenName: name,
        oldValue,
        newValue: value,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Update multiple tokens efficiently and fire batch change event
   */
  updateMultipleTokens(updates: Array<{ name: string; value: string }>): void {
    const changes: Array<{
      type: 'add' | 'update' | 'delete' | 'token-changed';
      tokenName: string;
      oldValue?: string | unknown;
      newValue?: string | unknown;
      timestamp: number;
    }> = [];

    for (const { name, value } of updates) {
      const oldValue = this.tokens.get(name)?.value;
      const existingToken = this.tokens.get(name);

      if (!existingToken) {
        throw new Error(`Token "${name}" does not exist. Cannot update non-existent token.`);
      }

      const updatedToken: Token = {
        ...existingToken,
        value,
      };

      this.tokens.set(name, updatedToken);

      changes.push({
        type: 'token-changed',
        tokenName: name,
        oldValue,
        newValue: value,
        timestamp: Date.now(),
      });
    }

    if (this.changeCallback) {
      this.changeCallback({
        type: 'tokens-batch-changed',
        changes,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Fire registry initialized event
   */
  initializeRegistry(tokenCount: number): void {
    if (this.changeCallback) {
      this.changeCallback({
        type: 'registry-initialized',
        tokenCount,
        timestamp: Date.now(),
      });
    }
  }

  async set(tokenName: string, value: string): Promise<void> {
    // Use updateToken for consistency and event firing
    this.updateToken(tokenName, value);

    // Regenerate all dependent tokens
    await this.regenerateDependents(tokenName);
  }

  has(tokenName: string): boolean {
    return this.tokens.has(tokenName);
  }

  list(filter?: { category?: string; namespace?: string }): Token[] {
    const allTokens = Array.from(this.tokens.values());

    if (!filter) {
      return allTokens;
    }

    return allTokens.filter((token) => {
      if (filter.category && token.category !== filter.category) {
        return false;
      }
      if (filter.namespace && token.namespace !== filter.namespace) {
        return false;
      }
      return true;
    });
  }

  size(): number {
    return this.tokens.size;
  }

  /**
   * Get all tokens that depend on the specified token
   */
  getDependents(tokenName: string): string[] {
    return this.dependencyGraph.getDependents(tokenName);
  }

  /**
   * Get all tokens this token depends on
   */
  getDependencies(tokenName: string): string[] {
    return this.dependencyGraph.getDependencies(tokenName);
  }

  /**
   * Add dependency relationship with generation rule
   */
  addDependency(tokenName: string, dependsOn: string[], rule: string): void {
    // Validate all tokens exist
    if (!this.tokens.has(tokenName)) {
      throw new Error(`Token ${tokenName} does not exist`);
    }

    for (const dep of dependsOn) {
      if (!this.tokens.has(dep)) {
        throw new Error(`Dependency token ${dep} does not exist`);
      }
    }

    this.dependencyGraph.addDependency(tokenName, dependsOn, rule);
  }

  /**
   * Get dependency information including generation rule
   */
  getDependencyInfo(tokenName: string): { dependsOn: string[]; rule?: string } | null {
    const dependsOn = this.getDependencies(tokenName);
    const rule = this.dependencyGraph.getGenerationRule(tokenName);

    if (dependsOn.length === 0 && !rule) {
      return null;
    }

    return {
      dependsOn,
      ...(rule ? { rule } : {}),
    };
  }

  /**
   * Regenerate all dependent tokens when a dependency changes.
   * Respects userOverride - tokens with human overrides are NOT regenerated,
   * but their computedValue IS updated so agents can see the difference.
   */
  private async regenerateDependents(changedTokenName: string): Promise<void> {
    // Get all tokens that depend on the changed token
    const dependents = this.dependencyGraph.getDependents(changedTokenName);

    if (dependents.length === 0) {
      return; // No dependents to update
    }

    // Sort in topological order to handle cascading dependencies
    const sortedDependents = this.dependencyGraph.topologicalSort();

    // Filter to only the dependents we need to update
    const dependentsToUpdate = sortedDependents.filter((tokenName) =>
      dependents.includes(tokenName),
    );

    for (const dependentName of dependentsToUpdate) {
      try {
        await this.regenerateToken(dependentName);
      } catch (error) {
        console.warn(`Failed to regenerate token ${dependentName}:`, error);
        // Continue with other tokens even if one fails
      }
    }
  }

  /**
   * Regenerate a single token using its generation rule.
   *
   * If the token has a userOverride:
   * - Updates computedValue (what the rule produces)
   * - Does NOT change value (respects human decision)
   * - Agent can see: "computed would be X, but human set Y because Z"
   *
   * If no override:
   * - Updates value directly
   */
  private async regenerateToken(tokenName: string): Promise<void> {
    // Get the generation rule for this token
    const rule = this.dependencyGraph.getGenerationRule(tokenName);
    if (!rule) {
      return; // No rule to execute
    }

    const existingToken = this.tokens.get(tokenName);
    if (!existingToken) {
      return;
    }

    try {
      // Parse and execute the rule
      const parsedRule = this.ruleParser.parse(rule);
      const newComputedValue = this.ruleExecutor.execute(parsedRule, tokenName);

      if (existingToken.userOverride) {
        // Token has human override - update computedValue but preserve value
        // Agent intelligence: can see what system would produce vs what human chose
        this.tokens.set(tokenName, {
          ...existingToken,
          computedValue: newComputedValue,
          // value stays as-is (the human's choice)
        });
      } else {
        // No override - update the actual value
        this.tokens.set(tokenName, {
          ...existingToken,
          value: newComputedValue,
          computedValue: newComputedValue,
        });
      }
    } catch (error) {
      throw new Error(`Failed to regenerate token ${tokenName}: ${error}`);
    }
  }

  /**
   * Add multiple dependencies efficiently using bulk operations
   */
  addDependencies(
    dependencies: Array<{ tokenName: string; dependsOn: string[]; rule: string }>,
  ): void {
    // Validate all tokens exist first
    for (const { tokenName, dependsOn } of dependencies) {
      if (!this.tokens.has(tokenName)) {
        throw new Error(`Token ${tokenName} does not exist`);
      }

      for (const dep of dependsOn) {
        if (!this.tokens.has(dep)) {
          throw new Error(`Dependency token ${dep} does not exist`);
        }
      }
    }

    // Use bulk operation for better performance
    this.dependencyGraph.addDependencies(dependencies);
  }

  /**
   * Get comprehensive metrics about the token system
   */
  getMetrics(): {
    totalTokens: number;
    totalDependencies: number;
    avgDependenciesPerToken: number;
    maxDependencies: number;
    isolated: string[];
  } {
    return this.dependencyGraph.getMetrics();
  }

  /**
   * Get all tokens in the registry
   */
  getAllTokens(): string[] {
    return Array.from(this.tokens.keys());
  }

  /**
   * Get all tokens from the dependency graph (includes both tokens and their dependencies)
   */
  getAllTokensFromGraph(): string[] {
    return this.dependencyGraph.getAllTokens();
  }

  /**
   * Validate the integrity of the token registry and dependency graph
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate dependency graph integrity
    const graphValidation = this.dependencyGraph.validate();
    errors.push(...graphValidation.errors);

    // Validate that all tokens in dependency graph exist in registry
    const graphTokens = this.dependencyGraph.getAllTokens();
    for (const tokenName of graphTokens) {
      if (!this.tokens.has(tokenName)) {
        errors.push(`Token ${tokenName} exists in dependency graph but not in registry`);
      }
    }

    // Validate that all token dependencies exist
    for (const tokenName of this.tokens.keys()) {
      const dependencies = this.dependencyGraph.getDependencies(tokenName);
      for (const dep of dependencies) {
        if (!this.tokens.has(dep)) {
          errors.push(`Token ${tokenName} depends on ${dep} which doesn't exist in registry`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get topological order of all tokens for regeneration
   */
  getTopologicalOrder(): string[] {
    return this.dependencyGraph.topologicalSort();
  }

  /**
   * Add dependency with automatic rule parsing and validation
   */
  addDependencyWithRuleParsing(
    tokenName: string,
    rule: string,
    explicitDependsOn: string[] = [],
  ): void {
    // Validate token exists
    if (!this.tokens.has(tokenName)) {
      throw new Error(`Token ${tokenName} does not exist`);
    }

    // Validate explicit dependencies exist
    for (const dep of explicitDependsOn) {
      if (!this.tokens.has(dep)) {
        throw new Error(`Dependency token ${dep} does not exist`);
      }
    }

    // Use dependency graph's rule parsing functionality
    this.dependencyGraph.addDependencyWithRuleParsing(tokenName, rule, explicitDependsOn);
  }

  /**
   * Update a token's generation rule
   */
  updateTokenRule(tokenName: string, newRule: string): void {
    // Validate token exists
    if (!this.tokens.has(tokenName)) {
      throw new Error(`Token ${tokenName} does not exist`);
    }

    // Use dependency graph's rule update functionality
    this.dependencyGraph.updateTokenRule(tokenName, newRule);
  }

  /**
   * Validate a generation rule syntax
   */
  validateRule(rule: string): { isValid: boolean; error?: string } {
    return this.dependencyGraph.validateRule(rule);
  }

  /**
   * Get all tokens with generation rules
   */
  getTokensWithRules(): Array<{ tokenName: string; rule: string; dependencies: string[] }> {
    return this.dependencyGraph.getTokensWithRules();
  }

  /**
   * Validate all generation rules in the token system
   */
  validateAllRules(): { isValid: boolean; errors: Array<{ tokenName: string; error: string }> } {
    return this.dependencyGraph.validateAllRules();
  }

  /**
   * Get statistics about rule types used in the system
   */
  getRuleTypeStats(): { [ruleType: string]: number } {
    return this.dependencyGraph.getRuleTypeStats();
  }

  /**
   * Find tokens that use a specific rule type
   */
  getTokensByRuleType(ruleType: string): string[] {
    return this.dependencyGraph.getTokensByRuleType(ruleType);
  }

  /**
   * Parse rule dependencies for analysis
   */
  parseRuleDependencies(rule: string): string[] {
    return this.dependencyGraph.parseRuleDependencies(rule);
  }

  /**
   * Enhanced validation that includes both registry and rule validation
   */
  validateComplete(): {
    isValid: boolean;
    errors: string[];
    ruleErrors: Array<{ tokenName: string; error: string }>;
  } {
    const registryValidation = this.validate();
    const ruleValidation = this.validateAllRules();

    return {
      isValid: registryValidation.isValid && ruleValidation.isValid,
      errors: registryValidation.errors,
      ruleErrors: ruleValidation.errors,
    };
  }
}
