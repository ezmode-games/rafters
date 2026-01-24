/**
 * InlineToolbar - Floating toolbar for text formatting on selection
 *
 * @cognitive-load 4/10 - Contextual formatting actions that appear on selection
 * @attention-economics Appears on demand, easy dismissal, non-blocking interaction
 * @trust-building Predictable positioning, clear active states, familiar shortcuts
 * @accessibility Full keyboard support, screen reader announcements, focus management
 * @semantic-meaning Format buttons map to semantic text marks (bold, italic, etc.)
 *
 * @usage-patterns
 * DO: Show on text selection with active format states
 * DO: Position intelligently near selection
 * DO: Allow keyboard navigation through buttons
 * DO: Show shortcuts in tooltips
 * NEVER: Block editing while toolbar is open
 * NEVER: Show on collapsed selection
 *
 * @example
 * ```tsx
 * function Editor() {
 *   const [isVisible, setIsVisible] = useState(false);
 *   const [position, setPosition] = useState({ x: 0, y: 0 });
 *   const [activeFormats, setActiveFormats] = useState<InlineMark[]>([]);
 *
 *   return (
 *     <InlineToolbar
 *       isVisible={isVisible}
 *       position={position}
 *       activeFormats={activeFormats}
 *       onFormat={(format) => applyFormat(format)}
 *       onLink={(url) => insertLink(url)}
 *       onRemoveLink={() => removeLink()}
 *       hasLink={false}
 *     />
 *   );
 * }
 * ```
 */
import type * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classy from '../../primitives/classy';
import type { InlineMark } from '../../primitives/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover } from '../ui/popover';
import { Tooltip } from '../ui/tooltip';

// ============================================================================
// Types
// ============================================================================

export interface InlineToolbarProps {
  /** Whether the toolbar is visible */
  isVisible: boolean;
  /** Position for the toolbar (absolute coordinates) */
  position?: { x: number; y: number };
  /** Currently active format marks */
  activeFormats: InlineMark[];
  /** Called when a format button is clicked */
  onFormat: (format: InlineMark) => void;
  /** Called when a link should be added */
  onLink: (url: string) => void;
  /** Called when a link should be removed */
  onRemoveLink: () => void;
  /** Whether the current selection has a link */
  hasLink: boolean;
  /** Current link URL if selection is in a link */
  linkUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Format Button Configuration
// ============================================================================

interface FormatConfig {
  format: InlineMark;
  label: string;
  icon: React.ReactNode;
  shortcut: string;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
const modKey = isMac ? 'Cmd' : 'Ctrl';

const formatConfigs: FormatConfig[] = [
  {
    format: 'bold',
    label: 'Bold',
    icon: <BoldIcon />,
    shortcut: `${modKey}+B`,
  },
  {
    format: 'italic',
    label: 'Italic',
    icon: <ItalicIcon />,
    shortcut: `${modKey}+I`,
  },
  {
    format: 'code',
    label: 'Code',
    icon: <CodeIcon />,
    shortcut: `${modKey}+E`,
  },
  {
    format: 'strikethrough',
    label: 'Strikethrough',
    icon: <StrikethroughIcon />,
    shortcut: `${modKey}+Shift+S`,
  },
];

// ============================================================================
// Icons (inline SVGs for simplicity)
// ============================================================================

function BoldIcon(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  );
}

function ItalicIcon(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  );
}

function CodeIcon(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function StrikethroughIcon(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <path d="M17 5H7.5A3.5 3.5 0 0 0 4 8.5c0 1.577 1.022 2.916 2.454 3.5" />
      <path d="M7 19h9.5a3.5 3.5 0 0 0 0-7" />
    </svg>
  );
}

