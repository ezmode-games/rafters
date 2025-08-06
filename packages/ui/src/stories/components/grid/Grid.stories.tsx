// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, GridItem } from '../../../components/Grid';

/**
 * Grid Layout Intelligence provides flexible, responsive grid layouts with semantic spacing.
 * Built on CSS Grid with phi-based spacing intelligence and responsive optimization patterns.
 * Every grid arrangement follows mathematical principles for optimal visual organization.
 */
const meta = {
  title: '03 Components/Layout/Grid',
  component: Grid,
  tags: ['!autodocs', '!dev', 'test'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Intelligent grid system with responsive optimization, phi-based spacing, and layout intelligence patterns for organized content presentation.',
      },
    },
  },
  argTypes: {
    columns: {
      control: 'object',
      description: 'Number of grid columns (responsive)',
    },
    autoFit: {
      control: 'text',
      description: 'Minimum column width for auto-fit',
    },
    autoFill: {
      control: 'text',
      description: 'Maximum column width for auto-fill',
    },
    gap: {
      control: 'select',
      options: ['phi--2', 'phi--1', 'phi-0', 'phi-1', 'phi-2', 'phi-3'],
      description: 'Grid gap using phi-based spacing',
    },
    dense: {
      control: 'boolean',
      description: 'Enable dense packing for content optimization',
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo content component
function DemoCard({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-muted border rounded-lg p-phi-1 flex items-center justify-center min-h-[6rem] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Basic grid with responsive columns demonstrating layout intelligence.
 * Adapts from single column on mobile to multiple columns on larger screens.
 */
export const Basic: Story = {
  args: {
    columns: { base: 1, md: 2, lg: 3 },
    gap: 'phi-1',
  },
  render: (args) => (
    <Grid {...args}>
      <DemoCard>Content 1</DemoCard>
      <DemoCard>Content 2</DemoCard>
      <DemoCard>Content 3</DemoCard>
      <DemoCard>Content 4</DemoCard>
      <DemoCard>Content 5</DemoCard>
      <DemoCard>Content 6</DemoCard>
    </Grid>
  ),
};

/**
 * Auto-fit intelligence automatically adjusts column count based on content width.
 * Maintains minimum column width while maximizing space utilization.
 */
export const AutoFit: Story = {
  args: {
    autoFit: '250px',
    gap: 'phi-1',
  },
  render: (args) => (
    <Grid {...args}>
      <DemoCard>Auto-fit 1</DemoCard>
      <DemoCard>Auto-fit 2</DemoCard>
      <DemoCard>Auto-fit 3</DemoCard>
      <DemoCard>Auto-fit 4</DemoCard>
      <DemoCard>Auto-fit 5</DemoCard>
    </Grid>
  ),
};

/**
 * Auto-fill intelligence creates empty columns to maintain consistent layout.
 * Provides predictable column behavior for structured content presentation.
 */
export const AutoFill: Story = {
  args: {
    autoFill: '200px',
    gap: 'phi-1',
  },
  render: (args) => (
    <Grid {...args}>
      <DemoCard>Auto-fill 1</DemoCard>
      <DemoCard>Auto-fill 2</DemoCard>
      <DemoCard>Auto-fill 3</DemoCard>
    </Grid>
  ),
};

/**
 * Spacing intelligence using phi-based gaps for mathematical visual harmony.
 * Demonstrates how golden ratio spacing creates optimal visual relationships.
 */
export const SpacingIntelligence: Story = {
  args: {
    columns: 3,
    gap: 'phi-2',
  },
  render: (args) => (
    <div className="space-y-phi-2">
      <div>
        <h3 className="heading-component mb-phi--1">Phi-2 Gap (Large)</h3>
        <Grid {...args}>
          <DemoCard>Item 1</DemoCard>
          <DemoCard>Item 2</DemoCard>
          <DemoCard>Item 3</DemoCard>
        </Grid>
      </div>
      
      <div>
        <h3 className="heading-component mb-phi--1">Phi-1 Gap (Medium)</h3>
        <Grid {...args} gap="phi-1">
          <DemoCard>Item 1</DemoCard>
          <DemoCard>Item 2</DemoCard>
          <DemoCard>Item 3</DemoCard>
        </Grid>
      </div>
      
      <div>
        <h3 className="heading-component mb-phi--1">Phi--1 Gap (Small)</h3>
        <Grid {...args} gap="phi--1">
          <DemoCard>Item 1</DemoCard>
          <DemoCard>Item 2</DemoCard>
          <DemoCard>Item 3</DemoCard>
        </Grid>
      </div>
    </div>
  ),
};

/**
 * GridItem intelligence with column spanning and positioning.
 * Demonstrates content organization patterns for varied content hierarchy.
 */
export const GridItemIntelligence: Story = {
  args: {
    columns: 4,
    gap: 'phi-1',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem colSpan={2}>
        <DemoCard>Span 2 columns</DemoCard>
      </GridItem>
      <DemoCard>Column 1</DemoCard>
      <DemoCard>Column 1</DemoCard>
      <DemoCard>Column 1</DemoCard>
      <GridItem colSpan={3}>
        <DemoCard>Span 3 columns</DemoCard>
      </GridItem>
      <GridItem colSpan={4}>
        <DemoCard>Full width span</DemoCard>
      </GridItem>
    </Grid>
  ),
};

/**
 * Dense packing optimization for efficient space utilization.
 * Automatically fills gaps with content that fits, optimizing cognitive load.
 */
export const DenseLayout: Story = {
  args: {
    columns: 4,
    gap: 'phi-1',
    dense: true,
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem colSpan={2} rowSpan={2}>
        <DemoCard className="min-h-[12rem]">Large item</DemoCard>
      </GridItem>
      <DemoCard>Item 1</DemoCard>
      <DemoCard>Item 2</DemoCard>
      <DemoCard>Item 3</DemoCard>
      <DemoCard>Item 4</DemoCard>
      <GridItem colSpan={2}>
        <DemoCard>Wide item</DemoCard>
      </GridItem>
      <DemoCard>Item 5</DemoCard>
      <DemoCard>Item 6</DemoCard>
    </Grid>
  ),
};

/**
 * Complex responsive layout demonstrating full grid intelligence.
 * Adapts column spans and positioning based on viewport size.
 */
export const ResponsiveIntelligence: Story = {
  args: {
    columns: { base: 1, md: 2, lg: 4 },
    gap: 'phi-1',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem colSpan={{ base: 1, md: 2, lg: 2 }}>
        <DemoCard>Hero content</DemoCard>
      </GridItem>
      <GridItem colSpan={{ base: 1, lg: 2 }}>
        <DemoCard>Secondary content</DemoCard>
      </GridItem>
      <DemoCard>Content 1</DemoCard>
      <DemoCard>Content 2</DemoCard>
      <DemoCard>Content 3</DemoCard>
      <GridItem colSpan={{ base: 1, md: 2, lg: 4 }}>
        <DemoCard>Footer content</DemoCard>
      </GridItem>
    </Grid>
  ),
};