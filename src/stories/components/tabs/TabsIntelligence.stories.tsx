import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsBreadcrumb } from '../../../components/Tabs';

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
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Cognitive Load Optimization
 *
 * Limit tab count and use smart grouping to prevent decision paralysis.
 * Miller's 7±2 rule applied with visual hierarchy for scanning.
 */
export const CognitiveLoadOptimization: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('overview');
    
    return (
      <>
        <h3>Optimal Tab Count and Grouping</h3>
        
        <div className="w-full max-w-2xl space-y-6">
          {/* Optimal: 5 tabs (within cognitive limits) */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Optimal Tab Group (5 tabs)</h4>
            <Tabs defaultValue="overview" cognitiveLoad="minimal">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-4">
                <p>Overview content - easy to find and understand</p>
              </TabsContent>
              <TabsContent value="details" className="p-4">
                <p>Details content - clearly grouped information</p>
              </TabsContent>
              <TabsContent value="settings" className="p-4">
                <p>Settings content - logical organization</p>
              </TabsContent>
              <TabsContent value="security" className="p-4">
                <p>Security content - important but not overwhelming</p>
              </TabsContent>
              <TabsContent value="billing" className="p-4">
                <p>Billing content - separate concern, clearly labeled</p>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-muted-foreground">Perfect cognitive load - users can scan and choose easily</p>
          </div>

          {/* Complex: Showing the problem */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Complex Tab Group (needs grouping)</h4>
            <Tabs defaultValue="general" cognitiveLoad="complex">
              <TabsList density="compact">
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
              <TabsContent value="general" className="p-4">
                <p>Too many options create decision paralysis</p>
              </TabsContent>
              <TabsContent value="profile" className="p-4">
                <p>Users struggle to scan this many options</p>
              </TabsContent>
              <TabsContent value="privacy" className="p-4">
                <p>Related settings should be grouped together</p>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-muted-foreground">High cognitive load - consider grouping or progressive disclosure</p>
          </div>
        </div>
      </>
    );
  },
};

/**
 * Wayfinding Intelligence
 *
 * Clear active states and navigation context prevent user confusion.
 * Breadcrumb patterns show location within complex tab structures.
 */
export const WayfindingIntelligence: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    
    const tabs = [
      { value: 'dashboard', label: 'Dashboard' },
      { value: 'analytics', label: 'Analytics' },
      { value: 'reports', label: 'Reports' },
      { value: 'settings', label: 'Settings' }
    ];
    
    return (
      <>
        <h3>Navigation Context and Wayfinding</h3>
        
        <div className="w-full max-w-2xl space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} wayfinding>
            <TabsBreadcrumb activeTab={activeTab} tabs={tabs} />
            <TabsList variant="underline">
              <TabsTrigger value="dashboard" icon="📊">Dashboard</TabsTrigger>
              <TabsTrigger value="analytics" icon="📈" badge="3">Analytics</TabsTrigger>
              <TabsTrigger value="reports" icon="📋">Reports</TabsTrigger>
              <TabsTrigger value="settings" icon="⚙️">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="p-4 border rounded">
              <h4 className="font-medium mb-2">Dashboard Overview</h4>
              <p>Clear visual feedback shows current location in navigation hierarchy</p>
            </TabsContent>
            <TabsContent value="analytics" className="p-4 border rounded">
              <h4 className="font-medium mb-2">Analytics Data</h4>
              <p>Badge notifications provide context without overwhelming</p>
            </TabsContent>
            <TabsContent value="reports" className="p-4 border rounded">
              <h4 className="font-medium mb-2">Report Generation</h4>
              <p>Icons help with recognition and reduce cognitive load</p>
            </TabsContent>
            <TabsContent value="settings" className="p-4 border rounded">
              <h4 className="font-medium mb-2">System Settings</h4>
              <p>Consistent patterns build user confidence</p>
            </TabsContent>
          </Tabs>
          
          <p className="text-xs text-muted-foreground">
            Breadcrumb shows location, icons aid recognition, badges provide context
          </p>
        </div>
      </>
    );
  },
};

