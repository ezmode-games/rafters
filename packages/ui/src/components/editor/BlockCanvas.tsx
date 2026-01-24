/**
 * BlockCanvas - Main editing surface for block-based editors
 *
 * @cognitive-load 5/10 - Complex state management but familiar canvas pattern
 * @attention-economics Primary editing surface, blocks laid out vertically
 * @trust-building Clear selection indicators, keyboard navigation hints
 * @accessibility Full keyboard support, ARIA live regions for selection changes
 * @semantic-meaning Canvas holds blocks, selection/focus are separate concepts
 *
 * @usage-patterns
 * DO: Use with renderBlock prop to customize block appearance
 * DO: Manage blocks state externally, canvas is controlled
 * DO: Provide keyboard navigation for accessibility
 * NEVER: Mutate blocks array directly, use callbacks
 * NEVER: Mix focus and selection concepts
 *
 * @example
 * ```tsx
 * function Editor() {
 *   const [blocks, setBlocks] = useState<Block[]>([]);
 *   const [selectedIds, setSelectedIds] = useState(new Set<string>());
 *   const [focusedId, setFocusedId] = useState<string>();
 *
 *   return (
 *     <BlockCanvas
 *       blocks={blocks}
 *       selectedIds={selectedIds}
 *       focusedId={focusedId}
 *       onSelectionChange={setSelectedIds}
 *       onFocusChange={setFocusedId}
 *       onBlocksChange={setBlocks}
 *       onBlockAdd={(block, index) => { ... }}
 *       onBlockRemove={(id) => { ... }}
 *       onBlockMove={(id, toIndex) => { ... }}
 *       renderBlock={(block, context) => <BlockWrapper {...context}>{...}</BlockWrapper>}
 *     />
 *   );
 * }
 * ```
 */
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDropZone } from '../../hooks/use-drag-drop';
import classy from '../../primitives/classy';
import { createKeyboardHandler } from '../../primitives/keyboard-handler';

// ============================================================================
// Types
// ============================================================================

/**
 * Block data structure
 */
export interface Block {
  /** Unique block identifier */
  id: string;
  /** Block type (e.g., 'paragraph', 'heading', 'image') */
  type: string;
  /** Block-specific properties */
  props: Record<string, unknown>;
  /** Nested child blocks (for containers) */
  children?: Block[];
}

/**
 * Context provided to block renderers
 */
export interface BlockRenderContext {
  /** Zero-based index in the block list */
  index: number;
  /** Total number of blocks */
  total: number;
  /** Whether this is the first block */
  isFirst: boolean;
  /** Whether this is the last block */
  isLast: boolean;
  /** Whether this block is selected */
  isSelected: boolean;
  /** Whether this block has keyboard focus */
  isFocused: boolean;
}

/**
 * Props for the BlockCanvas component
 */
export interface BlockCanvasProps {
  /** Array of blocks to render */
  blocks: Block[];
  /** Set of selected block IDs */
  selectedIds: Set<string>;
  /** ID of the currently focused block */
  focusedId?: string;
  /** Called when selection changes */
  onSelectionChange: (ids: Set<string>) => void;
  /** Called when focus changes */
  onFocusChange?: (id: string | null) => void;
  /** Called when blocks array changes (reorder, etc.) */
  onBlocksChange: (blocks: Block[]) => void;
  /** Called when a new block should be added */
  onBlockAdd: (block: Block, index: number) => void;
  /** Called when a block should be removed */
  onBlockRemove: (id: string) => void;
  /** Called when a block should be moved */
  onBlockMove: (id: string, toIndex: number) => void;
  /** Render function for individual blocks */
  renderBlock: (block: Block, context: BlockRenderContext) => React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Content to show when there are no blocks */
  emptyState?: React.ReactNode;
}

// ============================================================================
// Drop Indicator Component
// ============================================================================

interface DropIndicatorProps {
  isVisible: boolean;
}

