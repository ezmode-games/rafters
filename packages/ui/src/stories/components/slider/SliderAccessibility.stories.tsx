import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from '../../../components/Slider';

const meta = {
  title: '03 Components/Input/Slider/Accessibility',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * WCAG AAA Compliance
 *
 * Demonstrates WCAG AAA accessibility compliance including proper ARIA attributes,
 * keyboard navigation, screen reader support, and motor accessibility features.
 */
export const WCAGCompliance: Story = {
  render: () => {
    const [values, setValues] = useState({
      volume: [75],
      contrast: [85],
      textSize: [18],
    });

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">WCAG AAA Compliance Features</h3>

        {/* Properly Labeled Slider */}
        <div className="space-y-2">
          <label htmlFor="volume-control" className="text-sm font-medium">
            System Volume
          </label>
          <Slider
            id="volume-control"
            value={values.volume}
            onValueChange={(value) => setValues((prev) => ({ ...prev, volume: value }))}
            max={100}
            showValue
            unit="%"
            thumbSize="large" // Enhanced for motor accessibility
            aria-label="System volume level control"
            aria-describedby="volume-description"
          />
          <p id="volume-description" className="text-xs text-muted-foreground">
            Adjust the master volume level for all system sounds. Use arrow keys for fine control.
          </p>
        </div>

        {/* High Contrast Mode */}
        <div className="space-y-2">
          <label htmlFor="contrast-control" className="text-sm font-medium">
            Display Contrast
          </label>
          <Slider
            id="contrast-control"
            value={values.contrast}
            onValueChange={(value) => setValues((prev) => ({ ...prev, contrast: value }))}
            max={100}
            showValue
            unit="%"
            thumbSize="large"
            trackSize="large" // Enhanced track for easier targeting
            aria-label="Display contrast adjustment for improved visibility"
            aria-describedby="contrast-description"
            className="focus-visible:ring-4 focus-visible:ring-blue-500" // Enhanced focus indicator
          />
          <p id="contrast-description" className="text-xs text-muted-foreground">
            Increase contrast to improve text readability. Higher values provide better visibility.
          </p>
        </div>

        {/* Text Size Accessibility */}
        <div className="space-y-2">
          <label htmlFor="text-size-control" className="text-sm font-medium">
            Interface Text Size
          </label>
          <Slider
            id="text-size-control"
            value={values.textSize}
            onValueChange={(value) => setValues((prev) => ({ ...prev, textSize: value }))}
            min={12}
            max={32}
            step={2}
            showValue
            showSteps
            unit="px"
            thumbSize="large"
            trackSize="large"
            aria-label="Interface text size for improved readability"
            aria-describedby="text-size-description"
            aria-valuemin={12}
            aria-valuemax={32}
            aria-valuenow={values.textSize[0]}
            aria-valuetext={`${values.textSize[0]} pixels`}
          />
          <p id="text-size-description" className="text-xs text-muted-foreground">
            Adjust text size throughout the interface. Recommended minimum is 16px for
            accessibility.
          </p>
        </div>

        {/* WCAG Compliance Checklist */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-3">WCAG AAA Compliance Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <h5 className="font-medium text-green-600">✓ Implemented</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Proper ARIA labels and descriptions</li>
                <li>• Enhanced 44px touch targets (mobile)</li>
                <li>• High contrast focus indicators</li>
                <li>• Keyboard navigation support</li>
                <li>• Screen reader value announcements</li>
                <li>• Semantic HTML structure</li>
                <li>• Motion respects prefers-reduced-motion</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Keyboard Navigation</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  • <kbd>Tab</kbd> - Focus slider
                </li>
                <li>
                  • <kbd>←/→</kbd> - Decrease/increase by step
                </li>
                <li>
                  • <kbd>↑/↓</kbd> - Increase/decrease by step
                </li>
                <li>
                  • <kbd>Page Up/Down</kbd> - Large increments
                </li>
                <li>
                  • <kbd>Home/End</kbd> - Min/max values
                </li>
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
          'Comprehensive WCAG AAA accessibility compliance demonstration including proper ARIA attributes, enhanced touch targets, and keyboard navigation.',
      },
    },
  },
};

/**
 * Screen Reader Support
 *
 * Demonstrates optimal screen reader support including proper value announcements,
 * context descriptions, and navigation guidance.
 */
