import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Tabs';

const meta = {
  title: '03 Components/Navigation/Tabs/Intelligence',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Cognitive load optimized tabs that prevent user confusion through wayfinding intelligence, mental model building, and smart navigation patterns. Designed to reduce cognitive overhead while maintaining clear navigation paths.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Cognitive Load Optimization
 *
 * Miller's 7±2 rule prevents decision paralysis through smart tab counting.
 * Visual hierarchy creates scannable navigation patterns.
 */
export const CognitiveLoadOptimization: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h1 className="heading-section">Cognitive Load Optimization</h1>
      <p className="text-body">
        Optimal tab count reduces mental effort while maintaining clear navigation paths.
      </p>

      <div className="mt-phi-3">
        <h2 className="heading-component">Optimal Configuration</h2>
        <p className="text-body-small">Five tabs represent the cognitive sweet spot for navigation</p>
        
        <Tabs defaultValue="overview" className="mt-phi-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p className="text-body">Overview content flows naturally in scannable patterns</p>
          </TabsContent>
          <TabsContent value="details">
            <p className="text-body">Details organize information without overwhelming</p>
          </TabsContent>
          <TabsContent value="settings">
            <p className="text-body">Settings group related controls logically</p>
          </TabsContent>
          <TabsContent value="security">
            <p className="text-body">Security maintains importance without creating anxiety</p>
          </TabsContent>
          <TabsContent value="billing">
            <p className="text-body">Billing separates financial concerns clearly</p>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-phi-3">
        <h2 className="heading-component">Complex Pattern</h2>
        <p className="text-body-small">Nine tabs exceed cognitive limits and require grouping</p>
        
        <Tabs defaultValue="general" className="mt-phi-2">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <p className="text-body">Decision paralysis occurs with too many simultaneous choices</p>
          </TabsContent>
          <TabsContent value="profile">
            <p className="text-body">Users struggle to scan this many options efficiently</p>
          </TabsContent>
          <TabsContent value="privacy">
            <p className="text-body">Related settings should group together through progressive disclosure</p>
          </TabsContent>
        </Tabs>
        <p className="text-body-small text-muted-foreground mt-phi-1">
          Consider hierarchical organization or progressive disclosure patterns
        </p>
      </div>
    </div>
  ),
};

/**
 * Wayfinding Intelligence
 *
 * Clear navigation context prevents user confusion through semantic structure
 * and consistent visual patterns without visual decoration.
 */
export const WayfindingIntelligence: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h1 className="heading-section">Navigation Context and Wayfinding</h1>
      <p className="text-body">
        Clear visual feedback and consistent patterns build navigation confidence.
      </p>
      
      <div className="mt-phi-3">
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <h2 className="heading-component">Dashboard Overview</h2>
            <p className="text-body">Clear visual feedback shows current location in navigation hierarchy</p>
          </TabsContent>
          <TabsContent value="analytics">
            <h2 className="heading-component">Analytics Data</h2>
            <p className="text-body">Contextual information provides wayfinding without overwhelming</p>
          </TabsContent>
          <TabsContent value="reports">
            <h2 className="heading-component">Report Generation</h2>
            <p className="text-body">Recognition patterns help navigation and reduce cognitive load</p>
          </TabsContent>
          <TabsContent value="settings">
            <h2 className="heading-component">System Settings</h2>
            <p className="text-body">Consistent patterns build user confidence</p>
          </TabsContent>
        </Tabs>
        
        <p className="text-body-small text-muted-foreground mt-phi-2">
          Semantic structure provides context without visual decoration
        </p>
      </div>
    </div>
  ),
};

/**
 * Mental Model Building
 *
 * Hierarchical organization creates logical mental models through progressive
 * disclosure and consistent information architecture patterns.
 */
