import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EditorToolbar } from '../../../src/components/editor/EditorToolbar';
import type { UseHistoryReturn, HistoryState } from '../../../src/hooks/use-history';

/**
 * Create a mock history object for testing
 */
function createMockHistory(
  overrides: Partial<HistoryState<unknown>> = {},
): UseHistoryReturn<unknown> {
  return {
    state: {
      current: '',
      canUndo: false,
      canRedo: false,
      undoCount: 0,
      redoCount: 0,
      ...overrides,
    },
    push: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    batch: vi.fn(),
    clear: vi.fn(),
  };
}

describe('EditorToolbar', () => {
  describe('Rendering', () => {
    it('renders toolbar with undo and redo buttons', () => {
      const history = createMockHistory();

      render(<EditorToolbar history={history} />);

      expect(screen.getByRole('toolbar')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Redo' })).toBeInTheDocument();
    });

    it('renders all formatting buttons when provided', () => {
      const history = createMockHistory();

      render(
        <EditorToolbar
          history={history}
          onBold={() => {}}
          onItalic={() => {}}
          onUnderline={() => {}}
          onStrikethrough={() => {}}
          onLink={() => {}}
          onCode={() => {}}
        />,
      );

      expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Underline' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Strikethrough' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Insert link' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Code' })).toBeInTheDocument();
    });

    it('only renders provided formatting buttons', () => {
      const history = createMockHistory();

      render(<EditorToolbar history={history} onBold={() => {}} onItalic={() => {}} />);

      expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Underline' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Strikethrough' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Insert link' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Code' })).not.toBeInTheDocument();
    });

    it('does not render separator when no formatting buttons provided', () => {
      const history = createMockHistory();

      const { container } = render(<EditorToolbar history={history} />);

      // No visual separator when no formatting buttons
      expect(container.querySelector('[role="none"]')).not.toBeInTheDocument();
    });

    it('renders visual separator when formatting buttons are provided', () => {
      const history = createMockHistory();

      render(<EditorToolbar history={history} onBold={() => {}} />);

      // Separator with proper accessibility role
      const separator = screen.getByRole('separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('applies custom className', () => {
      const history = createMockHistory();

      render(<EditorToolbar history={history} className="custom-toolbar-class" />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toHaveClass('custom-toolbar-class');
    });
  });

  describe('Undo/Redo disabled states', () => {
    it('disables undo button when canUndo is false', () => {
      const history = createMockHistory({ canUndo: false });

      render(<EditorToolbar history={history} />);

      const undoButton = screen.getByRole('button', { name: 'Undo' });
      expect(undoButton).toBeDisabled();
      expect(undoButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('enables undo button when canUndo is true', () => {
      const history = createMockHistory({ canUndo: true });

      render(<EditorToolbar history={history} />);

      const undoButton = screen.getByRole('button', { name: 'Undo' });
      expect(undoButton).not.toBeDisabled();
    });

    it('disables redo button when canRedo is false', () => {
      const history = createMockHistory({ canRedo: false });

      render(<EditorToolbar history={history} />);

      const redoButton = screen.getByRole('button', { name: 'Redo' });
      expect(redoButton).toBeDisabled();
      expect(redoButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('enables redo button when canRedo is true', () => {
      const history = createMockHistory({ canRedo: true });

      render(<EditorToolbar history={history} />);

      const redoButton = screen.getByRole('button', { name: 'Redo' });
      expect(redoButton).not.toBeDisabled();
    });
  });

  describe('Click handlers', () => {
    it('calls undo when undo button is clicked', async () => {
      const user = userEvent.setup();
      const history = createMockHistory({ canUndo: true });

      render(<EditorToolbar history={history} />);

      await user.click(screen.getByRole('button', { name: 'Undo' }));

      expect(history.undo).toHaveBeenCalledTimes(1);
    });

    it('calls redo when redo button is clicked', async () => {
      const user = userEvent.setup();
      const history = createMockHistory({ canRedo: true });

      render(<EditorToolbar history={history} />);

      await user.click(screen.getByRole('button', { name: 'Redo' }));

      expect(history.redo).toHaveBeenCalledTimes(1);
    });

    it('does not call undo when button is disabled', async () => {
      const user = userEvent.setup();
      const history = createMockHistory({ canUndo: false });

      render(<EditorToolbar history={history} />);

      await user.click(screen.getByRole('button', { name: 'Undo' }));

      expect(history.undo).not.toHaveBeenCalled();
    });

    it('does not call redo when button is disabled', async () => {
      const user = userEvent.setup();
      const history = createMockHistory({ canRedo: false });

      render(<EditorToolbar history={history} />);

      await user.click(screen.getByRole('button', { name: 'Redo' }));

      expect(history.redo).not.toHaveBeenCalled();
    });

    it('calls onBold when bold button is clicked', async () => {
      const user = userEvent.setup();
      const history = createMockHistory();
      const onBold = vi.fn();

      render(<EditorToolbar history={history} onBold={onBold} />);

      await user.click(screen.getByRole('button', { name: 'Bold' }));

      expect(onBold).toHaveBeenCalledTimes(1);
    });

    it('calls onItalic when italic button is clicked', async () => {
      const user = userEvent.setup();
      const history = createMockHistory();
      const onItalic = vi.fn();

      render(<EditorToolbar history={history} onItalic={onItalic} />);

      await user.click(screen.getByRole('button', { name: 'Italic' }));

      expect(onItalic).toHaveBeenCalledTimes(1);
    });

    it('calls onUnderline when underline button is clicked', async () => {
      const user = userEvent.setup();
      const history = createMockHistory();
      const onUnderline = vi.fn();

      render(<EditorToolbar history={history} onUnderline={onUnderline} />);

      await user.click(screen.getByRole('button', { name: 'Underline' }));

      expect(onUnderline).toHaveBeenCalledTimes(1);
    });

    it('calls onStrikethrough when strikethrough button is clicked', async () => {
      const user = userEvent.setup();
      const history = createMockHistory();
      const onStrikethrough = vi.fn();

      render(<EditorToolbar history={history} onStrikethrough={onStrikethrough} />);

      await user.click(screen.getByRole('button', { name: 'Strikethrough' }));

      expect(onStrikethrough).toHaveBeenCalledTimes(1);
    });

    it('calls onLink when link button is clicked', async () => {
      const user = userEvent.setup();
      const history = createMockHistory();
      const onLink = vi.fn();

      render(<EditorToolbar history={history} onLink={onLink} />);

      await user.click(screen.getByRole('button', { name: 'Insert link' }));

      expect(onLink).toHaveBeenCalledTimes(1);
    });

    it('calls onCode when code button is clicked', async () => {
      const user = userEvent.setup();
      const history = createMockHistory();
      const onCode = vi.fn();

      render(<EditorToolbar history={history} onCode={onCode} />);

      await user.click(screen.getByRole('button', { name: 'Code' }));

      expect(onCode).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has toolbar role with aria-label', () => {
      const history = createMockHistory();

      render(<EditorToolbar history={history} />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toHaveAttribute('aria-label', 'Editor toolbar');
    });

    it('groups history controls with aria-label', () => {
      const history = createMockHistory();

      render(<EditorToolbar history={history} />);

      const historyGroup = screen.getByRole('group', { name: 'History controls' });
      expect(historyGroup).toBeInTheDocument();
    });

    it('groups formatting controls with aria-label when present', () => {
      const history = createMockHistory();

      render(<EditorToolbar history={history} onBold={() => {}} />);

      const formattingGroup = screen.getByRole('group', { name: 'Formatting controls' });
      expect(formattingGroup).toBeInTheDocument();
    });

    it('all buttons have aria-label', () => {
      const history = createMockHistory();

      render(
        <EditorToolbar
          history={history}
          onBold={() => {}}
          onItalic={() => {}}
          onUnderline={() => {}}
          onStrikethrough={() => {}}
          onLink={() => {}}
          onCode={() => {}}
        />,
      );

      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).toHaveAttribute('aria-label');
      }
    });

    it('disabled buttons have aria-disabled attribute', () => {
      const history = createMockHistory({ canUndo: false, canRedo: false });

      render(<EditorToolbar history={history} />);

      expect(screen.getByRole('button', { name: 'Undo' })).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByRole('button', { name: 'Redo' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('icons have aria-hidden attribute', () => {
      const history = createMockHistory();

      render(<EditorToolbar history={history} onBold={() => {}} />);

      const svgs = document.querySelectorAll('svg');
      for (const svg of svgs) {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      }
    });

    it('separator has correct role and orientation', () => {
      const history = createMockHistory();

      render(<EditorToolbar history={history} onBold={() => {}} />);

      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('Button focus and keyboard navigation', () => {
    it('buttons are focusable', async () => {
      const user = userEvent.setup();
      const history = createMockHistory({ canUndo: true });

      render(<EditorToolbar history={history} />);

      const undoButton = screen.getByRole('button', { name: 'Undo' });
      await user.tab();

      expect(undoButton).toHaveFocus();
    });

    it('can tab through all buttons', async () => {
      const user = userEvent.setup();
      const history = createMockHistory({ canUndo: true, canRedo: true });

      render(<EditorToolbar history={history} onBold={() => {}} />);

      // Tab through buttons
      await user.tab();
      expect(screen.getByRole('button', { name: 'Undo' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Redo' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
    });
  });
});

describe('EditorToolbar - Integration', () => {
  it('works with real history state updates', async () => {
    const user = userEvent.setup();
    const undoFn = vi.fn();
    const redoFn = vi.fn();

    const history: UseHistoryReturn<string> = {
      state: {
        current: 'initial',
        canUndo: true,
        canRedo: false,
        undoCount: 1,
        redoCount: 0,
      },
      push: vi.fn(),
      undo: undoFn,
      redo: redoFn,
      batch: vi.fn(),
      clear: vi.fn(),
    };

    render(<EditorToolbar history={history} />);

    // Undo should be enabled, redo disabled
    expect(screen.getByRole('button', { name: 'Undo' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Redo' })).toBeDisabled();

    // Click undo
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(undoFn).toHaveBeenCalledTimes(1);
  });
});
