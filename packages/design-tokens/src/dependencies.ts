import type { Token } from '@rafters/shared';
import {
  type CascadeFailure,
  type CascadeResult,
  type Plugin,
  parseGenerationRule,
  runPlugin,
} from './plugins.js';

export interface TokenDependency {
  /** Direct upstream sources this token derives from. Frozen at add time. */
  dependsOn: string[];
  /** Direct downstream consumers. Maintained alongside dependsOn on every add. */
  dependents: string[];
  /** Opaque rule tag (e.g. 'scale:500', 'state:hover', 'calc({base}*2)'). The graph never parses it. */
  generationRule: string;
}

/**
 * Forward-edge DAG over token names with bidirectional indexes maintained on every
 * mutation. Stores `generationRule` per edge as an opaque tag string — never parses
 * it. Rule syntax lives in plugins.
 */
export class TokenDependencyGraph {
  private readonly dependencies = new Map<string, TokenDependency>();

  /** Record forward edges for `tokenName`. Replaces any prior entry. Rejects cycles. */
  addDependency(tokenName: string, dependsOn: readonly string[], rule: string): void {
    const uniqueDependsOn = [...new Set(dependsOn)];
    if (this.wouldCreateCircularDependency(tokenName, uniqueDependsOn)) {
      const error = new Error(`TokenDependencyGraph: cycle detected adding "${tokenName}"`);
      (error as Error & { cause?: unknown }).cause = { code: 'cycle', at: tokenName };
      throw error;
    }

    const existing = this.dependencies.get(tokenName) ?? {
      dependsOn: [],
      dependents: [],
      generationRule: rule,
    };
    const oldDependsOn = [...existing.dependsOn];
    existing.dependsOn = [...uniqueDependsOn];
    existing.generationRule = rule;
    this.dependencies.set(tokenName, existing);

    for (const dep of uniqueDependsOn) {
      const depEntry = this.dependencies.get(dep) ?? {
        dependsOn: [],
        dependents: [],
        generationRule: '',
      };
      if (!depEntry.dependents.includes(tokenName)) depEntry.dependents.push(tokenName);
      this.dependencies.set(dep, depEntry);
    }

    for (const oldDep of oldDependsOn) {
      if (uniqueDependsOn.includes(oldDep)) continue;
      const depEntry = this.dependencies.get(oldDep);
      if (depEntry) depEntry.dependents = depEntry.dependents.filter((d) => d !== tokenName);
    }
  }

  removeToken(tokenName: string): void {
    const entry = this.dependencies.get(tokenName);
    if (!entry) return;
    for (const dep of entry.dependsOn) {
      const depEntry = this.dependencies.get(dep);
      if (depEntry) depEntry.dependents = depEntry.dependents.filter((d) => d !== tokenName);
    }
    for (const dependent of entry.dependents) {
      const dependentEntry = this.dependencies.get(dependent);
      if (dependentEntry) {
        dependentEntry.dependsOn = dependentEntry.dependsOn.filter((d) => d !== tokenName);
      }
    }
    this.dependencies.delete(tokenName);
  }

  getDependencies(tokenName: string): string[] {
    return [...(this.dependencies.get(tokenName)?.dependsOn ?? [])];
  }

  getDependents(tokenName: string): string[] {
    return [...(this.dependencies.get(tokenName)?.dependents ?? [])];
  }

  getGenerationRule(tokenName: string): string | undefined {
    const rule = this.dependencies.get(tokenName)?.generationRule;
    return rule && rule.length > 0 ? rule : undefined;
  }

  getAllTokens(): string[] {
    const all = new Set<string>();
    for (const [name, dep] of this.dependencies) {
      all.add(name);
      for (const d of dep.dependsOn) all.add(d);
      for (const d of dep.dependents) all.add(d);
    }
    return [...all];
  }

  /** Topological order: dependencies before dependents. Throws on cycle. */
  topologicalSort(): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const onStack = new Set<string>();
    const all = this.getAllTokens();

    const visit = (name: string): void => {
      if (visited.has(name)) return;
      if (onStack.has(name)) {
        const error = new Error(`TokenDependencyGraph: cycle at "${name}"`);
        (error as Error & { cause?: unknown }).cause = { code: 'cycle', at: name };
        throw error;
      }
      onStack.add(name);
      for (const dep of this.getDependencies(name)) visit(dep);
      onStack.delete(name);
      visited.add(name);
      order.push(name);
    };

    for (const name of all) visit(name);
    return order;
  }

  clear(): void {
    this.dependencies.clear();
  }

  /**
   * Walk the graph in topological order, dispatching each derived token's
   * `generationRule` tag to the matching plugin. Pure with respect to the registry:
   * takes value getter/setter callbacks; never holds a registry reference.
   *
   * If `startName` is provided, only walks the transitive dependents of that node.
   * Unknown rule tags (no plugin registered) record a failure and continue.
   */
  async cascade(
    plugins: ReadonlyMap<string, Plugin>,
    getValue: (name: string) => Token['value'] | undefined,
    setValue: (name: string, value: Token['value']) => void,
    startName?: string,
  ): Promise<CascadeResult> {
    const recomputed: string[] = [];
    const changed: string[] = [];
    const failures: CascadeFailure[] = [];

    const order = this.topologicalSort();
    const scope = startName ? this.collectDependentsTransitive(startName) : undefined;

    for (const name of order) {
      if (scope && !scope.has(name)) continue;
      const entry = this.dependencies.get(name);
      const rule = entry?.generationRule;
      if (!rule || entry.dependsOn.length === 0) continue;

      const { rule: ruleTag, rawArgs } = parseGenerationRule(rule);
      const plugin = plugins.get(ruleTag);
      if (!plugin) {
        failures.push({
          name,
          code: 'unknown-plugin',
          message: `Token "${name}" requires plugin for rule "${ruleTag}" which is not registered`,
        });
        continue;
      }

      const sourceName = entry.dependsOn[0];
      if (sourceName === undefined) continue;
      const sourceValue = getValue(sourceName);
      if (sourceValue === undefined) {
        failures.push({
          name,
          code: 'missing-source',
          message: `Token "${name}" depends on "${sourceName}" which has no value`,
        });
        continue;
      }

      recomputed.push(name);
      const result = runPlugin(plugin, sourceValue, rawArgs, name);
      if (result.ok) {
        const before = getValue(name);
        if (!valuesEqual(before, result.value)) {
          setValue(name, result.value);
          changed.push(name);
        }
      } else {
        failures.push(result.failure);
      }
    }

    return { recomputed, changed, failures };
  }

  private wouldCreateCircularDependency(tokenName: string, dependsOn: readonly string[]): boolean {
    if (dependsOn.includes(tokenName)) return true;
    const visited = new Set<string>();
    const walk = (name: string): boolean => {
      if (name === tokenName) return true;
      if (visited.has(name)) return false;
      visited.add(name);
      for (const next of this.getDependencies(name)) {
        if (walk(next)) return true;
      }
      return false;
    };
    return dependsOn.some(walk);
  }

  private collectDependentsTransitive(startName: string): Set<string> {
    const out = new Set<string>([startName]);
    const queue: string[] = [startName];
    while (queue.length > 0) {
      const next = queue.shift();
      if (next === undefined) break;
      for (const dependent of this.getDependents(next)) {
        if (out.has(dependent)) continue;
        out.add(dependent);
        queue.push(dependent);
      }
    }
    return out;
  }
}

function valuesEqual(a: Token['value'] | undefined, b: Token['value'] | undefined): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
