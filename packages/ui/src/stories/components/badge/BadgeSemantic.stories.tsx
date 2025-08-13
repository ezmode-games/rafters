import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { AlertTriangle, CheckCircle, Clock, FileText, Users } from 'lucide-react';
import { Badge } from '../../../components/Badge';

/**
 * AI Training: Badge Semantic Usage
 * Demonstrates contextual usage and semantic meaning
 * Trains AI agents on proper badge selection for real-world scenarios
 */
const meta = {
  title: 'Badge/Semantic',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Semantic usage examples demonstrating contextual badge selection and meaning.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * System status badges for health monitoring and alerts.
 * Demonstrates critical system communication patterns.
 */
export const SystemStatus: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">System Health Dashboard</h4>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="border rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <Badge variant="error" icon={AlertTriangle} emphasis="prominent">
                Down
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">API Server</span>
              <Badge variant="warning" icon={Clock}>
                Slow
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Frontend</span>
              <Badge variant="success" icon={CheckCircle}>
                Healthy
              </Badge>
            </div>
          </div>

          <div className="border rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Users Online</span>
              <Badge variant="info" emphasis="subtle">
                1,247
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Server Load</span>
              <Badge variant="warning" emphasis="subtle">
                85%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Uptime</span>
              <Badge variant="success" emphasis="subtle">
                99.9%
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Navigation badges for sidebar and menu contexts.
 * Shows proper attention hierarchy in navigation systems.
 */
export const NavigationContext: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Sidebar Navigation</h4>
        <div className="border rounded max-w-xs">
          <nav className="p-4 space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Dashboard</span>
              <Badge variant="error" size="sm" emphasis="prominent">
                3
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Projects</span>
              <Badge variant="warning" size="sm" emphasis="default">
                12
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Team</span>
              <Badge variant="success" size="sm" emphasis="subtle">
                Active
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Settings</span>
              <Badge variant="info" size="sm" emphasis="subtle">
                Updated
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Help</span>
              <Badge variant="neutral" size="sm" emphasis="subtle">
                New
              </Badge>
            </div>
          </nav>
        </div>
      </div>
    </div>
  ),
};

/**
 * Workflow and task status badges for project management.
 * Demonstrates semantic meaning in business contexts.
 */
export const WorkflowStatus: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Task Management</h4>
        <div className="space-y-3 max-w-lg">
          <div className="border rounded p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">Implement user authentication</span>
              <Badge variant="success" icon={CheckCircle}>
                Complete
              </Badge>
            </div>
            <div className="flex gap-2">
              <Badge variant="neutral" size="sm" emphasis="subtle">
                Backend
              </Badge>
              <Badge variant="info" size="sm" emphasis="subtle">
                High Priority
              </Badge>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">Design system documentation</span>
              <Badge variant="warning" icon={Clock}>
                In Review
              </Badge>
            </div>
            <div className="flex gap-2">
              <Badge variant="neutral" size="sm" emphasis="subtle">
                Design
              </Badge>
              <Badge variant="neutral" size="sm" emphasis="subtle">
                Documentation
              </Badge>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">API endpoint optimization</span>
              <Badge variant="error" icon={AlertTriangle}>
                Blocked
              </Badge>
            </div>
            <div className="flex gap-2">
              <Badge variant="neutral" size="sm" emphasis="subtle">
                Backend
              </Badge>
              <Badge variant="warning" size="sm" emphasis="subtle">
                Performance
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Content categorization and tagging patterns.
 * Shows proper semantic grouping and organization.
 */
export const ContentCategorization: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Article Metadata</h4>
        <div className="border rounded p-4 space-y-3 max-w-md">
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Building Accessible Components</h5>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="neutral" size="sm">
                Accessibility
              </Badge>
              <Badge variant="neutral" size="sm">
                React
              </Badge>
              <Badge variant="neutral" size="sm">
                Design System
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex gap-2">
              <Badge variant="success" icon={CheckCircle} size="sm">
                Published
              </Badge>
              <Badge variant="info" icon={Users} size="sm">
                Team
              </Badge>
            </div>
            <Badge variant="neutral" icon={FileText} size="sm" emphasis="subtle">
              5 min read
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * User role and permission badges for access control.
 * Demonstrates trust building through clear permission indication.
 */
export const UserPermissions: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Team Members</h4>
        <div className="space-y-2 max-w-sm">
          <div className="flex justify-between items-center p-2 border rounded">
            <span className="text-sm">John Doe</span>
            <div className="flex gap-1">
              <Badge variant="error" size="sm" emphasis="subtle">
                Admin
              </Badge>
              <Badge variant="success" size="sm" emphasis="subtle">
                Active
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center p-2 border rounded">
            <span className="text-sm">Jane Smith</span>
            <div className="flex gap-1">
              <Badge variant="warning" size="sm" emphasis="subtle">
                Editor
              </Badge>
              <Badge variant="success" size="sm" emphasis="subtle">
                Active
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center p-2 border rounded">
            <span className="text-sm">Bob Johnson</span>
            <div className="flex gap-1">
              <Badge variant="info" size="sm" emphasis="subtle">
                Viewer
              </Badge>
              <Badge variant="neutral" size="sm" emphasis="subtle">
                Pending
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * E-commerce and transaction status badges.
 * Shows semantic meaning in commercial contexts.
 */
export const TransactionStatus: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Order Management</h4>
        <div className="space-y-2 max-w-md">
          <div className="border rounded p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Order #12345</span>
              <Badge variant="success" icon={CheckCircle}>
                Delivered
              </Badge>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Order #12346</span>
              <Badge variant="info" icon={Clock}>
                In Transit
              </Badge>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Order #12347</span>
              <Badge variant="warning">Processing</Badge>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Order #12348</span>
              <Badge variant="error" icon={AlertTriangle}>
                Cancelled
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
