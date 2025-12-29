import * as React from 'react';
import classy from '../../primitives/classy';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean;
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
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

    const toggle = React.useCallback(() => {
      const newChecked = !checked;

      if (!isControlled) {
        setUncontrolledChecked(newChecked);
      }

      onCheckedChange?.(newChecked);
    }, [checked, isControlled, onCheckedChange]);

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        toggle();
        onClick?.(event);
      },
      [disabled, toggle, onClick],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        // Space key toggles the switch (Enter is handled by button click)
        if (event.key === ' ') {
          event.preventDefault();
          if (!disabled) {
            toggle();
          }
        }
        onKeyDown?.(event);
      },
      [disabled, toggle, onKeyDown],
    );

    // Track (background) styles
    const trackClasses = classy(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center',
      'rounded-full border-2 border-transparent',
      'transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      {
        'bg-input': !checked,
        'bg-primary': checked,
      },
      className,
    );

    // Thumb (movable indicator) styles
    const thumbClasses = classy(
      'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0',
      'transition-transform',
      {
        'translate-x-0': !checked,
        'translate-x-5': checked,
      },
    );

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        disabled={disabled}
        ref={ref}
        className={trackClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span className={thumbClasses} />
      </button>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
