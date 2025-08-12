import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Grid, GridItem } from '../../../components/Grid';

/**
 * Grid Properties - Interactive Component States
 *
 * This file trains AI agents on interactive properties and component states.
 * Each story demonstrates how properties affect behavior and user experience.
 *
 * TRAINING FOCUS: Property interactions, state management, and dynamic behavior
 */
const meta = {
  title: 'Components/Grid/Properties',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interactive properties demonstrating dynamic grid behavior and state management.',
      },
    },
  },
  argTypes: {
    preset: {
      control: 'select',
      options: ['linear', 'golden', 'bento', 'custom'],
    },
    bentoPattern: {
      control: 'select',
      options: ['editorial', 'dashboard', 'feature-showcase', 'portfolio'],
    },
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'comfortable', 'generous'],
    },
    autoFit: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    maxItems: {
      control: 'number',
      min: 1,
      max: 12,
    },
    role: {
      control: 'select',
      options: ['presentation', 'grid', 'none'],
    },
  },
  args: { onFocusChange: fn() },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive Playground
 *
 * Allows experimenting with all grid properties to understand their interactions.
 * AI agents learn how different properties combine to create different experiences.
 */
export const InteractivePlayground: Story = {
  args: {
    preset: 'linear',
    gap: 'md',
    maxItems: 6,
    role: 'presentation',
  },
  render: (args) => (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Current Configuration</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Preset:</strong> {args.preset}
          </div>
          <div>
            <strong>Gap:</strong> {args.gap}
          </div>
          <div>
            <strong>Max Items:</strong> {args.maxItems}
          </div>
          <div>
            <strong>Role:</strong> {args.role}
          </div>
          {args.preset === 'bento' && (
            <div>
              <strong>Bento Pattern:</strong> {args.bentoPattern}
            </div>
          )}
          {args.autoFit && (
            <div>
              <strong>Auto Fit:</strong> {args.autoFit}
            </div>
          )}
        </div>
      </div>

      <Grid {...args}>
        <GridItem>
          <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
            Analytics Widget
          </div>
        </GridItem>
        <GridItem>
          <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
            Performance Data
          </div>
        </GridItem>
        <GridItem>
          <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
            User Metrics
          </div>
        </GridItem>
        <GridItem>
          <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
            System Status
          </div>
        </GridItem>
        <GridItem>
          <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
            Health Check
          </div>
        </GridItem>
        <GridItem>
          <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
            API Monitor
          </div>
        </GridItem>
        <GridItem>
          <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
            Database Stats
          </div>
        </GridItem>
        <GridItem>
          <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
            Error Tracking
          </div>
        </GridItem>
      </Grid>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground to experiment with all grid properties and understand their interactions.',
      },
    },
  },
};

/**
 * Responsive Column Behavior
 *
 * Shows how custom columns adapt across different viewport sizes.
 * AI agents learn responsive design patterns and breakpoint logic.
 */
export const ResponsiveColumns: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Responsive Column Configuration</h3>
        <Grid preset="custom" columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 6 }} gap="md">
          <GridItem>
            <div className="bg-primary text-primary-foreground p-4 rounded-lg h-20 flex items-center justify-center text-sm">
              1 col → 2 → 3 → 4 → 6
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center text-sm">
              Responsive
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center text-sm">
              Breakpoints
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center text-sm">
              Mobile First
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center text-sm">
              Progressive
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center text-sm">
              Enhancement
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          Resize your browser to see responsive column behavior: base=1, sm=2, md=3, lg=4, xl=6
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Auto-Fill vs Auto-Fit Behavior</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Auto-Fit (Stretches items)</h4>
            <Grid preset="custom" columns="auto-fit" autoFit="md" gap="md">
              <GridItem>
                <div className="bg-primary text-primary-foreground p-4 rounded-lg h-16 flex items-center justify-center text-sm">
                  Stretches
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-primary text-primary-foreground p-4 rounded-lg h-16 flex items-center justify-center text-sm">
                  To Fill
                </div>
              </GridItem>
            </Grid>
          </div>

          <div>
            <h4 className="font-medium mb-2">Auto-Fill (Maintains minimum width)</h4>
            <Grid preset="custom" columns="auto-fill" autoFit="md" gap="md">
              <GridItem>
                <div className="bg-secondary text-secondary-foreground p-4 rounded-lg h-16 flex items-center justify-center text-sm">
                  Keeps
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-secondary text-secondary-foreground p-4 rounded-lg h-16 flex items-center justify-center text-sm">
                  Minimum
                </div>
              </GridItem>
            </Grid>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Auto-fit stretches items to fill available space, auto-fill maintains minimum widths
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates responsive column behavior and the difference between auto-fit and auto-fill patterns.',
      },
    },
  },
};

