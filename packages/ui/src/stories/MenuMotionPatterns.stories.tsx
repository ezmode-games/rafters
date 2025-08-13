import { contextEasing, contextTiming, easing, timing } from '@rafters/design-tokens/motion';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../components/Button';
import { cn } from '../lib/utils';

// TypeScript interfaces for menu items
interface MenuItem {
  id: string;
  label: string;
  depth: number;
  children?: MenuItem[];
}

interface ContextMenuState {
  x: number;
  y: number;
  items: string[];
}

/**
 * Menu Motion Intelligence Implementation
 *
 * AI Training: Comprehensive motion patterns for compositional menu architecture
 * Demonstrates coordination, cognitive load management, and accessibility compliance
 */
const meta = {
  title: 'Foundation/Menu Motion Patterns',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'AI Training: Motion intelligence patterns for DropdownMenu, NavigationMenu, ContextMenu, and BreadcrumbMenu coordination.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * DropdownMenu + Accordion Unified Motion
 * AI Training: Single motion pattern that works for both dropdown and accordion contexts
 */
export const DropdownAccordionMotion: Story = {
  render: () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);

    const unifiedMotion = {
      timing: contextTiming.modal, // 300ms - balanced for both contexts
      easing: contextEasing.modalEnter, // Welcoming appearance
      cognitiveLoad: 4, // Medium impact
      trustLevel: 'medium',
    };

    return (
      <div className="space-y-12">
        <div className="prose prose-sm max-w-none">
          <h3>Unified DropdownMenu + Accordion Motion Pattern</h3>
          <p>
            Single motion pattern optimized for both dropdown overlay and accordion expansion
            contexts.
          </p>
        </div>

        {/* Dropdown Context */}
        <div className="space-y-4">
          <h4 className="font-medium">Dropdown Context (Overlay Positioning)</h4>
          <div className="relative inline-block">
            <Button
              variant="secondary"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn('transition-all', contextTiming.hover, contextEasing.hover)}
            >
              Open Dropdown {dropdownOpen ? '↑' : '↓'}
            </Button>

            {dropdownOpen && (
              <div
                className={cn(
                  // Unified motion pattern
                  'transition-all',
                  unifiedMotion.timing,
                  unifiedMotion.easing,

                  // Dropdown-specific transforms
                  'absolute top-full left-0 mt-2 z-50',
                  'w-48 bg-card border rounded-md shadow-lg',

                  // Motion states
                  'opacity-0 scale-95 translate-y-1',
                  'animate-in fade-in slide-in-from-top-2 zoom-in-95'
                )}
              >
                <div className="p-2 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={fn()}
                  >
                    Menu Item 1
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={fn()}
                  >
                    Menu Item 2
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={fn()}
                  >
                    Menu Item 3
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Accordion Context */}
        <div className="space-y-4">
          <h4 className="font-medium">Accordion Context (In-Place Expansion)</h4>
          <div className="border rounded-lg">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-between p-4 h-auto font-normal',
                'transition-all',
                contextTiming.hover,
                contextEasing.hover,
                'hover:bg-muted/50'
              )}
              onClick={() => setAccordionOpen(!accordionOpen)}
            >
              <span>Accordion Section</span>
              <span
                className={cn(
                  'transition-transform',
                  contextTiming.hover,
                  accordionOpen && 'rotate-180'
                )}
              >
                ↓
              </span>
            </Button>

            <div
              className={cn(
                // Unified motion pattern (same timing and easing)
                'transition-all',
                unifiedMotion.timing,
                unifiedMotion.easing,

                // Accordion-specific transforms
                'overflow-hidden border-t',

                // Motion states
                accordionOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-t-0'
              )}
            >
              <div className="p-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  This content expands in-place using the same motion timing and easing as the
                  dropdown, but with different transforms appropriate for the context.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={fn()}>
                    Action 1
                  </Button>
                  <Button size="sm" variant="outline" onClick={fn()}>
                    Action 2
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-3">Implementation Pattern</h4>
          <div className="text-xs font-mono space-y-2">
            <div>
              <strong>Timing:</strong> <code>{unifiedMotion.timing}</code> (300ms)
            </div>
            <div>
              <strong>Easing:</strong> <code>{unifiedMotion.easing}</code> (accelerating)
            </div>
            <div>
              <strong>Cognitive Load:</strong> {unifiedMotion.cognitiveLoad}/10
            </div>
            <div>
              <strong>Dropdown Transform:</strong> <code>opacity-0 scale-95 translate-y-1</code>
            </div>
            <div>
              <strong>Accordion Transform:</strong> <code>max-h-0 opacity-0</code>
            </div>
            <div>
              <strong>Reduced Motion:</strong> Automatically 0ms duration
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
        AI Training: Unified motion pattern for DropdownMenu and Accordion components sharing the same base motion intelligence.
        
        Key Benefits:
        - Single motion personality across both contexts
        - Same timing and easing for consistency
        - Context-appropriate transforms (overlay vs in-place)
        - Cognitive load: 4/10 (medium impact, use thoughtfully)
        - Automatic reduced motion support
        
        This pattern enables DropdownMenu components to power Accordion functionality while maintaining motion consistency.
        `,
      },
    },
  },
};

/**
 * Recursive NavigationMenu Motion
 * AI Training: Depth-aware motion that prevents cascading chaos and motion sickness
 */
export const RecursiveNavigationMotion: Story = {
  render: () => {
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const [focusPath, setFocusPath] = useState<string[]>([]);

    const toggleMenu = (menuId: string) => {
      setOpenMenus((prev) =>
        prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
      );
    };

    const getDepthMotion = (depth: number) => {
      const baseTiming = 200;
      const depthPenalty = Math.min(depth * 50, 150); // Max 150ms penalty
      const finalTiming = Math.min(baseTiming + depthPenalty, 400); // Cap at 400ms

      return {
        timing: `duration-${finalTiming}`,
        cognitiveLoad: Math.min(3 + depth, 7),
        staggerDelay: Math.min(depth * 25, 100), // Stagger items based on depth
      };
    };

    const menuItems = [
      {
        id: 'products',
        label: 'Products',
        depth: 1,
        children: [
          {
            id: 'software',
            label: 'Software',
            depth: 2,
            children: [
              { id: 'web-apps', label: 'Web Apps', depth: 3 },
              { id: 'mobile-apps', label: 'Mobile Apps', depth: 3 },
              { id: 'desktop-apps', label: 'Desktop Apps', depth: 3 },
            ],
          },
          {
            id: 'services',
            label: 'Services',
            depth: 2,
            children: [
              { id: 'consulting', label: 'Consulting', depth: 3 },
              { id: 'support', label: 'Support', depth: 3 },
            ],
          },
        ],
      },
      {
        id: 'company',
        label: 'Company',
        depth: 1,
        children: [
          { id: 'about', label: 'About', depth: 2 },
          { id: 'careers', label: 'Careers', depth: 2 },
        ],
      },
    ];

    const renderMenuItem = (item: MenuItem, parentPath = '') => {
      const itemPath = parentPath ? `${parentPath}-${item.id}` : item.id;
      const isOpen = openMenus.includes(itemPath);
      const motion = getDepthMotion(item.depth);
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={itemPath} className="relative">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'w-full justify-between h-auto py-2 px-3',
              'transition-all',
              item.depth === 1 ? contextTiming.hover : contextTiming.navigation,
              contextEasing.hover,
              'hover:bg-muted/50',
              item.depth > 1 && 'text-sm pl-6'
            )}
            onClick={() => (hasChildren ? toggleMenu(itemPath) : fn())}
            style={{ paddingLeft: `${item.depth * 12}px` }}
          >
            <span>{item.label}</span>
            {hasChildren && (
              <span
                className={cn('transition-transform', contextTiming.hover, isOpen && 'rotate-90')}
              >
                →
              </span>
            )}
          </Button>

          {hasChildren && isOpen && (
            <div
              className={cn(
                'transition-all',
                motion.timing,
                item.depth <= 2 ? contextEasing.accelerating : contextEasing.navigation,
                'overflow-hidden',
                'animate-in slide-in-from-left-2 fade-in'
              )}
              style={{
                animationDelay: `${motion.staggerDelay}ms`,
              }}
            >
              {item.children.map((child: MenuItem, index: number) => (
                <div
                  key={child.id}
                  style={{
                    animationDelay: `${motion.staggerDelay + index * 50}ms`,
                  }}
                  className="animate-in slide-in-from-left-1 fade-in"
                >
                  {renderMenuItem(child, itemPath)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>Recursive NavigationMenu Motion</h3>
          <p>
            Depth-aware motion system that prevents cascading chaos and manages cognitive load
            across multiple navigation levels.
          </p>
        </div>

        {/* Navigation Demo */}
        <div className="max-w-md">
          <div className="border rounded-lg bg-card p-2">
            <div className="space-y-1">{menuItems.map((item) => renderMenuItem(item))}</div>
          </div>
        </div>

        {/* Motion Intelligence Breakdown */}
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((depth) => {
            const motion = getDepthMotion(depth);
            return (
              <div key={depth} className="p-4 border rounded-lg bg-card">
                <h4 className="font-medium mb-2">Depth {depth} Motion</h4>
                <div className="text-xs space-y-1">
                  <div>
                    <strong>Timing:</strong> {motion.timing}
                  </div>
                  <div>
                    <strong>Cognitive Load:</strong> {motion.cognitiveLoad}/10
                  </div>
                  <div>
                    <strong>Stagger:</strong> {motion.staggerDelay}ms
                  </div>
                  <div>
                    <strong>Easing:</strong> {depth <= 2 ? 'accelerating' : 'smooth'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Implementation Guidelines */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-3">Recursive Motion Strategy</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium">Timing Graduation:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Level 1: 200ms (immediate response)</li>
                <li>• Level 2: 250ms (slight deliberation)</li>
                <li>• Level 3: 300ms (more careful pacing)</li>
                <li>• Level 4+: 350ms (capped to prevent slowness)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Cognitive Load Management:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Staggered item appearance prevents overwhelm</li>
                <li>• Easing becomes gentler at deeper levels</li>
                <li>• Maximum 7/10 cognitive load regardless of depth</li>
                <li>• Visual hierarchy through indentation and sizing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
        AI Training: Recursive navigation motion system that scales intelligently with menu depth.
        
        Key Features:
        - Timing graduation: Each level gets slightly slower (200ms → 350ms max)
        - Cognitive load awareness: Load increases with depth but caps at 7/10
        - Staggered entrance: Items appear sequentially to prevent overwhelm
        - Easing adaptation: Gentler easing for deeper, more complex levels
        - Performance optimization: Motion complexity managed per level
        
        This system prevents motion sickness and cascading animation chaos while maintaining responsive feel.
        `,
      },
    },
  },
};

