// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Progress } from '../../../components/Progress';

/**
 * Time is the most precious resource in user interfaces. Progress indicators transform waiting
 * into understanding, anxiety into confidence, and uncertainty into trust.
 */
const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Communication intelligence for progress indicators with embedded time estimation and trust-building patterns.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['bar', 'thin', 'thick', 'circle', 'steps'],
      description: 'Visual variant of progress indicator',
    },
    pattern: {
      control: 'select',
      options: ['linear', 'accelerating', 'decelerating', 'pulsing'],
      description: 'Progress pattern affecting visual behavior',
    },
    complexity: {
      control: 'select',
      options: ['simple', 'detailed'],
      description: 'Information complexity level',
    },
    status: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Progress status affecting color',
    },
    showPercentage: {
      control: 'boolean',
      description: 'Whether to show percentage display',
    },
    showTime: {
      control: 'boolean',
      description: 'Whether to show time estimation',
    },
    showDescription: {
      control: 'boolean',
      description: 'Whether to show descriptive text',
    },
    pausable: {
      control: 'boolean',
      description: 'Whether progress can be paused',
    },
    cancellable: {
      control: 'boolean',
      description: 'Whether progress can be cancelled',
    },
  },
  args: {
    onPause: fn(),
    onCancel: fn(),
    onComplete: fn(),
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Common progress variants showing different communication patterns.
 * Demonstrates trust-building through accurate time estimation and clear status feedback.
 */
export const Common: Story = {
  render: (args) => (
    <div className="w-full max-w-md space-y-6">
      {/* Simple progress for casual operations */}
      <Progress {...args} value={25} complexity="simple" showPercentage label="Simple upload" />

      {/* Detailed progress for critical operations */}
      <Progress
        {...args}
        value={65}
        complexity="detailed"
        showPercentage
        showTime
        showDescription
        pausable
        cancellable
        label="System deployment"
        description="Deploying application to production environment"
        estimatedTime={30000}
      />

      {/* Step-based progress for multi-phase operations */}
      <Progress
        {...args}
        variant="steps"
        currentStep={2}
        totalSteps={4}
        showSteps
        complexity="detailed"
        label="Installation process"
        description="Setting up development environment..."
      />

      {/* Success state */}
      <Progress
        {...args}
        value={100}
        status="success"
        showPercentage
        label="Upload complete"
        completionMessage="File uploaded successfully!"
        nextAction="Open in editor"
      />
    </div>
  ),
};
