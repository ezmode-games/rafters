import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';

/**
 * Accessibility is design quality, not compliance.
 * Every accessibility feature improves the experience for all users.
 */
const meta = {
  title: 'Components/Button/Accessibility',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessibility features that enhance usability for all users while ensuring inclusive design principles are met.',
      },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Foundation Principles
 *
 * Accessible buttons work for everyone, not just assistive technology users.
 * They provide clear context, proper semantics, and predictable behavior.
 */
export const AccessibilityBasics: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Foundation Principles</h3>
        <p className="text-sm text-muted-foreground">
          Accessible buttons benefit everyone by providing clear context and predictable interaction
          patterns.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-base font-medium">Clear Purpose</h4>
          <div className="space-y-2">
            <Button>Save Document</Button>
            <p className="text-xs text-muted-foreground">
              Descriptive text eliminates guesswork about button function
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Enhanced Context</h4>
          <div className="space-y-2">
            <Button aria-label="Save the current document to your account">Save</Button>
            <p className="text-xs text-muted-foreground">
              aria-label provides additional context when button text is minimal
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">State Communication</h4>
          <div className="space-y-2">
            <Button aria-pressed={true} variant="secondary">
              Starred
            </Button>
            <p className="text-xs text-muted-foreground">
              aria-pressed communicates toggle state to all users
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Foundation accessibility principles that improve usability for everyone while ensuring inclusive design standards.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Natural Navigation
 *
 * Keyboard navigation should feel intuitive and predictable.
 * Focus management creates smooth, logical interaction flows.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Keyboard Navigation</h3>
        <p className="text-sm text-muted-foreground">
          Use Tab to navigate, Space or Enter to activate. Focus indicators show current position
          clearly.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Button variant="primary">First Action</Button>
          <Button variant="secondary">Second Action</Button>
          <Button variant="outline">Third Action</Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            • <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Tab</kbd> to navigate between
            buttons
          </div>
          <div>
            • <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Space</kbd> or{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to activate
          </div>
          <div>• Focus ring provides clear visual indication</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard navigation patterns that create intuitive, predictable interaction flows for all users.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Universal Design
 *
 * Color contrast and visual design serve functional purposes.
 * High contrast improves readability in all lighting conditions.
 */
export const ColorContrastDemo: Story = {
  render: () => (
    <div className="space-y-8 p-4 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Universal Design Through Contrast</h3>
        <p className="text-sm text-muted-foreground">
          High contrast benefits everyone: users with low vision, people in bright sunlight, and
          anyone using older displays.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-base font-medium">Standard Lighting</h4>
          <div className="p-4 bg-background border rounded">
            <div className="space-y-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline Action</Button>
              <Button variant="ghost">Ghost Action</Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-medium">High Contrast Simulation</h4>
          <div className="p-4 bg-white border rounded">
            <div className="space-y-3">
              <Button variant="primary" className="contrast-more:bg-black contrast-more:text-white">
                Primary Action
              </Button>
              <Button
                variant="secondary"
                className="contrast-more:border-black contrast-more:text-black"
              >
                Secondary Action
              </Button>
              <Button
                variant="outline"
                className="contrast-more:border-black contrast-more:text-black"
              >
                Outline Action
              </Button>
              <Button
                variant="ghost"
                className="contrast-more:text-black hover:contrast-more:bg-gray-200"
              >
                Ghost Action
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <div>
          All button variants maintain WCAG AA contrast ratios (4.5:1) for optimal readability
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Color contrast demonstration showing how proper contrast ratios benefit all users across different viewing conditions.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Screen Reader Optimization
 *
 * Screen readers need semantic structure and clear relationships.
 * Proper markup creates predictable, navigable experiences.
 */
export const ScreenReaderOptimization: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Screen Reader Optimization</h3>
        <p className="text-sm text-muted-foreground">
          Semantic markup and ARIA attributes create clear, navigable experiences for screen reader
          users.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-base font-medium">Action Context</h4>
          <div className="space-y-2">
            <Button aria-describedby="save-description" variant="primary">
              Save Changes
            </Button>
            <div id="save-description" className="text-xs text-muted-foreground">
              Saves your current document progress to the cloud
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Loading State</h4>
          <div className="space-y-2">
            <Button disabled aria-live="polite" aria-busy="true">
              Processing...
            </Button>
            <div className="text-xs text-muted-foreground">
              aria-live and aria-busy communicate loading state to screen readers
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Toggle State</h4>
          <div className="space-y-2">
            <Button variant="secondary" aria-pressed={false} aria-label="Add item to favorites">
              Favorite
            </Button>
            <div className="text-xs text-muted-foreground">
              aria-pressed indicates current toggle state clearly
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Screen reader optimization techniques that create clear, navigable experiences through semantic markup and ARIA attributes.',
      },
    },
    layout: 'fullscreen',
  },
};
