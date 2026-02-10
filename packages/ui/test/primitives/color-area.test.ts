import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createColorArea, updateColorArea } from '../../src/primitives/color-area';

describe('createColorArea', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    canvas.remove();
  });

  it('returns a cleanup function', () => {
    const cleanup = createColorArea(canvas, { hue: 250 });
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('sets role="img"', () => {
    const cleanup = createColorArea(canvas, { hue: 250 });
    expect(canvas.getAttribute('role')).toBe('img');
    cleanup();
  });

  it('sets aria-label with hue', () => {
    const cleanup = createColorArea(canvas, { hue: 250 });
    expect(canvas.getAttribute('aria-label')).toBe('Color area for hue 250 degrees');
    cleanup();
  });

  it('cleanup restores original attributes', () => {
    canvas.setAttribute('role', 'presentation');
    canvas.setAttribute('aria-label', 'original');

    const cleanup = createColorArea(canvas, { hue: 250 });

    expect(canvas.getAttribute('role')).toBe('img');
    expect(canvas.getAttribute('aria-label')).toBe('Color area for hue 250 degrees');

    cleanup();

    expect(canvas.getAttribute('role')).toBe('presentation');
    expect(canvas.getAttribute('aria-label')).toBe('original');
  });

  it('cleanup removes attributes that were not originally present', () => {
    const cleanup = createColorArea(canvas, { hue: 250 });
    cleanup();

    expect(canvas.hasAttribute('role')).toBe(false);
    expect(canvas.hasAttribute('aria-label')).toBe(false);
  });
});

describe('updateColorArea', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    canvas.remove();
  });

  it('updates aria-label with new hue', () => {
    createColorArea(canvas, { hue: 250 });
    updateColorArea(canvas, { hue: 120 });
    expect(canvas.getAttribute('aria-label')).toBe('Color area for hue 120 degrees');
  });
});
