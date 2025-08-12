/**
 * Progress Accessibility - AI Training
 *
 * WCAG AAA compliance and accessibility demonstrations for progress indicators.
 * This trains AI agents on accessible progress patterns and assistive technology support.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import { Progress, ProgressStep } from '../../../components/Progress';

const meta = {
  title: 'Components/Progress/Accessibility',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Training: WCAG AAA compliance demonstrations for progress indicators including screen reader support, keyboard navigation, and assistive technology patterns.',
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Screen reader support with proper ARIA progress attributes.
 * AI should ensure progress is announced appropriately to screen readers.
 */
export const ScreenReaderSupport: Story = {
  render: () => {
    const [progresses, setProgresses] = useState<
      Array<{
        id: number;
        type: 'determinate' | 'indeterminate';
        value: number;
        label: string;
        description: string;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const startProgress = (
      type: 'determinate' | 'indeterminate',
      label: string,
      description: string
    ) => {
      const progress = {
        id: nextId,
        type,
        value: type === 'indeterminate' ? 0 : Math.floor(Math.random() * 80) + 10,
        label,
        description,
      };
      setProgresses((prev) => [...prev, progress]);
      setNextId((prev) => prev + 1);

      if (type === 'determinate') {
        const interval = setInterval(() => {
          setProgresses((prev) =>
            prev.map((p) => {
              if (p.id !== progress.id) return p;
              const newValue = Math.min(100, p.value + Math.floor(Math.random() * 5) + 1);
              if (newValue >= 100) clearInterval(interval);
              return { ...p, value: newValue };
            })
          );
        }, 500);
      }

      // Auto-remove after demonstration
      setTimeout(() => {
        setProgresses((prev) => prev.filter((p) => p.id !== progress.id));
      }, 10000);
    };

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Screen Reader Accessibility:</strong>
          </p>
          <p>• Progress elements use proper ARIA attributes</p>
          <p>• aria-valuenow, aria-valuemin, aria-valuemax for determinate progress</p>
          <p>• aria-label and aria-describedby for context</p>
          <p>• Screen readers announce progress updates automatically</p>
          <p>• Use screen reader to test announcement patterns</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              startProgress(
                'determinate',
                'File upload',
                'Uploading presentation.pptx to cloud storage'
              )
            }
          >
            Determinate Progress
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              startProgress(
                'indeterminate',
                'Processing data',
                'Analyzing customer records for insights'
              )
            }
          >
            Indeterminate Progress
          </Button>
        </div>

        <div className="space-y-4">
          {progresses.map((progress) => (
            <Progress
              key={progress.id}
              value={progress.type === 'indeterminate' ? undefined : progress.value}
              pattern={progress.type === 'indeterminate' ? 'pulsing' : 'linear'}
              showPercentage={progress.type === 'determinate'}
              showDescription
              complexity="detailed"
              label={progress.label}
              description={progress.description}
              // Enhanced ARIA attributes for screen readers
              aria-label={`${progress.label} progress`}
              aria-describedby={`progress-desc-${progress.id}`}
              // Additional context for screen readers
              role="progressbar"
              aria-live="polite"
              aria-atomic="false"
            />
          ))}
        </div>

        <div className="text-sm text-muted-foreground border-l-2 border-muted pl-4">
          <p>
            <strong>ARIA Implementation:</strong>
          </p>
          <p>• role="progressbar" identifies the progress element</p>
          <p>• aria-valuenow={'{current}'} provides current progress value</p>
          <p>• aria-valuemin="0" and aria-valuemax="100" set bounds</p>
          <p>• aria-label provides accessible name for the progress</p>
          <p>• aria-describedby links to detailed description</p>
        </div>
      </div>
    );
  },
};

