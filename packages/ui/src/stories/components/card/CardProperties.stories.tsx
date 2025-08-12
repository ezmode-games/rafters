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
 * Properties control card behavior and presentation patterns.
 * Each property serves specific cognitive and interaction requirements.
 */
const meta = {
  title: 'Components/Card/Properties',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Properties that control density, prominence, interactivity, and layout behavior to optimize cards for different contexts and content types.',
      },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Density Management
 *
 * Information density affects cognitive load and scanning efficiency.
 * Different density levels serve different content and spatial contexts.
 */
export const DensityManagement: Story = {
  render: () => (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Adaptive Information Density</h3>
        <p className="text-sm text-muted-foreground">
          Density properties optimize cognitive load by matching information presentation to content
          importance and available space.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader density="compact">
            <CardTitle level={5} weight="medium">
              Compact Density
            </CardTitle>
            <CardDescription prominence="default" truncate>
              High information density for dashboards, widgets, and space-constrained layouts
            </CardDescription>
          </CardHeader>
          <CardContent density="compact" layout="list">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-medium text-green-600">127</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-medium text-yellow-600">23</span>
              </div>
              <div className="flex justify-between">
                <span>Complete:</span>
                <span className="font-medium">1,456</span>
              </div>
            </div>
          </CardContent>
          <CardFooter density="compact" justify="center">
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader density="comfortable">
            <CardTitle level={4} weight="medium">
              Comfortable Density
            </CardTitle>
            <CardDescription prominence="default">
              Balanced spacing for general content cards and article previews
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <p className="text-sm text-muted-foreground">
              This is the default density setting that provides optimal balance between information
              presentation and readability for most use cases.
            </p>
            <div className="mt-3 text-xs space-y-1">
              <div>• Optimal for content consumption</div>
              <div>• Reduces visual fatigue</div>
              <div>• Supports scanning patterns</div>
            </div>
          </CardContent>
          <CardFooter density="comfortable" justify="between">
            <span className="text-xs text-muted-foreground">Standard spacing</span>
            <Button variant="outline" size="sm">
              Learn More
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader density="spacious">
            <CardTitle level={3} weight="medium">
              Spacious Density
            </CardTitle>
            <CardDescription prominence="default">
              Generous spacing for featured content and focus areas
            </CardDescription>
          </CardHeader>
          <CardContent density="spacious">
            <div className="bg-primary/10 p-4 rounded-md">
              <p className="text-sm font-medium text-primary mb-2">Premium Content</p>
              <p className="text-sm text-muted-foreground">
                Spacious density creates a sense of importance and allows for careful consideration
                of content. Ideal for featured items and call-to-action contexts.
              </p>
            </div>
          </CardContent>
          <CardFooter density="spacious" justify="center">
            <Button variant="primary" size="md">
              Get Started
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Density Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="font-medium">Compact</div>
            <div className="text-muted-foreground">Dashboards, widgets, high-density layouts</div>
          </div>
          <div>
            <div className="font-medium">Comfortable</div>
            <div className="text-muted-foreground">Content cards, articles, general use</div>
          </div>
          <div>
            <div className="font-medium">Spacious</div>
            <div className="text-muted-foreground">Featured content, focus areas, CTAs</div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Density management properties that optimize information presentation for different contexts and cognitive load requirements.',
      },
    },
  },
};

/**
 * Visual Prominence
 *
 * Prominence creates appropriate visual hierarchy and attention direction.
 * Different prominence levels guide user focus and content prioritization.
 */
