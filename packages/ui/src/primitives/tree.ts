/**
 * Tree primitive
 * Headless tree-widget behavior: hierarchy walk, selection, expand/collapse,
 * keyboard navigation, and ARIA prop generation per the WAI-ARIA tree pattern.
 *
 * Composes existing primitives:
 * - roving-focus (tabindex management) — applied via getNodeProps tabIndex
 * - keyboard-handler (key dispatch) — implemented inline; tree's keymap is
 *   tighter than the generic primitive (in/out semantics depend on expansion)
 * - typeahead (first-letter jump) — composed via createControlledTypeahead
 *
 * Cognitive load: 4/15 (medium). Tree widgets carry hierarchy + state; the
 * primitive moves that complexity off the consumer's plate.
 *
 * When to use:
 * - File / folder browsers
 * - Outline / table-of-contents widgets
 * - Settings hierarchies
 * - Taxonomy editors
 *
 * When NOT to use:
 * - Flat lists (use roving-focus directly)
 * - Trees that need server-driven async children (wait for v2 loadChildren)
 * - Drag-drop reordering — compose with drag-drop primitive separately
 * - Data fetching of any kind — that's the consumer's job
 *
 * The primitive does NOT:
 * - Fetch data (no fs, fetch, octokit)
 * - Render or style anything
 * - Implement domain logic (file icons, status badges, etc.)
 * - Virtualize (compose with a virtual-list primitive)
 *
 * WCAG Compliance:
 * - 2.1.1 Keyboard (Level A): Full keyboard nav (arrows, Home/End, Enter, type-ahead)
 * - 2.4.3 Focus Order (Level A): Roving tabindex; logical visible-order traversal
 * - 4.1.2 Name, Role, Value (Level A): role=tree, role=treeitem, role=group, aria-expanded, aria-level, aria-setsize, aria-posinset, aria-selected
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */

import { createControlledTypeahead } from './typeahead';
import type { CleanupFunction } from './types';

/**
 * A node in the tree. Consumers shape `data` however they like.
 *
 * `children` is the materialized child list. Pass an empty array (or omit) for
 * leaves. v1 is synchronous: consumers must materialize children before passing
 * the tree in. v2 will introduce `loadChildren?: () => Promise<TreeNode<T>[]>`
 * + per-node loading state; the sync API stays source-compatible.
 */
export interface TreeNode<T = unknown> {
  /** Stable id, unique across the entire tree */
  id: string;
  /** Consumer-defined payload (file entry, outline heading, etc.) */
  data: T;
  /** Materialized children. Omit or pass empty for leaves. */
  children?: TreeNode<T>[];
  /** Whether this node accepts selection / activation. Defaults to true. */
  disabled?: boolean;
}

/** Selection mode. Default 'single'. */
export type TreeSelectionMode = 'single' | 'multiple' | 'none';

export interface TreeOptions<T = unknown> {
  /** Root nodes. Multi-root is allowed (WAI-ARIA permits multiple roots in one tree). */
  nodes: TreeNode<T>[];
  /** @default 'single' */
  selectionMode?: TreeSelectionMode;
  /** Initial expanded ids */
  defaultExpanded?: string[];
  /** Initial selected ids */
  defaultSelected?: string[];
  /** Initial focused id (default: first node) */
  defaultFocused?: string | null;
  /** Notify when expansion changes */
  onExpandedChange?: (expanded: ReadonlySet<string>) => void;
  /** Notify when selection changes */
  onSelectedChange?: (selected: ReadonlySet<string>) => void;
  /** Notify when focused node changes */
  onFocusChange?: (focused: string | null) => void;
  /**
   * Notify when a node is "activated" (Enter key, or consumer-driven double click).
   * The consumer decides what activate means: open file, navigate, etc.
   */
  onActivate?: (id: string) => void;
}

/** Plain object returned by getRootProps */
export interface TreeRootProps {
  role: 'tree';
}

/** Plain object returned by getNodeProps */
export interface TreeNodeProps {
  role: 'treeitem';
  /** Present only on parent nodes (children > 0) */
  'aria-expanded'?: boolean;
  'aria-level': number;
  'aria-setsize': number;
  'aria-posinset': number;
  /** Present only when selectionMode !== 'none' */
  'aria-selected'?: boolean;
  /** Roving tabindex: 0 for focused node, -1 for the rest */
  tabIndex: number;
}

