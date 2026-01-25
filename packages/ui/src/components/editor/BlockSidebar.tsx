/**
 * BlockSidebar - Sidebar showing available blocks grouped by category
 *
 * @cognitive-load 4/10 - Organized categories, search filtering reduces overwhelm
 * @attention-economics Category headers for scanning, search for direct access
 * @trust-building Predictable grouping, consistent drag behavior, keyboard accessible
 * @accessibility Full keyboard navigation, ARIA labels, screen reader announcements
 * @semantic-meaning Sidebar provides block discovery, categories organize by function
 *
 * @usage-patterns
 * DO: Use with BlockCanvas for drag-to-insert workflow
 * DO: Provide meaningful categories with clear labels
 * DO: Include keywords for better search discoverability
 * NEVER: Hide frequently used blocks in collapsed categories
 * NEVER: Use ambiguous block labels
 *
 * @example
 * ```tsx
 * const registry = {
 *   blocks: [
 *     { type: 'paragraph', label: 'Paragraph', category: 'text' },
 *     { type: 'heading', label: 'Heading', category: 'text' },
 *     { type: 'image', label: 'Image', category: 'media' },
 *   ],
 *   categories: [
 *     { id: 'text', label: 'Text', order: 1 },
 *     { id: 'media', label: 'Media', order: 2 },
 *   ],
 * };
 *
 * <BlockSidebar
 *   registry={registry}
 *   onInsert={(type) => addBlock(type)}
 *   recentlyUsed={['paragraph', 'heading']}
 * />
 * ```
 */
import type * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useDraggable } from '../../hooks/use-drag-drop';
import classy from '../../primitives/classy';
import { type FuzzyMatchResult, fuzzyMatch } from '../../primitives/command-palette';
import { Accordion } from '../ui/accordion';
import { Input } from '../ui/input';

// ============================================================================
// Types
// ============================================================================

/**
 * Definition of a block type available in the sidebar
 */
export interface BlockDefinition {
  /** Unique block type identifier */
  type: string;
  /** Display label */
  label: string;
  /** Optional description for tooltip/details */
  description?: string;
  /** Icon name or URL */
  icon?: string;
  /** Category this block belongs to */
  category: string;
  /** Additional search keywords */
  keywords?: string[];
}

/**
 * Registry of available blocks and their categories
 */
export interface BlockRegistry {
  /** All available block definitions */
  blocks: BlockDefinition[];
  /** Category definitions with display info */
  categories: { id: string; label: string; order?: number }[];
}

/**
 * Props for the BlockSidebar component
 */
export interface BlockSidebarProps {
  /** Registry of blocks and categories */
  registry: BlockRegistry;
  /** Called when a block should be inserted */
  onInsert: (blockType: string, index?: number) => void;
  /** Recently used block types (shown at top) */
  recentlyUsed?: string[];
  /** Additional CSS classes */
  className?: string;
  /** Whether sidebar is collapsed to icon-only view */
  collapsed?: boolean;
  /** Called when collapse state changes */
  onCollapse?: (collapsed: boolean) => void;
}

// ============================================================================
// Internal Types
// ============================================================================

interface BlockItemProps {
  block: BlockDefinition;
  onInsert: (blockType: string) => void;
  searchQuery?: string;
  matchIndices?: number[] | undefined;
}

interface CategorySectionProps {
  categoryId: string;
  categoryLabel: string;
  blocks: BlockDefinition[];
  onInsert: (blockType: string) => void;
  searchQuery?: string;
  blockMatchIndices?: Map<string, number[]>;
}

// ============================================================================
// Icons
// ============================================================================

/**
 * Default block icon (placeholder)
 */
function DefaultBlockIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="14" height="14" rx="2" fill="none" stroke="currentColor" />
      <line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="7" y1="10" x2="11" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Search icon
 */
function SearchIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" strokeWidth="1.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Collapse/expand icon
 */
