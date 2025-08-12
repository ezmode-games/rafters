import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Grid, GridItem } from '../../../components/Grid';

/**
 * Grid Variants - Visual Styling Demonstrations
 *
 * This file trains AI agents on visual variant patterns and their semantic meanings.
 * Each variant encodes specific UX intelligence for different use cases.
 *
 * TRAINING FOCUS: Visual hierarchy, spacing systems, and preset applications
 */
const meta = {
  title: 'Components/Grid/Variants',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Visual styling variants demonstrating different grid configurations and their appropriate use cases.',
      },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Spacing Variants
 *
 * Different gap sizes for various interface densities and visual styles.
 * Each spacing choice affects cognitive load and visual hierarchy.
 */
export const SpacingVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Extra Small (xs) - Compact Interfaces</h3>
        <Grid preset="linear" gap="xs">
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg h-16 flex items-center justify-center text-sm">
              System Status
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg h-16 flex items-center justify-center text-sm">
              Health Check
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg h-16 flex items-center justify-center text-sm">
              API Monitor
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg h-16 flex items-center justify-center text-sm">
              Performance
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          8px gaps for dense data displays and compact layouts
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Medium (md) - Standard Interfaces</h3>
        <Grid preset="linear" gap="md">
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center">
              Analytics Dashboard
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center">
              User Reports
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-20 flex items-center justify-center">
              Sales Metrics
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          16px gaps for balanced layouts and general use
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Comfortable - Golden Ratio Breathing</h3>
        <Grid preset="golden" gap="comfortable">
          <GridItem>
            <div className="bg-primary text-primary-foreground p-5 rounded-lg h-24 flex items-center justify-center">
              Featured Content
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-5 rounded-lg h-24 flex items-center justify-center">
              Editorial Pick
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-5 rounded-lg h-24 flex items-center justify-center">
              Related Story
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          1.618rem (φ) gaps for mathematically harmonious spacing
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Generous - Luxurious Spacing</h3>
        <Grid preset="linear" gap="generous">
          <GridItem>
            <div className="bg-accent text-accent-foreground p-6 rounded-lg h-28 flex items-center justify-center">
              Premium Section
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-accent text-accent-foreground p-6 rounded-lg h-28 flex items-center justify-center">
              Executive Summary
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          2.618rem (φ²) gaps for premium, spacious designs
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates different spacing variants and their appropriate use cases for various interface densities.',
      },
    },
  },
};

/**
 * Preset Variants
 *
 * Different intelligent presets with their unique visual characteristics.
 * Each preset encodes specific attention patterns and cognitive load levels.
 */
