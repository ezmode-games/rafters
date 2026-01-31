/**
 * Snowstorm Component Tests
 *
 * Tests for the first-run color selection flow.
 * Flow: Click card -> ColorPicker -> Select -> Why? -> Commit
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Snowstorm } from '../../src/components/first-run/Snowstorm';
import { mockColorValue } from '../fixtures';

describe('Snowstorm', () => {
  const defaultProps = {
    onColorSelect: vi.fn().mockResolvedValue({ colorValue: mockColorValue }),
    cardDelay: 0, // Skip delay for tests
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders snow container', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const snowContainer = container.querySelector('.pointer-events-none');
      expect(snowContainer).toBeInTheDocument();
    });

    it('renders prompt text', () => {
      render(<Snowstorm {...defaultProps} />);
      expect(screen.getByText('Choose Your Primary Color')).toBeInTheDocument();
    });

    it('uses full screen container', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      const main = container.querySelector('main');
      expect(main).toHaveClass('h-screen');
    });
  });

  describe('stage transitions', () => {
    it('shows ColorPicker when card is clicked', async () => {
      const user = userEvent.setup();
      render(<Snowstorm {...defaultProps} />);

      await user.click(screen.getByText('Choose Your Primary Color'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
      });
    });

    it('hides prompt text after clicking card', async () => {
      const user = userEvent.setup();
      render(<Snowstorm {...defaultProps} />);

      await user.click(screen.getByText('Choose Your Primary Color'));

      await waitFor(() => {
        expect(screen.queryByText('Choose Your Primary Color')).not.toBeInTheDocument();
      });
    });

    it('shows Why stage after selecting color', async () => {
      const user = userEvent.setup();
      render(<Snowstorm {...defaultProps} />);

      await user.click(screen.getByText('Choose Your Primary Color'));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Select' }));

      await waitFor(() => {
        expect(screen.getByText('What drew you to this?')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });
  });

  describe('color confirmation', () => {
    it('enables Continue button when reason is entered', async () => {
      const user = userEvent.setup();
      render(<Snowstorm {...defaultProps} />);

      // Go through the flow
      await user.click(screen.getByText('Choose Your Primary Color'));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: 'Select' }));
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      await user.type(screen.getByRole('textbox'), 'brand color');

      expect(screen.getByRole('button', { name: 'Continue' })).not.toBeDisabled();
    });

    it('disables Continue button with empty reason', async () => {
      const user = userEvent.setup();
      render(<Snowstorm {...defaultProps} />);

      await user.click(screen.getByText('Choose Your Primary Color'));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: 'Select' }));
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    });

    it('allows clicking inspiration chips to add reason', async () => {
      const user = userEvent.setup();
      render(<Snowstorm {...defaultProps} />);

      await user.click(screen.getByText('Choose Your Primary Color'));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: 'Select' }));
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      // Click a chip
      await user.click(screen.getByRole('button', { name: 'Brand guidelines' }));

      expect(screen.getByRole('textbox')).toHaveValue('Brand guidelines');
      expect(screen.getByRole('button', { name: 'Continue' })).not.toBeDisabled();
    });

    it('calls onColorSelect after transition when Continue is clicked', async () => {
      const onColorSelect = vi.fn().mockResolvedValue({ colorValue: mockColorValue });
      const user = userEvent.setup();
      render(<Snowstorm onColorSelect={onColorSelect} cardDelay={0} />);

      await user.click(screen.getByText('Choose Your Primary Color'));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: 'Select' }));
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      await user.type(screen.getByRole('textbox'), 'brand color');
      await user.click(screen.getByRole('button', { name: 'Continue' }));

      // Wait for transition animation to complete and callback to fire
      await waitFor(
        () => {
          expect(onColorSelect).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );

      const [color, reason, family] = onColorSelect.mock.calls[0];
      expect(color).toHaveProperty('l');
      expect(color).toHaveProperty('c');
      expect(color).toHaveProperty('h');
      expect(reason).toBe('brand color');
      expect(family).toBe('primary');
    });

    it('calls onColorSelect after transition on Enter key', async () => {
      const onColorSelect = vi.fn().mockResolvedValue({ colorValue: mockColorValue });
      const user = userEvent.setup();
      render(<Snowstorm onColorSelect={onColorSelect} cardDelay={0} />);

      await user.click(screen.getByText('Choose Your Primary Color'));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: 'Select' }));
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      await user.type(screen.getByRole('textbox'), 'brand color{Enter}');

      // Wait for transition animation to complete and callback to fire
      await waitFor(
        () => {
          expect(onColorSelect).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('GSAP integration', () => {
    it('creates snow container for particles on mount', () => {
      const { container } = render(<Snowstorm {...defaultProps} />);
      // Particles are created as DOM elements in the snow container
      const particles = container.querySelectorAll('.bg-muted-foreground');
      expect(particles.length).toBeGreaterThan(0);
    });

    it('creates float animation for card', async () => {
      const gsap = await import('gsap');
      render(<Snowstorm {...defaultProps} />);

      expect(gsap.default.timeline).toHaveBeenCalled();
    });
  });
});
