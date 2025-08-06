/**
 * AI Intelligence: Container component with layout intelligence patterns
 * Token knowledge in .rafters/tokens/registry.json
 * 
 * Implements Rafters Design Intelligence methodology:
 * - EMPATHIZE: Users need readable content with appropriate spacing
 * - DEFINE: Container with layout intelligence and responsive optimization  
 * - IDEATE: Layout patterns, responsive intelligence, and content optimization
 * - PROTOTYPE: Semantic HTML with intelligent spacing and accessibility
 * - TEST: Comprehensive testing for all layout scenarios
 */
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

/**
 * Container component props with layout intelligence
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Layout intelligence - responsive container sizes
   * sm: 24rem (384px) - mobile content
   * md: 42rem (672px) - optimal reading width (65-75 characters)
   * lg: 56rem (896px) - content with sidebars
   * xl: 72rem (1152px) - wide layouts
   * 2xl: 80rem (1280px) - extra wide content
   * full: 100% - full width layouts
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  /**
   * Content optimization - center content horizontally
   * Applies mx-auto for centered layouts
   */
  center?: boolean;
  
  /**
   * Spacing intelligence - consistent padding using phi-based spacing
   * none: no padding
   * sm: 1rem (16px) - compact layouts
   * md: 1.5rem (24px) - balanced spacing (default)
   * lg: 2rem (32px) - generous breathing room
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
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
 * Provides responsive layout foundation with content optimization patterns:
 * - Responsive intelligence with smart breakpoint behavior
 * - Content optimization with optimal reading width
 * - Spacing intelligence with consistent phi-based patterns
 * - Cognitive load optimization with clear boundaries
 * - Accessibility excellence with proper landmarks
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = 'md',
      center = true,
      padding = 'md',
      as = 'div',
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Polymorphic component - render as specified element
    const Component = as;

    return (
      <Component
        ref={ref}
        className={cn(
          // Base container styles for layout intelligence
          'w-full',
          
          // Responsive intelligence - size variants with content optimization
          {
            'max-w-sm': size === 'sm',    // 24rem - mobile content
            'max-w-2xl': size === 'md',   // 42rem - optimal reading width (65-75 chars)
            'max-w-4xl': size === 'lg',   // 56rem - content with sidebars
            'max-w-6xl': size === 'xl',   // 72rem - wide layouts
            'max-w-7xl': size === '2xl',  // 80rem - extra wide content
            'w-full': size === 'full',    // 100% - full width layouts
          },
          
          // Content optimization - center alignment for readability
          {
            'mx-auto': center && size !== 'full',
          },
          
          // Spacing intelligence - phi-based padding for cognitive load optimization
          {
            'p-0': padding === 'none',    // No padding
            'p-4': padding === 'sm',      // 1rem - compact
            'p-6': padding === 'md',      // 1.5rem - balanced (default)
            'p-8': padding === 'lg',      // 2rem - generous
          },
          
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