export const PresetVariants: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-lg font-semibold mb-4">Linear Preset - Democratic Attention</h3>
        <div className="bg-muted/20 p-6 rounded-lg">
          <Grid preset="linear" gap="md">
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center shadow-sm">
                Product Overview
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center shadow-sm">
                Feature List
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center shadow-sm">
                Pricing Plans
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center shadow-sm">
                Customer Reviews
              </div>
            </GridItem>
          </Grid>
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Use for:</strong> Product catalogs, image galleries, card collections
            </p>
            <p>
              <strong>Cognitive Load:</strong> 2/10 - Predictable scanning patterns
            </p>
            <p>
              <strong>Trust Level:</strong> High - Users can rely on consistent structure
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Golden Preset - Hierarchical Flow</h3>
        <div className="bg-accent/10 p-6 rounded-lg">
          <Grid preset="golden" gap="comfortable">
            <GridItem>
              <div className="bg-primary text-primary-foreground p-4 rounded-lg h-32 flex items-center justify-center shadow-sm border-2 border-primary/20">
                Featured Content
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center shadow-sm">
                Supporting Article
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center shadow-sm">
                Related Content
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center shadow-sm">
                Editorial Pick
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center shadow-sm">
                Latest News
              </div>
            </GridItem>
          </Grid>
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Use for:</strong> Editorial layouts, content showcases, feature highlights
            </p>
            <p>
              <strong>Cognitive Load:</strong> 4/10 - Natural hierarchy guides attention
            </p>
            <p>
              <strong>Trust Level:</strong> High - Mathematical proportions feel balanced
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Bento Preset - Semantic Asymmetry</h3>
        <div className="bg-primary/10 p-6 rounded-lg">
          <Grid preset="bento" bentoPattern="editorial" gap="lg">
            <GridItem priority="primary">
              <div className="bg-primary text-primary-foreground p-6 rounded-lg h-48 flex flex-col justify-center shadow-sm border-2 border-primary/20">
                <h4 className="text-lg font-semibold mb-2">Hero Article</h4>
                <p className="text-sm opacity-90">
                  Primary content receives maximum attention through size and position.
                </p>
              </div>
            </GridItem>
            <GridItem priority="secondary">
              <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center shadow-sm">
                Breaking News
              </div>
            </GridItem>
            <GridItem priority="secondary">
              <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center shadow-sm">
                Technology
              </div>
            </GridItem>
          </Grid>
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Use for:</strong> Editorial layouts, dashboards, content showcases
            </p>
            <p>
              <strong>Cognitive Load:</strong> 6/10 - Complex attention patterns require focus
            </p>
            <p>
              <strong>Trust Level:</strong> Medium - Requires careful content hierarchy
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Custom Preset - Full Control</h3>
        <div className="bg-secondary/10 p-6 rounded-lg">
          <Grid preset="custom" columns={{ base: 1, md: 2, lg: 4 }} gap="lg">
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <div className="bg-accent text-accent-foreground p-4 rounded-lg h-32 flex items-center justify-center shadow-sm border-2 border-accent/20">
                Custom Spanning
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center shadow-sm">
                Standard Widget
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center shadow-sm">
                Data Panel
              </div>
            </GridItem>
          </Grid>
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Use for:</strong> Specialized layouts, unique requirements
            </p>
            <p>
              <strong>Cognitive Load:</strong> Variable - Depends on implementation
            </p>
            <p>
              <strong>Trust Level:</strong> Medium - Quality depends on design decisions
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
          'Shows the four intelligent presets with their distinct visual characteristics and appropriate use cases.',
      },
    },
  },
};

/**
 * Bento Pattern Variants
 *
 * Different semantic patterns within the bento preset.
 * Each pattern is optimized for specific content types and user goals.
 */
export const BentoPatternVariants: Story = {
  render: () => (
    <div className="space-y-10">
      <div>
        <h3 className="text-lg font-semibold mb-4">Editorial Pattern - Article Focus</h3>
        <Grid preset="bento" bentoPattern="editorial" gap="lg">
          <GridItem priority="primary">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg h-48 flex flex-col justify-center">
              <h4 className="text-xl font-bold mb-2">Main Article</h4>
              <p className="text-sm opacity-90">
                Hero article gets maximum attention in editorial layout
              </p>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Related Story
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Breaking News
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          Perfect for news sites, blogs, content-heavy platforms
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Dashboard Pattern - Metric Focus</h3>
        <Grid preset="bento" bentoPattern="dashboard" gap="lg">
          <GridItem priority="primary">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg h-32 flex flex-col justify-center">
              <div className="text-3xl font-bold">$24,560</div>
              <div className="text-sm opacity-80">Monthly Revenue</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-center text-sm">
              Users: 1,234
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-center text-sm">
              Sessions: 5,678
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-center text-sm">
              Conversion: 3.2%
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-center text-sm">
              Bounce: 42%
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          Ideal for admin panels, analytics dashboards, KPI displays
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Feature Showcase Pattern</h3>
        <Grid preset="bento" bentoPattern="feature-showcase" gap="lg">
          <GridItem priority="primary">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg h-48 flex flex-col justify-center">
              <h4 className="text-xl font-bold mb-2">Premium Feature</h4>
              <p className="text-sm opacity-90 mb-4">
                Main feature gets prominent placement and detailed explanation
              </p>
              <button
                type="button"
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded text-sm"
              >
                Learn More
              </button>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center text-sm">
              Cost Savings
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center text-sm">
              Time Efficiency
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center text-sm">
              Easy Integration
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          Perfect for landing pages, product showcases, feature announcements
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Portfolio Pattern - Work Focus</h3>
        <Grid preset="bento" bentoPattern="portfolio" gap="lg">
          <GridItem priority="primary">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg h-48 flex flex-col justify-center">
              <h4 className="text-xl font-bold mb-2">Featured Project</h4>
              <p className="text-sm opacity-90 mb-4">
                Showcase your best work with maximum visual impact
              </p>
              <div className="flex space-x-2">
                <span className="bg-secondary px-2 py-1 rounded text-xs text-secondary-foreground">
                  React
                </span>
                <span className="bg-secondary px-2 py-1 rounded text-xs text-secondary-foreground">
                  TypeScript
                </span>
              </div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center text-sm">
              E-commerce Platform
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center text-sm">
              Mobile App Design
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center text-sm">
              Analytics Dashboard
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          Great for creative portfolios, case study presentations, work galleries
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the four bento semantic patterns, each optimized for specific content types and user goals.',
      },
    },
  },
};

