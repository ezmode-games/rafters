/**
 * AI Intelligence: Container component with layout intelligence patterns
 * Token knowledge in design system tokens
 *
 * Implements Rafters Design Intelligence methodology:
 * - EMPATHIZE: Users need readable content with appropriate spacing
 * - DEFINE: Container with layout intelligence using design system tokens
 * - IDEATE: Layout patterns leveraging existing token system and utilities
 * - PROTOTYPE: Semantic HTML with phi-based spacing from design tokens
 * - TEST: Comprehensive story-based testing for all layout scenarios
 */
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

/**
 * Container component props with layout intelligence
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Layout intelligence using design system containers
   * reading: 38rem optimal reading width (~45-75 characters)
   * golden: 61.8rem golden ratio content width
   * wide: max-w-7xl for wide layouts
   * full: 100% full width layouts
   */
  variant?: 'reading' | 'golden' | 'wide' | 'full';

  /**
   * Spacing intelligence using phi-based spacing from design tokens
   * none: no padding
   * phi--2: 0.382rem minimal spacing
   * phi--1: 0.618rem tight spacing
   * phi-0: 1rem base spacing (default)
   * phi-1: 1.618rem paragraph spacing
   * phi-2: 2.618rem content block spacing
   */
  padding?: 'none' | 'phi--2' | 'phi--1' | 'phi-0' | 'phi-1' | 'phi-2';

  /**
   * Semantic HTML element type for accessibility excellence
   * div: generic container (default)
   * main: primary content landmark
   * section: thematic grouping
   * article: standalone content
   */
  as?: 'div' | 'main' | 'section' | 'article';
}

/**
 * Container component with layout intelligence
 *
 * Provides responsive layout foundation using design system tokens:
 * - Uses design system container utilities (container-reading, container-golden)
 * - Phi-based spacing following golden ratio principles
 * - Semantic HTML support for accessibility
 * - Builds on existing Tailwind utilities and design tokens
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ variant = 'golden', padding = 'phi-0', as = 'div', className, children, ...props }, ref) => {
    // Polymorphic component - render as specified element
    const Component = as;

    // Container variants using design system tokens
    const containerVariants = {
      reading: 'container-reading', // Uses --container-reading token
      golden: 'container-golden', // Uses --container-golden token
      wide: 'max-w-7xl mx-auto px-4', // Wide layout with standard padding
      full: 'w-full', // Full width container
    };

    // Spacing variants using phi-based design tokens
    const paddingVariants = {
      none: '', // No padding
      'phi--2': 'p-[var(--spacing-phi--2)]', // 0.382rem minimal
      'phi--1': 'p-[var(--spacing-phi--1)]', // 0.618rem tight
      'phi-0': 'p-[var(--spacing-phi-0)]', // 1rem base (default)
      'phi-1': 'p-[var(--spacing-phi-1)]', // 1.618rem paragraph
      'phi-2': 'p-[var(--spacing-phi-2)]', // 2.618rem content block
    };

    return (
      <Component
        ref={ref}
        className={cn(
          // Base container variant using design system tokens
          containerVariants[variant],

          // Phi-based padding using design system spacing tokens
          paddingVariants[padding],

          // Custom classes
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';
