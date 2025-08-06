import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

const meta = {
  title: '03 Components/Layout/Container/Semantic',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo content for semantic demonstrations
const SemanticDemo = ({ element, purpose, description }: { element: string; purpose: string; description: string }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <h3 className="heading-component text-primary">{purpose}</h3>
      <code className="text-sm bg-muted px-2 py-1 rounded">&lt;{element}&gt;</code>
    </div>
    <p className="text-body text-muted-foreground">{description}</p>
    <div className="bg-muted/10 p-4 rounded border">
      <p className="text-body-small">
        Semantic HTML structure improves accessibility, SEO, and screen reader navigation
        while maintaining visual consistency through design system tokens.
      </p>
    </div>
  </div>
);

export const SemanticElements: Story = {
  render: () => (
    <div className="space-y-8 bg-background p-8">
      <div className="text-center mb-8">
        <h2 className="heading-section">Semantic HTML Elements</h2>
        <p className="text-body-large text-muted-foreground">
          Container as different semantic elements for proper document structure
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="border border-muted rounded-lg overflow-hidden">
          <div className="p-3 bg-muted/10 border-b">
            <span className="text-sm font-medium">Main Content Landmark</span>
          </div>
          <Container as="main" variant="golden" padding="phi-1" className="bg-primary/5">
            <SemanticDemo
              element="main"
              purpose="Primary Content"
              description="The main content landmark identifies the primary content of the page. Screen readers can skip directly to this section, improving navigation efficiency for assistive technology users."
            />
          </Container>
        </div>
        
        <div className="border border-muted rounded-lg overflow-hidden">
          <div className="p-3 bg-muted/10 border-b">
            <span className="text-sm font-medium">Thematic Grouping</span>
          </div>
          <Container as="section" variant="reading" padding="phi-1" className="bg-info/5">
            <SemanticDemo
              element="section"
              purpose="Content Section"
              description="Represents a thematic grouping of content with an implicit heading. Sections help organize content into logical chunks that assistive technology can navigate efficiently."
            />
          </Container>
        </div>
        
        <div className="border border-muted rounded-lg overflow-hidden">
          <div className="p-3 bg-muted/10 border-b">
            <span className="text-sm font-medium">Standalone Content</span>
          </div>
          <Container as="article" variant="reading" padding="phi-2" className="bg-success/5">
            <SemanticDemo
              element="article"
              purpose="Independent Article"
              description="Self-contained content that could be distributed independently. Articles are perfect for blog posts, news articles, or any content that makes sense on its own."
            />
          </Container>
        </div>
        
        <div className="border border-muted rounded-lg overflow-hidden">
          <div className="p-3 bg-muted/10 border-b">
            <span className="text-sm font-medium">Generic Container</span>
          </div>
          <Container as="div" variant="golden" padding="phi-0" className="bg-muted/5">
            <SemanticDemo
              element="div"
              purpose="Generic Container"
              description="The default div element for generic content grouping without specific semantic meaning. Use when other semantic elements don't apply."
            />
          </Container>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates semantic HTML elements with Container component for proper document structure and accessibility. Each element serves specific purposes for screen readers and SEO.',
      },
    },
  },
};

export const DocumentStructure: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <Container as="main" variant="wide" padding="phi-2">
        <div className="space-y-8">
          <Container as="section" variant="golden" padding="phi-1" className="text-center bg-primary/5 rounded-lg">
            <h1 className="heading-display">Design System Documentation</h1>
            <p className="text-body-large text-muted-foreground">
              Semantic structure using Container components with proper landmarks
            </p>
          </Container>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Container as="article" variant="reading" padding="phi-2" className="bg-card rounded-lg border">
              <div className="space-y-4">
                <h2 className="heading-section">Container Intelligence</h2>
                <p className="text-body">
                  This article demonstrates how Container components maintain semantic meaning
                  while providing consistent layout intelligence through design system tokens.
                </p>
                <p className="text-body">
                  The reading variant ensures optimal line length for sustained reading,
                  while phi-based spacing creates natural visual rhythm.
                </p>
                
                <Container as="section" variant="reading" padding="phi-1" className="bg-accent/10 rounded">
                  <h3 className="heading-subsection">Nested Sections</h3>
                  <p className="text-body-small">
                    Sections within articles create hierarchical content structure
                    that assistive technology can navigate efficiently.
                  </p>
                </Container>
              </div>
            </Container>
            
            <Container as="section" variant="reading" padding="phi-2" className="bg-card rounded-lg border">
              <div className="space-y-4">
                <h2 className="heading-section">Accessibility Benefits</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-3"></div>
                    <div>
                      <h4 className="heading-subcomponent">Screen Reader Navigation</h4>
                      <p className="text-body-small text-muted-foreground">
                        Semantic elements create landmark navigation points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-3"></div>
                    <div>
                      <h4 className="heading-subcomponent">SEO Enhancement</h4>
                      <p className="text-body-small text-muted-foreground">
                        Proper document structure improves search rankings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-3"></div>
                    <div>
                      <h4 className="heading-subcomponent">Content Hierarchy</h4>
                      <p className="text-body-small text-muted-foreground">
                        Clear content relationships for better comprehension
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete document structure example showing how semantic Container elements create proper HTML hierarchy for accessibility and SEO while maintaining design consistency.',
      },
    },
  },
};

export const LandmarkNavigation: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-6">
        <div className="bg-info/10 border border-info rounded-lg p-4">
          <h2 className="heading-subsection text-info-foreground mb-2">Accessibility Tip</h2>
          <p className="text-body-small">
            Screen reader users can press landmark navigation keys to jump between semantic elements.
            Try using a screen reader to navigate this page structure.
          </p>
        </div>
        
        <Container as="main" variant="wide" padding="phi-1" className="bg-primary/5 rounded-lg">
          <h1 className="heading-section mb-4">Main Content Area</h1>
          <p className="text-body mb-6">
            This main landmark contains the primary content of the page. Screen readers
            announce this as "main region" and allow quick navigation via the 'M' key.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Container as="section" variant="reading" padding="phi-1" className="bg-card rounded border">
              <h2 className="heading-subsection mb-3">First Section</h2>
              <p className="text-body-small">
                Sections create thematic groupings that screen readers can navigate
                using heading navigation or region commands.
              </p>
            </Container>
            
            <Container as="section" variant="reading" padding="phi-1" className="bg-card rounded border">
              <h2 className="heading-subsection mb-3">Second Section</h2>
              <p className="text-body-small">
                Each section maintains independent semantic meaning while sharing
                consistent visual treatment through design system tokens.
              </p>
            </Container>
          </div>
          
          <Container as="article" variant="golden" padding="phi-2" className="mt-8 bg-accent/10 rounded-lg">
            <h2 className="heading-subsection mb-4">Featured Article</h2>
            <p className="text-body mb-4">
              Articles represent standalone content that could be syndicated or
              distributed independently. Screen readers announce article boundaries
              clearly for better content comprehension.
            </p>
            <p className="text-body-small text-muted-foreground">
              This semantic structure combined with design system tokens creates
              both accessible and visually consistent user experiences.
            </p>
          </Container>
        </Container>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Landmark navigation demonstration showing how semantic Container elements create navigable page structure for assistive technology users.',
      },
    },
  },
};