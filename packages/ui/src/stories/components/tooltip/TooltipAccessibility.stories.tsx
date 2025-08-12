import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipDescription,
  TooltipProvider,
  TooltipTitle,
  TooltipTrigger,
} from '../../../components/Tooltip';

const meta = {
  title: 'Components/Tooltip/Accessibility',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Keyboard Navigation: Full keyboard accessibility support
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          Tab through elements, press Enter/Space to activate tooltips, Escape to dismiss
        </p>
        <div className="flex gap-4">
          <Tooltip context="help">
            <TooltipTrigger asChild>
              <Button variant="outline">Tab to focus</Button>
            </TooltipTrigger>
            <TooltipContent context="help">
              <TooltipTitle>Keyboard Accessible</TooltipTitle>
              <TooltipDescription>
                Focus with Tab, activate with Enter or Space, dismiss with Escape
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>

          <Tooltip context="action">
            <TooltipTrigger asChild>
              <Button variant="primary">Action Button</Button>
            </TooltipTrigger>
            <TooltipContent context="action">
              Fully keyboard accessible with proper focus management
            </TooltipContent>
          </Tooltip>

          <Tooltip essential={true}>
            <TooltipTrigger asChild>
              <Button variant="destructive">Critical Action</Button>
            </TooltipTrigger>
            <TooltipContent essential={true}>
              <TooltipTitle>⚠️ Important</TooltipTitle>
              <TooltipDescription>
                Essential information is announced immediately to screen readers
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Tooltips are fully keyboard accessible. Use Tab to navigate, Enter/Space to activate, and Escape to dismiss.',
      },
    },
  },
};

/**
 * Screen Reader Support: Proper ARIA labeling and announcements
 */
export const ScreenReaderSupport: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Icon Buttons with Labels</h4>
          <div className="flex gap-2">
            <Tooltip context="help">
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0" aria-label="Help">
                  ?
                </Button>
              </TooltipTrigger>
              <TooltipContent context="help">Get help with this feature</TooltipContent>
            </Tooltip>

            <Tooltip context="action">
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0" aria-label="Settings">
                  ⚙️
                </Button>
              </TooltipTrigger>
              <TooltipContent context="action">Open application settings</TooltipContent>
            </Tooltip>

            <Tooltip context="status">
              <TooltipTrigger asChild>
                <div
                  className="w-6 h-6 bg-success rounded-full cursor-help"
                  role="status"
                  aria-label="System status"
                />
              </TooltipTrigger>
              <TooltipContent context="status">
                System operational - all services running
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Essential Information</h4>
          <Tooltip essential={true} context="help">
            <TooltipTrigger asChild>
              <Button variant="destructive" aria-describedby="essential-tooltip">
                Delete All Data
              </Button>
            </TooltipTrigger>
            <TooltipContent essential={true} id="essential-tooltip" role="tooltip">
              <TooltipTitle>⚠️ Permanent Deletion</TooltipTitle>
              <TooltipDescription>
                This action permanently deletes all your data and cannot be undone.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Proper ARIA labeling ensures screen reader users get full context. Essential tooltips are announced immediately.',
      },
    },
  },
};

/**
 * High Contrast Support: Maintains readability in all display modes
 */
export const HighContrastSupport: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          All tooltip contexts maintain proper contrast ratios in high contrast mode
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Tooltip context="help">
            <TooltipTrigger asChild>
              <Button variant="outline">Help Context</Button>
            </TooltipTrigger>
            <TooltipContent context="help">Maintains contrast in high contrast mode</TooltipContent>
          </Tooltip>

          <Tooltip context="action">
            <TooltipTrigger asChild>
              <Button variant="primary">Action Context</Button>
            </TooltipTrigger>
            <TooltipContent context="action">
              Clear visibility across all display modes
            </TooltipContent>
          </Tooltip>

          <Tooltip essential={true}>
            <TooltipTrigger asChild>
              <Button variant="destructive">Essential Info</Button>
            </TooltipTrigger>
            <TooltipContent essential={true}>
              Enhanced visibility for critical information
            </TooltipContent>
          </Tooltip>

          <Tooltip context="status">
            <TooltipTrigger asChild>
              <Button variant="secondary">Status Info</Button>
            </TooltipTrigger>
            <TooltipContent context="status">Accessible status information display</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All tooltip variants maintain WCAG AA contrast ratios and work properly in high contrast display modes.',
      },
    },
  },
};

/**
 * Motor Accessibility: Touch-friendly and steady-hand support
 */
export const MotorAccessibility: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Large Touch Targets</h4>
          <p className="text-sm text-muted-foreground">
            Minimum 44px touch targets for easy interaction
          </p>
          <div className="flex gap-4">
            <Tooltip context="help">
              <TooltipTrigger asChild>
                <Button size="lg">Large Button</Button>
              </TooltipTrigger>
              <TooltipContent context="help">
                Large touch target meets accessibility guidelines
              </TooltipContent>
            </Tooltip>

            <Tooltip context="action">
              <TooltipTrigger asChild>
                <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center cursor-pointer text-primary-foreground">
                  ✓
                </div>
              </TooltipTrigger>
              <TooltipContent context="action">
                48px touch target exceeds minimum requirements
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Forgiving Hover Areas</h4>
          <p className="text-sm text-muted-foreground">
            Tooltips don't disappear immediately when mouse leaves trigger
          </p>
          <Tooltip context="help">
            <TooltipTrigger asChild>
              <Button variant="outline">Stable Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent context="help">
              <TooltipTitle>Forgiving Interaction</TooltipTitle>
              <TooltipDescription>
                This tooltip stays open even if your mouse moves slightly, making it easier for
                users with motor difficulties.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Motor accessibility features include large touch targets and forgiving hover behavior for users with limited dexterity.',
      },
    },
  },
};

/**
 * Reduced Motion Support: Respects user motion preferences
 */
export const ReducedMotionSupport: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Animations respect prefers-reduced-motion for users with vestibular disorders
        </p>
        <div className="flex gap-4">
          <Tooltip context="help">
            <TooltipTrigger asChild>
              <Button variant="outline">Standard Animation</Button>
            </TooltipTrigger>
            <TooltipContent context="help">
              Respects user motion preferences automatically
            </TooltipContent>
          </Tooltip>

          <Tooltip essential={true}>
            <TooltipTrigger asChild>
              <Button variant="destructive">Critical Info</Button>
            </TooltipTrigger>
            <TooltipContent essential={true}>
              Essential information appears without distracting motion
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Tooltip animations automatically reduce or disable based on user motion preferences to prevent vestibular disorders.',
      },
    },
  },
};