function LinkIcon(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function UnlinkIcon(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18.84 12.25l1.72-1.71a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M5.16 11.75l-1.72 1.71a5 5 0 0 0 7.07 7.07l1.72-1.71" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

// ============================================================================
// URL Validation
// ============================================================================

function isValidUrl(urlString: string): boolean {
  if (!urlString.trim()) return false;

  // Allow URLs without protocol (will be prefixed with https://)
  const urlToTest = urlString.startsWith('http') ? urlString : `https://${urlString}`;

  try {
    new URL(urlToTest);
    return true;
  } catch {
    return false;
  }
}

function normalizeUrl(urlString: string): string {
  if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
    return urlString;
  }
  return `https://${urlString}`;
}

// ============================================================================
// Link Popover Component
// ============================================================================

interface LinkPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string) => void;
  initialUrl: string | undefined;
  /** Ref to the button for focus restoration on close */
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

function LinkPopover({
  isOpen,
  onOpenChange,
  onSubmit,
  initialUrl,
  buttonRef,
}: LinkPopoverProps): React.JSX.Element {
  const [url, setUrl] = useState(initialUrl ?? '');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when popover opens
  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl ?? '');
      setError(null);
      // Focus input after a brief delay to allow animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, initialUrl]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      if (!isValidUrl(url)) {
        setError('Please enter a valid URL');
        return;
      }

      onSubmit(normalizeUrl(url));
      onOpenChange(false);
    },
    [url, onSubmit, onOpenChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
        buttonRef.current?.focus();
      }
    },
    [onOpenChange, buttonRef],
  );

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = event.clipboardData.getData('text');
    // If pasted content looks like a URL, auto-submit
    if (isValidUrl(pastedText)) {
      event.preventDefault();
      setUrl(normalizeUrl(pastedText));
      // Don't auto-submit, let user confirm
    }
  }, []);

  return (
    <Popover.Content
      side="bottom"
      align="start"
      sideOffset={8}
      className="w-72 p-2"
      data-testid="link-popover"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label htmlFor="link-url" className="sr-only">
          Link URL
        </label>
        <Input
          ref={inputRef}
          id="link-url"
          type="text"
          placeholder="Enter URL..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          variant={error ? 'destructive' : 'default'}
          size="sm"
          data-testid="link-url-input"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'link-error' : undefined}
        />
        {error && (
          <span id="link-error" className="text-xs text-destructive" role="alert">
            {error}
          </span>
        )}
        <div className="flex gap-1 justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            data-testid="link-cancel"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" data-testid="link-submit">
            Apply
          </Button>
        </div>
      </form>
    </Popover.Content>
  );
}

// ============================================================================
// Format Button Component
// ============================================================================

interface FormatButtonProps {
  config: FormatConfig;
  isActive: boolean;
  onClick: () => void;
}

