/**
 * SemanticChoice Component Tests
 *
 * Tests for the single semantic color choice component.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SemanticChoice } from '../../src/components/first-run/SemanticChoice';

// Mock oklchToHex for predictable color values
vi.mock('@rafters/color-utils', () => ({
  oklchToHex: vi.fn(
    (color) =>
      `#${Math.round(color.h).toString(16).padStart(2, '0')}${Math.round(color.l * 255)
        .toString(16)
        .padStart(2, '0')}${Math.round(color.c * 255)
        .toString(16)
        .padStart(2, '0')}`,
  ),
}));

describe('SemanticChoice', () => {
  const mockOptions = [
    { l: 0.6, c: 0.15, h: 180, alpha: 1 },
    { l: 0.7, c: 0.12, h: 180, alpha: 1 },
    { l: 0.5, c: 0.18, h: 180, alpha: 1 },
  ];

  const defaultProps = {
    name: 'secondary',
    label: 'Secondary',
    options: mockOptions,
    onSelect: vi.fn(),
    onCustom: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders label', () => {
      render(<SemanticChoice {...defaultProps} />);
      expect(screen.getByText('Secondary')).toBeInTheDocument();
    });

    it('renders semantic name', () => {
      render(<SemanticChoice {...defaultProps} />);
      expect(screen.getByText('secondary')).toBeInTheDocument();
    });

    it('renders three color swatches', () => {
      render(<SemanticChoice {...defaultProps} />);
      const buttons = screen.getAllByRole('button', { name: /Secondary option/i });
      expect(buttons).toHaveLength(3);
    });

    it('renders custom color button', () => {
      render(<SemanticChoice {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Custom Color' })).toBeInTheDocument();
    });

    it('swatches have correct aria-labels', () => {
      render(<SemanticChoice {...defaultProps} />);
      expect(screen.getByRole('button', { name: /Secondary option 1:/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Secondary option 2:/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Secondary option 3:/i })).toBeInTheDocument();
    });
  });

  describe('swatch interaction', () => {
    it('shows WhyGate when swatch is clicked', async () => {
      const user = userEvent.setup();
      render(<SemanticChoice {...defaultProps} />);

      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);

      expect(screen.getByText(/Why this secondary\?/i)).toBeInTheDocument();
    });

    it('shows selected color in WhyGate', async () => {
      const user = userEvent.setup();
      render(<SemanticChoice {...defaultProps} />);

      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);

      // Should show the selected color preview
      expect(screen.getByRole('img', { name: /Selected Secondary:/i })).toBeInTheDocument();
    });

    it('shows OKLCH values in WhyGate', async () => {
      const user = userEvent.setup();
      render(<SemanticChoice {...defaultProps} />);

      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);

      // Check for oklch display
      expect(screen.getByText(/oklch\(0\.60 0\.15 180\)/)).toBeInTheDocument();
    });
  });

  describe('WhyGate integration', () => {
    it('calls onSelect with color and reason on WhyGate submit', async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();
      render(<SemanticChoice {...defaultProps} onSelect={onSelect} />);

      // Click first swatch
      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);

      // Type reason in WhyGate
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'this color works well');

      // Submit
      await user.click(screen.getByRole('button', { name: 'Confirm Choice' }));

      expect(onSelect).toHaveBeenCalledWith(mockOptions[0], 'this color works well');
    });

    it('returns to swatches on WhyGate cancel', async () => {
      const user = userEvent.setup();
      render(<SemanticChoice {...defaultProps} onCancel={vi.fn()} />);

      // Click swatch to open WhyGate
      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);

      // Cancel
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      // Should be back to swatch view
      expect(screen.getByText('Secondary')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /Secondary option/i })).toHaveLength(3);
    });

    it('uses provided placeholders in WhyGate', async () => {
      const user = userEvent.setup();
      const placeholders = ['custom placeholder 1', 'custom placeholder 2'];
      render(<SemanticChoice {...defaultProps} placeholders={placeholders} />);

      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);

      expect(screen.getByText('custom placeholder 1')).toBeInTheDocument();
    });

    it('uses default placeholders when none provided', async () => {
      const user = userEvent.setup();
      render(<SemanticChoice {...defaultProps} />);

      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);

      // Should show one of the default placeholders
      expect(screen.getByText('maintains visual hierarchy')).toBeInTheDocument();
    });
  });

  describe('custom color', () => {
    it('calls onCustom with event when custom button clicked', async () => {
      const onCustom = vi.fn();
      const user = userEvent.setup();
      render(<SemanticChoice {...defaultProps} onCustom={onCustom} />);

      await user.click(screen.getByRole('button', { name: 'Custom Color' }));

      expect(onCustom).toHaveBeenCalled();
      expect(onCustom.mock.calls[0][0]).toHaveProperty('clientX');
      expect(onCustom.mock.calls[0][0]).toHaveProperty('clientY');
    });
  });

  describe('keyboard navigation', () => {
    it('swatches are focusable', () => {
      render(<SemanticChoice {...defaultProps} />);
      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });

      for (const swatch of swatches) {
        expect(swatch).not.toHaveAttribute('tabindex', '-1');
      }
    });

    it('swatch responds to Enter key', async () => {
      const user = userEvent.setup();
      render(<SemanticChoice {...defaultProps} />);

      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      swatches[0].focus();
      await user.keyboard('{Enter}');

      expect(screen.getByText(/Why this secondary\?/i)).toBeInTheDocument();
    });

    it('swatch responds to Space key', async () => {
      const user = userEvent.setup();
      render(<SemanticChoice {...defaultProps} />);

      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      swatches[0].focus();
      await user.keyboard(' ');

      expect(screen.getByText(/Why this secondary\?/i)).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles single option', () => {
      const singleOption = [mockOptions[0]];
      render(<SemanticChoice {...defaultProps} options={singleOption} />);
      expect(screen.getAllByRole('button', { name: /Secondary option/i })).toHaveLength(1);
    });

    it('handles different semantic names', () => {
      render(<SemanticChoice {...defaultProps} name="danger" label="Danger" />);
      expect(screen.getByText('Danger')).toBeInTheDocument();
      expect(screen.getByText('danger')).toBeInTheDocument();
    });

    it('handles colors with extreme values', () => {
      const extremeOptions = [
        { l: 0, c: 0, h: 0, alpha: 1 },
        { l: 1, c: 0.5, h: 360, alpha: 1 },
        { l: 0.5, c: 0.25, h: 180, alpha: 0.5 },
      ];
      render(<SemanticChoice {...defaultProps} options={extremeOptions} />);
      expect(screen.getAllByRole('button', { name: /Secondary option/i })).toHaveLength(3);
    });
  });
});
