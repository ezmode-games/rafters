import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Tabs';

const meta = {
  title: '03 Components/Navigation/Tabs/Accessibility',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Foundation Accessibility
 *
 * Tabs implement comprehensive keyboard navigation and screen reader support.
 * Enhanced touch targets accommodate users with different motor abilities.
 */
export const FoundationAccessibility: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h1 className="heading-section">Foundation Accessibility Principles</h1>
      <p className="text-body max-w-3xl">
        Tabs provide complete keyboard navigation, screen reader optimization, and motor accessibility
        features that exceed baseline requirements while maintaining intuitive interaction patterns.
      </p>

      <div className="mt-phi-3 space-y-phi-2">
        <div>
          <h2 className="heading-component">Enhanced Touch Targets</h2>
          <p className="text-body-small">
            Minimum 44px touch targets with generous spacing prevent accidental activation
          </p>
          
          <div className="mt-phi-2">
            <Tabs defaultValue="dashboard">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <p className="text-body">
                  Touch targets meet accessibility guidelines with enhanced padding for easier interaction
                </p>
              </TabsContent>
              <TabsContent value="analytics">
                <p className="text-body">
                  Consistent hit areas reduce motor precision requirements across devices
                </p>
              </TabsContent>
              <TabsContent value="reports">
                <p className="text-body">
                  Generous spacing accommodates various interaction methods and abilities
                </p>
              </TabsContent>
              <TabsContent value="settings">
                <p className="text-body">
                  Clear focus indicators guide keyboard and assistive technology navigation
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div>
          <h2 className="heading-component">Keyboard Navigation Excellence</h2>
          <p className="text-body-small">
            Complete keyboard support with logical focus management and clear visual indicators
          </p>
          
          <div className="mt-phi-2">
            <Tabs defaultValue="home">
              <TabsList>
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              <TabsContent value="home">
                <p className="text-body">
                  Arrow keys navigate between tabs, Enter and Space activate focused tab
                </p>
              </TabsContent>
              <TabsContent value="products">
                <p className="text-body">
                  Focus indicators clearly show current position in navigation sequence
                </p>
              </TabsContent>
              <TabsContent value="contact">
                <p className="text-body">
                  Disabled tabs are properly skipped in keyboard navigation flow
                </p>
              </TabsContent>
            </Tabs>
            
            <p className="text-body-small text-muted-foreground mt-phi-1">
              Use arrow keys to navigate, Enter/Space to activate, Tab to move to content
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Foundation accessibility principles that improve usability for everyone while ensuring inclusive design standards.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Screen Reader Optimization
 *
 * Semantic markup and ARIA attributes create clear, navigable experiences
 * for screen reader users through proper role and state communication.
 */
export const ScreenReaderOptimization: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h1 className="heading-section">Screen Reader Optimization</h1>
      <p className="text-body max-w-3xl">
        Semantic markup and ARIA attributes create clear, navigable experiences for screen reader
        users through proper role and state communication.
      </p>

      <div className="mt-phi-3 space-y-phi-2">
        <div>
          <h2 className="heading-component">ARIA Role Communication</h2>
          <p className="text-body-small">
            Proper tablist, tab, and tabpanel roles communicate structure clearly
          </p>
          
          <div className="mt-phi-2">
            <Tabs defaultValue="overview">
              <TabsList aria-label="Content sections">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <h3 className="heading-component">Overview Section</h3>
                <p className="text-body">
                  Screen readers announce tab relationships and content associations automatically
                </p>
              </TabsContent>
              <TabsContent value="details">
                <h3 className="heading-component">Details Section</h3>
                <p className="text-body">
                  ARIA selected state updates dynamically as users navigate between tabs
                </p>
              </TabsContent>
              <TabsContent value="settings">
                <h3 className="heading-component">Settings Section</h3>
                <p className="text-body">
                  Proper focus management ensures smooth navigation flow for assistive technology
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div>
          <h2 className="heading-component">State Communication</h2>
          <p className="text-body-small">
            Dynamic state updates and context information enhance navigation clarity
          </p>
          
          <div className="mt-phi-2">
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending (3)</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
                <TabsTrigger value="unavailable" disabled>Unavailable</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <p className="text-body">
                  Current tab state is communicated through aria-selected attribute
                </p>
              </TabsContent>
              <TabsContent value="pending">
                <p className="text-body">
                  Count information provides additional context without overwhelming
                </p>
              </TabsContent>
              <TabsContent value="archived">
                <p className="text-body">
                  Consistent labeling helps build accurate mental models of content organization
                </p>
              </TabsContent>
            </Tabs>
            
            <p className="text-body-small text-muted-foreground mt-phi-1">
              Screen readers announce state changes and provide count context naturally
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Screen reader optimization techniques that create clear, navigable experiences through semantic markup and ARIA attributes.',
      },
    },
    layout: 'fullscreen',
  },
};