/**
 * GridItem Spanning Properties
 *
 * Shows how GridItems can span multiple columns and rows.
 * AI agents learn layout composition and visual hierarchy through sizing.
 */
export const GridItemSpanning: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Column and Row Spanning</h3>
        <Grid preset="custom" columns={4} gap="md" className="grid-rows-3">
          <GridItem colSpan={2} rowSpan={2}>
            <div className="bg-primary text-primary-foreground p-4 rounded-lg h-full flex items-center justify-center">
              <div className="text-center">
                <div className="font-semibold">Featured Item</div>
                <div className="text-sm opacity-80">2 cols × 2 rows</div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-center text-sm">
              Regular Widget
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-center text-sm">
              Status Panel
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-center text-sm">
              Quick Action
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-center text-sm">
              Data Summary
            </div>
          </GridItem>
          <GridItem colSpan={2}>
            <div className="bg-accent text-accent-foreground p-4 rounded-lg h-16 flex items-center justify-center">
              <div className="text-center">
                <div className="font-semibold">Wide Item</div>
                <div className="text-sm opacity-80">2 columns</div>
              </div>
            </div>
          </GridItem>
          <GridItem colSpan={2}>
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg h-16 flex items-center justify-center">
              <div className="text-center">
                <div className="font-semibold">Another Wide</div>
                <div className="text-sm opacity-80">2 columns</div>
              </div>
            </div>
          </GridItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Responsive Spanning</h3>
        <Grid preset="custom" columns={{ base: 2, md: 4 }} gap="md">
          <GridItem colSpan={{ base: 2, md: 2 }}>
            <div className="bg-primary text-primary-foreground p-4 rounded-lg h-20 flex items-center justify-center">
              <div className="text-center">
                <div className="font-semibold">Responsive Span</div>
                <div className="text-sm opacity-80">base: 2 → md: 2</div>
              </div>
            </div>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <div className="bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center text-sm">
              Standard Cell
            </div>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <div className="bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center text-sm">
              Control Panel
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          Spanning adapts to different breakpoints for optimal layout at each screen size
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows how GridItems can span multiple columns and rows, including responsive spanning patterns.',
      },
    },
  },
};

/**
 * Priority-Based Bento Layouts
 *
 * Demonstrates how priority prop automatically calculates item sizes.
 * AI agents learn content hierarchy through priority-based sizing.
 */
