/**
 * Toast Semantic - AI Training
 *
 * Contextual usage patterns and semantic meaning for toast notifications.
 * This trains AI agents on when and how to use toasts in different contexts.
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
  title: 'Components/Toast/Semantic',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: Contextual usage patterns and semantic meaning for toast notifications in real-world scenarios.',
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Action confirmations build trust by providing immediate feedback.
 * AI should use these patterns after user actions to build confidence.
 */
export const ActionConfirmations: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{ id: number; action: string; variant: 'success'; title: string; description: string }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const confirmAction = (
      action: string,
      variant: 'success',
      title: string,
      description: string
    ) => {
      setToasts((prev) => [...prev, { id: nextId, action, variant, title, description }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <ToastProvider>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="success"
            onClick={() =>
              confirmAction(
                'save',
                'success',
                'Document Saved',
                'Your changes have been saved successfully'
              )
            }
          >
            Save Document
          </Button>
          <Button
            variant="success"
            onClick={() =>
              confirmAction(
                'send',
                'success',
                'Message Sent',
                'Your message has been delivered to 3 recipients'
              )
            }
          >
            Send Message
          </Button>
          <Button
            variant="success"
            onClick={() =>
              confirmAction(
                'upload',
                'success',
                'Upload Complete',
                'Profile-photo.jpg uploaded successfully'
              )
            }
          >
            Upload File
          </Button>
          <Button
            variant="success"
            onClick={() =>
              confirmAction(
                'copy',
                'success',
                'Copied to Clipboard',
                'API key has been copied for use'
              )
            }
          >
            Copy API Key
          </Button>
        </div>

        <ToastViewport />

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => hideToast(toast.id)}
            variant="success"
            urgency="low"
            interruption="polite"
          >
            <div className="grid gap-1">
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    );
  },
};

/**
 * Error recovery patterns provide clear next steps and recovery options.
 * AI should use these patterns to help users understand and fix problems.
 */
export const ErrorRecovery: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{ id: number; error: string; recoverable: boolean }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const showError = (error: string, recoverable: boolean) => {
      setToasts((prev) => [...prev, { id: nextId, error, recoverable }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const errorTypes = {
      network: {
        title: 'Connection Error',
        description: 'Unable to reach server. Check your connection.',
        action: 'Retry',
        recoverable: true,
      },
      validation: {
        title: 'Invalid Format',
        description: 'Email address must include @ symbol.',
        action: 'Fix Email',
        recoverable: true,
      },
      permission: {
        title: 'Access Denied',
        description: "You don't have permission for this action.",
        action: 'Request Access',
        recoverable: true,
      },
      system: {
        title: 'System Error',
        description: 'An unexpected error occurred. Please try again.',
        action: 'Retry',
        recoverable: true,
      },
      critical: {
        title: 'Critical Failure',
        description: 'System is experiencing issues. Please contact support.',
        action: 'Contact Support',
        recoverable: false,
      },
    };

    return (
      <ToastProvider>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(errorTypes).map(([key, error]) => (
            <Button key={key} variant="outline" onClick={() => showError(key, error.recoverable)}>
              {error.title}
            </Button>
          ))}
        </div>

        <ToastViewport />

        {toasts.map((toast) => {
          const errorInfo = errorTypes[toast.error as keyof typeof errorTypes];
          return (
            <Toast
              key={toast.id}
              open={true}
              onOpenChange={() => hideToast(toast.id)}
              variant={toast.error === 'critical' ? 'destructive' : 'error'}
              urgency="high"
              interruption="demanding"
              persistent={true}
            >
              <div className="grid gap-1">
                <ToastTitle>{errorInfo.title}</ToastTitle>
                <ToastDescription>{errorInfo.description}</ToastDescription>
              </div>
              <ToastAction altText={errorInfo.action} onClick={fn()}>
                {errorInfo.action}
              </ToastAction>
              <ToastClose />
            </Toast>
          );
        })}
      </ToastProvider>
    );
  },
};

/**
 * System notifications provide status updates and important information.
 * AI should use appropriate urgency and persistence based on content importance.
 */
