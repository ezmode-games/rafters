import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/Tabs';

/**
 * Semantic tabs communicate meaning and context through careful information architecture.
 * They provide immediate understanding of content organization and data relationships.
 */
const meta = {
  title: '03 Components/Navigation/Tabs/Semantic Meaning & Context',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic tab patterns that communicate specific meaning and context through carefully chosen organization and visual hierarchy.',
      },
    },
  },
  tags: ['autodocs'],
  args: { onValueChange: fn() },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Content Lifecycle
 *
 * Tabs organized by content state communicate workflow progression.
 * Sequential organization helps users understand process flow.
 */
export const ContentLifecycle: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Content Workflow</h3>
      <Tabs defaultValue="draft">
        <TabsList>
          <TabsTrigger value="draft" badge="12">
            Draft
          </TabsTrigger>
          <TabsTrigger value="review" badge="3">
            In Review
          </TabsTrigger>
          <TabsTrigger value="published" badge="45">
            Published
          </TabsTrigger>
          <TabsTrigger value="archived" badge="8">
            Archived
          </TabsTrigger>
        </TabsList>
        <TabsContent value="draft" className="space-y-3">
          <div className="p-4 bg-muted/30 rounded-md">
            <h4 className="font-medium text-sm mb-2">Draft Articles</h4>
            <p className="text-sm text-muted-foreground">
              Work-in-progress content that can be edited freely
            </p>
            <div className="mt-3 space-y-2">
              <div className="p-2 bg-background rounded border">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Introduction to Design Systems</span>
                  <span className="text-xs text-muted-foreground">Draft</span>
                </div>
              </div>
              <div className="p-2 bg-background rounded border">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Component Architecture Guide</span>
                  <span className="text-xs text-muted-foreground">Draft</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="review" className="space-y-3">
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-md">
            <h4 className="font-medium text-sm mb-2">Under Review</h4>
            <p className="text-sm text-muted-foreground">
              Content awaiting editorial approval before publication
            </p>
            <div className="mt-3 space-y-2">
              <div className="p-2 bg-background rounded border">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Accessibility Best Practices</span>
                  <span className="text-xs text-warning">Pending Review</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="published" className="space-y-3">
          <div className="p-4 bg-success/10 border border-success/20 rounded-md">
            <h4 className="font-medium text-sm mb-2">Live Content</h4>
            <p className="text-sm text-muted-foreground">
              Published articles visible to all readers
            </p>
            <div className="mt-3 space-y-2">
              <div className="p-2 bg-background rounded border">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Getting Started with Rafters</span>
                  <span className="text-xs text-success">Published</span>
                </div>
              </div>
              <div className="p-2 bg-background rounded border">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Trust-Building in UI Design</span>
                  <span className="text-xs text-success">Published</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="archived" className="space-y-3">
          <div className="p-4 bg-muted/20 rounded-md">
            <h4 className="font-medium text-sm mb-2">Archived Content</h4>
            <p className="text-sm text-muted-foreground">
              No longer active but preserved for reference
            </p>
            <div className="mt-3 space-y-2">
              <div className="p-2 bg-background rounded border opacity-75">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Legacy Component Guide v1</span>
                  <span className="text-xs text-muted-foreground">Archived</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground mt-4">
        Content lifecycle tabs with badge counts communicate workflow status
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Content lifecycle tabs organize information by workflow state, helping users understand process progression and current status.',
      },
    },
  },
};

/**
 * Information Hierarchy
 *
 * Tabs organized by detail level communicate information depth.
 * Progressive disclosure from overview to specific details.
 */
