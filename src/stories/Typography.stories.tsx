import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Typography guidelines establish clear hierarchies and organize information
 * based on importance. When applied well, typography enables content to be
 * communicated clearly, effectively, and efficiently.
 */
const meta = {
  title: '01 Identity/Typography',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Typography System Overview
 *
 * Rafters uses a systematic approach to typography that creates intuitive
 * hierarchies and maintains consistency across all digital experiences.
 * Our semantic typography system replaces verbose utility classes with
 * meaningful tokens based on golden ratio proportions.
 */
export const Overview: Story = {
  render: () => (
    <div className="min-h-screen">
      <div className="container mx-auto px-16 py-32 max-w-7xl">
        <div className="prose prose-xl max-w-none">
          <div className="mb-32">
            <h1 className="heading-display mb-16">Typography</h1>
            <p className="body-large text-muted-foreground max-w-4xl">
              Typography guidelines establish clear hierarchies and organize information based on
              importance. When applied well, typography enables content to be communicated clearly,
              effectively, and efficiently.
            </p>
            <p className="body text-muted-foreground mt-8">
              To modify your typography settings, visit the <strong>/manage</strong> route in your
              application.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 my-40">
            <div className="space-y-12">
              <h3 className="heading-section mb-16">Design Principles</h3>
              <div className="space-y-12">
                <div>
                  <h4 className="heading-subsection mb-6">Hierarchy First</h4>
                  <p className="body text-muted-foreground">
                    Clear visual order guides user attention
                  </p>
                </div>
                <div>
                  <h4 className="heading-subsection mb-6">Readable Always</h4>
                  <p className="body text-muted-foreground">
                    Optimized for scanning and comprehension
                  </p>
                </div>
                <div>
                  <h4 className="heading-subsection mb-6">Responsive Scale</h4>
                  <p className="body text-muted-foreground">
                    Consistent proportions across all devices
                  </p>
                </div>
                <div>
                  <h4 className="heading-subsection mb-6">Brand Expression</h4>
                  <p className="body text-muted-foreground">Typography reflects your identity</p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <h3 className="heading-section mb-16">Semantic System</h3>
              <div className="space-y-12">
                <div>
                  <h4 className="heading-subsection mb-6">Golden Ratio Scale</h4>
                  <p className="body text-muted-foreground">
                    Mathematical harmony in typography sizing
                  </p>
                </div>
                <div>
                  <h4 className="heading-subsection mb-6">Semantic Classes</h4>
                  <p className="body text-muted-foreground">
                    Meaningful tokens replace verbose utilities
                  </p>
                </div>
                <div>
                  <h4 className="heading-subsection mb-6">Font Flexibility</h4>
                  <p className="body text-muted-foreground">Configurable families via onboarding</p>
                </div>
                <div>
                  <h4 className="heading-subsection mb-6">Responsive Fluid</h4>
                  <p className="body text-muted-foreground">CSS clamp() for optimal scaling</p>
                </div>
              </div>
            </div>
          </div>

          <div className="my-40">
            <h2 className="heading-page mb-16">Typography as Interface</h2>
            <p className="body-large text-muted-foreground max-w-4xl mb-20">
              Rafters typography creates flexible systems understood intuitively. Different weights,
              sizes, and spacing work together to guide users through content with confidence and
              clarity.
            </p>

            <div className="bg-accent/30 p-16 rounded-lg border-l-4 border-primary">
              <h4 className="heading-subsection mb-8">Hierarchy Through Contrast</h4>
              <p className="body-large text-muted-foreground">
                Typography hierarchies emerge through strategic contrast in size, weight, and
                spacing. Every typographic choice should serve the user's journey through your
                content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Overview of the Rafters typography philosophy and systematic approach.',
      },
    },
  },
};

/**
 * Semantic Typography System
 *
 * Our golden ratio-based typography system with semantic heading classes
 * replaces verbose utility markup with meaningful, consistent tokens.
 * Font families are configurable via the onboarding wizard.
 */
