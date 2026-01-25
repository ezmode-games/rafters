/**
 * Editor toolbar component with undo/redo and formatting controls
 *
 * @cognitive-load 4/10 - Familiar toolbar pattern with clear action icons
 * @attention-economics Primary actions (undo/redo) positioned first, formatting grouped logically
 * @trust-building Disabled states clearly indicate unavailable actions, tooltips explain functionality
 * @accessibility Full keyboard support, aria-labels for screen readers, focus management
 * @semantic-meaning Undo/redo for history navigation, formatting buttons for text styling
 *
 * @usage-patterns
 * DO: Use with useHistory hook for undo/redo state management
 * DO: Provide formatting callbacks for text editing functionality
 * DO: Position toolbar above or inline with editor content
 * NEVER: Use without proper history state management
 * NEVER: Hide essential formatting options without alternative access
 *
 * @example
 * ```tsx
 * const history = useHistory({ initialState: '' });
 *
 * <EditorToolbar
 *   history={history}
 *   onBold={() => applyFormat('bold')}
 *   onItalic={() => applyFormat('italic')}
 * />
 * ```
 */
import * as React from 'react';
import type { UseHistoryReturn } from '../../hooks/use-history';
import classy from '../../primitives/classy';
import { Button } from '../ui/button';
import { Tooltip } from '../ui/tooltip';

// ============================================================================
// Types
// ============================================================================

export interface EditorToolbarProps {
  /** History state and controls from useHistory hook */
  history: UseHistoryReturn<unknown>;
  /** Callback for bold formatting action */
  onBold?: () => void;
  /** Callback for italic formatting action */
  onItalic?: () => void;
  /** Callback for underline formatting action */
  onUnderline?: () => void;
  /** Callback for strikethrough formatting action */
  onStrikethrough?: () => void;
  /** Callback for link insertion action */
  onLink?: () => void;
  /** Callback for code formatting action */
  onCode?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Detect if running on macOS for keyboard shortcut display
 */
function isMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.platform?.toLowerCase().includes('mac') ?? false;
}

/**
 * Get the modifier key symbol for the current platform
 */
function getModifierKey(): string {
  return isMac() ? 'Cmd' : 'Ctrl';
}

// ============================================================================
// Icons
// ============================================================================

function UndoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

function RedoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
    </svg>
  );
}

function BoldIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  );
}

function ItalicIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  );
}

function UnderlineIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M6 4v6a6 6 0 0 0 12 0V4" />
      <line x1="4" y1="20" x2="20" y2="20" />
    </svg>
  );
}

function StrikethroughIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M16 4H9a3 3 0 0 0-2.83 4" />
      <path d="M14 12a4 4 0 0 1 0 8H6" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

// ============================================================================
// Toolbar Button Component
// ============================================================================

interface ToolbarButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  label: string;
  shortcut?: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, disabled, label, shortcut, children }: ToolbarButtonProps) {
  const tooltipContent = shortcut ? `${label} (${shortcut})` : label;

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          aria-disabled={disabled ? 'true' : undefined}
          className="h-11 w-11"
        >
          {children}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" sideOffset={4}>
        {tooltipContent}
      </Tooltip.Content>
    </Tooltip>
  );
}

// ============================================================================
// Separator Component
// ============================================================================

function ToolbarSeparator() {
  // Using <hr> for semantic separator - the separator role is implicit
  return <hr className="mx-1 h-6 w-px border-0 bg-border" aria-orientation="vertical" />;
}

// ============================================================================
// Main Component
// ============================================================================

export function EditorToolbar({
  history,
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onLink,
  onCode,
  className,
}: EditorToolbarProps): React.JSX.Element {
  const { state, undo, redo } = history;
  const { canUndo, canRedo } = state;

  const mod = getModifierKey();
  const iconClasses = 'h-4 w-4';

  const handleUndo = React.useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = React.useCallback(() => {
    redo();
  }, [redo]);

  // Check if any formatting buttons are provided
  const hasFormattingButtons =
    onBold !== undefined ||
    onItalic !== undefined ||
    onUnderline !== undefined ||
    onStrikethrough !== undefined ||
    onLink !== undefined ||
    onCode !== undefined;

  const containerClasses = classy(
    'flex items-center gap-0.5 rounded-md border bg-background p-1',
    '@container',
    className,
  );

  return (
    <Tooltip.Provider delayDuration={300}>
      <div
        className={containerClasses}
        role="toolbar"
        aria-label="Editor toolbar"
        data-testid="editor-toolbar"
      >
        {/* History Controls */}
        {/* biome-ignore lint/a11y/useSemanticElements: fieldset inappropriate for toolbar visual design */}
        <div className="flex items-center gap-0.5" role="group" aria-label="History controls">
          <ToolbarButton
            onClick={handleUndo}
            disabled={!canUndo}
            label="Undo"
            shortcut={`${mod}+Z`}
          >
            <UndoIcon className={iconClasses} />
          </ToolbarButton>

          <ToolbarButton
            onClick={handleRedo}
            disabled={!canRedo}
            label="Redo"
            shortcut={`${mod}+Shift+Z`}
          >
            <RedoIcon className={iconClasses} />
          </ToolbarButton>
        </div>

        {/* Separator between history and formatting */}
        {hasFormattingButtons && <ToolbarSeparator />}

        {/* Formatting Controls */}
        {hasFormattingButtons && (
          // biome-ignore lint/a11y/useSemanticElements: fieldset inappropriate for toolbar visual design
          <div className="flex items-center gap-0.5" role="group" aria-label="Formatting controls">
            {onBold && (
              <ToolbarButton onClick={onBold} label="Bold" shortcut={`${mod}+B`}>
                <BoldIcon className={iconClasses} />
              </ToolbarButton>
            )}

            {onItalic && (
              <ToolbarButton onClick={onItalic} label="Italic" shortcut={`${mod}+I`}>
                <ItalicIcon className={iconClasses} />
              </ToolbarButton>
            )}

            {onUnderline && (
              <ToolbarButton onClick={onUnderline} label="Underline" shortcut={`${mod}+U`}>
                <UnderlineIcon className={iconClasses} />
              </ToolbarButton>
            )}

            {onStrikethrough && (
              <ToolbarButton
                onClick={onStrikethrough}
                label="Strikethrough"
                shortcut={`${mod}+Shift+S`}
              >
                <StrikethroughIcon className={iconClasses} />
              </ToolbarButton>
            )}

            {onLink && (
              <ToolbarButton onClick={onLink} label="Insert link" shortcut={`${mod}+K`}>
                <LinkIcon className={iconClasses} />
              </ToolbarButton>
            )}

            {onCode && (
              <ToolbarButton onClick={onCode} label="Code" shortcut={`${mod}+E`}>
                <CodeIcon className={iconClasses} />
              </ToolbarButton>
            )}
          </div>
        )}
      </div>
    </Tooltip.Provider>
  );
}

EditorToolbar.displayName = 'EditorToolbar';

export default EditorToolbar;
