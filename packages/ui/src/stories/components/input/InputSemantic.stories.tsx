import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Input } from '../../../components/Input';

/**
 * Semantic input variants communicate meaning through validation states and context.
 * They provide immediate understanding of data validity and required actions.
 */
const meta = {
  title: '03 Components/Forms/Input/Semantic Meaning & Context',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic input patterns that communicate specific meaning and context through validation states and contextual usage.',
      },
    },
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Success Communication
 *
 * Success states celebrate correct input and build user confidence.
 * They confirm progress and encourage continued engagement.
 */
export const SuccessCommunication: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Success Validation Patterns</h3>
      <div className="space-y-6">
        <div className="p-4 bg-success/5 border border-success/20 rounded-md">
          <h4 className="font-medium text-sm mb-3 text-success">Verified Information</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="verified-email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="verified-email"
                type="email"
                defaultValue="user@company.com"
                variant="success"
                showValidation={true}
                validationMessage="✓ Email verified and available"
                className="bg-[var(--validation-success-bg)] hover:opacity-[var(--validation-success-opacity)] transition-all duration-[var(--validation-success-timing)]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="strong-password" className="text-sm font-medium">
                Password Strength
              </label>
              <Input
                id="strong-password"
                type="password"
                defaultValue="SecurePass123!"
                variant="success"
                showValidation={true}
                validationMessage="✓ Strong password - excellent security"
                sensitive={true}
                className="bg-[var(--validation-success-bg)] hover:opacity-[var(--validation-success-opacity)] transition-all duration-[var(--validation-success-timing)] border-[var(--sensitivity-personal-border)]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="valid-phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="valid-phone"
                type="tel"
                defaultValue="+1 (555) 123-4567"
                variant="success"
                showValidation={true}
                validationMessage="✓ Valid US phone number format"
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Success states build confidence and confirm correct input formatting
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Success validation states that celebrate correct input and build user confidence through positive reinforcement.',
      },
    },
  },
};

/**
 * Warning Guidance
 *
 * Warning states provide helpful guidance without blocking progress.
 * They suggest improvements while allowing users to continue.
 */
export const WarningGuidance: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Warning and Guidance Patterns</h3>
      <div className="space-y-6">
        <div className="p-4 bg-warning/5 border border-warning/20 rounded-md">
          <h4 className="font-medium text-sm mb-3 text-warning">Suggestions for Improvement</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="weak-password" className="text-sm font-medium">
                Password Security
              </label>
              <Input
                id="weak-password"
                type="password"
                defaultValue="password123"
                variant="warning"
                showValidation={true}
                validationMessage="⚠ Consider adding symbols for stronger security"
                sensitive={true}
                className="bg-[var(--validation-warning-bg)] hover:opacity-[var(--validation-warning-opacity)] transition-all duration-[var(--validation-warning-timing)] border-[var(--sensitivity-personal-border)]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="informal-email" className="text-sm font-medium">
                Professional Email
              </label>
              <Input
                id="informal-email"
                type="email"
                defaultValue="cooluser99@gmail.com"
                variant="warning"
                showValidation={true}
                validationMessage="⚠ Consider using a professional email for business"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="incomplete-phone" className="text-sm font-medium">
                Phone Number Format
              </label>
              <Input
                id="incomplete-phone"
                type="tel"
                defaultValue="555-1234"
                variant="warning"
                showValidation={true}
                validationMessage="⚠ Include area code for better delivery"
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Warning states suggest improvements while allowing users to proceed
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Warning states that provide helpful guidance and suggestions without blocking user progress.',
      },
    },
  },
};

/**
 * Error Recovery
 *
 * Error states provide clear guidance for fixing invalid input.
 * They help users understand what went wrong and how to fix it.
 */
export const ErrorRecovery: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Error Recovery Patterns</h3>
      <div className="space-y-6">
        <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-md">
          <h4 className="font-medium text-sm mb-3 text-destructive">Input Validation Errors</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="invalid-email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="invalid-email"
                type="email"
                defaultValue="invalid-email"
                variant="error"
                showValidation={true}
                validationMessage="Please enter a valid email address (example: user@domain.com)"
                className="bg-[var(--validation-error-bg)] hover:opacity-[var(--validation-error-opacity)] transition-all duration-[var(--validation-error-timing)]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="short-password" className="text-sm font-medium">
                Password Requirements
              </label>
              <Input
                id="short-password"
                type="password"
                defaultValue="123"
                variant="error"
                showValidation={true}
                validationMessage="Password must be at least 8 characters long"
                sensitive={true}
                className="bg-[var(--validation-error-bg)] hover:opacity-[var(--validation-error-opacity)] transition-all duration-[var(--validation-error-timing)] border-[var(--sensitivity-personal-border)]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="invalid-phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="invalid-phone"
                type="tel"
                defaultValue="123-abc-def"
                variant="error"
                showValidation={true}
                validationMessage="Phone number should contain only numbers and standard formatting"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="required-field" className="text-sm font-medium">
                Required Field <span className="text-destructive">*</span>
              </label>
              <Input
                id="required-field"
                type="text"
                placeholder="This field is required"
                variant="error"
                showValidation={true}
                validationMessage="This field is required to continue"
                required
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Error states provide clear, actionable guidance for fixing validation issues
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Error recovery patterns that provide clear guidance for fixing validation issues with specific, actionable instructions.',
      },
    },
  },
};

