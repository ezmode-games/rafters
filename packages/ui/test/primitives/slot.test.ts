import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  extractSlotProps,
  mergeClassNames,
  mergeProps,
  mergeSlotProps,
  shouldUseSlot,
} from '../../src/primitives/slot';

describe('mergeSlotProps', () => {
  let parent: HTMLDivElement;
  let child: HTMLButtonElement;

  beforeEach(() => {
    parent = document.createElement('div');
    child = document.createElement('button');
    document.body.appendChild(parent);
    document.body.appendChild(child);
  });

  afterEach(() => {
    parent.remove();
    child.remove();
  });

  it('merges ARIA attributes from parent to child', () => {
    parent.setAttribute('aria-label', 'Parent label');
    parent.setAttribute('aria-expanded', 'true');

    const cleanup = mergeSlotProps(parent, child);

    expect(child.getAttribute('aria-label')).toBe('Parent label');
    expect(child.getAttribute('aria-expanded')).toBe('true');

    cleanup();
  });

  it('merges data attributes from parent to child', () => {
    parent.setAttribute('data-state', 'open');
    parent.setAttribute('data-side', 'bottom');

    const cleanup = mergeSlotProps(parent, child);

    expect(child.getAttribute('data-state')).toBe('open');
    expect(child.getAttribute('data-side')).toBe('bottom');

    cleanup();
  });

  it('merges className from parent to child', () => {
    parent.className = 'parent-class';
    child.className = 'child-class';

    const cleanup = mergeSlotProps(parent, child);

    expect(child.className).toBe('child-class parent-class');

    cleanup();
  });

  it('uses custom classMerger if provided', () => {
    parent.className = 'parent-class';
    child.className = 'child-class';

    const classMerger = vi.fn((p, c) => `merged: ${p} + ${c}`);
    const cleanup = mergeSlotProps(parent, child, { classMerger });

    expect(classMerger).toHaveBeenCalledWith('parent-class', 'child-class');
    expect(child.className).toBe('merged: parent-class + child-class');

    cleanup();
  });

  it('merges inline styles from parent to child', () => {
    parent.setAttribute('style', 'color: red; font-size: 14px');
    child.setAttribute('style', 'background: blue');

    const cleanup = mergeSlotProps(parent, child);

    const style = child.getAttribute('style') || '';
    expect(style).toContain('color: red');
    expect(style).toContain('font-size: 14px');
    expect(style).toContain('background: blue');

    cleanup();
  });

  it('restores original attributes on cleanup', () => {
    child.setAttribute('aria-label', 'Original');
    child.className = 'original-class';

    parent.setAttribute('aria-label', 'New label');
    parent.className = 'new-class';

    const cleanup = mergeSlotProps(parent, child);

    expect(child.getAttribute('aria-label')).toBe('New label');

    cleanup();

    expect(child.getAttribute('aria-label')).toBe('Original');
    expect(child.className).toBe('original-class');
  });

  it('removes attributes on cleanup if they did not exist originally', () => {
    parent.setAttribute('aria-expanded', 'true');

    const cleanup = mergeSlotProps(parent, child);

    expect(child.getAttribute('aria-expanded')).toBe('true');

    cleanup();

    expect(child.hasAttribute('aria-expanded')).toBe(false);
  });

  it('respects merge options', () => {
    parent.setAttribute('aria-label', 'Parent');
    parent.setAttribute('data-state', 'open');
    parent.className = 'parent-class';

    const cleanup = mergeSlotProps(parent, child, {
      mergeAria: true,
      mergeData: false,
      mergeClassName: false,
    });

    expect(child.getAttribute('aria-label')).toBe('Parent');
    expect(child.hasAttribute('data-state')).toBe(false);
    expect(child.className).toBe('');

    cleanup();
  });

  it('handles role attribute', () => {
    parent.setAttribute('role', 'button');

    const cleanup = mergeSlotProps(parent, child);

    expect(child.getAttribute('role')).toBe('button');

    cleanup();
  });

  it('returns no-op cleanup in SSR environment', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error Testing SSR
    delete globalThis.window;

    const cleanup = mergeSlotProps(parent, child);
    expect(cleanup).toBeInstanceOf(Function);

    globalThis.window = originalWindow;
  });
});

describe('extractSlotProps', () => {
  it('extracts all attributes from element', () => {
    const element = document.createElement('button');
    element.setAttribute('aria-label', 'Test');
    element.setAttribute('data-state', 'open');
    element.className = 'test-class';

    const props = extractSlotProps(element);

    expect(props['aria-label']).toBe('Test');
    expect(props['data-state']).toBe('open');
    expect(props.class).toBe('test-class');
  });

  it('returns empty object in SSR environment', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error Testing SSR
    delete globalThis.window;

    const element = document.createElement('button');
    const props = extractSlotProps(element);
    expect(props).toEqual({});

    globalThis.window = originalWindow;
  });
});

describe('shouldUseSlot', () => {
  it('returns true when asChild is true', () => {
    expect(shouldUseSlot(true)).toBe(true);
  });

  it('returns false when asChild is false', () => {
    expect(shouldUseSlot(false)).toBe(false);
  });

  it('returns false when asChild is undefined', () => {
    expect(shouldUseSlot(undefined)).toBe(false);
  });
});

describe('mergeClassNames', () => {
  it('merges two class name strings', () => {
    const result = mergeClassNames('parent-class', 'child-class');
    expect(result).toBe('parent-class child-class');
  });

  it('deduplicates classes', () => {
    const result = mergeClassNames('shared-class other', 'shared-class different');
    expect(result).toBe('shared-class other different');
  });

  it('handles empty strings', () => {
    expect(mergeClassNames('', 'child')).toBe('child');
    expect(mergeClassNames('parent', '')).toBe('parent');
    expect(mergeClassNames('', '')).toBe('');
  });

  it('handles multiple spaces', () => {
    const result = mergeClassNames('one  two', 'three   four');
    expect(result).toBe('one two three four');
  });
});

describe('mergeProps', () => {
  it('merges className strings', () => {
    const result = mergeProps({ className: 'parent' }, { className: 'child' });
    expect(result.className).toBe('parent child');
  });

  it('uses custom classMerger for className', () => {
    const classMerger = (a: string, b: string) => `${b}-${a}`;
    const result = mergeProps({ className: 'parent' }, { className: 'child' }, { classMerger });
    expect(result.className).toBe('child-parent');
  });

  it('merges style objects', () => {
    const result = mergeProps(
      { style: { color: 'red', fontSize: '14px' } },
      { style: { color: 'blue', background: 'white' } },
    );
    expect(result.style).toEqual({
      color: 'blue', // Child overrides parent
      fontSize: '14px',
      background: 'white',
    });
  });

  it('composes event handlers', () => {
    const parentHandler = vi.fn();
    const childHandler = vi.fn();

    const result = mergeProps({ onClick: parentHandler }, { onClick: childHandler });

    (result.onClick as (...args: unknown[]) => void)('arg');

    expect(childHandler).toHaveBeenCalledWith('arg');
    expect(parentHandler).toHaveBeenCalledWith('arg');
    expect(childHandler).toHaveBeenCalledBefore(parentHandler);
  });

  it('child values override parent for other props', () => {
    const result = mergeProps({ id: 'parent-id', 'aria-label': 'parent' }, { id: 'child-id' });
    expect(result.id).toBe('child-id');
    expect(result['aria-label']).toBe('parent');
  });
});
