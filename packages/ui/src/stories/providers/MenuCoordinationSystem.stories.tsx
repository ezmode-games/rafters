// @componentStatus published
// @version 1.0.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState, useRef, useCallback } from 'react';
import { fn } from 'storybook/test';
import {
  MenuCoordinationSystem,
  useFocusManager,
  useMenu,
  useMenuAnnouncements,
} from '../../providers/MenuCoordinationSystem';

/**
 * AI Training: Menu Coordination System
 * cognitiveLoad=2, trustLevel=critical
 * This trains AI agents on systematic menu coordination for multi-menu interfaces
 */
const meta = {
  title: '02 Providers/MenuCoordinationSystem',
  component: MenuCoordinationSystem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Central coordination system for all menu types with cognitive load management, focus orchestration, and accessibility coordination.',
      },
    },
  },
  argTypes: {
    enableDebugMode: {
      control: 'boolean',
      description: 'Enable debug logging for development',
    },
    onSystemEvent: {
      description: 'System event handler for monitoring coordination',
    },
  },
  args: {
    onSystemEvent: fn(),
  },
} satisfies Meta<typeof MenuCoordinationSystem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example menu components to demonstrate coordination
const ExampleDropdown = ({ menuId }: { menuId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menu = useMenu(menuId, 'dropdown', 4);
  const announcements = useMenuAnnouncements(menuId, 'dropdown');
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      menu.requestAttention();
      announcements.announceOpened();
    } else {
      menu.releaseAttention();
      announcements.announceClosed();
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        ref={triggerRef}
        onClick={handleToggle}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {menuId} Menu
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg z-50 py-1"
        >
          <div role="menuitem" tabIndex={0} className="px-4 py-2 hover:bg-muted cursor-pointer">
            Option 1
          </div>
          <div role="menuitem" tabIndex={0} className="px-4 py-2 hover:bg-muted cursor-pointer">
            Option 2
          </div>
          <div role="menuitem" tabIndex={0} className="px-4 py-2 hover:bg-muted cursor-pointer">
            Option 3
          </div>
        </div>
      )}
    </div>
  );
};