function ChevronIcon({
  className,
  direction = 'left',
}: {
  className?: string;
  direction?: 'left' | 'right';
}): React.JSX.Element {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      style={{ transform: direction === 'right' ? 'rotate(180deg)' : undefined }}
    >
      <polyline points="10,3 5,8 10,13" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Highlight matched characters in text
 */
function HighlightedText({
  text,
  indices,
}: {
  text: string;
  indices: number[];
}): React.JSX.Element {
  if (indices.length === 0) {
    return <span>{text}</span>;
  }

  const indicesSet = new Set(indices);
  const parts: React.ReactNode[] = [];
  let currentPart = '';
  let isHighlighted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const shouldHighlight = indicesSet.has(i);

    if (shouldHighlight !== isHighlighted) {
      if (currentPart) {
        parts.push(
          isHighlighted ? (
            <mark key={`${parts.length}-mark`} className="bg-yellow-200 text-yellow-900 rounded">
              {currentPart}
            </mark>
          ) : (
            <span key={`${parts.length}-span`}>{currentPart}</span>
          ),
        );
      }
      currentPart = char ?? '';
      isHighlighted = shouldHighlight;
    } else {
      currentPart += char ?? '';
    }
  }

  // Add remaining part
  if (currentPart) {
    parts.push(
      isHighlighted ? (
        <mark key={`${parts.length}-mark`} className="bg-yellow-200 text-yellow-900 rounded">
          {currentPart}
        </mark>
      ) : (
        <span key={`${parts.length}-span`}>{currentPart}</span>
      ),
    );
  }

  return <>{parts}</>;
}

/**
 * Individual block item (draggable and clickable)
 */