export const ScreenReaderSupport: Story = {
  render: () => {
    const [values, setValues] = useState({
      temperature: [72],
      timer: [5],
      security: [8],
    });

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Screen Reader Optimization</h3>

        {/* Temperature Control with Rich Context */}
        <div className="space-y-2">
          <label htmlFor="thermostat" className="text-sm font-medium">
            Thermostat Temperature
          </label>
          <Slider
            id="thermostat"
            value={values.temperature}
            onValueChange={(value) => setValues((prev) => ({ ...prev, temperature: value }))}
            min={60}
            max={85}
            step={1}
            showValue
            unit="°F"
            thumbSize="large"
            aria-label={`Thermostat temperature control, currently ${values.temperature[0]} degrees Fahrenheit`}
            aria-describedby="thermostat-guidance"
            aria-valuemin={60}
            aria-valuemax={85}
            aria-valuenow={values.temperature[0]}
            aria-valuetext={`${values.temperature[0]} degrees Fahrenheit. ${
              values.temperature[0] < 68
                ? 'Cool temperature'
                : values.temperature[0] > 76
                  ? 'Warm temperature'
                  : 'Comfortable temperature'
            }`}
          />
          <div id="thermostat-guidance" className="text-xs text-muted-foreground">
            <p>Set your desired room temperature between 60°F and 85°F.</p>
            <p>
              Current setting:{' '}
              {values.temperature[0] < 68
                ? 'Cool'
                : values.temperature[0] > 76
                  ? 'Warm'
                  : 'Comfortable'}
            </p>
          </div>
        </div>

        {/* Timer with Time Context */}
        <div className="space-y-2">
          <label htmlFor="sleep-timer" className="text-sm font-medium">
            Sleep Timer
          </label>
          <Slider
            id="sleep-timer"
            value={values.timer}
            onValueChange={(value) => setValues((prev) => ({ ...prev, timer: value }))}
            min={1}
            max={60}
            step={5}
            showValue
            showSteps
            unit=" min"
            thumbSize="large"
            aria-label={`Sleep timer duration, currently ${values.timer[0]} minutes`}
            aria-describedby="timer-guidance"
            aria-valuemin={1}
            aria-valuemax={60}
            aria-valuenow={values.timer[0]}
            aria-valuetext={`${values.timer[0]} minutes. Timer will activate in ${values.timer[0]} minutes.`}
          />
          <div id="timer-guidance" className="text-xs text-muted-foreground">
            <p>Set how long to wait before automatically turning off the device.</p>
            <p>
              Timer will activate in {values.timer[0]} minute{values.timer[0] !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>

        {/* Security Level with Qualitative Feedback */}
        <div className="space-y-2">
          <label htmlFor="security-level" className="text-sm font-medium">
            Security Level
          </label>
          <Slider
            id="security-level"
            value={values.security}
            onValueChange={(value) => setValues((prev) => ({ ...prev, security: value }))}
            min={1}
            max={10}
            step={1}
            showValue
            showSteps
            thumbSize="large"
            aria-label={`Security level control, currently level ${values.security[0]} out of 10`}
            aria-describedby="security-guidance"
            aria-valuemin={1}
            aria-valuemax={10}
            aria-valuenow={values.security[0]}
            aria-valuetext={`Security level ${values.security[0]} out of 10. ${
              values.security[0] <= 3
                ? 'Low security - faster access but less protection'
                : values.security[0] <= 6
                  ? 'Medium security - balanced protection and convenience'
                  : 'High security - maximum protection with additional verification steps'
            }`}
          />
          <div id="security-guidance" className="text-xs text-muted-foreground">
            <p>Choose your security level from 1 (low) to 10 (high).</p>
            <p>
              Current level:{' '}
              {values.security[0] <= 3
                ? 'Low - Fast access, minimal protection'
                : values.security[0] <= 6
                  ? 'Medium - Balanced protection and convenience'
                  : 'High - Maximum protection with additional verification'}
            </p>
          </div>
        </div>

        {/* Screen Reader Guidelines */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-3">Screen Reader Best Practices</h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium">Required ARIA Attributes</h5>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>
                  • <code>aria-label</code> - Descriptive control purpose
                </li>
                <li>
                  • <code>aria-describedby</code> - Link to help text
                </li>
                <li>
                  • <code>aria-valuemin/max/now</code> - Current state
                </li>
                <li>
                  • <code>aria-valuetext</code> - Contextual value description
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium">Value Announcements</h5>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Announce current value on focus</li>
                <li>• Provide context for numeric values</li>
                <li>• Include units and qualitative descriptions</li>
                <li>• Update aria-valuetext dynamically</li>
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
          'Screen reader optimization patterns including rich ARIA attributes, contextual value descriptions, and proper navigation guidance.',
      },
    },
  },
};

