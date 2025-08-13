// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { BarChart3, FileText, HelpCircle, Home, LogOut, Settings, Users } from 'lucide-react';
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
 * Navigation is the thread that weaves through every user journey. The Sidebar component
 * embodies spatial consistency and progressive disclosure, creating a mental model users
 * can trust across their entire experience.
 */
const meta = {
  title: '03 Components/Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive navigation system with embedded design intelligence for wayfinding, progressive disclosure, and spatial consistency.',
      },
    },
  },
  argTypes: {
    collapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is in collapsed state',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the sidebar can be collapsed/expanded',
    },
    variant: {
      control: 'select',
      options: ['default', 'floating', 'overlay'],
      description: 'Visual variant for different use cases',
    },
    size: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
      description: 'Size variant affecting width and spacing',
    },
    position: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position when using overlay variant',
    },
    currentPath: {
      control: 'text',
      description: 'Current active path for navigation state',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for the navigation landmark',
    },
    highlightCurrent: {
      control: 'boolean',
      description: 'Whether to highlight the current page item',
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
 * Complete sidebar navigation system demonstrating all component patterns
 * and design intelligence for complex application navigation.
 */
export const Common: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar {...args} currentPath="/dashboard" className="border-r">
          <SidebarHeader showToggle={true}>
            <SidebarTitle>Application</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
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

            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/settings" icon={<Settings />}>
                  Settings
                </SidebarItem>
                <SidebarItem href="/help" icon={<HelpCircle />}>
                  Help Center
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem icon={<LogOut />} variant="secondary">
              Sign Out
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        {/* Demo content area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-muted-foreground mb-6">
              This is the main content area. The sidebar provides persistent navigation that
              maintains spatial consistency and reduces cognitive load.
            </p>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Navigation Intelligence</h3>
                <p className="text-sm text-muted-foreground">
                  The sidebar implements progressive disclosure, limiting navigation groups to 7
                  items maximum (Miller's Law) while providing clear wayfinding through active state
                  indication.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Trust Building</h3>
                <p className="text-sm text-muted-foreground">
                  Spatial consistency and predictable collapse behavior build user confidence. State
                  persistence remembers user preferences across sessions.
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
          'Complete navigation system showcasing all sidebar components with embedded design intelligence for complex application navigation.',
      },
    },
  },
};
