// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, GridItem } from '../../../components/Grid';

/**
 * Grid Layout Intelligence responsive patterns demonstrating adaptive behavior,
 * breakpoint optimization, and content-aware layout adjustments.
 */
const meta = {
  title: '03 Components/Layout/Grid/Intelligence',
  component: Grid,
  tags: ['!autodocs', '!dev', 'test'],
  parameters: {
    layout: 'padded',
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '360px', height: '640px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1200px', height: '800px' } },
      },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Intelligent content card with adaptive behavior
function IntelligentCard({ 
  title, 
  content, 
  priority = 'normal',
  className = '',
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  content: string;
  priority?: 'high' | 'normal' | 'low';
}) {
  const priorityStyles = {
    high: 'bg-primary text-primary-foreground border-primary',
    normal: 'bg-card text-card-foreground border-border',
    low: 'bg-muted text-muted-foreground border-muted',
  };

  return (
    <div
      className={`border rounded-lg p-phi-1 ${priorityStyles[priority]} ${className}`}
      {...props}
    >
      <h3 className="heading-subcomponent mb-phi--2">{title}</h3>
      <p className="text-body">{content}</p>
    </div>
  );
}

/**
 * Responsive column intelligence that adapts based on content importance.
 * High-priority content gets more space on larger screens.
 */
export const ContentPriority: Story = {
  args: {
    columns: { base: 1, md: 2, lg: 3, xl: 4 },
    gap: 'phi-1',
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem colSpan={{ base: 1, md: 2, lg: 2 }}>
        <IntelligentCard
          title="Primary Feature"
          content="Main content that needs prominent display across all screen sizes."
          priority="high"
        />
      </GridItem>
      
      <IntelligentCard
        title="Secondary Info"
        content="Important supporting information that scales appropriately."
        priority="normal"
      />
      
      <IntelligentCard
        title="Quick Stats"
        content="Compact metrics that stack on mobile, align on desktop."
        priority="normal"
      />
      
      <IntelligentCard
        title="Additional Data"
        content="Supplementary information that appears on larger screens."
        priority="low"
      />
      
      <GridItem colSpan={{ base: 1, lg: 2 }}>
        <IntelligentCard
          title="Related Content"
          content="Content that expands to fill available space intelligently."
          priority="normal"
        />
      </GridItem>
      
      <IntelligentCard
        title="Meta Info"
        content="Metadata that adjusts position based on layout context."
        priority="low"
      />
    </Grid>
  ),
};

/**
 * Auto-fit intelligence with minimum and maximum constraints.
 * Grid automatically optimizes column count based on content width requirements.
 */
export const AutoFitIntelligence: Story = {
  args: {
    autoFit: '280px',
    gap: 'phi-1',
  },
  render: (args) => (
    <div className="space-y-phi-2">
      <div>
        <h3 className="heading-component mb-phi--1">Auto-fit: 280px minimum</h3>
        <p className="text-muted-foreground mb-phi-1">
          Columns automatically adjust count based on available space
        </p>
        <Grid {...args}>
          <IntelligentCard
            title="Product A"
            content="Responsive product card that maintains readability at all sizes."
          />
          <IntelligentCard
            title="Product B"
            content="Intelligent layout that ensures content never becomes cramped."
          />
          <IntelligentCard
            title="Product C"
            content="Grid system that prioritizes content accessibility over rigid structure."
          />
          <IntelligentCard
            title="Product D"
            content="Adaptive behavior that works seamlessly across all viewport sizes."
          />
          <IntelligentCard
            title="Product E"
            content="Smart spacing that maintains visual relationships regardless of column count."
          />
        </Grid>
      </div>
      
      <div>
        <h3 className="heading-component mb-phi--1">Auto-fit: 200px minimum</h3>
        <p className="text-muted-foreground mb-phi-1">
          More columns fit with smaller minimum width
        </p>
        <Grid autoFit="200px" gap="phi-1">
          <IntelligentCard
            title="Compact A"
            content="Smaller cards that fit more per row."
          />
          <IntelligentCard
            title="Compact B"
            content="Efficient space utilization pattern."
          />
          <IntelligentCard
            title="Compact C"
            content="Maintains readability at smaller sizes."
          />
          <IntelligentCard
            title="Compact D"
            content="Responsive behavior with tighter spacing."
          />
          <IntelligentCard
            title="Compact E"
            content="Grid intelligence adapts to content needs."
          />
          <IntelligentCard
            title="Compact F"
            content="Optimal density without sacrificing clarity."
          />
        </Grid>
      </div>
    </div>
  ),
};

/**
 * Breakpoint optimization with semantic layout transitions.
 * Grid intelligently reorganizes content hierarchy at different screen sizes.
 */