/**
 * Keyboard Navigation
 *
 * Comprehensive keyboard navigation patterns including standard navigation keys,
 * focus management, and keyboard-only interaction workflows.
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const [values, setValues] = useState({
      volume: [50],
      zoom: [100],
      playback: [1.0],
    });

    const [lastKeyPressed, setLastKeyPressed] = useState<string>('');
    const [focusedSlider, setFocusedSlider] = useState<string>('');

    const handleKeyDown = (event: React.KeyboardEvent, sliderId: string) => {
      const key = event.key;
      setLastKeyPressed(`${sliderId}: ${key}`);

      // Let the slider handle the key event naturally
      // This is just for demonstration purposes
    };

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Keyboard Navigation Patterns</h3>

        {/* Volume Control with Keyboard Demo */}
        <div className="space-y-2">
          <label htmlFor="keyboard-volume" className="text-sm font-medium">
            Volume Control (Try keyboard navigation)
          </label>
          <Slider
            id="keyboard-volume"
            value={values.volume}
            onValueChange={(value) => setValues((prev) => ({ ...prev, volume: value }))}
            max={100}
            showValue
            unit="%"
            thumbSize="large"
            trackSize="large"
            onFocus={() => setFocusedSlider('volume')}
            onBlur={() => setFocusedSlider('')}
            onKeyDown={(e) => handleKeyDown(e, 'volume')}
            aria-label="Volume control with keyboard navigation"
            className="focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          />
          <p className="text-xs text-muted-foreground">
            Use ←→ or ↑↓ arrows, Page Up/Down, or Home/End keys
          </p>
        </div>

        {/* Zoom Control with Precision */}
        <div className="space-y-2">
          <label htmlFor="keyboard-zoom" className="text-sm font-medium">
            Zoom Level (Precision control)
          </label>
          <Slider
            id="keyboard-zoom"
            value={values.zoom}
            onValueChange={(value) => setValues((prev) => ({ ...prev, zoom: value }))}
            min={25}
            max={400}
            step={25}
            showValue
            showSteps
            unit="%"
            thumbSize="large"
            onFocus={() => setFocusedSlider('zoom')}
            onBlur={() => setFocusedSlider('')}
            onKeyDown={(e) => handleKeyDown(e, 'zoom')}
            aria-label="Zoom level with 25% increments"
            className="focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          />
          <p className="text-xs text-muted-foreground">
            25% increments - arrows change by one step, Page Up/Down by larger amounts
          </p>
        </div>

        {/* Playback Speed with Decimal Precision */}
        <div className="space-y-2">
          <label htmlFor="keyboard-playback" className="text-sm font-medium">
            Playback Speed (Fine control)
          </label>
          <Slider
            id="keyboard-playback"
            value={values.playback}
            onValueChange={(value) => setValues((prev) => ({ ...prev, playback: value }))}
            min={0.5}
            max={3.0}
            step={0.1}
            showValue
            unit="x"
            thumbSize="large"
            onFocus={() => setFocusedSlider('playback')}
            onBlur={() => setFocusedSlider('')}
            onKeyDown={(e) => handleKeyDown(e, 'playback')}
            aria-label="Media playback speed with 0.1x increments"
            className="focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          />
          <p className="text-xs text-muted-foreground">
            0.1x increments - precise control with arrow keys
          </p>
        </div>

        {/* Keyboard Interaction Status */}
        {focusedSlider && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Focused:</strong> {focusedSlider} slider
            </p>
            {lastKeyPressed && (
              <p className="text-sm text-blue-600">
                <strong>Last key:</strong> {lastKeyPressed}
              </p>
            )}
          </div>
        )}

        {/* Keyboard Navigation Guide */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-3">Keyboard Navigation Reference</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium">Navigation Keys</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  • <kbd>Tab</kbd> - Move focus to slider
                </li>
                <li>
                  • <kbd>Shift + Tab</kbd> - Move focus away
                </li>
                <li>
                  • <kbd>Esc</kbd> - Remove focus (if needed)
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Value Control</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  • <kbd>←/→</kbd> - Decrease/increase by step
                </li>
                <li>
                  • <kbd>↓/↑</kbd> - Decrease/increase by step
                </li>
                <li>
                  • <kbd>Page Down/Up</kbd> - Large decrements/increments
                </li>
                <li>
                  • <kbd>Home/End</kbd> - Minimum/maximum value
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> All keyboard interactions respect the slider's step value and
              min/max bounds. Large increments (Page Up/Down) typically move by 10% of the total
              range.
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive keyboard navigation demonstration showing all supported key combinations and focus management patterns.',
      },
    },
  },
};

