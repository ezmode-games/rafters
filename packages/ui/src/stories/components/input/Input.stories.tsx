import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Input } from '../../../components/Input';

/**
 * Every form field is a moment of trust. The input component transforms data entry
 * into confident interactions through intelligent validation, trust-building patterns,
 * and error prevention strategies that support rather than judge.
 */
const meta = {
  title: '03 Components/Forms/Input',
  component: Input,
  tags: ['!autodocs', '!dev', 'test'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Intelligent data entry with progressive validation, trust-building patterns, and error prevention for confident form completion.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'Visual validation state for user feedback',
    },
    validationMode: {
      control: 'select',
      options: ['live', 'onBlur', 'onSubmit'],
      description: 'When to trigger validation feedback',
    },
    sensitive: {
      control: 'boolean',
      description: 'Enhanced styling for sensitive data fields',
    },
    showValidation: {
      control: 'boolean',
      description: 'Show validation message',
    },
    validationMessage: {
      control: 'text',
      description: 'Validation feedback message',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state prevents interaction',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
      description: 'Input type for appropriate keyboard and validation',
    },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Common input demonstrations showing validation intelligence and trust-building patterns.
 * Progressive validation states from entry to success with appropriate timing and feedback.
 */
export const Common: Story = {
  render: (args) => (
    <div className="space-y-8 max-w-2xl">
      <div className="text-sm text-muted-foreground mb-6">
        <strong>Input Intelligence:</strong> Basic → Validated → Secure → Sensitive with progressive
        trust-building patterns
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Input */}
        <div className="space-y-3">
          <h4 className="font-medium">Basic Text Input</h4>
          <div className="space-y-2">
            <label htmlFor="basic" className="text-sm font-medium">
              Full Name
            </label>
            <Input id="basic" {...args} placeholder="Enter your full name" variant="default" />
          </div>
          <p className="text-xs text-muted-foreground">
            Standard input with clean, accessible design
          </p>
        </div>

        {/* Email with Validation */}
        <div className="space-y-3">
          <h4 className="font-medium">Email with Validation</h4>
          <div className="space-y-2">
            <label htmlFor="email-validated" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email-validated"
              {...args}
              type="email"
              placeholder="user@example.com"
              variant="success"
              showValidation={true}
              validationMessage="Valid email format"
              validationMode="onBlur"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Success state with positive validation feedback
          </p>
        </div>

        {/* Password with Security */}
        <div className="space-y-3">
          <h4 className="font-medium">Secure Password</h4>
          <div className="space-y-2">
            <label htmlFor="password-secure" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password-secure"
              {...args}
              type="password"
              placeholder="Enter secure password"
              sensitive={true}
              variant="default"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Trust-building indicators for sensitive data
          </p>
        </div>

        {/* Error State */}
        <div className="space-y-3">
          <h4 className="font-medium">Error Recovery</h4>
          <div className="space-y-2">
            <label htmlFor="error-input" className="text-sm font-medium">
              Credit Card
            </label>
            <Input
              id="error-input"
              {...args}
              type="text"
              placeholder="1234 5678 9012 3456"
              variant="error"
              showValidation={true}
              validationMessage="Card number must be 16 digits"
              validationMode="live"
              sensitive={true}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Helpful error guidance with recovery support
          </p>
        </div>
      </div>

      {/* Validation States */}
      <div className="space-y-4">
        <h4 className="font-medium">Validation States</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label htmlFor="input-default" className="text-sm text-muted-foreground">
              Default
            </label>
            <Input {...args} id="input-default" placeholder="Default state" variant="default" />
          </div>
          <div className="space-y-2">
            <label htmlFor="input-success" className="text-sm text-muted-foreground">
              Success
            </label>
            <Input
              {...args}
              id="input-success"
              placeholder="Valid input"
              variant="success"
              showValidation={true}
              validationMessage="✓ Looks good"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="input-warning" className="text-sm text-muted-foreground">
              Warning
            </label>
            <Input
              {...args}
              id="input-warning"
              placeholder="Needs attention"
              variant="warning"
              showValidation={true}
              validationMessage="Check format"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="input-error" className="text-sm text-muted-foreground">
              Error
            </label>
            <Input
              {...args}
              id="input-error"
              placeholder="Invalid input"
              variant="error"
              showValidation={true}
              validationMessage="Required field"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Clear visual feedback for all validation states
        </p>
      </div>

      {/* Input Types */}
      <div className="space-y-4">
        <h4 className="font-medium">Specialized Input Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="input-search" className="text-sm font-medium">
              Search
            </label>
            <Input {...args} id="input-search" type="search" placeholder="Search for anything..." />
          </div>
          <div className="space-y-2">
            <label htmlFor="input-tel" className="text-sm font-medium">
              Telephone
            </label>
            <Input {...args} id="input-tel" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          <div className="space-y-2">
            <label htmlFor="input-url" className="text-sm font-medium">
              URL
            </label>
            <Input {...args} id="input-url" type="url" placeholder="https://example.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="input-number" className="text-sm font-medium">
              Number
            </label>
            <Input
              {...args}
              id="input-number"
              type="number"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Specialized types provide appropriate keyboards and validation
        </p>
      </div>

      {/* Trust Levels */}
      <div className="space-y-4">
        <h4 className="font-medium">Trust Level Examples</h4>
        <div className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-md">
            <h5 className="text-sm font-medium mb-3">Low Trust - Basic Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input {...args} placeholder="First name" />
              <Input {...args} placeholder="Company (optional)" />
            </div>
          </div>

          <div className="p-4 bg-warning/5 border border-warning/20 rounded-md">
            <h5 className="text-sm font-medium mb-3">Medium Trust - Contact Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input {...args} type="email" placeholder="work@company.com" />
              <Input {...args} type="tel" placeholder="+1 (555) 123-4567" />
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
            <h5 className="text-sm font-medium mb-3">High Trust - Secure Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input {...args} type="password" placeholder="Password" sensitive={true} />
              <Input {...args} type="text" placeholder="1234 5678 9012 3456" sensitive={true} />
            </div>
          </div>

          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-md">
            <h5 className="text-sm font-medium mb-3">Critical Trust - Sensitive Data</h5>
            <div className="grid grid-cols-1 gap-3">
              <Input {...args} type="password" placeholder="SSN: XXX-XX-XXXX" sensitive={true} />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Trust levels determine visual emphasis and security indicators
        </p>
      </div>

      {/* States */}
      <div className="space-y-4">
        <h4 className="font-medium">Interaction States</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="input-normal" className="text-sm text-muted-foreground">
              Normal
            </label>
            <Input {...args} id="input-normal" placeholder="Ready for input" />
          </div>
          <div className="space-y-2">
            <label htmlFor="input-filled" className="text-sm text-muted-foreground">
              Filled
            </label>
            <Input {...args} id="input-filled" defaultValue="User entered content" />
          </div>
          <div className="space-y-2">
            <label htmlFor="input-disabled" className="text-sm text-muted-foreground">
              Disabled
            </label>
            <Input {...args} id="input-disabled" placeholder="Not available" disabled />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Clear visual feedback for different interaction states
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete overview of input intelligence patterns showing validation states, trust levels, and specialized input types for confident data entry.',
      },
    },
  },
};
