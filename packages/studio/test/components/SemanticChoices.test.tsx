/**
 * SemanticChoices Component Tests
 *
 * Tests for the semantic color selection orchestrator.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SemanticChoices } from '../../src/components/first-run/SemanticChoices';

// Mock color-utils
vi.mock('@rafters/color-utils', () => ({
  oklchToHex: vi.fn(
    (color) =>
      `#${Math.round(color.h).toString(16).padStart(2, '0')}${Math.round(color.l * 255)
        .toString(16)
        .padStart(2, '0')}${Math.round(color.c * 255)
        .toString(16)
        .padStart(2, '0')}`,
  ),
  generateRaftersHarmony: vi.fn(() => ({
    secondary: { l: 0.6, c: 0.15, h: 200, alpha: 1 },
    tertiary: { l: 0.55, c: 0.12, h: 220, alpha: 1 },
    accent: { l: 0.65, c: 0.2, h: 30, alpha: 1 },
    highlight: { l: 0.7, c: 0.1, h: 180, alpha: 1 },
    surface: { l: 0.95, c: 0.02, h: 180, alpha: 1 },
    neutral: { l: 0.5, c: 0.01, h: 180, alpha: 1 },
  })),
  generateSemanticColorSuggestions: vi.fn(() => ({
    danger: [
      { l: 0.55, c: 0.2, h: 25, alpha: 1 },
      { l: 0.6, c: 0.18, h: 25, alpha: 1 },
      { l: 0.5, c: 0.22, h: 25, alpha: 1 },
    ],
    success: [
      { l: 0.55, c: 0.15, h: 145, alpha: 1 },
      { l: 0.6, c: 0.13, h: 145, alpha: 1 },
      { l: 0.5, c: 0.17, h: 145, alpha: 1 },
    ],
    warning: [
      { l: 0.7, c: 0.18, h: 85, alpha: 1 },
      { l: 0.75, c: 0.16, h: 85, alpha: 1 },
      { l: 0.65, c: 0.2, h: 85, alpha: 1 },
    ],
    info: [
      { l: 0.6, c: 0.12, h: 240, alpha: 1 },
      { l: 0.65, c: 0.1, h: 240, alpha: 1 },
      { l: 0.55, c: 0.14, h: 240, alpha: 1 },
    ],
  })),
}));

// Mock ColorPicker
vi.mock('../../src/components/first-run/ColorPicker', () => ({
  ColorPicker: vi.fn(({ onConfirm, onCancel }) => (
    <div data-testid="color-picker">
      <button type="button" onClick={() => onConfirm({ h: 200, s: 0.15, l: 0.6 }, 'custom reason')}>
        Confirm Custom
      </button>
      <button type="button" onClick={onCancel}>
        Cancel Custom
      </button>
    </div>
  )),
}));

describe('SemanticChoices', () => {
  const primaryColor = { l: 0.5, c: 0.2, h: 180, alpha: 1 };
  const defaultProps = {
    primaryColor,
    onComplete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders title', () => {
      render(<SemanticChoices {...defaultProps} />);
      expect(screen.getByText('Choose Your Semantic Colors')).toBeInTheDocument();
    });

    it('renders progress indicator', () => {
      render(<SemanticChoices {...defaultProps} />);
      expect(screen.getByText(/0 of 10 complete/)).toBeInTheDocument();
    });

    it('renders primary color reference', () => {
      render(<SemanticChoices {...defaultProps} />);
      expect(screen.getByText('Your primary color')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /Primary color:/i })).toBeInTheDocument();
    });

    it('renders navigation tabs for all semantics', () => {
      render(<SemanticChoices {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Secondary' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Tertiary' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Accent' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Highlight' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Surface' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Neutral' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Danger' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Success' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Warning' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Info' })).toBeInTheDocument();
    });

    it('shows first semantic (Secondary) by default', () => {
      render(<SemanticChoices {...defaultProps} />);
      // SemanticChoice card shows the current semantic
      expect(screen.getByText('secondary')).toBeInTheDocument();
    });

    it('does not render complete button initially', () => {
      render(<SemanticChoices {...defaultProps} />);
      expect(screen.queryByRole('button', { name: 'Complete First Run' })).not.toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('switches to clicked semantic', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'Danger' }));

      expect(screen.getByText('danger')).toBeInTheDocument();
    });

    it('highlights current navigation tab', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      const dangerTab = screen.getByRole('button', { name: 'Danger' });
      await user.click(dangerTab);

      // Current tab should have primary background styling
      expect(dangerTab).toHaveClass('bg-primary');
    });
  });

  describe('color selection flow', () => {
    it('auto-advances after selecting a color', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      // Click first swatch
      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);

      // Enter reason in WhyGate
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'good choice');
      await user.click(screen.getByRole('button', { name: 'Confirm Choice' }));

      // Should advance to Tertiary
      expect(screen.getByText('tertiary')).toBeInTheDocument();
    });

    it('updates progress after selection', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      // Make a selection
      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'good choice');
      await user.click(screen.getByRole('button', { name: 'Confirm Choice' }));

      expect(screen.getByText(/1 of 10 complete/)).toBeInTheDocument();
    });

    it('marks completed semantic with checkmark in nav', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      // Make a selection
      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'good choice');
      await user.click(screen.getByRole('button', { name: 'Confirm Choice' }));

      // Secondary tab should have checkmark
      expect(screen.getByRole('button', { name: /Secondary.*\u2713/ })).toBeInTheDocument();
    });

    it('shows completed choices summary', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      // Make a selection
      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'good choice');
      await user.click(screen.getByRole('button', { name: 'Confirm Choice' }));

      expect(screen.getByText('Your Choices')).toBeInTheDocument();
    });
  });

  describe('custom color picker', () => {
    it('opens color picker when Custom Color clicked', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'Custom Color' }));

      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });

    it('returns to choices when picker cancelled', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'Custom Color' }));
      await user.click(screen.getByRole('button', { name: 'Cancel Custom' }));

      expect(screen.queryByTestId('color-picker')).not.toBeInTheDocument();
      // Check that the semantic choice card is visible again (has the name 'secondary')
      expect(screen.getByText('secondary')).toBeInTheDocument();
    });

    it('accepts custom color and advances', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'Custom Color' }));
      await user.click(screen.getByRole('button', { name: 'Confirm Custom' }));

      // Should advance to Tertiary
      expect(screen.getByText('tertiary')).toBeInTheDocument();
      expect(screen.getByText(/1 of 10 complete/)).toBeInTheDocument();
    });
  });

  describe('completion', () => {
    async function completeAllChoices(user: ReturnType<typeof userEvent.setup>) {
      const semantics = [
        'Secondary',
        'Tertiary',
        'Accent',
        'Highlight',
        'Surface',
        'Neutral',
        'Danger',
        'Success',
        'Warning',
        'Info',
      ];

      for (const semantic of semantics) {
        // Click first swatch
        const swatches = screen.getAllByRole('button', {
          name: new RegExp(`${semantic} option`, 'i'),
        });
        await user.click(swatches[0]);

        // Enter reason
        const textarea = screen.getByRole('textbox');
        await user.type(textarea, `reason for ${semantic.toLowerCase()}`);
        await user.click(screen.getByRole('button', { name: 'Confirm Choice' }));
      }
    }

    it('shows complete button when all semantics chosen', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      await completeAllChoices(user);

      expect(screen.getByRole('button', { name: 'Complete First Run' })).toBeInTheDocument();
    });

    it('calls onComplete with all choices when complete button clicked', async () => {
      const onComplete = vi.fn();
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} onComplete={onComplete} />);

      await completeAllChoices(user);
      await user.click(screen.getByRole('button', { name: 'Complete First Run' }));

      expect(onComplete).toHaveBeenCalledTimes(1);
      const choices = onComplete.mock.calls[0][0];
      expect(Object.keys(choices)).toHaveLength(10);
      expect(choices.secondary).toHaveProperty('color');
      expect(choices.secondary).toHaveProperty('reason');
      expect(choices.secondary.reason).toBe('reason for secondary');
    });

    it('shows 10 of 10 progress when complete', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      await completeAllChoices(user);

      expect(screen.getByText(/10 of 10 complete/)).toBeInTheDocument();
    });
  });

  describe('revisiting choices', () => {
    it('allows changing a previously made choice', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      // Make initial selection
      const swatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(swatches[0]);
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'first choice');
      await user.click(screen.getByRole('button', { name: 'Confirm Choice' }));

      // Go back to secondary
      await user.click(screen.getByRole('button', { name: /Secondary.*\u2713/ }));

      // Make new selection
      const newSwatches = screen.getAllByRole('button', { name: /Secondary option/i });
      await user.click(newSwatches[1]);
      const newTextarea = screen.getByRole('textbox');
      await user.type(newTextarea, 'changed my mind');
      await user.click(screen.getByRole('button', { name: 'Confirm Choice' }));

      // Should still show 1 complete (replaced, not added)
      expect(screen.getByText(/1 of 10 complete/)).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles rapid navigation clicks', async () => {
      const user = userEvent.setup();
      render(<SemanticChoices {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'Danger' }));
      await user.click(screen.getByRole('button', { name: 'Success' }));
      await user.click(screen.getByRole('button', { name: 'Warning' }));

      expect(screen.getByText('warning')).toBeInTheDocument();
    });

    it('uses main as semantic role', () => {
      const { container } = render(<SemanticChoices {...defaultProps} />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });
  });
});
