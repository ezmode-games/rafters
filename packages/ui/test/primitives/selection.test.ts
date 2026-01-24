import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createBlockSelection } from '../../src/primitives/selection';

describe('createBlockSelection', () => {
  let container: HTMLDivElement;
  let blocks: HTMLDivElement[];

  function createBlock(id: string): HTMLDivElement {
    const block = document.createElement('div');
    block.setAttribute('data-block-id', id);
    block.textContent = `Block ${id}`;
    return block;
  }

  function getBlocks(): HTMLElement[] {
    return Array.from(container.querySelectorAll('[data-block-id]'));
  }

  beforeEach(() => {
    container = document.createElement('div');
    blocks = [
      createBlock('block-1'),
      createBlock('block-2'),
      createBlock('block-3'),
      createBlock('block-4'),
      createBlock('block-5'),
    ];
    for (const block of blocks) {
      container.appendChild(block);
    }
    document.body.appendChild(container);
  });

  describe('single block selection', () => {
    it('selects a single block', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.select('block-2');

      const state = selection.getState();
      expect(state.selected.has('block-2')).toBe(true);
      expect(state.selected.size).toBe(1);
      expect(state.anchor).toBe('block-2');
      expect(state.focus).toBe('block-2');

      selection.cleanup();
    });

    it('clears previous selection when selecting without additive flag', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.select('block-1');
      selection.select('block-3');

      const state = selection.getState();
      expect(state.selected.has('block-1')).toBe(false);
      expect(state.selected.has('block-3')).toBe(true);
      expect(state.selected.size).toBe(1);

      selection.cleanup();
    });
  });

  describe('additive selection', () => {
    it('adds to selection when additive is true', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.select('block-1');
      selection.select('block-3', true);

      const state = selection.getState();
      expect(state.selected.has('block-1')).toBe(true);
      expect(state.selected.has('block-3')).toBe(true);
      expect(state.selected.size).toBe(2);

      selection.cleanup();
    });

    it('toggles selection when additive and already selected', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.select('block-1');
      selection.select('block-2', true);
      selection.select('block-1', true);

      const state = selection.getState();
      expect(state.selected.has('block-1')).toBe(false);
      expect(state.selected.has('block-2')).toBe(true);
      expect(state.selected.size).toBe(1);

      selection.cleanup();
    });
  });

  describe('range selection', () => {
    it('selects all blocks between two IDs inclusive', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.selectRange('block-2', 'block-4');

      const state = selection.getState();
      expect(state.selected.has('block-1')).toBe(false);
      expect(state.selected.has('block-2')).toBe(true);
      expect(state.selected.has('block-3')).toBe(true);
      expect(state.selected.has('block-4')).toBe(true);
      expect(state.selected.has('block-5')).toBe(false);
      expect(state.selected.size).toBe(3);
      expect(state.anchor).toBe('block-2');
      expect(state.focus).toBe('block-4');

      selection.cleanup();
    });

    it('handles reverse range (toId before fromId)', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.selectRange('block-4', 'block-2');

      const state = selection.getState();
      expect(state.selected.has('block-2')).toBe(true);
      expect(state.selected.has('block-3')).toBe(true);
      expect(state.selected.has('block-4')).toBe(true);
      expect(state.selected.size).toBe(3);

      selection.cleanup();
    });

    it('does nothing if fromId is not found', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.select('block-1');
      selection.selectRange('nonexistent', 'block-3');

      const state = selection.getState();
      expect(state.selected.has('block-1')).toBe(true);
      expect(state.selected.size).toBe(1);

      selection.cleanup();
    });

    it('does nothing if toId is not found', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.select('block-1');
      selection.selectRange('block-2', 'nonexistent');

      const state = selection.getState();
      expect(state.selected.has('block-1')).toBe(true);
      expect(state.selected.size).toBe(1);

      selection.cleanup();
    });
  });

  describe('selectAll', () => {
    it('selects all blocks', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.selectAll();

      const state = selection.getState();
      expect(state.selected.size).toBe(5);
      expect(state.selected.has('block-1')).toBe(true);
      expect(state.selected.has('block-2')).toBe(true);
      expect(state.selected.has('block-3')).toBe(true);
      expect(state.selected.has('block-4')).toBe(true);
      expect(state.selected.has('block-5')).toBe(true);
      expect(state.anchor).toBe('block-1');
      expect(state.focus).toBe('block-5');

      selection.cleanup();
    });

    it('handles empty container', () => {
      // Remove all children using DOM methods
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.selectAll();

      const state = selection.getState();
      expect(state.selected.size).toBe(0);
      expect(state.anchor).toBe(null);
      expect(state.focus).toBe(null);

      selection.cleanup();
    });
  });

  describe('clear', () => {
    it('clears all selection', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.selectAll();
      selection.clear();

      const state = selection.getState();
      expect(state.selected.size).toBe(0);
      expect(state.anchor).toBe(null);
      expect(state.focus).toBe(null);

      selection.cleanup();
    });

    it('handles already empty selection', () => {
      const onChange = vi.fn();
      const selection = createBlockSelection({
        container,
        getBlocks,
        onSelectionChange: onChange,
      });

      selection.clear();

      // Should not call onChange when nothing changes
      expect(onChange).not.toHaveBeenCalled();

      selection.cleanup();
    });
  });

  describe('onSelectionChange callback', () => {
    it('fires on select', () => {
      const onChange = vi.fn();
      const selection = createBlockSelection({
        container,
        getBlocks,
        onSelectionChange: onChange,
      });

      selection.select('block-1');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(new Set(['block-1']));

      selection.cleanup();
    });

    it('fires on additive select', () => {
      const onChange = vi.fn();
      const selection = createBlockSelection({
        container,
        getBlocks,
        onSelectionChange: onChange,
      });

      selection.select('block-1');
      selection.select('block-2', true);

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith(new Set(['block-1', 'block-2']));

      selection.cleanup();
    });

    it('fires on selectRange', () => {
      const onChange = vi.fn();
      const selection = createBlockSelection({
        container,
        getBlocks,
        onSelectionChange: onChange,
      });

      selection.selectRange('block-1', 'block-3');

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(new Set(['block-1', 'block-2', 'block-3']));

      selection.cleanup();
    });

    it('fires on selectAll', () => {
      const onChange = vi.fn();
      const selection = createBlockSelection({
        container,
        getBlocks,
        onSelectionChange: onChange,
      });

      selection.selectAll();

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        new Set(['block-1', 'block-2', 'block-3', 'block-4', 'block-5']),
      );

      selection.cleanup();
    });

    it('fires on clear', () => {
      const onChange = vi.fn();
      const selection = createBlockSelection({
        container,
        getBlocks,
        onSelectionChange: onChange,
      });

      selection.select('block-1');
      selection.clear();

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith(new Set());

      selection.cleanup();
    });

    it('receives a copy of the set to prevent mutation', () => {
      let capturedSet: Set<string> | null = null;
      const onChange = (selected: Set<string>) => {
        capturedSet = selected;
      };
      const selection = createBlockSelection({
        container,
        getBlocks,
        onSelectionChange: onChange,
      });

      selection.select('block-1');

      // Mutate the captured set
      capturedSet?.add('mutated');

      // Internal state should not be affected
      const state = selection.getState();
      expect(state.selected.has('mutated')).toBe(false);

      selection.cleanup();
    });
  });

  describe('multiSelect option', () => {
    it('when false, always replaces selection', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
        multiSelect: false,
      });

      selection.select('block-1');
      selection.select('block-2', true); // additive flag ignored

      const state = selection.getState();
      expect(state.selected.size).toBe(1);
      expect(state.selected.has('block-2')).toBe(true);

      selection.cleanup();
    });
  });

  describe('getState', () => {
    it('returns a copy of state to prevent mutation', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.select('block-1');
      const state1 = selection.getState();

      // Mutate the returned state
      state1.selected.add('hacked');

      // Internal state should not be affected
      const state2 = selection.getState();
      expect(state2.selected.has('hacked')).toBe(false);
      expect(state2.selected.size).toBe(1);

      selection.cleanup();
    });
  });

  describe('cleanup', () => {
    it('removes event listeners', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      selection.cleanup();

      // After cleanup, clicking should not select
      const clickEvent = new MouseEvent('click', { bubbles: true });
      blocks[0]?.dispatchEvent(clickEvent);

      const state = selection.getState();
      expect(state.selected.size).toBe(0);
    });
  });

  describe('click handling', () => {
    it('selects block on click', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      const clickEvent = new MouseEvent('click', { bubbles: true });
      blocks[1]?.dispatchEvent(clickEvent);

      const state = selection.getState();
      expect(state.selected.has('block-2')).toBe(true);
      expect(state.selected.size).toBe(1);

      selection.cleanup();
    });

    it('handles Ctrl+click for additive selection', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      const click1 = new MouseEvent('click', { bubbles: true });
      blocks[0]?.dispatchEvent(click1);

      const click2 = new MouseEvent('click', { bubbles: true, ctrlKey: true });
      blocks[2]?.dispatchEvent(click2);

      const state = selection.getState();
      expect(state.selected.has('block-1')).toBe(true);
      expect(state.selected.has('block-3')).toBe(true);
      expect(state.selected.size).toBe(2);

      selection.cleanup();
    });

    it('handles Shift+click for range selection', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      const click1 = new MouseEvent('click', { bubbles: true });
      blocks[0]?.dispatchEvent(click1);

      const click2 = new MouseEvent('click', { bubbles: true, shiftKey: true });
      blocks[3]?.dispatchEvent(click2);

      const state = selection.getState();
      expect(state.selected.has('block-1')).toBe(true);
      expect(state.selected.has('block-2')).toBe(true);
      expect(state.selected.has('block-3')).toBe(true);
      expect(state.selected.has('block-4')).toBe(true);
      expect(state.selected.size).toBe(4);

      selection.cleanup();
    });

    it('ignores clicks outside blocks', () => {
      const selection = createBlockSelection({
        container,
        getBlocks,
      });

      const clickEvent = new MouseEvent('click', { bubbles: true });
      container.dispatchEvent(clickEvent);

      const state = selection.getState();
      expect(state.selected.size).toBe(0);

      selection.cleanup();
    });
  });
});
