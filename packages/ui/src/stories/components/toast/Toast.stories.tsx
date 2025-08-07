import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
  title: '03 Components/Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Show Toast
        </Button>

        <ToastViewport />

        <Toast open={open} onOpenChange={setOpen}>
          <div className="grid gap-1">
            <ToastTitle>Scheduled: Catch up</ToastTitle>
            <ToastDescription>Friday, February 10, 2023 at 5:57 PM</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
};

export const WithAction: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Show Toast with Action
        </Button>

        <ToastViewport />

        <Toast open={open} onOpenChange={setOpen}>
          <div className="grid gap-1">
            <ToastTitle>Uh oh! Something went wrong</ToastTitle>
            <ToastDescription>There was a problem with your request.</ToastDescription>
          </div>
          <ToastAction altText="Try again">Try again</ToastAction>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
};

export const Success: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Show Success Toast
        </Button>

        <ToastViewport />

        <Toast open={open} onOpenChange={setOpen} variant="success">
          <div className="grid gap-1">
            <ToastTitle>Success!</ToastTitle>
            <ToastDescription>Your file has been uploaded successfully.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
};

export const Warning: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Show Warning Toast
        </Button>

        <ToastViewport />

        <Toast open={open} onOpenChange={setOpen} variant="warning">
          <div className="grid gap-1">
            <ToastTitle>Warning</ToastTitle>
            <ToastDescription>Your session will expire in 5 minutes.</ToastDescription>
          </div>
          <ToastAction altText="Extend session">Extend</ToastAction>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
};

export const ErrorToast: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Show Error Toast
        </Button>

        <ToastViewport />

        <Toast
          open={open}
          onOpenChange={setOpen}
          variant="error"
          urgency="high"
          interruption="demanding"
          persistent={true}
        >
          <div className="grid gap-1">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>Failed to save your changes. Please try again.</ToastDescription>
          </div>
          <ToastAction altText="Retry saving">Retry</ToastAction>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
};
