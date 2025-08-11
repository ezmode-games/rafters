import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from '../../../components/Slider';

const meta = {
  title: '03 Components/Input/Slider/Semantic',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Media and Audio Controls
 *
 * Common patterns for media player interfaces, audio mixing,
 * and multimedia applications.
 */
export const MediaControls: Story = {
  render: () => {
    const [values, setValues] = useState({
      volume: [75],
      balance: [0],
      bass: [50],
      treble: [60],
      playbackSpeed: [1.0],
    });

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Media and Audio Controls</h3>

        {/* Volume Control */}
        <div className="space-y-2">
          <label htmlFor="media-volume" className="text-sm font-medium">
            Master Volume
          </label>
          <Slider
            id="media-volume"
            value={values.volume}
            onValueChange={(value) => setValues((prev) => ({ ...prev, volume: value }))}
            max={100}
            showValue
            unit="%"
            thumbSize="large"
            aria-label="Master volume control"
          />
          <p className="text-xs text-muted-foreground">
            Familiar volume control - users expect 0-100% range
          </p>
        </div>

        {/* Audio Balance */}
        <div className="space-y-2">
          <label htmlFor="media-balance" className="text-sm font-medium">
            Audio Balance
          </label>
          <Slider
            id="media-balance"
            value={values.balance}
            onValueChange={(value) => setValues((prev) => ({ ...prev, balance: value }))}
            min={-100}
            max={100}
            showValue
            showSteps
            step={10}
            unit=""
            aria-label="Left-right audio balance"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Left</span>
            <span>Center</span>
            <span>Right</span>
          </div>
        </div>

        {/* Equalizer Controls */}
        <div className="space-y-4">
          <h4 className="font-medium">Equalizer</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="media-bass" className="text-sm font-medium">
                Bass
              </label>
              <Slider
                id="media-bass"
                value={values.bass}
                onValueChange={(value) => setValues((prev) => ({ ...prev, bass: value }))}
                max={100}
                showValue
                unit="%"
                aria-label="Bass level adjustment"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="media-treble" className="text-sm font-medium">
                Treble
              </label>
              <Slider
                id="media-treble"
                value={values.treble}
                onValueChange={(value) => setValues((prev) => ({ ...prev, treble: value }))}
                max={100}
                showValue
                unit="%"
                aria-label="Treble level adjustment"
              />
            </div>
          </div>
        </div>

        {/* Playback Speed */}
        <div className="space-y-2">
          <label htmlFor="media-playback" className="text-sm font-medium">
            Playback Speed
          </label>
          <Slider
            id="media-playback"
            value={values.playbackSpeed}
            onValueChange={(value) => setValues((prev) => ({ ...prev, playbackSpeed: value }))}
            min={0.5}
            max={2.0}
            step={0.1}
            showValue
            unit="x"
            thumbSize="large"
            aria-label="Playback speed control"
          />
          <p className="text-xs text-muted-foreground">
            Precise decimal control for media playback speed
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Media control patterns including volume, balance, equalizer, and playback speed adjustments.',
      },
    },
  },
};

/**
 * Settings and Preferences
 *
 * Common application settings patterns including system preferences,
 * accessibility options, and user customization controls.
 */
