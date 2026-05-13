/**
 * Tree primitive - headless WAI-ARIA tree state machine
 *
 * Pure state machine for hierarchical lists. Owns expansion, focus,
 * selection (single/multi/range), keyboard movement, typeahead, and
 * the ARIA prop bag for `tree`, `treeitem`, and `group`. Does not own
 * data fetching, rendering, or drag-and-drop -- consumers wire those.
 *
 * WCAG / ARIA Compliance:
 * - WAI-ARIA Authoring Practices: Tree View pattern
 * - 2.1.1 Keyboard (Level A): Arrow keys, Home/End, typeahead all available
 * - 4.1.2 Name, Role, Value (Level A): role/level/setsize/posinset/expanded/selected
 *   surfaced through `getRootProps`, `getGroupProps`, and `getNodeProps`.
 *
 * Multi-root: ARIA `tree` permits multiple top-level `treeitem` children.
 * `nodes` is an array; pass more than one root and selection / movement
 * traverse all of them in document order.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 *
 * @registry-name tree
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path primitives/tree.ts
 * @registry-type registry:primitive
 *
 * @cognitive-load 6/10 - Hierarchical state machine. Consumers reason about
 *   nodes/expanded/selected/focused; the primitive hides the WAI-ARIA detail
 *   behind getRootProps/getGroupProps/getNodeProps.
 * @attention-economics One source of truth for expansion + selection + focus;
 *   consumer renders, primitive decides.
 * @trust-building Predictable keyboard model matches OS file trees: Arrow
 *   Right expands then descends, Arrow Left collapses then ascends, range
 *   selection follows visible (flattened) order.
 * @accessibility Emits role="tree" on the root, role="group" on subtree
 *   wrappers, role="treeitem" plus aria-level/setsize/posinset/expanded/selected
 *   on items, and roving tabIndex (0 on focused, -1 elsewhere).
 * @semantic-meaning Hierarchy + selection + focus, not presentation.
 *
 * @when-to-use
 * - File explorers, content trees, nested navigation where users need to
 *   expand/collapse and select nodes.
 * - Any list whose items have parent/child structure and benefit from
 *   keyboard traversal that mirrors the visible hierarchy.
 *
 * @when-not-to-use
 * - Flat lists -- use a roving-focus list or listbox instead.
 * - Async-loaded children today (v1 is sync). The future
 *   `loadChildren?: (id) => Promise<TreeNode<T>[]>` extension is planned for
 *   v2; until then, pre-load children and pass the full tree.
 * - Drag-and-drop reordering -- this primitive exposes ids and order;
 *   compose with `drag-drop.ts` and let the consumer commit the move.
 *
 * @dependencies
 * @devDependencies
 * @internal-dependencies
 *
 * @usage-patterns
 * DO: Use createTree to manage expansion, focus, selection, and ARIA props
 *   for any hierarchical list.
 * DO: Spread `getRootProps()`, `getGroupProps(parentId)`, and
 *   `getNodeProps(id)` onto your rendered elements -- the primitive owns
 *   the WAI-ARIA contract.
 * DO: Drive movement from keyboard handlers (`moveNext`, `movePrev`,
 *   `moveIn`, `moveOut`, `moveFirst`, `moveLast`, `typeahead`).
 * DO: Pass `selectionMode: 'multiple'` for range/append selection; default
 *   is single.
 * NEVER: Mutate `state.expanded` / `state.selected` directly -- use
 *   `expand`, `collapse`, `toggle`, `select`, `focus`, `activate`.
 * NEVER: Reuse `selection.ts` -- that primitive is editor-DOM /
 *   contenteditable specific. Tree selection is hierarchy-aware.
 * NEVER: Wire async children via this primitive in v1 -- pre-resolve and
 *   pass a fully-populated `nodes` tree.
 *
 * @example
 * ```ts
 * const tree = createTree({
 *   nodes: [
 *     { id: 'src', data: { name: 'src' }, children: [
 *       { id: 'src/index.ts', data: { name: 'index.ts' } },
 *     ]},
 *   ],
 *   defaultExpanded: ['src'],
 *   onActivate: (id) => openFile(id),
 * });
 * ```
 */

