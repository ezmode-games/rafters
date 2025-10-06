/**
 * Rafters Primitive Registry
 * Type-safe component metadata management with dependency tracking
 *
 * @registryType registry:core
 * @registryVersion 0.1.0
 */

import type {
  CircularDependencyError,
  ComponentCategory,
  DependencyNode,
  Framework,
  PrimitiveRegistryEntry,
  PrimitiveStatus,
  RegistryQuery,
  WCAGLevel,
} from './types';

/**
 * Registry event types
 */
export type RegistryEventType = 'primitive-added' | 'primitive-updated' | 'primitive-removed';

/**
 * Registry event
 */
export interface RegistryEvent {
  type: RegistryEventType;
  primitive: string;
  timestamp: string;
}

/**
 * Registry event callback
 */
export type RegistryEventCallback = (event: RegistryEvent) => void;

/**
 * Primitive Registry Class
 * Manages component metadata with intelligent querying and dependency tracking
 */
export class PrimitiveRegistry {
  private primitives: Map<string, PrimitiveRegistryEntry> = new Map();
  private dependencyGraph: Map<string, DependencyNode> = new Map();
  private listeners: Map<RegistryEventType, Set<RegistryEventCallback>> = new Map();

  constructor(entries: PrimitiveRegistryEntry[] = []) {
    for (const entry of entries) {
      this.register(entry);
    }
  }

  /**
   * Register a primitive in the registry
   */
  register(entry: PrimitiveRegistryEntry): void {
    const existing = this.primitives.get(entry.name);

    this.primitives.set(entry.name, entry);
    this.updateDependencyGraph(entry);

    // Check for circular dependencies
    const circular = this.detectCircularDependencies();
    if (circular) {
      // Rollback registration
      if (existing) {
        this.primitives.set(entry.name, existing);
      } else {
        this.primitives.delete(entry.name);
      }
      this.rebuildDependencyGraph();
      throw new Error(`Circular dependency detected: ${circular.cycle.join(' -> ')}`);
    }

    this.emit(existing ? 'primitive-updated' : 'primitive-added', entry.name);
  }

  /**
   * Remove a primitive from registry
   */
  unregister(name: string): boolean {
    const entry = this.primitives.get(name);
    if (!entry) {
      return false;
    }

    // Check if other primitives depend on this one
    const dependents = this.getDependents(name);
    if (dependents.length > 0) {
      throw new Error(
        `Cannot remove ${name} because it is depended on by: ${dependents.join(', ')}`
      );
    }

    this.primitives.delete(name);
    this.dependencyGraph.delete(name);
    this.emit('primitive-removed', name);

    return true;
  }

  /**
   * Get a primitive by name
   */
  get(name: string): PrimitiveRegistryEntry | undefined {
    return this.primitives.get(name);
  }

  /**
   * Get all primitives
   */
  getAll(): PrimitiveRegistryEntry[] {
    return Array.from(this.primitives.values());
  }

  /**
   * Query primitives with filters
   */
  query(filters: RegistryQuery): PrimitiveRegistryEntry[] {
    let results = this.getAll();

    if (filters.name) {
      const filterName = filters.name;
      results = results.filter((p) => p.name.includes(filterName));
    }

    if (filters.category) {
      results = results.filter((p) => p.category === filters.category);
    }

    if (filters.status) {
      results = results.filter((p) => p.status === filters.status);
    }

    if (filters.maxCognitiveLoad !== undefined) {
      const maxLoad = filters.maxCognitiveLoad;
      results = results.filter((p) => p.cognitiveLoad <= maxLoad);
    }

    if (filters.wcagLevel) {
      results = results.filter((p) => p.accessibility.wcagLevel === filters.wcagLevel);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((p) => filters.tags?.some((tag) => p.tags.includes(tag)));
    }

    if (filters.framework) {
      results = results.filter((p) => p.sources.some((s) => s.framework === filters.framework));
    }

    return results;
  }

  /**
   * Get primitives by category
   */
  getByCategory(category: ComponentCategory): PrimitiveRegistryEntry[] {
    return this.query({ category });
  }

  /**
   * Get primitives by status
   */
  getByStatus(status: PrimitiveStatus): PrimitiveRegistryEntry[] {
    return this.query({ status });
  }

  /**
   * Get primitives by WCAG level
   */
  getByWCAGLevel(level: WCAGLevel): PrimitiveRegistryEntry[] {
    return this.query({ wcagLevel: level });
  }

  /**
   * Get primitives by framework support
   */
  getByFramework(framework: Framework): PrimitiveRegistryEntry[] {
    return this.query({ framework });
  }

  /**
   * Get direct dependencies of a primitive
   */
  getDependencies(name: string): string[] {
    const node = this.dependencyGraph.get(name);
    return node ? node.dependencies : [];
  }

  /**
   * Get all primitives that depend on this one
   */
  getDependents(name: string): string[] {
    const node = this.dependencyGraph.get(name);
    return node ? node.dependents : [];
  }

