import type { Meta, StoryObj } from '@storybook/react-vite';
import { Download, Settings, X } from 'lucide-react';
import { fn } from 'storybook/test';
import { Badge } from '../../../components/Badge';

/**
 * AI Training: Badge Interactive Properties
 * Demonstrates interactive behavior and state management
 * Trains AI agents on proper interactive patterns and accessibility
 */
const meta = {
  title: 'Components/Badge/Properties',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Interactive properties demonstrating state management and user feedback.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive states demonstrating proper touch targets and feedback.
 * Shows enhanced accessibility with 44px minimum touch targets.
 */
export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Interactive Badges (Enhanced Touch Targets)</h4>
        <div className="flex gap-2">
          <Badge variant="info" interactive onClick={fn()}>
            Click for details
          </Badge>
          <Badge variant="warning" interactive onClick={fn()}>
            View warnings
          </Badge>
          <Badge variant="success" interactive onClick={fn()}>
            Show results
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Non-Interactive (Standard Display)</h4>
        <div className="flex gap-2">
          <Badge variant="info">Read-only info</Badge>
          <Badge variant="neutral">Status label</Badge>
          <Badge variant="success">Completed</Badge>
        </div>
      </div>
    </div>
  ),
};

/**
 * Removable badge patterns with proper keyboard navigation.
 * Demonstrates accessible removal functionality.
 */
export const RemovalPatterns: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Removable Badges</h4>
        <div className="flex gap-2">
          <Badge variant="warning" removable onRemove={fn()}>
            Filter: Active
          </Badge>
          <Badge variant="info" removable onRemove={fn()}>
            Tag: Frontend
          </Badge>
          <Badge variant="neutral" removable onRemove={fn()}>
            Label: Draft
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Keyboard: Delete/Backspace to remove, Tab to focus
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Combined Interactive & Removable</h4>
        <div className="flex gap-2">
          <Badge variant="error" interactive removable onClick={fn()} onRemove={fn()}>
            Error (click for details)
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Click badge for details, click X or Delete key to remove
        </p>
      </div>
    </div>
  ),
};

/**
 * Loading states with proper accessibility announcements.
 * Shows trust building through clear state communication.
 */
export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Loading Indicators</h4>
        <div className="flex gap-2">
          <Badge variant="info" loading>
            Processing
          </Badge>
          <Badge variant="warning" loading>
            Validating
          </Badge>
          <Badge variant="success" loading>
            Uploading
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Loading with Icons</h4>
        <div className="flex gap-2">
          <Badge variant="info" loading icon={Download}>
            Downloading
          </Badge>
          <Badge variant="warning" loading icon={Settings}>
            Configuring
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Interactive Loading</h4>
        <div className="flex gap-2">
          <Badge variant="info" loading interactive onClick={fn()}>
            Cancel processing
          </Badge>
        </div>
      </div>
    </div>
  ),
};

/**
 * Animation controls demonstrating motion intelligence.
 * Respects user motion preferences for accessibility.
 */
export const AnimationControls: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Animated Badges</h4>
        <div className="flex gap-2">
          <Badge variant="error" animate emphasis="prominent">
            Live alert
          </Badge>
          <Badge variant="warning" animate>
            Attention needed
          </Badge>
          <Badge variant="info" animate loading>
            Processing
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Respects prefers-reduced-motion user preference
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Static Badges</h4>
        <div className="flex gap-2">
          <Badge variant="success">Completed</Badge>
          <Badge variant="neutral">Draft</Badge>
          <Badge variant="info">Information</Badge>
        </div>
      </div>
    </div>
  ),
};

/**
 * Badge combinations showing proper grouping and hierarchy.
 * Demonstrates attention budget management in complex interfaces.
 */
export const BadgeCombinations: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Status + Count Pattern</h4>
        <div className="flex gap-2">
          <Badge variant="error" emphasis="prominent">
            3
          </Badge>
          <Badge variant="error" emphasis="subtle">
            Critical Issues
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Category + Status Pattern</h4>
        <div className="flex gap-2">
          <Badge variant="neutral" emphasis="subtle">
            Frontend
          </Badge>
          <Badge variant="warning">Review Required</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Progressive Enhancement Pattern</h4>
        <div className="flex gap-2">
          <Badge variant="info">Base Status</Badge>
          <Badge variant="info" interactive onClick={fn()}>
            + Details
          </Badge>
          <Badge variant="info" removable onRemove={fn()}>
            Removable Filter
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Navigation Context Pattern</h4>
        <div className="border rounded p-4 space-y-2 max-w-xs">
          <div className="flex justify-between items-center">
            <span className="text-sm">Dashboard</span>
            <Badge variant="error" size="sm" emphasis="prominent">
              5
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Projects</span>
            <Badge variant="warning" size="sm" emphasis="subtle">
              2
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Team</span>
            <Badge variant="success" size="sm" emphasis="subtle">
              Active
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};
