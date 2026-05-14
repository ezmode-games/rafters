import type { ColorValue, Token } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  CircularDependencyError,
  contrastPlugin,
  invertPlugin,
  scalePlugin,
  statePlugin,
  TokenRegistry,
} from '../src/index.js';

const minimalScale = [
  { l: 0.97, c: 0.02, h: 240 },
  { l: 0.93, c: 0.05, h: 240 },
  { l: 0.85, c: 0.1, h: 240 },
  { l: 0.75, c: 0.14, h: 240 },
  { l: 0.65, c: 0.16, h: 240 },
  { l: 0.55, c: 0.18, h: 240 },
  { l: 0.45, c: 0.18, h: 240 },
  { l: 0.35, c: 0.16, h: 240 },
  { l: 0.25, c: 0.14, h: 240 },
  { l: 0.18, c: 0.1, h: 240 },
  { l: 0.12, c: 0.07, h: 240 },
];

function buildAccentFamily(name = 'accent'): ColorValue {
  return {
    name,
    scale: minimalScale,
    accessibility: {
      wcagAAA: {
        normal: [
          [0, 8],
          [1, 9],
          [2, 9],
          [3, 9],
          [4, 9],
          [5, 0],
          [5, 9],
          [6, 0],
          [7, 0],
          [8, 0],
          [9, 0],
        ],
        large: [],
      },
      wcagAA: { normal: [], large: [] },
    },
  };
}

function buildAccentToken(value: ColorValue): Token {
  return {
    name: 'accent',
    namespace: 'color',
    category: 'color',
    value,
    userOverride: null,
  };
}

function semanticToken(name: string): Token {
  return { name, namespace: 'semantic', category: 'color', value: '', userOverride: null };
}

function familyTokenSlot(name: string): Token {
  return { name, namespace: 'color', category: 'color', value: '', userOverride: null };
}

function setupSemanticChain(): TokenRegistry {
  const r = new TokenRegistry(
    [
      buildAccentToken(buildAccentFamily()),
      semanticToken('primary'),
      semanticToken('primary-foreground'),
      semanticToken('primary-hover'),
      semanticToken('primary-active'),
      semanticToken('primary-dark'),
    ],
    [scalePlugin, contrastPlugin, statePlugin, invertPlugin],
  );
  // accent family → semantic primary (position 5) → primary-foreground, primary-hover, primary-hover-foreground
  // and dark counterparts via invert
  r.bind('primary', 'scale', { familyName: 'accent', scalePosition: 5 });
  r.bind('primary-foreground', 'contrast', { familyName: 'accent', basePosition: 5 });
  r.bind('primary-hover', 'state', { familyName: 'accent', basePosition: 5, stateType: 'hover' });
  r.bind('primary-active', 'state', { familyName: 'accent', basePosition: 5, stateType: 'active' });
  r.bind('primary-dark', 'invert', { familyName: 'accent', basePosition: 5 });
  return r;
}

