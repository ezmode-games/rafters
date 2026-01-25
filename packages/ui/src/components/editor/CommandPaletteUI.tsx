/**
 * Command palette UI component for rendering slash command menus
 *
 * @cognitive-load 5/10 - Familiar command palette pattern with clear visual hierarchy
 * @attention-economics Commands grouped by category, matched text highlighted
 * @trust-building Clear selection state, keyboard navigation, empty state messaging
 * @accessibility Role="listbox" with role="option" items, aria-activedescendant for focus
 * @semantic-meaning Slash command menu for quick access to editor actions
 *
 * @usage-patterns
 * DO: Use with useCommandPalette hook for state management
 * DO: Position near the cursor/trigger location
 * DO: Provide meaningful command labels and descriptions
 * NEVER: Use without proper keyboard navigation support
 * NEVER: Render outside viewport bounds
 *
 * @example
 * ```tsx
 * const palette = useCommandPalette({ commands, trigger: '/' });
 *
 * <CommandPaletteUI
 *   isOpen={palette.state.isOpen}
 *   commands={palette.state.filteredCommands}
 *   selectedIndex={palette.state.selectedIndex}
 *   searchQuery={palette.state.query}
 *   onSelect={(cmd) => cmd.action()}
 *   onClose={palette.close}
 *   onQueryChange={palette.setQuery}
 *   onNavigate={(dir) => dir === 'up' ? palette.selectPrevious() : palette.selectNext()}
 *   position={{ x: 100, y: 200 }}
 * />
 * ```
 */
import * as React from 'react';
import { useCallback, useEffect, useId, useRef } from 'react';
import classy from '../../primitives/classy';
import type { Command } from '../../primitives/types';
import { Input } from '../ui/input';

// ============================================================================
// Types
// ============================================================================

export interface CommandPaletteUIProps {
  /** Whether the palette is open */
  isOpen: boolean;
  /** Filtered commands to display */
  commands: Command[];
  /** Index of the selected command (-1 for none) */
  selectedIndex: number;
  /** Current search query */
  searchQuery: string;
  /** Callback when a command is selected */
  onSelect: (command: Command) => void;
  /** Callback when the palette should close */
  onClose: () => void;
  /** Callback when the search query changes */
  onQueryChange: (query: string) => void;
  /** Callback for keyboard navigation */
  onNavigate: (direction: 'up' | 'down') => void;
  /** Position for the palette (absolute positioning) */
  position?: { x: number; y: number };
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Group commands by category
 */
function groupByCategory(commands: Command[]): Map<string, Command[]> {
  const groups = new Map<string, Command[]>();

  for (const command of commands) {
    const category = command.category ?? 'Commands';
    const existing = groups.get(category);
    if (existing) {
      existing.push(command);
    } else {
      groups.set(category, [command]);
    }
  }

  return groups;
}

/**
 * Highlight matched text in a string
 */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      {before}
      <mark className="bg-accent text-accent-foreground rounded px-0.5">{match}</mark>
      {after}
    </>
  );
}

/**
 * Calculate position with viewport bounds checking
 */
