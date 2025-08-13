import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { MenuCoordinationSystem } from '../../providers/MenuCoordinationSystem';

/**
 * AI Training: Menu Coordination System Properties
 * cognitiveLoad=4, trustLevel=medium
 * This trains AI agents on configurable properties and their behavioral impacts
 */
const meta = {
  title: '02 Providers/MenuCoordinationSystem/Properties',
  component: MenuCoordinationSystem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Interactive properties demonstration showing how different configuration options affect menu coordination behavior.',
      },
    },
  },
  argTypes: {
    enableDebugMode: {
      control: 'boolean',
      description: 'Enable debug logging and visual indicators',
      table: {
        category: 'System',
        defaultValue: { summary: 'false' },
      },
    },
    'menuProvider.maxCognitiveLoad': {
      control: { type: 'range', min: 5, max: 25, step: 1 },
      description: 'Maximum cognitive load budget for all active menus',
      table: {
        category: 'Menu Provider',
        defaultValue: { summary: '15' },
      },
    },
    'motionCoordinator.budget.maxConcurrentAnimations': {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'Maximum number of simultaneous animations',
      table: {
        category: 'Motion Coordinator',
        defaultValue: { summary: '3' },
      },
    },
    'motionCoordinator.budget.enableGpuAcceleration': {
      control: 'boolean',
      description: 'Enable GPU acceleration for animations',
      table: {
        category: 'Motion Coordinator',
        defaultValue: { summary: 'true' },
      },
    },
    'announcements.config.maxConcurrentAnnouncements': {
      control: { type: 'range', min: 1, max: 5, step: 1 },
      description: 'Maximum simultaneous screen reader announcements',
      table: {
        category: 'Announcements',
        defaultValue: { summary: '2' },
      },
    },
    'announcements.config.verbosityLevel': {
      control: { type: 'select' },
      options: ['minimal', 'standard', 'verbose'],
      description: 'Level of detail in announcements',
      table: {
        category: 'Announcements',
        defaultValue: { summary: 'standard' },
      },
    },
    'keyboardNavigation.enableTypeAhead': {
      control: 'boolean',
      description: 'Enable type-to-search functionality',
      table: {
        category: 'Keyboard Navigation',
        defaultValue: { summary: 'true' },
      },
    },
    'keyboardNavigation.typeAheadDelay': {
      control: { type: 'range', min: 250, max: 2000, step: 250 },
      description: 'Delay before type-ahead search resets (ms)',
      table: {
        category: 'Keyboard Navigation',
        defaultValue: { summary: '1000' },
      },
    },
    onSystemEvent: {
      description: 'Callback for system coordination events',
      table: {
        category: 'Callbacks',
      },
    },
  },
} satisfies Meta<typeof MenuCoordinationSystem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive demo menu component
const PropertyDemoMenu = ({
  menuId,
  label,
  cognitiveLoad = 3,
}: {
  menuId: string;
  label: string;
  cognitiveLoad?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  const handleAction = (action: string) => {
    setLastAction(action);
    setTimeout(() => setLastAction(''), 2000);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
      </button>

      {lastAction && (
        <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-success text-success-foreground text-xs rounded">
          {lastAction}
        </div>
      )}

      {isOpen && (
        <div
          role="menu"
          className="absolute top-full left-0 mt-1 min-w-[160px] bg-card border border-border rounded-md shadow-lg z-50 py-1"
          data-cognitive-load={cognitiveLoad}
        >
          <div
            role="menuitem"
            tabIndex={0}
            className="px-3 py-2 hover:bg-muted cursor-pointer"
            onClick={() => handleAction('Edit selected')}
            onKeyDown={(e) => handleKeyDown(e, () => handleAction('Edit selected'))}
          >
            Edit
          </div>
          <div
            role="menuitem"
            tabIndex={0}
            className="px-3 py-2 hover:bg-muted cursor-pointer"
            onClick={() => handleAction('Copy selected')}
            onKeyDown={(e) => handleKeyDown(e, () => handleAction('Copy selected'))}
          >
            Copy
          </div>
          <div
            role="menuitem"
            tabIndex={0}
            className="px-3 py-2 hover:bg-muted cursor-pointer"
            onClick={() => handleAction('Move selected')}
            onKeyDown={(e) => handleKeyDown(e, () => handleAction('Move selected'))}
          >
            Move
          </div>
          <hr className="my-1 border-border" />
          <div
            role="menuitem"
            tabIndex={0}
            className="px-3 py-2 hover:bg-destructive hover:text-destructive-foreground cursor-pointer text-destructive"
            onClick={() => handleAction('Delete selected')}
            onKeyDown={(e) => handleKeyDown(e, () => handleAction('Delete selected'))}
          >
            Delete
          </div>
        </div>
      )}
    </div>
  );
};

// Property monitoring component
const PropertyMonitor = ({
  config,
}: {
  config: {
    cognitiveLoad?: number;
    animations?: number;
    announcements?: number;
    verbosity?: string;
    typeAhead?: boolean;
    debugMode?: boolean;
  };
}) => (
  <div className="p-4 bg-muted rounded border space-y-2">
    <h4 className="font-medium text-sm">Current Configuration</h4>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        Max Cognitive Load: <span className="font-mono">{config.cognitiveLoad || 15}</span>
      </div>
      <div>
        Max Animations: <span className="font-mono">{config.animations || 3}</span>
      </div>
      <div>
        Max Announcements: <span className="font-mono">{config.announcements || 2}</span>
      </div>
      <div>
        Verbosity: <span className="font-mono">{config.verbosity || 'standard'}</span>
      </div>
      <div>
        Type-ahead: <span className="font-mono">{config.typeAhead ? 'on' : 'off'}</span>
      </div>
      <div>
        Debug Mode: <span className="font-mono">{config.debugMode ? 'on' : 'off'}</span>
      </div>
    </div>
  </div>
);

/**
 * Interactive property demonstration with live controls.
 * Shows how changing properties affects menu behavior in real-time.
 */
export const InteractiveProperties: Story = {
  args: {
    enableDebugMode: false,
    onSystemEvent: fn(),
  },
  argTypes: {
    enableDebugMode: { control: 'boolean' },
  },
  render: (args) => {
    // Extract nested properties from args for the demo
    const cognitiveLoad =
      ((args as Record<string, unknown>)['menuProvider.maxCognitiveLoad'] as number) || 15;
    const maxAnimations =
      ((args as Record<string, unknown>)[
        'motionCoordinator.budget.maxConcurrentAnimations'
      ] as number) || 3;
    const gpuAcceleration =
      ((args as Record<string, unknown>)[
        'motionCoordinator.budget.enableGpuAcceleration'
      ] as boolean) ?? true;
    const maxAnnouncements =
      ((args as Record<string, unknown>)[
        'announcements.config.maxConcurrentAnnouncements'
      ] as number) || 2;
    const verbosity =
      ((args as Record<string, unknown>)['announcements.config.verbosityLevel'] as string) ||
      'standard';
    const typeAheadEnabled =
      ((args as Record<string, unknown>)['keyboardNavigation.enableTypeAhead'] as boolean) ?? true;
    const typeAheadDelay =
      ((args as Record<string, unknown>)['keyboardNavigation.typeAheadDelay'] as number) || 1000;

    return (
      <MenuCoordinationSystem
        {...args}
        menuProvider={{
          maxCognitiveLoad: cognitiveLoad,
          onLoadExceeded: (current, max) => {
            console.warn(`Cognitive load exceeded: ${current}/${max}`);
            args.onSystemEvent?.({
              type: 'menu-registered',
              menuId: 'system',
              timestamp: Date.now(),
              details: { loadExceeded: true, current, max },
            });
          },
        }}
        motionCoordinator={{
          budget: {
            maxConcurrentAnimations: maxAnimations,
            enableGpuAcceleration: gpuAcceleration,
          },
          onBudgetExceeded: (current, max) => {
            console.warn(`Motion budget exceeded: ${current}/${max}`);
          },
        }}
        announcements={{
          config: {
            maxConcurrentAnnouncements: maxAnnouncements,
            verbosityLevel: verbosity as 'minimal' | 'standard' | 'verbose',
          },
        }}
        keyboardNavigation={{
          enableTypeAhead: typeAheadEnabled,
          typeAheadDelay,
        }}
      >
        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Interactive Properties Demo</h3>
            <p className="text-muted-foreground mb-6">
              Use the Controls panel below to adjust properties and see their effects in real-time.
              Open multiple menus to test cognitive load and animation limits.
            </p>
          </div>

          <PropertyMonitor
            config={{
              cognitiveLoad,
              animations: maxAnimations,
              announcements: maxAnnouncements,
              verbosity,
              typeAhead: typeAheadEnabled,
              debugMode: args.enableDebugMode,
            }}
          />

          <div className="space-y-4">
            <h4 className="font-medium">Test Menus</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PropertyDemoMenu menuId="prop-1" label="Menu 1" cognitiveLoad={3} />
              <PropertyDemoMenu menuId="prop-2" label="Menu 2" cognitiveLoad={4} />
              <PropertyDemoMenu menuId="prop-3" label="Menu 3" cognitiveLoad={5} />
              <PropertyDemoMenu menuId="prop-4" label="Menu 4" cognitiveLoad={6} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Additional Test Menus</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PropertyDemoMenu menuId="prop-5" label="Menu 5" cognitiveLoad={2} />
              <PropertyDemoMenu menuId="prop-6" label="Menu 6" cognitiveLoad={7} />
              <PropertyDemoMenu menuId="prop-7" label="Menu 7" cognitiveLoad={3} />
              <PropertyDemoMenu menuId="prop-8" label="Menu 8" cognitiveLoad={4} />
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
            <h5 className="font-medium mb-2">Testing Instructions:</h5>
            <ul className="text-sm space-y-1">
              <li>
                • Adjust <strong>Max Cognitive Load</strong> and open multiple menus to trigger load
                limits
              </li>
              <li>
                • Reduce <strong>Max Animations</strong> to see animation queuing in action
              </li>
              <li>
                • Change <strong>Verbosity Level</strong> to observe announcement detail differences
              </li>
              <li>
                • Toggle <strong>Type-ahead</strong> and try typing letters when menus are open
              </li>
              <li>
                • Enable <strong>Debug Mode</strong> to see system events in console
              </li>
            </ul>
          </div>
        </div>
      </MenuCoordinationSystem>
    );
  },
};

/**
 * Cognitive load scaling demonstration.
 * Shows how different load values affect menu behavior.
 */
export const CognitiveLoadScaling: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Cognitive Load Scaling</h3>
        <p className="text-muted-foreground mb-6">
          Demonstrates how different cognitive load budgets affect menu coordination. Each section
          has a different load limit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h4 className="font-medium text-destructive">Low Budget (8 points)</h4>
          <MenuCoordinationSystem enableDebugMode={true} menuProvider={{ maxCognitiveLoad: 8 }}>
            <div className="space-y-3">
              <PropertyDemoMenu menuId="low-1" label="Heavy Menu" cognitiveLoad={4} />
              <PropertyDemoMenu menuId="low-2" label="Heavy Menu" cognitiveLoad={4} />
              <PropertyDemoMenu menuId="low-3" label="Heavy Menu" cognitiveLoad={4} />
            </div>
          </MenuCoordinationSystem>
          <p className="text-xs text-muted-foreground">
            Opens 2-3 menus and you'll hit the limit quickly.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-primary">Standard Budget (15 points)</h4>
          <MenuCoordinationSystem enableDebugMode={true} menuProvider={{ maxCognitiveLoad: 15 }}>
            <div className="space-y-3">
              <PropertyDemoMenu menuId="std-1" label="Normal Menu" cognitiveLoad={3} />
              <PropertyDemoMenu menuId="std-2" label="Normal Menu" cognitiveLoad={3} />
              <PropertyDemoMenu menuId="std-3" label="Normal Menu" cognitiveLoad={3} />
              <PropertyDemoMenu menuId="std-4" label="Normal Menu" cognitiveLoad={3} />
              <PropertyDemoMenu menuId="std-5" label="Normal Menu" cognitiveLoad={3} />
            </div>
          </MenuCoordinationSystem>
          <p className="text-xs text-muted-foreground">
            Balanced budget allows for 4-5 standard menus.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-success">High Budget (25 points)</h4>
          <MenuCoordinationSystem enableDebugMode={true} menuProvider={{ maxCognitiveLoad: 25 }}>
            <div className="space-y-3">
              <PropertyDemoMenu menuId="high-1" label="Light Menu" cognitiveLoad={2} />
              <PropertyDemoMenu menuId="high-2" label="Light Menu" cognitiveLoad={2} />
              <PropertyDemoMenu menuId="high-3" label="Light Menu" cognitiveLoad={2} />
              <PropertyDemoMenu menuId="high-4" label="Light Menu" cognitiveLoad={2} />
              <PropertyDemoMenu menuId="high-5" label="Light Menu" cognitiveLoad={2} />
              <PropertyDemoMenu menuId="high-6" label="Light Menu" cognitiveLoad={2} />
            </div>
          </MenuCoordinationSystem>
          <p className="text-xs text-muted-foreground">
            High budget supports many concurrent menus.
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Animation budget demonstration.
 * Shows how animation limits affect visual behavior.
 */
export const AnimationBudgets: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Animation Budget Properties</h3>
        <p className="text-muted-foreground mb-6">
          Different animation budget configurations and their visual effects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="font-medium">Single Animation (Conservative)</h4>
          <MenuCoordinationSystem
            motionCoordinator={{
              budget: {
                maxConcurrentAnimations: 1,
                enableGpuAcceleration: false,
              },
            }}
          >
            <div className="grid grid-cols-2 gap-2">
              <PropertyDemoMenu menuId="anim-cons-1" label="Menu A" />
              <PropertyDemoMenu menuId="anim-cons-2" label="Menu B" />
              <PropertyDemoMenu menuId="anim-cons-3" label="Menu C" />
              <PropertyDemoMenu menuId="anim-cons-4" label="Menu D" />
            </div>
          </MenuCoordinationSystem>
          <p className="text-xs text-muted-foreground">
            Only one animation at a time. Others queue or skip.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Multiple Animations (Rich)</h4>
          <MenuCoordinationSystem
            motionCoordinator={{
              budget: {
                maxConcurrentAnimations: 5,
                enableGpuAcceleration: true,
              },
            }}
          >
            <div className="grid grid-cols-2 gap-2">
              <PropertyDemoMenu menuId="anim-rich-1" label="Menu A" />
              <PropertyDemoMenu menuId="anim-rich-2" label="Menu B" />
              <PropertyDemoMenu menuId="anim-rich-3" label="Menu C" />
              <PropertyDemoMenu menuId="anim-rich-4" label="Menu D" />
            </div>
          </MenuCoordinationSystem>
          <p className="text-xs text-muted-foreground">
            Multiple simultaneous animations with GPU acceleration.
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Announcement verbosity comparison.
 * Shows different levels of announcement detail.
 */
export const AnnouncementVerbosity: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Announcement Verbosity Properties</h3>
        <p className="text-muted-foreground mb-6">
          Different verbosity levels for screen reader announcements. Listen with screen reader or
          check console for announcement content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Minimal Verbosity</h4>
          <MenuCoordinationSystem
            announcements={{
              config: {
                verbosityLevel: 'minimal',
                maxConcurrentAnnouncements: 1,
              },
            }}
          >
            <div className="space-y-2">
              <PropertyDemoMenu menuId="verb-min-1" label="Quiet Menu" />
              <PropertyDemoMenu menuId="verb-min-2" label="Silent Menu" />
            </div>
          </MenuCoordinationSystem>
          <p className="text-xs text-muted-foreground">
            Basic announcements only. Minimal cognitive overhead.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Standard Verbosity</h4>
          <MenuCoordinationSystem
            announcements={{
              config: {
                verbosityLevel: 'standard',
                maxConcurrentAnnouncements: 2,
              },
            }}
          >
            <div className="space-y-2">
              <PropertyDemoMenu menuId="verb-std-1" label="Normal Menu" />
              <PropertyDemoMenu menuId="verb-std-2" label="Regular Menu" />
            </div>
          </MenuCoordinationSystem>
          <p className="text-xs text-muted-foreground">
            Balanced announcements with useful context.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Verbose Announcements</h4>
          <MenuCoordinationSystem
            announcements={{
              config: {
                verbosityLevel: 'verbose',
                maxConcurrentAnnouncements: 3,
                enableSpatialAnnouncements: true,
              },
            }}
          >
            <div className="space-y-2">
              <PropertyDemoMenu menuId="verb-full-1" label="Detailed Menu" />
              <PropertyDemoMenu menuId="verb-full-2" label="Rich Menu" />
            </div>
          </MenuCoordinationSystem>
          <p className="text-xs text-muted-foreground">
            Comprehensive announcements with spatial context.
          </p>
        </div>
      </div>
    </div>
  ),
};