function DropIndicator({ isVisible }: DropIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div
      className="h-0.5 bg-primary rounded-full mx-2 my-1 transition-opacity"
      aria-hidden="true"
    />
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function BlockCanvas({
  blocks,
  selectedIds,
  focusedId,
  onSelectionChange,
  onFocusChange,
  onBlocksChange: _onBlocksChange,
  onBlockAdd: _onBlockAdd,
  onBlockRemove: _onBlockRemove,
  onBlockMove,
  renderBlock,
  className,
  emptyState,
}: BlockCanvasProps): React.JSX.Element {
  // Note: _onBlocksChange, _onBlockAdd, _onBlockRemove are part of the API
  // and will be used by keyboard handlers and other features in future iterations
  void _onBlocksChange;
  void _onBlockAdd;
  void _onBlockRemove;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropTargetIndex, setDropTargetIndex] = React.useState<number | null>(null);

  // Create block ID to index map for efficient lookups
  const blockIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    blocks.forEach((block, index) => {
      map.set(block.id, index);
    });
    return map;
  }, [blocks]);

  // Get focused block index
  const focusedIndex = focusedId ? (blockIndexMap.get(focusedId) ?? -1) : -1;

  // ========================================================================
  // Focus Management
  // ========================================================================

  const moveFocus = useCallback(
    (direction: 'up' | 'down' | 'first' | 'last') => {
      if (blocks.length === 0) return;

      let newIndex: number;

      switch (direction) {
        case 'up':
          newIndex = focusedIndex <= 0 ? 0 : focusedIndex - 1;
          break;
        case 'down':
          newIndex = focusedIndex >= blocks.length - 1 ? blocks.length - 1 : focusedIndex + 1;
          break;
        case 'first':
          newIndex = 0;
          break;
        case 'last':
          newIndex = blocks.length - 1;
          break;
      }

      const newBlock = blocks[newIndex];
      if (newBlock) {
        onFocusChange?.(newBlock.id);
      }
    },
    [blocks, focusedIndex, onFocusChange],
  );

  // ========================================================================
  // Selection Management
  // ========================================================================

  const selectAll = useCallback(() => {
    const allIds = new Set(blocks.map((b) => b.id));
    onSelectionChange(allIds);
  }, [blocks, onSelectionChange]);

  const clearSelection = useCallback(() => {
    onSelectionChange(new Set());
  }, [onSelectionChange]);

  const toggleSelectionOnFocused = useCallback(() => {
    if (!focusedId) return;

    const newSelection = new Set(selectedIds);
    if (newSelection.has(focusedId)) {
      newSelection.delete(focusedId);
    } else {
      newSelection.add(focusedId);
    }
    onSelectionChange(newSelection);
  }, [focusedId, selectedIds, onSelectionChange]);

  const extendSelection = useCallback(
    (direction: 'up' | 'down') => {
      if (blocks.length === 0 || focusedIndex === -1) return;

      const newIndex =
        direction === 'up'
          ? Math.max(0, focusedIndex - 1)
          : Math.min(blocks.length - 1, focusedIndex + 1);

      const newBlock = blocks[newIndex];
      if (!newBlock) return;

      // Add to selection and move focus
      const newSelection = new Set(selectedIds);
      newSelection.add(newBlock.id);
      onSelectionChange(newSelection);
      onFocusChange?.(newBlock.id);
    },
    [blocks, focusedIndex, selectedIds, onSelectionChange, onFocusChange],
  );

  // ========================================================================
  // Keyboard Handling
  // ========================================================================

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // createKeyboardHandler attaches listeners and returns cleanup functions
    const cleanups = [
      // Navigation
      createKeyboardHandler(container, {
        key: 'ArrowUp',
        handler: () => moveFocus('up'),
        preventDefault: true,
      }),
      createKeyboardHandler(container, {
        key: 'ArrowDown',
        handler: () => moveFocus('down'),
        preventDefault: true,
      }),
      createKeyboardHandler(container, {
        key: 'Home',
        handler: () => moveFocus('first'),
        preventDefault: true,
      }),
      createKeyboardHandler(container, {
        key: 'End',
        handler: () => moveFocus('last'),
        preventDefault: true,
      }),
      // Selection extension
      createKeyboardHandler(container, {
        key: 'ArrowUp',
        modifiers: { shift: true },
        handler: () => extendSelection('up'),
        preventDefault: true,
      }),
      createKeyboardHandler(container, {
        key: 'ArrowDown',
        modifiers: { shift: true },
        handler: () => extendSelection('down'),
        preventDefault: true,
      }),
      // Selection actions
      createKeyboardHandler(container, {
        key: 'Escape',
        handler: clearSelection,
        preventDefault: true,
      }),
      createKeyboardHandler(container, {
        key: 'Space',
        handler: toggleSelectionOnFocused,
        preventDefault: true,
      }),
      createKeyboardHandler(container, {
        key: 'Enter',
        handler: toggleSelectionOnFocused,
        preventDefault: true,
      }),
    ];

    // Handle Cmd/Ctrl+A separately since 'a' is not in KeyboardKey type
    const handleSelectAll = (event: KeyboardEvent) => {
      if (event.key === 'a' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        selectAll();
      }
    };
    container.addEventListener('keydown', handleSelectAll);

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
      container.removeEventListener('keydown', handleSelectAll);
    };
  }, [moveFocus, extendSelection, selectAll, clearSelection, toggleSelectionOnFocused]);

  // ========================================================================
  // Click Handling
  // ========================================================================

  const handleBlockClick = useCallback(
    (blockId: string, event: React.MouseEvent) => {
      event.stopPropagation();

      // Update focus
      onFocusChange?.(blockId);

      // Handle selection based on modifiers
      const isMetaOrCtrl = event.metaKey || event.ctrlKey;
      const isShift = event.shiftKey;

      if (isShift && focusedId) {
        // Range selection
        const fromIndex = blockIndexMap.get(focusedId) ?? 0;
        const toIndex = blockIndexMap.get(blockId) ?? 0;
        const start = Math.min(fromIndex, toIndex);
        const end = Math.max(fromIndex, toIndex);

        const rangeIds = new Set<string>();
        for (let i = start; i <= end; i++) {
          const block = blocks[i];
          if (block) {
            rangeIds.add(block.id);
          }
        }
        onSelectionChange(rangeIds);
      } else if (isMetaOrCtrl) {
        // Toggle selection (additive)
        const newSelection = new Set(selectedIds);
        if (newSelection.has(blockId)) {
          newSelection.delete(blockId);
        } else {
          newSelection.add(blockId);
        }
        onSelectionChange(newSelection);
      } else {
        // Single selection
        onSelectionChange(new Set([blockId]));
      }
    },
    [focusedId, blockIndexMap, blocks, selectedIds, onSelectionChange, onFocusChange],
  );

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent) => {
      // Only clear selection if clicking directly on canvas (not on a block)
      if (event.target === event.currentTarget) {
        clearSelection();
        onFocusChange?.(null);
      }
    },
    [clearSelection, onFocusChange],
  );

  // ========================================================================
  // Drop Zone
  // ========================================================================

  const dropZone = useDropZone({
    onDragEnter: () => {},
    onDragLeave: () => {
      setDropTargetIndex(null);
    },
    onDragOver: (data) => {
      // Calculate drop index based on mouse position
      const container = containerRef.current;
      if (!container || !data) return;

      // For now, just show drop at end
      // In a full implementation, we'd calculate based on mouse Y position
      setDropTargetIndex(blocks.length);
    },
    onDrop: (data) => {
      if (!data || dropTargetIndex === null) return;

      const draggedId = data as string;
      const currentIndex = blockIndexMap.get(draggedId);

      if (currentIndex !== undefined && currentIndex !== dropTargetIndex) {
        onBlockMove(draggedId, dropTargetIndex);
      }

      setDropTargetIndex(null);
    },
  });

  // ========================================================================
  // Render
  // ========================================================================

  const containerClasses = classy(
    'relative outline-none min-h-52',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    className,
  );

  // Calculate active descendant for ARIA
  const activeDescendantId = focusedId ? `block-${focusedId}` : undefined;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard events attached via useEffect to container
    <div
      ref={(el) => {
        // Combine refs
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        dropZone.ref(el);
      }}
      className={containerClasses}
      role="listbox"
      aria-label="Block editor canvas"
      aria-multiselectable="true"
      aria-activedescendant={activeDescendantId}
      tabIndex={0}
      onClick={handleCanvasClick}
      data-testid="block-canvas"
    >
      {blocks.length === 0 ? (
        (emptyState ?? (
          <div
            className="flex items-center justify-center h-full min-h-52 text-muted-foreground"
            data-testid="block-canvas-empty"
          >
            No blocks yet
          </div>
        ))
      ) : (
        <>
          {blocks.map((block, index) => {
            const context: BlockRenderContext = {
              index,
              total: blocks.length,
              isFirst: index === 0,
              isLast: index === blocks.length - 1,
              isSelected: selectedIds.has(block.id),
              isFocused: block.id === focusedId,
            };

            return (
              <React.Fragment key={block.id}>
                <DropIndicator isVisible={dropTargetIndex === index} />
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled at container level */}
                {/* biome-ignore lint/a11y/useFocusableInteractive: focus managed via aria-activedescendant on container */}
                <div
                  id={`block-${block.id}`}
                  role="option"
                  aria-selected={context.isSelected}
                  data-block-id={block.id}
                  data-focused={context.isFocused}
                  onClick={(e) => handleBlockClick(block.id, e)}
                  data-testid={`block-${block.id}`}
                >
                  {renderBlock(block, context)}
                </div>
              </React.Fragment>
            );
          })}
          <DropIndicator isVisible={dropTargetIndex === blocks.length} />
        </>
      )}

      {/* Screen reader announcement for selection changes */}
      {/* biome-ignore lint/a11y/useSemanticElements: role="status" with aria-live is correct for screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {selectedIds.size > 0
          ? `${selectedIds.size} block${selectedIds.size === 1 ? '' : 's'} selected`
          : 'No blocks selected'}
      </div>
    </div>
  );
}

BlockCanvas.displayName = 'BlockCanvas';

export default BlockCanvas;
