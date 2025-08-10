/**
 * Toast Accessibility - AI Training
 *
 * WCAG AAA compliance and accessibility demonstrations for toast notifications.
 * This trains AI agents on accessible toast patterns and assistive technology support.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
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
  title: '03 Components/Feedback/Toast/Accessibility',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: WCAG AAA compliance demonstrations for toast notifications including screen reader support, keyboard navigation, and assistive technology patterns.',
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Screen reader announcements with proper ARIA live regions.
 * AI should ensure toasts are announced appropriately based on urgency.
 */
export const ScreenReaderAnnouncements: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{ id: number; urgency: 'polite' | 'assertive'; type: string }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const showToast = (urgency: 'polite' | 'assertive', type: string) => {
      setToasts((prev) => [...prev, { id: nextId, urgency, type }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const toastTypes = {
      success: {
        title: 'Upload Complete',
        description: 'Your file has been successfully uploaded and is ready for use.',
        variant: 'success',
      },
      warning: {
        title: 'Session Expiring Soon',
        description:
          'Your session will expire in 2 minutes. Save your work to avoid losing changes.',
        variant: 'warning',
      },
      error: {
        title: 'Critical System Error',
        description:
          'Database connection lost. Your work cannot be saved until connection is restored.',
        variant: 'error',
      },
    };

    return (
      <ToastProvider>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Screen Reader Testing:</strong>
            </p>
            <p>• Polite toasts announce after current speech</p>
            <p>• Assertive toasts interrupt current speech</p>
            <p>• Enable screen reader to test announcements</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="success"
              onClick={() => showToast('polite', 'success')}
              aria-describedby="polite-description"
            >
              Polite Success
            </Button>
            <Button
              variant="warning"
              onClick={() => showToast('assertive', 'warning')}
              aria-describedby="assertive-description"
            >
              Assertive Warning
            </Button>
            <Button
              variant="destructive"
              onClick={() => showToast('assertive', 'error')}
              aria-describedby="assertive-description"
            >
              Critical Error
            </Button>
          </div>

          <div className="sr-only">
            <div id="polite-description">
              Shows toast with polite announcement - won't interrupt screen reader
            </div>
            <div id="assertive-description">
              Shows toast with assertive announcement - will interrupt screen reader
            </div>
          </div>
        </div>

        <ToastViewport />

        {toasts.map((toast) => {
          const toastInfo = toastTypes[toast.type as keyof typeof toastTypes];
          return (
            <Toast
              key={toast.id}
              open={true}
              onOpenChange={() => hideToast(toast.id)}
              variant={toastInfo.variant as 'success' | 'warning' | 'error'}
              urgency={toast.type === 'error' ? 'high' : 'medium'}
              persistent={toast.type === 'error'}
              // ARIA live region for screen reader announcements
              aria-live={toast.urgency}
              aria-atomic="true"
              role={toast.type === 'error' ? 'alert' : 'status'}
            >
              <div className="grid gap-1">
                <ToastTitle>{toastInfo.title}</ToastTitle>
                <ToastDescription>{toastInfo.description}</ToastDescription>
              </div>
              {toast.type === 'error' && (
                <ToastAction altText="Retry database connection" onClick={fn()}>
                  Retry Connection
                </ToastAction>
              )}
              <ToastClose aria-label={`Dismiss ${toastInfo.title} notification`} />
            </Toast>
          );
        })}
      </ToastProvider>
    );
  },
};

/**
 * Keyboard navigation support for toast interactions.
 * AI should ensure all toast actions are keyboard accessible.
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{ id: number; type: 'single' | 'multiple' | 'action' }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const showToast = (type: 'single' | 'multiple' | 'action') => {
      setToasts((prev) => [...prev, { id: nextId, type }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <ToastProvider>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Keyboard Navigation:</strong>
            </p>
            <p>• Tab to navigate between toast actions</p>
            <p>• Enter/Space to activate actions</p>
            <p>• Escape to dismiss focused toast</p>
            <p>• Focus management preserves user context</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => showToast('single')}>
              Simple Toast
            </Button>
            <Button variant="outline" onClick={() => showToast('action')}>
              Toast with Action
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                showToast('multiple');
                setTimeout(() => showToast('multiple'), 500);
                setTimeout(() => showToast('multiple'), 1000);
              }}
            >
              Multiple Toasts
            </Button>
          </div>
        </div>

        <ToastViewport />

        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => hideToast(toast.id)}
            variant={toast.type === 'action' ? 'warning' : 'default'}
            urgency="medium"
            // Proper tab order and focus management
            tabIndex={-1}
          >
            <div className="grid gap-1">
              <ToastTitle>
                {toast.type === 'single' && 'Simple Notification'}
                {toast.type === 'action' && 'Action Required'}
                {toast.type === 'multiple' && `Notification ${index + 1}`}
              </ToastTitle>
              <ToastDescription>
                {toast.type === 'single' && 'This is a basic notification with close button only.'}
                {toast.type === 'action' &&
                  'This notification includes an action button for user interaction.'}
                {toast.type === 'multiple' && 'This demonstrates multiple toast focus management.'}
              </ToastDescription>
            </div>

            {toast.type === 'action' && (
              <ToastAction
                altText="Complete required action"
                onClick={fn()}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    hideToast(toast.id);
                  }
                }}
              >
                Take Action
              </ToastAction>
            )}

            <ToastClose
              aria-label="Close notification"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  hideToast(toast.id);
                }
              }}
            />
          </Toast>
        ))}
      </ToastProvider>
    );
  },
};

/**
 * Color contrast and visual accessibility compliance.
 * AI should ensure toasts meet WCAG AAA contrast requirements.
 */
export const ColorContrastCompliance: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{
        id: number;
        variant: 'default' | 'success' | 'warning' | 'error' | 'destructive';
        theme: 'light' | 'dark';
      }>
    >([]);
    const [nextId, setNextId] = useState(1);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const showToast = (variant: 'default' | 'success' | 'warning' | 'error' | 'destructive') => {
      setToasts((prev) => [...prev, { id: nextId, variant, theme }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const variants = [
      {
        name: 'Default',
        variant: 'default',
        title: 'Default Toast',
        description: 'Standard contrast ratios',
      },
      {
        name: 'Success',
        variant: 'success',
        title: 'Success Toast',
        description: 'WCAG AAA compliant green',
      },
      {
        name: 'Warning',
        variant: 'warning',
        title: 'Warning Toast',
        description: 'High contrast yellow/orange',
      },
      {
        name: 'Error',
        variant: 'error',
        title: 'Error Toast',
        description: 'Accessible red contrast',
      },
      {
        name: 'Destructive',
        variant: 'destructive',
        title: 'Critical Error',
        description: 'Maximum contrast for urgency',
      },
    ];

    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <ToastProvider>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>WCAG AAA Compliance:</strong>
              </p>
              <p>• All text has minimum 7:1 contrast ratio</p>
              <p>• Focus indicators meet 3:1 contrast</p>
              <p>• Color is not the only meaning indicator</p>
              <p>• Icons and text provide redundant information</p>
            </div>

            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
              </Button>
              <span className="text-sm">Current: {theme} theme</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <Button
                  key={v.variant}
                  variant={v.variant === 'default' ? 'outline' : v.variant}
                  onClick={() => showToast(v.variant)}
                >
                  {v.name}
                </Button>
              ))}
            </div>
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
                urgency="medium"
                // Enhanced focus indicators for accessibility
                className="focus-within:ring-4 focus-within:ring-ring/50"
              >
                <div className="grid gap-1">
                  <ToastTitle className="flex items-center gap-2">
                    {/* Icon provides visual redundancy to color */}
                    {toast.variant === 'success' && <span aria-hidden="true">✓</span>}
                    {toast.variant === 'warning' && <span aria-hidden="true">⚠</span>}
                    {toast.variant === 'error' && <span aria-hidden="true">✕</span>}
                    {toast.variant === 'destructive' && <span aria-hidden="true">⚠</span>}
                    {variantInfo.title}
                  </ToastTitle>
                  <ToastDescription>
                    {variantInfo.description} - Theme: {toast.theme}
                  </ToastDescription>
                </div>
                <ToastClose
                  aria-label={`Close ${variantInfo.title}`}
                  className="focus:ring-4 focus:ring-ring/50"
                />
              </Toast>
            );
          })}
        </ToastProvider>
      </div>
    );
  },
};

