import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

/**
 * AI Training: Container Accessibility Intelligence
 *
 * ACCESSIBILITY CONSTRAINT TRAINING: WCAG compliance patterns and inclusive design
 * SEMANTIC HTML MASTERY: Landmark navigation and document structure
 * ASSISTIVE TECHNOLOGY: Screen reader optimization and keyboard navigation
 *
 * ACCESSIBILITY TRAINING SCENARIOS:
 * - Landmark roles and navigation structure
 * - Skip links and keyboard navigation patterns
 * - Color contrast and visual hierarchy
 * - Focus management and semantic ordering
 * - Screen reader compatibility testing
 *
 * This trains AI agents on accessibility-first design and inclusive UX patterns.
 */
const meta = {
  title: '03 Components/Layout/Container/Accessibility',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI Training: Accessibility patterns showing WCAG compliance, landmark navigation, and inclusive design with Container components.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['main', 'article', 'section', 'div'],
      description: 'Semantic HTML element - impacts accessibility landmarks',
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Landmark navigation structure for screen readers.
 * Shows proper document outline and navigation patterns.
 */
export const LandmarkNavigation: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      {/* Navigation landmark */}
      <Container as="nav" size="full" padding="4" className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Accessible Site</div>
          <nav aria-label="Primary navigation">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#home"
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Container>

      {/* Main content landmark */}
      <Container as="main" id="main-content" className="focus:outline-none">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Accessibility-First Container Design
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Semantic HTML containers provide automatic landmark roles for assistive technology,
            creating clear document structure and navigation paths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-3">Landmark Roles</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                • <code>&lt;main&gt;</code> = main landmark
              </li>
              <li>
                • <code>&lt;nav&gt;</code> = navigation landmark
              </li>
              <li>
                • <code>&lt;article&gt;</code> = article role
              </li>
              <li>
                • <code>&lt;section&gt;</code> = region role
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-3">Screen Reader Benefits</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Quick landmark navigation</li>
              <li>• Document outline structure</li>
              <li>• Skip navigation patterns</li>
              <li>• Content region identification</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-3">Keyboard Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Tab order preservation</li>
              <li>• Focus management</li>
              <li>• Skip links for efficiency</li>
              <li>• Logical reading order</li>
            </ul>
          </div>
        </div>

        {/* Article section with proper heading hierarchy */}
        <Container as="article" className="bg-white shadow-sm mb-8">
          <header>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Understanding Container Accessibility
            </h2>
            <p className="text-gray-600 mb-6">
              Published on <time dateTime="2025-01-09">January 9, 2025</time>
            </p>
          </header>

          <div className="prose max-w-none">
            <h3>Semantic Structure Benefits</h3>
            <p>
              Using semantic HTML elements like <code>&lt;article&gt;</code> provides automatic
              accessibility benefits. Screen readers can identify content regions and provide
              navigation shortcuts to users.
            </p>

            <h3>Design System Integration</h3>
            <p>
              The container's automatic prose styling ensures consistent typography hierarchy,
              making content easier to navigate for all users, including those using assistive
              technology.
            </p>
          </div>
        </Container>

        {/* Section with complementary content */}
        <Container as="section" aria-labelledby="related-heading" className="bg-blue-50">
          <h2 id="related-heading" className="text-xl font-semibold text-gray-900 mb-6">
            Related Accessibility Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">WCAG Guidelines</h3>
              <p className="text-sm text-gray-600">
                Web Content Accessibility Guidelines compliance
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">ARIA Best Practices</h3>
              <p className="text-sm text-gray-600">
                Accessible Rich Internet Applications patterns
              </p>
            </div>
          </div>
        </Container>
      </Container>
    </div>
  ),
};

/**
 * Focus management and keyboard navigation patterns.
 * Shows proper focus indicators and tab order.
 */
export const FocusManagement: Story = {
  render: () => (
    <Container as="main" className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Focus Management Demo</h1>
        <p className="text-gray-600">
          Press Tab to navigate through the focusable elements and observe focus indicators.
        </p>
      </div>

      {/* Form with proper focus management */}
      <Container className="bg-white border border-gray-200">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              aria-describedby="email-help"
            />
            <div id="email-help" className="text-xs text-gray-500 mt-1">
              We'll never share your email with third parties.
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-gray-700">Notification Preferences</legend>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
              </label>
            </div>
          </fieldset>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Form
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </Container>

      {/* Interactive elements with focus indicators */}
      <Container className="bg-gray-50 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Interactive Elements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            type="button"
            className="p-4 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Primary Action
          </button>
          <button
            type="button"
            className="p-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Success Action
          </button>
          <button
            type="button"
            className="p-4 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Warning Action
          </button>
          <button
            type="button"
            className="p-4 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Danger Action
          </button>
        </div>
      </Container>
    </Container>
  ),
};

/**
 * Color contrast and visual hierarchy for accessibility.
 * Shows WCAG AA/AAA compliant color combinations.
 */
