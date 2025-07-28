import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../../components/Select';

/**
 * Choice architecture meets decision confidence. The select component transforms
 * complex option sets into organized, searchable, and contextually rich interfaces
 * that guide users toward confident decisions.
 */
const meta = {
  title: '03 Components/Forms/Select',
  component: Select,
  tags: ['!autodocs', '!dev', 'test'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Intelligent choice architecture with progressive disclosure, smart search, and contextual information for confident decision-making.',
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disabled state prevents interaction',
    },
    required: {
      control: 'boolean',
      description: 'Required field indicator',
    },
  },
  args: { onValueChange: fn() },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Common select demonstrations showing choice architecture and intelligence patterns.
 * Progressive complexity from simple selection to smart search and contextual information.
 */
export const Common: Story = {
  render: (args) => (
    <div className="space-y-8 max-w-2xl">
      <div className="text-sm text-muted-foreground mb-6">
        <strong>Select Intelligence:</strong> Simple → Grouped → Searchable → Contextual with
        progressive cognitive load management
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Simple Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Simple Selection</h4>
          <Select {...args}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Simple choices with clear, unambiguous options
          </p>
        </div>

        {/* Grouped Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Grouped Options</h4>
          <Select {...args}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Frontend</SelectLabel>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Backend</SelectLabel>
                <SelectItem value="node">Node.js</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Logical grouping reduces cognitive load for complex option sets
          </p>
        </div>

        {/* Searchable with Count */}
        <div className="space-y-3">
          <h4 className="font-medium">Smart Search</h4>
          <Select {...args}>
            <SelectTrigger className="w-full" showCount itemCount={12}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent searchable searchPlaceholder="Search countries...">
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
              <SelectItem value="br">Brazil</SelectItem>
              <SelectItem value="in">India</SelectItem>
              <SelectItem value="cn">China</SelectItem>
              <SelectItem value="mx">Mexico</SelectItem>
              <SelectItem value="es">Spain</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Item count sets expectations, search reduces choice overload
          </p>
        </div>

        {/* Contextual Information */}
        <div className="space-y-3">
          <h4 className="font-medium">Rich Context</h4>
          <Select {...args}>
            <SelectTrigger className="w-full" size="large">
              <SelectValue placeholder="Choose action" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>File Operations</SelectLabel>
                <SelectItem value="save" description="Save current document to disk" shortcut="⌘S">
                  Save File
                </SelectItem>
                <SelectItem value="export" description="Export in various formats" shortcut="⌘E">
                  Export
                </SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Edit Operations</SelectLabel>
                <SelectItem value="copy" description="Copy selection to clipboard" shortcut="⌘C">
                  Copy
                </SelectItem>
                <SelectItem value="paste" description="Paste from clipboard" shortcut="⌘V">
                  Paste
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Descriptions and shortcuts provide decision support for complex choices
          </p>
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-4">
        <h4 className="font-medium">Size Variants</h4>
        <div className="flex gap-4 items-end">
          <div className="space-y-2">
            <label htmlFor="select-default-size" className="text-sm text-muted-foreground">
              Default
            </label>
            <Select {...args}>
              <SelectTrigger id="select-default-size" className="w-40">
                <SelectValue placeholder="Default size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="select-large-size" className="text-sm text-muted-foreground">
              Large
            </label>
            <Select {...args}>
              <SelectTrigger id="select-large-size" className="w-40" size="large">
                <SelectValue placeholder="Large size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Size variants for different contexts and accessibility needs
        </p>
      </div>

      {/* States */}
      <div className="space-y-4">
        <h4 className="font-medium">States</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="select-state-default" className="text-sm text-muted-foreground">
              Default
            </label>
            <Select {...args}>
              <SelectTrigger id="select-state-default" className="w-full">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="select-with-selection" className="text-sm text-muted-foreground">
              With Selection
            </label>
            <Select {...args} defaultValue="option1">
              <SelectTrigger id="select-with-selection" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="select-disabled" className="text-sm text-muted-foreground">
              Disabled
            </label>
            <Select {...args} disabled>
              <SelectTrigger id="select-disabled" className="w-full">
                <SelectValue placeholder="Disabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Clear visual feedback for different interaction states
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete overview of select intelligence patterns showing progressive complexity from simple selection to smart search and contextual information.',
      },
    },
  },
};
