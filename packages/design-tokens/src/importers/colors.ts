/**
 * Enrich color- and semantic-namespace declarations with their OKLCH
 * representation. The classifier has already verified each value parses
 * (via `tryParseColor`); this pass calls `hexToOKLCH` from
 * `@rafters/color-utils` -- which accepts every CSS color format that
 * colorjs.io parses -- to extract the OKLCH. Throws if a value fails to
 * parse here; that would be a classifier-invariant bug worth surfacing.
 */

import { hexToOKLCH } from '@rafters/color-utils';
import type { ClassificationResult, ColorDeclaration } from './shapes.js';

/**
 * Loop over color and semantic declarations from a `ClassificationResult`
 * and return each one enriched with its parsed OKLCH. The two namespaces
 * are concatenated in classification order: color primitives first, then
 * semantic role tokens.
 */
export function colorsFromClassification(
  classification: ClassificationResult,
): readonly ColorDeclaration[] {
  const result: ColorDeclaration[] = [];
  for (const decl of classification.byNamespace.color) {
    result.push({ ...decl, namespace: 'color', oklch: hexToOKLCH(decl.value) });
  }
  for (const decl of classification.byNamespace.semantic) {
    result.push({ ...decl, namespace: 'semantic', oklch: hexToOKLCH(decl.value) });
  }
  return result;
}