/**
 * Contextual Usage
 *
 * Inputs organized by usage context communicate different purposes.
 * Context-specific validation and messaging patterns.
 */
export const ContextualUsage: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-medium mb-4">Context-Specific Input Patterns</h3>
      <div className="space-y-8">
        {/* Authentication Context */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
          <h4 className="font-medium text-sm mb-3">Authentication Context</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium">
                Email or Username
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email or username"
                variant="default"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                sensitive={true}
                variant="default"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Clean, secure inputs for authentication with trust indicators
          </p>
        </div>

        {/* Financial Context */}
        <div className="p-4 bg-warning/5 border border-warning/20 rounded-md">
          <h4 className="font-medium text-sm mb-3">Financial Information Context</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="card-number" className="text-sm font-medium">
                Card Number
              </label>
              <Input
                id="card-number"
                type="text"
                placeholder="1234 5678 9012 3456"
                sensitive={true}
                variant="success"
                showValidation={true}
                validationMessage="✓ Valid card number format"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="expiry" className="text-sm font-medium">
                  Expiry Date
                </label>
                <Input id="expiry" type="text" placeholder="MM/YY" sensitive={true} />
              </div>
              <div className="space-y-2">
                <label htmlFor="cvv" className="text-sm font-medium">
                  CVV
                </label>
                <Input id="cvv" type="password" placeholder="123" sensitive={true} maxLength={4} />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Enhanced security styling for financial data with validation feedback
          </p>
        </div>

        {/* Contact Context */}
        <div className="p-4 bg-success/5 border border-success/20 rounded-md">
          <h4 className="font-medium text-sm mb-3">Contact Information Context</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="first-name" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="first-name"
                  type="text"
                  placeholder="John"
                  variant="success"
                  showValidation={true}
                  validationMessage="✓ Valid name format"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="last-name" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Doe"
                  variant="success"
                  showValidation={true}
                  validationMessage="✓ Valid name format"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="contact-email"
                type="email"
                placeholder="john.doe@company.com"
                variant="success"
                showValidation={true}
                validationMessage="✓ Professional email format"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Success validation for complete contact information
          </p>
        </div>

        {/* Search Context */}
        <div className="p-4 bg-info/5 border border-info/20 rounded-md">
          <h4 className="font-medium text-sm mb-3">Search and Filter Context</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="search-query" className="text-sm font-medium">
                Search Products
              </label>
              <Input
                id="search-query"
                type="search"
                placeholder="Search for products, brands, or categories..."
                variant="default"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="min-price" className="text-sm font-medium">
                  Min Price
                </label>
                <Input id="min-price" type="number" placeholder="0.00" min="0" step="0.01" />
              </div>
              <div className="space-y-2">
                <label htmlFor="max-price" className="text-sm font-medium">
                  Max Price
                </label>
                <Input id="max-price" type="number" placeholder="1000.00" min="0" step="0.01" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Specialized inputs for search and filtering with appropriate input types
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Context-specific input patterns showing how semantic meaning changes based on usage context and data sensitivity.',
      },
    },
  },
};

/**
 * Semantic Comparison
 *
 * Side-by-side comparison helps understand semantic validation patterns
 * and appropriate usage for different input contexts and feedback types.
 */
export const SemanticComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Feedback */}
        <div className="space-y-3">
          <h4 className="font-medium">Positive Validation</h4>
          <div className="space-y-2">
            <Input
              type="email"
              defaultValue="user@example.com"
              variant="success"
              showValidation={true}
              validationMessage="✓ Valid email format"
              placeholder="Success state"
            />
            <p className="text-xs text-muted-foreground">
              Builds confidence through positive reinforcement
            </p>
          </div>
        </div>

        {/* Cautionary Feedback */}
        <div className="space-y-3">
          <h4 className="font-medium">Cautionary Guidance</h4>
          <div className="space-y-2">
            <Input
              type="password"
              defaultValue="weak123"
              variant="warning"
              showValidation={true}
              validationMessage="⚠ Consider stronger password"
              placeholder="Warning state"
              sensitive={true}
            />
            <p className="text-xs text-muted-foreground">
              Guides improvement without blocking progress
            </p>
          </div>
        </div>

        {/* Error Recovery */}
        <div className="space-y-3">
          <h4 className="font-medium">Error Recovery</h4>
          <div className="space-y-2">
            <Input
              type="email"
              defaultValue="invalid-email"
              variant="error"
              showValidation={true}
              validationMessage="Please enter valid email address"
              placeholder="Error state"
            />
            <p className="text-xs text-muted-foreground">
              Clear guidance for fixing validation issues
            </p>
          </div>
        </div>

        {/* Neutral State */}
        <div className="space-y-3">
          <h4 className="font-medium">Neutral Ready</h4>
          <div className="space-y-2">
            <Input type="text" variant="default" placeholder="Ready for input" />
            <p className="text-xs text-muted-foreground">Clean, approachable state for new input</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Different semantic states communicate meaning through color, iconography, and messaging tone
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comparison of different semantic validation states showing how each communicates specific meaning and guides user behavior.',
      },
    },
  },
};
