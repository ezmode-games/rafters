import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createActivationHandler,
  createDismissalHandler,
  createKeyBindings,
  createKeyboardHandler,
  createNavigationHandler,
} from '../../src/primitives/keyboard-handler';

describe('createKeyboardHandler', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('calls handler when key matches', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler,
    });

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('handles Space key correctly', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: 'Space',
      handler,
    });

    element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('does not call handler for non-matching keys', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler,
    });

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(handler).not.toHaveBeenCalled();

    cleanup();
  });

  it('handles array of keys', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: ['Enter', 'Space'],
      handler,
    });

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(2);

    cleanup();
  });

  it('respects modifier key requirements', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler,
      modifiers: { shift: true },
    });

    // Without shift - should not call
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    // With shift - should call
    element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('respects ctrl modifier', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler,
      modifiers: { ctrl: true },
    });

    element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('respects alt modifier', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler,
      modifiers: { alt: true },
    });

    element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', altKey: true, bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('respects meta modifier', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler,
      modifiers: { meta: true },
    });

    element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', metaKey: true, bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('prevents default when option is enabled', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler,
      preventDefault: true,
    });

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);

    cleanup();
  });

  it('stops propagation when option is enabled', () => {
    const handler = vi.fn();
    const parentHandler = vi.fn();

    const parent = document.createElement('div');
    parent.appendChild(element);
    document.body.appendChild(parent);
    parent.addEventListener('keydown', parentHandler);

    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler,
      stopPropagation: true,
    });

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(handler).toHaveBeenCalled();
    expect(parentHandler).not.toHaveBeenCalled();

    cleanup();
    parent.remove();
  });

  it('removes listener on cleanup', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler,
    });

    cleanup();

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
  });

  it('does nothing when disabled', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler,
      enabled: false,
    });

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(handler).not.toHaveBeenCalled();

    cleanup();
  });

  it('works with document as target', () => {
    const handler = vi.fn();
    const cleanup = createKeyboardHandler(document, {
      key: 'Escape',
      handler,
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('returns no-op cleanup in SSR environment', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error Testing SSR
    delete globalThis.window;

    const cleanup = createKeyboardHandler(element, {
      key: 'Enter',
      handler: vi.fn(),
    });
    expect(cleanup).toBeInstanceOf(Function);

    globalThis.window = originalWindow;
  });
});

describe('createActivationHandler', () => {
  let element: HTMLButtonElement;

  beforeEach(() => {
    element = document.createElement('button');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('handles Enter key', () => {
    const handler = vi.fn();
    const cleanup = createActivationHandler(element, handler);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('handles Space key', () => {
    const handler = vi.fn();
    const cleanup = createActivationHandler(element, handler);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('prevents default on activation', () => {
    const handler = vi.fn();
    const cleanup = createActivationHandler(element, handler);

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);

    cleanup();
  });
});

describe('createDismissalHandler', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('handles Escape key', () => {
    const handler = vi.fn();
    const cleanup = createDismissalHandler(element, handler);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('works with document as target', () => {
    const handler = vi.fn();
    const cleanup = createDismissalHandler(document, handler);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();
  });
});

describe('createNavigationHandler', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('handles vertical navigation', () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();

    const cleanup = createNavigationHandler(element, {
      onNext,
      onPrevious,
      orientation: 'vertical',
    });

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(onNext).toHaveBeenCalledTimes(1);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(onPrevious).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('handles horizontal navigation', () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();

    const cleanup = createNavigationHandler(element, {
      onNext,
      onPrevious,
      orientation: 'horizontal',
    });

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(onNext).toHaveBeenCalledTimes(1);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(onPrevious).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('handles Home and End keys', () => {
    const onFirst = vi.fn();
    const onLast = vi.fn();

    const cleanup = createNavigationHandler(element, {
      onFirst,
      onLast,
    });

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(onFirst).toHaveBeenCalledTimes(1);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(onLast).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('handles both orientation', () => {
    const onNext = vi.fn();

    const cleanup = createNavigationHandler(element, {
      onNext,
      orientation: 'both',
    });

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(onNext).toHaveBeenCalledTimes(2);

    cleanup();
  });
});

describe('createKeyBindings', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('handles multiple key bindings', () => {
    const enterHandler = vi.fn();
    const escapeHandler = vi.fn();
    const deleteHandler = vi.fn();

    const cleanup = createKeyBindings(element, [
      { key: 'Enter', handler: enterHandler },
      { key: 'Escape', handler: escapeHandler },
      { key: 'Delete', handler: deleteHandler },
    ]);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

    expect(enterHandler).toHaveBeenCalledTimes(1);
    expect(escapeHandler).toHaveBeenCalledTimes(1);
    expect(deleteHandler).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('removes all listeners on cleanup', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const cleanup = createKeyBindings(element, [
      { key: 'Enter', handler: handler1 },
      { key: 'Escape', handler: handler2 },
    ]);

    cleanup();

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });
});
