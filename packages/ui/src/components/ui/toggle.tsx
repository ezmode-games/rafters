/**
 * Toggle button component for stateful button interactions
 *
 * @cognitive-load 2/10 - Clear binary state with button affordance
 * @attention-economics State toggle: pressed state visually distinct, immediate feedback
 * @trust-building Immediate visual feedback, reversible action, clear pressed/unpressed state
 * @accessibility aria-pressed state, keyboard toggle (Space/Enter), visible focus ring
 * @semantic-meaning Binary toggle button: on=active/enabled, off=inactive/disabled
 *
 * @usage-patterns
 * DO: Use for toolbar buttons that toggle features (bold, italic, etc.)
 * DO: Use for view mode toggles (grid/list view)
 * DO: Make pressed state visually distinct
 * DO: Use icons with text labels for clarity
 * NEVER: Use for form submissions, use for navigation
 *
 * @example
 * ```tsx
 * <Toggle aria-label="Toggle bold">
 *   <Bold className="h-4 w-4" />
 * </Toggle>
 * ```
 */
import * as React from 'react';
import classy from '../../primitives/classy';

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'default' | 'outline';
  /** Size variant */
  size?: 'default' | 'sm' | 'lg';
  /** Controlled pressed state */
  pressed?: boolean;
  /** Default pressed state for uncontrolled usage */
  defaultPressed?: boolean;
  /** Callback when pressed state changes */
  onPressedChange?: (pressed: boolean) => void;
  /** Render as child element (polymorphic) */
  asChild?: boolean;
}

const variantClasses: Record<string, string> = {
  default: 'bg-transparent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  outline:
    'border border-input bg-transparent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
};

const sizeClasses: Record<string, string> = {
  default: 'h-10 px-3',
  sm: 'h-9 px-2.5',
  lg: 'h-11 px-5',
};

export function Toggle({
  className,
  variant = 'default',
  size = 'default',
  pressed: controlledPressed,
  defaultPressed = false,
  onPressedChange,
  asChild = false,
  onClick,
  ...props
}: ToggleProps) {
  // State management (controlled vs uncontrolled)
  const [uncontrolledPressed, setUncontrolledPressed] = React.useState(defaultPressed);
  const isControlled = controlledPressed !== undefined;
  const pressed = isControlled ? controlledPressed : uncontrolledPressed;

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !pressed;

      if (!isControlled) {
        setUncontrolledPressed(newPressed);
      }

      onPressedChange?.(newPressed);
      onClick?.(event);
    },
    [pressed, isControlled, onPressedChange, onClick],
  );

  // Base styles following the component styling reference
  const baseClasses =
    'inline-flex items-center justify-center ' +
    'rounded-md ' +
    'text-sm font-medium ' +
    'transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    'hover:bg-muted hover:text-muted-foreground';

  const cls = classy(
    baseClasses,
    variantClasses[variant] ?? '',
    sizeClasses[size] ?? '',
    className,
  );

  const buttonProps = {
    'aria-pressed': pressed,
    'data-state': pressed ? 'on' : 'off',
    className: cls,
    onClick: handleClick,
    ...props,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, buttonProps as Partial<unknown>);
  }

  return (
    <button type="button" {...buttonProps}>
      {props.children}
    </button>
  );
}

Toggle.displayName = 'Toggle';

export default Toggle;
