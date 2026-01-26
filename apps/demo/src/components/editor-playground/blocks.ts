/**
 * Sample block definitions for the editor playground
 */

import type { Block, BlockDefinition, BlockRegistry } from '@rafters/ui/components/editor';
import { z } from 'zod';

// ============================================================================
// Block Schemas (Zod)
// ============================================================================

export const TextBlockSchema = z.object({
  content: z.string().describe('The text content of the block'),
});

export const HeadingBlockSchema = z.object({
  content: z.string().describe('The heading text'),
  level: z.enum(['1', '2', '3', '4', '5', '6']).describe('Heading level (h1-h6)'),
});

export const ImageBlockSchema = z.object({
  url: z.string().url().describe('Image URL'),
  alt: z.string().describe('Alt text for accessibility'),
  caption: z.string().optional().describe('Optional image caption'),
});

export const CodeBlockSchema = z.object({
  language: z
    .enum(['typescript', 'javascript', 'python', 'rust', 'css', 'html', 'json'])
    .describe('Programming language'),
  code: z.string().describe('The code content'),
});

export const DividerBlockSchema = z.object({
  variant: z.enum(['solid', 'dashed', 'dotted']).describe('Divider style'),
});

export const QuoteBlockSchema = z.object({
  content: z.string().describe('The quote text'),
  attribution: z.string().optional().describe('Quote attribution'),
});

export const CalloutBlockSchema = z.object({
  variant: z
    .enum(['info', 'warning', 'error', 'success', 'note'])
    .describe('Callout style variant'),
  title: z.string().describe('Callout title'),
  content: z.string().describe('Callout body content'),
  collapsible: z.boolean().optional().describe('Whether the callout can be collapsed'),
});

// Form Input Schemas
export const InputBlockSchema = z.object({
  label: z.string().describe('Input label'),
  placeholder: z.string().optional().describe('Placeholder text'),
  type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url']).describe('Input type'),
  required: z.boolean().optional().describe('Whether the field is required'),
  disabled: z.boolean().optional().describe('Whether the field is disabled'),
});

export const TextareaBlockSchema = z.object({
  label: z.string().describe('Textarea label'),
  placeholder: z.string().optional().describe('Placeholder text'),
  rows: z.enum(['2', '3', '4', '5', '6']).optional().describe('Number of rows'),
  required: z.boolean().optional().describe('Whether the field is required'),
});

export const CheckboxBlockSchema = z.object({
  label: z.string().describe('Checkbox label'),
  description: z.string().optional().describe('Additional description text'),
  defaultChecked: z.boolean().optional().describe('Default checked state'),
  disabled: z.boolean().optional().describe('Whether the checkbox is disabled'),
});

export const SelectBlockSchema = z.object({
  label: z.string().describe('Select label'),
  placeholder: z.string().optional().describe('Placeholder text'),
  options: z.string().describe('Comma-separated list of options'),
  required: z.boolean().optional().describe('Whether the field is required'),
});

export const SwitchBlockSchema = z.object({
  label: z.string().describe('Switch label'),
  description: z.string().optional().describe('Additional description text'),
  defaultChecked: z.boolean().optional().describe('Default checked state'),
  disabled: z.boolean().optional().describe('Whether the switch is disabled'),
});

export const SliderBlockSchema = z.object({
  label: z.string().describe('Slider label'),
  min: z.number().optional().describe('Minimum value'),
  max: z.number().optional().describe('Maximum value'),
  step: z.number().optional().describe('Step increment'),
  defaultValue: z.number().optional().describe('Default value'),
});

// ============================================================================
// Schema Registry (for PropertyEditor)
// ============================================================================

export const blockSchemas = {
  text: TextBlockSchema,
  heading: HeadingBlockSchema,
  image: ImageBlockSchema,
  code: CodeBlockSchema,
  divider: DividerBlockSchema,
  quote: QuoteBlockSchema,
  callout: CalloutBlockSchema,
  input: InputBlockSchema,
  textarea: TextareaBlockSchema,
  checkbox: CheckboxBlockSchema,
  select: SelectBlockSchema,
  switch: SwitchBlockSchema,
  slider: SliderBlockSchema,
} as const;

export type BlockType = keyof typeof blockSchemas;

// ============================================================================
// Block Registry (for BlockSidebar)
// ============================================================================