describe('cascade integration', () => {
  describe('family remap propagates through the full semantic chain', () => {
    it('all derived tokens recompute when family is replaced', () => {
      const r = setupSemanticChain();

      const initial = {
        primary: r.get('primary')?.value,
        primaryFg: r.get('primary-foreground')?.value,
        primaryHover: r.get('primary-hover')?.value,
        primaryActive: r.get('primary-active')?.value,
        primaryDark: r.get('primary-dark')?.value,
      };
      expect(initial.primary).toEqual({ family: 'accent', position: '500' });
      expect(initial.primaryHover).toEqual({ family: 'accent', position: '600' });
      expect(initial.primaryActive).toEqual({ family: 'accent', position: '700' });

      const remapped = buildAccentFamily('remapped');
      r.set('accent', remapped);

      expect(r.get('accent')?.value).toEqual(remapped);
      expect(r.get('primary')?.value).toEqual({ family: 'accent', position: '500' });
      expect(r.get('primary-hover')?.value).toEqual({ family: 'accent', position: '600' });
      expect(r.get('primary-active')?.value).toEqual({ family: 'accent', position: '700' });
      expect(r.get('primary-foreground')?.value).toBeDefined();
      expect(r.get('primary-dark')?.value).toBeDefined();
    });
  });

  describe('userOverride anchors hold under upstream change', () => {
    it('anchored hover keeps its value when family changes', () => {
      const r = setupSemanticChain();
      const manualHover = { family: 'override', position: 'manual' };
      r.set('primary-hover', manualHover, {
        cascade: false,
        reason: 'designer chose specific tone',
      });

      expect(r.get('primary-hover')?.value).toEqual(manualHover);
      expect(r.get('primary-hover')?.userOverride?.reason).toBe('designer chose specific tone');

      r.set('accent', buildAccentFamily('changed'));
      expect(r.get('primary-hover')?.value).toEqual(manualHover);
    });

    it('downstream of an anchor still flows from the anchor value (chained binding)', () => {
      const r = new TokenRegistry(
        [
          buildAccentToken(buildAccentFamily()),
          semanticToken('primary'),
          semanticToken('primary-fg'),
        ],
        [scalePlugin, contrastPlugin],
      );
      r.bind('primary', 'scale', { familyName: 'accent', scalePosition: 5 });
      r.bind('primary-fg', 'contrast', { familyName: 'accent', basePosition: 5 });

      const downstreamBefore = r.get('primary-fg')?.value;
      r.set(
        'primary',
        { family: 'override', position: 'manual' },
        { cascade: false, reason: 'manual' },
      );
      expect(r.get('primary')?.userOverride?.reason).toBe('manual');
      const downstreamAfter = r.get('primary-fg')?.value;
      expect(downstreamAfter).toEqual(downstreamBefore);
    });
  });

  describe('cycle detection at bind time', () => {
    it('rejects a binding that creates a direct cycle', () => {
      const r = new TokenRegistry([familyTokenSlot('a'), familyTokenSlot('b')], [scalePlugin]);
      const family = buildAccentFamily();
      r.set('a', family);
      r.set('b', family);
      r.bind('a', 'scale', { familyName: 'b', scalePosition: 5 });
      expect(() => r.bind('b', 'scale', { familyName: 'a', scalePosition: 5 })).toThrow(
        CircularDependencyError,
      );
    });

    it('rejects a binding that creates a transitive cycle', () => {
      const r = new TokenRegistry(
        [familyTokenSlot('a'), familyTokenSlot('b'), familyTokenSlot('c')],
        [scalePlugin],
      );
      const family = buildAccentFamily();
      r.set('a', family);
      r.set('b', family);
      r.set('c', family);
      r.bind('b', 'scale', { familyName: 'a', scalePosition: 5 });
      r.bind('c', 'scale', { familyName: 'b', scalePosition: 5 });
      expect(() => r.bind('a', 'scale', { familyName: 'c', scalePosition: 5 })).toThrow(
        CircularDependencyError,
      );
    });
  });

  describe('topological ordering during cascade', () => {
    it('recomputes upstream nodes before downstream when both are dependents', () => {
      const r = new TokenRegistry(
        [
          buildAccentToken(buildAccentFamily()),
          semanticToken('primary'),
          semanticToken('primary-hover'),
        ],
        [scalePlugin, statePlugin],
      );
      r.bind('primary', 'scale', { familyName: 'accent', scalePosition: 5 });
      // primary-hover depends on accent (basePosition + offset → '600' position)
      r.bind('primary-hover', 'state', {
        familyName: 'accent',
        basePosition: 5,
        stateType: 'hover',
      });
      r.set('accent', buildAccentFamily('mutated'));
      expect(r.get('primary')?.value).toEqual({ family: 'accent', position: '500' });
      expect(r.get('primary-hover')?.value).toEqual({ family: 'accent', position: '600' });
    });
  });

  describe('undo after cascade', () => {
    it('restores all dependents when undoing a family change', () => {
      const r = setupSemanticChain();
      const before = {
        accent: r.get('accent')?.value,
        primary: r.get('primary')?.value,
        primaryHover: r.get('primary-hover')?.value,
      };
      r.set('accent', buildAccentFamily('different'));
      r.undo();
      expect(r.get('accent')?.value).toEqual(before.accent);
      expect(r.get('primary')?.value).toEqual(before.primary);
      expect(r.get('primary-hover')?.value).toEqual(before.primaryHover);
    });
  });
});
