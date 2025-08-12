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

const meta = {
  title: 'Components/Tooltip/Variants',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Help Context
 *
 * Provides supplementary information that enhances understanding without being critical.
 * Uses soft, muted styling to indicate optional, supportive content.
 */
export const HelpContext: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip context="help">
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">
            ?
          </Button>
        </TooltipTrigger>
        <TooltipContent context="help">
          <TooltipTitle>Advanced Settings</TooltipTitle>
          <TooltipDescription>
            Configure advanced options for power users. Most users won't need these settings.
          </TooltipDescription>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  args: {
    context: 'help',
  },
  parameters: {
    docs: {
      description: {
        story:
          "Help tooltips use muted styling and 700ms delay. Perfect for explaining features, providing guidance, or offering additional context that isn't essential.",
      },
    },
  },
};

/**
 * Definition Context
 *
 * Clarifies terminology and concepts inline. Slightly more prominent than help
 * tooltips to support learning and comprehension.
 */
export const DefinitionContext: Story = {
  render: () => (
    <TooltipProvider>
      <div className="text-sm">
        Understanding{' '}
        <Tooltip context="definition">
          <TooltipTrigger asChild>
            <span className="underline cursor-help text-primary">semantic versioning</span>
          </TooltipTrigger>
          <TooltipContent context="definition">
            <TooltipTitle>Semantic Versioning</TooltipTitle>
            <TooltipDescription>
              A versioning scheme using MAJOR.MINOR.PATCH format to communicate the nature of
              changes
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>{' '}
        helps with dependency management.
      </div>
    </TooltipProvider>
  ),
  args: {
    context: 'definition',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Definition tooltips explain terms and concepts inline. Use for jargon, acronyms, or technical terms that may not be familiar to all users.',
      },
    },
  },
};

/**
 * Action Context
 *
 * Previews outcomes and shows keyboard shortcuts for interactive elements.
 * Uses accent styling to align with interactive element hierarchy.
 */
export const ActionContext: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip context="action">
        <TooltipTrigger asChild>
          <Button variant="primary">Deploy</Button>
        </TooltipTrigger>
        <TooltipContent context="action">
          <TooltipTitle>Deploy to Production</TooltipTitle>
          <TooltipDescription>
            Builds and deploys your app to production. Process takes 2-3 minutes.
          </TooltipDescription>
          <TooltipShortcut>⌘⇧D</TooltipShortcut>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  args: {
    context: 'action',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Action tooltips preview outcomes and show shortcuts. Perfect for buttons and interactive elements where users need to understand consequences.',
      },
    },
  },
};

/**
 * Status Context
 *
 * Communicates system state and operational information. Provides contextual
 * coloring and faster access for operational awareness.
 */
export const StatusContext: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        <Tooltip context="status">
          <TooltipTrigger asChild>
            <div className="w-4 h-4 bg-success rounded-full cursor-help" />
          </TooltipTrigger>
          <TooltipContent context="status">
            <TooltipTitle>System Operational</TooltipTitle>
            <TooltipDescription>
              All services running normally. Last check: 2 minutes ago.
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>
        <span className="text-sm">All Systems Operational</span>
      </div>
    </TooltipProvider>
  ),
  args: {
    context: 'status',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Status tooltips communicate system state with 600ms delay. Use for health indicators, connection states, or progress information.',
      },
    },
  },
};

/**
 * Shortcut Context
 *
 * Quick access for power users with emphasized styling and fast timing.
 * Uses monospace font and reduced delay for keyboard-focused workflows.
 */
export const ShortcutContext: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip context="shortcut">
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="font-mono">
            ⌘K
          </Button>
        </TooltipTrigger>
        <TooltipContent context="shortcut">
          Command Palette
          <TooltipShortcut>⌘K</TooltipShortcut>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  args: {
    context: 'shortcut',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shortcut tooltips use monospace styling and 300ms delay for power users. Perfect for keyboard shortcuts and quick actions.',
      },
    },
  },
};

/**
 * Essential Information
 *
 * Critical information that requires immediate attention. Enhanced visibility
 * and fastest timing (500ms) for important warnings or urgent context.
 */
export const EssentialInformation: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip essential={true} context="help">
        <TooltipTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </TooltipTrigger>
        <TooltipContent essential={true}>
          <TooltipTitle>⚠️ Permanent Action</TooltipTitle>
          <TooltipDescription>
            This cannot be undone. All data will be permanently deleted.
          </TooltipDescription>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  args: {
    essential: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Essential tooltips get enhanced visibility and 500ms delay for critical information that users must see quickly.',
      },
    },
  },
};

/**
 * Context Comparison
 *
 * Side-by-side comparison of all context types showing visual and timing differences.
 */
export const ContextComparison: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center space-y-2">
            <Tooltip context="help">
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Help
                </Button>
              </TooltipTrigger>
              <TooltipContent context="help">Muted styling, 700ms delay</TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground">Soft, supportive</p>
          </div>

          <div className="text-center space-y-2">
            <Tooltip context="definition">
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Definition
                </Button>
              </TooltipTrigger>
              <TooltipContent context="definition">Card styling, 700ms delay</TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground">Educational</p>
          </div>

          <div className="text-center space-y-2">
            <Tooltip context="action">
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Action
                </Button>
              </TooltipTrigger>
              <TooltipContent context="action">Accent styling, 700ms delay</TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground">Interactive</p>
          </div>

          <div className="text-center space-y-2">
            <Tooltip context="status">
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Status
                </Button>
              </TooltipTrigger>
              <TooltipContent context="status">Secondary styling, 600ms delay</TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground">Informational</p>
          </div>

          <div className="text-center space-y-2">
            <Tooltip context="shortcut">
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Shortcut
                </Button>
              </TooltipTrigger>
              <TooltipContent context="shortcut">Monospace, 300ms delay</TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground">Power users</p>
          </div>

          <div className="text-center space-y-2">
            <Tooltip essential={true}>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Essential
                </Button>
              </TooltipTrigger>
              <TooltipContent essential={true}>Enhanced ring, 500ms delay</TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete comparison of all tooltip contexts showing their distinct visual treatments and timing characteristics.',
      },
    },
  },
};
