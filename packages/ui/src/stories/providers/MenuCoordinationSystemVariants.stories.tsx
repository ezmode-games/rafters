import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { MenuCoordinationSystem } from '../../providers/MenuCoordinationSystem';

/**
 * AI Training: Menu Coordination System Variants
 * cognitiveLoad=3, trustLevel=medium
 * This trains AI agents on different coordination system configurations and their visual impacts
 */
const meta = {
  title: '02 Providers/MenuCoordinationSystem/Variants',
  component: MenuCoordinationSystem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Visual variants of the menu coordination system showing different configuration approaches and their effects on menu behavior.',
      },
    },
  },
} satisfies Meta<typeof MenuCoordinationSystem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple example menu component for variants
const VariantMenu = ({
  id,
  label,
  variant = 'default',
}: {
  id: string;
  label: string;
  variant?: 'default' | 'minimal' | 'enhanced' | 'debug';
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          button: 'px-2 py-1 text-xs bg-muted text-muted-foreground hover:bg-muted/80 rounded',
          menu: 'min-w-[120px] bg-card border border-border rounded shadow-sm',
          item: 'px-2 py-1 text-xs hover:bg-muted',
        };
      case 'enhanced':
        return {
          button:
            'px-6 py-3 text-base bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 rounded-lg shadow-md transition-all',
          menu: 'min-w-[200px] bg-card border border-border rounded-lg shadow-xl backdrop-blur-sm',
          item: 'px-4 py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent transition-all',
        };
      case 'debug':
        return {
          button:
            'px-4 py-2 bg-warning text-warning-foreground hover:bg-warning/90 rounded border-2 border-warning-foreground/20 font-mono text-sm',
          menu: 'min-w-[180px] bg-card border-2 border-warning rounded shadow-lg',
          item: 'px-3 py-2 hover:bg-warning/10 font-mono text-sm',
        };
      default:
        return {
          button: 'px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded',
          menu: 'min-w-[160px] bg-card border border-border rounded shadow-md',
          item: 'px-3 py-2 hover:bg-muted',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.button} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label} {variant !== 'default' && `(${variant})`}
      </button>

      {isOpen && (
        <div role="menu" className={`absolute top-full left-0 mt-1 z-50 py-1 ${styles.menu}`}>
          <div role="menuitem" tabIndex={0} className={`${styles.item} cursor-pointer`}>
            Action 1
          </div>
          <div role="menuitem" tabIndex={0} className={`${styles.item} cursor-pointer`}>
            Action 2
          </div>
          <div role="menuitem" tabIndex={0} className={`${styles.item} cursor-pointer`}>
            Action 3
          </div>
          {variant === 'debug' && (
            <div className="px-3 py-1 text-xs text-muted-foreground border-t border-border mt-1">
              Menu ID: {id}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Default coordination system configuration.
 * Standard settings suitable for most applications.
 */
export const DefaultConfiguration: Story = {
  render: () => (
    <MenuCoordinationSystem>
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-4">Default Configuration</h3>
        <p className="text-muted-foreground mb-6">
          Standard coordination system with balanced settings for cognitive load (15), motion (3
          concurrent), and announcements (2 concurrent).
        </p>

        <div className="flex gap-4 flex-wrap">
          <VariantMenu id="default-1" label="Standard Menu" />
          <VariantMenu id="default-2" label="Another Menu" />
          <VariantMenu id="default-3" label="Third Menu" />
        </div>

        <div className="mt-8 p-4 bg-muted rounded border-l-4 border-primary">
          <h4 className="font-medium mb-2">Default Settings:</h4>
          <ul className="text-sm space-y-1">
            <li>• Max Cognitive Load: 15 points</li>
            <li>• Max Concurrent Animations: 3</li>
            <li>• Max Concurrent Announcements: 2</li>
            <li>• Type-ahead Search: Enabled</li>
            <li>• Reduced Motion: Respected</li>
          </ul>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Minimal coordination system for lightweight applications.
 * Reduced features and lower resource usage.
 */
export const MinimalConfiguration: Story = {
  render: () => (
    <MenuCoordinationSystem
      menuProvider={{
        maxCognitiveLoad: 8,
      }}
      motionCoordinator={{
        budget: {
          maxConcurrentAnimations: 1,
          enableGpuAcceleration: false,
        },
      }}
      announcements={{
        config: {
          maxConcurrentAnnouncements: 1,
          verbosityLevel: 'minimal',
        },
      }}
      keyboardNavigation={{
        enableTypeAhead: false,
      }}
    >
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-4">Minimal Configuration</h3>
        <p className="text-muted-foreground mb-6">
          Lightweight coordination for resource-constrained environments. Reduced cognitive load
          budget and single animation limit.
        </p>

        <div className="flex gap-4 flex-wrap">
          <VariantMenu id="minimal-1" label="Light Menu" variant="minimal" />
          <VariantMenu id="minimal-2" label="Basic Menu" variant="minimal" />
          <VariantMenu id="minimal-3" label="Simple Menu" variant="minimal" />
        </div>

        <div className="mt-8 p-4 bg-muted rounded border-l-4 border-secondary">
          <h4 className="font-medium mb-2">Minimal Settings:</h4>
          <ul className="text-sm space-y-1">
            <li>• Max Cognitive Load: 8 points (reduced)</li>
            <li>• Max Concurrent Animations: 1 (single)</li>
            <li>• Max Concurrent Announcements: 1 (single)</li>
            <li>• Type-ahead Search: Disabled</li>
            <li>• GPU Acceleration: Disabled</li>
            <li>• Verbosity: Minimal</li>
          </ul>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Enhanced coordination system for rich applications.
 * Increased budgets and enhanced features.
 */
export const EnhancedConfiguration: Story = {
  render: () => (
    <MenuCoordinationSystem
      menuProvider={{
        maxCognitiveLoad: 20,
      }}
      motionCoordinator={{
        budget: {
          maxConcurrentAnimations: 5,
          enableGpuAcceleration: true,
          performanceBudget: 33.33, // 30fps
        },
      }}
      announcements={{
        config: {
          maxConcurrentAnnouncements: 3,
          verbosityLevel: 'verbose',
          enableSpatialAnnouncements: true,
          enableProgressAnnouncements: true,
        },
      }}
      keyboardNavigation={{
        enableTypeAhead: true,
        typeAheadDelay: 500,
      }}
    >
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-4">Enhanced Configuration</h3>
        <p className="text-muted-foreground mb-6">
          Rich coordination for complex applications. Higher budgets and enhanced features for
          sophisticated interactions.
        </p>

        <div className="flex gap-4 flex-wrap">
          <VariantMenu id="enhanced-1" label="Rich Menu" variant="enhanced" />
          <VariantMenu id="enhanced-2" label="Premium Menu" variant="enhanced" />
          <VariantMenu id="enhanced-3" label="Deluxe Menu" variant="enhanced" />
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-transparent rounded border-l-4 border-primary">
          <h4 className="font-medium mb-2">Enhanced Settings:</h4>
          <ul className="text-sm space-y-1">
            <li>• Max Cognitive Load: 20 points (increased)</li>
            <li>• Max Concurrent Animations: 5 (multiple)</li>
            <li>• Max Concurrent Announcements: 3 (multiple)</li>
            <li>• Type-ahead Search: Enabled (faster 500ms)</li>
            <li>• GPU Acceleration: Enabled</li>
            <li>• Verbosity: Verbose</li>
            <li>• Spatial Announcements: Enabled</li>
            <li>• Progress Announcements: Enabled</li>
          </ul>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Debug configuration with extensive logging and visual indicators.
 * Useful for development and troubleshooting coordination issues.
 */
export const DebugConfiguration: Story = {
  render: () => (
    <MenuCoordinationSystem
      enableDebugMode={true}
      onSystemEvent={(event) => {
        console.log('🎛️ Coordination Event:', event);
      }}
      menuProvider={{
        maxCognitiveLoad: 10, // Lower to trigger events more easily
        onLoadExceeded: (current, max) => {
          console.warn(`⚠️ Cognitive load exceeded: ${current}/${max}`);
        },
      }}
      motionCoordinator={{
        budget: {
          maxConcurrentAnimations: 2,
        },
        onBudgetExceeded: (current, max) => {
          console.warn(`⚠️ Motion budget exceeded: ${current}/${max}`);
        },
      }}
    >
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-4">Debug Configuration</h3>
        <p className="text-muted-foreground mb-6">
          Development configuration with extensive logging and lower thresholds to trigger
          coordination events. Check browser console for debug output.
        </p>

        <div className="flex gap-4 flex-wrap">
          <VariantMenu id="debug-1" label="Debug Menu" variant="debug" />
          <VariantMenu id="debug-2" label="Test Menu" variant="debug" />
          <VariantMenu id="debug-3" label="Monitor Menu" variant="debug" />
          <VariantMenu id="debug-4" label="Trigger Menu" variant="debug" />
        </div>

        <div className="mt-8 p-4 bg-warning/10 rounded border-l-4 border-warning">
          <h4 className="font-medium mb-2">Debug Features:</h4>
          <ul className="text-sm space-y-1">
            <li>• Console logging enabled for all events</li>
            <li>• Lower thresholds to trigger coordination</li>
            <li>• Visual debug indicators on menus</li>
            <li>• Budget exceeded warnings</li>
            <li>• System event monitoring</li>
          </ul>
          <p className="text-xs mt-2 text-muted-foreground">
            Open browser console and interact with menus to see debug output.
          </p>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Accessibility-focused configuration with enhanced screen reader support.
 * Optimized for assistive technology users.
 */
export const AccessibilityConfiguration: Story = {
  render: () => (
    <MenuCoordinationSystem
      focusManager={{
        announceChanges: true,
      }}
      keyboardNavigation={{
        enableTypeAhead: true,
        typeAheadDelay: 1500, // Longer delay for screen reader users
      }}
      announcements={{
        config: {
          verbosityLevel: 'verbose',
          enableSpatialAnnouncements: true,
          enableProgressAnnouncements: true,
          debounceDelay: 200, // Longer debounce
        },
      }}
      motionCoordinator={{
        budget: {
          respectReducedMotion: true,
          enableGpuAcceleration: false, // Better for some screen readers
        },
      }}
    >
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-4">Accessibility Configuration</h3>
        <p className="text-muted-foreground mb-6">
          Optimized for screen readers and assistive technology. Enhanced announcements, longer
          delays, and motion restrictions for better accessibility.
        </p>

        <div className="flex gap-4 flex-wrap">
          <VariantMenu id="a11y-1" label="Accessible Menu" />
          <VariantMenu id="a11y-2" label="Screen Reader Menu" />
          <VariantMenu id="a11y-3" label="AT Friendly Menu" />
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
          <h4 className="font-medium mb-2">Accessibility Enhancements:</h4>
          <ul className="text-sm space-y-1">
            <li>• Verbose announcements for context</li>
            <li>• Longer type-ahead delay (1.5s)</li>
            <li>• Enhanced focus change announcements</li>
            <li>• Spatial and progress announcements</li>
            <li>• Reduced motion respected</li>
            <li>• Longer announcement debouncing</li>
            <li>• GPU acceleration disabled for compatibility</li>
          </ul>
        </div>

        <div className="mt-6 p-3 bg-muted rounded text-sm">
          <p>
            <strong>Screen Reader Testing:</strong> Use NVDA, JAWS, or VoiceOver to test the
            enhanced announcements and navigation patterns.
          </p>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Performance-focused configuration for high-traffic applications.
 * Optimized for speed and resource efficiency.
 */
export const PerformanceConfiguration: Story = {
  render: () => (
    <MenuCoordinationSystem
      menuProvider={{
        maxCognitiveLoad: 12, // Balanced for performance
      }}
      motionCoordinator={{
        budget: {
          maxConcurrentAnimations: 2, // Reduced for performance
          enableGpuAcceleration: true, // Hardware acceleration
          performanceBudget: 8.33, // 120fps target
        },
      }}
      announcements={{
        config: {
          maxConcurrentAnnouncements: 1, // Single to reduce overhead
          debounceDelay: 50, // Faster debounce
          verbosityLevel: 'minimal',
        },
      }}
      keyboardNavigation={{
        enableTypeAhead: true,
        typeAheadDelay: 750, // Balanced delay
      }}
    >
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-4">Performance Configuration</h3>
        <p className="text-muted-foreground mb-6">
          Optimized for high-traffic applications requiring efficient resource usage. Balanced
          settings for speed while maintaining functionality.
        </p>

        <div className="flex gap-4 flex-wrap">
          <VariantMenu id="perf-1" label="Fast Menu" />
          <VariantMenu id="perf-2" label="Quick Menu" />
          <VariantMenu id="perf-3" label="Speedy Menu" />
          <VariantMenu id="perf-4" label="Rapid Menu" />
          <VariantMenu id="perf-5" label="Swift Menu" />
        </div>

        <div className="mt-8 p-4 bg-green-50 dark:bg-green-950/20 rounded border-l-4 border-green-500">
          <h4 className="font-medium mb-2">Performance Optimizations:</h4>
          <ul className="text-sm space-y-1">
            <li>• Reduced concurrent animation limit (2)</li>
            <li>• Hardware GPU acceleration enabled</li>
            <li>• 120fps performance target (8.33ms)</li>
            <li>• Single announcement to reduce overhead</li>
            <li>• Fast debouncing (50ms)</li>
            <li>• Minimal verbosity</li>
            <li>• Balanced cognitive load budget (12)</li>
          </ul>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};
