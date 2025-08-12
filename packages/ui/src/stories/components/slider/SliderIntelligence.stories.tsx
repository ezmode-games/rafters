import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from '../../../components/Slider';

const meta = {
  title: 'Components/Slider/Intelligence',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Cognitive Load Patterns
 *
 * Demonstrates how different slider configurations affect user cognitive load
 * and provides guidance for choosing appropriate patterns.
 */
export const CognitiveLoadPatterns: Story = {
  render: () => {
    const [values, setValues] = useState({
      low: [50], // Cognitive Load: 3/10
      medium: [25], // Cognitive Load: 5/10
      high: [3], // Cognitive Load: 7/10
    });

    return (
      <div className="w-full max-w-2xl space-y-8">
        {/* Low Cognitive Load - Simple Volume */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Low Cognitive Load (3/10)</h3>
            <p className="text-sm text-muted-foreground">
              Simple range, no precision required, familiar context
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="cognitive-load-volume" className="text-sm font-medium">
              Volume
            </label>
            <Slider
              id="cognitive-load-volume"
              value={values.low}
              onValueChange={(value) => setValues((prev) => ({ ...prev, low: value }))}
              max={100}
              aria-label="Simple volume control"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            No value display needed - users understand volume intuitively
          </div>
        </div>

        {/* Medium Cognitive Load - Precise Control */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Medium Cognitive Load (5/10)</h3>
            <p className="text-sm text-muted-foreground">
              Requires precision, value display reduces cognitive overhead
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="cognitive-load-fontsize" className="text-sm font-medium">
              Font Size
            </label>
            <Slider
              id="cognitive-load-fontsize"
              value={values.medium}
              onValueChange={(value) => setValues((prev) => ({ ...prev, medium: value }))}
              min={12}
              max={48}
              showValue
              unit="px"
              step={2}
              aria-label="Font size adjustment"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Value display with units provides immediate precision feedback
          </div>
        </div>

        {/* High Cognitive Load - Discrete Steps */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">High Cognitive Load (7/10)</h3>
            <p className="text-sm text-muted-foreground">
              Discrete values, multiple visual elements, requires understanding of steps
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="cognitive-load-priority" className="text-sm font-medium">
              Priority Level
            </label>
            <Slider
              id="cognitive-load-priority"
              value={values.high}
              onValueChange={(value) => setValues((prev) => ({ ...prev, high: value }))}
              min={1}
              max={5}
              step={1}
              showValue
              showSteps
              unit=" (Critical)"
              aria-label="Task priority level"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Step indicators increase processing load but provide valuable context
          </div>
        </div>

        {/* Intelligence Summary */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Cognitive Load Intelligence</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              • <strong>Simple sliders (3/10):</strong> Familiar contexts need minimal UI
            </li>
            <li>
              • <strong>Precise sliders (5/10):</strong> Show values to reduce guesswork
            </li>
            <li>
              • <strong>Complex sliders (7/10):</strong> Use sparingly, provide full context
            </li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how slider configuration choices directly impact user cognitive load and decision-making efficiency.',
      },
    },
  },
};

/**
 * Trust Building Through Immediate Feedback
 *
 * Shows how motion and visual feedback build user confidence
 * in slider interactions.
 */
export const TrustBuildingPatterns: Story = {
  render: () => {
    const [value, setValue] = useState([42]);
    const [focusedThumb, setFocusedThumb] = useState(false);

    return (
      <div className="w-full max-w-2xl space-y-8">
        {/* Trust Building Demo */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Trust Building Through Immediate Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Every interaction provides instant visual confirmation
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="trust-opacity" className="text-sm font-medium">
              Opacity Level
            </label>
            <Slider
              id="trust-opacity"
              value={value}
              onValueChange={setValue}
              max={100}
              showValue
              unit="%"
              thumbSize="large"
              onFocus={() => setFocusedThumb(true)}
              onBlur={() => setFocusedThumb(false)}
              aria-label="Opacity adjustment with trust feedback"
            />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded" style={{ opacity: value[0] / 100 }} />
              <span>Preview: {value[0]}% opacity</span>
            </div>
            {focusedThumb && (
              <span className="text-primary">Focus detected - enhanced feedback active</span>
            )}
          </div>
        </div>

        {/* Motion Intelligence Documentation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Motion Intelligence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Motion Tokens Used</h4>
              <ul className="text-sm space-y-1 font-mono">
                <li>
                  <code>contextTiming.hover</code> - {contextTiming.hover} (75ms)
                </li>
                <li>
                  <code>contextEasing.hover</code> - {contextEasing.hover}
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Trust Building Effects</h4>
              <ul className="text-sm space-y-1">
                <li>• Range fill animates during drag</li>
                <li>• Thumb scales 110% on hover</li>
                <li>• 95% scale on active press</li>
                <li>• Immediate value updates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Design Intelligence Integration */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Design Intelligence Principles Applied</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Trust Building:</strong>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Instant motion feedback (75ms)</li>
                <li>• Visual state confirmation</li>
                <li>• Predictable behavior patterns</li>
              </ul>
            </div>
            <div>
              <strong>Cognitive Load Reduction:</strong>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Real-time value display</li>
                <li>• Clear interaction affordances</li>
                <li>• Consistent motion timing</li>
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
        story:
          'Demonstrates how motion tokens and immediate feedback patterns build user trust and confidence in slider interactions.',
      },
    },
  },
};

/**
 * Motor Accessibility Intelligence
 *
 * Shows enhanced interaction patterns for different motor abilities
 * and device contexts.
 */
export const MotorAccessibilityIntelligence: Story = {
  render: () => {
    const [values, setValues] = useState({
      default: [50],
      enhanced: [50],
      precision: [2.5],
    });

    return (
      <div className="w-full max-w-2xl space-y-8">
        {/* Standard Motor Control */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Standard Motor Control</h3>
            <p className="text-sm text-muted-foreground">
              Default sizing for typical mouse/trackpad interaction
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="motor-brightness" className="text-sm font-medium">
              Standard Brightness
            </label>
            <Slider
              id="motor-brightness"
              value={values.default}
              onValueChange={(value) => setValues((prev) => ({ ...prev, default: value }))}
              max={100}
              unit="%"
              showValue
              aria-label="Standard motor control slider"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            20px thumb, 8px track - optimized for precise cursor control
          </div>
        </div>

        {/* Enhanced Motor Control */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Enhanced Motor Control</h3>
            <p className="text-sm text-muted-foreground">
              Larger targets for touch devices and motor accessibility needs
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="motor-volume" className="text-sm font-medium">
              Enhanced Volume
            </label>
            <Slider
              id="motor-volume"
              value={values.enhanced}
              onValueChange={(value) => setValues((prev) => ({ ...prev, enhanced: value }))}
              max={100}
              unit="%"
              showValue
              thumbSize="large"
              trackSize="large"
              aria-label="Enhanced motor control slider"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            24px thumb, 12px track - meets WCAG AAA motor accessibility guidelines
          </div>
        </div>

        {/* Precision Control */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Precision Control</h3>
            <p className="text-sm text-muted-foreground">
              Small steps with clear feedback for precise adjustments
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="motor-lineheight" className="text-sm font-medium">
              Line Height
            </label>
            <Slider
              id="motor-lineheight"
              value={values.precision}
              onValueChange={(value) => setValues((prev) => ({ ...prev, precision: value }))}
              min={1.0}
              max={4.0}
              step={0.1}
              showValue
              unit="em"
              thumbSize="large"
              aria-label="Precision line height control"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Small increments (0.1em) with enhanced thumb for precise typography control
          </div>
        </div>

        {/* Motor Accessibility Intelligence */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-3">Motor Accessibility Intelligence</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Touch Targets (Mobile):</strong>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Minimum 44px touch area (iOS/Android guidelines)</li>
                <li>• Enhanced thumb sizes for easier manipulation</li>
                <li>• Adequate spacing from other interactive elements</li>
              </ul>
            </div>
            <div>
              <strong>Precision Control:</strong>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Keyboard navigation (arrows, page up/down)</li>
                <li>• Fine-grained step controls</li>
                <li>• Value display for exact feedback</li>
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
        story:
          'Demonstrates motor accessibility patterns including enhanced touch targets and precision controls for diverse user needs.',
      },
    },
  },
};