export const blockDefinitions: BlockDefinition[] = [
  {
    type: 'text',
    label: 'Text',
    description: 'A paragraph of text',
    category: 'text',
    keywords: ['paragraph', 'body', 'content'],
  },
  {
    type: 'heading',
    label: 'Heading',
    description: 'Section heading (H1-H6)',
    category: 'text',
    keywords: ['title', 'header', 'h1', 'h2', 'h3'],
  },
  {
    type: 'quote',
    label: 'Quote',
    description: 'Blockquote with attribution',
    category: 'text',
    keywords: ['blockquote', 'citation'],
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Image with alt text and caption',
    category: 'media',
    keywords: ['picture', 'photo', 'graphic'],
  },
  {
    type: 'code',
    label: 'Code',
    description: 'Syntax-highlighted code block',
    category: 'code',
    keywords: ['snippet', 'programming', 'source'],
  },
  {
    type: 'divider',
    label: 'Divider',
    description: 'Horizontal rule separator',
    category: 'layout',
    keywords: ['hr', 'separator', 'line'],
  },
  {
    type: 'callout',
    label: 'Callout',
    description: 'Highlighted callout box with icon',
    category: 'text',
    keywords: ['alert', 'notice', 'tip', 'warning', 'info', 'admonition'],
  },
  // Form inputs
  {
    type: 'input',
    label: 'Input',
    description: 'Single-line text input field',
    category: 'forms',
    keywords: ['text', 'field', 'textbox', 'email', 'password'],
  },
  {
    type: 'textarea',
    label: 'Textarea',
    description: 'Multi-line text input',
    category: 'forms',
    keywords: ['multiline', 'text', 'long'],
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    description: 'Single checkbox with label',
    category: 'forms',
    keywords: ['check', 'toggle', 'boolean', 'tick'],
  },
  {
    type: 'select',
    label: 'Select',
    description: 'Dropdown selection menu',
    category: 'forms',
    keywords: ['dropdown', 'menu', 'options', 'choice'],
  },
  {
    type: 'switch',
    label: 'Switch',
    description: 'Toggle switch for on/off states',
    category: 'forms',
    keywords: ['toggle', 'boolean', 'on', 'off'],
  },
  {
    type: 'slider',
    label: 'Slider',
    description: 'Range slider for numeric values',
    category: 'forms',
    keywords: ['range', 'number', 'scale', 'value'],
  },
];

export const blockRegistry: BlockRegistry = {
  blocks: blockDefinitions,
  categories: [
    { id: 'text', label: 'Text', order: 1 },
    { id: 'media', label: 'Media', order: 2 },
    { id: 'code', label: 'Code', order: 3 },
    { id: 'forms', label: 'Forms', order: 4 },
    { id: 'layout', label: 'Layout', order: 5 },
  ],
};

// ============================================================================
// Default Props for each block type
// ============================================================================

export const defaultBlockProps: Record<BlockType, Record<string, unknown>> = {
  text: { content: '' },
  heading: { content: '', level: '2' },
  image: { url: '', alt: '', caption: '' },
  code: { language: 'typescript', code: '' },
  divider: { variant: 'solid' },
  quote: { content: '', attribution: '' },
  callout: { variant: 'info', title: 'Note', content: '', collapsible: false },
  input: {
    label: 'Label',
    placeholder: 'Enter text...',
    type: 'text',
    required: false,
    disabled: false,
  },
  textarea: { label: 'Label', placeholder: 'Enter text...', rows: '3', required: false },
  checkbox: { label: 'Checkbox label', description: '', defaultChecked: false, disabled: false },
  select: {
    label: 'Label',
    placeholder: 'Select an option',
    options: 'Option 1, Option 2, Option 3',
    required: false,
  },
  switch: { label: 'Toggle this setting', description: '', defaultChecked: false, disabled: false },
  slider: { label: 'Value', min: 0, max: 100, step: 1, defaultValue: 50 },
};

// ============================================================================
// Sample Blocks for Demo
// ============================================================================

export function createSampleBlocks(): Block[] {
  return [
    {
      id: 'block-1',
      type: 'heading',
      props: { content: 'Welcome to the Block Editor', level: '1' },
    },
    {
      id: 'block-2',
      type: 'text',
      props: {
        content:
          'This is a demonstration of the Rafters block editor components. Try selecting blocks, dragging to reorder, or using the sidebar to add new blocks.',
      },
    },
    {
      id: 'block-3',
      type: 'code',
      props: {
        language: 'typescript',
        code: `import { BlockCanvas, BlockSidebar } from '@rafters/ui';

function Editor() {
  return (
    <div className="flex">
      <BlockSidebar registry={registry} onInsert={handleInsert} />
      <BlockCanvas blocks={blocks} renderBlock={renderBlock} />
    </div>
  );
}`,
      },
    },
    {
      id: 'block-4',
      type: 'divider',
      props: { variant: 'dashed' },
    },
    {
      id: 'block-5',
      type: 'quote',
      props: {
        content: 'The best way to predict the future is to invent it.',
        attribution: 'Alan Kay',
      },
    },
    {
      id: 'block-6',
      type: 'image',
      props: {
        url: 'https://placehold.co/600x400/1e293b/94a3b8?text=Placeholder+Image',
        alt: 'A placeholder image for demonstration',
        caption: 'Sample image with caption',
      },
    },
  ];
}

// ============================================================================
// Block ID Generator
// ============================================================================

let blockIdCounter = 100;

export function generateBlockId(): string {
  blockIdCounter += 1;
  return `block-${blockIdCounter}`;
}
