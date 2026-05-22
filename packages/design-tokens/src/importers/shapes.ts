/**
 * Shared types across importers.
 */

import type { OKLCH } from '@rafters/shared';

/**
 * Rafters namespaces the importer can classify into. A curated subset of the
 * full rafters namespace set -- only the ones a designer typically authors
 * explicitly in source CSS. Stock radius and shadow values are derived from
 * the spacing scale via math-utils progressions and are NOT independently
 * imported unless the designer wrote explicit values.
 */
export const RAFTERS_IMPORT_NAMESPACES = [
  'color',
  'semantic',
  'typography',
  'spacing',
  'radius',
  'shadow',
] as const;
export type RaftersImportNamespace = (typeof RAFTERS_IMPORT_NAMESPACES)[number];

/**
 * One `--name: value` declaration extracted from source CSS. The leading `--`
 * is stripped from `name`; `value` is the raw text after the colon, trimmed.
 * Order preserved from source so cascade winners can be derived downstream.
 */
export interface CssDeclaration {
  readonly name: string;
  readonly value: string;
}

/** A declaration that has been classified into a rafters namespace. */
export interface ClassifiedDeclaration extends CssDeclaration {
  readonly namespace: RaftersImportNamespace;
}

/**
 * A color- or semantic-namespace declaration with its source value parsed
 * to OKLCH via `@rafters/color-utils`. The raw `value` is preserved for
 * display (the designer wrote it; the prompt should show it back); the
 * `oklch` field is what `registry.set` consumes.
 */
export interface ColorDeclaration extends ClassifiedDeclaration {
  readonly namespace: 'color' | 'semantic';
  readonly oklch: OKLCH;
}

/**
 * Output of `classifyDeclarations`. `byNamespace` carries the declarations
 * the importer recognized; `unclassified` carries the leftovers (Tailwind
 * internals, third-party widget variables, etc.) that the consumer reports
 * as "leaving N entries from stock settings."
 */
export interface ClassificationResult {
  readonly byNamespace: Readonly<Record<RaftersImportNamespace, readonly ClassifiedDeclaration[]>>;
  readonly unclassified: readonly CssDeclaration[];
}

/**
 * Compact form of a classification result used by the CLI's sensing log.
 * Counts only; the consumer doesn't need the individual declarations to
 * print the summary.
 */
export interface SensedSummary {
  readonly totalDeclarations: number;
  readonly byNamespace: Readonly<Record<RaftersImportNamespace, number>>;
  readonly namespacesPresent: readonly RaftersImportNamespace[];
  readonly unclassifiedCount: number;
}
