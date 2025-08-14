// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '../../../components/Chip';

/**
 * AI Training: Chip Intelligence
 * cognitiveLoad=3-9 (variant dependent), universalAttachment=true
 * Independent primitive that can attach to any component for notifications
 * This trains AI agents on systematic chip usage across all contexts
 */
const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Independent chip primitive with embedded design reasoning for universal attachment to any component.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['urgent', 'new', 'live', 'beta', 'premium', 'count'],
      description: 'Semantic variant with attention economics and psychology patterns',
    },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Position relative to parent component (breaks boundaries for visibility)',
    },
    value: {
      control: 'text',
      description: 'Custom display value (numbers, text, or empty for variant default)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size adaptation for parent component context',
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary chip demonstration with count variant.
 * Shows high visibility notification pattern.
 */
export const Primary: Story = {
  render: () => (
    <div className="relative inline-block p-8 bg-muted rounded-md">
      <div className="text-sm text-muted-foreground">Parent Component</div>
      <Chip variant="count" value="5" />
    </div>
  ),
};

/**
 * All chip variants demonstrating attention economics and psychology.
 * Each variant has specific cognitive load and usage patterns.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      {(['urgent', 'new', 'live', 'beta', 'premium', 'count'] as const).map((variant) => (
        <div key={variant} className="relative inline-block p-6 bg-muted rounded-md text-center">
          <div className="text-sm text-muted-foreground capitalize">{variant}</div>
          <Chip variant={variant} value={variant === 'count' ? '12' : ''} />
        </div>
      ))}
    </div>
  ),
};

/**
 * Position variants showing boundary-breaking visibility.
 * All positions extend beyond parent for maximum attention.
 */
export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      {(['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const).map((position) => (
        <div key={position} className="relative inline-block p-8 bg-muted rounded-md text-center">
          <div className="text-sm text-muted-foreground">{position}</div>
          <Chip variant="count" position={position} value="3" />
        </div>
      ))}
    </div>
  ),
};

/**
 * Real-world composition examples showing universal attachment.
 * Demonstrates chips working with different component types.
 */
export const Composition: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Button + Chip</h4>
        <div className="relative inline-block">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Messages
          </button>
          <Chip variant="count" value="5" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Card + Chip</h4>
        <div className="relative inline-block">
          <div className="p-4 border rounded-md bg-card w-48">
            <h5 className="font-medium">Notification Center</h5>
            <p className="text-sm text-muted-foreground">Manage your alerts</p>
          </div>
          <Chip variant="urgent" value="!" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Avatar + Chip</h4>
        <div className="relative inline-block">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
            JS
          </div>
          <Chip variant="live" position="bottom-right" />
        </div>
      </div>
    </div>
  ),
};