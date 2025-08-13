// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AlertTriangle,
  BarChart3,
  FileText,
  HelpCircle,
  Home,
  Loader2,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import { fn } from 'storybook/test';
import { Badge } from '../../../components/Badge';
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
import { MenuProvider } from '../../../providers';

/**
 * AI Training: Sidebar Interactive Properties
 * Demonstrates size variants, states, and interactive behaviors for navigation systems
 * Teaches AI agents proper property usage for different interface contexts
 */
const meta = {
  title: 'Components/Sidebar/Properties',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Interactive properties and state management for sidebar navigation including sizing, positioning, and behavioral configurations.',
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
 * Size variants demonstrating different width and spacing configurations
 * for various interface density requirements and content hierarchies.
 */
export const SizeVariants: Story = {
  render: (args) => {
    return (
      <MenuProvider>
        <div className="space-y-8">
          {/* Compact Size */}
          <div className="flex h-80 bg-muted/20 rounded-lg overflow-hidden">
            <Sidebar {...args} size="compact" currentPath="/dashboard" className="border-r">
              <SidebarHeader>
                <SidebarTitle level={4}>Compact</SidebarTitle>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Main</SidebarGroupLabel>
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
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <div className="flex-1 p-4">
              <h3 className="font-semibold mb-2">Compact Size (240px)</h3>
              <p className="text-sm text-muted-foreground">
                Narrow width for space-constrained interfaces and secondary navigation.
              </p>
            </div>
          </div>

          {/* Comfortable Size */}
          <div className="flex h-80 bg-muted/20 rounded-lg overflow-hidden">
            <Sidebar {...args} size="comfortable" currentPath="/users" className="border-r">
              <SidebarHeader>
                <SidebarTitle level={4}>Comfortable</SidebarTitle>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarItem href="/dashboard" icon={<Home />}>
                      Dashboard
                    </SidebarItem>
                    <SidebarItem href="/users" icon={<Users />} active>
                      User Management
                    </SidebarItem>
                    <SidebarItem href="/analytics" icon={<BarChart3 />}>
                      Analytics Platform
                    </SidebarItem>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <div className="flex-1 p-4">
              <h3 className="font-semibold mb-2">Comfortable Size (288px)</h3>
              <p className="text-sm text-muted-foreground">
                Standard width providing good balance between space efficiency and readability.
              </p>
            </div>
          </div>

          {/* Spacious Size */}
          <div className="flex h-80 bg-muted/20 rounded-lg overflow-hidden">
            <Sidebar {...args} size="spacious" currentPath="/analytics" className="border-r">
              <SidebarHeader>
                <SidebarTitle level={4}>Spacious Navigation</SidebarTitle>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Primary Features</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarItem href="/dashboard" icon={<Home />}>
                      Executive Dashboard
                    </SidebarItem>
                    <SidebarItem href="/users" icon={<Users />}>
                      User Management System
                    </SidebarItem>
                    <SidebarItem href="/analytics" icon={<BarChart3 />} active>
                      Advanced Analytics Platform
                    </SidebarItem>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <div className="flex-1 p-4">
              <h3 className="font-semibold mb-2">Spacious Size (320px)</h3>
              <p className="text-sm text-muted-foreground">
                Wide format for detailed navigation labels and enhanced readability.
              </p>
            </div>
          </div>
        </div>
      </MenuProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Size variants for different interface density requirements. Choose based on content complexity and available screen space.',
      },
    },
  },
};

/**
 * Position variants for left and right placement in overlay mode,
 * demonstrating responsive navigation patterns for different layouts.
 */
