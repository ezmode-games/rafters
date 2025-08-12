import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from '../../../components/Slider';

const meta = {
  title: 'Components/Slider/Variants',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Thumb Size Variants
 *
 * Different thumb sizes for various interaction contexts and motor accessibility needs.
 */
export const ThumbSizes: Story = {
  render: () => {
    const [values, setValues] = useState({
      default: [45],
      large: [65],
    });

    return (
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Thumb Size Variants</h3>

          {/* Default Thumb */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="thumb-default" className="text-sm font-medium">
                Default Thumb (20px)
              </label>
              <span className="text-sm text-muted-foreground font-mono">{values.default[0]}%</span>
            </div>
            <Slider
              id="thumb-default"
              value={values.default}
              onValueChange={(value) => setValues((prev) => ({ ...prev, default: value }))}
              thumbSize="default"
              max={100}
              showValue
              unit="%"
              aria-label="Default thumb size slider"
            />
            <p className="text-xs text-muted-foreground">
              Standard size for precise cursor control and desktop interfaces
            </p>
          </div>

          {/* Large Thumb */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="thumb-large" className="text-sm font-medium">
                Large Thumb (24px)
              </label>
              <span className="text-sm text-muted-foreground font-mono">{values.large[0]}%</span>
            </div>
            <Slider
              id="thumb-large"
              value={values.large}
              onValueChange={(value) => setValues((prev) => ({ ...prev, large: value }))}
              thumbSize="large"
              max={100}
              showValue
              unit="%"
              aria-label="Large thumb size slider"
            />
            <p className="text-xs text-muted-foreground">
              Enhanced size for touch interfaces and motor accessibility
            </p>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Usage Guidelines</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              • <strong>Default:</strong> Desktop interfaces, precise control needed
            </li>
            <li>
              • <strong>Large:</strong> Touch devices, accessibility requirements, mobile-first
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
          'Comparison of thumb size variants, showing when to use each size for optimal user experience.',
      },
    },
  },
};

/**
 * Track Size Variants
 *
 * Different track heights for targeting and visual emphasis.
 */
export const TrackSizes: Story = {
  render: () => {
    const [values, setValues] = useState({
      default: [35],
      large: [70],
    });

    return (
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Track Size Variants</h3>

          {/* Default Track */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="track-default" className="text-sm font-medium">
                Default Track (8px)
              </label>
              <span className="text-sm text-muted-foreground font-mono">{values.default[0]}%</span>
            </div>
            <Slider
              id="track-default"
              value={values.default}
              onValueChange={(value) => setValues((prev) => ({ ...prev, default: value }))}
              trackSize="default"
              max={100}
              aria-label="Default track size slider"
            />
            <p className="text-xs text-muted-foreground">
              Standard height for balanced visual weight and targeting
            </p>
          </div>

          {/* Large Track */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="track-large" className="text-sm font-medium">
                Large Track (12px)
              </label>
              <span className="text-sm text-muted-foreground font-mono">{values.large[0]}%</span>
            </div>
            <Slider
              id="track-large"
              value={values.large}
              onValueChange={(value) => setValues((prev) => ({ ...prev, large: value }))}
              trackSize="large"
              max={100}
              aria-label="Large track size slider"
            />
            <p className="text-xs text-muted-foreground">
              Enhanced height for easier targeting and visual prominence
            </p>
          </div>
        </div>

        {/* Visual Hierarchy Impact */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Visual Hierarchy Impact</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              • <strong>Default:</strong> Subtle presence, supports content hierarchy
            </li>
            <li>
              • <strong>Large:</strong> Prominent control, primary interaction element
            </li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Track size variants demonstrating visual weight and targeting considerations.',
      },
    },
  },
};

/**
 * Display Configuration Variants
 *
 * Different information display patterns for various precision needs.
 */
export const DisplayConfigurations: Story = {
  render: () => {
    const [values, setValues] = useState({
      minimal: [50],
      withValue: [75],
      withSteps: [3],
      complete: [25],
    });

    return (
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Display Configuration Variants</h3>

          {/* Minimal Display */}
          <div className="space-y-2">
            <label htmlFor="display-minimal" className="text-sm font-medium">
              Minimal Display
            </label>
            <Slider
              id="display-minimal"
              value={values.minimal}
              onValueChange={(value) => setValues((prev) => ({ ...prev, minimal: value }))}
              max={100}
              aria-label="Minimal display slider - no value shown"
            />
            <p className="text-xs text-muted-foreground">
              Clean appearance for contexts where precision isn't critical
            </p>
          </div>

          {/* With Value Display */}
          <div className="space-y-2">
            <label htmlFor="display-value" className="text-sm font-medium">
              With Value Display
            </label>
            <Slider
              id="display-value"
              value={values.withValue}
              onValueChange={(value) => setValues((prev) => ({ ...prev, withValue: value }))}
              max={100}
              showValue
              unit="%"
              aria-label="Slider with value display"
            />
            <p className="text-xs text-muted-foreground">
              Shows current value for precision control and immediate feedback
            </p>
          </div>

          {/* With Step Indicators */}
          <div className="space-y-2">
            <label htmlFor="display-steps" className="text-sm font-medium">
              With Step Indicators
            </label>
            <Slider
              id="display-steps"
              value={values.withSteps}
              onValueChange={(value) => setValues((prev) => ({ ...prev, withSteps: value }))}
              min={1}
              max={5}
              step={1}
              showSteps
              unit=" stars"
              aria-label="Slider with step indicators"
            />
            <p className="text-xs text-muted-foreground">
              Step markers for discrete value ranges and clear progression
            </p>
          </div>

          {/* Complete Configuration */}
          <div className="space-y-2">
            <label htmlFor="display-complete" className="text-sm font-medium">
              Complete Configuration
            </label>
            <Slider
              id="display-complete"
              value={values.complete}
              onValueChange={(value) => setValues((prev) => ({ ...prev, complete: value }))}
              min={0}
              max={100}
              step={5}
              showValue
              showSteps
              unit="%"
              thumbSize="large"
              trackSize="large"
              aria-label="Complete configuration slider"
            />
            <p className="text-xs text-muted-foreground">
              All features enabled for maximum precision and accessibility
            </p>
          </div>
        </div>

        {/* Configuration Guidelines */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Configuration Guidelines</h4>
          <div className="space-y-2">
            <div>
              <strong>Minimal:</strong> Volume, brightness - familiar controls
            </div>
            <div>
              <strong>With Value:</strong> Font size, margins - precision needed
            </div>
            <div>
              <strong>With Steps:</strong> Ratings, difficulty levels - discrete choices
            </div>
            <div>
              <strong>Complete:</strong> Professional tools, accessibility priority
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
          'Various display configurations showing how information density affects usability and cognitive load.',
      },
    },
  },
};

/**
 * Semantic Color Applications
 *
 * Shows how slider appearance can convey semantic meaning through design tokens.
 */
export const SemanticMeaning: Story = {
  render: () => {
    const [values, setValues] = useState({
      neutral: [50],
      success: [75],
      warning: [85],
      danger: [90],
    });

    return (
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Semantic Context Examples</h3>

          {/* Neutral Context */}
          <div className="space-y-2">
            <label htmlFor="semantic-neutral" className="text-sm font-medium">
              System Volume
            </label>
            <Slider
              id="semantic-neutral"
              value={values.neutral}
              onValueChange={(value) => setValues((prev) => ({ ...prev, neutral: value }))}
              max={100}
              showValue
              unit="%"
              aria-label="Neutral volume control"
            />
            <p className="text-xs text-muted-foreground">
              Standard primary colors for general-purpose controls
            </p>
          </div>

          {/* Success Context */}
          <div className="space-y-2">
            <label htmlFor="semantic-success" className="text-sm font-medium">
              Storage Available
            </label>
            <Slider
              id="semantic-success"
              value={values.success}
              onValueChange={(value) => setValues((prev) => ({ ...prev, success: value }))}
              max={100}
              showValue
              unit="%"
              className="[&_[role=slider]]:bg-success [&_.bg-primary]:bg-success"
              aria-label="Storage availability indicator"
            />
            <p className="text-xs text-muted-foreground">
              Success tokens when high values are positive (storage, performance)
            </p>
          </div>

          {/* Warning Context */}
          <div className="space-y-2">
            <label htmlFor="semantic-warning" className="text-sm font-medium">
              CPU Usage
            </label>
            <Slider
              id="semantic-warning"
              value={values.warning}
              onValueChange={(value) => setValues((prev) => ({ ...prev, warning: value }))}
              max={100}
              showValue
              unit="%"
              className="[&_[role=slider]]:bg-warning [&_.bg-primary]:bg-warning"
              aria-label="CPU usage warning level"
            />
            <p className="text-xs text-muted-foreground">
              Warning tokens when values enter caution range (CPU, memory)
            </p>
          </div>

          {/* Danger Context */}
          <div className="space-y-2">
            <label htmlFor="semantic-danger" className="text-sm font-medium">
              Temperature Alert
            </label>
            <Slider
              id="semantic-danger"
              value={values.danger}
              onValueChange={(value) => setValues((prev) => ({ ...prev, danger: value }))}
              max={100}
              showValue
              unit="°C"
              className="[&_[role=slider]]:bg-destructive [&_.bg-primary]:bg-destructive"
              aria-label="Temperature danger level"
            />
            <p className="text-xs text-muted-foreground">
              Destructive tokens when values indicate critical states
            </p>
          </div>
        </div>

        {/* Semantic Usage Guide */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Semantic Token Application</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Use design tokens to convey meaning beyond visual appearance</li>
            <li>• Consider what high/low values represent in context</li>
            <li>• Match color semantics to user mental models</li>
            <li>• Maintain accessibility with sufficient contrast</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Examples of how design tokens can be applied to convey semantic meaning and context in slider controls.',
      },
    },
  },
};