/**
 * Keyboard navigation and focus management for progress controls.
 * AI should ensure all progress actions are keyboard accessible.
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const [progresses, setProgresses] = useState<
      Array<{
        id: number;
        value: number;
        paused: boolean;
        cancelled: boolean;
        label: string;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const startOperation = (label: string) => {
      const operation = {
        id: nextId,
        value: 0,
        paused: false,
        cancelled: false,
        label,
      };
      setProgresses((prev) => [...prev, operation]);
      setNextId((prev) => prev + 1);

      const interval = setInterval(() => {
        setProgresses((prev) =>
          prev.map((p) => {
            if (p.id !== operation.id || p.paused || p.cancelled) return p;
            const newValue = Math.min(100, p.value + 2);
            if (newValue >= 100) clearInterval(interval);
            return { ...p, value: newValue };
          })
        );
      }, 300);
    };

    const pauseProgress = (id: number) => {
      setProgresses((prev) => prev.map((p) => (p.id === id ? { ...p, paused: !p.paused } : p)));
    };

    const cancelProgress = (id: number) => {
      setProgresses((prev) => prev.filter((p) => p.id !== id));
    };

    const handleKeyDown = (event: React.KeyboardEvent, id: number, action: 'pause' | 'cancel') => {
      // Handle keyboard activation
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (action === 'pause') {
          pauseProgress(id);
        } else {
          cancelProgress(id);
        }
      }
      // Handle escape key for quick cancel
      if (event.key === 'Escape' && action === 'cancel') {
        cancelProgress(id);
      }
    };

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Keyboard Navigation:</strong>
          </p>
          <p>• Tab to navigate between progress controls</p>
          <p>• Enter or Space to activate pause/cancel buttons</p>
          <p>• Escape key for quick cancel on focused progress</p>
          <p>• Focus management preserves user context</p>
          <p>• Visual focus indicators meet WCAG contrast requirements</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => startOperation('Large file upload')}>
            Start Upload
          </Button>
          <Button variant="outline" onClick={() => startOperation('Data processing')}>
            Start Processing
          </Button>
        </div>

        <div className="space-y-4">
          {progresses.map((progress) => (
            <div key={progress.id} className="space-y-2">
              <Progress
                value={progress.value}
                showPercentage
                showTime
                complexity="detailed"
                label={progress.label}
                description={
                  progress.paused ? 'Paused' : progress.cancelled ? 'Cancelled' : 'In progress'
                }
                pausable
                cancellable
                // Keyboard-accessible pause handler
                onPause={() => pauseProgress(progress.id)}
                onCancel={() => cancelProgress(progress.id)}
                estimatedTime={30000}
              />

              {/* Keyboard-accessible control buttons with proper focus management */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => pauseProgress(progress.id)}
                  onKeyDown={(e) => handleKeyDown(e, progress.id, 'pause')}
                  className="px-3 py-1 text-sm rounded border border-border bg-background 
                           hover:bg-accent hover:text-accent-foreground
                           focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                           disabled:opacity-50 disabled:pointer-events-none"
                  disabled={progress.cancelled || progress.value >= 100}
                  aria-label={`${progress.paused ? 'Resume' : 'Pause'} ${progress.label}`}
                >
                  {progress.paused ? 'Resume' : 'Pause'}
                </button>

                <button
                  type="button"
                  onClick={() => cancelProgress(progress.id)}
                  onKeyDown={(e) => handleKeyDown(e, progress.id, 'cancel')}
                  className="px-3 py-1 text-sm rounded border border-border bg-background 
                           hover:bg-destructive hover:text-destructive-foreground
                           focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  disabled={progress.cancelled || progress.value >= 100}
                  aria-label={`Cancel ${progress.label}`}
                >
                  Cancel
                </button>
              </div>

              <div className="text-xs text-muted-foreground">
                Status:{' '}
                {progress.paused
                  ? 'Paused (press Enter to resume)'
                  : progress.cancelled
                    ? 'Cancelled'
                    : progress.value >= 100
                      ? 'Complete'
                      : 'Running (press Tab to access controls)'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * High contrast mode and visual accessibility compliance.
 * AI should ensure progress remains usable in high contrast environments.
 */
export const HighContrastMode: Story = {
  render: () => {
    const [highContrast, setHighContrast] = useState(false);
    const [progresses, setProgresses] = useState<
      Array<{
        id: number;
        status: 'default' | 'success' | 'warning' | 'error';
        value: number;
        label: string;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const addProgress = (status: 'default' | 'success' | 'warning' | 'error') => {
      const progress = {
        id: nextId,
        status,
        value: status === 'success' ? 100 : Math.floor(Math.random() * 80) + 10,
        label: `${status.charAt(0).toUpperCase() + status.slice(1)} Progress`,
      };
      setProgresses((prev) => [...prev, progress]);
      setNextId((prev) => prev + 1);

      setTimeout(() => {
        setProgresses((prev) => prev.filter((p) => p.id !== progress.id));
      }, 6000);
    };

    return (
      <div className={`w-full max-w-2xl space-y-6 ${highContrast ? 'high-contrast-mode' : ''}`}>
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>High Contrast Accessibility:</strong>
          </p>
          <p>• Enhanced borders and outlines for better definition</p>
          <p>• Maximum contrast ratios for text and backgrounds</p>
          <p>• Clear visual hierarchies that work in high contrast</p>
          <p>• Robust focus indicators with strong contrast</p>
          <p>• Text alternatives to color-only information</p>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <Button variant="outline" onClick={() => setHighContrast(!highContrast)}>
            {highContrast ? 'Normal Contrast' : 'High Contrast Mode'}
          </Button>
          <Button variant="outline" onClick={() => addProgress('default')}>
            Default
          </Button>
          <Button variant="success" onClick={() => addProgress('success')}>
            Success
          </Button>
          <Button variant="warning" onClick={() => addProgress('warning')}>
            Warning
          </Button>
          <Button variant="destructive" onClick={() => addProgress('error')}>
            Error
          </Button>
        </div>

        <div className="space-y-4">
          {progresses.map((progress) => (
            <Progress
              key={progress.id}
              value={progress.value}
              status={progress.status}
              showPercentage
              showDescription
              complexity="detailed"
              label={progress.label}
              description={`High contrast testing for ${progress.status} state`}
              className={`
                ${highContrast ? 'ring-2 ring-current ring-offset-2 ring-offset-background' : ''}
              `}
              // Enhanced contrast styling
              style={
                highContrast
                  ? ({
                      '--progress-bg': 'var(--background)',
                      '--progress-border': '2px solid currentColor',
                      '--progress-text': 'var(--foreground)',
                    } as React.CSSProperties)
                  : undefined
              }
            />
          ))}
        </div>

        <style>{`
          .high-contrast-mode {
            --contrast-multiplier: 2;
          }
          .high-contrast-mode .progress {
            border: 2px solid currentColor;
            outline: 2px solid transparent;
            outline-offset: 2px;
          }
          .high-contrast-mode .progress:focus-within {
            outline-color: currentColor;
          }
          .high-contrast-mode button {
            border: 2px solid currentColor;
            background: var(--background);
            color: var(--foreground);
          }
          .high-contrast-mode button:focus {
            outline: 3px solid currentColor;
            outline-offset: 2px;
          }
        `}</style>
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
    const [motionPreference, setMotionPreference] = useState<'normal' | 'reduced'>('normal');
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
      // Apply motion preference to document
      if (motionPreference === 'reduced') {
        document.documentElement.style.setProperty('--motion-duration', '0.01s');
        document.documentElement.style.setProperty('--motion-scale', '1');
      } else {
        document.documentElement.style.removeProperty('--motion-duration');
        document.documentElement.style.removeProperty('--motion-scale');
      }
    }, [motionPreference]);

    const startDemo = () => {
      setProgress(0);
      setIsRunning(true);

      const interval = setInterval(() => {
        setProgress((prev) => {
          const newValue = prev + 3;
          if (newValue >= 100) {
            clearInterval(interval);
            setIsRunning(false);
          }
          return Math.min(100, newValue);
        });
      }, 200);
    };

    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Motion Accessibility:</strong>
          </p>
          <p>• Respects prefers-reduced-motion system settings</p>
          <p>• Provides instant state changes option</p>
          <p>• Maintains full functionality without animations</p>
          <p>• Users can toggle motion preference manually</p>
          <p>• Essential animations (progress) can continue with reduced intensity</p>
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
          <Button variant="outline" onClick={startDemo} disabled={isRunning}>
            Start Demo
          </Button>
        </div>

        <div className="space-y-4">
          <Progress
            value={progress}
            pattern={motionPreference === 'reduced' ? 'linear' : 'accelerating'}
            showPercentage
            showTime
            showDescription
            complexity="detailed"
            label="Motion-Aware Progress"
            description={`Respecting ${motionPreference} motion preference`}
            estimatedTime={15000}
            // Motion-sensitive styling
            className={`
              ${motionPreference === 'reduced' ? 'motion-reduce' : ''}
            `}
            style={{
              // Override animations for reduced motion
              animationDuration: motionPreference === 'reduced' ? '0.01s' : undefined,
              transitionDuration: motionPreference === 'reduced' ? '0.01s' : undefined,
            }}
          />

          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Current Setting:</strong> {motionPreference} motion
            </p>
            {motionPreference === 'reduced' && <p>• Animations disabled for accessibility</p>}
            {motionPreference === 'normal' && <p>• Full animations enabled</p>}
          </div>
        </div>

        <style>{`
          /* Respect system motion preferences */
          @media (prefers-reduced-motion: reduce) {
            .motion-reduce * {
              animation-duration: 0.01s !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01s !important;
              scroll-behavior: auto !important;
            }
          }
          
          /* Manual reduced motion class */
          .motion-reduce {
            --motion-duration: 0.01s;
          }
          
          .motion-reduce * {
            animation-duration: var(--motion-duration) !important;
            transition-duration: var(--motion-duration) !important;
          }
        `}</style>
      </div>
    );
  },
};

