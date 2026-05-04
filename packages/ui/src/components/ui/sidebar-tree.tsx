/**
 * SidebarTree component for hierarchical navigation in a sidebar context
 *
 * Visual wrapper around the tree primitive (createTree). Renders nodes as
 * indented rows with chevron expanders, hooks the tree's keyboard nav
 * to the root container, and exposes the focus / selection / expansion
 * state to the consumer via a render prop. The consumer owns icons,
 * status indicators, and any per-node decoration — SidebarTree owns
 * layout, keyboard, and ARIA.
 *
 * @cognitive-load 4/10 — Hierarchical lists carry parent/child relationships
 *   plus selection state; the component centralizes the keyboard + ARIA cost
 *   so every consumer doesn't re-pay it.
 * @attention-economics Indentation + chevrons signal hierarchy at a glance;
 *   roving tabindex keeps Tab order linear.
 * @trust-building Predictable arrow-key semantics (right expands then
 *   descends, left collapses then ascends), persistent expansion state
 *   when the consumer drives it.
 * @accessibility WAI-ARIA tree pattern: role=tree on root, role=treeitem
 *   on rows, role=group on child containers, aria-expanded on parents,
 *   aria-level / aria-setsize / aria-posinset, aria-selected, roving
 *   tabindex.
 * @semantic-meaning Hierarchical navigation: file trees, outlines,
 *   taxonomies. NOT for flat menus (use Sidebar.Menu).
 *
 * @usage-patterns
 * DO: Use for file / folder browsers, outlines, taxonomy editors
 * DO: Render the consumer's per-node content via the renderNode prop
 * DO: Drive expansion state from outside if it needs to persist across
 *   reloads (controlled mode via expanded + onExpandedChange)
 * DO: Pair with Sidebar.Group / Sidebar.GroupLabel for section framing
 * NEVER: Use for flat lists (use Sidebar.Menu instead)
 * NEVER: Fetch data inside renderNode — the tree is fed materialized
 *   nodes; loading is the consumer's job above this component
 * NEVER: Render hand-rolled chevrons that disagree with the aria-expanded
 *   state — use the provided expander or set it via render prop carefully
 *
 * @example
 * ```tsx
 * <Sidebar.Group>
 *   <Sidebar.GroupLabel>Files</Sidebar.GroupLabel>
 *   <SidebarTree
 *     nodes={fileNodes}
 *     selectionMode="single"
 *     onActivate={(id) => openFile(id)}
 *     renderNode={({ node, isExpanded }) => (
 *       <>
 *         {node.children?.length ? (
 *           <FolderIcon open={isExpanded} />
 *         ) : (
 *           <FileIcon ext={node.data.ext} />
 *         )}
 *         <span className="truncate">{node.data.label}</span>
 *         {node.data.status ? <StatusDot status={node.data.status} /> : null}
 *       </>
 *     )}
 *   />
 * </Sidebar.Group>
 * ```
 */

import * as React from 'react';
import classy from '../../primitives/classy';
import {
  createTree,
  getVisibleEntries,
  type TreeFlatEntry,
  type TreeNode,
  type TreeSelectionMode,
} from '../../primitives/tree';
import {
  sidebarTreeChevronClasses,
  sidebarTreeChevronSpacerClasses,
  sidebarTreeGroupClasses,
  sidebarTreeItemClasses,
  sidebarTreeItemContentClasses,
  sidebarTreeRootClasses,
} from './sidebar-tree.classes';

// ==================== Types ====================

/** State exposed to the renderNode prop for each visible entry */
export interface SidebarTreeNodeRenderState<T> {
  /** The tree node */
  node: TreeNode<T>;
  /** 1-based depth (matches aria-level) */
  level: number;
  /** Whether this node is currently expanded */
  isExpanded: boolean;
  /** Whether this node has children */
  hasChildren: boolean;
  /** Whether this node is the focused (roving-tabindex=0) one */
  isFocused: boolean;
  /** Whether this node is selected */
  isSelected: boolean;
  /** Whether this node is disabled */
  isDisabled: boolean;
}

export interface SidebarTreeProps<T> extends React.HTMLAttributes<HTMLUListElement> {
  /** Root nodes (multi-root supported) */
  nodes: TreeNode<T>[];
  /** Selection mode (default 'single') */
  selectionMode?: TreeSelectionMode;
  /** Initial expanded ids (uncontrolled). Ignored when `expanded` is supplied. */
  defaultExpanded?: string[];
  /** Initial selected ids (uncontrolled). Ignored when `selected` is supplied. */
  defaultSelected?: string[];
  /** Initial focused id (uncontrolled). Ignored when `focused` is supplied. */
  defaultFocused?: string | null;
  /** Controlled expansion */
  expanded?: ReadonlySet<string> | string[];
  /** Controlled selection */
  selected?: ReadonlySet<string> | string[];
  /** Controlled focused id */
  focused?: string | null;
  /** Notified on expansion change */
  onExpandedChange?: (expanded: ReadonlySet<string>) => void;
  /** Notified on selection change */
  onSelectedChange?: (selected: ReadonlySet<string>) => void;
  /** Notified on focus change */
  onFocusChange?: (focused: string | null) => void;
  /** Notified when a node is activated (Enter or click on the row) */
  onActivate?: (id: string) => void;
  /** Render the per-node content (icon, label, decorations). Required. */
  renderNode: (state: SidebarTreeNodeRenderState<T>) => React.ReactNode;
  /** Optional aria-label for the root tree element */
  'aria-label'?: string;
  /** Optional aria-labelledby for the root tree element */
  'aria-labelledby'?: string;
}

