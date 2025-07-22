import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Input } from '../../../components/Input';

const meta = {
  title: '03 Components/Forms/Input/Visual Variants',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Treatment
 *
 * The standard input treatment provides clean, accessible presentation for general use.
 * Use for most data entry scenarios with clear, neutral styling.
 */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-medium mb-4">Standard Input Treatment</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="default-text" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="default-text"
            type="text"
            placeholder="Enter your full name"
            variant="default"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="default-email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="default-email"
            type="email"
            placeholder="user@example.com"
            variant="default"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="default-search" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="default-search"
            type="search"
            placeholder="Search for anything..."
            variant="default"
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        Clean, neutral styling for general data entry and form interactions
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The default input variant provides clean, accessible presentation for general data entry with neutral styling.',
      },
    },
  },
};

/**
 * Sensitive Data Styling
 *
 * Enhanced visual treatment for sensitive information inputs.
 * Trust-building indicators communicate secure data handling.
 */
export const SensitiveData: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-medium mb-4">Sensitive Data Treatment</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="sensitive-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="sensitive-password"
            type="password"
            placeholder="Enter secure password"
            sensitive={true}
            className="border-[var(--sensitivity-financial-border)] shadow-[var(--sensitivity-financial-shadow)] hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="sensitive-card" className="text-sm font-medium">
            Credit Card Number
          </label>
          <Input
            id="sensitive-card"
            type="text"
            placeholder="1234 5678 9012 3456"
            sensitive={true}
            className="border-[var(--sensitivity-financial-border)] shadow-[var(--sensitivity-financial-shadow)] hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-standard)]"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="sensitive-ssn" className="text-sm font-medium">
            Social Security Number
          </label>
          <Input
            id="sensitive-ssn"
            type="password"
            placeholder="XXX-XX-XXXX"
            sensitive={true}
            className="border-[var(--sensitivity-critical-border)] shadow-[var(--sensitivity-critical-shadow)] hover:opacity-[var(--opacity-hover-critical)] transition-all duration-[var(--duration-deliberate)]"
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        Enhanced styling with security indicators for sensitive data fields
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Sensitive data inputs with enhanced visual styling and security indicators that build trust for financial and personal information.',
      },
    },
  },
};

/**
 * Validation Visual Hierarchy
 *
 * Different validation states create appropriate visual emphasis.
 * Clear communication of input validity through color and styling.
 */
export const ValidationHierarchy: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Validation State Hierarchy</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="success-variant" className="text-sm font-medium">
              Success State
            </label>
            <Input
              id="success-variant"
              type="email"
              defaultValue="user@example.com"
              variant="success"
              showValidation={true}
              validationMessage="✓ Valid email format"
              className="bg-[var(--validation-success-bg)] hover:opacity-[var(--validation-success-opacity)] transition-all duration-[var(--validation-success-timing)]"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="warning-variant" className="text-sm font-medium">
              Warning State
            </label>
            <Input
              id="warning-variant"
              type="password"
              defaultValue="weak123"
              variant="warning"
              showValidation={true}
              validationMessage="⚠ Consider stronger password"
              sensitive={true}
              className="bg-[var(--validation-warning-bg)] hover:opacity-[var(--validation-warning-opacity)] transition-all duration-[var(--validation-warning-timing)]"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="error-variant" className="text-sm font-medium">
              Error State
            </label>
            <Input
              id="error-variant"
              type="email"
              defaultValue="invalid-email"
              variant="error"
              showValidation={true}
              validationMessage="Please enter a valid email address"
              className="bg-[var(--validation-error-bg)] hover:opacity-[var(--validation-error-opacity)] transition-all duration-[var(--validation-error-timing)]"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="default-variant" className="text-sm font-medium">
              Default State
            </label>
            <Input
              id="default-variant"
              type="text"
              placeholder="Ready for input"
              variant="default"
            />
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        Visual hierarchy that matches validation importance through color and styling intensity
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Validation states create appropriate visual hierarchy to communicate input validity and guide user attention.',
      },
    },
  },
};

/**
 * Form Context Adaptations
 *
 * Input styling adapts to different form contexts and purposes.
 * Visual treatments that match the sensitivity and importance of data being collected.
 */
