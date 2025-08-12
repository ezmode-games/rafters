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
  title: 'Components/Tooltip/Intelligence',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Timing Intelligence: Different delays for different content types
 * Prevents accidental triggers while ensuring information accessibility
 */
export const TimingIntelligence: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-4 flex-wrap">
        <Tooltip essential={true}>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="sm">
              Critical (500ms)
            </Button>
          </TooltipTrigger>
          <TooltipContent essential={true}>⚠️ Essential information appears quickly</TooltipContent>
        </Tooltip>

        <Tooltip context="shortcut">
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              Shortcut (300ms)
            </Button>
          </TooltipTrigger>
          <TooltipContent context="shortcut">Quick access for power users</TooltipContent>
        </Tooltip>

        <Tooltip context="help">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Standard (700ms)
            </Button>
          </TooltipTrigger>
          <TooltipContent context="help">Balanced delay prevents accidents</TooltipContent>
        </Tooltip>

        <Tooltip complexity="detailed">
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm">
              Detailed (1200ms)
            </Button>
          </TooltipTrigger>
          <TooltipContent complexity="detailed">
            <TooltipTitle>Complex Information</TooltipTitle>
            <TooltipDescription>
              Longer delay prevents accidental triggering during navigation
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

/**
 * Contextual Intelligence: Visual and behavioral adaptation by context type
 */
export const ContextualAdaptation: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-6 max-w-2xl">
        {/* Help Context - Soft, supportive */}
        <div className="flex items-center gap-3">
          <span className="text-sm w-20">Help:</span>
          <Tooltip context="help">
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Advanced Settings
              </Button>
            </TooltipTrigger>
            <TooltipContent context="help">
              <TooltipTitle>Advanced Settings</TooltipTitle>
              <TooltipDescription>
                Configure advanced options for power users. Most users won't need these settings.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Definition Context - Educational */}
        <div className="flex items-center gap-3">
          <span className="text-sm w-20">Definition:</span>
          <p className="text-sm">
            Understanding{' '}
            <Tooltip context="definition">
              <TooltipTrigger asChild>
                <span className="underline cursor-help text-primary">semantic versioning</span>
              </TooltipTrigger>
              <TooltipContent context="definition">
                <TooltipTitle>Semantic Versioning</TooltipTitle>
                <TooltipDescription>
                  A versioning scheme using MAJOR.MINOR.PATCH format to communicate changes
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>{' '}
            helps with dependency management.
          </p>
        </div>

        {/* Action Context - Outcome preview */}
        <div className="flex items-center gap-3">
          <span className="text-sm w-20">Action:</span>
          <Tooltip context="action">
            <TooltipTrigger asChild>
              <Button variant="primary" size="sm">
                Deploy
              </Button>
            </TooltipTrigger>
            <TooltipContent context="action">
              <TooltipTitle>Deploy to Production</TooltipTitle>
              <TooltipDescription>
                Builds and deploys your app. Takes 2-3 minutes.
              </TooltipDescription>
              <TooltipShortcut>⌘⇧D</TooltipShortcut>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Status Context - System feedback */}
        <div className="flex items-center gap-3">
          <span className="text-sm w-20">Status:</span>
          <Tooltip context="status">
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <span className="text-sm">Online</span>
              </div>
            </TooltipTrigger>
            <TooltipContent context="status">
              <TooltipTitle>Connection Status</TooltipTitle>
              <TooltipDescription>
                Connected to server. Last sync: 2 minutes ago.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
};

/**
 * Progressive Disclosure: Simple to detailed information reveal
 */
export const ProgressiveDisclosure: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Tooltip complexity="simple" context="help">
            <TooltipTrigger asChild>
              <Button variant="outline">Quick Info</Button>
            </TooltipTrigger>
            <TooltipContent context="help" complexity="simple">
              Brief, actionable guidance
            </TooltipContent>
          </Tooltip>

          <Tooltip complexity="detailed" context="help">
            <TooltipTrigger asChild>
              <Button variant="outline">Comprehensive Guide</Button>
            </TooltipTrigger>
            <TooltipContent context="help" complexity="detailed">
              <TooltipTitle>Comprehensive Feature Guide</TooltipTitle>
              <TooltipDescription>
                This feature provides advanced functionality for managing complex workflows. It
                includes automated processing, error handling, and detailed reporting capabilities
                that integrate with your existing systems.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
};

/**
 * Cognitive Load Optimization: Information density and processing ease
 */
export const CognitiveLoadOptimization: Story = {
  render: () => (
    <TooltipProvider>
      <div className="grid grid-cols-3 gap-4">
        {/* Low cognitive load - instant comprehension */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Low Load (1-2/10)</h4>
          <Tooltip context="action" complexity="simple">
            <TooltipTrigger asChild>
              <Button variant="primary" className="w-full">
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent context="action" complexity="simple">
              Save changes <TooltipShortcut>⌘S</TooltipShortcut>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Medium cognitive load - structured information */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Medium Load (3-5/10)</h4>
          <Tooltip context="help" complexity="simple">
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                Settings
              </Button>
            </TooltipTrigger>
            <TooltipContent context="help" complexity="simple">
              <TooltipTitle>Application Settings</TooltipTitle>
              <TooltipDescription>Configure preferences and behavior</TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* High cognitive load - complex but necessary */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">High Load (6-8/10)</h4>
          <Tooltip context="definition" complexity="detailed">
            <TooltipTrigger asChild>
              <Button variant="secondary" className="w-full">
                API Config
              </Button>
            </TooltipTrigger>
            <TooltipContent context="definition" complexity="detailed">
              <TooltipTitle>API Configuration</TooltipTitle>
              <TooltipDescription>
                Configure API endpoints, authentication methods, rate limiting, and error handling
                strategies for external service integration.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
};