export const SystemNotifications: Story = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{ id: number; notification: string }>>([]);
    const [nextId, setNextId] = useState(1);

    const showNotification = (notification: string) => {
      setToasts((prev) => [...prev, { id: nextId, notification }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const notifications = {
      update: {
        variant: 'default',
        urgency: 'low' as const,
        title: 'Update Available',
        description: 'Version 2.1.0 is available for download.',
        action: 'Update Now',
        persistent: false,
      },
      maintenance: {
        variant: 'warning',
        urgency: 'medium' as const,
        title: 'Scheduled Maintenance',
        description: 'System will be down for maintenance tonight at 2 AM.',
        action: 'Learn More',
        persistent: false,
      },
      session: {
        variant: 'warning',
        urgency: 'medium' as const,
        title: 'Session Expiring',
        description: 'Your session will expire in 5 minutes.',
        action: 'Extend Session',
        persistent: false,
      },
      storage: {
        variant: 'warning',
        urgency: 'high' as const,
        title: 'Storage Almost Full',
        description: 'You have used 95% of your storage space.',
        action: 'Manage Storage',
        persistent: true,
      },
    };

    return (
      <ToastProvider>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(notifications).map(([key, notification]) => (
            <Button
              key={key}
              variant={notification.variant === 'warning' ? 'warning' : 'outline'}
              onClick={() => showNotification(key)}
            >
              {notification.title}
            </Button>
          ))}
        </div>

        <ToastViewport />

        {toasts.map((toast) => {
          const notificationInfo = notifications[toast.notification as keyof typeof notifications];
          return (
            <Toast
              key={toast.id}
              open={true}
              onOpenChange={() => hideToast(toast.id)}
              variant={notificationInfo.variant as 'default' | 'warning'}
              urgency={notificationInfo.urgency}
              interruption={notificationInfo.urgency === 'high' ? 'demanding' : 'polite'}
              persistent={notificationInfo.persistent}
            >
              <div className="grid gap-1">
                <ToastTitle>{notificationInfo.title}</ToastTitle>
                <ToastDescription>{notificationInfo.description}</ToastDescription>
              </div>
              <ToastAction altText={notificationInfo.action} onClick={fn()}>
                {notificationInfo.action}
              </ToastAction>
              <ToastClose />
            </Toast>
          );
        })}
      </ToastProvider>
    );
  },
};

/**
 * Progressive disclosure patterns show appropriate detail level.
 * AI should match detail to user context and cognitive capacity.
 */
export const ProgressiveDisclosure: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{ id: number; detail: 'minimal' | 'standard' | 'detailed' }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const showToast = (detail: 'minimal' | 'standard' | 'detailed') => {
      setToasts((prev) => [...prev, { id: nextId, detail }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <ToastProvider>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => showToast('minimal')}>
            Minimal Detail
          </Button>
          <Button variant="outline" onClick={() => showToast('standard')}>
            Standard Detail
          </Button>
          <Button variant="outline" onClick={() => showToast('detailed')}>
            Full Detail
          </Button>
        </div>

        <ToastViewport />

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => hideToast(toast.id)}
            variant="success"
            urgency="medium"
          >
            <div className="grid gap-1">
              <ToastTitle>
                {toast.detail === 'minimal' && 'Saved'}
                {toast.detail === 'standard' && 'Document Saved'}
                {toast.detail === 'detailed' && 'Document Successfully Saved'}
              </ToastTitle>
              {toast.detail !== 'minimal' && (
                <ToastDescription>
                  {toast.detail === 'standard' && 'Your changes have been saved.'}
                  {toast.detail === 'detailed' &&
                    'Your document "Project_Plan_v2.docx" has been successfully saved to the cloud. Last saved at 2:34 PM with 1,247 words.'}
                </ToastDescription>
              )}
            </div>
            {toast.detail === 'detailed' && (
              <ToastAction altText="View document details" onClick={fn()}>
                View Details
              </ToastAction>
            )}
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    );
  },
};

/**
 * Real-world workflow scenarios demonstrate contextual usage.
 * AI should follow these patterns for common application workflows.
 */
