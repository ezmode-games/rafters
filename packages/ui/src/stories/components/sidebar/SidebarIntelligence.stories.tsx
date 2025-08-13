// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import {
  AlertTriangle,
  BarChart3,
  Code2,
  Cpu,
  Database,
  FileText,
  HelpCircle,
  Home,
  Layers,
  Monitor,
  Settings,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
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
 * AI Training: Sidebar Navigation Intelligence
 * cognitiveLoad=6, navigation wayfinding patterns, progressive disclosure
 * Teaches AI agents systematic navigation design and Miller's Law enforcement
 */
const meta = {
  title: 'Components/Sidebar/Intelligence',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Navigation intelligence patterns demonstrating cognitive load management, progressive disclosure, and trust-building through spatial consistency.',
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
 * Miller's Law enforcement - demonstrates proper grouping with maximum 7 items
 * per section to prevent cognitive overload in navigation systems.
 */
export const MillersLawEnforcement: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <MenuProvider>
          <Sidebar {...args} currentPath="/dashboard" className="border-r" size="comfortable">
            <SidebarHeader>
              <SidebarTitle>Miller's Law Demo</SidebarTitle>
            </SidebarHeader>

            <SidebarContent>
              {/* GOOD: 6 items - within Miller's Law limit */}
              <SidebarGroup maxItems={7}>
                <SidebarGroupLabel>Main Features (6 items - GOOD)</SidebarGroupLabel>
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
                  <SidebarItem href="/settings" icon={<Settings />}>
                    Settings
                  </SidebarItem>
                  <SidebarItem href="/help" icon={<HelpCircle />}>
                    Help
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* BAD: 9 items - exceeds Miller's Law (triggers development warning) */}
              <SidebarGroup maxItems={7}>
                <SidebarGroupLabel>Admin Tools (9 items - BAD)</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/admin/security" icon={<Shield />}>
                    Security
                  </SidebarItem>
                  <SidebarItem href="/admin/database" icon={<Database />}>
                    Database
                  </SidebarItem>
                  <SidebarItem href="/admin/api" icon={<Code2 />}>
                    API Management
                  </SidebarItem>
                  <SidebarItem href="/admin/integrations" icon={<Layers />}>
                    Integrations
                  </SidebarItem>
                  <SidebarItem href="/admin/performance" icon={<Zap />}>
                    Performance
                  </SidebarItem>
                  <SidebarItem href="/admin/monitoring" icon={<Monitor />}>
                    Monitoring
                  </SidebarItem>
                  <SidebarItem href="/admin/logs" icon={<FileText />}>
                    Logs
                  </SidebarItem>
                  <SidebarItem href="/admin/backups" icon={<Database />}>
                    Backups
                  </SidebarItem>
                  <SidebarItem href="/admin/system" icon={<Cpu />}>
                    System Health
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </MenuProvider>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Miller's Law in Navigation</h1>
              <p className="text-muted-foreground">
                The human brain can effectively process 7±2 items simultaneously. Our sidebar
                enforces this limit to prevent cognitive overload.
              </p>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <h3 className="font-semibold mb-2 text-success">✅ Good Practice</h3>
              <p className="text-sm text-muted-foreground">
                The "Main Features" group contains 6 items - well within Miller's Law limit. Users
                can process this information efficiently without cognitive strain.
              </p>
            </div>

            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h3 className="font-semibold mb-2 text-destructive">❌ Cognitive Overload</h3>
              <p className="text-sm text-muted-foreground">
                The "Admin Tools" group contains 9 items - exceeding Miller's Law. This triggers a
                development warning and should be broken into sub-groups.
              </p>
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
          "Demonstrates Miller's Law enforcement in navigation design. Groups exceeding 7 items trigger development warnings and should be restructured.",
      },
    },
  },
};

/**
 * Progressive disclosure patterns for managing complex navigation hierarchies
 * while maintaining cognitive simplicity and clear information architecture.
 */
export const ProgressiveDisclosure: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <MenuProvider>
          <Sidebar {...args} currentPath="/projects/web" className="border-r" size="comfortable">
            <SidebarHeader>
              <SidebarTitle>Project Manager</SidebarTitle>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Overview</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/dashboard" icon={<Home />}>
                    Dashboard
                  </SidebarItem>
                  <SidebarItem href="/analytics" icon={<BarChart3 />}>
                    Analytics
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup collapsible={true} defaultExpanded={true}>
                <SidebarGroupLabel>Active Projects</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/projects/web" icon={<Code2 />} active level={0}>
                    Web Platform
                  </SidebarItem>
                  <SidebarItem href="/projects/web/frontend" level={1}>
                    Frontend App
                  </SidebarItem>
                  <SidebarItem href="/projects/web/api" level={1}>
                    API Service
                  </SidebarItem>
                  <SidebarItem href="/projects/mobile" icon={<Monitor />} level={0}>
                    Mobile App
                  </SidebarItem>
                  <SidebarItem href="/projects/mobile/ios" level={1}>
                    iOS Version
                  </SidebarItem>
                  <SidebarItem href="/projects/mobile/android" level={1}>
                    Android Version
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Tools</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/deployment" icon={<Zap />}>
                    Deployment
                  </SidebarItem>
                  <SidebarItem href="/monitoring" icon={<Monitor />}>
                    Monitoring
                  </SidebarItem>
                  <SidebarItem href="/settings" icon={<Settings />}>
                    Settings
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </MenuProvider>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Progressive Disclosure</h1>
              <p className="text-muted-foreground">
                Complex information hierarchies are revealed progressively to prevent cognitive
                overload while maintaining access to deep functionality.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Collapsible Groups</h3>
                <p className="text-sm text-muted-foreground">
                  Project sections can be collapsed to focus attention on active work while keeping
                  inactive projects accessible.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Hierarchical Indentation</h3>
                <p className="text-sm text-muted-foreground">
                  Visual indentation (level prop) creates clear parent-child relationships without
                  overwhelming the navigation structure.
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
          'Progressive disclosure patterns for complex navigation hierarchies. Information is revealed in layers to maintain cognitive simplicity.',
      },
    },
  },
};

