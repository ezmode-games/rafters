/**
 * Blockquote composite block
 *
 * Renders a styled <blockquote> with optional attribution.
 * Cognitive load: 1 -- quote text with optional citation.
 */

import type { EditorBlock } from '@rafters/ui';
import classy from '@rafters/ui/primitives/classy';
import type { CompositeDefinition } from '../manifest.js';

function BlockquotePreview(_props: { scale?: number }) {
  return <span className={classy('text-foreground italic')}>&ldquo;Quote&rdquo;</span>;
}

function BlockquoteRender({
  block,
}: {
  block: EditorBlock;
  context: { index: number; total: number; isSelected: boolean; isFocused: boolean };
}) {
  const hasContent = typeof block.content === 'string' && block.content.length > 0;
  const attribution = typeof block.meta?.attribution === 'string' ? block.meta.attribution : '';

  return (
    <blockquote
      className={classy(
        'border-l-4 border-border pl-4 py-2',
        hasContent ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      <p className={classy('text-base italic leading-7')}>
        {hasContent ? String(block.content) : 'Quote...'}
      </p>
      {attribution.length > 0 && (
        <footer className={classy('mt-2 text-sm text-muted-foreground')}>
          &mdash; <cite>{attribution}</cite>
        </footer>
      )}
    </blockquote>
  );
}

export const blockquoteComposite: CompositeDefinition = {
  manifest: {
    id: 'blockquote',
    name: 'Blockquote',
    category: 'typography',
    description: 'A quote block with optional attribution',
    keywords: ['quote', 'citation'],
    cognitiveLoad: 1,
    defaultBlock: { type: 'blockquote', content: '', meta: { attribution: '' } },
  },
  Preview: BlockquotePreview,
  Render: BlockquoteRender,
};
