import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Grid, GridItem } from '../../../components/Grid';

/**
 * Grid Semantic Usage Patterns - Contextual Applications
 *
 * This file trains AI agents on contextual usage patterns and semantic meaning.
 * Each story demonstrates appropriate use cases and content-driven layout decisions.
 *
 * TRAINING FOCUS: Semantic meaning, contextual usage, and content-driven layouts
 */
const meta = {
  title: 'Components/Grid/Semantic',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Semantic usage patterns demonstrating contextual applications and content-driven layout decisions.',
      },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * E-commerce Product Catalogs
 *
 * Linear preset is perfect for product catalogs where all items need equal attention.
 * AI agents learn to use democratic attention patterns for commercial content.
 */
export const EcommerceProductCatalog: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Product Grid - Linear Preset</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Equal attention for all products encourages browsing and comparison shopping.
        </p>
        <Grid preset="linear" gap="md" role="presentation">
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-4 h-48 flex flex-col">
              <div className="bg-muted rounded h-24 mb-3 flex items-center justify-center text-sm text-muted-foreground">
                Product Image
              </div>
              <h4 className="font-semibold text-sm mb-1">Wireless Headphones</h4>
              <p className="text-sm text-muted-foreground mb-2">Premium audio experience</p>
              <div className="mt-auto">
                <div className="text-lg font-bold text-foreground">$149.99</div>
                <button
                  type="button"
                  className="w-full bg-primary text-primary-foreground py-2 rounded text-sm mt-2"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-4 h-48 flex flex-col">
              <div className="bg-muted rounded h-24 mb-3 flex items-center justify-center text-sm text-muted-foreground">
                Product Image
              </div>
              <h4 className="font-semibold text-sm mb-1">Bluetooth Speaker</h4>
              <p className="text-sm text-muted-foreground mb-2">Portable sound system</p>
              <div className="mt-auto">
                <div className="text-lg font-bold text-foreground">$89.99</div>
                <button
                  type="button"
                  className="w-full bg-primary text-primary-foreground py-2 rounded text-sm mt-2"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-4 h-48 flex flex-col">
              <div className="bg-muted rounded h-24 mb-3 flex items-center justify-center text-sm text-muted-foreground">
                Product Image
              </div>
              <h4 className="font-semibold text-sm mb-1">Smart Watch</h4>
              <p className="text-sm text-muted-foreground mb-2">Health and fitness tracker</p>
              <div className="mt-auto">
                <div className="text-lg font-bold text-foreground">$299.99</div>
                <button
                  type="button"
                  className="w-full bg-primary text-primary-foreground py-2 rounded text-sm mt-2"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-4 h-48 flex flex-col">
              <div className="bg-muted rounded h-24 mb-3 flex items-center justify-center text-sm text-muted-foreground">
                Product Image
              </div>
              <h4 className="font-semibold text-sm mb-1">Wireless Charger</h4>
              <p className="text-sm text-muted-foreground mb-2">Fast charging pad</p>
              <div className="mt-auto">
                <div className="text-lg font-bold text-foreground">$39.99</div>
                <button
                  type="button"
                  className="w-full bg-primary text-primary-foreground py-2 rounded text-sm mt-2"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          • Linear preset: Democratic attention, predictable scanning, optimal for product
          comparison
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'E-commerce product catalog using linear preset for equal attention and comparison shopping.',
      },
    },
  },
};

/**
 * Editorial News Layouts
 *
 * Golden and Bento presets for news sites where content has natural hierarchy.
 * AI agents learn to create editorial layouts that guide reading flow.
 */
