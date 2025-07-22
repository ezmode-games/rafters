import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/Card';

/**
 * Semantic card patterns communicate purpose and meaning through context.
 * They organize information in ways that match user mental models and expectations.
 */
const meta = {
  title: '03 Components/Layout/Card/Semantic Meaning & Context',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic card patterns that communicate specific meaning and context through visual hierarchy, content organization, and interaction patterns.',
      },
    },
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Content Hierarchy Communication
 *
 * Cards establish clear information architecture through semantic heading levels
 * and visual prominence that matches content importance.
 */
export const ContentHierarchy: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-medium mb-6">Semantic Content Hierarchy</h3>
      <div className="space-y-6">
        
        {/* Primary Content Section */}
        <section>
          <Card prominence="elevated" className="border-l-4 border-l-primary">
            <CardHeader density="spacious">
              <CardTitle level={2} weight="bold">
                Primary Feature Announcement
              </CardTitle>
              <CardDescription prominence="enhanced">
                Most important information with highest semantic priority and visual emphasis
              </CardDescription>
            </CardHeader>
            <CardContent density="spacious">
              <div className="bg-primary/10 p-4 rounded-md">
                <p className="text-sm font-medium text-primary mb-2">
                  New Design System Release
                </p>
                <p className="text-sm text-muted-foreground">
                  Our comprehensive design system now includes enhanced accessibility features,
                  expanded component library, and improved developer experience with better documentation.
                </p>
              </div>
            </CardContent>
            <CardFooter density="spacious" justify="center">
              <Button variant="primary" size="lg">
                Explore New Features
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Supporting Content Subsections */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card prominence="default">
              <CardHeader density="comfortable">
                <CardTitle level={3} weight="semibold">
                  Component Updates
                </CardTitle>
                <CardDescription prominence="default">
                  Enhanced functionality across existing components
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">Button Component</div>
                      <div className="text-muted-foreground text-xs">New size variants and loading states</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">Input Component</div>
                      <div className="text-muted-foreground text-xs">Improved validation patterns</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium">Card Component</div>
                      <div className="text-muted-foreground text-xs">Adaptive density and interaction patterns</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter justify="end">
                <Button variant="outline" size="sm">
                  View Updates
                </Button>
              </CardFooter>
            </Card>

            <Card prominence="default">
              <CardHeader density="comfortable">
                <CardTitle level={3} weight="semibold">
                  Documentation Improvements
                </CardTitle>
                <CardDescription prominence="default">
                  Enhanced guides and implementation examples
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <div className="space-y-3 text-sm">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="font-medium text-xs mb-1">New Sections</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Accessibility Guidelines</div>
                      <div>• Implementation Patterns</div>
                      <div>• Best Practices</div>
                      <div>• Interactive Examples</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter justify="end">
                <Button variant="outline" size="sm">
                  Read Docs
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Detail Level Subsections */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card prominence="subtle">
              <CardHeader density="compact">
                <CardTitle level={4} weight="medium">
                  Migration Guide
                </CardTitle>
                <CardDescription prominence="muted">
                  Step-by-step upgrade instructions
                </CardDescription>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-xs text-muted-foreground">
                  Detailed instructions for upgrading from previous versions with minimal breaking changes.
                </p>
              </CardContent>
              <CardFooter density="compact" justify="end">
                <Button variant="ghost" size="sm">
                  Guide
                </Button>
              </CardFooter>
            </Card>

            <Card prominence="subtle">
              <CardHeader density="compact">
                <CardTitle level={4} weight="medium">
                  Release Notes
                </CardTitle>
                <CardDescription prominence="muted">
                  Complete changelog and updates
                </CardDescription>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-xs text-muted-foreground">
                  Comprehensive list of changes, improvements, and bug fixes in this release.
                </p>
              </CardContent>
              <CardFooter density="compact" justify="end">
                <Button variant="ghost" size="sm">
                  Notes
                </Button>
              </CardFooter>
            </Card>

            <Card prominence="subtle">
              <CardHeader density="compact">
                <CardTitle level={4} weight="medium">
                  Community
                </CardTitle>
                <CardDescription prominence="muted">
                  Connect with other users
                </CardDescription>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-xs text-muted-foreground">
                  Join discussions, share feedback, and get help from the community.
                </p>
              </CardContent>
              <CardFooter density="compact" justify="end">
                <Button variant="ghost" size="sm">
                  Join
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Hierarchy Principles</h4>
        <p className="text-xs text-muted-foreground">
          <strong>H2 (Primary):</strong> Main announcement with elevated prominence<br />
          <strong>H3 (Supporting):</strong> Related features with default prominence<br />
          <strong>H4 (Details):</strong> Supplementary information with subtle prominence
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Content hierarchy patterns that use semantic heading levels and visual prominence to create clear information architecture.',
      },
    },
  },
};