export const FormContextAdaptations: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <h3 className="text-lg font-medium mb-6">Context-Adapted Styling</h3>
      <div className="space-y-8">
        {/* Basic Contact Form */}
        <div className="p-4 bg-muted/10 rounded-md">
          <h4 className="font-medium text-sm mb-3">Basic Contact Form</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="First Name"
              variant="default"
            />
            <Input
              type="text"
              placeholder="Last Name"
              variant="default"
            />
            <Input
              type="email"
              placeholder="Email Address"
              variant="default"
              className="md:col-span-2"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Clean, approachable styling for basic information collection
          </p>
        </div>

        {/* Payment Form */}
        <div className="p-4 bg-warning/5 border border-warning/20 rounded-md">
          <h4 className="font-medium text-sm mb-3">Payment Information</h4>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Cardholder Name"
              sensitive={true}
            />
            <Input
              type="text"
              placeholder="1234 5678 9012 3456"
              sensitive={true}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="MM/YY"
                sensitive={true}
              />
              <Input
                type="password"
                placeholder="CVV"
                sensitive={true}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Enhanced security styling for financial data with trust indicators
          </p>
        </div>

        {/* Account Setup */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
          <h4 className="font-medium text-sm mb-3">Account Creation</h4>
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email Address"
              variant="success"
              showValidation={true}
              validationMessage="✓ Available for registration"
            />
            <Input
              type="password"
              placeholder="Create Password"
              variant="warning"
              showValidation={true}
              validationMessage="⚠ Add symbols for stronger security"
              sensitive={true}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              variant="success"
              showValidation={true}
              validationMessage="✓ Passwords match"
              sensitive={true}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Progressive validation feedback during account creation process
          </p>
        </div>

        {/* Search Interface */}
        <div className="p-4 bg-info/5 border border-info/20 rounded-md">
          <h4 className="font-medium text-sm mb-3">Search and Filtering</h4>
          <div className="space-y-3">
            <Input
              type="search"
              placeholder="Search products, brands, categories..."
              variant="default"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                type="number"
                placeholder="Min Price"
                min="0"
                step="0.01"
              />
              <Input
                type="number"
                placeholder="Max Price"
                min="0"
                step="0.01"
              />
              <Input
                type="text"
                placeholder="Brand"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Optimized styling for search and filter interactions
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Input styling adapts to different form contexts, providing appropriate visual treatment based on data sensitivity and purpose.',
      },
    },
  },
};

/**
 * Size and Touch Target Variants
 *
 * Input sizing adapts to different interface contexts and accessibility needs.
 * Consistent interaction areas across different use cases.
 */
export const SizeVariants: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Size and Touch Target Variants</h3>
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-base font-medium">Mobile-Optimized (44px)</h4>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enhanced for mobile touch"
              className="min-h-[44px]"
            />
            <p className="text-xs text-muted-foreground">
              Meets accessibility guidelines for touch targets on mobile devices
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Desktop Standard (40px)</h4>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Standard desktop sizing"
            />
            <p className="text-xs text-muted-foreground">
              Optimal for desktop interfaces with mouse and keyboard interaction
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Compact Density</h4>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Compact for dense layouts"
              className="h-8 py-1 text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Reduced height for dense forms and dashboard interfaces
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Generous Spacing</h4>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Spacious for important forms"
              className="h-12 py-3 text-base"
            />
            <p className="text-xs text-muted-foreground">
              Increased height for prominent forms and call-to-action contexts
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
          'Size variants provide appropriate touch targets and visual hierarchy for different interface contexts and accessibility needs.',
      },
    },
  },
};

/**
 * Visual Treatment Comparison
 *
 * Side-by-side comparison helps understand the visual hierarchy
 * and appropriate usage patterns for each variant.
 */
export const VisualComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-medium">Standard Treatment</h4>
          <Input
            type="text"
            placeholder="Clean, neutral styling"
            variant="default"
          />
          <p className="text-xs text-muted-foreground">
            Default styling for general use cases
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Sensitive Data</h4>
          <Input
            type="password"
            placeholder="Enhanced security styling"
            sensitive={true}
          />
          <p className="text-xs text-muted-foreground">
            Trust-building indicators for secure information
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Success Validation</h4>
          <Input
            type="email"
            defaultValue="user@example.com"
            variant="success"
            showValidation={true}
            validationMessage="✓ Valid format"
          />
          <p className="text-xs text-muted-foreground">
            Positive reinforcement for correct input
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Error Recovery</h4>
          <Input
            type="email"
            defaultValue="invalid-email"
            variant="error"
            showValidation={true}
            validationMessage="Fix email format"
          />
          <p className="text-xs text-muted-foreground">
            Clear guidance for fixing validation issues
          </p>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Visual treatments communicate different states and data sensitivity levels through styling and indicators
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of visual treatments showing how different variants communicate state, sensitivity, and validation status.',
      },
    },
  },
};