// ============================================================================
// Public types
// ============================================================================

export interface TreeNode<T> {
  /** Stable identifier. Required and unique across the whole tree. */
  id: string;
  /** Caller-defined payload (label, icon, status, etc.). */
  data: T;
  /** Optional child nodes. Omit or pass empty array for a leaf. */
  children?: TreeNode<T>[];
  /**
   * Hint that the node has children even when `children` is empty.
   * Useful for v2 async loading. In v1 this only affects `aria-expanded`
   * (a node with `hasChildren: true` reports `aria-expanded` even when
   * its `children` array is empty).
   */
  hasChildren?: boolean;
}

export type TreeSelectionMode = 'single' | 'multiple' | 'none';

export interface TreeOptions<T> {
  /** Root nodes. Multi-root is allowed and ARIA-conformant. */
  nodes: TreeNode<T>[];
  /** @default 'single' */
  selectionMode?: TreeSelectionMode;
  /** Ids expanded on construction. */
  defaultExpanded?: string[];
  /** Ids selected on construction. */
  defaultSelected?: string[];
  /** Fired whenever the expanded set changes. */
  onExpandedChange?: (expanded: Set<string>) => void;
  /** Fired whenever the selected set changes. */
  onSelectedChange?: (selected: Set<string>) => void;
  /** Fired whenever the focused id changes (including to null). */
  onFocusChange?: (focused: string | null) => void;
  /** Fired when a node is activated (Enter, double click, or `activate(id)`). */
  onActivate?: (id: string) => void;
}

export interface TreeState {
  expanded: Set<string>;
  selected: Set<string>;
  focused: string | null;
}

export interface TreeRootProps {
  role: 'tree';
}

export interface TreeGroupProps {
  role: 'group';
}

export interface TreeNodeProps {
  role: 'treeitem';
  ariaExpanded?: boolean;
  ariaLevel: number;
  ariaSetsize: number;
  ariaPosinset: number;
  ariaSelected?: boolean;
  tabIndex: number;
}

export interface TreeAPI {
  state: TreeState;
  expand(id: string): void;
  collapse(id: string): void;
  toggle(id: string): void;
  /**
   * Select a node.
   * - `append: true` toggles membership in a multi-selection (Cmd/Ctrl+click).
   * - `range: true` selects from the anchor to `id` along the visible
   *   (flattened) order (Shift+click). Anchor is the most recent
   *   non-range selection, or the first selected id, or `id` itself.
   *
   * In `selectionMode: 'single'`, `append`/`range` are ignored and the
   * selection becomes `{id}`. In `selectionMode: 'none'`, calls are no-ops.
   */
  select(id: string, opts?: { append?: boolean; range?: boolean }): void;
  focus(id: string): void;
  activate(id: string): void;
  moveNext(): string | null;
  movePrev(): string | null;
  moveOut(): string | null;
  moveIn(): string | null;
  moveFirst(): string | null;
  moveLast(): string | null;
  /**
   * Advance focus to the next visible node whose label starts with `char`,
   * wrapping around. Label is taken from `data.name`, `data.label`, or
   * `data.title` if `data` is an object; falls back to `id`. Returns the
   * matched id or null.
   *
   * Single-character typeahead by design -- buffered typeahead is the
   * `typeahead.ts` primitive's job; compose if you need it.
   */
  typeahead(char: string): string | null;
  getRootProps(): TreeRootProps;
  getGroupProps(parentId: string): TreeGroupProps;
  getNodeProps(id: string): TreeNodeProps;
}

// ============================================================================
// Internal index
// ============================================================================

interface NodeIndex<T> {
  node: TreeNode<T>;
  parentId: string | null;
  level: number;
  /** 1-based position among siblings. */
  posinset: number;
  /** Total siblings (including self). */
  setsize: number;
}

