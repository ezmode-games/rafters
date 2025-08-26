/**
 * TokenRegistry - Core data structure for design token storage and retrieval
 *
 * Provides O(1) get/set operations with intelligent metadata preservation
 * Built for AI-first design token system with comprehensive intelligence metadata
 */

import { TokenDependencyGraph } from './dependencies.js';
import type { Token } from './index.js';

export class TokenRegistry {
  private tokens: Map<string, Token> = new Map();
  public dependencyGraph: TokenDependencyGraph = new TokenDependencyGraph();

  constructor(initialTokens?: Token[]) {
    if (initialTokens) {
      for (const token of initialTokens) {
        this.tokens.set(token.name, token);
      }
    }
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

  list(): Token[] {
    return Array.from(this.tokens.values());
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