export const SemanticTypography: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-section">Semantic Typography System</h2>
        <p className="body-large text-muted-foreground max-w-3xl">
          Our golden ratio-based typography system (φ = 1.618) provides semantic heading classes,
          configurable font families, and responsive scaling. Replace verbose utility markup with
          meaningful typography tokens.
        </p>
      </div>

      <div className="space-y-20">
        {/* Golden Ratio Display Scale */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Golden Ratio Display Scale</h3>
          <div className="space-y-8">
            <div className="py-6 border-b border-border">
              <div className="heading-hero mb-4">Hero Heading</div>
              <div className="text-sm text-muted-foreground">
                φ⁴ × base-size (4.236rem) • font-display • responsive scaling
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Use class: <code>.heading-hero</code>
              </div>
            </div>

            <div className="py-6 border-b border-border">
              <div className="heading-display mb-4">Display Heading</div>
              <div className="text-sm text-muted-foreground">
                φ³ × base-size (2.618rem) • font-display • responsive scaling
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Use class: <code>.heading-display</code>
              </div>
            </div>

            <div className="py-6 border-b border-border">
              <div className="heading-page mb-4">Page Heading</div>
              <div className="text-sm text-muted-foreground">
                φ² × base-size (1.618rem) • font-display • responsive scaling
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Use class: <code>.heading-page</code>
              </div>
            </div>
          </div>
        </div>

        {/* Semantic Heading Hierarchy */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Semantic Heading Hierarchy</h3>
          <div className="space-y-6">
            <div className="py-4 border-b border-border">
              <h1 className="heading-section mb-2">Section Heading (H1)</h1>
              <div className="text-sm text-muted-foreground">
                φ × base-size (1.618rem) • font-sans • Class: <code>.heading-section</code>
              </div>
            </div>

            <div className="py-4 border-b border-border">
              <h2 className="heading-subsection mb-2">Subsection Heading (H2)</h2>
              <div className="text-sm text-muted-foreground">
                base-size (1rem) × φ^(2/3) • font-sans • Class: <code>.heading-subsection</code>
              </div>
            </div>

            <div className="py-4 border-b border-border">
              <h3 className="heading-component mb-2">Component Heading (H3)</h3>
              <div className="text-sm text-muted-foreground">
                base-size (1rem) × φ^(1/3) • font-sans • Class: <code>.heading-component</code>
              </div>
            </div>

            <div className="py-4 border-b border-border">
              <h4 className="heading-small mb-2">Small Heading (H4-H6)</h4>
              <div className="text-sm text-muted-foreground">
                base-size (1rem) • font-sans • Class: <code>.heading-small</code>
              </div>
            </div>
          </div>
        </div>

        {/* Font Family Tokens */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Configurable Font Families</h3>
          <div className="bg-muted p-8 rounded-lg">
            <h4 className="heading-component mb-4">Font Family Tokens</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-display text-lg mb-2">Display Font</div>
                <div className="text-sm text-muted-foreground">
                  CSS: <code>font-family: var(--font-display)</code>
                </div>
                <div className="text-sm text-muted-foreground">
                  Class: <code>.font-display</code>
                </div>
              </div>
              <div>
                <div className="font-sans text-lg mb-2">Sans Serif Font</div>
                <div className="text-sm text-muted-foreground">
                  CSS: <code>font-family: var(--font-sans)</code>
                </div>
                <div className="text-sm text-muted-foreground">
                  Class: <code>.font-sans</code>
                </div>
              </div>
              <div>
                <div className="font-serif text-lg mb-2">Serif Font</div>
                <div className="text-sm text-muted-foreground">
                  CSS: <code>font-family: var(--font-serif)</code>
                </div>
                <div className="text-sm text-muted-foreground">
                  Class: <code>.font-serif</code>
                </div>
              </div>
              <div>
                <div className="font-mono text-lg mb-2">Monospace Font</div>
                <div className="text-sm text-muted-foreground">
                  CSS: <code>font-family: var(--font-mono)</code>
                </div>
                <div className="text-sm text-muted-foreground">
                  Class: <code>.font-mono</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Usage Guidelines</h3>
          <div className="bg-accent/10 p-8 rounded-lg border-l-4 border-primary">
            <h4 className="heading-component mb-4">Replace Verbose Utilities</h4>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-destructive-foreground mb-1">
                  DON'T use verbose utilities:
                </div>
                <code className="text-sm bg-destructive/10 p-2 rounded block">
                  text-4xl font-light mb-8
                </code>
              </div>
              <div>
                <div className="text-sm text-success-foreground mb-1">DO use semantic classes:</div>
                <code className="text-sm bg-success/10 p-2 rounded block">heading-section</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Golden ratio-based semantic typography system with configurable fonts.',
      },
    },
  },
};

