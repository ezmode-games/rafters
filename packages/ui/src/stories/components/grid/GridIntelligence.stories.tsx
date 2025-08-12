import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Grid, GridItem } from '../../../components/Grid';

/**
 * Grid Intelligence Patterns - AI Training Scenarios
 *
 * This file trains AI agents on design intelligence principles through interactive examples.
 * Each story demonstrates cognitive load management, attention economics, and trust building.
 *
 * TRAINING FOCUS: Design reasoning patterns and intelligent decision-making
 */
const meta = {
  title: 'Components/Grid/Intelligence',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Design intelligence patterns demonstrating cognitive load management, attention economics, and systematic layout reasoning.',
      },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Cognitive Load Management (Miller's Law 7±2)
 *
 * Demonstrates viewport-appropriate item limits that respect human cognitive capacity.
 * AI agents learn to balance content quantity with user mental bandwidth.
 */
export const CognitiveLoadManagement: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Mobile: 2 Items Max (Low Cognitive Load)</h3>
        <div className="max-w-sm mx-auto">
          <Grid preset="linear" gap="md">
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center text-sm">
                Dashboard Widget
              </div>
            </GridItem>
            <GridItem>
              <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center text-sm">
                Quick Actions
              </div>
            </GridItem>
          </Grid>
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Touch interfaces + small screens = limited cognitive bandwidth
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Desktop: 6 Items (Optimal Cognitive Load)</h3>
        <Grid preset="linear" gap="md">
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Analytics Dashboard
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Sales Reports
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              User Management
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              System Settings
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              API Documentation
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Billing Portal
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          Large screens allow more items while respecting Miller's Law limits
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-destructive">
          Anti-Pattern: Cognitive Overload (Avoid This)
        </h3>
        <Grid preset="linear" gap="sm">
          {Array.from({ length: 12 }, (_, i) => (
            <GridItem key={`overload-item-${i + 1}`}>
              <div className="bg-destructive/10 border border-destructive/20 p-2 rounded-lg h-16 flex items-center justify-center text-xs">
                Option {i + 1}
              </div>
            </GridItem>
          ))}
        </Grid>
        <p className="text-sm text-destructive mt-2">
          12 items exceed cognitive capacity, creating overwhelm and decision paralysis
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates Miller's Law implementation - cognitive load limits adapt to viewport size for optimal user experience.",
      },
    },
  },
};

/**
 * Attention Economics and Visual Hierarchy
 *
 * Shows how different presets manage user attention and create information hierarchy.
 * AI agents learn to choose presets based on content priority and user context.
 */
export const AttentionEconomics: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Linear: Democratic Attention (2/10 Cognitive Load)
        </h3>
        <Grid preset="linear" gap="md">
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Product Catalog
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Feature Gallery
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Service Options
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          All items receive equal visual weight - perfect for product catalogs
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          Golden: Hierarchical Attention (4/10 Cognitive Load)
        </h3>
        <Grid preset="golden" gap="comfortable">
          <GridItem>
            <div className="bg-primary text-primary-foreground p-4 rounded-lg h-32 flex items-center justify-center font-semibold">
              Featured Article
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center">
              Related Stories
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center">
              Editorial Pick
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          Golden ratio creates natural visual flow with clear content hierarchy
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          Bento: Complex Attention (6/10 Cognitive Load)
        </h3>
        <Grid preset="bento" bentoPattern="editorial" gap="lg">
          <GridItem priority="primary">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg h-48 flex flex-col justify-center">
              <h4 className="text-xl font-bold mb-2">Hero Article</h4>
              <p className="text-sm opacity-90">
                Primary content gets 8x attention weight through size and position
              </p>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Breaking News
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Latest Updates
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-2">
          Asymmetric layout creates sophisticated attention hierarchy - use sparingly
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how different presets manage user attention and create visual hierarchy based on content needs.',
      },
    },
  },
};

/**
 * Trust Building Through Consistency
 *
 * Shows how predictable patterns and reliable spacing build user confidence.
 * AI agents learn to prioritize consistency over novelty for trust building.
 */