export const EditorialNewsLayout: Story = {
  render: () => (
    <div className="space-y-10">
      <div>
        <h3 className="text-lg font-semibold mb-4">Featured Articles - Bento Editorial Pattern</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Hero article gets primary attention, supporting stories provide context.
        </p>
        <Grid as="section" preset="bento" bentoPattern="editorial" gap="lg">
          <GridItem as="article" priority="primary">
            <div className="bg-card border-l-4 border-primary p-6 h-48 flex flex-col">
              <div className="text-xs text-primary uppercase tracking-wide mb-2">Breaking News</div>
              <h2 className="text-xl font-bold mb-3 leading-tight">
                Major Technology Breakthrough Changes Industry Standards
              </h2>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                Revolutionary development in quantum computing brings us closer to solving complex
                global challenges. Industry experts predict widespread adoption within the next five
                years...
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>By Sarah Johnson</span>
                <span>2 hours ago</span>
              </div>
            </div>
          </GridItem>
          <GridItem as="article" priority="secondary">
            <div className="bg-card p-4 h-24 flex flex-col border-l-2 border-border">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tech</div>
              <h4 className="font-semibold text-sm mb-2 leading-tight">
                AI Ethics Guidelines Released
              </h4>
              <div className="mt-auto text-xs text-muted-foreground">1 hour ago</div>
            </div>
          </GridItem>
          <GridItem as="article" priority="secondary">
            <div className="bg-card p-4 h-24 flex flex-col border-l-2 border-border">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Business
              </div>
              <h4 className="font-semibold text-sm mb-2 leading-tight">
                Startup Funding Reaches Record High
              </h4>
              <div className="mt-auto text-xs text-muted-foreground">3 hours ago</div>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          • Bento editorial: Hero content dominates, supporting articles provide depth
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Section Headlines - Golden Preset</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Natural hierarchy guides readers through different news sections.
        </p>
        <Grid preset="golden" gap="comfortable">
          <GridItem>
            <div className="bg-card border-l-4 border-destructive p-4 h-32 flex flex-col">
              <div className="text-xs text-destructive uppercase tracking-wide mb-2">Politics</div>
              <h3 className="font-bold mb-2 leading-tight">Legislative Session Begins</h3>
              <p className="text-sm text-muted-foreground flex-1">
                Key bills focus on infrastructure...
              </p>
              <div className="text-xs text-muted-foreground">30 min ago</div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border-l-4 border-accent p-4 h-32 flex flex-col">
              <div className="text-xs text-accent-foreground uppercase tracking-wide mb-2">
                Sports
              </div>
              <h4 className="font-semibold mb-2 leading-tight">Championship Finals Tonight</h4>
              <p className="text-sm text-muted-foreground flex-1">
                Teams prepare for decisive match...
              </p>
              <div className="text-xs text-muted-foreground">45 min ago</div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border-l-4 border-primary p-4 h-32 flex flex-col">
              <div className="text-xs text-primary uppercase tracking-wide mb-2">Weather</div>
              <h4 className="font-semibold mb-2 leading-tight">Storm Warning Issued</h4>
              <p className="text-sm text-muted-foreground flex-1">
                Severe weather expected through...
              </p>
              <div className="text-xs text-muted-foreground">1 hour ago</div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border-l-4 border-secondary p-4 h-32 flex flex-col">
              <div className="text-xs text-secondary-foreground uppercase tracking-wide mb-2">
                Culture
              </div>
              <h4 className="font-semibold mb-2 leading-tight">Art Exhibition Opens</h4>
              <p className="text-sm text-muted-foreground flex-1">Contemporary works showcase...</p>
              <div className="text-xs text-muted-foreground">2 hours ago</div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border-l-4 border-accent p-4 h-32 flex flex-col">
              <div className="text-xs text-accent-foreground uppercase tracking-wide mb-2">
                Local
              </div>
              <h4 className="font-semibold mb-2 leading-tight">Community Event This Weekend</h4>
              <p className="text-sm text-muted-foreground flex-1">
                Annual festival brings together...
              </p>
              <div className="text-xs text-muted-foreground">4 hours ago</div>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          • Golden preset: Mathematical proportions create natural reading flow
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Editorial news layouts using bento and golden presets to create appropriate content hierarchy.',
      },
    },
  },
};

/**
 * Dashboard Analytics Interface
 *
 * Bento dashboard pattern for data-driven interfaces where metrics need hierarchy.
 * AI agents learn to prioritize key metrics while maintaining context.
 */