/**
 * Trust-building through spatial consistency and predictable navigation behavior.
 * Demonstrates how consistent positioning and state management build user confidence.
 */
export const TrustBuildingPatterns: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <MenuProvider>
          <Sidebar
            {...args}
            currentPath="/dashboard"
            className="border-r"
            size="comfortable"
            persistCollapsedState={true}
            highlightCurrent={true}
          >
            <SidebarHeader showToggle={true}>
              <SidebarTitle>Trust Demo</SidebarTitle>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Core Features</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/dashboard" icon={<Home />} active>
                    Dashboard
                  </SidebarItem>
                  <SidebarItem href="/users" icon={<Users />}>
                    User Management
                  </SidebarItem>
                  <SidebarItem href="/analytics" icon={<BarChart3 />}>
                    Analytics Hub
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/settings" icon={<Settings />}>
                    System Settings
                  </SidebarItem>
                  <SidebarItem href="/security" icon={<Shield />}>
                    Security Center
                  </SidebarItem>
                  <SidebarItem href="/alerts" icon={<AlertTriangle />} variant="secondary">
                    System Alerts
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarItem icon={<HelpCircle />} variant="secondary">
                Help & Support
              </SidebarItem>
            </SidebarFooter>
          </Sidebar>
        </MenuProvider>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Trust-Building Navigation</h1>
              <p className="text-muted-foreground">
                Consistent behavior and clear visual feedback build user confidence in complex
                navigation systems.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Spatial Consistency</h3>
                <p className="text-sm text-muted-foreground">
                  The sidebar maintains its position and behavior across the application, building
                  reliable spatial memory for users.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">State Persistence</h3>
                <p className="text-sm text-muted-foreground">
                  User preferences (collapsed state, active selection) are remembered across
                  sessions, reducing repeated configuration.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Clear Active State</h3>
                <p className="text-sm text-muted-foreground">
                  Current location is always clearly indicated with consistent visual treatment,
                  preventing navigation confusion.
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
          'Trust-building through spatial consistency, state persistence, and clear visual feedback. These patterns build user confidence in navigation systems.',
      },
    },
  },
};

/**
 * Attention economics in navigation - sidebar as secondary support system that
 * never competes with primary content for user attention.
 */
export const AttentionEconomics: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <MenuProvider>
          <Sidebar {...args} currentPath="/content" className="border-r" size="compact">
            <SidebarHeader>
              <SidebarTitle level={3}>Navigation</SidebarTitle>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Content</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/content" icon={<FileText />} active variant="default">
                    Articles
                  </SidebarItem>
                  <SidebarItem href="/drafts" icon={<FileText />} variant="secondary">
                    Drafts
                  </SidebarItem>
                  <SidebarItem href="/media" icon={<Layers />} variant="secondary">
                    Media
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Tools</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarItem href="/analytics" icon={<BarChart3 />} variant="secondary">
                    Analytics
                  </SidebarItem>
                  <SidebarItem href="/settings" icon={<Settings />} variant="secondary">
                    Settings
                  </SidebarItem>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </MenuProvider>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-primary">
                Primary Content Commands Attention
              </h1>
              <p className="text-xl text-muted-foreground">
                The sidebar provides wayfinding support without competing for user focus. Primary
                attention remains on the content that matters most.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="p-6 bg-primary text-primary-foreground rounded-lg">
                <h2 className="text-2xl font-bold mb-4">High-Priority Content</h2>
                <p className="text-lg opacity-90">
                  Main content uses strong visual hierarchy with primary colors and larger
                  typography to command user attention.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Secondary Information</h3>
                <p className="text-muted-foreground">
                  Supporting content uses more subtle visual treatment, allowing the primary content
                  to dominate the attention hierarchy.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="text-base font-medium mb-2">Navigation Intelligence</h4>
                <p className="text-sm text-muted-foreground">
                  The sidebar uses compact sizing, secondary variants, and muted colors to provide
                  navigation support without creating attention competition.
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
          'Attention economics in navigation design. The sidebar serves as secondary support, never competing with primary content for user attention.',
      },
    },
  },
};