  /**
   * Get complete dependency tree (recursive)
   */
  getDependencyTree(name: string): string[] {
    const visited = new Set<string>();
    const tree: string[] = [];

    const traverse = (current: string): void => {
      if (visited.has(current)) return;
      visited.add(current);

      const deps = this.getDependencies(current);
      for (const dep of deps) {
        traverse(dep);
        if (!tree.includes(dep)) {
          tree.push(dep);
        }
      }
    };

    traverse(name);
    return tree;
  }

  /**
   * Get dependency depth for a primitive
   */
  getDependencyDepth(name: string): number {
    const node = this.dependencyGraph.get(name);
    return node ? node.depth : 0;
  }

  /**
   * Update dependency graph for a primitive
   */
  private updateDependencyGraph(entry: PrimitiveRegistryEntry): void {
    const node: DependencyNode = {
      name: entry.name,
      dependencies: entry.dependencies,
      dependents: [],
      depth: 0,
    };

    // Update dependents for dependencies
    for (const dep of entry.dependencies) {
      const depNode = this.dependencyGraph.get(dep);
      if (depNode) {
        if (!depNode.dependents.includes(entry.name)) {
          depNode.dependents.push(entry.name);
        }
      }
    }

    // Calculate depth
    node.depth = this.calculateDepth(entry.name, entry.dependencies);

    this.dependencyGraph.set(entry.name, node);
  }

  /**
   * Calculate dependency depth
   */
  private calculateDepth(
    name: string,
    dependencies: string[],
    visited: Set<string> = new Set()
  ): number {
    if (visited.has(name)) {
      return 0;
    }
    visited.add(name);

    if (dependencies.length === 0) {
      return 0;
    }

    let maxDepth = 0;
    for (const dep of dependencies) {
      const depNode = this.dependencyGraph.get(dep);
      if (depNode) {
        const depth = this.calculateDepth(dep, depNode.dependencies, visited);
        maxDepth = Math.max(maxDepth, depth + 1);
      }
    }

    return maxDepth;
  }

  /**
   * Rebuild complete dependency graph
   */
  private rebuildDependencyGraph(): void {
    this.dependencyGraph.clear();
    for (const entry of this.primitives.values()) {
      this.updateDependencyGraph(entry);
    }
  }

  /**
   * Detect circular dependencies
   */
  private detectCircularDependencies(): CircularDependencyError | null {
    for (const name of this.primitives.keys()) {
      const cycle = this.findCycle(name);
      if (cycle) {
        return {
          cycle,
          message: `Circular dependency: ${cycle.join(' -> ')}`,
        };
      }
    }
    return null;
  }

  /**
   * Find cycle starting from a node
   */
  private findCycle(
    start: string,
    visited: Set<string> = new Set(),
    path: string[] = []
  ): string[] | null {
    if (path.includes(start)) {
      return [...path.slice(path.indexOf(start)), start];
    }

    if (visited.has(start)) {
      return null;
    }

    visited.add(start);
    path.push(start);

    const deps = this.getDependencies(start);
    for (const dep of deps) {
      const cycle = this.findCycle(dep, visited, [...path]);
      if (cycle) {
        return cycle;
      }
    }

    return null;
  }

  /**
   * Subscribe to registry events
   */
  on(event: RegistryEventType, callback: RegistryEventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)?.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * Emit registry event
   */
  private emit(type: RegistryEventType, primitive: string): void {
    const event: RegistryEvent = {
      type,
      primitive,
      timestamp: new Date().toISOString(),
    };

    const listeners = this.listeners.get(type);
    if (listeners) {
      for (const callback of listeners) {
        callback(event);
      }
    }
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    total: number;
    byCategory: Record<ComponentCategory, number>;
    byStatus: Record<PrimitiveStatus, number>;
    avgCognitiveLoad: number;
    wcagCompliance: Record<WCAGLevel, number>;
  } {
    const all = this.getAll();

    const byCategory = {} as Record<ComponentCategory, number>;
    const byStatus = {} as Record<PrimitiveStatus, number>;
    const wcagCompliance = {} as Record<WCAGLevel, number>;

    let totalCognitiveLoad = 0;

    for (const primitive of all) {
      byCategory[primitive.category] = (byCategory[primitive.category] || 0) + 1;
      byStatus[primitive.status] = (byStatus[primitive.status] || 0) + 1;
      wcagCompliance[primitive.accessibility.wcagLevel] =
        (wcagCompliance[primitive.accessibility.wcagLevel] || 0) + 1;
      totalCognitiveLoad += primitive.cognitiveLoad;
    }

    return {
      total: all.length,
      byCategory,
      byStatus,
      avgCognitiveLoad: all.length > 0 ? totalCognitiveLoad / all.length : 0,
      wcagCompliance,
    };
  }

  /**
   * Export registry to JSON
   */
  toJSON(): Record<string, PrimitiveRegistryEntry> {
    const result: Record<string, PrimitiveRegistryEntry> = {};
    for (const [name, entry] of this.primitives) {
      result[name] = entry;
    }
    return result;
  }

  /**
   * Clear all primitives
   */
  clear(): void {
    this.primitives.clear();
    this.dependencyGraph.clear();
  }

  /**
   * Get size of registry
   */
  get size(): number {
    return this.primitives.size;
  }
}
