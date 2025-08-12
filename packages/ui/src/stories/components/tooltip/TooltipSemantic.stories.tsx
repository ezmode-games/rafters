import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipDescription,
  TooltipProvider,
  TooltipShortcut,
  TooltipTitle,
  TooltipTrigger,
} from '../../../components/Tooltip';

/**
 * Semantic usage patterns demonstrate contextual intelligence in real-world scenarios.
 * Each pattern shows appropriate tooltip context for common interface situations.
 */
const meta = {
  title: 'Components/Tooltip/Semantic',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Real-world semantic usage patterns showing how tooltip contexts apply to common interface scenarios.',
      },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Form Enhancement
 *
 * Tooltips enhance form usability without cluttering the interface.
 * Different contexts provide appropriate guidance for form fields.
 */
export const FormEnhancement: Story = {
  render: () => (
    <TooltipProvider>
      <div className="max-w-md space-y-6 p-6">
        {/* Password field with security guidance */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Tooltip context="help" complexity="detailed">
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                >
                  ?
                </Button>
              </TooltipTrigger>
              <TooltipContent context="help" complexity="detailed">
                <TooltipTitle>Password Requirements</TooltipTitle>
                <TooltipDescription>
                  Must be at least 12 characters with a mix of letters, numbers, and symbols. Avoid
                  common words or patterns.
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>
          <input
            type="password"
            id="password"
            placeholder="Enter secure password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* API key field with definition */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              API Key
            </label>
            <Tooltip context="definition">
              <TooltipTrigger asChild>
                <span className="text-xs underline cursor-help text-primary">What's this?</span>
              </TooltipTrigger>
              <TooltipContent context="definition">
                <TooltipTitle>API Key</TooltipTitle>
                <TooltipDescription>
                  A unique identifier used to authenticate requests to external services. Keep this
                  secure and never share it publicly.
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>
          <input
            type="password"
            id="api-key"
            placeholder="sk-..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Submit button with action preview */}
        <Tooltip context="action">
          <TooltipTrigger asChild>
            <Button variant="primary" className="w-full">
              Save Settings
            </Button>
          </TooltipTrigger>
          <TooltipContent context="action">
            <TooltipTitle>Save Configuration</TooltipTitle>
            <TooltipDescription>
              Validates and saves your settings. Changes take effect immediately.
            </TooltipDescription>
            <TooltipShortcut>⌘S</TooltipShortcut>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Form tooltips provide contextual guidance without cluttering the interface. Help for fields, definitions for terms, actions for buttons.',
      },
    },
  },
};

/**
 * Toolbar Actions
 *
 * Toolbars benefit greatly from tooltips to explain icon meanings and show shortcuts.
 * Different contexts communicate the nature of each tool.
 */
export const ToolbarActions: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-1 p-2 bg-muted rounded-md">
          <Tooltip context="action">
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                ↶
              </Button>
            </TooltipTrigger>
            <TooltipContent context="action">
              Undo last action
              <TooltipShortcut>⌘Z</TooltipShortcut>
            </TooltipContent>
          </Tooltip>

          <Tooltip context="action">
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                ↷
              </Button>
            </TooltipTrigger>
            <TooltipContent context="action">
              Redo last action
              <TooltipShortcut>⌘⇧Z</TooltipShortcut>
            </TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />

          <Tooltip context="action">
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 font-bold">
                B
              </Button>
            </TooltipTrigger>
            <TooltipContent context="action">
              Bold text
              <TooltipShortcut>⌘B</TooltipShortcut>
            </TooltipContent>
          </Tooltip>

          <Tooltip context="action">
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 italic">
                I
              </Button>
            </TooltipTrigger>
            <TooltipContent context="action">
              Italic text
              <TooltipShortcut>⌘I</TooltipShortcut>
            </TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-border mx-1" />

          <Tooltip context="help" complexity="detailed">
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                ⚙️
              </Button>
            </TooltipTrigger>
            <TooltipContent context="help" complexity="detailed">
              <TooltipTitle>Advanced Settings</TooltipTitle>
              <TooltipDescription>
                Configure advanced editing options including auto-save, spell check, and formatting
                preferences.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </div>

        <p className="text-sm text-muted-foreground">
          Icon-only toolbars require tooltips for accessibility and discoverability
        </p>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Toolbar tooltips are essential for accessibility. Action context shows shortcuts, help context explains complex tools.',
      },
    },
  },
};

/**
 * Status Dashboard
 *
 * Status indicators combined with informative tooltips provide operational awareness.
 * Status context optimizes timing for operational information.
 */