export const DashboardAnalytics: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Analytics Dashboard - Bento Dashboard Pattern
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Primary KPI gets maximum attention, supporting metrics provide context.
        </p>
        <Grid preset="bento" bentoPattern="dashboard" gap="lg" role="presentation">
          <GridItem priority="primary">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg h-32">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm opacity-80">Total Revenue</div>
                <div className="text-accent text-sm">↗ +12.5%</div>
              </div>
              <div className="text-3xl font-bold mb-1">$247,892</div>
              <div className="text-sm opacity-80">This month</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-foreground">2,341</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div className="text-accent text-sm">+5.2%</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-foreground">8,567</div>
                <div className="text-xs text-muted-foreground">Page Views</div>
              </div>
              <div className="text-accent text-sm">+8.1%</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-foreground">4.2%</div>
                <div className="text-xs text-muted-foreground">Conversion Rate</div>
              </div>
              <div className="text-accent text-sm">+0.3%</div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-16 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-foreground">38.5%</div>
                <div className="text-xs text-muted-foreground">Bounce Rate</div>
              </div>
              <div className="text-destructive text-sm">-2.1%</div>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          • Bento dashboard: Primary metric dominates, supporting KPIs provide context
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">System Status - Linear Monitoring</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Equal attention for system components enables quick status scanning.
        </p>
        <Grid preset="linear" gap="sm">
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg flex items-center space-x-3">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-sm">API Service</div>
                <div className="text-xs text-muted-foreground">99.9% uptime</div>
              </div>
              <div className="text-accent-foreground text-xs">Healthy</div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg flex items-center space-x-3">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-sm">Database</div>
                <div className="text-xs text-muted-foreground">Response: 45ms</div>
              </div>
              <div className="text-accent-foreground text-xs">Healthy</div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-secondary p-3 rounded-lg flex items-center space-x-3">
              <div className="w-3 h-3 bg-secondary rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-sm">Cache Layer</div>
                <div className="text-xs text-muted-foreground">High memory usage</div>
              </div>
              <div className="text-secondary-foreground text-xs">Warning</div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border p-3 rounded-lg flex items-center space-x-3">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <div className="flex-1">
                <div className="font-medium text-sm">CDN</div>
                <div className="text-xs text-muted-foreground">Global distribution</div>
              </div>
              <div className="text-accent-foreground text-xs">Healthy</div>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          • Linear preset: Equal monitoring attention enables quick system status assessment
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard analytics using bento pattern for KPI hierarchy and linear pattern for equal-priority monitoring.',
      },
    },
  },
};

/**
 * Portfolio and Creative Showcases
 *
 * Bento portfolio pattern for creative work where featured pieces need prominence.
 * AI agents learn to showcase creative content with appropriate visual hierarchy.
 */
export const PortfolioShowcase: Story = {
  render: () => (
    <div className="space-y-10">
      <div>
        <h3 className="text-lg font-semibold mb-4">Creative Portfolio - Bento Portfolio Pattern</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Featured work gets primary attention, portfolio pieces support the narrative.
        </p>
        <Grid preset="bento" bentoPattern="portfolio" gap="lg">
          <GridItem priority="primary">
            <div className="bg-primary p-6 rounded-lg h-48 flex flex-col justify-between text-primary-foreground">
              <div>
                <div className="text-sm opacity-80 mb-2">Featured Project</div>
                <h3 className="text-xl font-bold mb-3">E-commerce Redesign</h3>
                <p className="text-sm opacity-90">
                  Complete UX overhaul resulting in 40% increase in conversions and 60% reduction in
                  bounce rate.
                </p>
              </div>
              <div className="flex space-x-2 mt-4">
                <span className="bg-secondary px-2 py-1 rounded text-xs text-secondary-foreground">
                  UX Design
                </span>
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
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold text-xs">APP</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Mobile App UI</div>
                <div className="text-xs text-muted-foreground">iOS • Android • React Native</div>
              </div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-semibold text-xs">WEB</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">SaaS Dashboard</div>
                <div className="text-xs text-muted-foreground">Vue.js • D3.js • Analytics</div>
              </div>
            </div>
          </GridItem>
          <GridItem priority="secondary">
            <div className="bg-card border border-border p-4 rounded-lg h-24 flex items-center space-x-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <span className="text-secondary-foreground font-semibold text-xs">BRD</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Brand Identity</div>
                <div className="text-xs text-muted-foreground">Logo • Guidelines • Assets</div>
              </div>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          • Bento portfolio: Featured work dominates, supporting projects provide depth
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Image Gallery - Auto-Fit Linear</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Responsive image grid adapts to content while maintaining equal visual weight.
        </p>
        <Grid preset="custom" columns="auto-fit" autoFit="md" gap="md">
          <GridItem>
            <div className="bg-primary rounded-lg h-40 flex items-center justify-center text-primary-foreground">
              <div className="text-center">
                <div className="text-lg font-bold">LAND</div>
                <div className="text-sm mt-1">Landscape</div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-accent rounded-lg h-40 flex items-center justify-center text-accent-foreground">
              <div className="text-center">
                <div className="text-lg font-bold">NAT</div>
                <div className="text-sm mt-1">Nature</div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-secondary rounded-lg h-40 flex items-center justify-center text-secondary-foreground">
              <div className="text-center">
                <div className="text-lg font-bold">ARCH</div>
                <div className="text-sm mt-1">Architecture</div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-muted rounded-lg h-40 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-bold">PEO</div>
                <div className="text-sm mt-1">People</div>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-destructive rounded-lg h-40 flex items-center justify-center text-destructive-foreground">
              <div className="text-center">
                <div className="text-lg font-bold">EVT</div>
                <div className="text-sm mt-1">Events</div>
              </div>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          • Auto-fit linear: Responsive sizing with equal visual treatment for gallery browsing
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Portfolio showcase using bento pattern for featured work and auto-fit linear for image galleries.',
      },
    },
  },
};

