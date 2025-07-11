import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

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
  const baseClasses = "text-sm";
  const variantClasses = {
    field: "font-medium",
    hint: "text-muted-foreground",
    error: "text-destructive",
    success: "text-green-600",
    meta: "text-xs text-muted-foreground",
    status: "text-xs font-medium"
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
 * Properties control label behavior and information delivery patterns.
 * Each property serves specific communication and relationship requirements.
 */
const meta = {
  title: '03 Components/Forms/Label/Properties & States',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Properties that control label variants, semantic relationships, and information delivery patterns for different communication needs.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Label Variants
 *
 * Different label variants serve specific information delivery purposes.
 * Each variant optimizes communication for its specific context and user need.
 */
export const LabelVariants: Story = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Label Information Variants</h3>
        <p className="text-sm text-muted-foreground">
          Different label variants optimize information delivery for specific contexts
          and communication needs within interfaces.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-4">Field Identification</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-basic" variant="field">
                Email Address
              </Label>
              <Input
                id="field-basic"
                type="email"
                placeholder="user@example.com"
              />
              <p className="text-xs text-muted-foreground">
                Primary field identification with appropriate semantic weight
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-required" variant="field">
                Password <span className="text-destructive" aria-label="required">*</span>
              </Label>
              <Input
                id="field-required"
                type="password"
                placeholder="Enter secure password"
                required
              />
              <p className="text-xs text-muted-foreground">
                Required field indicator with accessibility attributes
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-optional" variant="field">
                Company Name <span className="text-muted-foreground text-xs font-normal">(optional)</span>
              </Label>
              <Input
                id="field-optional"
                type="text"
                placeholder="Acme Corporation"
              />
              <p className="text-xs text-muted-foreground">
                Optional field with clear indication of non-required status
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Contextual Guidance</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hint-purpose" variant="field">
                Recovery Email
              </Label>
              <Label variant="hint">
                We'll use this to help you recover your account if needed
              </Label>
              <Input
                id="hint-purpose"
                type="email"
                placeholder="recovery@example.com"
              />
              <p className="text-xs text-muted-foreground">
                Contextual hint explaining purpose and value
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hint-format" variant="field">
                Phone Number
              </Label>
              <Label variant="hint">
                Include area code for better delivery
              </Label>
              <Input
                id="hint-format"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
              <p className="text-xs text-muted-foreground">
                Format guidance that helps prevent errors
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hint-constraint" variant="field">
                Username
              </Label>
              <Label variant="hint">
                3-20 characters, letters and numbers only
              </Label>
              <Input
                id="hint-constraint"
                type="text"
                placeholder="johndoe123"
              />
              <p className="text-xs text-muted-foreground">
                Clear constraint communication to set expectations
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">State Communication</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label variant="success">
                  ✓ Email format is valid
                </Label>
                <p className="text-xs text-muted-foreground">
                  Success state with positive reinforcement
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="error-password" variant="field">
                  Password
                </Label>
                <Input
                  id="error-password"
                  type="password"
                  defaultValue="123"
                  variant="error"
                />
                <Label variant="error">
                  Password must be at least 8 characters
                </Label>
                <p className="text-xs text-muted-foreground">
                  Error state with specific guidance for resolution
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loading-upload" variant="field">
                  Profile Photo
                </Label>
                <div className="border rounded-md p-4 text-center">
                  <Button variant="outline" size="sm" disabled>
                    Uploading...
                  </Button>
                </div>
                <Label variant="status">
                  Upload in progress: 67% complete
                </Label>
                <p className="text-xs text-muted-foreground">
                  Status updates for ongoing processes
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-file" variant="field">
                  Document Upload
                </Label>
                <div className="border rounded-md p-4 text-center">
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
                <Label variant="meta">
                  Max 10MB • PDF, DOC, or TXT format
                </Label>
                <p className="text-xs text-muted-foreground">
                  Meta information about constraints and formats
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
            <div className="font-medium">Information Types</div>
            <div className="text-muted-foreground space-y-1">
              <div>• <strong>Field:</strong> Primary identification</div>
              <div>• <strong>Hint:</strong> Contextual guidance</div>
              <div>• <strong>Error/Success:</strong> State feedback</div>
              <div>• <strong>Meta:</strong> Supplementary information</div>
            </div>
          </div>
          <div>
            <div className="font-medium">Usage Patterns</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Use consistent language for similar situations</div>
              <div>• Provide helpful context, not just identification</div>
              <div>• Guide users toward successful completion</div>
              <div>• Keep meta information concise and relevant</div>
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
          'Label variant properties that optimize information delivery for different communication contexts and user needs.',
      },
    },
  },
};

