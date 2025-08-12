import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Input } from '../../../components/Input';

/**
 * Properties shape behavior and interaction patterns.
 * Each property serves the interface's functional requirements.
 */
const meta = {
  title: 'Components/Input/Properties',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Properties that control validation, sensitivity, and behavioral characteristics of inputs within form contexts.',
      },
    },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Validation Modes
 *
 * Different validation timing strategies for optimal user experience.
 * Progressive feedback that guides without interrupting flow.
 */
export const ValidationModes: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Validation Timing Strategies</h3>
        <p className="text-sm text-muted-foreground">
          Different validation modes serve different interaction patterns and user needs
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-base font-medium">Live Validation</h4>
          <div className="space-y-2">
            <label htmlFor="live-validation" className="text-sm font-medium">
              Email (validates as you type)
            </label>
            <Input
              id="live-validation"
              type="email"
              placeholder="user@example.com"
              validationMode="live"
              variant="warning"
              showValidation={true}
              validationMessage="Enter a complete email address"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Immediate feedback for format-sensitive inputs like email and phone numbers
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">OnBlur Validation</h4>
          <div className="space-y-2">
            <label htmlFor="blur-validation" className="text-sm font-medium">
              Password (validates when you leave field)
            </label>
            <Input
              id="blur-validation"
              type="password"
              placeholder="Enter secure password"
              validationMode="onBlur"
              sensitive={true}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Validation triggers when user finishes with field, ideal for complex inputs
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">OnSubmit Validation</h4>
          <div className="space-y-2">
            <label htmlFor="submit-validation" className="text-sm font-medium">
              Comments (validates on form submission)
            </label>
            <Input
              id="submit-validation"
              type="text"
              placeholder="Enter your feedback"
              validationMode="onSubmit"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            No interruption during typing, validation only when form is submitted
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Different validation modes provide appropriate feedback timing for various input types and user interaction patterns.',
      },
    },
  },
};

/**
 * Validation States
 *
 * Visual feedback states that communicate input validity.
 * Clear, non-judgmental feedback that guides users toward success.
 */
export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Input Validation States</h3>
        <p className="text-sm text-muted-foreground">
          Clear visual feedback helps users understand input validity and next steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="default-state" className="text-sm font-medium">
              Default State
            </label>
            <Input
              id="default-state"
              type="text"
              placeholder="No validation feedback"
              variant="default"
            />
            <p className="text-xs text-muted-foreground">
              Clean, neutral state ready for user input
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="error-state" className="text-sm font-medium">
              Error State
            </label>
            <Input
              id="error-state"
              type="email"
              placeholder="invalid-email"
              variant="error"
              showValidation={true}
              validationMessage="Please enter a valid email address"
            />
            <p className="text-xs text-muted-foreground">
              Clear error communication with recovery guidance
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="success-state" className="text-sm font-medium">
              Success State
            </label>
            <Input
              id="success-state"
              type="email"
              defaultValue="user@example.com"
              variant="success"
              showValidation={true}
              validationMessage="Valid email format"
            />
            <p className="text-xs text-muted-foreground">
              Positive reinforcement builds confidence
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="warning-state" className="text-sm font-medium">
              Warning State
            </label>
            <Input
              id="warning-state"
              type="password"
              defaultValue="weak123"
              variant="warning"
              showValidation={true}
              validationMessage="Consider adding symbols for stronger security"
              sensitive={true}
            />
            <p className="text-xs text-muted-foreground">
              Helpful suggestions without blocking progress
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Validation states provide clear visual feedback about input validity with appropriate messaging for each state.',
      },
    },
  },
};

/**
 * Sensitive Data Handling
 *
 * Enhanced styling and security indicators for sensitive information.
 * Trust-building patterns that communicate secure handling.
 */
