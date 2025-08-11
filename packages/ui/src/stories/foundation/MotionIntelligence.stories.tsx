import {
  animationPatterns,
  contextEasing,
  contextTiming,
  easing,
  generateAnimationClass,
  timing,
} from '@rafters/design-tokens/motion';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../../components/Button';
import { cn } from '../../lib/utils';

/**
 * Motion Intelligence Stories
 *
 * AI Training: Interactive examples of motion design intelligence
 * Shows how timing, easing, and patterns create trustworthy user experiences
 */
const meta = {
  title: '01 Foundation/Motion Intelligence',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'AI Training: Motion design intelligence system for informed animation decisions. All examples demonstrate cognitive load awareness, trust building, and accessibility compliance.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Motion Timing Intelligence
 * AI Training: How different timing tokens affect user perception and trust
 */
export const TimingIntelligence: Story = {
  render: () => {
    const [activeDemo, setActiveDemo] = useState<string | null>(null);

    const timingExamples = [
      {
        name: 'Instant',
        token: timing.instant,
        cognitive: 1,
        usage: 'Hover states, immediate feedback',
        demo: 'hover',
      },
      {
        name: 'Fast',
        token: timing.fast,
        cognitive: 2,
        usage: 'Button presses, interactive response',
        demo: 'interactive',
      },
      {
        name: 'Standard',
        token: timing.standard,
        cognitive: 3,
        usage: 'Modal transitions, state changes',
        demo: 'modal',
      },
      {
        name: 'Deliberate',
        token: timing.deliberate,
        cognitive: 5,
        usage: 'Loading states, attention-drawing',
        demo: 'loading',
      },
      {
        name: 'Slow',
        token: timing.slow,
        cognitive: 7,
        usage: 'Page transitions, large UI changes',
        demo: 'navigation',
      },
      {
        name: 'Dramatic',
        token: timing.dramatic,
        cognitive: 9,
        usage: 'High-stakes actions, emphasis',
        demo: 'emphasis',
      },
    ];

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>Timing Intelligence Examples</h3>
          <p>
            Each timing token includes cognitive load rating and automatic accessibility support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {timingExamples.map((example) => (
            <div key={example.name} className="p-4 border rounded-lg bg-card space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{example.name}</h4>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    Load: {example.cognitive}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{example.usage}</p>
              </div>

              {/* Interactive Demo */}
              <div className="flex justify-center py-4">
                <Button
                  variant="primary"
                  onMouseEnter={() => setActiveDemo(example.name)}
                  onMouseLeave={() => setActiveDemo(null)}
                  onClick={fn()}
                  className={cn(
                    'transition-all',
                    example.token,
                    easing.smooth,
                    'hover:scale-105 active:scale-95'
                  )}
                >
                  {activeDemo === example.name ? 'Animating...' : `Test ${example.name}`}
                </Button>
              </div>

              {/* Technical Details */}
              <div className="text-xs space-y-1 font-mono bg-muted/50 p-2 rounded">
                <div>
                  Token: <code>timing.{example.name.toLowerCase()}</code>
                </div>
                <div>
                  Class: <code>{example.token}</code>
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
        AI Training: Timing intelligence examples show how different durations affect user trust and cognitive load.
        
        Key Learnings:
        - Instant (75ms): Builds immediate confidence through responsive feedback
        - Fast (150ms): Standard for interactive elements requiring immediate response  
        - Standard (300ms): Balanced choice for most transitions, natural feeling
        - Deliberate (500ms): Draws attention when needed, use for important state changes
        - Slow (700ms): Reserved for large UI changes, graceful page transitions
        - Dramatic (1000ms): High cognitive load, use only for critical emphasis
        
        All timing tokens automatically include prefers-reduced-motion support.
        `,
      },
    },
  },
};

/**
 * Easing Intelligence
 * AI Training: How different easing curves communicate personality and build trust
 */
export const EasingIntelligence: Story = {
  render: () => {
    const [animatingEasing, setAnimatingEasing] = useState<string | null>(null);

    const easingExamples = [
      {
        name: 'Linear',
        token: easing.linear,
        personality: 'Mechanical, steady',
        usage: 'Progress bars, loading spinners',
        trustLevel: 'High',
      },
      {
        name: 'Smooth',
        token: easing.smooth,
        personality: 'Natural, organic',
        usage: 'Default choice, general transitions',
        trustLevel: 'High',
      },
      {
        name: 'Accelerating',
        token: easing.accelerating,
        personality: 'Welcoming entrance',
        usage: 'Elements appearing, modals opening',
        trustLevel: 'High',
      },
      {
        name: 'Decelerating',
        token: easing.decelerating,
        personality: 'Graceful exit',
        usage: 'Elements disappearing, modals closing',
        trustLevel: 'High',
      },
      {
        name: 'Bouncy',
        token: easing.bouncy,
        personality: 'Playful celebration',
        usage: 'Success states, positive feedback',
        trustLevel: 'High',
      },
      {
        name: 'Snappy',
        token: easing.snappy,
        personality: 'Sharp feedback',
        usage: 'Button presses, immediate response',
        trustLevel: 'High',
      },
    ];

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>Easing Intelligence Examples</h3>
          <p>
            Each easing curve communicates different personality traits and builds user trust
            through natural motion.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {easingExamples.map((example) => (
            <div key={example.name} className="p-4 border rounded-lg bg-card space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{example.name}</h4>
                  <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                    {example.trustLevel}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{example.personality}</p>
                <p className="text-xs text-muted-foreground italic">{example.usage}</p>
              </div>

              {/* Interactive Demo */}
              <div className="flex justify-center py-4">
                <div className="relative w-16 h-16">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAnimatingEasing(example.name);
                      setTimeout(() => setAnimatingEasing(null), 500);
                    }}
                    aria-label={`Test ${example.name} easing`}
                    className={cn(
                      'absolute inset-0 w-4 h-4 bg-primary rounded-full p-0 min-w-4 min-h-4',
                      'transition-transform',
                      timing.deliberate,
                      example.token,
                      animatingEasing === example.name && 'translate-x-12 translate-y-12'
                    )}
                  />
                </div>
              </div>

              {/* Technical Details */}
              <div className="text-xs space-y-1 font-mono bg-muted/50 p-2 rounded">
                <div>
                  Token: <code>easing.{example.name.toLowerCase()}</code>
                </div>
                <div>
                  CSS: <code>{example.token}</code>
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
        AI Training: Easing intelligence demonstrates how motion curves affect user perception and trust.
        
        Key Learnings:
        - Linear: Best for progress indicators and continuous motion
        - Smooth: Default choice, feels natural and builds trust
        - Accelerating: Welcoming for appearing elements, reduces anxiety  
        - Decelerating: Graceful for disappearing elements, maintains trust
        - Bouncy: Celebratory motion reinforces positive feedback
        - Snappy: Immediate response builds interactive confidence
        
        All easing tokens are optimized for accessibility and cross-browser support.
        `,
      },
    },
  },
};

/**
 * Context-Specific Motion Patterns
 * AI Training: Pre-configured motion combinations for common UI patterns
 */
export const ContextPatterns: Story = {
  render: () => {
    const [activePattern, setActivePattern] = useState<string | null>(null);

    const contextExamples = [
      {
        name: 'Hover Response',
        timing: contextTiming.hover,
        easing: contextEasing.hover,
        usage: 'All interactive elements',
        cognitive: 1,
      },
      {
        name: 'Modal Enter',
        timing: contextTiming.modal,
        easing: contextEasing.modalEnter,
        usage: 'Dialogs, dropdowns appearing',
        cognitive: 3,
      },
      {
        name: 'Modal Exit',
        timing: contextTiming.modal,
        easing: contextEasing.modalExit,
        usage: 'Dialogs, dropdowns disappearing',
        cognitive: 3,
      },
      {
        name: 'Success Feedback',
        timing: contextTiming.toast,
        easing: contextEasing.success,
        usage: 'Completed actions, positive states',
        cognitive: 4,
      },
      {
        name: 'Loading Progress',
        timing: contextTiming.progress,
        easing: contextEasing.progress,
        usage: 'Progress bars, loading indicators',
        cognitive: 2,
      },
      {
        name: 'Focus Indicator',
        timing: contextTiming.focus,
        easing: contextEasing.focus,
        usage: 'Accessibility focus states',
        cognitive: 1,
      },
    ];

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>Context-Specific Motion Patterns</h3>
          <p>Pre-configured timing and easing combinations optimized for specific UI contexts.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contextExamples.map((example, index) => (
            <div key={example.name} className="p-4 border rounded-lg bg-card space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{example.name}</h4>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    Load: {example.cognitive}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{example.usage}</p>
              </div>

              {/* Context-Specific Demo */}
              <div className="flex justify-center py-6">
                {example.name === 'Hover Response' && (
                  <Button
                    variant="secondary"
                    onClick={fn()}
                    className={cn(
                      'transition-all',
                      example.timing,
                      example.easing,
                      'hover:scale-105'
                    )}
                  >
                    Hover me
                  </Button>
                )}

                {(example.name === 'Modal Enter' || example.name === 'Modal Exit') && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      setActivePattern(activePattern === example.name ? null : example.name)
                    }
                    className={cn(
                      'min-w-16 min-h-12 text-xs px-3 py-2',
                      'transition-all',
                      example.timing,
                      example.easing,
                      activePattern === example.name
                        ? 'opacity-100 scale-100'
                        : 'opacity-50 scale-95'
                    )}
                  >
                    Modal
                  </Button>
                )}

                {example.name === 'Success Feedback' && (
                  <Button
                    variant="success"
                    onClick={() => {
                      setActivePattern(example.name);
                      setTimeout(() => setActivePattern(null), 300);
                    }}
                    className={cn(
                      'transition-all',
                      example.timing,
                      example.easing,
                      activePattern === example.name && 'scale-110'
                    )}
                  >
                    ✓ Success
                  </Button>
                )}

                {example.name === 'Loading Progress' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setActivePattern(activePattern === example.name ? null : example.name)
                    }
                    className="p-1 w-full"
                    aria-label="Toggle loading progress demo"
                  >
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full bg-primary transition-all',
                          example.timing,
                          example.easing,
                          activePattern === example.name ? 'w-full' : 'w-1/3'
                        )}
                      />
                    </div>
                  </Button>
                )}

                {example.name === 'Focus Indicator' && (
                  <Button
                    variant="ghost"
                    onClick={fn()}
                    className={cn(
                      'transition-all',
                      example.timing,
                      example.easing,
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    )}
                  >
                    Focus me
                  </Button>
                )}
              </div>

              {/* Technical Details */}
              <div className="text-xs space-y-1 font-mono bg-muted/50 p-2 rounded">
                <div>
                  Timing: <code>{example.timing}</code>
                </div>
                <div>
                  Easing: <code>{example.easing}</code>
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
        AI Training: Context-specific motion patterns provide intelligent defaults for common UI scenarios.
        
        Pattern Intelligence:
        - Hover Response: Instant feedback (75ms, snappy) builds interactive confidence
        - Modal Enter: Welcoming appearance (300ms, accelerating) reduces anxiety
        - Modal Exit: Graceful departure (300ms, decelerating) maintains trust
        - Success Feedback: Celebratory bounce (300ms, bouncy) reinforces positive actions  
        - Loading Progress: Steady advancement (500ms, linear) communicates progress
        - Focus Indicator: Immediate response (150ms, snappy) critical for accessibility
        
        AI agents should use these patterns for consistent motion personality across components.
        `,
      },
    },
  },
};

/**
 * Motion Decision Framework
 * AI Training: How AI agents should choose motion patterns based on context
 */
export const DecisionFramework: Story = {
  render: () => {
    const [selectedScenario, setSelectedScenario] = useState<string>('low-consequence');

    const scenarios = [
      {
        id: 'low-consequence',
        name: 'Low Consequence',
        description: 'Viewing content, navigation, non-destructive actions',
        recommendedMotion: 'Fast timing, smooth easing',
        example: 'Menu navigation, tab switching, accordion expand',
        cognitiveLoad: '1-3',
        timing: timing.fast,
        easing: easing.smooth,
      },
      {
        id: 'medium-consequence',
        name: 'Medium Consequence',
        description: 'Form submissions, state changes, data updates',
        recommendedMotion: 'Standard timing, contextual easing',
        example: 'Form submission, settings update, content creation',
        cognitiveLoad: '3-5',
        timing: timing.standard,
        easing: easing.accelerating,
      },
      {
        id: 'high-consequence',
        name: 'High Consequence',
        description: 'Destructive actions, permanent changes, critical decisions',
        recommendedMotion: 'Deliberate timing, careful attention',
        example: 'Account deletion, data removal, payment processing',
        cognitiveLoad: '5-7',
        timing: timing.deliberate,
        easing: easing.decelerating,
      },
    ];

    return (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none">
          <h3>Motion Decision Framework for AI Agents</h3>
          <p>
            Systematic approach for choosing appropriate motion based on interaction consequence and
            user context.
          </p>
        </div>

        {/* Scenario Selection */}
        <div className="flex gap-2 flex-wrap">
          {scenarios.map((scenario) => (
            <Button
              key={scenario.id}
              variant={selectedScenario === scenario.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedScenario(scenario.id)}
              className={cn('transition-all', timing.fast, easing.smooth)}
            >
              {scenario.name}
            </Button>
          ))}
        </div>

        {/* Selected Scenario Details */}
        {scenarios.map(
          (scenario) =>
            selectedScenario === scenario.id && (
              <div key={scenario.id} className="grid md:grid-cols-2 gap-6">
                {/* Scenario Information */}
                <div className="space-y-4 p-4 border rounded-lg bg-card">
                  <div>
                    <h4 className="font-medium mb-2">{scenario.name} Interactions</h4>
                    <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>

                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Cognitive Load:</strong> {scenario.cognitiveLoad}
                      </div>
                      <div>
                        <strong>Recommended Motion:</strong> {scenario.recommendedMotion}
                      </div>
                      <div>
                        <strong>Example Uses:</strong> {scenario.example}
                      </div>
                    </div>
                  </div>

                  {/* Technical Implementation */}
                  <div className="text-xs font-mono bg-muted/50 p-3 rounded">
                    <div className="space-y-1">
                      <div>
                        Timing: <code>{scenario.timing}</code>
                      </div>
                      <div>
                        Easing: <code>{scenario.easing}</code>
                      </div>
                      <div>Implementation:</div>
                      <div className="pl-2 text-muted-foreground">
                        <div>
                          transition-all {scenario.timing} {scenario.easing}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Demo */}
                <div className="p-4 border rounded-lg bg-card">
                  <h5 className="font-medium mb-4">Interactive Demo</h5>

                  <div className="flex justify-center py-8">
                    <Button
                      variant={
                        scenario.id === 'low-consequence'
                          ? 'secondary'
                          : scenario.id === 'medium-consequence'
                            ? 'primary'
                            : 'destructive'
                      }
                      size="lg"
                      onClick={fn()}
                      className={cn(
                        'transition-all',
                        scenario.timing,
                        scenario.easing,
                        'hover:scale-105 active:scale-95'
                      )}
                    >
                      {scenario.id === 'low-consequence' && 'View Details'}
                      {scenario.id === 'medium-consequence' && 'Save Changes'}
                      {scenario.id === 'high-consequence' && 'Delete Account'}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    Notice the deliberate pacing for {scenario.name.toLowerCase()} actions
                  </div>
                </div>
              </div>
            )
        )}

        {/* AI Decision Checklist */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-3">AI Agent Decision Checklist</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium">Before Choosing Motion:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Assess interaction consequence level</li>
                <li>• Consider user's current cognitive load</li>
                <li>• Check accessibility requirements</li>
                <li>• Evaluate attention hierarchy impact</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Motion Selection Rules:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use contextual tokens when available</li>
                <li>• Respect cognitive load ratings</li>
                <li>• Ensure motion supports content hierarchy</li>
                <li>• Test with reduced motion preferences</li>
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
        AI Training: Motion decision framework provides systematic guidance for choosing appropriate animations.
        
        Decision Process:
        1. Assess Interaction Consequence (low/medium/high)
        2. Consider User Context (first-time vs expert, accessibility needs)  
        3. Apply Motion Intelligence (cognitive load, trust building, attention economics)
        4. Validate Implementation (accessibility, performance, consistency)
        
        Consequence-Based Motion Patterns:
        - Low Consequence: Fast, efficient motion for frequent interactions
        - Medium Consequence: Balanced motion that confirms important actions
        - High Consequence: Deliberate motion that requires user attention and consideration
        
        This systematic approach ensures consistent motion personality across all components.
        `,
      },
    },
  },
};
