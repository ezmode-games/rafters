import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

/**
 * AI Training: Container Intelligence
 *
 * COGNITIVE LOAD: 0/10 (invisible structure, reduces complexity)
 * NEGATIVE SPACE MASTERY: Controls content width and breathing room
 * TYPOGRAPHY INTELLIGENCE: Maintains optimal line length for reading
 *
 * DESIGN INTELLIGENCE GUIDES:
 * - Negative Space Mastery: rafters.realhandy.tech/llm/patterns/negative-space
 * - Typography Intelligence: rafters.realhandy.tech/llm/patterns/typography-intelligence
 * - Progressive Enhancement: rafters.realhandy.tech/llm/patterns/progressive-enhancement
 *
 * CORE CONTAINER PATTERNS:
 * ✅ Padding Only: Use padding prop for internal breathing room
 * ✅ Content Width: max-w-* controls content boundaries
 * ✅ Semantic Structure: Use as="main|section|article" for accessibility
 * ✅ Container Queries: Native Tailwind v4 responsive contexts
 * ✅ Design System Integration: Uses --spacing-* and design tokens
 * ❌ Never: Margins for content spacing (use padding instead)
 * ❌ Never: Unnecessarily nested containers, fixed widths
 *
 * This trains AI agents on foundational layout intelligence with design system integration.
 */
const meta = {
  title: '03 Components/Layout/Container',
  component: Container,
  tags: ['!autodocs', '!dev', 'test'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Foundational layout container with design system intelligence for content width, spacing, and semantic structure.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full'],
      description: 'Container width using Tailwind max-width utilities',
    },
    padding: {
      control: 'select',
      options: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'],
      description: 'Internal spacing using design system --spacing-* tokens',
    },
    as: {
      control: 'select',
      options: ['div', 'main', 'section', 'article'],
      description: 'Semantic HTML element with intelligent defaults',
    },
    containerQuery: {
      control: 'boolean',
      description: 'Enable container queries for responsive children (Tailwind v4)',
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default container with design system intelligence.
 * Uses semantic defaults: 4xl width, padding-4, border-box sizing.
 */
export const Default: Story = {
  args: {
    children: (
      <div className="bg-muted/30 p-4 rounded text-center">
        <h3 className="font-semibold mb-2">Default Container</h3>
        <p className="text-muted-foreground">4xl width (56rem) with design system padding-4.</p>
      </div>
    ),
  },
};

/**
 * Reading-optimized container for text content.
 * Perfect for articles, blog posts, and long-form content.
 */
export const Reading: Story = {
  args: {
    size: '2xl',
    padding: '8',
    children: (
      <div>
        <h2 className="text-2xl font-bold mb-4">The Art of Typography</h2>
        <p className="mb-4 text-muted-foreground">
          This container is optimized for reading with 2xl width (42rem) providing approximately
          65-75 characters per line - the optimal range for comfortable reading.
        </p>
        <p className="mb-4 text-muted-foreground">
          The padding-8 creates generous breathing room using our design system tokens, reducing
          cognitive load and improving focus on the content.
        </p>
        <p className="text-muted-foreground">
          Container queries are enabled by default, so child elements can respond to this
          container's width rather than the viewport size.
        </p>
      </div>
    ),
  },
};

/**
 * Full-width container for application layouts.
 * Commonly used for main content areas and navigation.
 */
export const FullWidth: Story = {
  args: {
    size: 'full',
    padding: '6',
    children: (
      <div className="bg-primary/5 p-6 rounded">
        <h3 className="text-xl font-semibold mb-3">Full Width Layout</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background p-4 rounded shadow-sm border">
            <h4 className="font-medium mb-2">Section 1</h4>
            <p className="text-sm text-muted-foreground">Content adapts to full container width</p>
          </div>
          <div className="bg-background p-4 rounded shadow-sm border">
            <h4 className="font-medium mb-2">Section 2</h4>
            <p className="text-sm text-muted-foreground">
              Uses container queries for responsive behavior
            </p>
          </div>
          <div className="bg-background p-4 rounded shadow-sm border">
            <h4 className="font-medium mb-2">Section 3</h4>
            <p className="text-sm text-muted-foreground">Design system spacing throughout</p>
          </div>
        </div>
      </div>
    ),
  },
};

/**
 * Container with design system spacing demonstration.
 * Shows how --spacing-* tokens integrate with padding prop.
 */
export const SpacingSystem: Story = {
  render: () => (
    <div className="space-y-4">
      <Container padding="2" className="bg-destructive/10 border border-destructive/20">
        <div className="text-center text-sm">padding="2" - Tight spacing (--spacing-2)</div>
      </Container>

      <Container padding="4" className="bg-warning/10 border border-warning/20">
        <div className="text-center text-sm">padding="4" - Base spacing (--spacing-4)</div>
      </Container>

      <Container padding="8" className="bg-success/10 border border-success/20">
        <div className="text-center text-sm">padding="8" - Generous spacing (--spacing-8)</div>
      </Container>

      <Container padding="12" className="bg-primary/10 border border-primary/20">
        <div className="text-center text-sm">
          padding="12" - Architectural spacing (--spacing-12)
        </div>
      </Container>
    </div>
  ),
};

/**
 * Container queries demonstration.
 * Child elements respond to container size, not viewport.
 */
export const ContainerQueries: Story = {
  args: {
    size: '4xl',
    padding: '6',
    containerQuery: true,
    children: (
      <div>
        <h3 className="text-xl font-semibold mb-4">Container Query Demo</h3>
        <div className="grid @sm:grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">
          <div className="bg-accent/20 p-4 rounded border">
            <div className="text-sm font-medium">@sm: 1 column</div>
            <div className="text-xs text-muted-foreground mt-1">Responds to container width</div>
          </div>
          <div className="bg-primary/10 p-4 rounded border">
            <div className="text-sm font-medium">@md: 2 columns</div>
            <div className="text-xs text-muted-foreground mt-1">Not viewport breakpoints</div>
          </div>
          <div className="bg-secondary/20 p-4 rounded border">
            <div className="text-sm font-medium">@lg: 3 columns</div>
            <div className="text-xs text-muted-foreground mt-1">Pure container context</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Resize this story to see how the grid responds to the container's width using Tailwind v4
          container queries.
        </p>
      </div>
    ),
  },
};