export const MentalModelBuilding: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h1 className="heading-section">Hierarchical Mental Models</h1>
      <p className="text-body">
        Progressive disclosure manages complexity without hiding functionality.
      </p>
      
      <div className="mt-phi-3">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="integration">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <h2 className="heading-component">Account Management</h2>
            
            <div className="mt-phi-2">
              <Tabs defaultValue="profile">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <h3 className="heading-component">Profile Information</h3>
                  <p className="text-body">Personal details and public information settings</p>
                </TabsContent>
                <TabsContent value="security">
                  <h3 className="heading-component">Security Settings</h3>
                  <p className="text-body">Password, authentication, and login history</p>
                </TabsContent>
                <TabsContent value="preferences">
                  <h3 className="heading-component">User Preferences</h3>
                  <p className="text-body">Theme, language, and notification settings</p>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="workspace">
            <h2 className="heading-component">Workspace Settings</h2>
            <p className="text-body">Team management, project settings, and collaboration tools</p>
          </TabsContent>
          
          <TabsContent value="integration">
            <h2 className="heading-component">Integration Management</h2>
            <p className="text-body">Connected services, API keys, and third-party applications</p>
          </TabsContent>
        </Tabs>
        
        <p className="text-body-small text-muted-foreground mt-phi-2">
          Hierarchical organization builds clear mental models of system structure
        </p>
      </div>
    </div>
  ),
};

/**
 * Motor Accessibility Focus
 *
 * Enhanced touch targets and keyboard navigation reduce interaction barriers
 * for users with different motor abilities and interaction preferences.
 */
export const MotorAccessibilityFocus: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h1 className="heading-section">Enhanced Motor Accessibility</h1>
      <p className="text-body">
        Generous touch targets and keyboard support accommodate various interaction methods.
      </p>
      
      <div className="mt-phi-3">
        <h2 className="heading-component">Large Touch Targets</h2>
        <p className="text-body-small">Minimum 44px targets meet accessibility guidelines</p>
        
        <Tabs defaultValue="home" className="mt-phi-2">
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <p className="text-body">Enhanced spacing prevents accidental activation</p>
          </TabsContent>
          <TabsContent value="products">
            <p className="text-body">Consistent hit areas reduce motor precision requirements</p>
          </TabsContent>
          <TabsContent value="services">
            <p className="text-body">Generous padding accommodates various interaction methods</p>
          </TabsContent>
          <TabsContent value="contact">
            <p className="text-body">Clear focus indicators guide keyboard navigation</p>
          </TabsContent>
        </Tabs>
      </div>
        
      <div className="mt-phi-3">
        <h2 className="heading-component">Keyboard Navigation</h2>
        <p className="text-body-small">Arrow keys navigate, Enter and Space activate</p>
        
        <Tabs defaultValue="tab1" className="mt-phi-2">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3" disabled>Disabled</TabsTrigger>
            <TabsTrigger value="tab4">Tab 4</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <p className="text-body">Focus indicators clearly show current position</p>
          </TabsContent>
          <TabsContent value="tab2">
            <p className="text-body">Disabled tabs are properly skipped in navigation</p>
          </TabsContent>
          <TabsContent value="tab4">
            <p className="text-body">Full keyboard support with proper tab order</p>
          </TabsContent>
        </Tabs>
        
        <p className="text-body-small text-muted-foreground mt-phi-2">
          Complete keyboard accessibility with clear focus indicators
        </p>
      </div>
    </div>
  ),
};

/**
 * Progressive Disclosure Intelligence
 *
 * Strategic information reveal reduces initial cognitive load while maintaining
 * access to comprehensive functionality when needed.
 */
