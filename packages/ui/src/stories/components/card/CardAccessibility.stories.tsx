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
 * Accessibility creates inclusive card experiences for all users.
 * Proper semantic structure and interaction patterns benefit everyone.
 */
const meta = {
  title: '03 Components/Layout/Card/Accessibility',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessibility features that create inclusive card experiences through proper semantic markup, keyboard navigation, and screen reader optimization.',
      },
    },
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Semantic Structure
 *
 * Proper heading hierarchy and landmark usage create navigable card structures.
 * Screen readers can understand relationships and content organization.
 */
export const SemanticStructure: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Semantic Card Structure</h3>
        <p className="text-sm text-muted-foreground">
          Proper heading hierarchy and semantic markup create clear content organization that
          benefits all users, especially those using assistive technologies.
        </p>
      </div>

      <section className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-4">Article Collection with Proper Hierarchy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Article - H2 */}
            <Card prominence="elevated" className="border-l-4 border-l-primary">
              <CardHeader density="comfortable">
                <CardTitle level={2} weight="semibold">
                  Featured Article
                </CardTitle>
                <CardDescription prominence="enhanced">
                  Primary content with highest semantic importance and visual prominence
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground">
                  This card uses an H2 heading to establish it as a main section of content. The
                  visual prominence matches its semantic importance.
                </p>
              </CardContent>
              <CardFooter justify="between">
                <span className="text-xs text-muted-foreground">Published today</span>
                <Button variant="primary" size="sm">
                  Read Article
                </Button>
              </CardFooter>
            </Card>

            {/* Supporting Articles - H3 */}
            <div className="space-y-4">
              <Card>
                <CardHeader density="comfortable">
                  <CardTitle level={3} weight="medium">
                    Related Research
                  </CardTitle>
                  <CardDescription prominence="default">
                    Supporting content with appropriate semantic level
                  </CardDescription>
                </CardHeader>
                <CardContent density="comfortable">
                  <p className="text-sm text-muted-foreground">
                    This card uses H3 to show it supports the main article content.
                  </p>
                </CardContent>
                <CardFooter justify="end">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader density="comfortable">
                  <CardTitle level={3} weight="medium">
                    Background Information
                  </CardTitle>
                  <CardDescription prominence="default">
                    Additional context at same semantic level
                  </CardDescription>
                </CardHeader>
                <CardContent density="comfortable">
                  <p className="text-sm text-muted-foreground">
                    Another H3 heading maintains consistent hierarchy within this section.
                  </p>
                </CardContent>
                <CardFooter justify="end">
                  <Button variant="outline" size="sm">
                    Explore
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">ARIA Landmarks and Relationships</h4>
          <Card role="article" aria-labelledby="main-content-title">
            <CardHeader>
              <CardTitle level={4} weight="medium" id="main-content-title">
                Content with ARIA Enhancement
              </CardTitle>
              <CardDescription prominence="default" aria-describedby="content-description">
                Using ARIA attributes to enhance semantic relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div id="content-description" className="space-y-3 text-sm">
                <p>
                  This card uses <code>role="article"</code> to establish its purpose and{' '}
                  <code>aria-labelledby</code> to connect the title with the container.
                </p>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="font-medium text-xs mb-1">Screen Reader Announcement:</div>
                  <div className="text-xs italic text-muted-foreground">
                    "Article: Content with ARIA Enhancement"
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Semantic structure with proper heading hierarchy and ARIA attributes that create navigable, accessible card experiences.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Keyboard Navigation
 *
 * Interactive cards must be fully keyboard accessible with clear focus indicators.
 * Tab order should be logical and predictable.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Keyboard Navigation</h3>
        <p className="text-sm text-muted-foreground">
          Use Tab to navigate between interactive elements. Interactive cards become focusable and
          show clear focus indicators.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-4">Interactive Card Focus</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              interactive
              prominence="default"
              onClick={() => alert('Navigation card clicked!')}
              className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              tabIndex={0}
            >
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="medium">
                  Clickable Navigation Card
                </CardTitle>
                <CardDescription prominence="default">
                  Press Enter or Space to activate when focused
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground">
                  This entire card is focusable and interactive. Focus ring indicates current
                  position.
                </p>
              </CardContent>
              <CardFooter justify="end">
                <span className="text-xs text-muted-foreground">Press Enter to activate →</span>
              </CardFooter>
            </Card>

            <Card prominence="default">
              <CardHeader density="comfortable">
                <CardTitle level={4} weight="medium">
                  Card with Internal Focus
                </CardTitle>
                <CardDescription prominence="default">
                  Tab navigates through interactive elements inside
                </CardDescription>
              </CardHeader>
              <CardContent density="comfortable">
                <p className="text-sm text-muted-foreground mb-3">
                  Focus moves between individual interactive elements within the card.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    First Action
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Second Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Keyboard Instructions</h4>
          <Card>
            <CardContent density="comfortable">
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium mb-2">Navigation</div>
                    <div className="space-y-1 text-xs">
                      <div>
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Tab</kbd> - Next
                        element
                      </div>
                      <div>
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift + Tab</kbd> -
                        Previous element
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-2">Activation</div>
                    <div className="space-y-1 text-xs">
                      <div>
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> -
                        Activate card or button
                      </div>
                      <div>
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Space</kbd> -
                        Activate focused element
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard navigation patterns that ensure all card functionality is accessible without a mouse, with clear focus indicators.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Touch Accessibility
 *
 * Appropriate touch targets and interaction areas accommodate different abilities.
 * Cards maintain usability across various input methods.
 */