export const SettingsAndPreferences: Story = {
  render: () => {
    const [values, setValues] = useState({
      brightness: [70],
      fontSize: [16],
      animationSpeed: [300],
      notificationDelay: [5],
      autoSaveInterval: [2],
    });

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Settings and Preferences</h3>

        {/* Display Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Display Settings</h4>

          <div className="space-y-2">
            <label htmlFor="settings-brightness" className="text-sm font-medium">
              Screen Brightness
            </label>
            <Slider
              id="settings-brightness"
              value={values.brightness}
              onValueChange={(value) => setValues((prev) => ({ ...prev, brightness: value }))}
              max={100}
              showValue
              unit="%"
              aria-label="Screen brightness adjustment"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-fontsize" className="text-sm font-medium">
              Interface Font Size
            </label>
            <Slider
              id="settings-fontsize"
              value={values.fontSize}
              onValueChange={(value) => setValues((prev) => ({ ...prev, fontSize: value }))}
              min={12}
              max={24}
              step={2}
              showValue
              showSteps
              unit="px"
              thumbSize="large"
              aria-label="Interface font size"
            />
          </div>
        </div>

        {/* Performance Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Performance Settings</h4>

          <div className="space-y-2">
            <label htmlFor="settings-animation" className="text-sm font-medium">
              Animation Speed
            </label>
            <Slider
              id="settings-animation"
              value={values.animationSpeed}
              onValueChange={(value) => setValues((prev) => ({ ...prev, animationSpeed: value }))}
              min={100}
              max={1000}
              step={50}
              showValue
              unit="ms"
              aria-label="Animation duration setting"
            />
            <p className="text-xs text-muted-foreground">Lower values = faster animations</p>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Notification Settings</h4>

          <div className="space-y-2">
            <label htmlFor="settings-notification" className="text-sm font-medium">
              Notification Display Time
            </label>
            <Slider
              id="settings-notification"
              value={values.notificationDelay}
              onValueChange={(value) =>
                setValues((prev) => ({ ...prev, notificationDelay: value }))
              }
              min={1}
              max={15}
              step={1}
              showValue
              showSteps
              unit="s"
              aria-label="Notification display duration"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-autosave" className="text-sm font-medium">
              Auto-save Interval
            </label>
            <Slider
              id="settings-autosave"
              value={values.autoSaveInterval}
              onValueChange={(value) => setValues((prev) => ({ ...prev, autoSaveInterval: value }))}
              min={1}
              max={10}
              step={1}
              showValue
              showSteps
              unit="min"
              aria-label="Document auto-save interval"
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Application settings patterns including display, performance, and notification preferences.',
      },
    },
  },
};

/**
 * Creative and Design Tools
 *
 * Patterns for creative applications including image editors,
 * design tools, and artistic interfaces.
 */
export const CreativeTools: Story = {
  render: () => {
    const [values, setValues] = useState({
      brushSize: [25],
      opacity: [100],
      rotation: [0],
      saturation: [100],
      blur: [0],
    });

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Creative and Design Tools</h3>

        {/* Brush Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Brush Settings</h4>

          <div className="space-y-2">
            <label htmlFor="creative-brush" className="text-sm font-medium">
              Brush Size
            </label>
            <Slider
              id="creative-brush"
              value={values.brushSize}
              onValueChange={(value) => setValues((prev) => ({ ...prev, brushSize: value }))}
              min={1}
              max={100}
              showValue
              unit="px"
              thumbSize="large"
              aria-label="Brush size control"
            />
            <div className="flex items-center gap-2">
              <div
                className="bg-primary rounded-full"
                style={{
                  width: `${Math.max(4, values.brushSize[0] / 4)}px`,
                  height: `${Math.max(4, values.brushSize[0] / 4)}px`,
                }}
              />
              <span className="text-xs text-muted-foreground">Preview</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="creative-opacity" className="text-sm font-medium">
              Opacity
            </label>
            <Slider
              id="creative-opacity"
              value={values.opacity}
              onValueChange={(value) => setValues((prev) => ({ ...prev, opacity: value }))}
              max={100}
              showValue
              unit="%"
              aria-label="Brush opacity control"
            />
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 bg-primary rounded"
                style={{ opacity: values.opacity[0] / 100 }}
              />
              <span className="text-xs text-muted-foreground">Preview</span>
            </div>
          </div>
        </div>

        {/* Transform Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Transform Settings</h4>

          <div className="space-y-2">
            <label htmlFor="creative-rotation" className="text-sm font-medium">
              Rotation
            </label>
            <Slider
              id="creative-rotation"
              value={values.rotation}
              onValueChange={(value) => setValues((prev) => ({ ...prev, rotation: value }))}
              min={-180}
              max={180}
              step={15}
              showValue
              showSteps
              unit="°"
              thumbSize="large"
              aria-label="Rotation angle control"
            />
          </div>
        </div>

        {/* Color Adjustment */}
        <div className="space-y-4">
          <h4 className="font-medium">Color Adjustment</h4>

          <div className="space-y-2">
            <label htmlFor="creative-saturation" className="text-sm font-medium">
              Saturation
            </label>
            <Slider
              id="creative-saturation"
              value={values.saturation}
              onValueChange={(value) => setValues((prev) => ({ ...prev, saturation: value }))}
              max={200}
              showValue
              unit="%"
              aria-label="Color saturation adjustment"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="creative-blur" className="text-sm font-medium">
              Blur Radius
            </label>
            <Slider
              id="creative-blur"
              value={values.blur}
              onValueChange={(value) => setValues((prev) => ({ ...prev, blur: value }))}
              max={50}
              showValue
              unit="px"
              aria-label="Blur radius effect"
            />
          </div>
        </div>

        {/* Creative Tools Guidelines */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Creative Tool Patterns</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              • <strong>Visual Preview:</strong> Show immediate visual feedback when possible
            </li>
            <li>
              • <strong>Precision Control:</strong> Use large thumbs for fine adjustments
            </li>
            <li>
              • <strong>Meaningful Ranges:</strong> Set bounds that match real-world usage
            </li>
            <li>
              • <strong>Unit Display:</strong> Always show units for technical controls
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
          'Creative application patterns including brush settings, transforms, and color adjustments with visual previews.',
      },
    },
  },
};

/**
 * Data and Analytics
 *
 * Patterns for data filtering, analytics dashboards,
 * and business intelligence interfaces.
 */
export const DataAnalytics: Story = {
  render: () => {
    const [values, setValues] = useState({
      priceRange: [500, 1500], // Range slider would need custom implementation
      dateRange: [30],
      confidence: [95],
      threshold: [0.75],
      sampleSize: [1000],
    });

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Data and Analytics</h3>

        {/* Filtering Controls */}
        <div className="space-y-4">
          <h4 className="font-medium">Data Filtering</h4>

          <div className="space-y-2">
            <label htmlFor="data-price" className="text-sm font-medium">
              Price Filter (Max)
            </label>
            <Slider
              id="data-price"
              value={values.priceRange.slice(1)}
              onValueChange={(value) =>
                setValues((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], value[0]],
                }))
              }
              min={100}
              max={5000}
              step={100}
              showValue
              unit="$"
              aria-label="Maximum price filter"
            />
            <p className="text-xs text-muted-foreground">
              Filter products under ${values.priceRange[1]}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="data-timerange" className="text-sm font-medium">
              Time Range
            </label>
            <Slider
              id="data-timerange"
              value={values.dateRange}
              onValueChange={(value) => setValues((prev) => ({ ...prev, dateRange: value }))}
              min={1}
              max={365}
              step={7}
              showValue
              unit=" days"
              aria-label="Data time range filter"
            />
          </div>
        </div>

        {/* Analytics Parameters */}
        <div className="space-y-4">
          <h4 className="font-medium">Analytics Parameters</h4>

          <div className="space-y-2">
            <label htmlFor="data-confidence" className="text-sm font-medium">
              Confidence Level
            </label>
            <Slider
              id="data-confidence"
              value={values.confidence}
              onValueChange={(value) => setValues((prev) => ({ ...prev, confidence: value }))}
              min={50}
              max={99}
              step={5}
              showValue
              showSteps
              unit="%"
              aria-label="Statistical confidence level"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="data-threshold" className="text-sm font-medium">
              Detection Threshold
            </label>
            <Slider
              id="data-threshold"
              value={values.threshold}
              onValueChange={(value) => setValues((prev) => ({ ...prev, threshold: value }))}
              min={0.1}
              max={1.0}
              step={0.05}
              showValue
              unit=""
              thumbSize="large"
              aria-label="Anomaly detection threshold"
            />
            <p className="text-xs text-muted-foreground">Higher values = fewer false positives</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="data-samplesize" className="text-sm font-medium">
              Sample Size
            </label>
            <Slider
              id="data-samplesize"
              value={values.sampleSize}
              onValueChange={(value) => setValues((prev) => ({ ...prev, sampleSize: value }))}
              min={100}
              max={10000}
              step={500}
              showValue
              unit=" records"
              aria-label="Data sample size"
            />
          </div>
        </div>

        {/* Analytics Guidelines */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Data Analytics Patterns</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              • <strong>Range Filters:</strong> Use clear min/max bounds based on data distribution
            </li>
            <li>
              • <strong>Statistical Parameters:</strong> Provide context for technical settings
            </li>
            <li>
              • <strong>Real-time Updates:</strong> Consider performance impact of live filtering
            </li>
            <li>
              • <strong>Decimal Precision:</strong> Use appropriate step sizes for statistical
              accuracy
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
          'Data analytics patterns including filtering controls, statistical parameters, and business intelligence interfaces.',
      },
    },
  },
};

