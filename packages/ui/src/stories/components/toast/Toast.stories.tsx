// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../../../components/Toast';

/**
 * Feedback delivered at exactly the right moment. Toast notifications provide immediate
 * confirmation that builds user confidence in their actions through intelligent timing and dismissal patterns.
 */
const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Temporal feedback component with embedded timing intelligence and trust-building confirmation patterns.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'destructive'],
      description: 'Visual and semantic variant',
    },
    urgency: {
      control: 'select',
      options: ['low', 'medium', 'high'],
      description: 'Controls auto-dismiss timing: low=3s, medium=5s, high=8s',
    },
    interruption: {
      control: 'select',
      options: ['polite', 'assertive', 'demanding'],
      description: 'Visual emphasis level for user attention',
    },
    persistent: {
      control: 'boolean',
      description: 'Whether toast remains until manually dismissed',
    },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Common toast variants showing different timing intelligence patterns.
 * Demonstrates trust-building through appropriate urgency levels and semantic meaning.
 */
export const Common: Story = {
  render: (args) => {
    const [toasts, setToasts] = useState<
      Array<{
        id: number;
        variant: 'default' | 'success' | 'warning' | 'error';
        title: string;
        description: string;
        urgency: 'low' | 'medium' | 'high';
        persistent?: boolean;
        hasAction?: boolean;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const showToast = (config: {
      variant: 'default' | 'success' | 'warning' | 'error';
      title: string;
      description: string;
      urgency: 'low' | 'medium' | 'high';
      persistent?: boolean;
      hasAction?: boolean;
    }) => {
      setToasts((prev) => [...prev, { ...config, id: nextId }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <div className="w-full" style={{ height: '400px' }}>
        <ToastProvider>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                showToast({
                  variant: 'default',
                  title: 'File saved',
                  description: 'Draft saved automatically',
                  urgency: 'low',
                })
              }
            >
              Low Priority (3s)
            </Button>

            <Button
              variant="success"
              onClick={() =>
                showToast({
                  variant: 'success',
                  title: 'Upload complete',
                  description: 'presentation.pptx uploaded successfully',
                  urgency: 'medium',
                })
              }
            >
              Success (5s)
            </Button>

            <Button
              variant="warning"
              onClick={() =>
                showToast({
                  variant: 'warning',
                  title: 'Session expiring',
                  description: 'Your session will expire in 2 minutes',
                  urgency: 'high',
                  hasAction: true,
                })
              }
            >
              Warning (8s + Action)
            </Button>

            <Button
              variant="destructive"
              onClick={() =>
                showToast({
                  variant: 'error',
                  title: 'Upload failed',
                  description: 'Network connection lost. Your work is saved.',
                  urgency: 'high',
                  persistent: true,
                  hasAction: true,
                })
              }
            >
              Error (Persistent)
            </Button>
          </div>

          <ToastViewport />

          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              open={true}
              onOpenChange={() => hideToast(toast.id)}
              variant={toast.variant}
              urgency={toast.urgency}
              persistent={toast.persistent}
              {...args}
            >
              <div className="grid gap-1">
                <ToastTitle>{toast.title}</ToastTitle>
                <ToastDescription>{toast.description}</ToastDescription>
              </div>
              {toast.hasAction && (
                <ToastAction altText="Take action" onClick={fn()}>
                  {toast.variant === 'warning' ? 'Extend' : 'Retry'}
                </ToastAction>
              )}
              <ToastClose />
            </Toast>
          ))}
        </ToastProvider>
      </div>
    );
  },
};
