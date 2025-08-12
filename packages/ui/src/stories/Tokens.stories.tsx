import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Design tokens are the core building blocks of consistent, scalable design systems.
 * They encapsulate design decisions into reusable values that maintain coherence
 * across platforms, themes, and application states.
 */
const meta = {
  title: 'Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive design token system that enables consistent theming and customization across all interface elements.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Design Token System Overview
 *
 * Design tokens bridge the gap between design and development, creating a shared
 * vocabulary for design decisions. Our token system enables theming, consistency,
 * and maintainability across all digital experiences.
 */
export const TokenSystem: Story = {
  render: () => (
    <div className="min-h-screen">
      <div className="container mx-auto px-16 py-32 max-w-7xl">
        <div className="prose prose-xl max-w-none">
          <div className="mb-32">
            <h1 className="heading-display mb-16">Design Tokens</h1>
            <p className="text-body-large text-muted-foreground max-w-4xl">
              Design tokens are the foundational elements of our design system. They store visual
              design attributes as data, enabling consistent and scalable implementation across all
              platforms and contexts.
            </p>
            <p className="text-body text-muted-foreground mt-8">
              Customize your token values through the <strong>/manage</strong> route to create
              unique themes that reflect your brand identity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 my-40">
            <div className="space-y-12">
              <h3 className="heading-section mb-16">Why Design Tokens</h3>
              <div className="space-y-12">
                <div>
                  <h4 className="heading-component mb-6">Single Source of Truth</h4>
                  <p className="text-body text-muted-foreground">
                    One place to define and maintain design decisions across all platforms and
                    implementations
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Scalable Consistency</h4>
                  <p className="text-body text-muted-foreground">
                    Systematic approach to maintaining visual coherence as products grow
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Theme Flexibility</h4>
                  <p className="text-body text-muted-foreground">
                    Seamless switching between light, dark, and custom brand themes
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Developer Efficiency</h4>
                  <p className="text-body text-muted-foreground">
                    Semantic naming that makes design intent clear in code implementation
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <h3 className="heading-section mb-16">Token Architecture</h3>
              <div className="space-y-12">
                <div>
                  <h4 className="heading-component mb-6">Core Tokens</h4>
                  <p className="text-body text-muted-foreground">
                    Foundational values using OKLCH color space for precision
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Semantic Tokens</h4>
                  <p className="text-body text-muted-foreground">
                    Context-aware tokens that convey meaning and purpose
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Component Tokens</h4>
                  <p className="text-body text-muted-foreground">
                    Specialized tokens for specific interface components
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">State Modifiers</h4>
                  <p className="text-body text-muted-foreground">
                    Interactive state values for hover, focus, and active states
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="my-40">
            <h2 className="heading-page mb-16">Implementation Philosophy</h2>
            <p className="text-body-large text-muted-foreground max-w-4xl mb-20">
              Our token system follows semantic naming conventions that describe purpose rather than
              appearance. This approach enables flexible theming while maintaining clear
              relationships between design intent and implementation.
            </p>

            <div className="bg-accent/30 p-16 rounded-lg border-l-4 border-primary">
              <h4 className="heading-subsection mb-8">Grayscale-First Foundation</h4>
              <p className="text-body-large text-muted-foreground">
                Our default token values begin with a sophisticated grayscale palette, providing an
                elegant foundation that works beautifully on its own while serving as the perfect
                canvas for your brand colors through the customization wizard.
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
        story: 'Overview of the Rafters design token philosophy and system architecture.',
      },
    },
  },
};

/**
 * Core Color Tokens
 *
 * Core tokens define the fundamental color values using OKLCH color space.
 * These tokens serve as the foundation for all semantic and component tokens.
 */
