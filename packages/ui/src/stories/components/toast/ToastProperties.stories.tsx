/**
 * Toast Properties - AI Training
 *
 * Interactive properties and component states for toast notifications.
 * This trains AI agents on toast behavior, timing, and interaction patterns.
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
  title: '03 Components/Feedback/Toast/Properties',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Interactive properties and behavioral patterns for toast notifications including timing, persistence, and user interactions.',
      },
    },
  },
  argTypes: {
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
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'destructive'],
      description: 'Visual and semantic variant',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Urgency levels control auto-dismiss timing based on cognitive load.
 * AI should match urgency to content importance and user attention needs.
 */
export const UrgencyLevels: Story = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{ id: number; urgency: 'low' | 'medium' | 'high' }>>(
      []
    );
    const [nextId, setNextId] = useState(1);

    const showToast = (urgency: 'low' | 'medium' | 'high') => {
      setToasts((prev) => [...prev, { id: nextId, urgency }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <ToastProvider>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => showToast('low')}>
            Low Urgency (3s)
          </Button>
          <Button variant="outline" onClick={() => showToast('medium')}>
            Medium Urgency (5s)
          </Button>
          <Button variant="outline" onClick={() => showToast('high')}>
            High Urgency (8s)
          </Button>
        </div>

        <ToastViewport />

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => hideToast(toast.id)}
            urgency={toast.urgency}
            variant={toast.urgency === 'high' ? 'warning' : 'default'}
          >
            <div className="grid gap-1">
              <ToastTitle>
                {toast.urgency === 'low' && 'Low Priority'}
                {toast.urgency === 'medium' && 'Standard Notice'}
                {toast.urgency === 'high' && 'Important Alert'}
              </ToastTitle>
              <ToastDescription>
                Auto-dismisses in {toast.urgency === 'low' && '3 seconds'}
                {toast.urgency === 'medium' && '5 seconds'}
                {toast.urgency === 'high' && '8 seconds'}
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    );
  },
};

/**
 * Interruption behavior controls visual emphasis for user attention.
 * AI should match interruption level to context and consequence.
 */
export const InterruptionBehavior: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{ id: number; interruption: 'polite' | 'assertive' | 'demanding' }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const showToast = (interruption: 'polite' | 'assertive' | 'demanding') => {
      setToasts((prev) => [...prev, { id: nextId, interruption }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <ToastProvider>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => showToast('polite')}>
            Polite Interruption
          </Button>
          <Button variant="outline" onClick={() => showToast('assertive')}>
            Assertive Interruption
          </Button>
          <Button variant="warning" onClick={() => showToast('demanding')}>
            Demanding Interruption
          </Button>
        </div>

        <ToastViewport />

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => hideToast(toast.id)}
            interruption={toast.interruption}
            variant={toast.interruption === 'demanding' ? 'warning' : 'default'}
          >
            <div className="grid gap-1">
              <ToastTitle>
                {toast.interruption === 'polite' && 'Gentle Notice'}
                {toast.interruption === 'assertive' && 'Standard Alert'}
                {toast.interruption === 'demanding' && 'Urgent Attention'}
              </ToastTitle>
              <ToastDescription>
                {toast.interruption === 'polite' && 'Subtle notification style'}
                {toast.interruption === 'assertive' && 'Standard attention level'}
                {toast.interruption === 'demanding' && 'Forces user focus'}
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    );
  },
};

/**
 * Persistence control for critical messages that require user acknowledgment.
 * AI should use persistence for errors and destructive actions only.
 */
