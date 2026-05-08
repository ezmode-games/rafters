/**
 * Token Dependency Graph.
 *
 * Stores forward edges only. `dependsOn` is truth; `dependents` is derived
 * on-read by inverting the forward edges. The previous shape stored both as
 * peers (rafters #1441 / #1242 / reflection 019e03a2 -- the original sin from
 * Sept 2025 commit c58c1f84) which let the inverse drift out of sync with the
 * forward edges and produced the audit-severity-5 cascade-one-hop bug.
 */

import { GenerationRuleParser } from './generation-rules';

export interface TokenDependency {
  /** Forward edge -- the parent tokens this token derives from. Truth. */
  dependsOn: string[];
  /** How the token is generated from its dependencies (plugin rule string). */
  generationRule: string;
}

export class TokenDependencyGraph {
  private dependencies: Map<string, TokenDependency> = new Map();
  private _sortCache: string[] | null = null;
  private ruleParser = new GenerationRuleParser();

  /**
   * Add a dependency relationship with a generation rule. Replaces any
   * previous edges for `tokenName`.
   */
  addDependency(tokenName: string, dependsOn: string[], rule: string): void {
    this._sortCache = null;

    const uniqueDependsOn = [...new Set(dependsOn)];

    if (this.wouldCreateCircularDependency(tokenName, uniqueDependsOn)) {
      throw new Error('Circular dependency detected');
    }

    this.dependencies.set(tokenName, {
      dependsOn: uniqueDependsOn,
      generationRule: rule,
    });

    // Ensure every dependency target has at least an empty entry so the graph
    // tracks it (even if the dep itself has no upstream).
    for (const depToken of uniqueDependsOn) {
      if (!this.dependencies.has(depToken)) {
        this.dependencies.set(depToken, { dependsOn: [], generationRule: '' });
      }
    }
  }

  /**
   * Direct (one-hop) dependents. Derived by scanning forward edges; not stored.
   * For transitive descendants (full cascade reach) call `getTransitiveDependents`.
   */
  getDependents(tokenName: string): string[] {
    const dependents: string[] = [];
    for (const [name, entry] of this.dependencies.entries()) {
      if (entry.dependsOn.includes(tokenName)) {
        dependents.push(name);
      }
    }
    return dependents;
  }

  /**
   * All transitive descendants of `tokenName` -- every token whose evaluation
   * depends, directly or indirectly, on `tokenName`. Walked via repeated
   * forward-edge inversion. Used by cascade so a single `set` propagates
   * through the entire downstream subgraph rather than stopping at depth 1.
   */
  getTransitiveDependents(tokenName: string): Set<string> {
    const reach = new Set<string>();
    const queue: string[] = [tokenName];
    while (queue.length > 0) {
      const cur = queue.shift();
      if (cur === undefined) break;
      for (const direct of this.getDependents(cur)) {
        if (!reach.has(direct)) {
          reach.add(direct);
          queue.push(direct);
        }
      }
    }
    return reach;
  }

  /**
   * Tokens this token depends on (direct upstream).
   */
  getDependencies(tokenName: string): string[] {
    const entry = this.dependencies.get(tokenName);
    return entry ? [...entry.dependsOn] : [];
  }

  /**
   * Generation rule string for `tokenName`, or undefined if none.
   */
  getGenerationRule(tokenName: string): string | undefined {
    const entry = this.dependencies.get(tokenName);
    if (!entry || !entry.generationRule) return undefined;
    return entry.generationRule;
  }

  /**
   * Topological sort over the entire graph. Dependencies come before dependents.
   */
  topologicalSort(): string[] {
    if (this._sortCache !== null) {
      return [...this._sortCache];
    }

    const result: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const allTokens = new Set<string>();
    for (const [token, dep] of this.dependencies.entries()) {
      allTokens.add(token);
      for (const t of dep.dependsOn) {
        allTokens.add(t);
      }
    }

    const visit = (token: string): void => {
      if (visiting.has(token)) {
        throw new Error('Circular dependency detected during topological sort');
      }
      if (visited.has(token)) {
        return;
      }

      visiting.add(token);

      for (const dep of this.getDependencies(token)) {
        visit(dep);
      }

      visiting.delete(token);
      visited.add(token);
      result.push(token);
    };

    for (const token of allTokens) {
      if (!visited.has(token)) {
        visit(token);
      }
    }

    this._sortCache = [...result];
    return result;
  }

  /**
   * Detects whether adding the proposed edges would introduce a cycle.
   */
  private wouldCreateCircularDependency(tokenName: string, dependsOn: string[]): boolean {
    const tempDependencies = new Map(this.dependencies);
    const existing = tempDependencies.get(tokenName) ?? { dependsOn: [], generationRule: '' };
    tempDependencies.set(tokenName, {
      ...existing,
      dependsOn: [...new Set(dependsOn)],
    });

    return this.detectCycle(tempDependencies);
  }

  private wouldCreateCircularDependencyBatch(
    dependencies: Array<{ tokenName: string; dependsOn: string[]; rule: string }>,
  ): boolean {
    const tempDependencies = new Map(this.dependencies);
    for (const { tokenName, dependsOn } of dependencies) {
      const existing = tempDependencies.get(tokenName) ?? { dependsOn: [], generationRule: '' };
      tempDependencies.set(tokenName, {
        ...existing,
        dependsOn: [...new Set(dependsOn)],
      });
    }
    return this.detectCycle(tempDependencies);
  }

  private detectCycle(graph: Map<string, TokenDependency>): boolean {
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const hasCycle = (token: string): boolean => {
      if (visiting.has(token)) return true;
      if (visited.has(token)) return false;

      visiting.add(token);
      const deps = graph.get(token)?.dependsOn ?? [];
      for (const dep of deps) {
        if (hasCycle(dep)) return true;
      }
      visiting.delete(token);
      visited.add(token);
      return false;
    };

    for (const token of graph.keys()) {
      visited.clear();
      visiting.clear();
      if (hasCycle(token)) return true;
    }
    return false;
  }