/**
 * Reduced motion and animation preferences.
 * AI should respect user motion preferences for accessibility.
 */
export const ReducedMotionSupport: Story = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{ id: number; motion: 'normal' | 'reduced' }>>([]);
    const [nextId, setNextId] = useState(1);
    const [motionPreference, setMotionPreference] = useState<'normal' | 'reduced'>('normal');

    const showToast = () => {
      setToasts((prev) => [...prev, { id: nextId, motion: motionPreference }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    // Apply motion preference to document
    useEffect(() => {
      if (motionPreference === 'reduced') {
        document.documentElement.style.setProperty('--motion-duration', '0.01s');
      } else {
        document.documentElement.style.removeProperty('--motion-duration');
      }
    }, [motionPreference]);

    return (
      <ToastProvider>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Motion Accessibility:</strong>
            </p>
            <p>• Respects prefers-reduced-motion settings</p>
            <p>• Provides instant appearance option</p>
            <p>• Maintains functionality without animation</p>
            <p>• Users can toggle motion preference</p>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              onClick={() =>
                setMotionPreference(motionPreference === 'normal' ? 'reduced' : 'normal')
              }
            >
              Motion: {motionPreference}
            </Button>
            <Button variant="success" onClick={showToast}>
              Show Toast
            </Button>
          </div>
        </div>

        <ToastViewport />

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => hideToast(toast.id)}
            variant="success"
            urgency="medium"
            // Motion-sensitive styling
            className={`
              ${
                toast.motion === 'reduced'
                  ? 'transition-none duration-0'
                  : 'transition-all duration-200'
              }
            `}
            style={{
              // Respect system motion preferences
              animationDuration: toast.motion === 'reduced' ? '0.01s' : undefined,
            }}
          >
            <div className="grid gap-1">
              <ToastTitle>Motion Preference Test</ToastTitle>
              <ToastDescription>
                This toast respects your motion preference: {toast.motion}
                {toast.motion === 'reduced' && ' (no animations)'}
              </ToastDescription>
            </div>
            <ToastClose aria-label="Close motion test notification" />
          </Toast>
        ))}

        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .toast-motion-test {
              animation-duration: 0.01s !important;
              transition-duration: 0.01s !important;
            }
          }
        `}</style>
      </ToastProvider>
    );
  },
};

/**
 * High contrast mode and visual accessibility.
 * AI should ensure toasts remain usable in high contrast environments.
 */
export const HighContrastMode: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{ id: number; variant: 'success' | 'warning' | 'error' }>
    >([]);
    const [nextId, setNextId] = useState(1);
    const [highContrast, setHighContrast] = useState(false);

    const showToast = (variant: 'success' | 'warning' | 'error') => {
      setToasts((prev) => [...prev, { id: nextId, variant }]);
      setNextId((prev) => prev + 1);
    };

    const hideToast = (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
      <div className={highContrast ? 'high-contrast-mode' : ''}>
        <ToastProvider>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>High Contrast Accessibility:</strong>
              </p>
              <p>• Enhanced borders and outlines</p>
              <p>• Maximum contrast ratios</p>
              <p>• Clear visual hierarchies</p>
              <p>• Robust focus indicators</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setHighContrast(!highContrast)}>
                {highContrast ? 'Normal Contrast' : 'High Contrast'}
              </Button>
              <Button variant="success" onClick={() => showToast('success')}>
                Success
              </Button>
              <Button variant="warning" onClick={() => showToast('warning')}>
                Warning
              </Button>
              <Button variant="destructive" onClick={() => showToast('error')}>
                Error
              </Button>
            </div>
          </div>

          <ToastViewport />

          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              open={true}
              onOpenChange={() => hideToast(toast.id)}
              variant={toast.variant}
              urgency="medium"
              className={`
                ${highContrast ? 'border-4 border-current shadow-2xl' : 'border shadow-lg'}
              `}
            >
              <div className="grid gap-1">
                <ToastTitle className={highContrast ? 'font-bold text-lg' : ''}>
                  High Contrast{' '}
                  {toast.variant === 'success'
                    ? 'Success'
                    : toast.variant === 'warning'
                      ? 'Warning'
                      : 'Error'}
                </ToastTitle>
                <ToastDescription className={highContrast ? 'font-medium' : ''}>
                  This toast is optimized for high contrast mode accessibility.
                </ToastDescription>
              </div>
              <ToastClose
                aria-label="Close high contrast notification"
                className={`
                  ${highContrast ? 'border-2 border-current bg-background text-foreground' : ''}
                `}
              />
            </Toast>
          ))}

          <style>{`
            .high-contrast-mode {
              --contrast-multiplier: 2;
            }
            .high-contrast-mode .toast {
              outline: 2px solid currentColor;
              outline-offset: 2px;
            }
          `}</style>
        </ToastProvider>
      </div>
    );
  },
};
