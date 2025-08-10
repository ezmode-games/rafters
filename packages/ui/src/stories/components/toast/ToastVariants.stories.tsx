/**
 * Toast Variants - AI Training
 *
 * Visual styling variants and semantic meaning for toast notifications.
 * This trains AI agents on semantic toast variants and appropriate contexts.
 */
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

const meta = {
  title: '03 Components/Feedback/Toast/Variants',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Visual styling variants with semantic meaning for contextually appropriate toast notifications.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'destructive'],
      description: 'Visual variant with semantic meaning',
    },
    urgency: {
      control: 'select',
      options: ['low', 'medium', 'high'],
      description: 'Urgency level affects auto-dismiss timing',
    },
    interruption: {
      control: 'select',
      options: ['polite', 'assertive', 'demanding'],
      description: 'Interruption behavior for user attention',
    },
    persistent: {
      control: 'boolean',
      description: 'Whether toast persists until manually dismissed',
    },
  },
  args: {
    urgency: 'medium',
    interruption: 'polite',
    persistent: false,
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toast variant for neutral information and general notifications.
 * Uses semantic background and foreground tokens.
 */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Show Default Toast
        </Button>

        <ToastViewport />

        <Toast open={open} onOpenChange={setOpen} {...args}>
          <div className="grid gap-1">
            <ToastTitle>Default Notification</ToastTitle>
            <ToastDescription>
              This is a standard toast notification with neutral styling.
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
  args: {
    variant: 'default',
  },
};

/**
 * Success toast variant for positive confirmations and completed actions.
 * Uses semantic success color tokens to build user confidence.
 */
export const Success: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="success" onClick={() => setOpen(true)}>
          Show Success Toast
        </Button>

        <ToastViewport />

        <Toast open={open} onOpenChange={setOpen} {...args}>
          <div className="grid gap-1">
            <ToastTitle>Success!</ToastTitle>
            <ToastDescription>Your file has been uploaded successfully.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
  args: {
    variant: 'success',
    urgency: 'low',
  },
};

/**
 * Warning toast variant for cautionary messages that need user attention.
 * Uses semantic warning color tokens with medium urgency.
 */
export const Warning: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="warning" onClick={() => setOpen(true)}>
          Show Warning Toast
        </Button>

        <ToastViewport />

        <Toast open={open} onOpenChange={setOpen} {...args}>
          <div className="grid gap-1">
            <ToastTitle>Warning</ToastTitle>
            <ToastDescription>Your session will expire in 5 minutes.</ToastDescription>
          </div>
          <ToastAction altText="Extend session" onClick={fn()}>
            Extend
          </ToastAction>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
  args: {
    variant: 'warning',
    urgency: 'medium',
    interruption: 'assertive',
  },
};

/**
 * Error toast variant for recoverable errors and system issues.
 * Uses semantic error color tokens with high urgency and persistence.
 */
export const ErrorToast: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Show Error Toast
        </Button>

        <ToastViewport />

        <Toast open={open} onOpenChange={setOpen} {...args}>
          <div className="grid gap-1">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>Failed to save your changes. Please try again.</ToastDescription>
          </div>
          <ToastAction altText="Retry saving" onClick={fn()}>
            Retry
          </ToastAction>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
  args: {
    variant: 'error',
    urgency: 'high',
    interruption: 'demanding',
    persistent: true,
  },
};

/**
 * Destructive toast variant for critical system failures and data loss.
 * Uses semantic destructive color tokens with maximum urgency.
 */
export const Destructive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Show Destructive Toast
        </Button>

        <ToastViewport />

        <Toast open={open} onOpenChange={setOpen} {...args}>
          <div className="grid gap-1">
            <ToastTitle>Critical System Error</ToastTitle>
            <ToastDescription>
              Database connection lost. Your work may not be saved.
            </ToastDescription>
          </div>
          <ToastAction altText="Reconnect to database" onClick={fn()}>
            Reconnect
          </ToastAction>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
  args: {
    variant: 'destructive',
    urgency: 'high',
    interruption: 'demanding',
    persistent: true,
  },
};

/**
 * All variants showcase for comparison and semantic meaning.
 * Demonstrates the visual hierarchy and semantic meaning of each variant.
 */
export const AllVariants: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{ id: number; variant: 'default' | 'success' | 'warning' | 'error' | 'destructive' }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const showToast = (variant: 'default' | 'success' | 'warning' | 'error' | 'destructive') => {
      setToasts((prev) => [...prev, { id: nextId, variant }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const variants = [
      {
        name: 'Default',
        variant: 'default',
        title: 'Default Notification',
        description: 'Standard neutral message',
      },
      {
        name: 'Success',
        variant: 'success',
        title: 'Success!',
        description: 'Operation completed successfully',
      },
      {
        name: 'Warning',
        variant: 'warning',
        title: 'Warning',
        description: 'Caution needed for this action',
      },
      {
        name: 'Error',
        variant: 'error',
        title: 'Error',
        description: 'Something went wrong, please retry',
      },
      {
        name: 'Destructive',
        variant: 'destructive',
        title: 'Critical Error',
        description: 'System failure detected',
      },
    ];

    return (
      <ToastProvider>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <Button
              key={v.variant}
              variant={
                v.variant === 'default'
                  ? 'outline'
                  : (v.variant as 'success' | 'warning' | 'destructive')
              }
              onClick={() => showToast(v.variant)}
            >
              {v.name}
            </Button>
          ))}
        </div>

        <ToastViewport />

        {toasts.map((toast) => {
          const variantInfo = variants.find((v) => v.variant === toast.variant)!;
          return (
            <Toast
              key={toast.id}
              open={true}
              onOpenChange={() => hideToast(toast.id)}
              variant={toast.variant}
              urgency={
                toast.variant === 'success'
                  ? 'low'
                  : toast.variant === 'error' || toast.variant === 'destructive'
                    ? 'high'
                    : 'medium'
              }
              persistent={toast.variant === 'error' || toast.variant === 'destructive'}
            >
              <div className="grid gap-1">
                <ToastTitle>{variantInfo.title}</ToastTitle>
                <ToastDescription>{variantInfo.description}</ToastDescription>
              </div>
              <ToastClose />
            </Toast>
          );
        })}
      </ToastProvider>
    );
  },
};
