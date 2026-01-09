/**
 * Checkbox component for binary selections in forms
 *
 * @cognitive-load 2/10 - Simple binary choice with clear visual state
 * @attention-economics Low attention demand: passive until interaction, clear checked/unchecked states
 * @trust-building Immediate visual feedback, reversible action, clear association with label
 * @accessibility Keyboard toggle (Space), proper ARIA checked state, visible focus indicator
 * @semantic-meaning Binary selection: checked=enabled/selected, unchecked=disabled/deselected
 *
 * @usage-patterns
 * DO: Always pair with a descriptive Label component
 * DO: Use for optional settings or multi-select lists
 * DO: Group related checkboxes visually
 * DO: Provide immediate visual feedback on state change
 * NEVER: Use for mutually exclusive options (use RadioGroup instead)
 *
 * @example
 * ```tsx
 * <div className="flex items-center gap-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">Accept terms and conditions</Label>
 * </div>
 * ```
 */
import * as React from 'react';
import classy from '../../primitives/classy';

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean;
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Visual variant per docs/COMPONENT_STYLING_REFERENCE.md */
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info'
    | 'accent';
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';
}

// Variant classes for checked state
const variantClasses: Record<string, { border: string; checked: string; ring: string }> = {
  default: {
    border: 'border-primary',
    checked: 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
    ring: 'focus-visible:ring-primary-ring',
  },
  primary: {
    border: 'border-primary',
    checked: 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
    ring: 'focus-visible:ring-primary-ring',
  },
  secondary: {
    border: 'border-secondary',
    checked: 'data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground',
    ring: 'focus-visible:ring-secondary-ring',
  },
  destructive: {
    border: 'border-destructive',
    checked: 'data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground',
    ring: 'focus-visible:ring-destructive-ring',
  },
  success: {
    border: 'border-success',
    checked: 'data-[state=checked]:bg-success data-[state=checked]:text-success-foreground',
    ring: 'focus-visible:ring-success-ring',
  },
  warning: {
    border: 'border-warning',
    checked: 'data-[state=checked]:bg-warning data-[state=checked]:text-warning-foreground',
    ring: 'focus-visible:ring-warning-ring',
  },
  info: {
    border: 'border-info',
    checked: 'data-[state=checked]:bg-info data-[state=checked]:text-info-foreground',
    ring: 'focus-visible:ring-info-ring',
  },
  accent: {
    border: 'border-accent',
    checked: 'data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground',
    ring: 'focus-visible:ring-accent-ring',
  },
};

const sizeClasses: Record<string, { box: string; icon: string }> = {
  sm: { box: 'h-3.5 w-3.5', icon: 'h-2.5 w-2.5' },
  default: { box: 'h-4 w-4', icon: 'h-3 w-3' },
  lg: { box: 'h-5 w-5', icon: 'h-4 w-4' },
};

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      onClick,
      onKeyDown,
      disabled,
      variant = 'default',
      size = 'default',
      ...props
    },
    ref,
  ) => {
    // State management (controlled vs uncontrolled)
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleToggle = React.useCallback(() => {
      if (disabled) return;

      const newChecked = !checked;

      if (!isControlled) {
        setUncontrolledChecked(newChecked);
      }

      onCheckedChange?.(newChecked);
    }, [checked, isControlled, onCheckedChange, disabled]);

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        handleToggle();
        onClick?.(event);
      },
      [handleToggle, onClick],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        // Space key toggles the checkbox (Enter is handled by button click)
        if (event.key === ' ') {
          event.preventDefault();
          handleToggle();
        }
        onKeyDown?.(event);
      },
      [handleToggle, onKeyDown],
    );

    // Get variant and size classes with explicit defaults
    const v = variantClasses[variant] || variantClasses.default;
    const s = sizeClasses[size] || sizeClasses.default;

    // Base styles per docs/COMPONENT_STYLING_REFERENCE.md
    const baseClasses =
      'inline-flex items-center justify-center shrink-0 ' +
      'rounded-sm border ' +
      'transition-colors ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
      'disabled:pointer-events-none disabled:opacity-50';

    const cls = classy(baseClasses, s?.box, v?.border, v?.checked, v?.ring, className);

    return (
      // biome-ignore lint/a11y/useSemanticElements: Custom checkbox with visual styling not possible with native input
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        disabled={disabled}
        ref={ref}
        className={cls}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {checked && (
          <svg
            className={s?.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
