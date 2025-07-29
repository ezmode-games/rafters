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
 * Visual variants adapt card presentation to match content importance
 * and interface context while maintaining consistent interaction patterns.
 */
const meta = {
  title: '03 Components/Layout/Card/Visual Variants',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Visual variants that provide appropriate prominence, density, and styling for different content types and interface contexts.',
      },
    },
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Prominence Variants
 *
 * Different visual weights create appropriate hierarchy and attention direction.
 * Prominence should match content importance and user task priority.
 */
export const ProminenceVariants: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-medium mb-6">Visual Prominence Hierarchy</h3>
      <div className="space-y-6">
        {/* Elevated Prominence */}
        <Card
          prominence="elevated"
          className="border-l-4 border-l-primary shadow-[var(--shadow-hover-prominent)] hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
        >
          <CardHeader density="spacious">
            <CardTitle level={2} weight="semibold">
              Elevated Prominence
            </CardTitle>
            <CardDescription prominence="default">
              Highest visual weight for featured content and primary announcements
            </CardDescription>
          </CardHeader>
          <CardContent density="spacious">
            <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
              <p className="text-sm font-medium text-primary mb-2">Featured Announcement</p>
              <p className="text-sm text-muted-foreground">
                Elevated prominence creates the strongest visual presence through enhanced shadows,
                borders, and generous spacing. Use sparingly for the most critical information.
              </p>
            </div>
          </CardContent>
          <CardFooter density="spacious" justify="center">
            <Button
              variant="primary"
              size="lg"
              className="hover:opacity-[var(--consequence-significant-opacity)] transition-all duration-[var(--consequence-significant-timing)]"
            >
              Primary Action
            </Button>
          </CardFooter>
        </Card>

        {/* Default and Subtle Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            prominence="default"
            className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
          >
            <CardHeader density="comfortable">
              <CardTitle level={3} weight="semibold">
                Default Prominence
              </CardTitle>
              <CardDescription prominence="default">
                Standard visual treatment for regular content and information
              </CardDescription>
            </CardHeader>
            <CardContent density="comfortable">
              <p className="text-sm text-muted-foreground mb-3">
                Default prominence provides clean, balanced presentation suitable for most content
                scenarios. Neither competing for attention nor fading into background.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Usage:</span>
                  <span className="font-medium">General content</span>
                </div>
                <div className="flex justify-between">
                  <span>Visual Weight:</span>
                  <span className="font-medium">Balanced</span>
                </div>
              </div>
            </CardContent>
            <CardFooter justify="end">
              <Button
                variant="outline"
                size="sm"
                className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
              >
                Learn More
              </Button>
            </CardFooter>
          </Card>

          <Card
            prominence="subtle"
            className="hover:opacity-[var(--opacity-hover-subtle)] transition-all duration-[var(--duration-fast)]"
          >
            <CardHeader density="comfortable">
              <CardTitle level={4} weight="medium">
                Subtle Prominence
              </CardTitle>
              <CardDescription prominence="subtle">
                Reduced visual weight for supporting and background information
              </CardDescription>
            </CardHeader>
            <CardContent density="comfortable">
              <p className="text-sm text-muted-foreground mb-3">
                Subtle prominence minimizes visual impact while maintaining readability. Perfect for
                supplementary content that supports primary information.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Usage:</span>
                  <span className="font-medium">Supporting content</span>
                </div>
                <div className="flex justify-between">
                  <span>Visual Weight:</span>
                  <span className="font-medium">Minimal</span>
                </div>
              </div>
            </CardContent>
            <CardFooter justify="end">
              <Button
                variant="ghost"
                size="sm"
                className="hover:opacity-[var(--opacity-hover-subtle)] transition-all duration-[var(--duration-fast)]"
              >
                Details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Prominence variants that create appropriate visual hierarchy through shadow, border, and spacing treatments.',
      },
    },
  },
};

/**
 * Density Variants
 *
 * Information density affects scanning efficiency and cognitive load.
 * Different densities serve different spatial and content requirements.
 */
export const DensityVariants: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <h3 className="text-lg font-medium mb-6">Information Density Adaptation</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]">
          <CardHeader density="compact">
            <CardTitle level={5} weight="medium">
              Compact Density
            </CardTitle>
            <CardDescription prominence="default" truncate>
              Maximized information in minimal space for dashboards and widgets
            </CardDescription>
          </CardHeader>
          <CardContent density="compact" layout="list">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Revenue:</span>
                <span className="font-medium text-green-600">$12,845</span>
              </div>
              <div className="flex justify-between">
                <span>Orders:</span>
                <span className="font-medium text-blue-600">247</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion:</span>
                <span className="font-medium text-purple-600">3.4%</span>
              </div>
              <div className="flex justify-between">
                <span>Growth:</span>
                <span className="font-medium text-orange-600">+12.3%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter density="compact" justify="center">
            <Button
              variant="ghost"
              size="sm"
              className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-fast)]"
            >
              Expand
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]">
          <CardHeader density="comfortable">
            <CardTitle level={4} weight="medium">
              Comfortable Density
            </CardTitle>
            <CardDescription prominence="default">
              Balanced spacing for optimal readability and content consumption
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <p className="text-sm text-muted-foreground mb-3">
              Comfortable density provides the ideal balance between information presentation and
              visual breathing room. This is the default choice for most content scenarios.
            </p>
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="text-xs font-medium mb-1">Optimal For:</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Article previews</div>
                <div>• Product information</div>
                <div>• General content cards</div>
              </div>
            </div>
          </CardContent>
          <CardFooter density="comfortable" justify="between">
            <span className="text-xs text-muted-foreground">Updated 2h ago</span>
            <Button
              variant="outline"
              size="sm"
              className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
            >
              Read More
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]">
          <CardHeader density="spacious">
            <CardTitle level={3} weight="semibold">
              Spacious Density
            </CardTitle>
            <CardDescription prominence="default">
              Generous spacing that creates focus and importance
            </CardDescription>
          </CardHeader>
          <CardContent density="spacious">
            <div className="bg-primary/10 p-4 rounded-md border border-primary/20">
              <p className="text-sm font-medium text-primary mb-2">Premium Experience</p>
              <p className="text-sm text-muted-foreground">
                Spacious density creates a sense of luxury and importance through generous
                whitespace and carefully considered proportions.
              </p>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Perfect for featured content, call-to-action contexts, and premium experiences.
            </div>
          </CardContent>
          <CardFooter density="spacious" justify="center">
            <Button
              variant="primary"
              size="md"
              className="hover:opacity-[var(--consequence-significant-opacity)] transition-all duration-[var(--consequence-significant-timing)]"
            >
              Get Started
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Density Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="font-medium">Compact</div>
            <div className="text-muted-foreground">
              High information density for space-constrained layouts
            </div>
          </div>
          <div>
            <div className="font-medium">Comfortable</div>
            <div className="text-muted-foreground">
              Balanced presentation for optimal readability
            </div>
          </div>
          <div>
            <div className="font-medium">Spacious</div>
            <div className="text-muted-foreground">Generous spacing for focus and premium feel</div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Density variants that optimize information presentation for different spatial constraints and cognitive load requirements.',
      },
    },
  },
};