/**
 * Body Typography Scale
 *
 * Golden ratio-based body text with semantic classes for consistent
 * content hierarchy and improved maintainability.
 */
export const BodyTypography: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-section">Body Typography Scale</h2>
        <p className="body-large text-muted-foreground max-w-3xl">
          Golden ratio-based body text with semantic classes for consistent content hierarchy and
          improved maintainability.
        </p>
      </div>

      <div className="space-y-20">
        {/* Body Scale */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Semantic Body Classes</h3>
          <div className="space-y-8">
            <div className="py-6 border-b border-border">
              <div className="body-large mb-3">Body Large</div>
              <p className="body-large text-muted-foreground mb-3">
                Large body text for introductory paragraphs and important content. Uses golden ratio
                scaling (φ × 1rem = 1.618rem) with optimal line height.
              </p>
              <div className="text-sm text-muted-foreground">
                Class: <code>.body-large</code> • 1.618rem • leading-relaxed
              </div>
            </div>

            <div className="py-6 border-b border-border">
              <div className="body-medium mb-3">Body Medium</div>
              <p className="body-medium text-muted-foreground mb-3">
                Medium body text for enhanced readability while maintaining content density. Uses
                φ^(2/3) scaling for balanced proportion.
              </p>
              <div className="text-sm text-muted-foreground">
                Class: <code>.body-medium</code> • 1.26rem • leading-relaxed
              </div>
            </div>

            <div className="py-6 border-b border-border">
              <div className="body mb-3">Body Default</div>
              <p className="body text-muted-foreground mb-3">
                Default body text (1rem base) for general content. Optimized for readability across
                devices with balanced line height and spacing.
              </p>
              <div className="text-sm text-muted-foreground">
                Class: <code>.body</code> • 1rem • leading-normal
              </div>
            </div>

            <div className="py-6">
              <div className="body-small mb-3">Body Small</div>
              <p className="body-small text-muted-foreground mb-3">
                Small body text for secondary information, captions, and metadata. Uses φ^(-1/3)
                scaling to maintain proportional harmony.
              </p>
              <div className="text-sm text-muted-foreground">
                Class: <code>.body-small</code> • 0.86rem • leading-normal
              </div>
            </div>
          </div>
        </div>

        {/* Content Hierarchy Example */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Content Hierarchy in Practice</h3>
          <div className="bg-card p-8 rounded-lg border">
            <h1 className="heading-page mb-6">Article Title Using Semantic Classes</h1>
            <p className="body-large text-muted-foreground mb-8">
              This lead paragraph uses <code>.body-large</code> to establish importance and improve
              initial reading experience. Notice how semantic classes make the markup cleaner and
              more maintainable.
            </p>

            <h2 className="heading-section mb-4 mt-8">Section Header</h2>
            <p className="body text-muted-foreground mb-6">
              Following paragraphs use <code>.body</code> for optimal readability and content flow.
              This creates natural hierarchy and reading rhythm without verbose utility classes.
            </p>

            <h3 className="heading-subsection mb-3 mt-6">Subsection Topic</h3>
            <p className="body text-muted-foreground mb-4">
              Subsection content offers specific information using consistent semantic typography.
            </p>

            <h4 className="heading-component mb-2 mt-4">Component Detail</h4>
            <p className="body-small text-muted-foreground">
              Meta information and secondary details use <code>.body-small</code>
              to maintain hierarchy while preserving readability.
            </p>
          </div>
        </div>

        {/* Before/After Comparison */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Semantic vs. Utility Classes</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-destructive/10 p-6 rounded-lg border border-destructive">
              <h4 className="heading-component mb-4 text-destructive-foreground">
                DON'T: Verbose Utilities
              </h4>
              <div className="font-mono text-sm space-y-2">
                <div>&lt;h1 className="text-4xl font-light mb-8"&gt;</div>
                <div>&lt;p className="text-xl leading-relaxed mb-6"&gt;</div>
                <div>&lt;h2 className="text-2xl font-medium mb-4"&gt;</div>
                <div>&lt;p className="text-base leading-normal"&gt;</div>
              </div>
            </div>

            <div className="bg-success/10 p-6 rounded-lg border border-success">
              <h4 className="heading-component mb-4 text-success-foreground">
                DO: Semantic Classes
              </h4>
              <div className="font-mono text-sm space-y-2">
                <div>&lt;h1 className="heading-page"&gt;</div>
                <div>&lt;p className="body-large"&gt;</div>
                <div>&lt;h2 className="heading-section"&gt;</div>
                <div>&lt;p className="body"&gt;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Golden ratio-based body typography with semantic class system.',
      },
    },
  },
};