/**
 * Semantic Relationships
 *
 * Properties that control how labels connect to interface elements
 * through HTML relationships and ARIA attributes.
 */
export const SemanticRelationships: Story = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Label Relationship Properties</h3>
        <p className="text-sm text-muted-foreground">
          Properties that create semantic connections between labels and interface elements
          for accessibility and clear information relationships.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-4">Direct HTML Relationships</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="direct-name" variant="field">
                Full Name
              </Label>
              <Input
                id="direct-name"
                type="text"
                placeholder="Enter your full name"
              />
              <div className="bg-muted/50 p-3 rounded-md text-xs">
                <div className="font-medium mb-1">HTML Relationship:</div>
                <code>htmlFor="direct-name"</code> connects label directly to input
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="with-meta" variant="field">
                  Profile Picture
                </Label>
                <Label variant="meta">
                  Optional • Max 5MB
                </Label>
              </div>
              <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
                <Button variant="outline" size="sm">
                  Choose Image
                </Button>
              </div>
              <Label variant="hint">
                JPG, PNG, or GIF format recommended
              </Label>
              <div className="bg-muted/50 p-3 rounded-md text-xs">
                <div className="font-medium mb-1">Multiple Labels:</div>
                Different label types can relate to the same interface element
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">ARIA Described Relationships</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="described-password" variant="field">
                Create Password
              </Label>
              <Label variant="hint" id="password-requirements">
                Must include 8+ characters, numbers, and symbols
              </Label>
              <Input
                id="described-password"
                type="password"
                placeholder="Enter secure password"
                aria-describedby="password-requirements password-strength"
              />
              <div id="password-strength" className="text-xs text-muted-foreground">
                Password strength will be shown here as you type
              </div>
              <div className="bg-muted/50 p-3 rounded-md text-xs">
                <div className="font-medium mb-1">ARIA Described By:</div>
                <code>aria-describedby="password-requirements password-strength"</code><br />
                Connects multiple descriptive elements to one input
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validated-email" variant="field">
                Email Address
              </Label>
              <Input
                id="validated-email"
                type="email"
                defaultValue="user@example.com"
                variant="success"
                aria-describedby="email-status"
              />
              <Label variant="success" id="email-status" aria-live="polite">
                ✓ Email address is available
              </Label>
              <div className="bg-muted/50 p-3 rounded-md text-xs">
                <div className="font-medium mb-1">Live Region:</div>
                <code>aria-live="polite"</code> announces changes to screen readers
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Group Relationships</h4>
          <fieldset className="space-y-4 border border-border rounded-md p-4">
            <legend className="text-sm font-medium px-2">Billing Address</legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billing-first" variant="field">
                  First Name
                </Label>
                <Input
                  id="billing-first"
                  type="text"
                  placeholder="John"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-last" variant="field">
                  Last Name
                </Label>
                <Input
                  id="billing-last"
                  type="text"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing-address" variant="field">
                Street Address
              </Label>
              <Input
                id="billing-address"
                type="text"
                placeholder="123 Main Street"
              />
            </div>
            
            <div className="bg-muted/50 p-3 rounded-md text-xs">
              <div className="font-medium mb-1">Fieldset Grouping:</div>
              <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code> create semantic grouping<br />
              All labels within inherit the group context
            </div>
          </fieldset>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Complex Multi-Element Relationships</h4>
          <div className="space-y-2">
            <Label htmlFor="complex-input" variant="field">
              Account Number
            </Label>
            <Label variant="hint" id="account-help">
              Found on your statement or online banking
            </Label>
            <div className="flex gap-2">
              <Input
                id="complex-input"
                type="text"
                placeholder="Enter account number"
                aria-describedby="account-help account-validation account-security"
                className="flex-1"
              />
              <Button variant="outline" size="sm" aria-describedby="verify-help">
                Verify
              </Button>
            </div>
            <Label variant="success" id="account-validation" aria-live="polite">
              ✓ Account number format is valid
            </Label>
            <Label variant="meta" id="account-security">
              Your account information is encrypted and secure
            </Label>
            <Label variant="meta" id="verify-help">
              Click to verify account with your bank
            </Label>
            <div className="bg-muted/50 p-3 rounded-md text-xs">
              <div className="font-medium mb-1">Multi-Element Description:</div>
              Multiple labels provide layered information for complex interactions
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Relationship Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium">HTML Relationships</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Use <code>htmlFor</code> for direct label-input connections</div>
              <div>• Use <code>aria-describedby</code> for additional context</div>
              <div>• Use <code>fieldset/legend</code> for group relationships</div>
            </div>
          </div>
          <div>
            <div className="font-medium">Accessibility Features</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Use <code>aria-live</code> for dynamic updates</div>
              <div>• Provide complete context for screen readers</div>
              <div>• Connect related information semantically</div>
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
          'Semantic relationship properties that create meaningful connections between labels and interface elements for accessibility.',
      },
    },
  },
};