/**
 * Gaming and Interactive Media
 *
 * Patterns for gaming interfaces, interactive entertainment,
 * and simulation controls.
 */
export const GamingInteractive: Story = {
  render: () => {
    const [values, setValues] = useState({
      difficulty: [3],
      sensitivity: [50],
      quality: [75],
      fieldOfView: [90],
      musicVolume: [80],
    });

    return (
      <div className="w-full max-w-lg space-y-8">
        <h3 className="text-lg font-semibold">Gaming and Interactive Media</h3>

        {/* Game Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Game Settings</h4>

          <div className="space-y-2">
            <label htmlFor="gaming-difficulty" className="text-sm font-medium">
              Difficulty Level
            </label>
            <Slider
              id="gaming-difficulty"
              value={values.difficulty}
              onValueChange={(value) => setValues((prev) => ({ ...prev, difficulty: value }))}
              min={1}
              max={5}
              step={1}
              showValue
              showSteps
              unit=""
              thumbSize="large"
              aria-label="Game difficulty selection"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Easy</span>
              <span>Normal</span>
              <span>Hard</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="gaming-sensitivity" className="text-sm font-medium">
              Mouse Sensitivity
            </label>
            <Slider
              id="gaming-sensitivity"
              value={values.sensitivity}
              onValueChange={(value) => setValues((prev) => ({ ...prev, sensitivity: value }))}
              min={1}
              max={100}
              showValue
              unit="%"
              thumbSize="large"
              aria-label="Mouse sensitivity adjustment"
            />
          </div>
        </div>

        {/* Graphics Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Graphics Settings</h4>

          <div className="space-y-2">
            <label htmlFor="gaming-quality" className="text-sm font-medium">
              Graphics Quality
            </label>
            <Slider
              id="gaming-quality"
              value={values.quality}
              onValueChange={(value) => setValues((prev) => ({ ...prev, quality: value }))}
              max={100}
              step={25}
              showValue
              showSteps
              unit="%"
              aria-label="Graphics quality setting"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Ultra</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="gaming-fov" className="text-sm font-medium">
              Field of View
            </label>
            <Slider
              id="gaming-fov"
              value={values.fieldOfView}
              onValueChange={(value) => setValues((prev) => ({ ...prev, fieldOfView: value }))}
              min={60}
              max={120}
              step={10}
              showValue
              showSteps
              unit="°"
              thumbSize="large"
              aria-label="Camera field of view angle"
            />
          </div>
        </div>

        {/* Audio Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Audio Settings</h4>

          <div className="space-y-2">
            <label htmlFor="gaming-music" className="text-sm font-medium">
              Music Volume
            </label>
            <Slider
              id="gaming-music"
              value={values.musicVolume}
              onValueChange={(value) => setValues((prev) => ({ ...prev, musicVolume: value }))}
              max={100}
              showValue
              unit="%"
              aria-label="Background music volume"
            />
            <div className="w-full h-2 bg-secondary rounded-full mt-1">
              <div
                className="h-full bg-primary rounded-full transition-all duration-150"
                style={{ width: `${values.musicVolume[0]}%` }}
              />
            </div>
          </div>
        </div>

        {/* Gaming UI Guidelines */}
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Gaming Interface Patterns</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              • <strong>Large Touch Targets:</strong> Optimize for controller and gamepad input
            </li>
            <li>
              • <strong>Visual Feedback:</strong> Provide immediate feedback for setting changes
            </li>
            <li>
              • <strong>Discrete Levels:</strong> Use step indicators for quality/difficulty
              settings
            </li>
            <li>
              • <strong>Performance Impact:</strong> Consider real-time rendering costs
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
          'Gaming interface patterns including difficulty settings, graphics options, and interactive media controls.',
      },
    },
  },
};
