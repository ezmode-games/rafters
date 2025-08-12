import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/Tabs';

const meta = {
  title: 'Components/Tabs/Properties',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Configuration
 *
 * Standard tabs with optimal cognitive load and clear visual hierarchy.
 * Default configuration balances functionality with simplicity.
 */
export const Default: Story = {
  args: {
    defaultValue: 'overview',
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="p-phi-2">
          <h3 className="heading-component">Overview</h3>
          <p className="text-body">Primary information and key metrics</p>
        </div>
      </TabsContent>
      <TabsContent value="details">
        <div className="p-phi-2">
          <h3 className="heading-component">Details</h3>
          <p className="text-body">Comprehensive data and detailed views</p>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="p-phi-2">
          <h3 className="heading-component">Settings</h3>
          <p className="text-body">Configuration and preference controls</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default tabs configuration with standard cognitive load and clear visual hierarchy for most use cases.',
      },
    },
  },
};

/**
 * Cognitive Load Variations
 *
 * Different configurations optimize for various cognitive complexity levels.
 * Minimal load for simple choices, standard for balanced use, complex for power users.
 */
export const CognitiveLoadLevels: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl space-y-phi-3">
      <div>
        <h2 className="heading-component">Minimal Cognitive Load</h2>
        <p className="text-body-small">
          Three options represent the sweet spot for quick decision making
        </p>

        <div className="mt-phi-2">
          <Tabs defaultValue="create" cognitiveLoad="minimal">
            <TabsList>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="delete">Delete</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <p className="text-body">Simple action with immediate understanding</p>
            </TabsContent>
            <TabsContent value="edit">
              <p className="text-body">Clear modification workflow</p>
            </TabsContent>
            <TabsContent value="delete">
              <p className="text-body">Obvious destructive action</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div>
        <h2 className="heading-component">Standard Cognitive Load</h2>
        <p className="text-body-small">
          Five to six options balance functionality with scanability
        </p>

        <div className="mt-phi-2">
          <Tabs defaultValue="dashboard" cognitiveLoad="standard">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <p className="text-body">Primary workspace with key information</p>
            </TabsContent>
            <TabsContent value="analytics">
              <p className="text-body">Data insights and performance metrics</p>
            </TabsContent>
            <TabsContent value="reports">
              <p className="text-body">Generated summaries and exports</p>
            </TabsContent>
            <TabsContent value="settings">
              <p className="text-body">Configuration and preferences</p>
            </TabsContent>
            <TabsContent value="help">
              <p className="text-body">Documentation and support resources</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div>
        <h2 className="heading-component">Complex Cognitive Load</h2>
        <p className="text-body-small">
          Seven or more options require careful organization and may benefit from grouping
        </p>

        <div className="mt-phi-2">
          <Tabs defaultValue="general" cognitiveLoad="complex">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <p className="text-body">Basic account and profile settings</p>
            </TabsContent>
            <TabsContent value="security">
              <p className="text-body">Password and authentication controls</p>
            </TabsContent>
            <TabsContent value="privacy">
              <p className="text-body">Data sharing and visibility preferences</p>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-body-small text-muted-foreground mt-phi-1">
          Consider hierarchical organization or progressive disclosure for complex navigation
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Different cognitive load configurations optimize for various complexity levels and user contexts.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Orientation Options
 *
 * Tabs support both horizontal and vertical orientations for different
 * layout contexts and content organization patterns.
 */