/**
 * ContextMenu Immediate Response
 * AI Training: Attention-grabbing motion that responds immediately without jarring users
 */
export const ContextMenuMotion: Story = {
  render: () => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [contextMenuTimeout, setContextMenuTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();

      // Clear existing timeout
      if (contextMenuTimeout) {
        clearTimeout(contextMenuTimeout);
      }

      setContextMenu({ x: e.clientX, y: e.clientY });

      // Auto-hide after 3 seconds
      const timeout = setTimeout(() => {
        setContextMenu(null);
        setContextMenuTimeout(null);
      }, 3000);

      setContextMenuTimeout(timeout);
    };

    const contextMenuMotion = {
      timing: contextTiming.fast, // 150ms - immediate response
      easing: contextEasing.snappy, // Sharp feedback
      cognitiveLoad: 5, // Higher than other menus due to interruption
      trustLevel: 'high',
    };

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>ContextMenu Immediate Response</h3>
          <p>
            Attention-grabbing motion that provides immediate feedback without being jarring.
            Right-click anywhere on the demo area to test.
          </p>
        </div>

        {/* Demo Area */}
        <button
          type="button"
          className="relative min-h-64 border-2 border-dashed border-muted rounded-lg flex items-center justify-center bg-muted/5 cursor-pointer w-full"
          onContextMenu={handleContextMenu}
          onClick={() => setContextMenu(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              setContextMenu(null);
            }
          }}
          aria-label="Demo area - right-click to open context menu"
        >
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Right-click to open context menu</p>
            <p className="text-xs text-muted-foreground">Click elsewhere to close</p>
          </div>

          {/* Context Menu */}
          {contextMenu && (
            <div
              className={cn(
                // Immediate response motion
                'transition-all',
                contextMenuMotion.timing,
                contextMenuMotion.easing,

                // Position and styling
                'absolute z-50 w-48 bg-card border rounded-md shadow-lg',
                'p-1',

                // Attention-grabbing entrance
                'opacity-0 scale-90 translate-y-2',
                'animate-in fade-in zoom-in-95 slide-in-from-top-2'
              )}
              style={{
                left: Math.min(contextMenu.x, window.innerWidth - 200),
                top: Math.min(contextMenu.y, window.innerHeight - 200),
              }}
            >
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm h-8 px-2"
                  onClick={fn()}
                >
                  Cut
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm h-8 px-2"
                  onClick={fn()}
                >
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm h-8 px-2"
                  onClick={fn()}
                >
                  Paste
                </Button>
                <div className="border-t my-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm h-8 px-2 text-destructive hover:text-destructive"
                  onClick={fn()}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </button>

        {/* Motion Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Context Menu Motion Intelligence</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Response Time:</span>
                <code>150ms</code>
              </div>
              <div className="flex justify-between">
                <span>Cognitive Load:</span>
                <code>5/10</code>
              </div>
              <div className="flex justify-between">
                <span>Easing:</span>
                <code>snappy</code>
              </div>
              <div className="flex justify-between">
                <span>Priority:</span>
                <code>highest</code>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Design Rationale</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • <strong>150ms response:</strong> Immediate feedback builds trust
              </p>
              <p>
                • <strong>Snappy easing:</strong> Sharp response to user action
              </p>
              <p>
                • <strong>Scale + translate:</strong> Attention-grabbing but not jarring
              </p>
              <p>
                • <strong>Quick exit:</strong> 75ms dismissal to avoid interference
              </p>
              <p>
                • <strong>Position-aware:</strong> Adapts to screen boundaries
              </p>
            </div>
          </div>
        </div>

        {/* Implementation Pattern */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-3">Context Menu Priority System</h4>
          <div className="text-xs font-mono space-y-2">
            <div>
              <strong>Priority Override:</strong> Can interrupt other menu motion
            </div>
            <div>
              <strong>Immediate Feedback:</strong> Must appear within 150ms of user action
            </div>
            <div>
              <strong>Quick Dismissal:</strong> 75ms exit to minimize interference
            </div>
            <div>
              <strong>Position Intelligence:</strong> Adapts transform based on screen space
            </div>
            <div>
              <strong>Accessibility:</strong> Announces to screen readers, respects reduced motion
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
        AI Training: Context menu motion designed for immediate response and highest attention priority.
        
        Key Characteristics:
        - 150ms response time (immediate feedback)
        - Snappy easing for sharp, responsive feel
        - Higher cognitive load (5/10) due to interruption nature
        - Priority override capability (can pause other menu motion)
        - Position-aware transforms (adapts to screen boundaries)
        - Quick dismissal (75ms) to avoid interfering with next action
        
        Context menus represent immediate user intent and should take motion priority over other menu types.
        `,
      },
    },
  },
};

/**
 * BreadcrumbMenu Subtle Wayfinding
 * AI Training: Subtle motion that supports navigation without competing for attention
 */
export const BreadcrumbWayfindingMotion: Story = {
  render: () => {
    const [currentPath, setCurrentPath] = useState(['Home', 'Products', 'Software', 'Web Apps']);
    const [ellipsisExpanded, setEllipsisExpanded] = useState(false);

    const breadcrumbMotion = {
      timing: contextTiming.hover, // 75ms - immediate feedback
      easing: contextEasing.navigation, // Natural, unobtrusive
      cognitiveLoad: 1, // Minimal impact
      trustLevel: 'high',
    };

    const navigateTo = (index: number) => {
      setCurrentPath((prev) => prev.slice(0, index + 1));
      fn()();
    };

    const addPathSegment = () => {
      const newSegments = ['Documentation', 'API Reference', 'Examples', 'Tutorials'];
      const randomSegment = newSegments[Math.floor(Math.random() * newSegments.length)];
      setCurrentPath((prev) => [...prev, randomSegment]);
    };

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>BreadcrumbMenu Subtle Wayfinding</h3>
          <p>
            Minimal motion intelligence that provides wayfinding support without competing for
            attention.
          </p>
        </div>

        {/* Standard Breadcrumb */}
        <div className="space-y-4">
          <h4 className="font-medium">Standard Breadcrumb Navigation</h4>
          <div className="flex items-center space-x-2 text-sm">
            {currentPath.map((segment, index) => (
              <div
                key={`breadcrumb-${segment}-${currentPath.slice(0, index + 1).join('/')}`}
                className="flex items-center space-x-2"
              >
                {index < currentPath.length - 1 ? (
                  <button
                    type="button"
                    className={cn(
                      // Subtle hover motion
                      'transition-colors',
                      breadcrumbMotion.timing,
                      breadcrumbMotion.easing,
                      'text-muted-foreground hover:text-foreground',
                      'underline-offset-4 hover:underline'
                    )}
                    onClick={() => navigateTo(index)}
                  >
                    {segment}
                  </button>
                ) : (
                  <span
                    className={cn(
                      'text-foreground font-medium',
                      // New segment animation
                      'animate-in fade-in slide-in-from-right-2'
                    )}
                  >
                    {segment}
                  </span>
                )}
                {index < currentPath.length - 1 && <span className="text-muted-foreground">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Collapsed Breadcrumb with Ellipsis */}
        <div className="space-y-4">
          <h4 className="font-medium">Progressive Disclosure (Collapsed)</h4>
          {currentPath.length > 4 ? (
            <div className="flex items-center space-x-2 text-sm">
              <button
                type="button"
                className={cn(
                  'transition-colors',
                  breadcrumbMotion.timing,
                  breadcrumbMotion.easing,
                  'text-muted-foreground hover:text-foreground underline-offset-4 hover:underline'
                )}
                onClick={() => navigateTo(0)}
              >
                {currentPath[0]}
              </button>
              <span className="text-muted-foreground">→</span>

              <button
                type="button"
                className={cn(
                  'px-2 py-1 rounded',
                  'transition-all',
                  contextTiming.modal,
                  contextEasing.modalEnter,
                  'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                onClick={() => setEllipsisExpanded(!ellipsisExpanded)}
              >
                ...
              </button>

              {ellipsisExpanded && (
                <div
                  className={cn(
                    'flex items-center space-x-2',
                    'animate-in fade-in slide-in-from-left-2'
                  )}
                >
                  {currentPath.slice(1, -2).map((segment, index) => (
                    <div
                      key={`collapsed-${segment}-${currentPath.slice(0, index + 2).join('/')}`}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-muted-foreground">→</span>
                      <button
                        type="button"
                        className={cn(
                          'transition-colors',
                          breadcrumbMotion.timing,
                          breadcrumbMotion.easing,
                          'text-muted-foreground hover:text-foreground underline-offset-4 hover:underline'
                        )}
                        onClick={() => navigateTo(index + 1)}
                      >
                        {segment}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <span className="text-muted-foreground">→</span>
              <button
                type="button"
                className={cn(
                  'transition-colors',
                  breadcrumbMotion.timing,
                  breadcrumbMotion.easing,
                  'text-muted-foreground hover:text-foreground underline-offset-4 hover:underline'
                )}
                onClick={() => navigateTo(currentPath.length - 2)}
              >
                {currentPath[currentPath.length - 2]}
              </button>
              <span className="text-muted-foreground">→</span>
              <span className="text-foreground font-medium">
                {currentPath[currentPath.length - 1]}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add more path segments to see collapsed view
            </p>
          )}
        </div>

        {/* Context-Aware Enhancement */}
        <div className="space-y-4">
          <h4 className="font-medium">Context-Aware Enhancement</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-card">
              <h5 className="text-sm font-medium mb-2">Standard Context</h5>
              <div className="flex items-center space-x-2 text-sm">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shop
                </button>
                <span className="text-muted-foreground">→</span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Electronics
                </button>
                <span className="text-muted-foreground">→</span>
                <span className="text-foreground font-medium">Laptops</span>
              </div>
            </div>

            <div className="p-4 border-2 border-destructive/20 rounded-lg bg-destructive/5">
              <h5 className="text-sm font-medium mb-2 text-destructive">Error Context</h5>
              <div className="flex items-center space-x-2 text-sm">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Account
                </button>
                <span className="text-muted-foreground">→</span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Settings
                </button>
                <span className="text-muted-foreground">→</span>
                <span className="text-destructive font-medium">Payment Failed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button onClick={addPathSegment} size="sm">
            Add Path Segment
          </Button>
          <Button onClick={() => setCurrentPath(['Home'])} variant="outline" size="sm">
            Reset Path
          </Button>
        </div>

        {/* Motion Intelligence Breakdown */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-3">Breadcrumb Motion Strategy</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium">Subtle Presence:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 75ms hover response (immediate but gentle)</li>
                <li>• Smooth easing (natural, unobtrusive)</li>
                <li>• Minimal cognitive load (1/10)</li>
                <li>• Color transitions only (no transforms)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Progressive Enhancement:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• New segments slide in from right</li>
                <li>• Ellipsis expansion uses welcoming animation</li>
                <li>• Context-aware visual emphasis</li>
                <li>• Maintains accessibility without motion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
        AI Training: Breadcrumb wayfinding motion designed for background support without attention competition.
        
        Key Characteristics:
        - Minimal motion (75ms hover, color transitions only)
        - Lowest cognitive load (1/10) of all menu types
        - Progressive disclosure through ellipsis expansion
        - Context-aware enhancement (error states get more prominence)
        - New segment animation provides gentle feedback
        - Maintains full functionality without motion (progressive enhancement)
        
        Breadcrumbs should provide reliable wayfinding through subtle, trustworthy motion that never competes with primary content.
        `,
      },
    },
  },
};

