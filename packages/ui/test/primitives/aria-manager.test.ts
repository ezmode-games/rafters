import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createAriaRelationship,
  getAriaAttribute,
  hasAriaAttribute,
  removeAriaAttributes,
  setAriaAttributes,
  toggleAriaAttribute,
  updateAriaAttribute,
} from '../../src/primitives/aria-manager';

describe('setAriaAttributes', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('sets boolean ARIA attributes correctly', () => {
    const cleanup = setAriaAttributes(element, {
      'aria-expanded': true,
      'aria-disabled': false,
    });

    expect(element.getAttribute('aria-expanded')).toBe('true');
    expect(element.getAttribute('aria-disabled')).toBe('false');

    cleanup();
  });

  it('sets tristate ARIA attributes correctly', () => {
    const cleanup = setAriaAttributes(element, {
      'aria-checked': 'mixed',
    });

    expect(element.getAttribute('aria-checked')).toBe('mixed');

    cleanup();
  });

  it('sets number ARIA attributes correctly', () => {
    const cleanup = setAriaAttributes(element, {
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuenow': 50,
    });

    expect(element.getAttribute('aria-valuemin')).toBe('0');
    expect(element.getAttribute('aria-valuemax')).toBe('100');
    expect(element.getAttribute('aria-valuenow')).toBe('50');

    cleanup();
  });

  it('sets string ARIA attributes correctly', () => {
    const cleanup = setAriaAttributes(element, {
      'aria-label': 'Test label',
      'aria-labelledby': 'label-id',
    });

    expect(element.getAttribute('aria-label')).toBe('Test label');
    expect(element.getAttribute('aria-labelledby')).toBe('label-id');

    cleanup();
  });

  it('sets token ARIA attributes correctly', () => {
    const cleanup = setAriaAttributes(element, {
      'aria-live': 'polite',
      'aria-haspopup': 'menu',
    });

    expect(element.getAttribute('aria-live')).toBe('polite');
    expect(element.getAttribute('aria-haspopup')).toBe('menu');

    cleanup();
  });

  it('sets role attribute', () => {
    const cleanup = setAriaAttributes(element, {
      role: 'button',
    });

    expect(element.getAttribute('role')).toBe('button');

    cleanup();
  });

  it('restores original values on cleanup', () => {
    element.setAttribute('aria-label', 'Original');
    element.setAttribute('aria-expanded', 'false');

    const cleanup = setAriaAttributes(element, {
      'aria-label': 'New label',
      'aria-expanded': true,
    });

    expect(element.getAttribute('aria-label')).toBe('New label');
    expect(element.getAttribute('aria-expanded')).toBe('true');

    cleanup();

    expect(element.getAttribute('aria-label')).toBe('Original');
    expect(element.getAttribute('aria-expanded')).toBe('false');
  });

  it('removes attributes on cleanup if they did not exist originally', () => {
    const cleanup = setAriaAttributes(element, {
      'aria-expanded': true,
    });

    expect(element.hasAttribute('aria-expanded')).toBe(true);

    cleanup();

    expect(element.hasAttribute('aria-expanded')).toBe(false);
  });

  it('skips undefined values', () => {
    const cleanup = setAriaAttributes(element, {
      'aria-label': undefined,
      'aria-expanded': true,
    });

    expect(element.hasAttribute('aria-label')).toBe(false);
    expect(element.hasAttribute('aria-expanded')).toBe(true);

    cleanup();
  });

  it('warns for invalid values when validation is enabled', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const cleanup = setAriaAttributes(
      element,
      {
        // @ts-expect-error Testing invalid value
        'aria-live': 'invalid-value',
      },
      { validate: true, warn: true },
    );

    expect(warnSpy).toHaveBeenCalled();

    cleanup();
    warnSpy.mockRestore();
  });

  it('returns no-op cleanup in SSR environment', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error Testing SSR
    delete globalThis.window;

    const cleanup = setAriaAttributes(element, { 'aria-expanded': true });
    expect(cleanup).toBeInstanceOf(Function);

    globalThis.window = originalWindow;
  });
});

describe('updateAriaAttribute', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('updates a single attribute', () => {
    updateAriaAttribute(element, 'aria-expanded', true);
    expect(element.getAttribute('aria-expanded')).toBe('true');

    updateAriaAttribute(element, 'aria-expanded', false);
    expect(element.getAttribute('aria-expanded')).toBe('false');
  });

  it('removes attribute when value is undefined', () => {
    element.setAttribute('aria-expanded', 'true');

    updateAriaAttribute(element, 'aria-expanded', undefined);

    expect(element.hasAttribute('aria-expanded')).toBe(false);
  });
});

describe('removeAriaAttributes', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('removes specified attributes', () => {
    element.setAttribute('aria-label', 'Test');
    element.setAttribute('aria-expanded', 'true');
    element.setAttribute('aria-disabled', 'false');

    removeAriaAttributes(element, ['aria-label', 'aria-expanded']);

    expect(element.hasAttribute('aria-label')).toBe(false);
    expect(element.hasAttribute('aria-expanded')).toBe(false);
    expect(element.hasAttribute('aria-disabled')).toBe(true);
  });
});