export const StatusDashboard: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-6 max-w-sm">
        <h4 className="font-medium">System Status</h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Database</span>
            <Tooltip context="status">
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm text-success-foreground">Operational</span>
                </div>
              </TooltipTrigger>
              <TooltipContent context="status">
                <TooltipTitle>Database Status</TooltipTitle>
                <TooltipDescription>
                  All database connections healthy. Query response time: 45ms average.
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">API Gateway</span>
            <Tooltip context="status">
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                  <span className="text-sm text-warning-foreground">Degraded</span>
                </div>
              </TooltipTrigger>
              <TooltipContent context="status">
                <TooltipTitle>API Gateway Status</TooltipTitle>
                <TooltipDescription>
                  Response times 15% slower than normal. Investigating performance issues.
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Payment System</span>
            <Tooltip essential={true} context="status">
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-sm text-destructive-foreground">Outage</span>
                </div>
              </TooltipTrigger>
              <TooltipContent essential={true} context="status">
                <TooltipTitle>⚠️ Payment System Outage</TooltipTitle>
                <TooltipDescription>
                  Payment processing temporarily unavailable. Estimated restoration: 30 minutes.
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Status tooltips provide operational context with appropriate urgency. Critical issues use essential timing.',
      },
    },
  },
};

/**
 * Data Visualization
 *
 * Charts and data visualizations use tooltips to reveal detailed information on demand.
 * Definition context helps explain metrics and calculations.
 */
export const DataVisualization: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-6 max-w-lg">
        <h4 className="font-medium">Performance Metrics</h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Response Time</span>
                <Tooltip context="definition">
                  <TooltipTrigger asChild>
                    <span className="text-xs text-muted-foreground underline cursor-help">
                      95th percentile
                    </span>
                  </TooltipTrigger>
                  <TooltipContent context="definition">
                    <TooltipTitle>95th Percentile</TooltipTitle>
                    <TooltipDescription>
                      95% of requests complete faster than this time. Excludes the slowest 5% which
                      may be outliers.
                    </TooltipDescription>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-2xl font-bold">245ms</div>
            </div>

            <Tooltip context="help">
              <TooltipTrigger asChild>
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center cursor-help">
                  <div className="text-success-foreground font-bold">Good</div>
                </div>
              </TooltipTrigger>
              <TooltipContent context="help">
                <TooltipTitle>Performance Rating</TooltipTitle>
                <TooltipDescription>
                  Response times under 300ms provide excellent user experience. Current performance
                  is within optimal range.
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center justify-between p-3 border rounded">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Error Rate</span>
                <Tooltip context="definition">
                  <TooltipTrigger asChild>
                    <span className="text-xs text-muted-foreground underline cursor-help">
                      Last 24h
                    </span>
                  </TooltipTrigger>
                  <TooltipContent context="definition">
                    <TooltipTitle>Error Rate Calculation</TooltipTitle>
                    <TooltipDescription>
                      Percentage of requests resulting in 4xx or 5xx HTTP status codes over the last
                      24 hours.
                    </TooltipDescription>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-2xl font-bold">0.02%</div>
            </div>

            <Tooltip context="help">
              <TooltipTrigger asChild>
                <div className="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center cursor-help">
                  <div className="text-info-foreground font-bold">Low</div>
                </div>
              </TooltipTrigger>
              <TooltipContent context="help">
                <TooltipTitle>Error Rate Assessment</TooltipTitle>
                <TooltipDescription>
                  Error rates below 0.1% indicate stable system performance. Current rate suggests
                  excellent reliability.
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Data visualization tooltips explain metrics and provide context. Definition context clarifies calculations.',
      },
    },
  },
};

/**
 * Navigation Enhancement
 *
 * Navigation elements use tooltips to provide additional context and shortcuts.
 * Different contexts communicate the nature of navigation items.
 */
export const NavigationEnhancement: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-6">
        <nav className="flex items-center space-x-1 p-2 bg-muted rounded-md">
          <Tooltip context="help">
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </TooltipTrigger>
            <TooltipContent context="help">
              Overview of your account activity and key metrics
            </TooltipContent>
          </Tooltip>

          <Tooltip context="shortcut">
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                Projects
              </Button>
            </TooltipTrigger>
            <TooltipContent context="shortcut">
              Manage projects
              <TooltipShortcut>⌘P</TooltipShortcut>
            </TooltipContent>
          </Tooltip>

          <Tooltip context="definition" complexity="detailed">
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                Analytics
              </Button>
            </TooltipTrigger>
            <TooltipContent context="definition" complexity="detailed">
              <TooltipTitle>Advanced Analytics</TooltipTitle>
              <TooltipDescription>
                Detailed performance insights, user behavior analysis, and conversion tracking.
                Requires Pro plan or higher.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>

          <Tooltip essential={true} context="status">
            <TooltipTrigger asChild>
              <Button variant="primary" size="sm" className="relative">
                Notifications
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            </TooltipTrigger>
            <TooltipContent essential={true} context="status">
              <TooltipTitle>3 New Notifications</TooltipTitle>
              <TooltipDescription>
                You have unread system alerts and messages requiring attention.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </nav>

        <p className="text-sm text-muted-foreground">
          Navigation tooltips provide context without cluttering the interface
        </p>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Navigation tooltips enhance discoverability. Help for features, shortcuts for power users, status for notifications.',
      },
    },
  },
};
