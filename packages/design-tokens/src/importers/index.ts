/**
 * Design Token Importers
 *
 * Pure parsers: source bytes -> structured declarations the registry write
 * path (`registry.set`) can consume. Importers do not call into the
 * registry; the caller (CLI / Studio) prompts the designer for assignment
 * and translates declarations into `set(name, value, {reason})` calls.
 */

export { extractShadcnRoot } from './shadcn.js';
export type { CssDeclaration } from './shapes.js';
