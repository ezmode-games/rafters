/**
 * Utility function tests
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  focusFirst,
  generateAriaId,
  getFocusableElements,
  meetsTouchTargetSize,
  trapFocus,
} from '../src/utils/accessibility';
import { FocusManager, isElementVisible, moveFocusTo } from '../src/utils/focus';
import {
  getNextIndex,
  isActionKey,
  isNavigationKey,
  updateRovingTabindex,
} from '../src/utils/keyboard';

describe('Accessibility utilities', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it.skip('should check touch target size', () => {
    // JSDOM doesn't support getBoundingClientRect dimensions
    // This test requires browser environment (Playwright)
    const button = document.createElement('button');
    button.style.width = '44px';
    button.style.height = '44px';
    container.appendChild(button);

    expect(meetsTouchTargetSize(button)).toBe(true);

    button.style.width = '20px';
    expect(meetsTouchTargetSize(button)).toBe(false);
  });

  it.skip('should get focusable elements', () => {
    // JSDOM doesn't support offsetWidth/offsetHeight for visibility check
    // This test requires browser environment (Playwright)
    container.innerHTML = `
      <button>Button</button>
      <a href="#">Link</a>
      <input type="text" />
      <div tabindex="0">Focusable div</div>
      <button disabled>Disabled</button>
    `;

    const focusable = getFocusableElements(container);
    expect(focusable).toHaveLength(4);
  });

  it.skip('should trap focus', () => {
    // JSDOM doesn't support focus() or activeElement properly
    // This test requires browser environment (Playwright)
    container.innerHTML = `
      <button id="first">First</button>
      <button id="second">Second</button>
      <button id="last">Last</button>
    `;

    const _first = container.querySelector('#first') as HTMLButtonElement;
    const last = container.querySelector('#last') as HTMLButtonElement;

    last.focus();

    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    const trapped = trapFocus(container, event);

    expect(trapped).toBe(true);
  });

  it.skip('should focus first element', () => {
    // JSDOM doesn't support focus() properly
    // This test requires browser environment (Playwright)
    container.innerHTML = `
      <button id="first">First</button>
      <button id="second">Second</button>
    `;

    const success = focusFirst(container);
    expect(success).toBe(true);
    expect(document.activeElement?.id).toBe('first');
  });

  it('should generate unique ARIA IDs', () => {
    const id1 = generateAriaId('test');
    const id2 = generateAriaId('test');

    expect(id1).toMatch(/^test-/);
    expect(id2).toMatch(/^test-/);
    expect(id1).not.toBe(id2);
  });
});

describe('Keyboard utilities', () => {
  it('should identify navigation keys', () => {
    expect(isNavigationKey('ArrowUp')).toBe(true);
    expect(isNavigationKey('Enter')).toBe(true);
    expect(isNavigationKey('a')).toBe(false);
  });

  it('should identify action keys', () => {
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    const aEvent = new KeyboardEvent('keydown', { key: 'a' });

    expect(isActionKey(enterEvent)).toBe(true);
    expect(isActionKey(spaceEvent)).toBe(true);
    expect(isActionKey(aEvent)).toBe(false);
  });

  it('should get next index with wrapping', () => {
    expect(getNextIndex(0, 5, 1)).toBe(1);
    expect(getNextIndex(4, 5, 1)).toBe(0); // Wrap to start
    expect(getNextIndex(0, 5, -1)).toBe(4); // Wrap to end
  });

  it('should update roving tabindex', () => {
    const elements = [
      document.createElement('button'),
      document.createElement('button'),
      document.createElement('button'),
    ];

    updateRovingTabindex(elements, 1);

    expect(elements[0].getAttribute('tabindex')).toBe('-1');
    expect(elements[1].getAttribute('tabindex')).toBe('0');
    expect(elements[2].getAttribute('tabindex')).toBe('-1');
  });
});

describe('Focus utilities', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should manage focus with FocusManager', () => {
    const button = document.createElement('button');
    container.appendChild(button);
    button.focus();

    const manager = new FocusManager();
    manager.saveFocus();

    const otherButton = document.createElement('button');
    container.appendChild(otherButton);
    otherButton.focus();

    expect(document.activeElement).toBe(otherButton);

    manager.restoreFocus();
    expect(document.activeElement).toBe(button);
  });

  it.skip('should check element visibility', () => {
    // JSDOM doesn't support offsetWidth/offsetHeight
    // This test requires browser environment (Playwright)
    const visible = document.createElement('div');
    visible.style.width = '100px';
    visible.style.height = '100px';
    container.appendChild(visible);

    expect(isElementVisible(visible)).toBe(true);

    visible.style.display = 'none';
    expect(isElementVisible(visible)).toBe(false);
  });

  it.skip('should move focus to visible element', () => {
    // JSDOM doesn't support focus() or offsetWidth/offsetHeight
    // This test requires browser environment (Playwright)
    const button = document.createElement('button');
    button.style.width = '100px';
    button.style.height = '100px';
    container.appendChild(button);

    const success = moveFocusTo(button);
    expect(success).toBe(true);
    expect(document.activeElement).toBe(button);
  });
});
