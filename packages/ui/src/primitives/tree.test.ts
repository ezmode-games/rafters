import { describe, expect, it, vi } from 'vitest';
import { createTree, type TreeNode } from './tree';

interface FileLike {
  name: string;
}

const fileTree: TreeNode<FileLike>[] = [
  {
    id: 'src',
    data: { name: 'src' },
    children: [
      { id: 'src/index.ts', data: { name: 'index.ts' } },
      {
        id: 'src/lib',
        data: { name: 'lib' },
        children: [
          { id: 'src/lib/util.ts', data: { name: 'util.ts' } },
          {
            id: 'src/lib/deep',
            data: { name: 'deep' },
            children: [{ id: 'src/lib/deep/leaf.ts', data: { name: 'leaf.ts' } }],
          },
        ],
      },
    ],
  },
  { id: 'README.md', data: { name: 'README.md' } },
  { id: 'package.json', data: { name: 'package.json' } },
];

describe('createTree -- construction', () => {
  it('starts with no focus, given selected, given expanded', () => {
    const tree = createTree({
      nodes: fileTree,
      defaultExpanded: ['src'],
      defaultSelected: ['README.md'],
    });
    expect(tree.state.focused).toBeNull();
    expect([...tree.state.expanded]).toEqual(['src']);
    expect([...tree.state.selected]).toEqual(['README.md']);
  });

  it('rejects duplicate ids', () => {
    expect(() =>
      createTree({
        nodes: [
          { id: 'a', data: { name: 'a' } },
          { id: 'a', data: { name: 'a2' } },
        ],
      }),
    ).toThrow(/duplicate node id/);
  });

  it('drops unknown ids from defaults', () => {
    const tree = createTree({
      nodes: fileTree,
      defaultExpanded: ['nope'],
      defaultSelected: ['also-nope'],
    });
    expect(tree.state.expanded.size).toBe(0);
    expect(tree.state.selected.size).toBe(0);
  });
});

describe('expand / collapse / toggle', () => {
  it('expands and collapses, fires onExpandedChange', () => {
    const onExpandedChange = vi.fn();
    const tree = createTree({ nodes: fileTree, onExpandedChange });
    tree.expand('src');
    expect(tree.state.expanded.has('src')).toBe(true);
    expect(onExpandedChange).toHaveBeenLastCalledWith(new Set(['src']));
    tree.collapse('src');
    expect(tree.state.expanded.has('src')).toBe(false);
  });

  it('toggle flips expansion', () => {
    const tree = createTree({ nodes: fileTree });
    tree.toggle('src');
    expect(tree.state.expanded.has('src')).toBe(true);
    tree.toggle('src');
    expect(tree.state.expanded.has('src')).toBe(false);
  });

  it('expand is a no-op for leaf nodes', () => {
    const onExpandedChange = vi.fn();
    const tree = createTree({ nodes: fileTree, onExpandedChange });
    tree.expand('README.md');
    expect(tree.state.expanded.size).toBe(0);
    expect(onExpandedChange).not.toHaveBeenCalled();
  });
});

describe('keyboard movement', () => {
  it('moveNext walks visible order', () => {
    const tree = createTree({ nodes: fileTree, defaultExpanded: ['src'] });
    expect(tree.moveNext()).toBe('src');
    expect(tree.moveNext()).toBe('src/index.ts');
    expect(tree.moveNext()).toBe('src/lib');
    expect(tree.moveNext()).toBe('README.md');
    expect(tree.moveNext()).toBe('package.json');
    // at end, stays put
    expect(tree.moveNext()).toBe('package.json');
  });

  it('movePrev walks backward through visible order', () => {
    const tree = createTree({ nodes: fileTree, defaultExpanded: ['src'] });
    tree.moveLast();
    expect(tree.state.focused).toBe('package.json');
    expect(tree.movePrev()).toBe('README.md');
    expect(tree.movePrev()).toBe('src/lib');
    expect(tree.movePrev()).toBe('src/index.ts');
    expect(tree.movePrev()).toBe('src');
    // at start, stays put
    expect(tree.movePrev()).toBe('src');
  });

  it('moveIn on a collapsed node expands it without moving focus', () => {
    const tree = createTree({ nodes: fileTree });
    tree.focus('src');
    expect(tree.moveIn()).toBe('src');
    expect(tree.state.expanded.has('src')).toBe(true);
    expect(tree.state.focused).toBe('src');
  });

  it('moveIn on an expanded parent steps into the first child', () => {
    const tree = createTree({ nodes: fileTree, defaultExpanded: ['src'] });
    tree.focus('src');
    expect(tree.moveIn()).toBe('src/index.ts');
  });

  it('moveOut on an expanded parent collapses it (focus stays)', () => {
    const tree = createTree({ nodes: fileTree, defaultExpanded: ['src'] });
    tree.focus('src');
    expect(tree.moveOut()).toBe('src');
    expect(tree.state.expanded.has('src')).toBe(false);
  });

  it('moveOut on a child moves to the parent', () => {
    const tree = createTree({ nodes: fileTree, defaultExpanded: ['src'] });
    tree.focus('src/index.ts');
    expect(tree.moveOut()).toBe('src');
  });

  it('moveOut on a root leaf stays put', () => {
    const tree = createTree({ nodes: fileTree });
    tree.focus('README.md');
    expect(tree.moveOut()).toBe('README.md');
  });

  it('moveFirst / moveLast go to ends of visible order', () => {
    const tree = createTree({ nodes: fileTree, defaultExpanded: ['src', 'src/lib'] });
    expect(tree.moveFirst()).toBe('src');
    expect(tree.moveLast()).toBe('package.json');
  });

  it('typeahead jumps to next visible node by first letter, wrapping', () => {
    const tree = createTree({ nodes: fileTree, defaultExpanded: ['src'] });
    tree.focus('src');
    // 'r' jumps to README.md
    expect(tree.typeahead('r')).toBe('README.md');
    // 'p' jumps to package.json
    expect(tree.typeahead('p')).toBe('package.json');
    // 'i' wraps and jumps back to src/index.ts
    expect(tree.typeahead('i')).toBe('src/index.ts');
    // unknown letter returns null
    expect(tree.typeahead('z')).toBeNull();
  });
});

