/**
 * Token Dependency Tracking System for Smart Regeneration
 *
 * Implements intelligent dependency tracking that automatically identifies which tokens
 * depend on other tokens, enabling smart regeneration when base tokens change.
 */

export interface TokenDependency {
  dependsOn: string[];        // Tokens this token depends on
  dependents: string[];       // Tokens that depend on this token
  generationRule: string;     // How this token is generated from dependencies
}

export class TokenDependencyGraph {
  private dependencies: Map<string, TokenDependency> = new Map();
  
  /**
   * Add dependency relationship with generation rule
   */
  addDependency(tokenName: string, dependsOn: string[], rule: string): void {
    // Check for circular dependencies before adding
    if (this.wouldCreateCircularDependency(tokenName, dependsOn)) {
      throw new Error('Circular dependency detected');
    }

    // Get or create dependency entry for this token
    const existing = this.dependencies.get(tokenName) || {
      dependsOn: [],
      dependents: [],
      generationRule: rule,
    };

    // Update the token's dependencies
    existing.dependsOn = [...dependsOn];
    existing.generationRule = rule;
    this.dependencies.set(tokenName, existing);

    // Update dependent relationships for all tokens this token depends on
    for (const depToken of dependsOn) {
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
    for (const [otherToken, otherDep] of this.dependencies.entries()) {
      if (otherToken !== tokenName && otherDep.dependents.includes(tokenName)) {
        if (!dependsOn.includes(otherToken)) {
          otherDep.dependents = otherDep.dependents.filter(dep => dep !== tokenName);
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
   * Uses Kahn's algorithm for topological sorting
   */
  topologicalSort(): string[] {
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
      dependsOn: [...dependsOn],
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
}