// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { BarChart3, FileText, HelpCircle, Home, Search, Settings, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
  SidebarTitle,
} from '../../../components/Sidebar';

/**
 * AI Training: Sidebar Accessibility Compliance
 * Demonstrates WCAG AAA compliance, keyboard navigation, and screen reader optimization
 * Teaches AI agents systematic accessibility implementation for navigation systems
 */
const meta = {
  title: '03 Components/Navigation/Sidebar/Accessibility',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Accessibility compliance patterns for sidebar navigation including WCAG AAA requirements, keyboard navigation, and screen reader optimization.',
      },
    },
  },
  args: {
    onNavigate: fn(),
    onCollapsedChange: fn(),
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * WCAG AAA compliance demonstration with proper ARIA landmarks, semantic HTML,
 * and screen reader optimization for navigation accessibility.
 */
export const WCAGCompliance: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar
          {...args}
          currentPath="/users"
          className="border-r"
          ariaLabel="Main application navigation"
          landmark={true}
          skipLinkTarget="#main-content"
        >
          <SidebarHeader>
            <SidebarTitle level={2}>Application Menu</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Primary Features</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem
                  href="/dashboard"
                  icon={<Home />}
                  aria-label="Go to dashboard overview"
                >
                  Dashboard
                </SidebarItem>
                <SidebarItem
                  href="/users"
                  icon={<Users />}
                  active
                  aria-label="User management - currently selected"
                  aria-current="page"
                >
                  Users
                </SidebarItem>
                <SidebarItem
                  href="/analytics"
                  icon={<BarChart3 />}
                  aria-label="View analytics and reports"
                >
                  Analytics
                </SidebarItem>
                <SidebarItem
                  href="/documents"
                  icon={<FileText />}
                  aria-label="Access document library"
                >
                  Documents
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Tools & Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem
                  href="/search"
                  icon={<Search />}
                  aria-label="Search across all content"
                >
                  Search
                </SidebarItem>
                <SidebarItem
                  href="/settings"
                  icon={<Settings />}
                  aria-label="Configure application settings"
                >
                  Settings
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem
              href="/help"
              icon={<HelpCircle />}
              variant="secondary"
              aria-label="Get help and support information"
            >
              Help
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main id="main-content" className="flex-1 p-6 overflow-auto" aria-label="Main content area">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">WCAG AAA Compliance</h1>
              <p className="text-muted-foreground">
                This navigation implements full WCAG AAA compliance with proper ARIA landmarks,
                semantic HTML, and screen reader optimization.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">ARIA Landmarks</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Navigation landmark with descriptive label</li>
                  <li>• Main content region clearly identified</li>
                  <li>• Skip link for keyboard users</li>
                  <li>• Current page indication with aria-current</li>
                </ul>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Semantic Structure</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Proper heading hierarchy (h2 for sidebar title)</li>
                  <li>• Group labels with heading semantics</li>
                  <li>• Descriptive link text and aria-labels</li>
                  <li>• Meaningful focus indicators</li>
                </ul>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Screen Reader Support</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Descriptive aria-labels for context</li>
                  <li>• Current page clearly announced</li>
                  <li>• Group structure communicated</li>
                  <li>• State changes announced appropriately</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'WCAG AAA compliance with proper ARIA landmarks, semantic HTML structure, and comprehensive screen reader support for navigation accessibility.',
      },
    },
  },
};

/**
 * Keyboard navigation patterns with arrow key support, tab management,
 * and focus trapping for comprehensive keyboard accessibility.
 */
export const KeyboardNavigation: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar
          {...args}
          currentPath="/analytics"
          className="border-r"
          ariaLabel="Keyboard navigation demo"
        >
          <SidebarHeader>
            <SidebarTitle>Keyboard Demo</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation Items</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/dashboard" icon={<Home />} tabIndex={0}>
                  Dashboard
                </SidebarItem>
                <SidebarItem href="/users" icon={<Users />} tabIndex={0}>
                  Users
                </SidebarItem>
                <SidebarItem href="/analytics" icon={<BarChart3 />} active tabIndex={0}>
                  Analytics
                </SidebarItem>
                <SidebarItem href="/documents" icon={<FileText />} tabIndex={0}>
                  Documents
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Nested Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/projects" icon={<FileText />} level={0} tabIndex={0}>
                  Projects
                </SidebarItem>
                <SidebarItem href="/projects/web" level={1} tabIndex={0}>
                  Web Application
                </SidebarItem>
                <SidebarItem href="/projects/mobile" level={1} tabIndex={0}>
                  Mobile App
                </SidebarItem>
                <SidebarItem href="/settings" icon={<Settings />} level={0} tabIndex={0}>
                  Settings
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem href="/help" icon={<HelpCircle />} variant="secondary" tabIndex={0}>
              Help
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Keyboard Navigation</h1>
              <p className="text-muted-foreground">
                Full keyboard accessibility with arrow key navigation, proper tab order, and clear
                focus indicators.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> - Move between
                    navigation items
                  </li>
                  <li>
                    • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑↓</kbd> - Navigate
                    within sidebar sections
                  </li>
                  <li>
                    • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> - Activate
                    navigation item
                  </li>
                  <li>
                    • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> - Toggle
                    collapsible groups
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Focus Management</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Visible focus indicators on all interactive elements</li>
                  <li>• Logical tab order following visual hierarchy</li>
                  <li>• Focus restoration after state changes</li>
                  <li>• Skip links for efficient navigation</li>
                </ul>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Arrow Key Navigation</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Up/Down arrows move through navigation items</li>
                  <li>• Home/End keys jump to first/last items</li>
                  <li>• Left/Right arrows control group expansion</li>
                  <li>• Consistent behavior across all sections</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive keyboard navigation with arrow key support, logical tab order, and clear focus management for accessible sidebar interaction.',
      },
    },
  },
};

