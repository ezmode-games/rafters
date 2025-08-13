// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import {
  BarChart3,
  Bell,
  BookOpen,
  Bookmark,
  Calendar,
  Code2,
  CreditCard,
  Database,
  FileText,
  HelpCircle,
  Home,
  Layers,
  MessageSquare,
  Monitor,
  Package,
  PenTool,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
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

/**
 * AI Training: Sidebar Semantic Usage
 * Demonstrates contextual navigation patterns for different application types
 * Teaches AI agents appropriate semantic structure for domain-specific navigation
 */
const meta = {
  title: '03 Components/Navigation/Sidebar/Semantic',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Semantic usage patterns for sidebar navigation in different application contexts and domain-specific requirements.',
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
 * E-commerce admin dashboard navigation with order management, inventory,
 * and customer service workflows organized by business domain.
 */
export const EcommerceAdmin: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar {...args} currentPath="/orders" className="border-r" size="comfortable">
          <SidebarHeader>
            <SidebarTitle>Commerce Admin</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/dashboard" icon={<Home />}>
                  Dashboard
                </SidebarItem>
                <SidebarItem href="/analytics" icon={<BarChart3 />}>
                  Sales Analytics
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Orders & Sales</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem
                  href="/orders"
                  icon={<ShoppingCart />}
                  active
                  badge={
                    <Badge size="sm" variant="warning">
                      12
                    </Badge>
                  }
                >
                  Orders
                </SidebarItem>
                <SidebarItem href="/shipping" icon={<Truck />}>
                  Shipping
                </SidebarItem>
                <SidebarItem href="/payments" icon={<CreditCard />}>
                  Payments
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Catalog</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/products" icon={<Package />}>
                  Products
                </SidebarItem>
                <SidebarItem href="/inventory" icon={<Database />}>
                  Inventory
                </SidebarItem>
                <SidebarItem href="/categories" icon={<Layers />}>
                  Categories
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Customers</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/customers" icon={<Users />}>
                  Customer List
                </SidebarItem>
                <SidebarItem href="/support" icon={<MessageSquare />}>
                  Support Tickets
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem href="/settings" icon={<Settings />} variant="secondary">
              Store Settings
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">E-commerce Admin Navigation</h1>
              <p className="text-muted-foreground">
                Navigation organized by business domains: orders, catalog, and customers. Semantic
                grouping follows merchant mental models.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Business Domain Organization</h3>
                <p className="text-sm text-muted-foreground">
                  Groups reflect merchant workflows: order processing, catalog management, and
                  customer service operations.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Status Indicators</h3>
                <p className="text-sm text-muted-foreground">
                  Badges show pending orders, support tickets, and system alerts that require
                  immediate attention.
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
          'E-commerce admin navigation organized by business domains. Groups reflect merchant workflows and operational priorities.',
      },
    },
  },
};

/**
 * Content management system navigation with editorial workflows,
 * media management, and publishing tools organized by content lifecycle.
 */
export const ContentManagement: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar {...args} currentPath="/content" className="border-r" size="comfortable">
          <SidebarHeader>
            <SidebarTitle>CMS Editorial</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Publishing</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/content" icon={<FileText />} active>
                  All Content
                </SidebarItem>
                <SidebarItem
                  href="/drafts"
                  icon={<PenTool />}
                  badge={
                    <Badge size="sm" variant="info">
                      5
                    </Badge>
                  }
                >
                  Drafts
                </SidebarItem>
                <SidebarItem href="/scheduled" icon={<Calendar />}>
                  Scheduled Posts
                </SidebarItem>
                <SidebarItem href="/media" icon={<Layers />}>
                  Media Library
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Organization</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/categories" icon={<Bookmark />}>
                  Categories
                </SidebarItem>
                <SidebarItem href="/tags" icon={<Bookmark />}>
                  Tags
                </SidebarItem>
                <SidebarItem href="/authors" icon={<Users />}>
                  Authors
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Engagement</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/comments" icon={<MessageSquare />}>
                  Comments
                </SidebarItem>
                <SidebarItem href="/analytics" icon={<BarChart3 />}>
                  Content Analytics
                </SidebarItem>
                <SidebarItem href="/seo" icon={<Search />}>
                  SEO Tools
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem href="/settings" icon={<Settings />} variant="secondary">
              Site Settings
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Content Management Navigation</h1>
              <p className="text-muted-foreground">
                Editorial navigation organized by content lifecycle: creation, organization, and
                engagement measurement.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Editorial Workflow</h3>
                <p className="text-sm text-muted-foreground">
                  Publishing section follows content creation flow from drafts through scheduling to
                  publication.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Content Organization</h3>
                <p className="text-sm text-muted-foreground">
                  Taxonomy tools (categories, tags) and author management support content structure
                  and collaboration.
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
          'Content management navigation organized by editorial workflows. Groups reflect content lifecycle and collaboration needs.',
      },
    },
  },
};

