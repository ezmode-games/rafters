/**
 * BlockWrapper - Wrapper component for each block in block-based editors
 *
 * @cognitive-load 4/10 - Clear visual states, familiar hover patterns
 * @attention-economics Block chrome appears on hover/focus, content is primary
 * @trust-building Clear selection indicators, accessible action menu
 * @accessibility Proper ARIA roles, keyboard navigation, screen reader labels
 * @semantic-meaning Wrapper provides selection, drag, and actions; content is children
 *
 * @usage-patterns
 * DO: Use within BlockCanvas with renderBlock prop
 * DO: Pass all required callbacks for full functionality
 * DO: Keep children focused on content, not wrapper concerns
 * NEVER: Nest BlockWrappers
 * NEVER: Add wrapper-level event handlers that conflict with content
 *
 * @example
 * ```tsx
 * <BlockWrapper
 *   id="block-1"
 *   isSelected={true}
 *   isFocused={false}
 *   isFirst={true}
 *   isLast={false}
 *   onSelect={(additive) => handleSelect(additive)}
 *   onFocus={() => handleFocus()}
 *   onDelete={() => handleDelete()}
 *   onDuplicate={() => handleDuplicate()}
 *   onMoveUp={() => handleMoveUp()}
 *   onMoveDown={() => handleMoveDown()}
 *   draggable
 * >
 *   <ParagraphBlock content="Hello world" />
 * </BlockWrapper>
 * ```
 */
import type * as React from 'react';
import { useCallback, useState } from 'react';
import { useDraggable } from '../../hooks/use-drag-drop';
import classy from '../../primitives/classy';
import { DropdownMenu } from '../ui/dropdown-menu';

// ============================================================================
// Icons
// ============================================================================

/**
 * Grip icon for drag handle
 */
function GripIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="4" r="1.5" />
      <circle cx="11" cy="4" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="11" cy="12" r="1.5" />
    </svg>
  );
}

/**
 * More (three dots) icon for actions menu
 */
function MoreIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="8" cy="3" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="8" cy="13" r="1.5" />
    </svg>
  );
}

// ============================================================================
// Types
// ============================================================================

export interface BlockWrapperProps {
  /** Unique block identifier */
  id: string;
  /** Whether this block is selected */
  isSelected: boolean;
  /** Whether this block has keyboard focus */
  isFocused: boolean;
  /** Whether this is the first block */
  isFirst: boolean;
  /** Whether this is the last block */
  isLast: boolean;
  /** Called when block should be selected */
  onSelect: (additive?: boolean) => void;
  /** Called when block should receive focus */
  onFocus: () => void;
  /** Called when block should be deleted */
  onDelete: () => void;
  /** Called when block should be duplicated */
  onDuplicate: () => void;
  /** Called when block should move up */
  onMoveUp: () => void;
  /** Called when block should move down */
  onMoveDown: () => void;
  /** Whether the block can be dragged */
  draggable?: boolean;
  /** Block content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function BlockWrapper({
  id,
  isSelected,
  isFocused,
  isFirst,
  isLast,
  onSelect,
  onFocus,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  draggable = true,
  children,
  className,
}: BlockWrapperProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Drag handle setup
  const dragHandle = useDraggable({
    data: id,
    onDragStart: () => {
      // Ensure block is selected when drag starts
      if (!isSelected) {
        onSelect();
      }
    },
  });

  // Click handler for selection
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      // Don't handle if clicking on interactive elements
      const target = event.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('[role="menuitem"]') ||
        target.closest('[data-drag-handle]')
      ) {
        return;
      }

      const isAdditive = event.metaKey || event.ctrlKey;
      onSelect(isAdditive);
      onFocus();
    },
    [onSelect, onFocus],
  );

  // Action handlers with event stopping
  // These accept Event (not React.MouseEvent) because DropdownMenu.Item's
  // onSelect callback provides a native Event, not a React SyntheticEvent
  const handleDelete = useCallback(
    (event: Event) => {
      event.stopPropagation();
      onDelete();
    },
    [onDelete],
  );

  const handleDuplicate = useCallback(
    (event: Event) => {
      event.stopPropagation();
      onDuplicate();
    },
    [onDuplicate],
  );

  const handleMoveUp = useCallback(
    (event: Event) => {
      event.stopPropagation();
      if (!isFirst) {
        onMoveUp();
      }
    },
    [isFirst, onMoveUp],
  );

  const handleMoveDown = useCallback(
    (event: Event) => {
      event.stopPropagation();
      if (!isLast) {
        onMoveDown();
      }
    },
    [isLast, onMoveDown],
  );

  // Show chrome on hover, focus, or when menu is open
  const showChrome = isHovered || isFocused || isMenuOpen;

  // Build wrapper classes
  const wrapperClasses = classy(
    'relative group',
    'rounded-md transition-all duration-150',
    // Selection ring
    isSelected && 'ring-2 ring-primary ring-offset-2',
    // Focus ring (uses ring token for proper theming)
    isFocused && !isSelected && 'ring-2 ring-ring ring-offset-2',
    // Both selected and focused
    isFocused &&
      isSelected &&
      'ring-2 ring-primary ring-offset-2 outline outline-2 outline-ring outline-offset-4',
    className,
  );

  // Handle classes
  const handleClasses = classy(
    'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full',
    'flex items-center justify-center',
    'min-h-11 min-w-11 mr-1',
    'text-muted-foreground hover:text-foreground',
    'cursor-grab active:cursor-grabbing',
    'opacity-0 transition-opacity duration-150',
    showChrome && 'opacity-100',
  );

  // Menu button classes
  const menuButtonClasses = classy(
    'absolute right-0 top-1/2 -translate-y-1/2 translate-x-full',
    'flex items-center justify-center',
    'min-h-11 min-w-11 ml-1',
    'rounded hover:bg-muted',
    'text-muted-foreground hover:text-foreground',
    'opacity-0 transition-opacity duration-150',
    showChrome && 'opacity-100',
  );

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled at BlockCanvas level
    // biome-ignore lint/a11y/noStaticElementInteractions: wrapper div for selection, not semantic button
    <div
      data-block-wrapper={id}
      data-selected={isSelected}
      data-focused={isFocused}
      className={wrapperClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      data-testid={`block-wrapper-${id}`}
    >
      {/* Drag handle - pointer-only interaction, screen readers use actions menu */}
      {draggable && (
        <div
          ref={dragHandle.ref}
          data-drag-handle
          className={handleClasses}
          aria-hidden="true"
          data-testid={`block-drag-handle-${id}`}
        >
          <GripIcon className="w-4 h-4" />
        </div>
      )}

      {/* Block content */}
      <div className="relative">{children}</div>

      {/* Actions menu */}
      <DropdownMenu onOpenChange={setIsMenuOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className={menuButtonClasses}
            aria-label="Block actions"
            data-testid={`block-menu-${id}`}
          >
            <MoreIcon className="w-4 h-4" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start" side="right">
          <DropdownMenu.Item onSelect={handleDuplicate}>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={handleMoveUp} disabled={isFirst}>
            Move up
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleMoveDown} disabled={isLast}>
            Move down
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            className="text-destructive focus:text-destructive"
            onSelect={handleDelete}
          >
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}

BlockWrapper.displayName = 'BlockWrapper';

export default BlockWrapper;
