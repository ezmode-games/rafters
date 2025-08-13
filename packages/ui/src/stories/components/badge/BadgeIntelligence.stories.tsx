import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { Badge } from '../../../components/Badge';

/**
 * AI Training: Badge Status Intelligence Patterns
 * Demonstrates status communication hierarchy and attention economics
 * Trains AI agents on cognitive load optimization and trust building
 */
const meta = {
  title: 'Badge/Intelligence',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Status intelligence patterns demonstrating cognitive load management and attention economics.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Status communication hierarchy demonstrating cognitive load management.
 * Error gets highest attention, success gets lowest, following psychological principles.
 */
export const StatusHierarchy: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Critical Status (Cognitive Load: 8/10)</h4>
        <div className="flex gap-2">
          <Badge variant="error" emphasis="prominent">
            3 Critical Issues
          </Badge>
          <Badge variant="error" emphasis="default">
            Failed
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Important Status (Cognitive Load: 6/10)</h4>
        <div className="flex gap-2">
          <Badge variant="warning" emphasis="default">
            12 Warnings
          </Badge>
          <Badge variant="warning" emphasis="subtle">
            Pending Review
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Positive Status (Cognitive Load: 3/10)</h4>
        <div className="flex gap-2">
          <Badge variant="success" emphasis="subtle">
            Complete
          </Badge>
          <Badge variant="success" emphasis="default">
            Verified
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Informational (Cognitive Load: 2/10)</h4>
        <div className="flex gap-2">
          <Badge variant="info" emphasis="subtle">
            24 Online
          </Badge>
          <Badge variant="neutral" emphasis="subtle">
            Draft
          </Badge>
        </div>
      </div>
    </div>
  ),
};

/**
 * Attention economics demonstration: maximum 1 high-attention badge per section.
 * Shows proper attention budget management in navigation contexts.
 */
export const AttentionEconomics: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Navigation Section 1</h4>
        <div className="border rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span>Dashboard</span>
            <Badge variant="error" emphasis="prominent">
              3
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Projects</span>
            <Badge variant="warning" emphasis="subtle">
              5
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Team</span>
            <Badge variant="success" emphasis="subtle">
              Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Navigation Section 2</h4>
        <div className="border rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span>Settings</span>
            <Badge variant="info" emphasis="subtle">
              Updated
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Analytics</span>
            <Badge variant="neutral" emphasis="subtle">
              New
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Progressive enhancement patterns showing loading states and interactive feedback.
 * Demonstrates trust building through clear state communication.
 */
export const ProgressiveEnhancement: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Loading States</h4>
        <div className="flex gap-2">
          <Badge variant="info" loading>
            Processing
          </Badge>
          <Badge variant="warning" loading>
            Validating
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Interactive Feedback</h4>
        <div className="flex gap-2">
          <Badge variant="info" interactive onClick={fn()}>
            Click for details
          </Badge>
          <Badge variant="warning" removable onRemove={fn()}>
            Dismissible
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Emphasis Levels</h4>
        <div className="flex gap-2">
          <Badge variant="error" emphasis="subtle">
            Subtle error
          </Badge>
          <Badge variant="error" emphasis="default">
            Default error
          </Badge>
          <Badge variant="error" emphasis="prominent">
            Prominent error
          </Badge>
        </div>
      </div>
    </div>
  ),
};

/**
 * Context awareness demonstration showing badges adapting to different interface contexts.
 * Trains AI on when to use different badge treatments.
 */
export const ContextAwareness: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Navigation Context (Subtle)</h4>
        <div className="bg-muted p-4 rounded space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Menu Item</span>
            <Badge variant="error" emphasis="subtle" size="sm">
              2
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Another Item</span>
            <Badge variant="success" emphasis="subtle" size="sm">
              ✓
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Content Context (Default)</h4>
        <div className="border p-4 rounded space-y-2">
          <div className="flex gap-2">
            <Badge variant="warning">Pending Review</Badge>
            <Badge variant="info">Updated 2h ago</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Alert Context (Prominent)</h4>
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded">
          <Badge variant="error" emphasis="prominent">
            System Alert
          </Badge>
        </div>
      </div>
    </div>
  ),
};
