import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  type BlockRegistry,
  BlockSidebar,
  type BlockSidebarProps,
} from '../../../src/components/editor/BlockSidebar';

/**
 * Create a test registry with blocks and categories
 */
function createTestRegistry(): BlockRegistry {
  return {
    blocks: [
      { type: 'paragraph', label: 'Paragraph', category: 'text', keywords: ['body', 'content'] },
      { type: 'heading', label: 'Heading', category: 'text', description: 'Section title' },
      { type: 'list', label: 'List', category: 'text' },
      { type: 'image', label: 'Image', category: 'media', keywords: ['photo', 'picture'] },
      { type: 'video', label: 'Video', category: 'media' },
      { type: 'columns', label: 'Columns', category: 'layout' },
      { type: 'divider', label: 'Divider', category: 'layout' },
    ],
    categories: [
      { id: 'text', label: 'Text', order: 1 },
      { id: 'media', label: 'Media', order: 2 },
      { id: 'layout', label: 'Layout', order: 3 },
    ],
  };
}

/**
 * Create default props for BlockSidebar
 */
function createDefaultProps(overrides: Partial<BlockSidebarProps> = {}): BlockSidebarProps {
  return {
    registry: createTestRegistry(),
    onInsert: vi.fn(),
    ...overrides,
  };
}

