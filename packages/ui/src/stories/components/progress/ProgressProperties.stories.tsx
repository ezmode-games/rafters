/**
 * Progress Properties - AI Training
 *
 * Interactive properties and component states for progress indicators.
 * This trains AI agents on progress behavior, timing, and interaction patterns.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import { Progress, ProgressStep } from '../../../components/Progress';

const meta = {
  title: '03 Components/Feedback/Progress/Properties',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Interactive properties and behavioral patterns for progress indicators including timing, complexity levels, and user interactions.',
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
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive playground for testing all progress properties.
 * AI should understand how properties combine to create different experiences.
 */
export const InteractivePlayground: Story = {
  render: (args) => {
    const [progress, setProgress] = useState(45);
    const [isRunning, setIsRunning] = useState(false);

    const startProgress = () => {
      setIsRunning(true);
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newValue = prev + Math.floor(Math.random() * 5) + 1;
          if (newValue >= 100) {
            clearInterval(interval);
            setIsRunning(false);
          }
          return Math.min(100, newValue);
        });
      }, 300);
    };

    const resetProgress = () => {
      setProgress(0);
      setIsRunning(false);
    };

    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Interactive Properties Testing:</strong>
          </p>
          <p>• Adjust controls to see real-time property effects</p>
          <p>• Test different combinations for various use cases</p>
          <p>• Observe how properties affect user experience</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={startProgress} disabled={isRunning || progress >= 100}>
            Start
          </Button>
          <Button variant="outline" onClick={resetProgress}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>
            +10%
          </Button>
        </div>

        <Progress
          value={progress}
          label="Interactive Progress Demo"
          description="Testing different property combinations"
          estimatedTime={20000}
          onPause={args.pausable ? fn() : undefined}
          onCancel={args.cancellable ? fn() : undefined}
          onComplete={progress >= 100 ? fn() : undefined}
          completionMessage={progress >= 100 ? 'Demo completed!' : undefined}
          nextAction={progress >= 100 ? 'Run again' : undefined}
          {...args}
        />

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Current value: {progress}%</p>
          <p>Status: {isRunning ? 'Running' : progress >= 100 ? 'Complete' : 'Ready'}</p>
        </div>
      </div>
    );
  },
  args: {
    variant: 'bar',
    pattern: 'linear',
    complexity: 'detailed',
    status: 'default',
    showPercentage: true,
    showTime: true,
    showDescription: true,
    pausable: true,
    cancellable: true,
  },
};

/**
 * Complexity levels demonstrate information density control.
 * AI should choose appropriate complexity based on user context.
 */
export const ComplexityLevels: Story = {
  render: () => {
    const [progress, setProgress] = useState(67);

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Complexity Level Intelligence:</strong>
          </p>
          <p>• Simple: Minimal cognitive load for casual users</p>
          <p>• Detailed: Rich information for power users and critical operations</p>
          <p>• Choose complexity based on user expertise and task importance</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setProgress(Math.max(0, progress - 15))}>
            -15%
          </Button>
          <Button variant="outline" onClick={() => setProgress(Math.min(100, progress + 15))}>
            +15%
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Simple Complexity (Cognitive Load: 2/10)</h4>
            <div className="text-xs text-muted-foreground mb-2">
              Perfect for mobile apps, casual users, or non-critical operations
            </div>
            <Progress value={progress} complexity="simple" label="File upload" showPercentage />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Detailed Complexity (Cognitive Load: 6/10)</h4>
            <div className="text-xs text-muted-foreground mb-2">
              Ideal for professional tools, critical operations, or when control is needed
            </div>
            <Progress
              value={progress}
              complexity="detailed"
              showPercentage
              showTime
              showDescription
              pausable
              cancellable
              label="System deployment"
              description="Deploying application to production environment"
              estimatedTime={45000}
              onPause={fn()}
              onCancel={fn()}
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground border-l-2 border-muted pl-4">
          <p>
            <strong>Complexity Selection Guide:</strong>
          </p>
          <p>• Mobile interfaces → Simple complexity</p>
          <p>• Consumer applications → Simple complexity</p>
          <p>• Professional tools → Detailed complexity</p>
          <p>• Critical operations → Detailed complexity</p>
          <p>• Allow user preference override when possible</p>
        </div>
      </div>
    );
  },
};

