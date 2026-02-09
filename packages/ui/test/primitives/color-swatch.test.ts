import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createSwatch, toOklch, updateSwatch } from '../../src/primitives/color-swatch';

describe('toOklch', () => {
  it('builds oklch string without alpha', () => {
    expect(toOklch({ l: 0.6, c: 0.15, h: 250 })).toBe('oklch(0.6 0.15 250)');
  });

  it('includes alpha when less than 1', () => {
    expect(toOklch({ l: 0.5, c: 0.1, h: 180, alpha: 0.8 })).toBe('oklch(0.5 0.1 180 / 0.8)');
  });

  it('omits alpha when exactly 1', () => {
    expect(toOklch({ l: 0.5, c: 0.1, h: 180, alpha: 1 })).toBe('oklch(0.5 0.1 180)');
  });

  it('omits alpha when undefined', () => {
    expect(toOklch({ l: 0.9, c: 0.3, h: 30 })).toBe('oklch(0.9 0.3 30)');
  });
});

describe('createSwatch', () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('sets role="img" and aria-label', () => {
    const cleanup = createSwatch(el, { l: 0.6, c: 0.15, h: 250 });
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Color: oklch(0.6 0.15 250)');
    cleanup();
  });

  it('includes alpha in aria-label when less than 1', () => {
    const cleanup = createSwatch(el, { l: 0.5, c: 0.1, h: 180, alpha: 0.8 });
    expect(el.getAttribute('aria-label')).toBe('Color: oklch(0.5 0.1 180 / 0.8)');
    cleanup();
  });

  it('includes tier in aria-label when provided', () => {
    const cleanup = createSwatch(el, { l: 0.6, c: 0.15, h: 250, tier: 'gold' });
    expect(el.getAttribute('aria-label')).toBe('Color: oklch(0.6 0.15 250), gamut: gold');
    cleanup();
  });

  it('sets data-gamut-tier when tier provided', () => {
    const cleanup = createSwatch(el, { l: 0.6, c: 0.15, h: 250, tier: 'silver' });
    expect(el.getAttribute('data-gamut-tier')).toBe('silver');
    cleanup();
  });

  it('does not set data-gamut-tier when tier omitted', () => {
    const cleanup = createSwatch(el, { l: 0.6, c: 0.15, h: 250 });
    expect(el.hasAttribute('data-gamut-tier')).toBe(false);
    cleanup();
  });

  it('sets data-selected when selected is true', () => {
    const cleanup = createSwatch(el, { l: 0.6, c: 0.15, h: 250, selected: true });
    expect(el.hasAttribute('data-selected')).toBe(true);
    cleanup();
  });

  it('does not set data-selected when selected is false or omitted', () => {
    const cleanup = createSwatch(el, { l: 0.6, c: 0.15, h: 250 });
    expect(el.hasAttribute('data-selected')).toBe(false);
    cleanup();
  });

  it('cleanup restores original attributes', () => {
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'original');

    const cleanup = createSwatch(el, { l: 0.6, c: 0.15, h: 250, tier: 'fail', selected: true });

    expect(el.getAttribute('role')).toBe('img');
    expect(el.hasAttribute('data-gamut-tier')).toBe(true);
    expect(el.hasAttribute('data-selected')).toBe(true);

    cleanup();

    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('aria-label')).toBe('original');
    expect(el.hasAttribute('data-gamut-tier')).toBe(false);
    expect(el.hasAttribute('data-selected')).toBe(false);
  });

  it('cleanup removes attributes that were not originally present', () => {
    const cleanup = createSwatch(el, { l: 0.5, c: 0.1, h: 100 });
    cleanup();

    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('aria-label')).toBe(false);
  });
});

describe('updateSwatch', () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('updates aria-label without needing cleanup/recreate', () => {
    const cleanup = createSwatch(el, { l: 0.6, c: 0.15, h: 250 });

    updateSwatch(el, { l: 0.7, c: 0.12, h: 260 });

    expect(el.getAttribute('aria-label')).toBe('Color: oklch(0.7 0.12 260)');

    cleanup();
  });

  it('adds and removes tier on update', () => {
    createSwatch(el, { l: 0.6, c: 0.15, h: 250 });

    updateSwatch(el, { l: 0.6, c: 0.15, h: 250, tier: 'gold' });
    expect(el.getAttribute('data-gamut-tier')).toBe('gold');

    updateSwatch(el, { l: 0.6, c: 0.15, h: 250 });
    expect(el.hasAttribute('data-gamut-tier')).toBe(false);
  });

  it('toggles selected state on update', () => {
    createSwatch(el, { l: 0.6, c: 0.15, h: 250 });

    updateSwatch(el, { l: 0.6, c: 0.15, h: 250, selected: true });
    expect(el.hasAttribute('data-selected')).toBe(true);

    updateSwatch(el, { l: 0.6, c: 0.15, h: 250, selected: false });
    expect(el.hasAttribute('data-selected')).toBe(false);
  });
});
