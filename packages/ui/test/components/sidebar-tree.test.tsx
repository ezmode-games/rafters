import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SidebarTree, type SidebarTreeNodeRenderState } from '../../src/components/ui/sidebar-tree';
import type { TreeNode } from '../../src/primitives/tree';

interface FileLike {
  label: string;
  status?: 'draft' | 'in-review';
}

function n(id: string, label: string, children?: TreeNode<FileLike>[]): TreeNode<FileLike> {
  const node: TreeNode<FileLike> = { id, data: { label } };
  if (children) node.children = children;
  return node;
}

const FILES: TreeNode<FileLike>[] = [
  n('a', 'Apple'),
  n('b', 'Banana', [n('b1', 'Blackberry'), n('b2', 'Blueberry')]),
  n('c', 'Cherry'),
];

const renderLabel = ({ node }: SidebarTreeNodeRenderState<FileLike>) => (
  <span data-testid={`label-${node.id}`}>{node.data.label}</span>
);

describe('SidebarTree', () => {
  it('renders top-level nodes as treeitems with role=tree root', () => {
    render(<SidebarTree nodes={FILES} renderNode={renderLabel} aria-label="Files" />);
    const tree = screen.getByRole('tree', { name: 'Files' });
    expect(tree).toBeInTheDocument();
    expect(
      within(tree)
        .getAllByRole('treeitem')
        .map((el) => el.textContent),
    ).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('children of collapsed parents are not in the DOM', () => {
    render(<SidebarTree nodes={FILES} renderNode={renderLabel} />);
    expect(screen.queryByTestId('label-b1')).not.toBeInTheDocument();
  });

  it('clicking the chevron expands the parent', () => {
    render(<SidebarTree nodes={FILES} renderNode={renderLabel} />);
    const expand = screen.getByRole('button', { name: 'Expand' });
    fireEvent.click(expand);
    expect(screen.getByTestId('label-b1')).toBeInTheDocument();
    expect(screen.getByTestId('label-b2')).toBeInTheDocument();
  });

  it('renders a role=group wrapper around expanded children', () => {
    render(<SidebarTree nodes={FILES} renderNode={renderLabel} defaultExpanded={['b']} />);
    const groups = screen.getAllByRole('group');
    expect(groups.length).toBe(1);
    expect(
      within(groups[0] as HTMLElement)
        .getAllByRole('treeitem')
        .map((el) => el.textContent),
    ).toEqual(['Blackberry', 'Blueberry']);
  });

  it('clicking a row activates it and reports via onActivate', () => {
    const onActivate = vi.fn();
    render(<SidebarTree nodes={FILES} renderNode={renderLabel} onActivate={onActivate} />);
    fireEvent.click(screen.getByText('Cherry'));
    expect(onActivate).toHaveBeenCalledWith('c');
  });

  it('clicking a row updates aria-selected', () => {
    render(<SidebarTree nodes={FILES} renderNode={renderLabel} />);
    fireEvent.click(screen.getByText('Apple'));
    const apple = screen.getByText('Apple').closest('[role="treeitem"]') as HTMLElement;
    expect(apple).toHaveAttribute('aria-selected', 'true');
  });

  it('keyboard ArrowRight expands parent then descends on second press', () => {
    render(<SidebarTree nodes={FILES} renderNode={renderLabel} defaultFocused="b" />);
    const tree = screen.getByRole('tree');
    fireEvent.keyDown(tree, { key: 'ArrowRight' });
    expect(screen.getByTestId('label-b1')).toBeInTheDocument();
    fireEvent.keyDown(tree, { key: 'ArrowRight' });
    const b1 = screen.getByText('Blackberry').closest('[role="treeitem"]') as HTMLElement;
    expect(b1).toHaveAttribute('tabindex', '0');
  });

  it('aria-level reflects depth', () => {
    render(<SidebarTree nodes={FILES} renderNode={renderLabel} defaultExpanded={['b']} />);
    const apple = screen.getByText('Apple').closest('[role="treeitem"]') as HTMLElement;
    const b1 = screen.getByText('Blackberry').closest('[role="treeitem"]') as HTMLElement;
    expect(apple).toHaveAttribute('aria-level', '1');
    expect(b1).toHaveAttribute('aria-level', '2');
  });

  it('renderNode receives expansion + selection state', () => {
    const renderState: SidebarTreeNodeRenderState<FileLike>[] = [];
    render(
      <SidebarTree
        nodes={FILES}
        renderNode={(state) => {
          renderState.push(state);
          return <span>{state.node.data.label}</span>;
        }}
        defaultExpanded={['b']}
        defaultSelected={['b1']}
        defaultFocused="b1"
      />,
    );
    const b1State = renderState.find((s) => s.node.id === 'b1');
    expect(b1State?.isSelected).toBe(true);
    expect(b1State?.isFocused).toBe(true);
    expect(b1State?.level).toBe(2);
    const bState = renderState.find((s) => s.node.id === 'b');
    expect(bState?.isExpanded).toBe(true);
    expect(bState?.hasChildren).toBe(true);
  });

  it('multiple selection mode supports cmd-click append', () => {
    render(<SidebarTree nodes={FILES} renderNode={renderLabel} selectionMode="multiple" />);
    fireEvent.click(screen.getByText('Apple'));
    fireEvent.click(screen.getByText('Cherry'), { metaKey: true });
    const apple = screen.getByText('Apple').closest('[role="treeitem"]') as HTMLElement;
    const cherry = screen.getByText('Cherry').closest('[role="treeitem"]') as HTMLElement;
    expect(apple).toHaveAttribute('aria-selected', 'true');
    expect(cherry).toHaveAttribute('aria-selected', 'true');
  });
});
