// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Slider } from '../../../components/Slider';

/**
 * Precision lives in the balance between control and simplicity. The slider transforms abstract values
 * into tangible, manipulable representations—bridging the gap between human intuition and digital precision.
 * Our slider system prioritizes motor accessibility and immediate feedback for trustworthy interactions.
 */
const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A precision control component that transforms abstract values into manipulable representations. Built with motor accessibility and trust-building feedback patterns.',
      },
    },
  },
  argTypes: {
    thumbSize: {
      control: 'select',
      options: ['default', 'large'],
      description: 'Motor accessibility: Enhanced thumb size for easier manipulation',
    },
    trackSize: {
      control: 'select',
      options: ['default', 'large'],
      description: 'Motor accessibility: Enhanced track height for easier targeting',
    },
    showValue: {
      control: 'boolean',
      description: 'Display current value with units for precision control',
    },
    showSteps: {
      control: 'boolean',
      description: 'Show step indicators for discrete value understanding',
    },
    unit: {
      control: 'text',
      description: 'Unit label for cognitive context (°, %, px, etc.)',
    },
    min: {
      control: 'number',
      description: 'Minimum value in the range',
    },
    max: {
      control: 'number',
      description: 'Maximum value in the range',
    },
    step: {
      control: 'number',
      description: 'Step increment for discrete value control',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state with reduced opacity',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for screen readers',
    },
  },
  args: { onValueChange: fn() },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Common: Story = {
  render: (args) => {
    const [values, setValues] = useState({
      volume: [75],
      brightness: [50],
      temperature: [72],
    });

    return (
      <div className="w-full max-w-md space-y-6 p-4">
        <div className="space-y-2">
          <label htmlFor="volume-control" className="text-sm font-medium">
            Volume Control
          </label>
          <Slider
            {...args}
            id="volume-control"
            value={values.volume}
            onValueChange={(value) => setValues((prev) => ({ ...prev, volume: value }))}
            max={100}
            unit="%"
            showValue
            aria-label="Audio volume level"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="brightness-control" className="text-sm font-medium">
            Screen Brightness
          </label>
          <Slider
            {...args}
            id="brightness-control"
            value={values.brightness}
            onValueChange={(value) => setValues((prev) => ({ ...prev, brightness: value }))}
            max={100}
            unit="%"
            thumbSize="default"
            aria-label="Display brightness level"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="temperature-control" className="text-sm font-medium">
            Temperature
          </label>
          <Slider
            {...args}
            id="temperature-control"
            value={values.temperature}
            onValueChange={(value) => setValues((prev) => ({ ...prev, temperature: value }))}
            min={60}
            max={85}
            unit="°F"
            showValue
            showSteps
            step={5}
            aria-label="Thermostat temperature setting"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Common slider configurations demonstrating different use cases: volume (percentage), brightness (simple), and temperature (discrete steps with units).',
      },
    },
  },
};

export const BasicRange: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic slider for simple value selection within a range.',
      },
    },
  },
};

export const WithValueDisplay: Story = {
  render: (args) => {
    const [value, setValue] = useState([25]);

    return (
      <div className="w-full max-w-sm">
        <Slider
          {...args}
          value={value}
          onValueChange={setValue}
          showValue
          unit="px"
          max={100}
          step={5}
          aria-label="Padding size control"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Slider with value display and units for precision control tasks.',
      },
    },
  },
};

export const WithStepIndicators: Story = {
  render: (args) => {
    const [value, setValue] = useState([3]);

    return (
      <div className="w-full max-w-sm">
        <Slider
          {...args}
          value={value}
          onValueChange={setValue}
          min={1}
          max={5}
          step={1}
          showValue
          showSteps
          unit=" stars"
          aria-label="Rating selection"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Discrete value slider with step indicators for clear value understanding.',
      },
    },
  },
};

export const MotorAccessibility: Story = {
  render: (args) => {
    const [value, setValue] = useState([50]);

    return (
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <label htmlFor="accessibility-control" className="text-sm font-medium">
            Large Touch Targets
          </label>
          <Slider
            {...args}
            id="accessibility-control"
            value={value}
            onValueChange={setValue}
            thumbSize="large"
            trackSize="large"
            showValue
            unit="%"
            aria-label="Motor accessibility enhanced slider"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Enhanced thumb and track sizes for improved motor accessibility. Minimum 44px touch
          targets on mobile devices.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Enhanced slider configuration for improved motor accessibility with larger touch targets.',
      },
    },
  },
};
