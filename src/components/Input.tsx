import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          // Base styles - using semantic tokens
          'flex h-10 w-full rounded-md border px-3 py-2 text-sm',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-disabled',
          'transition-all duration-200',
          'hover:opacity-hover',

          // Variants - using semantic tokens
          {
            'border-input bg-background focus-visible:ring-primary': variant === 'default',
            'border-destructive bg-destructive/10 focus-visible:ring-destructive':
              variant === 'error',
            'border-success bg-success/10 focus-visible:ring-success': variant === 'success',
          },

          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