/**
 * Content Patterns
 *
 * Consistent language patterns and content guidelines that ensure
 * labels deliver helpful, trustworthy information across the interface.
 */
export const ContentPatterns: Story = {
  render: () => (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Consistent Content Patterns</h3>
        <p className="text-sm text-muted-foreground">
          Standardized language patterns that create trustworthy, helpful information
          delivery across different interface contexts and situations.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-4">Field Identification Patterns</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-sm font-medium">✓ Consistent Naming</div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label variant="field">Email Address</Label>
                  <div className="text-xs text-muted-foreground">Not "Email" or "E-mail"</div>
                </div>
                <div className="space-y-1">
                  <Label variant="field">Phone Number</Label>
                  <div className="text-xs text-muted-foreground">Not "Phone" or "Telephone"</div>
                </div>
                <div className="space-y-1">
                  <Label variant="field">Full Name</Label>
                  <div className="text-xs text-muted-foreground">Not "Name" or "Your Name"</div>
                </div>
                <div className="space-y-1">
                  <Label variant="field">Street Address</Label>
                  <div className="text-xs text-muted-foreground">Not "Address" when there are multiple types</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium">✓ Clear Specificity</div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label variant="field">Work Email Address</Label>
                  <div className="text-xs text-muted-foreground">When context matters</div>
                </div>
                <div className="space-y-1">
                  <Label variant="field">Mobile Phone Number</Label>
                  <div className="text-xs text-muted-foreground">When type is important</div>
                </div>
                <div className="space-y-1">
                  <Label variant="field">Current Password</Label>
                  <div className="text-xs text-muted-foreground">When distinguishing from new password</div>
                </div>
                <div className="space-y-1">
                  <Label variant="field">Billing ZIP Code</Label>
                  <div className="text-xs text-muted-foreground">When there are multiple ZIP codes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Validation Message Patterns</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-sm font-medium text-red-600">❌ Vague Messages</div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label variant="error">Invalid input</Label>
                    <div className="text-xs text-muted-foreground">Doesn't explain what's wrong</div>
                  </div>
                  <div className="space-y-1">
                    <Label variant="error">Error</Label>
                    <div className="text-xs text-muted-foreground">No helpful information</div>
                  </div>
                  <div className="space-y-1">
                    <Label variant="error">Please try again</Label>
                    <div className="text-xs text-muted-foreground">No guidance on what to change</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium text-green-600">✓ Specific Guidance</div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label variant="error">Email address must include @</Label>
                    <div className="text-xs text-muted-foreground">Specific problem identified</div>
                  </div>
                  <div className="space-y-1">
                    <Label variant="error">Password must be at least 8 characters</Label>
                    <div className="text-xs text-muted-foreground">Clear requirement stated</div>
                  </div>
                  <div className="space-y-1">
                    <Label variant="error">Please include your area code</Label>
                    <div className="text-xs text-muted-foreground">Actionable next step</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="space-y-2">
                <div className="text-sm font-medium">Format Errors</div>
                <div className="space-y-1 text-xs">
                  <Label variant="error">Please enter a valid email format</Label>
                  <Label variant="error">Phone number should be 10 digits</Label>
                  <Label variant="error">Date must be MM/DD/YYYY format</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Requirement Errors</div>
                <div className="space-y-1 text-xs">
                  <Label variant="error">This field is required</Label>
                  <Label variant="error">Please choose at least one option</Label>
                  <Label variant="error">Agreement must be accepted to continue</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Success Messages</div>
                <div className="space-y-1 text-xs">
                  <Label variant="success">✓ Email format looks good</Label>
                  <Label variant="success">✓ Password meets requirements</Label>
                  <Label variant="success">✓ Information saved successfully</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Helpful Context Patterns</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-sm font-medium">Purpose Explanation</div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label variant="field">Recovery Email</Label>
                  <Label variant="hint">We'll use this to help you recover your account</Label>
                </div>
                <div className="space-y-1">
                  <Label variant="field">Phone Number</Label>
                  <Label variant="hint">For important account security notifications</Label>
                </div>
                <div className="space-y-1">
                  <Label variant="field">Company Name</Label>
                  <Label variant="hint">Helps us customize your experience</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium">Format Guidance</div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label variant="field">Phone Number</Label>
                  <Label variant="hint">Include area code for better delivery</Label>
                </div>
                <div className="space-y-1">
                  <Label variant="field">Website URL</Label>
                  <Label variant="hint">Include https:// if you have an SSL certificate</Label>
                </div>
                <div className="space-y-1">
                  <Label variant="field">Username</Label>
                  <Label variant="hint">3-20 characters, letters and numbers only</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Status and Meta Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="text-sm font-medium">Loading States</div>
              <div className="space-y-1 text-xs">
                <Label variant="status">Saving your changes...</Label>
                <Label variant="status">Upload in progress: 45%</Label>
                <Label variant="status">Verifying information...</Label>
                <Label variant="status">Processing payment...</Label>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">Timestamps</div>
              <div className="space-y-1 text-xs">
                <Label variant="meta">Last updated: 2 hours ago</Label>
                <Label variant="meta">Created on March 15, 2024</Label>
                <Label variant="meta">Next backup: Tonight at 2 AM</Label>
                <Label variant="meta">Expires in 30 days</Label>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">Constraints & Limits</div>
              <div className="space-y-1 text-xs">
                <Label variant="meta">Max 5MB • JPG or PNG</Label>
                <Label variant="meta">3 files remaining</Label>
                <Label variant="meta">Optional field</Label>
                <Label variant="meta">Character limit: 250</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Content Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium">Consistency</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Use the same terms for the same concepts</div>
              <div>• Create standardized phrases for common situations</div>
              <div>• Maintain consistent tone and voice</div>
              <div>• Build a vocabulary guide for your product</div>
            </div>
          </div>
          <div>
            <div className="font-medium">Helpfulness</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Explain problems specifically</div>
              <div>• Suggest concrete next steps</div>
              <div>• Provide context for why information is needed</div>
              <div>• Focus on user success, not system requirements</div>
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
          'Content pattern properties that ensure consistent, helpful language across all label types and interface contexts.',
      },
    },
  },
};