/**
 * Contextual Purpose Communication
 *
 * Cards communicate their specific purpose through visual treatment,
 * content organization, and interaction patterns that match user expectations.
 */
export const ContextualPurpose: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <h3 className="text-lg font-medium mb-6">Contextual Purpose Patterns</h3>
      <div className="space-y-8">
        
        {/* Dashboard Context */}
        <section>
          <h4 className="text-base font-medium mb-4">Dashboard Metrics Context</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card prominence="default" className="border-l-4 border-l-green-500">
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Revenue
                </CardTitle>
                <CardDescription prominence="muted" className="text-xs">
                  Total monthly earnings
                </CardDescription>
              </CardHeader>
              <CardContent density="compact">
                <div className="text-2xl font-bold text-green-600">$45,678</div>
                <div className="text-xs text-green-600">+12.3% from last month</div>
              </CardContent>
            </Card>

            <Card prominence="default" className="border-l-4 border-l-blue-500">
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Users
                </CardTitle>
                <CardDescription prominence="muted" className="text-xs">
                  Active this month
                </CardDescription>
              </CardHeader>
              <CardContent density="compact">
                <div className="text-2xl font-bold text-blue-600">2,547</div>
                <div className="text-xs text-blue-600">+8.1% from last month</div>
              </CardContent>
            </Card>

            <Card prominence="default" className="border-l-4 border-l-purple-500">
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Conversion
                </CardTitle>
                <CardDescription prominence="muted" className="text-xs">
                  Rate this month
                </CardDescription>
              </CardHeader>
              <CardContent density="compact">
                <div className="text-2xl font-bold text-purple-600">3.4%</div>
                <div className="text-xs text-purple-600">+0.3% from last month</div>
              </CardContent>
            </Card>

            <Card prominence="default" className="border-l-4 border-l-orange-500">
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Orders
                </CardTitle>
                <CardDescription prominence="muted" className="text-xs">
                  Completed this month
                </CardDescription>
              </CardHeader>
              <CardContent density="compact">
                <div className="text-2xl font-bold text-orange-600">1,234</div>
                <div className="text-xs text-orange-600">+15.7% from last month</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Article/Content Context */}
        <section>
          <h4 className="text-base font-medium mb-4">Article Collection Context</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card prominence="elevated" className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="semibold">
                  Featured Article
                </CardTitle>
                <CardDescription prominence="enhanced">
                  Editor's pick for this week
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground mb-3">
                  Deep dive into modern design patterns and their impact on user experience
                  across different platforms and devices.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>12 min read</span>
                  <span>•</span>
                  <span>March 15, 2024</span>
                </div>
              </CardContent>
              <CardFooter justify="end">
                <Button variant="primary" size="sm">
                  Read Article
                </Button>
              </CardFooter>
            </Card>

            <Card prominence="default">
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="medium">
                  Component Architecture
                </CardTitle>
                <CardDescription prominence="default">
                  Building scalable design systems
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground mb-3">
                  Best practices for creating maintainable and consistent component libraries
                  that scale with your product needs.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>8 min read</span>
                  <span>•</span>
                  <span>March 12, 2024</span>
                </div>
              </CardContent>
              <CardFooter justify="end">
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </CardFooter>
            </Card>

            <Card prominence="default">
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="medium">
                  Accessibility Guidelines
                </CardTitle>
                <CardDescription prominence="default">
                  Inclusive design principles
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive guide to building accessible interfaces that work for
                  everyone, regardless of ability or device.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>15 min read</span>
                  <span>•</span>
                  <span>March 10, 2024</span>
                </div>
              </CardContent>
              <CardFooter justify="end">
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Action/Task Context */}
        <section>
          <h4 className="text-base font-medium mb-4">Action-Oriented Context</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card interactive prominence="elevated" onClick={() => alert('Quick setup started!')}>
              <CardHeader density="spacious">
                <CardTitle level={4} weight="semibold">
                  Quick Setup
                </CardTitle>
                <CardDescription prominence="enhanced">
                  Get started in under 5 minutes
                </CardDescription>
              </CardHeader>
              <CardContent density="spacious">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                      1
                    </div>
                    <span>Install components</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <span>Configure theme</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <span>Start building</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter density="spacious" justify="center">
                <span className="text-xs text-muted-foreground">Click anywhere to start →</span>
              </CardFooter>
            </Card>

            <Card prominence="default">
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="medium">
                  Advanced Configuration
                </CardTitle>
                <CardDescription prominence="default">
                  Customize for specific needs
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed configuration options for teams with specific requirements
                  and complex integration needs.
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    ✓ Custom theme configuration
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ✓ Advanced component customization
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ✓ Integration with existing systems
                  </div>
                </div>
              </CardContent>
              <CardFooter justify="between">
                <Button variant="ghost" size="sm">
                  Learn More
                </Button>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Contextual purpose patterns that communicate specific card functions through visual treatment and content organization.',
      },
    },
  },
};

