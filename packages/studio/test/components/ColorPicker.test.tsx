/**
 * ColorPicker Component Tests
 *
 * Exhaustive tests for the color picker with WhyGate integration.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ColorPicker, type ColorPickerColor } from '../../src/components/first-run/ColorPicker';

// Mock @rafters/color-utils
vi.mock('@rafters/color-utils', () => ({
  generateColorName: vi.fn((oklch) => `color-${oklch.h.toFixed(0)}`),
  oklchToHex: vi.fn(
    (oklch) =>
      `#${Math.round(oklch.l * 255)
        .toString(16)
        .padStart(2, '0')}0000`,
  ),
}));

describe('ColorPicker', () => {
  const defaultColor: ColorPickerColor = { h: 180, s: 0.15, l: 0.6 };
  const defaultPosition = { x: 400, y: 300 };
  const defaultProps = {
    color: defaultColor,
    anchorPosition: defaultPosition,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
  });

  describe('rendering', () => {
    it('renders WhyGate with color picker title', () => {
      render(<ColorPicker {...defaultProps} />);
      expect(screen.getByText('why this color?')).toBeInTheDocument();
    });

    it('renders color swatch with role img', () => {
      render(<ColorPicker {...defaultProps} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders hex color value', () => {
      render(<ColorPicker {...defaultProps} />);
      // The mock returns a hex based on lightness
      expect(screen.getByText(/#[0-9a-f]{6}/i)).toBeInTheDocument();
    });

    it('renders generated color name', () => {
      render(<ColorPicker {...defaultProps} />);
      // The mock returns color-{hue}
      expect(screen.getByText('color-180')).toBeInTheDocument();
    });

    it('renders Use This Color button', () => {
      render(<ColorPicker {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Use This Color' })).toBeInTheDocument();
    });

    it('renders Cancel button', () => {
      render(<ColorPicker {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });

  describe('color conversion', () => {
    it('converts Snowstorm HSL format to OKLCH', async () => {
      const { generateColorName } = await import('@rafters/color-utils');

      render(<ColorPicker {...defaultProps} />);

      // Verify the OKLCH format was passed (s is chroma, not saturation)
      expect(generateColorName).toHaveBeenCalledWith({
        l: 0.6,
        c: 0.15, // s becomes c
        h: 180,
        alpha: 1,
      });
    });

    it('handles different color values', () => {
      const redColor: ColorPickerColor = { h: 0, s: 0.2, l: 0.5 };
      render(<ColorPicker {...defaultProps} color={redColor} />);
      expect(screen.getByText('color-0')).toBeInTheDocument();
    });

    it('handles zero chroma (grayscale)', () => {
      const grayColor: ColorPickerColor = { h: 0, s: 0, l: 0.5 };
      render(<ColorPicker {...defaultProps} color={grayColor} />);
      // Should render without error
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('positioning', () => {
    it('positions picker to the right of click by default', () => {
      const { container } = render(<ColorPicker {...defaultProps} />);
      const picker = container.firstChild as HTMLElement;

      // Position should be anchorX + 20, anchorY - 20
      expect(picker.style.left).toBe('420px');
      expect(picker.style.top).toBe('280px');
    });

    it('flips to left when too close to right edge', () => {
      // Position click near right edge
      const nearRightPosition = { x: 900, y: 300 };
      const { container } = render(
        <ColorPicker {...defaultProps} anchorPosition={nearRightPosition} />,
      );
      const picker = container.firstChild as HTMLElement;

      // Should flip to left of click point
      // 900 - 288 (picker width) - 20 = 592
      expect(picker.style.left).toBe('592px');
    });

    it('adjusts when too close to bottom', () => {
      // Position click near bottom
      const nearBottomPosition = { x: 400, y: 700 };
      const { container } = render(
        <ColorPicker {...defaultProps} anchorPosition={nearBottomPosition} />,
      );
      const picker = container.firstChild as HTMLElement;

      // Should be constrained to screen height - picker height - padding
      // 768 - 280 - 16 = 472
      expect(picker.style.top).toBe('472px');
    });

    it('adjusts when too close to top', () => {
      // Position click near top (would result in negative y)
      const nearTopPosition = { x: 400, y: 10 };
      const { container } = render(
        <ColorPicker {...defaultProps} anchorPosition={nearTopPosition} />,
      );
      const picker = container.firstChild as HTMLElement;

      // Should be at minimum padding
      expect(picker.style.top).toBe('16px');
    });

    it('handles corner case (near top-right)', () => {
      const cornerPosition = { x: 950, y: 10 };
      const { container } = render(
        <ColorPicker {...defaultProps} anchorPosition={cornerPosition} />,
      );
      const picker = container.firstChild as HTMLElement;

      // Both x and y should be adjusted
      expect(picker.style.left).toBe('642px'); // 950 - 288 - 20
      expect(picker.style.top).toBe('16px'); // minimum padding
    });
  });

  describe('confirmation', () => {
    it('calls onConfirm with color and reason', async () => {
      const onConfirm = vi.fn();
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} onConfirm={onConfirm} />);

      await user.type(screen.getByRole('textbox'), 'brand color');
      await user.click(screen.getByRole('button', { name: 'Use This Color' }));

      await waitFor(() => {
        expect(onConfirm).toHaveBeenCalledWith(defaultColor, 'brand color');
      });
    });

    it('trims reason before confirming', async () => {
      const onConfirm = vi.fn();
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} onConfirm={onConfirm} />);

      await user.type(screen.getByRole('textbox'), '  spaced reason  ');
      await user.click(screen.getByRole('button', { name: 'Use This Color' }));

      await waitFor(() => {
        expect(onConfirm).toHaveBeenCalledWith(defaultColor, 'spaced reason');
      });
    });

    it('cannot confirm without minimum characters', async () => {
      const onConfirm = vi.fn();
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} onConfirm={onConfirm} />);

      await user.type(screen.getByRole('textbox'), 'ab');
      // Button should be disabled
      expect(screen.getByRole('button', { name: 'Use This Color' })).toBeDisabled();
    });
  });

  describe('cancellation', () => {
    it('calls onCancel on cancel button click', async () => {
      const onCancel = vi.fn();
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      await waitFor(() => {
        expect(onCancel).toHaveBeenCalled();
      });
    });

    it('calls onCancel on Escape key', async () => {
      const onCancel = vi.fn();
      const user = userEvent.setup();
      render(<ColorPicker {...defaultProps} onCancel={onCancel} />);

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(onCancel).toHaveBeenCalled();
      });
    });
  });

  describe('placeholder examples', () => {
    it('shows contextual placeholder text', () => {
      render(<ColorPicker {...defaultProps} />);

      // Should show one of the WHY_PLACEHOLDERS
      const expectedPlaceholders = [
        'brand guidelines require this blue',
        'matches our logo perfectly',
        'calming for healthcare users',
        'energetic startup vibe',
        'accessible on all backgrounds',
        'complements existing palette',
      ];

      const foundPlaceholder = expectedPlaceholders.some((placeholder) =>
        screen.queryByText(placeholder),
      );

      expect(foundPlaceholder).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('swatch has aria-label with color name', () => {
      render(<ColorPicker {...defaultProps} />);
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Selected color: color-180');
    });

    it('textarea is labeled', () => {
      render(<ColorPicker {...defaultProps} />);
      expect(screen.getByRole('textbox', { name: 'why this color?' })).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles maximum hue value', () => {
      const maxHueColor: ColorPickerColor = { h: 359.9, s: 0.15, l: 0.6 };
      render(<ColorPicker {...defaultProps} color={maxHueColor} />);
      expect(screen.getByText('color-360')).toBeInTheDocument();
    });

    it('handles minimum lightness', () => {
      const darkColor: ColorPickerColor = { h: 180, s: 0.15, l: 0.1 };
      render(<ColorPicker {...defaultProps} color={darkColor} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('handles maximum lightness', () => {
      const lightColor: ColorPickerColor = { h: 180, s: 0.15, l: 0.99 };
      render(<ColorPicker {...defaultProps} color={lightColor} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('handles high chroma', () => {
      const saturatedColor: ColorPickerColor = { h: 180, s: 0.4, l: 0.6 };
      render(<ColorPicker {...defaultProps} color={saturatedColor} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('handles zero position', () => {
      const zeroPosition = { x: 0, y: 0 };
      const { container } = render(<ColorPicker {...defaultProps} anchorPosition={zeroPosition} />);
      const picker = container.firstChild as HTMLElement;

      // Should position at 0 + 20 for x, constrained to minimum padding for y
      expect(picker.style.left).toBe('20px');
      expect(picker.style.top).toBe('16px');
    });
  });
});
