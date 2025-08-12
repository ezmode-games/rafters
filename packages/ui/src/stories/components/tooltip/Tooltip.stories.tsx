// @componentStatus draft
// @version 0.1.0

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
 * Every interface contains moments of uncertainty. The tooltip bridges the gap between
 * user questions and interface clarity, providing contextual intelligence precisely when
 * and where it's needed without cognitive overhead.
 */
const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Contextual help overlay with timing intelligence. Provides just-enough information without interrupting user flow or creating cognitive overhead.',
      },
    },
  },
  argTypes: {
    context: {
      control: 'select',
      options: ['help', 'definition', 'action', 'status', 'shortcut'],
      description: 'Contextual intelligence type that determines styling and timing',
    },
    complexity: {
      control: 'select',
      options: ['simple', 'detailed'],
      description: 'Content complexity affects timing and layout constraints',
    },
    essential: {
      control: 'boolean',
      description: 'Essential information gets faster access (500ms delay)',
    },
    expandable: {
      control: 'boolean',
      description: 'Allow progressive disclosure for complex information',
    },
    delayDuration: {
      control: { type: 'range', min: 0, max: 2000, step: 100 },
      description: 'Manual override for hover delay (auto-calculated by default)',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary tooltip pattern with help context.
 * Standard 700ms delay balances helpfulness with non-intrusion.
 */
export const Primary: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip context="help">
        <TooltipTrigger asChild>
          <Button variant="outline">Hover for help</Button>
        </TooltipTrigger>
        <TooltipContent context="help">This provides helpful contextual information</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  args: {
    context: 'help',
    complexity: 'simple',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Standard help tooltip with 700ms delay. Use for optional contextual information that enhances understanding.',
      },
    },
  },
};

/**
 * Contextual intelligence examples showing different contexts in action.
 * Each context type has optimized timing and visual styling.
 */
export const ContextualIntelligence: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4 items-center flex-wrap">
        {/* Help Context */}
        <Tooltip context="help">
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              ?
            </Button>
          </TooltipTrigger>
          <TooltipContent context="help">
            <TooltipTitle>Help Context</TooltipTitle>
            <TooltipDescription>Explains functionality without overwhelming</TooltipDescription>
          </TooltipContent>
        </Tooltip>

        {/* Definition Context */}
        <Tooltip context="definition">
          <TooltipTrigger asChild>
            <span className="underline cursor-help text-primary">API Rate Limit</span>
          </TooltipTrigger>
          <TooltipContent context="definition">
            <TooltipTitle>API Rate Limit</TooltipTitle>
            <TooltipDescription>Maximum number of API calls allowed per hour</TooltipDescription>
          </TooltipContent>
        </Tooltip>

        {/* Action Context */}
        <Tooltip context="action">
          <TooltipTrigger asChild>
            <Button variant="primary">Save</Button>
          </TooltipTrigger>
          <TooltipContent context="action">
            Save document
            <TooltipShortcut>⌘S</TooltipShortcut>
          </TooltipContent>
        </Tooltip>

        {/* Status Context */}
        <Tooltip context="status">
          <TooltipTrigger asChild>
            <div className="w-3 h-3 bg-success rounded-full cursor-help" />
          </TooltipTrigger>
          <TooltipContent context="status">
            System operational - all services running
          </TooltipContent>
        </Tooltip>

        {/* Shortcut Context */}
        <Tooltip context="shortcut">
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="font-mono">
              ⌘K
            </Button>
          </TooltipTrigger>
          <TooltipContent context="shortcut">
            Quick command palette
            <TooltipShortcut>⌘K</TooltipShortcut>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Contextual intelligence in action. Each context optimizes timing, styling, and content structure for specific use cases.',
      },
    },
  },
};

/**
 * Complexity variations showing simple vs detailed content.
 * Detailed tooltips use longer delays to prevent accidental triggers.
 */
export const ComplexityVariations: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4 items-center">
        <Tooltip complexity="simple" context="help">
          <TooltipTrigger asChild>
            <Button variant="outline">Simple</Button>
          </TooltipTrigger>
          <TooltipContent context="help" complexity="simple">
            Brief, clear explanation
          </TooltipContent>
        </Tooltip>

        <Tooltip complexity="detailed" context="help">
          <TooltipTrigger asChild>
            <Button variant="outline">Detailed</Button>
          </TooltipTrigger>
          <TooltipContent context="help" complexity="detailed">
            <TooltipTitle>Advanced Feature</TooltipTitle>
            <TooltipDescription>
              This is a more comprehensive explanation that provides detailed information about
              advanced functionality. The longer delay prevents accidental triggers during normal
              navigation.
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>

        <Tooltip essential={true} context="help">
          <TooltipTrigger asChild>
            <Button variant="destructive">Essential</Button>
          </TooltipTrigger>
          <TooltipContent context="help" essential={true}>
            <TooltipTitle>⚠️ Important Warning</TooltipTitle>
            <TooltipDescription>
              Essential information appears quickly (500ms) when users need it most
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Content complexity affects timing and layout. Simple content gets quick access, detailed content prevents accidents.',
      },
    },
  },
};