/**
 * Interactive Variants
 *
 * Interactive states provide appropriate feedback and affordances.
 * Clear distinction between interactive and static presentations.
 */
export const InteractiveVariants: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-medium mb-6">Interactive State Variants</h3>
      <div className="space-y-6">
        {/* Interactive Cards */}
        <div>
          <h4 className="text-base font-medium mb-4">Interactive Cards</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              interactive
              prominence="elevated"
              onClick={() => alert('Primary interactive card activated!')}
              className="hover:opacity-[var(--opacity-hover)] hover:shadow-[var(--shadow-hover-enhanced)] transition-all duration-[var(--duration-standard)] cursor-pointer"
            >
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="medium">
                  Primary Interactive
                </CardTitle>
                <CardDescription prominence="default">
                  Entire card is clickable with enhanced hover feedback
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Dashboard Views:</span>
                    <span className="font-medium text-blue-600">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Actions:</span>
                    <span className="font-medium text-green-600">+23.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance:</span>
                    <span className="font-medium text-purple-600">Excellent</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter justify="end">
                <span className="text-xs text-muted-foreground">
                  Click anywhere to view dashboard →
                </span>
              </CardFooter>
            </Card>

            <Card
              interactive
              prominence="default"
              onClick={() => alert('Secondary interactive card activated!')}
              className="hover:opacity-[var(--opacity-hover-subtle)] hover:shadow-[var(--shadow-hover-standard)] transition-all duration-[var(--duration-fast)] cursor-pointer"
            >
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="medium">
                  Secondary Interactive
                </CardTitle>
                <CardDescription prominence="default">
                  Subtle interaction feedback for supporting content
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground">
                  Secondary interactive cards use more subtle hover effects to indicate interaction
                  while maintaining visual hierarchy.
                </p>
              </CardContent>
              <CardFooter justify="end">
                <span className="text-xs text-muted-foreground">Click to explore →</span>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Static vs Interactive Comparison */}
        <div>
          <h4 className="text-base font-medium mb-4">Static vs Interactive Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card prominence="default">
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="medium">
                  Static Information Display
                </CardTitle>
                <CardDescription prominence="default">
                  Pure information presentation without interaction
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <div className="space-y-3">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="text-sm font-medium mb-1">System Status</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Server uptime: 99.9%</div>
                      <div>• Last backup: 2 hours ago</div>
                      <div>• Active connections: 1,247</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Static cards focus on clear information presentation without interactive
                    distractions.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-muted-foreground">Last updated: 5 minutes ago</span>
              </CardFooter>
            </Card>

            <Card prominence="default">
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="medium">
                  Card with Internal Actions
                </CardTitle>
                <CardDescription prominence="default">
                  Interactive elements within static container
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground mb-3">
                  This approach provides specific interaction points while keeping the overall card
                  container neutral.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
                  >
                    Primary Action
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full hover:opacity-[var(--opacity-hover-subtle)] transition-all duration-[var(--duration-fast)]"
                  >
                    Secondary Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* State Variations */}
        <div>
          <h4 className="text-base font-medium mb-4">Card State Variations</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              prominence="default"
              className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
            >
              <CardHeader density="comfortable">
                <CardTitle level={5} weight="medium">
                  Default State
                </CardTitle>
                <CardDescription prominence="default">
                  Standard card with hover feedback
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground">
                  Normal interactive state with standard hover opacity and timing.
                </p>
              </CardContent>
            </Card>

            <Card prominence="subtle" className="opacity-60">
              <CardHeader density="comfortable">
                <CardTitle level={5} weight="medium">
                  Disabled State
                </CardTitle>
                <CardDescription prominence="subtle">
                  Content unavailable or loading
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>

            <Card prominence="elevated" className="border-2 border-primary">
              <CardHeader density="comfortable">
                <CardTitle level={5} weight="medium">
                  Selected State
                </CardTitle>
                <CardDescription prominence="default">
                  Currently active or selected item
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground">
                  Enhanced border and prominence indicate selection or active state.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive variants that provide appropriate feedback and affordances for different interaction patterns and states.',
      },
    },
  },
};