export const TouchAccessibility: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-4xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Touch-Friendly Design</h3>
        <p className="text-sm text-muted-foreground">
          Cards provide appropriate touch targets and clear interaction feedback for mobile and
          tablet users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card interactive prominence="default" onClick={() => alert('Large target activated!')}>
          <CardHeader density="spacious">
            <CardTitle level={4} weight="medium">
              Large Touch Target
            </CardTitle>
            <CardDescription prominence="default">
              Spacious density provides generous touch areas
            </CardDescription>
          </CardHeader>
          <CardContent density="spacious">
            <div className="bg-primary/10 p-4 rounded-md text-center">
              <div className="text-sm font-medium">Easy to tap</div>
              <div className="text-xs text-muted-foreground mt-1">
                44px minimum height for accessibility
              </div>
            </div>
          </CardContent>
        </Card>

        <Card prominence="default">
          <CardHeader density="comfortable">
            <CardTitle level={4} weight="medium">
              Distinct Touch Areas
            </CardTitle>
            <CardDescription prominence="default">
              Separate targets prevent accidental activation
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <p className="text-sm text-muted-foreground mb-3">
              Individual buttons have sufficient spacing to avoid touch conflicts.
            </p>
          </CardContent>
          <CardFooter justify="between" className="gap-3">
            <Button variant="outline" size="md" className="min-h-[44px]">
              Cancel
            </Button>
            <Button variant="primary" size="md" className="min-h-[44px]">
              Confirm
            </Button>
          </CardFooter>
        </Card>

        <Card prominence="default">
          <CardHeader density="comfortable">
            <CardTitle level={4} weight="medium">
              Touch Feedback
            </CardTitle>
            <CardDescription prominence="default">
              Visual feedback confirms touch interactions
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <div className="space-y-3">
              <Button
                variant="outline"
                size="md"
                className="w-full min-h-[44px] active:scale-95 transition-transform"
                onClick={() => alert('Button with touch feedback!')}
              >
                Press for Feedback
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Subtle scale animation confirms touch
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle level={4} weight="medium">
              Touch Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-medium mb-2">Minimum Sizes</div>
                <div className="space-y-1 text-xs">
                  <div>• Touch targets: 44px × 44px minimum</div>
                  <div>• Interactive cards: generous padding</div>
                  <div>• Button spacing: 8px minimum between targets</div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Interaction Feedback</div>
                <div className="space-y-1 text-xs">
                  <div>• Visual feedback on touch down</div>
                  <div>• Clear boundaries for interactive areas</div>
                  <div>• Appropriate hover states for hybrid devices</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Touch accessibility features that ensure cards work well across different input methods and device types.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Screen Reader Optimization
 *
 * Screen readers need clear structure and meaningful descriptions.
 * Cards communicate their purpose and content relationships effectively.
 */
export const ScreenReaderOptimization: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Screen Reader Enhancement</h3>
        <p className="text-sm text-muted-foreground">
          Enhanced markup and descriptions that create clear, navigable card experiences for screen
          reader users.
        </p>
      </div>

      <div className="space-y-6">
        <section aria-labelledby="dashboard-section">
          <h4 id="dashboard-section" className="text-base font-medium mb-4">
            Dashboard Cards with Live Regions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card role="region" aria-labelledby="metrics-title" aria-describedby="metrics-desc">
              <CardHeader>
                <CardTitle level={4} weight="medium" id="metrics-title">
                  Key Metrics
                </CardTitle>
                <CardDescription prominence="default" id="metrics-desc">
                  Real-time performance indicators with live updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between" role="group" aria-label="Revenue metric">
                    <span>Revenue:</span>
                    <span aria-live="polite" className="font-medium text-green-600">
                      $45,678 (+12%)
                    </span>
                  </div>
                  <div className="flex justify-between" role="group" aria-label="Users metric">
                    <span>Active Users:</span>
                    <span aria-live="polite" className="font-medium">
                      2,547
                    </span>
                  </div>
                  <div className="flex justify-between" role="group" aria-label="Conversion metric">
                    <span>Conversion Rate:</span>
                    <span aria-live="polite" className="font-medium">
                      3.4%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card role="alert" aria-labelledby="alert-title">
              <CardHeader>
                <CardTitle level={4} weight="medium" id="alert-title">
                  System Alert
                </CardTitle>
                <CardDescription prominence="enhanced">
                  Important notification requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-warning/10 border border-warning/20 p-3 rounded-md">
                  <div className="text-sm font-medium text-warning">Scheduled Maintenance</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    System will be unavailable from 2:00 AM to 4:00 AM EST for maintenance
                  </div>
                </div>
              </CardContent>
              <CardFooter justify="end">
                <Button variant="outline" size="sm">
                  Acknowledge
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section aria-labelledby="content-section">
          <h4 id="content-section" className="text-base font-medium mb-4">
            Content Cards with Relationships
          </h4>
          <Card role="article" aria-labelledby="article-title" aria-describedby="article-summary">
            <CardHeader>
              <CardTitle level={4} weight="medium" id="article-title">
                Design System Guidelines
              </CardTitle>
              <CardDescription prominence="default" id="article-summary">
                Comprehensive guide to component usage and best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  This article provides detailed information about implementing accessible design
                  patterns across web applications.
                </p>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="font-medium text-xs mb-1">Screen Reader Context:</div>
                  <div className="text-xs italic text-muted-foreground">
                    "Article: Design System Guidelines - Comprehensive guide to component usage and
                    best practices"
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter justify="between">
              <div className="text-xs text-muted-foreground">
                <span aria-label="Publication date">Published: March 15, 2024</span>
                <span className="mx-2">•</span>
                <span aria-label="Reading time">5 min read</span>
              </div>
              <Button variant="primary" size="sm" aria-describedby="article-title">
                Read Full Article
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Screen reader optimization with proper ARIA attributes, live regions, and semantic markup for accessible card experiences.',
      },
    },
    layout: 'fullscreen',
  },
};
