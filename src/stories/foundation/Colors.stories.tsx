import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Colors communicate meaning before words are read. Our color system prioritizes
 * accessibility and semantic clarity over decorative appeal. Every color choice
 * serves purpose, conveys hierarchy, and respects user intent.
 */
const meta = {
  title: '01 Identity/Colors',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The foundational color system built on semantic tokens, OKLCH color space, and accessibility-first principles.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Color System Architecture
 *
 * Rafters uses a four-tier token system inspired by modern design systems.
 * Unlike traditional hex-based palettes, we use OKLCH color space for perceptual
 * uniformity and better dark mode transitions.
 */
export const Overview: Story = {
  render: () => (
    <div className="min-h-screen">
      <div className="container mx-auto px-16 py-32 max-w-7xl">
        <div className="prose prose-xl max-w-none">
          <div className="mb-32">
            <h1 className="heading-display mb-16">Colors</h1>
            <p className="text-body-large text-muted-foreground max-w-4xl">
              Your identity's color system. Our system prioritizes accessibility, semantic meaning,
              and visual hierarchy over decorative variety.
            </p>
            <p className="text-body text-muted-foreground mt-8">
              To modify your brand colors, visit the <strong>/manage</strong> route in your
              application.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 my-40">
            <div className="space-y-12">
              <h3 className="heading-section mb-16">Design Principles</h3>
              <div className="space-y-12">
                <div>
                  <h4 className="heading-component mb-6">Semantic First</h4>
                  <p className="text-body text-muted-foreground">
                    Colors communicate meaning, not decoration
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Accessibility Core</h4>
                  <p className="text-body text-muted-foreground">
                    WCAG AA compliance is non-negotiable
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Context Aware</h4>
                  <p className="text-body text-muted-foreground">
                    Light and dark themes with intentional contrast
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Future Ready</h4>
                  <p className="text-body text-muted-foreground">
                    OKLCH color space for perceptual consistency
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
                    Background, foreground, and surface foundations
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Interactive Tokens</h4>
                  <p className="text-body text-muted-foreground">
                    Hover, focus, and state management
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Semantic Tokens</h4>
                  <p className="text-body text-muted-foreground">
                    Success, warning, error, and info states
                  </p>
                </div>
                <div>
                  <h4 className="heading-component mb-6">Component Tokens</h4>
                  <p className="text-body text-muted-foreground">
                    Specialized colors for specific contexts
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="my-40">
            <h2 className="heading-page mb-16">Implementation Philosophy</h2>
            <p className="text-body-large text-muted-foreground max-w-4xl mb-20">
              Rafters uses role-based tokens rather than named colors. This allows themes to
              redefine visual expression while maintaining consistent semantic meaning across all
              interface contexts.
            </p>

            <div className="bg-accent/30 p-16 rounded-lg border-l-4 border-primary">
              <h4 className="heading-subsection mb-8">Color as Communication</h4>
              <p className="text-body-large text-muted-foreground">
                Every color choice should pass the "why" test: Why this color? Why this contrast?
                Why this semantic association? Intentional color builds trust through predictable
                visual language.
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
        story: 'Overview of the Rafters color philosophy and implementation approach.',
      },
    },
  },
};

/**
 * Core Foundation Tokens
 *
 * Background and foreground tokens establish the fundamental contrast relationships
 * that all other colors build upon. These never change semantic meaning across themes.
 */
export const CoreTokens: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-page mb-8">Core Foundation Tokens</h2>
        <p className="text-body-large text-muted-foreground max-w-3xl">
          The essential contrast relationships that establish readability and hierarchy.
        </p>
      </div>

      <div className="space-y-20">
        {/* Background & Foreground */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Background & Foreground</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 border rounded-lg bg-background">
              <div className="flex items-center justify-between mb-4">
                <span className="heading-component text-foreground">background</span>
                <span className="text-muted-foreground font-mono">oklch(1 0 0)</span>
              </div>
              <div className="text-muted-foreground">Primary canvas for all content</div>
            </div>
            <div className="p-8 border rounded-lg bg-foreground">
              <div className="flex items-center justify-between mb-4">
                <span className="heading-component text-background">foreground</span>
                <span className="text-background/70 font-mono">oklch(0.145 0 0)</span>
              </div>
              <div className="text-background/70">Primary text and icon color</div>
            </div>
          </div>
        </div>

        {/* Surface Tokens */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Surface Tokens</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 border rounded-lg bg-card">
              <div className="flex items-center justify-between mb-4">
                <span className="heading-component text-card-foreground">card</span>
                <span className="text-muted-foreground font-mono">oklch(1 0 0)</span>
              </div>
              <div className="text-muted-foreground">Grouped content containers</div>
            </div>
            <div className="p-8 border rounded-lg bg-popover">
              <div className="flex items-center justify-between mb-4">
                <span className="heading-component text-popover-foreground">popover</span>
                <span className="text-muted-foreground font-mono">oklch(1 0 0)</span>
              </div>
              <div className="text-muted-foreground">Floating interface elements</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Foundation tokens that establish contrast relationships and surface hierarchy.',
      },
    },
  },
};

