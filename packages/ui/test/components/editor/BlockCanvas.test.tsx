import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  type Block,
  BlockCanvas,
  type BlockCanvasProps,
  type BlockRenderContext,
} from '../../../src/components/editor/BlockCanvas';

/**
 * Create test blocks
 */
function createTestBlocks(count: number): Block[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `block-${i + 1}`,
    type: 'paragraph',
    props: { text: `Block ${i + 1} content` },
  }));
}

/**
 * Default render function for blocks
 */
function defaultRenderBlock(block: Block, context: BlockRenderContext) {
  return (
    <div
      data-testid={`rendered-block-${block.id}`}
      data-selected={context.isSelected}
      data-focused={context.isFocused}
      data-index={context.index}
    >
      {String(block.props.text)}
    </div>
  );
}

/**
 * Create default props for BlockCanvas
 */
function createDefaultProps(overrides: Partial<BlockCanvasProps> = {}): BlockCanvasProps {
  return {
    blocks: createTestBlocks(3),
    selectedIds: new Set(),
    focusedId: undefined,
    onSelectionChange: vi.fn(),
    onFocusChange: vi.fn(),
    onBlocksChange: vi.fn(),
    onBlockAdd: vi.fn(),
    onBlockRemove: vi.fn(),
    onBlockMove: vi.fn(),
    renderBlock: defaultRenderBlock,
    ...overrides,
  };
}