/**
 * Mental Model Building
 *
 * Consistent patterns and logical grouping help users build accurate mental models.
 * Progressive disclosure manages complexity without hiding functionality.
 */
export const MentalModelBuilding: Story = {
  render: () => {
    const [activeSection, setActiveSection] = useState('account');
    const [activeSubTab, setActiveSubTab] = useState('profile');
    
    return (
      <>
        <h3>Hierarchical Mental Models</h3>
        
        <div className="w-full max-w-3xl space-y-4">
          {/* Primary navigation level */}
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList variant="pills" density="spacious">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="workspace">Workspace</TabsTrigger>
              <TabsTrigger value="integration">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="mt-4">
              {/* Secondary navigation level */}
              <Tabs value={activeSubTab} onValueChange={setActiveSubTab} orientation="horizontal">
                <TabsList variant="underline" density="comfortable">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="p-4 bg-muted/30 rounded mt-2">
                  <h4 className="font-medium mb-2">Profile Information</h4>
                  <p>Personal details and public information settings</p>
                </TabsContent>
                <TabsContent value="security" className="p-4 bg-muted/30 rounded mt-2">
                  <h4 className="font-medium mb-2">Security Settings</h4>
                  <p>Password, two-factor authentication, and login history</p>
                </TabsContent>
                <TabsContent value="preferences" className="p-4 bg-muted/30 rounded mt-2">
                  <h4 className="font-medium mb-2">User Preferences</h4>
                  <p>Theme, language, and notification settings</p>
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="workspace" className="p-4 bg-muted/30 rounded">
              <h4 className="font-medium mb-2">Workspace Settings</h4>
              <p>Team management, project settings, and collaboration tools</p>
            </TabsContent>
            
            <TabsContent value="integration" className="p-4 bg-muted/30 rounded">
              <h4 className="font-medium mb-2">Integration Management</h4>
              <p>Connected services, API keys, and third-party applications</p>
            </TabsContent>
          </Tabs>
          
          <p className="text-xs text-muted-foreground">
            Hierarchical organization builds clear mental models of system structure
          </p>
        </div>
      </>
    );
  },
};

/**
 * Motor Accessibility Focus
 *
 * Enhanced touch targets and keyboard navigation reduce interaction barriers.
 * Clear focus states and proper ARIA attributes support all interaction methods.
 */
export const MotorAccessibilityFocus: Story = {
  render: () => (
    <>
      <h3>Enhanced Motor Accessibility</h3>
      
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Large Touch Targets</h4>
          <Tabs defaultValue="home">
            <TabsList density="spacious">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="home" className="p-4">
              <p>44px minimum touch targets meet accessibility guidelines</p>
            </TabsContent>
            <TabsContent value="products" className="p-4">
              <p>Enhanced spacing prevents accidental activation</p>
            </TabsContent>
            <TabsContent value="services" className="p-4">
              <p>Consistent hit areas reduce motor precision requirements</p>
            </TabsContent>
            <TabsContent value="contact" className="p-4">
              <p>Generous padding accommodates various interaction methods</p>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Keyboard Navigation Support</h4>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3" disabled>Disabled</TabsTrigger>
              <TabsTrigger value="tab4">Tab 4</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="p-4">
              <p>Arrow keys navigate between tabs, Enter/Space activates</p>
            </TabsContent>
            <TabsContent value="tab2" className="p-4">
              <p>Focus indicators clearly show current position</p>
            </TabsContent>
            <TabsContent value="tab4" className="p-4">
              <p>Disabled tabs are properly skipped in navigation</p>
            </TabsContent>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            Full keyboard support with clear focus indicators and proper tab order
          </p>
        </div>
      </div>
    </>
  ),
};