export const VisualProminence: Story = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Visual Prominence Hierarchy</h3>
        <p className="text-sm text-muted-foreground">
          Prominence properties create appropriate visual weight that matches content importance and
          guides user attention effectively.
        </p>
      </div>

      <div className="space-y-6">
        <Card prominence="elevated" className="border-l-4 border-l-primary">
          <CardHeader density="spacious">
            <CardTitle level={2} weight="semibold">
              Elevated Prominence
            </CardTitle>
            <CardDescription prominence="default">
              Highest visual weight for primary content and featured information
            </CardDescription>
          </CardHeader>
          <CardContent density="spacious">
            <div className="bg-primary/10 p-4 rounded-md">
              <p className="text-sm font-medium text-primary mb-2">Primary Featured Content</p>
              <p className="text-sm text-muted-foreground">
                Elevated prominence uses enhanced shadows, borders, and spacing to create the
                strongest visual presence. Use sparingly for the most important content.
              </p>
            </div>
          </CardContent>
          <CardFooter density="spacious" justify="center">
            <Button variant="primary" size="lg">
              Primary Action
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card prominence="default">
            <CardHeader density="comfortable">
              <CardTitle level={3} weight="medium">
                Default Prominence
              </CardTitle>
              <CardDescription prominence="default">
                Standard visual weight for regular content and information
              </CardDescription>
            </CardHeader>
            <CardContent density="comfortable">
              <p className="text-sm text-muted-foreground">
                Default prominence provides clean, readable presentation without competing for
                attention. This is appropriate for most content cards and informational displays.
              </p>
            </CardContent>
            <CardFooter justify="end">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </CardFooter>
          </Card>

          <Card prominence="subtle">
            <CardHeader density="comfortable">
              <CardTitle level={4} weight="normal">
                Subtle Prominence
              </CardTitle>
              <CardDescription prominence="subtle">
                Reduced visual weight for supporting or background information
              </CardDescription>
            </CardHeader>
            <CardContent density="comfortable">
              <p className="text-sm text-muted-foreground">
                Subtle prominence minimizes visual impact while maintaining readability. Useful for
                supporting content that shouldn't compete with primary information.
              </p>
            </CardContent>
            <CardFooter justify="end">
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Prominence Usage</h4>
        <div className="space-y-2 text-xs">
          <div>
            <strong>Elevated:</strong> Featured content, announcements, primary CTAs
          </div>
          <div>
            <strong>Default:</strong> Regular content cards, articles, standard information
          </div>
          <div>
            <strong>Subtle:</strong> Supporting content, metadata, background information
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Visual prominence properties that create appropriate hierarchy and attention direction for different content types.',
      },
    },
  },
};

/**
 * Interactive States
 *
 * Interactive properties provide appropriate affordances and feedback.
 * Clear distinction between interactive and static content reduces confusion.
 */
export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Interactive Card States</h3>
        <p className="text-sm text-muted-foreground">
          Interactive properties provide clear affordances and appropriate feedback for different
          interaction patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Static Card */}
        <Card prominence="default">
          <CardHeader>
            <CardTitle level={4} weight="medium">
              Static Information
            </CardTitle>
            <CardDescription prominence="default">
              Display-only content without interaction requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Temperature:</span>
                <span className="font-medium">72°F</span>
              </div>
              <div className="flex justify-between">
                <span>Humidity:</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-green-600">Normal</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <span className="text-xs text-muted-foreground">Last updated: 2 minutes ago</span>
          </CardFooter>
        </Card>

        {/* Interactive Card */}
        <Card
          interactive
          prominence="elevated"
          onClick={() => alert('Interactive card activated!')}
          className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)] cursor-pointer"
        >
          <CardHeader>
            <CardTitle level={4} weight="medium">
              Interactive Dashboard
            </CardTitle>
            <CardDescription prominence="default">
              Click anywhere to access detailed view
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Users:</span>
                <span className="font-medium text-blue-600">2,547</span>
              </div>
              <div className="flex justify-between">
                <span>Revenue:</span>
                <span className="font-medium text-green-600">+12.3%</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion:</span>
                <span className="font-medium">3.4%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter justify="end">
            <span className="text-xs text-muted-foreground">Click to view details →</span>
          </CardFooter>
        </Card>

        {/* Card with Internal Interactions */}
        <Card prominence="default">
          <CardHeader>
            <CardTitle level={4} weight="medium">
              Internal Interactions
            </CardTitle>
            <CardDescription prominence="default">
              Individual elements have their own interactive behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              The card container is static, but individual elements within can be interactive. This
              pattern works well for complex content with multiple action points.
            </p>
          </CardContent>
          <CardFooter justify="between" className="gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
            >
              Secondary
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="hover:opacity-[var(--consequence-significant-opacity)] transition-all duration-[var(--consequence-significant-timing)]"
            >
              Primary
            </Button>
          </CardFooter>
        </Card>

        {/* Disabled/Loading State */}
        <Card prominence="subtle" className="opacity-60">
          <CardHeader>
            <CardTitle level={4} weight="medium">
              Loading State
            </CardTitle>
            <CardDescription prominence="subtle">
              Content is being loaded or unavailable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </CardContent>
          <CardFooter>
            <span className="text-xs text-muted-foreground">Loading...</span>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Interaction Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium">Interactive Cards</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Provide hover and focus states</div>
              <div>• Use cursor: pointer</div>
              <div>• Include activation instructions</div>
              <div>• Support keyboard navigation</div>
            </div>
          </div>
          <div>
            <div className="font-medium">Static Cards</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Focus on content readability</div>
              <div>• Avoid hover state changes</div>
              <div>• Clear visual separation from interactive elements</div>
              <div>• Appropriate for display-only content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive state properties that provide appropriate affordances and feedback for different interaction patterns.',
      },
    },
  },
};

