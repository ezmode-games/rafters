import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../../../components/Container';

const meta = {
  title: '03 Components/Layout/Container/Intelligence',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo content for intelligence demonstrations
const IntelligenceDemo = ({ title, description }: { title: string; description: string }) => (
  <div className="space-y-4">
    <h2 className="heading-section text-primary">{title}</h2>
    <p className="text-body text-muted-foreground">{description}</p>
    <div className="bg-muted/20 p-6 rounded border">
      <h3 className="heading-component mb-2">Intelligence Pattern</h3>
      <p className="text-body-small">
        This container demonstrates intelligent behavior through design system integration,
        mathematical spacing relationships, and cognitive load optimization principles.
      </p>
    </div>
  </div>
);

export const ReadingOptimization: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8">
      <Container variant="reading" padding="phi-1" as="article">
        <IntelligenceDemo
          title="Reading-Optimized Container"
          description="Uses container-reading token (~38rem) to provide optimal line lengths of 45-75 characters for sustained reading comfort. Reduces cognitive load through consistent character counting."
        />
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates reading optimization using the container-reading design token for optimal character-per-line ratios that enhance reading comprehension.',
      },
    },
  },
};

export const GoldenRatioLayout: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8">
      <Container variant="golden" padding="phi-2" as="main">
        <IntelligenceDemo
          title="Golden Ratio Intelligence"
          description="Uses container-golden token (61.8rem) based on the golden ratio for natural, aesthetically pleasing proportions that feel intuitively balanced to users."
        />
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Golden ratio proportions create subconscious comfort through mathematical harmony. Uses the container-golden design token for naturally balanced layouts.',
      },
    },
  },
};

export const PhiSpacingHierarchy: Story = {
  render: () => (
    <div className="space-y-8 bg-background p-8">
      {(['phi--2', 'phi--1', 'phi-0', 'phi-1', 'phi-2'] as const).map((spacing) => (
        <div key={spacing} className="border border-muted rounded">
          <div className="p-4 bg-muted/10">
            <h3 className="heading-component">{spacing} Spacing</h3>
          </div>
          <Container variant="golden" padding={spacing} className="bg-accent/5">
            <p className="text-body">
              This container uses {spacing} padding from the phi-based spacing scale. Each step
              follows mathematical relationships for natural visual rhythm.
            </p>
          </Container>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Phi-based spacing hierarchy using design system tokens creates natural visual rhythm through mathematical relationships that reduce cognitive processing.',
      },
    },
  },
};

export const CognitiveLoadOptimization: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        <Container
          variant="reading"
          padding="phi-1"
          className="bg-destructive/5 border border-destructive/20"
        >
          <div className="space-y-4">
            <h3 className="heading-subsection text-destructive-foreground">High Cognitive Load</h3>
            <p className="text-body-small">
              Without proper spacing and width constraints, users must work harder to track line
              endings, parse dense information, and maintain reading focus across excessively wide
              text blocks.
            </p>
          </div>
        </Container>

        <Container
          variant="reading"
          padding="phi-1"
          className="bg-success/5 border border-success/20"
        >
          <div className="space-y-4">
            <h3 className="heading-subsection text-success-foreground">Optimized Cognitive Load</h3>
            <p className="text-body-small">
              Proper reading width and phi-based spacing reduce mental effort, improve
              comprehension, and create comfortable reading patterns that users can sustain for
              longer periods.
            </p>
          </div>
        </Container>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Cognitive load comparison showing how proper container sizing and spacing reduce mental effort and improve user experience through design intelligence.',
      },
    },
  },
};