describe('selection -- single mode (default)', () => {
  it('select replaces and notifies', () => {
    const onSelectedChange = vi.fn();
    const tree = createTree({ nodes: fileTree, onSelectedChange });
    tree.select('README.md');
    expect([...tree.state.selected]).toEqual(['README.md']);
    expect(onSelectedChange).toHaveBeenLastCalledWith(new Set(['README.md']));
    tree.select('package.json');
    expect([...tree.state.selected]).toEqual(['package.json']);
  });

  it('append / range options are ignored in single mode', () => {
    const tree = createTree({ nodes: fileTree });
    tree.select('README.md');
    tree.select('package.json', { append: true });
    expect([...tree.state.selected]).toEqual(['package.json']);
  });
});

describe('selection -- multiple mode', () => {
  it('append toggles membership', () => {
    const tree = createTree({ nodes: fileTree, selectionMode: 'multiple' });
    tree.select('README.md');
    tree.select('package.json', { append: true });
    expect(tree.state.selected.has('README.md')).toBe(true);
    expect(tree.state.selected.has('package.json')).toBe(true);
    // toggling off
    tree.select('README.md', { append: true });
    expect(tree.state.selected.has('README.md')).toBe(false);
  });

  it('range selects across visible (flattened) order', () => {
    const tree = createTree({
      nodes: fileTree,
      selectionMode: 'multiple',
      defaultExpanded: ['src'],
    });
    tree.select('src/index.ts');
    tree.select('package.json', { range: true });
    expect([...tree.state.selected]).toEqual([
      'src/index.ts',
      'src/lib',
      'README.md',
      'package.json',
    ]);
  });

  it('range works backward too', () => {
    const tree = createTree({
      nodes: fileTree,
      selectionMode: 'multiple',
      defaultExpanded: ['src'],
    });
    tree.select('package.json');
    tree.select('src/index.ts', { range: true });
    expect(tree.state.selected.size).toBe(4);
    expect(tree.state.selected.has('src/lib')).toBe(true);
  });
});

