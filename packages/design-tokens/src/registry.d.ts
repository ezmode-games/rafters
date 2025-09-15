/**
 * TokenRegistry - Core data structure for design token storage and retrieval
 *
 * Provides O(1) get/set operations with intelligent metadata preservation
 * Built for AI-first design token system with comprehensive intelligence metadata
 * Automatically enriches color tokens with intelligence from Color Intelligence API
 */
import type { Token } from '@rafters/shared';
import { TokenDependencyGraph } from './dependencies';
export declare class TokenRegistry {
    private tokens;
    dependencyGraph: TokenDependencyGraph;
    constructor(initialTokens?: Token[]);
    /**
     * Add a token to the registry, enriching color tokens with intelligence if needed
     */
    private addToken;
    /**
     * Enrich a color token with intelligence from the API
     * This is async and should be called after initial registry creation
     */
    enrichColorToken(tokenName: string): Promise<void>;
    /**
     * Enrich all color tokens in the registry
     * Should be called after initial loading to ensure all colors have intelligence
     */
    enrichAllColorTokens(): Promise<void>;
    get(tokenName: string): Token | undefined;
    set(tokenName: string, value: string): void;
    has(tokenName: string): boolean;
    list(): Token[];
    size(): number;
    /**
     * Get all tokens that depend on the specified token
     */
    getDependents(tokenName: string): string[];
    /**
     * Get all tokens this token depends on
     */
    getDependencies(tokenName: string): string[];
    /**
     * Add dependency relationship with generation rule
     */
    addDependency(tokenName: string, dependsOn: string[], rule: string): void;
    /**
     * Decompose a complex color token into flat tokens with dependencies
     * Studio sends rich color object, registry stores as simple tokens
     */
    decomposeColor(colorToken: Token): void;
    /**
     * Recompose flat tokens back into complex color structure
     * Registry reads simple tokens, Studio gets rich color object
     */
    recomposeColor(tokenName: string): Token | undefined;
}
//# sourceMappingURL=registry.d.ts.map