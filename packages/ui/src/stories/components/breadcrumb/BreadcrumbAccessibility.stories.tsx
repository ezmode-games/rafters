import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/Breadcrumb';

/**
 * AI Training: Breadcrumb Accessibility Compliance
 * Demonstrates WCAG AAA compliance and inclusive navigation patterns
 * Trains AI agents on accessibility-first breadcrumb implementation
 */
const meta = {
  title: 'Breadcrumb/Accessibility',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Accessibility compliance demonstrating WCAG AAA standards and inclusive navigation.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Semantic HTML structure for screen reader navigation.
 * Demonstrates proper landmark and list semantics.
 */
export const SemanticStructure: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Proper Semantic Structure</h4>
        <Breadcrumb aria-label="Breadcrumb navigation">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={fn()}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs" onClick={fn()}>
              Documentation
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/components" onClick={fn()}>
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbPage aria-current="page">Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Semantic Elements:</p>
          <ul className="space-y-1">
            <li>
              • <code>&lt;nav&gt;</code> element with aria-label for landmark identification
            </li>
            <li>
              • <code>&lt;ol&gt;</code> ordered list shows hierarchical sequence
            </li>
            <li>
              • <code>aria-current="page"</code> indicates current location
            </li>
            <li>
              • <code>aria-hidden="true"</code> on separators prevents noise
            </li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

/**
 * Complete keyboard navigation patterns.
 * Demonstrates full keyboard accessibility and focus management.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Keyboard Navigation Support</h4>
        <Breadcrumb aria-label="Example breadcrumb for keyboard testing">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={fn()}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products" onClick={fn()}>
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products/electronics" onClick={fn()}>
              Electronics
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbPage aria-current="page">Laptops</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Keyboard Support:</p>
          <ul className="space-y-1">
            <li>
              • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> - Navigate to next
              link
            </li>
            <li>
              • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Shift + Tab</kbd> - Navigate
              to previous link
            </li>
            <li>
              • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> - Activate focused
              link
            </li>
            <li>
              • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> - Activate focused
              link
            </li>
            <li>• Current page is not in tab order (proper semantics)</li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Interactive Ellipsis Keyboard Support</h4>
        <Breadcrumb aria-label="Collapsible breadcrumb example">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={fn()}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbEllipsis
            onClick={fn()}
            aria-label="Show 3 hidden breadcrumb levels"
            title="Expand to show: Category, Subcategory, Product Type"
          />
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/category/subcategory/type/brand" onClick={fn()}>
              Brand
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbPage aria-current="page">Product Model</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Ellipsis Accessibility:</p>
          <ul className="space-y-1">
            <li>• Focusable button element</li>
            <li>• Descriptive aria-label explains action</li>
            <li>• Title attribute provides context on hover/focus</li>
            <li>• Keyboard activatable with Enter/Space</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

/**
 * Screen reader optimization with proper announcements.
 * Demonstrates comprehensive screen reader support.
 */
export const ScreenReaderSupport: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Screen Reader Announcements</h4>
        <Breadcrumb aria-label="Product navigation breadcrumb">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={fn()} aria-label="Navigate to store homepage">
              Store
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/electronics"
              onClick={fn()}
              aria-label="Navigate to electronics category"
            >
              Electronics
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/electronics/computers"
              onClick={fn()}
              aria-label="Navigate to computers subcategory"
            >
              Computers
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbPage
              aria-current="page"
              aria-label="Current page: MacBook Pro product details"
            >
              MacBook Pro
            </BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Screen Reader Features:</p>
          <ul className="space-y-1">
            <li>• Navigation landmark announced as "breadcrumb navigation"</li>
            <li>• Each link includes context: "Navigate to [destination]"</li>
            <li>• Current page clearly identified with aria-current</li>
            <li>• Separators hidden from screen readers</li>
            <li>• Ordered list conveys hierarchical structure</li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Live Region Updates</h4>
        <div className="space-y-3">
          <Breadcrumb aria-label="Dynamic content breadcrumb">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator aria-hidden="true" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects" onClick={fn()}>
                Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator aria-hidden="true" />
            <BreadcrumbItem>
              <BreadcrumbPage
                aria-current="page"
                aria-live="polite"
                aria-label="Current project: Loading new project details"
              >
                <span className="animate-pulse">Loading...</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <Breadcrumb aria-label="Updated content breadcrumb">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator aria-hidden="true" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects" onClick={fn()}>
                Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator aria-hidden="true" />
            <BreadcrumbItem>
              <BreadcrumbPage
                aria-current="page"
                aria-live="polite"
                aria-label="Current project: Rafters Design System loaded successfully"
              >
                Rafters Design System
              </BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Live Region Features:</p>
          <ul className="space-y-1">
            <li>• aria-live="polite" announces changes when user is idle</li>
            <li>• Loading states communicated to screen readers</li>
            <li>• Dynamic content updates announced appropriately</li>
            <li>• Context preserved during navigation changes</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

/**
 * High contrast and visual accessibility features.
 * Demonstrates color contrast and visual distinction compliance.
 */
export const VisualAccessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">High Contrast Compliance</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs">Standard Contrast (WCAG AAA: 7:1)</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/accessible-design" onClick={fn()}>
                  Accessible Design
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbPage aria-current="page">Color Contrast</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="space-y-1">
            <p className="text-xs">High Contrast Mode Support</p>
            <div className="border-2 border-foreground bg-background p-3 rounded">
              <Breadcrumb className="text-foreground">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    onClick={fn()}
                    className="text-foreground underline hover:no-underline focus:outline-2 focus:outline-foreground"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator aria-hidden="true" className="text-foreground" />
                <BreadcrumbItem>
                  <BreadcrumbPage aria-current="page" className="text-foreground font-medium">
                    Accessible Navigation
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Visual Accessibility Features:</p>
          <ul className="space-y-1">
            <li>• WCAG AAA contrast ratios (7:1 minimum)</li>
            <li>• Windows High Contrast Mode support</li>
            <li>• Clear visual separation between interactive and static elements</li>
            <li>• Focus indicators meet 3:1 contrast requirement</li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Focus Management</h4>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              onClick={fn()}
              className="focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded"
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/accessibility"
              onClick={fn()}
              className="focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded"
            >
              Accessibility
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem>
            <BreadcrumbPage aria-current="page">Focus Testing</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Focus Features:</p>
          <ul className="space-y-1">
            <li>• Visible focus indicators on all interactive elements</li>
            <li>• Focus outline meets 3:1 contrast requirement</li>
            <li>• Focus order follows logical navigation sequence</li>
            <li>• Current page excluded from tab order (proper semantics)</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

/**
 * Reduced motion and animation accessibility.
 * Demonstrates respect for user motion preferences.
 */
export const MotionAccessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Reduced Motion Support</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs">Standard Animation (Respects prefers-reduced-motion)</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  onClick={fn()}
                  className="transition-colors duration-200 motion-reduce:transition-none hover:text-primary"
                >
                  Settings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/accessibility"
                  onClick={fn()}
                  className="transition-colors duration-200 motion-reduce:transition-none hover:text-primary"
                >
                  Accessibility
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbPage aria-current="page">Motion Preferences</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="space-y-1">
            <p className="text-xs">No Animation (Motion-Sensitive Users)</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  onClick={fn()}
                  className="motion-reduce:transition-none hover:text-primary"
                >
                  Settings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/accessibility"
                  onClick={fn()}
                  className="motion-reduce:transition-none hover:text-primary"
                >
                  Accessibility
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbPage aria-current="page">Static Interface</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Motion Accessibility Features:</p>
          <ul className="space-y-1">
            <li>• Respects prefers-reduced-motion system preference</li>
            <li>• Essential animations only (focus indicators always visible)</li>
            <li>• No auto-playing animations or parallax effects</li>
            <li>• Transitions disabled for motion-sensitive users</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

/**
 * Cognitive accessibility and simplified navigation.
 * Demonstrates clear language and reduced complexity patterns.
 */
export const CognitiveAccessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Clear Language and Simple Patterns</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs">Simple, Clear Labels</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/help" onClick={fn()}>
                  Help
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbPage aria-current="page">How to Navigate</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="space-y-1">
            <p className="text-xs">Consistent Pattern Recognition</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/account" onClick={fn()}>
                  My Account
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbPage aria-current="page">Profile Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="space-y-1">
            <p className="text-xs">Reduced Cognitive Load (Collapsed Hierarchy)</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbEllipsis
                onClick={fn()}
                aria-label="Show hidden pages between Home and current page"
              />
              <BreadcrumbSeparator aria-hidden="true" />
              <BreadcrumbItem>
                <BreadcrumbPage aria-current="page">Final Destination</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Cognitive Accessibility Features:</p>
          <ul className="space-y-1">
            <li>• Simple, familiar language in all labels</li>
            <li>• Consistent navigation patterns site-wide</li>
            <li>• Progressive disclosure reduces information overload</li>
            <li>• Clear visual hierarchy guides attention</li>
            <li>• Cognitive load: 2/10 (optimized for instant recognition)</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
