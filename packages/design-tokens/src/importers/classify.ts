/**
 * Classify CSS custom-property declarations into rafters namespaces.
 *
 * Reads each declaration two ways:
 *   - **value shape** via color-utils (`tryParseColor`) and math-utils
 *     (`tryParseUnit`)
 *   - **name pattern** as a fallback when the value alone is ambiguous
 *     (e.g. `--font-weight: 700` -- `700` is a unitless number with no
 *     length, the name resolves it)
 *
 * Anything that does not match an in-scope namespace lands in `unclassified`
 * -- those are Tailwind internals (`--tw-*`), third-party widget vars, and
 * other noise the importer leaves alone.
 */

import { tryParseColor } from '@rafters/color-utils';
import { tryParseUnit } from '@rafters/math-utils';
import {
  type ClassificationResult,
  type ClassifiedDeclaration,
  type CssDeclaration,
  RAFTERS_IMPORT_NAMESPACES,
  type RaftersImportNamespace,
} from './shapes.js';

/**
 * Shadcn's canonical `:root` semantic vocabulary. Declarations with these
 * names (and a color value) map to the `semantic` namespace; color-valued
 * declarations with other names map to `color` (palette primitive).
 */
const SHADCN_SEMANTIC_NAMES: ReadonlySet<string> = new Set([
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
]);

const GENERIC_FONT_KEYWORDS: ReadonlySet<string> = new Set([
  'sans-serif',
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-sans-serif',
  'ui-serif',
  'ui-monospace',
  'ui-rounded',
]);

function looksLikeFontStack(value: string): boolean {
  if (value.startsWith('"') || value.startsWith("'")) return true;
  const parts = value.split(',').map((p) => p.trim().replace(/^['"]|['"]$/g, ''));
  return parts.some((p) => GENERIC_FONT_KEYWORDS.has(p.toLowerCase()));
}

function classifyOne(decl: CssDeclaration): RaftersImportNamespace | null {
  const { name } = decl;
  const value = decl.value.trim();

  // Color value -> color (or semantic, if the name is a shadcn convention).
  if (tryParseColor(value) !== null) {
    return SHADCN_SEMANTIC_NAMES.has(name) ? 'semantic' : 'color';
  }

  // Length value: disambiguate by name pattern. Bare numbers parse as
  // UNITLESS via `tryParseUnit`; treat them as not-a-length so the name
  // fallback below can route things like `--font-weight: 700`.
  const unit = tryParseUnit(value);
  if (unit !== null && unit.unit.name !== '') {
    if (name === 'radius' || name.startsWith('radius-') || name.startsWith('border-radius'))
      return 'radius';
    if (name.startsWith('spacing') || name.startsWith('space-')) return 'spacing';
    if (
      name === 'line-height' ||
      name.startsWith('font-size') ||
      name.startsWith('text-') ||
      name.startsWith('letter-spacing')
    )
      return 'typography';
    return null;
  }

  // Font-family stacks.
  if (looksLikeFontStack(value)) return 'typography';

  // Name-only fallback for values we cannot otherwise classify (e.g. complex
  // box-shadow expressions, font-weight as bare number, named typography
  // values like `bold`).
  if (name.startsWith('font-') || name.startsWith('text-')) return 'typography';
  if (name === 'shadow' || name.startsWith('shadow-') || name.startsWith('box-shadow'))
    return 'shadow';
  if (name === 'radius' || name.startsWith('radius-')) return 'radius';
  if (name.startsWith('spacing') || name.startsWith('space-')) return 'spacing';

  return null;
}

/**
 * Split a list of CSS declarations into per-namespace buckets and a
 * leftover `unclassified` list. Order within each bucket matches source
 * order; duplicate names are preserved (consumers decide cascade winners).
 */
export function classifyDeclarations(
  declarations: readonly CssDeclaration[],
): ClassificationResult {
  const buckets = Object.fromEntries(
    RAFTERS_IMPORT_NAMESPACES.map((ns) => [ns, [] as ClassifiedDeclaration[]]),
  ) as Record<RaftersImportNamespace, ClassifiedDeclaration[]>;
  const unclassified: CssDeclaration[] = [];

  for (const decl of declarations) {
    const namespace = classifyOne(decl);
    if (namespace === null) {
      unclassified.push(decl);
    } else {
      buckets[namespace].push({ ...decl, namespace });
    }
  }

  return { byNamespace: buckets, unclassified };
}
