// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { cn } from '../../../lib/utils';

/**
 * Motion Accessibility Testing
 * Ensures WCAG AAA compliance and respects user motion preferences
 */
const meta = {
  title: 'Foundation/Motion/Accessibility',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Motion accessibility compliance testing with reduced motion support and vestibular safety.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Reduced motion support demonstration
 */
export const ReducedMotionSupport: Story = {
  render: () => {
    const [isAnimating, setIsAnimating] = useState(false);

    return (
      <div className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <h3>Reduced Motion Support</h3>
          <p>
            All motion tokens automatically respect <code>prefers-reduced-motion</code> user
            preferences. To test: Enable "Reduce motion" in your system accessibility settings.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h4 className="font-medium">Motion-Safe Animation</h4>
          <p className="text-sm text-muted-foreground">
            This animation will be disabled when reduce motion is enabled, but still provides visual
            feedback through other means.
          </p>

          <div className="flex justify-center py-6">
            <Button
              variant="primary"
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 1000);
              }}
              className={cn(
                // Motion-safe classes that respect prefers-reduced-motion
                'motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-in-out',
                'motion-safe:hover:scale-105 motion-safe:active:scale-95',
                // Reduced motion fallback - still provides feedback
                'motion-reduce:transition-colors motion-reduce:duration-150',
                isAnimating && 'motion-safe:animate-pulse bg-success text-success-foreground'
              )}
            >
              {isAnimating ? 'Animated!' : 'Test Motion-Safe Animation'}
            </Button>
          </div>

          <div className="text-xs font-mono bg-muted/50 p-3 rounded space-y-1">
            <div>
              With Motion: <code>transition-all duration-300 hover:scale-105</code>
            </div>
            <div>
              Reduced Motion: <code>transition-colors duration-150</code>
            </div>
            <div>
              Classes: <code>motion-safe: motion-reduce:</code>
            </div>
          </div>
        </Card>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how motion tokens respect prefers-reduced-motion settings for accessibility compliance.',
      },
    },
  },
};

/**
 * Vestibular disorder safety demonstration
 */
export const VestibularSafety: Story = {
  render: () => {
    const [safeAnimation, setSafeAnimation] = useState(false);
    const [unsafeAnimation, setUnsafeAnimation] = useState(false);

    return (
      <div className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <h3>Vestibular Disorder Safety</h3>
          <p>
            Motion should avoid patterns that trigger vestibular disorders: excessive rotation,
            scaling, parallax, or rapid movement across large portions of the screen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Safe Animation */}
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-success">✓ Safe Motion</h4>
              <p className="text-sm text-muted-foreground">
                Subtle scale, gentle opacity changes, small translations
              </p>
            </div>

            <div className="flex justify-center py-6">
              <Button
                variant="success"
                onClick={() => {
                  setSafeAnimation(true);
                  setTimeout(() => setSafeAnimation(false), 300);
                }}
                className={cn(
                  'transition-all duration-300 ease-out',
                  'hover:scale-105 focus:scale-105',
                  safeAnimation && 'scale-105 shadow-lg'
                )}
              >
                Safe Animation
              </Button>
            </div>

            <div className="text-xs font-mono bg-muted/50 p-2 rounded">
              <div>
                Transform: <code>scale-105</code> (5% scale)
              </div>
              <div>
                Duration: <code>300ms</code>
              </div>
              <div>Safe: ✓ Minimal movement</div>
            </div>
          </Card>

          {/* Unsafe Animation Warning */}
          <Card className="p-4 space-y-4 border-destructive/20">
            <div className="space-y-2">
              <h4 className="font-medium text-destructive">⚠ Potentially Unsafe</h4>
              <p className="text-sm text-muted-foreground">
                Large rotations, excessive scaling, rapid movement
              </p>
            </div>

            <div className="flex justify-center py-6">
              <Button
                variant="destructive"
                onClick={() => {
                  // Only show warning, don't actually animate unsafely
                  setUnsafeAnimation(true);
                  setTimeout(() => setUnsafeAnimation(false), 2000);
                }}
                className="transition-colors duration-200"
              >
                {unsafeAnimation ? 'Motion Disabled for Safety' : 'Would Trigger Unsafe Motion'}
              </Button>
            </div>

            <div className="text-xs font-mono bg-destructive/5 p-2 rounded">
              <div>
                Avoid: <code>rotate-180</code> (large rotation)
              </div>
              <div>
                Avoid: <code>scale-150</code> (excessive scale)
              </div>
              <div>Avoid: Rapid cross-screen movement</div>
            </div>
          </Card>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates safe vs. unsafe motion patterns for users with vestibular disorders.',
      },
    },
  },
};