/**
 * Interactive Tokens
 *
 * Colors that respond to user actions. These tokens include state variations
 * for hover, focus, and active interactions while maintaining accessibility.
 */
export const InteractiveTokens: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-page mb-8">Interactive Elements</h2>
        <p className="text-body-large text-muted-foreground max-w-3xl">
          Purpose-driven colors that guide user actions and establish visual hierarchy through
          interaction.
        </p>
      </div>

      <div className="space-y-20">
        {/* Primary */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Primary Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-primary">
              <div className="flex items-center justify-between">
                <span className="font-medium text-primary-foreground">primary</span>
                <span className="text-sm text-primary-foreground/70">oklch(0.205 0 0)</span>
              </div>
              <div className="text-sm text-primary-foreground/70 mt-1">
                Most important actions and brand elements
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-primary-foreground">
              <div className="flex items-center justify-between">
                <span className="font-medium text-primary">primary-foreground</span>
                <span className="text-sm text-muted-foreground">oklch(0.985 0 0)</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Text on primary backgrounds</div>
            </div>
          </div>
        </div>

        {/* Secondary */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Secondary Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-secondary">
              <div className="flex items-center justify-between">
                <span className="font-medium text-secondary-foreground">secondary</span>
                <span className="text-sm text-muted-foreground">oklch(0.97 0 0)</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Supporting actions and alternatives
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">muted</span>
                <span className="text-sm text-muted-foreground">oklch(0.97 0 0)</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Subtle backgrounds and disabled states
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Interactive States</h3>
          <div className="flex gap-6 flex-wrap">
            <button
              type="button"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              Primary Button
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              Secondary Button
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors"
            >
              Accent Button
            </button>
          </div>
          <p className="text-muted-foreground">
            Hover over buttons to see state transitions in action
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive tokens that handle user actions and establish visual hierarchy.',
      },
    },
  },
};

/**
 * Semantic State Tokens
 *
 * Colors that communicate meaning and context. These tokens carry semantic weight
 * and help users understand system state and required actions.
 */
export const SemanticTokens: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-page mb-8">Semantic State Tokens</h2>
        <p className="text-body-large text-muted-foreground max-w-3xl">
          Colors that communicate system state and guide user understanding through consistent
          semantic associations. These default grayscale tokens will be customized to your brand
          identity during onboarding.
        </p>
      </div>

      <div className="space-y-20">
        {/* Semantic Colors Grid */}
        <div className="space-y-12">
          <h3 className="heading-subsection">State Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg bg-destructive">
              <div className="text-destructive-foreground">
                <div className="font-medium">destructive</div>
                <div className="text-sm opacity-70">oklch(0.371 0 0)</div>
                <div className="text-xs mt-2">Errors, deletions, critical warnings</div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-success">
              <div className="text-success-foreground">
                <div className="font-medium">success</div>
                <div className="text-sm opacity-70">oklch(0.556 0 0)</div>
                <div className="text-xs mt-2">Confirmations, completed actions</div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-warning">
              <div className="text-warning-foreground">
                <div className="font-medium">warning</div>
                <div className="text-sm opacity-70">oklch(0.708 0 0)</div>
                <div className="text-xs mt-2">Cautions, important notices</div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-info">
              <div className="text-info-foreground">
                <div className="font-medium">info</div>
                <div className="text-sm opacity-70">oklch(0.456 0 0)</div>
                <div className="text-xs mt-2">Information, helpful context</div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="space-y-12">
          <h3 className="heading-subsection">Usage Examples</h3>
          <div className="space-y-3">
            <div className="p-3 border border-destructive/20 bg-destructive/10 rounded-md">
              <div className="text-destructive font-medium">Error: Failed to save changes</div>
              <div className="text-sm text-destructive/80">
                Please check your connection and try again.
              </div>
            </div>

            <div className="p-3 border border-success/20 bg-success/10 rounded-md">
              <div className="text-success font-medium">Success: Project saved successfully</div>
              <div className="text-sm text-success/80">
                All changes have been automatically backed up.
              </div>
            </div>

            <div className="p-3 border border-warning/20 bg-warning/10 rounded-md">
              <div className="text-warning font-medium">Warning: Storage almost full</div>
              <div className="text-sm text-warning/80">
                Consider upgrading your plan or removing unused files.
              </div>
            </div>

            <div className="p-3 border border-info/20 bg-info/10 rounded-md">
              <div className="text-info font-medium">Info: New features available</div>
              <div className="text-sm text-info/80">
                Check out the latest updates in your dashboard.
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
        story: 'Semantic tokens that communicate system state and user feedback through color.',
      },
    },
  },
};