/**
 * Layout Adaptation
 *
 * Cards adapt their layout based on content type and container constraints.
 * Layout properties optimize content presentation for different use cases.
 */
export const LayoutAdaptation: Story = {
  render: () => (
    <div className="space-y-6 max-w-5xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Adaptive Layout Patterns</h3>
        <p className="text-sm text-muted-foreground">
          Layout properties help cards adapt their internal organization based on content type,
          available space, and user needs.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-4">Content Layout Variations</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle level={5} weight="medium">
                  Default Layout
                </CardTitle>
                <CardDescription prominence="default">
                  Standard vertical flow for most content
                </CardDescription>
              </CardHeader>
              <CardContent layout="default">
                <p className="text-sm text-muted-foreground">
                  The default layout stacks content vertically with appropriate spacing between
                  elements. This works well for most text-based content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle level={5} weight="medium">
                  List Layout
                </CardTitle>
                <CardDescription prominence="default">
                  Optimized for data display and metrics
                </CardDescription>
              </CardHeader>
              <CardContent layout="list">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Sales:</span>
                    <span className="font-medium">$12,845</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orders:</span>
                    <span className="font-medium">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Order:</span>
                    <span className="font-medium">$52.01</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle level={5} weight="medium">
                  Grid Layout
                </CardTitle>
                <CardDescription prominence="default">
                  Multi-column organization for complex data
                </CardDescription>
              </CardHeader>
              <CardContent layout="grid">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-blue-600">127</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">89%</div>
                    <div className="text-xs text-muted-foreground">Success</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-yellow-600">23</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-red-600">3</div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Footer Alignment Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Start Alignment
                </CardTitle>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-sm text-muted-foreground">
                  Actions aligned to the start for primary focus
                </p>
              </CardContent>
              <CardFooter justify="start">
                <Button variant="primary" size="sm">
                  Primary Action
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Center Alignment
                </CardTitle>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-sm text-muted-foreground">
                  Centered actions for balanced presentation
                </p>
              </CardContent>
              <CardFooter justify="center">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Between Alignment
                </CardTitle>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-sm text-muted-foreground">
                  Distributed actions for multiple choices
                </p>
              </CardContent>
              <CardFooter justify="between">
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button variant="primary" size="sm">
                  Confirm
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Layout Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium">Content Layouts</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Default: Text content, articles, descriptions</div>
              <div>• List: Metrics, key-value pairs, data display</div>
              <div>• Grid: Complex data, multiple related items</div>
            </div>
          </div>
          <div>
            <div className="font-medium">Footer Alignment</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Start: Primary actions, single CTAs</div>
              <div>• Center: Balanced presentation, single actions</div>
              <div>• Between: Multiple actions, choice scenarios</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Layout adaptation properties that optimize card organization for different content types and interaction patterns.',
      },
    },
  },
};