export const CoreTokens: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-page mb-8">Core Color Tokens</h2>
        <p className="text-body-large text-muted-foreground max-w-3xl">
          Core tokens define fundamental color values using OKLCH color space for perceptual
          uniformity and precision. These form the foundation of all semantic and component-specific
          tokens.
        </p>
      </div>

      <div className="space-y-16">
        {/* Primary Colors */}
        <section className="space-y-8">
          <h3 className="heading-subsection">Foundation Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-background border rounded-lg">
                <div className="w-16 h-16 bg-background border rounded-lg" />
                <div>
                  <div className="font-mono text-sm">--color-background</div>
                  <div className="text-muted-foreground text-sm">oklch(1 0 0)</div>
                  <div className="text-xs text-muted-foreground">Pure white foundation</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card border rounded-lg">
                <div className="w-16 h-16 bg-foreground rounded-lg" />
                <div>
                  <div className="font-mono text-sm">--color-foreground</div>
                  <div className="text-muted-foreground text-sm">oklch(0.145 0 0)</div>
                  <div className="text-xs text-muted-foreground">Near black text</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-primary text-primary-foreground rounded-lg">
                <div className="w-16 h-16 bg-primary border border-primary-foreground/20 rounded-lg" />
                <div>
                  <div className="font-mono text-sm">--color-primary</div>
                  <div className="opacity-80 text-sm">oklch(0.205 0 0)</div>
                  <div className="text-xs opacity-70">Customizable brand color</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-secondary text-secondary-foreground rounded-lg">
                <div className="w-16 h-16 bg-secondary border rounded-lg" />
                <div>
                  <div className="font-mono text-sm">--color-secondary</div>
                  <div className="opacity-80 text-sm">oklch(0.97 0 0)</div>
                  <div className="text-xs opacity-70">Supporting interface color</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OKLCH Explanation */}
        <section className="bg-muted/30 p-8 rounded-lg">
          <h3 className="heading-component mb-6">OKLCH Color Space</h3>
          <div className="prose max-w-none">
            <p>
              Our tokens use OKLCH (Oklch) color space, providing perceptually uniform color
              manipulation and better interpolation than traditional RGB or HSL. This ensures
              consistent perceived lightness and more predictable color relationships.
            </p>
            <div className="mt-6 p-4 bg-background rounded border-l-4 border-primary">
              <div className="font-mono text-sm">oklch(lightness chroma hue)</div>
              <ul className="mt-2 text-sm text-muted-foreground">
                <li>
                  <strong>Lightness:</strong> Perceptual lightness (0-1)
                </li>
                <li>
                  <strong>Chroma:</strong> Color intensity (0+)
                </li>
                <li>
                  <strong>Hue:</strong> Color angle (0-360)
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Core color tokens that form the foundation of the design system.',
      },
    },
  },
};

/**
 * Semantic Tokens
 *
 * Semantic tokens convey meaning and purpose rather than appearance.
 * They provide consistent communication patterns across all interface states.
 */
export const SemanticTokens: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-page mb-8">Semantic Tokens</h2>
        <p className="text-body-large text-muted-foreground max-w-3xl">
          Semantic tokens communicate meaning and purpose rather than specific colors. They enable
          consistent messaging patterns while supporting flexible theming and accessibility
          requirements.
        </p>
      </div>

      <div className="space-y-16">
        {/* State Tokens */}
        <section className="space-y-8">
          <h3 className="heading-subsection">State Communication</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-destructive text-destructive-foreground rounded-lg">
                <div className="w-12 h-12 bg-destructive border border-destructive-foreground/20 rounded" />
                <div>
                  <div className="font-medium">Destructive</div>
                  <div className="text-sm opacity-80">Errors, warnings, critical actions</div>
                  <div className="font-mono text-xs">--color-destructive</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-success text-success-foreground rounded-lg">
                <div className="w-12 h-12 bg-success border border-success-foreground/20 rounded" />
                <div>
                  <div className="font-medium">Success</div>
                  <div className="text-sm opacity-80">Confirmations, completed states</div>
                  <div className="font-mono text-xs">--color-success</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-warning text-warning-foreground rounded-lg">
                <div className="w-12 h-12 bg-warning border border-warning-foreground/20 rounded" />
                <div>
                  <div className="font-medium">Warning</div>
                  <div className="text-sm opacity-80">Cautions, attention needed</div>
                  <div className="font-mono text-xs">--color-warning</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-info text-info-foreground rounded-lg">
                <div className="w-12 h-12 bg-info border border-info-foreground/20 rounded" />
                <div>
                  <div className="font-medium">Info</div>
                  <div className="text-sm opacity-80">Information, helpful context</div>
                  <div className="font-mono text-xs">--color-info</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Tokens */}
        <section className="space-y-8">
          <h3 className="heading-subsection">Interactive Elements</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted text-muted-foreground rounded-lg">
              <div className="w-12 h-12 bg-muted border rounded" />
              <div>
                <div className="font-medium">Muted</div>
                <div className="text-sm opacity-80">Subtle backgrounds, secondary content</div>
                <div className="font-mono text-xs">--color-muted</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-accent text-accent-foreground rounded-lg">
              <div className="w-12 h-12 bg-accent border rounded" />
              <div>
                <div className="font-medium">Accent</div>
                <div className="text-sm opacity-80">Highlighted elements, emphasis</div>
                <div className="font-mono text-xs">--color-accent</div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="bg-accent/20 p-8 rounded-lg">
          <h3 className="heading-component mb-6">Semantic Usage Guidelines</h3>
          <div className="space-y-4 text-muted-foreground">
            <p>
              • <strong>Consistent meaning:</strong> Each semantic token should convey the same
              meaning across all contexts
            </p>
            <p>
              • <strong>Accessible contrast:</strong> All semantic tokens meet WCAG AAA standards
              with their foreground pairs
            </p>
            <p>
              • <strong>Cultural sensitivity:</strong> Consider cultural color associations when
              customizing semantic values
            </p>
            <p>
              • <strong>State clarity:</strong> Use semantic tokens to reinforce interface state and
              user feedback
            </p>
          </div>
        </section>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic tokens that communicate meaning and purpose across interface states.',
      },
    },
  },
};