export const ProgressiveDisclosureIntelligence: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h1 className="heading-section">Progressive Disclosure Strategy</h1>
      <p className="text-body">
        Reveal complexity gradually to prevent cognitive overload while preserving access to advanced features.
      </p>
      
      <div className="mt-phi-3">
        <h2 className="heading-component">Tiered Information Architecture</h2>
        <p className="text-body-small">Essential → Detailed → Advanced progression</p>
        
        <Tabs defaultValue="overview" className="mt-phi-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="developer">Developer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-phi-2">
            <h3 className="heading-component">Project Summary</h3>
            <div className="grid grid-cols-3 gap-phi-2">
              <div className="p-phi-2 bg-background-subtle rounded-md">
                <p className="text-caption font-medium">Status</p>
                <p className="text-body">Active</p>
              </div>
              <div className="p-phi-2 bg-background-subtle rounded-md">
                <p className="text-caption font-medium">Progress</p>
                <p className="text-body">75%</p>
              </div>
              <div className="p-phi-2 bg-background-subtle rounded-md">
                <p className="text-caption font-medium">Due</p>
                <p className="text-body">Next Week</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-phi-2">
            <h3 className="heading-component">Project Details</h3>
            <div className="space-y-phi-1">
              <div>
                <p className="text-caption font-medium">Description</p>
                <p className="text-body">Comprehensive project management system with team collaboration features</p>
              </div>
              <div>
                <p className="text-caption font-medium">Team Members</p>
                <p className="text-body">Sarah Chen, Mike Rodriguez, Elena Vasquez</p>
              </div>
              <div>
                <p className="text-caption font-medium">Dependencies</p>
                <p className="text-body">API Integration, Database Migration</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-phi-2">
            <h3 className="heading-component">Advanced Configuration</h3>
            <div className="space-y-phi-2">
              <div className="p-phi-2 border border-border rounded-md">
                <p className="text-body-small font-medium mb-phi-1">Resource Allocation</p>
                <p className="text-caption">CPU: 2.4 cores, Memory: 8GB, Storage: 500GB</p>
              </div>
              <div className="p-phi-2 border border-border rounded-md">
                <p className="text-body-small font-medium mb-phi-1">Environment Variables</p>
                <p className="text-caption font-mono">NODE_ENV=production, API_VERSION=v2.1</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="developer" className="space-y-phi-2">
            <h3 className="heading-component">Developer Tools</h3>
            <div className="bg-background-code p-phi-2 rounded-md">
              <p className="text-caption font-mono mb-phi-1">Debug Information:</p>
              <p className="text-caption font-mono">Build: #2847</p>
              <p className="text-caption font-mono">Commit: a7b3c9d</p>
              <p className="text-caption font-mono">Deploy: 2024-01-15T14:30:22Z</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <p className="text-body-small text-muted-foreground mt-phi-2">
          Each tab reveals appropriate detail level for different user needs and expertise
        </p>
      </div>
    </div>
  ),
};

/**
 * Contextual Relationship Intelligence
 *
 * Visual and semantic cues establish clear relationships between tabs and their content,
 * building user understanding of system structure and data relationships.
 */
export const ContextualRelationshipIntelligence: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h1 className="heading-section">Contextual Relationships</h1>
      <p className="text-body">
        Clear visual and semantic connections help users understand how information relates across tabs.
      </p>
      
      <div className="mt-phi-3">
        <h2 className="heading-component">Cross-Tab Data Relationships</h2>
        <p className="text-body-small">Visual indicators show how data connects between sections</p>
        
        <Tabs defaultValue="customers" className="mt-phi-2">
          <TabsList>
            <TabsTrigger value="customers">Customers (247)</TabsTrigger>
            <TabsTrigger value="orders">Orders (1,203)</TabsTrigger>
            <TabsTrigger value="revenue">Revenue ($45K)</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="space-y-phi-2">
            <div className="flex justify-between items-center">
              <h3 className="heading-component">Customer Overview</h3>
              <p className="text-caption text-muted-foreground">Drives orders and revenue data</p>
            </div>
            <div className="grid grid-cols-2 gap-phi-2">
              <div className="p-phi-2 bg-background-subtle rounded-md">
                <p className="text-body font-medium">Active Customers</p>
                <p className="text-display-small">189</p>
                <p className="text-caption text-muted-foreground">→ See related orders</p>
              </div>
              <div className="p-phi-2 bg-background-subtle rounded-md">
                <p className="text-body font-medium">New This Month</p>
                <p className="text-display-small">58</p>
                <p className="text-caption text-muted-foreground">→ Track conversion</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-phi-2">
            <div className="flex justify-between items-center">
              <h3 className="heading-component">Order Management</h3>
              <p className="text-caption text-muted-foreground">From customer interactions</p>
            </div>
            <div className="space-y-phi-2">
              <div className="p-phi-2 border border-border rounded-md">
                <div className="flex justify-between items-center">
                  <p className="text-body">Order #1847</p>
                  <p className="text-caption text-muted-foreground">Customer: Sarah Chen</p>
                </div>
                <p className="text-body-small">Status: Processing</p>
              </div>
              <div className="p-phi-2 border border-border rounded-md">
                <div className="flex justify-between items-center">
                  <p className="text-body">Order #1846</p>
                  <p className="text-caption text-muted-foreground">Customer: Mike Rodriguez</p>
                </div>
                <p className="text-body-small">Status: Shipped</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-phi-2">
            <div className="flex justify-between items-center">
              <h3 className="heading-component">Revenue Tracking</h3>
              <p className="text-caption text-muted-foreground">Generated by customer orders</p>
            </div>
            <div className="grid grid-cols-3 gap-phi-2">
              <div className="p-phi-2 bg-background-subtle rounded-md">
                <p className="text-caption">This Month</p>
                <p className="text-display-small">$15.2K</p>
                <p className="text-caption text-muted-foreground">From 389 orders</p>
              </div>
              <div className="p-phi-2 bg-background-subtle rounded-md">
                <p className="text-caption">Last Month</p>
                <p className="text-display-small">$18.7K</p>
                <p className="text-caption text-muted-foreground">From 467 orders</p>
              </div>
              <div className="p-phi-2 bg-background-subtle rounded-md">
                <p className="text-caption">Growth</p>
                <p className="text-display-small">-18.7%</p>
                <p className="text-caption text-muted-foreground">See analytics</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-phi-2">
            <div className="flex justify-between items-center">
              <h3 className="heading-component">Performance Analytics</h3>
              <p className="text-caption text-muted-foreground">Insights from all data sources</p>
            </div>
            <div className="p-phi-2 bg-background-subtle rounded-md">
              <p className="text-body font-medium mb-phi-1">Key Insights</p>
              <ul className="text-body-small space-y-phi-1">
                <li>• Customer retention up 12% (Customer data)</li>
                <li>• Average order value increased 8% (Order data)</li>
                <li>• Monthly revenue variance within normal range (Revenue data)</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <p className="text-body-small text-muted-foreground mt-phi-2">
          Contextual hints and data connections help users understand system relationships
        </p>
      </div>
    </div>
  ),
};

