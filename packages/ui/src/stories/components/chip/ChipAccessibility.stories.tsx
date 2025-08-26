// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Chip } from '../../../components/Chip';

/**
 * Chip Accessibility Testing
 * Ensures WCAG AAA compliance and keyboard navigation support
 */
const meta = {
  title: 'Components/Chip/Accessibility',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessibility compliance testing for Chip component with keyboard navigation and screen reader support.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['urgent', 'new', 'live', 'beta', 'premium', 'count'],
      description: 'Semantic variant with attention economics',
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Keyboard navigation patterns for chip interaction
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <h4 className="text-sm font-medium">Focus States for Chip Overlays</h4>
      <div className="flex flex-wrap gap-8">
        <div className="relative">
          <button
            type="button"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-describedby="urgent-chip"
          >
            Settings
          </button>
          <Chip variant="urgent" value="!" aria-label="Urgent attention required" />
        </div>

        <div className="relative">
          <button
            type="button"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-describedby="count-chip"
          >
            Messages
          </button>
          <Chip variant="count" value="3" aria-label="3 unread messages" />
        </div>

        <div className="relative">
          <button
            type="button"
            className="px-4 py-2 bg-muted text-muted-foreground rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-describedby="new-chip"
          >
            Features
          </button>
          <Chip variant="new" aria-label="New feature available" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Chips work with keyboard navigation by providing proper ARIA labels and descriptions for parent elements.',
      },
    },
  },
};

/**
 * Screen reader compatibility with proper ARIA labels
 */
export const ScreenReaderSupport: Story = {
  render: () => (
    <div className="space-y-6">
      <h4 className="text-sm font-medium">Chip ARIA Labels for Screen Readers</h4>
      <div className="grid gap-6">
        <div className="space-y-4">
          <h5 className="text-xs font-medium text-muted-foreground">Status Notifications</h5>
          <div className="flex flex-wrap gap-8">
            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 bg-card border rounded-md"
                aria-describedby="status-chip"
              >
                System Status
              </button>
              <Chip variant="live" aria-label="System is currently live and operational" />
            </div>

            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 bg-card border rounded-md"
                aria-describedby="beta-chip"
              >
                Beta Features
              </button>
              <Chip
                variant="beta"
                aria-label="Beta feature available - experimental functionality"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="text-xs font-medium text-muted-foreground">Count Notifications</h5>
          <div className="flex flex-wrap gap-8">
            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 bg-card border rounded-md"
                aria-describedby="message-count"
              >
                Messages
              </button>
              <Chip variant="count" value="5" aria-label="5 unread messages" />
            </div>

            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 bg-card border rounded-md"
                aria-describedby="urgent-count"
              >
                Alerts
              </button>
              <Chip
                variant="urgent"
                value="!"
                aria-label="Urgent alert requiring immediate attention"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Chips include proper ARIA labels for screen reader compatibility, announcing status and count information.',
      },
    },
  },
};

/**
 * High contrast mode compatibility
 */
export const HighContrast: Story = {
  render: () => (
    <div className="space-y-6">
      <h4 className="text-sm font-medium">High Contrast Mode Compatibility</h4>

      {/* Light Mode Demo */}
      <div className="space-y-4 p-4 bg-background border rounded-lg">
        <h5 className="text-xs font-medium text-muted-foreground">Standard Contrast</h5>
        <div className="flex flex-wrap gap-8">
          <div className="relative">
            <div className="px-4 py-2 bg-card border rounded-md">Standard Mode</div>
            <Chip variant="urgent" value="!" aria-label="Urgent notification" />
          </div>

          <div className="relative">
            <div className="px-4 py-2 bg-card border rounded-md">Count Example</div>
            <Chip variant="count" value="3" aria-label="3 notifications" />
          </div>

          <div className="relative">
            <div className="px-4 py-2 bg-card border rounded-md">Status Example</div>
            <Chip variant="live" aria-label="Live status" />
          </div>
        </div>
      </div>

      {/* High Contrast Demo */}
      <div className="space-y-4 p-4 bg-black text-white border rounded-lg">
        <h5 className="text-xs font-medium text-gray-300">High Contrast Mode</h5>
        <div className="flex flex-wrap gap-8">
          <div className="relative">
            <div className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white">
              High Contrast
            </div>
            <Chip variant="urgent" value="!" aria-label="Urgent notification - high contrast" />
          </div>

          <div className="relative">
            <div className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white">
              Count Example
            </div>
            <Chip variant="count" value="3" aria-label="3 notifications - high contrast" />
          </div>

          <div className="relative">
            <div className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white">
              Premium Feature
            </div>
            <Chip variant="premium" aria-label="Premium feature - high contrast" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Chips maintain proper contrast ratios and visibility in both standard and high contrast environments.',
      },
    },
  },
};
