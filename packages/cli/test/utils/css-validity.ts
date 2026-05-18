/**
 * Generated-CSS validity harness for install integration tests (#1524).
 *
 * Tests that run `rafters init` against a fixture call `assertCssIsValid`
 * on the resulting `rafters.css` to verify the output is a working
 * design system, not just "files exist." Checks:
 *
 *   1. The CSS parses without syntax errors (`css-tree.parse`).
 *   2. Every `var(--rafters-*)` and `var(--color-*)` reference resolves
 *      to a declared property in the same output. Dangling references
 *      silently fall back to nothing in the browser; this is the bug
 *      class the harness is built to catch.
 *   3. The canonical semantic surface tokens are declared
 *      (background, foreground, primary, destructive, border).
 *   4. Token count is in an expected range when supplied -- catches
 *      "init produced nothing" silently.
 *
 * Note on the regex extraction: `css-tree.walk` does NOT descend into
 * the body of unrecognized at-rules. Tailwind v4's `@theme { ... }` is
 * not a standard CSS at-rule, so a walk-based extraction misses every
 * declaration inside that block. Regex is the reliable shape.
 */

import * as csstree from 'css-tree';

export interface CssValidityReport {
  /** Distinct `--rafters-*` and `--color-*` custom-property declarations. */
  declared: Set<string>;
  /** Distinct `var(--rafters-*)` and `var(--color-*)` reference targets. */
  referenced: Set<string>;
  /** Referenced names with no matching declaration. */
  danglingRefs: string[];
  /** Canonical semantic surface tokens that should always be declared. */
  missingCanonicalTokens: string[];
}

/**
 * Canonical semantic surface tokens. If any of these is missing from
 * the output, init produced something incomplete -- the most-used
 * semantic families.
 */
const CANONICAL_SEMANTIC_TOKENS: readonly string[] = [
  '--rafters-background',
  '--rafters-foreground',
  '--rafters-primary',
  '--rafters-destructive',
  '--rafters-border',
];

const PREFIXES = ['--rafters-', '--color-'] as const;

/** Pure helper: analyse the CSS, return the report without throwing. */
export function analyzeCss(css: string): CssValidityReport {
  const declared = new Set<string>();
  const referenced = new Set<string>();

  for (const prefix of PREFIXES) {
    const declPattern = new RegExp(`(?<![\\w-])(${escapeRegex(prefix)}[\\w-]+)\\s*:`, 'g');
    for (const m of css.matchAll(declPattern)) {
      if (m[1]) declared.add(m[1]);
    }
    const refPattern = new RegExp(`var\\(\\s*(${escapeRegex(prefix)}[\\w-]+)`, 'g');
    for (const m of css.matchAll(refPattern)) {
      if (m[1]) referenced.add(m[1]);
    }
  }

  const danglingRefs = [...referenced].filter((name) => !declared.has(name)).sort();
  const missingCanonicalTokens = CANONICAL_SEMANTIC_TOKENS.filter((name) => !declared.has(name));

  return { declared, referenced, danglingRefs, missingCanonicalTokens };
}

/**
 * Assert the generated CSS is a working design system:
 *   - parses (no syntax error)
 *   - has no dangling `var(--rafters-*)` / `var(--color-*)` references
 *   - declares the canonical semantic surface tokens
 *   - declared count lands inside `expectedTokenRange` when supplied
 *
 * Throws with a multi-line message on failure listing exactly what's wrong.
 */
export function assertCssIsValid(css: string, expectedTokenRange?: [number, number]): void {
  try {
    csstree.parse(css);
  } catch (err) {
    throw new Error(
      `rafters.css does not parse: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const report = analyzeCss(css);
  const failures: string[] = [];

  if (report.danglingRefs.length > 0) {
    failures.push(
      `dangling var() refs (${report.danglingRefs.length}): ${report.danglingRefs.join(', ')}`,
    );
  }
  if (report.missingCanonicalTokens.length > 0) {
    failures.push(`missing canonical tokens: ${report.missingCanonicalTokens.join(', ')}`);
  }
  if (expectedTokenRange) {
    const [min, max] = expectedTokenRange;
    if (report.declared.size < min || report.declared.size > max) {
      failures.push(
        `declared-token count ${report.declared.size} is outside expected range [${min}, ${max}]`,
      );
    }
  }

  if (failures.length > 0) {
    throw new Error(`rafters.css is not a valid design system:\n  - ${failures.join('\n  - ')}`);
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[-]/g, '\\-');
}