/**
 * Visual Treatment Comparison
 *
 * Side-by-side comparison of different visual treatments helps understand
 * appropriate usage patterns and hierarchy relationships.
 */
export const VisualComparison: Story = {
  render: () => (
    <div className="w-full max-w-6xl">
      <h3 className="text-lg font-medium mb-6">Visual Treatment Comparison</h3>
      <div className="space-y-8">
        {/* Prominence Comparison */}
        <div>
          <h4 className="text-base font-medium mb-4">Prominence Levels</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              prominence="elevated"
              className="shadow-[var(--shadow-hover-prominent)] border-l-4 border-l-primary"
            >
              <CardHeader density="spacious">
                <CardTitle level={3} weight="semibold">
                  Elevated
                </CardTitle>
                <CardDescription prominence="default">
                  Maximum visual impact for primary content
                </CardDescription>
              </CardHeader>
              <CardContent density="spacious">
                <div className="bg-primary/10 p-3 rounded-md text-center">
                  <div className="text-sm font-medium text-primary">Featured</div>
                </div>
              </CardContent>
            </Card>

            <Card prominence="default">
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="semibold">
                  Default
                </CardTitle>
                <CardDescription prominence="default">
                  Standard visual weight for regular content
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <div className="bg-muted/50 p-3 rounded-md text-center">
                  <div className="text-sm font-medium">Standard</div>
                </div>
              </CardContent>
            </Card>

            <Card prominence="subtle">
              <CardHeader density="comfortable">
                <CardTitle level={5} weight="medium">
                  Subtle
                </CardTitle>
                <CardDescription prominence="subtle">
                  Minimal visual weight for supporting content
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <div className="bg-muted/30 p-3 rounded-md text-center">
                  <div className="text-sm">Supporting</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Density Comparison */}
        <div>
          <h4 className="text-base font-medium mb-4">Density Levels</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Compact
                </CardTitle>
              </CardHeader>
              <CardContent density="compact">
                <div className="text-xs space-y-1">
                  <div>Minimal spacing</div>
                  <div>High density</div>
                  <div>Dashboard use</div>
                </div>
              </CardContent>
              <CardFooter density="compact">
                <Button variant="ghost" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="medium">
                  Comfortable
                </CardTitle>
              </CardHeader>
              <CardContent density="comfortable">
                <div className="text-sm space-y-2">
                  <div>Balanced spacing</div>
                  <div>Optimal readability</div>
                  <div>General purpose</div>
                </div>
              </CardContent>
              <CardFooter density="comfortable">
                <Button variant="outline" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader density="spacious">
                <CardTitle level={3} weight="medium">
                  Spacious
                </CardTitle>
              </CardHeader>
              <CardContent density="spacious">
                <div className="text-sm space-y-3">
                  <div>Generous spacing</div>
                  <div>Premium feel</div>
                  <div>Featured content</div>
                </div>
              </CardContent>
              <CardFooter density="spacious">
                <Button variant="primary" size="md">
                  Action
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Interactive States Comparison */}
        <div>
          <h4 className="text-base font-medium mb-4">Interactive States</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]">
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Hover
                </CardTitle>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-xs text-muted-foreground">Hover over to see opacity change</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary bg-primary/5">
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Selected
                </CardTitle>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-xs text-muted-foreground">Enhanced border indicates selection</p>
              </CardContent>
            </Card>

            <Card className="opacity-60">
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Disabled
                </CardTitle>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-xs text-muted-foreground">
                  Reduced opacity shows unavailable state
                </p>
              </CardContent>
            </Card>

            <Card className="border border-dashed border-muted-foreground/30">
              <CardHeader density="compact">
                <CardTitle level={5} weight="medium">
                  Placeholder
                </CardTitle>
              </CardHeader>
              <CardContent density="compact">
                <p className="text-xs text-muted-foreground">Dashed border indicates empty state</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Treatment Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium">Visual Hierarchy</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Use prominence to direct attention</div>
              <div>• Match visual weight to content importance</div>
              <div>• Maintain consistent patterns within collections</div>
            </div>
          </div>
          <div>
            <div className="font-medium">State Communication</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Provide clear interaction affordances</div>
              <div>• Use consistent state patterns</div>
              <div>• Support both mouse and keyboard interaction</div>
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
          'Comprehensive comparison of visual treatments showing how different variants communicate hierarchy, state, and interaction patterns.',
      },
    },
  },
};