describe('BlockSidebar', () => {
  describe('Rendering', () => {
    it('renders sidebar with blocks', () => {
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      expect(screen.getByTestId('block-sidebar')).toBeInTheDocument();
    });

    it('renders search input', () => {
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      expect(screen.getByTestId('block-search-input')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const props = createDefaultProps({ className: 'custom-class' });

      render(<BlockSidebar {...props} />);

      expect(screen.getByTestId('block-sidebar')).toHaveClass('custom-class');
    });
  });

  describe('Categories', () => {
    it('groups blocks by category', () => {
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      expect(screen.getByTestId('category-text')).toBeInTheDocument();
      expect(screen.getByTestId('category-media')).toBeInTheDocument();
      expect(screen.getByTestId('category-layout')).toBeInTheDocument();
    });

    it('sorts categories by order', () => {
      const registry: BlockRegistry = {
        blocks: [
          { type: 'a', label: 'A', category: 'third' },
          { type: 'b', label: 'B', category: 'first' },
          { type: 'c', label: 'C', category: 'second' },
        ],
        categories: [
          { id: 'first', label: 'First', order: 1 },
          { id: 'second', label: 'Second', order: 2 },
          { id: 'third', label: 'Third', order: 3 },
        ],
      };
      const props = createDefaultProps({ registry });

      render(<BlockSidebar {...props} />);

      const categories = screen.getAllByTestId(/^category-/);
      expect(categories[0]).toHaveAttribute('data-testid', 'category-first');
      expect(categories[1]).toHaveAttribute('data-testid', 'category-second');
      expect(categories[2]).toHaveAttribute('data-testid', 'category-third');
    });

    it('expands and collapses categories', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      // Find the Text category trigger
      const textTrigger = screen.getByRole('button', { name: 'Text' });

      // Click to expand
      await user.click(textTrigger);

      // Check that blocks are visible
      expect(screen.getByTestId('block-item-paragraph')).toBeInTheDocument();

      // Click to collapse
      await user.click(textTrigger);
    });
  });

  describe('Recently Used', () => {
    it('shows recently used section when provided', () => {
      const props = createDefaultProps({
        recentlyUsed: ['paragraph', 'heading'],
      });

      render(<BlockSidebar {...props} />);

      expect(screen.getByText('Recently Used')).toBeInTheDocument();
    });

    it('does not show recently used when empty', () => {
      const props = createDefaultProps({
        recentlyUsed: [],
      });

      render(<BlockSidebar {...props} />);

      expect(screen.queryByText('Recently Used')).not.toBeInTheDocument();
    });

    it('shows recent blocks in recently used section', () => {
      const props = createDefaultProps({
        recentlyUsed: ['paragraph', 'image'],
      });

      render(<BlockSidebar {...props} />);

      // Find blocks in recently used section
      const recentSection = screen.getByText('Recently Used').parentElement;
      expect(recentSection).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('filters blocks on search', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      const searchInput = screen.getByTestId('block-search-input');
      await user.type(searchInput, 'para');

      // Should show paragraph, hide others
      expect(screen.getByTestId('block-item-paragraph')).toBeInTheDocument();
      expect(screen.queryByTestId('block-item-image')).not.toBeInTheDocument();
    });

    it('searches in keywords', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      const searchInput = screen.getByTestId('block-search-input');
      await user.type(searchInput, 'photo');

      // Should show image (has 'photo' keyword)
      expect(screen.getByTestId('block-item-image')).toBeInTheDocument();
    });

    it('shows no results message when nothing matches', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      const searchInput = screen.getByTestId('block-search-input');
      await user.type(searchInput, 'xyznonexistent');

      expect(screen.getByTestId('no-results')).toBeInTheDocument();
      expect(screen.getByText('No blocks found')).toBeInTheDocument();
    });

    it('clears search on Escape', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      const searchInput = screen.getByTestId('block-search-input');
      await user.type(searchInput, 'test');

      expect(searchInput).toHaveValue('test');

      fireEvent.keyDown(searchInput, { key: 'Escape' });

      expect(searchInput).toHaveValue('');
    });

    it('highlights matched text in search results', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      const searchInput = screen.getByTestId('block-search-input');
      await user.type(searchInput, 'para');

      // Check for highlighted text (mark element)
      const marks = screen.getAllByText(/para/i, { selector: 'mark' });
      expect(marks.length).toBeGreaterThan(0);
    });
  });

  describe('Block Insertion', () => {
    it('calls onInsert when block clicked', async () => {
      const user = userEvent.setup();
      const onInsert = vi.fn();
      const props = createDefaultProps({ onInsert });

      render(<BlockSidebar {...props} />);

      // Expand text category first
      const textTrigger = screen.getByRole('button', { name: 'Text' });
      await user.click(textTrigger);

      // Click a block
      const blockItem = screen.getByTestId('block-item-paragraph');
      await user.click(blockItem);

      expect(onInsert).toHaveBeenCalledWith('paragraph');
    });

    it('calls onInsert on Enter key', async () => {
      const user = userEvent.setup();
      const onInsert = vi.fn();
      const props = createDefaultProps({ onInsert });

      render(<BlockSidebar {...props} />);

      // Expand text category
      const textTrigger = screen.getByRole('button', { name: 'Text' });
      await user.click(textTrigger);

      // Focus and press Enter on a block
      const blockItem = screen.getByTestId('block-item-paragraph');
      blockItem.focus();
      await user.keyboard('{Enter}');

      expect(onInsert).toHaveBeenCalledWith('paragraph');
    });

    it('calls onInsert on Space key', async () => {
      const user = userEvent.setup();
      const onInsert = vi.fn();
      const props = createDefaultProps({ onInsert });

      render(<BlockSidebar {...props} />);

      // Expand text category
      const textTrigger = screen.getByRole('button', { name: 'Text' });
      await user.click(textTrigger);

      // Focus and press Space on a block
      const blockItem = screen.getByTestId('block-item-paragraph');
      blockItem.focus();
      await user.keyboard(' ');

      expect(onInsert).toHaveBeenCalledWith('paragraph');
    });
  });

  describe('Drag and Drop', () => {
    it('makes blocks draggable', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      // Expand text category
      const textTrigger = screen.getByRole('button', { name: 'Text' });
      await user.click(textTrigger);

      const blockItem = screen.getByTestId('block-item-paragraph');
      expect(blockItem).toHaveAttribute('draggable', 'true');
    });
  });

  describe('Collapse', () => {
    it('shows collapsed state when collapsed prop is true', () => {
      const props = createDefaultProps({ collapsed: true });

      render(<BlockSidebar {...props} />);

      const sidebar = screen.getByTestId('block-sidebar');
      expect(sidebar).toHaveAttribute('data-collapsed', 'true');
    });

    it('calls onCollapse when collapse button clicked', async () => {
      const user = userEvent.setup();
      const onCollapse = vi.fn();
      const props = createDefaultProps({ onCollapse });

      render(<BlockSidebar {...props} />);

      const collapseButton = screen.getByRole('button', { name: 'Collapse sidebar' });
      await user.click(collapseButton);

      expect(onCollapse).toHaveBeenCalledWith(true);
    });

    it('calls onCollapse to expand when in collapsed state', async () => {
      const user = userEvent.setup();
      const onCollapse = vi.fn();
      const props = createDefaultProps({ collapsed: true, onCollapse });

      render(<BlockSidebar {...props} />);

      const expandButton = screen.getByRole('button', { name: 'Expand sidebar' });
      await user.click(expandButton);

      expect(onCollapse).toHaveBeenCalledWith(false);
    });
  });

  describe('Empty State', () => {
    it('shows empty state for empty registry', () => {
      const props = createDefaultProps({
        registry: { blocks: [], categories: [] },
      });

      render(<BlockSidebar {...props} />);

      expect(screen.getByText('No blocks available')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible search input', () => {
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      const searchInput = screen.getByRole('textbox', { name: 'Search blocks' });
      expect(searchInput).toBeInTheDocument();
    });

    it('blocks are keyboard focusable', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      // Expand text category
      const textTrigger = screen.getByRole('button', { name: 'Text' });
      await user.click(textTrigger);

      // Block should be focusable
      const blockItem = screen.getByTestId('block-item-paragraph');
      expect(blockItem).toHaveAttribute('tabIndex', '0');
    });

    it('block items have option role', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<BlockSidebar {...props} />);

      // Expand text category
      const textTrigger = screen.getByRole('button', { name: 'Text' });
      await user.click(textTrigger);

      const blockItem = screen.getByTestId('block-item-paragraph');
      expect(blockItem).toHaveAttribute('role', 'option');
    });
  });
});