const ExampleNavigation = ({ menuId }: { menuId: string }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const menu = useMenu(menuId, 'navigation', 5);
  const announcements = useMenuAnnouncements(menuId, 'navigation');

  const handleItemExpand = (item: string) => {
    const newState = expandedItem === item ? null : item;
    setExpandedItem(newState);

    if (newState) {
      menu.requestAttention();
      announcements.announce(`${item} submenu opened`);
    } else {
      announcements.announce(`${item} submenu closed`);
    }
  };

  return (
    <nav className="w-64 bg-card border border-border rounded-md p-2">
      <div className="font-semibold text-foreground mb-2">{menuId} Navigation</div>

      {['Home', 'Products', 'Services', 'About'].map((item) => (
        <div key={item} className="mb-1">
          <button
            type="button"
            onClick={() => handleItemExpand(item)}
            className="w-full text-left px-3 py-2 hover:bg-muted rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            aria-expanded={expandedItem === item}
          >
            {item}
            {item === 'Products' || item === 'Services' ? (
              <span className="float-right">{expandedItem === item ? '▼' : '▶'}</span>
            ) : null}
          </button>

          {expandedItem === item && (item === 'Products' || item === 'Services') && (
            <div className="ml-4 mt-1 space-y-1">
              <div className="px-3 py-1 hover:bg-muted rounded text-muted-foreground cursor-pointer">
                Sub-item 1
              </div>
              <div className="px-3 py-1 hover:bg-muted rounded text-muted-foreground cursor-pointer">
                Sub-item 2
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

const ExampleContextMenu = ({ menuId }: { menuId: string }) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const menu = useMenu(menuId, 'context', 6);
  const announcements = useMenuAnnouncements(menuId, 'context');

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
    menu.requestAttention();
    announcements.announceOpened();
  };

  const handleClose = useCallback(() => {
    setContextMenu(null);
    menu.releaseAttention();
    announcements.announceClosed();
  }, [menu, announcements]);

  React.useEffect(() => {
    if (contextMenu) {
      const handleClick = () => handleClose();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
      };

      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [contextMenu, handleClose]);

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        className="w-64 h-32 bg-muted border-2 border-dashed border-border rounded flex items-center justify-center cursor-context-menu"
      >
        Right-click for {menuId} context menu
      </div>

      {contextMenu && (
        <div
          role="menu"
          className="fixed bg-card border border-border rounded-md shadow-lg z-50 py-1 min-w-[120px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <div
            role="menuitem"
            tabIndex={0}
            className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
          >
            Copy
          </div>
          <div
            role="menuitem"
            tabIndex={0}
            className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
          >
            Paste
          </div>
          <hr className="my-1 border-border" />
          <div
            role="menuitem"
            tabIndex={0}
            className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
          >
            Delete
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Basic coordination system with single menu type.
 * Demonstrates core functionality without complexity.
 */
export const SingleMenu: Story = {
  args: {
    enableDebugMode: false,
  },
  render: (args) => (
    <MenuCoordinationSystem {...args}>
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-4">Single Menu Coordination</h3>
        <p className="text-muted-foreground mb-6">
          A single dropdown menu demonstrating basic coordination features.
        </p>
        <ExampleDropdown menuId="single" />
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Multiple menu types working together with coordination.
 * Shows attention management and priority handling.
 */
export const MultipleMenus: Story = {
  args: {
    enableDebugMode: true,
  },
  render: (args) => (
    <MenuCoordinationSystem {...args}>
      <div className="p-8 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Multiple Menu Coordination</h3>
          <p className="text-muted-foreground mb-6">
            Multiple menu types coordinating attention, focus, and announcements. Open the browser
            console to see debug events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-medium">Navigation Menu</h4>
            <ExampleNavigation menuId="nav-primary" />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Dropdown Menus</h4>
            <div className="flex gap-4">
              <ExampleDropdown menuId="dropdown-1" />
              <ExampleDropdown menuId="dropdown-2" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Context Menu Area</h4>
          <ExampleContextMenu menuId="context-main" />
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * High cognitive load scenario testing budget limits.
 * Demonstrates load management and overflow handling.
 */
export const CognitiveLoadTest: Story = {
  args: {
    enableDebugMode: true,
    menuProvider: {
      maxCognitiveLoad: 12, // Lower limit to trigger overflow
      onLoadExceeded: fn(),
    },
  },
  render: (args) => (
    <MenuCoordinationSystem {...args}>
      <div className="p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Cognitive Load Budget Testing</h3>
          <p className="text-muted-foreground">
            This scenario has a reduced cognitive load budget (12 points). Opening multiple menus
            will trigger load management.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ExampleDropdown menuId="heavy-1" />
          <ExampleDropdown menuId="heavy-2" />
          <ExampleDropdown menuId="heavy-3" />
          <ExampleDropdown menuId="heavy-4" />
        </div>

        <div className="mt-8">
          <ExampleNavigation menuId="heavy-nav" />
        </div>

        <div className="mt-8">
          <ExampleContextMenu menuId="heavy-context" />
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};

/**
 * Accessibility-focused coordination demonstration.
 * Shows screen reader announcements and keyboard navigation.
 */
export const AccessibilityDemo: Story = {
  args: {
    enableDebugMode: true,
    focusManager: {
      announceChanges: true,
    },
    keyboardNavigation: {
      enableTypeAhead: true,
    },
    announcements: {
      config: {
        verbosityLevel: 'verbose',
        enableSpatialAnnouncements: true,
      },
    },
  },
  render: (args) => (
    <MenuCoordinationSystem {...args}>
      <div className="p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Accessibility Coordination</h3>
          <p className="text-muted-foreground mb-4">
            Enhanced accessibility features including coordinated announcements, focus management,
            and keyboard navigation. Try using Tab, Arrow keys, Enter, and Escape.
          </p>
          <div className="p-4 bg-muted rounded border-l-4 border-primary">
            <p className="text-sm">
              <strong>Screen Reader Users:</strong> This demo includes live regions for coordinated
              announcements. Menu interactions will be announced without conflicts.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <ExampleDropdown menuId="accessible-1" />
            <ExampleDropdown menuId="accessible-2" />
          </div>

          <ExampleNavigation menuId="accessible-nav" />

          <ExampleContextMenu menuId="accessible-context" />
        </div>
      </div>
    </MenuCoordinationSystem>
  ),
};