export const BreakpointOptimization: Story = {
  render: () => (
    <div className="space-y-phi-3">
      <section>
        <h2 className="heading-section mb-phi-1">Dashboard Layout Intelligence</h2>
        <p className="text-muted-foreground mb-phi-2">
          Layout adapts hierarchy and organization based on available space
        </p>
        
        <Grid 
          columns={{ base: 1, sm: 2, lg: 4 }} 
          gap="phi-1"
        >
          {/* Hero section - full width on mobile, spans 2 on larger */}
          <GridItem colSpan={{ base: 1, sm: 2, lg: 2 }}>
            <IntelligentCard
              title="Main Dashboard"
              content="Primary dashboard content that maintains prominence across all screen sizes."
              priority="high"
              className="min-h-[8rem]"
            />
          </GridItem>
          
          {/* Secondary content - stacks on mobile, side-by-side on tablet+ */}
          <IntelligentCard
            title="Quick Actions"
            content="Frequently used actions positioned for easy access."
            priority="normal"
          />
          
          <IntelligentCard
            title="Notifications"
            content="System alerts and updates with responsive positioning."
            priority="normal"
          />
          
          {/* Detail sections - full width on mobile/tablet, grid on desktop */}
          <IntelligentCard
            title="Analytics"
            content="Performance metrics with responsive data visualization."
            priority="normal"
          />
          
          <IntelligentCard
            title="Recent Activity"
            content="Timeline of recent system activities and user actions."
            priority="normal"
          />
          
          <IntelligentCard
            title="System Status"
            content="Current system health and operational metrics."
            priority="normal"
          />
          
          <IntelligentCard
            title="Quick Settings"
            content="Commonly adjusted preferences and configuration options."
            priority="low"
          />
        </Grid>
      </section>
      
      <section>
        <h2 className="heading-section mb-phi-1">Content Adaptation Patterns</h2>
        <p className="text-muted-foreground mb-phi-2">
          Content organization changes based on cognitive load and screen space
        </p>
        
        <Grid 
          columns={{ base: 1, md: 3, lg: 5 }} 
          gap="phi-1"
        >
          {/* Primary content maintains consistent positioning */}
          <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
            <IntelligentCard
              title="Article Content"
              content="Main article content that maintains optimal reading width across devices while adapting layout organization."
              priority="high"
              className="min-h-[10rem]"
            />
          </GridItem>
          
          {/* Sidebar content adapts position based on space */}
          <GridItem colSpan={{ base: 1, md: 1, lg: 2 }}>
            <div className="space-y-phi-1">
              <IntelligentCard
                title="Related Links"
                content="Contextual navigation that moves from bottom on mobile to side on desktop."
                priority="normal"
              />
              
              <IntelligentCard
                title="Author Info"
                content="Author details positioned optimally for each screen size."
                priority="low"
              />
            </div>
          </GridItem>
        </Grid>
      </section>
    </div>
  ),
};

/**
 * Dense packing intelligence for content optimization.
 * Automatically arranges content to minimize whitespace while maintaining readability.
 */
export const DensePackingIntelligence: Story = {
  args: {
    columns: { base: 2, md: 3, lg: 4 },
    gap: 'phi-1',
    dense: true,
  },
  render: (args) => (
    <div className="space-y-phi-2">
      <div>
        <h3 className="heading-component mb-phi--1">Standard Grid Flow</h3>
        <p className="text-muted-foreground mb-phi-1">
          Items follow document order with natural gaps
        </p>
        <Grid {...args} dense={false}>
          <IntelligentCard title="Item 1" content="Standard flow item" />
          <GridItem colSpan={2}>
            <IntelligentCard 
              title="Wide Item" 
              content="This item spans two columns, creating gaps in standard flow."
              className="min-h-[6rem]"
            />
          </GridItem>
          <IntelligentCard title="Item 3" content="Follows after wide item" />
          <IntelligentCard title="Item 4" content="Creates visual gap above" />
          <IntelligentCard title="Item 5" content="Standard width item" />
          <IntelligentCard title="Item 6" content="Standard width item" />
        </Grid>
      </div>
      
      <div>
        <h3 className="heading-component mb-phi--1">Dense Packing Intelligence</h3>
        <p className="text-muted-foreground mb-phi-1">
          Automatically fills gaps for optimal space utilization
        </p>
        <Grid {...args}>
          <IntelligentCard title="Item 1" content="Dense flow item" />
          <GridItem colSpan={2}>
            <IntelligentCard 
              title="Wide Item" 
              content="This wide item doesn't create gaps - subsequent items fill available space."
              className="min-h-[6rem]"
            />
          </GridItem>
          <IntelligentCard title="Item 3" content="Intelligently positioned" />
          <IntelligentCard title="Item 4" content="Fills available space" />
          <IntelligentCard title="Item 5" content="Optimized placement" />
          <IntelligentCard title="Item 6" content="Efficient organization" />
        </Grid>
      </div>
    </div>
  ),
};