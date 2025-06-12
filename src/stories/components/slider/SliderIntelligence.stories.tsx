import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '../../../components/Slider';
import { useState } from 'react';

const meta = {
  title: '03 Components/Forms/Slider/Intelligence',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Motor Accessibility Story
export const MotorAccessibility: Story = {
  render: () => {
    const [volume, setVolume] = useState([75]);
    const [brightness, setBrightness] = useState([50]);
    
    return (
      <div className="space-y-8 p-6 max-w-lg">
        <div>
          <h3 className="text-lg font-semibold mb-4">Enhanced Touch Targets</h3>
          <p className="text-sm text-gray-600 mb-6">
            Larger thumb and track sizes improve manipulation for users with motor challenges
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              Volume Control (Standard)
            </label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={5}
              showValue={true}
              unit="%"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              Standard size with value display for precision
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Brightness Control (Enhanced)
            </label>
            <Slider
              value={brightness}
              onValueChange={setBrightness}
              max={100}
              step={10}
              thumbSize="large"
              trackSize="large"
              showValue={true}
              unit="%"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              Larger thumb and track for easier manipulation
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// Precision Control Story
export const PrecisionControl: Story = {
  render: () => {
    const [temperature, setTemperature] = useState([72]);
    const [opacity, setOpacity] = useState([0.8]);
    
    return (
      <div className="space-y-8 p-6 max-w-lg">
        <div>
          <h3 className="text-lg font-semibold mb-4">Precision and Context</h3>
          <p className="text-sm text-gray-600 mb-6">
            Value labels and step indicators help users understand and control precise values
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              Temperature Setting
            </label>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              min={60}
              max={85}
              step={1}
              showValue={true}
              showSteps={true}
              unit="°F"
              thumbSize="large"
              trackSize="large"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              Step indicators show available values clearly
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Opacity Level
            </label>
            <Slider
              value={opacity}
              onValueChange={setOpacity}
              min={0}
              max={1}
              step={0.1}
              showValue={true}
              unit=""
              thumbSize="large"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              Decimal precision with clear value feedback
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// Cognitive Load Optimization Story
export const CognitiveLoadOptimization: Story = {
  render: () => {
    const [budget, setBudget] = useState([2500]);
    const [duration, setDuration] = useState([30]);
    const [quality, setQuality] = useState([3]);
    
    const qualityLabels = ['Low', 'Medium', 'High', 'Premium', 'Ultra'];
    
    return (
      <div className="space-y-8 p-6 max-w-lg">
        <div>
          <h3 className="text-lg font-semibold mb-4">Context-Rich Controls</h3>
          <p className="text-sm text-gray-600 mb-6">
            Clear labels, units, and ranges reduce cognitive load for complex settings
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              Project Budget
            </label>
            <Slider
              value={budget}
              onValueChange={setBudget}
              min={1000}
              max={10000}
              step={250}
              showValue={true}
              unit="$"
              thumbSize="large"
              trackSize="large"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Minimum: $1,000</span>
              <span>Maximum: $10,000</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Project Duration
            </label>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={7}
              max={90}
              step={7}
              showValue={true}
              unit=" days"
              thumbSize="large"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 week</span>
              <span>~3 months</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Quality Level
            </label>
            <Slider
              value={quality}
              onValueChange={setQuality}
              min={0}
              max={4}
              step={1}
              showValue={false}
              thumbSize="large"
              trackSize="large"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {qualityLabels.map((label, index) => (
                <span 
                  key={label} 
                  className={quality[0] === index ? 'font-medium text-gray-900' : ''}
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Current: {qualityLabels[quality[0]]}
            </p>
          </div>
        </div>
      </div>
    );
  },
};