export const InformationHierarchy: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Data Analysis Dashboard</h3>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="details">Raw Data</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-primary/10 rounded-md text-center">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="p-3 bg-success/10 rounded-md text-center">
              <div className="text-2xl font-bold">+18%</div>
              <div className="text-sm text-muted-foreground">Growth</div>
            </div>
            <div className="p-3 bg-warning/10 rounded-md text-center">
              <div className="text-2xl font-bold">94%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            High-level summary for quick decision making
          </p>
        </TabsContent>
        <TabsContent value="metrics" className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Daily Active Users</span>
              <span className="text-lg">892</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Session Duration</span>
              <span className="text-lg">12m 34s</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Conversion Rate</span>
              <span className="text-lg">3.7%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Detailed metrics for performance analysis</p>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-md">
            <h4 className="font-medium mb-2">30-Day Trends</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">User Growth</span>
                <span className="text-sm text-success">↗ +18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Engagement</span>
                <span className="text-sm text-success">↗ +12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Retention</span>
                <span className="text-sm text-warning">↘ -3%</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Trend analysis for strategic planning</p>
        </TabsContent>
        <TabsContent value="details" className="space-y-4">
          <div className="p-3 bg-muted/10 rounded-md font-mono text-xs">
            <div className="space-y-1">
              <div>2024-01-15 14:32:17 | user_signup | id:8472 | source:organic</div>
              <div>2024-01-15 14:31:45 | page_view | /dashboard | session:a7b3c9d</div>
              <div>2024-01-15 14:30:22 | user_login | id:7239 | device:mobile</div>
              <div>2024-01-15 14:29:18 | feature_click | button:export | user:7239</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Raw event data for detailed investigation</p>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground mt-4">
        Information hierarchy from high-level overview to granular details
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Information hierarchy tabs organize content by detail level, enabling progressive disclosure from overview to specific data.',
      },
    },
  },
};

/**
 * User Journey Context
 *
 * Tabs organized by user roles communicate different perspectives.
 * Role-based organization helps users find relevant information.
 */
export const UserJourneyContext: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Project Documentation</h3>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">For Users</TabsTrigger>
          <TabsTrigger value="developers">For Developers</TabsTrigger>
          <TabsTrigger value="designers">For Designers</TabsTrigger>
          <TabsTrigger value="managers">For Managers</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
            <h4 className="font-medium mb-2">📋 Getting Started</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• How to create your first project</li>
              <li>• Understanding the dashboard</li>
              <li>• Basic navigation and features</li>
              <li>• Frequently asked questions</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            User-focused documentation with step-by-step guides
          </p>
        </TabsContent>
        <TabsContent value="developers" className="space-y-4">
          <div className="p-4 bg-info/5 border border-info/20 rounded-md">
            <h4 className="font-medium mb-2">⚡ Technical Setup</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• API documentation and endpoints</li>
              <li>• Authentication and security</li>
              <li>• Code examples and SDKs</li>
              <li>• Deployment and configuration</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Technical documentation for integration and development
          </p>
        </TabsContent>
        <TabsContent value="designers" className="space-y-4">
          <div className="p-4 bg-success/5 border border-success/20 rounded-md">
            <h4 className="font-medium mb-2">🎨 Design Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Design system and components</li>
              <li>• Figma libraries and templates</li>
              <li>• Brand guidelines and assets</li>
              <li>• Accessibility requirements</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Design-focused resources and creative guidelines
          </p>
        </TabsContent>
        <TabsContent value="managers" className="space-y-4">
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-md">
            <h4 className="font-medium mb-2">📊 Management Overview</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Team onboarding and training</li>
              <li>• Usage analytics and reporting</li>
              <li>• Billing and subscription management</li>
              <li>• Security and compliance</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Management-oriented information for oversight and planning
          </p>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground mt-4">
        Role-based tabs organize information by user journey and responsibilities
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'User journey tabs organize content by role and perspective, helping different user types find relevant information quickly.',
      },
    },
  },
};

/**
 * Temporal Context
 *
 * Tabs organized by time periods communicate chronological relationships.
 * Time-based organization helps users understand historical context.
 */
