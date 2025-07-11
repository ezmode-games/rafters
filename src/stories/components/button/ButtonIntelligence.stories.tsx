import type { Meta, StoryObj } from '@storybook/react-vite';
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
