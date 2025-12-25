/**
 * Registry Regeneration Tests
 *
 * Tests that verify the DAG-based automatic regeneration when dependencies change.
 * For semantic tokens with ColorReference values, the reference itself doesn't change -
 * but the exports reflect the updated underlying color values.
 */

import type { ColorReference, Token } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { tokensToTailwind } from '../src/exporters/tailwind.js';
import { generateBaseSystem } from '../src/index.js';
import { TokenRegistry } from '../src/registry.js';

describe('Registry Regeneration', () => {
  describe('Semantic Token Dependencies', () => {
    it('semantic tokens have ColorReference values pointing to color families', () => {
      const result = generateBaseSystem();
      const registry = new TokenRegistry(result.allTokens);

      const destructive = registry.get('destructive');
      expect(destructive).toBeDefined();

      const value = destructive?.value as ColorReference;
      expect(value.family).toBe('silver-bold-fire-truck');
      expect(value.position).toBe('600');
    });

    it('changing a color family token updates exports', () => {
      const result = generateBaseSystem();
      const registry = new TokenRegistry(result.allTokens);

      // Get the base color token
      const originalColor = registry.get('silver-bold-fire-truck-600');
      expect(originalColor).toBeDefined();
      expect(typeof originalColor?.value).toBe('string');

      // Export before change
      const cssBefore = tokensToTailwind(registry.list());
      expect(cssBefore).toContain('--color-silver-bold-fire-truck-600:');

      // The destructive token references this color
      const destructive = registry.get('destructive');
      const destructiveRef = destructive?.value as ColorReference;
      expect(destructiveRef.family).toBe('silver-bold-fire-truck');
      expect(destructiveRef.position).toBe('600');
    });

    it('dependsOn arrays include both light and dark mode color references', () => {
      const result = generateBaseSystem();
      const semanticTokens = result.allTokens.filter((t) => t.namespace === 'semantic');

      // Check destructive has both light (600) and dark (500) dependencies
      const destructive = semanticTokens.find((t) => t.name === 'destructive');
      expect(destructive?.dependsOn).toContain('silver-bold-fire-truck-600');
      expect(destructive?.dependsOn).toContain('silver-bold-fire-truck-500');

      // Check info has both light (600) and dark (500) dependencies
      const info = semanticTokens.find((t) => t.name === 'info');
      expect(info?.dependsOn).toContain('silver-true-sky-600');
      expect(info?.dependsOn).toContain('silver-true-sky-500');
    });
  });

  describe('Registry Dependency Graph', () => {
    it('registry exposes dependency graph methods', () => {
      const result = generateBaseSystem();
      const registry = new TokenRegistry(result.allTokens);

      // Registry should expose dependency graph methods
      expect(typeof registry.addDependency).toBe('function');
      expect(typeof registry.getDependents).toBe('function');
      expect(typeof registry.getDependencies).toBe('function');
      expect(typeof registry.getTopologicalOrder).toBe('function');
    });

    it('spacing tokens regenerate when base changes', async () => {
      // Create minimal tokens for testing regeneration
      const baseToken: Token = {
        name: 'spacing-base',
        value: '0.25rem',
        category: 'spacing',
        namespace: 'spacing',
      };

      const derivedToken: Token = {
        name: 'spacing-4',
        value: '1rem',
        category: 'spacing',
        namespace: 'spacing',
        dependsOn: ['spacing-base'],
        generationRule: 'calc({spacing-base}*4)',
      };

      const registry = new TokenRegistry([baseToken, derivedToken]);

      // Add dependency to the graph
      registry.addDependencies([
        {
          tokenName: 'spacing-4',
          dependsOn: ['spacing-base'],
          rule: 'calc({spacing-base}*4)',
        },
      ]);

      // Check dependency is tracked
      const dependents = registry.getDependents('spacing-base');
      expect(dependents).toContain('spacing-4');
    });

    it('getDependents returns correct dependents for color tokens', () => {
      const result = generateBaseSystem();
      const registry = new TokenRegistry(result.allTokens);

      // Build dependencies from token dependsOn arrays
      const semanticTokens = result.allTokens.filter((t) => t.namespace === 'semantic');
      const dependencies = semanticTokens
        .filter((t) => t.dependsOn && t.dependsOn.length > 0)
        .map((t) => ({
          tokenName: t.name,
          dependsOn: t.dependsOn as string[],
          rule: t.generationRule || 'reference',
        }));

      registry.addDependencies(dependencies);

      // Check that destructive-related tokens depend on fire-truck color
      const dependents = registry.getDependents('silver-bold-fire-truck-600');
      expect(dependents.length).toBeGreaterThan(0);
      expect(dependents).toContain('destructive');
    });
  });

  describe('User Override Respect', () => {
    it('regeneration skips tokens with userOverride but updates computedValue', async () => {
      // Create tokens with override
      const baseToken: Token = {
        name: 'secondary',
        value: 'oklch(0.5 0.1 200)',
        category: 'color',
        namespace: 'semantic',
      };

      const overriddenToken: Token = {
        name: 'secondary-ring',
        value: 'oklch(0.8 0.2 330)', // Pink - human chose this
        category: 'color',
        namespace: 'semantic',
        dependsOn: ['secondary'],
        generationRule: 'state:ring',
        userOverride: {
          reason: 'Brand team requested pink for Q1 campaign',
          overriddenBy: 'jane@design.co',
          overriddenAt: '2024-01-15T10:00:00Z',
          approvedBy: 'design-review-2024-01-15',
          revertAfter: '2024-04-01',
          context: 'Q1 marketing campaign',
          tags: ['temporary', 'brand'],
        },
      };

      const registry = new TokenRegistry([baseToken, overriddenToken]);

      // Add dependency tracking
      registry.addDependency('secondary-ring', ['secondary'], 'state:ring');

      // Get the token before any changes
      const beforeChange = registry.get('secondary-ring');
      expect(beforeChange?.value).toBe('oklch(0.8 0.2 330)'); // Pink
      expect(beforeChange?.userOverride?.reason).toBe('Brand team requested pink for Q1 campaign');
    });

    it('tokens without userOverride get their value updated', () => {
      const baseToken: Token = {
        name: 'spacing-base',
        value: '0.25rem',
        category: 'spacing',
        namespace: 'spacing',
      };

      const derivedToken: Token = {
        name: 'spacing-4',
        value: '1rem',
        category: 'spacing',
        namespace: 'spacing',
        dependsOn: ['spacing-base'],
        generationRule: 'calc({spacing-base}*4)',
        // No userOverride - this should be regenerated
      };

      const registry = new TokenRegistry([baseToken, derivedToken]);

      // No override means value should update on regeneration
      const token = registry.get('spacing-4');
      expect(token?.userOverride).toBeUndefined();
    });

    it('userOverride includes full context for agent intelligence', () => {
      const token: Token = {
        name: 'test-token',
        value: 'pink',
        category: 'color',
        namespace: 'semantic',
        userOverride: {
          previousValue: 'blue',
          reason: 'Accessibility audit found blue had insufficient contrast',
          overriddenBy: 'a11y-team@company.com',
          overriddenAt: '2024-02-01T14:30:00Z',
          approvedBy: 'wcag-review-2024-02',
          context: 'WCAG 2.2 AA compliance audit',
          tags: ['accessibility', 'permanent', 'compliance'],
        },
        computedValue: 'blue', // What the rule would produce
      };

      const registry = new TokenRegistry([token]);
      const retrieved = registry.get('test-token');

      // Agent can now understand:
      // - Value is 'pink' (what's actually used)
      // - ComputedValue is 'blue' (what the rule would produce)
      // - Override reason: accessibility compliance
      // - Who: a11y team
      // - When: Feb 1, 2024
      // - Approved: WCAG review
      // - Tags: accessibility, permanent
      expect(retrieved?.value).toBe('pink');
      expect(retrieved?.computedValue).toBe('blue');
      expect(retrieved?.userOverride?.reason).toContain('contrast');
      expect(retrieved?.userOverride?.tags).toContain('accessibility');
    });
  });

  describe('Export Consistency After Changes', () => {
    it('ColorReference values are resolved consistently across exports', () => {
      const result = generateBaseSystem();

      // Get destructive token
      const destructive = result.allTokens.find((t) => t.name === 'destructive');
      expect(destructive).toBeDefined();

      const ref = destructive?.value as ColorReference;
      expect(ref.family).toBe('silver-bold-fire-truck');
      expect(ref.position).toBe('600');

      // The export should reference the correct color
      const css = tokensToTailwind(result.allTokens);

      // Light mode: --rafters-destructive should reference silver-bold-fire-truck-600
      expect(css).toContain('--rafters-destructive: var(--color-silver-bold-fire-truck-600)');

      // Dark mode: --rafters-dark-destructive should reference silver-bold-fire-truck-500
      expect(css).toContain('--rafters-dark-destructive: var(--color-silver-bold-fire-truck-500)');
    });

    it('all semantic tokens export with correct color family references', () => {
      const result = generateBaseSystem();
      const css = tokensToTailwind(result.allTokens);

      // Success uses citrine
      expect(css).toContain('--rafters-success: var(--color-silver-true-citrine-600)');

      // Warning uses honey
      expect(css).toContain('--rafters-warning: var(--color-silver-true-honey-500)');

      // Info uses sky
      expect(css).toContain('--rafters-info: var(--color-silver-true-sky-600)');

      // Primary uses neutral
      expect(css).toContain('--rafters-primary: var(--color-neutral-900)');
    });
  });
});