/**
 * Trust Building Intelligence
 *
 * Transparent state communication and reliable interaction patterns build user confidence
 * in system behavior and data integrity.
 */
export const TrustBuildingIntelligence: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h1 className="heading-section">Trust Building Patterns</h1>
      <p className="text-body">
        Transparent communication and consistent behavior build user confidence in system reliability.
      </p>
      
      <div className="mt-phi-3">
        <h2 className="heading-component">State Transparency</h2>
        <p className="text-body-small">Clear indicators show system status and data freshness</p>
        
        <Tabs defaultValue="live" className="mt-phi-2">
          <TabsList>
            <TabsTrigger value="live">
              Live Data
              <span className="ml-phi-1 w-2 h-2 bg-semantic-success rounded-full" />
            </TabsTrigger>
            <TabsTrigger value="cached">
              Cached Data
              <span className="ml-phi-1 text-caption text-muted-foreground">(5m ago)</span>
            </TabsTrigger>
            <TabsTrigger value="offline">
              Offline Mode
              <span className="ml-phi-1 w-2 h-2 bg-semantic-warning rounded-full" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="live" className="space-y-phi-2">
            <div className="flex items-center justify-between p-phi-2 bg-semantic-success-subtle rounded-md">
              <div>
                <p className="text-body font-medium">Real-time Updates Active</p>
                <p className="text-body-small">Data refreshes automatically every 30 seconds</p>
              </div>
              <div className="text-semantic-success">
                <span className="text-caption">●</span> Connected
              </div>
            </div>
            <div className="p-phi-2 border border-border rounded-md">
              <p className="text-body">Server Status: Operational</p>
              <p className="text-caption text-muted-foreground">Last update: Just now</p>
            </div>
          </TabsContent>
          
          <TabsContent value="cached" className="space-y-phi-2">
            <div className="flex items-center justify-between p-phi-2 bg-background-subtle rounded-md">
              <div>
                <p className="text-body font-medium">Using Cached Data</p>
                <p className="text-body-small">Data may be up to 5 minutes old</p>
              </div>
              <button type="button" className="text-semantic-accent text-body-small hover:underline">
                Refresh Now
              </button>
            </div>
            <div className="p-phi-2 border border-border rounded-md">
              <p className="text-body">Server Status: Checking...</p>
              <p className="text-caption text-muted-foreground">Last update: 5 minutes ago</p>
            </div>
          </TabsContent>
          
          <TabsContent value="offline" className="space-y-phi-2">
            <div className="flex items-center justify-between p-phi-2 bg-semantic-warning-subtle rounded-md">
              <div>
                <p className="text-body font-medium">Offline Mode</p>
                <p className="text-body-small">Showing last available data</p>
              </div>
              <div className="text-semantic-warning">
                <span className="text-caption">●</span> Disconnected
              </div>
            </div>
            <div className="p-phi-2 border border-border-muted rounded-md">
              <p className="text-body text-muted-foreground">Server Status: Unavailable</p>
              <p className="text-caption text-muted-foreground">Last update: 2 hours ago</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <p className="text-body-small text-muted-foreground mt-phi-2">
          Clear state communication prevents uncertainty and builds system trust
        </p>
      </div>
    </div>
  ),
};