/**
 * Responsive Typography
 *
 * Golden ratio-based responsive scaling ensures optimal readability
 * across all devices using CSS custom properties and fluid scaling.
 */
export const ResponsiveTypography: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-section">Responsive Typography</h2>
        <p className="body-large text-muted-foreground max-w-3xl">
          Golden ratio-based responsive scaling ensures optimal readability across all devices using
          CSS custom properties and fluid scaling.
        </p>
      </div>

      <div className="space-y-20">
        {/* Responsive Scale Rules */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Responsive Scale Rules</h3>
          <div className="bg-accent/10 p-8 rounded-lg border-l-4 border-primary">
            <h4 className="heading-component mb-4">Golden Ratio Breakpoint Scaling</h4>
            <div className="space-y-4 font-mono text-sm">
              <div>
                <strong>Mobile (320px+):</strong> Base scale × 0.85 (φ^-0.25)
              </div>
              <div>
                <strong>Tablet (768px+):</strong> Base scale × 1.0 (baseline)
              </div>
              <div>
                <strong>Desktop (1024px+):</strong> Base scale × 1.1 (φ^0.15)
              </div>
              <div>
                <strong>Large (1440px+):</strong> Base scale × 1.2 (φ^0.25)
              </div>
            </div>
          </div>
        </div>

        {/* Fluid Scaling Example */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Fluid Scaling in Action</h3>
          <div className="bg-card p-8 rounded-lg border">
            <div className="heading-hero mb-6">Responsive Hero</div>
            <p className="body-large text-muted-foreground mb-8">
              This hero text scales fluidly across devices using CSS clamp() functions based on
              golden ratio proportions. Resize your browser to see the effect.
            </p>

            <div className="heading-display mb-4">Display Heading</div>
            <p className="body text-muted-foreground mb-6">
              Display headings maintain optimal proportions while scaling responsively to ensure
              readability on all screen sizes.
            </p>

            <div className="heading-page mb-3">Page Heading</div>
            <p className="body-small text-muted-foreground">
              Even small text maintains golden ratio relationships as it scales, preserving visual
              harmony across the entire typography system.
            </p>
          </div>
        </div>

        {/* CSS Custom Properties */}
        <div className="space-y-12">
          <h3 className="heading-subsection">CSS Custom Properties</h3>
          <div className="bg-muted p-8 rounded-lg">
            <h4 className="heading-component mb-4">Typography Variables</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
              <div className="space-y-2">
                <div>
                  <strong>--typography-scale:</strong> 1.618 (φ)
                </div>
                <div>
                  <strong>--base-font-size:</strong> 1rem
                </div>
                <div>
                  <strong>--heading-line-height:</strong> 1.2
                </div>
                <div>
                  <strong>--body-line-height:</strong> 1.6
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <strong>--font-display:</strong> var(--display-font)
                </div>
                <div>
                  <strong>--font-sans:</strong> var(--sans-font)
                </div>
                <div>
                  <strong>--font-serif:</strong> var(--serif-font)
                </div>
                <div>
                  <strong>--font-mono:</strong> var(--mono-font)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Example */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Implementation</h3>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="heading-component mb-3">CSS Clamp Usage</h4>
              <div className="font-mono text-sm bg-muted p-4 rounded">
                <div>.heading-hero &#123;</div>
                <div className="ml-4">font-size: clamp(2.5rem, 5vw, 4.236rem);</div>
                <div className="ml-4">font-family: var(--font-display);</div>
                <div>&#125;</div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h4 className="heading-component mb-3">Responsive Variables</h4>
              <div className="font-mono text-sm bg-muted p-4 rounded">
                <div>@media (min-width: 1024px) &#123;</div>
                <div className="ml-4">:root &#123;</div>
                <div className="ml-8">--typography-scale: 1.78; {/* φ^1.1 */}</div>
                <div className="ml-4">&#125;</div>
                <div>&#125;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive typography scaling using golden ratio principles.',
      },
    },
  },
};

/**
 * Typography Implementation Guide
 *
 * Best practices for implementing the semantic typography system
 * with accessibility standards and performance considerations.
 */
