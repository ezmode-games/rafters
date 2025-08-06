/**
 * Container Component Test Suite
 * Following TDD approach - tests written before implementation
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from '../src/components/Container';

describe('Container', () => {
  describe('Layout Intelligence', () => {
    it('should render with default size variant', () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container).toBeInTheDocument();
      expect(container.tagName).toBe('DIV');
    });

    it('should apply correct classes for size variants', () => {
      const { rerender } = render(
        <Container data-testid="container" size="sm">Content</Container>
      );
      
      let container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-sm');
      
      rerender(<Container data-testid="container" size="md">Content</Container>);
      container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-2xl');
      
      rerender(<Container data-testid="container" size="lg">Content</Container>);
      container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-4xl');
      
      rerender(<Container data-testid="container" size="xl">Content</Container>);
      container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-6xl');
      
      rerender(<Container data-testid="container" size="2xl">Content</Container>);
      container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-7xl');
      
      rerender(<Container data-testid="container" size="full">Content</Container>);
      container = screen.getByTestId('container');
      expect(container).toHaveClass('w-full');
    });

    it('should center content when center prop is true', () => {
      render(<Container data-testid="container" center>Content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container).toHaveClass('mx-auto');
    });

    it('should not center content when center prop is false', () => {
      render(<Container data-testid="container" center={false}>Content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container).not.toHaveClass('mx-auto');
    });
  });

  describe('Spacing Intelligence', () => {
    it('should apply correct padding for spacing variants', () => {
      const { rerender } = render(
        <Container data-testid="container" padding="none">Content</Container>
      );
      
      let container = screen.getByTestId('container');
      expect(container).toHaveClass('p-0');
      
      rerender(<Container data-testid="container" padding="sm">Content</Container>);
      container = screen.getByTestId('container');
      expect(container).toHaveClass('p-4');
      
      rerender(<Container data-testid="container" padding="md">Content</Container>);
      container = screen.getByTestId('container');
      expect(container).toHaveClass('p-6');
      
      rerender(<Container data-testid="container" padding="lg">Content</Container>);
      container = screen.getByTestId('container');
      expect(container).toHaveClass('p-8');
    });

    it('should use default medium padding when no padding specified', () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container).toHaveClass('p-6');
    });
  });

  describe('Semantic HTML Support', () => {
    it('should render as div by default', () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container.tagName).toBe('DIV');
    });

    it('should render as main when specified', () => {
      render(<Container data-testid="container" as="main">Content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container.tagName).toBe('MAIN');
    });

    it('should render as section when specified', () => {
      render(<Container data-testid="container" as="section">Content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container.tagName).toBe('SECTION');
    });

    it('should render as article when specified', () => {
      render(<Container data-testid="container" as="article">Content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container.tagName).toBe('ARTICLE');
    });
  });

  describe('Content Optimization', () => {
    it('should optimize for reading width with appropriate content constraints', () => {
      render(<Container data-testid="container" size="md">Content</Container>);
      const container = screen.getByTestId('container');
      
      // Should have reading-optimized width (65-75 characters approximately)
      expect(container).toHaveClass('max-w-2xl');
    });

    it('should apply responsive behavior for fluid layouts', () => {
      render(<Container data-testid="container" size="lg">Content</Container>);
      const container = screen.getByTestId('container');
      
      // Should include responsive classes
      expect(container.className).toMatch(/max-w-/);
    });
  });

  describe('Accessibility Excellence', () => {
    it('should maintain proper landmark structure with main element', () => {
      render(<Container data-testid="container" as="main">Main content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container).toHaveRole('main');
    });

    it('should provide proper sectioning with section element', () => {
      render(<Container data-testid="container" as="section">Section content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container.tagName).toBe('SECTION');
    });

    it('should support article content structure', () => {
      render(<Container data-testid="container" as="article">Article content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container.tagName).toBe('ARTICLE');
    });
  });

  describe('Cognitive Load Optimization', () => {
    it('should provide clear content boundaries with consistent spacing', () => {
      render(<Container data-testid="container" padding="lg">Content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container).toHaveClass('p-8');
    });

    it('should combine size and center for optimal layout', () => {
      render(
        <Container data-testid="container" size="lg" center padding="md">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      
      expect(container).toHaveClass('max-w-4xl');
      expect(container).toHaveClass('mx-auto');
      expect(container).toHaveClass('p-6');
    });
  });

  describe('Component Integration', () => {
    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Container ref={ref}>Content</Container>);
      
      expect(ref.current).not.toBeNull();
    });

    it('should merge additional className properly', () => {
      render(
        <Container data-testid="container" className="custom-class">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      
      expect(container).toHaveClass('custom-class');
      // Should also have default classes
      expect(container).toHaveClass('p-6');
    });

    it('should pass through standard HTML attributes', () => {
      render(
        <Container data-testid="container" id="test-id" role="region">
          Content
        </Container>
      );
      const container = screen.getByTestId('container');
      
      expect(container).toHaveAttribute('id', 'test-id');
      expect(container).toHaveAttribute('role', 'region');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId('container');
      
      expect(container).toBeInTheDocument();
    });

    it('should handle empty content', () => {
      render(<Container data-testid="container" />);
      const container = screen.getByTestId('container');
      
      expect(container).toBeInTheDocument();
      expect(container).toBeEmptyDOMElement();
    });

    it('should handle multiple children', () => {
      render(
        <Container data-testid="container">
          <div>Child 1</div>
          <div>Child 2</div>
        </Container>
      );
      const container = screen.getByTestId('container');
      
      expect(container).toBeInTheDocument();
      expect(container.children).toHaveLength(2);
    });
  });
});