/**
 * Progressive Disclosure Patterns
 *
 * Cards reveal information at appropriate levels of detail,
 * supporting efficient scanning and progressive engagement.
 */
export const ProgressiveDisclosure: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-medium mb-6">Progressive Information Disclosure</h3>
      <div className="space-y-8">
        
        {/* Summary to Detail Progression */}
        <section>
          <h4 className="text-base font-medium mb-4">Summary → Detail Progression</h4>
          <div className="space-y-4">
            
            {/* High-level Summary */}
            <Card prominence="elevated">
              <CardHeader density="comfortable">
                <CardTitle level={3} weight="semibold">
                  Project Status Overview
                </CardTitle>
                <CardDescription prominence="enhanced">
                  High-level summary of all active projects
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-xs text-muted-foreground">In Progress</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <div className="text-xs text-muted-foreground">Planning</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter justify="center">
                <Button variant="primary" size="sm">
                  View All Projects
                </Button>
              </CardFooter>
            </Card>

            {/* Category Level Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card prominence="default">
                <CardHeader density="comfortable">
                  <CardTitle level={4} weight="medium">
                    Development Projects
                  </CardTitle>
                  <CardDescription prominence="default">
                    Technical implementation and feature development
                  </CardDescription>
                </CardHeader>
                <CardContent density="comfortable">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Mobile App Redesign</span>
                      <span className="text-green-600 font-medium">75%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Integration</span>
                      <span className="text-blue-600 font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance Optimization</span>
                      <span className="text-yellow-600 font-medium">Planning</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter justify="end">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </CardFooter>
              </Card>

              <Card prominence="default">
                <CardHeader density="comfortable">
                  <CardTitle level={4} weight="medium">
                    Design Projects
                  </CardTitle>
                  <CardDescription prominence="default">
                    User experience and visual design initiatives
                  </CardDescription>
                </CardHeader>
                <CardContent density="comfortable">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Design System Update</span>
                      <span className="text-green-600 font-medium">Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User Research Study</span>
                      <span className="text-blue-600 font-medium">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accessibility Audit</span>
                      <span className="text-yellow-600 font-medium">Planning</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter justify="end">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Individual Item Detail */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card prominence="subtle">
                <CardHeader density="compact">
                  <CardTitle level={5} weight="medium">
                    Mobile App Redesign
                  </CardTitle>
                  <CardDescription prominence="muted" className="text-xs">
                    Due: March 30, 2024
                  </CardDescription>
                </CardHeader>
                <CardContent density="compact">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>UI Components:</span>
                      <span className="text-green-600">Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User Testing:</span>
                      <span className="text-blue-600">In Progress</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Final Review:</span>
                      <span className="text-muted-foreground">Pending</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter density="compact" justify="end">
                  <Button variant="ghost" size="sm">
                    Open
                  </Button>
                </CardFooter>
              </Card>

              <Card prominence="subtle">
                <CardHeader density="compact">
                  <CardTitle level={5} weight="medium">
                    API Integration
                  </CardTitle>
                  <CardDescription prominence="muted" className="text-xs">
                    Due: April 15, 2024
                  </CardDescription>
                </CardHeader>
                <CardContent density="compact">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Authentication:</span>
                      <span className="text-green-600">Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Sync:</span>
                      <span className="text-blue-600">In Progress</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Handling:</span>
                      <span className="text-muted-foreground">Not Started</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter density="compact" justify="end">
                  <Button variant="ghost" size="sm">
                    Open
                  </Button>
                </CardFooter>
              </Card>

              <Card prominence="subtle">
                <CardHeader density="compact">
                  <CardTitle level={5} weight="medium">
                    Performance Optimization
                  </CardTitle>
                  <CardDescription prominence="muted" className="text-xs">
                    Due: May 1, 2024
                  </CardDescription>
                </CardHeader>
                <CardContent density="compact">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Analysis:</span>
                      <span className="text-muted-foreground">Planning</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Implementation:</span>
                      <span className="text-muted-foreground">Not Started</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Testing:</span>
                      <span className="text-muted-foreground">Not Started</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter density="compact" justify="end">
                  <Button variant="ghost" size="sm">
                    Open
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Disclosure Patterns</h4>
        <p className="text-xs text-muted-foreground">
          <strong>Overview Level:</strong> High-level metrics and summaries<br />
          <strong>Category Level:</strong> Grouped information with moderate detail<br />
          <strong>Item Level:</strong> Specific details and actionable information
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Progressive disclosure patterns that reveal information at appropriate levels of detail for efficient scanning and engagement.',
      },
    },
  },
};