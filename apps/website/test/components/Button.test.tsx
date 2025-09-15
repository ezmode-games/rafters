/**
 * Unit tests for Button component
 * Tests component behavior and intelligence metadata
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
  });

  it('applies destructive variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
  });

  it('applies medium size classes by default', () => {
    render(<Button>Medium</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11', 'px-8', 'text-base');
  });

  it('applies small size classes', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-9', 'px-3', 'text-sm');
  });

  it('applies large size classes', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-12', 'px-12', 'text-lg');
  });

  it('forwards additional props to button element', () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} data-testid="custom-button">
        Click
      </Button>
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();

    button.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('meets accessibility requirements', () => {
    render(<Button>Accessible button</Button>);
    const button = screen.getByRole('button');

    // Should have focus-visible styles for keyboard navigation
    expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');

    // Should be properly disabled when disabled
    render(<Button disabled>Disabled</Button>);
    const disabledButton = screen.getByRole('button', { name: 'Disabled' });
    expect(disabledButton).toBeDisabled();
    expect(disabledButton).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });
});
