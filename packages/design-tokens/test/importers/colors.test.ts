import { describe, expect, it } from 'vitest';
import { classifyDeclarations } from '../../src/importers/classify.js';
import { colorsFromClassification } from '../../src/importers/colors.js';

describe('colorsFromClassification', () => {
  it('enriches color and semantic declarations with parsed OKLCH', () => {
    const classification = classifyDeclarations([
      { name: 'primary', value: 'oklch(0.5 0.2 30)' },
      { name: 'background', value: '#ffffff' },
      { name: 'brand-empire', value: 'oklch(0.4 0.2 240)' },
    ]);
    const colors = colorsFromClassification(classification);

    expect(colors).toHaveLength(3);

    // Order: color primitives first, then semantic.
    expect(colors[0]?.name).toBe('brand-empire');
    expect(colors[0]?.namespace).toBe('color');
    expect(colors[0]?.oklch.l).toBeCloseTo(0.4, 3);
    expect(colors[0]?.oklch.c).toBeCloseTo(0.2, 3);
    expect(colors[0]?.oklch.h).toBeCloseTo(240, 0);

    expect(colors[1]?.name).toBe('primary');
    expect(colors[1]?.namespace).toBe('semantic');
    expect(colors[1]?.oklch.l).toBeCloseTo(0.5, 3);

    expect(colors[2]?.name).toBe('background');
    expect(colors[2]?.namespace).toBe('semantic');
    // White: lightness 1, no chroma, hue is NaN -> normalized to 0
    expect(colors[2]?.oklch.l).toBeCloseTo(1, 3);
    expect(colors[2]?.oklch.c).toBeCloseTo(0, 3);
  });

  it('parses hex, hsl, oklch, and named colors uniformly', () => {
    const classification = classifyDeclarations([
      { name: 'primary', value: 'oklch(0.5 0.2 30)' },
      { name: 'background', value: 'hsl(0 0% 100%)' },
      { name: 'destructive', value: '#ff0000' },
      { name: 'accent', value: 'red' },
    ]);
    const colors = colorsFromClassification(classification);

    expect(colors).toHaveLength(4);
    // Each input format produced a non-null OKLCH with the expected lightness
    // band. `toBeCloseTo` handles tiny floating-point drift across formats
    // (hsl(0 0% 100%) round-trips to OKLCH lightness 1.0000000000000002).
    expect(colors[0]?.oklch.l).toBeCloseTo(0.5, 3); // oklch literal
    expect(colors[1]?.oklch.l).toBeCloseTo(1, 3); // hsl white
    expect(colors[2]?.oklch.l).toBeCloseTo(0.628, 2); // hex red
    expect(colors[3]?.oklch.l).toBeCloseTo(0.628, 2); // named red
  });

  it('preserves the original source value alongside the OKLCH', () => {
    const classification = classifyDeclarations([{ name: 'primary', value: 'hsl(20 50% 50%)' }]);
    const colors = colorsFromClassification(classification);

    expect(colors).toHaveLength(1);
    expect(colors[0]?.value).toBe('hsl(20 50% 50%)');
    expect(colors[0]?.oklch).toBeDefined();
  });

  it('returns empty when there are no color or semantic declarations', () => {
    const classification = classifyDeclarations([
      { name: 'radius', value: '0.5rem' },
      { name: 'font-sans', value: '"Inter", sans-serif' },
    ]);
    expect(colorsFromClassification(classification)).toEqual([]);
  });

  it('returns empty for empty classification', () => {
    const classification = classifyDeclarations([]);
    expect(colorsFromClassification(classification)).toEqual([]);
  });
});