/**
 * Time estimation behaviors show how AI should calculate and display time.
 * AI should provide meaningful time estimates based on context.
 */
export const TimeEstimation: Story = {
  render: () => {
    const [demos, setDemos] = useState<
      Array<{
        id: number;
        type: 'upload' | 'download' | 'processing' | 'installation';
        value: number;
        startTime: number;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const startDemo = (type: 'upload' | 'download' | 'processing' | 'installation') => {
      const demo = {
        id: nextId,
        type,
        value: 0,
        startTime: Date.now(),
      };
      setDemos((prev) => [...prev, demo]);
      setNextId((prev) => prev + 1);

      const interval = setInterval(() => {
        setDemos((prev) =>
          prev.map((d) => {
            if (d.id !== demo.id) return d;

            let increment: number;
            switch (type) {
              case 'upload':
                increment = 2; // Steady upload
                break;
              case 'download':
                increment = d.value < 30 ? 1 : 4; // Accelerating
                break;
              case 'processing':
                increment = d.value < 80 ? 3 : 0.5; // Decelerating
                break;
              case 'installation':
                increment = Math.floor(Math.random() * 3) + 1; // Variable
                break;
            }

            const newValue = Math.min(100, d.value + increment);
            if (newValue >= 100) clearInterval(interval);
            return { ...d, value: newValue };
          })
        );
      }, 200);
    };

    const getDemoConfig = (type: string, value: number, startTime: number) => {
      const elapsed = Date.now() - startTime;
      const estimatedTotal = value > 5 ? (elapsed * 100) / value : 60000;
      const remaining = Math.max(0, estimatedTotal - elapsed);

      const configs = {
        upload: {
          label: 'File upload (5.2 MB)',
          description: `${((value / 100) * 5.2).toFixed(1)} MB uploaded`,
          estimatedTime: 25000,
          pattern: 'linear' as const,
        },
        download: {
          label: 'Software download (150 MB)',
          description: `${((value / 100) * 150).toFixed(0)} MB downloaded`,
          estimatedTime: 40000,
          pattern: 'accelerating' as const,
        },
        processing: {
          label: 'Data analysis (10,000 records)',
          description: `${((value / 100) * 10000).toFixed(0)} records processed`,
          estimatedTime: 35000,
          pattern: 'decelerating' as const,
        },
        installation: {
          label: 'Package installation',
          description: 'Installing dependencies and configuring',
          estimatedTime: 30000,
          pattern: 'linear' as const,
        },
      };

      return { ...configs[type], timeRemaining: remaining };
    };

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Time Estimation Intelligence:</strong>
          </p>
          <p>• Calculate remaining time based on current progress rate</p>
          <p>• Adjust estimates based on operation type characteristics</p>
          <p>• Provide graceful uncertainty when precision isn't possible</p>
          <p>• Update estimates in real-time as conditions change</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => startDemo('upload')}>
            File Upload
          </Button>
          <Button variant="outline" onClick={() => startDemo('download')}>
            Download
          </Button>
          <Button variant="outline" onClick={() => startDemo('processing')}>
            Data Processing
          </Button>
          <Button variant="outline" onClick={() => startDemo('installation')}>
            Installation
          </Button>
        </div>

        <div className="space-y-4">
          {demos.map((demo) => {
            const config = getDemoConfig(demo.type, demo.value, demo.startTime);
            return (
              <Progress
                key={demo.id}
                value={demo.value}
                pattern={config.pattern}
                showTime
                showPercentage
                showDescription
                complexity="detailed"
                label={config.label}
                description={config.description}
                estimatedTime={config.estimatedTime}
                timeRemaining={config.timeRemaining}
              />
            );
          })}
        </div>
      </div>
    );
  },
};

