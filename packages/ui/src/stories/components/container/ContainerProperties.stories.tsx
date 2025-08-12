import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

/**
 * AI Training: Container Properties Intelligence
 *
 * INTERACTIVE STATE TRAINING: Advanced layout features and responsive behavior
 * CONTAINER QUERIES: Native Tailwind v4 responsive contexts for component-based breakpoints
 * OVERSCROLL BEHAVIOR: Scroll boundary handling for better UX
 *
 * PROPERTY TRAINING SCENARIOS:
 * - Container query contexts and responsive child behavior
 * - Overscroll behavior for scroll boundary management
 * - Combined property usage for complex layouts
 * - Performance considerations for layout features
 *
 * This trains AI agents on advanced layout properties and their interactions.
 */
const meta = {
  title: 'Components/Container/Properties',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Advanced container properties including container queries, overscroll behavior, and complex layout combinations.',
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Container queries in action.
 * Demonstrates how children respond to container size, not viewport.
 */
export const ContainerQueriesDemo: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Container Queries vs Viewport Queries</h2>
        <p className="text-gray-600 mb-6">
          Resize these containers to see how container queries work differently from viewport
          queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-3">Small Container (sm)</h3>
          <Container
            size="sm"
            padding="4"
            containerQuery={true}
            className="bg-blue-50 border border-blue-200"
          >
            <div className="@sm:bg-red-100 @md:bg-green-100 @lg:bg-purple-100 p-3 rounded">
              <div className="text-sm font-medium">Container Query Child</div>
              <div className="text-xs mt-1 space-y-1">
                <div>@sm: Red background</div>
                <div>@md: Green background</div>
                <div>@lg: Purple background</div>
              </div>
            </div>
          </Container>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Large Container (5xl)</h3>
          <Container
            size="5xl"
            padding="4"
            containerQuery={true}
            className="bg-blue-50 border border-blue-200"
          >
            <div className="@sm:bg-red-100 @md:bg-green-100 @lg:bg-purple-100 p-3 rounded">
              <div className="text-sm font-medium">Container Query Child</div>
              <div className="text-xs mt-1 space-y-1">
                <div>@sm: Red background</div>
                <div>@md: Green background</div>
                <div>@lg: Purple background</div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Responsive Grid Using Container Queries</h3>
        <Container
          size="6xl"
          padding="6"
          containerQuery={true}
          className="bg-gray-50 border border-gray-200"
        >
          <div className="grid @sm:grid-cols-1 @md:grid-cols-2 @xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`responsive-grid-item-${i + 1}`}
                className="bg-white p-4 rounded shadow-sm border"
              >
                <div className="text-sm font-medium">Item {i + 1}</div>
                <div className="text-xs text-gray-600 mt-1">Responds to container width</div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  ),
};

/**
 * Overscroll behavior demonstration.
 * Shows different scroll boundary handling options.
 */
