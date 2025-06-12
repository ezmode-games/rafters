import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';

/**
 * Semantic variants communicate meaning through color and context.
 * They provide immediate understanding of action consequences.
 */
const meta = {
  title: '03 Components/Action/Button/Semantic Variants',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic button variants that communicate specific meaning and context through carefully chosen colors and styling.',
      },
    },
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Positive Outcomes
 *
 * Success buttons celebrate completion and positive actions.
 * They confirm when things go well and encourage desired behaviors.
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Save Changes',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Success buttons communicate positive outcomes and completion. Use for actions that result in successful states like saving, completing, or approving.',
      },
    },
  },
};

/**
 * Important Cautions
 *
 * Warning buttons signal actions that require careful consideration.
 * They create awareness without blocking progress.
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Proceed Anyway',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Warning buttons signal actions that require attention or caution. Use for actions that might have unexpected consequences but are still permissible.',
      },
    },
  },
};

/**
 * Neutral Information
 *
 * Info buttons provide helpful context without urgency.
 * They guide users toward additional information or optional actions.
 */
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Learn More',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Info buttons provide neutral, helpful information or optional actions. Use for educational content, help resources, or supplementary features.',
      },
    },
  },
};

/**
 * Critical Actions
 *
 * Destructive semantic buttons emphasize permanent consequences.
 * They create deliberate friction for actions that cannot be undone.
 */
export const DestructiveSemantic: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Account',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Destructive buttons in semantic contexts emphasize the permanent nature of critical actions. Use for data deletion, account removal, or other irreversible operations.',
      },
    },
  },
};

/**
 * Semantic Context Examples
 *
 * Understanding how semantic variants work together helps create
 * interfaces that communicate meaning clearly and consistently.
 */
export const SemanticContexts: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Form Validation Context</h3>
        <div className="p-4 bg-muted/30 rounded border space-y-3">
          <div className="text-sm text-muted-foreground">
            Form validation with semantic feedback buttons
          </div>
          <div className="flex gap-3">
            <Button variant="success">Validation Passed</Button>
            <Button variant="warning">Review Required</Button>
            <Button variant="info">? Get Help</Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">System Status Context</h3>
        <div className="p-4 bg-muted/30 rounded border space-y-3">
          <div className="text-sm text-muted-foreground">
            System status actions with appropriate semantic meaning
          </div>
          <div className="flex gap-3">
            <Button variant="success">Deploy Now</Button>
            <Button variant="warning">Deploy with Warnings</Button>
            <Button variant="destructive">Emergency Stop</Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">User Action Context</h3>
        <div className="p-4 bg-muted/30 rounded border space-y-3">
          <div className="text-sm text-muted-foreground">
            User-initiated actions with semantic clarity
          </div>
          <div className="flex gap-3">
            <Button variant="info">View Tutorial</Button>
            <Button variant="warning">Skip Backup</Button>
            <Button variant="destructive">Delete Data</Button>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world examples showing how semantic button variants work together to create clear, meaningful interfaces across different contexts.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Semantic Comparison
 *
 * Side-by-side comparison helps understand the semantic hierarchy
 * and appropriate usage patterns for each variant.
 */
export const SemanticComparison: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Button variant="success">Success Action</Button>
      <Button variant="warning">Warning Action</Button>
      <Button variant="info">Info Action</Button>
      <Button variant="destructive">Destructive Action</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A side-by-side comparison of all semantic button variants showing their visual hierarchy and contextual meaning.',
      },
    },
  },
};
