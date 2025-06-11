import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../components/Button';

/**
 * Every interaction begins with intent. The button is where user intention meets interface response.
 * Our button system is built on the principle that clarity of purpose should be immediately apparent—
 * both visually and functionally.
 */
const meta = {
  title: '03 Components/Action/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The foundational interactive element. Every button communicates intent through carefully chosen visual hierarchy and semantic meaning.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'destructive',
        'success',
        'warning',
        'info',
        'outline',
        'ghost',
      ],
      description: 'Visual style variant using semantic tokens',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting height and padding',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state with opacity modifier',
    },
    asChild: {
      control: 'boolean',
      description: 'Use Radix Slot for composition',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label when button text is not descriptive enough',
    },
    'aria-describedby': {
      control: 'text',
      description: 'ID of element that describes the button',
    },
    'aria-pressed': {
      control: 'boolean',
      description: 'For toggle buttons, indicates pressed state',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Usage Guidelines
export const UsageGuidelines: Story = {
  render: () => {
    return (
      <div className="space-y-12 p-6 max-w-5xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Button</h1>
            <p className="text-lg text-muted-foreground max-w-4xl leading-relaxed">
              Buttons are used to show the user's choice of options for actions and assign these to
              a clear hierarchy. A button helps the user to find the most important actions of a
              page or within a viewport and enables them to perform these actions. The label is used
              to clearly indicate to the user what action will be triggered. Buttons allow users to
              commit a change, complete steps in a task, or make choices.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Usage Guidelines</h2>
            <p className="text-muted-foreground max-w-3xl">
              The primary button is used for the most important action on a page or in a view. The
              transparent secondary button with a thin frame is used for subordinate actions. The
              text button is applied as a subtle call to action.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Do</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-base font-medium">Button labels</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• Must describe the action the button performs</li>
                  <li>• Should include a verb</li>
                  <li>• Concise, specific, self-explanatory labels</li>
                  <li>
                    • Always include a noun if there is any room for interpretation about what the
                    verb operates on
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium">Placement and hierarchy</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>
                    • Place buttons in consistent locations in the user interface for best user
                    experience
                  </li>
                  <li>
                    • Use the button group component when there is a need to combine or lay out
                    multiple buttons
                  </li>
                  <li>
                    • Express different emphasis levels (e.g. one primary button and one secondary
                    button)
                  </li>
                  <li>• Consider hierarchy of different button variations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium">Accessibility</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• Use aria status / alert elements when applying the loading state</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Don't</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-base font-medium">Button labels</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>
                    • No use of generic labels like "Ok" especially in the case of an error; errors
                    are never "Ok"
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium">Usage patterns</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• Do not use a button for a text link or navigation item</li>
                  <li>• Do not use two primary buttons in a button group</li>
                  <li>• Do not use a primary button with a text button in a button group</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Common Patterns</h3>

          <div className="space-y-8">
            <div className="space-y-3">
              <h4 className="text-lg font-medium">Form Actions</h4>
              <div className="p-6 bg-muted/30 rounded border">
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="secondary">Save Draft</Button>
                  <Button variant="primary">Publish</Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-medium">Confirmation Dialogs</h4>
              <div className="p-6 bg-muted/30 rounded border">
                <div className="flex gap-3 justify-end">
                  <Button variant="outline">Keep Editing</Button>
                  <Button variant="destructive">Delete Forever</Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-medium">Loading States</h4>
              <div className="p-6 bg-muted/30 rounded border">
                <Button disabled>Processing...</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive usage guidelines with practical examples and common patterns for implementing buttons effectively.',
      },
    },
    layout: 'fullscreen',
  },
};
