import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

const Label = ({
  children,
  htmlFor,
  variant = 'default',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  htmlFor?: string;
  variant?: 'field' | 'hint' | 'error' | 'success' | 'meta' | 'status';
  className?: string;
  [key: string]: unknown;
}) => {
  const baseClasses = 'text-sm';
  const variantClasses = {
    field: 'font-medium',
    hint: 'text-muted-foreground',
    error: 'text-destructive',
    success: 'text-green-600',
    meta: 'text-xs text-muted-foreground',
    status: 'text-xs font-medium',
  };

  return (
    <label
      htmlFor={htmlFor}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

/**
 * Semantic label patterns communicate meaning and context through information delivery.
 * They create understanding by matching communication patterns to user mental models.
 */
const meta = {
  title: '03 Components/Forms/Label/Semantic Meaning & Context',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic label patterns that communicate specific meaning and context through information delivery that matches user expectations and mental models.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Information Hierarchy Communication
 *
 * Labels create clear information hierarchy through semantic relationships
 * and contextual layering that guides user understanding.
 */
export const InformationHierarchy: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-medium mb-6">Semantic Information Hierarchy</h3>
      <div className="space-y-8">
        {/* Primary Information Layer */}
        <section>
          <h4 className="text-base font-medium mb-4">Primary Information Layer</h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="primary-email" variant="field">
                Email Address
              </Label>
              <Input id="primary-email" type="email" placeholder="user@example.com" />
              <p className="text-xs text-muted-foreground">
                Essential field identification that users need for task completion
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-payment" variant="field">
                Payment Method
              </Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Credit Card
                </Button>
                <Button variant="outline" size="sm">
                  PayPal
                </Button>
                <Button variant="outline" size="sm">
                  Bank Transfer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Critical decision points get primary label treatment
              </p>
            </div>
          </div>
        </section>

        {/* Secondary Context Layer */}
        <section>
          <h4 className="text-base font-medium mb-4">Secondary Context Layer</h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="context-recovery" variant="field">
                Recovery Email Address
              </Label>
              <Label variant="hint">
                We'll use this to help you recover your account if needed
              </Label>
              <Input id="context-recovery" type="email" placeholder="recovery@example.com" />
              <p className="text-xs text-muted-foreground">
                Contextual information helps users understand purpose and value
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context-phone" variant="field">
                Phone Number
              </Label>
              <Label variant="hint">For important account security notifications only</Label>
              <Input id="context-phone" type="tel" placeholder="+1 (555) 123-4567" />
              <p className="text-xs text-muted-foreground">
                Context reduces user anxiety about data usage
              </p>
            </div>
          </div>
        </section>

        {/* Tertiary Support Layer */}
        <section>
          <h4 className="text-base font-medium mb-4">Tertiary Support Layer</h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="support-photo" variant="field">
                  Profile Photo
                </Label>
                <Label variant="meta">Optional • Max 5MB</Label>
              </div>
              <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
                <Button variant="outline" size="sm">
                  Choose Photo
                </Button>
              </div>
              <Label variant="hint">JPG, PNG, or GIF format recommended</Label>
              <Label variant="meta">Last updated: Never</Label>
              <p className="text-xs text-muted-foreground">
                Supporting information provides additional context without overwhelming primary
                tasks
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Information Hierarchy</h4>
        <p className="text-xs text-muted-foreground">
          <strong>Primary:</strong> Essential task completion information
          <br />
          <strong>Secondary:</strong> Contextual guidance and purpose explanation
          <br />
          <strong>Tertiary:</strong> Supporting details and meta information
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Information hierarchy patterns that layer label communication to guide user understanding without overwhelming primary tasks.',
      },
    },
  },
};

/**
 * Contextual Communication Patterns
 *
 * Labels adapt their communication style and content based on specific
 * interface contexts and user task requirements.
 */