/**
 * Team and Contact Pages
 *
 * Linear preset for team members and contact information where equality matters.
 * AI agents learn to treat people and contact methods with equal visual importance.
 */
export const TeamAndContact: Story = {
  render: () => (
    <div className="space-y-10">
      <div>
        <h3 className="text-lg font-semibold mb-4">Team Members - Linear Equality</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Equal treatment for all team members shows respect and professionalism.
        </p>
        <Grid preset="linear" gap="lg">
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-semibold">SJ</span>
              </div>
              <h4 className="font-semibold mb-1">Sarah Johnson</h4>
              <p className="text-sm text-muted-foreground mb-3">Lead Designer</p>
              <p className="text-xs text-muted-foreground mb-3">
                10+ years creating user experiences that delight and convert.
              </p>
              <div className="flex justify-center space-x-2">
                <a
                  href="https://linkedin.com"
                  className="text-primary hover:text-primary/80 text-xs"
                >
                  LinkedIn
                </a>
                <span className="text-border">•</span>
                <a
                  href="https://portfolio.example.com"
                  className="text-primary hover:text-primary/80 text-xs"
                >
                  Portfolio
                </a>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-accent-foreground font-semibold">MC</span>
              </div>
              <h4 className="font-semibold mb-1">Mike Chen</h4>
              <p className="text-sm text-muted-foreground mb-3">Senior Developer</p>
              <p className="text-xs text-muted-foreground mb-3">
                Full-stack engineer passionate about performance and scalability.
              </p>
              <div className="flex justify-center space-x-2">
                <a href="https://github.com" className="text-primary hover:text-primary/80 text-xs">
                  GitHub
                </a>
                <span className="text-border">•</span>
                <a
                  href="https://blog.example.com"
                  className="text-primary hover:text-primary/80 text-xs"
                >
                  Blog
                </a>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-secondary-foreground font-semibold">AR</span>
              </div>
              <h4 className="font-semibold mb-1">Alex Rivera</h4>
              <p className="text-sm text-muted-foreground mb-3">Product Manager</p>
              <p className="text-xs text-muted-foreground mb-3">
                Strategic thinker focused on user needs and business outcomes.
              </p>
              <div className="flex justify-center space-x-2">
                <a
                  href="https://linkedin.com"
                  className="text-primary hover:text-primary/80 text-xs"
                >
                  LinkedIn
                </a>
                <span className="text-border">•</span>
                <a href="https://medium.com" className="text-primary hover:text-primary/80 text-xs">
                  Medium
                </a>
              </div>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          • Linear preset: Equal visual treatment respects all team members equally
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Methods - Linear Options</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Multiple contact options presented equally to accommodate user preferences.
        </p>
        <Grid preset="linear" gap="md">
          <GridItem>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
              <div className="text-primary text-2xl mb-2 font-bold">✉</div>
              <h4 className="font-semibold text-sm mb-2">Email</h4>
              <p className="text-xs text-muted-foreground mb-2">Get in touch via email</p>
              <a href="mailto:hello@company.com" className="text-primary text-sm">
                hello@company.com
              </a>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
              <div className="text-accent-foreground text-2xl mb-2 font-bold">☏</div>
              <h4 className="font-semibold text-sm mb-2">Phone</h4>
              <p className="text-xs text-muted-foreground mb-2">Call us directly</p>
              <a href="tel:+1-555-123-4567" className="text-accent-foreground text-sm">
                +1 (555) 123-4567
              </a>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 text-center">
              <div className="text-secondary-foreground text-2xl mb-2 font-bold">○</div>
              <h4 className="font-semibold text-sm mb-2">Live Chat</h4>
              <p className="text-xs text-muted-foreground mb-2">Instant support</p>
              <button type="button" className="text-secondary-foreground text-sm">
                Start Chat
              </button>
            </div>
          </GridItem>
          <GridItem>
            <div className="bg-muted border border-border rounded-lg p-4 text-center">
              <div className="text-muted-foreground text-2xl mb-2 font-bold">□</div>
              <h4 className="font-semibold text-sm mb-2">Visit</h4>
              <p className="text-xs text-muted-foreground mb-2">Come see us</p>
              <address className="text-foreground text-sm not-italic">123 Main St, City</address>
            </div>
          </GridItem>
        </Grid>
        <p className="text-sm text-muted-foreground mt-4">
          • Linear preset: Equal treatment allows users to choose their preferred contact method
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Team and contact pages using linear preset for equal treatment and democratic attention patterns.',
      },
    },
  },
};
