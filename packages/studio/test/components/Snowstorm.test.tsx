/**
 * Snowstorm Component Tests
 *
 * Tests for the first-run color selection canvas.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Snowstorm } from '../../src/components/first-run/Snowstorm';

/** Helper to get canvas element with null check */
function getCanvas(container: HTMLElement): HTMLCanvasElement {
  const canvas = container.querySelector('canvas');
  if (!canvas) throw new Error('Canvas not found');
  return canvas;
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
    it('shows Why input on canvas click', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 400, clientY: 300 });

      expect(screen.getByPlaceholderText('Why?')).toBeInTheDocument();
    });

    it('hides prompt text after click', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 400, clientY: 300 });

      expect(screen.queryByText('Choose Your Primary Color')).not.toBeInTheDocument();
    });

    it('changes card background to selected color', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 400, clientY: 300 });

      // Card should have a background color style
      const card = container.querySelector('[class*="shadow-lg"]');
      expect(card).toHaveStyle({ backgroundColor: expect.any(String) });
    });
  });

  describe('color confirmation', () => {
    it('shows Continue button when reason is entered', async () => {
      const user = userEvent.setup();
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 400, clientY: 300 });
      await user.type(screen.getByPlaceholderText('Why?'), 'brand color');

      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('does not show Continue button with empty reason', async () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 400, clientY: 300 });

      expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
    });

    it('calls onColorSelect when Continue is clicked', async () => {
      const onColorSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(<Snowstorm onColorSelect={onColorSelect} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 400, clientY: 300 });
      await user.type(screen.getByPlaceholderText('Why?'), 'brand color');
      await user.click(screen.getByRole('button', { name: 'Continue' }));

      expect(onColorSelect).toHaveBeenCalled();
      const [color, reason] = onColorSelect.mock.calls[0];
      expect(color.h).toBeCloseTo(180, 0);
      expect(reason).toBe('brand color');
    });

    it('calls onColorSelect on Enter key', async () => {
      const onColorSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(<Snowstorm onColorSelect={onColorSelect} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 400, clientY: 300 });
      await user.type(screen.getByPlaceholderText('Why?'), 'brand color{Enter}');

      expect(onColorSelect).toHaveBeenCalled();
    });
  });

  describe('re-picking color', () => {
    it('allows clicking canvas again to pick different color', async () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const canvas = getCanvas(container);

      // First click
      fireEvent.click(canvas, { clientX: 100, clientY: 100 });
      expect(screen.getByPlaceholderText('Why?')).toBeInTheDocument();

      // Second click picks new color
      fireEvent.click(canvas, { clientX: 700, clientY: 500 });
      expect(screen.getByPlaceholderText('Why?')).toBeInTheDocument();
    });
  });

  describe('position to color mapping', () => {
    it('maps top-left to light red', async () => {
      const onColorSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(<Snowstorm onColorSelect={onColorSelect} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 0, clientY: 0 });
      await user.type(screen.getByPlaceholderText('Why?'), 'test{Enter}');

      const [color] = onColorSelect.mock.calls[0];
      expect(color.h).toBeCloseTo(0, 0);
      expect(color.l).toBeCloseTo(0.9, 1);
    });

    it('maps center to mid cyan', async () => {
      const onColorSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(<Snowstorm onColorSelect={onColorSelect} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 400, clientY: 300 });
      await user.type(screen.getByPlaceholderText('Why?'), 'test{Enter}');

      const [color] = onColorSelect.mock.calls[0];
      expect(color.h).toBeCloseTo(180, 0);
      expect(color.l).toBeCloseTo(0.6, 1);
    });

    it('maps bottom-right to dark red', async () => {
      const onColorSelect = vi.fn();
      const user = userEvent.setup();
      const { container } = render(<Snowstorm onColorSelect={onColorSelect} />);
      const canvas = getCanvas(container);

      fireEvent.click(canvas, { clientX: 800, clientY: 600 });
      await user.type(screen.getByPlaceholderText('Why?'), 'test{Enter}');

      const [color] = onColorSelect.mock.calls[0];
      expect(color.h).toBeCloseTo(360, 0);
      expect(color.l).toBeCloseTo(0.3, 1);
    });
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
  });
});
