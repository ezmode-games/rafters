import { contextEasing, contextTiming } from '@rafters/design-tokens/motion';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input } from '../../../components/Input';

const meta = {
  title: '03 Components/Forms/Input/Intelligence',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Validation Intelligence Story
export const ValidationIntelligence: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const validateEmail = (value: string) => {
      if (!value) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? '' : 'Please enter a valid email address';
    };

    const validatePassword = (value: string) => {
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      return '';
    };

    const emailError = submitted ? validateEmail(email) : '';
    const passwordError = submitted ? validatePassword(password) : '';

    return (
      <div className="space-y-6 p-6 max-w-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Prevention vs Recovery Patterns</h3>
          <p className="text-sm text-gray-600 mb-6">
            Intelligence prevents errors before they occur, rather than just showing them after
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant={emailError ? 'error' : email && !emailError ? 'success' : 'default'}
              validationMode="live"
              showValidation={submitted}
              validationMessage={emailError}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant={passwordError ? 'error' : password && !passwordError ? 'success' : 'default'}
              validationMode="onBlur"
              sensitive={true}
              showValidation={submitted}
              validationMessage={passwordError}
            />
          </div>

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Submit Form
          </button>
        </div>
      </div>
    );
  },
};

// Motor Accessibility Story
export const MotorAccessibility: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-md">
      <div>
        <h3 className="text-lg font-semibold mb-4">Enhanced Touch Targets</h3>
        <p className="text-sm text-gray-600 mb-6">
          44px minimum touch targets on mobile, 40px on desktop for motor accessibility
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="mobile-input" className="block text-sm font-medium mb-2">
            Mobile-Optimized Input
          </label>
          <Input
            id="mobile-input"
            placeholder="Touch target: 44px mobile, 40px desktop"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="search-input" className="block text-sm font-medium mb-2">
            Search Field
          </label>
          <Input
            id="search-input"
            type="search"
            placeholder="Enhanced for search interactions"
            className="w-full"
          />
        </div>
      </div>
    </div>
  ),
};

// Trust Building Story
export const TrustBuilding: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-md">
      <div>
        <h3 className="text-lg font-semibold mb-4">Trust-Building Patterns</h3>
        <p className="text-sm text-gray-600 mb-6">
          Visual indicators and enhanced styling for sensitive data inputs
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="credit-card" className="block text-sm font-medium mb-2">
            Credit Card Number
          </label>
          <Input
            id="credit-card"
            type="text"
            placeholder="1234 5678 9012 3456"
            sensitive={true}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">Enhanced border indicates secure field</p>
        </div>

        <div>
          <label htmlFor="ssn" className="block text-sm font-medium mb-2">
            Social Security Number
          </label>
          <Input
            id="ssn"
            type="password"
            placeholder="XXX-XX-XXXX"
            sensitive={true}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">Visual trust indicators for sensitive data</p>
        </div>

        <div>
          <label htmlFor="regular" className="block text-sm font-medium mb-2">
            Regular Field (for comparison)
          </label>
          <Input id="regular" type="text" placeholder="Standard styling" className="w-full" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Motion Intelligence
 *
 * Documents the motion design tokens and intelligence patterns used by Input components.
 * Shows how timing and easing choices support form validation and trust building.
 */
export const MotionIntelligence: Story = {
  render: () => {
    return (
      <div className="space-y-6 max-w-2xl p-6">
        {/* Motion Token Documentation */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Motion Tokens Used</h3>
          <ul className="text-sm space-y-1 font-mono">
            <li>
              <code>contextTiming.hover</code> - {contextTiming.hover} (75ms)
            </li>
            <li>
              <code>contextEasing.hover</code> - {contextEasing.hover} (snappy response)
            </li>
          </ul>
        </div>

        {/* Design Intelligence Integration */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Design Intelligence</h3>
          <ul className="text-sm space-y-1">
            <li>
              <strong>Cognitive Load:</strong> 2/10 - Simple data entry with immediate feedback
            </li>
            <li>
              <strong>Trust Building:</strong> Responsive transitions reduce form anxiety
            </li>
            <li>
              <strong>Form Flow:</strong> Smooth hover states encourage interaction
            </li>
          </ul>
        </div>

        {/* Interactive Demo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Motion Demonstration</h3>
          <div className="space-y-3">
            <Input placeholder="Hover and focus to experience motion intelligence" />
            <Input variant="success" value="Valid input" readOnly />
            <Input variant="error" value="Error state motion" readOnly />
          </div>
          <p className="text-sm text-muted-foreground">
            Input motion tokens provide instant 75ms feedback for hover and focus states, building
            trust through responsive form interactions without cognitive overhead.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Motion intelligence patterns showing how timing and easing tokens support Input component validation and trust-building interactions.',
      },
    },
  },
};
