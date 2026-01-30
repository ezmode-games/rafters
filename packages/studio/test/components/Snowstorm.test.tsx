/**
 * Snowstorm Component Tests
 *
 * Exhaustive tests for the first-run color selection canvas.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Snowstorm } from '../../src/components/first-run/Snowstorm';

// Mock ColorPicker to simplify testing
vi.mock('../../src/components/first-run/ColorPicker', () => ({
  ColorPicker: vi.fn(({ color, anchorPosition, onConfirm, onCancel }) => (
    <div data-testid="color-picker">
      <span data-testid="picker-color">{JSON.stringify(color)}</span>
      <span data-testid="picker-position">{JSON.stringify(anchorPosition)}</span>
      <button type="button" onClick={() => onConfirm(color, 'test reason')}>
        Confirm
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  )),
}));

/** Helper to get canvas element with null check */
function getCanvas(container: HTMLElement): HTMLCanvasElement {
  const canvas = container.querySelector('canvas');
  if (!canvas) throw new Error('Canvas not found');
  return canvas;
}

/** Helper to parse JSON from element text content */
function parseTextContent<T>(element: HTMLElement): T {
  const text = element.textContent;
  if (!text) throw new Error('Text content is null');
  return JSON.parse(text) as T;
}

describe('Snowstorm', () => {
  const defaultProps = {
    onColorSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders canvas element', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('renders invitation card', () => {
      render(<Snowstorm {...defaultProps} />);
      expect(screen.getByText('Choose Your Primary Color')).toBeInTheDocument();
    });

    it('renders click instruction', () => {
      render(<Snowstorm {...defaultProps} />);
      expect(screen.getByText('Click anywhere on the canvas')).toBeInTheDocument();
    });

    it('canvas has crosshair cursor', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toHaveClass('cursor-crosshair');
    });

    it('uses full screen container', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const main = container.querySelector('main');
      expect(main).toHaveClass('h-screen');
    });
  });

  describe('color picking', () => {
    it('shows ColorPicker on canvas click', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 400, clientY: 300 });

      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    it('calculates color from position', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      // Click at center-ish position
      fireEvent.click(canvas, { clientX: 400, clientY: 300 });

      const color = parseTextContent<{ h: number; l: number; s: number }>(
        screen.getByTestId('picker-color'),
      );

      // x=400 on 800 width = 180 hue (half of 360)
      expect(color.h).toBeCloseTo(180, 0);

      // y=300 on 600 height = 0.6 lightness (0.9 - 0.5*0.6 = 0.6)
      expect(color.l).toBeCloseTo(0.6, 1);

      // Fixed chroma
      expect(color.s).toBe(0.15);
    });

    it('passes click position to ColorPicker', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 400, clientY: 300 });

      const position = parseTextContent<{ x: number; y: number }>(
        screen.getByTestId('picker-position'),
      );

      expect(position.x).toBe(400);
      expect(position.y).toBe(300);
    });

    it('does not open second picker if one is open', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      // First click
      fireEvent.click(canvas, { clientX: 400, clientY: 300 });
      const firstColor = screen.getByTestId('picker-color').textContent;

      // Second click should be ignored
      fireEvent.click(canvas, { clientX: 100, clientY: 100 });

      // Color should still be from first click
      expect(screen.getByTestId('picker-color').textContent).toBe(firstColor);
    });
  });

  describe('color confirmation', () => {
    it('calls onColorSelect when ColorPicker confirms', async () => {
      const onColorSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(<Snowstorm onColorSelect={onColorSelect} />);

      const canvas = getCanvas(container);
      fireEvent.click(canvas, { clientX: 400, clientY: 300 });

      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onColorSelect).toHaveBeenCalled();
      const [color, reason] = onColorSelect.mock.calls[0];
      expect(color.h).toBeCloseTo(180, 0);
      expect(reason).toBe('test reason');
    });

    it('hides ColorPicker after confirmation', async () => {
      const user = userEvent.setup();
      const { container } = render(<Snowstorm {...defaultProps} />);

      const canvas = getCanvas(container);
      fireEvent.click(canvas, { clientX: 400, clientY: 300 });
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      await waitFor(() => {
        expect(screen.queryByTestId('color-picker')).not.toBeInTheDocument();
      });
    });
  });

  describe('color cancellation', () => {
    it('hides ColorPicker when cancelled', async () => {
      const user = userEvent.setup();
      const { container } = render(<Snowstorm {...defaultProps} />);

      const canvas = getCanvas(container);
      fireEvent.click(canvas, { clientX: 400, clientY: 300 });
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      await waitFor(() => {
        expect(screen.queryByTestId('color-picker')).not.toBeInTheDocument();
      });
    });

    it('does not call onColorSelect when cancelled', async () => {
      const onColorSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(<Snowstorm onColorSelect={onColorSelect} />);

      const canvas = getCanvas(container);
      fireEvent.click(canvas, { clientX: 400, clientY: 300 });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onColorSelect).not.toHaveBeenCalled();
    });

    it('allows new color pick after cancellation', async () => {
      const user = userEvent.setup();
      const { container } = render(<Snowstorm {...defaultProps} />);

      const canvas = getCanvas(container);

      // First pick
      fireEvent.click(canvas, { clientX: 400, clientY: 300 });
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      // Should be able to pick again
      fireEvent.click(canvas, { clientX: 100, clientY: 100 });
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });
  });

  describe('position to color mapping', () => {
    const testCases = [
      // { click: [x, y], expected: { h, l } }
      { click: [0, 0], expected: { h: 0, l: 0.9 } }, // Top-left: red, light
      { click: [800, 0], expected: { h: 360, l: 0.9 } }, // Top-right: red, light
      { click: [400, 0], expected: { h: 180, l: 0.9 } }, // Top-center: cyan, light
      { click: [0, 600], expected: { h: 0, l: 0.3 } }, // Bottom-left: red, dark
      { click: [800, 600], expected: { h: 360, l: 0.3 } }, // Bottom-right: red, dark
      { click: [400, 600], expected: { h: 180, l: 0.3 } }, // Bottom-center: cyan, dark
      { click: [200, 300], expected: { h: 90, l: 0.6 } }, // Quarter: green-ish, mid
    ];

    for (const { click, expected } of testCases) {
      it(`maps position (${click[0]}, ${click[1]}) to hue=${expected.h}, lightness=${expected.l}`, () => {
        const { container } = render(<Snowstorm {...defaultProps} />);
        const canvas = getCanvas(container);

        fireEvent.click(canvas, { clientX: click[0], clientY: click[1] });

        const color = parseTextContent<{ h: number; l: number }>(
          screen.getByTestId('picker-color'),
        );

        expect(color.h).toBeCloseTo(expected.h, 0);
        expect(color.l).toBeCloseTo(expected.l, 1);
      });
    }
  });

  describe('GSAP integration', () => {
    it('initializes GSAP ticker on mount', async () => {
      const gsap = await import('gsap');
      render(<Snowstorm {...defaultProps} />);

      expect(gsap.default.ticker.add).toHaveBeenCalled();
    });

    it('cleans up GSAP ticker on unmount', async () => {
      const gsap = await import('gsap');
      const { unmount } = render(<Snowstorm {...defaultProps} />);

      unmount();

      expect(gsap.default.ticker.remove).toHaveBeenCalled();
    });

    it('sets up bouncing animation timeline', async () => {
      const gsap = await import('gsap');
      render(<Snowstorm {...defaultProps} />);

      expect(gsap.default.timeline).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('handles click at exact canvas boundary', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      // Click at exact edge
      fireEvent.click(canvas, { clientX: 800, clientY: 600 });

      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    it('handles rapid successive clicks while picker is closed', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      // Rapid clicks - only first should register since picker opens
      fireEvent.click(canvas, { clientX: 100, clientY: 100 });
      fireEvent.click(canvas, { clientX: 200, clientY: 200 });
      fireEvent.click(canvas, { clientX: 300, clientY: 300 });

      // Only one picker
      expect(screen.getAllByTestId('color-picker')).toHaveLength(1);

      // First click position
      const position = parseTextContent<{ x: number }>(screen.getByTestId('picker-position'));
      expect(position.x).toBe(100);
    });
  });
});