export const TemporalContext: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Activity Timeline</h3>
      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today" badge="8">
            Today
          </TabsTrigger>
          <TabsTrigger value="week" badge="47">
            This Week
          </TabsTrigger>
          <TabsTrigger value="month" badge="203">
            This Month
          </TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Project milestone completed</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <p className="text-xs text-muted-foreground">Design system v2.0 released</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded">
              <div className="w-2 h-2 rounded-full bg-success mt-2" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Team member joined</span>
                  <span className="text-xs text-muted-foreground">4 hours ago</span>
                </div>
                <p className="text-xs text-muted-foreground">Sarah Chen added to design team</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Recent activity for immediate awareness</p>
        </TabsContent>
        <TabsContent value="week" className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/20 rounded text-center">
              <div className="text-xl font-bold">23</div>
              <div className="text-xs text-muted-foreground">Tasks Completed</div>
            </div>
            <div className="p-3 bg-muted/20 rounded text-center">
              <div className="text-xl font-bold">5</div>
              <div className="text-xs text-muted-foreground">Meetings Held</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Weekly summary for progress tracking</p>
        </TabsContent>
        <TabsContent value="month" className="space-y-3">
          <div className="p-4 bg-muted/10 rounded">
            <h4 className="font-medium text-sm mb-2">Monthly Achievements</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 3 major features launched</li>
              <li>• 15 team members onboarded</li>
              <li>• 92% customer satisfaction maintained</li>
              <li>• 5 process improvements implemented</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Monthly overview for performance evaluation
          </p>
        </TabsContent>
        <TabsContent value="all" className="space-y-3">
          <div className="p-4 bg-muted/10 rounded">
            <h4 className="font-medium text-sm mb-2">Historical Overview</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Projects</span>
                <span className="text-sm font-medium">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Team Size Growth</span>
                <span className="text-sm font-medium">3 → 24 people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Customer Base</span>
                <span className="text-sm font-medium">2.3K+ users</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Complete history for strategic analysis</p>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground mt-4">
        Temporal tabs organize information by time periods for contextual understanding
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Temporal context tabs organize information by time periods, helping users understand historical progression and current activity.',
      },
    },
  },
};

/**
 * Semantic Comparison
 *
 * Side-by-side comparison helps understand semantic organization patterns
 * and appropriate usage for different content types and contexts.
 */
export const SemanticComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Process-based */}
        <div className="space-y-3">
          <h4 className="font-medium">Process-Based Organization</h4>
          <Tabs defaultValue="planning">
            <TabsList variant="pills" density="compact">
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="execution">Execution</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            <TabsContent value="planning">
              <p className="text-sm text-muted-foreground">Workflow stage organization</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Priority-based */}
        <div className="space-y-3">
          <h4 className="font-medium">Priority-Based Organization</h4>
          <Tabs defaultValue="high">
            <TabsList variant="pills" density="compact">
              <TabsTrigger value="high" badge="5">
                High
              </TabsTrigger>
              <TabsTrigger value="medium" badge="12">
                Medium
              </TabsTrigger>
              <TabsTrigger value="low" badge="8">
                Low
              </TabsTrigger>
            </TabsList>
            <TabsContent value="high">
              <p className="text-sm text-muted-foreground">Importance-based organization</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Category-based */}
        <div className="space-y-3">
          <h4 className="font-medium">Category-Based Organization</h4>
          <Tabs defaultValue="ui">
            <TabsList variant="underline" density="compact">
              <TabsTrigger value="ui">UI Components</TabsTrigger>
              <TabsTrigger value="utils">Utilities</TabsTrigger>
              <TabsTrigger value="hooks">Hooks</TabsTrigger>
            </TabsList>
            <TabsContent value="ui">
              <p className="text-sm text-muted-foreground">Functional categorization</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Status-based */}
        <div className="space-y-3">
          <h4 className="font-medium">Status-Based Organization</h4>
          <Tabs defaultValue="active">
            <TabsList variant="underline" density="compact">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <p className="text-sm text-muted-foreground">State-based organization</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Different semantic organization patterns serve different content types and user mental
        models
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of different semantic organization patterns showing how tab structure can communicate different types of meaning and context.',
      },
    },
  },
};
