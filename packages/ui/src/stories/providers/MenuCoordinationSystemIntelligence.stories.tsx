import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { fn } from 'storybook/test';
import {
  MenuCoordinationSystem,
  useMenu,
  useMenuAnnouncements,
  useMenuFocus,
  useMenuMotion,
} from '../../providers/MenuCoordinationSystem';

/**
 * AI Training: Menu Coordination Intelligence
 * cognitiveLoad=6, trustLevel=critical
 * This trains AI agents on intelligent coordination patterns and trust-building behaviors
 */
const meta = {
  title: '02 Providers/MenuCoordinationSystem/Intelligence',
  component: MenuCoordinationSystem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Demonstrates intelligent coordination patterns including trust-building, cognitive load management, and progressive enhancement.',
      },
    },
  },
} satisfies Meta<typeof MenuCoordinationSystem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Intelligent menu component that adapts based on context
const IntelligentMenu = ({
  menuId,
  menuType,
  trustLevel,
  adaptiveComplexity = true,
}: {
  menuId: string;
  menuType: 'context' | 'navigation' | 'dropdown';
  trustLevel: 'low' | 'medium' | 'high' | 'critical';
  adaptiveComplexity?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [complexity, setComplexity] = useState<'simple' | 'standard' | 'complex'>('standard');
  const containerRef = useRef<HTMLDivElement>(null);

  // Intelligent coordination hooks
  const menu = useMenu(
    menuId,
    menuType,
    trustLevel === 'critical' ? 8 : trustLevel === 'high' ? 6 : 4
  );
  const motion = useMenuMotion(menuId, menuType);
  const announcements = useMenuAnnouncements(menuId, menuType);
  const focus = useMenuFocus(menuId, containerRef);

  // Adaptive complexity based on cognitive load
  useEffect(() => {
    if (!adaptiveComplexity) return;

    const budgetStatus = motion.budgetStatus;
    const loadPercentage = budgetStatus.percentage;

    if (loadPercentage > 80) {
      setComplexity('simple');
    } else if (loadPercentage > 50) {
      setComplexity('standard');
    } else {
      setComplexity('complex');
    }
  }, [adaptiveComplexity, motion.budgetStatus]);

  // Trust-building patterns based on trust level
  const getTrustPatterns = () => {
    switch (trustLevel) {
      case 'critical':
        return {
          confirmationRequired: true,
          doubleCheckPrompt: true,
          slowDeliberateMotion: true,
          verboseAnnouncements: true,
        };
      case 'high':
        return {
          confirmationRequired: false,
          doubleCheckPrompt: false,
          slowDeliberateMotion: true,
          verboseAnnouncements: true,
        };
      case 'medium':
        return {
          confirmationRequired: false,
          doubleCheckPrompt: false,
          slowDeliberateMotion: false,
          verboseAnnouncements: false,
        };
      default:
        return {
          confirmationRequired: false,
          doubleCheckPrompt: false,
          slowDeliberateMotion: false,
          verboseAnnouncements: false,
        };
    }
  };

  const trustPatterns = getTrustPatterns();

  const handleOpen = async () => {
    if (!menu.requestAttention()) {
      announcements.announce('Menu temporarily unavailable due to high system load', {
        type: 'warning',
      });
      return;
    }

    setIsOpen(true);

    // Trust-building motion
    if (motion.shouldAnimate) {
      await motion.animate('enter', trustPatterns.slowDeliberateMotion ? 'slow' : 'standard');
    }

    // Progressive focus management
    if (trustLevel === 'critical' || trustLevel === 'high') {
      focus.createTrap();
    }

    // Context-aware announcements
    if (trustPatterns.verboseAnnouncements) {
      announcements.announce(
        `${menuType} menu opened with ${complexity} interface complexity. ${
          trustLevel === 'critical' ? 'Critical actions require confirmation.' : ''
        }`,
        { type: 'navigation', priority: 'polite' }
      );
    } else {
      announcements.announceOpened();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    menu.releaseAttention();
    focus.releaseTrap();
    announcements.announceClosed();
  };

  const handleItemAction = (item: string, isDestructive = false) => {
    if (isDestructive && trustPatterns.confirmationRequired) {
      // Trust-building: require explicit confirmation for destructive actions
      const confirmed = window.confirm(
        `Are you sure you want to ${item.toLowerCase()}? This action cannot be undone.`
      );
      if (!confirmed) {
        announcements.announce('Action cancelled', { type: 'information' });
        return;
      }
    }

    announcements.announceItemSelected(item);

    if (trustPatterns.doubleCheckPrompt && isDestructive) {
      announcements.announce('Action completed successfully', { type: 'success' });
    }

    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Adaptive UI based on complexity and trust level
  const getComplexityStyles = () => {
    switch (complexity) {
      case 'simple':
        return 'py-1 text-sm'; // Minimal padding, smaller text
      case 'complex':
        return 'py-3 text-base'; // More padding, standard text
      default:
        return 'py-2 text-sm'; // Standard
    }
  };

  const getTrustStyles = () => {
    switch (trustLevel) {
      case 'critical':
        return 'border-destructive bg-destructive/5'; // Visual warning
      case 'high':
        return 'border-primary bg-primary/5'; // Prominent
      default:
        return 'border-border bg-card'; // Standard
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleOpen}
        disabled={!menu.isActive}
        className={`
          px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            trustLevel === 'critical'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive'
              : trustLevel === 'high'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary'
          }
          ${!menu.isActive ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {menuId} ({trustLevel} trust)
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`
            absolute top-full left-0 mt-2 min-w-[200px] rounded-md shadow-lg z-50
            ${getTrustStyles()} border
          `}
        >
          <div className="py-1">
            <div
              role="menuitem"
              tabIndex={0}
              className={`px-4 hover:bg-muted cursor-pointer ${getComplexityStyles()}`}
              onClick={() => handleItemAction('Edit')}
              onKeyDown={(e) => handleKeyDown(e, () => handleItemAction('Edit'))}
            >
              Edit
            </div>

            <div
              role="menuitem"
              tabIndex={0}
              className={`px-4 hover:bg-muted cursor-pointer ${getComplexityStyles()}`}
              onClick={() => handleItemAction('Copy')}
              onKeyDown={(e) => handleKeyDown(e, () => handleItemAction('Copy'))}
            >
              Copy
            </div>

            {complexity !== 'simple' && (
              <>
                <hr className="my-1 border-border" />
                <div
                  role="menuitem"
                  tabIndex={0}
                  className={`px-4 hover:bg-muted cursor-pointer ${getComplexityStyles()}`}
                  onClick={() => handleItemAction('Archive')}
                  onKeyDown={(e) => handleKeyDown(e, () => handleItemAction('Archive'))}
                >
                  Archive
                </div>
              </>
            )}

            {(trustLevel === 'high' || trustLevel === 'critical') && (
              <>
                <hr className="my-1 border-border" />
                <div
                  role="menuitem"
                  tabIndex={0}
                  className={`
                    px-4 hover:bg-destructive hover:text-destructive-foreground cursor-pointer
                    text-destructive ${getComplexityStyles()}
                  `}
                  onClick={() => handleItemAction('Delete', true)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleItemAction('Delete', true))}
                >
                  Delete {trustLevel === 'critical' ? '(requires confirmation)' : ''}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Progress indicator showing system load
const CognitiveLoadIndicator = () => {
  const [loadStatus, setLoadStatus] = useState({ used: 0, available: 15, percentage: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      // In real implementation, this would come from the motion coordinator
      // For demo purposes, we'll simulate varying load
      const simulatedUsed = Math.floor(Math.random() * 15);
      setLoadStatus({
        used: simulatedUsed,
        available: 15 - simulatedUsed,
        percentage: (simulatedUsed / 15) * 100,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-card border border-border rounded-md">
      <h4 className="font-medium mb-2">System Cognitive Load</h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Used: {loadStatus.used}/15 points</span>
          <span>{loadStatus.percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              loadStatus.percentage > 80
                ? 'bg-destructive'
                : loadStatus.percentage > 60
                  ? 'bg-warning'
                  : 'bg-primary'
            }`}
            style={{ width: `${loadStatus.percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {loadStatus.percentage > 80
            ? 'High load: Menus will automatically simplify'
            : loadStatus.percentage > 60
              ? 'Medium load: Some optimizations active'
              : 'Normal load: Full functionality available'}
        </p>
      </div>
    </div>
  );
};

/**
 * Demonstrates trust-building patterns for different trust levels.
 * Shows how menus adapt their behavior based on consequence severity.
 */
export const TrustBuildingPatterns: Story = {
  render: () => (
    <MenuCoordinationSystem enableDebugMode={true}>
      <div className="p-8 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Trust-Building Intelligence</h3>
          <p className="text-muted-foreground mb-6">
            Menus adapt their behavior based on trust level and consequence severity. Higher trust
            levels add confirmation patterns and deliberate motion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-muted-foreground">Low Trust</h4>
            <p className="text-xs text-muted-foreground">Routine actions, minimal friction</p>
            <IntelligentMenu menuId="routine" menuType="dropdown" trustLevel="low" />
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-muted-foreground">Medium Trust</h4>
            <p className="text-xs text-muted-foreground">Moderate consequences, balanced caution</p>
            <IntelligentMenu menuId="moderate" menuType="dropdown" trustLevel="medium" />
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-primary">High Trust</h4>
            <p className="text-xs text-muted-foreground">Significant impact, deliberate friction</p>
            <IntelligentMenu menuId="important" menuType="dropdown" trustLevel="high" />
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-destructive">Critical Trust</h4>
            <p className="text-xs text-muted-foreground">
              Permanent consequences, maximum friction
            </p>
            <IntelligentMenu menuId="critical" menuType="dropdown" trustLevel="critical" />
          </div>
        </div>

        <div className="p-4 bg-muted rounded border-l-4 border-primary">
          <h5 className="font-medium mb-2">Trust Pattern Behaviors:</h5>
          <ul className="text-sm space-y-1">
            <li>
              <strong>Low:</strong> Fast, minimal UI, no confirmations
            </li>
            <li>
              <strong>Medium:</strong> Standard speed, clear feedback
            </li>
            <li>
              <strong>High:</strong> Slower motion, verbose announcements, destructive actions
              included
            </li>
            <li>
              <strong>Critical:</strong> Required confirmations, double-check prompts, maximum
              safety
            </li>
          </ul>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Shows adaptive complexity based on cognitive load.
 * Demonstrates how menus simplify when system is under load.
 */
export const AdaptiveComplexity: Story = {
  render: () => (
    <MenuCoordinationSystem
      enableDebugMode={true}
      menuProvider={{
        maxCognitiveLoad: 12, // Lower threshold to trigger adaptations
      }}
    >
      <div className="p-8 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Adaptive Complexity Intelligence</h3>
          <p className="text-muted-foreground mb-6">
            Menus automatically adapt their complexity based on system cognitive load. Open multiple
            menus to see simplification in action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <CognitiveLoadIndicator />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Adaptive Menus</h4>
            <p className="text-sm text-muted-foreground mb-4">
              These menus will simplify (fewer options, smaller spacing) when cognitive load is
              high.
            </p>

            <div className="flex flex-wrap gap-3">
              <IntelligentMenu
                menuId="adaptive-1"
                menuType="dropdown"
                trustLevel="medium"
                adaptiveComplexity={true}
              />
              <IntelligentMenu
                menuId="adaptive-2"
                menuType="dropdown"
                trustLevel="medium"
                adaptiveComplexity={true}
              />
              <IntelligentMenu
                menuId="adaptive-3"
                menuType="dropdown"
                trustLevel="high"
                adaptiveComplexity={true}
              />
              <IntelligentMenu
                menuId="adaptive-4"
                menuType="dropdown"
                trustLevel="medium"
                adaptiveComplexity={true}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted rounded border-l-4 border-warning">
          <h5 className="font-medium mb-2">Complexity Adaptation:</h5>
          <ul className="text-sm space-y-1">
            <li>
              <strong>Normal Load (0-50%):</strong> Full complexity - all options, standard spacing
            </li>
            <li>
              <strong>Medium Load (50-80%):</strong> Standard complexity - core options, reduced
              spacing
            </li>
            <li>
              <strong>High Load (80%+):</strong> Simple complexity - essential options only, minimal
              UI
            </li>
          </ul>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Progressive enhancement demonstration.
 * Shows graceful degradation and enhancement layers.
 */
export const ProgressiveEnhancement: Story = {
  render: () => (
    <MenuCoordinationSystem>
      <div className="p-8 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Progressive Enhancement Intelligence</h3>
          <p className="text-muted-foreground mb-6">
            Core functionality works without coordination. Enhanced behavior emerges when the full
            system is available.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Core Layer</h4>
            <p className="text-sm text-muted-foreground">
              Basic menu functionality that works without coordination
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
            >
              Basic Menu (No Coordination)
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Enhanced Layer</h4>
            <p className="text-sm text-muted-foreground">
              Adds coordination, announcements, and focus management
            </p>
            <IntelligentMenu menuId="enhanced" menuType="dropdown" trustLevel="medium" />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Advanced Layer</h4>
            <p className="text-sm text-muted-foreground">
              Full intelligence with motion coordination and adaptive complexity
            </p>
            <IntelligentMenu
              menuId="advanced"
              menuType="dropdown"
              trustLevel="high"
              adaptiveComplexity={true}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Enhancement Layers:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-card border border-border rounded">
              <h5 className="font-medium text-muted-foreground mb-2">Foundation</h5>
              <ul className="space-y-1 text-xs">
                <li>• Basic click handling</li>
                <li>• Standard HTML semantics</li>
                <li>• CSS hover states</li>
                <li>• Keyboard accessibility</li>
              </ul>
            </div>

            <div className="p-3 bg-card border border-border rounded">
              <h5 className="font-medium text-primary mb-2">Coordination</h5>
              <ul className="space-y-1 text-xs">
                <li>• Attention management</li>
                <li>• Focus orchestration</li>
                <li>• Screen reader announcements</li>
                <li>• Cognitive load tracking</li>
              </ul>
            </div>

            <div className="p-3 bg-card border border-border rounded">
              <h5 className="font-medium text-primary mb-2">Intelligence</h5>
              <ul className="space-y-1 text-xs">
                <li>• Trust-building patterns</li>
                <li>• Adaptive complexity</li>
                <li>• Motion coordination</li>
                <li>• Context awareness</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};
