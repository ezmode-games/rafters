/**
 * Utility function tests
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generateAriaId } from '../../src/utils/accessibility.ts';
import { FocusManager } from '../../src/utils/focus.ts';
import {
  getNextIndex,
  isActionKey,
  isNavigationKey,
  updateRovingTabindex,
} from '../../src/utils/keyboard.ts';

describe('Accessibility utilities', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
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
});