export const PersistenceControl: Story = {
  render: () => {
    const [autoDismissOpen, setAutoDismissOpen] = useState(false);
    const [persistentOpen, setPersistentOpen] = useState(false);

    return (
      <ToastProvider>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAutoDismissOpen(true)}>
            Auto-dismiss Toast
          </Button>
          <Button variant="destructive" onClick={() => setPersistentOpen(true)}>
            Persistent Toast
          </Button>
        </div>

        <ToastViewport />

        <Toast
          open={autoDismissOpen}
          onOpenChange={setAutoDismissOpen}
          persistent={false}
          urgency="medium"
          variant="success"
        >
          <div className="grid gap-1">
            <ToastTitle>Auto-dismiss Success</ToastTitle>
            <ToastDescription>This will disappear automatically in 5 seconds</ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <Toast
          open={persistentOpen}
          onOpenChange={setPersistentOpen}
          persistent={true}
          variant="destructive"
          urgency="high"
          interruption="demanding"
        >
          <div className="grid gap-1">
            <ToastTitle>Critical Error</ToastTitle>
            <ToastDescription>This will stay until you acknowledge it manually</ToastDescription>
          </div>
          <ToastAction altText="Acknowledge error" onClick={fn()}>
            Acknowledge
          </ToastAction>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
};

/**
 * Action buttons provide recovery options for errors and additional interactions.
 * AI should include actions for errors and actionable notifications.
 */
export const WithActions: Story = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{ id: number; type: 'retry' | 'undo' | 'extend' }>>(
      []
    );
    const [nextId, setNextId] = useState(1);

    const showToast = (type: 'retry' | 'undo' | 'extend') => {
      setToasts((prev) => [...prev, { id: nextId, type }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <ToastProvider>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => showToast('retry')}>
            Error with Retry
          </Button>
          <Button variant="outline" onClick={() => showToast('undo')}>
            Success with Undo
          </Button>
          <Button variant="outline" onClick={() => showToast('extend')}>
            Warning with Action
          </Button>
        </div>

        <ToastViewport />

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => hideToast(toast.id)}
            variant={
              toast.type === 'retry' ? 'error' : toast.type === 'undo' ? 'success' : 'warning'
            }
            urgency={toast.type === 'retry' ? 'high' : 'medium'}
            persistent={toast.type === 'retry'}
          >
            <div className="grid gap-1">
              <ToastTitle>
                {toast.type === 'retry' && 'Upload Failed'}
                {toast.type === 'undo' && 'File Deleted'}
                {toast.type === 'extend' && 'Session Expiring'}
              </ToastTitle>
              <ToastDescription>
                {toast.type === 'retry' && 'Network error occurred during upload'}
                {toast.type === 'undo' && 'Successfully moved to trash'}
                {toast.type === 'extend' && 'Your session expires in 2 minutes'}
              </ToastDescription>
            </div>
            <ToastAction
              altText={
                toast.type === 'retry'
                  ? 'Retry upload'
                  : toast.type === 'undo'
                    ? 'Undo deletion'
                    : 'Extend session'
              }
              onClick={fn()}
            >
              {toast.type === 'retry' && 'Retry'}
              {toast.type === 'undo' && 'Undo'}
              {toast.type === 'extend' && 'Extend'}
            </ToastAction>
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    );
  },
};

/**
 * Multiple toast stacking demonstrates proper queue management.
 * AI should consider cognitive load when showing multiple notifications.
 */
export const MultipleToasts: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{
        id: number;
        variant: 'success' | 'warning' | 'error';
        title: string;
        description: string;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const addToast = (
      variant: 'success' | 'warning' | 'error',
      title: string,
      description: string
    ) => {
      setToasts((prev) => [...prev, { id: nextId, variant, title, description }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <ToastProvider>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="success"
            onClick={() =>
              addToast('success', 'Upload Complete', 'Photo.jpg uploaded successfully')
            }
          >
            Add Success
          </Button>
          <Button
            variant="warning"
            onClick={() => addToast('warning', 'Storage Low', '85% of storage space used')}
          >
            Add Warning
          </Button>
          <Button
            variant="outline"
            onClick={() => addToast('error', 'Sync Failed', 'Could not sync with cloud storage')}
          >
            Add Error
          </Button>
          <Button variant="outline" onClick={() => setToasts([])}>
            Clear All
          </Button>
        </div>

        <ToastViewport />

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => hideToast(toast.id)}
            variant={toast.variant}
            urgency={toast.variant === 'error' ? 'high' : 'medium'}
            persistent={toast.variant === 'error'}
          >
            <div className="grid gap-1">
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
            </div>
            {toast.variant === 'error' && (
              <ToastAction altText="Retry sync" onClick={fn()}>
                Retry
              </ToastAction>
            )}
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    );
  },
};