/**
 * Keyboard navigation with motion
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const [focusedItem, setFocusedItem] = useState<number | null>(null);

    const items = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      label: `Item ${i + 1}`,
    }));

    return (
      <div className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <h3>Keyboard Navigation with Motion</h3>
          <p>
            Motion should enhance, not interfere with keyboard navigation. Focus indicators should
            be immediate while content motion remains smooth.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h4 className="font-medium">Focus-Enhanced Grid</h4>
          <p className="text-sm text-muted-foreground">
            Use Tab to navigate. Notice how focus indicators are immediate while hover effects are
            delayed.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {items.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                onClick={fn()}
                onFocus={() => setFocusedItem(item.id)}
                onBlur={() => setFocusedItem(null)}
                className={cn(
                  // Immediate focus response for accessibility
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  // Delayed hover motion that doesn't interfere with focus
                  'motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out',
                  'motion-safe:hover:scale-105 motion-safe:hover:shadow-md',
                  // Enhanced focus state
                  focusedItem === item.id && 'ring-2 ring-ring ring-offset-2'
                )}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="text-xs font-mono bg-muted/50 p-3 rounded space-y-1">
            <div>
              Focus: <code>ring-2 ring-ring</code> (immediate)
            </div>
            <div>
              Hover: <code>transition-all duration-200</code> (delayed)
            </div>
            <div>
              Motion: <code>motion-safe:</code> prefix respects preferences
            </div>
          </div>
        </Card>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how motion should enhance rather than interfere with keyboard navigation.',
      },
    },
  },
};

/**
 * Screen reader compatibility
 */
export const ScreenReaderCompatibility: Story = {
  render: () => {
    const [announceText, setAnnounceText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAsyncAction = async () => {
      setIsLoading(true);
      setAnnounceText('Processing...');

      // Simulate async operation
      setTimeout(() => {
        setIsLoading(false);
        setAnnounceText('Action completed successfully');
        // Clear announcement after screen reader has time to read it
        setTimeout(() => setAnnounceText(''), 3000);
      }, 2000);
    };

    return (
      <div className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <h3>Screen Reader Compatibility</h3>
          <p>
            Motion should be accompanied by appropriate ARIA announcements and state changes that
            screen readers can understand.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h4 className="font-medium">Accessible Loading State</h4>
          <p className="text-sm text-muted-foreground">
            Visual motion is paired with ARIA live regions for screen reader users.
          </p>

          <div className="flex justify-center py-6">
            <Button
              variant="primary"
              onClick={handleAsyncAction}
              disabled={isLoading}
              aria-describedby="status-announcement"
              className={cn(
                'motion-safe:transition-all motion-safe:duration-200',
                isLoading && 'motion-safe:animate-pulse'
              )}
            >
              {isLoading ? 'Processing...' : 'Start Async Action'}
            </Button>
          </div>

          {/* Screen reader announcements */}
          <div id="status-announcement" aria-live="polite" aria-atomic="true" className="sr-only">
            {announceText}
          </div>

          {/* Visual status for sighted users */}
          {announceText && (
            <div className="text-sm text-center p-2 bg-muted rounded">Status: {announceText}</div>
          )}

          <div className="text-xs font-mono bg-muted/50 p-3 rounded space-y-1">
            <div>
              Visual: <code>animate-pulse</code> (motion-safe)
            </div>
            <div>
              Screen Reader: <code>aria-live="polite"</code>
            </div>
            <div>
              State: <code>disabled</code> + <code>aria-describedby</code>
            </div>
          </div>
        </Card>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how motion should be paired with proper ARIA announcements for screen reader compatibility.',
      },
    },
  },
};

/**
 * High contrast mode compatibility
 */
export const HighContrastMode: Story = {
  render: () => {
    const [isActive, setIsActive] = useState(false);

    return (
      <div className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <h3>High Contrast Mode</h3>
          <p>
            Motion should remain functional and visible in high contrast modes where color-based
            feedback may be reduced.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h4 className="font-medium">High Contrast Motion</h4>
          <p className="text-sm text-muted-foreground">
            Motion relies on opacity, scale, and position changes rather than color transitions.
          </p>

          <div className="flex justify-center py-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsActive(true);
                setTimeout(() => setIsActive(false), 500);
              }}
              className={cn(
                'transition-all duration-300 ease-out',
                'hover:scale-105 focus-visible:scale-105',
                // High contrast compatible transitions
                'hover:shadow-lg focus-visible:shadow-lg',
                isActive && 'scale-110 shadow-xl',
                // Ensure visibility in high contrast
                'border-2 forced-colors:border-[ButtonBorder]',
                'forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText]'
              )}
            >
              High Contrast Motion
            </Button>
          </div>

          <div className="text-xs font-mono bg-muted/50 p-3 rounded space-y-1">
            <div>
              Transform: <code>scale-105</code> (shape change)
            </div>
            <div>
              Shadow: <code>shadow-lg</code> (depth indication)
            </div>
            <div>
              Forced Colors: <code>forced-colors:</code> utilities
            </div>
          </div>
        </Card>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates motion patterns that work effectively in high contrast modes.',
      },
    },
  },
};
