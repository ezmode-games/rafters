/**
 * Grid Layout Intelligence Component
 * AI Intelligence: Responsive grid patterns with layout optimization
 */
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

// Responsive value type for breakpoint intelligence
export type ResponsiveValue<T> = T | {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

// Grid spacing using phi-based semantic tokens
export type GridGap = 'phi--2' | 'phi--1' | 'phi-0' | 'phi-1' | 'phi-2' | 'phi-3';

// Base Grid props interface
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  // Layout intelligence
  columns?: ResponsiveValue<number>;
  
  // Responsive intelligence
  autoFit?: string; // Min column width for auto-fit
  autoFill?: string; // Max column width for auto-fill
  
  // Spacing intelligence using phi-based tokens
  gap?: GridGap;
  rowGap?: GridGap;
  columnGap?: GridGap;
  
  // Content organization
  dense?: boolean;
}

// GridItem props interface  
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: ResponsiveValue<number>;
  rowSpan?: ResponsiveValue<number>;
  colStart?: ResponsiveValue<number>;
  colEnd?: ResponsiveValue<number>;
  rowStart?: ResponsiveValue<number>;
  rowEnd?: ResponsiveValue<number>;
}

// Helper function to build responsive classes
function buildResponsiveClasses<T>(value: ResponsiveValue<T>, prefix: string): string {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const responsiveObj = value as {
      base?: T;
      sm?: T;
      md?: T;
      lg?: T;
      xl?: T;
      '2xl'?: T;
    };
    
    const classes: string[] = [];
    
    if (responsiveObj.base !== undefined) classes.push(`${prefix}-${responsiveObj.base}`);
    if (responsiveObj.sm !== undefined) classes.push(`sm:${prefix}-${responsiveObj.sm}`);
    if (responsiveObj.md !== undefined) classes.push(`md:${prefix}-${responsiveObj.md}`);
    if (responsiveObj.lg !== undefined) classes.push(`lg:${prefix}-${responsiveObj.lg}`);
    if (responsiveObj.xl !== undefined) classes.push(`xl:${prefix}-${responsiveObj.xl}`);
    if (responsiveObj['2xl'] !== undefined) classes.push(`2xl:${prefix}-${responsiveObj['2xl']}`);
    
    return classes.join(' ');
  }
  
  return `${prefix}-${value}`;
}

// Main Grid component with layout intelligence
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ 
    columns, 
    autoFit, 
    autoFill, 
    gap = 'phi-1', 
    rowGap, 
    columnGap,
    dense = false,
    className, 
    style,
    ...props 
  }, ref) => {
    const classes: string[] = ['grid'];
    
    // Layout intelligence - responsive columns
    if (columns) {
      classes.push(buildResponsiveClasses(columns, 'grid-cols'));
    }
    
    // Spacing intelligence - phi-based gaps
    if (gap && !rowGap && !columnGap) {
      classes.push(`gap-${gap}`);
    }
    if (rowGap) {
      classes.push(`gap-y-${rowGap}`);
    }
    if (columnGap) {
      classes.push(`gap-x-${columnGap}`);
    }
    
    // Content organization
    if (dense) {
      classes.push('grid-flow-dense');
    }
    
    // Build dynamic styles for auto-fit/auto-fill
    const dynamicStyle: React.CSSProperties = {
      ...style,
    };
    
    if (autoFit && !columns) {
      dynamicStyle.gridTemplateColumns = `repeat(auto-fit, minmax(${autoFit}, 1fr))`;
    } else if (autoFill && !columns) {
      dynamicStyle.gridTemplateColumns = `repeat(auto-fill, minmax(${autoFill}, 1fr))`;
    }

    return (
      <div 
        ref={ref} 
        className={cn(classes, className)} 
        style={dynamicStyle}
        {...props} 
      />
    );
  }
);
Grid.displayName = 'Grid';

// GridItem component for enhanced grid item control
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ 
    colSpan, 
    rowSpan, 
    colStart, 
    colEnd, 
    rowStart, 
    rowEnd,
    className, 
    ...props 
  }, ref) => {
    const classes: string[] = [];
    
    // Column spanning
    if (colSpan) {
      classes.push(buildResponsiveClasses(colSpan, 'col-span'));
    }
    
    // Row spanning  
    if (rowSpan) {
      classes.push(buildResponsiveClasses(rowSpan, 'row-span'));
    }
    
    // Grid positioning
    if (colStart) {
      classes.push(buildResponsiveClasses(colStart, 'col-start'));
    }
    if (colEnd) {
      classes.push(buildResponsiveClasses(colEnd, 'col-end'));
    }
    if (rowStart) {
      classes.push(buildResponsiveClasses(rowStart, 'row-start'));
    }
    if (rowEnd) {
      classes.push(buildResponsiveClasses(rowEnd, 'row-end'));
    }
    
    return (
      <div 
        ref={ref} 
        className={cn(classes, className)} 
        {...props} 
      />
    );
  }
);
GridItem.displayName = 'GridItem';