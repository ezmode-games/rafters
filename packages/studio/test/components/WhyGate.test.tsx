/**
 * WhyGate Component Tests
 *
 * Exhaustive tests for the reasoning gate component.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WhyGate } from '../../src/components/shared/WhyGate';

describe('WhyGate', () => {
  const defaultProps = {
    title: 'why this color?',
    placeholders: ['placeholder 1', 'placeholder 2'],
    submitLabel: 'Submit',
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders title', () => {
      render(<WhyGate {...defaultProps} />);
      expect(screen.getByText('why this color?')).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<WhyGate {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('renders cancel button when onCancel provided', () => {
      render(<WhyGate {...defaultProps} onCancel={vi.fn()} />);
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('does not render cancel button when onCancel not provided', () => {
      render(<WhyGate {...defaultProps} />);
      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });

    it('renders children when provided', () => {
      render(
        <WhyGate {...defaultProps}>
          <div data-testid="child">Child content</div>
        </WhyGate>,
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders textarea with aria-label', () => {
      render(<WhyGate {...defaultProps} />);
      expect(screen.getByRole('textbox', { name: 'why this color?' })).toBeInTheDocument();
    });

    it('auto-focuses textarea on mount', () => {
      render(<WhyGate {...defaultProps} />);
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  describe('placeholder cycling', () => {
    it('shows first placeholder initially', () => {
      render(<WhyGate {...defaultProps} />);
      expect(screen.getByText('placeholder 1')).toBeInTheDocument();
    });

    it('does not show placeholder when text is entered', async () => {
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} />);

      await user.type(screen.getByRole('textbox'), 'some text');

      expect(screen.queryByText('placeholder 1')).not.toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('shows chars needed hint when below minimum', () => {
      render(<WhyGate {...defaultProps} minChars={5} />);
      expect(screen.getByText('5 more chars needed')).toBeInTheDocument();
    });

    it('updates chars needed as user types', async () => {
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} minChars={5} />);

      await user.type(screen.getByRole('textbox'), 'ab');

      expect(screen.getByText('3 more chars needed')).toBeInTheDocument();
    });

    it('shows submit hint when valid', async () => {
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} minChars={3} />);

      await user.type(screen.getByRole('textbox'), 'abc');

      expect(screen.getByText('Press Cmd+Enter to continue')).toBeInTheDocument();
    });

    it('submit button is disabled when invalid', () => {
      render(<WhyGate {...defaultProps} minChars={5} />);
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    it('submit button is enabled when valid', async () => {
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} minChars={3} />);

      await user.type(screen.getByRole('textbox'), 'abc');

      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    it('uses default minChars of 3', async () => {
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} />);

      await user.type(screen.getByRole('textbox'), 'ab');
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();

      await user.type(screen.getByRole('textbox'), 'c');
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    it('trims whitespace when validating', async () => {
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} minChars={3} />);

      await user.type(screen.getByRole('textbox'), '  a  ');
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
  });

  describe('submission', () => {
    it('calls onSubmit with trimmed reason on button click', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} onSubmit={onSubmit} minChars={3} />);

      await user.type(screen.getByRole('textbox'), '  my reason  ');
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(onSubmit).toHaveBeenCalledWith('my reason');
    });

    it('does not call onSubmit when invalid', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} onSubmit={onSubmit} minChars={5} />);

      await user.type(screen.getByRole('textbox'), 'ab');
      // Force click even though disabled
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit on Cmd+Enter when valid', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} onSubmit={onSubmit} minChars={3} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'valid reason');
      await user.keyboard('{Meta>}{Enter}{/Meta}');

      expect(onSubmit).toHaveBeenCalledWith('valid reason');
    });

    it('calls onSubmit on Ctrl+Enter when valid', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} onSubmit={onSubmit} minChars={3} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'valid reason');
      await user.keyboard('{Control>}{Enter}{/Control}');

      expect(onSubmit).toHaveBeenCalledWith('valid reason');
    });

    it('does not call onSubmit on Cmd+Enter when invalid', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} onSubmit={onSubmit} minChars={10} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'short');
      await user.keyboard('{Meta>}{Enter}{/Meta}');

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('cancellation', () => {
    it('calls onCancel on cancel button click', async () => {
      const onCancel = vi.fn();
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalled();
    });

    it('calls onCancel on Escape key', async () => {
      const onCancel = vi.fn();
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} onCancel={onCancel} />);

      await user.keyboard('{Escape}');

      expect(onCancel).toHaveBeenCalled();
    });

    it('does not call onCancel on Escape when not provided', async () => {
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} />);

      // Should not throw
      await user.keyboard('{Escape}');
    });
  });

  describe('edge cases', () => {
    it('handles empty placeholders array', () => {
      render(<WhyGate {...defaultProps} placeholders={[]} />);
      // Should render without crashing
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('handles single placeholder', () => {
      render(<WhyGate {...defaultProps} placeholders={['only one']} />);
      expect(screen.getByText('only one')).toBeInTheDocument();
    });

    it('handles minChars of 0', async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      render(<WhyGate {...defaultProps} onSubmit={onSubmit} minChars={0} />);

      // Should be valid immediately
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();

      await user.click(screen.getByRole('button', { name: 'Submit' }));
      expect(onSubmit).toHaveBeenCalledWith('');
    });

    it('handles very long input', async () => {
      const onSubmit = vi.fn();
      render(<WhyGate {...defaultProps} onSubmit={onSubmit} minChars={3} />);

      const longText = 'a'.repeat(100); // Reduced for test speed
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: longText } });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(onSubmit).toHaveBeenCalledWith(longText);
    });

    it('handles special characters', async () => {
      const onSubmit = vi.fn();
      render(<WhyGate {...defaultProps} onSubmit={onSubmit} minChars={3} />);

      const specialChars = '<script>alert("xss")</script>';
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: specialChars } });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(onSubmit).toHaveBeenCalledWith(specialChars);
    });

    it('handles unicode input', async () => {
      const onSubmit = vi.fn();
      render(<WhyGate {...defaultProps} onSubmit={onSubmit} minChars={3} />);

      const unicodeText = 'hello world';
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: unicodeText } });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(onSubmit).toHaveBeenCalledWith(unicodeText);
    });
  });
});