/**
 * Cognitive Efficiency Intelligence
 *
 * Optimized information architecture and interaction patterns reduce mental effort
 * required to complete tasks and find information.
 */
export const CognitiveEfficiencyIntelligence: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h1 className="heading-section">Cognitive Efficiency Optimization</h1>
      <p className="text-body">
        Streamlined patterns and intelligent defaults reduce mental overhead for common tasks.
      </p>
      
      <div className="mt-phi-3">
        <h2 className="heading-component">Smart Defaults & Shortcuts</h2>
        <p className="text-body-small">Anticipate needs and provide efficient pathways</p>
        
        <Tabs defaultValue="dashboard" className="mt-phi-2">
          <TabsList>
            <TabsTrigger value="dashboard">
              Dashboard
              <span className="ml-phi-1 text-caption text-muted-foreground">⌘1</span>
            </TabsTrigger>
            <TabsTrigger value="recent">
              Recent
              <span className="ml-phi-1 px-1 py-0.5 bg-semantic-accent text-white text-caption rounded-sm">3</span>
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites
              <span className="ml-phi-1 text-caption text-muted-foreground">⌘F</span>
            </TabsTrigger>
            <TabsTrigger value="search">
              Search
              <span className="ml-phi-1 text-caption text-muted-foreground">⌘K</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-phi-2">
            <div className="grid grid-cols-2 gap-phi-2">
              <div className="p-phi-2 bg-background-subtle rounded-md">
                <p className="text-body font-medium">Quick Actions</p>
                <div className="mt-phi-1 space-y-phi-1">
                  <button type="button" className="w-full text-left text-body-small hover:bg-background p-phi-1 rounded">
                    + New Project
                  </button>
                  <button type="button" className="w-full text-left text-body-small hover:bg-background p-phi-1 rounded">
                    + Add Team Member
                  </button>
                </div>
              </div>
              <div className="p-phi-2 bg-background-subtle rounded-md">
                <p className="text-body font-medium">Today's Focus</p>
                <div className="mt-phi-1 space-y-phi-1">
                  <p className="text-body-small">• Review design mockups</p>
                  <p className="text-body-small">• Team standup at 2pm</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-phi-2">
            <p className="text-body-small text-muted-foreground">Based on your activity</p>
            <div className="space-y-phi-1">
              <div className="flex items-center justify-between p-phi-2 hover:bg-background-subtle rounded-md cursor-pointer">
                <div>
                  <p className="text-body">Design System Updates</p>
                  <p className="text-caption text-muted-foreground">Modified 2 hours ago</p>
                </div>
                <p className="text-caption text-semantic-accent">Continue</p>
              </div>
              <div className="flex items-center justify-between p-phi-2 hover:bg-background-subtle rounded-md cursor-pointer">
                <div>
                  <p className="text-body">API Documentation</p>
                  <p className="text-caption text-muted-foreground">Viewed yesterday</p>
                </div>
                <p className="text-caption text-semantic-accent">Open</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-phi-2">
            <p className="text-body-small text-muted-foreground">Your pinned items</p>
            <div className="space-y-phi-1">
              <div className="flex items-center justify-between p-phi-2 bg-background-subtle rounded-md">
                <div>
                  <p className="text-body">Component Library</p>
                  <p className="text-caption text-muted-foreground">⭐ Frequently accessed</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-phi-2 bg-background-subtle rounded-md">
                <div>
                  <p className="text-body">Team Guidelines</p>
                  <p className="text-caption text-muted-foreground">⭐ Reference material</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-phi-2">
            <div className="p-phi-2 border border-border rounded-md">
              <input 
                type="text" 
                placeholder="Search projects, files, people..." 
                className="w-full text-body bg-transparent border-none outline-none"
              />
            </div>
            <div className="text-body-small text-muted-foreground">
              <p>Try: "design system", "api docs", or "@sarah"</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <p className="text-body-small text-muted-foreground mt-phi-2">
          Intelligent shortcuts and contextual suggestions reduce cognitive overhead
        </p>
      </div>
    </div>
  ),
};
