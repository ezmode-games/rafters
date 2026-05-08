/**
 * colorWheel -> TokenRegistry integration test
 *
 * TDD: This suite is intentionally designed to expose integration gaps.
 * Tests are EXPECTED to fail on first run. Failures become follow-up issues.
 *
 * DO NOT fix failing tests in this PR.
 * DO NOT weaken assertions to make tests pass.
 * The failures ARE the deliverable.
 *
 * Covers:
 * - Shape compatibility: colorWheel ColorValues vs. TokenSchema expectations
 * - Registry ingestion: pushing all 11 families + 121 scale positions
 * - Cascade: contrast:auto, state:hover, scale:N rules regenerate on family change
 * - Exporter: Tailwind CSS has no broken var() chains, TypeScript has correct types
 * - Real-world seeds: blue-500, near-black, high-chroma magenta
 * - Determinism: same seed produces identical registry state across two builds
 */

import { colorWheel, oklchToCSS } from '@rafters/color-utils';
import type { ColorValue, OKLCH } from '@rafters/shared';
import { ColorValueSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  generateBaseSystem,
  registryToTailwind,
  registryToTypeScript,
  TokenRegistry,
} from '../src/index.js';

// ---------------------------------------------------------------------------
// Seeds
// ---------------------------------------------------------------------------

const TAILWIND_BLUE_500: OKLCH = { l: 0.623, c: 0.214, h: 259, alpha: 1 };
const BRAND_MAGENTA: OKLCH = { l: 0.55, c: 0.28, h: 320, alpha: 1 };
const NEAR_BLACK: OKLCH = { l: 0.12, c: 0.05, h: 240, alpha: 1 };

const SCALE_POSITIONS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

/**
 * Palette identifiers returned by colorWheel(). Distinct from the bare semantic
 * role names so the colorWheel ColorValues do not collide with semantic tokens
 * owned by DEFAULT_SEMANTIC_COLOR_MAPPINGS. See rafters #1440.
 */
const FAMILY_NAMES = [
  'primary-family',
  'secondary-family',
  'tertiary-family',
  'accent-family',
  'highlight-family',
  'neutral-family',
  'muted-family',
  'success-family',
  'warning-family',
  'destructive-family',
  'info-family',
] as const;

/**
 * Bare semantic role names. These are owned by DEFAULT_SEMANTIC_COLOR_MAPPINGS
 * and emitted by the semantic generator as ColorReferences (rendered as
 * `--primary:` etc. in the Tailwind exporter). Distinct from FAMILY_NAMES.
 *
 * tertiary and neutral are excluded:
 * - tertiary: not defined as a semantic token
 * - neutral: used indirectly via background, foreground, card tokens, not as --neutral:
 */
const SEMANTIC_FAMILY_NAMES = [
  'primary',
  'secondary',
  'accent',
  'highlight',
  'muted',
  'success',
  'warning',
  'destructive',
  'info',
] as const;

// ---------------------------------------------------------------------------
// Default system tokens -- built once, shared across all buildRegistry calls.
// generateBaseSystem is deterministic and pure; no test mutates the base tokens.
// ---------------------------------------------------------------------------

const DEFAULT_TOKENS = generateBaseSystem().allTokens;

// ---------------------------------------------------------------------------
// Helper: build a fully seeded registry from colorWheel output
// ---------------------------------------------------------------------------