export const OverscrollBehavior: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Overscroll Behavior Control</h2>
        <p className="text-gray-600 mb-6">
          Scroll to the bottom of each container to see different overscroll behaviors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Auto (Default)</h4>
          <Container
            size="sm"
            padding="4"
            overflow="scroll"
            overscrollBehavior="auto"
            className="bg-blue-50 border border-blue-200 h-48"
          >
            <div className="space-y-4 text-sm">
              {Array.from({ length: 10 }).map((_, i) => (
                <p key={`scroll-demo-paragraph-${i + 1}`}>
                  Paragraph {i + 1}: This container has overscroll-behavior: auto, which allows
                  default browser behavior like bounce effects on iOS and scroll chaining to parent
                  elements.
                </p>
              ))}
            </div>
          </Container>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contain</h4>
          <Container
            size="sm"
            padding="4"
            overflow="scroll"
            overscrollBehavior="contain"
            className="bg-green-50 border border-green-200 h-48"
          >
            <div className="space-y-4 text-sm">
              {Array.from({ length: 10 }).map((_, i) => (
                <p key={`scroll-demo-paragraph-${i + 1}`}>
                  Paragraph {i + 1}: This container uses overscroll-behavior: contain, preventing
                  scroll chaining to parent elements while keeping default boundary effects.
                </p>
              ))}
            </div>
          </Container>
        </div>

        <div>
          <h4 className="font-semibold mb-3">None</h4>
          <Container
            size="sm"
            padding="4"
            overflow="scroll"
            overscrollBehavior="none"
            className="bg-red-50 border border-red-200 h-48"
          >
            <div className="space-y-4 text-sm">
              {Array.from({ length: 10 }).map((_, i) => (
                <p key={`scroll-demo-paragraph-${i + 1}`}>
                  Paragraph {i + 1}: This container uses overscroll-behavior: none, disabling all
                  overscroll effects and scroll chaining for precise control.
                </p>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </div>
  ),
};

/**
 * Complex layout combining multiple properties.
 * Shows real-world usage of multiple container features together.
 */
export const ComplexLayout: Story = {
  render: () => (
    <div className="p-8">
      <Container
        as="main"
        size="full"
        padding="0"
        containerQuery={true}
        className="min-h-screen bg-gray-50"
      >
        {/* Header */}
        <Container
          size="full"
          padding="6"
          zIndex="raised"
          className="bg-white border-b border-gray-200 shadow-sm"
        >
          <div className="@lg:flex @lg:items-center @lg:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <nav className="@lg:flex @lg:space-x-6 mt-4 @lg:mt-0">
              <a href="#overview" className="text-gray-600 hover:text-gray-900">
                Overview
              </a>
              <a href="#analytics" className="text-gray-600 hover:text-gray-900">
                Analytics
              </a>
              <a href="#settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </a>
            </nav>
          </div>
        </Container>

        {/* Content Area */}
        <Container size="7xl" padding="8" containerQuery={true}>
          <div className="grid @md:grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 gap-6">
            {/* Metric Cards */}
            {[
              { title: 'Total Users', value: '12,345', change: '+12%' },
              { title: 'Revenue', value: '$45,678', change: '+8%' },
              { title: 'Conversion', value: '3.2%', change: '-2%' },
            ].map((metric, i) => (
              <Container
                key={`stat-card-${i + 1}`}
                padding="6"
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="text-sm font-medium text-gray-600">{metric.title}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</div>
                <div
                  className={`text-sm mt-1 ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                >
                  {metric.change} from last month
                </div>
              </Container>
            ))}
          </div>

          {/* Chart Area */}
          <Container
            padding="6"
            aspectRatio="phi"
            containerQuery={true}
            className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Chart</h3>
                <p className="text-gray-600">
                  Golden ratio aspect ratio (φ) provides harmonious proportions
                </p>
                <div className="mt-4 grid @sm:grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded">Container Query: @sm</div>
                  <div className="bg-green-50 p-3 rounded">Container Query: @md</div>
                  <div className="bg-purple-50 p-3 rounded">Container Query: @lg</div>
                </div>
              </div>
            </div>
          </Container>
        </Container>
      </Container>
    </div>
  ),
};

/**
 * Performance considerations for layout features.
 * Shows best practices for using multiple container properties.
 */
export const PerformanceOptimized: Story = {
  render: () => (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Performance Best Practices</h2>
        <p className="text-gray-600 mb-6">
          Examples of performant container usage with multiple properties.
        </p>
      </div>

      {/* Efficient container queries */}
      <Container
        size="5xl"
        padding="6"
        containerQuery={true}
        className="bg-blue-50 border border-blue-200"
      >
        <h3 className="font-semibold mb-4">✅ Efficient Container Query Usage</h3>
        <div className="@md:grid @md:grid-cols-2 @lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <h4 className="font-medium">Single Container Query</h4>
            <p className="text-sm text-gray-600 mt-1">
              One container query context serves multiple children efficiently.
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h4 className="font-medium">Semantic Breakpoints</h4>
            <p className="text-sm text-gray-600 mt-1">
              @md and @lg correspond to meaningful layout changes.
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <h4 className="font-medium">Design System Integration</h4>
            <p className="text-sm text-gray-600 mt-1">
              Uses design tokens for consistent spacing and sizing.
            </p>
          </div>
        </div>
      </Container>

      {/* Minimal property usage */}
      <Container
        size="4xl"
        padding="6"
        boxSizing="border-box"
        className="bg-green-50 border border-green-200"
      >
        <h3 className="font-semibold mb-4">✅ Minimal Property Usage</h3>
        <p className="text-sm text-gray-600">
          Only essential properties are used (size, padding, boxSizing). Defaults handle the rest
          efficiently. This reduces CSS complexity and improves rendering performance.
        </p>
      </Container>

      {/* Semantic HTML */}
      <Container as="article" className="bg-yellow-50 border border-yellow-200">
        <h3 className="font-semibold mb-4">✅ Semantic HTML Benefits</h3>
        <p className="mb-4">Using as="article" provides semantic defaults automatically:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Optimal reading width (4xl) for articles</li>
          <li>Comfortable padding (6) for content breathing room</li>
          <li>Container queries enabled by default</li>
          <li>Automatic prose styling for typography</li>
          <li>Accessibility landmarks for screen readers</li>
        </ul>
      </Container>
    </div>
  ),
};
