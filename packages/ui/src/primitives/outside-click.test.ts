/**
 * Tests for outside-click primitives
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onOutsideClick, onPointerDownOutside } from './outside-click';

describe('onOutsideClick', () => {
  let element: HTMLDivElement;
  let handler: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    handler = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('calls handler on mousedown outside element', () => {
    const cleanup = onOutsideClick(element, handler);

    const event = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);

    cleanup();
  });

  it('calls handler on touchstart outside element', () => {
    const cleanup = onOutsideClick(element, handler);

    const event = new TouchEvent('touchstart', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);

    cleanup();
  });

  it('does not call handler on click inside element', () => {
    const cleanup = onOutsideClick(element, handler);

    const event = new MouseEvent('mousedown', { bubbles: true });
    element.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();

    cleanup();
  });

  it('removes listeners on cleanup', () => {
    const cleanup = onOutsideClick(element, handler);
    cleanup();

    const event = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });
});

describe('onPointerDownOutside', () => {
  let element: HTMLDivElement;
  let handler: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    handler = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('calls handler on pointerdown outside element', () => {
    const cleanup = onPointerDownOutside(element, handler);

    const event = new PointerEvent('pointerdown', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);

    cleanup();
  });

  it('calls handler on touchstart outside element', () => {
    // touchstart is a fallback for environments (e.g., Playwright CT)
    // that don't synthesize pointer events from touch events
    const cleanup = onPointerDownOutside(element, handler);

    const event = new TouchEvent('touchstart', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);

    cleanup();
  });

  it('deduplicates touchstart + pointerdown for same touch', () => {
    // In real browsers with proper touch support, both touchstart and
    // pointerdown fire for the same touch. We should only call the handler once.
    const cleanup = onPointerDownOutside(element, handler);

    // Simulate a touch event followed by synthesized pointer event
    const touchEvent = new TouchEvent('touchstart', { bubbles: true });
    document.body.dispatchEvent(touchEvent);

    // Pointer event arrives within 50ms (typical browser behavior)
    const pointerEvent = new PointerEvent('pointerdown', { bubbles: true });
    document.body.dispatchEvent(pointerEvent);

    // Handler should only be called once (for touchstart)
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(touchEvent);

    cleanup();
  });

  it('does not call handler on pointerdown inside element', () => {
    const cleanup = onPointerDownOutside(element, handler);

    const event = new PointerEvent('pointerdown', { bubbles: true });
    element.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();

    cleanup();
  });

  it('does not call handler on touchstart inside element', () => {
    const cleanup = onPointerDownOutside(element, handler);

    const event = new TouchEvent('touchstart', { bubbles: true });
    element.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();

    cleanup();
  });

  it('removes listeners on cleanup', () => {
    const cleanup = onPointerDownOutside(element, handler);
    cleanup();

    const pointerEvent = new PointerEvent('pointerdown', { bubbles: true });
    document.body.dispatchEvent(pointerEvent);

    const touchEvent = new TouchEvent('touchstart', { bubbles: true });
    document.body.dispatchEvent(touchEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  it('returns no-op cleanup in SSR environment', () => {
    const originalWindow = global.window;
    // @ts-expect-error - simulating SSR
    delete global.window;

    const cleanup = onPointerDownOutside(element, handler);
    expect(cleanup).toBeInstanceOf(Function);

    // Restore window
    global.window = originalWindow;
  });
});
