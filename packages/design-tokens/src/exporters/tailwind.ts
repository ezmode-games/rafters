import type { ColorReference, ColorValue, OKLCH, Token } from '@rafters/shared';
import { COLOR_SCALE_POSITIONS } from '../generators/color.js';
import type { TokenRegistry } from '../registry.js';
import { computeDarkScale } from './dark-mode.js';

const POSITION_TO_INDEX: Record<string, number> = Object.fromEntries(
  COLOR_SCALE_POSITIONS.map((p, i) => [p, i]),
);

/**
 * Emit a Tailwind v4 @theme block plus a dark-mode section.
 *
 * Color-namespace tokens:
 *   - Family token (value is a ColorValue with scale): emit `--color-{family}: oklch(...)`
 *     using position 500 as the family's base.
 *   - Per-position token (value is a ColorReference): resolve through the family's
 *     scale and emit literal `--color-{name}: oklch(...)`. If the family or position
 *     can't be resolved, emit a CSS comment and continue.
 *   - userOverride with string value wins.
 *
 * Semantic-namespace tokens with ColorReference values: emit as
 * `var(--color-{family}-{position})` so the redirection survives into the CSS and
 * dark-mode swaps work at runtime.
 *
 * Other namespaces (spacing, radius, shadow, motion, typography, breakpoint, depth,
 * focus, fill, elevation, typography-composite): emit `--{token.name}: {value}` for
 * string values. Stringified-JSON composites (typography-composite, fill, etc.) are
 * skipped for now — utility generation for composites is a follow-up.
 *
 * Dark mode: walks each family inside `@media (prefers-color-scheme: dark)`, emits
 * per-position dark vars from `computeDarkScale(family.scale)`.
 */
export function exportTailwind(registry: TokenRegistry): string {
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

  const otherNamespaces = uniqueNamespaces(registry).filter(
    (ns) => ns !== 'color' && ns !== 'semantic',
  );
  for (const ns of otherNamespaces) {
    for (const token of registry.list({ namespace: ns })) {
      const line = emitOtherToken(token);
      if (line) lines.push(`  ${line}`);
    }
  }

  lines.push('}', '', '@media (prefers-color-scheme: dark) {');
  lines.push('  :root {');

  for (const family of colorTokens.filter((t) => isColorValue(t.value))) {
    if (!isColorValue(family.value)) continue;
    const darkScale = computeDarkScale(family.value.scale);
    for (let i = 0; i < COLOR_SCALE_POSITIONS.length; i++) {
      const position = COLOR_SCALE_POSITIONS[i];
      const dark = darkScale[i];
      if (!position || !dark) continue;
      lines.push(`    --color-${family.name}-${position}: ${oklchToCss(dark)};`);
    }
  }

  lines.push('  }', '}');

  return lines.join('\n');
}

function emitColorToken(token: Token, registry: TokenRegistry): string | null {
  const value = token.value;

  if (isColorValue(value)) {
    const base = value.scale[POSITION_TO_INDEX['500'] ?? 5];
    if (!base) return null;
    return `--color-${token.name}: ${oklchToCss(base)};`;
  }

  if (token.userOverride && typeof value === 'string') {
    return `--color-${token.name}: ${value};`;
  }

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

function emitOtherToken(token: Token): string | null {
  const value = token.value;
  if (typeof value !== 'string') return null;
  // Skip stringified-JSON composites (typography-composite, fill, etc.); utility
  // generation for those is a follow-up.
  if (value.startsWith('{') || value.startsWith('[')) return null;
  return `--${token.name}: ${value};`;
}

function uniqueNamespaces(registry: TokenRegistry): string[] {
  const seen = new Set<string>();
  for (const token of registry.list()) seen.add(token.namespace);
  return [...seen];
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
