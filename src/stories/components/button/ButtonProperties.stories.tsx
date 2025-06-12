import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';

/**
 * Properties shape behavior and interaction patterns.
 * Each property serves the interface's functional requirements.
 */
const meta = {
  title: '03 Components/Action/Button/Properties & States',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Properties that control size, state, and behavioral characteristics of buttons within interface contexts.',
      },
    },
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compact Interfaces
 *
 * Small buttons fit naturally in dense layouts and toolbars.
 * They maintain functionality while conserving space.
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Action',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Small buttons conserve space in dense interfaces, toolbars, or when multiple actions need to coexist in limited space.',
      },
    },
  },
};

/**
 * Balanced Presence
 *
 * Medium buttons provide the optimal balance of accessibility and space efficiency.
 * This is the default size for most interface contexts.
 */
export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Standard Action',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Medium buttons offer the ideal balance of touch target size and visual weight. Use as the default size for most interface contexts.',
      },
    },
  },
};

/**
 * Prominent Actions
 *
 * Large buttons command attention and improve accessibility.
 * They excel in mobile interfaces and call-to-action contexts.
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Primary Action',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Large buttons provide maximum touch target size and visual prominence. Ideal for mobile interfaces, landing pages, or critical call-to-action moments.',
      },
    },
  },
};

/**
 * Unavailable State
 *
 * Disabled buttons maintain layout while preventing interaction.
 * They communicate temporary unavailability clearly.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Unavailable Action',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled buttons maintain layout structure while clearly communicating that the action is temporarily unavailable. Use for context-dependent actions or during loading states.',
      },
    },
  },
};

/**
 * Interactive Feedback
 *
 * Hover and focus states provide essential feedback for user interactions.
 * They confirm responsiveness and guide interaction patterns.
 */
export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Interactive Feedback</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Hover and focus to see the interactive feedback that guides user interaction.
        </p>
        <div className="flex gap-4">
          <Button variant="primary">Hover Me</Button>
          <Button variant="secondary">Focus Me</Button>
          <Button variant="outline">Try Both</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive states provide essential visual feedback that confirms responsiveness and guides user interaction patterns.',
      },
    },
  },
};

/**
 * Composition Flexibility
 *
 * The asChild property enables composition patterns with Radix Slot.
 * This allows buttons to wrap other elements while maintaining semantics.
 */
export const AsChild: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Composition with asChild</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Use asChild when you need button styling on other elements like links.
        </p>
      </div>
      <Button asChild variant="primary">
        <a href="#example" className="inline-block">
          Link as Button
        </a>
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The asChild property enables composition patterns, allowing button styles to be applied to other elements like links while maintaining proper semantics.',
      },
    },
  },
};

/**
 * Size Comparison
 *
 * Understanding the scale relationships helps choose appropriate sizes
 * for different interface contexts and user needs.
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A side-by-side comparison of all button sizes showing their scale relationships and appropriate use contexts.',
      },
    },
  },
};
