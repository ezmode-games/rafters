import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Slider } from '../../../components/Slider';

const meta = {
  title: 'Components/Slider/Properties',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Range and Step Properties
 *
 * Demonstrates how min, max, and step properties affect slider behavior
 * and user interaction patterns.
 */
export const RangeAndSteps: Story = {
  render: () => {
    const [values, setValues] = useState({
      percentage: [50], // 0-100, step 1
      decimal: [2.5], // 0-5, step 0.1
      negative: [-10], // -50 to 50, step 5
      large: [500], // 100-1000, step 25
    });

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Range and Step Configurations</h3>

        {/* Standard Percentage Range */}
        <div className="space-y-2">
          <label htmlFor="range-percentage" className="text-sm font-medium">
            Percentage (0-100%, step 1)
          </label>
          <Slider
            id="range-percentage"
            value={values.percentage}
            onValueChange={(value) => setValues((prev) => ({ ...prev, percentage: value }))}
            min={0}
            max={100}
            step={1}
            showValue
            unit="%"
            aria-label="Standard percentage slider"
          />
          <p className="text-xs text-muted-foreground">
            Most common pattern - integer percentages from 0 to 100
          </p>
        </div>

        {/* Decimal Precision Range */}
        <div className="space-y-2">
          <label htmlFor="range-decimal" className="text-sm font-medium">
            Line Height (1.0-5.0em, step 0.1)
          </label>
          <Slider
            id="range-decimal"
            value={values.decimal}
            onValueChange={(value) => setValues((prev) => ({ ...prev, decimal: value }))}
            min={1.0}
            max={5.0}
            step={0.1}
            showValue
            unit="em"
            thumbSize="large"
            aria-label="Decimal precision line height slider"
          />
          <p className="text-xs text-muted-foreground">
            Fine-grained control with decimal steps for precise typography adjustments
          </p>
        </div>

        {/* Negative Range */}
        <div className="space-y-2">
          <label htmlFor="range-negative" className="text-sm font-medium">
            Audio Balance (-50 to +50, step 5)
          </label>
          <Slider
            id="range-negative"
            value={values.negative}
            onValueChange={(value) => setValues((prev) => ({ ...prev, negative: value }))}
            min={-50}
            max={50}
            step={5}
            showValue
            showSteps
            aria-label="Audio balance with negative range"
          />
          <p className="text-xs text-muted-foreground">
            Ranges spanning negative to positive values with discrete steps
          </p>
        </div>

        {/* Large Number Range */}
        <div className="space-y-2">
          <label htmlFor="range-large" className="text-sm font-medium">
            Budget (100-1000, step 25)
          </label>
          <Slider
            id="range-large"
            value={values.large}
            onValueChange={(value) => setValues((prev) => ({ ...prev, large: value }))}
            min={100}
            max={1000}
            step={25}
            showValue
            unit="$"
            aria-label="Budget slider with large numbers"
          />
          <p className="text-xs text-muted-foreground">
            Large number ranges with meaningful step increments
          </p>
        </div>

        {/* Property Guidelines */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Range and Step Guidelines</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              • <strong>Step size:</strong> Should represent meaningful increments to users
            </li>
            <li>
              • <strong>Range bounds:</strong> Set logical minimums and maximums
            </li>
            <li>
              • <strong>Decimal precision:</strong> Use large thumbs for fine control
            </li>
            <li>
              • <strong>Large ranges:</strong> Consider logarithmic scaling for better UX
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
          'Various range and step configurations showing how to set up sliders for different value types and precision needs.',
      },
    },
  },
};

/**
 * Interactive States
 *
 * Shows different slider states including default, disabled, focused,
 * and error states with appropriate visual feedback.
 */
