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
  [key: string]: any;
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
 * Visual variants provide appropriate communication style and emphasis
 * for different types of information delivery and user guidance needs.
 */
const meta = {
  title: '03 Components/Forms/Label/Visual Variants',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Visual variants that provide appropriate emphasis and styling for different types of label information and communication contexts.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Information Type Variants
 *
 * Different visual treatments communicate the type and importance
 * of information being delivered to users.
 */
export const InformationTypes: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-medium mb-6">Label Information Type Variants</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Primary Information */}
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-4">Primary Information</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="field-basic" variant="field">
                  Email Address
                </Label>
                <Input id="field-basic" type="email" placeholder="user@example.com" />
                <p className="text-xs text-muted-foreground">
                  Field variant: Essential identification with semantic weight
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-required" variant="field">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input id="field-required" type="password" placeholder="Enter password" />
                <p className="text-xs text-muted-foreground">
                  Required field indicator maintains field variant styling
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-complex" variant="field">
                  Account Number
                </Label>
                <Input id="field-complex" type="text" placeholder="Enter 10-digit account number" />
                <p className="text-xs text-muted-foreground">
                  Complex fields use same clear identification approach
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Information */}
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-4">Supporting Information</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hint-basic" variant="field">
                  Username
                </Label>
                <Label variant="hint">This will be visible to other users</Label>
                <Input id="hint-basic" type="text" placeholder="Choose username" />
                <p className="text-xs text-muted-foreground">
                  Hint variant: Contextual guidance with reduced visual weight
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hint-format" variant="field">
                  Phone Number
                </Label>
                <Label variant="hint">Include area code for better delivery</Label>
                <Input id="hint-format" type="tel" placeholder="+1 (555) 123-4567" />
                <p className="text-xs text-muted-foreground">
                  Format guidance helps prevent input errors
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hint-purpose" variant="field">
                  Recovery Email
                </Label>
                <Label variant="hint">We'll use this to help you recover your account</Label>
                <Input id="hint-purpose" type="email" placeholder="recovery@example.com" />
                <p className="text-xs text-muted-foreground">
                  Purpose explanation builds user confidence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* State Communication */}
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-4">State Communication</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="success-email" variant="field">
                  Email Address
                </Label>
                <Input
                  id="success-email"
                  type="email"
                  defaultValue="user@example.com"
                  variant="success"
                />
                <Label variant="success">✓ Email format is valid and available</Label>
                <p className="text-xs text-muted-foreground">
                  Success variant: Positive reinforcement with appropriate color
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="error-password" variant="field">
                  Password
                </Label>
                <Input id="error-password" type="password" defaultValue="123" variant="error" />
                <Label variant="error">Password must be at least 8 characters long</Label>
                <p className="text-xs text-muted-foreground">
                  Error variant: Clear problem identification with guidance
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-upload" variant="field">
                  Profile Photo
                </Label>
                <div className="border rounded-md p-4 text-center">
                  <Button variant="outline" size="sm" disabled>
                    Uploading...
                  </Button>
                </div>
                <Label variant="status">Upload in progress: 67% complete</Label>
                <p className="text-xs text-muted-foreground">
                  Status variant: Real-time process communication
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-4">Meta Information</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="meta-file" variant="field">
                    Document Upload
                  </Label>
                  <Label variant="meta">Max 10MB • PDF, DOC, TXT</Label>
                </div>
                <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
                <Label variant="meta">Last updated: Never</Label>
                <p className="text-xs text-muted-foreground">
                  Meta variant: Supplementary information with minimal visual weight
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-optional" variant="field">
                  Company Website
                </Label>
                <Label variant="meta">Optional field</Label>
                <Input id="meta-optional" type="url" placeholder="https://example.com" />
                <Label variant="meta">Used for profile verification</Label>
                <p className="text-xs text-muted-foreground">
                  Meta information provides context without visual competition
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Variant Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium">Information Hierarchy</div>
            <div className="text-muted-foreground space-y-1">
              <div>
                • <strong>Field:</strong> Primary identification, highest visual weight
              </div>
              <div>
                • <strong>Hint:</strong> Supporting guidance, moderate weight
              </div>
              <div>
                • <strong>Status:</strong> Process communication, attention-appropriate
              </div>
              <div>
                • <strong>Meta:</strong> Supplementary details, minimal weight
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium">State Communication</div>
            <div className="text-muted-foreground space-y-1">
              <div>
                • <strong>Success:</strong> Positive reinforcement, encourages progress
              </div>
              <div>
                • <strong>Error:</strong> Problem identification with recovery guidance
              </div>
              <div>• Use color and typography to reinforce meaning</div>
              <div>• Maintain readability across all variants</div>
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
          'Information type variants that provide appropriate visual treatment for different kinds of label communication and user guidance.',
      },
    },
  },
};

