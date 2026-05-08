/**
 * Bootstrap validation gate tests (#1442).
 *
 * Asserts the four install-time invariants:
 *   1. No name collision between generators
 *   2. Every dependsOn target resolves to a real token
 *   3. Every token with a rule produces a plugin-shape-valid input
 *   4. The graph is a DAG (no cycles)
 *
 * Plus the happy path on the real generateBaseSystem() output.
 */

import type { ColorReference, ColorValue, Token } from '@rafters/shared';
import { afterEach, describe, expect, it } from 'vitest';
import { bootstrap, throwOnInvalid } from '../src/bootstrap.js';
import { generateBaseSystem } from '../src/index.js';
import contrastPlugin from '../src/plugins/contrast.js';
import scalePlugin from '../src/plugins/scale.js';
import { clearPlugins, registerPlugin } from '../src/plugins.js';

function ensureBuiltinPlugins(): void {
  clearPlugins();
  registerPlugin(contrastPlugin as never);
  registerPlugin(scalePlugin as never);
}

function colorRef(family: string, position: string): ColorReference {
  return { family, position };
}

function makeColorValue(name: string, hue: number): ColorValue {
  return {
    name,
    scale: Array.from({ length: 11 }, (_, i) => ({
      l: 0.05 + i * 0.09,
      c: 0.1,
      h: hue,
      alpha: 1,
    })),
    tokenId: `${name}-id`,
    accessibility: {
      wcagAA: { normal: [[1, 8]], large: [] },
      wcagAAA: { normal: [[0, 9]], large: [] },
      onWhite: { wcagAA: false, wcagAAA: false, contrastRatio: 4.5, aa: [], aaa: [] },
      onBlack: { wcagAA: false, wcagAAA: false, contrastRatio: 4.5, aa: [], aaa: [] },
    },
  };
}

