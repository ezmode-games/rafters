import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cognitive load: Card density for information hierarchy */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Cognitive load: Interaction affordance */
  interactive?: boolean;
  /** Scanability: Visual prominence for important cards */
  prominence?: 'subtle' | 'default' | 'elevated';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, density = 'comfortable', interactive = false, prominence = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground transition-all duration-200',
        // Cognitive load: Information density controls
        {
          'border-border shadow-sm': prominence === 'subtle',
          'border-border shadow-md': prominence === 'default', 
          'border-border shadow-lg': prominence === 'elevated',
        },
        // Interaction affordance: Clear hover states for interactive cards
        interactive && 'cursor-pointer hover:shadow-md hover:border-accent-foreground/20 hover:scale-[1.02] active:scale-[0.98]',
        // Motor accessibility: Ensure adequate touch targets for interactive cards
        interactive && 'min-h-[44px]',
        className
      )}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cognitive load: Header density for information hierarchy */
  density?: 'compact' | 'comfortable' | 'spacious';
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, density = 'comfortable', ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        'flex flex-col space-y-1.5',
        // Cognitive load: Adaptive spacing based on information density
        {
          'p-4': density === 'compact',
          'p-6': density === 'comfortable',
          'p-8': density === 'spacious',
        },
        className
      )} 
      {...props} 
    />
  )
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Information hierarchy: Semantic heading level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Scanability: Visual weight for content hierarchy */
  weight?: 'normal' | 'medium' | 'semibold';
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, level = 3, weight = 'semibold', ...props }, ref) => {
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    
    return (
      <HeadingTag
        ref={ref}
        className={cn(
          'leading-none tracking-tight',
          // Information hierarchy: Semantic sizing based on heading level
          {
            'text-3xl': level === 1,
            'text-2xl': level === 2,
            'text-xl': level === 3,
            'text-lg': level === 4,
            'text-base': level === 5,
            'text-sm': level === 6,
          },
          // Scanability: Visual weight options
          {
            'font-normal': weight === 'normal',
            'font-medium': weight === 'medium',
            'font-semibold': weight === 'semibold',
          },
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Cognitive load: Text length awareness for readability */
  truncate?: boolean;
  /** Information hierarchy: Subtle vs prominent descriptions */
  prominence?: 'subtle' | 'default';
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, truncate = false, prominence = 'default', ...props }, ref) => (
    <p 
      ref={ref} 
      className={cn(
        'text-sm leading-relaxed',
        // Cognitive load: Truncation for long descriptions
        truncate && 'line-clamp-2',
        // Information hierarchy: Prominence levels
        {
          'text-muted-foreground/70': prominence === 'subtle',
          'text-muted-foreground': prominence === 'default',
        },
        className
      )} 
      {...props} 
    />
  )
);
CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cognitive load: Content density for information hierarchy */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Scanability: Content organization patterns */
  layout?: 'default' | 'grid' | 'list';
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, density = 'comfortable', layout = 'default', ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        'pt-0',
        // Cognitive load: Adaptive spacing
        {
          'p-4': density === 'compact',
          'p-6': density === 'comfortable', 
          'p-8': density === 'spacious',
        },
        // Scanability: Layout patterns
        {
          '': layout === 'default',
          'grid grid-cols-1 gap-4': layout === 'grid',
          'space-y-3': layout === 'list',
        },
        className
      )} 
      {...props} 
    />
  )
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cognitive load: Footer density and action clarity */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Scanability: Action hierarchy in footer */
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, density = 'comfortable', justify = 'start', ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        'flex items-center pt-0',
        // Cognitive load: Adaptive spacing
        {
          'p-4': density === 'compact',
          'p-6': density === 'comfortable',
          'p-8': density === 'spacious',
        },
        // Scanability: Action layout
        {
          'justify-start': justify === 'start',
          'justify-center': justify === 'center', 
          'justify-end': justify === 'end',
          'justify-between': justify === 'between',
        },
        className
      )} 
      {...props} 
    />
  )
);
CardFooter.displayName = 'CardFooter';
