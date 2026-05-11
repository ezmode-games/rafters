/**
 * Token Dependency Tracking System for Smart Regeneration
 *
 * Implements intelligent dependency tracking that automatically identifies which tokens
 * depend on other tokens, enabling smart regeneration when base tokens change.
 * Includes integrated rule engine for automatic token value computation.
 */

import { GenerationRuleParser } from './generation-rules';

export interface TokenDependency {
  dependsOn: string[]; // Tokens this token depends on
  dependents: string[]; // Tokens that depend on this token
  generationRule: string; // How this token is generated from dependencies
}

export class TokenDependencyGraph {
  private dependencies: Map<string, TokenDependency> = new Map();
  private _sortCache: string[] | null = null;
  private ruleParser = new GenerationRuleParser();

  /**
   * Add dependency relationship with generation rule
   */
  addDependency(tokenName: string, dependsOn: string[], rule: string): void {
    // Clear sort cache since we're modifying the graph
    this._sortCache = null;

    // Deduplicate dependencies
    const uniqueDependsOn = [...new Set(dependsOn)];

    // Check for circular dependencies before adding
    if (this.wouldCreateCircularDependency(tokenName, uniqueDependsOn)) {
      throw new Error('Circular dependency detected');
    }

    // Get or create dependency entry for this token
    const existing = this.dependencies.get(tokenName) || {
      dependsOn: [],
      dependents: [],
      generationRule: rule,
    };

    // Store old dependencies for cleanup
    const oldDependsOn = [...existing.dependsOn];

    // Update the token's dependencies
    existing.dependsOn = [...uniqueDependsOn];
    existing.generationRule = rule;
    this.dependencies.set(tokenName, existing);

    // Update dependent relationships for all tokens this token depends on
    for (const depToken of uniqueDependsOn) {
      const depEntry = this.dependencies.get(depToken) || {
        dependsOn: [],
        dependents: [],
        generationRule: '',
      };

      // Add this token as a dependent if not already present
      if (!depEntry.dependents.includes(tokenName)) {
        depEntry.dependents.push(tokenName);
      }

      this.dependencies.set(depToken, depEntry);
    }

    // Remove this token from dependents of tokens it no longer depends on
    for (const oldDep of oldDependsOn) {
      if (!uniqueDependsOn.includes(oldDep)) {
        const depEntry = this.dependencies.get(oldDep);
        if (depEntry) {
          depEntry.dependents = depEntry.dependents.filter((dep) => dep !== tokenName);
        }
      }
    }
  }

  /**
   * Get all tokens that depend on this token
   */
  getDependents(tokenName: string): string[] {
    const entry = this.dependencies.get(tokenName);
    return entry ? [...entry.dependents] : [];
  }

  /**
   * Get all tokens this token depends on
   */
  getDependencies(tokenName: string): string[] {
    const entry = this.dependencies.get(tokenName);
    return entry ? [...entry.dependsOn] : [];
  }

  /**
   * Get how this token is generated
   */
  getGenerationRule(tokenName: string): string | undefined {
    const entry = this.dependencies.get(tokenName);
    return entry?.generationRule;
  }

  /**
   * Return tokens in dependency order for regeneration
   * Uses depth-first search for topological sorting with caching
   */
  topologicalSort(): string[] {
    // Return cached result if available
    if (this._sortCache !== null) {
      return [...this._sortCache];
    }

    const result: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    // Get all tokens in the dependency graph
    const allTokens = new Set<string>();
    for (const [token, dep] of this.dependencies.entries()) {
      allTokens.add(token);
      for (const t of dep.dependsOn) {
        allTokens.add(t);
      }
      for (const t of dep.dependents) {
        allTokens.add(t);
      }
    }

    // Depth-first search with cycle detection
    const visit = (token: string): void => {
      if (visiting.has(token)) {
        throw new Error('Circular dependency detected during topological sort');
      }
      if (visited.has(token)) {
        return;
      }

      visiting.add(token);

      // Visit all dependencies first
      const dependencies = this.getDependencies(token);
      for (const dep of dependencies) {
        visit(dep);
      }

      visiting.delete(token);
      visited.add(token);
      result.push(token);
    };

    // Visit all tokens
    for (const token of allTokens) {
      if (!visited.has(token)) {
        visit(token);
      }
    }

    // Cache the result
    this._sortCache = [...result];
    return result;
  }