/**
 * Developer tools navigation with system monitoring, deployment pipelines,
 * and infrastructure management organized by technical responsibility.
 */
export const DeveloperTools: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar {...args} currentPath="/monitoring" className="border-r" size="comfortable">
          <SidebarHeader>
            <SidebarTitle>DevOps Console</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/dashboard" icon={<Home />}>
                  System Overview
                </SidebarItem>
                <SidebarItem
                  href="/alerts"
                  icon={<Bell />}
                  badge={
                    <Badge size="sm" variant="error">
                      2
                    </Badge>
                  }
                >
                  Active Alerts
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Infrastructure</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/monitoring" icon={<Monitor />} active>
                  System Monitoring
                </SidebarItem>
                <SidebarItem href="/database" icon={<Database />}>
                  Database Status
                </SidebarItem>
                <SidebarItem href="/performance" icon={<Zap />}>
                  Performance Metrics
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Development</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/deployments" icon={<Code2 />}>
                  Deployments
                </SidebarItem>
                <SidebarItem href="/pipelines" icon={<Layers />}>
                  CI/CD Pipelines
                </SidebarItem>
                <SidebarItem href="/environments" icon={<Package />}>
                  Environments
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Security</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/security" icon={<Shield />}>
                  Security Scan
                </SidebarItem>
                <SidebarItem href="/logs" icon={<FileText />}>
                  Audit Logs
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem href="/settings" icon={<Settings />} variant="secondary">
              System Config
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Developer Tools Navigation</h1>
              <p className="text-muted-foreground">
                Technical navigation organized by operational responsibility: infrastructure,
                development, and security domains.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Operational Domains</h3>
                <p className="text-sm text-muted-foreground">
                  Groups reflect DevOps responsibilities: system health, deployment workflows, and
                  security monitoring.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Alert Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Critical system alerts are prominently displayed to ensure immediate visibility of
                  operational issues.
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
          'Developer tools navigation organized by technical domains. Groups reflect DevOps responsibilities and operational workflows.',
      },
    },
  },
};

/**
 * Documentation site navigation with hierarchical content structure,
 * search integration, and learning paths organized by user journey.
 */
export const DocumentationSite: Story = {
  render: (args) => {
    return (
      <div className="flex h-screen bg-muted/20">
        <Sidebar
          {...args}
          currentPath="/guides/getting-started"
          className="border-r"
          size="spacious"
        >
          <SidebarHeader>
            <SidebarTitle>Documentation</SidebarTitle>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Getting Started</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/guides/introduction" icon={<BookOpen />}>
                  Introduction
                </SidebarItem>
                <SidebarItem href="/guides/getting-started" icon={<BookOpen />} active>
                  Quick Start Guide
                </SidebarItem>
                <SidebarItem href="/guides/installation" icon={<Package />}>
                  Installation
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Core Concepts</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/concepts/components" icon={<Layers />} level={0}>
                  Components
                </SidebarItem>
                <SidebarItem href="/concepts/components/basics" level={1}>
                  Component Basics
                </SidebarItem>
                <SidebarItem href="/concepts/components/props" level={1}>
                  Props & Configuration
                </SidebarItem>
                <SidebarItem href="/concepts/styling" icon={<PenTool />} level={0}>
                  Styling System
                </SidebarItem>
                <SidebarItem href="/concepts/accessibility" icon={<Shield />} level={0}>
                  Accessibility
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Examples</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarItem href="/examples/layouts" icon={<Monitor />}>
                  Layout Patterns
                </SidebarItem>
                <SidebarItem href="/examples/forms" icon={<FileText />}>
                  Form Examples
                </SidebarItem>
                <SidebarItem href="/examples/dashboards" icon={<BarChart3 />}>
                  Dashboard Templates
                </SidebarItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarItem href="/support" icon={<HelpCircle />} variant="secondary">
              Get Help
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-4">Documentation Navigation</h1>
              <p className="text-muted-foreground">
                Learning-oriented navigation with hierarchical content structure and progressive
                skill building paths.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Learning Journey</h3>
                <p className="text-sm text-muted-foreground">
                  Content organized by user progression: getting started, core concepts, and
                  practical examples.
                </p>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <h3 className="font-semibold mb-2">Hierarchical Structure</h3>
                <p className="text-sm text-muted-foreground">
                  Visual indentation shows content relationships and depth without overwhelming the
                  navigation structure.
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
          'Documentation navigation organized by learning journey. Hierarchical structure supports progressive skill building and content discovery.',
      },
    },
  },
};
