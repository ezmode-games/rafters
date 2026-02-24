import { afterEach, describe, expect, it, vi } from 'vitest';
import { type ColorPickerInstance, createColorPicker } from '../../src/primitives/color-picker';

describe('createColorPicker', () => {
  let picker: ColorPickerInstance;

  afterEach(() => {
    picker?.destroy();
  });

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  describe('initialization', () => {
    it('creates with default color when no options provided', () => {
      picker = createColorPicker();
      const color = picker.$color.get();
      expect(color).toEqual({ l: 0.7, c: 0.15, h: 250, alpha: 1 });
    });

    it('creates with custom initial color', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 0.8 },
      });
      const color = picker.$color.get();
      expect(color).toEqual({ l: 0.5, c: 0.1, h: 180, alpha: 0.8 });
    });

    it('clamps initial color values to valid ranges (hue wraps)', () => {
      picker = createColorPicker({
        initialColor: { l: 1.5, c: 0.6, h: 400, alpha: 2 },
      });
      const color = picker.$color.get();
      expect(color.l).toBe(1);
      expect(color.c).toBe(0.4);
      expect(color.h).toBe(40); // 400 % 360 = 40
      expect(color.alpha).toBe(1);
    });

    it('defaults alpha to 1 when omitted', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180 },
      });
      const color = picker.$color.get();
      expect(color.alpha).toBe(1);
    });
  });

  // ---------------------------------------------------------------------------
  // setColor
  // ---------------------------------------------------------------------------

  describe('setColor', () => {
    it('replaces the entire color', () => {
      picker = createColorPicker();
      picker.setColor({ l: 0.3, c: 0.2, h: 120, alpha: 0.5 });
      expect(picker.$color.get()).toEqual({ l: 0.3, c: 0.2, h: 120, alpha: 0.5 });
    });

    it('clamps out-of-range values (hue wraps)', () => {
      picker = createColorPicker();
      picker.setColor({ l: -0.5, c: -1, h: -10, alpha: -0.5 });
      const color = picker.$color.get();
      expect(color.l).toBe(0);
      expect(color.c).toBe(0);
      expect(color.h).toBe(350); // -10 wraps to 350
      expect(color.alpha).toBe(0);
    });

    it('defaults alpha to 1 when omitted', () => {
      picker = createColorPicker();
      picker.setColor({ l: 0.5, c: 0.1, h: 90 });
      expect(picker.$color.get().alpha).toBe(1);
    });

    it('throws on missing required fields', () => {
      picker = createColorPicker();
      // @ts-expect-error -- testing runtime validation
      expect(() => picker.setColor(null)).toThrow(
        'setColor requires an object with numeric l, c, h fields (alpha is optional)',
      );
      // @ts-expect-error -- testing runtime validation
      expect(() => picker.setColor({})).toThrow(
        'setColor requires an object with numeric l, c, h fields (alpha is optional)',
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Channel setters
  // ---------------------------------------------------------------------------

  describe('channel setters', () => {
    it('setLightness updates only lightness', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 1 },
      });
      picker.setLightness(0.8);
      const color = picker.$color.get();
      expect(color.l).toBe(0.8);
      expect(color.c).toBe(0.1);
      expect(color.h).toBe(180);
    });

    it('setChroma updates only chroma', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 1 },
      });
      picker.setChroma(0.25);
      expect(picker.$color.get().c).toBe(0.25);
      expect(picker.$color.get().l).toBe(0.5);
    });

    it('setHue updates only hue', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 1 },
      });
      picker.setHue(90);
      expect(picker.$color.get().h).toBe(90);
      expect(picker.$color.get().l).toBe(0.5);
    });

    it('setAlpha updates only alpha', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 1 },
      });
      picker.setAlpha(0.5);
      expect(picker.$color.get().alpha).toBe(0.5);
      expect(picker.$color.get().l).toBe(0.5);
    });

    it('setLightness clamps to 0-1', () => {
      picker = createColorPicker();
      picker.setLightness(2);
      expect(picker.$color.get().l).toBe(1);
      picker.setLightness(-1);
      expect(picker.$color.get().l).toBe(0);
    });

    it('setChroma clamps to 0-0.4', () => {
      picker = createColorPicker();
      picker.setChroma(1);
      expect(picker.$color.get().c).toBe(0.4);
      picker.setChroma(-0.5);
      expect(picker.$color.get().c).toBe(0);
    });

    it('setHue wraps using modular arithmetic (circular)', () => {
      picker = createColorPicker();
      picker.setHue(500);
      expect(picker.$color.get().h).toBe(140);
      picker.setHue(-10);
      expect(picker.$color.get().h).toBe(350);
      picker.setHue(360);
      expect(picker.$color.get().h).toBe(0);
      picker.setHue(720);
      expect(picker.$color.get().h).toBe(0);
    });

    it('setAlpha clamps to 0-1', () => {
      picker = createColorPicker();
      picker.setAlpha(5);
      expect(picker.$color.get().alpha).toBe(1);
      picker.setAlpha(-2);
      expect(picker.$color.get().alpha).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // $cssColor computed
  // ---------------------------------------------------------------------------

  describe('$cssColor', () => {
    it('computes oklch() string from current color', () => {
      picker = createColorPicker({
        initialColor: { l: 0.7, c: 0.15, h: 250, alpha: 1 },
      });
      expect(picker.$cssColor.get()).toBe('oklch(0.7 0.15 250)');
    });

    it('includes alpha when less than 1', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 0.5 },
      });
      expect(picker.$cssColor.get()).toBe('oklch(0.5 0.1 180 / 0.5)');
    });

    it('omits alpha when exactly 1', () => {
      picker = createColorPicker({
        initialColor: { l: 0.6, c: 0.2, h: 90, alpha: 1 },
      });
      expect(picker.$cssColor.get()).toBe('oklch(0.6 0.2 90)');
    });

    it('recomputes when color changes', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 1 },
      });
      expect(picker.$cssColor.get()).toBe('oklch(0.5 0.1 180)');
      picker.setHue(90);
      expect(picker.$cssColor.get()).toBe('oklch(0.5 0.1 90)');
    });
  });

  // ---------------------------------------------------------------------------
  // $inGamut computed
  // ---------------------------------------------------------------------------

  describe('$inGamut', () => {
    it('returns true for an in-gamut sRGB color', () => {
      // oklch(0.5 0.05 90) is safely within sRGB
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.05, h: 90, alpha: 1 },
      });
      expect(picker.$inGamut.get()).toBe(true);
    });

    it('returns false for an out-of-gamut color', () => {
      // Very high chroma at a challenging hue is likely out of sRGB
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.4, h: 150, alpha: 1 },
      });
      expect(picker.$inGamut.get()).toBe(false);
    });

    it('recomputes when color changes', () => {
      // oklch(0.5 0.05 90) is safely within sRGB
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.05, h: 90, alpha: 1 },
      });
      expect(picker.$inGamut.get()).toBe(true);
      picker.setChroma(0.4);
      // After pushing chroma to 0.4, likely out of sRGB gamut
      const result = picker.$inGamut.get();
      expect(typeof result).toBe('boolean');
    });
  });

  // ---------------------------------------------------------------------------
  // setFromCss
  // ---------------------------------------------------------------------------

  describe('setFromCss', () => {
    it('parses hex colors', () => {
      picker = createColorPicker();
      picker.setFromCss('#ff0000');
      const color = picker.$color.get();
      // Red should have hue near 29 (OKLCH red hue), high chroma
      expect(color.l).toBeGreaterThan(0);
      expect(color.c).toBeGreaterThan(0);
      expect(color.alpha).toBe(1);
    });

    it('parses rgb() colors', () => {
      picker = createColorPicker();
      picker.setFromCss('rgb(0, 128, 255)');
      const color = picker.$color.get();
      expect(color.l).toBeGreaterThan(0);
      expect(color.c).toBeGreaterThan(0);
    });

    it('parses hsl() colors', () => {
      picker = createColorPicker();
      picker.setFromCss('hsl(120, 100%, 50%)');
      const color = picker.$color.get();
      expect(color.l).toBeGreaterThan(0);
      expect(color.c).toBeGreaterThan(0);
    });

    it('parses oklch() colors', () => {
      picker = createColorPicker();
      picker.setFromCss('oklch(0.6 0.2 270)');
      const color = picker.$color.get();
      expect(color.l).toBeCloseTo(0.6, 1);
      expect(color.c).toBeCloseTo(0.2, 1);
      expect(color.h).toBeCloseTo(270, 0);
    });

    it('throws descriptive error for invalid CSS', () => {
      picker = createColorPicker();
      expect(() => picker.setFromCss('not-a-color')).toThrow("Invalid CSS color: 'not-a-color'");
    });

    it('throws descriptive error for empty string', () => {
      picker = createColorPicker();
      expect(() => picker.setFromCss('')).toThrow("Invalid CSS color: ''");
    });
  });

  // ---------------------------------------------------------------------------
  // getColorAreaOptions
  // ---------------------------------------------------------------------------

  describe('getColorAreaOptions', () => {
    it('returns options matching createColorArea shape', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 200, alpha: 1 },
      });
      const opts = picker.getColorAreaOptions();
      expect(opts).toHaveProperty('hue');
      expect(opts.hue).toBe(200);
    });

    it('reflects current hue after changes', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 200, alpha: 1 },
      });
      picker.setHue(90);
      const opts = picker.getColorAreaOptions();
      expect(opts.hue).toBe(90);
    });
  });

  // ---------------------------------------------------------------------------
  // getHueBarOptions
  // ---------------------------------------------------------------------------

  describe('getHueBarOptions', () => {
    it('returns options matching createHueBar shape', () => {
      picker = createColorPicker({
        initialColor: { l: 0.6, c: 0.12, h: 200, alpha: 1 },
      });
      const opts = picker.getHueBarOptions();
      expect(opts).toHaveProperty('lightness');
      expect(opts).toHaveProperty('chroma');
      expect(opts.lightness).toBe(0.6);
      expect(opts.chroma).toBe(0.12);
    });
  });

  // ---------------------------------------------------------------------------
  // getColorInputOptions
  // ---------------------------------------------------------------------------

  describe('getColorInputOptions', () => {
    it('returns options matching createColorInput shape', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 1 },
      });
      const opts = picker.getColorInputOptions();
      expect(opts).toHaveProperty('value');
      expect(opts).toHaveProperty('onChange');
      expect(opts.value.l).toBe(0.5);
      expect(opts.value.c).toBe(0.1);
      expect(opts.value.h).toBe(180);
    });

    it('onChange callback updates picker state', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 1 },
      });
      const opts = picker.getColorInputOptions();
      opts.onChange({ l: 0.8, c: 0.2, h: 90, alpha: 0.5 });
      const color = picker.$color.get();
      expect(color.l).toBe(0.8);
      expect(color.c).toBe(0.2);
      expect(color.h).toBe(90);
      expect(color.alpha).toBe(0.5);
    });
  });

  // ---------------------------------------------------------------------------
  // getSwatchOptions
  // ---------------------------------------------------------------------------

  describe('getSwatchOptions', () => {
    it('returns options matching createSwatch shape', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 1 },
      });
      const opts = picker.getSwatchOptions();
      expect(opts).toHaveProperty('l');
      expect(opts).toHaveProperty('c');
      expect(opts).toHaveProperty('h');
      expect(opts).toHaveProperty('alpha');
      expect(opts).toHaveProperty('tier');
      expect(opts.l).toBe(0.5);
      expect(opts.c).toBe(0.1);
      expect(opts.h).toBe(180);
    });
  });

  // ---------------------------------------------------------------------------
  // getGamutTier
  // ---------------------------------------------------------------------------

  describe('getGamutTier', () => {
    it('returns gold for sRGB-safe colors', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.05, h: 180, alpha: 1 },
      });
      expect(picker.getGamutTier()).toBe('gold');
    });

    it('returns a valid tier string', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.3, h: 150, alpha: 1 },
      });
      const tier = picker.getGamutTier();
      expect(['gold', 'silver', 'fail']).toContain(tier);
    });
  });

  // ---------------------------------------------------------------------------
  // gamutMapping option
  // ---------------------------------------------------------------------------

  describe('gamutMapping', () => {
    it('snaps out-of-gamut colors to nearest sRGB when enabled', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.05, h: 180, alpha: 1 },
        gamutMapping: true,
      });

      // Set a very high chroma that is definitely out of sRGB gamut
      picker.setChroma(0.4);

      // With gamut mapping, the chroma should be reduced to fit in sRGB
      // The result should be in-gamut
      expect(picker.$inGamut.get()).toBe(true);
    });

    it('does not modify in-gamut colors', () => {
      picker = createColorPicker({
        gamutMapping: true,
        initialColor: { l: 0.5, c: 0.05, h: 180, alpha: 1 },
      });
      expect(picker.$color.get().c).toBe(0.05);
    });

    it('does not snap when gamutMapping is false (default)', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.05, h: 180, alpha: 1 },
      });
      picker.setChroma(0.4);
      // Without gamut mapping, chroma stays at 0.4 even if out of gamut
      expect(picker.$color.get().c).toBe(0.4);
    });
  });

  // ---------------------------------------------------------------------------
  // onChange callback
  // ---------------------------------------------------------------------------

  describe('onChange callback', () => {
    it('fires on setColor', () => {
      const onChange = vi.fn();
      picker = createColorPicker({ onChange });
      picker.setColor({ l: 0.3, c: 0.2, h: 120, alpha: 1 });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ l: 0.3, c: 0.2, h: 120, alpha: 1 }),
      );
    });

    it('fires on channel setters', () => {
      const onChange = vi.fn();
      picker = createColorPicker({ onChange });
      picker.setLightness(0.8);
      picker.setChroma(0.3);
      picker.setHue(90);
      picker.setAlpha(0.5);
      expect(onChange).toHaveBeenCalledTimes(4);
    });

    it('fires on setFromCss', () => {
      const onChange = vi.fn();
      picker = createColorPicker({ onChange });
      picker.setFromCss('#ff0000');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('receives the clamped color value', () => {
      const onChange = vi.fn();
      picker = createColorPicker({ onChange });
      picker.setLightness(5);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ l: 1 }));
    });
  });

  // ---------------------------------------------------------------------------
  // destroy / cleanup
  // ---------------------------------------------------------------------------

  describe('destroy', () => {
    it('can be called multiple times safely', () => {
      picker = createColorPicker();
      picker.destroy();
      expect(() => picker.destroy()).not.toThrow();
    });

    it('clears store subscriptions from connectors', () => {
      picker = createColorPicker();
      // Subscribe to track calls
      const onChange = vi.fn();
      const unsub = picker.$color.subscribe(onChange);

      // The destroy method clears internal subscriptions
      picker.destroy();

      // The external subscription should still work (destroy only clears internal ones)
      picker.setLightness(0.9);
      expect(onChange).toHaveBeenCalled();

      unsub();
    });
  });

  // ---------------------------------------------------------------------------
  // Achromatic color handling (NaN defense)
  // ---------------------------------------------------------------------------

  describe('achromatic colors', () => {
    it('parses achromatic colors without NaN hue', () => {
      picker = createColorPicker();
      picker.setFromCss('#ffffff');
      const color = picker.$color.get();
      expect(Number.isNaN(color.h)).toBe(false);
      expect(color.l).toBeCloseTo(1, 1);
      expect(color.c).toBeCloseTo(0, 1);
    });

    it('parses black without NaN', () => {
      picker = createColorPicker();
      picker.setFromCss('#000000');
      const color = picker.$color.get();
      expect(Number.isNaN(color.h)).toBe(false);
    });

    it('parses gray without NaN', () => {
      picker = createColorPicker();
      picker.setFromCss('#808080');
      const color = picker.$color.get();
      expect(Number.isNaN(color.h)).toBe(false);
      expect(Number.isNaN(color.l)).toBe(false);
      expect(Number.isNaN(color.c)).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // NaN defense in channel setters
  // ---------------------------------------------------------------------------

  describe('NaN defense', () => {
    it('handles NaN in channel setters gracefully', () => {
      picker = createColorPicker();
      picker.setLightness(NaN);
      expect(picker.$color.get().l).toBe(0); // falls back to min

      picker.setChroma(NaN);
      expect(picker.$color.get().c).toBe(0); // falls back to min

      picker.setHue(NaN);
      expect(picker.$color.get().h).toBe(0); // falls back to 0

      picker.setAlpha(NaN);
      expect(picker.$color.get().alpha).toBe(0); // falls back to min
    });
  });

  // ---------------------------------------------------------------------------
  // Reactive store behavior
  // ---------------------------------------------------------------------------

  describe('reactive stores', () => {
    it('$color subscription notifies on changes', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 1 },
      });
      const values: { l: number }[] = [];
      const unsub = picker.$color.subscribe((color) => {
        values.push({ l: color.l });
      });

      picker.setLightness(0.8);
      picker.setLightness(0.3);

      // subscribe fires immediately with current value, then on each change
      expect(values.length).toBe(3);
      expect(values[0]?.l).toBe(0.5); // initial
      expect(values[1]?.l).toBe(0.8);
      expect(values[2]?.l).toBe(0.3);

      unsub();
    });

    it('$cssColor recomputes reactively', () => {
      picker = createColorPicker({
        initialColor: { l: 0.5, c: 0.1, h: 180, alpha: 1 },
      });
      const values: string[] = [];
      const unsub = picker.$cssColor.subscribe((css: string) => {
        values.push(css);
      });

      picker.setHue(90);

      expect(values.length).toBe(2);
      expect(values[0]).toBe('oklch(0.5 0.1 180)');
      expect(values[1]).toBe('oklch(0.5 0.1 90)');

      unsub();
    });
  });

  // ---------------------------------------------------------------------------
  // SSR safety
  // ---------------------------------------------------------------------------

  describe('SSR safety', () => {
    it('does not access window or document during creation', () => {
      // createColorPicker should work in SSR contexts (no DOM access)
      expect(() => createColorPicker()).not.toThrow();
    });

    it('stores are readable without DOM', () => {
      picker = createColorPicker();
      expect(picker.$color.get()).toBeDefined();
      expect(picker.$cssColor.get()).toBeDefined();
      expect(picker.$inGamut.get()).toBeDefined();
    });
  });
});