/** Plain object returned by getGroupProps */
export interface TreeGroupProps {
  role: 'group';
}

export interface TreeAPI<T = unknown> {
  /** Read-only state snapshot */
  readonly state: {
    readonly expanded: ReadonlySet<string>;
    readonly selected: ReadonlySet<string>;
    readonly focused: string | null;
  };
  /** Replace the node list (e.g. after the consumer refetches data) */
  setNodes: (nodes: TreeNode<T>[]) => void;
  /** Programmatic state changes */
  expand: (id: string) => void;
  collapse: (id: string) => void;
  toggle: (id: string) => void;
  select: (id: string, opts?: { append?: boolean; range?: boolean }) => void;
  focus: (id: string) => void;
  activate: (id: string) => void;
  /** Keyboard movers — return the new focused id, or null if no movement */
  moveNext: () => string | null;
  movePrev: () => string | null;
  moveOut: () => string | null;
  moveIn: () => string | null;
  moveFirst: () => string | null;
  moveLast: () => string | null;
  /** Type-ahead first-letter jump. Returns matched id or null. */
  typeahead: (char: string) => string | null;
  /** Generic key handler — dispatches to the movers + activate. */
  handleKeyDown: (event: KeyboardEvent) => void;
  /** ARIA prop getters */
  getRootProps: () => TreeRootProps;
  getNodeProps: (id: string) => TreeNodeProps;
  getGroupProps: (parentId: string) => TreeGroupProps;
}

interface FlatEntry<T> {
  node: TreeNode<T>;
  level: number;
  parentId: string | null;
  /** 1-based index within parent's child list (for aria-posinset) */
  posInSet: number;
  /** Total siblings (for aria-setsize) */
  setSize: number;
}

/**
 * Walk the visible (expanded) nodes in DFS order. Excludes children of
 * collapsed nodes. Used for next/prev movement.
 */
function flattenVisible<T>(nodes: TreeNode<T>[], expanded: ReadonlySet<string>): FlatEntry<T>[] {
  const out: FlatEntry<T>[] = [];
  const walk = (siblings: TreeNode<T>[], level: number, parentId: string | null) => {
    const setSize = siblings.length;
    for (let i = 0; i < siblings.length; i++) {
      const node = siblings[i];
      if (!node) continue;
      out.push({ node, level, parentId, posInSet: i + 1, setSize });
      if (node.children && node.children.length > 0 && expanded.has(node.id)) {
        walk(node.children, level + 1, node.id);
      }
    }
  };
  walk(nodes, 1, null);
  return out;
}

/** Build a quick lookup of every node by id, regardless of expansion. */
function indexNodes<T>(nodes: TreeNode<T>[]): Map<string, FlatEntry<T>> {
  const map = new Map<string, FlatEntry<T>>();
  const walk = (siblings: TreeNode<T>[], level: number, parentId: string | null) => {
    const setSize = siblings.length;
    for (let i = 0; i < siblings.length; i++) {
      const node = siblings[i];
      if (!node) continue;
      map.set(node.id, { node, level, parentId, posInSet: i + 1, setSize });
      if (node.children && node.children.length > 0) {
        walk(node.children, level + 1, node.id);
      }
    }
  };
  walk(nodes, 1, null);
  return map;
}

function firstSelectableId<T>(entries: FlatEntry<T>[]): string | null {
  for (const e of entries) {
    if (!e.node.disabled) return e.node.id;
  }
  return null;
}

/**
 * Create a headless tree controller. No DOM, no JSX — the consumer wires
 * the returned `getNodeProps` / `getGroupProps` / `getRootProps` and
 * `handleKeyDown` to whatever rendering layer they're using.
 *
 * @example Basic React consumer
 * ```tsx
 * const tree = createTree({ nodes, onActivate: (id) => openFile(id) });
 * const visible = flattenVisible(nodes, tree.state.expanded); // or use a render walker
 *
 * function Node({ entry }) {
 *   const props = tree.getNodeProps(entry.node.id);
 *   return (
 *     <li {...props} onClick={() => tree.focus(entry.node.id)}>
 *       {entry.node.data.label}
 *       {entry.node.children?.length ? (
 *         <ul {...tree.getGroupProps(entry.node.id)}>...</ul>
 *       ) : null}
 *     </li>
 *   );
 * }
 *
 * return <ul {...tree.getRootProps()} onKeyDown={tree.handleKeyDown}>...</ul>;
 * ```
 */
