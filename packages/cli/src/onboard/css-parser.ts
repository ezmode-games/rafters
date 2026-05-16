/**
 * CSS Parser for Design Token Import
 *
 * Extracts CSS custom properties from stylesheets with context awareness.
 * Handles :root, .dark, @theme, and @media prefers-color-scheme blocks.
 */

import * as csstree from 'css-tree';

export type VariableContext = 'root' | 'dark' | 'theme' | 'media' | 'other';

export interface CSSVariable {
  name: string;
  value: string;
  context: VariableContext;
  selector: string | undefined;
  mediaQuery: string | undefined;
  line: number;
  column: number;
}

export interface ParsedCSS {
  variables: CSSVariable[];
  hasThemeBlock: boolean;
  hasDarkMode: boolean;
  sourceType: 'tailwind-v4' | 'shadcn' | 'generic';
}

/**
 * Determine context from selector string
 */
function getContextFromSelector(selector: string): VariableContext {
  const s = selector.toLowerCase();
  if (s === ':root' || s === 'html' || s === ':where(:root)') {
    return 'root';
  }
  if (
    s.includes('.dark') ||
    s.includes('[data-theme="dark"]') ||
    s.includes('[data-mode="dark"]') ||
    s.includes(':root.dark')
  ) {
    return 'dark';
  }
  return 'other';
}

/**
 * Check if media query is for dark mode
 */
function isDarkModeMedia(mediaQuery: string): boolean {
  return mediaQuery.includes('prefers-color-scheme') && mediaQuery.includes('dark');
}

/**
 * Extract selector string from a Rule node
 */
function getSelectorString(rule: csstree.Rule): string {
  return csstree.generate(rule.prelude);
}

/**
 * Parse CSS content and extract all custom properties with context
 */
