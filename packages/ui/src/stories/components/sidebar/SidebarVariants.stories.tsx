// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { BarChart3, FileText, HelpCircle, Home, Settings, Users } from 'lucide-react';
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
 * AI Training: Sidebar Visual Variants
 * Demonstrates semantic visual styling variants for different navigation contexts
 * Teaches AI agents appropriate variant selection for use case requirements
 */
const meta = {
  title: '03 Components/Navigation/Sidebar/Variants',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Visual variants for sidebar navigation covering different application contexts and visual treatments.',
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
 * Default sidebar variant for standard application layouts with border treatment
 * and integrated positioning within the application shell.
 */
export const Default: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar {...args} variant="default" currentPath="/dashboard" className="border-r">
          <SidebarHeader>
            <SidebarTitle>Default Layout</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/dashboard" icon={<Home />} active>
                  Dashboard
                </SidebarItem>
                <SidebarItem href="/users" icon={<Users />}>
                  Users
                </SidebarItem>
                <SidebarItem href="/analytics" icon={<BarChart3 />}>
                  Analytics
                </SidebarItem>
                <SidebarItem href="/documents" icon={<FileText />}>
                  Documents
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem href="/settings" icon={<Settings />} variant="secondary">
              Settings
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Default Variant</h1>
            <p className="text-muted-foreground">
              Standard sidebar with border treatment, integrated into the application layout. Best
              for dashboard and admin interfaces.
            </p>
          </div>
        </main>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default sidebar variant with standard border treatment, ideal for integrated application layouts and dashboard interfaces.',
      },
    },
  },
};

/**
 * Floating sidebar variant with elevated shadow treatment for layered interfaces
 * and dashboard widgets that need visual separation from content.
 */
export const Floating: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20 p-4">
        <Sidebar {...args} variant="floating" currentPath="/analytics" className="mr-4">
          <SidebarHeader>
            <SidebarTitle>Floating Panel</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/analytics" icon={<BarChart3 />} active>
                  Overview
                </SidebarItem>
                <SidebarItem href="/analytics/users" icon={<Users />}>
                  User Metrics
                </SidebarItem>
                <SidebarItem href="/analytics/content" icon={<FileText />}>
                  Content Stats
                </SidebarItem>
                <SidebarItem href="/analytics/performance" icon={<Settings />}>
                  Performance
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem href="/help" icon={<HelpCircle />} variant="secondary">
              Help
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 bg-background rounded-lg p-6 overflow-auto">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Floating Variant</h1>
            <p className="text-muted-foreground mb-6">
              Elevated sidebar with shadow treatment and rounded corners. Creates visual separation
              ideal for dashboard widgets and layered interfaces.
            </p>

            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Visual Hierarchy</h3>
                <p className="text-sm text-muted-foreground">
                  The floating treatment creates depth through shadow and border radius, making the
                  navigation feel like a distinct component.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Use Cases</h3>
                <p className="text-sm text-muted-foreground">
                  Perfect for analytics dashboards, widget-based layouts, and interfaces where the
                  sidebar should feel like a modular component.
                </p>
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
          'Floating sidebar variant with elevated shadow treatment and rounded borders, ideal for dashboard widgets and layered interface designs.',
      },
    },
  },
};

/**
 * Overlay sidebar variant for mobile-first responsive interfaces that slide
 * over content with backdrop and high z-index positioning.
 */
export const Overlay: Story = {
  render: (args) => {
    return (
      <div className="relative h-screen bg-muted/20">
        {/* Main content */}
        <main className="h-full p-6 overflow-auto">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Overlay Variant Demo</h1>
            <p className="text-muted-foreground mb-6">
              The overlay sidebar appears above content with backdrop blur and high z-index. Perfect
              for mobile responsive navigation and temporary access patterns.
            </p>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Mobile-First Design</h3>
                <p className="text-sm text-muted-foreground">
                  Overlay pattern conserves screen space on mobile while providing full navigation
                  access when needed.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Backdrop Treatment</h3>
                <p className="text-sm text-muted-foreground">
                  Background blur and overlay ensure navigation has visual prominence while
                  maintaining content context.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Responsive Behavior</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically adapts from overlay on mobile to standard layout on larger screens
                  with CSS breakpoint intelligence.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Overlay sidebar */}
        <Sidebar {...args} variant="overlay" position="left" currentPath="/mobile">
          <SidebarHeader>
            <SidebarTitle>Mobile Nav</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/mobile" icon={<Home />} active>
                  Home
                </SidebarItem>
                <SidebarItem href="/mobile/profile" icon={<Users />}>
                  Profile
                </SidebarItem>
                <SidebarItem href="/mobile/activity" icon={<BarChart3 />}>
                  Activity
                </SidebarItem>
                <SidebarItem href="/mobile/documents" icon={<FileText />}>
                  Files
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem href="/mobile/settings" icon={<Settings />} variant="secondary">
              Settings
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Overlay sidebar variant that appears above content with backdrop blur. Ideal for mobile-responsive navigation and temporary access patterns.',
      },
    },
  },
};

/**
 * Collapsed sidebar state showing icon-only navigation with tooltip support
 * for space-constrained interfaces that need persistent wayfinding.
 */
export const Collapsed: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar {...args} collapsed={true} currentPath="/dashboard" className="border-r">
          <SidebarHeader showToggle={true}>
            <SidebarTitle>App</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/dashboard" icon={<Home />} active showTooltip>
                  Dashboard
                </SidebarItem>
                <SidebarItem href="/users" icon={<Users />} showTooltip>
                  Users
                </SidebarItem>
                <SidebarItem href="/analytics" icon={<BarChart3 />} showTooltip>
                  Analytics
                </SidebarItem>
                <SidebarItem href="/documents" icon={<FileText />} showTooltip>
                  Documents
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem href="/settings" icon={<Settings />} variant="secondary" showTooltip>
              Settings
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Collapsed State</h1>
            <p className="text-muted-foreground mb-6">
              Icon-only navigation preserves wayfinding while maximizing content space. Tooltips
              provide context on hover for accessibility.
            </p>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Space Efficiency</h3>
                <p className="text-sm text-muted-foreground">
                  Collapsed state reduces sidebar width to minimum while maintaining all navigation
                  functionality through icons.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Tooltip Enhancement</h3>
                <p className="text-sm text-muted-foreground">
                  Hover tooltips reveal full navigation labels, ensuring accessibility and context
                  preservation in the collapsed state.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Toggle Behavior</h3>
                <p className="text-sm text-muted-foreground">
                  Users can expand/collapse the sidebar with the toggle button, with state
                  persistence across sessions.
                </p>
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
          'Collapsed sidebar state with icon-only navigation and tooltip support. Maximizes content space while preserving wayfinding functionality.',
      },
    },
  },
};
