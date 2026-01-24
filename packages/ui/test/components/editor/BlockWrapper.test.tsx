import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BlockWrapper, type BlockWrapperProps } from '../../../src/components/editor/BlockWrapper';

/**
 * Create default props for BlockWrapper
 */
function createDefaultProps(overrides: Partial<BlockWrapperProps> = {}): BlockWrapperProps {
  return {
    id: 'block-1',
    isSelected: false,
    isFocused: false,
    isFirst: false,
    isLast: false,
    onSelect: vi.fn(),
    onFocus: vi.fn(),
    onDelete: vi.fn(),
    onDuplicate: vi.fn(),
    onMoveUp: vi.fn(),
    onMoveDown: vi.fn(),
    children: <div data-testid="block-content">Block content</div>,
    ...overrides,
  };
}

describe('BlockWrapper', () => {
  describe('Selection State', () => {
    it('should show selection ring when isSelected', () => {
      const props = createDefaultProps({ isSelected: true });

      render(<BlockWrapper {...props} />);

      const wrapper = screen.getByTestId('block-wrapper-block-1');
      expect(wrapper).toHaveClass('ring-2', 'ring-primary');
    });

    it('should show focus ring when isFocused', () => {
      const props = createDefaultProps({ isFocused: true });

      render(<BlockWrapper {...props} />);

      const wrapper = screen.getByTestId('block-wrapper-block-1');
      expect(wrapper).toHaveClass('ring-2', 'ring-purple-500');
    });

    it('should show both rings when selected and focused', () => {
      const props = createDefaultProps({ isSelected: true, isFocused: true });

      render(<BlockWrapper {...props} />);

      const wrapper = screen.getByTestId('block-wrapper-block-1');
      expect(wrapper).toHaveClass('ring-2', 'ring-primary');
      expect(wrapper).toHaveClass('outline', 'outline-purple-500');
    });

    it('should have correct data attributes for state', () => {
      const props = createDefaultProps({ isSelected: true, isFocused: true });

      render(<BlockWrapper {...props} />);

      const wrapper = screen.getByTestId('block-wrapper-block-1');
      expect(wrapper).toHaveAttribute('data-selected', 'true');
      expect(wrapper).toHaveAttribute('data-focused', 'true');
    });
  });

  describe('Drag Handle', () => {
    it('should show drag handle on hover', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockWrapper {...props} />);

      const wrapper = screen.getByTestId('block-wrapper-block-1');
      const dragHandle = screen.getByTestId('block-drag-handle-block-1');

      // Initially hidden
      expect(dragHandle).toHaveClass('opacity-0');

      // Show on hover
      await user.hover(wrapper);
      expect(dragHandle).toHaveClass('opacity-100');
    });

    it('should be hidden from screen readers (pointer-only interaction)', () => {
      const props = createDefaultProps();

      render(<BlockWrapper {...props} />);

      const dragHandle = screen.getByTestId('block-drag-handle-block-1');
      expect(dragHandle).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not render drag handle when draggable is false', () => {
      const props = createDefaultProps({ draggable: false });

      render(<BlockWrapper {...props} />);

      expect(screen.queryByTestId('block-drag-handle-block-1')).not.toBeInTheDocument();
    });
  });

  describe('Actions Menu', () => {
    it('should show actions menu on hover', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockWrapper {...props} />);

      const wrapper = screen.getByTestId('block-wrapper-block-1');
      const menuButton = screen.getByTestId('block-menu-block-1');

      // Initially hidden
      expect(menuButton).toHaveClass('opacity-0');

      // Show on hover
      await user.hover(wrapper);
      expect(menuButton).toHaveClass('opacity-100');
    });

    it('should have correct accessibility label', () => {
      const props = createDefaultProps();

      render(<BlockWrapper {...props} />);

      const menuButton = screen.getByTestId('block-menu-block-1');
      expect(menuButton).toHaveAttribute('aria-label', 'Block actions');
    });

    it('should call onDelete when delete clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const props = createDefaultProps({ onDelete });

      render(<BlockWrapper {...props} />);

      const menuButton = screen.getByTestId('block-menu-block-1');
      await user.click(menuButton);

      const deleteItem = screen.getByText('Delete');
      await user.click(deleteItem);

      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('should call onDuplicate when duplicate clicked', async () => {
      const user = userEvent.setup();
      const onDuplicate = vi.fn();
      const props = createDefaultProps({ onDuplicate });

      render(<BlockWrapper {...props} />);

      const menuButton = screen.getByTestId('block-menu-block-1');
      await user.click(menuButton);

      const duplicateItem = screen.getByText('Duplicate');
      await user.click(duplicateItem);

      expect(onDuplicate).toHaveBeenCalledTimes(1);
    });

    it('should disable move up when isFirst', async () => {
      const user = userEvent.setup();
      const onMoveUp = vi.fn();
      const props = createDefaultProps({ isFirst: true, onMoveUp });

      render(<BlockWrapper {...props} />);

      const menuButton = screen.getByTestId('block-menu-block-1');
      await user.click(menuButton);

      const moveUpItem = screen.getByText('Move up');
      expect(moveUpItem).toHaveAttribute('data-disabled');
    });

    it('should disable move down when isLast', async () => {
      const user = userEvent.setup();
      const onMoveDown = vi.fn();
      const props = createDefaultProps({ isLast: true, onMoveDown });

      render(<BlockWrapper {...props} />);

      const menuButton = screen.getByTestId('block-menu-block-1');
      await user.click(menuButton);

      const moveDownItem = screen.getByText('Move down');
      expect(moveDownItem).toHaveAttribute('data-disabled');
    });

    it('should call onMoveUp when move up clicked', async () => {
      const user = userEvent.setup();
      const onMoveUp = vi.fn();
      const props = createDefaultProps({ onMoveUp });

      render(<BlockWrapper {...props} />);

      const menuButton = screen.getByTestId('block-menu-block-1');
      await user.click(menuButton);

      const moveUpItem = screen.getByText('Move up');
      await user.click(moveUpItem);

      expect(onMoveUp).toHaveBeenCalledTimes(1);
    });

    it('should call onMoveDown when move down clicked', async () => {
      const user = userEvent.setup();
      const onMoveDown = vi.fn();
      const props = createDefaultProps({ onMoveDown });

      render(<BlockWrapper {...props} />);

      const menuButton = screen.getByTestId('block-menu-block-1');
      await user.click(menuButton);

      const moveDownItem = screen.getByText('Move down');
      await user.click(moveDownItem);

      expect(onMoveDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Click Behavior', () => {
    it('should call onSelect on click', () => {
      const onSelect = vi.fn();
      const onFocus = vi.fn();
      const props = createDefaultProps({ onSelect, onFocus });

      render(<BlockWrapper {...props} />);

      const content = screen.getByTestId('block-content');
      fireEvent.click(content);

      expect(onSelect).toHaveBeenCalledWith(false);
      expect(onFocus).toHaveBeenCalled();
    });

    it('should call onSelect(true) on Cmd+click', () => {
      const onSelect = vi.fn();
      const props = createDefaultProps({ onSelect });

      render(<BlockWrapper {...props} />);

      const content = screen.getByTestId('block-content');
      fireEvent.click(content, { metaKey: true });

      expect(onSelect).toHaveBeenCalledWith(true);
    });

    it('should call onSelect(true) on Ctrl+click', () => {
      const onSelect = vi.fn();
      const props = createDefaultProps({ onSelect });

      render(<BlockWrapper {...props} />);

      const content = screen.getByTestId('block-content');
      fireEvent.click(content, { ctrlKey: true });

      expect(onSelect).toHaveBeenCalledWith(true);
    });

    it('should not call onSelect when clicking drag handle', () => {
      const onSelect = vi.fn();
      const props = createDefaultProps({ onSelect });

      render(<BlockWrapper {...props} />);

      const dragHandle = screen.getByTestId('block-drag-handle-block-1');
      fireEvent.click(dragHandle);

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should not call onSelect when clicking menu button', () => {
      const onSelect = vi.fn();
      const props = createDefaultProps({ onSelect });

      render(<BlockWrapper {...props} />);

      const menuButton = screen.getByTestId('block-menu-block-1');
      fireEvent.click(menuButton);

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have listitem role', () => {
      const props = createDefaultProps();

      render(<BlockWrapper {...props} />);

      const wrapper = screen.getByRole('listitem');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render children content', () => {
      const props = createDefaultProps();

      render(<BlockWrapper {...props} />);

      expect(screen.getByTestId('block-content')).toBeInTheDocument();
      expect(screen.getByText('Block content')).toBeInTheDocument();
    });

    it('should have correct data-block-wrapper attribute', () => {
      const props = createDefaultProps({ id: 'custom-block-id' });

      render(<BlockWrapper {...props} />);

      const wrapper = screen.getByTestId('block-wrapper-custom-block-id');
      expect(wrapper).toHaveAttribute('data-block-wrapper', 'custom-block-id');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing callbacks gracefully', () => {
      // Create props with no-op functions
      const props: BlockWrapperProps = {
        id: 'block-1',
        isSelected: false,
        isFocused: false,
        isFirst: false,
        isLast: false,
        onSelect: () => {},
        onFocus: () => {},
        onDelete: () => {},
        onDuplicate: () => {},
        onMoveUp: () => {},
        onMoveDown: () => {},
        children: <div>Content</div>,
      };

      expect(() => render(<BlockWrapper {...props} />)).not.toThrow();
    });

    it('should apply custom className', () => {
      const props = createDefaultProps({ className: 'custom-class' });

      render(<BlockWrapper {...props} />);

      const wrapper = screen.getByTestId('block-wrapper-block-1');
      expect(wrapper).toHaveClass('custom-class');
    });
  });
});
