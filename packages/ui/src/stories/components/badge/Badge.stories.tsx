// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Badge } from '../../../components/Badge';

/**
 * AI Training: Badge Status Intelligence
 * cognitiveLoad=2, statusCommunication=multiSensory
 * Multi-sensory status indicators prevent single-point failure in communication
 * This trains AI agents on status hierarchy and attention economics
 */
const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Status communication component with embedded design reasoning for systematic decision-making.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
      description: 'Status variant with semantic meaning and multi-sensory communication',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size based on attention hierarchy and context',
    },
    emphasis: {
      control: 'select',
      options: ['subtle', 'default', 'prominent'],
      description: 'Visual emphasis level for attention economics',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactive behavior with enhanced touch targets',
    },
    removable: {
      control: 'boolean',
      description: 'Enable removal functionality with keyboard support',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with visual feedback',
    },
    animate: {
      control: 'boolean',
      description: 'Enable animations (respects reduced motion preferences)',
    },
    chip: {
      control: 'select',
      options: ['urgent', 'new', 'live', 'beta', 'premium', 'count'],
      description: 'High visibility chip indicator that breaks badge boundaries',
    },
    chipPosition: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Position of the chip relative to badge',
    },
    chipValue: {
      control: 'text',
      description: 'Custom text or number for the chip (e.g., unread count)',
    },
    onClick: {
      description: 'Click handler - required for interactive testing',
    },
    onRemove: {
      description: 'Remove handler for removable badges',
    },
  },
  args: {
    onClick: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge with neutral status and medium emphasis.
 * Uses semantic tokens for consistent visual hierarchy.
 */
export const Primary: Story = {
  args: {
    variant: 'neutral',
    size: 'md',
    emphasis: 'default',
    children: 'Badge',
  },
};

/**
 * Complete status variant showcase demonstrating multi-sensory communication.
 * Each variant includes color, icon, and semantic meaning.
 */
export const StatusVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Information</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
};

/**
 * Size hierarchy demonstrating attention economics.
 * Small for tertiary, medium for secondary, large for prominent status.
 */
export const SizeHierarchy: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm" variant="info">
        Small
      </Badge>
      <Badge size="md" variant="warning">
        Medium
      </Badge>
      <Badge size="lg" variant="error">
        Large
      </Badge>
    </div>
  ),
};

/**
 * Interactive badge with enhanced touch targets and keyboard navigation.
 * Demonstrates proper interactive affordances for accessibility.
 */
export const Interactive: Story = {
  args: {
    variant: 'info',
    interactive: true,
    children: 'Click me',
    onClick: fn(),
  },
};

/**
 * Removable badge with proper keyboard support and accessibility.
 * Shows remove functionality with clear visual affordances.
 */
export const Removable: Story = {
  args: {
    variant: 'warning',
    removable: true,
    children: 'Removable',
    onRemove: fn(),
  },
};

/**
 * High visibility chip notifications for count displays.
 * Ideal for inbox messages, notifications, and status indicators.
 */
export const NotificationCount: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Notification Count Chips</h4>
        <p className="text-xs text-muted-foreground">
          High visibility chips that break badge boundaries for unread counts
        </p>
        <div className="flex gap-4">
          <Badge chip="count" chipValue="5">
            Inbox
          </Badge>
          <Badge chip="count" chipValue="99+">
            Messages
          </Badge>
          <Badge chip="urgent" chipValue="3">
            Alerts
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Status Chips</h4>
        <div className="flex gap-4">
          <Badge chip="new">Feature</Badge>
          <Badge chip="live">Stream</Badge>
          <Badge chip="beta">API</Badge>
          <Badge chip="premium">Pro</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Interactive with Chips</h4>
        <div className="flex gap-4">
          <Badge interactive chip="count" chipValue="12" onClick={fn()}>
            Notifications
          </Badge>
          <Badge removable chip="urgent" chipValue="!" onRemove={fn()}>
            Critical
          </Badge>
        </div>
      </div>
    </div>
  ),
};