describe('getAriaAttribute', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('returns boolean for boolean attributes', () => {
    element.setAttribute('aria-expanded', 'true');
    expect(getAriaAttribute(element, 'aria-expanded')).toBe(true);

    element.setAttribute('aria-expanded', 'false');
    expect(getAriaAttribute(element, 'aria-expanded')).toBe(false);
  });

  it('returns correct value for tristate attributes', () => {
    element.setAttribute('aria-checked', 'true');
    expect(getAriaAttribute(element, 'aria-checked')).toBe(true);

    element.setAttribute('aria-checked', 'mixed');
    expect(getAriaAttribute(element, 'aria-checked')).toBe('mixed');
  });

  it('returns number for number attributes', () => {
    element.setAttribute('aria-valuenow', '50');
    expect(getAriaAttribute(element, 'aria-valuenow')).toBe(50);
  });

  it('returns undefined for missing attributes', () => {
    expect(getAriaAttribute(element, 'aria-label')).toBeUndefined();
  });

  it('returns string for string attributes', () => {
    element.setAttribute('aria-label', 'Test label');
    expect(getAriaAttribute(element, 'aria-label')).toBe('Test label');
  });
});

describe('hasAriaAttribute', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('returns true when attribute exists', () => {
    element.setAttribute('aria-expanded', 'true');
    expect(hasAriaAttribute(element, 'aria-expanded')).toBe(true);
  });

  it('returns false when attribute does not exist', () => {
    expect(hasAriaAttribute(element, 'aria-expanded')).toBe(false);
  });
});

describe('toggleAriaAttribute', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('toggles boolean attribute', () => {
    element.setAttribute('aria-expanded', 'true');

    const result1 = toggleAriaAttribute(element, 'aria-expanded');
    expect(result1).toBe(false);
    expect(element.getAttribute('aria-expanded')).toBe('false');

    const result2 = toggleAriaAttribute(element, 'aria-expanded');
    expect(result2).toBe(true);
    expect(element.getAttribute('aria-expanded')).toBe('true');
  });

  it('sets to true when attribute does not exist', () => {
    const result = toggleAriaAttribute(element, 'aria-expanded');
    expect(result).toBe(true);
    expect(element.getAttribute('aria-expanded')).toBe('true');
  });

  it('respects force parameter', () => {
    element.setAttribute('aria-expanded', 'true');

    const result = toggleAriaAttribute(element, 'aria-expanded', true);
    expect(result).toBe(true);
    expect(element.getAttribute('aria-expanded')).toBe('true');
  });
});

describe('createAriaRelationship', () => {
  let element: HTMLDivElement;
  let target: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    target = document.createElement('div');
    document.body.appendChild(element);
    document.body.appendChild(target);
  });

  afterEach(() => {
    element.remove();
    target.remove();
  });

  it('creates labelledby relationship', () => {
    target.id = 'label-id';

    const cleanup = createAriaRelationship(element, target, 'aria-labelledby');

    expect(element.getAttribute('aria-labelledby')).toBe('label-id');

    cleanup();
  });

  it('generates ID if target has none', () => {
    const cleanup = createAriaRelationship(element, target, 'aria-labelledby');

    expect(target.id).toBeTruthy();
    expect(element.getAttribute('aria-labelledby')).toBe(target.id);

    cleanup();
  });

  it('handles multiple targets', () => {
    const target2 = document.createElement('div');
    document.body.appendChild(target2);

    target.id = 'target1';
    target2.id = 'target2';

    const cleanup = createAriaRelationship(element, [target, target2], 'aria-describedby');

    expect(element.getAttribute('aria-describedby')).toBe('target1 target2');

    cleanup();
    target2.remove();
  });

  it('appends to existing IDs', () => {
    element.setAttribute('aria-labelledby', 'existing-id');
    target.id = 'new-id';

    const cleanup = createAriaRelationship(element, target, 'aria-labelledby');

    expect(element.getAttribute('aria-labelledby')).toBe('existing-id new-id');

    cleanup();

    expect(element.getAttribute('aria-labelledby')).toBe('existing-id');
  });

  it('restores original value on cleanup', () => {
    element.setAttribute('aria-labelledby', 'original-id');
    target.id = 'target-id';

    const cleanup = createAriaRelationship(element, target, 'aria-labelledby');
    cleanup();

    expect(element.getAttribute('aria-labelledby')).toBe('original-id');
  });

  it('removes attribute on cleanup if it did not exist originally', () => {
    target.id = 'target-id';

    const cleanup = createAriaRelationship(element, target, 'aria-controls');
    cleanup();

    expect(element.hasAttribute('aria-controls')).toBe(false);
  });

  it('returns no-op cleanup in SSR environment', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error Testing SSR
    delete globalThis.window;

    const cleanup = createAriaRelationship(element, target, 'aria-labelledby');
    expect(cleanup).toBeInstanceOf(Function);

    globalThis.window = originalWindow;
  });
});
