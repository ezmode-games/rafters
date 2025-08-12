import {
  animationPatterns,
  contextEasing,
  contextTiming,
  generateAnimationClass,
} from '@rafters/design-tokens/motion';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../components/Button';
import { cn } from '../lib/utils';

/**
 * Motion Pattern Library
 *
 * AI Training: Complete animation pattern library for component migration
 * Pre-configured motion combinations ready for systematic component implementation
 */
const meta = {
  title: 'Motion',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'AI Training: Pre-configured motion patterns for systematic component migration. Each pattern includes cognitive load rating, trust level, and accessibility compliance.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive Element Patterns
 * AI Training: Motion patterns for buttons, inputs, and other interactive components
 */
export const InteractivePatterns: Story = {
  render: () => {
    const [activeButton, setActiveButton] = useState<string | null>(null);

    const interactivePatterns = [
      {
        name: 'Button Press',
        pattern: animationPatterns.buttonPress,
        description: 'Immediate tactile feedback for all button interactions',
        implementation: 'hover:scale-105 active:scale-95',
        component: 'Button, Toggle, Checkbox',
      },
      {
        name: 'Hover Lift',
        pattern: animationPatterns.hoverLift,
        description: 'Subtle elevation suggests interactivity',
        implementation: 'hover:shadow-md hover:-translate-y-0.5',
        component: 'Card, Button, Interactive Element',
      },
      {
        name: 'Focus Indicator',
        pattern: {
          ...animationPatterns.buttonPress,
          usage: 'Focus ring appearance for accessibility',
        },
        description: 'Critical accessibility feedback for keyboard navigation',
        implementation: 'focus-visible:ring-2 focus-visible:ring-ring',
        component: 'All Interactive Elements',
      },
    ];

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>Interactive Element Motion Patterns</h3>
          <p>Essential motion patterns for buttons, inputs, and interactive components.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {interactivePatterns.map((item) => (
            <div key={item.name} className="space-y-4 p-4 border rounded-lg bg-card">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{item.name}</h4>
                  <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                    Load: {item.pattern.cognitiveLoad}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground/80">Components: {item.component}</p>
              </div>

              {/* Demo */}
              <div className="flex justify-center py-4">
                {item.name === 'Button Press' && (
                  <Button
                    variant="primary"
                    className={cn(
                      generateAnimationClass('buttonPress'),
                      'hover:scale-105 active:scale-95'
                    )}
                    onClick={fn()}
                    onMouseDown={() => setActiveButton(item.name)}
                    onMouseUp={() => setActiveButton(null)}
                  >
                    Press me
                  </Button>
                )}

                {item.name === 'Hover Lift' && (
                  <Button
                    variant="ghost"
                    className={cn(
                      'border bg-card',
                      generateAnimationClass('hoverLift'),
                      'hover:shadow-md hover:-translate-y-0.5'
                    )}
                    onClick={fn()}
                  >
                    Hover me
                  </Button>
                )}

                {item.name === 'Focus Indicator' && (
                  <Button
                    variant="ghost"
                    className={cn(
                      'bg-muted text-muted-foreground',
                      generateAnimationClass('buttonPress'),
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    )}
                    onClick={fn()}
                  >
                    Focus me (Tab)
                  </Button>
                )}
              </div>

              {/* Implementation Code */}
              <div className="text-xs font-mono bg-muted/50 p-2 rounded space-y-1">
                <div>
                  Pattern: <code>animationPatterns.{item.name.toLowerCase().replace(' ', '')}</code>
                </div>
                <div>
                  Classes: <code>{item.implementation}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
        AI Training: Interactive element patterns provide immediate feedback and build user confidence.
        
        Implementation Guidelines:
        - Button Press: Use for all clickable elements, provides tactile feedback
        - Hover Lift: Use for cards and surfaces that respond to interaction
        - Focus Indicator: Required for accessibility, must be immediate and clear
        
        Cognitive Load: 1-2 (minimal impact, immediate response)
        Trust Level: High (reliable, consistent feedback)
        `,
      },
    },
  },
};

/**
 * Modal and Overlay Patterns
 * AI Training: Motion patterns for dialogs, dropdowns, and overlay components
 */
export const ModalPatterns: Story = {
  render: () => {
    const [modalState, setModalState] = useState<'closed' | 'opening' | 'open' | 'closing'>(
      'closed'
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const modalPatterns = [
      {
        name: 'Fade In',
        pattern: animationPatterns.fadeIn,
        description: 'Gentle appearance for modals and overlays',
        usage: 'Dialog enter, tooltip show, dropdown reveal',
      },
      {
        name: 'Fade Out',
        pattern: animationPatterns.fadeOut,
        description: 'Graceful disappearance maintains spatial awareness',
        usage: 'Dialog exit, tooltip hide, dropdown dismiss',
      },
      {
        name: 'Scale In',
        pattern: animationPatterns.scaleIn,
        description: 'Growing appearance draws appropriate attention',
        usage: 'Important dialogs, confirmation modals, alerts',
      },
      {
        name: 'Slide Up',
        pattern: animationPatterns.slideUp,
        description: 'Directional entrance from bottom',
        usage: 'Bottom sheets, mobile menus, action sheets',
      },
    ];

    const handleModalDemo = () => {
      if (modalState === 'closed') {
        setModalState('opening');
        setTimeout(() => setModalState('open'), 300);
        setTimeout(() => {
          setModalState('closing');
          setTimeout(() => setModalState('closed'), 300);
        }, 2000);
      }
    };

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>Modal and Overlay Motion Patterns</h3>
          <p>
            Motion patterns for dialogs, dropdowns, and overlay components that manage user
            attention and reduce anxiety.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {modalPatterns.map((item) => (
            <div key={item.name} className="space-y-4 p-4 border rounded-lg bg-card">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    Load: {item.pattern.cognitiveLoad}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground/60">{item.usage}</p>
              </div>

              {/* Technical Details */}
              <div className="text-xs font-mono bg-muted/50 p-2 rounded space-y-1">
                <div>
                  Timing: <code>{item.pattern.timing}</code>
                </div>
                <div>
                  Easing: <code>{item.pattern.easing}</code>
                </div>
                <div>
                  Trust: <code>{item.pattern.trustLevel}</code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Modal Demo */}
        <div className="relative">
          <div className="prose prose-sm max-w-none mb-4">
            <h4>Interactive Modal Demo</h4>
            <p>Click to see complete modal animation cycle with fade in/out patterns.</p>
          </div>

          <div className="flex justify-center py-8 relative min-h-32">
            <Button onClick={handleModalDemo} disabled={modalState !== 'closed'}>
              {modalState === 'closed' ? 'Open Modal Demo' : 'Demo Running...'}
            </Button>

            {/* Demo Modal */}
            {modalState !== 'closed' && (
              <>
                {/* Backdrop */}
                <div
                  className={cn(
                    'absolute inset-0 bg-black/50 transition-opacity',
                    contextTiming.modal,
                    contextEasing.modalEnter,
                    modalState === 'opening' && 'opacity-0',
                    modalState === 'open' && 'opacity-100',
                    modalState === 'closing' && 'opacity-0'
                  )}
                />

                {/* Modal Content */}
                <div
                  className={cn(
                    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                    'bg-card border rounded-lg p-6 min-w-80 shadow-lg',
                    'transition-all',
                    contextTiming.modal,
                    contextEasing.modalEnter,
                    modalState === 'opening' && 'opacity-0 scale-95',
                    modalState === 'open' && 'opacity-100 scale-100',
                    modalState === 'closing' && cn('opacity-0 scale-95', contextEasing.modalExit)
                  )}
                >
                  <div className="space-y-4">
                    <h3 className="font-medium">Demo Modal</h3>
                    <p className="text-sm text-muted-foreground">
                      Notice the welcoming entrance and graceful exit using motion intelligence.
                    </p>
                    <div className="flex justify-end">
                      <span className="text-xs text-muted-foreground">Auto-closing...</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dropdown Demo */}
        <div className="relative">
          <div className="prose prose-sm max-w-none mb-4">
            <h4>Dropdown Animation Demo</h4>
            <p>Slide up pattern commonly used for mobile menus and action sheets.</p>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <Button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative">
                Toggle Dropdown {dropdownOpen ? '↑' : '↓'}
              </Button>

              {dropdownOpen && (
                <div
                  className={cn(
                    'absolute top-full left-0 mt-2 w-48 bg-card border rounded-md shadow-lg z-10',
                    'transition-all',
                    generateAnimationClass('slideUp'),
                    'animate-in slide-in-from-bottom-2'
                  )}
                >
                  <div className="p-2 space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm px-3 py-2 h-auto font-normal"
                      onClick={fn()}
                    >
                      Option 1
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm px-3 py-2 h-auto font-normal"
                      onClick={fn()}
                    >
                      Option 2
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm px-3 py-2 h-auto font-normal"
                      onClick={fn()}
                    >
                      Option 3
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
        AI Training: Modal and overlay patterns manage user attention and reduce anxiety through welcoming animations.
        
        Pattern Applications:
        - Fade In/Out: Standard for most overlays, low cognitive impact
        - Scale In/Out: For important dialogs requiring attention
        - Slide Up/Down: Mobile-first patterns with clear directional movement
        
        Key Principles:
        - Entrance animations should feel welcoming (accelerating easing)
        - Exit animations should feel graceful (decelerating easing)
        - Timing should allow users to understand the transition (300ms standard)
        - Always include backdrop fade for proper layering
        `,
      },
    },
  },
};

/**
 * Feedback and Status Patterns
 * AI Training: Motion patterns for success, error, loading, and progress states
 */
export const FeedbackPatterns: Story = {
  render: () => {
    const [feedbackState, setFeedbackState] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const feedbackPatterns = [
      {
        name: 'Bounce Success',
        pattern: animationPatterns.bounceSuccess,
        description: 'Celebratory feedback for completed actions',
        trigger: 'success',
      },
      {
        name: 'Shake Error',
        pattern: animationPatterns.shakeError,
        description: 'Alert without aggression for error states',
        trigger: 'error',
      },
      {
        name: 'Pulse Loading',
        pattern: animationPatterns.pulse,
        description: 'Rhythmic attention for loading states',
        trigger: 'loading',
      },
      {
        name: 'Progress Linear',
        pattern: animationPatterns.progressLinear,
        description: 'Steady advancement for progress indicators',
        trigger: 'progress',
      },
    ];

    const triggerFeedback = (type: string) => {
      setFeedbackState(type);

      if (type === 'progress') {
        setLoadingProgress(0);
        const interval = setInterval(() => {
          setLoadingProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setFeedbackState(null);
                setLoadingProgress(0);
              }, 500);
              return 100;
            }
            return prev + 10;
          });
        }, 100);
      } else {
        setTimeout(() => setFeedbackState(null), type === 'loading' ? 2000 : 1000);
      }
    };

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>Feedback and Status Motion Patterns</h3>
          <p>
            Motion patterns that communicate system status and provide user feedback through
            intelligent animation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {feedbackPatterns.map((item) => (
            <div key={item.name} className="space-y-4 p-4 border rounded-lg bg-card">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-full">
                    Load: {item.pattern.cognitiveLoad}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>

              {/* Demo Button */}
              <div className="flex justify-center py-2">
                <Button
                  size="sm"
                  variant={item.trigger === 'error' ? 'destructive' : 'secondary'}
                  onClick={() => triggerFeedback(item.trigger)}
                  disabled={feedbackState === item.trigger}
                >
                  Test {item.name}
                </Button>
              </div>

              {/* Technical Details */}
              <div className="text-xs font-mono bg-muted/50 p-2 rounded space-y-1">
                <div>
                  Cognitive: <code>{item.pattern.cognitiveLoad}</code>
                </div>
                <div>
                  Trust: <code>{item.pattern.trustLevel}</code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Demonstrations */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Success Demo */}
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h4 className="font-medium">Success Feedback Demo</h4>
            <div className="flex justify-center py-6">
              <div
                className={cn(
                  'flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-md',
                  'transition-all',
                  generateAnimationClass('bounceSuccess'),
                  feedbackState === 'success' && 'animate-bounce'
                )}
              >
                <span>✓</span>
                <span>Action Completed!</span>
              </div>
            </div>
          </div>

          {/* Error Demo */}
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h4 className="font-medium">Error Feedback Demo</h4>
            <div className="flex justify-center py-6">
              <div
                className={cn(
                  'flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md',
                  'transition-all',
                  generateAnimationClass('shakeError'),
                  feedbackState === 'error' && 'animate-pulse'
                )}
              >
                <span>!</span>
                <span>Please check your input</span>
              </div>
            </div>
          </div>

          {/* Loading Demo */}
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h4 className="font-medium">Loading State Demo</h4>
            <div className="flex justify-center py-6">
              <div
                className={cn(
                  'flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-md',
                  'transition-all',
                  generateAnimationClass('pulse'),
                  feedbackState === 'loading' && 'animate-pulse'
                )}
              >
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            </div>
          </div>

          {/* Progress Demo */}
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h4 className="font-medium">Progress Indicator Demo</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Upload Progress</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full bg-primary transition-all',
                    generateAnimationClass('progressLinear')
                  )}
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
        AI Training: Feedback patterns communicate system status and provide emotional reinforcement through motion.
        
        Pattern Intelligence:
        - Bounce Success: Celebratory motion reinforces positive actions (cognitive load 7)
        - Shake Error: Brief alert communicates error without frustration (cognitive load 8) 
        - Pulse Loading: Rhythmic attention for indeterminate waiting (cognitive load 6)
        - Progress Linear: Steady advancement builds trust during determinate processes (cognitive load 1)
        
        Usage Guidelines:
        - Success animations should feel rewarding but not excessive
        - Error animations should be helpful, not punitive
        - Loading states should be calming and reduce perceived wait time
        - Progress indicators should clearly show advancement
        `,
      },
    },
  },
};

/**
 * Component Migration Examples
 * AI Training: Practical examples of how to apply motion patterns to specific components
 */
export const MigrationExamples: Story = {
  render: () => {
    const [buttonState, setButtonState] = useState<'default' | 'loading' | 'success'>('default');
    const [inputFocus, setInputFocus] = useState(false);
    const [tabActive, setTabActive] = useState('tab1');

    const handleButtonDemo = async () => {
      setButtonState('loading');
      setTimeout(() => {
        setButtonState('success');
        setTimeout(() => setButtonState('default'), 2000);
      }, 1500);
    };

    return (
      <div className="space-y-12">
        <div className="prose prose-sm max-w-none">
          <h3>Component Migration Examples</h3>
          <p>
            Practical implementations showing how to integrate motion intelligence into existing
            components.
          </p>
        </div>

        {/* Button Migration Example */}
        <div className="space-y-4">
          <h4 className="font-medium">Button Component Migration</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Motion patterns: hover response, active press, loading state, success feedback
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={buttonState === 'success' ? 'success' : 'primary'}
                  className={cn(
                    'transition-all',
                    contextTiming.hover,
                    contextEasing.hover,
                    'hover:opacity-hover hover:scale-105',
                    'active:scale-95',
                    buttonState === 'loading' && 'cursor-wait',
                    buttonState === 'success' && generateAnimationClass('bounceSuccess')
                  )}
                  onClick={handleButtonDemo}
                  disabled={buttonState !== 'default'}
                >
                  {buttonState === 'default' && 'Click Me'}
                  {buttonState === 'loading' && (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  )}
                  {buttonState === 'success' && '✓ Success!'}
                </Button>

                <Button
                  variant="destructive"
                  className={cn(
                    'transition-all',
                    contextTiming.hover,
                    contextEasing.hover,
                    'hover:opacity-hover hover:scale-105',
                    'active:scale-95'
                  )}
                  onClick={fn()}
                >
                  Destructive
                </Button>
              </div>
            </div>

            <div className="text-xs font-mono bg-muted/50 p-3 rounded space-y-2">
              <div className="text-sm font-sans font-medium mb-2">Implementation:</div>
              <div>
                Hover: <code>contextTiming.hover + contextEasing.hover</code>
              </div>
              <div>
                Active: <code>active:scale-95</code>
              </div>
              <div>
                Focus: <code>focus-visible:ring-2</code>
              </div>
              <div>
                Loading: <code>cursor-wait + spinner</code>
              </div>
              <div>
                Success: <code>animationPatterns.bounceSuccess</code>
              </div>
            </div>
          </div>
        </div>

        {/* Input Migration Example */}
        <div className="space-y-4">
          <h4 className="font-medium">Input Component Migration</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Motion patterns: focus ring, validation feedback, state transitions
              </div>

              <div className="space-y-3">
                <input
                  className={cn(
                    'w-full px-3 py-2 border rounded-md bg-background',
                    'transition-all',
                    contextTiming.focus,
                    contextEasing.focus,
                    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    'focus:border-ring',
                    inputFocus && 'shadow-sm'
                  )}
                  placeholder="Focus me to see motion"
                  onFocus={() => setInputFocus(true)}
                  onBlur={() => setInputFocus(false)}
                  onChange={fn()}
                />

                <input
                  className={cn(
                    'w-full px-3 py-2 border-destructive border rounded-md bg-background',
                    'transition-all',
                    contextTiming.toast,
                    contextEasing.focus,
                    'animate-pulse'
                  )}
                  placeholder="Error state with pulse feedback"
                  defaultValue="invalid@email"
                  onChange={fn()}
                />

                <input
                  className={cn(
                    'w-full px-3 py-2 border-success border rounded-md bg-background',
                    'transition-all',
                    contextTiming.toast,
                    contextEasing.success
                  )}
                  placeholder="Valid state"
                  defaultValue="valid@email.com"
                  onChange={fn()}
                />
              </div>
            </div>

            <div className="text-xs font-mono bg-muted/50 p-3 rounded space-y-2">
              <div className="text-sm font-sans font-medium mb-2">Implementation:</div>
              <div>
                Focus: <code>contextTiming.focus + ring-2</code>
              </div>
              <div>
                Error: <code>animate-pulse + border-destructive</code>
              </div>
              <div>
                Success: <code>contextEasing.success + border-success</code>
              </div>
              <div>
                Transition: <code>transition-all</code>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Migration Example */}
        <div className="space-y-4">
          <h4 className="font-medium">Tabs Component Migration</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Motion patterns: selection indicator, content transitions, hover states
              </div>

              <div className="space-y-4">
                <div className="flex border-b">
                  {['tab1', 'tab2', 'tab3'].map((tab) => (
                    <Button
                      key={tab}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'px-4 py-2 text-sm relative h-auto rounded-none',
                        'transition-all',
                        contextTiming.hover,
                        contextEasing.hover,
                        'hover:text-foreground',
                        tabActive === tab
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      onClick={() => setTabActive(tab)}
                      onKeyDown={fn()}
                    >
                      Tab {tab.slice(-1)}
                      {tabActive === tab && (
                        <div
                          className={cn(
                            'absolute bottom-0 left-0 right-0 h-0.5 bg-primary',
                            'transition-all',
                            contextTiming.standard,
                            contextEasing.smooth
                          )}
                        />
                      )}
                    </Button>
                  ))}
                </div>

                <div
                  className={cn(
                    'p-4 bg-muted/20 rounded-md min-h-24',
                    'transition-all',
                    contextTiming.standard,
                    contextEasing.modalEnter
                  )}
                  key={tabActive} // Force re-render for animation
                >
                  <div className="animate-in fade-in slide-in-from-left-2">
                    Content for {tabActive} with smooth transition
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs font-mono bg-muted/50 p-3 rounded space-y-2">
              <div className="text-sm font-sans font-medium mb-2">Implementation:</div>
              <div>
                Hover: <code>contextTiming.hover + hover:text-foreground</code>
              </div>
              <div>
                Indicator: <code>contextTiming.standard + bg-primary</code>
              </div>
              <div>
                Content: <code>animate-in fade-in slide-in-from-left-2</code>
              </div>
              <div>
                Selection: <code>contextEasing.smooth</code>
              </div>
            </div>
          </div>
        </div>

        {/* Migration Checklist */}
        <div className="p-6 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-4">Component Migration Checklist</h4>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h5 className="font-medium">Required Motion Patterns:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ Hover states use contextTiming.hover</li>
                <li>✓ Focus indicators use contextTiming.focus</li>
                <li>✓ State changes use contextTiming.standard</li>
                <li>✓ Loading states use contextTiming.progress</li>
                <li>✓ All animations include reduced-motion fallbacks</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-medium">Quality Assurance:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ Motion supports content hierarchy</li>
                <li>✓ Cognitive load matches component rating</li>
                <li>✓ Accessibility requirements met</li>
                <li>✓ Cross-browser compatibility tested</li>
                <li>✓ Performance impact minimal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
        AI Training: Complete migration examples showing practical implementation of motion intelligence in real components.
        
        Migration Process:
        1. Identify component interaction points (hover, focus, active, loading)
        2. Apply appropriate motion tokens based on cognitive load and consequence
        3. Implement accessibility requirements (reduced motion, focus indicators)
        4. Test motion personality consistency across similar components
        5. Validate performance and cross-browser compatibility
        
        Key Implementation Patterns:
        - Interactive elements get immediate feedback (75ms, snappy)
        - State changes use standard timing (300ms, smooth)
        - Loading states build trust through deliberate pacing (500ms)
        - Success states provide celebratory reinforcement
        `,
      },
    },
  },
};