export const Orientation: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl space-y-phi-3">
      <div>
        <h2 className="heading-component">Horizontal Orientation</h2>
        <p className="text-body-small">
          Standard horizontal layout optimizes for scanning and quick navigation
        </p>

        <div className="mt-phi-2">
          <Tabs defaultValue="home" orientation="horizontal">
            <TabsList>
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="home">
              <p className="text-body">Horizontal tabs work well for top-level navigation</p>
            </TabsContent>
            <TabsContent value="products">
              <p className="text-body">Easy scanning across related content sections</p>
            </TabsContent>
            <TabsContent value="about">
              <p className="text-body">Familiar pattern that builds on established conventions</p>
            </TabsContent>
            <TabsContent value="contact">
              <p className="text-body">Optimal for desktop and tablet interfaces</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div>
        <h2 className="heading-component">Vertical Orientation</h2>
        <p className="text-body-small">
          Vertical layout accommodates longer labels and complex hierarchies
        </p>

        <div className="mt-phi-2">
          <Tabs defaultValue="account" orientation="vertical" className="w-full">
            <div className="flex gap-phi-2">
              <TabsList className="flex-col w-64">
                <TabsTrigger value="account">Account Settings</TabsTrigger>
                <TabsTrigger value="notifications">Notification Preferences</TabsTrigger>
                <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
                <TabsTrigger value="integrations">External Integrations</TabsTrigger>
              </TabsList>
              <div className="flex-1">
                <TabsContent value="account">
                  <h3 className="heading-component">Account Settings</h3>
                  <p className="text-body">
                    Vertical orientation supports longer, descriptive labels
                  </p>
                </TabsContent>
                <TabsContent value="notifications">
                  <h3 className="heading-component">Notification Preferences</h3>
                  <p className="text-body">
                    Better for complex settings with detailed descriptions
                  </p>
                </TabsContent>
                <TabsContent value="privacy">
                  <h3 className="heading-component">Privacy Controls</h3>
                  <p className="text-body">Accommodates hierarchical content organization</p>
                </TabsContent>
                <TabsContent value="integrations">
                  <h3 className="heading-component">External Integrations</h3>
                  <p className="text-body">Works well for sidebar navigation patterns</p>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Orientation options that adapt tabs to different layout contexts and content organization needs.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Disabled States
 *
 * Disabled tabs maintain layout structure while clearly communicating
 * unavailability through visual and semantic indicators.
 */
export const DisabledStates: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h2 className="heading-component">State Communication</h2>
      <p className="text-body-small">
        Disabled tabs communicate temporary unavailability while maintaining navigation structure
      </p>

      <div className="mt-phi-2">
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Content</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="disabled" disabled>
              Locked Feature
            </TabsTrigger>
            <TabsTrigger value="available">Available Soon</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <p className="text-body">Currently available content with full interaction support</p>
          </TabsContent>
          <TabsContent value="pending">
            <p className="text-body">Content awaiting approval or processing before activation</p>
          </TabsContent>
          <TabsContent value="available">
            <p className="text-body">Features in development or requiring specific permissions</p>
          </TabsContent>
        </Tabs>

        <p className="text-body-small text-muted-foreground mt-phi-1">
          Disabled tabs are skipped in keyboard navigation and clearly marked for screen readers
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Disabled states that maintain layout structure while clearly communicating temporary unavailability.',
      },
    },
  },
};

/**
 * Wayfinding Enhancement
 *
 * Wayfinding features help users understand their location in complex
 * navigation hierarchies through contextual indicators.
 */
export const WayfindingFeatures: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h2 className="heading-component">Navigation Context</h2>
      <p className="text-body-small">
        Wayfinding enhancements provide context for complex navigation hierarchies
      </p>

      <div className="mt-phi-2">
        <Tabs defaultValue="dashboard" wayfinding={true}>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects (12)</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <p className="text-body">
              Enhanced context helps users understand their current location
            </p>
          </TabsContent>
          <TabsContent value="projects">
            <p className="text-body">
              Count indicators provide additional context without overwhelming
            </p>
          </TabsContent>
          <TabsContent value="team">
            <p className="text-body">
              Clear labeling builds accurate mental models of system structure
            </p>
          </TabsContent>
          <TabsContent value="settings">
            <p className="text-body">
              Consistent patterns across contexts build navigation confidence
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Wayfinding enhancements that provide navigation context for complex hierarchies without overwhelming users.',
      },
    },
  },
};