  /**
   * Check if adding dependencies would create a circular dependency
   */
  private wouldCreateCircularDependency(tokenName: string, dependsOn: string[]): boolean {
    // Create a temporary graph with the new dependency
    const tempDependencies = new Map(this.dependencies);

    // Add the new dependency temporarily
    const existing = tempDependencies.get(tokenName) || {
      dependsOn: [],
      dependents: [],
      generationRule: '',
    };

    const newEntry = {
      ...existing,
      dependsOn: [...new Set(dependsOn)], // Deduplicate here too
    };
    tempDependencies.set(tokenName, newEntry);

    // Check for cycles using DFS
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const hasCycle = (token: string): boolean => {
      if (visiting.has(token)) {
        return true; // Found a back edge, cycle detected
      }
      if (visited.has(token)) {
        return false;
      }

      visiting.add(token);

      const deps = tempDependencies.get(token)?.dependsOn || [];
      for (const dep of deps) {
        if (hasCycle(dep)) {
          return true;
        }
      }

      visiting.delete(token);
      visited.add(token);
      return false;
    };

    // Check all tokens for cycles
    for (const token of tempDependencies.keys()) {
      visited.clear();
      visiting.clear();
      if (hasCycle(token)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if adding a batch of dependencies would create circular dependencies
   */
  private wouldCreateCircularDependencyBatch(
    dependencies: Array<{ tokenName: string; dependsOn: string[]; rule: string }>,
  ): boolean {
    // Create a temporary graph with all the new dependencies
    const tempDependencies = new Map(this.dependencies);

    // Add all new dependencies to the temporary graph
    for (const { tokenName, dependsOn } of dependencies) {
      const uniqueDependsOn = [...new Set(dependsOn)];
      const existing = tempDependencies.get(tokenName) || {
        dependsOn: [],
        dependents: [],
        generationRule: '',
      };

      tempDependencies.set(tokenName, {
        ...existing,
        dependsOn: uniqueDependsOn,
      });
    }

    // Check for cycles using DFS
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const hasCycle = (token: string): boolean => {
      if (visiting.has(token)) {
        return true; // Found a back edge, cycle detected
      }
      if (visited.has(token)) {
        return false;
      }

      visiting.add(token);

      const deps = tempDependencies.get(token)?.dependsOn || [];
      for (const dep of deps) {
        if (hasCycle(dep)) {
          return true;
        }
      }

      visiting.delete(token);
      visited.add(token);
      return false;
    };

    // Check all tokens for cycles
    for (const token of tempDependencies.keys()) {
      visited.clear();
      visiting.clear();
      if (hasCycle(token)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Remove a token and all its dependency relationships
   */
  removeToken(tokenName: string): void {
    this._sortCache = null;

    const entry = this.dependencies.get(tokenName);
    if (!entry) {
      return; // Token doesn't exist
    }

    // Remove this token from all its dependencies' dependents lists
    for (const depToken of entry.dependsOn) {
      const depEntry = this.dependencies.get(depToken);
      if (depEntry) {
        depEntry.dependents = depEntry.dependents.filter((dep) => dep !== tokenName);
      }
    }

    // Remove this token from all its dependents' dependencies lists
    for (const dependentToken of entry.dependents) {
      const dependentEntry = this.dependencies.get(dependentToken);
      if (dependentEntry) {
        dependentEntry.dependsOn = dependentEntry.dependsOn.filter((dep) => dep !== tokenName);
      }
    }

    // Remove the token itself
    this.dependencies.delete(tokenName);
  }

  /**
   * Get all tokens in the dependency graph
   */
  getAllTokens(): string[] {
    const allTokens = new Set<string>();
    for (const [token, dep] of this.dependencies.entries()) {
      allTokens.add(token);
      for (const t of dep.dependsOn) {
        allTokens.add(t);
      }
      for (const t of dep.dependents) {
        allTokens.add(t);
      }
    }
    return Array.from(allTokens);
  }

  /**
   * Get dependency graph size metrics
   */
  getMetrics(): {
    totalTokens: number;
    totalDependencies: number;
    avgDependenciesPerToken: number;
    maxDependencies: number;
    isolated: string[];
  } {
    const allTokens = this.getAllTokens();
    const totalTokens = allTokens.length;
    let totalDependencies = 0;
    let maxDependencies = 0;
    const isolated: string[] = [];

    for (const token of allTokens) {
      const deps = this.getDependencies(token);
      const dependents = this.getDependents(token);
      const tokenDeps = deps.length;

      totalDependencies += tokenDeps;
      maxDependencies = Math.max(maxDependencies, tokenDeps);

      // Token is isolated if it has no dependencies and no dependents
      if (deps.length === 0 && dependents.length === 0) {
        isolated.push(token);
      }
    }

    return {
      totalTokens,
      totalDependencies,
      avgDependenciesPerToken: totalTokens > 0 ? totalDependencies / totalTokens : 0,
      maxDependencies,
      isolated,
    };
  }

  /**
   * Clear all dependencies (for testing/reset purposes)
   */
  clear(): void {
    this._sortCache = null;
    this.dependencies.clear();
  }

  /**
   * Add multiple dependencies in bulk for better performance
   */
  addDependencies(
    dependencies: Array<{ tokenName: string; dependsOn: string[]; rule: string }>,
  ): void {
    this._sortCache = null;

    // Check for circular dependencies that would be created by the entire batch
    if (this.wouldCreateCircularDependencyBatch(dependencies)) {
      throw new Error('Circular dependency detected in bulk operation');
    }

    // Add all dependencies
    for (const { tokenName, dependsOn, rule } of dependencies) {
      // Use internal logic without the circular dependency check since we already checked
      const uniqueDependsOn = [...new Set(dependsOn)];

      const existing = this.dependencies.get(tokenName) || {
        dependsOn: [],
        dependents: [],
        generationRule: rule,
      };

      const oldDependsOn = [...existing.dependsOn];
      existing.dependsOn = [...uniqueDependsOn];
      existing.generationRule = rule;
      this.dependencies.set(tokenName, existing);

      // Update dependent relationships
      for (const depToken of uniqueDependsOn) {
        const depEntry = this.dependencies.get(depToken) || {
          dependsOn: [],
          dependents: [],
          generationRule: '',
        };

        if (!depEntry.dependents.includes(tokenName)) {
          depEntry.dependents.push(tokenName);
        }

        this.dependencies.set(depToken, depEntry);
      }

      // Clean up old dependencies
      for (const oldDep of oldDependsOn) {
        if (!uniqueDependsOn.includes(oldDep)) {
          const depEntry = this.dependencies.get(oldDep);
          if (depEntry) {
            depEntry.dependents = depEntry.dependents.filter((dep) => dep !== tokenName);
          }
        }
      }
    }
  }

  /**
   * Validate the integrity of the dependency graph
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for orphaned references
    for (const [tokenName, entry] of this.dependencies.entries()) {
      // Check if all dependencies exist in some form
      for (const dep of entry.dependsOn) {
        const depEntry = this.dependencies.get(dep);
        if (!depEntry || !depEntry.dependents.includes(tokenName)) {
          errors.push(
            `Token ${tokenName} depends on ${dep} but ${dep} doesn't list ${tokenName} as dependent`,
          );
        }
      }

      // Check if all dependents exist in some form
      for (const dependent of entry.dependents) {
        const dependentEntry = this.dependencies.get(dependent);
        if (!dependentEntry || !dependentEntry.dependsOn.includes(tokenName)) {
          errors.push(
            `Token ${tokenName} lists ${dependent} as dependent but ${dependent} doesn't depend on ${tokenName}`,
          );
        }
      }
    }

    // Check for cycles (this should never happen if our cycle detection works)
    try {
      this.topologicalSort();
    } catch (error) {
      errors.push(`Cycle detected in dependency graph: ${error}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate a generation rule syntax
   */
  validateRule(rule: string): { isValid: boolean; error?: string } {
    try {
      this.ruleParser.parse(rule);
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: String(error) };
    }
  }

  /**
   * Parse a generation rule to extract its dependencies
   */
  parseRuleDependencies(rule: string): string[] {
    try {
      const parsedRule = this.ruleParser.parse(rule);

      if (parsedRule.type === 'calc') {
        return parsedRule.tokens ?? [];
      }

      // For other rule types, we need to infer dependencies from context
      // These typically depend on a base token that will be determined when the rule is executed
      return [];
    } catch (error) {
      throw new Error(`Failed to parse rule dependencies: ${error}`);
    }
  }

  /**
   * Add dependency with automatic dependency extraction from generation rule
   */
  addDependencyWithRuleParsing(
    tokenName: string,
    rule: string,
    explicitDependsOn: string[] = [],
  ): void {
    // Validate the rule first
    const validation = this.validateRule(rule);
    if (!validation.isValid) {
      throw new Error(`Invalid generation rule: ${validation.error}`);
    }

    // Extract dependencies from the rule
    const ruleDependencies = this.parseRuleDependencies(rule);

    // Combine explicit dependencies with rule-extracted dependencies
    const allDependencies = [...new Set([...explicitDependsOn, ...ruleDependencies])];

    // Add the dependency using the existing method
    this.addDependency(tokenName, allDependencies, rule);
  }

  /**
   * Update a token's rule and automatically update its dependencies
   */
  updateTokenRule(tokenName: string, newRule: string): void {
    const existing = this.dependencies.get(tokenName);
    if (!existing) {
      throw new Error(`Token ${tokenName} does not exist in dependency graph`);
    }

    // Validate the new rule
    const validation = this.validateRule(newRule);
    if (!validation.isValid) {
      throw new Error(`Invalid generation rule: ${validation.error}`);
    }

    // Extract new dependencies from the rule
    const newRuleDependencies = this.parseRuleDependencies(newRule);

    // Update the dependency with the new rule and dependencies
    this.addDependency(tokenName, newRuleDependencies, newRule);
  }

  /**
   * Get all tokens with generation rules
   */
  getTokensWithRules(): Array<{ tokenName: string; rule: string; dependencies: string[] }> {
    const tokensWithRules: Array<{ tokenName: string; rule: string; dependencies: string[] }> = [];

    for (const [tokenName, dependency] of this.dependencies.entries()) {
      if (dependency.generationRule) {
        tokensWithRules.push({
          tokenName,
          rule: dependency.generationRule,
          dependencies: [...dependency.dependsOn],
        });
      }
    }

    return tokensWithRules;
  }

  /**
   * Validate all generation rules in the dependency graph
   */
  validateAllRules(): { isValid: boolean; errors: Array<{ tokenName: string; error: string }> } {
    const errors: Array<{ tokenName: string; error: string }> = [];

    for (const [tokenName, dependency] of this.dependencies.entries()) {
      if (dependency.generationRule) {
        const validation = this.validateRule(dependency.generationRule);
        if (!validation.isValid) {
          errors.push({
            tokenName,
            error: validation.error || 'Unknown rule validation error',
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get rule types used in the dependency graph
   */
  getRuleTypeStats(): { [ruleType: string]: number } {
    const ruleTypeStats: { [ruleType: string]: number } = {};

    for (const dependency of this.dependencies.values()) {
      if (dependency.generationRule) {
        try {
          const parsedRule = this.ruleParser.parse(dependency.generationRule);
          ruleTypeStats[parsedRule.type] = (ruleTypeStats[parsedRule.type] || 0) + 1;
        } catch {
          ruleTypeStats.invalid = (ruleTypeStats.invalid || 0) + 1;
        }
      }
    }

    return ruleTypeStats;
  }

  /**
   * Find tokens that use a specific rule type
   */
  getTokensByRuleType(ruleType: string): string[] {
    const tokens: string[] = [];

    for (const [tokenName, dependency] of this.dependencies.entries()) {
      if (dependency.generationRule) {
        try {
          const parsedRule = this.ruleParser.parse(dependency.generationRule);
          if (parsedRule.type === ruleType) {
            tokens.push(tokenName);
          }
        } catch {
          // Skip invalid rules
        }
      }
    }

    return tokens;
  }
}