// ==================== Helpers ====================

function toSet(input: ReadonlySet<string> | string[] | undefined): Set<string> | null {
  if (input === undefined) return null;
  return new Set(input);
}

function setsEqual(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

// ==================== Component ====================

export function SidebarTree<T = unknown>(props: SidebarTreeProps<T>): React.ReactElement {
  const {
    nodes,
    selectionMode = 'single',
    defaultExpanded,
    defaultSelected,
    defaultFocused,
    expanded: expandedProp,
    selected: selectedProp,
    focused: focusedProp,
    onExpandedChange,
    onSelectedChange,
    onFocusChange,
    onActivate,
    renderNode,
    className,
    onKeyDown,
    onClick,
    ...rest
  } = props;

  // Force re-render on internal state changes (the tree primitive holds the
  // canonical state; React just needs a tick to reflect it).
  const [, setVersion] = React.useState(0);
  const rerender = React.useCallback(() => setVersion((v) => v + 1), []);

  // Build the tree controller once. setNodes is called when the nodes prop
  // identity changes.
  const treeRef = React.useRef<ReturnType<typeof createTree<T>> | null>(null);
  if (treeRef.current === null) {
    const treeOptions: Parameters<typeof createTree<T>>[0] = {
      nodes,
      selectionMode,
      onExpandedChange: (next) => {
        onExpandedChange?.(next);
        rerender();
      },
      onSelectedChange: (next) => {
        onSelectedChange?.(next);
        rerender();
      },
      onFocusChange: (next) => {
        onFocusChange?.(next);
        rerender();
      },
      onActivate: (id) => onActivate?.(id),
    };
    if (defaultExpanded !== undefined) treeOptions.defaultExpanded = defaultExpanded;
    if (defaultSelected !== undefined) treeOptions.defaultSelected = defaultSelected;
    if (defaultFocused !== undefined) treeOptions.defaultFocused = defaultFocused;
    treeRef.current = createTree<T>(treeOptions);
  }
  const tree = treeRef.current;

  // Sync controlled props in. Avoid feedback loops by comparing against the
  // current internal state before applying.
  React.useEffect(() => {
    tree.setNodes(nodes);
    rerender();
  }, [nodes, tree, rerender]);

  React.useEffect(() => {
    const incoming = toSet(expandedProp);
    if (incoming === null) return;
    if (setsEqual(tree.state.expanded, incoming)) return;
    // Apply by toggling the diff.
    for (const id of incoming) if (!tree.state.expanded.has(id)) tree.expand(id);
    for (const id of Array.from(tree.state.expanded)) if (!incoming.has(id)) tree.collapse(id);
  }, [expandedProp, tree]);

  React.useEffect(() => {
    const incoming = toSet(selectedProp);
    if (incoming === null) return;
    if (setsEqual(tree.state.selected, incoming)) return;
    if (selectionMode === 'single') {
      const first = incoming.values().next().value;
      if (typeof first === 'string') tree.select(first);
    } else if (selectionMode === 'multiple') {
      // Replace the entire set: clear by toggling appendingly, then add.
      for (const id of Array.from(tree.state.selected))
        if (!incoming.has(id)) tree.select(id, { append: true });
      for (const id of incoming)
        if (!tree.state.selected.has(id)) tree.select(id, { append: true });
    }
  }, [selectedProp, tree, selectionMode]);

  React.useEffect(() => {
    if (focusedProp === undefined) return;
    if (focusedProp === null) return;
    if (tree.state.focused === focusedProp) return;
    tree.focus(focusedProp);
  }, [focusedProp, tree]);

  // Compute fresh on every render. The tree primitive mutates its expanded
  // Set in place, so the reference is stable across changes — useMemo would
  // skip even when the set's contents change. Walking is O(visible) anyway.
  const visible = getVisibleEntries(nodes, tree.state.expanded);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      tree.handleKeyDown(event.nativeEvent);
    },
    [onKeyDown, tree],
  );

  const handleRowClick = React.useCallback(
    (id: string, event: React.MouseEvent<HTMLLIElement>) => {
      if (event.defaultPrevented) return;
      tree.focus(id);
      if (selectionMode !== 'none') {
        tree.select(id, {
          append: event.metaKey || event.ctrlKey,
          range: event.shiftKey,
        });
      }
      tree.activate(id);
    },
    [selectionMode, tree],
  );

  const handleChevronClick = React.useCallback(
    (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      tree.toggle(id);
    },
    [tree],
  );

  return (
    <ul
      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: WAI-ARIA tree pattern uses role=tree on a list container; the role overrides the implicit list role intentionally
      role="tree"
      aria-multiselectable={selectionMode === 'multiple' ? true : undefined}
      tabIndex={visible.length > 0 ? 0 : -1}
      className={classy(sidebarTreeRootClasses, className)}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      {...rest}
    >
      <SidebarTreeBody
        visible={visible}
        tree={tree}
        renderNode={renderNode}
        onRowClick={handleRowClick}
        onChevronClick={handleChevronClick}
      />
    </ul>
  );
}