/**
 * Color blind and visual accessibility support.
 * AI should ensure progress is understandable without relying solely on color.
 */
export const ColorBlindSupport: Story = {
  render: () => {
    const [colorBlindMode, setColorBlindMode] = useState<
      'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
    >('none');
    const [progresses, setProgresses] = useState<
      Array<{
        id: number;
        status: 'default' | 'success' | 'warning' | 'error';
        value: number;
        label: string;
      }>
    >([]);
    const [nextId, setNextId] = useState(1);

    const addProgress = (
      status: 'default' | 'success' | 'warning' | 'error',
      value: number,
      label: string
    ) => {
      const progress = { id: nextId, status, value, label };
      setProgresses((prev) => [...prev, progress]);
      setNextId((prev) => prev + 1);

      setTimeout(() => {
        setProgresses((prev) => prev.filter((p) => p.id !== progress.id));
      }, 8000);
    };

    const colorBlindFilters = {
      none: 'none',
      protanopia: 'url(#protanopia)',
      deuteranopia: 'url(#deuteranopia)',
      tritanopia: 'url(#tritanopia)',
    };

    return (
      <div className="w-full max-w-2xl space-y-6">
        {/* SVG filters for color blindness simulation */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <title>Color blindness simulation filters</title>
          <defs>
            <filter id="protanopia">
              <feColorMatrix
                values="0.567 0.433 0 0 0
                                   0.558 0.442 0 0 0
                                   0 0.242 0.758 0 0
                                   0 0 0 1 0"
              />
            </filter>
            <filter id="deuteranopia">
              <feColorMatrix
                values="0.625 0.375 0 0 0
                                   0.7 0.3 0 0 0
                                   0 0.3 0.7 0 0
                                   0 0 0 1 0"
              />
            </filter>
            <filter id="tritanopia">
              <feColorMatrix
                values="0.95 0.05 0 0 0
                                   0 0.433 0.567 0 0
                                   0 0.475 0.525 0 0
                                   0 0 0 1 0"
              />
            </filter>
          </defs>
        </svg>

        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Color Blind Accessibility:</strong>
          </p>
          <p>• Progress meaning doesn't rely solely on color</p>
          <p>• Icons and text provide redundant information</p>
          <p>• High contrast ratios work across color vision types</p>
          <p>• Status patterns remain distinguishable in all modes</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setColorBlindMode(
                colorBlindMode === 'none'
                  ? 'protanopia'
                  : colorBlindMode === 'protanopia'
                    ? 'deuteranopia'
                    : colorBlindMode === 'deuteranopia'
                      ? 'tritanopia'
                      : 'none'
              )
            }
          >
            Mode: {colorBlindMode}
          </Button>
          <Button
            variant="outline"
            onClick={() => addProgress('default', 45, 'Standard Operation')}
          >
            Default
          </Button>
          <Button variant="success" onClick={() => addProgress('success', 100, 'Completed Task')}>
            Success ✓
          </Button>
          <Button variant="warning" onClick={() => addProgress('warning', 67, 'Needs Attention')}>
            Warning ⚠
          </Button>
          <Button variant="destructive" onClick={() => addProgress('error', 23, 'Failed Process')}>
            Error ✗
          </Button>
        </div>

        <div className="space-y-4" style={{ filter: colorBlindFilters[colorBlindMode] }}>
          {progresses.map((progress) => (
            <div key={progress.id} className="space-y-2">
              <Progress
                value={progress.value}
                status={progress.status}
                showPercentage
                showDescription
                complexity="detailed"
                label={progress.label}
                description={`${progress.status} state with ${progress.value}% completion`}
                // Add visual indicators beyond color
                className={`
                  ${progress.status === 'success' ? 'border-l-4 border-l-green-500' : ''}
                  ${progress.status === 'warning' ? 'border-l-4 border-l-yellow-500' : ''}
                  ${progress.status === 'error' ? 'border-l-4 border-l-red-500' : ''}
                `}
              />

              {/* Text-based status indicators */}
              <div className="flex items-center gap-2 text-sm">
                {progress.status === 'success' && (
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">✓</span>
                    <span>Complete</span>
                  </span>
                )}
                {progress.status === 'warning' && (
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">⚠</span>
                    <span>Attention Needed</span>
                  </span>
                )}
                {progress.status === 'error' && (
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">✗</span>
                    <span>Error Occurred</span>
                  </span>
                )}
                {progress.status === 'default' && (
                  <span className="flex items-center gap-1">
                    <span aria-hidden="true">▶</span>
                    <span>In Progress</span>
                  </span>
                )}
                <span className="text-muted-foreground">({progress.value}% complete)</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground border-l-2 border-muted pl-4">
          <p>
            <strong>Non-Color Indicators:</strong>
          </p>
          <p>• Icons provide visual status context (✓ ⚠ ✗)</p>
          <p>• Text labels clarify status meaning</p>
          <p>• Border patterns indicate different states</p>
          <p>• Percentage values provide objective progress data</p>
          <p>• Shape and position variations support color</p>
        </div>
      </div>
    );
  },
};