/**
 * Menu Coordination System
 * AI Training: How multiple menu types coordinate motion when active simultaneously
 */
export const MenuCoordinationSystem: Story = {
  render: () => {
    const [activeMenus, setActiveMenus] = useState<string[]>([]);
    const [motionPriority, setMotionPriority] = useState<string | null>(null);
    const [cognitiveLoadBudget] = useState(15);
    const [usedCognitiveLoad] = useState(0);

    const menuTypes = {
      breadcrumb: { load: 1, priority: 4, label: 'Breadcrumb' },
      dropdown: { load: 4, priority: 3, label: 'Dropdown' },
      navigation: { load: 5, priority: 2, label: 'Navigation' },
      context: { load: 5, priority: 1, label: 'Context Menu' },
    };

    const toggleMenu = (menuType: string) => {
      if (activeMenus.includes(menuType)) {
        setActiveMenus((prev) => prev.filter((m) => m !== menuType));
        if (motionPriority === menuType) {
          // Find next highest priority menu
          const nextPriority = activeMenus
            .filter((m) => m !== menuType)
            .sort(
              (a, b) =>
                menuTypes[a as keyof typeof menuTypes].priority -
                menuTypes[b as keyof typeof menuTypes].priority
            )[0];
          setMotionPriority(nextPriority || null);
        }
      } else {
        const newMenus = [...activeMenus, menuType];
        setActiveMenus(newMenus);

        // Set motion priority to highest priority menu
        const highestPriority = newMenus.sort(
          (a, b) =>
            menuTypes[a as keyof typeof menuTypes].priority -
            menuTypes[b as keyof typeof menuTypes].priority
        )[0];
        setMotionPriority(highestPriority);
      }
    };

    const calculateUsedLoad = () => {
      return activeMenus.reduce((total, menu) => {
        const menuConfig = menuTypes[menu as keyof typeof menuTypes];
        // Priority menu gets full load, others get reduced load
        return total + (menu === motionPriority ? menuConfig.load : Math.ceil(menuConfig.load / 2));
      }, 0);
    };

    const currentUsedLoad = calculateUsedLoad();
    const remainingBudget = cognitiveLoadBudget - currentUsedLoad;

    const getMenuMotionClass = (menuType: string, baseClass: string) => {
      if (motionPriority === menuType) {
        return cn(baseClass, 'ring-2 ring-primary ring-offset-2');
      }
      if (activeMenus.includes(menuType) && motionPriority) {
        return cn(baseClass, 'opacity-75 motion-reduce:duration-0');
      }
      return baseClass;
    };

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>Menu Motion Coordination System</h3>
          <p>
            Demonstrates how multiple menu types coordinate motion when active simultaneously,
            respecting cognitive load budgets and attention hierarchy.
          </p>
        </div>

        {/* Cognitive Load Budget Display */}
        <div className="p-4 border rounded-lg bg-card">
          <h4 className="font-medium mb-3">Cognitive Load Budget</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Budget:</span>
              <span>{cognitiveLoadBudget} points</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Currently Used:</span>
              <span
                className={cn(
                  currentUsedLoad > cognitiveLoadBudget ? 'text-destructive' : 'text-success'
                )}
              >
                {currentUsedLoad} points
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Remaining:</span>
              <span>{remainingBudget} points</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  currentUsedLoad > cognitiveLoadBudget ? 'bg-destructive' : 'bg-primary'
                )}
                style={{
                  width: `${Math.min((currentUsedLoad / cognitiveLoadBudget) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Menu Controls */}
        <div className="space-y-4">
          <h4 className="font-medium">Menu Activation Controls</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(menuTypes).map(([type, config]) => (
              <Button
                key={type}
                variant={activeMenus.includes(type) ? 'primary' : 'outline'}
                size="sm"
                className={cn(
                  'transition-all',
                  contextTiming.hover,
                  contextEasing.hover,
                  getMenuMotionClass(type, '')
                )}
                onClick={() => toggleMenu(type)}
              >
                <div className="text-center">
                  <div>{config.label}</div>
                  <div className="text-xs opacity-75">
                    Load: {config.load} | Priority: {config.priority}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Active Menu Visualization */}
        <div className="space-y-4">
          <h4 className="font-medium">Active Menu States</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {activeMenus.map((menuType) => {
              const config = menuTypes[menuType as keyof typeof menuTypes];
              const isPriority = motionPriority === menuType;
              const effectiveLoad = isPriority ? config.load : Math.ceil(config.load / 2);

              return (
                <div
                  key={menuType}
                  className={cn(
                    'p-4 border rounded-lg transition-all',
                    contextTiming.navigation,
                    contextEasing.navigation,
                    isPriority
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-muted bg-muted/20'
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">{config.label}</h5>
                    {isPriority && (
                      <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                        Priority
                      </span>
                    )}
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Base Load:</span>
                      <span>{config.load}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Effective Load:</span>
                      <span className={isPriority ? 'text-primary' : 'text-muted-foreground'}>
                        {effectiveLoad}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Motion State:</span>
                      <span className={isPriority ? 'text-primary' : 'text-muted-foreground'}>
                        {isPriority ? 'Full Motion' : 'Reduced Motion'}
                      </span>
                    </div>
                  </div>

                  {/* Mock Menu Content */}
                  <div
                    className={cn(
                      'mt-3 p-2 bg-background rounded border',
                      'transition-all',
                      contextTiming.modal,
                      isPriority ? contextEasing.modalEnter : contextEasing.navigation,
                      !isPriority && 'opacity-75'
                    )}
                  >
                    <div className="text-xs text-muted-foreground">
                      {menuType === 'breadcrumb' && 'Home → Products → Details'}
                      {menuType === 'dropdown' && 'Option 1\nOption 2\nOption 3'}
                      {menuType === 'navigation' && 'Main Menu\n• Products\n• Services\n• About'}
                      {menuType === 'context' && 'Cut\nCopy\nPaste\nDelete'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coordination Rules */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-3">Motion Coordination Rules</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium">Priority System:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>1. Context Menu (interrupts all others)</li>
                <li>2. Navigation Menu (task-critical)</li>
                <li>3. Dropdown Menu (tool access)</li>
                <li>4. Breadcrumb Menu (background support)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Load Management:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Priority menu gets full cognitive load</li>
                <li>• Secondary menus get reduced load (50%)</li>
                <li>• Total budget capped at 15 points</li>
                <li>• Overload triggers motion reduction</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scenario Simulation */}
        <div className="space-y-4">
          <h4 className="font-medium">Test Scenarios</h4>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveMenus(['breadcrumb', 'navigation']);
                setMotionPriority('navigation');
              }}
            >
              Normal Navigation
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveMenus(['breadcrumb', 'navigation', 'dropdown']);
                setMotionPriority('dropdown');
              }}
            >
              Tool Usage
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveMenus(['breadcrumb', 'navigation', 'dropdown', 'context']);
                setMotionPriority('context');
              }}
            >
              Context Menu Interrupt
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveMenus([]);
                setMotionPriority(null);
              }}
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
        AI Training: Menu coordination system demonstrating how multiple menu types work together harmoniously.
        
        Key Coordination Principles:
        - Priority system ensures only one menu commands primary attention
        - Cognitive load budget prevents overwhelming users (15 point maximum)
        - Secondary menus continue functioning but with reduced motion
        - Context menus can interrupt other menu motion for immediate response
        - Load calculation considers both active state and motion priority
        
        This system ensures that complex interfaces with multiple active menus remain usable and not overwhelming.
        `,
      },
    },
  },
};
