/**
 * Progress Semantic - AI Training
 *
 * Contextual usage patterns and semantic meaning for progress indicators.
 * This trains AI agents on when and how to use progress in different contexts.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import { Progress, ProgressStep } from '../../../components/Progress';

const meta = {
  title: '03 Components/Feedback/Progress Semantic',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Contextual usage patterns and semantic meaning for progress indicators in real-world scenarios.',
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * File operations demonstrate progress for common user tasks.
 * AI should use these patterns for file-related progress indicators.
 */
export const FileOperations: Story = {
  render: () => {
    const [operations, setOperations] = useState<
      Array<{
        id: number;
        type: 'upload' | 'download' | 'backup' | 'sync';
        name: string;
        size: string;
        value: number;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const startOperation = (
      type: 'upload' | 'download' | 'backup' | 'sync',
      name: string,
      size: string
    ) => {
      const operation = { id: nextId, type, name, size, value: 0 };
      setOperations((prev) => [...prev, operation]);
      setNextId((prev) => prev + 1);

      const interval = setInterval(() => {
        setOperations((prev) =>
          prev.map((op) => {
            if (op.id !== operation.id) return op;

            let increment: number;
            switch (type) {
              case 'upload':
                increment = Math.floor(Math.random() * 3) + 1; // Variable network speed
                break;
              case 'download':
                increment = op.value < 30 ? 1 : 3; // Accelerating with cache
                break;
              case 'backup':
                increment = 2; // Steady backup process
                break;
              case 'sync':
                increment = op.value < 70 ? 4 : 1; // Fast sync, slow verification
                break;
            }

            const newValue = Math.min(100, op.value + increment);
            if (newValue >= 100) clearInterval(interval);
            return { ...op, value: newValue };
          })
        );
      }, 300);
    };

    const removeOperation = (id: number) => {
      setOperations((prev) => prev.filter((op) => op.id !== id));
    };

    const fileOperations = [
      { type: 'upload', name: 'presentation.pptx', size: '5.2 MB', color: 'default' },
      { type: 'download', name: 'software-installer.dmg', size: '150 MB', color: 'default' },
      { type: 'backup', name: 'project-files', size: '2.3 GB', color: 'default' },
      { type: 'sync', name: 'documents-folder', size: '45 files', color: 'default' },
    ];

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>File Operation Patterns:</strong>
          </p>
          <p>• Upload: User-initiated, pausable/cancellable, variable speed</p>
          <p>• Download: User-requested, accelerating with caching</p>
          <p>• Backup: System-initiated, steady progress, critical completion</p>
          <p>• Sync: Bidirectional, fast then slow for verification</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {fileOperations.map((op) => (
            <Button
              key={op.type}
              variant="outline"
              onClick={() =>
                startOperation(
                  op.type as 'upload' | 'download' | 'backup' | 'sync',
                  op.name,
                  op.size
                )
              }
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="font-medium text-sm capitalize">{op.type}</div>
                <div className="text-xs text-muted-foreground">{op.name}</div>
              </div>
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {operations.map((operation) => {
            const config = fileOperations.find((op) => op.type === operation.type)!;
            return (
              <Progress
                key={operation.id}
                value={operation.value}
                pattern={
                  operation.type === 'download'
                    ? 'accelerating'
                    : operation.type === 'sync'
                      ? 'decelerating'
                      : 'linear'
                }
                showPercentage
                showTime
                showDescription
                complexity="detailed"
                pausable={operation.type === 'upload' || operation.type === 'backup'}
                cancellable={operation.type === 'upload' || operation.type === 'download'}
                label={`${operation.type.charAt(0).toUpperCase() + operation.type.slice(1)}: ${operation.name}`}
                description={`${operation.size} - ${operation.type} in progress`}
                estimatedTime={
                  operation.type === 'upload'
                    ? 25000
                    : operation.type === 'download'
                      ? 45000
                      : operation.type === 'backup'
                        ? 120000
                        : 15000
                }
                onPause={fn()}
                onCancel={() => removeOperation(operation.id)}
                completionMessage={
                  operation.value === 100 ? `${operation.type} complete!` : undefined
                }
                nextAction={operation.value === 100 ? 'View file' : undefined}
                onComplete={() => removeOperation(operation.id)}
              />
            );
          })}
        </div>
      </div>
    );
  },
};

/**
 * System operations show progress for critical system tasks.
 * AI should use appropriate patterns for system-level operations.
 */
export const SystemOperations: Story = {
  render: () => {
    const [operations, setOperations] = useState<
      Array<{
        id: number;
        type: 'update' | 'installation' | 'scan' | 'optimization';
        value: number;
        phase: string;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const startOperation = (type: 'update' | 'installation' | 'scan' | 'optimization') => {
      const operation = { id: nextId, type, value: 0, phase: 'Starting...' };
      setOperations((prev) => [...prev, operation]);
      setNextId((prev) => prev + 1);

      const phases = {
        update: [
          'Checking for updates',
          'Downloading update',
          'Installing update',
          'Restarting services',
        ],
        installation: [
          'Downloading packages',
          'Extracting files',
          'Installing components',
          'Configuring settings',
        ],
        scan: ['Scanning files', 'Analyzing threats', 'Checking integrity', 'Generating report'],
        optimization: ['Analyzing system', 'Cleaning cache', 'Optimizing files', 'Finalizing'],
      };

      let currentPhase = 0;
      const interval = setInterval(() => {
        setOperations((prev) =>
          prev.map((op) => {
            if (op.id !== operation.id) return op;

            const phaseProgress = Math.floor(op.value / 25);
            if (phaseProgress !== currentPhase && phaseProgress < phases[type].length) {
              currentPhase = phaseProgress;
            }

            const newValue = Math.min(100, op.value + (Math.floor(Math.random() * 2) + 1));
            if (newValue >= 100) clearInterval(interval);

            return {
              ...op,
              value: newValue,
              phase: phases[type][Math.min(currentPhase, phases[type].length - 1)],
            };
          })
        );
      }, 200);
    };

    const removeOperation = (id: number) => {
      setOperations((prev) => prev.filter((op) => op.id !== id));
    };

    const systemOperations = [
      { type: 'update', name: 'System Update', description: 'Installing security patches' },
      {
        type: 'installation',
        name: 'Software Installation',
        description: 'Installing development tools',
      },
      { type: 'scan', name: 'Security Scan', description: 'Full system security analysis' },
      {
        type: 'optimization',
        name: 'System Optimization',
        description: 'Improving system performance',
      },
    ];

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>System Operation Patterns:</strong>
          </p>
          <p>• Update: Critical, no cancellation, phase-based progress</p>
          <p>• Installation: Step-based, sometimes pausable</p>
          <p>• Scan: Long-running, background operation</p>
          <p>• Optimization: System maintenance, user-initiated</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {systemOperations.map((op) => (
            <Button
              key={op.type}
              variant="outline"
              onClick={() =>
                startOperation(op.type as 'update' | 'installation' | 'scan' | 'optimization')
              }
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="font-medium text-sm">{op.name}</div>
                <div className="text-xs text-muted-foreground">{op.description}</div>
              </div>
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {operations.map((operation) => {
            const config = systemOperations.find((op) => op.type === operation.type)!;
            return (
              <Progress
                key={operation.id}
                value={operation.value}
                pattern={operation.type === 'scan' ? 'linear' : 'decelerating'}
                showPercentage
                showTime
                showDescription
                complexity="detailed"
                pausable={operation.type === 'optimization'}
                cancellable={operation.type === 'scan' || operation.type === 'optimization'}
                label={config.name}
                description={operation.phase}
                estimatedTime={
                  operation.type === 'update'
                    ? 180000
                    : operation.type === 'installation'
                      ? 120000
                      : operation.type === 'scan'
                        ? 300000
                        : 90000
                }
                onPause={fn()}
                onCancel={() => removeOperation(operation.id)}
                completionMessage={operation.value === 100 ? `${config.name} complete!` : undefined}
                nextAction={operation.value === 100 ? 'View results' : undefined}
                onComplete={() => removeOperation(operation.id)}
              />
            );
          })}
        </div>
      </div>
    );
  },
};

/**
 * Data processing shows progress for analytical and computational tasks.
 * AI should use these patterns for data-intensive operations.
 */
export const DataProcessing: Story = {
  render: () => {
    const [processes, setProcesses] = useState<
      Array<{
        id: number;
        type: 'analysis' | 'import' | 'export' | 'transformation';
        name: string;
        value: number;
        recordsProcessed: number;
        totalRecords: number;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const startProcess = (
      type: 'analysis' | 'import' | 'export' | 'transformation',
      name: string,
      totalRecords: number
    ) => {
      const process = { id: nextId, type, name, value: 0, recordsProcessed: 0, totalRecords };
      setProcesses((prev) => [...prev, process]);
      setNextId((prev) => prev + 1);

      const interval = setInterval(() => {
        setProcesses((prev) =>
          prev.map((proc) => {
            if (proc.id !== process.id) return proc;

            let increment: number;
            switch (type) {
              case 'analysis':
                increment = proc.value < 60 ? 3 : 1; // Slows down for complex analysis
                break;
              case 'import':
                increment = 2; // Steady import rate
                break;
              case 'export':
                increment = proc.value < 80 ? 4 : 2; // Fast then verification
                break;
              case 'transformation':
                increment = proc.value < 40 ? 1 : proc.value < 90 ? 3 : 0.5; // Complex pattern
                break;
            }

            const newValue = Math.min(100, proc.value + increment);
            const newRecordsProcessed = Math.floor((newValue / 100) * totalRecords);

            if (newValue >= 100) clearInterval(interval);
            return { ...proc, value: newValue, recordsProcessed: newRecordsProcessed };
          })
        );
      }, 250);
    };

    const removeProcess = (id: number) => {
      setProcesses((prev) => prev.filter((proc) => proc.id !== id));
    };

    const dataProcesses = [
      { type: 'analysis', name: 'Customer Behavior Analysis', totalRecords: 50000 },
      { type: 'import', name: 'Database Import', totalRecords: 25000 },
      { type: 'export', name: 'Report Generation', totalRecords: 10000 },
      { type: 'transformation', name: 'Data Cleaning', totalRecords: 75000 },
    ];

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Data Processing Patterns:</strong>
          </p>
          <p>• Analysis: Decelerating pattern, complex calculations at end</p>
          <p>• Import: Linear pattern, steady data ingestion</p>
          <p>• Export: Fast then slow for verification and formatting</p>
          <p>• Transformation: Variable pattern based on data complexity</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {dataProcesses.map((proc) => (
            <Button
              key={proc.type}
              variant="outline"
              onClick={() =>
                startProcess(
                  proc.type as 'analysis' | 'import' | 'export' | 'transformation',
                  proc.name,
                  proc.totalRecords
                )
              }
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="font-medium text-sm">{proc.name}</div>
                <div className="text-xs text-muted-foreground">
                  {proc.totalRecords.toLocaleString()} records
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {processes.map((process) => (
            <Progress
              key={process.id}
              value={process.value}
              pattern={
                process.type === 'analysis'
                  ? 'decelerating'
                  : process.type === 'import'
                    ? 'linear'
                    : process.type === 'export'
                      ? 'accelerating'
                      : 'linear'
              }
              showPercentage
              showTime
              showDescription
              complexity="detailed"
              cancellable
              label={process.name}
              description={`Processing ${process.recordsProcessed.toLocaleString()} of ${process.totalRecords.toLocaleString()} records`}
              estimatedTime={
                process.type === 'analysis'
                  ? 90000
                  : process.type === 'import'
                    ? 60000
                    : process.type === 'export'
                      ? 45000
                      : 120000
              }
              onCancel={() => removeProcess(process.id)}
              completionMessage={process.value === 100 ? 'Processing complete!' : undefined}
              nextAction={process.value === 100 ? 'View results' : undefined}
              onComplete={() => removeProcess(process.id)}
            />
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Multi-step workflows demonstrate step-based progress for complex operations.
 * AI should use step patterns for operations with distinct phases.
 */
export const MultiStepWorkflows: Story = {
  render: () => {
    const [workflows, setWorkflows] = useState<
      Array<{
        id: number;
        type: 'deployment' | 'onboarding' | 'migration' | 'setup';
        currentStep: number;
        totalSteps: number;
        steps: string[];
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const startWorkflow = (type: 'deployment' | 'onboarding' | 'migration' | 'setup') => {
      const workflowConfigs = {
        deployment: {
          steps: [
            'Building application',
            'Running tests',
            'Deploying to staging',
            'Running integration tests',
            'Deploying to production',
            'Verifying deployment',
          ],
        },
        onboarding: {
          steps: [
            'Creating user account',
            'Setting up workspace',
            'Installing tools',
            'Configuring preferences',
            'Running tutorial',
          ],
        },
        migration: {
          steps: [
            'Backing up data',
            'Preparing migration',
            'Migrating database',
            'Updating references',
            'Verifying integrity',
            'Cleaning up',
          ],
        },
        setup: {
          steps: [
            'Detecting system',
            'Installing dependencies',
            'Configuring environment',
            'Testing installation',
          ],
        },
      };

      const config = workflowConfigs[type];
      const workflow = {
        id: nextId,
        type,
        currentStep: 1,
        totalSteps: config.steps.length,
        steps: config.steps,
      };
      setWorkflows((prev) => [...prev, workflow]);
      setNextId((prev) => prev + 1);

      const interval = setInterval(() => {
        setWorkflows((prev) =>
          prev.map((wf) => {
            if (wf.id !== workflow.id) return wf;

            const nextStep = wf.currentStep + 1;
            if (nextStep > wf.totalSteps) {
              clearInterval(interval);
              // Remove workflow after completion
              setTimeout(() => {
                setWorkflows((prev) => prev.filter((w) => w.id !== workflow.id));
              }, 3000);
            }

            return { ...wf, currentStep: Math.min(nextStep, wf.totalSteps) };
          })
        );
      }, 2000); // 2 seconds per step
    };

    const workflowTypes = [
      { type: 'deployment', name: 'App Deployment', description: '6-step deployment process' },
      { type: 'onboarding', name: 'User Onboarding', description: '5-step user setup' },
      { type: 'migration', name: 'Data Migration', description: '6-step data migration' },
      { type: 'setup', name: 'System Setup', description: '4-step system configuration' },
    ];

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Multi-Step Workflow Patterns:</strong>
          </p>
          <p>• Clear progression through defined phases</p>
          <p>• Step-by-step visibility for complex operations</p>
          <p>• Visual indication of completed, current, and future steps</p>
          <p>• Appropriate for operations with distinct phases</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {workflowTypes.map((wf) => (
            <Button
              key={wf.type}
              variant="outline"
              onClick={() =>
                startWorkflow(wf.type as 'deployment' | 'onboarding' | 'migration' | 'setup')
              }
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="font-medium text-sm">{wf.name}</div>
                <div className="text-xs text-muted-foreground">{wf.description}</div>
              </div>
            </Button>
          ))}
        </div>

        <div className="space-y-6">
          {workflows.map((workflow) => {
            const isComplete = workflow.currentStep >= workflow.totalSteps;
            return (
              <div key={workflow.id} className="space-y-4">
                <Progress
                  variant="steps"
                  showSteps
                  currentStep={workflow.currentStep}
                  totalSteps={workflow.totalSteps}
                  label={workflowTypes.find((wt) => wt.type === workflow.type)?.name}
                  description={
                    isComplete
                      ? 'All steps completed'
                      : `Step ${workflow.currentStep} of ${workflow.totalSteps}: ${workflow.steps[workflow.currentStep - 1]}`
                  }
                  complexity="detailed"
                  completionMessage={isComplete ? 'Workflow complete!' : undefined}
                  nextAction={isComplete ? 'View summary' : undefined}
                  onComplete={fn()}
                />

                <div className="space-y-2">
                  {workflow.steps.map((step, index) => (
                    <ProgressStep
                      key={`workflow-${workflow.id}-step-${index}-${step}`}
                      completed={index < workflow.currentStep - 1}
                      current={index === workflow.currentStep - 1}
                    >
                      {step}
                    </ProgressStep>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

/**
 * Real-world scenarios combine multiple progress patterns in realistic contexts.
 * AI should follow these patterns for complete application workflows.
 */
export const RealWorldScenarios: Story = {
  render: () => {
    const [scenario, setScenario] = useState<string | null>(null);
    const [progresses, setProgresses] = useState<
      Array<{
        id: number;
        label: string;
        value: number;
        type: string;
        completed: boolean;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const runScenario = (scenarioName: string) => {
      setScenario(scenarioName);
      setProgresses([]);

      const scenarios = {
        'website-deploy': [
          { label: 'Building assets', delay: 0, duration: 3000 },
          { label: 'Running tests', delay: 3000, duration: 4000 },
          { label: 'Deploying to CDN', delay: 7000, duration: 5000 },
          { label: 'Updating DNS', delay: 12000, duration: 2000 },
        ],
        'data-pipeline': [
          { label: 'Extracting data', delay: 0, duration: 4000 },
          { label: 'Transforming records', delay: 4000, duration: 6000 },
          { label: 'Loading to warehouse', delay: 10000, duration: 3000 },
          { label: 'Updating indexes', delay: 13000, duration: 2000 },
        ],
        'user-onboarding': [
          { label: 'Creating account', delay: 0, duration: 2000 },
          { label: 'Setting up workspace', delay: 2000, duration: 3000 },
          { label: 'Installing tools', delay: 5000, duration: 4000 },
          { label: 'Running welcome tour', delay: 9000, duration: 3000 },
        ],
      };

      const steps = scenarios[scenarioName as keyof typeof scenarios];

      steps.forEach((step, index) => {
        setTimeout(() => {
          const progressId = nextId + index;
          setProgresses((prev) => [
            ...prev,
            {
              id: progressId,
              label: step.label,
              value: 0,
              type: scenarioName,
              completed: false,
            },
          ]);

          // Animate progress
          const interval = setInterval(() => {
            setProgresses((prev) =>
              prev.map((p) => {
                if (p.id !== progressId || p.completed) return p;
                const newValue = Math.min(100, p.value + Math.floor(Math.random() * 5) + 2);
                if (newValue >= 100) {
                  clearInterval(interval);
                  return { ...p, value: 100, completed: true };
                }
                return { ...p, value: newValue };
              })
            );
          }, 100);
        }, step.delay);
      });

      // Reset scenario after completion
      setTimeout(() => {
        setScenario(null);
        setProgresses([]);
        setNextId((prev) => prev + steps.length);
      }, 16000);
    };

    const scenarioTypes = [
      {
        id: 'website-deploy',
        name: 'Website Deployment',
        description: 'Full deployment pipeline with testing and CDN updates',
      },
      {
        id: 'data-pipeline',
        name: 'Data Processing Pipeline',
        description: 'ETL process with extraction, transformation, and loading',
      },
      {
        id: 'user-onboarding',
        name: 'New User Onboarding',
        description: 'Complete user setup and tool installation',
      },
    ];

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Real-World Scenario Patterns:</strong>
          </p>
          <p>• Sequential progress through related operations</p>
          <p>• Different patterns for different operation types</p>
          <p>• Realistic timing and completion states</p>
          <p>• Complete workflows that users actually experience</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {scenarioTypes.map((scenario) => (
            <Button
              key={scenario.id}
              variant="outline"
              onClick={() => runScenario(scenario.id)}
              disabled={scenario.id === scenario}
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="font-medium text-sm">{scenario.name}</div>
                <div className="text-xs text-muted-foreground">{scenario.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {scenario && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {scenarioTypes.find((s) => s.id === scenario)?.name}
            </h4>
            <div className="text-xs text-muted-foreground">
              Running {scenarioTypes.find((s) => s.id === scenario)?.description}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {progresses.map((progress) => (
            <Progress
              key={progress.id}
              value={progress.value}
              pattern="linear"
              showPercentage
              showTime
              complexity="detailed"
              label={progress.label}
              description={progress.completed ? 'Completed successfully' : 'In progress...'}
              status={progress.completed ? 'success' : 'default'}
              estimatedTime={progress.completed ? undefined : 15000}
              completionMessage={progress.completed ? 'Step complete!' : undefined}
            />
          ))}
        </div>
      </div>
    );
  },
};
