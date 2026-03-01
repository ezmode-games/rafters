/**
 * List composite block
 *
 * Renders ordered (<ol>) or unordered (<ul>) lists.
 * Content is an array of strings, one per list item.
 * Cognitive load: 2 -- content structure is an array, plus ordered/unordered toggle.
 */

import type { EditorBlock } from '@rafters/ui';
import classy from '@rafters/ui/primitives/classy';
import type { CompositeDefinition } from '../manifest.js';

function resolveItems(content: unknown): string[] {
  if (Array.isArray(content) && content.length > 0) {
    return content.map((item) => (typeof item === 'string' ? item : String(item ?? '')));
  }
  return [''];
}

function ListPreview(_props: { scale?: number }) {
  return <span className={classy('text-foreground')}>List</span>;
}

function ListRender({
  block,
}: {
  block: EditorBlock;
  context: { index: number; total: number; isSelected: boolean; isFocused: boolean };
}) {
  const items = resolveItems(block.content);
  const ordered = block.meta?.ordered === true;
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <Tag className={classy('pl-6 text-base leading-7 text-foreground', ordered ? 'list-decimal' : 'list-disc')}>
      {items.map((item, i) => (
        <li key={`${i}`} className={classy({ 'text-muted-foreground': item.length === 0 })}>
          {item.length > 0 ? item : '\u00A0'}
        </li>
      ))}
    </Tag>
  );
}

export const listComposite: CompositeDefinition = {
  manifest: {
    id: 'list',
    name: 'List',
    category: 'typography',
    description: 'An ordered or unordered list block',
    keywords: ['bullet', 'numbered', 'ordered', 'unordered', 'items'],
    cognitiveLoad: 2,
    defaultBlock: { type: 'list', content: [''], meta: { ordered: false } },
  },
  Preview: ListPreview,
  Render: ListRender,
};