/**
 * Component Tokens
 *
 * Component-specific tokens provide specialized styling for individual interface
 * elements while maintaining systematic relationships to core and semantic tokens.
 */
export const ComponentTokens: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-page mb-8">Component Tokens</h2>
        <p className="text-body-large text-muted-foreground max-w-3xl">
          Component tokens provide specialized styling for specific interface elements. They
          maintain systematic relationships to core tokens while enabling fine-tuned control over
          individual component appearance.
        </p>
      </div>

      <div className="space-y-16">
        {/* Surface Tokens */}
        <section className="space-y-8">
          <h3 className="heading-subsection">Surface Elements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-card text-card-foreground border rounded-lg">
                <div className="w-12 h-12 bg-card border-2 border-border rounded" />
                <div>
                  <div className="font-medium">Card</div>
                  <div className="text-sm text-muted-foreground">Elevated content containers</div>
                  <div className="font-mono text-xs">--color-card</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-popover text-popover-foreground border rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-popover border-2 border-border rounded" />
                <div>
                  <div className="font-medium">Popover</div>
                  <div className="text-sm text-muted-foreground">Floating overlay content</div>
                  <div className="font-mono text-xs">--color-popover</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full border-2 border-ring" />
                  <span className="font-medium">Focus Ring</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Accessibility focus indicator
                </div>
                <div className="font-mono text-xs">--color-ring</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-0.5 bg-border" />
                  <span className="font-medium">Border</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Element boundaries and dividers
                </div>
                <div className="font-mono text-xs">--color-border</div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialized Components */}
        <section className="space-y-8">
          <h3 className="heading-subsection">Specialized Components</h3>
          <div className="space-y-6">
            {/* Sidebar Example */}
            <div className="flex gap-6 p-6 bg-muted/30 rounded-lg">
              <div className="w-48 bg-sidebar text-sidebar-foreground p-4 rounded border border-sidebar-border">
                <h4 className="font-medium mb-2">Sidebar</h4>
                <div className="space-y-1 text-sm">
                  <div>Navigation item</div>
                  <div>Navigation item</div>
                  <div>Navigation item</div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="font-mono text-sm">--color-sidebar</div>
                <div className="font-mono text-sm">--color-sidebar-foreground</div>
                <div className="font-mono text-sm">--color-sidebar-border</div>
                <div className="text-sm text-muted-foreground">
                  Navigation containers and side panels
                </div>
              </div>
            </div>

            {/* Table Example */}
            <div className="space-y-2">
              <div className="bg-table-header p-3 rounded-t border font-medium">Table Header</div>
              <div className="bg-table-row-even p-3 border-x border-b">
                Even row with subtle background
              </div>
              <div className="bg-background hover:bg-table-row-hover p-3 border-x border-b transition-colors">
                Hover state demonstration
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <div className="font-mono text-xs">
                  --color-table-header, --color-table-row-even, --color-table-row-hover
                </div>
                Data table styling tokens
              </div>
            </div>
          </div>
        </section>

        {/* State Modifiers */}
        <section className="bg-muted/30 p-8 rounded-lg">
          <h3 className="text-xl font-medium mb-6">Interactive State Modifiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Hover Opacity</span>
                <span className="font-mono text-sm">0.9</span>
              </div>
              <div className="flex justify-between">
                <span>Active Opacity</span>
                <span className="font-mono text-sm">0.8</span>
              </div>
              <div className="flex justify-between">
                <span>Disabled Opacity</span>
                <span className="font-mono text-sm">0.5</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Loading Opacity</span>
                <span className="font-mono text-sm">0.7</span>
              </div>
              <div className="flex justify-between">
                <span>Active Scale</span>
                <span className="font-mono text-sm">0.95</span>
              </div>
              <div className="flex justify-between">
                <span>Border Radius</span>
                <span className="font-mono text-sm">0.5rem</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Component-specific tokens for specialized interface elements and their states.',
      },
    },
  },
};

