// @componentStatus published
// @version 1.0.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Grid, GridItem } from '../../../components/Grid';

/**
 * Grid Layout Intelligence - AI Training Component
 *
 * Every layout decision impacts cognitive load. This component encodes human design reasoning
 * into intelligent presets that AI agents can understand and apply systematically.
 *
 * COGNITIVE LOAD: 4/10 (layout container with intelligent presets)
 * ATTENTION ECONOMICS: Neutral attention cost - content receives focus
 * TRUST BUILDING: Invisible scaffolding users can rely on
 */
const meta = {
  title: 'Components/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Responsive grid layouts with embedded UX reasoning. Combines standard Tailwind utilities with intelligent presets for systematic design decision-making.',
      },
    },
  },
  argTypes: {
    preset: {
      control: 'select',
      options: ['linear', 'golden', 'bento', 'custom'],
      description: 'Intelligent preset with embedded UX reasoning',
    },
    bentoPattern: {
      control: 'select',
      options: ['editorial', 'dashboard', 'feature-showcase', 'portfolio'],
      description: 'Semantic patterns for bento layouts',
    },
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'comfortable', 'generous'],
      description: 'Gap spacing using design system tokens',
    },
    autoFit: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Auto-sizing intelligence using design tokens',
    },
    maxItems: {
      control: 'number',
      description: "Cognitive load management (Miller's Law 7±2)",
    },
    role: {
      control: 'select',
      options: ['presentation', 'grid', 'none'],
      description: 'Accessibility configuration',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for interactive grids',
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'main', 'article'],
      description: 'Semantic HTML element type',
    },
  },
  args: { onFocusChange: fn() },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Linear preset with democratic attention pattern.
 * Equal columns create predictable scanning patterns with low cognitive load.
 */
export const LinearPreset: Story = {
  args: {
    preset: 'linear',
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem>
        <div className="bg-card border border-border rounded-lg p-4 h-24 flex items-center justify-center">
          <span className="text-foreground font-medium">Wireless Headphones</span>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border rounded-lg p-4 h-24 flex items-center justify-center">
          <span className="text-foreground font-medium">Bluetooth Speaker</span>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border rounded-lg p-4 h-24 flex items-center justify-center">
          <span className="text-foreground font-medium">Smart Watch</span>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border rounded-lg p-4 h-24 flex items-center justify-center">
          <span className="text-foreground font-medium">Mechanical Keyboard</span>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border rounded-lg p-4 h-24 flex items-center justify-center">
          <span className="text-foreground font-medium">Office Monitor</span>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border rounded-lg p-4 h-24 flex items-center justify-center">
          <span className="text-foreground font-medium">Ergonomic Chair</span>
        </div>
      </GridItem>
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Linear preset creates equal columns with predictable scanning patterns. Ideal for product catalogs and equal-priority content.',
      },
    },
  },
};

/**
 * Golden ratio preset with hierarchical attention pattern.
 * Mathematical proportions create natural visual flow.
 */
export const GoldenPreset: Story = {
  args: {
    preset: 'golden',
    gap: 'comfortable', // Golden ratio gap
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem>
        <div className="bg-primary text-primary-foreground p-4 rounded-lg h-32 flex items-center justify-center">
          <span className="font-semibold">Q4 Revenue Report</span>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center">
          <span className="text-foreground font-medium">User Analytics</span>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center">
          <span className="text-foreground font-medium">System Performance</span>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center">
          <span className="text-foreground font-medium">Team Metrics</span>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border p-4 rounded-lg h-32 flex items-center justify-center">
          <span className="text-foreground font-medium">Support Tickets</span>
        </div>
      </GridItem>
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Golden preset uses φ proportions for natural visual hierarchy. Perfect for editorial layouts and content showcases.',
      },
    },
  },
};

/**
 * Auto-fit sizing with intelligent minimum widths.
 * Content-driven responsive behavior using design tokens.
 */
