import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/Breadcrumb';

/**
 * AI Training: Breadcrumb Semantic Usage
 * Demonstrates contextual usage and semantic meaning in real-world scenarios
 * Trains AI agents on proper breadcrumb selection for different business contexts
 */
const meta = {
  title: 'Breadcrumb/Semantic',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Semantic usage examples demonstrating contextual breadcrumb patterns and meaning.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * E-commerce navigation demonstrating product hierarchy and shopping flow.
 * Shows trust building through clear category navigation.
 */
export const ECommerceNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Product Category Navigation</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Store
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/electronics" onClick={fn()}>
                Electronics
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/electronics/phones" onClick={fn()}>
                Phones
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/electronics/phones/smartphones" onClick={fn()}>
                Smartphones
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>iPhone 15 Pro</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Clear product hierarchy builds shopping confidence and provides easy category browsing
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Checkout Process Navigation</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb separator="arrow">
            <BreadcrumbItem>
              <BreadcrumbLink href="/cart" onClick={fn()}>
                Shopping Cart
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/checkout/shipping" onClick={fn()}>
                Shipping
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/checkout/payment" onClick={fn()}>
                Payment
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Confirmation</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Arrow separators indicate progressive flow; breadcrumbs provide escape routes during
            sensitive transactions
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Documentation and help system navigation.
 * Demonstrates technical hierarchy and knowledge organization.
 */
export const DocumentationNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Technical Documentation</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb separator="slash">
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs" onClick={fn()}>
                docs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs/components" onClick={fn()}>
                components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs/components/navigation" onClick={fn()}>
                navigation
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>breadcrumb.mdx</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Slash separators familiar to developers; reflects file system hierarchy
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Knowledge Base Navigation</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/help" onClick={fn()}>
                Help Center
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/help/getting-started" onClick={fn()}>
                Getting Started
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/help/getting-started/account-setup" onClick={fn()}>
                Account Setup
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Two-Factor Authentication</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Progressive knowledge discovery with clear topical hierarchy
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Admin and management interface navigation.
 * Shows trust building in high-consequence environments.
 */
export const AdminInterfaceNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">System Administration</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" onClick={fn()}>
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users" onClick={fn()}>
                User Management
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users/permissions" onClick={fn()}>
                Permissions
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Modify Access Rights</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Clear escape routes crucial in high-consequence admin environments
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Financial Management</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/finance" onClick={fn()}>
                Finance
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/finance/billing" onClick={fn()}>
                Billing
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/finance/billing/invoices" onClick={fn()}>
                Invoices
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Delete Invoice #12345</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Trust building through clear context - users understand exactly where they are in
            sensitive operations
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Content management and publishing workflows.
 * Demonstrates editorial and creative process navigation.
 */
export const ContentManagementNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Editorial Workflow</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/cms" onClick={fn()}>
                CMS
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cms/articles" onClick={fn()}>
                Articles
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cms/articles/drafts" onClick={fn()}>
                Drafts
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit: "Building Accessible Components"</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Editorial context helps writers understand content state and location
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Media Library</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/media" onClick={fn()}>
                Media Library
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/media/images" onClick={fn()}>
                Images
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/media/images/2024" onClick={fn()}>
                2024
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/media/images/2024/march" onClick={fn()}>
                March
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>hero-image.jpg</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Hierarchical organization mirrors file system structure familiar to content creators
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Multi-step form and wizard navigation.
 * Shows progressive flow with clear progress indication.
 */
export const FormWizardNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Account Setup Wizard</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb separator="arrow">
            <BreadcrumbItem>
              <BreadcrumbLink href="/signup/welcome" onClick={fn()}>
                Welcome
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/signup/profile" onClick={fn()}>
                Profile
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/signup/preferences" onClick={fn()}>
                Preferences
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Verification</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Arrow separators indicate forward progression; users can return to previous steps
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Complex Configuration Form</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/config" onClick={fn()}>
                Configuration
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/config/general" onClick={fn()}>
                General Settings
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/config/general/notifications" onClick={fn()}>
                Notifications
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Email Preferences</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Deep configuration hierarchy with clear navigation paths reduces user anxiety in complex
            forms
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Dashboard and analytics navigation.
 * Demonstrates data exploration and reporting contexts.
 */
export const DashboardNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Analytics Dashboard</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" onClick={fn()}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/analytics" onClick={fn()}>
                Analytics
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/analytics/traffic" onClick={fn()}>
                Traffic Reports
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Monthly Analysis</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Data exploration hierarchy helps users understand report context and navigate between
            analysis levels
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Project Management</h4>
        <div className="border rounded p-4 space-y-3 max-w-lg">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects" onClick={fn()}>
                Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects/rafters" onClick={fn()}>
                Rafters Design System
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects/rafters/tasks" onClick={fn()}>
                Tasks
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Implement Breadcrumb Component</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="text-xs text-muted-foreground">
            Project hierarchy builds context for task management and team collaboration
          </div>
        </div>
      </div>
    </div>
  ),
};
