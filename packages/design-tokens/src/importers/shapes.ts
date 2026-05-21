/**
 * Shared types across importers.
 */

/**
 * One `--name: value` declaration extracted from source CSS. The leading `--`
 * is stripped from `name`; `value` is the raw text after the colon, trimmed.
 * Order preserved from source so cascade winners can be derived downstream.
 */
export interface CssDeclaration {
  readonly name: string;
  readonly value: string;
}
