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
 * AI Training: Breadcrumb Interactive Properties
 * Demonstrates responsive behavior and interactive patterns
 * Trains AI agents on breadcrumb state management and user feedback
 */
const meta = {
  title: 'Breadcrumb/Properties',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Interactive properties demonstrating responsive behavior and state management.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive ellipsis behavior for collapsed hierarchies.
 * Demonstrates progressive disclosure and cognitive load management.
 */
export const EllipsisInteraction: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Expandable Ellipsis (Reduces Cognitive Load)</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs">Collapsed State</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbEllipsis onClick={fn()} />
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/category/subcategory" onClick={fn()}>
                  Subcategory
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Product</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="space-y-1">
            <p className="text-xs">Expanded State (On Click)</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/electronics" onClick={fn()}>
                  Electronics
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/electronics/computers" onClick={fn()}>
                  Computers
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/electronics/computers/laptops" onClick={fn()}>
                  Laptops
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/category/subcategory" onClick={fn()}>
                  Subcategory
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Product</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Click ellipsis to reveal hidden navigation levels
        </p>
      </div>
    </div>
  ),
};

/**
 * Responsive behavior patterns for different screen sizes.
 * Demonstrates adaptive layout and truncation strategies.
 */
export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Desktop Layout (Full Hierarchy)</h4>
        <div className="w-full border rounded p-4">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products" onClick={fn()}>
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products/electronics" onClick={fn()}>
                Electronics
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products/electronics/computers" onClick={fn()}>
                Computers
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products/electronics/computers/laptops" onClick={fn()}>
                Laptops
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>MacBook Pro 16"</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Tablet Layout (Smart Truncation)</h4>
        <div className="max-w-md border rounded p-4">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbEllipsis onClick={fn()} />
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products/electronics/computers" onClick={fn()}>
                Computers
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products/electronics/computers/laptops" onClick={fn()}>
                Laptops
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>MacBook Pro</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Mobile Layout (Minimal Hierarchy)</h4>
        <div className="max-w-xs border rounded p-4">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/products/electronics/computers" onClick={fn()}>
                Computers
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>MacBook</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
    </div>
  ),
};

/**
 * Loading and dynamic state management.
 * Demonstrates proper state communication during navigation updates.
 */
export const DynamicStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Loading State</h4>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={fn()}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products" onClick={fn()}>
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="animate-pulse bg-muted">Loading...</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Error State</h4>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={fn()}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products" onClick={fn()}>
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-destructive">Error: Page Not Found</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Active/Current State</h4>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={fn()}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products" onClick={fn()}>
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">Current Product</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
  ),
};

/**
 * Keyboard navigation and accessibility patterns.
 * Demonstrates proper focus management and keyboard support.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Keyboard Navigation Support</h4>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={fn()}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs" onClick={fn()}>
              Documentation
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/components" onClick={fn()}>
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Keyboard Support:</p>
          <ul className="space-y-1">
            <li>
              • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> - Navigate between
              links
            </li>
            <li>
              • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> /{' '}
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> - Activate link
            </li>
            <li>
              • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Shift + Tab</kbd> - Navigate
              backwards
            </li>
            <li>• Current page is not focusable (proper semantics)</li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Interactive Ellipsis Keyboard Support</h4>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={fn()}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbEllipsis onClick={fn()} />
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/category" onClick={fn()}>
              Category
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Ellipsis Interaction:</p>
          <ul className="space-y-1">
            <li>• Ellipsis button is focusable and clickable</li>
            <li>• Reveals hidden breadcrumb levels</li>
            <li>• Proper ARIA labels for screen readers</li>
            <li>• Keyboard accessible expansion</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

/**
 * Truncation strategies for long navigation paths.
 * Demonstrates intelligent text shortening and ellipsis patterns.
 */
export const TruncationStrategies: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Long Path Names</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs">Individual Item Truncation</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/very-long-category-name"
                  onClick={fn()}
                  className="max-w-24 truncate"
                >
                  Very Long Category Name That Exceeds Normal Width
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-32 truncate">
                  Extremely Long Product Name That Would Overflow
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="space-y-1">
            <p className="text-xs">Hierarchy Collapse Strategy</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbEllipsis onClick={fn()} />
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/final-category" onClick={fn()}>
                  Final Category
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Long Product Name</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Responsive Text Behavior</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs">Wide Container (Full Text)</p>
            <div className="w-full border rounded p-2">
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" onClick={fn()}>
                    Documentation
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/guides" onClick={fn()}>
                    Getting Started Guides
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Installation and Configuration</BreadcrumbPage>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs">Narrow Container (Truncated)</p>
            <div className="max-w-xs border rounded p-2">
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" onClick={fn()} className="max-w-16 truncate">
                    Documentation
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/guides" onClick={fn()} className="max-w-20 truncate">
                    Getting Started Guides
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-24 truncate">
                    Installation and Configuration
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