/**
 * State-Responsive Variants
 *
 * Labels adapt their visual presentation based on interface state,
 * user context, and interaction requirements.
 */
export const StateResponsive: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <h3 className="text-lg font-medium mb-6">State-Responsive Label Variants</h3>
      <div className="space-y-8">
        {/* Validation State Progression */}
        <section>
          <h4 className="text-base font-medium mb-4">Validation State Progression</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Default State */}
            <div className="space-y-2">
              <Label htmlFor="state-default" variant="field">
                Password
              </Label>
              <Label variant="hint">Enter your password</Label>
              <Input id="state-default" type="password" placeholder="Password" />
              <div className="text-xs text-muted-foreground text-center mt-2">
                <strong>Default</strong>
                <br />
                Ready for input
              </div>
            </div>

            {/* Warning State */}
            <div className="space-y-2">
              <Label htmlFor="state-warning" variant="field">
                Password
              </Label>
              <Label variant="hint">Consider using a stronger password</Label>
              <Input id="state-warning" type="password" defaultValue="weak123" variant="warning" />
              <Label variant="error" className="text-yellow-600">
                ⚠ Password could be stronger
              </Label>
              <div className="text-xs text-muted-foreground text-center mt-2">
                <strong>Warning</strong>
                <br />
                Guidance for improvement
              </div>
            </div>

            {/* Error State */}
            <div className="space-y-2">
              <Label htmlFor="state-error" variant="field">
                Password
              </Label>
              <Label variant="hint">Must meet security requirements</Label>
              <Input id="state-error" type="password" defaultValue="123" variant="error" />
              <Label variant="error">Password must be at least 8 characters</Label>
              <div className="text-xs text-muted-foreground text-center mt-2">
                <strong>Error</strong>
                <br />
                Clear problem identification
              </div>
            </div>

            {/* Success State */}
            <div className="space-y-2">
              <Label htmlFor="state-success" variant="field">
                Password
              </Label>
              <Label variant="hint">Strong password confirmed</Label>
              <Input
                id="state-success"
                type="password"
                defaultValue="SecurePass123!"
                variant="success"
              />
              <Label variant="success">✓ Strong password requirements met</Label>
              <div className="text-xs text-muted-foreground text-center mt-2">
                <strong>Success</strong>
                <br />
                Positive reinforcement
              </div>
            </div>
          </div>
        </section>

        {/* Loading and Process States */}
        <section>
          <h4 className="text-base font-medium mb-4">Process and Loading States</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Initial State */}
            <div className="space-y-2">
              <Label htmlFor="process-initial" variant="field">
                Profile Photo
              </Label>
              <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
                <Button variant="outline" size="sm">
                  Choose Photo
                </Button>
              </div>
              <Label variant="meta">JPG, PNG, or GIF • Max 5MB</Label>
              <div className="text-xs text-muted-foreground text-center mt-2">
                <strong>Ready</strong>
                <br />
                Available for interaction
              </div>
            </div>

            {/* Processing State */}
            <div className="space-y-2">
              <Label htmlFor="process-loading" variant="field">
                Profile Photo
              </Label>
              <div className="border rounded-md p-6 text-center bg-muted/50">
                <Button variant="outline" size="sm" disabled>
                  Uploading...
                </Button>
              </div>
              <Label variant="status">Upload in progress: 67% complete</Label>
              <div className="text-xs text-muted-foreground text-center mt-2">
                <strong>Processing</strong>
                <br />
                Dynamic status updates
              </div>
            </div>

            {/* Completed State */}
            <div className="space-y-2">
              <Label htmlFor="process-complete" variant="field">
                Profile Photo
              </Label>
              <div className="border rounded-md p-6 text-center bg-green-50">
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              </div>
              <Label variant="success">✓ Photo uploaded successfully</Label>
              <Label variant="meta">Last updated: 2 minutes ago</Label>
              <div className="text-xs text-muted-foreground text-center mt-2">
                <strong>Complete</strong>
                <br />
                Success confirmation
              </div>
            </div>
          </div>
        </section>

        {/* Context-Sensitive Variants */}
        <section>
          <h4 className="text-base font-medium mb-4">Context-Sensitive Adaptations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* High Security Context */}
            <div className="p-4 border border-warning/20 bg-warning/5 rounded-md">
              <h5 className="text-sm font-medium mb-4 text-warning-foreground">
                High Security Context
              </h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="security-2fa" variant="field">
                    Two-Factor Authentication Code
                  </Label>
                  <Label variant="hint">Enter the 6-digit code from your authenticator app</Label>
                  <Input id="security-2fa" type="text" placeholder="123456" maxLength={6} />
                  <Label variant="meta">🔒 This code expires in 30 seconds</Label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Security context adds trust indicators and urgency cues
              </p>
            </div>

            {/* Low-Stakes Context */}
            <div className="p-4 border rounded-md">
              <h5 className="text-sm font-medium mb-4">Casual Context</h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="casual-nickname" variant="field">
                    Display Name
                  </Label>
                  <Label variant="hint">How you'd like others to see you</Label>
                  <Input id="casual-nickname" type="text" placeholder="Choose a friendly name" />
                  <Label variant="meta">You can change this anytime</Label>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Casual context uses friendly, relaxed language
              </p>
            </div>
          </div>
        </section>

        {/* Error Recovery Variants */}
        <section>
          <h4 className="text-base font-medium mb-4">Error Recovery Progression</h4>
          <div className="space-y-6">
            {/* First Attempt Error */}
            <div className="space-y-2">
              <Label htmlFor="recovery-first" variant="field">
                Email Address
              </Label>
              <Input
                id="recovery-first"
                type="email"
                defaultValue="user@gmial.com"
                variant="error"
              />
              <Label variant="error">Please check your email address format</Label>
              <p className="text-xs text-muted-foreground">
                <strong>First Error:</strong> General guidance for common mistakes
              </p>
            </div>

            {/* Repeated Error */}
            <div className="space-y-2">
              <Label htmlFor="recovery-repeat" variant="field">
                Email Address
              </Label>
              <Input
                id="recovery-repeat"
                type="email"
                defaultValue="user@gmial.com"
                variant="error"
              />
              <Label variant="error">
                Did you mean{' '}
                <button className="text-primary hover:underline font-medium">user@gmail.com</button>
                ?
              </Label>
              <Label variant="hint">Common domains: gmail.com, outlook.com, yahoo.com</Label>
              <p className="text-xs text-muted-foreground">
                <strong>Repeated Error:</strong> Intelligent suggestions and recovery assistance
              </p>
            </div>

            {/* Persistent Error */}
            <div className="space-y-2">
              <Label htmlFor="recovery-persist" variant="field">
                Email Address
              </Label>
              <Input
                id="recovery-persist"
                type="email"
                defaultValue="user@invalid"
                variant="error"
              />
              <Label variant="error">Email must include a valid domain (like @gmail.com)</Label>
              <Label variant="hint">Example: yourname@gmail.com or work@company.com</Label>
              <div className="text-xs text-muted-foreground">
                Need help? <button className="text-primary hover:underline">Contact support</button>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Persistent Error:</strong> Escalated assistance with support options
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">State-Responsive Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium">Progressive Assistance</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Start with general guidance</div>
              <div>• Escalate to specific help with repeated errors</div>
              <div>• Provide intelligent suggestions when possible</div>
              <div>• Offer human assistance for persistent problems</div>
            </div>
          </div>
          <div>
            <div className="font-medium">Context Adaptation</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Match tone to stakes and context</div>
              <div>• Add security indicators for sensitive data</div>
              <div>• Use encouraging language for complex tasks</div>
              <div>• Provide status updates for long processes</div>
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
          'State-responsive variants that adapt label presentation based on interface state, validation status, and user interaction context.',
      },
    },
  },
};

