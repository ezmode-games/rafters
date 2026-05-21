/**
 * Compose `extractShadcnRoot` + `classifyDeclarations` into a single
 * count-shaped summary the CLI can render as "Sensed N declarations from
 * <file>; X namespaces present, Y unrelated entries."
 *
 * Pure -- string in, counts out. No file I/O, no registry interaction. The
 * CLI is responsible for reading the source file and emitting the log
 * event.
 */

import { classifyDeclarations } from './classify.js';
import { extractShadcnRoot } from './shadcn.js';
import {
  RAFTERS_IMPORT_NAMESPACES,
  type RaftersImportNamespace,
  type SensedSummary,
} from './shapes.js';

export function senseShadcnCss(css: string): SensedSummary {
  const declarations = extractShadcnRoot(css);
  const classification = classifyDeclarations(declarations);

  const byNamespace = Object.fromEntries(
    RAFTERS_IMPORT_NAMESPACES.map((ns) => [ns, classification.byNamespace[ns].length] as const),
  ) as Record<RaftersImportNamespace, number>;

  const namespacesPresent = RAFTERS_IMPORT_NAMESPACES.filter((ns) => byNamespace[ns] > 0);

  return {
    totalDeclarations: declarations.length,
    byNamespace,
    namespacesPresent,
    unclassifiedCount: classification.unclassified.length,
  };
}
