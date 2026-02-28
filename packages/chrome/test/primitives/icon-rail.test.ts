import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IconRailControls, IconRailItem } from '../../src/primitives/icon-rail';
import { createIconRail } from '../../src/primitives/icon-rail';

// =============================================================================
// Helpers
// =============================================================================

function createRailDOM(itemIds: string[]): {
  container: HTMLDivElement;
  itemElements: HTMLDivElement[];
} {
  const container = document.createElement('div');
  const itemElements: HTMLDivElement[] = [];

  for (const id of itemIds) {
    const el = document.createElement('div');
    el.setAttribute('data-rail-item', '');
    el.setAttribute('data-rail-id', id);
    el.textContent = id;
    container.appendChild(el);
    itemElements.push(el);
  }

  document.body.appendChild(container);
  return { container, itemElements };
}

function makeItems(
  ids: string[],
  overrides?: Partial<Record<string, Partial<IconRailItem>>>,
): IconRailItem[] {
  return ids.map((id) => ({
    id,
    label: `${id} label`,
    ...overrides?.[id],
  }));
}

function pressKey(target: HTMLElement | EventTarget, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function mouseOver(target: HTMLElement): void {
  target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
}

function mouseOut(target: HTMLElement, relatedTarget?: HTMLElement | null): void {
  target.dispatchEvent(
    new MouseEvent('mouseout', { bubbles: true, relatedTarget: relatedTarget ?? null }),
  );
}

// =============================================================================
// Tests
// =============================================================================

describe('createIconRail', () => {
  let container: HTMLDivElement;
  let itemElements: HTMLDivElement[];
  let controls: IconRailControls;

  beforeEach(() => {
    const dom = createRailDOM(['layers', 'tokens', 'colors']);
    container = dom.container;
    itemElements = dom.itemElements;
  });

  afterEach(() => {
    controls?.destroy();
    container.remove();
    vi.useRealTimers();
  });

  // ===========================================================================
  // ARIA setup
  // ===========================================================================

  describe('ARIA attributes', () => {
    it('sets role="toolbar" and aria-orientation="vertical" on container', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      expect(container.getAttribute('role')).toBe('toolbar');
      expect(container.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('sets role="button" on each item', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      for (const el of itemElements) {
        expect(el.getAttribute('role')).toBe('button');
      }
    });

    it('sets aria-label on items from item definition', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      expect(itemElements[0]?.getAttribute('aria-label')).toBe('layers label');
      expect(itemElements[1]?.getAttribute('aria-label')).toBe('tokens label');
      expect(itemElements[2]?.getAttribute('aria-label')).toBe('colors label');
    });

    it('sets aria-pressed="false" on inactive items', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      for (const el of itemElements) {
        expect(el.getAttribute('aria-pressed')).toBe('false');
      }
    });

    it('sets aria-pressed="true" and data-active="true" on active item', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        activeId: 'tokens',
      });

      expect(itemElements[1]?.getAttribute('aria-pressed')).toBe('true');
      expect(itemElements[1]?.getAttribute('data-active')).toBe('true');

      // Others remain inactive
      expect(itemElements[0]?.getAttribute('aria-pressed')).toBe('false');
      expect(itemElements[0]?.hasAttribute('data-active')).toBe(false);
    });

    it('cleans up all ARIA on destroy', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        activeId: 'layers',
      });

      controls.destroy();

      expect(container.hasAttribute('role')).toBe(false);
      expect(container.hasAttribute('aria-orientation')).toBe(false);

      for (const el of itemElements) {
        expect(el.hasAttribute('role')).toBe(false);
        expect(el.hasAttribute('aria-label')).toBe(false);
        expect(el.hasAttribute('aria-pressed')).toBe(false);
        expect(el.hasAttribute('data-active')).toBe(false);
        expect(el.hasAttribute('tabindex')).toBe(false);
      }
    });
  });

  // ===========================================================================
  // Roving tabindex
  // ===========================================================================

  describe('roving tabindex', () => {
    it('sets tabindex="0" on first item when no activeId', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      expect(itemElements[0]?.getAttribute('tabindex')).toBe('0');
      expect(itemElements[1]?.getAttribute('tabindex')).toBe('-1');
      expect(itemElements[2]?.getAttribute('tabindex')).toBe('-1');
    });

    it('sets tabindex="0" on active item', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        activeId: 'colors',
      });

      expect(itemElements[0]?.getAttribute('tabindex')).toBe('-1');
      expect(itemElements[1]?.getAttribute('tabindex')).toBe('-1');
      expect(itemElements[2]?.getAttribute('tabindex')).toBe('0');
    });

    it('moves tabindex when focus changes', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      // Simulate focus moving to second item
      itemElements[1]?.focus();
      itemElements[1]?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

      expect(itemElements[0]?.getAttribute('tabindex')).toBe('-1');
      expect(itemElements[1]?.getAttribute('tabindex')).toBe('0');
    });
  });

  // ===========================================================================
  // Keyboard navigation
  // ===========================================================================

  describe('keyboard navigation', () => {
    it('ArrowDown moves focus to next item', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, 'ArrowDown');

      expect(document.activeElement).toBe(itemElements[1]);
    });

    it('ArrowUp moves focus to previous item', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      itemElements[1]?.focus();
      pressKey(itemElements[1] as HTMLDivElement, 'ArrowUp');

      expect(document.activeElement).toBe(itemElements[0]);
    });

    it('ArrowDown wraps from last to first', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      itemElements[2]?.focus();
      pressKey(itemElements[2] as HTMLDivElement, 'ArrowDown');

      expect(document.activeElement).toBe(itemElements[0]);
    });

    it('ArrowUp wraps from first to last', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, 'ArrowUp');

      expect(document.activeElement).toBe(itemElements[2]);
    });

    it('Home jumps to first item', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      itemElements[2]?.focus();
      pressKey(itemElements[2] as HTMLDivElement, 'Home');

      expect(document.activeElement).toBe(itemElements[0]);
    });

    it('End jumps to last item', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, 'End');

      expect(document.activeElement).toBe(itemElements[2]);
    });

    it('skips disabled items during navigation', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors'], {
          tokens: { disabled: true },
        }),
      });

      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, 'ArrowDown');

      // Should skip tokens (disabled) and land on colors
      expect(document.activeElement).toBe(itemElements[2]);
    });

    it('does not navigate when globally disabled', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        disabled: true,
      });

      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, 'ArrowDown');

      // Focus should not move
      expect(document.activeElement).toBe(itemElements[0]);
    });
  });

  // ===========================================================================
  // Activation (Enter / Space / Click)
  // ===========================================================================

  describe('activation', () => {
    it('calls onActivate when Enter is pressed', () => {
      const onActivate = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onActivate,
      });

      itemElements[1]?.focus();
      pressKey(itemElements[1] as HTMLDivElement, 'Enter');

      expect(onActivate).toHaveBeenCalledWith('tokens');
    });

    it('calls onActivate when Space is pressed', () => {
      const onActivate = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onActivate,
      });

      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, ' ');

      expect(onActivate).toHaveBeenCalledWith('layers');
    });

    it('calls onActivate when item is clicked', () => {
      const onActivate = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onActivate,
      });

      itemElements[2]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onActivate).toHaveBeenCalledWith('colors');
    });

    it('does not fire onActivate for disabled item', () => {
      const onActivate = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors'], {
          tokens: { disabled: true },
        }),
        onActivate,
      });

      itemElements[1]?.focus();
      pressKey(itemElements[1] as HTMLDivElement, 'Enter');

      expect(onActivate).not.toHaveBeenCalled();
    });

    it('does not fire onActivate when globally disabled', () => {
      const onActivate = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onActivate,
        disabled: true,
      });

      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, 'Enter');

      expect(onActivate).not.toHaveBeenCalled();
    });

    it('does not fire onActivate on click when globally disabled', () => {
      const onActivate = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onActivate,
        disabled: true,
      });

      itemElements[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onActivate).not.toHaveBeenCalled();
    });

    it('prevents default on Enter and Space', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onActivate: vi.fn(),
      });

      itemElements[0]?.focus();

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });

      itemElements[0]?.dispatchEvent(enterEvent);
      itemElements[0]?.dispatchEvent(spaceEvent);

      expect(enterEvent.defaultPrevented).toBe(true);
      expect(spaceEvent.defaultPrevented).toBe(true);
    });
  });

  // ===========================================================================
  // Hover
  // ===========================================================================

  describe('hover events', () => {
    it('fires onHoverEnter after delay', () => {
      vi.useFakeTimers();

      const onHoverEnter = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onHoverEnter,
        hoverDelay: 200,
      });

      mouseOver(itemElements[0] as HTMLDivElement);

      // Not fired yet (delay not elapsed)
      expect(onHoverEnter).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);

      expect(onHoverEnter).toHaveBeenCalledWith('layers');
    });

    it('fires onHoverLeave when mouse leaves item', () => {
      vi.useFakeTimers();

      const onHoverEnter = vi.fn();
      const onHoverLeave = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onHoverEnter,
        onHoverLeave,
        hoverDelay: 200,
      });

      mouseOver(itemElements[0] as HTMLDivElement);
      vi.advanceTimersByTime(200);

      expect(onHoverEnter).toHaveBeenCalledWith('layers');

      mouseOut(itemElements[0] as HTMLDivElement);

      expect(onHoverLeave).toHaveBeenCalledWith('layers');
    });

    it('cancels hover if mouse leaves before delay elapses', () => {
      vi.useFakeTimers();

      const onHoverEnter = vi.fn();
      const onHoverLeave = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onHoverEnter,
        onHoverLeave,
        hoverDelay: 200,
      });

      mouseOver(itemElements[0] as HTMLDivElement);
      vi.advanceTimersByTime(100); // Only half the delay
      mouseOut(itemElements[0] as HTMLDivElement);
      vi.advanceTimersByTime(200); // Past the full delay

      // onHoverEnter should never have been called
      expect(onHoverEnter).not.toHaveBeenCalled();
      // onHoverLeave should not fire either (hover never started)
      expect(onHoverLeave).not.toHaveBeenCalled();
    });

    it('uses default 200ms delay', () => {
      vi.useFakeTimers();

      const onHoverEnter = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onHoverEnter,
      });

      mouseOver(itemElements[0] as HTMLDivElement);

      vi.advanceTimersByTime(199);
      expect(onHoverEnter).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(onHoverEnter).toHaveBeenCalledWith('layers');
    });

    it('fires immediately when hoverDelay is 0', () => {
      const onHoverEnter = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onHoverEnter,
        hoverDelay: 0,
      });

      mouseOver(itemElements[0] as HTMLDivElement);

      expect(onHoverEnter).toHaveBeenCalledWith('layers');
    });

    it('does not fire hover events for disabled items', () => {
      vi.useFakeTimers();

      const onHoverEnter = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors'], {
          tokens: { disabled: true },
        }),
        onHoverEnter,
        hoverDelay: 200,
      });

      mouseOver(itemElements[1] as HTMLDivElement);
      vi.advanceTimersByTime(300);

      expect(onHoverEnter).not.toHaveBeenCalled();
    });

    it('does not fire hover events when globally disabled', () => {
      vi.useFakeTimers();

      const onHoverEnter = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onHoverEnter,
        disabled: true,
        hoverDelay: 200,
      });

      mouseOver(itemElements[0] as HTMLDivElement);
      vi.advanceTimersByTime(300);

      expect(onHoverEnter).not.toHaveBeenCalled();
    });

    it('clears hover timer on destroy', () => {
      vi.useFakeTimers();

      const onHoverEnter = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onHoverEnter,
        hoverDelay: 200,
      });

      mouseOver(itemElements[0] as HTMLDivElement);
      controls.destroy();
      vi.advanceTimersByTime(300);

      expect(onHoverEnter).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Controls
  // ===========================================================================

  describe('controls', () => {
    it('setActiveId updates active indicator', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      controls.setActiveId('colors');

      expect(itemElements[2]?.getAttribute('data-active')).toBe('true');
      expect(itemElements[2]?.getAttribute('aria-pressed')).toBe('true');
      expect(itemElements[0]?.getAttribute('aria-pressed')).toBe('false');
    });

    it('setActiveId with undefined clears active state', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        activeId: 'layers',
      });

      controls.setActiveId(undefined);

      for (const el of itemElements) {
        expect(el.getAttribute('aria-pressed')).toBe('false');
        expect(el.hasAttribute('data-active')).toBe(false);
      }
    });

    it('setItems re-applies ARIA with new definitions', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      controls.setItems([
        { id: 'layers', label: 'New Layers Label' },
        { id: 'tokens', label: 'New Tokens Label', disabled: true },
        { id: 'colors', label: 'New Colors Label' },
      ]);

      expect(itemElements[0]?.getAttribute('aria-label')).toBe('New Layers Label');
      expect(itemElements[1]?.getAttribute('aria-label')).toBe('New Tokens Label');
      expect(itemElements[1]?.getAttribute('aria-disabled')).toBe('true');
    });

    it('setDisabled enables/disables the entire rail', () => {
      const onActivate = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onActivate,
      });

      controls.setDisabled(true);

      // All items should have aria-disabled
      for (const el of itemElements) {
        expect(el.getAttribute('aria-disabled')).toBe('true');
      }

      // Activation should not fire
      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, 'Enter');
      expect(onActivate).not.toHaveBeenCalled();

      // Re-enable
      controls.setDisabled(false);

      // aria-disabled should be removed
      for (const el of itemElements) {
        expect(el.hasAttribute('aria-disabled')).toBe(false);
      }

      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, 'Enter');
      expect(onActivate).toHaveBeenCalledWith('layers');
    });
  });

  // ===========================================================================
  // Event delegation
  // ===========================================================================

  describe('event delegation', () => {
    it('handles clicks on child elements inside an item', () => {
      // Add a nested span inside the first item
      const span = document.createElement('span');
      span.textContent = 'icon';
      itemElements[0]?.appendChild(span);

      const onActivate = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onActivate,
      });

      // Click on the span (child of item)
      span.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onActivate).toHaveBeenCalledWith('layers');
    });

    it('ignores clicks outside items', () => {
      const onActivate = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onActivate,
      });

      container.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onActivate).not.toHaveBeenCalled();
    });

    it('does not fire events after destroy', () => {
      const onActivate = vi.fn();
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
        onActivate,
      });

      controls.destroy();

      itemElements[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, 'Enter');

      expect(onActivate).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // SSR guard
  // ===========================================================================

  describe('SSR guard', () => {
    it('returns no-op controls when window is undefined', () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error Testing SSR environment
      delete globalThis.window;

      const ssr = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors']),
      });

      // All methods should be callable without error
      expect(() => ssr.setActiveId('layers')).not.toThrow();
      expect(() => ssr.setItems([])).not.toThrow();
      expect(() => ssr.setDisabled(true)).not.toThrow();
      expect(() => ssr.destroy()).not.toThrow();

      globalThis.window = originalWindow;
    });
  });

  // ===========================================================================
  // Edge cases
  // ===========================================================================

  describe('edge cases', () => {
    it('handles empty items array', () => {
      controls = createIconRail({
        container,
        items: [],
      });

      expect(container.getAttribute('role')).toBe('toolbar');
    });

    it('handles single item', () => {
      const dom = createRailDOM(['only']);
      const singleContainer = dom.container;

      controls = createIconRail({
        container: singleContainer,
        items: makeItems(['only']),
      });

      // ArrowDown on only item should wrap to itself
      dom.itemElements[0]?.focus();
      pressKey(dom.itemElements[0] as HTMLDivElement, 'ArrowDown');
      expect(document.activeElement).toBe(dom.itemElements[0]);

      singleContainer.remove();
    });

    it('handles all items disabled', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors'], {
          layers: { disabled: true },
          tokens: { disabled: true },
          colors: { disabled: true },
        }),
      });

      // First enabled item fallback: none, so first item gets tabindex 0
      // When all are disabled, the first item should still not be navigable
      itemElements[0]?.focus();
      pressKey(itemElements[0] as HTMLDivElement, 'ArrowDown');

      // Navigation should find no enabled items, so nothing changes
    });

    it('activeId pointing to disabled item falls back to first enabled', () => {
      controls = createIconRail({
        container,
        items: makeItems(['layers', 'tokens', 'colors'], {
          layers: { disabled: true },
        }),
        activeId: 'layers',
      });

      // Active item is disabled, so tabindex=0 should fall to first enabled
      expect(itemElements[1]?.getAttribute('tabindex')).toBe('0');
    });
  });
});
