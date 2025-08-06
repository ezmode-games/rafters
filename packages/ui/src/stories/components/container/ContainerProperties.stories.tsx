import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

const meta = {
  title: '03 Components/Layout/Container/Properties',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo content for property demonstrations
const PropertyDemo = ({ title, description }: { title: string; description: string }) => (
  <div className="space-y-3">
    <h3 className="heading-component text-primary">{title}</h3>
    <p className="text-body text-muted-foreground">{description}</p>
    <div className="bg-muted/10 p-4 rounded border">
      <p className="text-body-small">
        Interactive demonstration of container properties using design system tokens
        for consistent spacing and layout behavior.
      </p>
    </div>
  </div>
);

export const SpacingProperties: Story = {
  render: () => (
    <div className="space-y-8 bg-background p-8">
      <div className="text-center mb-8">
        <h2 className="heading-section">Phi-Based Spacing Properties</h2>
        <p className="text-body-large text-muted-foreground">
          Container padding using golden ratio design tokens
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="heading-subsection">Minimal Spacing</h3>
          
          <div className="border border-muted rounded">
            <div className="p-2 bg-muted/10 border-b">
              <code className="text-sm">padding="phi--2"</code>
            </div>
            <Container variant="reading" padding="phi--2" className="bg-accent/5">
              <PropertyDemo
                title="Phi -2 Spacing"
                description="Minimal padding (0.382rem) for compact layouts and tight spacing requirements."
              />
            </Container>
          </div>
          
          <div className="border border-muted rounded">
            <div className="p-2 bg-muted/10 border-b">
              <code className="text-sm">padding="phi--1"</code>
            </div>
            <Container variant="reading" padding="phi--1" className="bg-accent/5">
              <PropertyDemo
                title="Phi -1 Spacing"
                description="Tight padding (0.618rem) for space-efficient designs while maintaining readability."
              />
            </Container>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="heading-subsection">Standard Spacing</h3>
          
          <div className="border border-muted rounded">
            <div className="p-2 bg-muted/10 border-b">
              <code className="text-sm">padding="phi-0"</code>
            </div>
            <Container variant="reading" padding="phi-0" className="bg-accent/5">
              <PropertyDemo
                title="Phi 0 Spacing"
                description="Base padding (1rem) for standard content spacing and balanced layouts."
              />
            </Container>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="heading-subsection">Generous Spacing</h3>
          
          <div className="border border-muted rounded">
            <div className="p-2 bg-muted/10 border-b">
              <code className="text-sm">padding="phi-1"</code>
            </div>
            <Container variant="reading" padding="phi-1" className="bg-accent/5">
              <PropertyDemo
                title="Phi 1 Spacing"
                description="Paragraph spacing (1.618rem) for comfortable content separation."
              />
            </Container>
          </div>
          
          <div className="border border-muted rounded">
            <div className="p-2 bg-muted/10 border-b">
              <code className="text-sm">padding="phi-2"</code>
            </div>
            <Container variant="reading" padding="phi-2" className="bg-accent/5">
              <PropertyDemo
                title="Phi 2 Spacing"
                description="Block spacing (2.618rem) for major content sections and generous breathing room."
              />
            </Container>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all padding properties using phi-based spacing tokens from the design system for mathematical spacing relationships.',
      },
    },
  },
};

export const VariantProperties: Story = {
  render: () => (
    <div className="space-y-8 bg-background p-8">
      <div className="text-center mb-8">
        <h2 className="heading-section">Container Variant Properties</h2>
        <p className="text-body-large text-muted-foreground">
          Different container variants for specific layout needs
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-muted rounded">
            <div className="p-3 bg-muted/10 border-b">
              <code className="text-sm">variant="reading"</code>
            </div>
            <Container variant="reading" padding="phi-1" className="bg-info/5">
              <PropertyDemo
                title="Reading Container"
                description="Optimized for text content with ~38rem width (45-75 characters per line) using container-reading token."
              />
            </Container>
          </div>
          
          <div className="border border-muted rounded">
            <div className="p-3 bg-muted/10 border-b">
              <code className="text-sm">variant="golden"</code>
            </div>
            <Container variant="golden" padding="phi-1" className="bg-warning/5">
              <PropertyDemo
                title="Golden Container"
                description="Golden ratio proportions (~61.8rem) using container-golden token for balanced layouts."
              />
            </Container>
          </div>
        </div>
        
        <div className="border border-muted rounded">
          <div className="p-3 bg-muted/10 border-b">
            <code className="text-sm">variant="wide"</code>
          </div>
          <Container variant="wide" padding="phi-1" className="bg-success/5">
            <PropertyDemo
              title="Wide Container"
              description="Maximum width (max-w-7xl) for dashboard layouts, data tables, and complex interfaces requiring generous space."
            />
          </Container>
        </div>
        
        <div className="border border-muted rounded">
          <div className="p-3 bg-muted/10 border-b">
            <code className="text-sm">variant="full"</code>
          </div>
          <Container variant="full" padding="phi-1" className="bg-destructive/5">
            <PropertyDemo
              title="Full Width Container"
              description="100% width for edge-to-edge layouts, hero sections, and immersive content experiences."
            />
          </Container>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive demonstration of container variant properties showing how each serves specific layout purposes using design system tokens.',
      },
    },
  },
};

export const CombinedProperties: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8">
      <Container variant="golden" padding="phi-2">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="heading-section">Combined Properties</h2>
            <p className="text-body-large text-muted-foreground">
              Demonstrating variant and spacing combinations for complex layouts
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border border-muted rounded-lg overflow-hidden">
              <div className="p-4 bg-muted/10 border-b">
                <h3 className="heading-component">Article Layout</h3>
                <code className="text-sm text-muted-foreground">variant="reading" padding="phi-1"</code>
              </div>
              <Container variant="reading" padding="phi-1">
                <article className="space-y-4">
                  <h1 className="heading-subsection">Design System Intelligence</h1>
                  <p className="text-body">
                    Reading containers with phi-1 spacing create optimal conditions for long-form content.
                    The 38rem width ensures 45-75 characters per line while the 1.618rem padding provides
                    comfortable breathing room that follows natural mathematical relationships.
                  </p>
                  <p className="text-body">
                    This combination reduces cognitive load and improves reading comprehension through
                    scientifically-backed typography principles integrated into our design system tokens.
                  </p>
                </article>
              </Container>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-muted rounded-lg overflow-hidden">
                <div className="p-3 bg-muted/10 border-b">
                  <h4 className="heading-subcomponent">Compact Card</h4>
                  <code className="text-sm text-muted-foreground">variant="reading" padding="phi--1"</code>
                </div>
                <Container variant="reading" padding="phi--1" className="bg-accent/5">
                  <div className="space-y-2">
                    <h5 className="heading-subcomponent">Quick Info</h5>
                    <p className="text-body-small">Compact spacing for information density while maintaining readability.</p>
                  </div>
                </Container>
              </div>
              
              <div className="border border-muted rounded-lg overflow-hidden">
                <div className="p-3 bg-muted/10 border-b">
                  <h4 className="heading-subcomponent">Spacious Section</h4>
                  <code className="text-sm text-muted-foreground">variant="golden" padding="phi-2"</code>
                </div>
                <Container variant="golden" padding="phi-2" className="bg-primary/5">
                  <div className="space-y-3">
                    <h5 className="heading-subcomponent">Featured Content</h5>
                    <p className="text-body-small">Generous spacing for important content that needs emphasis and breathing room.</p>
                  </div>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples of combining variant and spacing properties to create purposeful layouts using design system intelligence.',
      },
    },
  },
};