function BlockItem({ block, onInsert, matchIndices = [] }: BlockItemProps): React.JSX.Element {
  const draggable = useDraggable({
    data: { type: 'new-block', blockType: block.type },
  });

  const handleClick = useCallback(() => {
    onInsert(block.type);
  }, [block.type, onInsert]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onInsert(block.type);
      }
    },
    [block.type, onInsert],
  );

  const itemClasses = classy(
    'flex items-center gap-2 p-2',
    'rounded-md cursor-pointer',
    'hover:bg-muted',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'transition-colors duration-150',
    draggable.isDragging && 'opacity-50',
  );

  return (
    <div
      ref={draggable.ref}
      className={itemClasses}
      role="option"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-testid={`block-item-${block.type}`}
      draggable="true"
    >
      <div className="flex-shrink-0 text-muted-foreground">
        {block.icon ? (
          <img src={block.icon} alt="" className="w-5 h-5" aria-hidden="true" />
        ) : (
          <DefaultBlockIcon className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          <HighlightedText text={block.label} indices={matchIndices} />
        </div>
        {block.description && (
          <div className="text-xs text-muted-foreground truncate">{block.description}</div>
        )}
      </div>
    </div>
  );
}

/**
 * Category section with expandable accordion
 */
function CategorySection({
  categoryId,
  categoryLabel,
  blocks,
  onInsert,
  blockMatchIndices = new Map(),
}: CategorySectionProps): React.JSX.Element {
  return (
    <Accordion.Item value={categoryId} data-testid={`category-${categoryId}`}>
      <Accordion.Trigger className="text-sm font-medium px-2">{categoryLabel}</Accordion.Trigger>
      <Accordion.Content>
        <div className="space-y-1 py-1" role="listbox" aria-label={`${categoryLabel} blocks`}>
          {blocks.map((block) => (
            <BlockItem
              key={block.type}
              block={block}
              onInsert={onInsert}
              matchIndices={blockMatchIndices.get(block.type)}
            />
          ))}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function BlockSidebar({
  registry,
  onInsert,
  recentlyUsed = [],
  className,
  collapsed = false,
  onCollapse,
}: BlockSidebarProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Sort categories by order
  const sortedCategories = useMemo(() => {
    return [...registry.categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [registry.categories]);

  // Get recently used blocks
  const recentBlocks = useMemo(() => {
    const blockMap = new Map(registry.blocks.map((b) => [b.type, b]));
    return recentlyUsed
      .map((type) => blockMap.get(type))
      .filter((b): b is BlockDefinition => b !== undefined);
  }, [registry.blocks, recentlyUsed]);

  // Filter blocks based on search query
  const { filteredBlocks, matchResults, blockScores } = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        filteredBlocks: registry.blocks,
        matchResults: new Map<string, FuzzyMatchResult>(),
        blockScores: new Map<string, number>(),
      };
    }

    const results = new Map<string, FuzzyMatchResult>();
    const scores = new Map<string, number>();
    const filtered: BlockDefinition[] = [];

    for (const block of registry.blocks) {
      // Search in label, description, and keywords separately to find best match
      const labelResult = fuzzyMatch(block.label, searchQuery);
      const descResult = block.description ? fuzzyMatch(block.description, searchQuery) : null;
      const keywordResults = (block.keywords ?? []).map((kw) => fuzzyMatch(kw, searchQuery));

      // Find the best score across all fields
      let bestScore = labelResult.matches ? labelResult.score : 0;
      if (descResult?.matches && descResult.score > bestScore) {
        bestScore = descResult.score;
      }
      for (const kwResult of keywordResults) {
        if (kwResult.matches && kwResult.score > bestScore) {
          bestScore = kwResult.score;
        }
      }

      // Check if any field matched
      const hasMatch =
        labelResult.matches || descResult?.matches || keywordResults.some((r) => r.matches);

      if (hasMatch) {
        // Store label result for highlighting (even if score is 0, indices may be useful)
        results.set(block.type, labelResult);
        scores.set(block.type, bestScore);
        filtered.push(block);
      }
    }

    // Sort by best score
    filtered.sort((a, b) => {
      const scoreA = scores.get(a.type) ?? 0;
      const scoreB = scores.get(b.type) ?? 0;
      return scoreB - scoreA;
    });

    return { filteredBlocks: filtered, matchResults: results, blockScores: scores };
  }, [searchQuery, registry.blocks]);

  // Suppress unused variable warning - blockScores used for sorting
  void blockScores;

  // Filtered blocks by category
  const filteredBlocksByCategory = useMemo(() => {
    const grouped = new Map<string, BlockDefinition[]>();
    for (const block of filteredBlocks) {
      const existing = grouped.get(block.category) ?? [];
      existing.push(block);
      grouped.set(block.category, existing);
    }
    return grouped;
  }, [filteredBlocks]);

  // Handle search input
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSearchKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSearchQuery('');
    }
  }, []);

  // Handle insert
  const handleInsert = useCallback(
    (blockType: string) => {
      onInsert(blockType);
    },
    [onInsert],
  );

  // Handle collapse toggle
  const handleCollapseToggle = useCallback(() => {
    onCollapse?.(!collapsed);
  }, [collapsed, onCollapse]);

  // Build match indices map for each block
  const blockMatchIndices = useMemo(() => {
    const indices = new Map<string, number[]>();
    for (const [type, result] of matchResults) {
      indices.set(type, result.indices);
    }
    return indices;
  }, [matchResults]);

  // Get uncategorized blocks (blocks whose category is not in registry.categories)
  const uncategorizedBlocks = useMemo(() => {
    const categoryIds = new Set(registry.categories.map((c) => c.id));
    return filteredBlocks.filter((block) => !categoryIds.has(block.category));
  }, [filteredBlocks, registry.categories]);

  // Sidebar container classes - use CSS group-hover for smooth hover expansion
  const sidebarClasses = classy(
    'group flex flex-col h-full',
    'bg-background border-r border-border',
    'transition-all duration-200',
    collapsed ? 'w-12 hover:w-64' : 'w-64',
    className,
  );

  // Empty registry state
  if (registry.blocks.length === 0) {
    return (
      <div className={sidebarClasses} data-testid="block-sidebar">
        <div className="flex-1 flex items-center justify-center p-4 text-muted-foreground text-sm">
          No blocks available
        </div>
      </div>
    );
  }

  // Collapsed state - show expand button, content shown on hover via CSS
  if (collapsed) {
    return (
      <div className={sidebarClasses} data-testid="block-sidebar" data-collapsed="true">
        {/* Expand button - always visible in collapsed state */}
        {onCollapse && (
          <button
            type="button"
            className="min-h-11 min-w-11 p-3 hover:bg-muted transition-colors flex-shrink-0"
            onClick={handleCollapseToggle}
            aria-label="Expand sidebar"
          >
            <ChevronIcon direction="right" className="w-4 h-4 mx-auto" />
          </button>
        )}
        {/* Content hidden when collapsed, shown on hover via CSS group-hover */}
        <div className="hidden group-hover:flex flex-col flex-1 overflow-hidden border-t border-border">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search blocks..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="pl-8 h-8"
                aria-label="Search blocks"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <Accordion
              type="multiple"
              value={expandedCategories}
              onValueChange={(value) => setExpandedCategories(value as string[])}
            >
              {sortedCategories.map((category) => {
                const blocks = filteredBlocksByCategory.get(category.id);
                if (!blocks || blocks.length === 0) return null;

                return (
                  <CategorySection
                    key={category.id}
                    categoryId={category.id}
                    categoryLabel={category.label}
                    blocks={blocks}
                    onInsert={handleInsert}
                    blockMatchIndices={blockMatchIndices}
                  />
                );
              })}
              {uncategorizedBlocks.length > 0 && (
                <CategorySection
                  categoryId="uncategorized"
                  categoryLabel="Other"
                  blocks={uncategorizedBlocks}
                  onInsert={handleInsert}
                  blockMatchIndices={blockMatchIndices}
                />
              )}
            </Accordion>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={sidebarClasses} data-testid="block-sidebar">
      {/* Header with search and collapse */}
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="pl-8 h-8"
            aria-label="Search blocks"
            data-testid="block-search-input"
          />
        </div>
        {onCollapse && (
          <button
            type="button"
            className="min-h-11 min-w-11 p-1.5 rounded hover:bg-muted transition-colors"
            onClick={handleCollapseToggle}
            aria-label="Collapse sidebar"
          >
            <ChevronIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {searchQuery && filteredBlocks.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8" data-testid="no-results">
            No blocks found
          </div>
        ) : searchQuery ? (
          // Show flat list when searching
          <div className="space-y-1" role="listbox" aria-label="Search results">
            {filteredBlocks.map((block) => (
              <BlockItem
                key={block.type}
                block={block}
                onInsert={handleInsert}
                searchQuery={searchQuery}
                matchIndices={blockMatchIndices.get(block.type)}
              />
            ))}
          </div>
        ) : (
          // Show categorized list
          <Accordion
            type="multiple"
            value={expandedCategories}
            onValueChange={(value) => setExpandedCategories(value as string[])}
          >
            {/* Recently used section */}
            {recentBlocks.length > 0 && (
              <div className="mb-2">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                  Recently Used
                </div>
                <div className="space-y-1" role="listbox" aria-label="Recently used blocks">
                  {recentBlocks.map((block) => (
                    <BlockItem key={block.type} block={block} onInsert={handleInsert} />
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {sortedCategories.map((category) => {
              const blocks = filteredBlocksByCategory.get(category.id);
              if (!blocks || blocks.length === 0) return null;

              return (
                <CategorySection
                  key={category.id}
                  categoryId={category.id}
                  categoryLabel={category.label}
                  blocks={blocks}
                  onInsert={handleInsert}
                  blockMatchIndices={blockMatchIndices}
                />
              );
            })}

            {/* Uncategorized blocks (category not in registry.categories) */}
            {uncategorizedBlocks.length > 0 && (
              <CategorySection
                categoryId="uncategorized"
                categoryLabel="Other"
                blocks={uncategorizedBlocks}
                onInsert={handleInsert}
                blockMatchIndices={blockMatchIndices}
              />
            )}
          </Accordion>
        )}
      </div>
    </div>
  );
}

BlockSidebar.displayName = 'BlockSidebar';

export default BlockSidebar;
