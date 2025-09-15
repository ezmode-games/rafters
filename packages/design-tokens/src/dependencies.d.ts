/**
 * Token Dependency Tracking System for Smart Regeneration
 *
 * Implements intelligent dependency tracking that automatically identifies which tokens
 * depend on other tokens, enabling smart regeneration when base tokens change.
 */
export interface TokenDependency {
    dependsOn: string[];
    dependents: string[];
    generationRule: string;
}
export declare class TokenDependencyGraph {
    private dependencies;
    /**
     * Add dependency relationship with generation rule
     */
    addDependency(tokenName: string, dependsOn: string[], rule: string): void;
    /**
     * Get all tokens that depend on this token
     */
    getDependents(tokenName: string): string[];
    /**
     * Get all tokens this token depends on
     */
    getDependencies(tokenName: string): string[];
    /**
     * Get how this token is generated
     */
    getGenerationRule(tokenName: string): string | undefined;
    /**
     * Return tokens in dependency order for regeneration
     * Uses Kahn's algorithm for topological sorting
     */
    topologicalSort(): string[];
    /**
     * Check if adding dependencies would create a circular dependency
     */
    private wouldCreateCircularDependency;
}
//# sourceMappingURL=dependencies.d.ts.map