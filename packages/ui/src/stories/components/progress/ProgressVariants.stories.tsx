/**
 * Progress Variants - AI Training
 *
 * Visual styling variants and semantic meaning for progress indicators.
 * This trains AI agents on progress variants and appropriate visual contexts.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import { Progress, ProgressStep } from '../../../components/Progress';

const meta = {
  title: '03 Components/Feedback/Progress/Variants',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Visual styling variants with semantic meaning for contextually appropriate progress indicators.',
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
    status: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'Progress status affecting color',
    },
    complexity: {
      control: 'select',
      options: ['simple', 'detailed'],
      description: 'Information complexity level',
    },
  },
  args: {
    variant: 'bar',
    pattern: 'linear',
    status: 'default',
    complexity: 'simple',
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard bar variant for most progress scenarios.
 * Uses semantic background and foreground tokens.
 */
export const Bar: Story = {
  render: (args) => {
    const [progress, setProgress] = useState(65);

    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>
            -10%
          </Button>
          <Button variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>
            +10%
          </Button>
        </div>

        <Progress
          value={progress}
          showPercentage
          label="Standard Progress Bar"
          description="Most common variant for file operations and loading"
          {...args}
        />
      </div>
    );
  },
  args: {
    variant: 'bar',
  },
};

/**
 * Thin variant for subtle progress indication.
 * Minimizes visual weight while maintaining functionality.
 */
export const Thin: Story = {
  render: (args) => {
    const [progress, setProgress] = useState(45);

    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setProgress(Math.max(0, progress - 15))}>
            -15%
          </Button>
          <Button variant="outline" onClick={() => setProgress(Math.min(100, progress + 15))}>
            +15%
          </Button>
        </div>

        <Progress
          value={progress}
          showPercentage
          label="Thin Progress Indicator"
          description="Subtle variant for background operations or secondary progress"
          {...args}
        />
      </div>
    );
  },
  args: {
    variant: 'thin',
  },
};

/**
 * Thick variant for prominent progress display.
 * Draws attention to critical or primary operations.
 */
export const Thick: Story = {
  render: (args) => {
    const [progress, setProgress] = useState(78);

    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setProgress(Math.max(0, progress - 12))}>
            -12%
          </Button>
          <Button variant="outline" onClick={() => setProgress(Math.min(100, progress + 12))}>
            +12%
          </Button>
        </div>

        <Progress
          value={progress}
          showPercentage
          showTime
          label="Prominent Progress Bar"
          description="High visibility variant for critical operations"
          complexity="detailed"
          estimatedTime={30000}
          {...args}
        />
      </div>
    );
  },
  args: {
    variant: 'thick',
  },
};

/**
 * Circle variant for compact progress display.
 * Ideal for dashboards or space-constrained layouts.
 */
export const Circle: Story = {
  render: (args) => {
    const [progress, setProgress] = useState(83);

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setProgress(Math.max(0, progress - 20))}>
            -20%
          </Button>
          <Button variant="outline" onClick={() => setProgress(Math.min(100, progress + 20))}>
            +20%
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Progress
            value={progress}
            showPercentage
            label="Circular Progress"
            description="Compact variant for dashboards and constrained spaces"
            {...args}
          />
        </div>
      </div>
    );
  },
  args: {
    variant: 'circle',
  },
};

/**
 * Steps variant for multi-phase operations.
 * Shows clear progression through defined stages.
 */
export const Steps: Story = {
  render: (args) => {
    const [currentStep, setCurrentStep] = useState(2);
    const totalSteps = 5;

    const steps = [
      'Download dependencies',
      'Extract files',
      'Install packages',
      'Configure settings',
      'Finalize setup',
    ];

    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep <= 1}
          >
            Previous Step
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            disabled={currentStep >= totalSteps}
          >
            Next Step
          </Button>
        </div>

        <div className="space-y-3">
          <Progress
            variant="steps"
            showSteps
            currentStep={currentStep}
            totalSteps={totalSteps}
            label="Installation Progress"
            description={`Step ${currentStep} of ${totalSteps}: ${steps[currentStep - 1]}`}
            complexity="detailed"
            {...args}
          />

          <div className="space-y-2">
            {steps.map((step, index) => (
              <ProgressStep
                key={`step-${index}-${step}`}
                completed={index < currentStep - 1}
                current={index === currentStep - 1}
              >
                {step}
              </ProgressStep>
            ))}
          </div>
        </div>
      </div>
    );
  },
  args: {
    variant: 'steps',
  },
};

