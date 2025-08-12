import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Grid, GridItem } from '../../src/components/Grid';

/**
 * Grid Component Test Suite
 *
 * Following TDD approach to define Grid behavior before implementation.
 * Tests cover intelligent presets, accessibility, and cognitive load management.
 */

describe('Grid Component', () => {
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      render(
        <Grid data-testid="grid">
          <GridItem>Item 1</GridItem>
          <GridItem>Item 2</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid');
    });

    test('applies custom className', () => {
      render(
        <Grid data-testid="grid" className="custom-class">
          <GridItem>Item 1</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('custom-class');
    });

    test('forwards ref correctly', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;

      render(
        <Grid ref={ref} data-testid="grid">
          <GridItem>Item 1</GridItem>
        </Grid>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Intelligent Presets', () => {
    test('applies linear preset classes', () => {
      render(
        <Grid preset="linear" data-testid="grid">
          <GridItem>Item 1</GridItem>
          <GridItem>Item 2</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      // Linear preset should use responsive grid classes
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-2');
    });

    test('applies golden preset classes', () => {
      render(
        <Grid preset="golden" data-testid="grid">
          <GridItem>Item 1</GridItem>
          <GridItem>Item 2</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      // Golden preset should use asymmetric proportions
      expect(grid).toHaveClass('lg:grid-cols-5');
    });

    test('applies bento preset with semantic pattern', () => {
      render(
        <Grid preset="bento" bentoPattern="editorial" data-testid="grid">
          <GridItem priority="primary">Hero</GridItem>
          <GridItem priority="secondary">Supporting</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid');
      // Should apply bento-specific classes
    });

    test('defaults to linear preset when not specified', () => {
      render(
        <Grid data-testid="grid">
          <GridItem>Item 1</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid-cols-1');
    });
  });

  describe('Gap Spacing', () => {
    test('applies semantic gap values', () => {
      render(
        <Grid gap="md" data-testid="grid">
          <GridItem>Item 1</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('gap-4'); // md = 1rem = gap-4
    });

    test('applies golden ratio gap', () => {
      render(
        <Grid gap="comfortable" data-testid="grid">
          <GridItem>Item 1</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      // Should apply custom comfortable spacing
      expect(grid.style.gap).toBeTruthy();
    });
  });

  describe('Auto-Sizing Intelligence', () => {
    test('applies minimum item width for auto-fit', () => {
      render(
        <Grid autoFit="md" data-testid="grid">
          <GridItem>Item 1</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid.style.gridTemplateColumns).toContain('minmax');
      expect(grid.style.gridTemplateColumns).toContain('280px');
    });

    test('accepts custom minimum width', () => {
      render(
        <Grid autoFit="300px" data-testid="grid">
          <GridItem>Item 1</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid.style.gridTemplateColumns).toContain('300px');
    });
  });

  describe('Cognitive Load Management', () => {
    test('respects maximum items limit', () => {
      render(
        <Grid maxItems={4} data-testid="grid">
          <GridItem>Item 1</GridItem>
          <GridItem>Item 2</GridItem>
          <GridItem>Item 3</GridItem>
          <GridItem>Item 4</GridItem>
          <GridItem>Item 5</GridItem> {/* Should be managed or hidden */}
        </Grid>
      );

      // Implementation should handle cognitive load limits
      const grid = screen.getByTestId('grid');
      expect(grid).toBeInTheDocument();
    });

    test('auto-adjusts items based on viewport', () => {
      // This would test responsive cognitive load management
      render(
        <Grid maxItems="auto" data-testid="grid">
          <GridItem>Item 1</GridItem>
          <GridItem>Item 2</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Accessibility Features', () => {
    test('applies presentation role by default', () => {
      render(
        <Grid data-testid="grid">
          <GridItem>Item 1</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveAttribute('role', 'presentation');
    });

    test('supports interactive grid role', () => {
      render(
        // biome-ignore lint/a11y/useSemanticElements: Testing ARIA grid pattern
        <Grid role="grid" ariaLabel="Product catalog" data-testid="grid">
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell */}
          <GridItem role="gridcell">Item 1</GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveAttribute('role', 'grid');
      expect(grid).toHaveAttribute('aria-label', 'Product catalog');
    });

    test('supports keyboard navigation when interactive', () => {
      render(
        // biome-ignore lint/a11y/useSemanticElements: Testing ARIA grid keyboard navigation
        <Grid role="grid" data-testid="grid">
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell */}
          <GridItem role="gridcell" focusable>
            Item 1
          </GridItem>
        </Grid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveAttribute('tabIndex', '0');
    });
  });
});

describe('GridItem Component', () => {
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      render(
        <Grid>
          <GridItem data-testid="grid-item">Item Content</GridItem>
        </Grid>
      );

      const item = screen.getByTestId('grid-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Item Content');
    });

    test('applies column and row spans', () => {
      render(
        <Grid>
          <GridItem colSpan={2} rowSpan={1} data-testid="grid-item">
            Spanning Item
          </GridItem>
        </Grid>
      );

      const item = screen.getByTestId('grid-item');
      expect(item).toHaveClass('col-span-2');
      expect(item).toHaveClass('row-span-1');
    });

    test('supports priority-based sizing in bento layouts', () => {
      render(
        <Grid preset="bento">
          <GridItem priority="primary" data-testid="primary-item">
            Primary Content
          </GridItem>
          <GridItem priority="secondary" data-testid="secondary-item">
            Secondary Content
          </GridItem>
        </Grid>
      );

      const primaryItem = screen.getByTestId('primary-item');
      const secondaryItem = screen.getByTestId('secondary-item');

      expect(primaryItem).toBeInTheDocument();
      expect(secondaryItem).toBeInTheDocument();
      // Priority-based classes should be applied
    });
  });

  describe('Accessibility Features', () => {
    test('applies gridcell role when parent is interactive grid', () => {
      render(
        // biome-ignore lint/a11y/useSemanticElements: Testing ARIA grid pattern
        <Grid role="grid">
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell */}
          <GridItem role="gridcell" data-testid="grid-item">
            Cell Content
          </GridItem>
        </Grid>
      );

      const item = screen.getByTestId('grid-item');
      expect(item).toHaveAttribute('role', 'gridcell');
    });

    test('supports focusable items for keyboard navigation', () => {
      render(
        // biome-ignore lint/a11y/useSemanticElements: Testing ARIA grid pattern
        <Grid role="grid">
          {/* biome-ignore lint/a11y/useSemanticElements: Testing ARIA gridcell */}
          <GridItem role="gridcell" focusable data-testid="grid-item">
            Focusable Content
          </GridItem>
        </Grid>
      );

      const item = screen.getByTestId('grid-item');
      expect(item).toHaveAttribute('tabIndex');
    });
  });
});

describe('Grid Intelligence Integration', () => {
  test('combines presets with custom props correctly', () => {
    render(
      <Grid
        preset="golden"
        gap="comfortable"
        maxItems={6}
        className="custom-grid"
        data-testid="grid"
      >
        <GridItem>Item 1</GridItem>
        <GridItem>Item 2</GridItem>
      </Grid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('custom-grid');
    expect(grid).toHaveClass('lg:grid-cols-5'); // Golden preset
    // Should combine all intelligence features
  });

  test('validates semantic bento patterns', () => {
    render(
      <Grid preset="bento" bentoPattern="editorial" data-testid="grid">
        <GridItem priority="primary">Hero Article</GridItem>
        <GridItem priority="secondary">Related Story</GridItem>
      </Grid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toBeInTheDocument();
    // Should apply editorial bento pattern classes
  });
});
