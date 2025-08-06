import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

const meta = {
  title: '03 Components/Layout/Container/Variants',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo content for variant demonstrations
const VariantDemo = ({ variant, description }: { variant: string; description: string }) => (
  <div className="space-y-4">
    <h3 className="heading-subsection text-primary">{variant} Variant</h3>
    <p className="text-body text-muted-foreground">{description}</p>
    <div className="bg-muted/10 p-4 rounded border border-muted">
      <p className="text-body-small">
        Content adapted to this container variant using design system tokens
        for consistent, predictable layout behavior across all applications.
      </p>
    </div>
  </div>
);

export const ContainerVariants: Story = {
  render: () => (
    <div className="space-y-8 p-8 bg-background">
      <div className="text-center space-y-2 mb-8">
        <h2 className="heading-section">Container Variants</h2>
        <p className="text-body-large text-muted-foreground">
          Each variant uses specific design system tokens for consistent layout intelligence
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="border border-muted rounded-lg p-6">
          <Container variant="reading" padding="phi-1" className="bg-accent/5 border border-accent rounded">
            <VariantDemo
              variant="Reading"
              description="Uses container-reading token (~38rem) for optimal reading width of 45-75 characters per line. Perfect for articles, documentation, and long-form content."
            />
          </Container>
        </div>
        
        <div className="border border-muted rounded-lg p-6">
          <Container variant="golden" padding="phi-1" className="bg-accent/5 border border-accent rounded">
            <VariantDemo
              variant="Golden"
              description="Uses container-golden token (61.8rem) based on golden ratio proportions. Ideal for main content areas with balanced visual weight."
            />
          </Container>
        </div>
        
        <div className="border border-muted rounded-lg p-6">
          <Container variant="wide" padding="phi-1" className="bg-accent/5 border border-accent rounded">
            <VariantDemo
              variant="Wide"
              description="Uses max-w-7xl for wide layouts with generous content space. Perfect for dashboards, data tables, and complex interfaces."
            />
          </Container>
        </div>
        
        <div className="border border-muted rounded-lg p-6">
          <Container variant="full" padding="phi-1" className="bg-accent/5 border border-accent rounded">
            <VariantDemo
              variant="Full"
              description="Full width container for edge-to-edge layouts. Ideal for hero sections, full-bleed images, and immersive experiences."
            />
          </Container>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All container variants using design system tokens. Each variant serves specific layout purposes with mathematical proportions for optimal user experience.',
      },
    },
  },
};

export const VariantComparison: Story = {
  render: () => (
    <div className="space-y-4 bg-background p-8">
      <h2 className="heading-section text-center mb-8">Size Comparison</h2>
      
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-block border-2 border-primary/20 rounded">
            <Container variant="reading" padding="phi-0" className="bg-primary/5">
              <div className="text-center p-4">
                <span className="text-body font-medium">Reading (~38rem)</span>
              </div>
            </Container>
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-block border-2 border-primary/20 rounded">
            <Container variant="golden" padding="phi-0" className="bg-primary/5">
              <div className="text-center p-4">
                <span className="text-body font-medium">Golden (~61.8rem)</span>
              </div>
            </Container>
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-block border-2 border-primary/20 rounded">
            <Container variant="wide" padding="phi-0" className="bg-primary/5">
              <div className="text-center p-4">
                <span className="text-body font-medium">Wide (max-w-7xl)</span>
              </div>
            </Container>
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-block border-2 border-primary/20 rounded w-full">
            <Container variant="full" padding="phi-0" className="bg-primary/5">
              <div className="text-center p-4">
                <span className="text-body font-medium">Full (100% width)</span>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual comparison of container variants showing relative sizes and proportional relationships using design system tokens.',
      },
    },
  },
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-4">
      <Container variant="golden" padding="phi-2">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="heading-section">Responsive Container Behavior</h2>
            <p className="text-body-large text-muted-foreground">
              Container variants adapt intelligently to different screen sizes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Container variant="reading" padding="phi-1" className="bg-info/10 border border-info rounded">
              <h3 className="heading-component text-info-foreground mb-2">Mobile</h3>
              <p className="text-body-small">
                Containers maintain readability on small screens while using full available width
              </p>
            </Container>
            
            <Container variant="golden" padding="phi-1" className="bg-warning/10 border border-warning rounded">
              <h3 className="heading-component text-warning-foreground mb-2">Tablet</h3>
              <p className="text-body-small">
                Golden ratio proportions provide balanced layouts on medium screens
              </p>
            </Container>
            
            <Container variant="wide" padding="phi-1" className="bg-success/10 border border-success rounded">
              <h3 className="heading-component text-success-foreground mb-2">Desktop</h3>
              <p className="text-body-small">
                Wide variants utilize available space while maintaining content structure
              </p>
            </Container>
          </div>
        </div>
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how container variants respond to different screen sizes while maintaining optimal proportions and readability.',
      },
    },
  },
};