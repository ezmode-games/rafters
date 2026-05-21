/**
 * Design Token Importers
 *
 * Pure parsers + classifiers: source bytes -> structured declarations the
 * registry write path (`registry.set`) can consume. Importers do not call
 * into the registry; the caller (CLI / Studio) prompts the designer for
 * assignment and translates declarations into `set(name, value, {reason})`
 * calls.
 */

export { classifyDeclarations } from './classify.js';
export { extractShadcnRoot } from './shadcn.js';
export {
  type ClassificationResult,
  type ClassifiedDeclaration,
  type CssDeclaration,
  RAFTERS_IMPORT_NAMESPACES,
  type RaftersImportNamespace,
} from './shapes.js';
