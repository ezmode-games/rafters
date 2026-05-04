import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  attachTree,
  createTree,
  getVisibleEntries,
  type TreeNode,
} from '../../src/primitives/tree';

interface NamedData {
  label: string;
}

function n(id: string, label?: string, children?: TreeNode<NamedData>[]): TreeNode<NamedData> {
  const node: TreeNode<NamedData> = { id, data: { label: label ?? id } };
  if (children) node.children = children;
  return node;
}

const SIMPLE_TREE: TreeNode<NamedData>[] = [
  n('a', 'Apple'),
  n('b', 'Banana', [n('b1', 'Blackberry'), n('b2', 'Blueberry')]),
  n('c', 'Cherry'),
];

const DEEP_TREE: TreeNode<NamedData>[] = [
  n('root', 'Root', [
    n('l1', 'Level 1', [n('l2', 'Level 2', [n('l3', 'Level 3'), n('l3b', 'Level 3b')])]),
  ]),
];

describe('createTree — initial state', () => {
  it('focuses the first selectable node by default', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    expect(tree.state.focused).toBe('a');
  });

  it('honors defaultFocused', () => {
    const tree = createTree({ nodes: SIMPLE_TREE, defaultFocused: 'c' });
    expect(tree.state.focused).toBe('c');
  });

  it('honors defaultExpanded + defaultSelected', () => {
    const tree = createTree({
      nodes: SIMPLE_TREE,
      defaultExpanded: ['b'],
      defaultSelected: ['b1'],
    });
    expect([...tree.state.expanded]).toEqual(['b']);
    expect([...tree.state.selected]).toEqual(['b1']);
  });

  it('handles empty nodes', () => {
    const tree = createTree<NamedData>({ nodes: [] });
    expect(tree.state.focused).toBe(null);
    expect(tree.moveNext()).toBe(null);
  });
});

describe('createTree — expand / collapse', () => {
  it('toggles expansion only on parents', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    tree.toggle('a'); // leaf — no-op
    expect(tree.state.expanded.has('a')).toBe(false);
    tree.toggle('b');
    expect(tree.state.expanded.has('b')).toBe(true);
    tree.toggle('b');
    expect(tree.state.expanded.has('b')).toBe(false);
  });

  it('emits onExpandedChange when expansion changes', () => {
    const onExpandedChange = vi.fn();
    const tree = createTree({ nodes: SIMPLE_TREE, onExpandedChange });
    tree.expand('b');
    expect(onExpandedChange).toHaveBeenCalledTimes(1);
    expect([...(onExpandedChange.mock.calls[0]?.[0] ?? [])]).toEqual(['b']);
    tree.expand('b'); // already expanded
    expect(onExpandedChange).toHaveBeenCalledTimes(1);
  });
});

describe('createTree — keyboard movement', () => {
  it('ArrowDown / ArrowUp walk visible nodes', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    expect(tree.moveNext()).toBe('b');
    expect(tree.moveNext()).toBe('c');
    expect(tree.moveNext()).toBe('c'); // bottom — stays
    expect(tree.movePrev()).toBe('b');
    expect(tree.movePrev()).toBe('a');
    expect(tree.movePrev()).toBe('a'); // top — stays
  });

  it('ArrowRight expands a collapsed parent', () => {
    const tree = createTree({ nodes: SIMPLE_TREE, defaultFocused: 'b' });
    expect(tree.state.expanded.has('b')).toBe(false);
    expect(tree.moveIn()).toBe('b');
    expect(tree.state.expanded.has('b')).toBe(true);
  });

  it('ArrowRight on already-expanded parent moves to first child', () => {
    const tree = createTree({
      nodes: SIMPLE_TREE,
      defaultFocused: 'b',
      defaultExpanded: ['b'],
    });
    expect(tree.moveIn()).toBe('b1');
  });

  it('ArrowLeft on expanded parent collapses it', () => {
    const tree = createTree({
      nodes: SIMPLE_TREE,
      defaultFocused: 'b',
      defaultExpanded: ['b'],
    });
    expect(tree.moveOut()).toBe('b');
    expect(tree.state.expanded.has('b')).toBe(false);
  });

  it('ArrowLeft on a child moves to parent', () => {
    const tree = createTree({
      nodes: SIMPLE_TREE,
      defaultFocused: 'b1',
      defaultExpanded: ['b'],
    });
    expect(tree.moveOut()).toBe('b');
  });

  it('Home / End jump to first / last visible', () => {
    const tree = createTree({
      nodes: SIMPLE_TREE,
      defaultFocused: 'b',
      defaultExpanded: ['b'],
    });
    expect(tree.moveLast()).toBe('c');
    expect(tree.moveFirst()).toBe('a');
  });

  it('walks deeply nested trees in DFS order', () => {
    const tree = createTree({
      nodes: DEEP_TREE,
      defaultExpanded: ['root', 'l1', 'l2'],
    });
    const order: (string | null)[] = [tree.state.focused];
    let cursor: string | null = tree.state.focused;
    while (true) {
      const next = tree.moveNext();
      if (next === cursor) break;
      cursor = next;
      order.push(cursor);
    }
    expect(order).toEqual(['root', 'l1', 'l2', 'l3', 'l3b']);
  });
});