/**
 * Motor Accessibility
 *
 * Specialized patterns for users with motor disabilities including
 * enhanced touch targets, reduced precision requirements, and alternative interaction modes.
 */
export const MotorAccessibility: Story = {
  render: () => {
    const [values, setValues] = useState({
      coarse: [50],
      sticky: [75],
      assisted: [25],
    });

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Motor Accessibility Features</h3>

        {/* Coarse Interaction Mode */}
        <div className="space-y-2">
          <label htmlFor="coarse-control" className="text-sm font-medium">
            Coarse Control (Large targets, big steps)
          </label>
          <Slider
            id="coarse-control"
            value={values.coarse}
            onValueChange={(value) => setValues((prev) => ({ ...prev, coarse: value }))}
            max={100}
            step={10} // Larger steps reduce precision requirements
            showValue
            showSteps
            unit="%"
            thumbSize="large" // Enhanced thumb for easier targeting
            trackSize="large" // Enhanced track for easier targeting
            className="py-6" // Extra padding for larger interaction area
            aria-label="Coarse control with large targets and 10% steps"
            aria-describedby="coarse-description"
          />
          <div id="coarse-description" className="text-xs text-muted-foreground">
            <p>
              Large touch targets (24px thumb, 12px track) with 10% steps for reduced precision
              requirements.
            </p>
            <p>Enhanced padding provides larger interaction area beyond the visual control.</p>
          </div>
        </div>

        {/* Sticky Interaction Mode */}
        <div className="space-y-2">
          <label htmlFor="sticky-control" className="text-sm font-medium">
            Sticky Values (Snaps to common values)
          </label>
          <Slider
            id="sticky-control"
            value={values.sticky}
            onValueChange={(value) => setValues((prev) => ({ ...prev, sticky: value }))}
            max={100}
            step={25} // Discrete steps that "snap" to common values
            showValue
            showSteps
            unit="%"
            thumbSize="large"
            trackSize="large"
            className="py-4"
            aria-label="Sticky control that snaps to 25% increments"
            aria-describedby="sticky-description"
          />
          <div id="sticky-description" className="text-xs text-muted-foreground">
            <p>
              Snaps to 25% increments (0%, 25%, 50%, 75%, 100%) reducing precision requirements.
            </p>
            <p>Common for volume controls and settings that benefit from discrete levels.</p>
          </div>
        </div>

        {/* Switch-Controlled Interaction */}
        <div className="space-y-2">
          <label htmlFor="assisted-control" className="text-sm font-medium">
            Switch-Accessible (Button controls + slider)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setValues((prev) => ({
                  ...prev,
                  assisted: [Math.max(0, prev.assisted[0] - 25)],
                }))
              }
              className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm"
              aria-label="Decrease assisted control by 25%"
            >
              −25%
            </button>
            <div className="flex-1">
              <Slider
                id="assisted-control"
                value={values.assisted}
                onValueChange={(value) => setValues((prev) => ({ ...prev, assisted: value }))}
                max={100}
                step={25}
                showValue
                unit="%"
                thumbSize="large"
                trackSize="large"
                aria-label="Assisted control with button alternatives"
                aria-describedby="assisted-description"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setValues((prev) => ({
                  ...prev,
                  assisted: [Math.min(100, prev.assisted[0] + 25)],
                }))
              }
              className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm"
              aria-label="Increase assisted control by 25%"
            >
              +25%
            </button>
          </div>
          <div id="assisted-description" className="text-xs text-muted-foreground">
            <p>Alternative button controls for users who cannot use the slider directly.</p>
            <p>Buttons provide same functionality with switch-accessible interface.</p>
          </div>
        </div>

        {/* Motor Accessibility Guidelines */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-3">Motor Accessibility Guidelines</h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium">Touch Target Standards</h5>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Minimum 44px touch targets (iOS/Android guidelines)</li>
                <li>• Enhanced thumbs (24px) and tracks (12px) for better targeting</li>
                <li>• Adequate spacing between interactive elements</li>
                <li>• Extra padding to expand interaction area</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium">Interaction Alternatives</h5>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Button controls for users who cannot drag</li>
                <li>• Keyboard navigation with arrow keys</li>
                <li>• Voice control support through proper ARIA</li>
                <li>• Switch navigation compatibility</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium">Precision Considerations</h5>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Larger step sizes reduce precision requirements</li>
                <li>• Sticky/snap values for common settings</li>
                <li>• Discrete levels instead of continuous ranges</li>
                <li>• Clear visual feedback for all interactions</li>
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
          'Motor accessibility features including enhanced touch targets, alternative interaction methods, and reduced precision requirements.',
      },
    },
  },
};
