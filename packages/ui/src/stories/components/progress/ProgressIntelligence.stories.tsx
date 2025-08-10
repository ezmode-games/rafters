/**
 * Progress Intelligence - AI Training
 *
 * Communication intelligence patterns for progress indicators.
 * This trains AI agents on time estimation, progress patterns, and completion intelligence.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import { Progress, ProgressStep } from '../../../components/Progress';

const meta = {
  title: '03 Components/Feedback/Progress/Intelligence',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Communication intelligence patterns for progress indicators including time estimation, progress patterns, and completion intelligence.',
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
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Time estimation intelligence demonstrates smart time calculations.
 * AI should use these patterns to provide meaningful time estimates to users.
 */
export const TimeEstimationIntelligence: Story = {
  render: () => {
    const [progresses, setProgresses] = useState<
      Array<{
        id: number;
        type: 'upload' | 'download' | 'processing' | 'installation';
        value: number;
        startTime: number;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const startProgress = (type: 'upload' | 'download' | 'processing' | 'installation') => {
      const newProgress = {
        id: nextId,
        type,
        value: 0,
        startTime: Date.now(),
      };
      setProgresses((prev) => [...prev, newProgress]);
      setNextId((prev) => prev + 1);

      // Simulate progress with different patterns
      const interval = setInterval(() => {
        setProgresses((prev) =>
          prev.map((p) => {
            if (p.id !== newProgress.id) return p;

            let increment: number;
            switch (type) {
              case 'upload':
                // Linear progress for uploads
                increment = 2;
                break;
              case 'download':
                // Accelerating progress for downloads
                increment = p.value < 50 ? 1 : 3;
                break;
              case 'processing':
                // Decelerating progress for processing
                increment = p.value < 80 ? 3 : 0.5;
                break;
              case 'installation':
                // Step-based progress for installations
                increment = p.value < 25 ? 5 : p.value < 75 ? 2 : 1;
                break;
              default:
                increment = 2;
            }

            const newValue = Math.min(100, p.value + increment);
            if (newValue >= 100) {
              clearInterval(interval);
            }
            return { ...p, value: newValue };
          })
        );
      }, 200);
    };

    const removeProgress = (id: number) => {
      setProgresses((prev) => prev.filter((p) => p.id !== id));
    };

    const getProgressConfig = (type: string, value: number, startTime: number) => {
      const elapsed = Date.now() - startTime;
      const estimatedTotal = value > 0 ? (elapsed * 100) / value : 60000;
      const remaining = Math.max(0, estimatedTotal - elapsed);

      switch (type) {
        case 'upload':
          return {
            label: 'Uploading presentation.pptx',
            description: `${((value / 100) * 5.1).toFixed(1)} MB of 5.1 MB`,
            pattern: 'linear' as const,
            estimatedTime: 30000,
            timeRemaining: remaining,
            pausable: true,
            cancellable: true,
          };
        case 'download':
          return {
            label: 'Downloading update',
            description: `${((value / 100) * 150).toFixed(0)} MB of 150 MB`,
            pattern: 'accelerating' as const,
            estimatedTime: 45000,
            timeRemaining: remaining,
            cancellable: true,
          };
        case 'processing':
          return {
            label: 'Processing customer data',
            description: `Analyzing ${((value / 100) * 50000).toFixed(0)} of 50,000 records`,
            pattern: 'decelerating' as const,
            estimatedTime: 60000,
            timeRemaining: remaining,
          };
        case 'installation':
          return {
            label: 'Installing dependencies',
            description: 'Setting up development environment...',
            pattern: 'linear' as const,
            estimatedTime: 40000,
            timeRemaining: remaining,
            pausable: true,
          };
        default:
          return {
            label: 'Processing...',
            description: '',
            pattern: 'linear' as const,
          };
      }
    };

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Time Estimation Intelligence:</strong>
          </p>
          <p>• Smart algorithms calculate remaining time based on progress patterns</p>
          <p>• Different accuracy levels for different operation types</p>
          <p>• Graceful uncertainty handling when precision isn't possible</p>
          <p>• Real-time adjustment based on actual performance</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => startProgress('upload')}>
            File Upload (Linear)
          </Button>
          <Button variant="outline" onClick={() => startProgress('download')}>
            Download (Accelerating)
          </Button>
          <Button variant="outline" onClick={() => startProgress('processing')}>
            Data Processing (Decelerating)
          </Button>
          <Button variant="outline" onClick={() => startProgress('installation')}>
            Installation (Variable)
          </Button>
        </div>

        <div className="space-y-4">
          {progresses.map((progress) => {
            const config = getProgressConfig(progress.type, progress.value, progress.startTime);
            return (
              <div key={progress.id} className="space-y-2">
                <Progress
                  value={progress.value}
                  showTime
                  showPercentage
                  showDescription
                  complexity="detailed"
                  onPause={config.pausable ? fn() : undefined}
                  onCancel={config.cancellable ? fn() : undefined}
                  onComplete={() => removeProgress(progress.id)}
                  completionMessage={progress.value === 100 ? 'Complete!' : undefined}
                  nextAction={progress.value === 100 ? 'View Results' : undefined}
                  {...config}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

/**
 * Progress patterns demonstrate visual behaviors that match task characteristics.
 * AI should match progress patterns to the actual work being performed.
 */
export const ProgressPatterns: Story = {
  render: () => {
    const [activePattern, setActivePattern] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const patterns = [
      {
        name: 'Linear',
        pattern: 'linear',
        description: 'Steady, predictable progress for consistent tasks',
        example: 'File transfers, simple operations',
        increment: () => 2,
      },
      {
        name: 'Accelerating',
        pattern: 'accelerating',
        description: 'Starts slow, speeds up as system optimizes',
        example: 'Downloads with caching, initial processing',
        increment: (value: number) => (value < 50 ? 1 : 3),
      },
      {
        name: 'Decelerating',
        pattern: 'decelerating',
        description: 'Fast start, slows for complex finalization',
        example: 'Installations, complex calculations',
        increment: (value: number) => (value < 70 ? 4 : value < 95 ? 1 : 0.2),
      },
      {
        name: 'Pulsing',
        pattern: 'pulsing',
        description: 'Active indication for indeterminate progress',
        example: 'Waiting for server response, queue processing',
        increment: () => 0, // Indeterminate
      },
    ];

    const startPattern = (patternInfo: (typeof patterns)[0]) => {
      setActivePattern(patternInfo.pattern);
      setProgress(patternInfo.pattern === 'pulsing' ? 50 : 0); // Indeterminate for pulsing

      if (patternInfo.pattern === 'pulsing') return;

      const interval = setInterval(() => {
        setProgress((prev) => {
          const increment =
            typeof patternInfo.increment === 'function'
              ? patternInfo.increment(prev)
              : patternInfo.increment();
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
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Progress Pattern Intelligence:</strong>
          </p>
          <p>• Visual patterns should match actual work characteristics</p>
          <p>• Linear for predictable tasks, accelerating for optimizable work</p>
          <p>• Decelerating for complex finalization, pulsing for waiting</p>
          <p>• Pattern choice affects user perception and trust</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {patterns.map((pattern) => (
            <Button
              key={pattern.pattern}
              variant="outline"
              onClick={() => startPattern(pattern)}
              disabled={activePattern !== null}
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="font-medium">{pattern.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{pattern.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {activePattern && (
          <div className="space-y-2">
            <Progress
              value={activePattern === 'pulsing' ? undefined : progress}
              pattern={activePattern as 'linear' | 'accelerating' | 'decelerating' | 'pulsing'}
              showPercentage={activePattern !== 'pulsing'}
              showTime
              label={`${patterns.find((p) => p.pattern === activePattern)?.name} Progress`}
              description={patterns.find((p) => p.pattern === activePattern)?.example}
              complexity="detailed"
            />
            <div className="text-sm text-muted-foreground">
              <strong>Example:</strong> {patterns.find((p) => p.pattern === activePattern)?.example}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Completion intelligence demonstrates clear completion states and next actions.
 * AI should provide clear success states and guide users on next steps.
 */
export const CompletionIntelligence: Story = {
  render: () => {
    const [completions, setCompletions] = useState<
      Array<{
        id: number;
        type: 'success' | 'error' | 'warning';
        task: string;
        message: string;
        nextAction: string;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const showCompletion = (
      type: 'success' | 'error' | 'warning',
      task: string,
      message: string,
      nextAction: string
    ) => {
      const completion = { id: nextId, type, task, message, nextAction };
      setCompletions((prev) => [...prev, completion]);
      setNextId((prev) => prev + 1);

      // Auto-remove after 5 seconds for demonstration
      setTimeout(() => {
        setCompletions((prev) => prev.filter((c) => c.id !== completion.id));
      }, 5000);
    };

    const completionScenarios = [
      {
        name: 'Upload Success',
        type: 'success' as const,
        task: 'presentation.pptx uploaded',
        message: 'Upload complete!',
        nextAction: 'Open in editor',
      },
      {
        name: 'Installation Complete',
        type: 'success' as const,
        task: 'React components installed',
        message: 'Installation successful!',
        nextAction: 'Start development',
      },
      {
        name: 'Processing Error',
        type: 'error' as const,
        task: 'Data processing failed',
        message: 'Network connection lost',
        nextAction: 'Retry processing',
      },
      {
        name: 'Upload Warning',
        type: 'warning' as const,
        task: 'Large file uploaded',
        message: 'File size exceeds recommendation',
        nextAction: 'Optimize file',
      },
    ];

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Completion Intelligence:</strong>
          </p>
          <p>• Clear visual confirmation of completion state</p>
          <p>• Meaningful completion messages that build confidence</p>
          <p>• Actionable next steps to guide user flow</p>
          <p>• Error states with constructive recovery options</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {completionScenarios.map((scenario) => (
            <Button
              key={scenario.name}
              variant={
                scenario.type === 'error'
                  ? 'destructive'
                  : scenario.type === 'warning'
                    ? 'warning'
                    : 'success'
              }
              onClick={() =>
                showCompletion(scenario.type, scenario.task, scenario.message, scenario.nextAction)
              }
            >
              {scenario.name}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {completions.map((completion) => (
            <Progress
              key={completion.id}
              value={100}
              status={completion.type}
              showDescription
              complexity="detailed"
              label={completion.task}
              description="Task completed"
              completionMessage={completion.message}
              nextAction={completion.nextAction}
              onComplete={fn()}
            />
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Cognitive load optimization shows how to adapt information density.
 * AI should choose appropriate complexity levels based on user context.
 */
export const CognitiveLoadOptimization: Story = {
  render: () => {
    const [simpleProgress, setSimpleProgress] = useState(0);
    const [detailedProgress, setDetailedProgress] = useState(0);

    const startDemo = () => {
      setSimpleProgress(0);
      setDetailedProgress(0);

      const interval = setInterval(() => {
        setSimpleProgress((prev) => {
          const newValue = prev + 3;
          if (newValue >= 100) clearInterval(interval);
          return Math.min(100, newValue);
        });
        setDetailedProgress((prev) => Math.min(100, prev + 3));
      }, 200);
    };

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Cognitive Load Optimization:</strong>
          </p>
          <p>• Simple mode for end users - minimal cognitive overhead</p>
          <p>• Detailed mode for power users or critical operations</p>
          <p>• Information density should match user expertise and context</p>
          <p>• Progressive disclosure prevents information overload</p>
        </div>

        <Button onClick={startDemo} className="w-full">
          Start Comparison Demo
        </Button>

        <div className="grid gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Simple Mode (Cognitive Load: 2/10)</h4>
            <div className="text-xs text-muted-foreground">
              Perfect for end users, mobile contexts, or non-critical operations
            </div>
            <Progress
              value={simpleProgress}
              complexity="simple"
              showPercentage
              label="Uploading file"
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Detailed Mode (Cognitive Load: 6/10)</h4>
            <div className="text-xs text-muted-foreground">
              Ideal for power users, critical operations, or when control is needed
            </div>
            <Progress
              value={detailedProgress}
              complexity="detailed"
              showTime
              showPercentage
              showDescription
              pausable
              cancellable
              label="Uploading presentation.pptx"
              description="15.7 MB of 21.3 MB transferred"
              estimatedTime={30000}
              onPause={fn()}
              onCancel={fn()}
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground border-l-2 border-muted pl-4">
          <p>
            <strong>AI Decision Framework:</strong>
          </p>
          <p>• Use simple mode for consumer apps and mobile interfaces</p>
          <p>• Use detailed mode for professional tools and critical operations</p>
          <p>• Consider user expertise level and task importance</p>
          <p>• Allow user preference override when appropriate</p>
        </div>
      </div>
    );
  },
};

/**
 * Motor accessibility demonstrates pausable and cancellable progress.
 * AI should provide appropriate control options based on operation type.
 */
export const MotorAccessibility: Story = {
  render: () => {
    const [progresses, setProgresses] = useState<
      Array<{
        id: number;
        type: string;
        value: number;
        paused: boolean;
        cancelled: boolean;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const startOperation = (type: string, pausable: boolean, cancellable: boolean) => {
      const operation = {
        id: nextId,
        type,
        value: 0,
        paused: false,
        cancelled: false,
        pausable,
        cancellable,
      };
      setProgresses((prev) => [...prev, operation]);
      setNextId((prev) => prev + 1);

      const interval = setInterval(() => {
        setProgresses((prev) =>
          prev.map((p) => {
            if (p.id !== operation.id || p.paused || p.cancelled) return p;
            const newValue = Math.min(100, p.value + 2);
            if (newValue >= 100) clearInterval(interval);
            return { ...p, value: newValue };
          })
        );
      }, 200);

      // Store interval reference for pause/resume
      // Note: In real implementation, intervals would be stored in refs or state
    };

    const pauseProgress = (id: number) => {
      setProgresses((prev) => prev.map((p) => (p.id === id ? { ...p, paused: !p.paused } : p)));
    };

    const cancelProgress = (id: number) => {
      setProgresses((prev) => prev.filter((p) => p.id !== id));
    };

    const operations = [
      {
        name: 'File Upload',
        pausable: true,
        cancellable: true,
        description: 'Large file transfer that users might want to pause',
      },
      {
        name: 'Software Installation',
        pausable: true,
        cancellable: false,
        description: 'Critical operation that can pause but not cancel safely',
      },
      {
        name: 'Data Backup',
        pausable: false,
        cancellable: true,
        description: 'Important process that should complete but can be stopped',
      },
      {
        name: 'System Update',
        pausable: false,
        cancellable: false,
        description: 'Critical system operation with no user control',
      },
    ];

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Motor Accessibility:</strong>
          </p>
          <p>• Users need control over long-running processes</p>
          <p>• Pause capability for operations that can be safely interrupted</p>
          <p>• Cancel options for operations that can be safely aborted</p>
          <p>• Control appropriateness depends on operation criticality</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {operations.map((op) => (
            <Button
              key={op.name}
              variant="outline"
              onClick={() => startOperation(op.name, op.pausable, op.cancellable)}
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="font-medium text-sm">{op.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {op.pausable && 'Pausable'} {op.pausable && op.cancellable && '• '}
                  {op.cancellable && 'Cancellable'}
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {progresses.map((progress) => {
            const operation = operations.find((op) => op.name === progress.type)!;
            return (
              <div key={progress.id} className="space-y-2">
                <Progress
                  value={progress.value}
                  showPercentage
                  showTime
                  complexity="detailed"
                  label={progress.type}
                  description={operation.description}
                  pausable={operation.pausable}
                  cancellable={operation.cancellable}
                  onPause={() => pauseProgress(progress.id)}
                  onCancel={() => cancelProgress(progress.id)}
                  estimatedTime={25000}
                />
                <div className="text-xs text-muted-foreground">
                  Status:{' '}
                  {progress.paused ? 'Paused' : progress.cancelled ? 'Cancelled' : 'Running'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-sm text-muted-foreground border-l-2 border-muted pl-4">
          <p>
            <strong>Control Guidelines:</strong>
          </p>
          <p>• File operations: Usually pausable and cancellable</p>
          <p>• Installations: Often pausable, rarely cancellable safely</p>
          <p>• System updates: Usually no user control for safety</p>
          <p>• Data processing: Depends on state and criticality</p>
        </div>
      </div>
    );
  },
};