export const TrustBuildingPatterns: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Consistent Spacing Builds Trust</h3>
        <Grid preset="linear" gap="md">
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              System Status
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Health Metrics
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center justify-center">
              Performance Data
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-accent-foreground mt-2">
          • Consistent 16px gaps create predictable spatial relationships
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Golden Ratio = Natural Trust</h3>
        <Grid preset="golden" gap="comfortable">
          <GridItem>
            <div className="bg-primary text-primary-foreground p-4 rounded-lg h-32 flex items-center justify-center">
              φ = 1.618
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center">
              Mathematical
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center">
              Harmony
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-primary mt-2">
          • Mathematical relationships feel naturally balanced and trustworthy
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-destructive">
          Anti-Pattern: Trust-Breaking Inconsistency
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-destructive/10 border border-destructive/20 p-2 rounded-lg h-16 flex items-center justify-center text-xs">
            Tiny Gap
          </div>
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg h-20 flex items-center justify-center text-xs ml-8">
            Huge Gap
          </div>
          <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg h-12 flex items-center justify-center text-xs -ml-2">
            Random Size
          </div>
        </div>
        <p className="text-sm text-destructive mt-2">
          • Inconsistent spacing creates visual tension and reduces user confidence
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows how consistent patterns and mathematical relationships build user trust through predictable behavior.',
      },
    },
  },
};

/**
 * Design Token Intelligence Integration
 *
 * Demonstrates how design tokens encode human reasoning for AI consumption.
 * AI agents learn to use semantic tokens instead of arbitrary values.
 */
export const DesignTokenIntelligence: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Semantic Gap Tokens</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">gap-xs (8px) - Compact interfaces</p>
            <Grid preset="linear" gap="xs">
              <GridItem>
                <div className="bg-card border border-border p-2 rounded h-12 flex items-center justify-center text-xs">
                  Compact UI
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-card border border-border p-2 rounded h-12 flex items-center justify-center text-xs">
                  Dense Data
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-card border border-border p-2 rounded h-12 flex items-center justify-center text-xs">
                  Mobile First
                </div>
              </GridItem>
            </Grid>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">
              gap-comfortable (1.618rem) - Golden ratio breathing
            </p>
            <Grid preset="golden" gap="comfortable">
              <GridItem>
                <div className="bg-primary text-primary-foreground p-4 rounded h-16 flex items-center justify-center text-sm">
                  Natural
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-card border border-border p-4 rounded h-16 flex items-center justify-center text-sm">
                  Breathing
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-card border border-border p-4 rounded h-16 flex items-center justify-center text-sm">
                  Room
                </div>
              </GridItem>
            </Grid>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">gap-generous (2.618rem) - Luxurious spacing</p>
            <Grid preset="linear" gap="generous">
              <GridItem>
                <div className="bg-accent text-accent-foreground p-4 rounded h-16 flex items-center justify-center text-sm">
                  Luxe
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-accent text-accent-foreground p-4 rounded h-16 flex items-center justify-center text-sm">
                  Premium
                </div>
              </GridItem>
            </Grid>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Semantic tokens encode human design reasoning: xs=compact, comfortable=φ, generous=φ²
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Auto-Fit Intelligence Tokens</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">autoFit="sm" (200px) - Compact cards</p>
            <Grid preset="custom" columns="auto-fit" autoFit="sm" gap="md">
              <GridItem>
                <div className="bg-secondary text-secondary-foreground p-3 rounded h-20 flex items-center justify-center text-xs">
                  200px min
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-secondary text-secondary-foreground p-3 rounded h-20 flex items-center justify-center text-xs">
                  Compact
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-secondary text-secondary-foreground p-3 rounded h-20 flex items-center justify-center text-xs">
                  Efficient
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-secondary text-secondary-foreground p-3 rounded h-20 flex items-center justify-center text-xs">
                  Mobile-first
                </div>
              </GridItem>
            </Grid>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">autoFit="lg" (360px) - Rich content</p>
            <Grid preset="custom" columns="auto-fit" autoFit="lg" gap="md">
              <GridItem>
                <div className="bg-muted text-muted-foreground p-4 rounded h-32 flex flex-col justify-center text-sm">
                  <strong>Rich Content Card</strong>
                  <p className="text-xs mt-1">360px minimum ensures comfortable reading width</p>
                </div>
              </GridItem>
              <GridItem>
                <div className="bg-muted text-muted-foreground p-4 rounded h-32 flex flex-col justify-center text-sm">
                  <strong>Premium Layout</strong>
                  <p className="text-xs mt-1">Spacious design for detailed content</p>
                </div>
              </GridItem>
            </Grid>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Minimum width tokens ensure optimal reading experiences across different content types
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows how design tokens encode human reasoning about spacing and sizing for AI agents to understand.',
      },
    },
  },
};