function FormatButton({ config, isActive, onClick }: FormatButtonProps): React.JSX.Element {
  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          size="icon"
          onClick={onClick}
          aria-pressed={isActive}
          data-testid={`format-${config.format}`}
          className="h-8 w-8"
        >
          {config.icon}
          <span className="sr-only">{config.label}</span>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" sideOffset={4}>
        {config.label} ({config.shortcut})
      </Tooltip.Content>
    </Tooltip>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function InlineToolbar({
  isVisible,
  position,
  activeFormats,
  onFormat,
  onLink,
  onRemoveLink,
  hasLink,
  linkUrl,
  className,
}: InlineToolbarProps): React.JSX.Element | null {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState<{ x: number; y: number } | undefined>(
    undefined,
  );

  // Create a set for fast active format lookups
  const activeFormatsSet = useMemo(() => new Set(activeFormats), [activeFormats]);

  // Check if link format is active
  const isLinkActive = activeFormatsSet.has('link');

  // ========================================================================
  // Close popover when toolbar hides
  // ========================================================================

  useEffect(() => {
    if (!isVisible) {
      setLinkPopoverOpen(false);
    }
  }, [isVisible]);

  // ========================================================================
  // Reset adjusted position when position changes
  // ========================================================================

  useEffect(() => {
    // Reset adjusted position whenever the source position changes
    // This ensures we don't use stale adjusted values
    setAdjustedPosition(undefined);
  }, [position?.x, position?.y]);

  // ========================================================================
  // Position Adjustment
  // ========================================================================

  useEffect(() => {
    if (!isVisible || !position || !toolbarRef.current) {
      return;
    }

    const toolbar = toolbarRef.current;
    const rect = toolbar.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    // Adjust horizontal position if near viewport edges
    if (x + rect.width > viewportWidth - 8) {
      x = viewportWidth - rect.width - 8;
    }
    if (x < 8) {
      x = 8;
    }

    // Flip to below if near top of viewport
    const toolbarAboveY = y - rect.height - 8;
    const toolbarBelowY = y + 24; // Assume ~24px for selection height

    if (toolbarAboveY < 8) {
      // Not enough space above, show below
      y = toolbarBelowY;
    } else if (toolbarBelowY + rect.height > viewportHeight - 8) {
      // Show above
      y = toolbarAboveY;
    } else {
      // Default: show above
      y = toolbarAboveY;
    }

    setAdjustedPosition({ x, y });
  }, [isVisible, position]);

  // ========================================================================
  // Keyboard Navigation
  // ========================================================================

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      // Close toolbar by removing focus
      (document.activeElement as HTMLElement)?.blur?.();
    }

    // Tab navigation is handled by browser
    // Enter/Space handled by button's default behavior
  }, []);

  // ========================================================================
  // Format Handlers
  // ========================================================================

  const handleFormatClick = useCallback(
    (format: InlineMark) => {
      onFormat(format);
    },
    [onFormat],
  );

  const handleLinkSubmit = useCallback(
    (url: string) => {
      onLink(url);
      setLinkPopoverOpen(false);
    },
    [onLink],
  );

  const handleUnlinkClick = useCallback(() => {
    onRemoveLink();
  }, [onRemoveLink]);

  // ========================================================================
  // Render
  // ========================================================================

  if (!isVisible) {
    return null;
  }

  const finalPosition = adjustedPosition ?? position ?? { x: 0, y: 0 };

  const toolbarClasses = classy(
    'fixed z-50 flex items-center gap-0.5 p-1',
    'bg-popover border border-border rounded-lg shadow-lg',
    'animate-in fade-in-0 zoom-in-95',
    className,
  );

  const style: React.CSSProperties = {
    left: `${finalPosition.x}px`,
    top: `${finalPosition.y}px`,
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <div
        ref={toolbarRef}
        role="toolbar"
        aria-label="Text formatting"
        className={toolbarClasses}
        style={style}
        onKeyDown={handleKeyDown}
        data-testid="inline-toolbar"
      >
        {/* Format buttons */}
        {formatConfigs.map((config) => (
          <FormatButton
            key={config.format}
            config={config}
            isActive={activeFormatsSet.has(config.format)}
            onClick={() => handleFormatClick(config.format)}
          />
        ))}

        {/* Separator */}
        <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />

        {/* Link button with popover - Popover.Trigger provides ARIA attributes */}
        <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Popover.Trigger asChild>
                <Button
                  ref={linkButtonRef}
                  variant={isLinkActive ? 'secondary' : 'ghost'}
                  size="icon"
                  aria-pressed={isLinkActive}
                  data-testid="format-link"
                  className="h-8 w-8"
                >
                  <LinkIcon />
                  <span className="sr-only">Link</span>
                </Button>
              </Popover.Trigger>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom" sideOffset={4}>
              Link ({modKey}+K)
            </Tooltip.Content>
          </Tooltip>
          <LinkPopover
            isOpen={linkPopoverOpen}
            onOpenChange={setLinkPopoverOpen}
            onSubmit={handleLinkSubmit}
            initialUrl={linkUrl}
            buttonRef={linkButtonRef}
          />
        </Popover>

        {/* Unlink button - only show when has link */}
        {hasLink && (
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUnlinkClick}
                data-testid="unlink-button"
                className="h-8 w-8"
              >
                <UnlinkIcon />
                <span className="sr-only">Remove link</span>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom" sideOffset={4}>
              Remove link
            </Tooltip.Content>
          </Tooltip>
        )}
      </div>

      {/* Screen reader announcement for toolbar visibility */}
      {/* biome-ignore lint/a11y/useSemanticElements: role="status" with aria-live is correct for screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Text formatting toolbar open
      </div>
    </Tooltip.Provider>
  );
}

InlineToolbar.displayName = 'InlineToolbar';

export default InlineToolbar;
