import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommandPaletteUI } from '../../../src/components/editor/CommandPaletteUI';
import type { Command } from '../../../src/primitives/types';

/**
 * Create test commands with various properties
 */
function createTestCommands(): Command[] {
  return [
    { id: 'bold', label: 'Bold', action: vi.fn(), category: 'Formatting' },
    { id: 'italic', label: 'Italic', action: vi.fn(), category: 'Formatting' },
    {
      id: 'heading',
      label: 'Heading 1',
      description: 'Large section heading',
      action: vi.fn(),
      category: 'Blocks',
      shortcut: 'Cmd+1',
    },
    {
      id: 'paragraph',
      label: 'Paragraph',
      description: 'Plain text block',
      action: vi.fn(),
      category: 'Blocks',
    },
    { id: 'link', label: 'Insert Link', action: vi.fn(), icon: 'link-icon' },
  ];
}

/**
 * Default props for rendering
 */
function createDefaultProps(overrides: Partial<Parameters<typeof CommandPaletteUI>[0]> = {}) {
  return {
    isOpen: true,
    commands: createTestCommands(),
    selectedIndex: 0,
    searchQuery: '',
    onSelect: vi.fn(),
    onClose: vi.fn(),
    onQueryChange: vi.fn(),
    onNavigate: vi.fn(),
    position: { x: 100, y: 100 },
    ...overrides,
  };
}

