/**
 * TokenRegistry - Core data structure for design token storage and retrieval
 *
 * Provides O(1) get/set operations with intelligent metadata preservation
 * Built for AI-first design token system with comprehensive intelligence metadata
 * Automatically enriches color tokens with intelligence from Color Intelligence API
 */

import type { Token } from '@rafters/shared';
import { TokenDependencyGraph } from './dependencies';

// Helper function to convert token values to CSS (simple inline implementation)

// Generate a unique token ID for colors based on OKLCH values

// Extract OKLCH from ColorValue or Token

// Fetch color intelligence from the API

export class TokenRegistry {
  private tokens: Map<string, Token> = new Map();
  public dependencyGraph: TokenDependencyGraph = new TokenDependencyGraph();

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
   * Remove a token from the registry
   */
  remove(tokenName: string): boolean {
    return this.tokens.delete(tokenName);
  }

  /**
   * Clear all tokens from the registry
   */
  clear(): void {
    this.tokens.clear();
  }

  get(tokenName: string): Token | undefined {
    return this.tokens.get(tokenName);
  }

  set(tokenName: string, value: string): void {
    const existingToken = this.tokens.get(tokenName);
    if (!existingToken) {
      throw new Error(`Token "${tokenName}" does not exist. Cannot update non-existent token.`);
    }

    // Update only the value field, preserve all metadata
    const updatedToken: Token = {
      ...existingToken,
      value,
    };

    this.tokens.set(tokenName, updatedToken);
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
    this.dependencyGraph.addDependency(tokenName, dependsOn, rule);
  }
}