// ==================== Body (rendered list) ====================

interface SidebarTreeBodyProps<T> {
  visible: TreeFlatEntry<T>[];
  tree: ReturnType<typeof createTree<T>>;
  renderNode: (state: SidebarTreeNodeRenderState<T>) => React.ReactNode;
  onRowClick: (id: string, event: React.MouseEvent<HTMLLIElement>) => void;
  onChevronClick: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

function SidebarTreeBody<T>(props: SidebarTreeBodyProps<T>): React.ReactElement {
  const { visible, tree, renderNode, onRowClick, onChevronClick } = props;

  // Group consecutive same-parent entries so we can wrap each parent's
  // children in a single role=group container per WAI-ARIA tree spec.
  const elements: React.ReactNode[] = [];
  let currentGroup: TreeFlatEntry<T>[] = [];
  let currentParent: string | null | undefined;

  const flushGroup = () => {
    if (currentGroup.length === 0) return;
    const parentId = currentParent;
    const groupItems = currentGroup.map((entry) =>
      renderRow(entry, tree, renderNode, onRowClick, onChevronClick),
    );
    if (parentId === null || parentId === undefined) {
      // Top-level: emit directly, no wrapper (the role=tree root is the container)
      elements.push(...groupItems);
    } else {
      elements.push(
        // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA tree pattern uses role=group on the children container; the role overrides the implicit list role intentionally
        <ul key={`group-${parentId}`} role="group" className={sidebarTreeGroupClasses}>
          {groupItems}
        </ul>,
      );
    }
    currentGroup = [];
  };

  for (const entry of visible) {
    if (entry.parentId !== currentParent) {
      flushGroup();
      currentParent = entry.parentId;
    }
    currentGroup.push(entry);
  }
  flushGroup();

  return <>{elements}</>;
}

function renderRow<T>(
  entry: TreeFlatEntry<T>,
  tree: ReturnType<typeof createTree<T>>,
  renderNode: (state: SidebarTreeNodeRenderState<T>) => React.ReactNode,
  onRowClick: (id: string, event: React.MouseEvent<HTMLLIElement>) => void,
  onChevronClick: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void,
): React.ReactNode {
  const ariaProps = tree.getNodeProps(entry.node.id);
  const hasChildren = !!(entry.node.children && entry.node.children.length > 0);
  const isExpanded = tree.state.expanded.has(entry.node.id);
  const isFocused = tree.state.focused === entry.node.id;
  const isSelected = tree.state.selected.has(entry.node.id);
  const isDisabled = !!entry.node.disabled;

  const renderState: SidebarTreeNodeRenderState<T> = {
    node: entry.node,
    level: entry.level,
    isExpanded,
    hasChildren,
    isFocused,
    isSelected,
    isDisabled,
  };

  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-level/setsize/posinset are supported on role=treeitem regardless of the underlying li element
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard nav is handled at the role=tree root via onKeyDown; per-row keydown would fight the roving-tabindex pattern
    <li
      key={entry.node.id}
      role={ariaProps.role}
      aria-level={ariaProps['aria-level']}
      aria-setsize={ariaProps['aria-setsize']}
      aria-posinset={ariaProps['aria-posinset']}
      aria-expanded={ariaProps['aria-expanded']}
      aria-selected={ariaProps['aria-selected']}
      aria-disabled={isDisabled || undefined}
      tabIndex={ariaProps.tabIndex}
      data-tree-item={entry.node.id}
      style={{ paddingInlineStart: `${(entry.level - 1) * 0.75}rem` }}
      className={sidebarTreeItemClasses}
      onClick={(event) => onRowClick(entry.node.id, event)}
    >
      {hasChildren ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          aria-expanded={isExpanded}
          className={sidebarTreeChevronClasses}
          onClick={(event) => onChevronClick(entry.node.id, event)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <span className={sidebarTreeChevronSpacerClasses} aria-hidden="true" />
      )}
      <span className={sidebarTreeItemContentClasses}>{renderNode(renderState)}</span>
    </li>
  );
}
