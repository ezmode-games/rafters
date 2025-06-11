import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info'
    | 'outline'
    | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'full';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', asChild = false, className, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(
          // Base styles - using semantic tokens with proper interactive states
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-disabled',
          'transition-all duration-200',
          'hover:opacity-hover active:scale-active',

          // Variants - all grayscale, using semantic tokens
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90':
              variant === 'destructive',
            'bg-success text-success-foreground hover:bg-success/90': variant === 'success',
            'bg-warning text-warning-foreground hover:bg-warning/90': variant === 'warning',
            'bg-info text-info-foreground hover:bg-info/90': variant === 'info',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
              variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          },

          // Sizes
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
            'h-12 px-6 text-base w-full': size === 'full',
          },

          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
