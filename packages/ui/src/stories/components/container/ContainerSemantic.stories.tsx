import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

/**
 * AI Training: Container Semantic Intelligence
 *
 * CONTEXTUAL USAGE PATTERNS: Training AI on appropriate HTML element selection
 * ACCESSIBILITY LANDMARKS: Semantic HTML for screen reader navigation
 * INTELLIGENT DEFAULTS: Element-specific sizing, spacing, and behavior
 *
 * SEMANTIC TRAINING SCENARIOS:
 * - main: Primary content landmark with full width
 * - article: Readable content width with automatic prose styling
 * - section: Thematic groupings with moderate spacing
 * - div: Generic containers with minimal defaults
 *
 * This trains AI agents on semantic HTML selection and accessibility patterns.
 */
const meta = {
  title: '03 Components/Layout/Container/Semantic',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Semantic HTML usage patterns showing intelligent defaults for main, article, section, and div containers.',
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Main content landmark demonstration.
 * Shows primary content area with full width and generous spacing.
 */
export const MainLandmark: Story = {
  render: () => (
    <Container as="main" className="bg-blue-50 border border-blue-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Main Content Area</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The main element represents the primary content of the document. It automatically uses
          full width and generous padding (8) for application layouts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Semantic Defaults</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Full width (w-full)</li>
            <li>• Generous padding (8)</li>
            <li>• Auto overflow handling</li>
            <li>• Container queries enabled</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Landmark for screen readers</li>
            <li>• Skip navigation target</li>
            <li>• ARIA implicit main role</li>
            <li>• Document structure clarity</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Use Cases</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Application main content</li>
            <li>• Dashboard primary area</li>
            <li>• Page body content</li>
            <li>• Layout wrapper</li>
          </ul>
        </div>
      </div>
    </Container>
  ),
};

/**
 * Article content with automatic prose styling.
 * Shows readable content width with typography intelligence.
 */
export const ArticleContent: Story = {
  render: () => (
    <div className="p-8 bg-gray-50">
      <Container as="article" className="bg-white shadow-sm">
        <h1>The Science of Readable Typography</h1>

        <p>
          Articles automatically receive prose styling using our design system tokens. This
          container uses 4xl width (56rem) for optimal reading line length, typically 65-75
          characters per line.
        </p>

        <h2>Automatic Typography Scaling</h2>

        <p>
          Headlines use our golden ratio typography scale (φ). The spacing uses phi-based vertical
          rhythm for natural reading flow. All of this happens automatically when you use
          &lt;Container as="article"&gt;.
        </p>

        <h3>Design System Integration</h3>

        <ul>
          <li>Typography tokens from --font-size-* design system</li>
          <li>Spacing tokens using --spacing-* for vertical rhythm</li>
          <li>Golden ratio proportions (φ = 1.618) throughout</li>
          <li>Container queries for responsive behavior</li>
        </ul>

        <blockquote>
          "Semantic HTML provides automatic styling intelligence, reducing the cognitive load for
          both developers and AI agents."
        </blockquote>

        <p>
          You can still override individual elements with utility classes, but the defaults provide
          excellent typography out of the box.
        </p>

        <h4>Code Examples</h4>

        <p>
          Inline <code>code snippets</code> get automatic styling too:
        </p>

        <pre>
          <code>
            {/* Articles get automatic prose styling */}
            &lt;Container as="article"&gt; &lt;h1&gt;No classes needed&lt;/h1&gt;
            &lt;p&gt;Typography is handled automatically&lt;/p&gt; &lt;/Container&gt;
          </code>
        </pre>
      </Container>
    </div>
  ),
};

/**
 * Section thematic groupings.
 * Shows moderate spacing for content organization.
 */
export const SectionGrouping: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-gray-50">
      <Container as="section" className="bg-white border border-gray-200">
        <header className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Product Features</h2>
          <p className="text-gray-600 mt-2">
            Section containers use 5xl width with moderate padding (4) for thematic content
            groupings.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Design Intelligence</h3>
            <p className="text-gray-600 text-sm">
              AI-powered design decisions with semantic constraints and machine-readable design
              knowledge embedded in components.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Accessibility First</h3>
            <p className="text-gray-600 text-sm">
              Semantic HTML structure with ARIA landmarks and keyboard navigation patterns built
              into every component.
            </p>
          </div>
        </div>
      </Container>

      <Container as="section" className="bg-white border border-gray-200">
        <header className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Technical Specifications</h2>
          <p className="text-gray-600 mt-2">
            Another section showing thematic grouping with consistent styling.
          </p>
        </header>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Container Queries</span>
            <span className="text-sm text-gray-600">Native Tailwind v4 support</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Design Tokens</span>
            <span className="text-sm text-gray-600">--spacing-* and typography integration</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Golden Ratio</span>
            <span className="text-sm text-gray-600">φ (1.618) aspect ratios and spacing</span>
          </div>
        </div>
      </Container>
    </div>
  ),
};

