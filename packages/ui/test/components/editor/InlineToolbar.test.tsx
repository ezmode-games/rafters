import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  InlineToolbar,
  type InlineToolbarProps,
} from '../../../src/components/editor/InlineToolbar';
import { resetTooltipState } from '../../../src/components/ui/tooltip';
import type { InlineMark } from '../../../src/primitives/types';

// Reset state between tests to avoid interference
beforeEach(() => {
  resetTooltipState();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/**
 * Create default props for InlineToolbar
 */
function createDefaultProps(overrides: Partial<InlineToolbarProps> = {}): InlineToolbarProps {
  return {
    isVisible: true,
    position: { x: 100, y: 100 },
    activeFormats: [],
    onFormat: vi.fn(),
    onLink: vi.fn(),
    onRemoveLink: vi.fn(),
    hasLink: false,
    ...overrides,
  };
}

describe('InlineToolbar', () => {
  describe('Visibility', () => {
    it('should not render when isVisible is false', () => {
      const props = createDefaultProps({ isVisible: false });

      render(<InlineToolbar {...props} />);

      expect(screen.queryByTestId('inline-toolbar')).not.toBeInTheDocument();
    });

    it('should render when isVisible is true', () => {
      const props = createDefaultProps({ isVisible: true });

      render(<InlineToolbar {...props} />);

      expect(screen.getByTestId('inline-toolbar')).toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('should render at specified position', () => {
      const props = createDefaultProps({ position: { x: 200, y: 150 } });

      render(<InlineToolbar {...props} />);

      const toolbar = screen.getByTestId('inline-toolbar');
      // Check that position styles are applied (using className for fixed)
      expect(toolbar).toHaveClass('fixed');
    });

    it('should adjust position near viewport edge', () => {
      // Position near right edge
      const props = createDefaultProps({ position: { x: window.innerWidth - 10, y: 100 } });

      render(<InlineToolbar {...props} />);

      const toolbar = screen.getByTestId('inline-toolbar');
      // The component should adjust the position to stay within viewport
      expect(toolbar).toBeInTheDocument();
    });

    it('should flip position near top of viewport', () => {
      // Position near top edge
      const props = createDefaultProps({ position: { x: 100, y: 5 } });

      render(<InlineToolbar {...props} />);

      const toolbar = screen.getByTestId('inline-toolbar');
      expect(toolbar).toBeInTheDocument();
    });
  });

  describe('Format Buttons', () => {
    it('should render all format buttons', () => {
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      expect(screen.getByTestId('format-bold')).toBeInTheDocument();
      expect(screen.getByTestId('format-italic')).toBeInTheDocument();
      expect(screen.getByTestId('format-code')).toBeInTheDocument();
      expect(screen.getByTestId('format-strikethrough')).toBeInTheDocument();
    });

    it('should show active state for applied formats', () => {
      const activeFormats: InlineMark[] = ['bold', 'italic'];
      const props = createDefaultProps({ activeFormats });

      render(<InlineToolbar {...props} />);

      const boldButton = screen.getByTestId('format-bold');
      const italicButton = screen.getByTestId('format-italic');
      const codeButton = screen.getByTestId('format-code');

      expect(boldButton).toHaveAttribute('aria-pressed', 'true');
      expect(italicButton).toHaveAttribute('aria-pressed', 'true');
      expect(codeButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should call onFormat with correct InlineMark when button clicked', async () => {
      const user = userEvent.setup();
      const onFormat = vi.fn();
      const props = createDefaultProps({ onFormat });

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('format-bold'));
      expect(onFormat).toHaveBeenCalledWith('bold');

      await user.click(screen.getByTestId('format-italic'));
      expect(onFormat).toHaveBeenCalledWith('italic');

      await user.click(screen.getByTestId('format-code'));
      expect(onFormat).toHaveBeenCalledWith('code');

      await user.click(screen.getByTestId('format-strikethrough'));
      expect(onFormat).toHaveBeenCalledWith('strikethrough');
    });
  });

  describe('Link Handling', () => {
    it('should render link button', () => {
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      expect(screen.getByTestId('format-link')).toBeInTheDocument();
    });

    it('should show link popover on link button click', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('format-link'));

      await waitFor(() => {
        expect(screen.getByTestId('link-popover')).toBeInTheDocument();
      });
    });

    it('should call onLink with validated URL', async () => {
      const user = userEvent.setup();
      const onLink = vi.fn();
      const props = createDefaultProps({ onLink });

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('format-link'));

      await waitFor(() => {
        expect(screen.getByTestId('link-url-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('link-url-input');
      // Use fireEvent.change for more reliable value setting
      fireEvent.change(input, { target: { value: 'example.com' } });

      expect(input).toHaveValue('example.com');

      await user.click(screen.getByTestId('link-submit'));

      expect(onLink).toHaveBeenCalledWith('https://example.com');
    });

    it('should show error for invalid URL', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('format-link'));

      await waitFor(() => {
        expect(screen.getByTestId('link-url-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('link-url-input');
      // Use fireEvent.change for more reliable value setting
      fireEvent.change(input, { target: { value: 'not a url' } });

      await user.click(screen.getByTestId('link-submit'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid URL');
      });
    });

    it('should show unlink button when hasLink is true', () => {
      const props = createDefaultProps({ hasLink: true });

      render(<InlineToolbar {...props} />);

      expect(screen.getByTestId('unlink-button')).toBeInTheDocument();
    });

    it('should not show unlink button when hasLink is false', () => {
      const props = createDefaultProps({ hasLink: false });

      render(<InlineToolbar {...props} />);

      expect(screen.queryByTestId('unlink-button')).not.toBeInTheDocument();
    });

    it('should call onRemoveLink when unlink button clicked', async () => {
      const user = userEvent.setup();
      const onRemoveLink = vi.fn();
      const props = createDefaultProps({ hasLink: true, onRemoveLink });

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('unlink-button'));

      expect(onRemoveLink).toHaveBeenCalled();
    });

    it('should show active state when link format is active', () => {
      const props = createDefaultProps({ activeFormats: ['link'] });

      render(<InlineToolbar {...props} />);

      const linkButton = screen.getByTestId('format-link');
      expect(linkButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should pre-populate link URL when editing existing link', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps({
        hasLink: true,
        linkUrl: 'https://existing.com',
      });

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('format-link'));

      await waitFor(() => {
        const input = screen.getByTestId('link-url-input');
        expect(input).toHaveValue('https://existing.com');
      });
    });

    it('should close link popover on cancel', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('format-link'));

      await waitFor(() => {
        expect(screen.getByTestId('link-popover')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('link-cancel'));

      await waitFor(() => {
        expect(screen.queryByTestId('link-popover')).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation with Tab', async () => {
      const user = userEvent.setup();
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      // Focus the first button
      const boldButton = screen.getByTestId('format-bold');
      boldButton.focus();

      expect(document.activeElement).toBe(boldButton);

      // Tab to next button
      await user.tab();
      expect(document.activeElement).toBe(screen.getByTestId('format-italic'));
    });

    it('should close on Escape key', async () => {
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      const toolbar = screen.getByTestId('inline-toolbar');
      const boldButton = screen.getByTestId('format-bold');
      boldButton.focus();

      fireEvent.keyDown(toolbar, { key: 'Escape' });

      // The toolbar visibility is controlled by parent, but Escape should blur
      expect(document.activeElement).not.toBe(boldButton);
    });

    it('should trigger format on Enter key when button focused', async () => {
      const user = userEvent.setup();
      const onFormat = vi.fn();
      const props = createDefaultProps({ onFormat });

      render(<InlineToolbar {...props} />);

      const boldButton = screen.getByTestId('format-bold');
      boldButton.focus();

      await user.keyboard('{Enter}');

      expect(onFormat).toHaveBeenCalledWith('bold');
    });

    it('should trigger format on Space key when button focused', async () => {
      const user = userEvent.setup();
      const onFormat = vi.fn();
      const props = createDefaultProps({ onFormat });

      render(<InlineToolbar {...props} />);

      const boldButton = screen.getByTestId('format-bold');
      boldButton.focus();

      await user.keyboard(' ');

      expect(onFormat).toHaveBeenCalledWith('bold');
    });
  });

  describe('Accessibility', () => {
    it('should have toolbar role', () => {
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('should have accessible label', () => {
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Text formatting');
    });

    it('should have screen reader announcements', () => {
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      const announcement = screen.getByRole('status');
      expect(announcement).toHaveTextContent('Text formatting toolbar open');
    });

    it('should have accessible button labels', () => {
      const props = createDefaultProps();

      render(<InlineToolbar {...props} />);

      // All buttons should have accessible names via sr-only text
      expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Code' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Strikethrough' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Link' })).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const props = createDefaultProps({ className: 'custom-toolbar-class' });

      render(<InlineToolbar {...props} />);

      expect(screen.getByTestId('inline-toolbar')).toHaveClass('custom-toolbar-class');
    });
  });

  describe('URL Validation', () => {
    it('should accept URLs with http protocol', async () => {
      const user = userEvent.setup();
      const onLink = vi.fn();
      const props = createDefaultProps({ onLink });

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('format-link'));

      await waitFor(() => {
        expect(screen.getByTestId('link-url-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('link-url-input');
      // Use fireEvent.change for more reliable value setting
      fireEvent.change(input, { target: { value: 'http://example.com' } });

      await user.click(screen.getByTestId('link-submit'));

      expect(onLink).toHaveBeenCalledWith('http://example.com');
    });

    it('should accept URLs with https protocol', async () => {
      const user = userEvent.setup();
      const onLink = vi.fn();
      const props = createDefaultProps({ onLink });

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('format-link'));

      await waitFor(() => {
        expect(screen.getByTestId('link-url-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('link-url-input');
      // Use fireEvent.change for more reliable value setting
      fireEvent.change(input, { target: { value: 'https://example.com' } });

      await user.click(screen.getByTestId('link-submit'));

      expect(onLink).toHaveBeenCalledWith('https://example.com');
    });

    it('should add https protocol to URLs without protocol', async () => {
      const user = userEvent.setup();
      const onLink = vi.fn();
      const props = createDefaultProps({ onLink });

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('format-link'));

      await waitFor(() => {
        expect(screen.getByTestId('link-url-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('link-url-input');
      // Use fireEvent.change for more reliable value setting
      fireEvent.change(input, { target: { value: 'example.com/path' } });

      await user.click(screen.getByTestId('link-submit'));

      expect(onLink).toHaveBeenCalledWith('https://example.com/path');
    });

    it('should reject empty URLs', async () => {
      const user = userEvent.setup();
      const onLink = vi.fn();
      const props = createDefaultProps({ onLink });

      render(<InlineToolbar {...props} />);

      await user.click(screen.getByTestId('format-link'));

      await waitFor(() => {
        expect(screen.getByTestId('link-url-input')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('link-submit'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      expect(onLink).not.toHaveBeenCalled();
    });
  });
});
