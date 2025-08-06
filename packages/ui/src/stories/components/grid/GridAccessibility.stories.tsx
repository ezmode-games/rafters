// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, GridItem } from '../../../components/Grid';

/**
 * Grid Layout Intelligence accessibility patterns demonstrating semantic structure,
 * reading order optimization, and cognitive load reduction through organized content.
 */
const meta = {
  title: '03 Components/Layout/Grid/Accessibility',
  component: Grid,
  tags: ['!autodocs', '!dev', 'test'],
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
        ],
      },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo content with semantic structure
function SemanticCard({ 
  children, 
  role = 'article',
  className = '',
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { role?: string }) {
  return (
    <div
      role={role}
      className={`bg-card border rounded-lg p-phi-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Reading order intelligence ensuring logical navigation flow.
 * Grid maintains proper tab order and screen reader navigation patterns.
 */
export const ReadingOrder: Story = {
  args: {
    columns: { base: 1, md: 2, lg: 3 },
    gap: 'phi-1',
  },
  render: (args) => (
    <Grid {...args} role="main" aria-label="Article grid">
      <SemanticCard>
        <h3>Article 1</h3>
        <p>First article content that should be read first in document order.</p>
        <button type="button">Read more</button>
      </SemanticCard>
      
      <SemanticCard>
        <h3>Article 2</h3>
        <p>Second article content maintaining logical reading sequence.</p>
        <button type="button">Read more</button>
      </SemanticCard>
      
      <SemanticCard>
        <h3>Article 3</h3>
        <p>Third article content following natural reading progression.</p>
        <button type="button">Read more</button>
      </SemanticCard>
      
      <SemanticCard>
        <h3>Article 4</h3>
        <p>Fourth article content in proper document flow.</p>
        <button type="button">Read more</button>
      </SemanticCard>
    </Grid>
  ),
};

/**
 * Semantic structure with proper landmarks and heading hierarchy.
 * Grid preserves content relationships while organizing visual layout.
 */
export const SemanticStructure: Story = {
  args: {
    columns: { base: 1, lg: 3 },
    gap: 'phi-2',
  },
  render: (args) => (
    <div>
      <header className="mb-phi-2">
        <h1 className="heading-section">Product Categories</h1>
        <p className="text-muted-foreground">Explore our organized product selection</p>
      </header>
      
      <Grid {...args} role="region" aria-label="Product categories">
        <section>
          <SemanticCard role="region">
            <h2 className="heading-component">Electronics</h2>
            <p>Latest technology and devices</p>
            <nav aria-label="Electronics subcategories">
              <ul className="list-none space-y-1">
                <li><a href="#" className="text-primary hover:underline">Smartphones</a></li>
                <li><a href="#" className="text-primary hover:underline">Laptops</a></li>
                <li><a href="#" className="text-primary hover:underline">Audio</a></li>
              </ul>
            </nav>
          </SemanticCard>
        </section>
        
        <section>
          <SemanticCard role="region">
            <h2 className="heading-component">Home & Garden</h2>
            <p>Transform your living space</p>
            <nav aria-label="Home and garden subcategories">
              <ul className="list-none space-y-1">
                <li><a href="#" className="text-primary hover:underline">Furniture</a></li>
                <li><a href="#" className="text-primary hover:underline">Decor</a></li>
                <li><a href="#" className="text-primary hover:underline">Tools</a></li>
              </ul>
            </nav>
          </SemanticCard>
        </section>
        
        <section>
          <SemanticCard role="region">
            <h2 className="heading-component">Sports & Outdoors</h2>
            <p>Gear for active lifestyles</p>
            <nav aria-label="Sports and outdoors subcategories">
              <ul className="list-none space-y-1">
                <li><a href="#" className="text-primary hover:underline">Fitness</a></li>
                <li><a href="#" className="text-primary hover:underline">Camping</a></li>
                <li><a href="#" className="text-primary hover:underline">Water Sports</a></li>
              </ul>
            </nav>
          </SemanticCard>
        </section>
      </Grid>
    </div>
  ),
};

/**
 * Focus management with clear visual hierarchy and keyboard navigation.
 * Grid maintains accessibility while providing responsive layout intelligence.
 */
export const FocusManagement: Story = {
  args: {
    columns: 2,
    gap: 'phi-1',
  },
  render: (args) => (
    <Grid {...args} role="group" aria-label="Interactive dashboard">
      <GridItem colSpan={2}>
        <SemanticCard className="bg-primary text-primary-foreground">
          <h2 className="heading-component text-primary-foreground">Dashboard Overview</h2>
          <p>Main dashboard summary with key metrics</p>
          <button 
            type="button"
            className="mt-phi--1 px-phi-1 py-2 bg-primary-foreground text-primary rounded focus:ring-2 focus:ring-primary-foreground"
          >
            View Details
          </button>
        </SemanticCard>
      </GridItem>
      
      <SemanticCard>
        <h3 className="heading-subcomponent">Sales Analytics</h3>
        <p>Track your sales performance</p>
        <button 
          type="button"
          className="mt-phi--1 px-phi-1 py-2 bg-secondary text-secondary-foreground rounded focus:ring-2 focus:ring-primary"
        >
          Open Analytics
        </button>
      </SemanticCard>
      
      <SemanticCard>
        <h3 className="heading-subcomponent">User Management</h3>
        <p>Manage system users and permissions</p>
        <button 
          type="button"
          className="mt-phi--1 px-phi-1 py-2 bg-secondary text-secondary-foreground rounded focus:ring-2 focus:ring-primary"
        >
          Manage Users
        </button>
      </SemanticCard>
      
      <SemanticCard>
        <h3 className="heading-subcomponent">System Settings</h3>
        <p>Configure application preferences</p>
        <button 
          type="button"
          className="mt-phi--1 px-phi-1 py-2 bg-secondary text-secondary-foreground rounded focus:ring-2 focus:ring-primary"
        >
          Open Settings
        </button>
      </SemanticCard>
      
      <SemanticCard>
        <h3 className="heading-subcomponent">Reports</h3>
        <p>Generate and view system reports</p>
        <button 
          type="button"
          className="mt-phi--1 px-phi-1 py-2 bg-secondary text-secondary-foreground rounded focus:ring-2 focus:ring-primary"
        >
          View Reports
        </button>
      </SemanticCard>
    </Grid>
  ),
};

/**
 * Cognitive load optimization through clear content grouping.
 * Grid organization reduces mental processing by creating logical content clusters.
 */
export const CognitiveLoad: Story = {
  args: {
    columns: { base: 1, md: 2, lg: 4 },
    gap: 'phi-1',
  },
  render: (args) => (
    <div className="space-y-phi-3">
      <section>
        <h2 className="heading-section mb-phi-1">Personal Information</h2>
        <Grid {...args}>
          <SemanticCard>
            <label className="block heading-subcomponent mb-phi--2">First Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              placeholder="Enter first name"
              aria-describedby="fname-help"
            />
            <p id="fname-help" className="text-caption mt-1 text-muted-foreground">Required field</p>
          </SemanticCard>
          
          <SemanticCard>
            <label className="block heading-subcomponent mb-phi--2">Last Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              placeholder="Enter last name"
              aria-describedby="lname-help"
            />
            <p id="lname-help" className="text-caption mt-1 text-muted-foreground">Required field</p>
          </SemanticCard>
          
          <SemanticCard>
            <label className="block heading-subcomponent mb-phi--2">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              placeholder="Enter email address"
              aria-describedby="email-help"
            />
            <p id="email-help" className="text-caption mt-1 text-muted-foreground">Used for notifications</p>
          </SemanticCard>
          
          <SemanticCard>
            <label className="block heading-subcomponent mb-phi--2">Phone</label>
            <input 
              type="tel" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              placeholder="Enter phone number"
              aria-describedby="phone-help"
            />
            <p id="phone-help" className="text-caption mt-1 text-muted-foreground">Optional field</p>
          </SemanticCard>
        </Grid>
      </section>
      
      <section>
        <h2 className="heading-section mb-phi-1">Address Information</h2>
        <Grid {...args}>
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <SemanticCard>
              <label className="block heading-subcomponent mb-phi--2">Street Address</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                placeholder="Enter street address"
              />
            </SemanticCard>
          </GridItem>
          
          <SemanticCard>
            <label className="block heading-subcomponent mb-phi--2">City</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              placeholder="Enter city"
            />
          </SemanticCard>
          
          <SemanticCard>
            <label className="block heading-subcomponent mb-phi--2">Postal Code</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              placeholder="Enter postal code"
            />
          </SemanticCard>
        </Grid>
      </section>
    </div>
  ),
};