/**
 * Generic div containers.
 * Shows minimal defaults for maximum flexibility.
 */
export const GenericContainers: Story = {
  render: () => (
    <div className="p-8 space-y-6 bg-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Generic Div Containers</h2>
        <p className="text-gray-600">
          Div containers provide minimal defaults for maximum flexibility in custom layouts.
        </p>
      </div>

      <Container className="bg-white border border-gray-200">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Default Div Container</h3>
          <p className="text-sm text-gray-600 mb-4">
            4xl width, padding-4, border-box sizing, container queries enabled
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-gray-100 p-3 rounded">
              <div className="font-medium">Width</div>
              <div className="text-gray-600">4xl (56rem)</div>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <div className="font-medium">Padding</div>
              <div className="text-gray-600">4 (1rem)</div>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <div className="font-medium">Box Sizing</div>
              <div className="text-gray-600">border-box</div>
            </div>
          </div>
        </div>
      </Container>

      <Container size="full" padding="8" className="bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">Customized Div Container</h3>
        <p className="text-sm text-gray-600 mb-6">
          Full width with generous padding for custom layouts. All properties can be overridden.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Container
              key={`nested-container-demo-${i + 1}`}
              size="sm"
              padding="4"
              className="bg-white border border-gray-300"
            >
              <div className="text-center text-sm">
                <div className="font-medium">Card {i + 1}</div>
                <div className="text-gray-600">Nested container</div>
              </div>
            </Container>
          ))}
        </div>
      </Container>
    </div>
  ),
};

/**
 * Semantic comparison showing all element types together.
 * Demonstrates intelligent defaults and appropriate usage.
 */
export const SemanticComparison: Story = {
  render: () => (
    <div className="space-y-1">
      {/* Main wrapper */}
      <Container as="main" className="bg-blue-100">
        <div className="text-center text-sm font-medium">
          &lt;main&gt; - Full width, padding-8, landmark role
        </div>
      </Container>

      {/* Article content */}
      <div className="flex justify-center">
        <Container as="article" className="bg-green-100">
          <div className="text-center text-sm font-medium">
            &lt;article&gt; - 4xl width, padding-6, auto prose styling
          </div>
        </Container>
      </div>

      {/* Section grouping */}
      <div className="flex justify-center">
        <Container as="section" className="bg-yellow-100">
          <div className="text-center text-sm font-medium">
            &lt;section&gt; - 5xl width, padding-4, thematic grouping
          </div>
        </Container>
      </div>

      {/* Generic div */}
      <div className="flex justify-center">
        <Container className="bg-purple-100">
          <div className="text-center text-sm font-medium">
            &lt;div&gt; - 4xl width, padding-4, flexible defaults
          </div>
        </Container>
      </div>

      <div className="text-center mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-gray-900 mb-2">AI Intelligence Notes</h3>
        <p className="text-sm text-gray-600">
          Each semantic element has intelligent defaults optimized for its intended use case. This
          teaches AI agents to select appropriate HTML elements based on content context.
        </p>
      </div>
    </div>
  ),
};
