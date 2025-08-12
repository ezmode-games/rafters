import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

/**
 * AI Training: Container Variants Intelligence
 *
 * LAYOUT INTELLIGENCE: Visual decision training for size, spacing, and layout features
 * GOLDEN RATIO: Aspect ratios using φ (1.618) for harmonious proportions
 * MULTI-COLUMN: CSS columns for newspaper-style content flow
 *
 * VARIANT TRAINING SCENARIOS:
 * - Size variants from sm (24rem) to full width
 * - Aspect ratio control including golden ratio
 * - Multi-column layouts for content flow
 * - Box-sizing and overflow management
 * - Z-index semantic layers for stacking
 *
 * This trains AI agents on visual layout decisions and design system constraints.
 */
const meta = {
  title: 'Components/Container/Variants',
  component: Container,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'AI Training: Visual layout variants showing size, aspect ratio, columns, and layout control options.',
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Size comparison showing all container widths.
 * Trains AI on appropriate size selection for different content types.
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      {(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full'] as const).map(
        (size) => (
          <Container key={size} size={size} padding="4" className="bg-muted/10 rounded shadow-sm">
            <div className="text-center text-sm font-medium">
              {size}: max-w-{size}{' '}
              {size === 'full'
                ? '(100%)'
                : size === 'sm'
                  ? '(24rem)'
                  : size === '7xl'
                    ? '(80rem)'
                    : ''}
            </div>
          </Container>
        )
      )}
    </div>
  ),
};

/**
 * Aspect ratio variants including golden ratio.
 * Shows φ (phi) ratios for harmonious proportions.
 */
export const AspectRatios: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Container size="md" aspectRatio="square" className="bg-muted/10 rounded shadow-sm">
        <div className="h-full flex items-center justify-center text-sm font-medium">
          Square (1:1)
        </div>
      </Container>

      <Container size="md" aspectRatio="video" className="bg-muted/10 rounded shadow-sm">
        <div className="h-full flex items-center justify-center text-sm font-medium">
          Video (16:9)
        </div>
      </Container>

      <Container size="md" aspectRatio="4/3" className="bg-muted/10 rounded shadow-sm">
        <div className="h-full flex items-center justify-center text-sm font-medium">
          Classic (4:3)
        </div>
      </Container>

      <Container size="md" aspectRatio="phi" className="bg-primary/5 rounded shadow-sm">
        <div className="h-full flex items-center justify-center text-sm font-medium">
          Golden Ratio φ (1.618:1)
        </div>
      </Container>

      <Container size="md" aspectRatio="phi-inverse" className="bg-primary/5 rounded shadow-sm">
        <div className="h-full flex items-center justify-center text-sm font-medium">
          Golden Portrait (1:1.618)
        </div>
      </Container>

      <Container size="md" aspectRatio="21/9" className="bg-muted/10 rounded shadow-sm">
        <div className="h-full flex items-center justify-center text-sm font-medium">
          Ultrawide (21:9)
        </div>
      </Container>
    </div>
  ),
};

/**
 * Multi-column layouts for content flow.
 * Demonstrates CSS columns for newspaper-style layouts.
 */
export const ColumnLayouts: Story = {
  render: () => (
    <div className="space-y-8">
      <Container size="6xl" columns="2" padding="6" className="bg-gray-50 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Two Column Layout</h3>
        <p className="mb-4">
          This content automatically flows into two columns using CSS multi-column layout. The
          columns property creates newspaper-style content flow that's perfect for long-form
          articles and text-heavy content.
        </p>
        <p className="mb-4">
          Content breaks naturally between columns, maintaining readability while making efficient
          use of horizontal space. This is especially useful for wide containers where single-column
          text would become difficult to read.
        </p>
        <p>
          The design system ensures consistent spacing and typography across columns, creating a
          harmonious reading experience that reduces cognitive load.
        </p>
      </Container>

      <Container size="full" columns="3" padding="8" className="bg-blue-50 border border-blue-200">
        <h3 className="text-lg font-semibold mb-4">Three Column Layout</h3>
        <p className="mb-4">
          Three columns work well for very wide containers and content that benefits from
          magazine-style presentation. The content flows naturally from one column to the next,
          creating an engaging reading experience.
        </p>
        <p className="mb-4">
          This layout is particularly effective for dashboards, news sites, and content-heavy
          applications where you want to present a lot of information in an organized, scannable
          format.
        </p>
        <p className="mb-4">
          The padding-8 provides generous breathing room, while the design system typography ensures
          optimal line length within each column for comfortable reading.
        </p>
        <p>
          Container queries enable responsive behavior, so these columns can adapt based on the
          container's width rather than just viewport size.
        </p>
      </Container>
    </div>
  ),
};