export const ContextualCommunication: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <h3 className="text-lg font-medium mb-6">Context-Adaptive Label Patterns</h3>
      <div className="space-y-8">
        {/* Authentication Context */}
        <section>
          <h4 className="text-base font-medium mb-4">Authentication Context</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-md">
              <h5 className="text-sm font-medium mb-4">Sign In Form</h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" variant="field">
                    Email or Username
                  </Label>
                  <Input id="signin-email" type="text" placeholder="Enter your email or username" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" variant="field">
                    Password
                  </Label>
                  <Input id="signin-password" type="password" placeholder="Enter your password" />
                  <Label variant="hint">
                    <a href="/forgot-password" className="text-primary hover:underline">
                      Forgot your password?
                    </a>
                  </Label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Simple, direct labels for quick access to existing accounts
              </p>
            </div>

            <div className="p-4 border rounded-md">
              <h5 className="text-sm font-medium mb-4">Account Creation</h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-email" variant="field">
                    Email Address
                  </Label>
                  <Label variant="hint">We'll send a verification link to this address</Label>
                  <Input id="create-email" type="email" placeholder="user@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-password" variant="field">
                    Create Password
                  </Label>
                  <Label variant="hint">
                    Must be at least 8 characters with numbers and symbols
                  </Label>
                  <Input id="create-password" type="password" placeholder="Enter secure password" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                More detailed guidance for first-time users who need context
              </p>
            </div>
          </div>
        </section>

        {/* Financial Context */}
        <section>
          <h4 className="text-base font-medium mb-4">Financial Information Context</h4>
          <div className="p-4 border border-warning/20 bg-warning/5 rounded-md">
            <h5 className="text-sm font-medium mb-4">Payment Information</h5>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="financial-card" variant="field">
                  Credit Card Number
                </Label>
                <Label variant="hint">Your payment information is encrypted and secure</Label>
                <Input id="financial-card" type="text" placeholder="1234 5678 9012 3456" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="financial-expiry" variant="field">
                    Expiry Date
                  </Label>
                  <Input id="financial-expiry" type="text" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financial-cvv" variant="field">
                    Security Code
                  </Label>
                  <Label variant="hint">3 digits on back of card</Label>
                  <Input id="financial-cvv" type="password" placeholder="123" />
                </div>
              </div>

              <Label variant="meta">
                🔒 SSL encrypted • Your information is never stored on our servers
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Security-focused messaging builds trust for sensitive financial data
            </p>
          </div>
        </section>

        {/* Content Creation Context */}
        <section>
          <h4 className="text-base font-medium mb-4">Content Creation Context</h4>
          <div className="p-4 border rounded-md">
            <h5 className="text-sm font-medium mb-4">Article Publishing</h5>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-title" variant="field">
                  Article Title
                </Label>
                <Label variant="hint">Keep it under 60 characters for best SEO results</Label>
                <Input id="content-title" type="text" placeholder="Enter your article title" />
                <Label variant="meta">Character count: 0/60</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-excerpt" variant="field">
                  Article Excerpt
                </Label>
                <Label variant="hint">
                  Brief summary that appears in search results and social shares
                </Label>
                <Input
                  id="content-excerpt"
                  type="text"
                  placeholder="Write a compelling summary..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content-featured" variant="field">
                    Featured Image
                  </Label>
                  <Label variant="meta">Recommended: 1200×630px</Label>
                </div>
                <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
                  <Button variant="outline" size="sm">
                    Upload Image
                  </Button>
                </div>
                <Label variant="hint">
                  High-quality images get more engagement on social media
                </Label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Content creation labels provide optimization guidance and best practices
            </p>
          </div>
        </section>

        {/* System Configuration Context */}
        <section>
          <h4 className="text-base font-medium mb-4">System Configuration Context</h4>
          <div className="p-4 border rounded-md bg-muted/10">
            <h5 className="text-sm font-medium mb-4">API Configuration</h5>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="config-endpoint" variant="field">
                  API Endpoint URL
                </Label>
                <Label variant="hint">Must be HTTPS for production environments</Label>
                <Input id="config-endpoint" type="url" placeholder="https://api.example.com/v1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="config-key" variant="field">
                  API Key
                </Label>
                <Label variant="hint">Generate new keys in your developer dashboard</Label>
                <Input id="config-key" type="password" placeholder="sk_live_..." />
                <Label variant="meta">Keys are encrypted and only visible to administrators</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="config-timeout" variant="field">
                  Request Timeout (seconds)
                </Label>
                <Label variant="hint">Recommended: 30 seconds for external APIs</Label>
                <Input id="config-timeout" type="number" placeholder="30" min="1" max="300" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Technical configuration requires precise guidance and constraint explanation
            </p>
          </div>
        </section>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Contextual communication patterns that adapt label content and style to match specific interface contexts and user task requirements.',
      },
    },
  },
};

/**
 * Progressive Information Disclosure
 *
 * Labels reveal information at appropriate levels of detail,
 * building user understanding through layered communication patterns.
 */