export const ImplementationGuide: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-section">Implementation Guide</h2>
        <p className="body-large text-muted-foreground max-w-3xl">
          Best practices for implementing the semantic typography system with accessibility
          standards and performance considerations.
        </p>
      </div>

      <div className="space-y-20">
        {/* Accessibility Standards */}
        <section className="space-y-12">
          <h3 className="heading-subsection">Accessibility Standards</h3>
          <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-primary">
            <h4 className="heading-component mb-4">WCAG AA Compliance</h4>
            <ul className="space-y-2 mb-0">
              <li className="body">
                <strong>Normal text (16px+):</strong> 4.5:1 minimum contrast ratio
              </li>
              <li className="body">
                <strong>Large text (24px+):</strong> 3:1 minimum contrast ratio
              </li>
              <li className="body">
                <strong>Bold text (18px+):</strong> 3:1 minimum contrast ratio
              </li>
              <li className="body">
                <strong>UI text:</strong> 4.5:1 minimum for critical interface elements
              </li>
            </ul>
          </div>
        </section>

        {/* Semantic HTML Usage */}
        <section className="space-y-12">
          <h3 className="heading-subsection">Semantic HTML + Typography Classes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="heading-component">Correct Usage</h4>
              <div className="bg-success/10 p-4 rounded-lg border border-success">
                <div className="font-mono text-sm space-y-1">
                  <div>&lt;h1 className="heading-page"&gt;</div>
                  <div>&lt;h2 className="heading-section"&gt;</div>
                  <div>&lt;p className="body-large"&gt;</div>
                  <div>&lt;p className="body"&gt;</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="heading-component">Benefits</h4>
              <div className="bg-muted p-4 rounded-lg">
                <ul className="space-y-2 body-small">
                  <li>• Screen reader compatibility</li>
                  <li>• SEO optimization</li>
                  <li>• Maintainable styling</li>
                  <li>• Design system consistency</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Reading Experience */}
        <section className="space-y-12">
          <h3 className="heading-subsection">Optimal Reading Experience</h3>
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h4 className="heading-component mb-3">Line Length Example</h4>
              <p className="body max-w-2xl">
                This paragraph demonstrates optimal line length for reading comfort. Line lengths
                between 45-75 characters provide the best reading experience by reducing eye strain
                and maintaining reading rhythm. Our semantic classes automatically handle optimal
                line heights and spacing.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h4 className="heading-component mb-3">Typography Hierarchy</h4>
              <p className="body-large mb-4">
                Lead paragraphs use <code>.body-large</code> for emphasis and improved readability.
              </p>
              <p className="body mt-4">
                Standard content uses <code>.body</code> class for optimal flow and hierarchy.
              </p>
              <p className="body-small mt-4 text-muted-foreground">
                Secondary information uses <code>.body-small</code> to maintain visual hierarchy.
              </p>
            </div>
          </div>
        </section>

        {/* Performance Considerations */}
        <section className="space-y-12">
          <h3 className="heading-subsection">Performance Best Practices</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="heading-component">Font Loading</h4>
              <div className="bg-muted p-4 rounded-lg">
                <ul className="space-y-2 body-small">
                  <li>
                    • Use <code>font-display: swap</code>
                  </li>
                  <li>• Preload critical fonts</li>
                  <li>• Subset fonts when possible</li>
                  <li>• Configure via onboarding wizard</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="heading-component">CSS Optimization</h4>
              <div className="bg-muted p-4 rounded-lg">
                <ul className="space-y-2 body-small">
                  <li>• Semantic classes reduce bundle size</li>
                  <li>• CSS custom properties enable themes</li>
                  <li>• Responsive scaling with clamp()</li>
                  <li>• Minimal utility class dependency</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration */}
        <section className="space-y-12">
          <h3 className="heading-subsection">Typography Configuration</h3>
          <div className="bg-accent/10 p-8 rounded-lg border-l-4 border-primary">
            <h4 className="heading-component mb-4">Onboarding Wizard Setup</h4>
            <p className="body mb-4">
              Configure your typography system through the <strong>/manage</strong> route:
            </p>
            <ul className="space-y-2 body">
              <li>• Choose display fonts for headings and hero content</li>
              <li>• Select sans-serif fonts for UI and body text</li>
              <li>• Configure serif fonts for editorial content</li>
              <li>• Set monospace fonts for code and technical content</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Implementation guide for the semantic typography system.',
      },
    },
  },
};
