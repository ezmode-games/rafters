import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCommandPalette } from '../../src/hooks/use-command-palette';
import type { Command } from '../../src/primitives/types';

/**
 * Create a mock container element for testing
 */
function createMockContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.setAttribute('contenteditable', 'true');
  document.body.appendChild(container);
  return container;
}

/**
 * Create a set of test commands
 */
function createTestCommands(): Command[] {
  return [
    { id: 'bold', label: 'Bold', action: vi.fn() },
    { id: 'italic', label: 'Italic', action: vi.fn() },
    { id: 'heading', label: 'Heading', keywords: ['h1', 'title'], action: vi.fn() },
  ];
}

describe('useCommandPalette', () => {
  describe('returns ref and state', () => {
    it('returns ref callback and initial state', () => {
      const commands = createTestCommands();
      const { result } = renderHook(() => useCommandPalette({ commands }));

      expect(typeof result.current.ref).toBe('function');
      expect(result.current.state).toEqual({
        isOpen: false,
        query: '',
        filteredCommands: [],
        selectedIndex: -1,
      });
    });

    it('initializes controller when ref is called with element', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
      });

      // State should still be closed initially
      expect(result.current.state.isOpen).toBe(false);

      // Cleanup
      document.body.removeChild(container);
    });

    it('resets state when ref is called with null', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(result.current.state.isOpen).toBe(true);

      act(() => {
        result.current.ref(null);
      });

      expect(result.current.state).toEqual({
        isOpen: false,
        query: '',
        filteredCommands: [],
        selectedIndex: -1,
      });

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('open/close update state', () => {
    it('open sets isOpen to true and populates filteredCommands', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
      });

      act(() => {
        result.current.open();
      });

      expect(result.current.state.isOpen).toBe(true);
      expect(result.current.state.filteredCommands).toHaveLength(3);
      expect(result.current.state.selectedIndex).toBe(0);

      // Cleanup
      document.body.removeChild(container);
    });

    it('close sets isOpen to false and clears state', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(result.current.state.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.state.isOpen).toBe(false);
      expect(result.current.state.filteredCommands).toHaveLength(0);
      expect(result.current.state.selectedIndex).toBe(-1);

      // Cleanup
      document.body.removeChild(container);
    });

    it('calls onOpen callback when opened', () => {
      const container = createMockContainer();
      const commands = createTestCommands();
      const onOpen = vi.fn();

      const { result } = renderHook(() => useCommandPalette({ commands, onOpen }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(onOpen).toHaveBeenCalledTimes(1);

      // Cleanup
      document.body.removeChild(container);
    });

    it('calls onClose callback when closed', () => {
      const container = createMockContainer();
      const commands = createTestCommands();
      const onClose = vi.fn();

      const { result } = renderHook(() => useCommandPalette({ commands, onClose }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      act(() => {
        result.current.close();
      });

      expect(onClose).toHaveBeenCalledTimes(1);

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('navigation methods work', () => {
    it('selectNext moves selection forward', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(result.current.state.selectedIndex).toBe(0);

      act(() => {
        result.current.selectNext();
      });

      expect(result.current.state.selectedIndex).toBe(1);

      act(() => {
        result.current.selectNext();
      });

      expect(result.current.state.selectedIndex).toBe(2);

      // Cleanup
      document.body.removeChild(container);
    });

    it('selectNext wraps to beginning', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      act(() => {
        result.current.selectNext();
        result.current.selectNext();
        result.current.selectNext();
      });

      expect(result.current.state.selectedIndex).toBe(0);

      // Cleanup
      document.body.removeChild(container);
    });

    it('selectPrevious moves selection backward', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
        result.current.selectNext();
        result.current.selectNext();
      });

      expect(result.current.state.selectedIndex).toBe(2);

      act(() => {
        result.current.selectPrevious();
      });

      expect(result.current.state.selectedIndex).toBe(1);

      // Cleanup
      document.body.removeChild(container);
    });

    it('selectPrevious wraps to end', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(result.current.state.selectedIndex).toBe(0);

      act(() => {
        result.current.selectPrevious();
      });

      expect(result.current.state.selectedIndex).toBe(2);

      // Cleanup
      document.body.removeChild(container);
    });

    it('selectFirst moves to first command', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
        result.current.selectNext();
        result.current.selectNext();
      });

      expect(result.current.state.selectedIndex).toBe(2);

      act(() => {
        result.current.selectFirst();
      });

      expect(result.current.state.selectedIndex).toBe(0);

      // Cleanup
      document.body.removeChild(container);
    });

    it('selectLast moves to last command', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(result.current.state.selectedIndex).toBe(0);

      act(() => {
        result.current.selectLast();
      });

      expect(result.current.state.selectedIndex).toBe(2);

      // Cleanup
      document.body.removeChild(container);
    });

    it('calls onSelect when selection changes', () => {
      const container = createMockContainer();
      const commands = createTestCommands();
      const onSelect = vi.fn();

      const { result } = renderHook(() => useCommandPalette({ commands, onSelect }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      // onSelect called on open with first command
      expect(onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'bold' }));

      act(() => {
        result.current.selectNext();
      });

      expect(onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'italic' }));

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('execute calls command action', () => {
    it('execute calls the selected command action', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      act(() => {
        result.current.execute();
      });

      expect(commands[0].action).toHaveBeenCalledTimes(1);

      // Cleanup
      document.body.removeChild(container);
    });

    it('execute closes the palette after execution', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(result.current.state.isOpen).toBe(true);

      act(() => {
        result.current.execute();
      });

      expect(result.current.state.isOpen).toBe(false);

      // Cleanup
      document.body.removeChild(container);
    });

    it('execute calls onExecute callback', () => {
      const container = createMockContainer();
      const commands = createTestCommands();
      const onExecute = vi.fn();

      const { result } = renderHook(() => useCommandPalette({ commands, onExecute }));

      act(() => {
        result.current.ref(container);
        result.current.open();
        result.current.selectNext();
      });

      act(() => {
        result.current.execute();
      });

      expect(onExecute).toHaveBeenCalledWith(expect.objectContaining({ id: 'italic' }));

      // Cleanup
      document.body.removeChild(container);
    });

    it('execute does nothing when no command is selected', () => {
      const container = createMockContainer();
      const commands = createTestCommands();
      const onExecute = vi.fn();

      const { result } = renderHook(() => useCommandPalette({ commands, onExecute }));

      act(() => {
        result.current.ref(container);
        // Don't open - no selection
      });

      act(() => {
        result.current.execute();
      });

      expect(onExecute).not.toHaveBeenCalled();
      for (const cmd of commands) {
        expect(cmd.action).not.toHaveBeenCalled();
      }

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('setQuery filters commands', () => {
    it('setQuery filters commands by label', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(result.current.state.filteredCommands).toHaveLength(3);

      act(() => {
        result.current.setQuery('bold');
      });

      expect(result.current.state.filteredCommands).toHaveLength(1);
      expect(result.current.state.filteredCommands[0].id).toBe('bold');

      // Cleanup
      document.body.removeChild(container);
    });

    it('setQuery filters commands by keywords', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      act(() => {
        result.current.setQuery('h1');
      });

      expect(result.current.state.filteredCommands).toHaveLength(1);
      expect(result.current.state.filteredCommands[0].id).toBe('heading');

      // Cleanup
      document.body.removeChild(container);
    });

    it('setQuery resets selection when filter changes', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
        result.current.selectNext();
        result.current.selectNext();
      });

      expect(result.current.state.selectedIndex).toBe(2);

      act(() => {
        result.current.setQuery('bold');
      });

      // Should clamp to valid range
      expect(result.current.state.selectedIndex).toBe(0);

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('setCommands updates command list', () => {
    it('setCommands updates available commands', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(result.current.state.filteredCommands).toHaveLength(3);

      const newCommands: Command[] = [
        { id: 'link', label: 'Link', action: vi.fn() },
        { id: 'image', label: 'Image', action: vi.fn() },
      ];

      act(() => {
        result.current.setCommands(newCommands);
      });

      expect(result.current.state.filteredCommands).toHaveLength(2);
      expect(result.current.state.filteredCommands[0].id).toBe('link');

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('cleanup on unmount', () => {
    it('cleans up controller when component unmounts', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result, unmount } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(result.current.state.isOpen).toBe(true);

      // Unmount should clean up
      unmount();

      // Controller should be cleaned up (no errors thrown)
      // Cleanup
      document.body.removeChild(container);
    });

    it('handles React StrictMode double-mount', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      // Simulate StrictMode double-mount
      act(() => {
        result.current.ref(container);
      });

      act(() => {
        result.current.ref(null);
      });

      act(() => {
        result.current.ref(container);
      });

      // Should work correctly after remount
      act(() => {
        result.current.open();
      });

      expect(result.current.state.isOpen).toBe(true);
      expect(result.current.state.filteredCommands).toHaveLength(3);

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('stable function references', () => {
    it('maintains stable function references across renders', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result, rerender } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
      });

      const initialOpen = result.current.open;
      const initialClose = result.current.close;
      const initialSetQuery = result.current.setQuery;
      const initialSetCommands = result.current.setCommands;
      const initialSelectNext = result.current.selectNext;
      const initialSelectPrevious = result.current.selectPrevious;
      const initialSelectFirst = result.current.selectFirst;
      const initialSelectLast = result.current.selectLast;
      const initialExecute = result.current.execute;

      rerender();

      expect(result.current.open).toBe(initialOpen);
      expect(result.current.close).toBe(initialClose);
      expect(result.current.setQuery).toBe(initialSetQuery);
      expect(result.current.setCommands).toBe(initialSetCommands);
      expect(result.current.selectNext).toBe(initialSelectNext);
      expect(result.current.selectPrevious).toBe(initialSelectPrevious);
      expect(result.current.selectFirst).toBe(initialSelectFirst);
      expect(result.current.selectLast).toBe(initialSelectLast);
      expect(result.current.execute).toBe(initialExecute);

      // Cleanup
      document.body.removeChild(container);
    });

    it('maintains stable references after state changes', () => {
      const container = createMockContainer();
      const commands = createTestCommands();

      const { result } = renderHook(() => useCommandPalette({ commands }));

      act(() => {
        result.current.ref(container);
      });

      const initialOpen = result.current.open;
      const initialSelectNext = result.current.selectNext;

      act(() => {
        result.current.open();
      });

      expect(result.current.open).toBe(initialOpen);
      expect(result.current.selectNext).toBe(initialSelectNext);

      act(() => {
        result.current.selectNext();
      });

      expect(result.current.open).toBe(initialOpen);
      expect(result.current.selectNext).toBe(initialSelectNext);

      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('SSR safety', () => {
    it('returns safe initial state without DOM', () => {
      const commands = createTestCommands();
      const { result } = renderHook(() => useCommandPalette({ commands }));

      // Should not throw, should have safe defaults
      expect(result.current.state.isOpen).toBe(false);
      expect(result.current.state.filteredCommands).toEqual([]);
      expect(typeof result.current.ref).toBe('function');
      expect(typeof result.current.open).toBe('function');
    });
  });

  describe('options updates', () => {
    it('updates commands when prop changes', () => {
      const container = createMockContainer();
      const commands1 = createTestCommands();
      const commands2: Command[] = [
        { id: 'new1', label: 'New Command 1', action: vi.fn() },
        { id: 'new2', label: 'New Command 2', action: vi.fn() },
      ];

      const { result, rerender } = renderHook(({ commands }) => useCommandPalette({ commands }), {
        initialProps: { commands: commands1 },
      });

      act(() => {
        result.current.ref(container);
        result.current.open();
      });

      expect(result.current.state.filteredCommands).toHaveLength(3);

      rerender({ commands: commands2 });

      expect(result.current.state.filteredCommands).toHaveLength(2);
      expect(result.current.state.filteredCommands[0].id).toBe('new1');

      // Cleanup
      document.body.removeChild(container);
    });
  });
});
