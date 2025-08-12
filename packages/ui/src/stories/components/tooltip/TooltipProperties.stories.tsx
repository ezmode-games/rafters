import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
 * Properties shape timing, behavior, and contextual intelligence.
 * Each property optimizes the tooltip for specific user needs and contexts.
 */
const meta = {
  title: 'Components/Tooltip/Properties',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Properties that control timing intelligence, contextual behavior, and progressive disclosure patterns.',
      },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Timing Intelligence
 *
 * Different delay durations optimize for different content types and user contexts.
 * Smart defaults based on context prevent accidents while ensuring accessibility.
 */
export const TimingProperties: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Auto-calculated Delays</h4>
          <p className="text-sm text-muted-foreground">
            Delays calculated based on context and complexity
          </p>
          <div className="flex gap-4 flex-wrap">
            <Tooltip context="shortcut">
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  Shortcuts (300ms)
                </Button>
              </TooltipTrigger>
              <TooltipContent context="shortcut">Power user optimization</TooltipContent>
            </Tooltip>

            <Tooltip essential={true}>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="sm">
                  Essential (500ms)
                </Button>
              </TooltipTrigger>
              <TooltipContent essential={true}>Critical information access</TooltipContent>
            </Tooltip>

            <Tooltip context="help">
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  Standard (700ms)
                </Button>
              </TooltipTrigger>
              <TooltipContent context="help">Balanced delay for most use cases</TooltipContent>
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
                  Prevents accidental triggers during navigation
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Manual Override</h4>
          <p className="text-sm text-muted-foreground">Custom delays when needed</p>
          <div className="flex gap-4">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  Immediate (0ms)
                </Button>
              </TooltipTrigger>
              <TooltipContent>Instant display when needed</TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={2000}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  Discovery (2000ms)
                </Button>
              </TooltipTrigger>
              <TooltipContent>Hidden features for intentional discovery</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  ),
  args: {
    delayDuration: 700,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Timing intelligence automatically optimizes delays based on context and complexity. Manual overrides available when needed.',
      },
    },
  },
};

/**
 * Content Complexity
 *
 * Simple vs detailed complexity affects layout constraints and timing.
 * Progressive disclosure helps manage cognitive load.
 */
export const ContentComplexity: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Simple Complexity</h4>
            <p className="text-xs text-muted-foreground">Quick, focused information</p>
            <Tooltip complexity="simple" context="help">
              <TooltipTrigger asChild>
                <Button variant="outline">Simple Info</Button>
              </TooltipTrigger>
              <TooltipContent complexity="simple" context="help">
                Brief, actionable guidance
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Detailed Complexity</h4>
            <p className="text-xs text-muted-foreground">Comprehensive information</p>
            <Tooltip complexity="detailed" context="help">
              <TooltipTrigger asChild>
                <Button variant="outline">Detailed Guide</Button>
              </TooltipTrigger>
              <TooltipContent complexity="detailed" context="help">
                <TooltipTitle>Comprehensive Feature Guide</TooltipTitle>
                <TooltipDescription>
                  This feature provides advanced functionality for managing complex workflows. It
                  includes automated processing, detailed reporting, and integration capabilities.
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  ),
  args: {
    complexity: 'simple',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Content complexity affects both timing and layout constraints. Simple content gets quick access, detailed content prevents accidents.',
      },
    },
  },
};

/**
 * Essential Information
 *
 * Essential tooltips get enhanced visibility and faster timing for critical information.
 * Used for warnings, errors, or time-sensitive information.
 */
export const EssentialInformation: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Standard Priority</h4>
            <Tooltip essential={false} context="help">
              <TooltipTrigger asChild>
                <Button variant="outline">Regular Info</Button>
              </TooltipTrigger>
              <TooltipContent essential={false} context="help">
                <TooltipTitle>Standard Information</TooltipTitle>
                <TooltipDescription>
                  Normal priority information with standard timing
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Essential Priority</h4>
            <Tooltip essential={true} context="help">
              <TooltipTrigger asChild>
                <Button variant="destructive">Critical Action</Button>
              </TooltipTrigger>
              <TooltipContent essential={true} context="help">
                <TooltipTitle>⚠️ Essential Warning</TooltipTitle>
                <TooltipDescription>
                  Critical information with enhanced visibility and faster access
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  ),
  args: {
    essential: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Essential tooltips get 500ms delay and enhanced visibility (ring) for critical information users must see quickly.',
      },
    },
  },
};

/**
 * Contextual Intelligence
 *
 * Different contexts optimize timing, styling, and behavior for specific use cases.
 * Each context type has semantic meaning and optimized defaults.
 */
export const ContextualTypes: Story = {
  render: () => (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Tooltip context="help">
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Help Context
                </Button>
              </TooltipTrigger>
              <TooltipContent context="help">Explains functionality, 700ms delay</TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground text-center">Feature guidance</p>
          </div>

          <div className="space-y-2">
            <Tooltip context="definition">
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Definition
                </Button>
              </TooltipTrigger>
              <TooltipContent context="definition">
                Clarifies terminology, 700ms delay
              </TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground text-center">Term explanation</p>
          </div>

          <div className="space-y-2">
            <Tooltip context="action">
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Action
                </Button>
              </TooltipTrigger>
              <TooltipContent context="action">Shows outcomes, 700ms delay</TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground text-center">Outcome preview</p>
          </div>

          <div className="space-y-2">
            <Tooltip context="status">
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Status
                </Button>
              </TooltipTrigger>
              <TooltipContent context="status">System state, 600ms delay</TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground text-center">System feedback</p>
          </div>

          <div className="space-y-2">
            <Tooltip context="shortcut">
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full">
                  Shortcut
                </Button>
              </TooltipTrigger>
              <TooltipContent context="shortcut">Power users, 300ms delay</TooltipContent>
            </Tooltip>
            <p className="text-xs text-muted-foreground text-center">Quick access</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  ),
  args: {
    context: 'help',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Five contextual intelligence types each optimize timing, styling, and behavior for specific user needs.',
      },
    },
  },
};

/**
 * Progressive Disclosure
 *
 * Expandable tooltips allow complex information to be revealed progressively.
 * Prevents cognitive overload while maintaining information access.
 */
export const ProgressiveDisclosure: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Basic Progressive Disclosure</h4>
            <Tooltip expandable={true} complexity="detailed">
              <TooltipTrigger asChild>
                <Button variant="outline">Expandable Info</Button>
              </TooltipTrigger>
              <TooltipContent expandable={true} complexity="detailed">
                <TooltipTitle>Advanced Configuration</TooltipTitle>
                <TooltipDescription>
                  Basic information shown immediately. Click to expand for detailed technical
                  specifications and implementation notes.
                </TooltipDescription>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Controlled Expansion</h4>
            <div className="flex gap-2 items-center">
              <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
                {expanded ? 'Collapse' : 'Expand'} Details
              </Button>
              <Tooltip complexity={expanded ? 'detailed' : 'simple'}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Hover for info
                  </Button>
                </TooltipTrigger>
                <TooltipContent complexity={expanded ? 'detailed' : 'simple'}>
                  {expanded ? (
                    <>
                      <TooltipTitle>Detailed Technical Information</TooltipTitle>
                      <TooltipDescription>
                        Comprehensive technical details including API specifications, error
                        handling, rate limiting, and integration examples.
                      </TooltipDescription>
                    </>
                  ) : (
                    'Brief summary - expand for details'
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  },
  args: {
    expandable: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Progressive disclosure allows complex information to be revealed gradually, preventing cognitive overload.',
      },
    },
  },
};
