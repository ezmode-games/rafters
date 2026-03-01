/**
 * Heading composite block
 *
 * Renders h1-h6 elements based on block.meta.level.
 * Cognitive load: 1 -- simple text with a single level option.
 */

import type { EditorBlock } from '@rafters/ui';
import classy from '@rafters/ui/primitives/classy';
import type { CompositeDefinition } from '../manifest.js';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HEADING_STYLES: Record<HeadingLevel, string> = {
  1: 'text-4xl font-bold tracking-tight',
  2: 'text-3xl font-semibold tracking-tight',
  3: 'text-2xl font-semibold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-medium',
  6: 'text-base font-medium',
};

function resolveLevel(meta: Record<string, unknown> | undefined): HeadingLevel {
  const raw = meta?.level;
  return typeof raw === 'number' && raw >= 1 && raw <= 6 ? (raw as HeadingLevel) : 2;
}

function HeadingPreview({ scale = 1 }: { scale?: number }) {
  return (
    <span
      className={classy('font-semibold text-foreground')}
      style={{ fontSize: `${16 * scale}px` }}
    >
      Heading
    </span>
  );
}

function HeadingRender({
  block,
}: {
  block: EditorBlock;
  context: { index: number; total: number; isSelected: boolean; isFocused: boolean };
}) {
  const level = resolveLevel(block.meta);
  const hasContent = typeof block.content === 'string' && block.content.length > 0;
  const Tag = `h${level}` as `h${HeadingLevel}`;

  return (
    <Tag
      className={classy(
        HEADING_STYLES[level],
        hasContent ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      {hasContent ? String(block.content) : 'Untitled'}
    </Tag>
  );
}

export const headingComposite: CompositeDefinition = {
  manifest: {
    id: 'heading',
    name: 'Heading',
    category: 'typography',
    description: 'A heading block with configurable level (h1-h6)',
    keywords: ['title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    cognitiveLoad: 1,
    defaultBlock: { type: 'heading', content: 'Untitled', meta: { level: 2 } },
  },
  Preview: HeadingPreview,
  Render: HeadingRender,
};
