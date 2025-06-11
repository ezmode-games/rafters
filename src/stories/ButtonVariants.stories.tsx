import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../components/Button';

const meta = {
  title: '03 Components/Action/Button/Visual Variants',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The Primary Action
 *
 * The primary button commands attention and guides users toward the most important action.
 * Use sparingly—only one primary action should be visible per context.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Create Account',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The primary action button uses the strongest visual weight to guide users to the most important action. Reserve for single, critical actions like "Save", "Submit", or "Create".',
      },
    },
  },
};

/**
 * Supporting Actions
 *
 * Secondary buttons provide clear alternatives without competing with primary actions.
 * They maintain importance while respecting visual hierarchy.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'View Details',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Secondary buttons support primary actions with clear visual hierarchy. Use for important but not critical actions like "View", "Edit", or "Learn More".',
      },
    },
  },
};

/**
 * Deliberate Friction
 *
 * Destructive actions require intentional consideration.
 * The visual treatment creates pause before irreversible actions.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Project',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Destructive buttons create deliberate friction for dangerous actions. Use for actions that permanently remove data, cancel important processes, or have significant consequences.',
      },
    },
  },
};

/**
 * Defined Boundaries
 *
 * Outline buttons establish clear action areas while maintaining visual lightness.
 * They provide structure without overwhelming the interface.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Add to Cart',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Outline buttons provide clear boundaries and action areas with minimal visual weight. Ideal for secondary actions that need definition without dominance.',
      },
    },
  },
};

/**
 * Subtle Presence
 *
 * Ghost buttons blend naturally while remaining discoverable.
 * They provide functionality without disrupting visual flow.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Skip for Now',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Ghost buttons provide the subtlest interaction with minimal visual impact. Perfect for optional actions, navigation, or when you need functionality without visual prominence.',
      },
    },
  },
};

/**
 * Variant Comparison
 *
 * Understanding the hierarchy and relationship between variants helps create
 * interfaces that guide users naturally toward their goals.
 */
export const VariantComparison: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Button variant="primary">Primary Action</Button>
      <Button variant="secondary">Secondary Action</Button>
      <Button variant="destructive">Destructive Action</Button>
      <Button variant="outline">Outline Action</Button>
      <Button variant="ghost">Ghost Action</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A side-by-side comparison of all button variants showing their visual hierarchy and relative emphasis levels.',
      },
    },
  },
};