describe('createTree — selection', () => {
  it('single mode replaces selection', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    tree.select('a');
    tree.select('c');
    expect([...tree.state.selected]).toEqual(['c']);
  });

  it('multiple + append toggles individual ids', () => {
    const tree = createTree({ nodes: SIMPLE_TREE, selectionMode: 'multiple' });
    tree.select('a', { append: true });
    tree.select('c', { append: true });
    expect([...tree.state.selected].sort()).toEqual(['a', 'c']);
    tree.select('a', { append: true });
    expect([...tree.state.selected]).toEqual(['c']);
  });

  it('multiple + range selects across visible nodes', () => {
    const tree = createTree({
      nodes: SIMPLE_TREE,
      selectionMode: 'multiple',
      defaultExpanded: ['b'],
    });
    tree.select('a');
    tree.select('b2', { range: true });
    expect([...tree.state.selected].sort()).toEqual(['a', 'b', 'b1', 'b2']);
  });

  it('selectionMode "none" suppresses aria-selected and selection state', () => {
    const tree = createTree({ nodes: SIMPLE_TREE, selectionMode: 'none' });
    tree.select('a');
    expect(tree.state.selected.size).toBe(0);
    expect(tree.getNodeProps('a')['aria-selected']).toBeUndefined();
  });

  it('disabled nodes cannot be selected or focused', () => {
    const disabledTree: TreeNode<NamedData>[] = [
      { id: 'a', data: { label: 'A' }, disabled: true },
      n('b', 'B'),
    ];
    const tree = createTree({ nodes: disabledTree });
    tree.select('a');
    expect(tree.state.selected.size).toBe(0);
    tree.focus('a');
    expect(tree.state.focused).toBe('b'); // initial focus skipped 'a'
  });
});

describe('createTree — ARIA props', () => {
  it('getRootProps returns role=tree', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    expect(tree.getRootProps()).toEqual({ role: 'tree' });
  });

  it('getGroupProps returns role=group', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    expect(tree.getGroupProps('b')).toEqual({ role: 'group' });
  });

  it('getNodeProps reflects level, posinset, setsize', () => {
    const tree = createTree({ nodes: SIMPLE_TREE, defaultExpanded: ['b'] });
    expect(tree.getNodeProps('a')).toMatchObject({
      role: 'treeitem',
      'aria-level': 1,
      'aria-posinset': 1,
      'aria-setsize': 3,
    });
    expect(tree.getNodeProps('b1')).toMatchObject({
      'aria-level': 2,
      'aria-posinset': 1,
      'aria-setsize': 2,
    });
  });

  it('aria-expanded only set on parents', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    expect(tree.getNodeProps('a')['aria-expanded']).toBeUndefined();
    expect(tree.getNodeProps('b')['aria-expanded']).toBe(false);
    tree.expand('b');
    expect(tree.getNodeProps('b')['aria-expanded']).toBe(true);
  });

  it('roving tabindex: only focused node gets 0', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    expect(tree.getNodeProps('a').tabIndex).toBe(0);
    expect(tree.getNodeProps('b').tabIndex).toBe(-1);
    tree.focus('b');
    expect(tree.getNodeProps('a').tabIndex).toBe(-1);
    expect(tree.getNodeProps('b').tabIndex).toBe(0);
  });
});

