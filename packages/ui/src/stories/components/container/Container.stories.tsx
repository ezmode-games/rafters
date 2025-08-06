// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

/**
 * Layout intelligence begins with the container. Every content area needs clear boundaries,
 * optimal reading widths, and responsive behavior that serves human cognitive patterns.
 * Our Container system implements design intelligence principles for maximum content clarity.
 */
const meta = {
  title: '03 Components/Layout/Container',
  component: Container,
  tags: ['!autodocs', '!dev', 'test'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Intelligent container component providing responsive layout foundation with content optimization patterns. Implements phi-based spacing, optimal reading widths, and semantic HTML structure.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: 'Responsive container size with content optimization',
    },
    center: {
      control: 'boolean',
      description: 'Center content horizontally for optimal reading experience',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Phi-based padding for cognitive load optimization',
    },
    as: {
      control: 'select',
      options: ['div', 'main', 'section', 'article'],
      description: 'Semantic HTML element for accessibility excellence',
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo content for stories
const DemoContent = ({ title = "Layout Intelligence Demo" }: { title?: string }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-primary">{title}</h2>
    <p className="text-muted-foreground">
      This container demonstrates intelligent layout patterns with optimal content width,
      responsive behavior, and phi-based spacing. The content is optimized for readability
      with 65-75 character line lengths.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-accent p-4 rounded-md">
        <h3 className="font-semibold mb-2">Responsive Intelligence</h3>
        <p className="text-sm">Smart breakpoint behavior adapts to screen sizes.</p>
      </div>
      <div className="bg-accent p-4 rounded-md">
        <h3 className="font-semibold mb-2">Content Optimization</h3>
        <p className="text-sm">Optimal reading width for cognitive comfort.</p>
      </div>
      <div className="bg-accent p-4 rounded-md">
        <h3 className="font-semibold mb-2">Spacing Intelligence</h3>
        <p className="text-sm">Phi-based spacing creates natural rhythm.</p>
      </div>
    </div>
  </div>
);

export const LayoutIntelligence: Story = {
  render: (args) => {
    return (
      <div className="min-h-screen bg-background">
        <Container {...args}>
          <DemoContent title="Container Layout Intelligence" />
        </Container>
      </div>
    );
  },
  args: {
    size: 'md',
    center: true,
    padding: 'md',
    as: 'div',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Primary demonstration of Container layout intelligence with default optimal settings for content readability.',
      },
    },
  },
};

export const SizeVariants: Story = {
  render: () => {
    const sizes = ['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;
    
    return (
      <div className="space-y-8 p-8 bg-background">
        {sizes.map((size) => (
          <div key={size} className="space-y-2">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Size: {size} {size === 'md' && '(Optimal Reading Width)'}
            </h3>
            <Container size={size} padding="md" className="bg-accent/10 border border-accent">
              <DemoContent title={`${size.toUpperCase()} Container`} />
            </Container>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'All size variants demonstrating responsive intelligence from mobile-first (sm) to full-width layouts. The "md" size provides optimal reading width of 65-75 characters.',
      },
    },
  },
};

export const SpacingIntelligence: Story = {
  render: () => {
    const paddings = ['none', 'sm', 'md', 'lg'] as const;
    
    return (
      <div className="space-y-8 p-8 bg-background">
        {paddings.map((padding) => (
          <div key={padding} className="space-y-2">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Padding: {padding} {padding === 'md' && '(Balanced Default)'}
            </h3>
            <Container size="lg" padding={padding} className="bg-accent/10 border border-accent">
              <DemoContent title={`${padding.toUpperCase()} Padding`} />
            </Container>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Phi-based spacing intelligence providing consistent padding patterns for cognitive load optimization. Each step follows mathematical proportions for natural visual rhythm.',
      },
    },
  },
};

export const SemanticHTML: Story = {
  render: () => {
    const elements = [
      { as: 'div', label: 'Div (Generic Container)', description: 'Default container for general content grouping' },
      { as: 'main', label: 'Main (Primary Content)', description: 'Main content landmark for accessibility' },
      { as: 'section', label: 'Section (Thematic Group)', description: 'Thematic content grouping with implicit heading' },
      { as: 'article', label: 'Article (Standalone)', description: 'Self-contained content that could be syndicated' },
    ] as const;
    
    return (
      <div className="space-y-6 p-8 bg-background">
        {elements.map(({ as, label, description }) => (
          <div key={as} className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-primary">{label}</h3>
              <code className="text-sm bg-accent px-2 py-1 rounded">&lt;{as}&gt;</code>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <Container as={as} size="lg" padding="md" className="bg-accent/10 border border-accent">
              <DemoContent title={`Content in ${as} element`} />
            </Container>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Semantic HTML support for accessibility excellence. Each element type provides proper document structure and landmark navigation for screen readers.',
      },
    },
  },
};

export const CenteringBehavior: Story = {
  render: () => {
    return (
      <div className="space-y-8 p-8 bg-background">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Centered Container (center=true)
          </h3>
          <Container size="lg" center={true} padding="md" className="bg-accent/10 border border-accent">
            <DemoContent title="Centered Content Layout" />
          </Container>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Left-aligned Container (center=false)
          </h3>
          <Container size="lg" center={false} padding="md" className="bg-accent/10 border border-accent">
            <DemoContent title="Left-aligned Content Layout" />
          </Container>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Full-width Container (size=full, center ignored)
          </h3>
          <Container size="full" center={true} padding="md" className="bg-accent/10 border border-accent">
            <DemoContent title="Full-width Content Layout" />
          </Container>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Content optimization through centering behavior. Centered layouts improve readability by creating balanced whitespace, while full-width containers ignore centering for edge-to-edge layouts.',
      },
    },
  },
};

export const ResponsiveShowcase: Story = {
  render: () => {
    return (
      <div className="min-h-screen bg-background">
        <Container as="main" size="xl" padding="lg">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-primary">
                Responsive Layout Intelligence
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                This showcase demonstrates how Container adapts intelligently across different
                screen sizes while maintaining optimal content readability and cognitive comfort.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Container size="md" padding="lg" className="bg-accent/10 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Reading-optimized Content</h2>
                <p className="mb-4">
                  This container uses the "md" size which provides optimal reading width
                  of approximately 65-75 characters per line, following typography best
                  practices for sustained reading comfort.
                </p>
                <p>
                  The phi-based spacing creates natural visual rhythm that reduces
                  cognitive load and improves information processing.
                </p>
              </Container>
              
              <Container size="sm" padding="md" className="bg-accent/10 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Compact Layout</h2>
                <p className="mb-4">
                  Smaller containers work well for sidebars, cards, or mobile-first
                  content where space efficiency is important.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 p-3 rounded text-center">
                    <span className="text-sm font-medium">Metric A</span>
                  </div>
                  <div className="bg-primary/10 p-3 rounded text-center">
                    <span className="text-sm font-medium">Metric B</span>
                  </div>
                </div>
              </Container>
            </div>
            
            <Container size="full" padding="none" className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
              <Container size="lg" padding="lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  Nested Container Pattern
                </h2>
                <p className="text-center text-muted-foreground">
                  Full-width backgrounds with centered content demonstrate advanced
                  layout patterns using nested containers for maximum design flexibility.
                </p>
              </Container>
            </Container>
          </div>
        </Container>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete responsive showcase demonstrating real-world usage patterns with nested containers, mixed sizes, and intelligent spacing for complex layouts.',
      },
    },
  },
};