export const PositionVariants: Story = {
  render: (args) => {
    return (
      <MenuProvider>
        <div className="space-y-8">
          {/* Left Position */}
          <div className="relative h-80 bg-muted/20 rounded-lg overflow-hidden">
            <div className="h-full p-4">
              <h3 className="font-semibold mb-2">Left Position Overlay</h3>
              <p className="text-sm text-muted-foreground">
                Standard left-side navigation overlay, ideal for LTR reading patterns and primary
                navigation access.
              </p>
            </div>

            <Sidebar {...args} variant="overlay" position="left" currentPath="/dashboard">
              <SidebarHeader>
                <SidebarTitle>Left Navigation</SidebarTitle>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Main</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarItem href="/dashboard" icon={<Home />} active>
                      Dashboard
                    </SidebarItem>
                    <SidebarItem href="/users" icon={<Users />}>
                      Users
                    </SidebarItem>
                    <SidebarItem href="/settings" icon={<Settings />}>
                      Settings
                    </SidebarItem>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </div>

          {/* Right Position */}
          <div className="relative h-80 bg-muted/20 rounded-lg overflow-hidden">
            <div className="h-full p-4">
              <h3 className="font-semibold mb-2">Right Position Overlay</h3>
              <p className="text-sm text-muted-foreground">
                Right-side navigation overlay for secondary navigation, filters, or contextual tools
                that supplement primary content.
              </p>
            </div>

            <Sidebar {...args} variant="overlay" position="right" currentPath="/filters">
              <SidebarHeader>
                <SidebarTitle>Filters & Tools</SidebarTitle>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Quick Filters</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarItem href="/filters" icon={<BarChart3 />} active>
                      Active Filters
                    </SidebarItem>
                    <SidebarItem href="/filters/saved" icon={<FileText />}>
                      Saved Filters
                    </SidebarItem>
                    <SidebarItem href="/filters/custom" icon={<Settings />}>
                      Custom Rules
                    </SidebarItem>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </div>
        </div>
      </MenuProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Position variants for overlay navigation. Left position for primary navigation, right position for secondary tools and filters',
      },
    },
  },
};

/**
 * Interactive states including loading, disabled, and badge indicators
 * demonstrating dynamic navigation behaviors and user feedback patterns.
 */
export const InteractiveStates: Story = {
  render: (args) => {
    return (
      <MenuProvider>
        <div className="flex h-screen bg-muted/20">
          <Sidebar {...args} currentPath="/dashboard" className="border-r" size="comfortable">
            <SidebarHeader>
              <SidebarTitle>Interactive States</SidebarTitle>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Standard States</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/dashboard" icon={<Home />} active>
                    Active Page
                  </SidebarItem>
                  <SidebarItem href="/users" icon={<Users />}>
                    Standard Item
                  </SidebarItem>
                  <SidebarItem href="/loading" icon={<Loader2 />} loading>
                    Loading State
                  </SidebarItem>
                  <SidebarItem href="/disabled" icon={<AlertTriangle />} disabled>
                    Disabled Item
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Badge Indicators</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem
                    href="/notifications"
                    icon={<FileText />}
                    badge={
                      <Badge size="sm" variant="info">
                        3
                      </Badge>
                    }
                  >
                    Notifications
                  </SidebarItem>
                  <SidebarItem
                    href="/alerts"
                    icon={<AlertTriangle />}
                    badge={
                      <Badge size="sm" variant="error">
                        !
                      </Badge>
                    }
                  >
                    System Alerts
                  </SidebarItem>
                  <SidebarItem
                    href="/updates"
                    icon={<Settings />}
                    badge={
                      <Badge size="sm" variant="success">
                        New
                      </Badge>
                    }
                  >
                    Updates Available
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Hierarchy Levels</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/projects" icon={<FileText />}>
                    Projects (Level 0)
                  </SidebarItem>
                  <SidebarItem href="/projects/web" level={1}>
                    Web Application
                  </SidebarItem>
                  <SidebarItem href="/projects/web/frontend" level={2}>
                    Frontend Components
                  </SidebarItem>
                  <SidebarItem href="/projects/mobile" level={1}>
                    Mobile App
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarItem
                href="/profile"
                icon={<Users />}
                variant="secondary"
                badge={
                  <Badge size="sm" variant="warning">
                    Pro
                  </Badge>
                }
              >
                User Profile
              </SidebarItem>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-2xl space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-4">Interactive States</h1>
                <p className="text-muted-foreground">
                  Navigation items support various interactive states to provide clear user feedback
                  and enhance the navigation experience.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="p-4 bg-background border rounded-lg">
                  <h3 className="font-semibold mb-2">State Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Active, loading, and disabled states provide clear visual feedback about
                    navigation availability and current context.
                  </p>
                </div>

                <div className="p-4 bg-background border rounded-lg">
                  <h3 className="font-semibold mb-2">Badge Indicators</h3>
                  <p className="text-sm text-muted-foreground">
                    Badges communicate status, counts, and notifications without overwhelming the
                    navigation hierarchy.
                  </p>
                </div>

                <div className="p-4 bg-background border rounded-lg">
                  <h3 className="font-semibold mb-2">Hierarchical Levels</h3>
                  <p className="text-sm text-muted-foreground">
                    Visual indentation creates clear parent-child relationships in complex
                    navigation structures.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </MenuProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive states including loading, disabled, badges, and hierarchical levels. Demonstrates dynamic navigation behaviors and user feedback',
      },
    },
  },
};