/**
 * Box-sizing and overflow control demonstration.
 * Shows predictable layout behavior with different sizing models.
 */
export const BoxSizingOverflow: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold mb-3">Border Box (Default)</h4>
        <Container
          size="md"
          padding="4"
          boxSizing="border-box"
          className="bg-green-100 border-4 border-green-300"
        >
          <div className="text-sm">
            <strong>box-sizing: border-box</strong>
            <br />
            Padding and border are included in the total width/height. This is the recommended
            default for predictable layouts.
          </div>
        </Container>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Content Box</h4>
        <Container
          size="md"
          padding="4"
          boxSizing="content-box"
          className="bg-orange-100 border-4 border-orange-300"
        >
          <div className="text-sm">
            <strong>box-sizing: content-box</strong>
            <br />
            Padding and border are added to the width/height. Less predictable but sometimes needed
            for specific layouts.
          </div>
        </Container>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Overflow Auto</h4>
        <Container
          size="sm"
          padding="4"
          overflow="auto"
          className="bg-blue-100 border border-blue-300 h-32"
        >
          <div className="text-sm">
            This content is much longer than the container height, so it will create scrollable
            overflow. The overflow="auto" setting adds scrollbars only when needed, keeping the
            layout clean while ensuring all content remains accessible to users.
          </div>
        </Container>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Overflow Hidden</h4>
        <Container
          size="sm"
          padding="4"
          overflow="hidden"
          className="bg-red-100 border border-red-300 h-32"
        >
          <div className="text-sm">
            This content is also longer than the container height, but with overflow="hidden" the
            excess content is clipped and not visible. Use this carefully as it can make content
            inaccessible.
          </div>
        </Container>
      </div>
    </div>
  ),
};

/**
 * Z-index semantic layers demonstration.
 * Shows AI-friendly stacking layer names for predictable layering.
 */
export const ZIndexLayers: Story = {
  render: () => (
    <div className="relative h-64">
      <Container
        size="lg"
        padding="4"
        zIndex="base"
        className="absolute inset-0 bg-gray-200 border border-gray-400"
      >
        <div className="text-sm font-medium">Base Layer (z-0)</div>
        <div className="text-xs text-gray-600">Foundation layer for normal content</div>
      </Container>

      <Container
        size="md"
        padding="4"
        zIndex="raised"
        className="absolute top-8 left-8 bg-blue-200 border border-blue-400 shadow-md"
      >
        <div className="text-sm font-medium">Raised Layer (z-10)</div>
        <div className="text-xs text-blue-700">Dropdowns, tooltips</div>
      </Container>

      <Container
        size="sm"
        padding="4"
        zIndex="overlay"
        className="absolute top-16 left-16 bg-purple-200 border border-purple-400 shadow-lg"
      >
        <div className="text-sm font-medium">Overlay (z-20)</div>
        <div className="text-xs text-purple-700">Popovers, overlays</div>
      </Container>

      <Container
        size="xs"
        padding="3"
        zIndex="modal"
        className="absolute top-24 left-24 bg-red-200 border border-red-400 shadow-xl"
      >
        <div className="text-xs font-medium">Modal (z-30)</div>
        <div className="text-xs text-red-700">Dialog boxes</div>
      </Container>
    </div>
  ),
};