/**
 * Control behaviors demonstrate when to provide user controls.
 * AI should determine appropriate control options based on operation type.
 */
export const ControlBehaviors: Story = {
  render: () => {
    const [operations, setOperations] = useState<
      Array<{
        id: number;
        name: string;
        value: number;
        paused: boolean;
        pausable: boolean;
        cancellable: boolean;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const startOperation = (name: string, pausable: boolean, cancellable: boolean) => {
      const operation = {
        id: nextId,
        name,
        value: 0,
        paused: false,
        pausable,
        cancellable,
      };
      setOperations((prev) => [...prev, operation]);
      setNextId((prev) => prev + 1);

      const interval = setInterval(() => {
        setOperations((prev) =>
          prev.map((op) => {
            if (op.id !== operation.id || op.paused) return op;
            const newValue = Math.min(100, op.value + 2);
            if (newValue >= 100) clearInterval(interval);
            return { ...op, value: newValue };
          })
        );
      }, 250);
    };

    const pauseOperation = (id: number) => {
      setOperations((prev) =>
        prev.map((op) => (op.id === id ? { ...op, paused: !op.paused } : op))
      );
    };

    const cancelOperation = (id: number) => {
      setOperations((prev) => prev.filter((op) => op.id !== id));
    };

    const formatControlLabels = (pausable: boolean, cancellable: boolean): string => {
      const labels = [];
      if (pausable) labels.push('Pausable');
      if (cancellable) labels.push('Cancellable');
      return labels.join(' • ');
    };

    const operationTypes = [
      {
        name: 'File Upload',
        pausable: true,
        cancellable: true,
        description: 'User-initiated, can be safely interrupted',
      },
      {
        name: 'System Update',
        pausable: false,
        cancellable: false,
        description: 'Critical operation, no user control',
      },
      {
        name: 'Data Backup',
        pausable: true,
        cancellable: false,
        description: 'Important but pausable, should complete',
      },
      {
        name: 'Report Generation',
        pausable: false,
        cancellable: true,
        description: 'Processing job, can be cancelled',
      },
    ];

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Control Intelligence:</strong>
          </p>
          <p>• Pausable: Operations that can be safely interrupted</p>
          <p>• Cancellable: Operations that can be safely aborted</p>
          <p>• Control availability depends on operation criticality</p>
          <p>• User autonomy balanced with system safety</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {operationTypes.map((type) => (
            <Button
              key={type.name}
              variant="outline"
              onClick={() => startOperation(type.name, type.pausable, type.cancellable)}
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="font-medium text-sm">{type.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatControlLabels(type.pausable, type.cancellable)}
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {operations.map((operation) => (
            <div key={operation.id} className="space-y-2">
              <Progress
                value={operation.value}
                showPercentage
                showTime
                complexity="detailed"
                label={operation.name}
                description={operationTypes.find((t) => t.name === operation.name)?.description}
                pausable={operation.pausable}
                cancellable={operation.cancellable}
                onPause={() => pauseOperation(operation.id)}
                onCancel={() => cancelOperation(operation.id)}
                estimatedTime={30000}
              />
              <div className="text-xs text-muted-foreground">
                Status:{' '}
                {operation.paused ? 'Paused' : operation.value >= 100 ? 'Complete' : 'Running'}
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground border-l-2 border-muted pl-4">
          <p>
            <strong>Control Guidelines:</strong>
          </p>
          <p>• File operations: Usually pausable and cancellable</p>
          <p>• System operations: Rarely controllable for safety</p>
          <p>• User-initiated: More control options</p>
          <p>• System-initiated: Fewer control options</p>
        </div>
      </div>
    );
  },
};