export const InteractiveStates: Story = {
  render: () => {
    const [values, setValues] = useState({
      normal: [60],
      focused: [40],
      disabled: [30],
    });

    const [focusedSlider, setFocusedSlider] = useState<string | null>(null);

    return (
      <div className="w-full max-w-md space-y-8">
        <h3 className="text-lg font-semibold">Interactive States</h3>

        {/* Normal State */}
        <div className="space-y-2">
          <label htmlFor="state-normal" className="text-sm font-medium">
            Normal State
          </label>
          <Slider
            id="state-normal"
            value={values.normal}
            onValueChange={(value) => setValues((prev) => ({ ...prev, normal: value }))}
            max={100}
            showValue
            unit="%"
            aria-label="Normal state slider"
          />
          <p className="text-xs text-muted-foreground">
            Default appearance with standard interaction feedback
          </p>
        </div>

        {/* Focused State */}
        <div className="space-y-2">
          <label htmlFor="state-focused" className="text-sm font-medium">
            Focused State (Click to focus)
          </label>
          <Slider
            id="state-focused"
            value={values.focused}
            onValueChange={(value) => setValues((prev) => ({ ...prev, focused: value }))}
            max={100}
            showValue
            unit="%"
            onFocus={() => setFocusedSlider('focused')}
            onBlur={() => setFocusedSlider(null)}
            className={focusedSlider === 'focused' ? 'ring-2 ring-ring ring-offset-2' : ''}
            aria-label="Focused state demonstration slider"
          />
          <p className="text-xs text-muted-foreground">
            {focusedSlider === 'focused'
              ? 'Focus ring visible - keyboard navigation enabled'
              : 'Focus ring appears when keyboard navigation is active'}
          </p>
        </div>

        {/* Disabled State */}
        <div className="space-y-2">
          <label htmlFor="state-disabled" className="text-sm font-medium text-muted-foreground">
            Disabled State
          </label>
          <Slider
            id="state-disabled"
            value={values.disabled}
            onValueChange={(value) => setValues((prev) => ({ ...prev, disabled: value }))}
            max={100}
            showValue
            unit="%"
            disabled
            aria-label="Disabled state slider - not interactive"
          />
          <p className="text-xs text-muted-foreground">
            Reduced opacity with pointer events disabled
          </p>
        </div>

        {/* State Behavior Documentation */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">State Behaviors</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              • <strong>Normal:</strong> Standard hover and active feedback
            </li>
            <li>
              • <strong>Focused:</strong> Ring outline for keyboard navigation
            </li>
            <li>
              • <strong>Disabled:</strong> Reduced opacity, no interactions
            </li>
            <li>
              • <strong>Error:</strong> Would use destructive color tokens
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
          'Interactive states showing visual feedback patterns and accessibility considerations for different slider conditions.',
      },
    },
  },
};

/**
 * Controlled vs Uncontrolled
 *
 * Demonstrates both controlled and uncontrolled slider patterns
 * with proper state management examples.
 */
