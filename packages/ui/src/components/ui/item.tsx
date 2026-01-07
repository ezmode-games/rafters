/**
 * Generic list item component for menus, lists, and selection interfaces
 *
 * @cognitive-load 3/10 - Familiar list pattern with clear visual states and predictable behavior
 * @attention-economics Secondary selection: Selected state draws focus, disabled reduces prominence. Icon slot provides visual anchoring for quick scanning.
 * @trust-building Consistent hover/focus/selected states build predictable interaction patterns. Clear disabled state prevents user confusion.
 * @accessibility Proper aria-selected for selection, aria-disabled for disabled state, keyboard navigation support, focus-visible for keyboard users
 * @semantic-meaning Building block for: menu items (navigation/actions), list items (content/data), option items (selection interfaces)
 *
 * @usage-patterns
 * DO: Use as building block for menu items, list items, selection options
 * DO: Include icons on the left for quick visual scanning
 * DO: Add description for secondary information or context
 * DO: Use selected state for current/active items in navigation
 * DO: Use disabled state for unavailable options with clear visual feedback
 * NEVER: Use for primary actions (use Button instead)
 * NEVER: Nest interactive elements within Item
 * NEVER: Use Item without a container (list, menu, etc.)
 *
 * @example
 * ```tsx
 * // Basic list item
 * <Item>Settings</Item>
 *
 * // With icon and description
 * <Item
 *   icon={<UserIcon className="h-4 w-4" />}
 *   description="Manage your account settings"
 * >
 *   Profile
 * </Item>
 *
 * // Selected state for navigation
 * <Item selected icon={<HomeIcon className="h-4 w-4" />}>
 *   Dashboard
 * </Item>
 *
 * // Disabled option
 * <Item disabled icon={<LockIcon className="h-4 w-4" />}>
 *   Admin Panel
 * </Item>
 *
 * // Interactive item with handler
 * <Item onClick={handleSelect} icon={<SettingsIcon className="h-4 w-4" />}>
 *   Settings
 * </Item>
 * ```
 */
import * as React from 'react';
import classy from '../../primitives/classy';

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element displayed before the item content */
  icon?: React.ReactNode;
  /** Secondary description text displayed below the main content */
  description?: React.ReactNode;
  /** Whether the item is in a selected/active state */
  selected?: boolean;
  /** Whether the item is disabled and non-interactive */
  disabled?: boolean;
  /** Visual size variant */
  size?: 'default' | 'sm' | 'lg';
}

const sizeClasses: Record<string, string> = {
  default: 'px-3 py-2 text-sm',
  sm: 'px-2 py-1.5 text-xs',
  lg: 'px-4 py-3 text-base',
};

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      icon,
      description,
      selected = false,
      disabled = false,
      size = 'default',
      className,
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const base =
      'flex items-center gap-3 rounded-md cursor-default select-none outline-none';

    // State styles following design token patterns
    const stateStyles = disabled
      ? 'opacity-50 pointer-events-none text-muted-foreground'
      : selected
        ? 'bg-accent text-accent-foreground'
        : 'text-foreground hover:bg-accent hover:text-accent-foreground';

    // Focus styles for keyboard navigation
    const focusStyles =
      'focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1';

    // Motion with reduced motion support
    const motionStyles =
      'transition-colors duration-fast motion-reduce:transition-none';

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        // Simulate click for keyboard activation
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        event.currentTarget.dispatchEvent(clickEvent);
      }
      onKeyDown?.(event);
    };

    const cls = classy(
      base,
      sizeClasses[size] ?? sizeClasses.default,
      stateStyles,
      focusStyles,
      motionStyles,
      className,
    );

    return (
      <div
        ref={ref}
        role="option"
        tabIndex={disabled ? undefined : 0}
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        data-selected={selected ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={cls}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {icon && (
          <span className="shrink-0 text-current" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate">{children}</span>
          {description && (
            <span className="truncate text-muted-foreground text-xs mt-0.5">
              {description}
            </span>
          )}
        </span>
      </div>
    );
  },
);

Item.displayName = 'Item';

export default Item;