export function createTree<T = unknown>(options: TreeOptions<T>): TreeAPI<T> {
  const {
    selectionMode = 'single',
    defaultExpanded = [],
    defaultSelected = [],
    defaultFocused = null,
    onExpandedChange,
    onSelectedChange,
    onFocusChange,
    onActivate,
  } = options;

  let nodes = options.nodes;
  let index = indexNodes(nodes);
  const expanded = new Set<string>(defaultExpanded);
  const selected = new Set<string>(selectionMode === 'none' ? [] : defaultSelected);
  let focused: string | null = defaultFocused ?? firstSelectableId(flattenVisible(nodes, expanded));
  /** Anchor id for shift-range selection */
  let rangeAnchor: string | null = focused;

  const emitExpanded = () => onExpandedChange?.(new Set(expanded));
  const emitSelected = () => onSelectedChange?.(new Set(selected));
  const emitFocus = () => onFocusChange?.(focused);

  const visible = (): FlatEntry<T>[] => flattenVisible(nodes, expanded);

  const visibleIndexOf = (id: string | null): number => {
    if (id === null) return -1;
    const v = visible();
    for (let i = 0; i < v.length; i++) {
      const entry = v[i];
      if (entry && entry.node.id === id) return i;
    }
    return -1;
  };

  const setFocus = (id: string | null): string | null => {
    if (id === focused) return id;
    focused = id;
    emitFocus();
    return id;
  };

  const setNodes = (next: TreeNode<T>[]): void => {
    nodes = next;
    index = indexNodes(nodes);
    // Drop expanded / selected / focused entries that no longer exist.
    for (const id of Array.from(expanded)) if (!index.has(id)) expanded.delete(id);
    let selectedChanged = false;
    for (const id of Array.from(selected))
      if (!index.has(id)) {
        selected.delete(id);
        selectedChanged = true;
      }
    if (focused !== null && !index.has(focused)) {
      focused = firstSelectableId(visible());
      emitFocus();
    }
    if (selectedChanged) emitSelected();
    emitExpanded();
  };

  const expand = (id: string): void => {
    const entry = index.get(id);
    if (!entry || !entry.node.children || entry.node.children.length === 0) return;
    if (expanded.has(id)) return;
    expanded.add(id);
    emitExpanded();
  };

  const collapse = (id: string): void => {
    if (!expanded.has(id)) return;
    expanded.delete(id);
    emitExpanded();
  };

  const toggle = (id: string): void => {
    if (expanded.has(id)) collapse(id);
    else expand(id);
  };

  /**
   * Compute the visible-flat range between two ids (inclusive). Returns ids in
   * visible order. If either id is not visible, returns [].
   */
  const rangeBetween = (a: string, b: string): string[] => {
    const v = visible();
    let aIdx = -1;
    let bIdx = -1;
    for (let i = 0; i < v.length; i++) {
      const entry = v[i];
      if (!entry) continue;
      if (entry.node.id === a) aIdx = i;
      if (entry.node.id === b) bIdx = i;
    }
    if (aIdx === -1 || bIdx === -1) return [];
    const [from, to] = aIdx <= bIdx ? [aIdx, bIdx] : [bIdx, aIdx];
    const out: string[] = [];
    for (let i = from; i <= to; i++) {
      const entry = v[i];
      if (entry && !entry.node.disabled) out.push(entry.node.id);
    }
    return out;
  };

  const select = (id: string, opts: { append?: boolean; range?: boolean } = {}): void => {
    if (selectionMode === 'none') return;
    const entry = index.get(id);
    if (!entry || entry.node.disabled) return;

    if (selectionMode === 'single') {
      if (selected.size === 1 && selected.has(id)) return;
      selected.clear();
      selected.add(id);
      rangeAnchor = id;
      emitSelected();
      return;
    }

    // multiple
    if (opts.range && rangeAnchor !== null) {
      const ids = rangeBetween(rangeAnchor, id);
      if (ids.length === 0) return;
      selected.clear();
      for (const i of ids) selected.add(i);
      emitSelected();
      return;
    }

    if (opts.append) {
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      rangeAnchor = id;
      emitSelected();
      return;
    }

    // plain click in multi-select replaces the selection
    selected.clear();
    selected.add(id);
    rangeAnchor = id;
    emitSelected();
  };

  const focus = (id: string): void => {
    const entry = index.get(id);
    if (!entry || entry.node.disabled) return;
    setFocus(id);
  };

  const activate = (id: string): void => {
    const entry = index.get(id);
    if (!entry || entry.node.disabled) return;
    onActivate?.(id);
  };

  const moveNext = (): string | null => {
    const v = visible();
    if (v.length === 0) return null;
    const start = visibleIndexOf(focused);
    for (let i = start + 1; i < v.length; i++) {
      const entry = v[i];
      if (entry && !entry.node.disabled) return setFocus(entry.node.id);
    }
    return focused;
  };

  const movePrev = (): string | null => {
    const v = visible();
    if (v.length === 0) return null;
    const start = visibleIndexOf(focused);
    const from = start === -1 ? v.length : start;
    for (let i = from - 1; i >= 0; i--) {
      const entry = v[i];
      if (entry && !entry.node.disabled) return setFocus(entry.node.id);
    }
    return focused;
  };

  const moveOut = (): string | null => {
    if (focused === null) return null;
    const entry = index.get(focused);
    if (!entry) return focused;
    // If currently expanded with children: collapse instead of moving.
    if (entry.node.children && entry.node.children.length > 0 && expanded.has(focused)) {
      collapse(focused);
      return focused;
    }
    // Otherwise move to parent (if any).
    if (entry.parentId !== null) {
      return setFocus(entry.parentId);
    }
    return focused;
  };

  const moveIn = (): string | null => {
    if (focused === null) return null;
    const entry = index.get(focused);
    if (!entry || !entry.node.children || entry.node.children.length === 0) return focused;
    if (!expanded.has(focused)) {
      expand(focused);
      return focused;
    }
    // Already expanded: move to first child.
    for (const child of entry.node.children) {
      if (!child.disabled) return setFocus(child.id);
    }
    return focused;
  };

  const moveFirst = (): string | null => {
    const v = visible();
    for (const entry of v) {
      if (!entry.node.disabled) return setFocus(entry.node.id);
    }
    return focused;
  };

  const moveLast = (): string | null => {
    const v = visible();
    for (let i = v.length - 1; i >= 0; i--) {
      const entry = v[i];
      if (entry && !entry.node.disabled) return setFocus(entry.node.id);
    }
    return focused;
  };

  /**
   * Type-ahead matching uses the typeahead primitive's prefix mode against
   * the visible nodes' aria-label or text representation. Consumers control
   * the text via a getNodeText option in a future extension; v1 reads
   * `data` as a string when possible, otherwise falls back to id.
   */
  const typeaheadController = createControlledTypeahead({
    getItems: () => {
      // Synthesize iterable HTMLElements. We don't have real DOM here; instead
      // we expose tiny shims carrying the text and id. The typeahead primitive
      // only reads textContent / aria-label on these, so a minimal stand-in works.
      const v = visible();
      return v.map((entry) => {
        const text = nodeText(entry.node);
        const shim = { textContent: text, getAttribute: () => null, hasAttribute: () => false };
        // Cast through unknown — typeahead's contract is "read-only text source".
        return shim as unknown as HTMLElement;
      });
    },
    onMatch: (_item, idx) => {
      const v = visible();
      const entry = v[idx];
      if (entry && !entry.node.disabled) setFocus(entry.node.id);
    },
  });

  const typeahead = (char: string): string | null => {
    if (char.length !== 1) return focused;
    const before = focused;
    typeaheadController.handleKeyDown(new KeyboardEvent('keydown', { key: char }));
    return focused !== before ? focused : null;
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      // Modifier-key combos are consumer-owned (cmd-click select, etc.).
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveNext();
        return;
      case 'ArrowUp':
        event.preventDefault();
        movePrev();
        return;
      case 'ArrowRight':
        event.preventDefault();
        moveIn();
        return;
      case 'ArrowLeft':
        event.preventDefault();
        moveOut();
        return;
      case 'Home':
        event.preventDefault();
        moveFirst();
        return;
      case 'End':
        event.preventDefault();
        moveLast();
        return;
      case 'Enter':
        event.preventDefault();
        if (focused !== null) {
          if (selectionMode !== 'none') select(focused);
          activate(focused);
        }
        return;
      case ' ':
        event.preventDefault();
        if (focused !== null && selectionMode !== 'none') {
          select(focused, { append: selectionMode === 'multiple' && event.shiftKey === false });
        }
        return;
      default:
        // Single-char keys feed typeahead. Skip whitespace and modifier-chars.
        if (event.key.length === 1 && event.key !== ' ') {
          typeaheadController.handleKeyDown(event);
        }
        return;
    }
  };

  const getRootProps = (): TreeRootProps => ({ role: 'tree' });

  const getNodeProps = (id: string): TreeNodeProps => {
    const entry = index.get(id);
    if (!entry) {
      return {
        role: 'treeitem',
        'aria-level': 1,
        'aria-setsize': 0,
        'aria-posinset': 0,
        tabIndex: -1,
      };
    }
    const hasChildren = !!(entry.node.children && entry.node.children.length > 0);
    const props: TreeNodeProps = {
      role: 'treeitem',
      'aria-level': entry.level,
      'aria-setsize': entry.setSize,
      'aria-posinset': entry.posInSet,
      tabIndex: focused === id ? 0 : -1,
    };
    if (hasChildren) {
      props['aria-expanded'] = expanded.has(id);
    }
    if (selectionMode !== 'none') {
      props['aria-selected'] = selected.has(id);
    }
    return props;
  };

  const getGroupProps = (_parentId: string): TreeGroupProps => ({ role: 'group' });

  const stateView = {
    get expanded() {
      return expanded as ReadonlySet<string>;
    },
    get selected() {
      return selected as ReadonlySet<string>;
    },
    get focused() {
      return focused;
    },
  };

  return {
    state: stateView,
    setNodes,
    expand,
    collapse,
    toggle,
    select,
    focus,
    activate,
    moveNext,
    movePrev,
    moveOut,
    moveIn,
    moveFirst,
    moveLast,
    typeahead,
    handleKeyDown,
    getRootProps,
    getNodeProps,
    getGroupProps,
  };
}