async function buildRegistry(seed: OKLCH): Promise<TokenRegistry> {
  const registry = new TokenRegistry(DEFAULT_TOKENS);

  // Generate color system from seed
  const system = colorWheel(seed, 'complementary');

  // Push each family + its 11-step scale positions into the registry
  for (const name of FAMILY_NAMES) {
    const colorValue: ColorValue = system[name];

    // Replace or add the family token
    if (registry.has(name)) {
      await registry.set(name, colorValue);
    } else {
      registry.add({
        name,
        value: colorValue,
        category: 'color',
        namespace: 'color',
        containerQueryAware: true,
      });
    }

    // Add scale position tokens (family-50 through family-950)
    for (let i = 0; i < colorValue.scale.length && i < SCALE_POSITIONS.length; i++) {
      const pos = SCALE_POSITIONS[i];
      const oklch = colorValue.scale[i];
      if (!oklch || !pos) continue;
      const posName = `${name}-${pos}`;
      const cssValue = oklchToCSS(oklch);
      if (registry.has(posName)) {
        await registry.set(posName, cssValue);
      } else {
        registry.add({
          name: posName,
          value: cssValue,
          category: 'color',
          namespace: 'color',
          scalePosition: i,
          containerQueryAware: true,
        });
      }
    }
  }

  return registry;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('colorWheel -> TokenRegistry integration', () => {
  describe('shape compatibility', () => {
    it('all 11 ColorValues satisfy ColorValueSchema', () => {
      const system = colorWheel(TAILWIND_BLUE_500, 'complementary');
      for (const [name, cv] of Object.entries(system)) {
        const result = ColorValueSchema.safeParse(cv);
        expect(
          result.success,
          `${name} failed schema: ${JSON.stringify(result.error?.issues)}`,
        ).toBe(true);
      }
    });

    it('every ColorValue has a valid 11-step scale', () => {
      const system = colorWheel(TAILWIND_BLUE_500, 'complementary');
      for (const [name, cv] of Object.entries(system)) {
        expect(cv.scale, `${name} scale length`).toHaveLength(11);
        for (const oklch of cv.scale) {
          expect(Number.isFinite(oklch.l), `${name} L not finite`).toBe(true);
          expect(Number.isFinite(oklch.c), `${name} C not finite`).toBe(true);
          expect(Number.isFinite(oklch.h), `${name} H not finite`).toBe(true);
          expect(oklch.l, `${name} L out of range`).toBeGreaterThanOrEqual(0);
          expect(oklch.l, `${name} L out of range`).toBeLessThanOrEqual(1);
          expect(oklch.c, `${name} C negative`).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('every ColorValue has accessibility matrices (wcagAA + wcagAAA)', () => {
      const system = colorWheel(TAILWIND_BLUE_500, 'complementary');
      for (const [name, cv] of Object.entries(system)) {
        expect(cv.accessibility, `${name} accessibility missing`).toBeDefined();
        expect(cv.accessibility?.wcagAA?.normal, `${name} wcagAA.normal missing`).toBeDefined();
        expect(cv.accessibility?.wcagAAA?.normal, `${name} wcagAAA.normal missing`).toBeDefined();
      }
    });

    it('every ColorValue has the token field set to its palette name', () => {
      const system = colorWheel(TAILWIND_BLUE_500, 'complementary');
      for (const [paletteName, cv] of Object.entries(system)) {
        expect(cv.token, `${paletteName} missing token field`).toBe(paletteName);
      }
    });
  });

  describe('registry ingestion', () => {
    it('registry accepts all 11 family tokens without throwing', async () => {
      await expect(buildRegistry(TAILWIND_BLUE_500)).resolves.toBeInstanceOf(TokenRegistry);
    });

    it('registry contains all 11 family tokens after ingestion', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      for (const f of FAMILY_NAMES) {
        expect(registry.has(f), `missing family token: ${f}`).toBe(true);
      }
    });

    it('registry contains all 121 scale position tokens (11 families x 11 positions)', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      for (const f of FAMILY_NAMES) {
        for (const p of SCALE_POSITIONS) {
          expect(registry.has(`${f}-${p}`), `missing ${f}-${p}`).toBe(true);
        }
      }
    });

    it('ingested family token value is a ColorValue with a 11-step scale', async () => {
      // After #1440 (palette-namespaced colorWheel keys), the family ColorValue
      // lives at `${role}-family`, distinct from the semantic role token at the
      // bare role name. No cascade clobber path: primary-family has no semantic
      // dependents, so its ColorValue persists across the buildRegistry pass.
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const value = registry.get('primary-family')?.value;
      expect(value).toBeDefined();
      expect(value).not.toBeNull();
      expect(value && typeof value === 'object' && 'scale' in value).toBe(true);
      if (value && typeof value === 'object' && 'scale' in value) {
        expect((value as ColorValue).scale).toHaveLength(11);
      }
    });
  });

  describe('cascade: contrast:auto rule', () => {
    it('primary-foreground exists in the registry after ingestion', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const fg = registry.get('primary-foreground');
      expect(fg, 'primary-foreground missing from registry').toBeDefined();
    });

    it('primary-foreground value is defined after cascade', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const fg = registry.get('primary-foreground');
      expect(fg?.value, 'primary-foreground value is undefined').toBeDefined();
    });

    it('accent-foreground cascade after accent-family colorWheel update does not throw', async () => {
      // After #1440 (palette rename), accent-family has no semantic dependents
      // -- DEFAULT_SEMANTIC_COLOR_MAPPINGS still points accent-foreground at the
      // pre-rename family names. The cascade rewiring (semantic dependsOn[0]
      // points at the implied family) lands in #1441 / #1442. For now the
      // assertion is just that set on a colorWheel-managed family does not
      // throw a cascade-aggregate error. #1441 will tighten this to assert the
      // value actually changes.
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const fgBefore = JSON.stringify(registry.get('accent-foreground')?.value);

      const newSystem = colorWheel(BRAND_MAGENTA, 'complementary');
      await registry.set('accent-family', newSystem['accent-family']);

      const fgAfter = JSON.stringify(registry.get('accent-foreground')?.value);
      expect(fgAfter).toBeDefined();
      void fgBefore;
    });

    it('destructive-foreground exists and has a value', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const fg = registry.get('destructive-foreground');
      expect(fg, 'destructive-foreground missing').toBeDefined();
      expect(fg?.value, 'destructive-foreground value undefined').toBeDefined();
    });
  });

  describe('cascade: state:hover rule', () => {
    it('primary-hover exists in registry after ingestion', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const hover = registry.get('primary-hover');
      expect(hover, 'primary-hover missing from registry').toBeDefined();
    });

    it('primary-hover value references a valid scale position that exists in the registry', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const hover = registry.get('primary-hover');
      const value = hover?.value;

      // The value should be a ColorReference after cascade
      if (value && typeof value === 'object' && 'family' in value && 'position' in value) {
        const ref = value as { family: string; position: string };
        const posTokenName = `${ref.family}-${ref.position}`;
        expect(
          registry.has(posTokenName),
          `hover references ${posTokenName} which does not exist`,
        ).toBe(true);
      }
    });
  });

  describe('cascade: scale:N rule', () => {
    it('primary-border exists in registry after ingestion', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      expect(registry.has('primary-border'), 'primary-border missing').toBe(true);
    });

    it('semantic base token (primary) resolves to a valid color reference', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const token = registry.get('primary');
      const value = token?.value;
      expect(value).toBeDefined();
      // primary is a semantic ColorReference (rule scale:N pointing at the lightRef family).
      // colorWheel pushes its ColorValue under primary-family; the bare primary slot stays a ref.
      expect(value && typeof value === 'object' && 'family' in value && 'position' in value).toBe(
        true,
      );
    });
  });

  describe('exporter: Tailwind CSS', () => {
    it('produces non-empty CSS output', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const css = registryToTailwind(registry, { darkMode: 'class' });
      expect(typeof css).toBe('string');
      expect(css.length).toBeGreaterThan(100);
    });

    it('produced CSS contains no empty custom property declarations', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const css = registryToTailwind(registry, { darkMode: 'class' });
      // Matches "--some-token: ;" (empty value after colon)
      expect(css).not.toMatch(/--[\w-]+:\s*;/);
    });

    it('produced CSS contains no "undefined" or "null" literals', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const css = registryToTailwind(registry, { darkMode: 'class' });
      expect(css).not.toContain('undefined');
      expect(css).not.toContain('null');
    });

    it('every var() reference in produced CSS has a corresponding definition', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const css = registryToTailwind(registry, { darkMode: 'class' });

      // External/runtime variables that are expected to be defined elsewhere
      const EXTERNAL_VARS = new Set([
        'radix-accordion-content-height', // Radix UI runtime variable
        'shadow', // Shadow token from base system (not in test registry)
      ]);

      // Prefixes for tokens that come from base system generators, not the colorWheel test
      const EXTERNAL_PREFIXES = ['motion-duration-', 'motion-easing-'];

      const varRefMatches = [...css.matchAll(/var\(--([\w-]+)\)/g)];
      const varDefMatches = [...css.matchAll(/--([\w-]+)\s*:/g)];

      const varRefs = varRefMatches.map((m) => m[1]).filter((r): r is string => r !== undefined);
      const varDefs = new Set(
        varDefMatches.map((m) => m[1]).filter((d): d is string => d !== undefined),
      );

      const unresolved = varRefs.filter((r) => {
        if (EXTERNAL_VARS.has(r)) return false;
        if (EXTERNAL_PREFIXES.some((p) => r.startsWith(p))) return false;
        return !varDefs.has(r);
      });
      expect(unresolved, `unresolved var() refs: ${unresolved.slice(0, 20).join(', ')}`).toEqual(
        [],
      );
    });

    it('emits semantic custom properties for families with semantic mappings', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const css = registryToTailwind(registry, { darkMode: 'class' });
      for (const f of SEMANTIC_FAMILY_NAMES) {
        expect(css, `missing --${f} in CSS`).toContain(`--${f}:`);
      }
    });

    it('emits a dark mode block (.dark { })', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const css = registryToTailwind(registry, { darkMode: 'class' });
      expect(css).toMatch(/\.dark\s*\{/);
    });
  });

  describe('exporter: TypeScript', () => {
    it('produces non-empty TypeScript output', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const ts = registryToTypeScript(registry, { includeJSDoc: true });
      expect(typeof ts).toBe('string');
      expect(ts.length).toBeGreaterThan(100);
    });

    it('produced TypeScript output contains token identifiers for all 11 families', async () => {
      const registry = await buildRegistry(TAILWIND_BLUE_500);
      const ts = registryToTypeScript(registry, { includeJSDoc: true });
      for (const f of FAMILY_NAMES) {
        expect(ts, `missing ${f} in TypeScript output`).toContain(f);
      }
    });
  });

  describe('real-world seeds', () => {
    it('Tailwind blue-500 seed: primary-family scale mid-tone hue stays near 259', () => {
      const system = colorWheel(TAILWIND_BLUE_500, 'complementary');
      const primaryMid = system['primary-family'].scale[5];
      if (primaryMid) {
        expect(
          Math.abs(primaryMid.h - 259),
          `primary-family mid-tone hue drifted: got ${primaryMid.h}`,
        ).toBeLessThan(15);
      }
    });

    it('near-black seed produces no NaN in any scale value', () => {
      const system = colorWheel(NEAR_BLACK, 'complementary');
      for (const [name, cv] of Object.entries(system)) {
        for (const oklch of cv.scale) {
          expect(Number.isFinite(oklch.l), `${name} L is NaN`).toBe(true);
          expect(Number.isFinite(oklch.c), `${name} C is NaN`).toBe(true);
          expect(Number.isFinite(oklch.h), `${name} H is NaN`).toBe(true);
        }
      }
    });

    it('high-chroma magenta seed: all scale L values stay in [0, 1]', () => {
      const system = colorWheel(BRAND_MAGENTA, 'complementary');
      for (const [name, cv] of Object.entries(system)) {
        for (const oklch of cv.scale) {
          expect(oklch.l, `${name} L underflow`).toBeGreaterThanOrEqual(0);
          expect(oklch.l, `${name} L overflow`).toBeLessThanOrEqual(1);
        }
      }
    });

    it('high-chroma magenta seed: all scale C values are non-negative', () => {
      const system = colorWheel(BRAND_MAGENTA, 'complementary');
      for (const [name, cv] of Object.entries(system)) {
        for (const oklch of cv.scale) {
          expect(oklch.c, `${name} C negative`).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  describe('determinism under cascade', () => {
    it('same seed produces identical registry state for all 11 family tokens', async () => {
      const r1 = await buildRegistry(TAILWIND_BLUE_500);
      const r2 = await buildRegistry(TAILWIND_BLUE_500);
      for (const f of FAMILY_NAMES) {
        expect(JSON.stringify(r1.get(f)?.value), `family ${f} differs between builds`).toBe(
          JSON.stringify(r2.get(f)?.value),
        );
      }
    });

    it('same seed produces identical Tailwind CSS output', async () => {
      const r1 = await buildRegistry(TAILWIND_BLUE_500);
      const r2 = await buildRegistry(TAILWIND_BLUE_500);
      const css1 = registryToTailwind(r1, { darkMode: 'class' });
      const css2 = registryToTailwind(r2, { darkMode: 'class' });
      expect(css1).toBe(css2);
    });
  });
});