/**
 * Implementation Guide
 *
 * Practical guidelines for implementing design tokens in development workflows,
 * including naming conventions, theme management, and customization approaches.
 */
export const ImplementationGuide: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-page mb-8">Implementation Guide</h2>
        <p className="text-body-large text-muted-foreground max-w-3xl">
          Guidelines for implementing design tokens effectively in development workflows. Learn
          about naming conventions, theme management, and customization strategies.
        </p>
      </div>

      <div className="space-y-20">
        {/* Naming Conventions */}
        <section className="space-y-8">
          <h3 className="heading-subsection">Naming Conventions</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="heading-component">Structure Pattern</h4>
              <div className="bg-muted/50 p-4 rounded font-mono text-sm">
                --{'{'}category{'}'}-{'{'}property{'}'}-{'{'}modifier{'}'}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  • <strong>Category:</strong> color, font, space, radius
                </p>
                <p>
                  • <strong>Property:</strong> background, foreground, border
                </p>
                <p>
                  • <strong>Modifier:</strong> hover, active, disabled
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="heading-component">Examples</h4>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span>--color-primary</span>
                  <span className="text-muted-foreground">Base color</span>
                </div>
                <div className="flex justify-between">
                  <span>--color-primary-foreground</span>
                  <span className="text-muted-foreground">Text on primary</span>
                </div>
                <div className="flex justify-between">
                  <span>--opacity-hover</span>
                  <span className="text-muted-foreground">Interaction state</span>
                </div>
                <div className="flex justify-between">
                  <span>--radius</span>
                  <span className="text-muted-foreground">Border radius</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Theme Management */}
        <section className="space-y-8">
          <h3 className="heading-subsection">Theme Management</h3>
          <div className="prose max-w-none">
            <p>
              Our token system supports automatic dark mode switching and custom theming through CSS
              custom properties. Themes are defined using the same token structure with different
              values for each mode.
            </p>

            <div className="bg-muted/50 p-6 rounded-lg not-prose">
              <h4 className="font-medium mb-4">Theme Implementation</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-mono mb-2">{'/* Light theme (default) */'}</div>
                  <div className="font-mono text-muted-foreground">
                    {':root { --color-background: oklch(1 0 0); }'}
                  </div>
                </div>
                <div>
                  <div className="font-mono mb-2">{'/* Dark theme */'}</div>
                  <div className="font-mono text-muted-foreground">
                    {'.dark { --color-background: oklch(0.145 0 0); }'}
                  </div>
                </div>
                <div>
                  <div className="font-mono mb-2">{'/* Custom theme */'}</div>
                  <div className="font-mono text-muted-foreground">
                    {'.brand { --color-primary: oklch(0.5 0.15 240); }'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customization Process */}
        <section className="space-y-8">
          <h3 className="heading-subsection">Customization Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium mb-3">1. Brand Definition</h4>
              <p className="text-sm text-muted-foreground">
                Define your primary brand colors and identity elements through the /manage
                customization interface.
              </p>
            </div>

            <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium mb-3">2. Token Generation</h4>
              <p className="text-sm text-muted-foreground">
                System automatically generates semantic and component tokens based on your brand
                values and accessibility requirements.
              </p>
            </div>

            <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium mb-3">3. Implementation</h4>
              <p className="text-sm text-muted-foreground">
                Export and integrate your custom token values across all platforms and applications
                using standard CSS properties.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="bg-accent/20 p-8 rounded-lg">
          <h3 className="heading-component mb-6">Implementation Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground">
            <div className="space-y-3">
              <p>
                • <strong>Use semantic names:</strong> Choose tokens based on purpose, not
                appearance
              </p>
              <p>
                • <strong>Maintain consistency:</strong> Apply tokens systematically across all
                components
              </p>
              <p>
                • <strong>Test accessibility:</strong> Verify contrast ratios with custom token
                values
              </p>
            </div>
            <div className="space-y-3">
              <p>
                • <strong>Document changes:</strong> Keep track of customizations and their
                reasoning
              </p>
              <p>
                • <strong>Version control:</strong> Manage token changes through proper versioning
              </p>
              <p>
                • <strong>Cross-platform sync:</strong> Ensure consistency across all implementation
                platforms
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete implementation guide for using design tokens effectively in development workflows.',
      },
    },
  },
};
