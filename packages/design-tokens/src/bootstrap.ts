/**
 * Install-time validation gate.
 *
 * Lifts the four invariants of a healthy design-token graph from "runtime
 * surfaces them as confusing cascade failures" up to "build refuses to start
 * with a clear, structured error":
 *
 *   1. No name collision between generators
 *   2. Every dependsOn target resolves to a real token
 *   3. Every token with a rule produces an input the plugin's schema accepts
 *   4. The graph is a DAG (no cycles)
 *
 * Runs in collect-all mode: gathers every failure across all four checks
 * before returning, so a single build surfaces the full picture instead of
 * forcing iterative fix/run/fix loops. Runtime stays fail-fast (cascade);
 * install is whole-or-nothing.
 *
 * No `class BuildError extends Error`. Per #1242 invariant: structured data
 * on `Error.cause` only. Callers receive a discriminated-union value.
 *
 * See rafters #1442. Closes #1229 / #1231 once consumers route through this.
 */

import type { Token } from '@rafters/shared';
import { TokenDependencyGraph } from './dependencies';
import { GenerationRuleParser } from './generation-rules';
import { getPlugin, resolveInput } from './plugins';
import { TokenRegistry } from './registry';

/**
 * One generator's output. The generator name is carried so collision and
 * unresolved-dependsOn errors can name their source.
 */
export interface GeneratorOutput {
  name: string;
  tokens: Token[];
}

export type BuildError =
  | {
      code: 'collision';
      tokenName: string;
      generators: [string, string];
    }
  | {
      code: 'unresolved-dependsOn';
      tokenName: string;
      missingDependency: string;
      sourceGenerator: string;
    }
  | {
      code: 'shape-mismatch';
      tokenName: string;
      pluginId: string;
      ruleString: string;
      zodIssues: Array<{ path: Array<string | number>; message: string; expected?: string }>;
    }
  | {
      code: 'cycle';
      cyclePath: string[];
    };

export type BootstrapResult =
  | { isValid: true; tokens: Token[] }
  | { isValid: false; errors: BuildError[] };

/**
 * Validate generator outputs as a single graph. Returns the assembled token
 * list on success, a list of BuildErrors on failure. Errors from independent
 * checks are collected; one bad token does not hide problems in another.
 */
export function bootstrap(generatorOutputs: GeneratorOutput[]): BootstrapResult {
  const errors: BuildError[] = [];

  // 1. Name-collision check + assemble unique-token map keyed by name.
  const tokenSource = new Map<string, string>();
  const tokens = new Map<string, Token>();
  for (const { name: generatorName, tokens: generatorTokens } of generatorOutputs) {
    for (const token of generatorTokens) {
      const prior = tokenSource.get(token.name);
      if (prior !== undefined) {
        errors.push({
          code: 'collision',
          tokenName: token.name,
          generators: [prior, generatorName],
        });
        continue;
      }
      tokenSource.set(token.name, generatorName);
      tokens.set(token.name, token);
    }
  }

  // 2. DependsOn-resolvable check. Every dep target must be in the assembled set.
  for (const [tokenName, token] of tokens.entries()) {
    if (!token.dependsOn) continue;
    for (const dep of token.dependsOn) {
      if (!tokens.has(dep)) {
        errors.push({
          code: 'unresolved-dependsOn',
          tokenName,
          missingDependency: dep,
          sourceGenerator: tokenSource.get(tokenName) ?? '<unknown>',
        });
      }
    }
  }

  // 3. Cycle check. Build a temp graph and run topological sort.
  const graph = new TokenDependencyGraph();
  try {
    for (const [tokenName, token] of tokens.entries()) {
      if (token.dependsOn && token.dependsOn.length > 0) {
        // Filter to known deps so unresolved-dependsOn does not double-report
        // here. The unresolved check above already named the missing edges.
        const resolvable = token.dependsOn.filter((d) => tokens.has(d));
        graph.addDependency(tokenName, resolvable, token.generationRule ?? '');
      }
    }
    graph.topologicalSort();
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    errors.push({
      code: 'cycle',
      cyclePath: extractCyclePath(message),
    });
  }

  // 4. Shape-contract check. For each token with a rule, run resolveInput
  // and parse the output against the plugin's input schema. A registry is
  // built from the assembled tokens; resolveInput's reads come from there.
  const allTokens = Array.from(tokens.values());
  const ruleParser = new GenerationRuleParser();
  if (allTokens.length > 0) {
    const registry = new TokenRegistry(allTokens);
    for (const token of allTokens) {
      if (!token.generationRule) continue;

      let parsed: ReturnType<GenerationRuleParser['parse']>;
      try {
        parsed = ruleParser.parse(token.generationRule);
      } catch {
        // Invalid rule syntax is caught elsewhere via validateRule; do not
        // double-report here.
        continue;
      }

      const plugin = getPlugin(parsed.type);
      if (!plugin) continue;

      let raw: unknown;
      try {
        raw = resolveInput(registry, parsed, token.name);
      } catch (e) {
        errors.push({
          code: 'shape-mismatch',
          tokenName: token.name,
          pluginId: parsed.type,
          ruleString: token.generationRule,
          zodIssues: [
            {
              path: [],
              message: e instanceof Error ? e.message : String(e),
            },
          ],
        });
        continue;
      }

      const result = plugin.input.safeParse(raw);
      if (!result.success) {
        errors.push({
          code: 'shape-mismatch',
          tokenName: token.name,
          pluginId: parsed.type,
          ruleString: token.generationRule,
          zodIssues: result.error.issues.map((issue) => ({
            path: issue.path.map((p): string | number => (typeof p === 'number' ? p : String(p))),
            message: issue.message,
            ...('expected' in issue ? { expected: String(issue.expected) } : {}),
          })),
        });
      }
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  return { isValid: true, tokens: allTokens };
}

/**
 * Pulls the cycle node names from a topological-sort error message. Best-effort
 * -- the message format is owned by `topologicalSort`. Returns an empty array
 * if the message does not carry path data.
 */
function extractCyclePath(message: string): string[] {
  const match = message.match(/cycle.*detected.*?(\b[\w-]+(?:\s*->\s*[\w-]+)*)/i);
  if (!match || !match[1]) return [];
  return match[1].split(/\s*->\s*/).filter((s) => s.length > 0);
}

/**
 * Throw a structured build error from a BuildError list. Use this when the
 * caller cannot proceed with an invalid graph and needs propagation up the
 * stack. The thrown Error carries the BuildError list on `cause`.
 */
export function throwOnInvalid(
  result: BootstrapResult,
): asserts result is { isValid: true; tokens: Token[] } {
  if (!result.isValid) {
    throw new Error(
      `bootstrap: design-token graph failed validation (${result.errors.length} error${result.errors.length === 1 ? '' : 's'})`,
      {
        cause: {
          code: 'bootstrap-invalid',
          errors: result.errors,
        },
      },
    );
  }
}
