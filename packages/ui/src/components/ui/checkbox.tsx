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
}

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

    // Base styles
    const baseClasses =
      'inline-flex items-center justify-center ' +
      'h-4 w-4 shrink-0 ' +
      'rounded-sm ' +
      'border border-primary ' +
      'transition-colors ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
      'disabled:pointer-events-none disabled:opacity-50 ' +
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground';

    const cls = classy(baseClasses, className);

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
            className="h-3 w-3"
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