/**
 * Screen reader optimization with proper announcements, role attributes,
 * and context information for assistive technology compatibility.
 */
export const ScreenReaderOptimization: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar
          {...args}
          currentPath="/dashboard"
          className="border-r"
          ariaLabel="Main navigation menu with 8 items across 2 sections"
        >
          <SidebarHeader>
            <SidebarTitle level={2}>Application Navigation</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel id="primary-group">Primary Features</SidebarGroupLabel>
              <SidebarGroupContent aria-labelledby="primary-group">
                <SidebarItem
                  href="/dashboard"
                  icon={<Home />}
                  active
                  aria-describedby="dashboard-desc"
                >
                  Dashboard
                  <span id="dashboard-desc" className="sr-only">
                    Main overview page with key metrics and recent activity
                  </span>
                </SidebarItem>
                <SidebarItem href="/users" icon={<Users />} aria-describedby="users-desc">
                  Users
                  <span id="users-desc" className="sr-only">
                    Manage user accounts, permissions, and profile information
                  </span>
                </SidebarItem>
                <SidebarItem
                  href="/analytics"
                  icon={<BarChart3 />}
                  aria-describedby="analytics-desc"
                >
                  Analytics
                  <span id="analytics-desc" className="sr-only">
                    View detailed reports and performance metrics
                  </span>
                </SidebarItem>
                <SidebarItem
                  href="/documents"
                  icon={<FileText />}
                  aria-describedby="documents-desc"
                >
                  Documents
                  <span id="documents-desc" className="sr-only">
                    Access and manage document library and file uploads
                  </span>
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel id="admin-group">Administration</SidebarGroupLabel>
              <SidebarGroupContent aria-labelledby="admin-group">
                <SidebarItem href="/settings" icon={<Settings />} aria-describedby="settings-desc">
                  Settings
                  <span id="settings-desc" className="sr-only">
                    Configure application preferences and system options
                  </span>
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem
              href="/help"
              icon={<HelpCircle />}
              variant="secondary"
              aria-describedby="help-desc"
            >
              Help
              <span id="help-desc" className="sr-only">
                Access documentation, tutorials, and support resources
              </span>
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Screen Reader Optimization</h1>
              <p className="text-muted-foreground">
                Enhanced screen reader support with descriptive labels, context information, and
                proper role attributes.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Descriptive Content</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Detailed aria-labels provide full context</li>
                  <li>• Hidden descriptions explain each section's purpose</li>
                  <li>• Group relationships clearly established</li>
                  <li>• Current page status announced clearly</li>
                </ul>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Role Attributes</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Navigation landmark for main sidebar</li>
                  <li>• Group roles for logical sections</li>
                  <li>• Proper heading hierarchy for structure</li>
                  <li>• Link roles with descriptive context</li>
                </ul>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Announcement Patterns</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• State changes announced appropriately</li>
                  <li>• Navigation context provided on entry</li>
                  <li>• Group membership clearly indicated</li>
                  <li>• Action outcomes confirmed</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Screen reader optimization with descriptive labels, context information, and proper role attributes for comprehensive assistive technology support.',
      },
    },
  },
};

/**
 * High contrast and motion sensitivity support for users with visual
 * processing differences and vestibular disorders.
 */
export const MotionAndContrast: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar
          {...args}
          currentPath="/settings"
          className="border-r"
          reduceMotion={true}
          ariaLabel="Accessibility optimized navigation"
        >
          <SidebarHeader>
            <SidebarTitle>Accessible Nav</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Core Features</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem
                  href="/dashboard"
                  icon={<Home />}
                  className="focus-visible:ring-4 focus-visible:ring-primary/50"
                >
                  Dashboard
                </SidebarItem>
                <SidebarItem
                  href="/users"
                  icon={<Users />}
                  className="focus-visible:ring-4 focus-visible:ring-primary/50"
                >
                  Users
                </SidebarItem>
                <SidebarItem
                  href="/analytics"
                  icon={<BarChart3 />}
                  className="focus-visible:ring-4 focus-visible:ring-primary/50"
                >
                  Analytics
                </SidebarItem>
                <SidebarItem
                  href="/settings"
                  icon={<Settings />}
                  active
                  className="focus-visible:ring-4 focus-visible:ring-primary/50"
                >
                  Settings
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Accessibility Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem
                  href="/accessibility"
                  icon={<HelpCircle />}
                  className="focus-visible:ring-4 focus-visible:ring-primary/50"
                >
                  Accessibility Settings
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem
              href="/help"
              icon={<HelpCircle />}
              variant="secondary"
              className="focus-visible:ring-4 focus-visible:ring-primary/50"
            >
              Help
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Motion & Contrast Support</h1>
              <p className="text-muted-foreground">
                Accessibility enhancements for users with motion sensitivity and visual processing
                differences.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Reduced Motion</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Animations disabled for vestibular safety</li>
                  <li>• Static state transitions for stability</li>
                  <li>• Immediate feedback without motion</li>
                  <li>• Respects prefers-reduced-motion preference</li>
                </ul>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Enhanced Focus Indicators</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• High contrast focus rings for visibility</li>
                  <li>• Larger focus areas for motor accessibility</li>
                  <li>• Clear visual distinction from content</li>
                  <li>• Consistent across all interactive elements</li>
                </ul>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Color Independence</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Information not conveyed by color alone</li>
                  <li>• Pattern and text alternatives provided</li>
                  <li>• High contrast ratios maintained</li>
                  <li>• Compatible with color blindness</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Motion sensitivity and high contrast support for users with visual processing differences and vestibular disorders.',
      },
    },
  },
};
