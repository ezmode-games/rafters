import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  ColorPickerStateControls,
  ColorPickerStateOptions,
} from '../../src/primitives/color-picker';
import { createColorPickerState } from '../../src/primitives/color-picker';
import type { OklchColor } from '../../src/primitives/types';

// ---------------------------------------------------------------------------
// DOM fixtures
// ---------------------------------------------------------------------------
let areaCanvas: HTMLCanvasElement;
let areaContainer: HTMLDivElement;
let hueCanvas: HTMLCanvasElement;
let hueContainer: HTMLDivElement;
let lInput: HTMLInputElement;
let cInput: HTMLInputElement;
let hInput: HTMLInputElement;
let preview: HTMLDivElement;
let areaThumb: HTMLDivElement;
let hueThumb: HTMLDivElement;

function createDom(): void {
  areaCanvas = document.createElement('canvas');
  areaContainer = document.createElement('div');
  hueCanvas = document.createElement('canvas');
  hueContainer = document.createElement('div');
  lInput = document.createElement('input');
  cInput = document.createElement('input');
  hInput = document.createElement('input');
  preview = document.createElement('div');
  areaThumb = document.createElement('div');
  hueThumb = document.createElement('div');

  // Stub canvas context with all methods used by color-area and hue-bar primitives
  const stubGradient = { addColorStop: vi.fn() };
  const stubCtx = {
    clearRect: vi.fn(),
    createLinearGradient: vi.fn(() => stubGradient),
    fillRect: vi.fn(),
    fillStyle: '',
    setTransform: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
  };
  vi.spyOn(areaCanvas, 'getContext').mockReturnValue(
    stubCtx as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(hueCanvas, 'getContext').mockReturnValue(stubCtx as unknown as CanvasRenderingContext2D);

  for (const el of [
    areaCanvas,
    areaContainer,
    hueCanvas,
    hueContainer,
    lInput,
    cInput,
    hInput,
    preview,
    areaThumb,
    hueThumb,
  ]) {
    document.body.appendChild(el);
  }
}

function removeDom(): void {
  for (const el of [
    areaCanvas,
    areaContainer,
    hueCanvas,
    hueContainer,
    lInput,
    cInput,
    hInput,
    preview,
    areaThumb,
    hueThumb,
  ]) {
    el.remove();
  }
}

const DEFAULT_COLOR: OklchColor = { l: 0.7, c: 0.15, h: 250 };

function setup(overrides: Partial<ColorPickerStateOptions> = {}): ColorPickerStateControls & {
  onColorChange: ReturnType<typeof vi.fn>;
  onColorCommit: ReturnType<typeof vi.fn>;
} {
  const onColorChange = vi.fn();
  const onColorCommit = vi.fn();
  const state = createColorPickerState({
    areaCanvas,
    areaContainer,
    hueCanvas,
    hueContainer,
    inputs: { l: lInput, c: cInput, h: hInput },
    preview,
    areaThumb,
    hueThumb,
    initialColor: DEFAULT_COLOR,
    onColorChange,
    onColorCommit,
    ...overrides,
  });
  return { ...state, onColorChange, onColorCommit };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

let state: ReturnType<typeof setup> | null = null;

beforeEach(() => {
  createDom();
});

afterEach(() => {
  state?.destroy();
  state = null;
  removeDom();
  vi.restoreAllMocks();
});

describe('createColorPickerState', () => {
  it('returns $color, setColor, and destroy', () => {
    state = setup();
    expect(state.$color).toBeDefined();
    expect(typeof state.$color.get).toBe('function');
    expect(typeof state.$color.subscribe).toBe('function');
    expect(typeof state.setColor).toBe('function');
    expect(typeof state.destroy).toBe('function');
  });

  it('initializes with the provided color', () => {
    state = setup({ initialColor: { l: 0.5, c: 0.1, h: 180 } });
    expect(state.$color.get()).toEqual({ l: 0.5, c: 0.1, h: 180 });
  });

  it('initializes with default color when none provided', () => {
    state = setup();
    expect(state.$color.get()).toEqual(DEFAULT_COLOR);
  });

  describe('setColor', () => {
    it('updates the reactive atom', () => {
      state = setup();
      state.setColor({ l: 0.3, c: 0.2, h: 120 });
      expect(state.$color.get()).toEqual({ l: 0.3, c: 0.2, h: 120 });
    });

    it('fires onColorChange', () => {
      state = setup();
      state.setColor({ l: 0.3, c: 0.2, h: 120 });
      expect(state.onColorChange).toHaveBeenCalledWith({ l: 0.3, c: 0.2, h: 120 });
    });
  });

  describe('$color.subscribe', () => {
    it('fires immediately with current value', () => {
      state = setup();
      const listener = vi.fn();
      const unsub = state.$color.subscribe(listener);
      // nanostores subscribe fires immediately with (value); listen only fires on change
      expect(listener.mock.calls[0][0]).toEqual(DEFAULT_COLOR);
      unsub();
    });

    it('fires on setColor', () => {
      state = setup();
      const listener = vi.fn();
      const unsub = state.$color.subscribe(listener);
      listener.mockClear();

      state.setColor({ l: 0.4, c: 0.1, h: 90 });
      // nanostores passes (value, oldValue) on change
      expect(listener.mock.calls[0][0]).toEqual({ l: 0.4, c: 0.1, h: 90 });
      unsub();
    });
  });

  describe('pointer commit', () => {
    // Note: mousedown on an interactive container triggers onMove (changing the color)
    // before our commit listener fires. We capture the atom value after mousedown
    // to get the expected commit value.

    it('fires onColorCommit on mouseup after area mousedown', () => {
      state = setup();

      areaContainer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      const expected = state.$color.get();
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(state.onColorCommit).toHaveBeenCalledTimes(1);
      expect(state.onColorCommit.mock.calls[0][0]).toEqual(expected);
    });

    it('fires onColorCommit on mouseup after hue mousedown', () => {
      state = setup();

      hueContainer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      const expected = state.$color.get();
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(state.onColorCommit).toHaveBeenCalledTimes(1);
      expect(state.onColorCommit.mock.calls[0][0]).toEqual(expected);
    });

    it('fires onColorCommit on touchend after area touchstart', () => {
      state = setup();

      areaContainer.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      const expected = state.$color.get();
      document.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));

      expect(state.onColorCommit).toHaveBeenCalledTimes(1);
      expect(state.onColorCommit.mock.calls[0][0]).toEqual(expected);
    });

    it('fires onColorCommit on touchend after hue touchstart', () => {
      state = setup();

      hueContainer.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      const expected = state.$color.get();
      document.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));

      expect(state.onColorCommit).toHaveBeenCalledTimes(1);
      expect(state.onColorCommit.mock.calls[0][0]).toEqual(expected);
    });

    it('does not fire onColorCommit without a preceding mousedown', () => {
      state = setup();

      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(state.onColorCommit).not.toHaveBeenCalled();
    });

    it('commits the latest color after setColor + mouseup', () => {
      state = setup();
      const newColor = { l: 0.5, c: 0.2, h: 300 };

      areaContainer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      state.setColor(newColor);
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(state.onColorCommit.mock.calls[0][0]).toEqual(newColor);
    });

    it('removes document listeners after commit', () => {
      state = setup();

      areaContainer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      state.onColorCommit.mockClear();

      // Second mouseup should not fire commit again
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      expect(state.onColorCommit).not.toHaveBeenCalled();
    });

    it('does not throw when onColorCommit is undefined', () => {
      state = setup({ onColorCommit: undefined });

      areaContainer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(() => {
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      }).not.toThrow();
    });
  });

  describe('destroy', () => {
    it('cleans up pointer commit listeners', () => {
      state = setup();
      state.destroy();

      areaContainer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(state.onColorCommit).not.toHaveBeenCalled();
    });

    it('cleans up pending document listeners on destroy', () => {
      state = setup();

      // Start a drag (attaches document listeners)
      areaContainer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      // Destroy before mouseup
      state.destroy();

      // mouseup after destroy should not fire commit
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      expect(state.onColorCommit).not.toHaveBeenCalled();
    });
  });
});