/**
 * Collapsible behavior and toggle functionality demonstrating responsive
 * navigation patterns and space management in constrained interfaces.
 */
export const CollapsibleBehavior: Story = {
  render: (args) => {
    return (
      <MenuProvider>
        <div className="flex h-screen bg-muted/20">
          <Sidebar
            {...args}
            collapsible={true}
            defaultCollapsed={false}
            currentPath="/dashboard"
            className="border-r"
            persistCollapsedState={true}
          >
            <SidebarHeader showToggle={true}>
              <SidebarTitle>Collapsible Demo</SidebarTitle>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Primary</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/dashboard" icon={<Home />} active showTooltip>
                    Dashboard Overview
                  </SidebarItem>
                  <SidebarItem href="/users" icon={<Users />} showTooltip>
                    User Management
                  </SidebarItem>
                  <SidebarItem href="/analytics" icon={<BarChart3 />} showTooltip>
                    Analytics & Reports
                  </SidebarItem>
                  <SidebarItem href="/documents" icon={<FileText />} showTooltip>
                    Document Library
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Admin</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/security" icon={<Shield />} showTooltip>
                    Security Settings
                  </SidebarItem>
                  <SidebarItem href="/settings" icon={<Settings />} showTooltip>
                    System Configuration
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarItem href="/help" icon={<HelpCircle />} variant="secondary" showTooltip>
                Help & Support
              </SidebarItem>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-2xl space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-4">Collapsible Navigation</h1>
                <p className="text-muted-foreground">
                  Toggle the sidebar to see space-efficient icon-only mode with tooltip support for
                  maintaining navigation context.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="p-4 bg-background border rounded-lg">
                  <h3 className="font-semibold mb-2">Space Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Collapsed state maximizes content area while preserving all navigation
                    functionality through iconography.
                  </p>
                </div>

                <div className="p-4 bg-background border rounded-lg">
                  <h3 className="font-semibold mb-2">State Persistence</h3>
                  <p className="text-sm text-muted-foreground">
                    User preference for collapsed/expanded state is remembered across sessions
                    through localStorage integration.
                  </p>
                </div>

                <div className="p-4 bg-background border rounded-lg">
                  <h3 className="font-semibold mb-2">Tooltip Enhancement</h3>
                  <p className="text-sm text-muted-foreground">
                    Hover tooltips in collapsed mode provide full context without requiring
                    expansion for quick navigation reference.
                  </p>
                </div>

                <div className="p-4 bg-background border rounded-lg">
                  <h3 className="font-semibold mb-2">Smooth Transitions</h3>
                  <p className="text-sm text-muted-foreground">
                    Collapse/expand animations respect motion preferences and provide smooth visual
                    feedback for state changes.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </MenuProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Collapsible behavior with toggle functionality, state persistence, and tooltip support. Demonstrates responsive space management patterns',
      },
    },
  },
};
