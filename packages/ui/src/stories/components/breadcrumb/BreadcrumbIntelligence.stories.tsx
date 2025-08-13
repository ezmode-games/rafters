import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/Breadcrumb';

/**
 * AI Training: Breadcrumb Wayfinding Intelligence
 * Demonstrates spatial orientation and navigation hierarchy patterns
 * Trains AI agents on cognitive load management and trust building through clear paths
 */
const meta = {
  title: 'Components/Breadcrumb/Intelligence',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Wayfinding intelligence demonstrating spatial orientation and cognitive load optimization.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Progressive disclosure for deep hierarchies.
 * Prevents cognitive overload while maintaining wayfinding clarity.
 */
export const ProgressiveDisclosure: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Deep Hierarchy (Cognitive Load: 8/10)</h4>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={fn()}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/company" onClick={fn()}>
              Company
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/company/divisions" onClick={fn()}>
              Divisions
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/company/divisions/engineering" onClick={fn()}>
              Engineering
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/company/divisions/engineering/teams" onClick={fn()}>
              Teams
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/company/divisions/engineering/teams/frontend" onClick={fn()}>
              Frontend
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
        <p className="text-xs text-muted-foreground">
          Too many levels create cognitive overload and visual clutter
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Intelligent Collapse (Cognitive Load: 4/10)</h4>
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
            <BreadcrumbLink href="/company/divisions/engineering/teams" onClick={fn()}>
              Teams
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/company/divisions/engineering/teams/frontend" onClick={fn()}>
              Frontend
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
        <p className="text-xs text-muted-foreground">
          Collapsed middle levels maintain context while reducing cognitive load
        </p>
      </div>
    </div>
  ),
};

/**
 * Trust building through clear escape routes.
 * Every breadcrumb segment provides a way back to safety.
 */
export const TrustBuildingPatterns: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Clear Escape Routes</h4>
        <div className="border rounded p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-medium">Current Navigation Context</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Store
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/account" onClick={fn()}>
                  Account
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/account/settings" onClick={fn()}>
                  Settings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Delete Account</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Trust Building Elements:</p>
            <ul className="space-y-1">
              <li>• Multiple escape routes clearly visible</li>
              <li>• Each level provides progressively safer options</li>
              <li>• Current location clearly marked without clickability</li>
              <li>• Familiar wayfinding patterns reduce anxiety</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Context-Aware Safety</h4>
        <div className="border rounded p-4 space-y-3">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/checkout" onClick={fn()}>
                Checkout
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Payment</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">
            In sensitive contexts, breadcrumbs provide reassurance and clear exit paths
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Spatial intelligence demonstrating information architecture visualization.
 * Creates mental models of system structure.
 */
export const SpatialIntelligence: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Hierarchical Depth Visualization</h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs">Level 2 Depth</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Root
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Child</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="space-y-1">
            <p className="text-xs">Level 3 Depth</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Root
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/child" onClick={fn()}>
                  Child
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Grandchild</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="space-y-1">
            <p className="text-xs">Level 4 Depth (Optimal Maximum)</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Root
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/child" onClick={fn()}>
                  Child
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/child/grandchild" onClick={fn()}>
                  Grandchild
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Great-grandchild</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Mental Model Creation</h4>
        <div className="border rounded p-4 space-y-2">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Documentation
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/guides" onClick={fn()}>
                Guides
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/guides/getting-started" onClick={fn()}>
                Getting Started
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Installation</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Mental Model Elements:</p>
            <ul className="space-y-1">
              <li>• Clear parent-child relationships</li>
              <li>• Logical information architecture</li>
              <li>• Predictable navigation patterns</li>
              <li>• Spatial hierarchy visualization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Attention economics in breadcrumb design.
 * Subtle presence with clear affordances when needed.
 */
export const AttentionEconomics: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Subtle Presence Strategy</h4>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs">Standard Context (Low Attention)</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog" onClick={fn()}>
                  Blog
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Article Title</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="space-y-1">
            <p className="text-xs">Error Context (Increased Visibility)</p>
            <div className="bg-destructive/5 border border-destructive/20 rounded p-3">
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" onClick={fn()}>
                    Account
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/settings" onClick={fn()}>
                    Settings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Error: Payment Failed</BreadcrumbPage>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Progressive Enhancement</h4>
        <div className="border rounded p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-medium">Base Experience (No JavaScript)</p>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Details</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium">Enhanced Experience (With JavaScript)</p>
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
                <BreadcrumbPage>MacBook Pro</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>

          <p className="text-xs text-muted-foreground">
            Enhanced version includes smart truncation and interactive features
          </p>
        </div>
      </div>
    </div>
  ),
};