export const AutoFitIntelligence: Story = {
  args: {
    preset: 'custom',
    columns: 'auto-fit',
    autoFit: 'md',
    gap: 'lg',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem>
        <div className="bg-card border border-border p-6 rounded-lg h-40 flex flex-col justify-center">
          <h3 className="font-semibold mb-2 text-foreground">Analytics Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Auto-fit ensures minimum 280px width for comfortable content reading.
          </p>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border p-6 rounded-lg h-40 flex flex-col justify-center">
          <h3 className="font-semibold mb-2 text-foreground">User Management</h3>
          <p className="text-sm text-muted-foreground">
            Responsive behavior adapts to container width automatically.
          </p>
        </div>
      </GridItem>
      <GridItem>
        <div className="bg-card border border-border p-6 rounded-lg h-40 flex flex-col justify-center">
          <h3 className="font-semibold mb-2 text-foreground">System Settings</h3>
          <p className="text-sm text-muted-foreground">
            Uses design tokens for intelligent minimum widths.
          </p>
        </div>
      </GridItem>
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Auto-fit with design token minimum widths creates content-driven responsive layouts.',
      },
    },
  },
};

/**
 * Interactive grid with keyboard navigation support.
 * Full accessibility integration for complex interfaces.
 */
export const InteractiveGrid: Story = {
  args: {
    preset: 'linear',
    role: 'grid',
    ariaLabel: 'Product selection grid',
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {/* biome-ignore lint/a11y/useSemanticElements: Demonstrating ARIA grid pattern for interactive grids */}
      <GridItem role="gridcell" focusable>
        <button
          type="button"
          className="w-full bg-secondary hover:bg-secondary/80 p-4 rounded-lg h-24 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span className="text-secondary-foreground font-medium">Dashboard Overview</span>
        </button>
      </GridItem>
      {/* biome-ignore lint/a11y/useSemanticElements: Demonstrating ARIA grid pattern for interactive grids */}
      <GridItem role="gridcell" focusable>
        <button
          type="button"
          className="w-full bg-secondary hover:bg-secondary/80 p-4 rounded-lg h-24 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span className="text-secondary-foreground font-medium">User Reports</span>
        </button>
      </GridItem>
      {/* biome-ignore lint/a11y/useSemanticElements: Demonstrating ARIA grid pattern for interactive grids */}
      <GridItem role="gridcell" focusable>
        <button
          type="button"
          className="w-full bg-secondary hover:bg-secondary/80 p-4 rounded-lg h-24 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span className="text-secondary-foreground font-medium">System Status</span>
        </button>
      </GridItem>
      {/* biome-ignore lint/a11y/useSemanticElements: Demonstrating ARIA grid pattern for interactive grids */}
      <GridItem role="gridcell" focusable>
        <button
          type="button"
          className="w-full bg-secondary hover:bg-secondary/80 p-4 rounded-lg h-24 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span className="text-secondary-foreground font-medium">Account Settings</span>
        </button>
      </GridItem>
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive grid with full keyboard navigation and WCAG AAA compliance for complex interfaces.',
      },
    },
  },
};

/**
 * Semantic HTML elements for proper document structure.
 * Progressive enhancement with meaningful markup.
 */
export const SemanticMarkup: Story = {
  args: {
    preset: 'golden',
    as: 'section',
    gap: 'lg',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem as="article">
        <div className="bg-card border border-border p-6 rounded-lg h-48 flex flex-col">
          <h3 className="text-lg font-semibold mb-3 text-foreground">Platform Release Notes</h3>
          <p className="text-sm text-muted-foreground flex-1">
            Semantic section containing article elements for proper document structure.
          </p>
          <time className="text-xs text-muted-foreground">December 15, 2024</time>
        </div>
      </GridItem>
      <GridItem as="article">
        <div className="bg-card border border-border p-6 rounded-lg h-48 flex flex-col">
          <h4 className="text-md font-semibold mb-3 text-foreground">Security Update</h4>
          <p className="text-sm text-muted-foreground flex-1">
            Each grid item can use semantic HTML for better accessibility.
          </p>
          <time className="text-xs text-muted-foreground">December 14, 2024</time>
        </div>
      </GridItem>
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Semantic HTML elements provide proper document structure and progressive enhancement.',
      },
    },
  },
};
