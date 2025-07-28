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
 * Accessibility creates inclusive information delivery for all users.
 * Labels provide the semantic foundation that assistive technologies depend on.
 */
const meta = {
  title: '03 Components/Forms/Label/Accessibility',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessibility features that ensure labels create clear, navigable information relationships for all users.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Semantic Relationships
 *
 * Labels create meaningful connections between descriptive text and interface elements
 * through proper HTML relationships and ARIA attributes.
 */
export const SemanticRelationships: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Semantic Label Relationships</h3>
        <p className="text-sm text-muted-foreground">
          Proper semantic relationships help assistive technologies understand how descriptive text
          connects to interface elements.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-4">Basic HTML Relationships</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="basic-name" variant="field">
                Full Name
              </Label>
              <Input id="basic-name" type="text" placeholder="Enter your full name" />
              <p className="text-xs text-muted-foreground">
                <code>htmlFor</code> creates direct relationship between label and input
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basic-email" variant="field">
                Email Address{' '}
                <span className="text-destructive" aria-label="required">
                  *
                </span>
              </Label>
              <Input
                id="basic-email"
                type="email"
                placeholder="user@example.com"
                required
                aria-required="true"
              />
              <p className="text-xs text-muted-foreground">
                Required field indicator includes <code>aria-label</code> for screen readers
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Complex ARIA Relationships</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="complex-password" variant="field">
                Password
              </Label>
              <Label variant="hint" id="password-help">
                Must be at least 8 characters with numbers and symbols
              </Label>
              <Input
                id="complex-password"
                type="password"
                placeholder="Enter secure password"
                aria-describedby="password-help password-strength"
              />
              <div id="password-strength" className="text-xs text-muted-foreground">
                Password strength will appear here as you type
              </div>
              <p className="text-xs text-muted-foreground">
                <code>aria-describedby</code> connects multiple descriptive elements
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validated-email" variant="field">
                Recovery Email
              </Label>
              <Input
                id="validated-email"
                type="email"
                defaultValue="user@example.com"
                variant="success"
                aria-describedby="email-validation"
              />
              <Label variant="success" id="email-validation" aria-live="polite">
                ✓ Email format is valid and available
              </Label>
              <p className="text-xs text-muted-foreground">
                <code>aria-live="polite"</code> announces validation changes to screen readers
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Grouped Form Relationships</h4>
          <fieldset className="space-y-4 border border-border rounded-md p-4">
            <legend className="text-sm font-medium px-2">Contact Information</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-first" variant="field">
                  First Name{' '}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </Label>
                <Input
                  id="contact-first"
                  type="text"
                  placeholder="John"
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-last" variant="field">
                  Last Name{' '}
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                </Label>
                <Input
                  id="contact-last"
                  type="text"
                  placeholder="Doe"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone" variant="field">
                Phone Number
              </Label>
              <Label variant="hint" id="phone-help">
                Include area code for better delivery
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                aria-describedby="phone-help"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              <code>fieldset</code> and <code>legend</code> provide semantic grouping context
            </p>
          </fieldset>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Semantic relationship patterns that create clear connections between labels and interface elements for assistive technologies.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Screen Reader Optimization
 *
 * Labels written for screen readers provide complete context and clear meaning
 * when read aloud without visual context.
 */
export const ScreenReaderOptimization: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Screen Reader Label Optimization</h3>
        <p className="text-sm text-muted-foreground">
          Labels optimized for screen readers provide complete context and meaning when visual
          information isn't available.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-4">Context-Complete Labels</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sr-search" variant="field">
                Search Products and Categories
              </Label>
              <Input
                id="sr-search"
                type="search"
                placeholder="Enter product name or category"
                aria-describedby="search-help"
              />
              <Label variant="hint" id="search-help">
                Press Enter to search, or use arrow keys to navigate suggestions
              </Label>
              <p className="text-xs text-muted-foreground">
                Label includes complete context rather than just "Search"
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sr-amount" variant="field">
                Transfer Amount in US Dollars
              </Label>
              <Input
                id="sr-amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                max="10000"
                aria-describedby="amount-help"
              />
              <Label variant="hint" id="amount-help">
                Maximum transfer amount is $10,000 per transaction
              </Label>
              <p className="text-xs text-muted-foreground">
                Includes currency and context that might be visually obvious
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">State Announcements</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sr-username" variant="field">
                Username
              </Label>
              <Label variant="hint" id="username-help">
                Must be 3-20 characters, letters and numbers only
              </Label>
              <Input
                id="sr-username"
                type="text"
                defaultValue="us"
                variant="error"
                aria-describedby="username-help username-error"
                aria-invalid="true"
              />
              <Label variant="error" id="username-error" aria-live="assertive">
                Username must be at least 3 characters long
              </Label>
              <p className="text-xs text-muted-foreground">
                <code>aria-live="assertive"</code> immediately announces validation errors
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sr-loading" variant="field">
                Profile Photo
              </Label>
              <div className="border rounded-md p-4 text-center">
                <Button variant="outline" size="sm" disabled>
                  Uploading...
                </Button>
                <Label variant="status" aria-live="polite" className="block mt-2">
                  Upload in progress: 45% complete
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                <code>aria-live="polite"</code> announces progress updates without interrupting
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Descriptive Error Recovery</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sr-card" variant="field">
                Credit Card Number
              </Label>
              <Input
                id="sr-card"
                type="text"
                defaultValue="1234-5678-9012"
                variant="error"
                aria-describedby="card-error card-format"
                aria-invalid="true"
              />
              <Label variant="error" id="card-error" aria-live="assertive">
                Credit card number is incomplete. Please enter all 16 digits without spaces or
                dashes.
              </Label>
              <Label variant="hint" id="card-format">
                Example format: 1234567890123456
              </Label>
              <p className="text-xs text-muted-foreground">
                Specific error description with clear recovery guidance
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sr-date" variant="field">
                Birth Date
              </Label>
              <Input
                id="sr-date"
                type="date"
                defaultValue="2025-01-01"
                variant="error"
                aria-describedby="date-error"
                aria-invalid="true"
              />
              <Label variant="error" id="date-error" aria-live="assertive">
                Birth date cannot be in the future. Please select a date before today.
              </Label>
              <p className="text-xs text-muted-foreground">
                Explains both the problem and the constraint clearly
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Screen Reader Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium">Context Completion</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Include information that's visually obvious</div>
              <div>• Specify units, formats, and constraints</div>
              <div>• Provide complete interaction instructions</div>
            </div>
          </div>
          <div>
            <div className="font-medium">State Communication</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Use aria-live for dynamic content updates</div>
              <div>• Announce both problems and solutions</div>
              <div>• Provide specific, actionable guidance</div>
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
          'Screen reader optimization techniques that ensure labels provide complete context and clear guidance when visual information is unavailable.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Language Clarity
 *
 * Clear, simple language makes labels accessible to users with cognitive differences
 * and non-native speakers while improving comprehension for everyone.
 */
export const LanguageClarity: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Clear Language Patterns</h3>
        <p className="text-sm text-muted-foreground">
          Simple, clear language improves accessibility for users with cognitive differences,
          non-native speakers, and anyone under cognitive load.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-4">Simple vs Complex Language</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-sm font-medium text-red-600">❌ Complex Language</div>
              <div className="space-y-2">
                <Label variant="field">Electronic Mail Address Designation</Label>
                <Input type="email" placeholder="Specify your electronic correspondence address" />
                <Label variant="hint">
                  This field necessitates the provision of a valid electronic mail address format
                </Label>
              </div>
              <div className="space-y-2">
                <Label variant="field">Telephonic Communication Device Number</Label>
                <Input type="tel" placeholder="Input your telecommunications identifier" />
                <Label variant="error">
                  The telephonic identifier you have provided does not conform to acceptable
                  formatting parameters
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium text-green-600">✓ Clear Language</div>
              <div className="space-y-2">
                <Label variant="field">Email Address</Label>
                <Input type="email" placeholder="user@example.com" />
                <Label variant="hint">We'll use this to send you updates</Label>
              </div>
              <div className="space-y-2">
                <Label variant="field">Phone Number</Label>
                <Input type="tel" placeholder="+1 (555) 123-4567" />
                <Label variant="error">Please include your area code</Label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Helpful vs Confusing Guidance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-sm font-medium text-red-600">❌ Confusing Guidance</div>
              <div className="space-y-2">
                <Label variant="field">Password</Label>
                <Input type="password" variant="error" defaultValue="weak" />
                <Label variant="error">Invalid password parameters detected</Label>
                <Label variant="hint">
                  Implement cryptographically secure authentication credentials
                </Label>
              </div>
              <div className="space-y-2">
                <Label variant="field">Profile Image</Label>
                <Button variant="outline" size="sm">
                  Select File
                </Button>
                <Label variant="error">File upload process encountered an error condition</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium text-green-600">✓ Helpful Guidance</div>
              <div className="space-y-2">
                <Label variant="field">Password</Label>
                <Input type="password" variant="error" defaultValue="weak" />
                <Label variant="error">Password must be at least 8 characters</Label>
                <Label variant="hint">Try adding numbers and symbols for security</Label>
              </div>
              <div className="space-y-2">
                <Label variant="field">Profile Photo</Label>
                <Button variant="outline" size="sm">
                  Choose Photo
                </Button>
                <Label variant="error">Photo must be smaller than 5MB</Label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium mb-4">Positive vs Negative Communication</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-sm font-medium text-red-600">❌ Negative Communication</div>
              <div className="space-y-2">
                <Label variant="field">Username</Label>
                <Input type="text" defaultValue="user123" variant="error" />
                <Label variant="error">Username failed validation</Label>
              </div>
              <div className="space-y-2">
                <Label variant="field">Email Address</Label>
                <Input type="email" defaultValue="user@example.com" variant="success" />
                <Label variant="success">Email address not rejected</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium text-green-600">✓ Positive Communication</div>
              <div className="space-y-2">
                <Label variant="field">Username</Label>
                <Input type="text" defaultValue="user123" variant="error" />
                <Label variant="error">Please choose a username with 5+ characters</Label>
              </div>
              <div className="space-y-2">
                <Label variant="field">Email Address</Label>
                <Input type="email" defaultValue="user@example.com" variant="success" />
                <Label variant="success">Email address looks good</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium text-sm mb-2">Language Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-medium">Simplicity</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Use common, everyday words</div>
              <div>• Keep sentences short and direct</div>
              <div>• Avoid technical jargon</div>
              <div>• Test with non-expert users</div>
            </div>
          </div>
          <div>
            <div className="font-medium">Helpfulness</div>
            <div className="text-muted-foreground space-y-1">
              <div>• Explain what went wrong specifically</div>
              <div>• Suggest concrete next steps</div>
              <div>• Use encouraging, supportive tone</div>
              <div>• Focus on solutions, not problems</div>
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
          'Language clarity patterns that improve accessibility through simple, helpful communication that works for all users.',
      },
    },
    layout: 'fullscreen',
  },
};
