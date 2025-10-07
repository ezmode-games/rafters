/**
 * Unit Tests for Input Component
 * Tests the React wrapper around r-input primitive with masking and validation
 *
 * @testType unit
 * @framework vitest
 * @component Input
 */

import { InputSchemas } from '@rafters/shared';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Input } from '../../src/components/Input';

describe('Input Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('Initialization', () => {
    it('should render input element', () => {
      render(<Input placeholder="Test input" />);
      const input = screen.getByPlaceholderText('Test input');
      expect(input).toBeInTheDocument();
    });

    it('should have default variant', () => {
      render(<Input data-testid="input" />);
      const wrapper = screen.getByTestId('input').parentElement;
      expect(wrapper).toBeTruthy();
    });

    it('should render with provided id', () => {
      const testId = `input-${Date.now()}`;
      render(<Input id={testId} data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('id', testId);
    });

    it('should pass through standard HTML input props', () => {
      render(<Input placeholder="Test" disabled required maxLength={100} />);
      const input = screen.getByPlaceholderText('Test');
      expect(input).toBeDisabled();
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('maxLength', '100');
    });

    it('should not be sensitive by default', () => {
      const { container } = render(<Input data-testid="input" />);
      const trustIndicator = container.querySelector('.absolute.right-2.top-2');
      expect(trustIndicator).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      render(<Input data-testid="input" variant="default" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('border-input');
      expect(input.className).toContain('bg-background');
    });

    it('should apply error variant styles', () => {
      render(<Input data-testid="input" variant="error" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('border-destructive');
      expect(input.className).toContain('bg-destructive/10');
    });

    it('should apply success variant styles', () => {
      render(<Input data-testid="input" variant="success" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('border-success');
      expect(input.className).toContain('bg-success/10');
    });

    it('should apply warning variant styles', () => {
      render(<Input data-testid="input" variant="warning" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('border-warning');
      expect(input.className).toContain('bg-warning/10');
    });
  });

  describe('Validation Messages', () => {
    it('should not render validation message when not provided', () => {
      render(<Input data-testid="input" />);
      const validationMessage = screen.queryByRole('alert');
      expect(validationMessage).not.toBeInTheDocument();
    });

    it('should render validation message when provided', () => {
      render(<Input validationMessage="This field is required" />);
      const message = screen.getByText('This field is required');
      expect(message).toBeInTheDocument();
    });

    it('should render error variant validation with alert role', () => {
      render(<Input variant="error" validationMessage="Error message" />);
      const message = screen.getByRole('alert');
      expect(message).toHaveTextContent('Error message');
    });

    it('should render success variant validation with status role', () => {
      render(<Input variant="success" validationMessage="Success message" />);
      const message = screen.getByRole('status');
      expect(message).toHaveTextContent('Success message');
    });

    it('should render warning variant validation with status role', () => {
      render(<Input variant="warning" validationMessage="Warning message" />);
      const message = screen.getByRole('status');
      expect(message).toHaveTextContent('Warning message');
    });

    it('should apply correct text color for error variant', () => {
      const { container } = render(<Input variant="error" validationMessage="Error message" />);
      const message = container.querySelector('.text-destructive');
      expect(message).toBeInTheDocument();
      expect(message).toHaveTextContent('Error message');
    });

    it('should apply correct text color for success variant', () => {
      const { container } = render(<Input variant="success" validationMessage="Success message" />);
      const message = container.querySelector('.text-success');
      expect(message).toBeInTheDocument();
      expect(message).toHaveTextContent('Success message');
    });

    it('should apply correct text color for warning variant', () => {
      const { container } = render(<Input variant="warning" validationMessage="Warning message" />);
      const message = container.querySelector('.text-warning');
      expect(message).toBeInTheDocument();
      expect(message).toHaveTextContent('Warning message');
    });

    it('should render visual indicator for error variant', () => {
      const { container } = render(<Input variant="error" validationMessage="Error message" />);
      const indicator = container.querySelector('.bg-destructive\\/20');
      expect(indicator).toBeInTheDocument();
    });

    it('should render visual indicator for success variant', () => {
      const { container } = render(<Input variant="success" validationMessage="Success message" />);
      const indicator = container.querySelector('.bg-success\\/20');
      expect(indicator).toBeInTheDocument();
    });

    it('should render visual indicator for warning variant', () => {
      const { container } = render(<Input variant="warning" validationMessage="Warning message" />);
      const indicator = container.querySelector('.bg-warning\\/20');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('Sensitive Data', () => {
    it('should show trust indicator when sensitive prop is true', () => {
      const { container } = render(<Input sensitive />);
      const trustIndicator = container.querySelector('.absolute.right-2.top-2');
      expect(trustIndicator).toBeInTheDocument();
    });

    it('should show trust indicator for password type', () => {
      const { container } = render(<Input type="password" />);
      const trustIndicator = container.querySelector('.absolute.right-2.top-2');
      expect(trustIndicator).toBeInTheDocument();
    });

    it('should show trust indicator for email type', () => {
      const { container } = render(<Input type="email" />);
      const trustIndicator = container.querySelector('.absolute.right-2.top-2');
      expect(trustIndicator).toBeInTheDocument();
    });

    it('should apply enhanced border for sensitive data', () => {
      render(<Input type="password" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('border-2');
      expect(input.className).toContain('shadow-sm');
    });

    it('should not show trust indicator for regular text input', () => {
      const { container } = render(<Input type="text" />);
      const trustIndicator = container.querySelector('.absolute.right-2.top-2');
      expect(trustIndicator).not.toBeInTheDocument();
    });
  });

  describe('Type Prop Forwarding', () => {
    it('should forward text type', () => {
      render(<Input type="text" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should forward email type', () => {
      render(<Input type="email" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should forward password type', () => {
      render(<Input type="password" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should forward tel type', () => {
      render(<Input type="tel" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should forward number type', () => {
      render(<Input type="number" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should forward url type', () => {
      render(<Input type="url" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('should forward search type', () => {
      render(<Input type="search" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'search');
    });
  });

  describe('Mask Inference from Zod Schemas', () => {
    it('should infer phone-us mask from InputSchemas.phoneUS', () => {
      render(<Input schema={InputSchemas.phoneUS} data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-mask', '(000) 000-0000');
    });

    it('should infer ssn-us mask from InputSchemas.ssn', () => {
      render(<Input schema={InputSchemas.ssn} data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-mask', '000-00-0000');
    });

    it('should infer credit-card mask from InputSchemas.creditCard', () => {
      render(<Input schema={InputSchemas.creditCard} data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-mask', '0000 0000 0000 0000');
    });

    it('should infer date-us mask from InputSchemas.dateUS', () => {
      render(<Input schema={InputSchemas.dateUS} data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-mask', '00/00/0000');
    });

    it('should infer zip-us mask from InputSchemas.zipCode', () => {
      render(<Input schema={InputSchemas.zipCode} data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-mask', '00000');
    });

    it('should not set data-mask when no schema provided', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).not.toHaveAttribute('data-mask');
    });
  });

  describe('Explicit Mask Prop', () => {
    it('should apply explicit mask pattern', () => {
      render(<Input mask="(000) 000-0000" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-mask', '(000) 000-0000');
    });

    it('should apply mask preset by name', () => {
      render(<Input mask="phone-us" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-mask', '(000) 000-0000');
    });

    it('should prioritize explicit mask over schema-inferred mask', () => {
      render(<Input schema={InputSchemas.phoneUS} mask="000-00-0000" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-mask', '000-00-0000');
    });

    it('should support custom mask patterns', () => {
      render(<Input mask="AAA-0000" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-mask', 'AAA-0000');
    });
  });

  describe('ARIA Attributes', () => {
    it('should set aria-invalid to false by default', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should set aria-invalid to true for error variant', () => {
      render(<Input variant="error" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not set aria-describedby when no validation message', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('should set aria-describedby when validation message exists', () => {
      render(<Input validationMessage="Error" data-testid="input" />);
      const input = screen.getByTestId('input');
      const ariaDescribedBy = input.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBeTruthy();
      expect(ariaDescribedBy).toMatch(/-validation$/);
    });

    it('should use default id for aria-describedby when no id provided', () => {
      render(<Input validationMessage="Error" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-describedby', 'input-validation');
    });

    it('should set aria-live="polite" on validation message', () => {
      render(<Input validationMessage="Error" />);
      const message = screen.getByText('Error');
      expect(message).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Motor Accessibility', () => {
    it('should have minimum touch target height on mobile', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('min-h-[44px]');
    });

    it('should have standard height on desktop', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('h-10');
    });

    it('should include transition classes for smooth interactions', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('transition-all');
      expect(input.className).toContain('motion-focus');
    });

    it('should include hover opacity', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('hover:opacity-hover');
    });
  });

  describe('Custom className', () => {
    it('should merge custom className with base styles', () => {
      render(<Input className="custom-class" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('custom-class');
      expect(input.className).toContain('rounded-md');
    });

    it('should not override base accessibility classes', () => {
      render(<Input className="custom-class" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('focus-visible:outline-none');
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled styles', () => {
      render(<Input disabled data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('disabled:cursor-not-allowed');
      expect(input.className).toContain('disabled:opacity-disabled');
    });

    it('should forward disabled attribute', () => {
      render(<Input disabled data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toBeDisabled();
    });
  });

  describe('Readonly State', () => {
    it('should forward readonly attribute', () => {
      render(<Input readOnly data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('readonly');
    });
  });

  describe('Placeholder', () => {
    it('should render placeholder with muted styling', () => {
      render(<Input placeholder="Enter text" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('placeholder:text-muted-foreground');
    });

    it('should display placeholder text', () => {
      render(<Input placeholder="Enter your name" />);
      const input = screen.getByPlaceholderText('Enter your name');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('should apply focus-visible ring styles', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('focus-visible:ring-2');
      expect(input.className).toContain('focus-visible:ring-offset-2');
    });

    it('should apply variant-specific focus ring for default', () => {
      render(<Input variant="default" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('focus-visible:ring-primary');
    });

    it('should apply variant-specific focus ring for error', () => {
      render(<Input variant="error" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('focus-visible:ring-destructive');
    });

    it('should apply variant-specific focus ring for success', () => {
      render(<Input variant="success" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('focus-visible:ring-success');
    });

    it('should apply variant-specific focus ring for warning', () => {
      render(<Input variant="warning" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('focus-visible:ring-warning');
    });
  });

  describe('File Input Styles', () => {
    it('should include file input button styles', () => {
      render(<Input type="file" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.className).toContain('file:border-0');
      expect(input.className).toContain('file:bg-transparent');
      expect(input.className).toContain('file:text-sm');
      expect(input.className).toContain('file:font-medium');
    });
  });

  describe('Wrapper Structure', () => {
    it('should wrap input in relative container', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      const wrapper = input.parentElement;
      expect(wrapper?.className).toContain('relative');
    });

    it('should contain validation message in wrapper', () => {
      render(<Input validationMessage="Error" data-testid="input" />);
      const input = screen.getByTestId('input');
      const wrapper = input.parentElement;
      const message = screen.getByText('Error');
      expect(wrapper).toContainElement(message);
    });

    it('should contain trust indicator in wrapper', () => {
      const { container } = render(<Input sensitive data-testid="input" />);
      const input = screen.getByTestId('input');
      const wrapper = input.parentElement;
      const trustIndicator = container.querySelector('.absolute.right-2.top-2');
      expect(wrapper).toContainElement(trustIndicator);
    });
  });
});
