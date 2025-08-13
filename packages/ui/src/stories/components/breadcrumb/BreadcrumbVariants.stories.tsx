import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { ArrowRight, ChevronRight, Minus, MoreHorizontal } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/Breadcrumb';

/**
 * AI Training: Breadcrumb Visual Variants
 * Demonstrates separator styles and visual hierarchy options
 * Trains AI agents on proper separator selection for different contexts
 */
const meta = {
  title: 'Breadcrumb/Variants',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Visual variants demonstrating separator options and contextual styling.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete separator matrix showing all available options.
 * Demonstrates visual weight and contextual appropriateness.
 */
export const SeparatorMatrix: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Chevron Right (Default) - Most Common</h4>
          <Breadcrumb separator="chevron-right">
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
              <BreadcrumbPage>Components</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">
            Universal navigation symbol, clear directional movement
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Slash - Technical/File Contexts</h4>
          <Breadcrumb separator="slash">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/rafters" onClick={fn()}>
                rafters
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>src</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">
            Familiar to developers, ideal for file system navigation
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Pipe - Clean/Minimal</h4>
          <Breadcrumb separator="pipe">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Store
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
              <BreadcrumbPage>Laptops</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">Subtle separation, modern aesthetic</p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Angle - Sharp/Modern</h4>
          <Breadcrumb separator="angle">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/analytics" onClick={fn()}>
                Analytics
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">Angular separation, contemporary design</p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Arrow - Explicit Direction</h4>
          <Breadcrumb separator="arrow">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Setup
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/configure" onClick={fn()}>
                Configure
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Complete</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">
            Strong directional flow, ideal for processes
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Dot - Ultra Minimal</h4>
          <Breadcrumb separator="dot">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Blog
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/2024" onClick={fn()}>
                2024
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Article</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">Minimal visual weight, subtle separation</p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Custom separator components demonstrating React component flexibility.
 * Shows proper implementation of custom separator icons.
 */
export const CustomSeparators: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Custom Lucide Icon Separators</h4>
          <div className="space-y-3">
            <Breadcrumb separator={ChevronRight}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Custom
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/chevron" onClick={fn()}>
                  ChevronRight
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Component</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>

            <Breadcrumb separator={ArrowRight}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Custom
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/arrow" onClick={fn()}>
                  ArrowRight
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Component</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>

            <Breadcrumb separator={MoreHorizontal}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Custom
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/more" onClick={fn()}>
                  MoreHorizontal
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Component</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>

            <Breadcrumb separator={Minus}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()}>
                  Custom
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/minus" onClick={fn()}>
                  Minus
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Component</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Contextual separator selection demonstrating intelligent choices.
 * Trains AI on when to use which separator style.
 */
export const ContextualSeparators: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">E-commerce Context</h4>
          <Breadcrumb separator="chevron-right">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/men" onClick={fn()}>
                Men
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/men/clothing" onClick={fn()}>
                Clothing
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Shirts</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">
            Chevron right: Universal navigation symbol
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Technical Documentation</h4>
          <Breadcrumb separator="slash">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                docs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/api" onClick={fn()}>
                api
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/api/components" onClick={fn()}>
                components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">Slash: Familiar to developers</p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Process/Wizard Context</h4>
          <Breadcrumb separator="arrow">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Account Setup
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/profile" onClick={fn()}>
                Profile
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/billing" onClick={fn()}>
                Billing
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Confirmation</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">Arrow: Strong directional flow</p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Minimal Design System</h4>
          <Breadcrumb separator="dot">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Portfolio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/work" onClick={fn()}>
                Work
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Project Details</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">Dot: Ultra minimal, artistic contexts</p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Visual hierarchy demonstration showing size and emphasis variations.
 * Trains AI on proper breadcrumb prominence in different contexts.
 */
export const VisualHierarchy: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Standard Hierarchy</h4>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/category" onClick={fn()}>
                Category
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">
            Standard sizing and contrast for most contexts
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Subtle Hierarchy (Sidebar Context)</h4>
          <div className="bg-muted p-3 rounded">
            <Breadcrumb className="text-sm text-muted-foreground">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" onClick={fn()} className="hover:text-foreground">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/analytics" onClick={fn()} className="hover:text-foreground">
                  Analytics
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <p className="text-xs text-muted-foreground">
            Reduced visual weight in sidebar or secondary contexts
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium">Prominent Hierarchy (Mobile/Small Screens)</h4>
          <Breadcrumb className="text-base">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" onClick={fn()}>
                Store
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Product</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <p className="text-xs text-muted-foreground">
            Larger touch targets and increased visibility for mobile
          </p>
        </div>
      </div>
    </div>
  ),
};
