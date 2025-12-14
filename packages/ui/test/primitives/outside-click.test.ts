import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onOutsideClick, onPointerDownOutside } from '../../src/primitives/outside-click';

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

  it('calls handler on touchstart outside element (fallback)', () => {
    const cleanup = onPointerDownOutside(element, handler);

    const event = new TouchEvent('touchstart', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);

    cleanup();
  });

  it('deduplicates touchstart + pointerdown for same touch', () => {
    const cleanup = onPointerDownOutside(element, handler);

    const touchEvent = new TouchEvent('touchstart', { bubbles: true });
    document.body.dispatchEvent(touchEvent);

    const pointerEvent = new PointerEvent('pointerdown', { bubbles: true });
    document.body.dispatchEvent(pointerEvent);

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
    const globalObj = global as unknown as { window?: Window };
    const originalWindow = globalObj.window;
    delete globalObj.window;

    const cleanup = onPointerDownOutside(element, handler);
    expect(cleanup).toBeInstanceOf(Function);

    // Restore window
    globalObj.window = originalWindow;
  });
});