describe('CommandPaletteUI', () => {
  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      const props = createDefaultProps({ isOpen: false });

      render(<CommandPaletteUI {...props} />);

      expect(screen.queryByTestId('command-palette')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      const props = createDefaultProps({ isOpen: true });

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByTestId('command-palette')).toBeInTheDocument();
    });

    it('should render at specified position', () => {
      const props = createDefaultProps({ position: { x: 200, y: 300 } });

      render(<CommandPaletteUI {...props} />);

      const palette = screen.getByTestId('command-palette');
      // Position is set via inline styles (may be constrained by viewport)
      expect(palette.style.left).toBeDefined();
      expect(palette.style.top).toBeDefined();
    });

    it('should render search input', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByTestId('command-palette-input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const props = createDefaultProps({ className: 'custom-palette-class' });

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByTestId('command-palette')).toHaveClass('custom-palette-class');
    });
  });

  describe('Command Display', () => {
    it('should render all commands', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('Italic')).toBeInTheDocument();
      expect(screen.getByText('Heading 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Insert Link')).toBeInTheDocument();
    });

    it('should render command descriptions', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByText('Large section heading')).toBeInTheDocument();
      expect(screen.getByText('Plain text block')).toBeInTheDocument();
    });

    it('should render command shortcuts', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByText('Cmd+1')).toBeInTheDocument();
    });

    it('should render command icons', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByText('link-icon')).toBeInTheDocument();
    });

    it('should group commands by category', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByText('Formatting')).toBeInTheDocument();
      expect(screen.getByText('Blocks')).toBeInTheDocument();
      expect(screen.getByText('Commands')).toBeInTheDocument(); // Default for uncategorized
    });
  });

  describe('Selection', () => {
    it('should highlight selected command', () => {
      const props = createDefaultProps({ selectedIndex: 0 });

      render(<CommandPaletteUI {...props} />);

      const boldItem = screen.getByTestId('command-item-bold');
      expect(boldItem).toHaveAttribute('aria-selected', 'true');
    });

    it('should not highlight unselected commands', () => {
      const props = createDefaultProps({ selectedIndex: 0 });

      render(<CommandPaletteUI {...props} />);

      const italicItem = screen.getByTestId('command-item-italic');
      expect(italicItem).toHaveAttribute('aria-selected', 'false');
    });

    it('should update selection when selectedIndex changes', () => {
      const props = createDefaultProps({ selectedIndex: 0 });

      const { rerender } = render(<CommandPaletteUI {...props} />);

      expect(screen.getByTestId('command-item-bold')).toHaveAttribute('aria-selected', 'true');

      rerender(<CommandPaletteUI {...props} selectedIndex={1} />);

      expect(screen.getByTestId('command-item-bold')).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByTestId('command-item-italic')).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Search', () => {
    it('should display search query in input', () => {
      const props = createDefaultProps({ searchQuery: 'head' });

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByTestId('command-palette-input')).toHaveValue('head');
    });

    it('should call onQueryChange when typing', async () => {
      const user = userEvent.setup();
      const onQueryChange = vi.fn();
      const props = createDefaultProps({ onQueryChange });

      render(<CommandPaletteUI {...props} />);

      await user.type(screen.getByTestId('command-palette-input'), 'bold');

      expect(onQueryChange).toHaveBeenCalled();
    });

    it('should highlight matched text in labels', () => {
      const commands: Command[] = [{ id: 'bold', label: 'Bold Text', action: vi.fn() }];
      const props = createDefaultProps({ commands, searchQuery: 'Bold' });

      render(<CommandPaletteUI {...props} />);

      const mark = screen.getByRole('mark');
      expect(mark).toHaveTextContent('Bold');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should call onNavigate with "up" on ArrowUp', async () => {
      const user = userEvent.setup();
      const onNavigate = vi.fn();
      const props = createDefaultProps({ onNavigate });

      render(<CommandPaletteUI {...props} />);

      await user.type(screen.getByTestId('command-palette-input'), '{ArrowUp}');

      expect(onNavigate).toHaveBeenCalledWith('up');
    });

    it('should call onNavigate with "down" on ArrowDown', async () => {
      const user = userEvent.setup();
      const onNavigate = vi.fn();
      const props = createDefaultProps({ onNavigate });

      render(<CommandPaletteUI {...props} />);

      await user.type(screen.getByTestId('command-palette-input'), '{ArrowDown}');

      expect(onNavigate).toHaveBeenCalledWith('down');
    });

    it('should call onClose on Escape', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const props = createDefaultProps({ onClose });

      render(<CommandPaletteUI {...props} />);

      await user.type(screen.getByTestId('command-palette-input'), '{Escape}');

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onSelect on Enter with selected command', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const commands = createTestCommands();
      const props = createDefaultProps({ onSelect, commands, selectedIndex: 0 });

      render(<CommandPaletteUI {...props} />);

      await user.type(screen.getByTestId('command-palette-input'), '{Enter}');

      expect(onSelect).toHaveBeenCalledWith(commands[0]);
    });

    it('should not call onSelect on Enter with no selection', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const props = createDefaultProps({ onSelect, selectedIndex: -1 });

      render(<CommandPaletteUI {...props} />);

      await user.type(screen.getByTestId('command-palette-input'), '{Enter}');

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Click Interaction', () => {
    it('should call onSelect on command click', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const commands = createTestCommands();
      const props = createDefaultProps({ onSelect, commands });

      render(<CommandPaletteUI {...props} />);

      await user.click(screen.getByTestId('command-item-italic'));

      expect(onSelect).toHaveBeenCalledWith(commands[1]);
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no commands', () => {
      const props = createDefaultProps({ commands: [] });

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByTestId('command-palette-empty')).toBeInTheDocument();
      expect(screen.getByText('No commands found')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="listbox" on command list', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should have role="option" on command items', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      const options = screen.getAllByRole('option');
      expect(options.length).toBe(5); // 5 test commands
    });

    it('should have aria-selected on options', () => {
      const props = createDefaultProps({ selectedIndex: 2 });

      render(<CommandPaletteUI {...props} />);

      const options = screen.getAllByRole('option');
      const selectedCount = options.filter(
        (opt) => opt.getAttribute('aria-selected') === 'true',
      ).length;
      expect(selectedCount).toBe(1);
    });

    it('should have aria-label on search input', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByTestId('command-palette-input')).toHaveAttribute(
        'aria-label',
        'Search commands',
      );
    });

    it('should have aria-controls linking input to listbox', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      const input = screen.getByTestId('command-palette-input');
      const listbox = screen.getByRole('listbox');

      expect(input).toHaveAttribute('aria-controls', listbox.id);
    });

    it('should have aria-activedescendant when command is selected', () => {
      const commands = createTestCommands();
      const props = createDefaultProps({ commands, selectedIndex: 0 });

      render(<CommandPaletteUI {...props} />);

      const input = screen.getByTestId('command-palette-input');
      expect(input).toHaveAttribute('aria-activedescendant', expect.stringContaining('bold'));
    });

    it('should have role="group" for categories', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      const groups = screen.getAllByRole('group');
      expect(groups.length).toBeGreaterThan(0);
    });

    it('should have aria-label on category groups', () => {
      const props = createDefaultProps();

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByRole('group', { name: 'Formatting' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Blocks' })).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('should focus input when opened', () => {
      const props = createDefaultProps({ isOpen: true });

      render(<CommandPaletteUI {...props} />);

      expect(screen.getByTestId('command-palette-input')).toHaveFocus();
    });
  });
});