describe('createTree — multi-root', () => {
  it('treats sibling roots as a single tree', () => {
    const multiRoot: TreeNode<NamedData>[] = [n('r1', 'Root 1'), n('r2', 'Root 2')];
    const tree = createTree({ nodes: multiRoot });
    expect(tree.state.focused).toBe('r1');
    expect(tree.moveNext()).toBe('r2');
    expect(tree.getNodeProps('r1')['aria-setsize']).toBe(2);
    expect(tree.getNodeProps('r2')['aria-posinset']).toBe(2);
  });
});

describe('createTree — typeahead', () => {
  it('jumps to the first match by label prefix', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    expect(tree.typeahead('c')).toBe('c');
  });

  it('falls back to id when data has no label', () => {
    const idOnly: TreeNode<{ extra: number }>[] = [
      { id: 'apple', data: { extra: 1 } },
      { id: 'banana', data: { extra: 2 } },
    ];
    const tree = createTree({ nodes: idOnly });
    expect(tree.typeahead('b')).toBe('banana');
  });
});

describe('createTree — handleKeyDown', () => {
  function key(name: string, init: KeyboardEventInit = {}): KeyboardEvent {
    return new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...init });
  }

  it('dispatches arrows + Home + End', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    tree.handleKeyDown(key('ArrowDown'));
    expect(tree.state.focused).toBe('b');
    tree.handleKeyDown(key('End'));
    expect(tree.state.focused).toBe('c');
    tree.handleKeyDown(key('Home'));
    expect(tree.state.focused).toBe('a');
  });

  it('Enter activates and selects', () => {
    const onActivate = vi.fn();
    const tree = createTree({ nodes: SIMPLE_TREE, onActivate });
    tree.handleKeyDown(key('Enter'));
    expect(onActivate).toHaveBeenCalledWith('a');
    expect([...tree.state.selected]).toEqual(['a']);
  });

  it('skips when modifier keys are held', () => {
    const tree = createTree({ nodes: SIMPLE_TREE });
    tree.handleKeyDown(key('ArrowDown', { metaKey: true }));
    expect(tree.state.focused).toBe('a');
  });
});

describe('createTree — setNodes', () => {
  it('drops stale focused / selected / expanded ids', () => {
    const tree = createTree({
      nodes: SIMPLE_TREE,
      defaultExpanded: ['b'],
      defaultSelected: ['b1'],
      defaultFocused: 'b1',
    });
    tree.setNodes([n('x', 'X'), n('y', 'Y')]);
    expect(tree.state.focused).toBe('x');
    expect(tree.state.selected.size).toBe(0);
    expect(tree.state.expanded.size).toBe(0);
  });
});

describe('getVisibleEntries — exported walker', () => {
  it('skips children of collapsed parents', () => {
    const visible = getVisibleEntries(SIMPLE_TREE, new Set());
    expect(visible.map((e) => e.node.id)).toEqual(['a', 'b', 'c']);
  });

  it('includes children of expanded parents', () => {
    const visible = getVisibleEntries(SIMPLE_TREE, new Set(['b']));
    expect(visible.map((e) => e.node.id)).toEqual(['a', 'b', 'b1', 'b2', 'c']);
  });
});

describe('attachTree — DOM-attached form', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('wires keydown to the API and cleans up on dispose', () => {
    const onActivate = vi.fn();
    const { api, cleanup } = attachTree(container, { nodes: SIMPLE_TREE, onActivate });
    expect(api.state.focused).toBe('a');

    container.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
    );
    expect(api.state.focused).toBe('b');

    cleanup();

    container.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
    );
    expect(api.state.focused).toBe('b'); // listener removed

    document.body.removeChild(container);
  });
});
