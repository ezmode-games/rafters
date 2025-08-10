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
  title: '03 Components/Feedback/Toast/Intelligence',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Toast Intelligence Patterns

This component demonstrates the intelligent behavior patterns built into the Toast component:

## Intelligence Properties

### Urgency Levels
- **low**: Casual notifications (3 seconds)
- **medium**: Standard messages (5 seconds)
- **high**: Important alerts (8 seconds)

### Interruption Behavior
- **polite**: Subtle notification
- **assertive**: Standard interruption
- **demanding**: Forces user attention

### Persistence Control
- **false**: Auto-dismiss based on urgency
- **true**: Remains until user dismisses

These properties work together to create contextually appropriate user experiences.
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

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
          >
            <div className="grid gap-1">
              <ToastTitle>
                {toast.urgency === 'low' && 'Low Urgency'}
                {toast.urgency === 'medium' && 'Medium Urgency'}
                {toast.urgency === 'high' && 'High Urgency'}
              </ToastTitle>
              <ToastDescription>
                {toast.urgency === 'low' && 'This message will auto-dismiss in 3 seconds'}
                {toast.urgency === 'medium' && 'This message will auto-dismiss in 5 seconds'}
                {toast.urgency === 'high' && 'This message will auto-dismiss in 8 seconds'}
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    );
  },
};

export const InterruptionBehavior: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{
        id: number;
        interruption: 'polite' | 'assertive' | 'demanding';
      }>
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
            Polite
          </Button>
          <Button variant="outline" onClick={() => showToast('assertive')}>
            Assertive
          </Button>
          <Button variant="outline" onClick={() => showToast('demanding')}>
            Demanding
          </Button>
        </div>

        <ToastViewport />

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => hideToast(toast.id)}
            interruption={toast.interruption}
          >
            <div className="grid gap-1">
              <ToastTitle>
                {toast.interruption === 'polite' && 'Polite Interruption'}
                {toast.interruption === 'assertive' && 'Assertive Interruption'}
                {toast.interruption === 'demanding' && 'Demanding Interruption'}
              </ToastTitle>
              <ToastDescription>
                {toast.interruption === 'polite' && 'Subtle notification style'}
                {toast.interruption === 'assertive' && 'Standard attention level'}
                {toast.interruption === 'demanding' && 'Forces user attention'}
              </ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    );
  },
};

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
          <Button variant="outline" onClick={() => setPersistentOpen(true)}>
            Persistent Toast
          </Button>
        </div>

        <ToastViewport />

        <Toast
          open={autoDismissOpen}
          onOpenChange={setAutoDismissOpen}
          persistent={false}
          urgency="medium"
        >
          <div className="grid gap-1">
            <ToastTitle>Auto-dismiss Toast</ToastTitle>
            <ToastDescription>This will disappear automatically in 5 seconds</ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <Toast open={persistentOpen} onOpenChange={setPersistentOpen} persistent={true}>
          <div className="grid gap-1">
            <ToastTitle>Persistent Toast</ToastTitle>
            <ToastDescription>This will stay until you dismiss it manually</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
};

export const CombinedIntelligence: Story = {
  render: () => {
    const [errorOpen, setErrorOpen] = useState(false);
    const [warningOpen, setWarningOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);

    return (
      <ToastProvider>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => setErrorOpen(true)}>
            Critical Error
          </Button>
          <Button variant="outline" onClick={() => setWarningOpen(true)}>
            Important Warning
          </Button>
          <Button variant="outline" onClick={() => setInfoOpen(true)}>
            Casual Info
          </Button>
        </div>

        <ToastViewport />

        <Toast
          open={errorOpen}
          onOpenChange={setErrorOpen}
          variant="error"
          urgency="high"
          interruption="demanding"
          persistent={true}
        >
          <div className="grid gap-1">
            <ToastTitle>Critical Error</ToastTitle>
            <ToastDescription>System failure detected. Immediate action required.</ToastDescription>
          </div>
          <ToastAction altText="Retry operation">Retry</ToastAction>
          <ToastClose />
        </Toast>

        <Toast
          open={warningOpen}
          onOpenChange={setWarningOpen}
          variant="warning"
          urgency="medium"
          interruption="assertive"
          persistent={false}
        >
          <div className="grid gap-1">
            <ToastTitle>Important Warning</ToastTitle>
            <ToastDescription>This action cannot be undone. Please confirm.</ToastDescription>
          </div>
          <ToastAction altText="Confirm action">Confirm</ToastAction>
          <ToastClose />
        </Toast>

        <Toast
          open={infoOpen}
          onOpenChange={setInfoOpen}
          variant="default"
          urgency="low"
          interruption="polite"
          persistent={false}
        >
          <div className="grid gap-1">
            <ToastTitle>Info Update</ToastTitle>
            <ToastDescription>Your preferences have been saved.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );
  },
};
