import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { InteractiveOptions } from '../../src/primitives/interactive';
import { createInteractive, updateInteractive } from '../../src/primitives/interactive';

let el: HTMLDivElement;
let cleanup: () => void;

/** Create an interactive surface with sensible defaults, merging overrides */
function setup(overrides: Partial<InteractiveOptions> = {}): {
  onMove: ReturnType<typeof vi.fn>;
  onKeyMove: ReturnType<typeof vi.fn>;
} {
  const onMove = vi.fn();
  const onKeyMove = vi.fn();
  cleanup = createInteractive(el, {
    mode: '2d',
    onMove,
    onKeyMove,
    ...overrides,
  });
  return { onMove, onKeyMove };
}

function pressKey(key: string, options: KeyboardEventInit = {}): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...options }));
}

beforeEach(() => {
  el = document.createElement('div');
  document.body.appendChild(el);
});

afterEach(() => {
  cleanup?.();
  el.remove();
});

describe('createInteractive', () => {
  it('returns a cleanup function', () => {
    setup();
    expect(typeof cleanup).toBe('function');
  });

  describe('ARIA attributes', () => {
    it('sets role="application" for 2D mode', () => {
      setup({ mode: '2d' });
      expect(el.getAttribute('role')).toBe('application');
    });

    it('sets role="slider" for 1D modes', () => {
      setup({ mode: '1d-horizontal' });
      expect(el.getAttribute('role')).toBe('slider');
    });

    it('sets tabindex="0"', () => {
      setup();
      expect(el.getAttribute('tabindex')).toBe('0');
    });

    it('sets aria-disabled when disabled', () => {
      setup({ disabled: true });
      expect(el.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not set aria-disabled when not disabled', () => {
      setup();
      expect(el.hasAttribute('aria-disabled')).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('restores original attributes', () => {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '-1');

      setup();

      expect(el.getAttribute('role')).toBe('application');
      expect(el.getAttribute('tabindex')).toBe('0');

      cleanup();

      expect(el.getAttribute('role')).toBe('button');
      expect(el.getAttribute('tabindex')).toBe('-1');
    });

    it('removes attributes that were not originally present', () => {
      setup();
      cleanup();

      expect(el.hasAttribute('role')).toBe(false);
      expect(el.hasAttribute('tabindex')).toBe(false);
    });
  });

  describe('keyboard navigation', () => {
    it('fires correct delta for ArrowRight in 2D', () => {
      const { onKeyMove } = setup({ mode: '2d' });
      pressKey('ArrowRight');
      expect(onKeyMove).toHaveBeenCalledWith({ dLeft: 0.01, dTop: 0 });
    });

    it('fires correct delta for ArrowDown in 2D', () => {
      const { onKeyMove } = setup({ mode: '2d' });
      pressKey('ArrowDown');
      expect(onKeyMove).toHaveBeenCalledWith({ dLeft: 0, dTop: 0.01 });
    });

    it('applies 5x multiplier with Shift key', () => {
      const { onKeyMove } = setup({ mode: '2d' });
      pressKey('ArrowRight', { shiftKey: true });
      expect(onKeyMove).toHaveBeenCalledWith({ dLeft: 0.05, dTop: 0 });
    });

    it('ignores vertical arrows in 1d-horizontal mode', () => {
      const { onKeyMove } = setup({ mode: '1d-horizontal' });
      pressKey('ArrowDown');
      expect(onKeyMove).not.toHaveBeenCalled();
    });

    it('ignores horizontal arrows in 1d-vertical mode', () => {
      const { onKeyMove } = setup({ mode: '1d-vertical' });
      pressKey('ArrowRight');
      expect(onKeyMove).not.toHaveBeenCalled();
    });

    it('does not fire callbacks when disabled', () => {
      const { onKeyMove } = setup({ mode: '2d', disabled: true });
      pressKey('ArrowRight');
      expect(onKeyMove).not.toHaveBeenCalled();
    });

    it('swaps arrow semantics in RTL mode', () => {
      const { onKeyMove } = setup({ mode: '1d-horizontal', dir: 'rtl' });
      pressKey('ArrowLeft');
      expect(onKeyMove).toHaveBeenCalledWith({ dLeft: 0.01, dTop: 0 });
    });
  });
});

describe('updateInteractive', () => {
  it('updates aria-disabled', () => {
    const { onMove } = setup();

    expect(el.hasAttribute('aria-disabled')).toBe(false);

    updateInteractive(el, { mode: '2d', onMove, disabled: true });
    expect(el.getAttribute('aria-disabled')).toBe('true');

    updateInteractive(el, { mode: '2d', onMove, disabled: false });
    expect(el.hasAttribute('aria-disabled')).toBe(false);
  });
});
