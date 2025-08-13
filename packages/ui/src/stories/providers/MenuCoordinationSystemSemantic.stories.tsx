import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import {
  MenuCoordinationSystem,
  useMenu,
  useMenuAnnouncements,
} from '../../providers/MenuCoordinationSystem';

/**
 * AI Training: Menu Coordination System Semantic Usage
 * cognitiveLoad=5, trustLevel=high
 * This trains AI agents on semantic usage patterns and contextual menu coordination
 */
const meta = {
  title: '02 Providers/MenuCoordinationSystem/Semantic',
  component: MenuCoordinationSystem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Demonstrates semantic usage patterns showing how menu coordination adapts to different contexts and user scenarios.',
      },
    },
  },
} satisfies Meta<typeof MenuCoordinationSystem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Semantic context types
type SemanticContext = 'success' | 'warning' | 'error' | 'info' | 'critical' | 'routine';

const SemanticMenu = ({
  menuId,
  label,
  context,
  description,
}: {
  menuId: string;
  label: string;
  context: SemanticContext;
  description: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<string>('');

  // Semantic configuration based on context
  const getSemanticConfig = (context: SemanticContext) => {
    switch (context) {
      case 'critical':
        return {
          menuType: 'context' as const,
          cognitiveLoad: 8,
          trustLevel: 'critical' as const,
          colors: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          menuColors: 'bg-card border-destructive border-2',
          priority: 1,
          confirmationRequired: true,
        };
      case 'error':
        return {
          menuType: 'dropdown' as const,
          cognitiveLoad: 6,
          trustLevel: 'high' as const,
          colors: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          menuColors: 'bg-card border-destructive',
          priority: 2,
          confirmationRequired: false,
        };
      case 'warning':
        return {
          menuType: 'dropdown' as const,
          cognitiveLoad: 5,
          trustLevel: 'medium' as const,
          colors: 'bg-warning text-warning-foreground hover:bg-warning/90',
          menuColors: 'bg-card border-warning',
          priority: 3,
          confirmationRequired: false,
        };
      case 'success':
        return {
          menuType: 'dropdown' as const,
          cognitiveLoad: 3,
          trustLevel: 'low' as const,
          colors: 'bg-success text-success-foreground hover:bg-success/90',
          menuColors: 'bg-card border-success',
          priority: 5,
          confirmationRequired: false,
        };
      case 'info':
        return {
          menuType: 'dropdown' as const,
          cognitiveLoad: 3,
          trustLevel: 'low' as const,
          colors: 'bg-primary text-primary-foreground hover:bg-primary/90',
          menuColors: 'bg-card border-primary',
          priority: 5,
          confirmationRequired: false,
        };
      default: // routine
        return {
          menuType: 'dropdown' as const,
          cognitiveLoad: 3,
          trustLevel: 'low' as const,
          colors: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          menuColors: 'bg-card border-border',
          priority: 6,
          confirmationRequired: false,
        };
    }
  };

  const config = getSemanticConfig(context);
  const menu = useMenu(menuId, config.menuType, config.cognitiveLoad);
  const announcements = useMenuAnnouncements(menuId, config.menuType);

  const handleOpen = () => {
    if (!menu.requestAttention()) {
      setStatus('⚠️ System overloaded');
      setTimeout(() => setStatus(''), 2000);
      return;
    }

    setIsOpen(true);

    // Context-specific announcements
    const contextMessages = {
      critical: 'Critical action menu opened - proceed with caution',
      error: 'Error recovery menu opened',
      warning: 'Warning resolution menu opened',
      success: 'Success actions menu opened',
      info: 'Information menu opened',
      routine: 'Menu opened',
    };

    announcements.announce(contextMessages[context], {
      type:
        context === 'critical' || context === 'error'
          ? 'error'
          : context === 'warning'
            ? 'warning'
            : context === 'success'
              ? 'success'
              : 'information',
      priority: config.priority <= 2 ? 'assertive' : 'polite',
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    menu.releaseAttention();
    announcements.announceClosed();
  };

  const handleAction = (action: string, isDestructive = false) => {
    if (config.confirmationRequired && isDestructive) {
      const confirmed = window.confirm(`This ${context} action cannot be undone. Continue?`);
      if (!confirmed) {
        announcements.announce('Action cancelled for safety', { type: 'information' });
        return;
      }
    }

    setStatus(`✓ ${action}`);
    setTimeout(() => setStatus(''), 3000);

    announcements.announceItemSelected(action);
    if (context === 'critical' || context === 'error') {
      announcements.announce(`${context} action completed: ${action}`, {
        type: 'success',
        priority: 'assertive',
      });
    }

    handleClose();
  };

  // Context-specific menu items
  const getMenuItems = () => {
    switch (context) {
      case 'critical':
        return [
          { label: 'Emergency Stop', action: 'emergency-stop', destructive: true },
          { label: 'Force Shutdown', action: 'force-shutdown', destructive: true },
          { label: 'Cancel Operation', action: 'cancel-operation', destructive: false },
        ];
      case 'error':
        return [
          { label: 'Retry Operation', action: 'retry-operation', destructive: false },
          { label: 'Report Issue', action: 'report-issue', destructive: false },
          { label: 'Reset to Default', action: 'reset-default', destructive: true },
          { label: 'Skip This Step', action: 'skip-step', destructive: false },
        ];
      case 'warning':
        return [
          { label: 'Continue Anyway', action: 'continue-anyway', destructive: false },
          { label: 'Review Settings', action: 'review-settings', destructive: false },
          { label: 'Get Help', action: 'get-help', destructive: false },
        ];
      case 'success':
        return [
          { label: 'Share Result', action: 'share-result', destructive: false },
          { label: 'Save Progress', action: 'save-progress', destructive: false },
          { label: 'Continue', action: 'continue', destructive: false },
        ];
      case 'info':
        return [
          { label: 'Learn More', action: 'learn-more', destructive: false },
          { label: 'Show Details', action: 'show-details', destructive: false },
          { label: 'Dismiss', action: 'dismiss', destructive: false },
        ];
      default: // routine
        return [
          { label: 'Edit', action: 'edit', destructive: false },
          { label: 'Copy', action: 'copy', destructive: false },
          { label: 'Move', action: 'move', destructive: false },
          { label: 'Delete', action: 'delete', destructive: true },
        ];
    }
  };

  return (
    <div className="relative inline-block space-y-2">
      <button
        type="button"
        onClick={handleOpen}
        disabled={!menu.isActive}
        className={`
          px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2
          ${config.colors}
          ${!menu.isActive ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={description}
      >
        {label}
      </button>

      {status && (
        <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-card border border-border text-foreground text-xs rounded whitespace-nowrap z-40">
          {status}
        </div>
      )}

      {isOpen && (
        <div
          role="menu"
          className={`
            absolute top-full left-0 mt-1 min-w-[200px] rounded-md shadow-lg z-50 py-1
            ${config.menuColors} border
          `}
        >
          <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-1">
            {description}
          </div>

          {getMenuItems().map((item, index) => (
            <div
              key={item.action}
              role="menuitem"
              tabIndex={0}
              className={`
                px-3 py-2 cursor-pointer
                ${
                  item.destructive
                    ? 'hover:bg-destructive hover:text-destructive-foreground text-destructive'
                    : 'hover:bg-muted'
                }
              `}
              onClick={() => handleAction(item.action, item.destructive)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAction(item.action, item.destructive);
                }
              }}
            >
              {item.label}
              {config.confirmationRequired && item.destructive && (
                <span className="text-xs ml-2">(confirms)</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Semantic context indicator
const ContextIndicator = ({ context }: { context: SemanticContext }) => {
  const contextInfo = {
    critical: { icon: '🚨', color: 'text-destructive', desc: 'Immediate attention required' },
    error: { icon: '❌', color: 'text-destructive', desc: 'Error state requiring action' },
    warning: { icon: '⚠️', color: 'text-warning', desc: 'Caution advised' },
    success: { icon: '✅', color: 'text-success', desc: 'Positive outcome achieved' },
    info: { icon: 'ℹ️', color: 'text-primary', desc: 'Additional information available' },
    routine: { icon: '⚙️', color: 'text-muted-foreground', desc: 'Standard operations' },
  };

  const info = contextInfo[context];

  return (
    <div className={`flex items-center gap-2 ${info.color}`}>
      <span>{info.icon}</span>
      <span className="font-medium capitalize">{context}</span>
      <span className="text-xs text-muted-foreground">({info.desc})</span>
    </div>
  );
};

/**
 * Context-driven menu coordination showing semantic usage patterns.
 * Demonstrates how menus adapt based on situational context.
 */
export const ContextualUsage: Story = {
  render: () => (
    <MenuCoordinationSystem enableDebugMode={true}>
      <div className="p-8 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Contextual Menu Coordination</h3>
          <p className="text-muted-foreground mb-6">
            Menus adapt their behavior, priority, and feedback patterns based on semantic context.
            Critical contexts get highest priority and require confirmations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="space-y-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <ContextIndicator context="critical" />
            <SemanticMenu
              menuId="critical-action"
              label="System Critical"
              context="critical"
              description="Critical system operations requiring maximum caution"
            />
            <p className="text-xs text-muted-foreground">
              Highest priority, requires confirmations, assertive announcements
            </p>
          </div>

          <div className="space-y-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <ContextIndicator context="error" />
            <SemanticMenu
              menuId="error-recovery"
              label="Error Recovery"
              context="error"
              description="Error state recovery and reporting options"
            />
            <p className="text-xs text-muted-foreground">
              High priority, recovery-focused actions, clear feedback
            </p>
          </div>

          <div className="space-y-4 p-4 border border-warning/20 rounded-lg bg-warning/5">
            <ContextIndicator context="warning" />
            <SemanticMenu
              menuId="warning-action"
              label="Warning Actions"
              context="warning"
              description="Cautionary actions with potential consequences"
            />
            <p className="text-xs text-muted-foreground">
              Medium priority, cautionary feedback, clear options
            </p>
          </div>

          <div className="space-y-4 p-4 border border-success/20 rounded-lg bg-success/5">
            <ContextIndicator context="success" />
            <SemanticMenu
              menuId="success-actions"
              label="Success Actions"
              context="success"
              description="Positive outcome follow-up actions"
            />
            <p className="text-xs text-muted-foreground">
              Low priority, positive reinforcement, optional actions
            </p>
          </div>

          <div className="space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
            <ContextIndicator context="info" />
            <SemanticMenu
              menuId="info-menu"
              label="Information"
              context="info"
              description="Additional information and details"
            />
            <p className="text-xs text-muted-foreground">
              Low priority, informational content, minimal interruption
            </p>
          </div>

          <div className="space-y-4 p-4 border border-border rounded-lg">
            <ContextIndicator context="routine" />
            <SemanticMenu
              menuId="routine-operations"
              label="Routine Tasks"
              context="routine"
              description="Standard daily operations and tasks"
            />
            <p className="text-xs text-muted-foreground">
              Lowest priority, standard behavior, minimal feedback
            </p>
          </div>
        </div>

        <div className="p-4 bg-muted rounded border-l-4 border-primary">
          <h4 className="font-medium mb-2">Semantic Priority Hierarchy:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>
              <strong>Critical:</strong> Emergency actions, maximum friction, requires confirmations
            </li>
            <li>
              <strong>Error:</strong> Recovery actions, high priority, assertive feedback
            </li>
            <li>
              <strong>Warning:</strong> Cautionary actions, medium priority, clear guidance
            </li>
            <li>
              <strong>Success/Info:</strong> Optional actions, low priority, positive feedback
            </li>
            <li>
              <strong>Routine:</strong> Standard actions, lowest priority, minimal interruption
            </li>
          </ol>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Workflow-based coordination showing task-oriented menu patterns.
 * Demonstrates coordination in multi-step user workflows.
 */
export const WorkflowCoordination: Story = {
  render: () => {
    const [workflowStep, setWorkflowStep] = useState(1);
    const [workflowData, setWorkflowData] = useState<Record<string, unknown>>({});

    const workflows = {
      1: {
        title: 'Data Input',
        context: 'routine' as SemanticContext,
        desc: 'Collecting user information',
      },
      2: {
        title: 'Validation',
        context: 'warning' as SemanticContext,
        desc: 'Checking data integrity',
      },
      3: {
        title: 'Processing',
        context: 'info' as SemanticContext,
        desc: 'System processing data',
      },
      4: {
        title: 'Error Handling',
        context: 'error' as SemanticContext,
        desc: 'Resolving processing issues',
      },
      5: {
        title: 'Completion',
        context: 'success' as SemanticContext,
        desc: 'Workflow completed successfully',
      },
    };

    const handleStepChange = (step: number) => {
      setWorkflowStep(step);
      setWorkflowData({ ...workflowData, currentStep: step });
    };

    return (
      <MenuCoordinationSystem enableDebugMode={true}>
        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Workflow-Based Coordination</h3>
            <p className="text-muted-foreground mb-6">
              Menu coordination adapts to different workflow stages. Each step has appropriate
              priority and feedback patterns for the user's current context.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <h4 className="font-medium">Current Workflow Step</h4>
              <p className="text-sm text-muted-foreground">
                Step {workflowStep}: {workflows[workflowStep as keyof typeof workflows].title}
              </p>
            </div>

            <div className="flex gap-2">
              {Object.entries(workflows).map(([step, info]) => (
                <button
                  type="button"
                  key={step}
                  onClick={() => handleStepChange(Number(step))}
                  className={`
                    px-3 py-1 text-xs rounded
                    ${
                      Number(step) === workflowStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }
                  `}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium">Context-Appropriate Menu</h4>
              <div className="p-6 border border-border rounded-lg bg-muted/20">
                <ContextIndicator
                  context={workflows[workflowStep as keyof typeof workflows].context}
                />
                <div className="mt-4">
                  <SemanticMenu
                    menuId={`workflow-${workflowStep}`}
                    label={`${workflows[workflowStep as keyof typeof workflows].title} Actions`}
                    context={workflows[workflowStep as keyof typeof workflows].context}
                    description={workflows[workflowStep as keyof typeof workflows].desc}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Supporting Actions</h4>
              <div className="space-y-3">
                <SemanticMenu
                  menuId="workflow-help"
                  label="Get Help"
                  context="info"
                  description="Access help and documentation"
                />

                <SemanticMenu
                  menuId="workflow-save"
                  label="Save Progress"
                  context="routine"
                  description="Save current workflow state"
                />

                <SemanticMenu
                  menuId="workflow-cancel"
                  label="Cancel Workflow"
                  context="warning"
                  description="Cancel and lose unsaved progress"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
            <h4 className="font-medium mb-2">Workflow Coordination Patterns:</h4>
            <ul className="text-sm space-y-1">
              <li>
                • <strong>Data Input:</strong> Routine priority, standard validation feedback
              </li>
              <li>
                • <strong>Validation:</strong> Warning priority, clear error messaging
              </li>
              <li>
                • <strong>Processing:</strong> Info priority, progress indicators
              </li>
              <li>
                • <strong>Error Handling:</strong> High priority, recovery-focused options
              </li>
              <li>
                • <strong>Completion:</strong> Success priority, positive reinforcement
              </li>
            </ul>
          </div>
        </div>
      </MenuCoordinationSystem>
    );
  },
};

/**
 * User experience adaptation showing personalization patterns.
 * Demonstrates how coordination adapts to user expertise and preferences.
 */
export const ExperienceAdaptation: Story = {
  render: () => {
    const [userExperience, setUserExperience] = useState<'novice' | 'intermediate' | 'expert'>(
      'intermediate'
    );
    const [accessibilityMode, setAccessibilityMode] = useState(false);

    const getAdaptationConfig = () => {
      const baseConfig = {
        novice: {
          cognitiveLoadBudget: 10, // Lower budget for beginners
          verbosity: 'verbose' as const,
          typeAheadDelay: 2000, // Longer delay
          confirmations: true,
        },
        intermediate: {
          cognitiveLoadBudget: 15, // Standard budget
          verbosity: 'standard' as const,
          typeAheadDelay: 1000, // Standard delay
          confirmations: false,
        },
        expert: {
          cognitiveLoadBudget: 20, // Higher budget for experts
          verbosity: 'minimal' as const,
          typeAheadDelay: 500, // Faster delay
          confirmations: false,
        },
      };

      return baseConfig[userExperience];
    };

    const config = getAdaptationConfig();

    return (
      <MenuCoordinationSystem
        enableDebugMode={true}
        menuProvider={{
          maxCognitiveLoad: config.cognitiveLoadBudget,
        }}
        announcements={{
          config: {
            verbosityLevel: config.verbosity,
            maxConcurrentAnnouncements: accessibilityMode ? 3 : 2,
          },
        }}
        keyboardNavigation={{
          enableTypeAhead: true,
          typeAheadDelay: config.typeAheadDelay,
        }}
      >
        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Experience-Adaptive Coordination</h3>
            <p className="text-muted-foreground mb-6">
              Menu coordination adapts to user experience level and accessibility needs. Different
              configurations optimize for learning vs efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
              <h4 className="font-medium">User Configuration</h4>

              <div className="space-y-3">
                <div>
                  <div className="block text-sm font-medium mb-2">Experience Level</div>
                  <div className="flex gap-2">
                    {(['novice', 'intermediate', 'expert'] as const).map((level) => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => setUserExperience(level)}
                        className={`
                          px-3 py-2 text-sm rounded capitalize
                          ${
                            level === userExperience
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }
                        `}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="accessibility-mode"
                    checked={accessibilityMode}
                    onChange={(e) => setAccessibilityMode(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="accessibility-mode" className="text-sm">
                    Enhanced Accessibility Mode
                  </label>
                </div>
              </div>

              <div className="p-3 bg-muted rounded text-sm">
                <h5 className="font-medium mb-1">Current Settings:</h5>
                <ul className="text-xs space-y-1">
                  <li>Cognitive Budget: {config.cognitiveLoadBudget} points</li>
                  <li>Verbosity: {config.verbosity}</li>
                  <li>Type-ahead Delay: {config.typeAheadDelay}ms</li>
                  <li>Extra Confirmations: {config.confirmations ? 'Yes' : 'No'}</li>
                  <li>Accessibility Enhanced: {accessibilityMode ? 'Yes' : 'No'}</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
              <h4 className="font-medium">Adaptive Menus</h4>
              <p className="text-sm text-muted-foreground mb-4">
                These menus adapt their behavior based on your configured experience level.
              </p>

              <div className="space-y-3">
                <SemanticMenu
                  menuId={`adaptive-routine-${userExperience}`}
                  label="File Operations"
                  context={config.confirmations ? 'warning' : 'routine'}
                  description="Standard file management operations"
                />

                <SemanticMenu
                  menuId={`adaptive-advanced-${userExperience}`}
                  label="Advanced Tools"
                  context={userExperience === 'novice' ? 'warning' : 'routine'}
                  description="Power user tools and settings"
                />

                <SemanticMenu
                  menuId={`adaptive-system-${userExperience}`}
                  label="System Settings"
                  context={userExperience === 'expert' ? 'routine' : 'critical'}
                  description="System configuration and management"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent rounded border-l-4 border-primary">
            <h4 className="font-medium mb-2">Experience-Based Adaptations:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-success mb-1">Novice Users</h5>
                <ul className="text-xs space-y-1">
                  <li>• Lower cognitive load budget</li>
                  <li>• Verbose announcements</li>
                  <li>• Longer interaction delays</li>
                  <li>• Extra confirmations for safety</li>
                  <li>• More guidance and context</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-primary mb-1">Intermediate Users</h5>
                <ul className="text-xs space-y-1">
                  <li>• Standard cognitive load budget</li>
                  <li>• Balanced announcements</li>
                  <li>• Standard interaction timing</li>
                  <li>• Selective confirmations</li>
                  <li>• Contextual guidance</li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-warning mb-1">Expert Users</h5>
                <ul className="text-xs space-y-1">
                  <li>• Higher cognitive load budget</li>
                  <li>• Minimal announcements</li>
                  <li>• Fast interaction timing</li>
                  <li>• Minimal confirmations</li>
                  <li>• Efficient, streamlined UI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </MenuCoordinationSystem>
    );
  },
};