export const ControlledVsUncontrolled: Story = {
  render: () => {
    const [controlledValue, setControlledValue] = useState([25]);
    const [syncedValues, setSyncedValues] = useState([50]);

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Controlled vs Uncontrolled Patterns</h3>

        {/* Controlled Component */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium">Controlled Component</h4>
            <p className="text-sm text-muted-foreground">State managed by parent component</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="controlled-volume" className="text-sm font-medium">
                Master Volume
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setControlledValue([0])}
                  className="px-2 py-1 text-xs bg-secondary rounded"
                >
                  Mute
                </button>
                <button
                  type="button"
                  onClick={() => setControlledValue([100])}
                  className="px-2 py-1 text-xs bg-secondary rounded"
                >
                  Max
                </button>
              </div>
            </div>

            <Slider
              id="controlled-volume"
              value={controlledValue}
              onValueChange={setControlledValue}
              max={100}
              showValue
              unit="%"
              aria-label="Controlled volume slider"
            />

            <p className="text-xs text-muted-foreground">
              Value: {controlledValue[0]}% - Can be controlled externally via buttons
            </p>
          </div>
        </div>

        {/* Uncontrolled Component */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium">Uncontrolled Component</h4>
            <p className="text-sm text-muted-foreground">Internal state with default value</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="uncontrolled-effect" className="text-sm font-medium">
              Effect Intensity
            </label>
            <Slider
              id="uncontrolled-effect"
              defaultValue={[75]}
              onValueChange={fn()}
              max={100}
              showValue
              unit="%"
              aria-label="Uncontrolled effect intensity slider"
            />
            <p className="text-xs text-muted-foreground">
              Self-managed state using defaultValue prop
            </p>
          </div>
        </div>

        {/* Synchronized Components */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium">Synchronized Components</h4>
            <p className="text-sm text-muted-foreground">Multiple sliders sharing the same state</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="synced-left" className="text-sm font-medium">
                Left Channel
              </label>
              <Slider
                id="synced-left"
                value={syncedValues}
                onValueChange={setSyncedValues}
                max={100}
                showValue
                unit="%"
                aria-label="Left audio channel"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="synced-right" className="text-sm font-medium">
                Right Channel
              </label>
              <Slider
                id="synced-right"
                value={syncedValues}
                onValueChange={setSyncedValues}
                max={100}
                showValue
                unit="%"
                aria-label="Right audio channel"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Both sliders share the same state - moving one updates both
            </p>
          </div>
        </div>

        {/* Implementation Guidelines */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Implementation Patterns</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              • <strong>Controlled:</strong> Use when you need external state management
            </li>
            <li>
              • <strong>Uncontrolled:</strong> Use for simple, self-contained sliders
            </li>
            <li>
              • <strong>Synchronized:</strong> Share state between related controls
            </li>
            <li>• Always provide accessible labels and descriptions</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Examples of controlled and uncontrolled slider patterns with proper state management and synchronization.',
      },
    },
  },
};

/**
 * Performance Considerations
 *
 * Shows how to handle performance optimization for sliders with
 * expensive operations or real-time updates.
 */
export const PerformanceOptimization: Story = {
  render: () => {
    const [immediateValue, setImmediateValue] = useState([50]);
    const [debouncedValue, setDebouncedValue] = useState([50]);
    const [throttledValue, setThrottledValue] = useState([50]);

    // Simulated expensive operation counter
    const [expensiveOperations, setExpensiveOperations] = useState(0);

    // Debounced handler simulation
    const handleDebouncedChange = (value: number[]) => {
      setDebouncedValue(value);
      // Simulate expensive operation
      setTimeout(() => {
        setExpensiveOperations((prev) => prev + 1);
      }, 100);
    };

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Performance Optimization Patterns</h3>

        {/* Immediate Updates */}
        <div className="space-y-2">
          <label htmlFor="perf-immediate" className="text-sm font-medium">
            Immediate Updates (Default)
          </label>
          <Slider
            id="perf-immediate"
            value={immediateValue}
            onValueChange={setImmediateValue}
            max={100}
            showValue
            unit="%"
            aria-label="Immediate update slider"
          />
          <p className="text-xs text-muted-foreground">
            Fires onValueChange on every movement - good for visual previews
          </p>
        </div>

        {/* Debounced Updates */}
        <div className="space-y-2">
          <label htmlFor="perf-debounced" className="text-sm font-medium">
            Debounced Updates
          </label>
          <Slider
            id="perf-debounced"
            value={debouncedValue}
            onValueChange={handleDebouncedChange}
            max={100}
            showValue
            unit="%"
            aria-label="Debounced update slider"
          />
          <p className="text-xs text-muted-foreground">
            Expensive operations triggered: {expensiveOperations} times
          </p>
          <p className="text-xs text-muted-foreground">
            Use debouncing for expensive operations (API calls, complex calculations)
          </p>
        </div>

        {/* Throttled Updates */}
        <div className="space-y-2">
          <label htmlFor="perf-throttled" className="text-sm font-medium">
            Throttled Updates
          </label>
          <Slider
            id="perf-throttled"
            value={throttledValue}
            onValueChange={setThrottledValue}
            max={100}
            showValue
            unit="%"
            aria-label="Throttled update slider"
          />
          <p className="text-xs text-muted-foreground">
            Use throttling for continuous updates (real-time data, animations)
          </p>
        </div>

        {/* Performance Guidelines */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Performance Optimization Guidelines</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <strong>Immediate Updates:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Visual previews (color, opacity)</li>
                <li>• Simple state updates</li>
                <li>• Local UI changes</li>
              </ul>
            </li>
            <li>
              <strong>Debounced Updates:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• API calls and network requests</li>
                <li>• Complex calculations</li>
                <li>• File operations</li>
              </ul>
            </li>
            <li>
              <strong>Throttled Updates:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Real-time data streaming</li>
                <li>• Continuous animations</li>
                <li>• High-frequency updates</li>
              </ul>
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
          'Performance optimization patterns for sliders handling expensive operations or high-frequency updates.',
      },
    },
  },
};
