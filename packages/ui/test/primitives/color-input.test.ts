import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ColorInputField } from '../../src/primitives/color-input';
import { createColorInput, updateColorInput } from '../../src/primitives/color-input';

const DEFAULT_COLOR = { l: 0.7, c: 0.15, h: 250 } as const;

let lInput: HTMLInputElement;
let cInput: HTMLInputElement;
let hInput: HTMLInputElement;
let fields: ColorInputField[];

beforeEach(() => {
  lInput = document.createElement('input');
  cInput = document.createElement('input');
  hInput = document.createElement('input');
  document.body.appendChild(lInput);
  document.body.appendChild(cInput);
  document.body.appendChild(hInput);
  fields = [
    { element: lInput, channel: 'l' },
    { element: cInput, channel: 'c' },
    { element: hInput, channel: 'h' },
  ];
});

afterEach(() => {
  lInput.remove();
  cInput.remove();
  hInput.remove();
});

describe('createColorInput', () => {
  it('returns a cleanup function', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('sets initial values formatted to precision', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });
    expect(lInput.value).toBe('0.70');
    expect(cInput.value).toBe('0.150');
    expect(hInput.value).toBe('250');
    cleanup();
  });

  it('sets aria-labels', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });
    expect(lInput.getAttribute('aria-label')).toBe('Lightness');
    expect(cInput.getAttribute('aria-label')).toBe('Chroma');
    expect(hInput.getAttribute('aria-label')).toBe('Hue');
    cleanup();
  });

  it('sets inputmode="decimal"', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });
    expect(lInput.getAttribute('inputmode')).toBe('decimal');
    cleanup();
  });

  it('sets min, max, step attributes', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });
    expect(lInput.getAttribute('min')).toBe('0');
    expect(lInput.getAttribute('max')).toBe('1');
    expect(lInput.getAttribute('step')).toBe('0.01');
    expect(hInput.getAttribute('min')).toBe('0');
    expect(hInput.getAttribute('max')).toBe('360');
    expect(hInput.getAttribute('step')).toBe('1');
    cleanup();
  });

  it('fires onChange on input event with clamped value', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });

    lInput.value = '1.5';
    lInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ l: 1 }));

    cleanup();
  });

  it('clamps negative values to min', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });

    cInput.value = '-0.1';
    cInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ c: 0 }));

    cleanup();
  });

  it('fires onCommit on blur', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
      onCommit,
    });

    lInput.value = '0.5';
    lInput.dispatchEvent(new Event('input', { bubbles: true }));
    lInput.dispatchEvent(new Event('blur', { bubbles: true }));
    expect(onCommit).toHaveBeenCalled();

    cleanup();
  });

  it('cleanup restores original attributes', () => {
    lInput.setAttribute('aria-label', 'original');

    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });

    expect(lInput.getAttribute('aria-label')).toBe('Lightness');

    cleanup();

    expect(lInput.getAttribute('aria-label')).toBe('original');
  });

  it('cleanup removes attributes that were not originally present', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });
    cleanup();

    expect(lInput.hasAttribute('aria-label')).toBe(false);
    expect(lInput.hasAttribute('inputmode')).toBe(false);
  });
});

describe('keyboard interaction', () => {
  it('ArrowUp increments by step', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });

    lInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ l: 0.71 }));
    expect(lInput.value).toBe('0.71');

    cleanup();
  });

  it('ArrowDown decrements by step', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });

    hInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ h: 249 }));
    expect(hInput.value).toBe('249');

    cleanup();
  });

  it('Shift+ArrowUp increments by 10x step', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });

    lInput.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true, bubbles: true }),
    );
    const color = onChange.mock.calls[0][0];
    expect(color.l).toBeCloseTo(0.8, 10);
    expect(lInput.value).toBe('0.80');

    cleanup();
  });

  it('Enter fires onCommit', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
      onCommit,
    });

    lInput.value = '0.5';
    lInput.dispatchEvent(new Event('input', { bubbles: true }));
    lInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onCommit).toHaveBeenCalledWith(expect.objectContaining({ l: 0.5 }));

    cleanup();
  });
});

describe('input validation', () => {
  it('ignores non-numeric input like "abc"', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });

    lInput.value = 'abc';
    lInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(onChange).not.toHaveBeenCalled();

    cleanup();
  });

  it('rejects partially numeric strings like "1abc"', () => {
    const onChange = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });

    lInput.value = '1abc';
    lInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(onChange).not.toHaveBeenCalled();

    cleanup();
  });

  it('restores last valid value on blur with invalid text', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
      onCommit,
    });

    lInput.value = 'invalid';
    lInput.dispatchEvent(new Event('blur', { bubbles: true }));
    expect(lInput.value).toBe('0.70');
    expect(onCommit).not.toHaveBeenCalled();

    cleanup();
  });

  it('restores last valid value on Enter with invalid text', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    const cleanup = createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
      onCommit,
    });

    lInput.value = 'invalid';
    lInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(lInput.value).toBe('0.70');
    expect(onCommit).not.toHaveBeenCalled();

    cleanup();
  });
});

describe('updateColorInput', () => {
  it('updates values without firing onChange', () => {
    const onChange = vi.fn();
    createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });

    onChange.mockClear();

    updateColorInput(fields, {
      value: { l: 0.5, c: 0.1, h: 180 },
      onChange,
    });

    expect(lInput.value).toBe('0.50');
    expect(cInput.value).toBe('0.100');
    expect(hInput.value).toBe('180');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('syncs state when fields are in different order', () => {
    const onChange = vi.fn();
    createColorInput(fields, {
      value: DEFAULT_COLOR,
      onChange,
    });

    const reorderedFields = [fields[2], fields[0], fields[1]];
    updateColorInput(reorderedFields, {
      value: { l: 0.5, c: 0.1, h: 180 },
      onChange,
    });

    expect(hInput.value).toBe('180');
    expect(lInput.value).toBe('0.50');
    expect(cInput.value).toBe('0.100');
  });
});

describe('SSR safety', () => {
  it('returns a no-op cleanup when window is undefined', () => {
    const savedWindow = globalThis.window;
    delete (globalThis as Record<string, unknown>).window;
    try {
      const input = {} as HTMLInputElement;
      const cleanup = createColorInput([{ element: input, channel: 'l' }], {
        value: DEFAULT_COLOR,
        onChange: () => {},
      });
      expect(typeof cleanup).toBe('function');
      cleanup();
    } finally {
      globalThis.window = savedWindow;
    }
  });
});