/**
 * Best-effort text extraction for typeahead. If the consumer's data is a
 * string, use it; if it's `{ label }` or `{ name }`, use that. Otherwise
 * fall back to the node id so typeahead at least does something useful.
 *
 * Consumers wanting custom text should bypass `typeahead()` and feed their
 * own labels via the typeahead primitive directly.
 */
function nodeText<T>(node: TreeNode<T>): string {
  const data = node.data as unknown;
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (typeof obj.label === 'string') return obj.label;
    if (typeof obj.name === 'string') return obj.name;
    if (typeof obj.title === 'string') return obj.title;
  }
  return node.id;
}

/**
 * Walk the visible (expanded) entries — exported for consumers that want to
 * render in DFS order without re-implementing the walker.
 */
export function getVisibleEntries<T>(
  nodes: TreeNode<T>[],
  expanded: ReadonlySet<string>,
): FlatEntry<T>[] {
  return flattenVisible(nodes, expanded);
}

export type { FlatEntry as TreeFlatEntry };

/**
 * DOM-attached convenience wrapper. Wires `handleKeyDown` to the container
 * element. Consumers typically don't need this — they wire keys via their
 * framework's onKeyDown binding. Provided for parity with sibling primitives
 * (createRovingFocus, createTypeahead) that ship both forms.
 *
 * Returns a cleanup function plus the underlying TreeAPI.
 */
export function attachTree<T = unknown>(
  container: HTMLElement,
  options: TreeOptions<T>,
): { api: TreeAPI<T>; cleanup: CleanupFunction } {
  const api = createTree(options);
  if (typeof window === 'undefined') {
    return { api, cleanup: () => {} };
  }
  const onKeyDown = (event: KeyboardEvent) => api.handleKeyDown(event);
  container.addEventListener('keydown', onKeyDown);
  return {
    api,
    cleanup: () => {
      container.removeEventListener('keydown', onKeyDown);
    },
  };
}