/**
 * Usage Guidelines
 *
 * Principles and best practices for implementing the Rafters color system.
 * Understanding context and accessibility ensures consistent, inclusive experiences.
 */
export const UsageGuidelines: Story = {
  render: () => (
    <div className="px-16 py-24 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="heading-page mb-8">Color Usage Guidelines</h2>
        <p className="text-body-large text-muted-foreground max-w-3xl">
          Principles and best practices for implementing the Rafters color system with accessibility
          and consistency.
        </p>
      </div>

      <div className="space-y-20">
        {/* Do's and Don'ts */}
        <section className="space-y-12">
          <h3 className="heading-subsection">Do's and Don'ts</h3>

          <div className="space-y-8">
            <div>
              <h4 className="font-medium mb-4">Do's</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">DO</span>
                  <span>Use semantic tokens consistently across contexts</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">DO</span>
                  <span>Ensure WCAG AA contrast ratios for all text</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">DO</span>
                  <span>Test color combinations in both light and dark themes</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">DO</span>
                  <span>Use color to support meaning, not replace it</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">DO</span>
                  <span>Maintain visual hierarchy through color weight</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Don'ts</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-destructive font-bold">DON'T</span>
                  <span>Don't use hard-coded color values in components</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-destructive font-bold">DON'T</span>
                  <span>Don't rely solely on color to convey critical information</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-destructive font-bold">DON'T</span>
                  <span>Don't use semantic colors for decorative purposes</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-destructive font-bold">DON'T</span>
                  <span>Don't override semantic meaning between themes</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-destructive font-bold">DON'T</span>
                  <span>Don't introduce new colors without system consideration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section className="space-y-12">
          <h3 className="heading-subsection">Accessibility Standards</h3>
          <div className="prose max-w-none">
            <p>
              All color combinations in the Rafters system meet or exceed WCAG AA standards. Our
              OKLCH color space implementation ensures perceptual consistency across different
              display conditions and color vision variations.
            </p>

            <div className="bg-accent/30 p-6 rounded-lg border-l-4 border-primary my-6">
              <h4 className="mt-0">Contrast Requirements</h4>
              <ul className="mb-0">
                <li>
                  <strong>Normal text:</strong> 4.5:1 minimum contrast ratio
                </li>
                <li>
                  <strong>Large text:</strong> 3:1 minimum contrast ratio
                </li>
                <li>
                  <strong>Interactive elements:</strong> 3:1 for focus indicators
                </li>
                <li>
                  <strong>Non-text elements:</strong> 3:1 for meaningful graphics
                </li>
              </ul>
            </div>

            <p>
              Beyond compliance, our system considers color vision differences, environmental
              viewing conditions, and cognitive load. Every color decision supports inclusive design
              principles.
            </p>
          </div>
        </section>

        {/* Implementation */}
        <section className="space-y-12">
          <h3 className="heading-subsection">Implementation Patterns</h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Component Development</h4>
              <p className="text-sm text-muted-foreground">
                Always use CSS custom properties (tokens) rather than direct color values. This
                ensures theme compatibility and maintains semantic consistency.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">State Management</h4>
              <p className="text-sm text-muted-foreground">
                Use opacity and transform modifiers for interactive states rather than entirely
                different colors. This maintains color relationships while providing clear feedback.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Theme Development</h4>
              <p className="text-sm text-muted-foreground">
                When creating new themes, maintain semantic meaning while allowing visual
                expression. Test thoroughly across all component contexts and interaction states.
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
          'Comprehensive guidelines for implementing the Rafters color system effectively and accessibly.',
      },
    },
  },
};
