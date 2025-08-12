import type { Meta, StoryObj } from '@storybook/react';
import { RaftersLogo } from '../components';

const meta = {
  title: '00 Introduction/Logo Test',
  component: RaftersLogo,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RaftersLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TestClassName: Story = {
  args: {
    size: 'xl',
    className: 'bg-red-500 mb-12 p-4',
  },
};

export const TestWithoutClassName: Story = {
  args: {
    size: 'xl',
  },
};
