import { contextEasing, contextTiming, easing, timing } from '@rafters/design-tokens/motion';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';

const meta = {
  title: '03 Components/Action/Button/Intelligence',
  component: Button,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoadingState: Story = {
  args: {
    loading: true,
    children: 'Processing...',
  },
};

export const DestructiveConfirm: Story = {
  args: {
    variant: 'destructive',
    destructiveConfirm: true,
    children: 'Delete Item',
  },
};

export const AttentionHierarchy: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm" variant="ghost">
        Cancel
      </Button>
      <Button size="md" variant="secondary">
        Save Draft
      </Button>
      <Button size="lg" variant="primary">
        Publish Now
      </Button>
    </div>
  ),
};

/**
 * Motion Intelligence
 *
 * Documents the motion design tokens and intelligence patterns used by Button components.
 * Shows how timing and easing choices support design intelligence principles.
 */
export const MotionIntelligence: Story = {
  render: () => {
    return (
      <div className="space-y-6 max-w-2xl">
        {/* Motion Token Documentation */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Motion Tokens Used</h3>
          <ul className="text-sm space-y-1 font-mono">
            <li>
              <code>contextTiming.hover</code> - {contextTiming.hover} (75ms)
            </li>
            <li>
              <code>contextEasing.hover</code> - {contextEasing.hover} (snappy response)
            </li>
          </ul>
        </div>

        {/* Design Intelligence Integration */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Design Intelligence</h3>
          <ul className="text-sm space-y-1">
            <li>
              <strong>Cognitive Load:</strong> 3/10 - Instant feedback reduces uncertainty
            </li>
            <li>
              <strong>Trust Building:</strong> Immediate hover response builds user confidence
            </li>
            <li>
              <strong>Attention Economics:</strong> Motion supports interaction hierarchy without
              competing
            </li>
          </ul>
        </div>

        {/* Interactive Demo */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Motion Demonstration</h3>
          <div className="flex gap-4">
            <Button onClick={fn()}>Hover to experience motion intelligence</Button>
            <Button variant="destructive" onClick={fn()}>
              Destructive actions use same responsive timing
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Motion tokens provide 75ms instant feedback with snappy easing, building immediate trust
            through responsive interactions.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Motion intelligence patterns showing how timing and easing tokens support the Button component's design intelligence principles.",
      },
    },
  },
};
