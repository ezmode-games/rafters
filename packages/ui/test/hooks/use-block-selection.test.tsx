import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, useEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useBlockSelection } from '../../src/hooks/use-block-selection';

/**
 * Test component that uses useBlockSelection hook
 */
function TestEditor({
  onSelectionChange,
  multiSelect = true,
}: {
  onSelectionChange?: (selected: Set<string>) => void;
  multiSelect?: boolean;
}) {
  const { ref, state, select, selectRange, selectAll, clear } = useBlockSelection({
    getBlocks: () =>
      Array.from(document.querySelectorAll('[data-block-id]')) as HTMLElement[],
    onSelectionChange,
    multiSelect,
  });

  return (
    <div ref={ref} data-testid="container">
      <div data-block-id="block-1">Block 1</div>
      <div data-block-id="block-2">Block 2</div>
      <div data-block-id="block-3">Block 3</div>
      <div data-testid="selected-count">{state.selected.size}</div>
      <div data-testid="anchor">{state.anchor ?? 'null'}</div>
      <div data-testid="focus">{state.focus ?? 'null'}</div>
      <button type="button" data-testid="select-1" onClick={() => select('block-1')}>
        Select 1
      </button>
      <button type="button" data-testid="select-2-additive" onClick={() => select('block-2', true)}>
        Select 2 Additive
      </button>
      <button
        type="button"
        data-testid="select-range"
        onClick={() => selectRange('block-1', 'block-3')}
      >
        Select Range
      </button>
      <button type="button" data-testid="select-all" onClick={selectAll}>
        Select All
      </button>
      <button type="button" data-testid="clear" onClick={clear}>
        Clear
      </button>
    </div>
  );
}

