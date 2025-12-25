import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createControlledHoverDelay,
  createHoverDelay,
  createHoverIntent,
  resetHoverDelayState,
  wasRecentlyOpen,
} from '../../src/primitives/hover-delay';

describe('createHoverDelay', () => {
  let trigger: HTMLButtonElement;

  beforeEach(() => {
    trigger = document.createElement('button');
    document.body.appendChild(trigger);
    resetHoverDelayState();
    vi.useFakeTimers();
  });

  afterEach(() => {
    trigger.remove();
    vi.useRealTimers();
  });

  it('calls onOpen after delay on mouseenter', () => {
    const onOpen = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 500,
      onOpen,
    });

    trigger.dispatchEvent(new MouseEvent('mouseenter'));

    expect(onOpen).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(onOpen).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('calls onClose after delay on mouseleave', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      closeDelay: 300,
      onOpen,
      onClose,
    });

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(0);

    expect(onOpen).toHaveBeenCalled();

    trigger.dispatchEvent(new MouseEvent('mouseleave'));

    expect(onClose).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(onClose).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it('cancels open on mouseleave before delay', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 500,
      closeDelay: 100,
      onOpen,
      onClose,
    });

    trigger.dispatchEvent(new MouseEvent('mouseenter'));

    vi.advanceTimersByTime(200);

    trigger.dispatchEvent(new MouseEvent('mouseleave'));

    // The open should have been cancelled
    vi.advanceTimersByTime(400);

    // onOpen was never called because we left before openDelay elapsed
    expect(onOpen).not.toHaveBeenCalled();

    cleanup();
  });

  it('cancels close on mouseenter before delay', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      closeDelay: 300,
      onOpen,
      onClose,
    });

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(0);

    expect(onOpen).toHaveBeenCalledTimes(1);

    trigger.dispatchEvent(new MouseEvent('mouseleave'));

    vi.advanceTimersByTime(100);

    // Re-enter before close delay completes
    trigger.dispatchEvent(new MouseEvent('mouseenter'));

    // Wait past the close delay
    vi.advanceTimersByTime(300);

    // onClose should not have been called because we re-entered
    expect(onClose).not.toHaveBeenCalled();

    cleanup();
  });

  it('opens on focus when trackFocus is true', () => {
    const onOpen = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      onOpen,
      trackFocus: true,
    });

    trigger.dispatchEvent(new FocusEvent('focus'));
    vi.advanceTimersByTime(0);

    expect(onOpen).toHaveBeenCalled();

    cleanup();
  });

  it('closes on blur when trackFocus is true', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      closeDelay: 0,
      onOpen,
      onClose,
      trackFocus: true,
    });

    trigger.dispatchEvent(new FocusEvent('focus'));
    vi.advanceTimersByTime(0);

    expect(onOpen).toHaveBeenCalled();

    trigger.dispatchEvent(new FocusEvent('blur'));
    vi.advanceTimersByTime(0);

    expect(onClose).toHaveBeenCalled();

    cleanup();
  });

  it('does not track focus when trackFocus is false', () => {
    const onOpen = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      onOpen,
      trackFocus: false,
    });

    trigger.dispatchEvent(new FocusEvent('focus'));
    vi.advanceTimersByTime(0);

    expect(onOpen).not.toHaveBeenCalled();

    cleanup();
  });

  it('skips delays when skipDelays is true', () => {
    const onOpen = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 500,
      onOpen,
      skipDelays: true,
    });

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(0);

    expect(onOpen).toHaveBeenCalled();

    cleanup();
  });

  it('keeps open when hovering content element', () => {
    const content = document.createElement('div');
    document.body.appendChild(content);

    const onOpen = vi.fn();
    const onClose = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      closeDelay: 100,
      onOpen,
      onClose,
      contentElement: content,
    });

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(0);

    expect(onOpen).toHaveBeenCalled();

    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    content.dispatchEvent(new MouseEvent('mouseenter'));

    vi.advanceTimersByTime(200);

    expect(onClose).not.toHaveBeenCalled();

    cleanup();
    content.remove();
  });

  it('removes listeners on cleanup', () => {
    const onOpen = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      onOpen,
    });

    cleanup();

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(0);

    expect(onOpen).not.toHaveBeenCalled();
  });

  it('does nothing when disabled', () => {
    const onOpen = vi.fn();
    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      onOpen,
      enabled: false,
    });

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(0);

    expect(onOpen).not.toHaveBeenCalled();

    cleanup();
  });

  it('returns no-op cleanup in SSR environment', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error Testing SSR
    delete globalThis.window;

    const cleanup = createHoverDelay(trigger, { onOpen: vi.fn() });
    expect(cleanup).toBeInstanceOf(Function);

    globalThis.window = originalWindow;
  });
});