function getConstrainedPosition(
  position: { x: number; y: number },
  width: number,
  height: number,
): { x: number; y: number; flipped: boolean } {
  if (typeof window === 'undefined') {
    return { ...position, flipped: false };
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const padding = 8;

  let x = position.x;
  let y = position.y;
  let flipped = false;

  // Check right edge
  if (x + width > viewportWidth - padding) {
    x = Math.max(padding, viewportWidth - width - padding);
  }

  // Check bottom edge - flip to above if needed
  if (y + height > viewportHeight - padding) {
    y = position.y - height;
    flipped = true;
  }

  // Ensure not off top
  if (y < padding) {
    y = padding;
  }

  // Ensure not off left
  if (x < padding) {
    x = padding;
  }

  return { x, y, flipped };
}

// ============================================================================
// Command Item Component
// ============================================================================

interface CommandItemProps {
  command: Command;
  isSelected: boolean;
  searchQuery: string;
  onSelect: (command: Command) => void;
  id: string;
}

function CommandItem({ command, isSelected, searchQuery, onSelect, id }: CommandItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  // Scroll into view when selected
  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isSelected]);

  const handleClick = useCallback(() => {
    onSelect(command);
  }, [command, onSelect]);

  const itemClasses = classy(
    'flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md transition-colors',
    isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <div
      ref={itemRef}
      id={id}
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
      className={itemClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-testid={`command-item-${command.id}`}
    >
      {/* Icon */}
      {command.icon && (
        <span className="flex-shrink-0 w-5 h-5 text-muted-foreground" aria-hidden="true">
          {command.icon}
        </span>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{highlightMatch(command.label, searchQuery)}</div>
        {command.description && (
          <div className="text-sm text-muted-foreground truncate">
            {highlightMatch(command.description, searchQuery)}
          </div>
        )}
      </div>

      {/* Shortcut */}
      {command.shortcut && (
        <kbd className="flex-shrink-0 px-1.5 py-0.5 text-xs bg-muted rounded border text-muted-foreground">
          {command.shortcut}
        </kbd>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function CommandPaletteUI({
  isOpen,
  commands,
  selectedIndex,
  searchQuery,
  onSelect,
  onClose,
  onQueryChange,
  onNavigate,
  position = { x: 0, y: 0 },
  className,
}: CommandPaletteUIProps): React.JSX.Element | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Calculate constrained position
  const [constrainedPos, setConstrainedPos] = React.useState({ x: 0, y: 0, flipped: false });

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setConstrainedPos(getConstrainedPosition(position, rect.width, rect.height));
    }
  }, [isOpen, position]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onNavigate('up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          onNavigate('down');
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && commands[selectedIndex]) {
            onSelect(commands[selectedIndex]);
          }
          break;
      }
    },
    [commands, selectedIndex, onClose, onNavigate, onSelect],
  );

  // Handle input change
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onQueryChange(event.target.value);
    },
    [onQueryChange],
  );

  // Don't render if closed
  if (!isOpen) {
    return null;
  }

  // Group commands by category
  const groupedCommands = groupByCategory(commands);

  // Calculate the active descendant ID
  const activeDescendantId =
    selectedIndex >= 0 && commands[selectedIndex]
      ? `${listboxId}-option-${commands[selectedIndex].id}`
      : undefined;

  const containerClasses = classy(
    'fixed z-50 w-72 max-h-80 overflow-hidden rounded-lg border bg-popover shadow-lg',
    'flex flex-col',
    className,
  );

  // Calculate flat index for mapping selectedIndex to items
  let flatIndex = 0;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className={containerClasses}
      style={{
        left: constrainedPos.x,
        top: constrainedPos.y,
      }}
      onKeyDown={handleKeyDown}
      data-testid="command-palette"
    >
      {/* Search Input */}
      <div className="p-2 border-b">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Type to search..."
          value={searchQuery}
          onChange={handleInputChange}
          className="h-8"
          aria-label="Search commands"
          aria-controls={listboxId}
          aria-activedescendant={activeDescendantId}
          data-testid="command-palette-input"
        />
      </div>

      {/* Command List */}
      <div
        id={listboxId}
        role="listbox"
        aria-label="Commands"
        className="flex-1 overflow-y-auto p-1"
        data-testid="command-palette-list"
      >
        {commands.length === 0 ? (
          <div
            className="px-3 py-6 text-center text-sm text-muted-foreground"
            data-testid="command-palette-empty"
          >
            No commands found
          </div>
        ) : (
          Array.from(groupedCommands.entries()).map(([category, categoryCommands]) => (
            // biome-ignore lint/a11y/useSemanticElements: fieldset not appropriate for listbox group styling
            <div key={category} role="group" aria-label={category}>
              {/* Category Header */}
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {category}
              </div>

              {/* Category Commands */}
              {categoryCommands.map((command) => {
                const isSelected = flatIndex === selectedIndex;
                const itemId = `${listboxId}-option-${command.id}`;
                flatIndex++;

                return (
                  <CommandItem
                    key={command.id}
                    command={command}
                    isSelected={isSelected}
                    searchQuery={searchQuery}
                    onSelect={onSelect}
                    id={itemId}
                  />
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

CommandPaletteUI.displayName = 'CommandPaletteUI';

export default CommandPaletteUI;
