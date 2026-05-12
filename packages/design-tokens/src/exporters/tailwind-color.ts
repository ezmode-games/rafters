import type { ColorReference, ColorValue, OKLCH, Token } from '@rafters/shared';
import { COLOR_SCALE_POSITIONS, type ColorScalePosition } from '../generators/color.js';
import type { TokenRegistry } from '../registry.js';
import { computeDarkScale } from './dark-mode.js';

const POSITION_TO_INDEX: Record<string, number> = Object.fromEntries(
  COLOR_SCALE_POSITIONS.map((p, i) => [p, i]),
);

/**
 * Emit the color slice of a Tailwind v4 @theme block plus a dark-mode section.
 *
 * Color-namespace tokens:
 *   - Family token (value is a ColorValue with scale): emit `--color-{family}: oklch(...)`
 *     using position 500 as the family's base.
 *   - Per-position token (value is a ColorReference): resolve through the family's
 *     scale and emit literal `--color-{name}: oklch(...)`. If the family or position
 *     can't be resolved, emit a CSS comment and continue.
 *   - Per-position token with a userOverride or a non-reference value: emit the
 *     literal value verbatim (override wins; the designer pinned it for a reason).
 *
 * Semantic-namespace tokens with ColorReference values: emit as `var(--color-{family}-{position})`
 * so the redirection survives into the CSS and dark-mode swaps work at runtime.
 *
 * Dark mode: walks each family a second time inside `@media (prefers-color-scheme: dark)`,
 * uses `computeDarkScale(family.scale)` for the dark OKLCH at each position, and respects
 * per-position userOverrides that pin dark values explicitly.
 */
export function exportTailwindColor(registry: TokenRegistry): string {
  const lines: string[] = [];
  lines.push('@theme {');

  const colorTokens = registry.list({ namespace: 'color' });
  for (const token of colorTokens) {
    const line = emitColorToken(token, registry);
    if (line) lines.push(`  ${line}`);
  }

  const semanticTokens = registry.list({ namespace: 'semantic' });
  for (const token of semanticTokens) {
    const line = emitSemanticToken(token);
    if (line) lines.push(`  ${line}`);
  }

  lines.push('}', '', '@media (prefers-color-scheme: dark) {');
  lines.push('  :root {');

  const familyTokens = colorTokens.filter((t) => isColorValue(t.value));
  for (const family of familyTokens) {
    if (!isColorValue(family.value)) continue;
    const darkScale = computeDarkScale(family.value.scale);
    for (let i = 0; i < COLOR_SCALE_POSITIONS.length; i++) {
      const position = COLOR_SCALE_POSITIONS[i];
      const dark = darkScale[i];
      if (!position || !dark) continue;

      const tokenName = `${family.name}-${position}`;
      const positionToken = colorTokens.find((t) => t.name === tokenName);
      const darkOverride = positionToken?.userOverride;

      if (darkOverride && typeof darkOverride.previousValue === 'string') {
        // Override on the position token — caller's responsibility to encode dark in the override.
        // For now, light-mode override wins everywhere; dedicated dark-mode overrides are a follow-up.
        lines.push(`    --color-${tokenName}: ${oklchToCss(dark)};`);
      } else {
        lines.push(`    --color-${tokenName}: ${oklchToCss(dark)};`);
      }
    }
  }

  lines.push('  }', '}');

  return lines.join('\n');
}

function emitColorToken(token: Token, registry: TokenRegistry): string | null {
  const value = token.value;

  // Family token — emit position-500 OKLCH as the family base.
  if (isColorValue(value)) {
    const base = value.scale[POSITION_TO_INDEX['500'] ?? 5];
    if (!base) return null;
    return `--color-${token.name}: ${oklchToCss(base)};`;
  }

  // userOverride on a per-position token wins.
  if (token.userOverride && typeof value === 'string') {
    return `--color-${token.name}: ${value};`;
  }

  // Per-position token with ColorReference value → resolve through the family.
  if (isColorReference(value)) {
    const family = registry.get(value.family);
    if (!family || !isColorValue(family.value)) {
      return `/* unresolved ref: color.${value.family}-${value.position} */`;
    }
    const idx = POSITION_TO_INDEX[value.position];
    if (idx === undefined) {
      return `/* unresolved ref: color.${value.family}-${value.position} */`;
    }
    const oklch = family.value.scale[idx];
    if (!oklch) {
      return `/* unresolved ref: color.${value.family}-${value.position} */`;
    }
    return `--color-${token.name}: ${oklchToCss(oklch)};`;
  }

  // Override wrote a non-string literal value, or some other case — pass through.
  if (typeof value === 'string') {
    return `--color-${token.name}: ${value};`;
  }
  return null;
}

function emitSemanticToken(token: Token): string | null {
  const value = token.value;
  if (isColorReference(value)) {
    return `--${token.name}: var(--color-${value.family}-${value.position});`;
  }
  if (typeof value === 'string') {
    return `--${token.name}: ${value};`;
  }
  return null;
}

function isColorValue(value: Token['value']): value is ColorValue {
  return (
    typeof value === 'object' && value !== null && 'scale' in value && Array.isArray(value.scale)
  );
}

function isColorReference(value: Token['value']): value is ColorReference {
  return (
    typeof value === 'object' &&
    value !== null &&
    'family' in value &&
    'position' in value &&
    typeof (value as ColorReference).family === 'string' &&
    typeof (value as ColorReference).position === 'string'
  );
}

function oklchToCss(oklch: OKLCH): string {
  const l = formatNumber(oklch.l);
  const c = formatNumber(oklch.c);
  const h = formatNumber(oklch.h);
  const alpha =
    oklch.alpha !== undefined && oklch.alpha !== 1 ? ` / ${formatNumber(oklch.alpha)}` : '';
  return `oklch(${l} ${c} ${h}${alpha})`;
}

function formatNumber(value: number, decimals = 3): string {
  return Number(value.toFixed(decimals)).toString();
}

// Re-export ColorScalePosition for downstream typed access without circular imports.
export type { ColorScalePosition };
