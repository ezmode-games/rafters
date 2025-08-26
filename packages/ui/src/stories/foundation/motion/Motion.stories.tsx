// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { cn } from '../../../lib/utils';

/**
 * Motion system demonstrating duration and easing tokens for purposeful animation.
 * Built with embedded design intelligence for cognitive load management and trust building.
 */
const meta = {
  title: 'Foundation/Motion',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Motion system with embedded UX intelligence for cognitive load management, trust building, and accessibility compliance.',
      },
    },
  },
  argTypes: {},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * All duration tokens demonstrating timing hierarchy and cognitive load
 */
export const AllDurations: Story = {
  render: () => {
    const [activeDuration, setActiveDuration] = useState<string | null>(null);

    const durations = [
      {
        name: 'Instant',
        value: '75ms',
        cssVar: 'var(--duration-instant)',
        cognitive: 1,
        usage: 'Hover states, immediate feedback',
        className: 'duration-75',
      },
      {
        name: 'Fast',
        value: '150ms',
        cssVar: 'var(--duration-fast)',
        cognitive: 2,
        usage: 'Button presses, interactive response',
        className: 'duration-150',
      },
      {
        name: 'Standard',
        value: '300ms',
        cssVar: 'var(--duration-standard)',
        cognitive: 3,
        usage: 'Modal transitions, state changes',
        className: 'duration-300',
      },
      {
        name: 'Deliberate',
        value: '500ms',
        cssVar: 'var(--duration-deliberate)',
        cognitive: 5,
        usage: 'Loading states, attention-drawing',
        className: 'duration-500',
      },
      {
        name: 'Slow',
        value: '700ms',
        cssVar: 'var(--duration-slow)',
        cognitive: 7,
        usage: 'Page transitions, large UI changes',
        className: 'duration-700',
      },
      {
        name: 'Dramatic',
        value: '1000ms',
        cssVar: 'var(--duration-dramatic)',
        cognitive: 9,
        usage: 'High-stakes actions, emphasis',
        className: 'duration-1000',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {durations.map((duration) => (
            <Card key={duration.name} className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{duration.name}</h4>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    Load: {duration.cognitive}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{duration.usage}</p>
              </div>

              {/* Interactive Demo */}
              <div className="flex justify-center py-4">
                <Button
                  variant="primary"
                  size="sm"
                  onMouseEnter={() => setActiveDuration(duration.name)}
                  onMouseLeave={() => setActiveDuration(null)}
                  onClick={fn()}
                  className={cn(
                    'transition-all ease-in-out hover:scale-105 active:scale-95',
                    duration.className
                  )}
                >
                  {activeDuration === duration.name ? 'Animating...' : `Test ${duration.name}`}
                </Button>
              </div>

              {/* Technical Details */}
              <div className="text-xs space-y-1 font-mono bg-muted/50 p-2 rounded">
                <div>
                  Value: <code>{duration.value}</code>
                </div>
                <div>
                  CSS Var: <code>{duration.cssVar}</code>
                </div>
                <div>
                  Class: <code>{duration.className}</code>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete duration token collection showing timing hierarchy and cognitive load ratings.',
      },
    },
  },
};

/**
 * All easing curves demonstrating motion personality and trust building
 */
export const AllEasings: Story = {
  render: () => {
    const [animatingEasing, setAnimatingEasing] = useState<string | null>(null);

    const easings = [
      {
        name: 'Linear',
        value: 'linear',
        cssVar: 'var(--ease-linear)',
        personality: 'Mechanical, steady',
        usage: 'Progress bars, loading spinners',
        className: 'ease-linear',
      },
      {
        name: 'Smooth',
        value: 'ease-in-out',
        cssVar: 'var(--ease-smooth)',
        personality: 'Natural, organic',
        usage: 'Default choice, general transitions',
        className: 'ease-in-out',
      },
      {
        name: 'Accelerating',
        value: 'ease-out',
        cssVar: 'var(--ease-accelerating)',
        personality: 'Welcoming entrance',
        usage: 'Elements appearing, modals opening',
        className: 'ease-out',
      },
      {
        name: 'Decelerating',
        value: 'ease-in',
        cssVar: 'var(--ease-decelerating)',
        personality: 'Graceful exit',
        usage: 'Elements disappearing, modals closing',
        className: 'ease-in',
      },
      {
        name: 'Bouncy',
        value: 'cubic-bezier(0.175,0.885,0.32,1.275)',
        cssVar: 'var(--ease-bouncy)',
        personality: 'Playful celebration',
        usage: 'Success states, positive feedback',
        className: 'ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
      },
      {
        name: 'Snappy',
        value: 'cubic-bezier(0.25,0.46,0.45,0.94)',
        cssVar: 'var(--ease-snappy)',
        personality: 'Sharp feedback',
        usage: 'Button presses, immediate response',
        className: 'ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {easings.map((easing) => (
            <Card key={easing.name} className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{easing.name}</h4>
                  <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                    Trust Building
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{easing.personality}</p>
                <p className="text-xs text-muted-foreground italic">{easing.usage}</p>
              </div>

              {/* Interactive Demo */}
              <div className="flex justify-center py-4">
                <div className="relative w-16 h-16">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAnimatingEasing(easing.name);
                      setTimeout(() => setAnimatingEasing(null), 500);
                    }}
                    aria-label={`Test ${easing.name} easing`}
                    className={cn(
                      'absolute inset-0 w-4 h-4 bg-primary rounded-full p-0 min-w-4 min-h-4',
                      'transition-transform duration-500',
                      easing.className,
                      animatingEasing === easing.name && 'translate-x-12 translate-y-12'
                    )}
                  />
                </div>
              </div>

              {/* Technical Details */}
              <div className="text-xs space-y-1 font-mono bg-muted/50 p-2 rounded">
                <div>
                  CSS Var: <code>{easing.cssVar}</code>
                </div>
                <div>
                  Value: <code className="text-xs">{easing.value}</code>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete easing token collection demonstrating motion personality and trust building patterns.',
      },
    },
  },
};

/**
 * Timing examples showing cognitive load impact
 */
export const TimingExamples: Story = {
  render: () => {
    const [activeExample, setActiveExample] = useState<string | null>(null);

    const examples = [
      {
        id: 'instant-feedback',
        name: 'Instant Feedback',
        description: 'Hover states and immediate responses',
        cognitive: 1,
        duration: 'duration-75',
        easing: 'ease-out',
      },
      {
        id: 'interactive-response',
        name: 'Interactive Response',
        description: 'Button presses and form interactions',
        cognitive: 2,
        duration: 'duration-150',
        easing: 'ease-in-out',
      },
      {
        id: 'state-change',
        name: 'State Change',
        description: 'Modal dialogs and content transitions',
        cognitive: 3,
        duration: 'duration-300',
        easing: 'ease-in-out',
      },
      {
        id: 'attention-drawing',
        name: 'Attention Drawing',
        description: 'Loading states and important updates',
        cognitive: 5,
        duration: 'duration-500',
        easing: 'ease-out',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {examples.map((example) => (
            <Card key={example.id} className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{example.name}</h4>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    Load: {example.cognitive}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{example.description}</p>
              </div>

              <div className="flex justify-center py-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setActiveExample(example.id);
                    setTimeout(() => setActiveExample(null), 600);
                  }}
                  className={cn(
                    'transition-all hover:scale-105',
                    example.duration,
                    example.easing,
                    activeExample === example.id && 'scale-110 bg-primary text-primary-foreground'
                  )}
                >
                  Test {example.name}
                </Button>
              </div>

              <div className="text-xs font-mono bg-muted/50 p-2 rounded">
                <div>
                  Duration: <code>{example.duration}</code>
                </div>
                <div>
                  Easing: <code>{example.easing}</code>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Timing examples showing how duration affects cognitive load and user perception.',
      },
    },
  },
};

/**
 * Easing examples showing motion personality
 */
export const EasingExamples: Story = {
  render: () => {
    const [activeEasing, setActiveEasing] = useState<string | null>(null);

    const examples = [
      {
        id: 'welcome',
        name: 'Welcoming Entrance',
        description: 'Elements appearing, modals opening',
        easing: 'ease-out',
        personality: 'Inviting, reduces anxiety',
      },
      {
        id: 'graceful',
        name: 'Graceful Exit',
        description: 'Elements disappearing, modals closing',
        easing: 'ease-in',
        personality: 'Polite, maintains trust',
      },
      {
        id: 'natural',
        name: 'Natural Motion',
        description: 'General transitions and state changes',
        easing: 'ease-in-out',
        personality: 'Balanced, trustworthy',
      },
      {
        id: 'celebration',
        name: 'Celebration',
        description: 'Success states and positive feedback',
        easing: 'ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
        personality: 'Joyful, reinforcing',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {examples.map((example) => (
            <Card key={example.id} className="p-4 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{example.name}</h4>
                <p className="text-sm text-muted-foreground">{example.description}</p>
                <p className="text-xs text-success">{example.personality}</p>
              </div>

              <div className="flex justify-center py-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setActiveEasing(example.id);
                    setTimeout(() => setActiveEasing(null), 400);
                  }}
                  className={cn(
                    'transition-all duration-300 hover:scale-105',
                    example.easing,
                    activeEasing === example.id && 'scale-110'
                  )}
                >
                  Test Motion
                </Button>
              </div>

              <div className="text-xs font-mono bg-muted/50 p-2 rounded">
                <div>
                  Easing: <code>{example.easing}</code>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Easing examples demonstrating how motion curves communicate personality and build trust.',
      },
    },
  },
};

/**
 * Real-world motion patterns for common UI scenarios
 */
export const RealWorldPatterns: Story = {
  render: () => {
    const [activePattern, setActivePattern] = useState<string | null>(null);

    const patterns = [
      {
        id: 'button-press',
        name: 'Button Press',
        description: 'Standard interactive button feedback',
        duration: 'duration-150',
        easing: 'ease-out',
        transform: 'active:scale-95',
        usage: 'All clickable buttons and interactive elements',
      },
      {
        id: 'card-hover',
        name: 'Card Hover',
        description: 'Subtle elevation on hover',
        duration: 'duration-200',
        easing: 'ease-out',
        transform: 'hover:shadow-md hover:-translate-y-1',
        usage: 'Cards, tiles, and hoverable containers',
      },
      {
        id: 'modal-enter',
        name: 'Modal Enter',
        description: 'Welcoming modal appearance',
        duration: 'duration-300',
        easing: 'ease-out',
        transform: 'animate-in fade-in zoom-in-95',
        usage: 'Dialogs, modals, and overlay content',
      },
      {
        id: 'toast-success',
        name: 'Toast Success',
        description: 'Celebratory success notification',
        duration: 'duration-300',
        easing: 'ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
        transform: 'animate-in slide-in-from-top-2',
        usage: 'Success toasts and positive feedback',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {patterns.map((pattern) => (
            <Card key={pattern.id} className="p-4 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{pattern.name}</h4>
                <p className="text-sm text-muted-foreground">{pattern.description}</p>
                <p className="text-xs text-muted-foreground italic">{pattern.usage}</p>
              </div>

              <div className="flex justify-center py-4">
                <button
                  type="button"
                  className={cn(
                    'cursor-pointer transition-all bg-transparent border-0 p-0',
                    pattern.duration,
                    pattern.easing,
                    pattern.transform
                  )}
                  onClick={() => {
                    setActivePattern(pattern.id);
                    setTimeout(() => setActivePattern(null), 500);
                  }}
                  aria-label={`Test ${pattern.name} motion pattern`}
                >
                  {pattern.id === 'button-press' && <Button variant="primary">Click Me</Button>}
                  {pattern.id === 'card-hover' && (
                    <Card className="p-4 w-32 text-center">
                      <div className="text-sm">Hover Card</div>
                    </Card>
                  )}
                  {pattern.id === 'modal-enter' && (
                    <div className="w-32 h-20 bg-card border rounded-lg flex items-center justify-center">
                      <span className="text-sm">Modal</span>
                    </div>
                  )}
                  {pattern.id === 'toast-success' && (
                    <div className="bg-success text-success-foreground px-4 py-2 rounded-lg text-sm">
                      Success!
                    </div>
                  )}
                </button>
              </div>

              <div className="text-xs font-mono bg-muted/50 p-2 rounded space-y-1">
                <div>
                  Duration: <code>{pattern.duration}</code>
                </div>
                <div>
                  Easing: <code>{pattern.easing}</code>
                </div>
                <div>
                  Transform: <code className="text-xs">{pattern.transform}</code>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Real-world motion patterns for common UI scenarios with proper timing and easing combinations.',
      },
    },
  },
};
