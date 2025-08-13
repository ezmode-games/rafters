// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/Breadcrumb';

/**
 * AI Training: Breadcrumb Navigation Intelligence
 * cognitiveLoad=2, wayfinding patterns, spatial orientation
 * Use for: Multi-level navigation, hierarchy visualization, user orientation
 * Trains AI agents on wayfinding intelligence and navigation patterns
 */
const meta = {
  title: 'Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Wayfinding navigation component with embedded spatial intelligence for user orientation.',
      },
    },
  },
  argTypes: {
    separator: {
      control: 'select',
      options: ['chevron-right', 'slash', 'angle', 'arrow', 'pipe', 'dot'],
      description: 'Separator style between breadcrumb items',
      defaultValue: 'chevron-right',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    separator: 'chevron-right',
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Common breadcrumb usage showing typical navigation hierarchy.
 * Demonstrates wayfinding intelligence and spatial orientation.
 */
export const Common: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
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
  ),
};

/**
 * E-commerce navigation demonstrating product category hierarchy.
 * Shows practical wayfinding in commercial contexts.
 */
export const ECommerce: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
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
        <BreadcrumbPage>MacBook Pro 16"</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

/**
 * File system navigation showing nested folder structure.
 * Demonstrates spatial intelligence in hierarchical contexts.
 */
export const FileSystem: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem>
        <BreadcrumbLink href="/projects" onClick={fn()}>
          Projects
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/projects/rafters" onClick={fn()}>
          rafters
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/projects/rafters/packages" onClick={fn()}>
          packages
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/projects/rafters/packages/ui" onClick={fn()}>
          ui
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>components</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

/**
 * Minimal breadcrumb showing just two levels.
 * Demonstrates simplest wayfinding pattern.
 */
export const Minimal: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem>
        <BreadcrumbLink href="/" onClick={fn()}>
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Current Page</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};