  /**
   * Remove a token. Forward edges from the token are dropped; tokens that
   * formerly depended on it now have a stale `dependsOn` reference, which
   * `validate()` will surface.
   */
  removeToken(tokenName: string): void {
    this._sortCache = null;
    if (!this.dependencies.has(tokenName)) {
      return;
    }
    this.dependencies.delete(tokenName);
  }

  /**
   * All tokens registered in the graph, including ones that appear only as
   * dependency targets.
   */
  getAllTokens(): string[] {
    const allTokens = new Set<string>();
    for (const [token, dep] of this.dependencies.entries()) {
      allTokens.add(token);
      for (const t of dep.dependsOn) {
        allTokens.add(t);
      }
    }
    return Array.from(allTokens);
  }

  /**
   * Graph size metrics for diagnostics.
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

      totalDependencies += deps.length;
      maxDependencies = Math.max(maxDependencies, deps.length);

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
   * Clear the entire graph (test/reset only).
   */
  clear(): void {
    this._sortCache = null;
    this.dependencies.clear();
  }

  /**
   * Add multiple dependencies in a single batch. Validates the entire batch
   * for cycles before applying any of them.
   */
  addDependencies(
    dependencies: Array<{ tokenName: string; dependsOn: string[]; rule: string }>,
  ): void {
    this._sortCache = null;

    if (this.wouldCreateCircularDependencyBatch(dependencies)) {
      throw new Error('Circular dependency detected in bulk operation');
    }

    for (const { tokenName, dependsOn, rule } of dependencies) {
      const uniqueDependsOn = [...new Set(dependsOn)];
      this.dependencies.set(tokenName, {
        dependsOn: uniqueDependsOn,
        generationRule: rule,
      });
      for (const depToken of uniqueDependsOn) {
        if (!this.dependencies.has(depToken)) {
          this.dependencies.set(depToken, { dependsOn: [], generationRule: '' });
        }
      }
    }
  }

  /**
   * Validate the graph: every token's `dependsOn` references resolve, no cycles.
   * Bidirectional consistency is structurally guaranteed once dependents are
   * derived (no separate field that can drift).
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [tokenName, entry] of this.dependencies.entries()) {
      for (const dep of entry.dependsOn) {
        if (!this.dependencies.has(dep)) {
          errors.push(`Token ${tokenName} depends on ${dep}, which is not in the graph`);
        }
      }
    }

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
   * Validate a generation rule string syntax.
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
   * Parse a generation rule and extract dependencies referenced in `calc()`.
   */
  parseRuleDependencies(rule: string): string[] {
    try {
      const parsedRule = this.ruleParser.parse(rule);

      if (parsedRule.type === 'calc') {
        return parsedRule.tokens ?? [];
      }

      return [];
    } catch (error) {
      throw new Error(`Failed to parse rule dependencies: ${error}`);
    }
  }

  /**
   * Add a dependency where the dependsOn list is partly inferred from the
   * rule expression.
   */
  addDependencyWithRuleParsing(
    tokenName: string,
    rule: string,
    explicitDependsOn: string[] = [],
  ): void {
    const validation = this.validateRule(rule);
    if (!validation.isValid) {
      throw new Error(`Invalid generation rule: ${validation.error}`);
    }

    const ruleDependencies = this.parseRuleDependencies(rule);
    const allDependencies = [...new Set([...explicitDependsOn, ...ruleDependencies])];
    this.addDependency(tokenName, allDependencies, rule);
  }

  /**
   * Update a token's rule, re-extracting any rule-implied dependencies.
   */
  updateTokenRule(tokenName: string, newRule: string): void {
    const existing = this.dependencies.get(tokenName);
    if (!existing) {
      throw new Error(`Token ${tokenName} does not exist in dependency graph`);
    }

    const validation = this.validateRule(newRule);
    if (!validation.isValid) {
      throw new Error(`Invalid generation rule: ${validation.error}`);
    }

    const newRuleDependencies = this.parseRuleDependencies(newRule);
    this.addDependency(tokenName, newRuleDependencies, newRule);
  }

  /**
   * All tokens that have a non-empty generation rule, with their dependencies.
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
   * Validate every rule in the graph.
   */
  validateAllRules(): { isValid: boolean; errors: Array<{ tokenName: string; error: string }> } {
    const errors: Array<{ tokenName: string; error: string }> = [];
    for (const [tokenName, dependency] of this.dependencies.entries()) {
      if (dependency.generationRule) {
        const validation = this.validateRule(dependency.generationRule);
        if (!validation.isValid) {
          errors.push({
            tokenName,
            error: validation.error ?? 'Unknown rule validation error',
          });
        }
      }
    }
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Counts of each rule type in the graph (for diagnostics).
   */
  getRuleTypeStats(): { [ruleType: string]: number } {
    const ruleTypeStats: { [ruleType: string]: number } = {};
    for (const dependency of this.dependencies.values()) {
      if (dependency.generationRule) {
        try {
          const parsedRule = this.ruleParser.parse(dependency.generationRule);
          ruleTypeStats[parsedRule.type] = (ruleTypeStats[parsedRule.type] ?? 0) + 1;
        } catch {
          ruleTypeStats.invalid = (ruleTypeStats.invalid ?? 0) + 1;
        }
      }
    }
    return ruleTypeStats;
  }

  /**
   * Names of tokens whose generation rule has the given type.
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
          // skip invalid rules
        }
      }
    }
    return tokens;
  }
}