/**
 * Status variants demonstrate semantic color meanings.
 * Shows how status affects visual presentation.
 */
export const StatusVariants: Story = {
  render: () => {
    const [activeStatus, setActiveStatus] = useState<'default' | 'success' | 'warning' | 'error'>(
      'default'
    );

    const statuses = [
      {
        name: 'Default',
        status: 'default',
        value: 65,
        label: 'Processing data',
        description: 'Standard operation in progress',
      },
      {
        name: 'Success',
        status: 'success',
        value: 100,
        label: 'Upload complete',
        description: 'Operation completed successfully',
      },
      {
        name: 'Warning',
        status: 'warning',
        value: 45,
        label: 'Large file detected',
        description: 'File size may affect performance',
      },
      {
        name: 'Error',
        status: 'error',
        value: 73,
        label: 'Connection lost',
        description: 'Operation interrupted by network error',
      },
    ];

    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Status Intelligence:</strong>
          </p>
          <p>• Default: Standard operations with neutral visual weight</p>
          <p>• Success: Completed operations with positive reinforcement</p>
          <p>• Warning: Caution states that need user awareness</p>
          <p>• Error: Failed states requiring user attention</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {statuses.map((status) => (
            <Button
              key={status.status}
              variant={
                status.status === 'error'
                  ? 'destructive'
                  : status.status === 'warning'
                    ? 'warning'
                    : status.status === 'success'
                      ? 'success'
                      : 'outline'
              }
              onClick={() => setActiveStatus(status.status)}
              className="text-left h-auto p-3"
            >
              <div>
                <div className="font-medium text-sm">{status.name}</div>
                <div className="text-xs opacity-75">{status.value}%</div>
              </div>
            </Button>
          ))}
        </div>

        {activeStatus && (
          <div className="space-y-2">
            {statuses
              .filter((s) => s.status === activeStatus)
              .map((status) => (
                <Progress
                  key={status.status}
                  value={status.value}
                  status={status.status}
                  showPercentage
                  showDescription
                  complexity="detailed"
                  label={status.label}
                  description={status.description}
                  completionMessage={
                    status.status === 'success' ? 'Operation successful!' : undefined
                  }
                  nextAction={
                    status.status === 'success'
                      ? 'View results'
                      : status.status === 'error'
                        ? 'Retry operation'
                        : undefined
                  }
                  onComplete={status.status === 'success' ? fn() : undefined}
                />
              ))}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Pattern variants demonstrate different visual behaviors.
 * Shows how patterns affect user perception of progress.
 */
export const PatternVariants: Story = {
  render: () => {
    const [activePattern, setActivePattern] = useState<
      'linear' | 'accelerating' | 'decelerating' | 'pulsing' | null
    >(null);
    const [progress, setProgress] = useState(0);

    const patterns = [
      {
        name: 'Linear',
        pattern: 'linear',
        description: 'Steady, consistent progress',
        example: 'File transfers, simple operations',
      },
      {
        name: 'Accelerating',
        pattern: 'accelerating',
        description: 'Starts slow, speeds up',
        example: 'Downloads with caching',
      },
      {
        name: 'Decelerating',
        pattern: 'decelerating',
        description: 'Fast start, slows down',
        example: 'Complex calculations',
      },
      {
        name: 'Pulsing',
        pattern: 'pulsing',
        description: 'Indeterminate but active',
        example: 'Server responses',
      },
    ];

    const startPattern = (pattern: 'linear' | 'accelerating' | 'decelerating' | 'pulsing') => {
      setActivePattern(pattern);
      setProgress(pattern === 'pulsing' ? 50 : 0); // Indeterminate for pulsing

      if (pattern === 'pulsing') return;

      const interval = setInterval(() => {
        setProgress((prev) => {
          let increment: number;
          switch (pattern) {
            case 'linear':
              increment = 2;
              break;
            case 'accelerating':
              increment = prev < 50 ? 1 : 3;
              break;
            case 'decelerating':
              increment = prev < 70 ? 4 : prev < 95 ? 1 : 0.2;
              break;
            default:
              increment = 2;
          }

          const newValue = prev + increment;
          if (newValue >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setActivePattern(null);
              setProgress(0);
            }, 2000);
          }
          return Math.min(100, newValue);
        });
      }, 150);
    };

    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Pattern Intelligence:</strong>
          </p>
          <p>• Choose patterns that match actual work characteristics</p>
          <p>• Linear for predictable tasks with consistent speed</p>
          <p>• Accelerating for operations that optimize over time</p>
          <p>• Decelerating for complex finalization phases</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {patterns.map((pattern) => (
            <Button
              key={pattern.pattern}
              variant="outline"
              onClick={() =>
                startPattern(
                  pattern.pattern as 'linear' | 'accelerating' | 'decelerating' | 'pulsing'
                )
              }
              disabled={activePattern !== null}
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="font-medium text-sm">{pattern.name}</div>
                <div className="text-xs text-muted-foreground">{pattern.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {activePattern && (
          <div className="space-y-2">
            <Progress
              value={activePattern === 'pulsing' ? undefined : progress}
              pattern={activePattern}
              showPercentage={activePattern !== 'pulsing'}
              showTime
              complexity="detailed"
              label={`${patterns.find((p) => p.pattern === activePattern)?.name} Progress`}
              description={patterns.find((p) => p.pattern === activePattern)?.example}
              estimatedTime={20000}
            />
            <div className="text-xs text-muted-foreground">
              <strong>Use case:</strong>{' '}
              {patterns.find((p) => p.pattern === activePattern)?.example}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * All variants showcase for comparison and semantic meaning.
 * Demonstrates the visual hierarchy and appropriate contexts.
 */
export const AllVariants: Story = {
  render: () => {
    const [progresses, setProgresses] = useState<
      Array<{
        id: number;
        variant: 'bar' | 'thin' | 'thick' | 'circle' | 'steps';
        value: number;
        label: string;
        description: string;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const variants = [
      {
        variant: 'bar',
        value: 65,
        label: 'File Upload',
        description: 'Standard progress for most operations',
      },
      {
        variant: 'thin',
        value: 23,
        label: 'Background Sync',
        description: 'Subtle progress for secondary operations',
      },
      {
        variant: 'thick',
        value: 89,
        label: 'System Update',
        description: 'Prominent progress for critical operations',
      },
      {
        variant: 'circle',
        value: 76,
        label: 'Dashboard',
        description: 'Compact progress for space-constrained layouts',
      },
      {
        variant: 'steps',
        value: 40,
        label: 'Installation',
        description: 'Multi-phase progress with defined stages',
      },
    ];

    const showVariant = (variant: (typeof variants)[0]) => {
      const progress = { ...variant, id: nextId };
      setProgresses((prev) => [...prev, progress]);
      setNextId((prev) => prev + 1);

      setTimeout(() => {
        setProgresses((prev) => prev.filter((p) => p.id !== progress.id));
      }, 8000);
    };

    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Variant Selection Guide:</strong>
          </p>
          <p>• Bar: Standard operations, most common use case</p>
          <p>• Thin: Background operations, minimal visual impact</p>
          <p>• Thick: Critical operations, high visibility needed</p>
          <p>• Circle: Compact displays, dashboard contexts</p>
          <p>• Steps: Multi-phase operations, clear stages</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <Button
              key={variant.variant}
              variant="outline"
              onClick={() => showVariant(variant)}
              className="text-xs"
            >
              {variant.variant}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {progresses.map((progress) => (
            <div key={progress.id} className="space-y-2">
              <Progress
                variant={progress.variant}
                value={progress.value}
                showPercentage
                complexity="detailed"
                label={progress.label}
                description={progress.description}
                currentStep={progress.variant === 'steps' ? 2 : undefined}
                totalSteps={progress.variant === 'steps' ? 5 : undefined}
                showSteps={progress.variant === 'steps'}
              />
              {progress.variant === 'steps' && (
                <div className="space-y-1 text-sm">
                  <ProgressStep completed>Download dependencies</ProgressStep>
                  <ProgressStep current>Extract files</ProgressStep>
                  <ProgressStep>Install packages</ProgressStep>
                  <ProgressStep>Configure settings</ProgressStep>
                  <ProgressStep>Finalize setup</ProgressStep>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};