describe('createControlledHoverDelay', () => {
  beforeEach(() => {
    resetHoverDelayState();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns handler functions', () => {
    const hover = createControlledHoverDelay({
      onOpen: vi.fn(),
      onClose: vi.fn(),
    });

    expect(hover.onTriggerEnter).toBeInstanceOf(Function);
    expect(hover.onTriggerLeave).toBeInstanceOf(Function);
    expect(hover.onTriggerFocus).toBeInstanceOf(Function);
    expect(hover.onTriggerBlur).toBeInstanceOf(Function);
    expect(hover.onContentEnter).toBeInstanceOf(Function);
    expect(hover.onContentLeave).toBeInstanceOf(Function);
    expect(hover.open).toBeInstanceOf(Function);
    expect(hover.close).toBeInstanceOf(Function);
    expect(hover.getState).toBeInstanceOf(Function);
    expect(hover.destroy).toBeInstanceOf(Function);
  });

  it('tracks hover state', () => {
    const hover = createControlledHoverDelay({
      openDelay: 0,
      onOpen: vi.fn(),
    });

    expect(hover.getState().isHoveringTrigger).toBe(false);

    hover.onTriggerEnter();

    expect(hover.getState().isHoveringTrigger).toBe(true);

    vi.advanceTimersByTime(0);

    expect(hover.getState().isOpen).toBe(true);

    hover.destroy();
  });

  it('tracks focus state', () => {
    const hover = createControlledHoverDelay({
      openDelay: 0,
      onOpen: vi.fn(),
    });

    expect(hover.getState().isFocused).toBe(false);

    hover.onTriggerFocus();

    expect(hover.getState().isFocused).toBe(true);

    hover.destroy();
  });

  it('tracks content hover state', () => {
    const hover = createControlledHoverDelay({
      onOpen: vi.fn(),
    });

    expect(hover.getState().isHoveringContent).toBe(false);

    hover.onContentEnter();

    expect(hover.getState().isHoveringContent).toBe(true);

    hover.destroy();
  });

  it('allows manual open/close', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const hover = createControlledHoverDelay({
      onOpen,
      onClose,
    });

    hover.open();
    expect(onOpen).toHaveBeenCalled();
    expect(hover.getState().isOpen).toBe(true);

    hover.close();
    expect(onClose).toHaveBeenCalled();
    expect(hover.getState().isOpen).toBe(false);

    hover.destroy();
  });
});

describe('wasRecentlyOpen', () => {
  beforeEach(() => {
    resetHoverDelayState();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false initially', () => {
    expect(wasRecentlyOpen()).toBe(false);
  });

  it('returns true after a tooltip was opened', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);

    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      onOpen: vi.fn(),
    });

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(0);

    expect(wasRecentlyOpen()).toBe(true);

    cleanup();
    trigger.remove();
  });

  it('returns false after threshold time', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);

    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      onOpen: vi.fn(),
    });

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(0);

    vi.advanceTimersByTime(400); // Past threshold

    expect(wasRecentlyOpen()).toBe(false);

    cleanup();
    trigger.remove();
  });
});

describe('resetHoverDelayState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resets the global state', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);

    const cleanup = createHoverDelay(trigger, {
      openDelay: 0,
      onOpen: vi.fn(),
    });

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(0);

    expect(wasRecentlyOpen()).toBe(true);

    resetHoverDelayState();

    expect(wasRecentlyOpen()).toBe(false);

    cleanup();
    trigger.remove();
  });
});

describe('createHoverIntent', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    vi.useFakeTimers();
  });

  afterEach(() => {
    element.remove();
    vi.useRealTimers();
  });

  it('calls onEnter when mouse settles', () => {
    const onEnter = vi.fn();
    const cleanup = createHoverIntent(element, {
      sensitivity: 7,
      interval: 100,
      onEnter,
    });

    // Enter element
    element.dispatchEvent(new MouseEvent('mouseenter'));

    // Mouse stays still
    element.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));

    vi.advanceTimersByTime(100);

    // Mouse still hasn't moved much
    element.dispatchEvent(new MouseEvent('mousemove', { clientX: 51, clientY: 51 }));

    vi.advanceTimersByTime(100);

    expect(onEnter).toHaveBeenCalled();

    cleanup();
  });

  it('does not call onEnter if mouse moves quickly', () => {
    const onEnter = vi.fn();
    const cleanup = createHoverIntent(element, {
      sensitivity: 7,
      interval: 100,
      onEnter,
    });

    element.dispatchEvent(new MouseEvent('mouseenter'));
    element.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));

    vi.advanceTimersByTime(50);

    // Mouse moves significantly
    element.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));

    vi.advanceTimersByTime(50);

    // Leave before settling
    element.dispatchEvent(new MouseEvent('mouseleave'));

    expect(onEnter).not.toHaveBeenCalled();

    cleanup();
  });

  it('calls onLeave when mouse leaves', () => {
    const onEnter = vi.fn();
    const onLeave = vi.fn();
    const cleanup = createHoverIntent(element, {
      sensitivity: 7,
      interval: 100,
      onEnter,
      onLeave,
    });

    // Trigger enter
    element.dispatchEvent(new MouseEvent('mouseenter'));
    element.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
    vi.advanceTimersByTime(100);
    element.dispatchEvent(new MouseEvent('mousemove', { clientX: 51, clientY: 51 }));
    vi.advanceTimersByTime(100);

    expect(onEnter).toHaveBeenCalled();

    // Leave
    element.dispatchEvent(new MouseEvent('mouseleave'));

    expect(onLeave).toHaveBeenCalled();

    cleanup();
  });

  it('removes listeners on cleanup', () => {
    const onEnter = vi.fn();
    const cleanup = createHoverIntent(element, { onEnter });

    cleanup();

    element.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);

    expect(onEnter).not.toHaveBeenCalled();
  });

  it('returns no-op cleanup in SSR environment', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error Testing SSR
    delete globalThis.window;

    const cleanup = createHoverIntent(element, { onEnter: vi.fn() });
    expect(cleanup).toBeInstanceOf(Function);

    globalThis.window = originalWindow;
  });
});
