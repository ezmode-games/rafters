import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  ActionLayout,
  AppLayout,
  Container,
  ContentSidebar,
  ContentStack,
  ReadingLayout,
} from '../../components';

const meta = {
  title: '01 Identity/Layout System',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Introduction: Story = {
  render: () => (
    <Container variant="wide">
      <div className="py-phi-3 text-center">
        <h1 className="heading-hero">Layout System</h1>
        <p className="text-body-large max-w-3xl mx-auto">
          Spatial relationships that create order without constraint. Our layout system establishes
          foundations for content organization while preserving creative freedom and responsive
          adaptability.
        </p>

        <div className="mt-phi-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-2 max-w-6xl mx-auto">
          <div className="p-phi-2 border border-muted rounded-lg text-left">
            <h3 className="heading-component">Content First</h3>
            <p className="text-body">Grid serves content needs, not design convenience</p>
          </div>
          <div className="p-phi-2 border border-muted rounded-lg text-left">
            <h3 className="heading-component">Mathematical Harmony</h3>
            <p className="text-body">
              Golden ratio proportions create inherently pleasing relationships
            </p>
          </div>
          <div className="p-phi-2 border border-muted rounded-lg text-left">
            <h3 className="heading-component">Cognitive Respect</h3>
            <p className="text-body">Patterns based on eye-tracking research and memory limits</p>
          </div>
          <div className="p-phi-2 border border-muted rounded-lg text-left">
            <h3 className="heading-component">Flexible Foundation</h3>
            <p className="text-body">Consistent structure that adapts to content variety</p>
          </div>
        </div>
      </div>
    </Container>
  ),
};

export const GoldenRatioSpacing: Story = {
  render: () => (
    <Container variant="golden">
      <ContentStack>
        <h1 className="heading-display">Golden Ratio Spacing</h1>
        <p className="text-body">Typography classes have built-in phi spacing automatically.</p>

        <h3 className="heading-component">Utility Classes (for edge cases)</h3>
        <div className="grid grid-cols-4 gap-phi-1">
          <div className="p-phi--2 bg-muted rounded">φ⁻² spacing</div>
          <div className="p-phi--1 bg-muted rounded">φ⁻¹ spacing</div>
          <div className="p-phi-1 bg-muted rounded">φ¹ spacing</div>
          <div className="p-phi-2 bg-muted rounded">φ² spacing</div>
        </div>

        <p className="text-body-small">Use utilities only when you need to override defaults.</p>
      </ContentStack>
    </Container>
  ),
};

export const LayoutPatterns: Story = {
  render: () => (
    <div className="space-y-phi-3">
      <Container variant="reading">
        <ReadingLayout>
          <h2 className="heading-section">Reading Layout</h2>
          <div>
            <p className="text-body">
              Main content flows in scannable pattern optimized for text consumption...
            </p>
            <p className="text-body">
              Second paragraph continues reading flow with proper spacing...
            </p>
          </div>
          <aside className="text-body-small border-l-2 border-border pl-4">
            Sidebar content for metadata, navigation, or supplementary information
          </aside>
        </ReadingLayout>
      </Container>

      <Container variant="golden">
        <ActionLayout>
          <div className="brand font-semibold">Logo</div>
          <button type="button" className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Action
          </button>
          <div className="hero text-center">
            <h1 className="heading-hero">Hero Content</h1>
            <p className="text-body-large">Conversion-focused layout for landing pages</p>
          </div>
          <button
            type="button"
            className="bg-secondary text-secondary-foreground px-6 py-3 rounded"
          >
            Call to Action
          </button>
        </ActionLayout>
      </Container>
    </div>
  ),
};

export const GoldenProportions: Story = {
  render: () => (
    <Container variant="golden">
      <div className="space-y-phi-2">
        <ContentSidebar>
          <main>
            <h2 className="heading-section">Content (61.8%)</h2>
            <p className="text-body">
              Primary content area gets the larger portion following golden ratio proportions.
            </p>
          </main>
          <aside className="bg-muted p-phi-1 rounded">
            <h3 className="heading-component">Sidebar (38.2%)</h3>
            <p className="text-body-small">Secondary content in complementary proportion.</p>
          </aside>
        </ContentSidebar>

        <div className="hero-golden bg-muted rounded">
          <h1 className="heading-hero">Hero Section</h1>
          <p className="text-body-large">61.8vh height feels natural and draws attention</p>
        </div>
      </div>
    </Container>
  ),
};

export const ApplicationLayout: Story = {
  render: () => (
    <div className="space-y-phi-3">
      <h2 className="heading-section px-4">Dashboard/App Layout</h2>
      <AppLayout>
        <header className="bg-muted p-phi-1 border-b border-border">
          <h3 className="heading-component">App Header</h3>
        </header>
        <nav className="bg-muted/50 p-phi-1 border-r border-border">
          <p className="text-body-small">Navigation sidebar</p>
        </nav>
        <main className="p-phi-2">
          <h1 className="heading-display">Main Content</h1>
          <p className="text-body">
            Dashboard content, forms, data views, and application features.
          </p>
        </main>
      </AppLayout>
    </div>
  ),
};

export const ContainerVariants: Story = {
  render: () => (
    <div className="space-y-phi-3">
      <Container variant="reading">
        <div className="bg-muted p-phi-1 rounded">
          <h3 className="heading-component">Reading Container</h3>
          <p className="text-body">
            Optimized for 45-75 characters per line, perfect for articles and documentation.
          </p>
        </div>
      </Container>

      <Container variant="golden">
        <div className="bg-muted p-phi-1 rounded">
          <h3 className="heading-component">Golden Container</h3>
          <p className="text-body">Golden ratio width for balanced content and whitespace.</p>
        </div>
      </Container>

      <Container variant="wide">
        <div className="bg-muted p-phi-1 rounded">
          <h3 className="heading-component">Wide Container</h3>
          <p className="text-body">Maximum 7xl width for dashboards and data-heavy interfaces.</p>
        </div>
      </Container>

      <Container variant="full">
        <div className="bg-muted p-phi-1 rounded">
          <h3 className="heading-component">Full Container</h3>
          <p className="text-body">Full width with padding for edge-to-edge layouts.</p>
        </div>
      </Container>
    </div>
  ),
};