describe('selection -- none mode', () => {
  it('select is a no-op', () => {
    const onSelectedChange = vi.fn();
    const tree = createTree({
      nodes: fileTree,
      selectionMode: 'none',
      onSelectedChange,
    });
    tree.select('README.md');
    expect(tree.state.selected.size).toBe(0);
    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  it('getNodeProps omits ariaSelected when selectionMode is none', () => {
    const tree = createTree({ nodes: fileTree, selectionMode: 'none' });
    const props = tree.getNodeProps('README.md');
    expect(props.ariaSelected).toBeUndefined();
  });
});

describe('focus + activate', () => {
  it('focus updates state and notifies', () => {
    const onFocusChange = vi.fn();
    const tree = createTree({ nodes: fileTree, onFocusChange });
    tree.focus('README.md');
    expect(tree.state.focused).toBe('README.md');
    expect(onFocusChange).toHaveBeenLastCalledWith('README.md');
  });

  it('activate fires onActivate and focuses', () => {
    const onActivate = vi.fn();
    const tree = createTree({ nodes: fileTree, onActivate });
    tree.activate('README.md');
    expect(onActivate).toHaveBeenCalledWith('README.md');
    expect(tree.state.focused).toBe('README.md');
  });
});

describe('ARIA prop bags', () => {
  it('getRootProps returns role=tree', () => {
    const tree = createTree({ nodes: fileTree });
    expect(tree.getRootProps()).toEqual({ role: 'tree' });
  });

  it('getGroupProps returns role=group', () => {
    const tree = createTree({ nodes: fileTree });
    expect(tree.getGroupProps('src')).toEqual({ role: 'group' });
  });

  it('getNodeProps -- root leaf', () => {
    const tree = createTree({ nodes: fileTree });
    expect(tree.getNodeProps('README.md')).toEqual({
      role: 'treeitem',
      ariaLevel: 1,
      ariaSetsize: 3,
      ariaPosinset: 2,
      ariaSelected: false,
      tabIndex: -1,
    });
  });

  it('getNodeProps -- root parent (collapsed) reports ariaExpanded=false', () => {
    const tree = createTree({ nodes: fileTree });
    const props = tree.getNodeProps('src');
    expect(props.ariaExpanded).toBe(false);
    expect(props.ariaLevel).toBe(1);
    expect(props.ariaSetsize).toBe(3);
    expect(props.ariaPosinset).toBe(1);
  });

  it('getNodeProps -- nested child reports correct level/setsize/posinset', () => {
    const tree = createTree({ nodes: fileTree, defaultExpanded: ['src'] });
    expect(tree.getNodeProps('src/index.ts')).toEqual({
      role: 'treeitem',
      ariaLevel: 2,
      ariaSetsize: 2,
      ariaPosinset: 1,
      ariaSelected: false,
      tabIndex: -1,
    });
    expect(tree.getNodeProps('src/lib')).toMatchObject({
      ariaLevel: 2,
      ariaPosinset: 2,
      ariaExpanded: false,
    });
  });

  it('focused node has tabIndex 0; others -1', () => {
    const tree = createTree({ nodes: fileTree });
    tree.focus('package.json');
    expect(tree.getNodeProps('package.json').tabIndex).toBe(0);
    expect(tree.getNodeProps('README.md').tabIndex).toBe(-1);
  });

  it('selected node reports ariaSelected=true', () => {
    const tree = createTree({ nodes: fileTree, defaultSelected: ['README.md'] });
    expect(tree.getNodeProps('README.md').ariaSelected).toBe(true);
    expect(tree.getNodeProps('package.json').ariaSelected).toBe(false);
  });

  it('hasChildren hint surfaces ariaExpanded even when children is empty', () => {
    const lazy: TreeNode<FileLike>[] = [{ id: 'a', data: { name: 'a' }, hasChildren: true }];
    const tree = createTree({ nodes: lazy });
    expect(tree.getNodeProps('a').ariaExpanded).toBe(false);
  });

  it('throws on unknown id', () => {
    const tree = createTree({ nodes: fileTree });
    expect(() => tree.getNodeProps('nope')).toThrow(/unknown id/);
  });
});

describe('multi-root', () => {
  it('treats every root as a top-level treeitem at level 1', () => {
    const multi: TreeNode<FileLike>[] = [
      { id: 'a', data: { name: 'a' } },
      { id: 'b', data: { name: 'b' }, children: [{ id: 'b/x', data: { name: 'x' } }] },
      { id: 'c', data: { name: 'c' } },
    ];
    const tree = createTree({ nodes: multi, defaultExpanded: ['b'] });
    expect(tree.getNodeProps('a')).toMatchObject({ ariaLevel: 1, ariaSetsize: 3, ariaPosinset: 1 });
    expect(tree.getNodeProps('b')).toMatchObject({ ariaLevel: 1, ariaSetsize: 3, ariaPosinset: 2 });
    expect(tree.getNodeProps('c')).toMatchObject({ ariaLevel: 1, ariaSetsize: 3, ariaPosinset: 3 });
    // movement crosses roots
    tree.focus('a');
    expect(tree.moveNext()).toBe('b');
    expect(tree.moveNext()).toBe('b/x');
    expect(tree.moveNext()).toBe('c');
  });
});

describe('deeply nested (3+ levels)', () => {
  it('reports correct levels at depth', () => {
    const tree = createTree({
      nodes: fileTree,
      defaultExpanded: ['src', 'src/lib', 'src/lib/deep'],
    });
    expect(tree.getNodeProps('src').ariaLevel).toBe(1);
    expect(tree.getNodeProps('src/lib').ariaLevel).toBe(2);
    expect(tree.getNodeProps('src/lib/deep').ariaLevel).toBe(3);
    expect(tree.getNodeProps('src/lib/deep/leaf.ts').ariaLevel).toBe(4);
  });

  it('moveOut climbs one level at a time from deep nodes', () => {
    const tree = createTree({
      nodes: fileTree,
      defaultExpanded: ['src', 'src/lib', 'src/lib/deep'],
    });
    tree.focus('src/lib/deep/leaf.ts');
    expect(tree.moveOut()).toBe('src/lib/deep');
    // now on an expanded node -- moveOut collapses
    expect(tree.moveOut()).toBe('src/lib/deep');
    expect(tree.state.expanded.has('src/lib/deep')).toBe(false);
    // next moveOut walks to parent
    expect(tree.moveOut()).toBe('src/lib');
  });
});
