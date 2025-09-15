/**
 * Token Dependency Tracking System for Smart Regeneration
 *
 * Implements intelligent dependency tracking that automatically identifies which tokens
 * depend on other tokens, enabling smart regeneration when base tokens change.
 */
export class TokenDependencyGraph {
    dependencies = new Map();
    /**
     * Add dependency relationship with generation rule
     */
    addDependency(tokenName, dependsOn, rule) {
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
                    otherDep.dependents = otherDep.dependents.filter((dep) => dep !== tokenName);
                }
            }
        }
    }
    /**
     * Get all tokens that depend on this token
     */
    getDependents(tokenName) {
        const entry = this.dependencies.get(tokenName);
        return entry ? [...entry.dependents] : [];
    }
    /**
     * Get all tokens this token depends on
     */
    getDependencies(tokenName) {
        const entry = this.dependencies.get(tokenName);
        return entry ? [...entry.dependsOn] : [];
    }
    /**
     * Get how this token is generated
     */
    getGenerationRule(tokenName) {
        const entry = this.dependencies.get(tokenName);
        return entry?.generationRule;
    }
    /**
     * Return tokens in dependency order for regeneration
     * Uses Kahn's algorithm for topological sorting
     */
    topologicalSort() {
        const result = [];
        const visited = new Set();
        const visiting = new Set();
        // Get all tokens in the dependency graph
        const allTokens = new Set();
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
        const visit = (token) => {
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
    wouldCreateCircularDependency(tokenName, dependsOn) {
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
        const visited = new Set();
        const visiting = new Set();
        const hasCycle = (token) => {
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
//# sourceMappingURL=dependencies.js.map