export const ProgressiveDisclosure: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-medium mb-6">Progressive Information Disclosure</h3>
      <div className="space-y-8">
        {/* Basic → Enhanced Disclosure */}
        <section>
          <h4 className="text-base font-medium mb-4">Basic → Enhanced Information</h4>
          <div className="space-y-6">
            {/* Level 1: Basic Identification */}
            <div className="space-y-2">
              <Label htmlFor="basic-username" variant="field">
                Username
              </Label>
              <Input id="basic-username" type="text" placeholder="Choose a username" />
              <p className="text-xs text-muted-foreground">
                <strong>Level 1:</strong> Basic field identification for immediate understanding
              </p>
            </div>

            {/* Level 2: Contextual Guidance */}
            <div className="space-y-2">
              <Label htmlFor="guided-username" variant="field">
                Username
              </Label>
              <Label variant="hint">This will be your unique identifier on the platform</Label>
              <Input id="guided-username" type="text" placeholder="Choose a username" />
              <p className="text-xs text-muted-foreground">
                <strong>Level 2:</strong> Adds context about purpose and importance
              </p>
            </div>

            {/* Level 3: Detailed Requirements */}
            <div className="space-y-2">
              <Label htmlFor="detailed-username" variant="field">
                Username
              </Label>
              <Label variant="hint">This will be your unique identifier on the platform</Label>
              <Label variant="hint">
                3-20 characters, letters and numbers only, cannot be changed later
              </Label>
              <Input id="detailed-username" type="text" placeholder="Choose a username" />
              <p className="text-xs text-muted-foreground">
                <strong>Level 3:</strong> Includes detailed requirements and constraints
              </p>
            </div>

            {/* Level 4: Interactive Feedback */}
            <div className="space-y-2">
              <Label htmlFor="interactive-username" variant="field">
                Username
              </Label>
              <Label variant="hint">This will be your unique identifier on the platform</Label>
              <Label variant="hint">
                3-20 characters, letters and numbers only, cannot be changed later
              </Label>
              <Input id="interactive-username" type="text" defaultValue="john" variant="error" />
              <Label variant="error">Username must be at least 3 characters long</Label>
              <Label variant="meta">Suggestions: john123, johnsmith, johndoe2024</Label>
              <p className="text-xs text-muted-foreground">
                <strong>Level 4:</strong> Real-time feedback with helpful suggestions
              </p>
            </div>
          </div>
        </section>

        {/* Context-Sensitive Disclosure */}
        <section>
          <h4 className="text-base font-medium mb-4">Context-Sensitive Information Layers</h4>
          <div className="space-y-6">
            {/* New User Experience */}
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
              <h5 className="text-sm font-medium mb-4 text-blue-800">New User Setup</h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" variant="field">
                    Create Your Password
                  </Label>
                  <Label variant="hint">
                    Your password protects your account and personal information
                  </Label>
                  <Label variant="hint">
                    Use a mix of letters, numbers, and symbols for the best security
                  </Label>
                  <Input id="new-password" type="password" placeholder="Enter a strong password" />
                  <Label variant="meta">
                    💡 Tip: Consider using a password manager to generate and store secure passwords
                  </Label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                New users get comprehensive guidance and education
              </p>
            </div>

            {/* Experienced User Experience */}
            <div className="p-4 border rounded-md">
              <h5 className="text-sm font-medium mb-4">Returning User</h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="existing-password" variant="field">
                    Current Password
                  </Label>
                  <Input
                    id="existing-password"
                    type="password"
                    placeholder="Enter your current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password-change" variant="field">
                    New Password
                  </Label>
                  <Input
                    id="new-password-change"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Experienced users get streamlined, task-focused labels
              </p>
            </div>
          </div>
        </section>

        {/* Error Recovery Disclosure */}
        <section>
          <h4 className="text-base font-medium mb-4">Error Recovery Information Layers</h4>
          <div className="space-y-6">
            {/* Initial Error State */}
            <div className="space-y-2">
              <Label htmlFor="error-email" variant="field">
                Email Address
              </Label>
              <Input id="error-email" type="email" defaultValue="invalid-email" variant="error" />
              <Label variant="error">Please enter a valid email address</Label>
              <p className="text-xs text-muted-foreground">
                <strong>Initial:</strong> Basic error identification
              </p>
            </div>

            {/* Enhanced Error Guidance */}
            <div className="space-y-2">
              <Label htmlFor="enhanced-error-email" variant="field">
                Email Address
              </Label>
              <Input id="enhanced-error-email" type="email" defaultValue="user@" variant="error" />
              <Label variant="error">
                Email address is incomplete - please include the domain (e.g., @gmail.com)
              </Label>
              <Label variant="hint">Example: user@company.com or personal@gmail.com</Label>
              <p className="text-xs text-muted-foreground">
                <strong>Enhanced:</strong> Specific problem identification with examples
              </p>
            </div>

            {/* Recovery Assistance */}
            <div className="space-y-2">
              <Label htmlFor="recovery-email" variant="field">
                Email Address
              </Label>
              <Input
                id="recovery-email"
                type="email"
                defaultValue="user@gmial.com"
                variant="error"
              />
              <Label variant="error">
                Did you mean{' '}
                <button type="button" className="text-primary hover:underline font-medium">
                  user@gmail.com
                </button>
                ?
              </Label>
              <Label variant="hint">
                Click the suggestion above or continue typing your email address
              </Label>
              <p className="text-xs text-muted-foreground">
                <strong>Recovery:</strong> Intelligent suggestions and correction assistance
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Disclosure Principles</h4>
        <p className="text-xs text-muted-foreground">
          <strong>Start Simple:</strong> Begin with essential information only
          <br />
          <strong>Add Context:</strong> Provide purpose and guidance when helpful
          <br />
          <strong>Show Details:</strong> Reveal constraints and requirements progressively
          <br />
          <strong>Support Recovery:</strong> Offer specific help when problems occur
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Progressive disclosure patterns that reveal label information at appropriate levels of detail for different user contexts and needs.',
      },
    },
  },
};
