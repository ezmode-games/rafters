import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/Select';

/**
 * Semantic meaning creates understanding through context and purpose.
 * Each selection serves specific interaction patterns and user goals.
 */
const meta = {
  title: '03 Components/Form/Select/Semantic Usage',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic patterns that establish clear meaning and context for different types of selection scenarios.',
      },
    },
  },
  tags: ['autodocs'],
  args: { onValueChange: fn() },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Status Selection
 *
 * Communicates state changes and workflow progression.
 * Clear options help users understand available transitions.
 */
export const StatusSelection: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Status Management</h3>
        <p className="text-sm text-muted-foreground">
          Status selections guide workflow progression and state management.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="task-status" className="text-sm font-medium">
            Task Status
          </label>
          <Select defaultValue="in-progress">
            <SelectTrigger id="task-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="order-status" className="text-sm font-medium">
            Order Status
          </label>
          <Select defaultValue="processing">
            <SelectTrigger id="order-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending Payment</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Status selections provide clear workflow progression with meaningful state transitions.',
      },
    },
  },
};

/**
 * Category Organization
 *
 * Hierarchical organization helps users navigate complex choices.
 * Clear categorization reduces cognitive load in selection.
 */
export const CategorySelection: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Category Organization</h3>
        <p className="text-sm text-muted-foreground">
          Organized categories help users navigate and understand available options.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="product-category" className="text-sm font-medium">
            Product Category
          </label>
          <Select>
            <SelectTrigger id="product-category" showCount itemCount={8}>
              <SelectValue placeholder="Choose category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing & Fashion</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="books">Books & Media</SelectItem>
              <SelectItem value="sports">Sports & Outdoors</SelectItem>
              <SelectItem value="automotive">Automotive</SelectItem>
              <SelectItem value="health">Health & Beauty</SelectItem>
              <SelectItem value="toys">Toys & Games</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="support-category" className="text-sm font-medium">
            Support Category
          </label>
          <Select>
            <SelectTrigger id="support-category">
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="billing">Billing & Payments</SelectItem>
              <SelectItem value="technical">Technical Support</SelectItem>
              <SelectItem value="account">Account Management</SelectItem>
              <SelectItem value="feature">Feature Request</SelectItem>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Category selections organize complex option sets into understandable groupings.',
      },
    },
  },
};

/**
 * Priority and Urgency
 *
 * Priority selections communicate importance and urgency levels.
 * Clear hierarchy helps users make informed decisions.
 */
export const PrioritySelection: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Priority Levels</h3>
        <p className="text-sm text-muted-foreground">
          Priority selections establish clear importance and urgency hierarchy.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="task-priority" className="text-sm font-medium">
            Task Priority
          </label>
          <Select defaultValue="medium">
            <SelectTrigger id="task-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">🔴 Urgent</SelectItem>
              <SelectItem value="high">🟠 High</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="low">🟢 Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="severity-level" className="text-sm font-medium">
            Issue Severity
          </label>
          <Select>
            <SelectTrigger id="severity-level">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical - System Down</SelectItem>
              <SelectItem value="major">Major - Core Feature Broken</SelectItem>
              <SelectItem value="minor">Minor - Limited Impact</SelectItem>
              <SelectItem value="cosmetic">Cosmetic - UI/UX Issue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Priority selections communicate urgency and importance through clear hierarchical options.',
      },
    },
  },
};

/**
 * Settings and Preferences
 *
 * Configuration selections for user preferences and system settings.
 * Clear options help users understand the impact of their choices.
 */
export const SettingsSelection: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Settings & Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configuration selections that control behavior and user experience.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="theme-preference" className="text-sm font-medium">
            Theme Preference
          </label>
          <Select defaultValue="system">
            <SelectTrigger id="theme-preference">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light Mode</SelectItem>
              <SelectItem value="dark">Dark Mode</SelectItem>
              <SelectItem value="system">Follow System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="notification-frequency" className="text-sm font-medium">
            Notification Frequency
          </label>
          <Select defaultValue="daily">
            <SelectTrigger id="notification-frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="hourly">Every Hour</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Summary</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="language-preference" className="text-sm font-medium">
            Language
          </label>
          <Select defaultValue="en">
            <SelectTrigger id="language-preference" showCount itemCount={5}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent searchable searchPlaceholder="Search languages...">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Settings selections provide clear control over system behavior and user preferences.',
      },
    },
  },
};
