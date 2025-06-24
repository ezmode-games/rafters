import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/Tabs';

const meta = {
  title: '03 Components/Navigation/Tabs/Variants',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard Navigation
 *
 * Clean, semantic tabs for primary navigation and content organization.
 * Default styling balances functionality with visual clarity.
 */
export const StandardNavigation: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h2 className="heading-component">Standard Navigation Tabs</h2>
      <p className="text-body-small">
        Clean, semantic design for primary navigation and content organization
      </p>
      
      <div className="mt-phi-2">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="p-phi-2 border border-muted rounded">
              <h3 className="heading-component">Overview</h3>
              <p className="text-body">
                Standard tabs provide clear visual hierarchy and semantic structure
              </p>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="p-phi-2 border border-muted rounded">
              <h3 className="heading-component">Analytics</h3>
              <p className="text-body">
                Consistent styling creates predictable interaction patterns
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reports">
            <div className="p-phi-2 border border-muted rounded">
              <h3 className="heading-component">Reports</h3>
              <p className="text-body">
                Clean design focuses attention on content rather than decoration
              </p>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="p-phi-2 border border-muted rounded">
              <h3 className="heading-component">Settings</h3>
              <p className="text-body">
                Semantic tokens ensure consistent behavior across the design system
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Standard navigation tabs with clean, semantic design that prioritizes functionality over decoration.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Compact Organization
 *
 * Space-efficient tabs for dense interfaces and secondary navigation.
 * Maintains accessibility while optimizing for information density.
 */
export const CompactOrganization: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl space-y-phi-3">
      <div>
        <h2 className="heading-component">Compact Interface Design</h2>
        <p className="text-body-small">
          Space-efficient layout for dense interfaces while maintaining usability
        </p>
        
        <div className="mt-phi-2 p-phi-2 border border-muted rounded">
          <div className="space-y-phi-1">
            <h3 className="heading-component">Dashboard Controls</h3>
            
            <Tabs defaultValue="filters" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="sort">Sort</TabsTrigger>
                <TabsTrigger value="view">View</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>
              <TabsContent value="filters">
                <p className="text-body-small">
                  Compact tabs work well for secondary navigation and controls
                </p>
              </TabsContent>
              <TabsContent value="sort">
                <p className="text-body-small">
                  Maintains touch target requirements while optimizing space
                </p>
              </TabsContent>
              <TabsContent value="view">
                <p className="text-body-small">
                  Grid layout ensures equal spacing and visual balance
                </p>
              </TabsContent>
              <TabsContent value="export">
                <p className="text-body-small">
                  Semantic structure maintains accessibility in compact designs
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div>
        <h2 className="heading-component">Inline Navigation</h2>
        <p className="text-body-small">
          Seamlessly integrated tabs for content switching within larger interfaces
        </p>
        
        <div className="mt-phi-2">
          <div className="space-y-phi-1">
            <h3 className="heading-component">Content Sections</h3>
            
            <Tabs defaultValue="recent">
              <TabsList className="inline-flex">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>
              <TabsContent value="recent">
                <div className="mt-phi-1 p-phi-1 bg-muted/30 rounded">
                  <p className="text-body-small">
                    Recently accessed items with inline navigation
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="popular">
                <div className="mt-phi-1 p-phi-1 bg-muted/30 rounded">
                  <p className="text-body-small">
                    Popular content organized through compact tabs
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="saved">
                <div className="mt-phi-1 p-phi-1 bg-muted/30 rounded">
                  <p className="text-body-small">
                    Saved items accessible through consistent interaction patterns
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Compact variations that optimize space while maintaining accessibility and semantic structure.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Hierarchical Navigation
 *
 * Multi-level tabs for complex information architectures and nested content.
 * Progressive disclosure manages cognitive load while preserving depth access.
 */
export const HierarchicalNavigation: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl">
      <h2 className="heading-component">Multi-Level Organization</h2>
      <p className="text-body-small">
        Hierarchical tabs organize complex content through progressive disclosure
      </p>
      
      <div className="mt-phi-2">
        <Tabs defaultValue="workspace">
          <TabsList>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <div className="mt-phi-1">
              <Tabs defaultValue="profile">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                  <div className="p-phi-2 border border-muted rounded mt-phi-1">
                    <h3 className="heading-component">Personal Profile</h3>
                    <p className="text-body">
                      Individual account settings and personal information
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="preferences">
                  <div className="p-phi-2 border border-muted rounded mt-phi-1">
                    <h3 className="heading-component">User Preferences</h3>
                    <p className="text-body">
                      Interface customization and notification settings
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="security">
                  <div className="p-phi-2 border border-muted rounded mt-phi-1">
                    <h3 className="heading-component">Security Settings</h3>
                    <p className="text-body">
                      Password management and authentication preferences
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="workspace">
            <div className="mt-phi-1">
              <Tabs defaultValue="projects">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="projects">
                  <div className="p-phi-2 border border-muted rounded mt-phi-1">
                    <h3 className="heading-component">Project Management</h3>
                    <p className="text-body">
                      Active projects and collaboration workflows
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="team">
                  <div className="p-phi-2 border border-muted rounded mt-phi-1">
                    <h3 className="heading-component">Team Collaboration</h3>
                    <p className="text-body">
                      Member management and shared workspace settings
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="resources">
                  <div className="p-phi-2 border border-muted rounded mt-phi-1">
                    <h3 className="heading-component">Shared Resources</h3>
                    <p className="text-body">
                      Documents, assets, and collaborative tools
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="organization">
            <div className="mt-phi-1">
              <Tabs defaultValue="billing">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>
                <TabsContent value="billing">
                  <div className="p-phi-2 border border-muted rounded mt-phi-1">
                    <h3 className="heading-component">Billing Management</h3>
                    <p className="text-body">
                      Subscription details and payment information
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="users">
                  <div className="p-phi-2 border border-muted rounded mt-phi-1">
                    <h3 className="heading-component">User Administration</h3>
                    <p className="text-body">
                      Organization-wide user management and permissions
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="integrations">
                  <div className="p-phi-2 border border-muted rounded mt-phi-1">
                    <h3 className="heading-component">System Integrations</h3>
                    <p className="text-body">
                      Third-party services and API configurations
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
        
        <p className="text-body-small text-muted-foreground mt-phi-2">
          Hierarchical organization builds clear mental models through consistent visual patterns
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Hierarchical navigation patterns that manage complex information architectures through progressive disclosure.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * State Indicators
 *
 * Visual and semantic state communication for dynamic content and workflows.
 * Context indicators enhance navigation without overwhelming users.
 */
export const StateIndicators: Story = {
  render: () => (
    <div className="container mx-auto max-w-4xl space-y-phi-3">
      <div>
        <h2 className="heading-component">Status Communication</h2>
        <p className="text-body-small">
          Clear state indicators provide context without visual decoration
        </p>
        
        <div className="mt-phi-2">
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active (24)</TabsTrigger>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <div className="p-phi-2 border border-muted rounded">
                <h3 className="heading-component">Active Items</h3>
                <p className="text-body">
                  Count indicators provide context about content volume
                </p>
              </div>
            </TabsContent>
            <TabsContent value="pending">
              <div className="p-phi-2 border border-muted rounded">
                <h3 className="heading-component">Pending Review</h3>
                <p className="text-body">
                  Status labels communicate workflow state clearly
                </p>
              </div>
            </TabsContent>
            <TabsContent value="draft">
              <div className="p-phi-2 border border-muted rounded">
                <h3 className="heading-component">Draft Content</h3>
                <p className="text-body">
                  Semantic meaning takes precedence over visual styling
                </p>
              </div>
            </TabsContent>
            <TabsContent value="archived">
              <div className="p-phi-2 border border-muted rounded">
                <h3 className="heading-component">Archived Items</h3>
                <p className="text-body">
                  Consistent labeling builds accurate mental models
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div>
        <h2 className="heading-component">Progress Indication</h2>
        <p className="text-body-small">
          Workflow progress communication through semantic structure
        </p>
        
        <div className="mt-phi-2">
          <Tabs defaultValue="setup">
            <TabsList>
              <TabsTrigger value="setup">Setup Complete</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="testing">Testing Required</TabsTrigger>
              <TabsTrigger value="deploy" disabled>Deploy</TabsTrigger>
            </TabsList>
            <TabsContent value="setup">
              <div className="p-phi-2 border border-muted rounded">
                <h3 className="heading-component">Setup Complete</h3>
                <p className="text-body">
                  Completed steps provide progress context
                </p>
              </div>
            </TabsContent>
            <TabsContent value="config">
              <div className="p-phi-2 border border-muted rounded">
                <h3 className="heading-component">Configuration</h3>
                <p className="text-body">
                  Current step in workflow progression
                </p>
              </div>
            </TabsContent>
            <TabsContent value="testing">
              <div className="p-phi-2 border border-muted rounded">
                <h3 className="heading-component">Testing Required</h3>
                <p className="text-body">
                  Action-oriented labels communicate next steps
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <p className="text-body-small text-muted-foreground mt-phi-1">
            Disabled tabs show future workflow steps while maintaining structure
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'State indicators that communicate status and progress through semantic structure rather than visual decoration.',
      },
    },
    layout: 'fullscreen',
  },
};
