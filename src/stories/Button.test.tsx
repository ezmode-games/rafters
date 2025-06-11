import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import * as propertyStories from './ButtonProperties.stories';
import * as variantStories from './ButtonVariants.stories';

const { Primary, Secondary, Destructive, Outline, Ghost } = composeStories(variantStories);

const { Small, Medium, Large, Disabled, InteractiveStates, AsChild } =
  composeStories(propertyStories);

describe('Button Stories', () => {
  describe('Variants', () => {
    it('renders Primary variant correctly', () => {
      render(<Primary />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Primary Button');
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('renders Secondary variant correctly', () => {
      render(<Secondary />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('renders Destructive variant correctly', () => {
      render(<Destructive />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
    });

    it('renders Outline variant correctly', () => {
      render(<Outline />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'border-input', 'bg-background');
    });

    it('renders Ghost variant correctly', () => {
      render(<Ghost />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
    });
  });

  describe('Sizes', () => {
    it('renders Small size correctly', () => {
      render(<Small />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-3', 'text-xs');
    });

    it('renders Medium size correctly', () => {
      render(<Medium />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-4');
    });

    it('renders Large size correctly', () => {
      render(<Large />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'px-6', 'text-base');
    });
  });

  describe('States', () => {
    it('renders disabled state correctly', () => {
      render(<Disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-disabled');
    });
  });

  describe('Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      render(<InteractiveStates />);
      const button = screen.getByRole('button');

      await user.click(button);

      // Verify the onClick function was called (via fn() spy from stories)
      expect(propertyStories.default.args?.onClick).toHaveBeenCalled();
    });

    it('applies hover styles', () => {
      render(<InteractiveStates />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:opacity-hover', 'active:scale-active');
    });
  });

  describe('Composition', () => {
    it('renders as child component correctly', () => {
      render(<AsChild />);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '#');
      // Should have button styles applied to the link
      expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });
  });

  describe('Accessibility', () => {
    it('maintains focus styles', () => {
      render(<Primary />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2'
      );
    });

    it('has proper button semantics', () => {
      render(<Primary />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Semantic Tokens', () => {
    it('uses semantic color tokens consistently', () => {
      render(<Primary />);
      const button = screen.getByRole('button');

      // Check that semantic tokens are used instead of hardcoded colors
      expect(button.className).not.toMatch(/bg-(gray|red|green|blue)-\d+/);
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('applies transition classes for smooth interactions', () => {
      render(<Primary />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-all', 'duration-200');
    });
  });
});
