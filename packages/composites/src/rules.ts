/**
 * Rule name matching
 *
 * Checks whether composites can connect based on named I/O rules.
 * Matching is by exact name, not structural type comparison.
 */

import type { CompositeFile } from './manifest';

export interface RuleMatch {
  /** Rules that match between output and input */
  matched: string[];
  /** Rules required by input but not produced by output */
  missing: string[];
  /** Rules produced by output but not required by input */
  extra: string[];
  /** Whether all input requirements are satisfied */
  compatible: boolean;
}

/**
 * Check if producer's output satisfies consumer's input.
 */
export function matchRules(producer: CompositeFile, consumer: CompositeFile): RuleMatch {
  const outputSet = new Set(producer.output);
  const inputSet = new Set(consumer.input);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const rule of consumer.input) {
    if (outputSet.has(rule)) {
      matched.push(rule);
    } else {
      missing.push(rule);
    }
  }

  const extra: string[] = [];
  for (const rule of producer.output) {
    if (!inputSet.has(rule)) {
      extra.push(rule);
    }
  }

  return { matched, missing, extra, compatible: missing.length === 0 };
}

/**
 * Find all composites that can consume the output of the given producer.
 */
export function findCompatibleConsumers(
  producer: CompositeFile,
  candidates: CompositeFile[],
): CompositeFile[] {
  return candidates.filter((candidate) => matchRules(producer, candidate).compatible);
}

/**
 * Find all composites that can produce the input required by the given consumer.
 */
export function findCompatibleProducers(
  consumer: CompositeFile,
  candidates: CompositeFile[],
): CompositeFile[] {
  return candidates.filter((candidate) => matchRules(candidate, consumer).compatible);
}
