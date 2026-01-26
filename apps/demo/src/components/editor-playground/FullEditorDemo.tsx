/**
 * Full Editor Demo - Complete WYSIWYG block editor with all components
 */

import {
  type Block,
  BlockCanvas,
  type BlockRenderContext,
  BlockSidebar,
  BlockWrapper,
  CommandPaletteUI,
  EditorToolbar,
  InlineToolbar,
} from '@rafters/ui/components/editor';
import { Tooltip } from '@rafters/ui/components/ui/tooltip';
import { useDropZone } from '@rafters/ui/hooks/use-drag-drop';
import { useHistory } from '@rafters/ui/hooks/use-history';
import type { Command, InlineMark } from '@rafters/ui/primitives/types';
import type * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type BlockType,
  blockRegistry,
  createSampleBlocks,
  defaultBlockProps,
  generateBlockId,
} from './blocks';

// ============================================================================
// Editable Block Content
// ============================================================================

interface EditableBlockContentProps {
  block: Block;
  onContentChange: (content: string) => void;
  onPropChange: (propKey: string, value: unknown) => void;
  onSlashCommand: (position: { x: number; y: number }) => void;
  onSelectionChange: (hasSelection: boolean, rect?: DOMRect) => void;
  isFocused: boolean;
}

function EditableBlockContent({
  block,
  onContentChange,
  onPropChange,
  onSlashCommand,
  onSelectionChange,
  isFocused,
}: EditableBlockContentProps): React.JSX.Element {
  const editableRef = useRef<HTMLDivElement>(null);
  const props = block.props as Record<string, unknown>;
  const initializedRef = useRef(false);
  const blockIdRef = useRef(block.id);

  // Get the content key based on block type
  const getContentKey = useCallback(() => {
    if (block.type === 'code') return 'code';
    if (block.type === 'image') return 'caption';
    return 'content';
  }, [block.type]);

  // Initialize content only once per block
  useEffect(() => {
    const el = editableRef.current;
    if (!el) return;

    // Reset if block ID changed (different block now)
    if (blockIdRef.current !== block.id) {
      blockIdRef.current = block.id;
      initializedRef.current = false;
    }

    // Only set content on initial mount or when block changes
    if (!initializedRef.current) {
      const contentKey = getContentKey();
      const content = (props[contentKey] as string) ?? '';
      el.textContent = content;
      initializedRef.current = true;
    }
  }, [block.id, getContentKey, props]);

  // Handle input changes - debounced to avoid too many state updates
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const text = target.textContent ?? '';
      onContentChange(text);
    },
    [onContentChange],
  );

  // Handle keydown for slash command and stop propagation for typing
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Stop propagation for normal typing keys to prevent BlockCanvas handlers
      // from intercepting (e.g., Space toggles selection, Enter toggles selection)
      if (
        e.key === ' ' ||
        e.key === 'Enter' ||
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        (e.key.length === 1 && !e.metaKey && !e.ctrlKey)
      ) {
        e.stopPropagation();
      }

      // Also stop arrow keys when editing to allow cursor movement
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.stopPropagation();
      }

      if (e.key === '/') {
        // Get cursor position for command palette
        const selection = window.getSelection();
        const el = editableRef.current;

        let position = { x: 100, y: 100 }; // fallback position

        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          // Use rect if it has valid dimensions, otherwise use element position
          if (rect.width > 0 || rect.height > 0 || (rect.left > 0 && rect.top > 0)) {
            position = { x: rect.left, y: rect.bottom + 4 };
          } else if (el) {
            // Fallback to element position
            const elRect = el.getBoundingClientRect();
            position = { x: elRect.left, y: elRect.top + 24 };
          }
        } else if (el) {
          // No selection, use element position
          const elRect = el.getBoundingClientRect();
          position = { x: elRect.left, y: elRect.top + 24 };
        }

        // Delay to allow the "/" to be typed first
        setTimeout(() => {
          onSlashCommand(position);
        }, 0);
      }
    },
    [onSlashCommand],
  );

  // Handle selection changes for inline toolbar
  const handleSelect = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      onSelectionChange(true, rect);
    } else {
      onSelectionChange(false);
    }
  }, [onSelectionChange]);

  // Focus the editable when block is focused and place cursor at end
  useEffect(() => {
    if (isFocused && editableRef.current) {
      const el = editableRef.current;
      el.focus();

      // Place cursor at end of content
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false); // false = collapse to end
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [isFocused]);

  // Common editable props - note: no children, content set via useEffect
  const editableProps = {
    ref: editableRef,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onInput: handleInput,
    onKeyDown: handleKeyDown,
    onSelect: handleSelect,
    onBlur: () => onSelectionChange(false),
    'data-placeholder': 'Type something, or press / for commands...',
  };

  // Create editable label props for form inputs
  const createEditableLabelProps = (propKey: string) => ({
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLLabelElement | HTMLSpanElement>) => {
      const text = e.currentTarget.textContent ?? '';
      onPropChange(propKey, text);
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      // Prevent enter from creating new lines, just blur instead
      if (e.key === 'Enter') {
        e.preventDefault();
        (e.currentTarget as HTMLElement).blur();
      }
      // Stop propagation to prevent block-level handlers
      e.stopPropagation();
    },
  });

  switch (block.type) {
    case 'text':
      return (
        <p
          {...editableProps}
          className="text-base leading-relaxed min-h-6 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:italic"
        />
      );

    case 'heading': {
      const level = (props.level as string) || '2';
      const sizeClasses: Record<string, string> = {
        '1': 'text-4xl font-bold',
        '2': 'text-3xl font-bold',
        '3': 'text-2xl font-semibold',
        '4': 'text-xl font-semibold',
        '5': 'text-lg font-medium',
        '6': 'text-base font-medium',
      };
      return (
        <div
          {...editableProps}
          data-placeholder="Heading..."
          className={`${sizeClasses[level]} min-h-8 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:italic`}
        />
      );
    }

    case 'image': {
      const url = props.url as string;
      const alt = props.alt as string;
      return (
        <figure className="space-y-2">
          {url ? (
            <img src={url} alt={alt || 'Image'} className="max-w-full rounded-md" />
          ) : (
            <div className="h-40 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
              Click to add image URL in properties panel
            </div>
          )}
          <figcaption
            {...editableProps}
            data-placeholder="Add a caption..."
            className="text-sm text-muted-foreground text-center outline-none empty:before:content-[attr(data-placeholder)] empty:before:italic"
          />
        </figure>
      );
    }

    case 'code': {
      const language = props.language as string;
      return (
        <div className="rounded-md overflow-hidden">
          <div className="bg-muted px-3 py-1 text-xs text-muted-foreground font-mono border-b">
            {language || 'code'}
          </div>
          <pre
            {...editableProps}
            data-placeholder="// Enter code here..."
            className="bg-muted/50 p-4 overflow-x-auto text-sm font-mono outline-none whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:italic"
          />
        </div>
      );
    }

    case 'divider': {
      const variant = (props.variant as string) || 'solid';
      const borderStyle =
        variant === 'dashed' ? 'dashed' : variant === 'dotted' ? 'dotted' : 'solid';
      return <hr className="my-4 border-border" style={{ borderStyle }} />;
    }

    case 'quote': {
      const attribution = props.attribution as string;
      return (
        <blockquote className="border-l-4 border-primary pl-4 py-2">
          <p
            {...editableProps}
            data-placeholder="Enter quote..."
            className="text-lg italic outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
          />
          {attribution && <cite className="text-sm text-muted-foreground">- {attribution}</cite>}
        </blockquote>
      );
    }

    case 'callout': {
      const variant = (props.variant as string) || 'info';
      const title = (props.title as string) || 'Note';
      const collapsible = (props.collapsible as boolean) || false;

      // Variant styles mapping
      const variantStyles: Record<
        string,
        { bg: string; border: string; icon: string; iconBg: string }
      > = {
        info: {
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        },
        warning: {
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-200 dark:border-amber-800',
          icon: 'text-amber-600 dark:text-amber-400',
          iconBg: 'bg-amber-100 dark:bg-amber-900/50',
        },
        error: {
          bg: 'bg-red-50 dark:bg-red-950/30',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-100 dark:bg-red-900/50',
        },
        success: {
          bg: 'bg-green-50 dark:bg-green-950/30',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          iconBg: 'bg-green-100 dark:bg-green-900/50',
        },
        note: {
          bg: 'bg-purple-50 dark:bg-purple-950/30',
          border: 'border-purple-200 dark:border-purple-800',
          icon: 'text-purple-600 dark:text-purple-400',
          iconBg: 'bg-purple-100 dark:bg-purple-900/50',
        },
      };

      const styles = variantStyles[variant] || variantStyles.info;

      // Variant icons (decorative, so aria-hidden)
      const icons: Record<string, React.ReactNode> = {
        info: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        warning: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ),
        error: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        success: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        note: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        ),
      };

      return (
        <div className={`rounded-lg border ${styles.bg} ${styles.border} overflow-hidden`}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-inherit">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${styles.iconBg} ${styles.icon}`}
            >
              {icons[variant] || icons.info}
            </div>
            <span className="font-semibold text-foreground">{title}</span>
            {collapsible && (
              <button
                type="button"
                className="ml-auto p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  // Toggle collapse state - for demo purposes, we just log
                  console.log('Toggle collapse');
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
          {/* Content */}
          <div className="px-4 py-3">
            <div
              {...editableProps}
              data-placeholder="Enter callout content..."
              className="text-sm leading-relaxed outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:italic"
            />
          </div>
        </div>
      );
    }

    // Form Input Blocks
    case 'input': {
      const label = (props.label as string) || 'Label';
      const placeholder = (props.placeholder as string) || '';
      const inputType = (props.type as string) || 'text';
      const required = (props.required as boolean) || false;
      const disabled = (props.disabled as boolean) || false;
      const inputId = `${block.id}-input`;

      return (
        <div className="space-y-2">
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1"
            {...createEditableLabelProps('label')}
          >
            {label}
          </label>
          {required && <span className="text-destructive ml-1">*</span>}
          <input
            id={inputId}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      );
    }

    case 'textarea': {
      const label = (props.label as string) || 'Label';
      const placeholder = (props.placeholder as string) || '';
      const rows = parseInt((props.rows as string) || '3', 10);
      const required = (props.required as boolean) || false;
      const textareaId = `${block.id}-textarea`;

      return (
        <div className="space-y-2">
          <label
            htmlFor={textareaId}
            className="text-sm font-medium leading-none outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1"
            {...createEditableLabelProps('label')}
          >
            {label}
          </label>
          {required && <span className="text-destructive ml-1">*</span>}
          <textarea
            id={textareaId}
            placeholder={placeholder}
            rows={rows}
            className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      );
    }

    case 'checkbox': {
      const label = (props.label as string) || 'Checkbox';
      const description = (props.description as string) || '';
      const defaultChecked = (props.defaultChecked as boolean) || false;
      const disabled = (props.disabled as boolean) || false;
      const checkboxId = `${block.id}-checkbox`;

      return (
        <div className="flex items-start gap-3">
          <input
            id={checkboxId}
            type="checkbox"
            defaultChecked={defaultChecked}
            disabled={disabled}
            className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="space-y-1">
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium leading-none outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1"
              {...createEditableLabelProps('label')}
            >
              {label}
            </label>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
      );
    }

    case 'select': {
      const label = (props.label as string) || 'Label';
      const placeholder = (props.placeholder as string) || 'Select an option';
      const optionsStr = (props.options as string) || '';
      const options = optionsStr
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
      const required = (props.required as boolean) || false;
      const selectId = `${block.id}-select`;

      return (
        <div className="space-y-2">
          <label
            htmlFor={selectId}
            className="text-sm font-medium leading-none outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1"
            {...createEditableLabelProps('label')}
          >
            {label}
          </label>
          {required && <span className="text-destructive ml-1">*</span>}
          <select
            id={selectId}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    case 'switch': {
      const label = (props.label as string) || 'Toggle';
      const description = (props.description as string) || '';
      const defaultChecked = (props.defaultChecked as boolean) || false;
      const disabled = (props.disabled as boolean) || false;
      const switchId = `${block.id}-switch`;

      return (
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span
              id={`${switchId}-label`}
              className="text-sm font-medium leading-none outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1"
              {...createEditableLabelProps('label')}
            >
              {label}
            </span>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={defaultChecked}
            aria-labelledby={`${switchId}-label`}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${defaultChecked ? 'bg-primary' : 'bg-input'}`}
          >
            <span
              className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${defaultChecked ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>
      );
    }

    case 'slider': {
      const label = (props.label as string) || 'Value';
      const min = (props.min as number) ?? 0;
      const max = (props.max as number) ?? 100;
      const step = (props.step as number) ?? 1;
      const defaultValue = (props.defaultValue as number) ?? 50;
      const sliderId = `${block.id}-slider`;

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor={sliderId}
              className="text-sm font-medium leading-none outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-1 -mx-1"
              {...createEditableLabelProps('label')}
            >
              {label}
            </label>
            <span className="text-sm text-muted-foreground">{defaultValue}</span>
          </div>
          <input
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            defaultValue={defaultValue}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
          />
        </div>
      );
    }

    default:
      return (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          Unknown block type: {block.type}
        </div>
      );
  }
}

// ============================================================================
// Full Editor Demo
// ============================================================================

export function FullEditorDemo(): React.JSX.Element {
  // Block state with history
  const history = useHistory<Block[]>({
    initialState: createSampleBlocks(),
  });
  const blocks = history.state.current;

  // Selection and focus state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pendingBlockId, setPendingBlockId] = useState<string | null>(null);

  // Command palette state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandPalettePosition, setCommandPalettePosition] = useState({ x: 0, y: 0 });
  const [commandQuery, setCommandQuery] = useState('');
  const [commandSelectedIndex, setCommandSelectedIndex] = useState(0);

  // Inline toolbar state
  const [inlineToolbarVisible, setInlineToolbarVisible] = useState(false);
  const [inlineToolbarPosition, setInlineToolbarPosition] = useState({ x: 0, y: 0 });
  const [activeFormats, setActiveFormats] = useState<InlineMark[]>([]);

  // Command palette commands
  const commands: Command[] = useMemo(
    () =>
      blockRegistry.blocks.map((block) => ({
        id: block.type,
        label: block.label,
        description: block.description,
        category: blockRegistry.categories.find((c) => c.id === block.category)?.label ?? 'Blocks',
        action: () => {
          // Insert new block
          const newBlock: Block = {
            id: generateBlockId(),
            type: block.type,
            props: { ...(defaultBlockProps[block.type as BlockType] ?? {}) },
          };
          const insertIndex = focusedId
            ? blocks.findIndex((b) => b.id === focusedId) + 1
            : blocks.length;
          const newBlocks = [...blocks];
          newBlocks.splice(insertIndex, 0, newBlock);
          history.push(newBlocks);
          setSelectedIds(new Set([newBlock.id]));
          setFocusedId(newBlock.id);
          setCommandPaletteOpen(false);
        },
      })),
    [blocks, focusedId, history],
  );

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!commandQuery) return commands;
    const q = commandQuery.toLowerCase().replace(/^\//, '');
    return commands.filter(
      (cmd) => cmd.label.toLowerCase().includes(q) || cmd.description?.toLowerCase().includes(q),
    );
  }, [commands, commandQuery]);

  // Block manipulation callbacks
  const handleBlocksChange = useCallback(
    (newBlocks: Block[]) => {
      history.push(newBlocks);
    },
    [history],
  );

  const handleBlockAdd = useCallback(
    (block: Block, index: number) => {
      const newBlocks = [...blocks];
      newBlocks.splice(index, 0, block);
      history.push(newBlocks);
    },
    [blocks, history],
  );

  const handleBlockRemove = useCallback(
    (id: string) => {
      const newBlocks = blocks.filter((b) => b.id !== id);
      history.push(newBlocks);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (focusedId === id) {
        setFocusedId(undefined);
      }
    },
    [blocks, focusedId, history],
  );

  const handleBlockMove = useCallback(
    (id: string, toIndex: number) => {
      const fromIndex = blocks.findIndex((b) => b.id === id);
      if (fromIndex === -1 || fromIndex === toIndex) return;

      const newBlocks = [...blocks];
      const [moved] = newBlocks.splice(fromIndex, 1);
      if (!moved) return;
      const insertIndex = toIndex > fromIndex ? toIndex - 1 : toIndex;
      newBlocks.splice(insertIndex, 0, moved);
      history.push(newBlocks);
    },
    [blocks, history],
  );

  // Drop zone for block reordering
  const lastDragPositionRef = useRef<{ clientY: number } | null>(null);

  // Track drag position at document level
  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      lastDragPositionRef.current = { clientY: event.clientY };
    };
    document.addEventListener('dragover', handleDragOver);
    return () => document.removeEventListener('dragover', handleDragOver);
  }, []);

  const dropZone = useDropZone({
    onDragEnter: () => {},
    onDragLeave: () => setDropTargetIndex(null),
    onDragOver: () => {
      // Note: We can't read drag data during dragover (browser security restriction)
      // So we always calculate the drop index - the actual data check happens in onDrop
      const container = canvasRef.current;
      const lastPos = lastDragPositionRef.current;
      if (!container || !lastPos) return;

      const pointerY = lastPos.clientY;
      const blockElements = container.querySelectorAll('[data-block-id]');

      let targetIndex = blocks.length;
      for (let i = 0; i < blockElements.length; i += 1) {
        const blockEl = blockElements.item(i);
        if (blockEl instanceof HTMLElement) {
          const rect = blockEl.getBoundingClientRect();
          if (pointerY < rect.top + rect.height / 2) {
            targetIndex = i;
            break;
          }
        }
      }
      setDropTargetIndex(targetIndex);
    },
    onDrop: (data) => {
      // Check if this is a new block from sidebar
      const isNewBlock =
        typeof data === 'object' &&
        data !== null &&
        (data as { type?: string }).type === 'new-block';

      // Use dropTargetIndex if available, otherwise insert at end
      const insertIndex = dropTargetIndex ?? blocks.length;

      if (isNewBlock) {
        // Insert new block from sidebar
        const blockType = (data as { blockType: string }).blockType;
        const newBlock: Block = {
          id: generateBlockId(),
          type: blockType,
          props: { ...(defaultBlockProps[blockType as BlockType] ?? {}) },
        };
        handleBlockAdd(newBlock, insertIndex);
        setSelectedIds(new Set([newBlock.id]));
        setFocusedId(newBlock.id);
      } else if (draggedBlockId && dropTargetIndex !== null) {
        // Reorder existing block(s)
        if (selectedIds.size > 1 && selectedIds.has(draggedBlockId)) {
          const selectedInOrder = blocks.filter((b) => selectedIds.has(b.id)).map((b) => b.id);
          for (const blockId of selectedInOrder) {
            handleBlockMove(blockId, dropTargetIndex);
          }
        } else {
          handleBlockMove(draggedBlockId, dropTargetIndex);
        }
        // Clear selection after reorder
        setSelectedIds(new Set());
      }

      setDropTargetIndex(null);
    },
  });

  const handleSelectionChange = useCallback((ids: Set<string>) => {
    setSelectedIds(ids);
  }, []);

  const handleFocusChange = useCallback(
    (id: string | null) => {
      // If leaving a pending block, check if it's empty and remove it
      if (pendingBlockId && pendingBlockId !== id) {
        const pendingBlock = blocks.find((b) => b.id === pendingBlockId);
        if (pendingBlock) {
          const content = (pendingBlock.props.content as string) ?? '';
          if (!content.trim()) {
            // Remove empty pending block
            const newBlocks = blocks.filter((b) => b.id !== pendingBlockId);
            history.push(newBlocks);
          }
        }
        setPendingBlockId(null);
      }
      setFocusedId(id ?? undefined);
    },
    [blocks, history, pendingBlockId],
  );

  // Handle canvas click - clear focus when clicking outside blocks
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-block-id]') || target.closest('[data-testid="command-palette"]')) {
      return;
    }

    // Clear focus and selection when clicking on canvas background
    setSelectedIds(new Set());
    setFocusedId(undefined);
  }, []);

  // Handle keyboard events on canvas container - Escape clears focus
  const handleCanvasKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSelectedIds(new Set());
      setFocusedId(undefined);
    }
  }, []);

  // Sidebar insert handler
  const handleInsert = useCallback(
    (blockType: string) => {
      const newBlock: Block = {
        id: generateBlockId(),
        type: blockType,
        props: { ...(defaultBlockProps[blockType as BlockType] ?? {}) },
      };
      const insertIndex = focusedId
        ? blocks.findIndex((b) => b.id === focusedId) + 1
        : blocks.length;
      handleBlockAdd(newBlock, insertIndex);
      setSelectedIds(new Set([newBlock.id]));
      setFocusedId(newBlock.id);
    },
    [blocks, focusedId, handleBlockAdd],
  );

  // Block content change handler (for WYSIWYG editing)
  const handleBlockContentChange = useCallback(
    (blockId: string, content: string) => {
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;

      // Determine which prop to update based on block type
      let propKey = 'content';
      if (block.type === 'code') propKey = 'code';
      if (block.type === 'image') propKey = 'caption';

      const newBlocks = blocks.map((b) =>
        b.id === blockId ? { ...b, props: { ...b.props, [propKey]: content } } : b,
      );
      history.push(newBlocks);
    },
    [blocks, history],
  );

  // Generic prop change handler for any block property
  const handleBlockPropChange = useCallback(
    (blockId: string, propKey: string, value: unknown) => {
      const newBlocks = blocks.map((b) =>
        b.id === blockId ? { ...b, props: { ...b.props, [propKey]: value } } : b,
      );
      history.push(newBlocks);
    },
    [blocks, history],
  );

  // Slash command handler (from within a block)
  const handleSlashCommand = useCallback((blockId: string, position: { x: number; y: number }) => {
    setFocusedId(blockId);
    setCommandPalettePosition(position);
    setCommandPaletteOpen(true);
    setCommandQuery('/');
    setCommandSelectedIndex(0);
  }, []);

  // Canvas-level slash command (when no blocks or canvas has focus)
  const handleCanvasSlashCommand = useCallback((position: { x: number; y: number }) => {
    setCommandPalettePosition(position);
    setCommandPaletteOpen(true);
    setCommandQuery('/');
    setCommandSelectedIndex(0);
  }, []);

  // Text selection handler for inline toolbar
  const handleTextSelection = useCallback((hasSelection: boolean, rect?: DOMRect) => {
    if (hasSelection && rect) {
      setInlineToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
      setInlineToolbarVisible(true);
    } else {
      setInlineToolbarVisible(false);
    }
  }, []);

  // Command palette handlers
  const handleCommandSelect = useCallback((command: Command) => {
    command.action?.();
    setCommandPaletteOpen(false);
    setCommandQuery('');
  }, []);

  const handleCommandClose = useCallback(() => {
    setCommandPaletteOpen(false);
    setCommandQuery('');
  }, []);

  const handleCommandNavigate = useCallback(
    (direction: 'up' | 'down') => {
      setCommandSelectedIndex((prev) => {
        if (direction === 'up') {
          return Math.max(0, prev - 1);
        }
        return Math.min(filteredCommands.length - 1, prev + 1);
      });
    },
    [filteredCommands.length],
  );

  // Inline toolbar handlers
  const handleFormat = useCallback((format: InlineMark) => {
    setActiveFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format],
    );

    if (format === 'bold') {
      document.execCommand('bold');
    } else if (format === 'italic') {
      document.execCommand('italic');
    } else if (format === 'code') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const code = document.createElement('code');
        code.className = 'bg-muted px-1 rounded text-sm font-mono';
        range.surroundContents(code);
      }
    } else if (format === 'strikethrough') {
      document.execCommand('strikeThrough');
    }
  }, []);

  const handleLink = useCallback((url: string) => {
    document.execCommand('createLink', false, url);
  }, []);

  const handleRemoveLink = useCallback(() => {
    document.execCommand('unlink');
  }, []);

  // Block wrapper action handlers
  const createBlockActions = useCallback(
    (block: Block, index: number) => ({
      onSelect: (additive?: boolean) => {
        if (additive) {
          setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(block.id)) {
              next.delete(block.id);
            } else {
              next.add(block.id);
            }
            return next;
          });
        } else {
          setSelectedIds(new Set([block.id]));
        }
      },
      onFocus: () => setFocusedId(block.id),
      onDelete: () => handleBlockRemove(block.id),
      onDuplicate: () => {
        const newBlock: Block = {
          id: generateBlockId(),
          type: block.type,
          props: { ...block.props },
        };
        handleBlockAdd(newBlock, index + 1);
      },
      onMoveUp: () => {
        if (index > 0) {
          handleBlockMove(block.id, index - 1);
        }
      },
      onMoveDown: () => {
        if (index < blocks.length - 1) {
          handleBlockMove(block.id, index + 2);
        }
      },
      onDragStart: () => setDraggedBlockId(block.id),
      onDragEnd: () => setDraggedBlockId(null),
    }),
    [blocks.length, handleBlockAdd, handleBlockMove, handleBlockRemove],
  );

  // Render block with wrapper and editable content
  const renderBlock = useCallback(
    (block: Block, context: BlockRenderContext): React.ReactNode => {
      const actions = createBlockActions(block, context.index);
      return (
        <BlockWrapper
          id={block.id}
          isSelected={context.isSelected}
          isFocused={context.isFocused}
          isFirst={context.isFirst}
          isLast={context.isLast}
          {...actions}
          draggable
        >
          <div className="p-4">
            <EditableBlockContent
              block={block}
              onContentChange={(content) => handleBlockContentChange(block.id, content)}
              onPropChange={(propKey, value) => handleBlockPropChange(block.id, propKey, value)}
              onSlashCommand={(pos) => handleSlashCommand(block.id, pos)}
              onSelectionChange={handleTextSelection}
              isFocused={context.isFocused}
            />
          </div>
        </BlockWrapper>
      );
    },
    [
      createBlockActions,
      handleBlockContentChange,
      handleBlockPropChange,
      handleSlashCommand,
      handleTextSelection,
    ],
  );

  // Close command palette on click outside
  useEffect(() => {
    if (!commandPaletteOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking inside the command palette
      if (target.closest('[data-testid="command-palette"]')) {
        return;
      }
      setCommandPaletteOpen(false);
      setCommandQuery('');
    };

    // Use setTimeout to avoid the click that triggered the palette from closing it
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [commandPaletteOpen]);

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex-shrink-0 p-4 border-b">
          <EditorToolbar
            history={history}
            onBold={() => handleFormat('bold')}
            onItalic={() => handleFormat('italic')}
            onCode={() => handleFormat('code')}
            onStrikethrough={() => handleFormat('strikethrough')}
            onLink={() => {
              const url = prompt('Enter URL:');
              if (url) handleLink(url);
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <div className="flex-shrink-0 border-r">
            <BlockSidebar
              registry={blockRegistry}
              onInsert={handleInsert}
              collapsed={sidebarCollapsed}
              onCollapse={setSidebarCollapsed}
            />
          </div>

          {/* Canvas */}
          <section
            ref={dropZone.ref}
            aria-label="Editor canvas"
            className="flex-1 overflow-y-auto overflow-x-clip py-8 pl-16 pr-8"
            onClick={handleCanvasClick}
            onKeyDown={handleCanvasKeyDown}
          >
            <div ref={canvasRef} className="max-w-3xl mx-auto">
              <BlockCanvas
                blocks={blocks}
                selectedIds={selectedIds}
                focusedId={focusedId}
                dropTargetIndex={dropTargetIndex}
                onSelectionChange={handleSelectionChange}
                onFocusChange={handleFocusChange}
                onBlocksChange={handleBlocksChange}
                onBlockAdd={handleBlockAdd}
                onBlockRemove={handleBlockRemove}
                onBlockMove={handleBlockMove}
                renderBlock={renderBlock}
                onSlashCommand={handleCanvasSlashCommand}
                onCanvasClick={handleCanvasClick}
                emptyState={
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <p className="text-lg mb-2">No blocks yet</p>
                    <p className="text-sm">Use the sidebar or type / for commands</p>
                  </div>
                }
              />
            </div>
          </section>
        </div>

        {/* Command Palette */}
        <CommandPaletteUI
          isOpen={commandPaletteOpen}
          commands={filteredCommands}
          selectedIndex={commandSelectedIndex}
          searchQuery={commandQuery}
          onSelect={handleCommandSelect}
          onClose={handleCommandClose}
          onQueryChange={setCommandQuery}
          onNavigate={handleCommandNavigate}
          position={commandPalettePosition}
        />

        {/* Inline Toolbar */}
        <InlineToolbar
          isVisible={inlineToolbarVisible}
          position={inlineToolbarPosition}
          activeFormats={activeFormats}
          onFormat={handleFormat}
          onLink={handleLink}
          onRemoveLink={handleRemoveLink}
          hasLink={activeFormats.includes('link')}
        />
      </div>
    </Tooltip.Provider>
  );
}

export default FullEditorDemo;