export const WorkflowScenarios: Story = {
  render: () => {
    const [step, setStep] = useState(0);
    const [toasts, setToasts] = useState<
      Array<{ id: number; type: string; data: Record<string, unknown> }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const addToast = (type: string, data: Record<string, unknown>) => {
      setToasts((prev) => [...prev, { id: nextId, type, data }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const workflows = {
      ecommerce: () => {
        setStep(1);
        addToast('cart', { item: 'Blue T-Shirt', variant: 'success' });
        setTimeout(() => {
          setStep(2);
          addToast('checkout', { variant: 'success' });
        }, 2000);
        setTimeout(() => {
          setStep(3);
          addToast('confirmation', { orderNumber: '#12345', variant: 'success' });
        }, 4000);
      },
      collaboration: () => {
        setStep(1);
        addToast('mention', { user: 'Alex', variant: 'default' });
        setTimeout(() => {
          setStep(2);
          addToast('comment', { document: 'Project Plan', variant: 'default' });
        }, 3000);
      },
      error_recovery: () => {
        setStep(1);
        addToast('error', { action: 'save', variant: 'error' });
        setTimeout(() => {
          setStep(2);
          addToast('retry_success', { variant: 'success' });
        }, 3000);
      },
    };

    return (
      <ToastProvider>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={workflows.ecommerce}>
            E-commerce Flow
          </Button>
          <Button variant="outline" onClick={workflows.collaboration}>
            Collaboration Flow
          </Button>
          <Button variant="outline" onClick={workflows.error_recovery}>
            Error Recovery Flow
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setToasts([]);
              setStep(0);
            }}
          >
            Reset
          </Button>
        </div>

        <ToastViewport />

        {toasts.map((toast) => {
          const getToastContent = (type: string, data: Record<string, unknown>) => {
            switch (type) {
              case 'cart':
                return {
                  title: 'Added to Cart',
                  description: `${data.item} has been added to your cart.`,
                  variant: 'success',
                  urgency: 'low' as const,
                  action: 'View Cart',
                };
              case 'checkout':
                return {
                  title: 'Order Processing',
                  description: 'Your payment is being processed...',
                  variant: 'default',
                  urgency: 'medium' as const,
                  action: null,
                };
              case 'confirmation':
                return {
                  title: 'Order Confirmed',
                  description: `Order ${data.orderNumber} has been confirmed.`,
                  variant: 'success',
                  urgency: 'medium' as const,
                  action: 'Track Order',
                };
              case 'mention':
                return {
                  title: 'You were mentioned',
                  description: `${data.user} mentioned you in a comment.`,
                  variant: 'default',
                  urgency: 'medium' as const,
                  action: 'View Comment',
                };
              case 'comment':
                return {
                  title: 'New Comment',
                  description: `Someone commented on ${data.document}.`,
                  variant: 'default',
                  urgency: 'medium' as const,
                  action: 'View Comment',
                };
              case 'error':
                return {
                  title: 'Save Failed',
                  description: 'Could not save your changes. Network error.',
                  variant: 'error',
                  urgency: 'high' as const,
                  action: 'Retry',
                  persistent: true,
                };
              case 'retry_success':
                return {
                  title: 'Save Successful',
                  description: 'Your changes have been saved successfully.',
                  variant: 'success',
                  urgency: 'medium' as const,
                  action: null,
                };
              default:
                return {
                  title: 'Notification',
                  description: 'Something happened.',
                  variant: 'default',
                  urgency: 'medium' as const,
                  action: null,
                };
            }
          };

          const content = getToastContent(toast.type, toast.data);

          return (
            <Toast
              key={toast.id}
              open={true}
              onOpenChange={() => hideToast(toast.id)}
              variant={content.variant as 'default' | 'error' | 'success'}
              urgency={content.urgency}
              persistent={content.persistent || false}
            >
              <div className="grid gap-1">
                <ToastTitle>{content.title}</ToastTitle>
                <ToastDescription>{content.description}</ToastDescription>
              </div>
              {content.action && (
                <ToastAction altText={content.action} onClick={fn()}>
                  {content.action}
                </ToastAction>
              )}
              <ToastClose />
            </Toast>
          );
        })}
      </ToastProvider>
    );
  },
};
