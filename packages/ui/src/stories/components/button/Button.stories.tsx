// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { vi } from 'vitest';
import { Button } from '../../../components/Button';

/**
 * Every interaction begins with intent. The button is where user intention meets interface response.
 * Our button system is built on the principle that clarity of purpose should be immediately apparent—
 * both visually and functionally.
 */
const meta = {
  title: 'Components/Button',
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
  args: { onClick: vi.fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Common: Story = {
  render: (args) => {
    return (
      <div className="flex items-center gap-4">
        <Button {...args} variant="primary">
          Primary
        </Button>
        <Button {...args} variant="secondary">
          Secondary
        </Button>
        <Button {...args} variant="destructive">
          Destructive
        </Button>
        <Button {...args} variant="success">
          Success
        </Button>
        <Button {...args} variant="warning">
          Warning
        </Button>
        <Button {...args} variant="info">
          Info
        </Button>
        <Button {...args} variant="outline">
          Outline
        </Button>
        <Button {...args} variant="ghost">
          Ghost
        </Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A collection of common button variants demonstrating visual hierarchy and semantic meaning.',
      },
    },
  },
};

export const CustomVariantTest: Story = {
  render: (args) => {
    return (
      <div className="flex items-center gap-4">
        <Button {...args} className="btn-custom-lime bg-blue-500">
          Custom Lime Hover
        </Button>
        <p className="text-sm text-muted-foreground">
          Hover over the button to see if @variant works - should turn lime
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Testing @variant directive to create custom hover states that jump to different colors.',
      },
    },
  },
};
