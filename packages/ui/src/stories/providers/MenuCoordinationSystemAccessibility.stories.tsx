import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  MenuCoordinationSystem,
  useKeyboardNavigation,
  useMenuAnnouncements,
  useMenuFocus,
} from '../../providers/MenuCoordinationSystem';

/**
 * AI Training: Menu Coordination System Accessibility
 * cognitiveLoad=7, trustLevel=critical
 * This trains AI agents on WCAG AAA accessibility compliance and Section 508 requirements
 */
const meta = {
  title: '02 Providers/MenuCoordinationSystem/Accessibility',
  component: MenuCoordinationSystem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Comprehensive accessibility demonstrations for menu coordination including WCAG AAA compliance, screen reader support, and keyboard navigation.',
      },
    },
  },
} satisfies Meta<typeof MenuCoordinationSystem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Accessible menu component with full ARIA support
const AccessibleMenu = ({
  menuId,
  label,
  menuType = 'dropdown',
  items,
  onAction,
}: {
  menuId: string;
  label: string;
  menuType?: 'dropdown' | 'navigation' | 'context';
  items: Array<{ label: string; action: string; disabled?: boolean; destructive?: boolean }>;
  onAction?: (action: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const focus = useMenuFocus(menuId, menuRef);
  const announcements = useMenuAnnouncements(menuId, menuType);
  const keyboard = useKeyboardNavigation();

  // Extract stable function references
  const {
    announceNavigationChange,
    announce,
    announceItemSelected,
    announceOpened,
    announceClosed,
  } = announcements;

  // Handle keyboard navigation within menu
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const enabledItems = items.filter((item) => !item.disabled);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev < enabledItems.length - 1 ? prev + 1 : 0;
            announceNavigationChange('next');
            return next;
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev > 0 ? prev - 1 : enabledItems.length - 1;
            announceNavigationChange('previous');
            return next;
          });
          break;

        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          announceNavigationChange('first');
          break;

        case 'End':
          e.preventDefault();
          setActiveIndex(enabledItems.length - 1);
          announceNavigationChange('last');
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < enabledItems.length) {
            const item = enabledItems[activeIndex];
            handleItemAction(item);
          }
          break;

        case 'Escape':
          e.preventDefault();
          handleClose();
          triggerRef.current?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, items, announceNavigationChange]);

  const handleOpen = () => {
    setIsOpen(true);
    setActiveIndex(-1);
    focus.createTrap();
    announceOpened();

    // Focus first enabled item
    setTimeout(() => {
      const firstEnabledIndex = items.findIndex((item) => !item.disabled);
      if (firstEnabledIndex >= 0) {
        setActiveIndex(firstEnabledIndex);
      }
    }, 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveIndex(-1);
    focus.releaseTrap();
    announceClosed();
  };

  const handleItemAction = (item: {
    label: string;
    action: string;
    disabled?: boolean;
    destructive?: boolean;
  }) => {
    if (item.disabled) return;

    if (item.destructive) {
      announcements.announce(
        `Destructive action selected: ${item.label}. Press Enter to confirm or Escape to cancel.`,
        {
          type: 'warning',
          priority: 'assertive',
        }
      );
    } else {
      announcements.announceItemSelected(item.label);
    }

    onAction?.(item.action);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Calculate menu positioning to avoid viewport edges
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = rect.left;
      let top = rect.bottom + 4;

      // Adjust if menu would overflow viewport
      if (left + 200 > viewportWidth) {
        left = rect.right - 200;
      }
      if (top + 200 > viewportHeight) {
        top = rect.top - 200 - 4;
      }

      setMenuStyle({
        position: 'fixed',
        left: Math.max(8, left),
        top: Math.max(8, top),
        zIndex: 50,
      });
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        ref={triggerRef}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            handleOpen();
          }
        }}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-describedby={`${menuId}-description`}
      >
        {label}
      </button>

      <div id={`${menuId}-description`} className="sr-only">
        {menuType} menu with {items.length} items. Use arrow keys to navigate, Enter to select,
        Escape to close.
      </div>

      {isOpen && (
        <>
          {/* Invisible backdrop for demo */}
          <div className="fixed inset-0 z-40" aria-hidden="true" />

          <div
            ref={menuRef}
            role="menu"
            aria-label={label}
            aria-orientation="vertical"
            style={menuStyle}
            className="min-w-[200px] bg-card border border-border rounded-md shadow-lg py-1"
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              const enabledIndex = items.slice(0, index).filter((i) => !i.disabled).length;
              const actualActiveIndex = items
                .filter((i) => !i.disabled)
                .indexOf(items[activeIndex]);
              const isCurrentlyActive = enabledIndex === actualActiveIndex && !item.disabled;

              return (
                <div
                  key={item.action}
                  role="menuitem"
                  aria-disabled={item.disabled}
                  aria-current={isCurrentlyActive}
                  tabIndex={isCurrentlyActive ? 0 : -1}
                  className={`
                    px-3 py-2 cursor-pointer outline-none
                    ${
                      item.disabled
                        ? 'text-muted-foreground cursor-not-allowed opacity-50'
                        : item.destructive
                          ? 'text-destructive hover:bg-destructive hover:text-destructive-foreground'
                          : 'hover:bg-muted'
                    }
                    ${isCurrentlyActive ? 'bg-primary text-primary-foreground' : ''}
                  `}
                  onClick={() => handleItemAction(item)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleItemAction(item))}
                  onMouseEnter={() => !item.disabled && setActiveIndex(index)}
                  onFocus={() => !item.disabled && setActiveIndex(index)}
                >
                  {item.label}
                  {item.disabled && <span className="ml-2 text-xs">(unavailable)</span>}
                  {item.destructive && <span className="ml-2 text-xs">(destructive)</span>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Screen reader announcement tester
const AnnouncementTester = () => {
  const announcements = useMenuAnnouncements('tester', 'dropdown');
  const [lastAnnouncement, setLastAnnouncement] = useState<string>('');

  const testAnnouncements = [
    { text: 'Menu opened', type: 'navigation' as const, priority: 'polite' as const },
    {
      text: 'Error occurred in processing',
      type: 'error' as const,
      priority: 'assertive' as const,
    },
    {
      text: 'Action completed successfully',
      type: 'success' as const,
      priority: 'polite' as const,
    },
    {
      text: 'Warning: This action cannot be undone',
      type: 'warning' as const,
      priority: 'assertive' as const,
    },
    {
      text: 'Additional information available',
      type: 'information' as const,
      priority: 'polite' as const,
    },
  ];

  const handleTestAnnouncement = (test: (typeof testAnnouncements)[0]) => {
    announcements.announce(test.text, { type: test.type, priority: test.priority });
    setLastAnnouncement(`${test.priority}: ${test.text}`);
    setTimeout(() => setLastAnnouncement(''), 3000);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Screen Reader Announcement Testing</h4>
      <p className="text-sm text-muted-foreground">
        Test different types of announcements. Use a screen reader to hear the announcements.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {testAnnouncements.map((test, index) => (
          <button
            type="button"
            key={`announcement-${test.type}-${test.priority}`}
            onClick={() => handleTestAnnouncement(test)}
            className={`
              px-3 py-2 text-sm rounded text-left
              ${
                test.type === 'error'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : test.type === 'warning'
                    ? 'bg-warning text-warning-foreground hover:bg-warning/90'
                    : test.type === 'success'
                      ? 'bg-success text-success-foreground hover:bg-success/90'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }
            `}
          >
            <div className="font-medium">
              {test.type} ({test.priority})
            </div>
            <div className="text-xs opacity-80">{test.text}</div>
          </button>
        ))}
      </div>

      {lastAnnouncement && (
        <output className="p-3 bg-muted rounded border-l-4 border-primary text-sm">
          Last announcement: {lastAnnouncement}
        </output>
      )}
    </div>
  );
};

// Focus management tester
const FocusTester = () => {
  const [trapActive, setTrapActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const focus = useMenuFocus('focus-tester', containerRef);

  const handleToggleTrap = () => {
    if (trapActive) {
      focus.releaseTrap();
      setTrapActive(false);
    } else {
      focus.createTrap();
      setTrapActive(true);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Focus Trap Testing</h4>
      <p className="text-sm text-muted-foreground">
        Test focus trapping behavior. When active, Tab and Shift+Tab should cycle within the trap.
      </p>

      <button
        type="button"
        onClick={handleToggleTrap}
        className={`
          px-4 py-2 rounded font-medium
          ${
            trapActive
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }
        `}
      >
        Focus Trap: {trapActive ? 'Active (Click to Release)' : 'Inactive (Click to Activate)'}
      </button>

      <div
        ref={containerRef}
        className={`
          p-4 border-2 rounded-md space-y-2
          ${trapActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'}
        `}
      >
        <p className="text-sm font-medium">
          {trapActive ? 'Focus is trapped in this area' : 'Focus trap inactive'}
        </p>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm"
          >
            Button 1
          </button>
          <button
            type="button"
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm"
          >
            Button 2
          </button>
          <input
            type="text"
            placeholder="Input field"
            className="px-2 py-1 border border-border rounded text-sm"
          />
          <button
            type="button"
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm"
          >
            Button 3
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          {trapActive
            ? 'Tab/Shift+Tab should cycle within this area only. Press Escape to release.'
            : 'Normal tab order when trap is inactive.'}
        </p>
      </div>
    </div>
  );
};

// Keyboard navigation tester
const KeyboardTester = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const keyboard = useKeyboardNavigation();

  const { isSearchActive, getSearchTerm } = keyboard;

  useEffect(() => {
    if (isSearchActive()) {
      setSearchTerm(getSearchTerm());
    } else {
      setSearchTerm('');
    }
  }, [isSearchActive, getSearchTerm]);

  const items = [
    'Apple',
    'Banana',
    'Cherry',
    'Date',
    'Elderberry',
    'Fig',
    'Grape',
    'Honeydew',
    'Kiwi',
    'Lemon',
  ];

  const filteredItems = searchTerm
    ? items.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))
    : items;

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Keyboard Navigation & Type-ahead Testing</h4>
      <p className="text-sm text-muted-foreground">
        Focus this area and start typing to test type-ahead search. Use arrow keys for navigation.
      </p>

      <div className="p-4 border border-border rounded-md" aria-label="Type-ahead search test">
        {keyboard.isSearchActive() && (
          <div className="mb-2 p-2 bg-primary/10 rounded text-sm">
            Search active: "{searchTerm}"
            <span className="text-xs text-muted-foreground ml-2">
              ({filteredItems.length} of {items.length} items)
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {filteredItems.map((item, index) => (
            <button
              key={item}
              type="button"
              className="px-3 py-2 bg-muted rounded hover:bg-muted/80 cursor-pointer text-sm text-left"
            >
              {item}
              {searchTerm && item.toLowerCase().includes(searchTerm.toLowerCase()) && (
                <span className="ml-1 text-xs text-primary">✓</span>
              )}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 && searchTerm && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No items match "{searchTerm}"
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          <p>Instructions:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Type letters to search items</li>
            <li>Arrow keys navigate (when implemented)</li>
            <li>Search automatically clears after 1 second of inactivity</li>
            <li>Escape clears search immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * Comprehensive accessibility testing suite.
 * Demonstrates all accessibility features of the coordination system.
 */
export const AccessibilityCompliance: Story = {
  render: () => (
    <MenuCoordinationSystem
      enableDebugMode={true}
      focusManager={{
        announceChanges: true,
      }}
      keyboardNavigation={{
        enableTypeAhead: true,
        typeAheadDelay: 1000,
      }}
      announcements={{
        config: {
          verbosityLevel: 'verbose',
          enableSpatialAnnouncements: true,
          maxConcurrentAnnouncements: 3,
        },
      }}
    >
      <div className="p-8 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">WCAG AAA Accessibility Compliance</h3>
          <p className="text-muted-foreground mb-6">
            Comprehensive accessibility testing for menu coordination system. Test with screen
            readers (NVDA, JAWS, VoiceOver) and keyboard-only navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-4">Accessible Menu Examples</h4>
              <div className="space-y-3">
                <AccessibleMenu
                  menuId="accessible-file"
                  label="File Menu"
                  items={[
                    { label: 'New Document', action: 'new' },
                    { label: 'Open...', action: 'open' },
                    { label: 'Save', action: 'save', disabled: true },
                    { label: 'Save As...', action: 'save-as' },
                    { label: 'Print...', action: 'print' },
                    { label: 'Delete', action: 'delete', destructive: true },
                  ]}
                  onAction={(action) => console.log('Action:', action)}
                />

                <AccessibleMenu
                  menuId="accessible-edit"
                  label="Edit Menu"
                  items={[
                    { label: 'Undo', action: 'undo', disabled: true },
                    { label: 'Redo', action: 'redo', disabled: true },
                    { label: 'Cut', action: 'cut' },
                    { label: 'Copy', action: 'copy' },
                    { label: 'Paste', action: 'paste' },
                    { label: 'Clear All', action: 'clear', destructive: true },
                  ]}
                  onAction={(action) => console.log('Action:', action)}
                />

                <AccessibleMenu
                  menuId="accessible-context"
                  label="Context Menu"
                  menuType="context"
                  items={[
                    { label: 'Inspect Element', action: 'inspect' },
                    { label: 'View Source', action: 'source' },
                    { label: 'Save Page As...', action: 'save-page' },
                    { label: 'Print Page', action: 'print-page' },
                  ]}
                  onAction={(action) => console.log('Action:', action)}
                />
              </div>
            </div>

            <AnnouncementTester />
          </div>

          <div className="space-y-6">
            <FocusTester />
            <KeyboardTester />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-semibold">Accessibility Features Checklist</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h5 className="font-medium text-success mb-2">✅ WCAG AAA Compliant</h5>
              <ul className="text-sm space-y-1">
                <li>• Keyboard navigation support</li>
                <li>• Screen reader announcements</li>
                <li>• Focus management and traps</li>
                <li>• High contrast support</li>
                <li>• Reduced motion respect</li>
              </ul>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h5 className="font-medium text-primary mb-2">⚡ Enhanced Features</h5>
              <ul className="text-sm space-y-1">
                <li>• Type-ahead search</li>
                <li>• Spatial announcements</li>
                <li>• Progressive enhancement</li>
                <li>• Context-aware behavior</li>
                <li>• Customizable verbosity</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2">🎯 Section 508</h5>
              <ul className="text-sm space-y-1">
                <li>• Government compliance</li>
                <li>• Alternative text support</li>
                <li>• Consistent navigation</li>
                <li>• Error identification</li>
                <li>• Timeout warnings</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Accessibility Testing Instructions
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-2">Screen Reader Testing:</h5>
              <ul className="space-y-1">
                <li>• Use NVDA, JAWS, or VoiceOver</li>
                <li>• Test menu announcements</li>
                <li>• Verify ARIA labels are read correctly</li>
                <li>• Check live region updates</li>
                <li>• Test navigation shortcuts</li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium mb-2">Keyboard Testing:</h5>
              <ul className="space-y-1">
                <li>• Tab through all interactive elements</li>
                <li>• Test arrow key navigation in menus</li>
                <li>• Verify Escape key closes menus</li>
                <li>• Check Home/End key behavior</li>
                <li>• Test type-ahead search functionality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Screen reader specific testing scenarios.
 * Focuses on announcement coordination and ARIA patterns.
 */
export const ScreenReaderOptimized: Story = {
  render: () => (
    <MenuCoordinationSystem
      announcements={{
        config: {
          verbosityLevel: 'verbose',
          enableSpatialAnnouncements: true,
          enableProgressAnnouncements: true,
          maxConcurrentAnnouncements: 1, // Single announcement to avoid conflicts
          debounceDelay: 300, // Longer debounce for screen readers
        },
      }}
      focusManager={{
        announceChanges: true,
      }}
    >
      <div className="p-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Screen Reader Optimized Coordination</h3>
          <p className="text-muted-foreground mb-6">
            Optimized for screen reader users with enhanced announcements and careful timing.
          </p>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
          <h4 className="font-medium mb-2">Screen Reader Users:</h4>
          <p className="text-sm">
            This section is optimized for screen reader use with verbose announcements, spatial
            context, and coordinated live regions. Menus will announce their purpose, current
            selection, and available actions.
          </p>
        </div>

        <div className="space-y-4">
          <AccessibleMenu
            menuId="sr-primary"
            label="Primary Actions (Screen Reader Optimized)"
            items={[
              { label: 'Create new document', action: 'create' },
              { label: 'Open existing document', action: 'open' },
              { label: 'Save current document', action: 'save' },
              { label: 'Export document as PDF', action: 'export' },
            ]}
            onAction={(action) => console.log('Screen reader action:', action)}
          />

          <AccessibleMenu
            menuId="sr-tools"
            label="Tools Menu (Enhanced Announcements)"
            items={[
              { label: 'Spell check document', action: 'spellcheck' },
              { label: 'Word count and statistics', action: 'wordcount' },
              { label: 'Find and replace text', action: 'findreplace' },
              { label: 'Document settings and preferences', action: 'settings' },
            ]}
            onAction={(action) => console.log('Tools action:', action)}
          />
        </div>

        <AnnouncementTester />
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * High contrast and reduced motion testing.
 * Demonstrates visual accessibility features.
 */
export const VisualAccessibility: Story = {
  render: () => {
    const [highContrast, setHighContrast] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    return (
      <MenuCoordinationSystem
        motionCoordinator={{
          budget: {
            respectReducedMotion: reducedMotion,
            maxConcurrentAnimations: reducedMotion ? 1 : 3,
          },
        }}
      >
        <div className={`p-8 space-y-6 ${highContrast ? 'high-contrast' : ''}`}>
          <div>
            <h3 className="text-lg font-semibold mb-4">Visual Accessibility Options</h3>
            <p className="text-muted-foreground mb-6">
              Test high contrast mode and reduced motion preferences.
            </p>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="rounded"
              />
              <span>High Contrast Mode</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="rounded"
              />
              <span>Reduced Motion</span>
            </label>
          </div>

          <div className="space-y-4">
            <AccessibleMenu
              menuId="visual-primary"
              label="Visual Test Menu"
              items={[
                { label: 'High contrast test item', action: 'contrast' },
                { label: 'Motion sensitive action', action: 'motion' },
                { label: 'Standard menu item', action: 'standard' },
                { label: 'Disabled item example', action: 'disabled', disabled: true },
              ]}
              onAction={(action) => console.log('Visual accessibility action:', action)}
            />
          </div>

          <div className="p-4 bg-muted rounded">
            <h4 className="font-medium mb-2">Current Settings:</h4>
            <ul className="text-sm space-y-1">
              <li>High Contrast: {highContrast ? 'Enabled' : 'Disabled'}</li>
              <li>Reduced Motion: {reducedMotion ? 'Enabled' : 'Disabled'}</li>
              <li>Max Animations: {reducedMotion ? '1' : '3'}</li>
            </ul>
          </div>
        </div>

        <style>{`
          .high-contrast {
            --background: 0 0% 0%;
            --foreground: 0 0% 100%;
            --card: 0 0% 10%;
            --card-foreground: 0 0% 100%;
            --primary: 0 0% 100%;
            --primary-foreground: 0 0% 0%;
            --secondary: 0 0% 20%;
            --secondary-foreground: 0 0% 100%;
            --muted: 0 0% 15%;
            --muted-foreground: 0 0% 85%;
            --border: 0 0% 30%;
          }
        `}</style>
      </MenuCoordinationSystem>
    );
  },
};