/**
 * Visual Treatment Comparison
 *
 * Side-by-side comparison of different label treatments helps understand
 * appropriate usage patterns and communication effectiveness.
 */
export const VisualComparison: Story = {
  render: () => (
    <div className="w-full max-w-6xl">
      <h3 className="text-lg font-medium mb-6">Label Visual Treatment Comparison</h3>
      <div className="space-y-8">
        {/* Typography Weight Comparison */}
        <section>
          <h4 className="text-base font-medium mb-4">Typography Weight and Hierarchy</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label variant="field" className="font-bold">
                Bold Field Label
              </Label>
              <Input type="text" placeholder="Heavy emphasis" />
              <p className="text-xs text-muted-foreground">High emphasis for critical fields</p>
            </div>

            <div className="space-y-2">
              <Label variant="field">Medium Field Label</Label>
              <Input type="text" placeholder="Standard emphasis" />
              <p className="text-xs text-muted-foreground">Default weight for regular fields</p>
            </div>

            <div className="space-y-2">
              <Label variant="hint" className="font-normal">
                Hint Information
              </Label>
              <Input type="text" placeholder="Supporting guidance" />
              <p className="text-xs text-muted-foreground">Reduced weight for supporting info</p>
            </div>

            <div className="space-y-2">
              <Label variant="meta">Meta Information</Label>
              <Input type="text" placeholder="Supplementary details" />
              <p className="text-xs text-muted-foreground">Minimal weight for meta details</p>
            </div>
          </div>
        </section>

        {/* Color and State Comparison */}
        <section>
          <h4 className="text-base font-medium mb-4">Color and State Communication</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label variant="field">Default State</Label>
              <Input type="text" placeholder="Neutral styling" />
              <Label variant="hint">Ready for user input</Label>
              <p className="text-xs text-muted-foreground">Neutral colors for default state</p>
            </div>

            <div className="space-y-2">
              <Label variant="field">Success State</Label>
              <Input type="text" defaultValue="valid@email.com" variant="success" />
              <Label variant="success">✓ Valid format confirmed</Label>
              <p className="text-xs text-muted-foreground">Green indicates positive validation</p>
            </div>

            <div className="space-y-2">
              <Label variant="field">Warning State</Label>
              <Input type="text" defaultValue="weak" variant="warning" />
              <Label variant="error" className="text-yellow-600">
                ⚠ Consider improvements
              </Label>
              <p className="text-xs text-muted-foreground">Yellow/orange for cautionary guidance</p>
            </div>

            <div className="space-y-2">
              <Label variant="field">Error State</Label>
              <Input type="text" defaultValue="invalid" variant="error" />
              <Label variant="error">Please correct this field</Label>
              <p className="text-xs text-muted-foreground">Red for errors requiring attention</p>
            </div>
          </div>
        </section>

        {/* Density and Spacing Comparison */}
        <section>
          <h4 className="text-base font-medium mb-4">Information Density Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Compact Density */}
            <div className="space-y-1">
              <Label variant="field" className="text-sm">
                Compact Layout
              </Label>
              <Input type="text" placeholder="Dense information" className="h-8" />
              <Label variant="meta" className="text-xs">
                Max 50MB • JPG, PNG
              </Label>
              <p className="text-xs text-muted-foreground">
                Minimal spacing for high-density layouts
              </p>
            </div>

            {/* Standard Density */}
            <div className="space-y-2">
              <Label variant="field">Standard Layout</Label>
              <Input type="text" placeholder="Balanced information" />
              <Label variant="hint">Additional context when helpful</Label>
              <Label variant="meta">Uploaded 2 hours ago</Label>
              <p className="text-xs text-muted-foreground">
                Balanced spacing for optimal readability
              </p>
            </div>

            {/* Spacious Density */}
            <div className="space-y-3">
              <Label variant="field" className="text-base">
                Spacious Layout
              </Label>
              <Input type="text" placeholder="Featured information" className="h-12" />
              <Label variant="hint" className="text-sm">
                Comprehensive guidance for important fields
              </Label>
              <Label variant="meta">This information helps us provide better service</Label>
              <p className="text-xs text-muted-foreground">Generous spacing for featured content</p>
            </div>
          </div>
        </section>

        {/* Complete Form Examples */}
        <section>
          <h4 className="text-base font-medium mb-4">Complete Form Treatment Examples</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Minimal Treatment */}
            <div className="p-4 border rounded-md">
              <h5 className="text-sm font-medium mb-4">Minimal Treatment</h5>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label variant="field" className="text-sm">
                    Email
                  </Label>
                  <Input type="email" placeholder="user@example.com" className="h-9" />
                </div>
                <div className="space-y-1">
                  <Label variant="field" className="text-sm">
                    Password
                  </Label>
                  <Input type="password" placeholder="Password" className="h-9" />
                </div>
                <Button variant="primary" size="sm" className="w-full">
                  Sign In
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Clean, minimal approach for experienced users
              </p>
            </div>

            {/* Comprehensive Treatment */}
            <div className="p-4 border rounded-md">
              <h5 className="text-sm font-medium mb-4">Comprehensive Treatment</h5>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label variant="field">Email Address</Label>
                  <Label variant="hint">We'll use this for important account notifications</Label>
                  <Input type="email" placeholder="user@example.com" />
                  <Label variant="success">✓ Email format looks good</Label>
                </div>
                <div className="space-y-2">
                  <Label variant="field">Create Password</Label>
                  <Label variant="hint">Must be 8+ characters with numbers and symbols</Label>
                  <Input type="password" placeholder="Enter secure password" />
                  <Label variant="meta">Password strength will be shown as you type</Label>
                </div>
                <Button variant="primary" className="w-full">
                  Create Account
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Comprehensive guidance for new users and complex forms
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Visual Treatment Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium">Hierarchy and Emphasis</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Use typography weight to indicate information importance</div>
              <div>• Maintain consistent visual relationships</div>
              <div>• Avoid competing for attention within same context</div>
              <div>• Test readability across different user abilities</div>
            </div>
          </div>
          <div>
            <div className="font-medium">Context Adaptation</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Match treatment complexity to user experience level</div>
              <div>• Use color strategically to communicate state</div>
              <div>• Adapt density to available space and task importance</div>
              <div>• Ensure accessibility across all visual treatments</div>
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
          'Visual treatment comparison showing how different label styling approaches communicate information hierarchy and context.',
      },
    },
  },
};