/**
 * Auto-Fit Sizing Variants
 *
 * Different minimum widths for responsive auto-fit layouts.
 * Each size is optimized for specific content types and reading comfort.
 */
export const AutoFitVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small (200px) - Compact Cards</h3>
        <Grid preset="custom" columns="auto-fit" autoFit="sm" gap="md">
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg h-20 flex items-center justify-center text-xs text-center">
              Status Widget
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg h-20 flex items-center justify-center text-xs text-center">
              Quick Action
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg h-20 flex items-center justify-center text-xs text-center">
              System Health
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg h-20 flex items-center justify-center text-xs text-center">
              Data Summary
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg h-20 flex items-center justify-center text-xs text-center">
              Metrics Panel
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          Ideal for tags, small cards, mobile-first designs
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Medium (280px) - Comfortable Content</h3>
        <Grid preset="custom" columns="auto-fit" autoFit="md" gap="md">
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-32 flex flex-col justify-center">
              <h4 className="font-semibold mb-2">Content Card</h4>
              <p className="text-sm text-muted-foreground">
                Comfortable reading width for standard content cards.
              </p>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-32 flex flex-col justify-center">
              <h4 className="font-semibold mb-2">Feature Item</h4>
              <p className="text-sm text-muted-foreground">
                Balanced width for product cards and feature lists.
              </p>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-32 flex flex-col justify-center">
              <h4 className="font-semibold mb-2">Service Block</h4>
              <p className="text-sm text-muted-foreground">
                Perfect for service descriptions and benefit highlights.
              </p>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          Perfect for product cards, feature lists, service descriptions
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Large (360px) - Rich Content</h3>
        <Grid preset="custom" columns="auto-fit" autoFit="lg" gap="lg">
          <GridItem>
            <div className="bg-card border border-border p-6 rounded-lg h-48 flex flex-col justify-center">
              <h4 className="text-lg font-semibold mb-3">Article Preview</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Spacious width allows for detailed content, longer descriptions, and comfortable
                reading experience. Perfect for article previews and detailed product information.
              </p>
              <div className="text-xs text-muted-foreground">March 15, 2024</div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-6 rounded-lg h-48 flex flex-col justify-center">
              <h4 className="text-lg font-semibold mb-3">Case Study</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Rich content cards work best with generous width allocations. This allows for proper
                typography hierarchy and comfortable information consumption.
              </p>
              <div className="text-xs text-muted-foreground">February 28, 2024</div>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          Best for article previews, case studies, detailed product info
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows different auto-fit minimum widths and their optimal content types for responsive layouts.',
      },
    },
  },
};
