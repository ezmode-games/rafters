import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

/**
 * Layout intelligence begins with the container. Every content area needs clear boundaries,
 * optimal reading widths, and mathematical spacing that serves human cognitive patterns.
 * Our Container system implements design intelligence using established design system tokens.
 */
const meta = {
  title: '03 Components/Layout/Container',
  component: Container,
  status: 'published',
  tags: ['!autodocs', '!dev', 'test'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Intelligent container component using design system tokens for responsive layout foundation. Implements phi-based spacing, golden ratio containers, and semantic HTML structure.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['reading', 'golden', 'wide', 'full'],
      description: 'Container variant using design system tokens for optimal content width',
    },
    padding: {
      control: 'select',
      options: ['none', 'phi--2', 'phi--1', 'phi-0', 'phi-1', 'phi-2'],
      description: 'Phi-based spacing using design system spacing tokens',
    },
    as: {
      control: 'select',
      options: ['div', 'main', 'section', 'article'],
      description: 'Semantic HTML element for accessibility excellence',
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo content for stories
const DemoContent = ({ title = 'Container Intelligence' }: { title?: string }) => (
  <div className="space-y-4">
    <h2 className="heading-section text-primary">{title}</h2>
    <p className="text-body text-muted-foreground">
      This container demonstrates intelligent layout patterns using design system tokens. The golden
      ratio containers and phi-based spacing create natural, readable layouts that reduce cognitive
      load and enhance user experience.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-accent/10 p-4 rounded">
        <h3 className="heading-component mb-2">Design Tokens</h3>
        <p className="text-body-small">Uses established container and spacing tokens.</p>
      </div>
      <div className="bg-accent/10 p-4 rounded">
        <h3 className="heading-component mb-2">Golden Ratio</h3>
        <p className="text-body-small">Mathematical proportions for natural layouts.</p>
      </div>
      <div className="bg-accent/10 p-4 rounded">
        <h3 className="heading-component mb-2">Semantic HTML</h3>
        <p className="text-body-small">Accessibility through proper markup structure.</p>
      </div>
    </div>
  </div>
);

export const Common: Story = {
  render: (args) => {
    return (
      <div className="min-h-screen bg-background">
        <Container {...args}>
          <DemoContent title="Container with Design System Intelligence" />
        </Container>
      </div>
    );
  },
  args: {
    variant: 'golden',
    padding: 'phi-0',
    as: 'div',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Primary demonstration of Container using design system tokens with golden ratio proportions and phi-based spacing for optimal readability.',
      },
    },
  },
};