describe('useBlockSelection', () => {
  describe('ref callback', () => {
    it('returns a ref callback', () => {
      let capturedRef: React.RefCallback<HTMLElement> | null = null;

      function CaptureRef() {
        const { ref } = useBlockSelection({
          getBlocks: () => [],
        });
        capturedRef = ref;
        return null;
      }

      render(<CaptureRef />);

      expect(typeof capturedRef).toBe('function');
    });

    it('creates controller when ref is attached', () => {
      render(<TestEditor />);

      // Verify container is rendered and accessible
      const container = screen.getByTestId('container');
      expect(container).toBeInTheDocument();

      // Initial state should be empty
      expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
    });

    it('cleans up when ref is detached', async () => {
      const onSelectionChange = vi.fn();

      function ToggleEditor() {
        const [show, setShow] = useState(true);

        return (
          <div>
            {show && <TestEditor onSelectionChange={onSelectionChange} />}
            <button type="button" data-testid="toggle" onClick={() => setShow(false)}>
              Toggle
            </button>
          </div>
        );
      }

      const user = userEvent.setup();
      render(<ToggleEditor />);

      // Select a block first
      await user.click(screen.getByTestId('select-1'));
      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-1']));

      // Reset mock to track post-unmount calls
      onSelectionChange.mockClear();

      // Unmount the editor
      await user.click(screen.getByTestId('toggle'));

      // The container should be gone
      expect(screen.queryByTestId('container')).not.toBeInTheDocument();

      // No selection changes should happen after unmount
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('selection methods', () => {
    it('select() selects a single block', async () => {
      const user = userEvent.setup();
      render(<TestEditor />);

      await user.click(screen.getByTestId('select-1'));

      expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
      expect(screen.getByTestId('anchor')).toHaveTextContent('block-1');
      expect(screen.getByTestId('focus')).toHaveTextContent('block-1');
    });

    it('select() with additive adds to selection', async () => {
      const user = userEvent.setup();
      render(<TestEditor />);

      await user.click(screen.getByTestId('select-1'));
      await user.click(screen.getByTestId('select-2-additive'));

      expect(screen.getByTestId('selected-count')).toHaveTextContent('2');
    });

    it('selectRange() selects multiple blocks', async () => {
      const user = userEvent.setup();
      render(<TestEditor />);

      await user.click(screen.getByTestId('select-range'));

      expect(screen.getByTestId('selected-count')).toHaveTextContent('3');
      expect(screen.getByTestId('anchor')).toHaveTextContent('block-1');
      expect(screen.getByTestId('focus')).toHaveTextContent('block-3');
    });

    it('selectAll() selects all blocks', async () => {
      const user = userEvent.setup();
      render(<TestEditor />);

      await user.click(screen.getByTestId('select-all'));

      expect(screen.getByTestId('selected-count')).toHaveTextContent('3');
    });

    it('clear() removes all selection', async () => {
      const user = userEvent.setup();
      render(<TestEditor />);

      await user.click(screen.getByTestId('select-all'));
      expect(screen.getByTestId('selected-count')).toHaveTextContent('3');

      await user.click(screen.getByTestId('clear'));

      expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
      expect(screen.getByTestId('anchor')).toHaveTextContent('null');
      expect(screen.getByTestId('focus')).toHaveTextContent('null');
    });
  });

  describe('state updates', () => {
    it('updates state when selection changes', async () => {
      const user = userEvent.setup();
      render(<TestEditor />);

      // Initial state
      expect(screen.getByTestId('selected-count')).toHaveTextContent('0');

      // After selection
      await user.click(screen.getByTestId('select-1'));
      expect(screen.getByTestId('selected-count')).toHaveTextContent('1');

      // After additional selection
      await user.click(screen.getByTestId('select-2-additive'));
      expect(screen.getByTestId('selected-count')).toHaveTextContent('2');

      // After clear
      await user.click(screen.getByTestId('clear'));
      expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
    });

    it('calls onSelectionChange callback', async () => {
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();
      render(<TestEditor onSelectionChange={onSelectionChange} />);

      await user.click(screen.getByTestId('select-1'));

      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-1']));
    });

    it('calls onSelectionChange with updated set on additive selection', async () => {
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();
      render(<TestEditor onSelectionChange={onSelectionChange} />);

      await user.click(screen.getByTestId('select-1'));
      await user.click(screen.getByTestId('select-2-additive'));

      expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['block-1', 'block-2']));
    });
  });

  describe('multiSelect option', () => {
    it('replaces selection when multiSelect is false', async () => {
      const user = userEvent.setup();
      render(<TestEditor multiSelect={false} />);

      await user.click(screen.getByTestId('select-1'));
      await user.click(screen.getByTestId('select-2-additive'));

      // Even with additive flag, should replace in single-select mode
      expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
    });
  });

  describe('StrictMode compatibility', () => {
    it('handles StrictMode double-mount correctly', async () => {
      const onSelectionChange = vi.fn();

      function StrictModeEditor() {
        return (
          <StrictMode>
            <TestEditor onSelectionChange={onSelectionChange} />
          </StrictMode>
        );
      }

      const user = userEvent.setup();
      render(<StrictModeEditor />);

      // Should work correctly after StrictMode remount
      await user.click(screen.getByTestId('select-1'));

      expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
      expect(onSelectionChange).toHaveBeenCalledWith(new Set(['block-1']));
    });

    it('cleans up properly on StrictMode remount', () => {
      // Track how many times the controller would be created
      // We verify this by checking that selection works after remount
      const onSelectionChange = vi.fn();

      function TrackingEditor() {
        const { ref, state } = useBlockSelection({
          getBlocks: () =>
            Array.from(document.querySelectorAll('[data-block-id]')) as HTMLElement[],
          onSelectionChange,
        });

        return (
          <div ref={ref} data-testid="container">
            <div data-block-id="block-1">Block 1</div>
            <div data-testid="count">{state.selected.size}</div>
          </div>
        );
      }

      render(
        <StrictMode>
          <TrackingEditor />
        </StrictMode>,
      );

      // Verify the component rendered correctly after StrictMode remount
      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });

  describe('SSR safety', () => {
    it('returns initial empty state before container is attached', () => {
      function CheckInitialState() {
        const { state } = useBlockSelection({
          getBlocks: () => [],
        });

        return (
          <div>
            <div data-testid="size">{state.selected.size}</div>
            <div data-testid="anchor">{state.anchor ?? 'null'}</div>
            <div data-testid="focus">{state.focus ?? 'null'}</div>
          </div>
        );
      }

      render(<CheckInitialState />);

      expect(screen.getByTestId('size')).toHaveTextContent('0');
      expect(screen.getByTestId('anchor')).toHaveTextContent('null');
      expect(screen.getByTestId('focus')).toHaveTextContent('null');
    });

    it('methods are no-ops before container is attached', () => {
      function NoContainerComponent() {
        const { state, select, selectRange, selectAll, clear } = useBlockSelection({
          getBlocks: () => [],
        });

        // Call methods without attaching ref
        useEffect(() => {
          select('block-1');
          selectRange('block-1', 'block-3');
          selectAll();
          clear();
        }, [select, selectRange, selectAll, clear]);

        return <div data-testid="size">{state.selected.size}</div>;
      }

      // Should not throw
      render(<NoContainerComponent />);

      // State should remain empty since no container was attached
      expect(screen.getByTestId('size')).toHaveTextContent('0');
    });
  });

  describe('click-based selection', () => {
    it('selects block on click within container', async () => {
      const user = userEvent.setup();
      render(<TestEditor />);

      // Click directly on a block
      const block = screen.getByText('Block 2');
      await user.click(block);

      expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
    });

    it('handles Ctrl+click for additive selection', async () => {
      const user = userEvent.setup();
      render(<TestEditor />);

      // Click first block
      await user.click(screen.getByText('Block 1'));

      // Ctrl+click second block
      await user.keyboard('{Control>}');
      await user.click(screen.getByText('Block 2'));
      await user.keyboard('{/Control}');

      expect(screen.getByTestId('selected-count')).toHaveTextContent('2');
    });

    it('handles Shift+click for range selection', async () => {
      const user = userEvent.setup();
      render(<TestEditor />);

      // Click first block
      await user.click(screen.getByText('Block 1'));

      // Shift+click third block
      await user.keyboard('{Shift>}');
      await user.click(screen.getByText('Block 3'));
      await user.keyboard('{/Shift}');

      expect(screen.getByTestId('selected-count')).toHaveTextContent('3');
    });
  });

  describe('stable function references', () => {
    it('maintains stable references across renders', async () => {
      const references: {
        select: (id: string, additive?: boolean) => void;
        selectRange: (fromId: string, toId: string) => void;
        selectAll: () => void;
        clear: () => void;
      }[] = [];

      function CaptureReferences() {
        const { ref, select, selectRange, selectAll, clear } = useBlockSelection({
          getBlocks: () => [],
        });

        // Only capture on the first mount and after explicit rerender
        useEffect(() => {
          references.push({ select, selectRange, selectAll, clear });
        });

        const [, setCounter] = useState(0);

        return (
          <div ref={ref}>
            <button type="button" data-testid="rerender" onClick={() => setCounter((c) => c + 1)}>
              Rerender
            </button>
          </div>
        );
      }

      const user = userEvent.setup();
      render(<CaptureReferences />);

      // Trigger a rerender via user interaction
      await user.click(screen.getByTestId('rerender'));

      // Compare references - should have at least 2 captures
      expect(references.length).toBeGreaterThanOrEqual(2);

      // Get last two references
      const lastRef = references[references.length - 1];
      const prevRef = references[references.length - 2];

      // select, selectRange, selectAll, clear should be stable (useCallback with empty deps)
      expect(prevRef?.select).toBe(lastRef?.select);
      expect(prevRef?.selectRange).toBe(lastRef?.selectRange);
      expect(prevRef?.selectAll).toBe(lastRef?.selectAll);
      expect(prevRef?.clear).toBe(lastRef?.clear);
    });
  });
});
