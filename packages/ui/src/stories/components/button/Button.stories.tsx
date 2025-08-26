// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';

/**
 * Every interaction begins with intent. The button is where user intention meets interface response.
 * Built with embedded design intelligence for cognitive load management and trust building.
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The foundational interactive element with embedded UX intelligence. Handles loading states, destructive confirmation, and attention hierarchy automatically.',
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
    loading: {
      control: 'boolean',
      description: 'Loading state with spinner and disabled interaction',
    },
    destructiveConfirm: {
      control: 'boolean',
      description: 'Requires confirmation for destructive actions',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state with opacity modifier',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// === VARIANTS ===

/**
 * All button variants demonstrating visual hierarchy and semantic meaning.
 * Each variant serves a specific purpose in the interface attention economy.
 */
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
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
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete variant collection showing semantic meaning and visual hierarchy levels.',
      },
    },
  },
};

// === SIZES ===

/**
 * Size variants affecting visual hierarchy through scale.
 * Larger buttons command more attention in the interface.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Size variants for different attention levels and interface contexts.',
      },
    },
  },
};

// === STATES ===

/**
 * Interactive states with embedded UX intelligence.
 * Loading and confirmation states prevent user errors and provide feedback.
 */
export const States: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>Default</Button>
      <Button {...args} loading>
        Loading...
      </Button>
      <Button {...args} disabled>
        Disabled
      </Button>
      <Button {...args} variant="destructive" destructiveConfirm>
        Delete (Confirm)
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive states showing loading feedback and destructive confirmation patterns.',
      },
    },
  },
};

// === ATTENTION HIERARCHY ===

export const AttentionHierarchy: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm" variant="ghost">
        Cancel
      </Button>
      <Button size="md" variant="secondary">
        Save Draft
      </Button>
      <Button size="lg" variant="primary">
        Publish Now
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates proper attention hierarchy: ghost for low attention, secondary for medium, primary for high attention.',
      },
    },
  },
};

// === SEMANTIC CONTEXTS ===

export const SemanticContexts: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="success">Save Changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="warning">Proceed with Caution</Button>
        <Button variant="ghost">Go Back</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="destructive" destructiveConfirm>
          Delete Account
        </Button>
        <Button variant="outline">Keep Account</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="info">Learn More</Button>
        <Button variant="primary">Get Started</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world semantic usage showing how variant choice communicates intent and consequence level.',
      },
    },
  },
};

// === FORM ACTIONS ===

export const FormActions: Story = {
  render: () => (
    <div className="flex justify-end gap-2 p-4 bg-muted/20 rounded-lg">
      <Button variant="ghost">Cancel</Button>
      <Button variant="outline">Save Draft</Button>
      <Button variant="primary">Submit</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Typical form action pattern with proper hierarchy and spacing.',
      },
    },
  },
};

// === LOADING PATTERNS ===

export const LoadingPatterns: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Processing...</Button>
      <Button variant="destructive" loading>
        Deleting...
      </Button>
      <Button variant="success" loading>
        Saving...
      </Button>
      <Button size="sm" loading>
        Small Loading
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Loading states prevent double-submission and provide user feedback during async operations.',
      },
    },
  },
};