describe('bootstrap: install-time validation gate', () => {
  afterEach(() => {
    clearPlugins();
  });

  describe('name collision', () => {
    it('rejects two generators emitting the same token name', () => {
      ensureBuiltinPlugins();
      const a: Token = {
        name: 'primary',
        value: '#ff0000',
        category: 'color',
        namespace: 'color',
        userOverride: null,
      };
      const b: Token = {
        name: 'primary',
        value: colorRef('neutral', '900'),
        category: 'color',
        namespace: 'semantic',
        userOverride: null,
      };

      const result = bootstrap([
        { name: 'gen-a', tokens: [a] },
        { name: 'gen-b', tokens: [b] },
      ]);

      expect(result.isValid).toBe(false);
      if (result.isValid) return;
      const collisions = result.errors.filter((e) => e.code === 'collision');
      expect(collisions).toHaveLength(1);
      const [collision] = collisions;
      if (!collision || collision.code !== 'collision') {
        throw new Error('expected collision error');
      }
      expect(collision.tokenName).toBe('primary');
      expect(collision.generators).toEqual(['gen-a', 'gen-b']);
    });

    it('does not flag distinct token names', () => {
      ensureBuiltinPlugins();
      const t1: Token = {
        name: 'primary',
        value: '#ff0000',
        category: 'color',
        namespace: 'color',
        userOverride: null,
      };
      const t2: Token = {
        name: 'secondary',
        value: '#00ff00',
        category: 'color',
        namespace: 'color',
        userOverride: null,
      };
      const result = bootstrap([{ name: 'gen', tokens: [t1, t2] }]);
      expect(result.isValid).toBe(true);
    });
  });

  describe('unresolved dependsOn', () => {
    it('rejects a token referencing a non-existent dependency', () => {
      ensureBuiltinPlugins();
      const t: Token = {
        name: 'derived',
        value: '#aabbcc',
        category: 'color',
        namespace: 'color',
        dependsOn: ['nonexistent'],
        userOverride: null,
      };
      const result = bootstrap([{ name: 'gen', tokens: [t] }]);

      expect(result.isValid).toBe(false);
      if (result.isValid) return;
      const unresolved = result.errors.filter((e) => e.code === 'unresolved-dependsOn');
      expect(unresolved).toHaveLength(1);
      const [err] = unresolved;
      if (!err || err.code !== 'unresolved-dependsOn') throw new Error('expected unresolved');
      expect(err.tokenName).toBe('derived');
      expect(err.missingDependency).toBe('nonexistent');
      expect(err.sourceGenerator).toBe('gen');
    });
  });

  describe('cycle detection', () => {
    it('rejects a two-node cycle', () => {
      ensureBuiltinPlugins();
      const a: Token = {
        name: 'a',
        value: '1',
        category: 'spacing',
        namespace: 'spacing',
        dependsOn: ['b'],
        userOverride: null,
      };
      const b: Token = {
        name: 'b',
        value: '2',
        category: 'spacing',
        namespace: 'spacing',
        dependsOn: ['a'],
        userOverride: null,
      };
      const result = bootstrap([{ name: 'gen', tokens: [a, b] }]);
      expect(result.isValid).toBe(false);
      if (result.isValid) return;
      expect(result.errors.some((e) => e.code === 'cycle')).toBe(true);
    });
  });

  describe('shape contract', () => {
    it('rejects a contrast:auto rule whose dependsOn[0] is a ColorReference, not ColorValue', () => {
      ensureBuiltinPlugins();
      const family: Token = {
        name: 'broken-family',
        value: colorRef('neutral', '900'),
        category: 'color',
        namespace: 'semantic',
        userOverride: null,
      };
      const fg: Token = {
        name: 'broken-foreground',
        value: colorRef('neutral', '50'),
        category: 'color',
        namespace: 'semantic',
        dependsOn: ['broken-family'],
        generationRule: 'contrast:auto',
        userOverride: null,
      };
      const result = bootstrap([{ name: 'gen', tokens: [family, fg] }]);

      expect(result.isValid).toBe(false);
      if (result.isValid) return;
      const shape = result.errors.find((e) => e.code === 'shape-mismatch');
      expect(shape).toBeDefined();
      if (!shape || shape.code !== 'shape-mismatch') throw new Error('expected shape-mismatch');
      expect(shape.tokenName).toBe('broken-foreground');
      expect(shape.pluginId).toBe('contrast');
      expect(shape.ruleString).toBe('contrast:auto');
      expect(shape.zodIssues.length).toBeGreaterThan(0);
    });

    it('passes a contrast:auto rule whose dependsOn[0] is a real ColorValue', () => {
      ensureBuiltinPlugins();
      const family: Token = {
        name: 'good-family',
        value: makeColorValue('good-family', 240),
        category: 'color',
        namespace: 'color',
        userOverride: null,
      };
      const fg: Token = {
        name: 'good-foreground',
        value: colorRef('good-family', '50'),
        category: 'color',
        namespace: 'semantic',
        dependsOn: ['good-family'],
        generationRule: 'contrast:auto',
        userOverride: null,
      };
      const result = bootstrap([{ name: 'gen', tokens: [family, fg] }]);

      const shape = result.isValid ? null : result.errors.find((e) => e.code === 'shape-mismatch');
      expect(shape, JSON.stringify(shape, null, 2)).toBeFalsy();
    });
  });

  describe('happy path', () => {
    it('the real generateBaseSystem() output reveals preexisting graph issues', () => {
      ensureBuiltinPlugins();
      const { allTokens } = generateBaseSystem();
      const result = bootstrap([{ name: 'base-system', tokens: allTokens }]);

      // Document the bugs the validation gate caught on its first run so they
      // become a punch-list, not silent runtime confusion. Each is filed as a
      // separate follow-up to fix; this test stops drift while they are open.
      if (!result.isValid) {
        const collisions = result.errors
          .filter((e) => e.code === 'collision')
          .map((e) => (e.code === 'collision' ? e.tokenName : ''));
        const unresolved = result.errors
          .filter((e) => e.code === 'unresolved-dependsOn')
          .map((e) =>
            e.code === 'unresolved-dependsOn' ? `${e.tokenName} -> ${e.missingDependency}` : '',
          );
        const shapes = result.errors.filter((e) => e.code === 'shape-mismatch');
        const cycles = result.errors.filter((e) => e.code === 'cycle');

        // eslint-disable-next-line no-console
        console.log('[bootstrap-validation] preexisting issues caught at install:', {
          collisions,
          unresolved,
          shapeCount: shapes.length,
          cycleCount: cycles.length,
        });

        // The known set as of the introduction of this gate (#1442). Adjust as
        // each follow-up lands. New regressions outside this set fail the test.
        const KNOWN_COLLISIONS = new Set(['font-size-base']);
        const KNOWN_UNRESOLVED = new Set(['shortcut -> letter-spacing-widest']);

        const unknownCollisions = collisions.filter((c) => !KNOWN_COLLISIONS.has(c));
        const unknownUnresolved = unresolved.filter((u) => !KNOWN_UNRESOLVED.has(u));

        expect(
          unknownCollisions,
          `unexpected collisions beyond the known punch list: ${unknownCollisions.join(', ')}`,
        ).toEqual([]);
        expect(
          unknownUnresolved,
          `unexpected unresolved dependsOn beyond the known punch list: ${unknownUnresolved.join(', ')}`,
        ).toEqual([]);
        expect(shapes, 'shape-mismatch errors are unexpected and should be zero').toEqual([]);
        expect(cycles, 'cycle errors are unexpected and should be zero').toEqual([]);
        return;
      }
      expect(result.tokens.length).toBeGreaterThan(0);
    });
  });

  describe('throwOnInvalid', () => {
    it('throws structured Error when validation fails', () => {
      ensureBuiltinPlugins();
      const t: Token = {
        name: 'derived',
        value: '#aabbcc',
        category: 'color',
        namespace: 'color',
        dependsOn: ['nonexistent'],
        userOverride: null,
      };
      const result = bootstrap([{ name: 'gen', tokens: [t] }]);

      expect(result.isValid).toBe(false);
      expect(() => throwOnInvalid(result)).toThrow(/bootstrap: .*failed validation/);
      try {
        throwOnInvalid(result);
      } catch (e) {
        const cause = (e as Error & { cause: unknown }).cause as {
          code: string;
          errors: unknown[];
        };
        expect(cause.code).toBe('bootstrap-invalid');
        expect(Array.isArray(cause.errors)).toBe(true);
        expect(cause.errors.length).toBeGreaterThan(0);
      }
    });

    it('is a no-op when validation succeeds', () => {
      ensureBuiltinPlugins();
      const t: Token = {
        name: 'simple',
        value: '#aabbcc',
        category: 'color',
        namespace: 'color',
        userOverride: null,
      };
      const result = bootstrap([{ name: 'gen', tokens: [t] }]);
      expect(() => throwOnInvalid(result)).not.toThrow();
    });
  });
});