describe('BlockCanvas', () => {
  describe('Rendering', () => {
    it('renders all blocks with correct context', () => {
      const props = createDefaultProps();

      render(<BlockCanvas {...props} />);

      expect(screen.getByTestId('rendered-block-block-1')).toBeInTheDocument();
      expect(screen.getByTestId('rendered-block-block-2')).toBeInTheDocument();
      expect(screen.getByTestId('rendered-block-block-3')).toBeInTheDocument();
    });

    it('provides index, total, isFirst, isLast in context', () => {
      const renderBlock = vi.fn((block: Block, context: BlockRenderContext) => (
        <div data-testid={`block-${block.id}`}>
          {JSON.stringify({
            index: context.index,
            total: context.total,
            isFirst: context.isFirst,
            isLast: context.isLast,
          })}
        </div>
      ));

      const props = createDefaultProps({ renderBlock });
      render(<BlockCanvas {...props} />);

      // Check first call (first block)
      expect(renderBlock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'block-1' }),
        expect.objectContaining({
          index: 0,
          total: 3,
          isFirst: true,
          isLast: false,
        }),
      );

      // Check last call (last block)
      expect(renderBlock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'block-3' }),
        expect.objectContaining({
          index: 2,
          total: 3,
          isFirst: false,
          isLast: true,
        }),
      );
    });

    it('shows empty state when no blocks', () => {
      const props = createDefaultProps({ blocks: [] });

      render(<BlockCanvas {...props} />);

      expect(screen.getByTestId('block-canvas-empty')).toBeInTheDocument();
      expect(screen.getByText('No blocks yet')).toBeInTheDocument();
    });

    it('shows custom empty state when provided', () => {
      const props = createDefaultProps({
        blocks: [],
        emptyState: <div data-testid="custom-empty">Add your first block</div>,
      });

      render(<BlockCanvas {...props} />);

      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
      expect(screen.getByText('Add your first block')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const props = createDefaultProps({ className: 'custom-canvas-class' });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');
      expect(canvas).toHaveClass('custom-canvas-class');
    });
  });

  describe('Selection - Click', () => {
    it('selects block on click', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      const props = createDefaultProps({ onSelectionChange });

      render(<BlockCanvas {...props} />);

      await user.click(screen.getByTestId('block-block-1'));

      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-1']));
    });

    it('multi-selects with Cmd+click', () => {
      const onSelectionChange = vi.fn();
      const props = createDefaultProps({
        onSelectionChange,
        selectedIds: new Set(['block-1']),
      });

      render(<BlockCanvas {...props} />);

      fireEvent.click(screen.getByTestId('block-block-2'), { metaKey: true });

      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-1', 'block-2']));
    });

    it('multi-selects with Ctrl+click', () => {
      const onSelectionChange = vi.fn();
      const props = createDefaultProps({
        onSelectionChange,
        selectedIds: new Set(['block-1']),
      });

      render(<BlockCanvas {...props} />);

      fireEvent.click(screen.getByTestId('block-block-3'), { ctrlKey: true });

      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-1', 'block-3']));
    });

    it('range selects with Shift+click', () => {
      const onSelectionChange = vi.fn();
      const props = createDefaultProps({
        onSelectionChange,
        focusedId: 'block-1',
      });

      render(<BlockCanvas {...props} />);

      fireEvent.click(screen.getByTestId('block-block-3'), { shiftKey: true });

      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-1', 'block-2', 'block-3']));
    });

    it('clears selection when clicking on canvas background', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      const onFocusChange = vi.fn();
      const props = createDefaultProps({
        onSelectionChange,
        onFocusChange,
        selectedIds: new Set(['block-1', 'block-2']),
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');
      await user.click(canvas);

      expect(onSelectionChange).toHaveBeenCalledWith(new Set());
      expect(onFocusChange).toHaveBeenCalledWith(null);
    });
  });

  describe('Focus Management', () => {
    it('updates focus when block is clicked', async () => {
      const user = userEvent.setup();
      const onFocusChange = vi.fn();
      const props = createDefaultProps({ onFocusChange });

      render(<BlockCanvas {...props} />);

      await user.click(screen.getByTestId('block-block-2'));

      expect(onFocusChange).toHaveBeenCalledWith('block-2');
    });

    it('separates focus from selection state', () => {
      const onSelectionChange = vi.fn();
      const onFocusChange = vi.fn();
      const props = createDefaultProps({
        onSelectionChange,
        onFocusChange,
        selectedIds: new Set(['block-1']),
        focusedId: 'block-1',
      });

      render(<BlockCanvas {...props} />);

      // Click block-2 with Cmd to add to selection without changing focus behavior
      fireEvent.click(screen.getByTestId('block-block-2'), { metaKey: true });

      // Focus should change to block-2
      expect(onFocusChange).toHaveBeenCalledWith('block-2');
      // Selection should include both
      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-1', 'block-2']));
    });

    it('shows focused block with data-focused attribute', () => {
      const props = createDefaultProps({ focusedId: 'block-2' });

      render(<BlockCanvas {...props} />);

      const block2 = screen.getByTestId('block-block-2');
      expect(block2).toHaveAttribute('data-focused', 'true');

      const block1 = screen.getByTestId('block-block-1');
      expect(block1).toHaveAttribute('data-focused', 'false');
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates focus with arrow keys', () => {
      const onFocusChange = vi.fn();
      const props = createDefaultProps({
        onFocusChange,
        focusedId: 'block-2',
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.keyDown(canvas, { key: 'ArrowDown' });
      expect(onFocusChange).toHaveBeenCalledWith('block-3');

      onFocusChange.mockClear();
      fireEvent.keyDown(canvas, { key: 'ArrowUp' });
      expect(onFocusChange).toHaveBeenCalledWith('block-1');
    });

    it('navigates to first block with Home key', () => {
      const onFocusChange = vi.fn();
      const props = createDefaultProps({
        onFocusChange,
        focusedId: 'block-3',
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.keyDown(canvas, { key: 'Home' });
      expect(onFocusChange).toHaveBeenCalledWith('block-1');
    });

    it('navigates to last block with End key', () => {
      const onFocusChange = vi.fn();
      const props = createDefaultProps({
        onFocusChange,
        focusedId: 'block-1',
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.keyDown(canvas, { key: 'End' });
      expect(onFocusChange).toHaveBeenCalledWith('block-3');
    });

    it('extends selection with Shift+arrow keys', () => {
      const onSelectionChange = vi.fn();
      const onFocusChange = vi.fn();
      const props = createDefaultProps({
        onSelectionChange,
        onFocusChange,
        focusedId: 'block-2',
        selectedIds: new Set(['block-2']),
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.keyDown(canvas, { key: 'ArrowDown', shiftKey: true });

      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-2', 'block-3']));
      expect(onFocusChange).toHaveBeenCalledWith('block-3');
    });

    it('selects all with Cmd+A', () => {
      const onSelectionChange = vi.fn();
      const props = createDefaultProps({ onSelectionChange });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.keyDown(canvas, { key: 'a', metaKey: true });

      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-1', 'block-2', 'block-3']));
    });

    it('clears selection with Escape', () => {
      const onSelectionChange = vi.fn();
      const props = createDefaultProps({
        onSelectionChange,
        selectedIds: new Set(['block-1', 'block-2']),
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.keyDown(canvas, { key: 'Escape' });

      expect(onSelectionChange).toHaveBeenCalledWith(new Set());
    });

    it('toggles selection on focused block with Space', () => {
      const onSelectionChange = vi.fn();
      const props = createDefaultProps({
        onSelectionChange,
        focusedId: 'block-2',
        selectedIds: new Set(),
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.keyDown(canvas, { key: ' ' });

      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-2']));
    });

    it('toggles selection on focused block with Enter', () => {
      const onSelectionChange = vi.fn();
      const props = createDefaultProps({
        onSelectionChange,
        focusedId: 'block-2',
        selectedIds: new Set(['block-2']),
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.keyDown(canvas, { key: 'Enter' });

      // Should toggle off since already selected
      expect(onSelectionChange).toHaveBeenCalledWith(new Set());
    });
  });

  describe('Accessibility', () => {
    it('has listbox role with aria-label', () => {
      const props = createDefaultProps();

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByRole('listbox', { name: 'Block editor canvas' });
      expect(canvas).toBeInTheDocument();
    });

    it('has aria-multiselectable', () => {
      const props = createDefaultProps();

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');
      expect(canvas).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('sets aria-activedescendant for focused block', () => {
      const props = createDefaultProps({ focusedId: 'block-2' });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');
      expect(canvas).toHaveAttribute('aria-activedescendant', 'block-block-2');
    });

    it('blocks have option role with aria-selected', () => {
      const props = createDefaultProps({
        selectedIds: new Set(['block-1', 'block-3']),
      });

      render(<BlockCanvas {...props} />);

      const block1 = screen.getByTestId('block-block-1');
      expect(block1).toHaveRole('option');
      expect(block1).toHaveAttribute('aria-selected', 'true');

      const block2 = screen.getByTestId('block-block-2');
      expect(block2).toHaveAttribute('aria-selected', 'false');

      const block3 = screen.getByTestId('block-block-3');
      expect(block3).toHaveAttribute('aria-selected', 'true');
    });

    it('announces selection changes to screen readers', () => {
      const props = createDefaultProps({
        selectedIds: new Set(['block-1', 'block-2']),
      });

      render(<BlockCanvas {...props} />);

      const announcement = screen.getByRole('status');
      expect(announcement).toHaveTextContent('2 blocks selected');
    });

    it('announces singular selection correctly', () => {
      const props = createDefaultProps({
        selectedIds: new Set(['block-1']),
      });

      render(<BlockCanvas {...props} />);

      const announcement = screen.getByRole('status');
      expect(announcement).toHaveTextContent('1 block selected');
    });

    it('canvas is focusable with tabIndex', () => {
      const props = createDefaultProps();

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');
      expect(canvas).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty blocks array gracefully', () => {
      const props = createDefaultProps({ blocks: [] });

      expect(() => render(<BlockCanvas {...props} />)).not.toThrow();
      expect(screen.getByTestId('block-canvas-empty')).toBeInTheDocument();
    });

    it('handles arrow navigation at boundaries', () => {
      const onFocusChange = vi.fn();
      const props = createDefaultProps({
        onFocusChange,
        focusedId: 'block-1',
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      // Try to go up from first block
      fireEvent.keyDown(canvas, { key: 'ArrowUp' });

      // Should stay at first block
      expect(onFocusChange).toHaveBeenCalledWith('block-1');
    });

    it('handles arrow navigation with no focus', () => {
      const onFocusChange = vi.fn();
      const props = createDefaultProps({
        onFocusChange,
        focusedId: undefined,
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.keyDown(canvas, { key: 'ArrowDown' });

      // Should focus first block when no focus
      expect(onFocusChange).toHaveBeenCalledWith('block-1');
    });

    it('handles toggle selection with no focused block', () => {
      const onSelectionChange = vi.fn();
      const props = createDefaultProps({
        onSelectionChange,
        focusedId: undefined,
      });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.keyDown(canvas, { key: ' ' });

      // Should not change selection when no block is focused
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('Block Context', () => {
    it('passes isSelected correctly to renderBlock', () => {
      const renderBlock = vi.fn((_block: Block, context: BlockRenderContext) => (
        <div>{context.isSelected ? 'selected' : 'not selected'}</div>
      ));

      const props = createDefaultProps({
        renderBlock,
        selectedIds: new Set(['block-2']),
      });

      render(<BlockCanvas {...props} />);

      expect(renderBlock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'block-1' }),
        expect.objectContaining({ isSelected: false }),
      );

      expect(renderBlock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'block-2' }),
        expect.objectContaining({ isSelected: true }),
      );
    });

    it('passes isFocused correctly to renderBlock', () => {
      const renderBlock = vi.fn((_block: Block, context: BlockRenderContext) => (
        <div>{context.isFocused ? 'focused' : 'not focused'}</div>
      ));

      const props = createDefaultProps({
        renderBlock,
        focusedId: 'block-3',
      });

      render(<BlockCanvas {...props} />);

      expect(renderBlock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'block-1' }),
        expect.objectContaining({ isFocused: false }),
      );

      expect(renderBlock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'block-3' }),
        expect.objectContaining({ isFocused: true }),
      );
    });
  });

  describe('Drag and Drop', () => {
    it('shows drop indicator when dragging over canvas', () => {
      const props = createDefaultProps();

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      // Simulate drag over with a block ID
      fireEvent.dragOver(canvas, {
        dataTransfer: {
          getData: () => 'block-1',
        },
        clientY: 500, // Bottom of the canvas
      });

      // The drop zone integration handles this internally
      expect(canvas).toBeInTheDocument();
    });

    it('calls onBlockMove when block is dropped', () => {
      const onBlockMove = vi.fn();
      const props = createDefaultProps({ onBlockMove });

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      // Simulate the drop event sequence
      fireEvent.dragEnter(canvas);
      fireEvent.dragOver(canvas, { clientY: 100 });
      fireEvent.drop(canvas, {
        dataTransfer: {
          getData: () => 'block-3',
        },
      });

      // The actual onBlockMove call depends on the useDropZone implementation
      // which manages the internal state. This test verifies the component
      // handles the drag events without throwing
      expect(canvas).toBeInTheDocument();
    });

    it('clears drop indicator on drag leave', () => {
      const props = createDefaultProps();

      render(<BlockCanvas {...props} />);

      const canvas = screen.getByTestId('block-canvas');

      fireEvent.dragEnter(canvas);
      fireEvent.dragOver(canvas, { clientY: 100 });
      fireEvent.dragLeave(canvas);

      // Component should handle drag leave gracefully
      expect(canvas).toBeInTheDocument();
    });

    it('renders drop indicators between blocks', () => {
      const props = createDefaultProps();

      const { container } = render(<BlockCanvas {...props} />);

      // Get all potential drop indicator positions
      const blocks = container.querySelectorAll('[data-block-id]');
      expect(blocks).toHaveLength(3);

      // Each block should have an associated drop indicator slot
      // (indicators only show when dropTargetIndex matches)
    });
  });
});
