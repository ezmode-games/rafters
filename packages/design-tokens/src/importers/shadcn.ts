/**
 * shadcn importer.
 *
 * Extracts every `--name: value` declaration from top-level `:root { ... }`
 * rules in source CSS. `.dark { ... }` blocks are skipped -- dark mode is
 * computed by the system from light values via the invert plugin + the
 * Tailwind exporter's `dependsOn[1]` convention.
 */

import * as csstree from 'css-tree';
import type { CssDeclaration } from './shapes.js';

/**
 * Read every `--name: value` declaration inside top-level `:root { ... }`
 * rules. Returns one entry per declaration in source order; duplicates are
 * preserved -- consumers decide cascade winners.
 *
 * Strict selector match (`:root` exactly). Compound selectors like
 * `:root, html` or `:root.foo` are intentionally not matched in this first
 * cut. Malformed CSS is parsed permissively by css-tree; unrecognized nodes
 * are skipped rather than thrown on.
 */
export function extractShadcnRoot(css: string): readonly CssDeclaration[] {
  const ast = csstree.parse(css);
  const out: CssDeclaration[] = [];
  csstree.walk(ast, {
    visit: 'Rule',
    enter(rule) {
      if (csstree.generate(rule.prelude).trim() !== ':root') return;
      csstree.walk(rule.block, {
        visit: 'Declaration',
        enter(decl) {
          if (!decl.property.startsWith('--')) return;
          out.push({
            name: decl.property.slice(2),
            value: csstree.generate(decl.value).trim(),
          });
        },
      });
    },
  });
  return out;
}