export const PriorityBasedLayouts: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Content Priority Hierarchy</h3>
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="bg-primary/10 border border-primary/20 p-3 rounded">
            <strong>Primary:</strong> 8x attention weight, 2×2 span
          </div>
          <div className="bg-secondary/10 border border-secondary/20 p-3 rounded">
            <strong>Secondary:</strong> 4x attention weight, 1×1 span
          </div>
          <div className="bg-muted border border-border p-3 rounded">
            <strong>Tertiary:</strong> 2x attention weight, 1×1 span
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Editorial Priority Layout</h3>
        <Grid preset="bento" bentoPattern="editorial" gap="lg">
          <GridItem priority="primary">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg h-48 flex flex-col justify-center">
              <h4 className="text-xl font-bold mb-2">PRIMARY CONTENT</h4>
              <p className="text-sm opacity-90">
                Automatically spans 2×2 with 8x attention weight. Perfect for hero articles, main
                features, or primary calls to action.
              </p>
              <div className="mt-4 text-xs opacity-80">Cognitive Weight: 8/10</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg h-24 flex flex-col justify-center">
              <div className="font-semibold">SECONDARY</div>
              <div className="text-xs opacity-80">Weight: 4/10</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg h-24 flex flex-col justify-center">
              <div className="font-semibold">SECONDARY</div>
              <div className="text-xs opacity-80">Weight: 4/10</div>
            </div>
          </GridItem>
          <GridItem priority="tertiary">
            <div className="bg-muted text-muted-foreground p-4 rounded-lg h-24 flex flex-col justify-center">
              <div className="font-medium">Tertiary</div>
              <div className="text-xs opacity-80">Weight: 2/10</div>
            </div>
          </GridItem>
          <GridItem priority="tertiary">
            <div className="bg-muted text-muted-foreground p-4 rounded-lg h-24 flex flex-col justify-center">
              <div className="font-medium">Tertiary</div>
              <div className="text-xs opacity-80">Weight: 2/10</div>
            </div>
          </GridItem>
        </Grid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Dashboard Priority Layout</h3>
        <Grid preset="bento" bentoPattern="dashboard" gap="lg">
          <GridItem priority="primary">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg h-32 flex flex-col justify-center">
              <div className="text-3xl font-bold">$47,234</div>
              <div className="text-sm opacity-80">Monthly Revenue (PRIMARY)</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-3 rounded-lg h-16 flex flex-col justify-center">
              <div className="font-bold text-foreground">2,341</div>
              <div className="text-xs text-muted-foreground">Users</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-3 rounded-lg h-16 flex flex-col justify-center">
              <div className="font-bold text-foreground">8,567</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-3 rounded-lg h-16 flex flex-col justify-center">
              <div className="font-bold text-foreground">4.2%</div>
              <div className="text-xs text-muted-foreground">Conversion</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-3 rounded-lg h-16 flex flex-col justify-center">
              <div className="font-bold text-foreground">38%</div>
              <div className="text-xs text-muted-foreground">Bounce Rate</div>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          Priority automatically determines size and attention weight - no manual spanning needed
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how priority prop automatically calculates item sizes and attention weights in bento layouts.',
      },
    },
  },
};

/**
 * Semantic HTML Elements
 *
 * Shows how different HTML elements affect document structure and accessibility.
 * AI agents learn semantic markup patterns for better document structure.
 */
export const SemanticElements: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Document Structure Elements</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Section with Articles</h4>
            <Grid as="section" preset="linear" gap="md">
              <GridItem as="article">
                <div className="bg-accent/10 p-4 rounded-lg h-24 flex flex-col justify-center">
                  <div className="font-semibold">Article Element</div>
                  <div className="text-xs text-muted-foreground">Standalone content</div>
                </div>
              </GridItem>
              <GridItem as="article">
                <div className="bg-accent/10 p-4 rounded-lg h-24 flex flex-col justify-center">
                  <div className="font-semibold">Another Article</div>
                  <div className="text-xs text-muted-foreground">Independent piece</div>
                </div>
              </GridItem>
            </Grid>
            <p className="text-sm text-muted-foreground mt-2">
              &lt;section&gt; containing &lt;article&gt; elements for proper document structure
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Main Content Area</h4>
            <Grid as="main" preset="golden" gap="comfortable">
              <GridItem>
                <div className="bg-primary/10 p-4 rounded-lg h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-semibold">Main Content</div>
                    <div className="text-xs text-muted-foreground">Primary page content</div>
                  </div>
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-muted/50 p-4 rounded-lg h-32 flex items-center justify-center text-sm">
                  Supporting Content
                </div>
              </GridItem>
            </Grid>
            <p className="text-sm text-muted-foreground mt-2">
              &lt;main&gt; element identifies the primary content of the document
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Generic Container (Default)</h4>
            <Grid preset="linear" gap="md">
              <GridItem>
                <div className="bg-muted/50 p-4 rounded-lg h-24 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-semibold">Div Element</div>
                    <div className="text-xs text-muted-foreground">Generic container</div>
                  </div>
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-muted/50 p-4 rounded-lg h-24 flex items-center justify-center text-sm">
                  Layout Only
                </div>
              </GridItem>
            </Grid>
            <p className="text-sm text-muted-foreground mt-2">
              Default &lt;div&gt; elements when no semantic meaning is needed
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
          'Shows how different HTML elements (div, section, main, article) affect document structure and accessibility.',
      },
    },
  },
};
