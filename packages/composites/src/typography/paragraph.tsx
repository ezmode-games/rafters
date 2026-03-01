/**
 * Paragraph composite block
 *
 * Renders body text in a semantic <p> element.
 * Cognitive load: 1 -- the simplest text block.
 */

import type { EditorBlock } from '@rafters/ui';
import classy from '@rafters/ui/primitives/classy';
import type { CompositeDefinition } from '../manifest.js';

function ParagraphPreview({ scale = 1 }: { scale?: number }) {
  return (
    <span className={classy('text-foreground')} style={{ fontSize: `${14 * scale}px` }}>
      Paragraph
    </span>
  );
}

function ParagraphRender({
  block,
}: {
  block: EditorBlock;
  context: { index: number; total: number; isSelected: boolean; isFocused: boolean };
}) {
  const hasContent = typeof block.content === 'string' && block.content.length > 0;

  return (
    <p className={classy('text-base leading-7', hasContent ? 'text-foreground' : 'text-muted-foreground')}>
      {hasContent ? block.content : 'Type something...'}
    </p>
  );
}

export const paragraphComposite: CompositeDefinition = {
  manifest: {
    id: 'paragraph',
    name: 'Paragraph',
    category: 'typography',
    description: 'A body text paragraph block',
    keywords: ['text', 'body', 'content'],
    cognitiveLoad: 1,
    defaultBlock: { type: 'paragraph', content: '' },
  },
  Preview: ParagraphPreview,
  Render: ParagraphRender,
};
