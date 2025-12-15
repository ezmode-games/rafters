import { beforeEach, describe, expect, it } from 'vitest';
import { createFocusTrap, preventBodyScroll } from '../../src/primitives/focus-trap';

describe('createFocusTrap', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    const b1 = document.createElement('button');
    const b2 = document.createElement('button');
    b1.textContent = 'one';
    b2.textContent = 'two';
    container.appendChild(b1);
    container.appendChild(b2);
    document.body.appendChild(container);
  });

  it('focuses first element and cycles Tab/Shift+Tab', () => {
    const cleanup = createFocusTrap(container);

    const [first, second] = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];

    // first element should be focused initially
    expect(document.activeElement).toBe(first);

    // Simulate Tab to move to second
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    container.dispatchEvent(tabEvent);
    expect(document.activeElement).toBe(second);

    // Simulate Shift+Tab to wrap back to first
    const shiftTab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    container.dispatchEvent(shiftTab);
    expect(document.activeElement).toBe(first);

    cleanup();
  });

  it('preventBodyScroll returns cleanup and restores body styles', () => {
    const originalOverflow = document.body.style.overflow;
    const cleanup = preventBodyScroll();
    expect(document.body.style.overflow).toBe('hidden');
    cleanup();
    expect(document.body.style.overflow).toBe(originalOverflow);
  });
});