export const ColorContrastHierarchy: Story = {
  render: () => (
    <Container as="main" className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Color Contrast & Visual Hierarchy</h1>
        <p className="text-gray-600">
          Examples of WCAG compliant color combinations and visual hierarchy patterns.
        </p>
      </div>

      {/* WCAG AA compliant examples */}
      <Container className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            WCAG AA Compliant (4.5:1 ratio minimum)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Primary Blue on White Text</h3>
              <p className="text-sm opacity-90">
                This combination meets WCAG AA standards for normal text with a contrast ratio of
                approximately 7:1.
              </p>
            </div>

            <div className="bg-gray-800 text-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Dark Gray on White Text</h3>
              <p className="text-sm opacity-90">
                High contrast combination ensuring readability for users with visual impairments.
              </p>
            </div>
          </div>
        </div>

        {/* Visual hierarchy example */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Visual Hierarchy</h2>
          <Container as="article" className="bg-white border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Primary Heading (H1)</h1>
            <p className="text-gray-700 mb-6">
              Primary body text with sufficient contrast ratio for comfortable reading. The
              automatic prose styling ensures optimal line height and spacing.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Secondary Heading (H2)</h2>
            <p className="text-gray-700 mb-4">
              Secondary content with maintained contrast ratios. The typography scale uses golden
              ratio proportions for harmonious visual hierarchy.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-2">Tertiary Heading (H3)</h3>
            <p className="text-gray-600 text-sm mb-4">
              Supporting text in a slightly lighter gray that still maintains WCAG AA compliance
              while providing visual hierarchy distinction.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">Note:</strong> All color combinations in this
                design system have been tested for WCAG compliance to ensure accessibility for users
                with visual impairments.
              </p>
            </div>
          </Container>
        </div>
      </Container>
    </Container>
  ),
};

/**
 * Screen reader optimization patterns.
 * Shows proper ARIA labels, descriptions, and semantic markup.
 */
export const ScreenReaderOptimization: Story = {
  render: () => (
    <Container as="main" className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Screen Reader Optimization</h1>
        <p className="text-gray-600">
          Examples of ARIA labels, descriptions, and semantic markup for assistive technology.
        </p>
      </div>

      {/* Data table with proper markup */}
      <Container className="bg-white border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Accessible Data Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" aria-label="Container size specifications">
            <caption className="text-left text-sm text-gray-600 mb-4">
              Container size specifications with corresponding max-width values and use cases
            </caption>
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-4 py-3 text-left font-medium text-gray-900 border-b">
                  Size
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-gray-900 border-b">
                  Max Width
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-gray-900 border-b">
                  Use Case
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-gray-900 border-b">
                  Accessibility Notes
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-gray-900 border-b">
                  sm
                </th>
                <td className="px-4 py-3 text-gray-700 border-b">24rem</td>
                <td className="px-4 py-3 text-gray-700 border-b">Mobile cards, sidebars</td>
                <td className="px-4 py-3 text-gray-700 border-b">Good for touch targets</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-gray-900 border-b">
                  2xl
                </th>
                <td className="px-4 py-3 text-gray-700 border-b">42rem</td>
                <td className="px-4 py-3 text-gray-700 border-b">Reading content</td>
                <td className="px-4 py-3 text-gray-700 border-b">
                  Optimal line length 65-75 chars
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-gray-900 border-b">
                  full
                </th>
                <td className="px-4 py-3 text-gray-700 border-b">100%</td>
                <td className="px-4 py-3 text-gray-700 border-b">Application layouts</td>
                <td className="px-4 py-3 text-gray-700 border-b">
                  Responsive breakpoints important
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>

      {/* Complex widget with ARIA */}
      <Container className="bg-white border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Interactive Widget with ARIA</h2>
        <div
          role="tablist"
          aria-label="Container feature documentation"
          className="flex border-b border-gray-200"
        >
          <button
            type="button"
            role="tab"
            aria-selected="true"
            aria-controls="features-panel"
            id="features-tab"
            className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
          >
            Features
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="false"
            aria-controls="props-panel"
            id="props-tab"
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Props
          </button>
        </div>

        <div role="tabpanel" id="features-panel" aria-labelledby="features-tab" className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">Container Features</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Responsive container queries (Tailwind v4)</li>
            <li>• Semantic HTML with automatic accessibility landmarks</li>
            <li>• Design system integration with --spacing-* tokens</li>
            <li>• Golden ratio aspect ratios and typography scaling</li>
          </ul>
        </div>
      </Container>

      {/* Status and feedback */}
      <Container className="bg-white border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status and Feedback</h2>
        <div className="space-y-4">
          <output
            aria-live="polite"
            className="bg-green-50 border border-green-200 rounded-lg p-4 block"
          >
            <div className="flex items-center">
              <div className="text-green-600 mr-3" aria-hidden="true">
                ✓
              </div>
              <div>
                <div className="font-medium text-green-800">Form submitted successfully</div>
                <div className="text-sm text-green-700">Your preferences have been saved.</div>
              </div>
            </div>
          </output>

          <div
            role="alert"
            aria-live="assertive"
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <div className="text-red-600 mr-3" aria-hidden="true">
                ⚠
              </div>
              <div>
                <div className="font-medium text-red-800">Validation error</div>
                <div className="text-sm text-red-700">
                  Please check the required fields and try again.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Container>
  ),
};