export const SensitiveDataHandling: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sensitive Data Indicators</h3>
        <p className="text-sm text-muted-foreground">
          Visual cues and enhanced styling communicate secure handling of sensitive information
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-base font-medium">Financial Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="card-number" className="text-sm font-medium">
                Credit Card Number
              </label>
              <Input
                id="card-number"
                type="text"
                placeholder="1234 5678 9012 3456"
                sensitive={true}
                className="border-[var(--sensitivity-financial-border)] shadow-[var(--sensitivity-financial-shadow)] hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-deliberate)]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cvv" className="text-sm font-medium">
                CVV
              </label>
              <Input
                id="cvv"
                type="password"
                placeholder="123"
                sensitive={true}
                maxLength={4}
                className="border-[var(--sensitivity-financial-border)] shadow-[var(--sensitivity-financial-shadow)] hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-deliberate)]"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Enhanced borders and security indicators for financial data
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Personal Identifiers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="ssn" className="text-sm font-medium">
                Social Security Number
              </label>
              <Input
                id="ssn"
                type="password"
                placeholder="XXX-XX-XXXX"
                sensitive={true}
                className="border-[var(--sensitivity-critical-border)] shadow-[var(--sensitivity-critical-shadow)] hover:opacity-[var(--opacity-hover-critical)] transition-all duration-[var(--duration-slow)]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="passport" className="text-sm font-medium">
                Passport Number
              </label>
              <Input
                id="passport"
                type="password"
                placeholder="Enter passport number"
                sensitive={true}
                className="border-[var(--sensitivity-critical-border)] shadow-[var(--sensitivity-critical-shadow)] hover:opacity-[var(--opacity-hover-critical)] transition-all duration-[var(--duration-slow)]"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Password masking and enhanced styling for personal identifiers
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Security Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="regular-field" className="text-sm font-medium">
                Regular Field
              </label>
              <Input
                id="regular-field"
                type="text"
                placeholder="Standard styling"
                sensitive={false}
              />
              <p className="text-xs text-muted-foreground">Standard appearance</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="sensitive-field" className="text-sm font-medium">
                Sensitive Field
              </label>
              <Input
                id="sensitive-field"
                type="text"
                placeholder="Enhanced security styling"
                sensitive={true}
                className="border-[var(--sensitivity-personal-border)] shadow-[var(--sensitivity-personal-shadow)] hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
              />
              <p className="text-xs text-muted-foreground">Enhanced security indicators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Sensitive data handling with enhanced visual styling and security indicators that build trust for financial and personal information.',
      },
    },
  },
};

/**
 * Input Types
 *
 * Specialized input types for different data formats.
 * Appropriate keyboards and validation for various content types.
 */
export const InputTypes: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Specialized Input Types</h3>
        <p className="text-sm text-muted-foreground">
          Different input types provide appropriate keyboards and validation for specific data
          formats
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="text-input" className="text-sm font-medium">
              Text
            </label>
            <Input id="text-input" type="text" placeholder="Any text content" />
          </div>

          <div className="space-y-2">
            <label htmlFor="email-input" className="text-sm font-medium">
              Email
            </label>
            <Input id="email-input" type="email" placeholder="user@example.com" />
          </div>

          <div className="space-y-2">
            <label htmlFor="password-input" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password-input"
              type="password"
              placeholder="Secure password"
              sensitive={true}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="search-input" className="text-sm font-medium">
              Search
            </label>
            <Input id="search-input" type="search" placeholder="Search for anything..." />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="tel-input" className="text-sm font-medium">
              Telephone
            </label>
            <Input id="tel-input" type="tel" placeholder="+1 (555) 123-4567" />
          </div>

          <div className="space-y-2">
            <label htmlFor="url-input" className="text-sm font-medium">
              URL
            </label>
            <Input id="url-input" type="url" placeholder="https://example.com" />
          </div>

          <div className="space-y-2">
            <label htmlFor="number-input" className="text-sm font-medium">
              Number
            </label>
            <Input id="number-input" type="number" placeholder="42" min="0" step="1" />
          </div>

          <div className="space-y-2">
            <label htmlFor="date-input" className="text-sm font-medium">
              Date
            </label>
            <Input id="date-input" type="date" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs text-muted-foreground">
          Each input type provides appropriate mobile keyboards and validation patterns
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Different input types provide specialized keyboards, validation, and interaction patterns for various data formats.',
      },
    },
  },
};

/**
 * Interactive States
 *
 * Different states communicate input availability and current status.
 * Clear feedback for all interaction possibilities.
 */
export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Input States</h3>
        <p className="text-sm text-muted-foreground">
          Clear visual feedback for different input states and interactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="empty-state" className="text-sm font-medium">
              Empty
            </label>
            <Input id="empty-state" type="text" placeholder="Ready for input" />
            <p className="text-xs text-muted-foreground">Ready for user input</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="hover-state" className="text-sm font-medium">
              Hover
            </label>
            <Input
              id="hover-state"
              type="text"
              placeholder="Hover over me"
              className="hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
            />
            <p className="text-xs text-muted-foreground">Visual feedback on hover</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="filled-state" className="text-sm font-medium">
              Filled
            </label>
            <Input id="filled-state" type="text" defaultValue="User content" />
            <p className="text-xs text-muted-foreground">Contains user input</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="focus-state" className="text-sm font-medium">
              Focus
            </label>
            <Input id="focus-state" type="text" placeholder="Click to focus" autoFocus />
            <p className="text-xs text-muted-foreground">Active focus with ring</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="disabled-state" className="text-sm font-medium">
              Disabled
            </label>
            <Input id="disabled-state" type="text" placeholder="Cannot interact" disabled />
            <p className="text-xs text-muted-foreground">Interaction not available</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="readonly-state" className="text-sm font-medium">
              Read Only
            </label>
            <Input id="readonly-state" type="text" value="Read-only content" readOnly />
            <p className="text-xs text-muted-foreground">Display only, no editing</p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Different interactive states provide clear visual feedback about input availability and current interaction state.',
      },
    },
  },
};