export function parseCSSFile(content: string): ParsedCSS {
  const variables: CSSVariable[] = [];
  let hasThemeBlock = false;
  let hasDarkMode = false;

  let ast: csstree.CssNode;
  try {
    ast = csstree.parse(content, {
      positions: true,
      parseCustomProperty: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to parse CSS: ${message}`);
  }

  // Track current context during walk
  let currentMediaQuery: string | undefined;
  let currentSelector: string | undefined;

  csstree.walk(ast, {
    enter(node: csstree.CssNode) {
      // Track @theme blocks (Tailwind v4)
      if (node.type === 'Atrule' && node.name === 'theme') {
        hasThemeBlock = true;
      }

      // Track @media queries
      if (node.type === 'Atrule' && node.name === 'media' && node.prelude) {
        currentMediaQuery = csstree.generate(node.prelude);
        if (isDarkModeMedia(currentMediaQuery)) {
          hasDarkMode = true;
        }
      }

      // Track selectors in rules
      if (node.type === 'Rule') {
        currentSelector = getSelectorString(node);
        const context = getContextFromSelector(currentSelector);
        if (context === 'dark') {
          hasDarkMode = true;
        }
      }

      // Extract custom property declarations
      if (node.type === 'Declaration' && node.property.startsWith('--')) {
        let context: VariableContext;

        if (hasThemeBlock && !currentMediaQuery && !currentSelector) {
          // Inside @theme block without specific selector
          context = 'theme';
        } else if (currentMediaQuery && isDarkModeMedia(currentMediaQuery)) {
          context = 'media';
          hasDarkMode = true;
        } else if (currentSelector) {
          context = getContextFromSelector(currentSelector);
        } else {
          context = 'other';
        }

        const loc = node.loc;
        variables.push({
          name: node.property,
          value: node.value ? csstree.generate(node.value).trim() : '',
          context,
          selector: currentSelector,
          mediaQuery: currentMediaQuery,
          line: loc?.start.line ?? 0,
          column: loc?.start.column ?? 0,
        });
      }
    },
    leave(node: csstree.CssNode) {
      // Clear context when leaving nodes
      if (node.type === 'Atrule' && node.name === 'media') {
        currentMediaQuery = undefined;
      }
      if (node.type === 'Rule') {
        currentSelector = undefined;
      }
    },
  });

  // Determine source type based on patterns
  let sourceType: ParsedCSS['sourceType'] = 'generic';

  if (hasThemeBlock) {
    sourceType = 'tailwind-v4';
  } else {
    // Check for shadcn patterns
    const varNames = variables.map((v) => v.name);
    const shadcnPatterns = ['--background', '--foreground', '--primary', '--secondary', '--muted'];
    const matchCount = shadcnPatterns.filter((p) => varNames.includes(p)).length;
    if (matchCount >= 3) {
      sourceType = 'shadcn';
    }
  }

  return {
    variables,
    hasThemeBlock,
    hasDarkMode,
    sourceType,
  };
}

/**
 * Filter variables by context
 */
export function getVariablesByContext(parsed: ParsedCSS, context: VariableContext): CSSVariable[] {
  return parsed.variables.filter((v) => v.context === context);
}

/**
 * Get unique variable names (deduplicated across contexts)
 */
export function getUniqueVariableNames(parsed: ParsedCSS): string[] {
  return [...new Set(parsed.variables.map((v) => v.name))];
}

/**
 * Maximum number of var() hops to follow before reporting a max-depth error.
 *
 * Aligned with #1404: real CSS rarely chains more than two levels
 * (semantic -> palette family.position), so five is plenty for legitimate
 * chains and short enough to catch malformed files cheaply.
 */
export const MAX_VAR_DEPTH = 5;

const VAR_REF_PATTERN = /^var\((--[\w-]+)(?:\s*,[\s\S]*)?\)\s*$/;

export type ResolveReferenceResult =
  | {
      ok: true;
      /** Final resolved value (the leaf var's string value). */
      value: string;
      /**
       * The var name the resolution walked through to find the leaf.
       * For `--primary: var(--empire-500)` resolving from `--primary`,
       * this is `--empire-500`. For a leaf var (not a var() reference),
       * this is null.
       */
      sourceReference: string | null;
      /** The full chain of var names visited, leaf-last. */
      chain: string[];
    }
  | {
      ok: false;
      reason: 'cycle' | 'max-depth' | 'unresolved';
      /** The chain walked before the failure. */
      chain: string[];
    };

/**
 * Resolve a CSS variable through any `var(--other)` indirections to its
 * leaf value. Used by importers to preserve the designer's intent when
 * source CSS encodes `--primary: var(--empire-500)` rather than inlining
 * the OKLCH string (see #1404).
 *
 * Lookup is by var name; the first occurrence in `variables` wins, with
 * preference for non-dark/non-media context entries (so `--primary` in
 * `:root` resolves before a `.dark` shadow). Cycles, missing targets, and
 * chains longer than `MAX_VAR_DEPTH` are reported via the discriminated
 * result rather than thrown -- the caller decides whether to warn and
 * skip or fall back to the raw value.
 */
export function resolveReference(
  varName: string,
  variables: readonly CSSVariable[],
): ResolveReferenceResult {
  const byName = indexByPreferredContext(variables);
  const chain: string[] = [];
  const visited = new Set<string>();

  let current = varName;
  for (let depth = 0; depth <= MAX_VAR_DEPTH; depth += 1) {
    if (visited.has(current)) {
      return { ok: false, reason: 'cycle', chain: [...chain, current] };
    }
    visited.add(current);
    chain.push(current);

    const entry = byName.get(current);
    if (!entry) {
      return { ok: false, reason: 'unresolved', chain };
    }

    const refMatch = entry.value.match(VAR_REF_PATTERN);
    if (!refMatch || !refMatch[1]) {
      const sourceReference = chain.length > 1 ? (chain[chain.length - 1] ?? null) : null;
      return { ok: true, value: entry.value, sourceReference, chain };
    }

    current = refMatch[1];
  }

  return { ok: false, reason: 'max-depth', chain };
}

/**
 * Build a name -> variable map preferring non-dark/non-media context
 * entries so resolution lands on the light-mode definition by default.
 */
function indexByPreferredContext(variables: readonly CSSVariable[]): Map<string, CSSVariable> {
  const byName = new Map<string, CSSVariable>();
  for (const v of variables) {
    const existing = byName.get(v.name);
    if (!existing) {
      byName.set(v.name, v);
      continue;
    }
    if (
      (existing.context === 'dark' || existing.context === 'media') &&
      v.context !== 'dark' &&
      v.context !== 'media'
    ) {
      byName.set(v.name, v);
    }
  }
  return byName;
}

/**
 * Group variables by their base name (without -- prefix)
 */
export function groupVariablesByName(parsed: ParsedCSS): Map<string, CSSVariable[]> {
  const groups = new Map<string, CSSVariable[]>();

  for (const variable of parsed.variables) {
    const baseName = variable.name.replace(/^--/, '');
    const existing = groups.get(baseName) ?? [];
    existing.push(variable);
    groups.set(baseName, existing);
  }

  return groups;
}
