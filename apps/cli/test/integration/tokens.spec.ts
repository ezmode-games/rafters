/**
 * Integration tests for the 'rafters tokens' command
 *
 * Tests the complete token registry infrastructure that MCP depends on:
 * - Token file reading from .rafters/tokens/
 * - Registry integration and data access
 * - All command variants (get, list, color, validate)
 * - Error handling and validation
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('rafters tokens', () => {
  const testDir = '/tmp/rafters-tokens-test';

  function setupTestProject() {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    mkdirSync(testDir, { recursive: true });
    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({
        name: 'test-app',
        dependencies: { react: '^19.0.0' },
      })
    );
  }

  function runRaftersCommand(args: string[]) {
    const cliPath = join(process.cwd(), 'dist', 'index.js');
    return execSync(`node "${cliPath}" ${args.join(' ')}`, {
      cwd: testDir,
      env: { ...process.env, CI: 'true' },
      encoding: 'utf8',
      timeout: 30000,
    });
  }

  function runRaftersCommandSafe(args: string[]) {
    try {
      return {
        success: true,
        output: runRaftersCommand(args),
        error: null,
      };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'stdout' in error) {
        return {
          success: false,
          output: (error as { stdout?: string }).stdout || '',
          error: error as { status?: number; stderr?: string },
        };
      }
      throw error;
    }
  }

  describe('when project is uninitialized', () => {
    it('should fail gracefully with helpful error message', () => {
      setupTestProject();

      const result = runRaftersCommandSafe(['tokens', 'list']);
      expect(result.success).toBe(false);
      expect(result.error?.stderr || result.output).toContain('.rafters');
    });
  });

  describe('when project is initialized', () => {
    it('should list all tokens from registry', () => {
      setupTestProject();

      // Initialize the project first with --yes flag for non-interactive mode
      const initOutput = runRaftersCommand(['init', '--yes']);
      expect(initOutput).toContain('initialized');
      expect(existsSync(join(testDir, '.rafters'))).toBe(true);

      // List all tokens
      const output = runRaftersCommand(['tokens', 'list']);
      expect(output).toContain('Tokens:');
      expect(output).toContain('color');
    });

    it('should get specific token with full metadata', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const output = runRaftersCommand(['tokens', 'get', 'primary']);
      expect(output).toContain('Token: primary');
      expect(output).toContain('Category:');
      expect(output).toContain('Cognitive Load:');
      expect(output).toContain('Trust Level:');
    });

    it('should list tokens by category', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const output = runRaftersCommand(['tokens', 'list', 'color']);
      expect(output).toContain('Tokens in color');
      expect(output).toContain('primary');
    });

    it('should provide color intelligence for color tokens', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const output = runRaftersCommand(['tokens', 'color', 'primary']);
      expect(output).toContain('Color Intelligence: primary');
      expect(output).toContain('Use:');
      expect(output).toContain('Scale positions:');
    });

    it('should validate color combinations', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const output = runRaftersCommand(['tokens', 'validate', 'primary', 'secondary']);
      expect(output).toContain('Color Validation:');
      expect(output).toContain('Colors: primary, secondary');
      expect(output).toContain('Cognitive Load:');
      expect(output).toContain('Recommendation:');
    });

    it('should handle JSON output format', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const output = runRaftersCommand(['tokens', 'get', 'primary', '--json']);
      expect(output).toContain('{');
      expect(output).toContain('"name"');
      expect(output).toContain('"category"');

      // Verify it's valid JSON
      const jsonMatch = output.match(/\{[\s\S]*\}/);
      expect(jsonMatch).toBeTruthy();
      if (jsonMatch) {
        expect(() => JSON.parse(jsonMatch[0])).not.toThrow();
      }
    });
  });

  describe('token dependency system', () => {
    it('should expose token dependency relationships', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      // Test accessing the registry directly through import
      const { createTokenRegistry } = require('@rafters/design-tokens');
      const tokensDir = join(testDir, '.rafters', 'tokens');
      const registry = createTokenRegistry(tokensDir);

      // Test basic registry functionality
      expect(registry.size()).toBeGreaterThan(0);
      expect(registry.list().length).toBeGreaterThan(0);

      // Test dependency relationships exist
      expect(typeof registry.getDependents).toBe('function');
      expect(typeof registry.getDependencies).toBe('function');
      expect(typeof registry.addDependency).toBe('function');
    });

    it('should handle color token decomposition with dependencies', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const { createTokenRegistry } = require('@rafters/design-tokens');
      const tokensDir = join(testDir, '.rafters', 'tokens');
      const registry = createTokenRegistry(tokensDir);

      // Get a color token that should have scale/state relationships
      const primaryToken = registry.get('primary');
      expect(primaryToken).toBeTruthy();
      expect(primaryToken?.category).toBe('color');

      // Test dependency graph functionality
      expect(registry.dependencyGraph).toBeTruthy();
      expect(typeof registry.dependencyGraph.topologicalSort).toBe('function');
    });

    it('should prevent circular dependencies', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const { createTokenRegistry } = require('@rafters/design-tokens');
      const tokensDir = join(testDir, '.rafters', 'tokens');
      const registry = createTokenRegistry(tokensDir);

      // Test circular dependency prevention
      expect(() => {
        registry.addDependency('token-a', ['token-b'], 'test-rule');
        registry.addDependency('token-b', ['token-a'], 'test-rule');
      }).toThrow('Circular dependency detected');
    });

    it('should provide topological sorting for regeneration order', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const { createTokenRegistry } = require('@rafters/design-tokens');
      const tokensDir = join(testDir, '.rafters', 'tokens');
      const registry = createTokenRegistry(tokensDir);

      // Add test dependencies
      registry.addDependency('derived-token', ['base-token'], 'multiply:1.5');
      registry.addDependency('complex-token', ['derived-token'], 'darken:10');

      const sortedTokens = registry.dependencyGraph.topologicalSort();
      expect(Array.isArray(sortedTokens)).toBe(true);
      expect(sortedTokens.length).toBeGreaterThan(0);

      // Base token should come before derived token
      const baseIndex = sortedTokens.indexOf('base-token');
      const derivedIndex = sortedTokens.indexOf('derived-token');
      const complexIndex = sortedTokens.indexOf('complex-token');

      if (baseIndex !== -1 && derivedIndex !== -1) {
        expect(baseIndex).toBeLessThan(derivedIndex);
      }
      if (derivedIndex !== -1 && complexIndex !== -1) {
        expect(derivedIndex).toBeLessThan(complexIndex);
      }
    });

    it('should track generation rules for AI-driven token regeneration', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const { createTokenRegistry } = require('@rafters/design-tokens');
      const tokensDir = join(testDir, '.rafters', 'tokens');
      const registry = createTokenRegistry(tokensDir);

      // Test generation rule tracking
      const testRule = 'scale:500';
      registry.addDependency('primary-500', ['primary'], testRule);

      const rule = registry.dependencyGraph.getGenerationRule('primary-500');
      expect(rule).toBe(testRule);

      // Test dependents and dependencies
      const dependents = registry.getDependents('primary');
      const dependencies = registry.getDependencies('primary-500');

      expect(dependents).toContain('primary-500');
      expect(dependencies).toContain('primary');
    });
  });

  describe('error handling', () => {
    it('should handle missing token names gracefully', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const result = runRaftersCommandSafe(['tokens', 'get', 'nonexistent']);
      expect(result.success).toBe(false);
      expect(result.error?.stderr || result.output).toContain('not found');
    });

    it('should handle missing subcommand', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const result = runRaftersCommandSafe(['tokens']);
      expect(result.success).toBe(false);
      expect(result.error?.stderr || result.output).toContain('missing required argument');
    });

    it('should handle missing arguments', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const result = runRaftersCommandSafe(['tokens', 'get']);
      expect(result.success).toBe(false);
      expect(result.error?.stderr || result.output).toContain('required');
    });

    it('should handle invalid color token for color intelligence', () => {
      setupTestProject();
      runRaftersCommand(['init', '--yes']);

      const result = runRaftersCommandSafe(['tokens', 'color', 'nonexistent']);
      expect(result.success).toBe(false);
      expect(result.error?.stderr || result.output).toContain('not found');
    });
  });
});