function buildIndex<T>(nodes: TreeNode<T>[]): Map<string, NodeIndex<T>> {
  const index = new Map<string, NodeIndex<T>>();

  function walk(siblings: TreeNode<T>[], parentId: string | null, level: number): void {
    const setsize = siblings.length;
    for (let i = 0; i < siblings.length; i++) {
      const node = siblings[i];
      if (!node) continue;
      if (index.has(node.id)) {
        throw new Error(`tree: duplicate node id "${node.id}"`);
      }
      index.set(node.id, {
        node,
        parentId,
        level,
        posinset: i + 1,
        setsize,
      });
      if (node.children && node.children.length > 0) {
        walk(node.children, node.id, level + 1);
      }
    }
  }

  walk(nodes, null, 1);
  return index;
}

function hasChildren<T>(node: TreeNode<T>): boolean {
  if (node.hasChildren) return true;
  return Array.isArray(node.children) && node.children.length > 0;
}

function getLabel<T>(node: TreeNode<T>): string {
  const data: unknown = node.data;
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const candidate = obj.name ?? obj.label ?? obj.title;
    if (typeof candidate === 'string') return candidate;
  }
  return node.id;
}

// ============================================================================
// Factory
// ============================================================================

export function createTree<T>(options: TreeOptions<T>): TreeAPI {
  const {
    nodes,
    selectionMode = 'single',
    defaultExpanded = [],
    defaultSelected = [],
    onExpandedChange,
    onSelectedChange,
    onFocusChange,
    onActivate,
  } = options;

  const index = buildIndex(nodes);

  const state: TreeState = {
    expanded: new Set(defaultExpanded.filter((id) => index.has(id))),
    selected: new Set(defaultSelected.filter((id) => index.has(id))),
    focused: null,
  };

  // Anchor for range selection.
  let selectionAnchor: string | null = null;

  // ---- Visible (flattened) order -------------------------------------------

  function visibleOrder(): string[] {
    const out: string[] = [];
    function walk(siblings: TreeNode<T>[]): void {
      for (const node of siblings) {
        out.push(node.id);
        if (hasChildren(node) && state.expanded.has(node.id) && node.children) {
          walk(node.children);
        }
      }
    }
    walk(nodes);
    return out;
  }

  // ---- Mutators ------------------------------------------------------------

  function notifyExpanded(): void {
    onExpandedChange?.(new Set(state.expanded));
  }

  function notifySelected(): void {
    onSelectedChange?.(new Set(state.selected));
  }

  function setFocus(id: string | null): void {
    if (state.focused === id) return;
    state.focused = id;
    onFocusChange?.(id);
  }

  function expand(id: string): void {
    const entry = index.get(id);
    if (!entry || !hasChildren(entry.node)) return;
    if (state.expanded.has(id)) return;
    state.expanded.add(id);
    notifyExpanded();
  }

  function collapse(id: string): void {
    if (!state.expanded.has(id)) return;
    state.expanded.delete(id);
    notifyExpanded();
  }

  function toggle(id: string): void {
    if (state.expanded.has(id)) collapse(id);
    else expand(id);
  }

  function select(id: string, opts: { append?: boolean; range?: boolean } = {}): void {
    if (selectionMode === 'none') return;
    if (!index.has(id)) return;

    if (selectionMode === 'single') {
      const next = new Set<string>([id]);
      const same =
        state.selected.size === next.size && [...state.selected].every((v) => next.has(v));
      if (!same) {
        state.selected = next;
        notifySelected();
      }
      selectionAnchor = id;
      return;
    }

    // multiple
    if (opts.range) {
      const order = visibleOrder();
      const anchor = selectionAnchor ?? [...state.selected][0] ?? id;
      const a = order.indexOf(anchor);
      const b = order.indexOf(id);
      if (a === -1 || b === -1) {
        state.selected = new Set([id]);
        selectionAnchor = id;
        notifySelected();
        return;
      }
      const [lo, hi] = a <= b ? [a, b] : [b, a];
      const next = new Set<string>();
      for (let i = lo; i <= hi; i++) {
        const cur = order[i];
        if (cur !== undefined) next.add(cur);
      }
      state.selected = next;
      // anchor stays put for chained range extensions.
      notifySelected();
      return;
    }

    if (opts.append) {
      if (state.selected.has(id)) state.selected.delete(id);
      else state.selected.add(id);
      selectionAnchor = id;
      notifySelected();
      return;
    }

    state.selected = new Set([id]);
    selectionAnchor = id;
    notifySelected();
  }

  function focus(id: string): void {
    if (!index.has(id)) return;
    setFocus(id);
  }

  function activate(id: string): void {
    if (!index.has(id)) return;
    setFocus(id);
    onActivate?.(id);
  }

  // ---- Movement ------------------------------------------------------------

  function moveTo(id: string | null): string | null {
    if (id === null) return null;
    setFocus(id);
    return id;
  }

  function moveNext(): string | null {
    const order = visibleOrder();
    if (order.length === 0) return null;
    if (state.focused === null) return moveTo(order[0] ?? null);
    const i = order.indexOf(state.focused);
    if (i === -1) return moveTo(order[0] ?? null);
    if (i >= order.length - 1) return state.focused;
    return moveTo(order[i + 1] ?? null);
  }

  function movePrev(): string | null {
    const order = visibleOrder();
    if (order.length === 0) return null;
    if (state.focused === null) return moveTo(order[0] ?? null);
    const i = order.indexOf(state.focused);
    if (i <= 0) return state.focused ?? moveTo(order[0] ?? null);
    return moveTo(order[i - 1] ?? null);
  }

  function moveOut(): string | null {
    if (state.focused === null) return null;
    const entry = index.get(state.focused);
    if (!entry) return null;
    // If on an expanded node, collapse first (matches OS file tree behavior).
    if (hasChildren(entry.node) && state.expanded.has(entry.node.id)) {
      collapse(entry.node.id);
      return state.focused;
    }
    if (entry.parentId === null) return state.focused;
    return moveTo(entry.parentId);
  }

  function moveIn(): string | null {
    if (state.focused === null) return null;
    const entry = index.get(state.focused);
    if (!entry) return null;
    if (!hasChildren(entry.node)) return state.focused;
    if (!state.expanded.has(entry.node.id)) {
      expand(entry.node.id);
      return state.focused;
    }
    const firstChild = entry.node.children?.[0];
    if (!firstChild) return state.focused;
    return moveTo(firstChild.id);
  }

  function moveFirst(): string | null {
    const order = visibleOrder();
    return moveTo(order[0] ?? null);
  }

  function moveLast(): string | null {
    const order = visibleOrder();
    return moveTo(order[order.length - 1] ?? null);
  }

  function typeahead(char: string): string | null {
    if (char.length !== 1) return null;
    const order = visibleOrder();
    if (order.length === 0) return null;
    const lower = char.toLowerCase();
    const start = state.focused ? order.indexOf(state.focused) : -1;
    for (let step = 1; step <= order.length; step++) {
      const i = (start + step + order.length) % order.length;
      const id = order[i];
      if (!id) continue;
      const entry = index.get(id);
      if (!entry) continue;
      const label = getLabel(entry.node);
      if (label.length > 0 && label[0]?.toLowerCase() === lower) {
        return moveTo(id);
      }
    }
    return null;
  }

  // ---- Prop bags -----------------------------------------------------------

  function getRootProps(): TreeRootProps {
    return { role: 'tree' };
  }

  function getGroupProps(_parentId: string): TreeGroupProps {
    // parentId reserved for v2 (aria-owns / labelling); included in the
    // signature today so consumers don't need to refactor when v2 lands.
    return { role: 'group' };
  }

  function getNodeProps(id: string): TreeNodeProps {
    const entry = index.get(id);
    if (!entry) {
      throw new Error(`tree: getNodeProps called with unknown id "${id}"`);
    }
    const expandable = hasChildren(entry.node);
    const props: TreeNodeProps = {
      role: 'treeitem',
      ariaLevel: entry.level,
      ariaSetsize: entry.setsize,
      ariaPosinset: entry.posinset,
      tabIndex: state.focused === id ? 0 : -1,
    };
    if (expandable) {
      props.ariaExpanded = state.expanded.has(id);
    }
    if (selectionMode !== 'none') {
      props.ariaSelected = state.selected.has(id);
    }
    return props;
  }

  return {
    state,
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
    getRootProps,
    getGroupProps,
    getNodeProps,
  };
}
