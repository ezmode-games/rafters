import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Input } from '../../../components/Input';

/**
 * Accessibility is design quality, not compliance.
 * Every accessibility feature improves the input experience for all users.
 */
const meta = {
  title: '03 Components/Forms/Input/Accessibility',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessibility features that enhance input usability for all users while ensuring inclusive design principles are met.',
      },
    },
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Foundation Principles
 *
 * Accessible inputs work for everyone, not just assistive technology users.
 * They provide clear context, proper validation feedback, and predictable behavior.
 */
export const AccessibilityBasics: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Foundation Principles</h3>
        <p className="text-sm text-muted-foreground">
          Accessible inputs benefit everyone by providing clear context, proper labeling,
          and meaningful feedback during data entry.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-base font-medium">Clear Labeling</h4>
          <div className="space-y-2">
            <label htmlFor="descriptive-input" className="text-sm font-medium">
              Email Address for Account Recovery
            </label>
            <Input
              id="descriptive-input"
              type="email"
              placeholder="user@example.com"
              aria-describedby="email-help"
            />
            <div id="email-help" className="text-xs text-muted-foreground">
              We'll use this email to help you recover your account if needed
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Descriptive labels and help text eliminate guesswork about input purpose
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Validation Feedback</h4>
          <div className="space-y-2">
            <label htmlFor="validation-input" className="text-sm font-medium">
              Password (minimum 8 characters)
            </label>
            <Input
              id="validation-input"
              type="password"
              placeholder="Enter secure password"
              variant="error"
              showValidation={true}
              validationMessage="Password must be at least 8 characters long"
              aria-invalid="true"
              sensitive={true}
              className="bg-[var(--validation-error-bg)] hover:opacity-[var(--validation-error-opacity)] transition-all duration-[var(--validation-error-timing)] border-[var(--sensitivity-personal-border)] focus:ring-[var(--ring-width-enhanced)] focus:ring-offset-[var(--ring-offset-enhanced)]"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Clear validation feedback with appropriate ARIA attributes
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Required Field Communication</h4>
          <div className="space-y-2">
            <label htmlFor="required-input" className="text-sm font-medium">
              Full Name <span className="text-destructive" aria-label="required">*</span>
            </label>
            <Input
              id="required-input"
              type="text"
              placeholder="Enter your full name"
              required
              aria-required="true"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Required fields are clearly marked both visually and for screen readers
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Foundation accessibility principles that improve input usability for everyone while ensuring inclusive design standards.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Keyboard Navigation
 *
 * Keyboard navigation should feel intuitive and predictable.
 * Focus management creates smooth, logical interaction flows.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Keyboard Navigation</h3>
        <p className="text-sm text-muted-foreground">
          Use Tab to navigate between inputs, Enter to submit forms. Clear focus indicators
          show current position and state.
        </p>
      </div>

      <div className="space-y-4">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label htmlFor="first-name" className="text-sm font-medium">First Name</label>
            <Input
              id="first-name"
              type="text"
              placeholder="Enter first name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="last-name" className="text-sm font-medium">Last Name</label>
            <Input
              id="last-name"
              type="text"
              placeholder="Enter last name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email-nav" className="text-sm font-medium">Email</label>
            <Input
              id="email-nav"
              type="email"
              placeholder="user@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone-nav" className="text-sm font-medium">Phone</label>
            <Input
              id="phone-nav"
              type="tel"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <button 
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Submit Form
          </button>
        </form>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            • <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Tab</kbd> to navigate between inputs
          </div>
          <div>
            • <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift + Tab</kbd> to navigate backwards
          </div>
          <div>
            • <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to submit forms
          </div>
          <div>• Focus rings provide clear visual indication of current position</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard navigation patterns that create intuitive, predictable interaction flows with proper focus management.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Motor Accessibility
 *
 * Enhanced touch targets and interaction areas accommodate different abilities.
 * Large, consistent targets reduce precision requirements.
 */
export const MotorAccessibility: Story = {
  render: () => (
    <div className="space-y-8 p-4 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Enhanced Touch Targets</h3>
        <p className="text-sm text-muted-foreground">
          Minimum 44px touch targets on mobile, 40px on desktop meet accessibility guidelines
          and improve usability for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-base font-medium">Mobile Optimized (44px)</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="mobile-input-1" className="text-sm font-medium">Full Name</label>
              <Input
                id="mobile-input-1"
                type="text"
                placeholder="Touch-friendly input"
                className="min-h-[44px]"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="mobile-input-2" className="text-sm font-medium">Email Address</label>
              <Input
                id="mobile-input-2"
                type="email"
                placeholder="Enhanced for mobile"
                className="min-h-[44px]"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="mobile-input-3" className="text-sm font-medium">Phone Number</label>
              <Input
                id="mobile-input-3"
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="min-h-[44px]"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Large touch targets reduce precision requirements
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-medium">Desktop Optimized (40px)</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="desktop-input-1" className="text-sm font-medium">Search Query</label>
              <Input
                id="desktop-input-1"
                type="search"
                placeholder="Search for anything..."
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="desktop-input-2" className="text-sm font-medium">Website URL</label>
              <Input
                id="desktop-input-2"
                type="url"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="desktop-input-3" className="text-sm font-medium">Amount</label>
              <Input
                id="desktop-input-3"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Consistent interaction areas for precise input devices
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-medium">Hover and Focus States</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="hover-demo" className="text-sm font-medium">Hover to Test</label>
            <Input
              id="hover-demo"
              type="text"
              placeholder="Hover over this input"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="focus-demo" className="text-sm font-medium">Click to Focus</label>
            <Input
              id="focus-demo"
              type="text"
              placeholder="Focus creates visible ring"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="disabled-demo" className="text-sm font-medium">Disabled State</label>
            <Input
              id="disabled-demo"
              type="text"
              placeholder="Cannot interact"
              disabled
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Clear visual feedback for all interaction states enhances motor accessibility
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Motor accessibility enhancements including appropriate touch target sizes and clear interaction feedback.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Screen Reader Optimization
 *
 * Screen readers need semantic structure and clear relationships.
 * Proper markup creates predictable, navigable experiences.
 */
export const ScreenReaderOptimization: Story = {
  render: () => (
    <div className="space-y-6 p-4 max-w-2xl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Screen Reader Optimization</h3>
        <p className="text-sm text-muted-foreground">
          Semantic markup and ARIA attributes create clear, navigable input experiences
          for screen reader users while maintaining intuitive interaction patterns.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-base font-medium">Input Relationships</h4>
          <div className="space-y-2">
            <label htmlFor="relationship-input" className="text-sm font-medium">
              Credit Card Number
            </label>
            <Input
              id="relationship-input"
              type="text"
              placeholder="1234 5678 9012 3456"
              aria-describedby="card-help card-security"
              sensitive={true}
              className="border-[var(--sensitivity-financial-border)] shadow-[var(--sensitivity-financial-shadow)] hover:opacity-[var(--opacity-hover)] transition-all duration-[var(--duration-deliberate)] focus:ring-[var(--ring-width-enhanced)]"
            />
            <div id="card-help" className="text-xs text-muted-foreground">
              Enter your 16-digit card number without spaces
            </div>
            <div id="card-security" className="text-xs text-muted-foreground">
              Your payment information is encrypted and secure
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            aria-describedby creates clear relationships between inputs and help text
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Validation Announcements</h4>
          <div className="space-y-2">
            <label htmlFor="validation-sr" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="validation-sr"
              type="password"
              placeholder="Enter password"
              variant="error"
              showValidation={true}
              validationMessage="Password must contain at least 8 characters with numbers and symbols"
              aria-invalid="true"
              aria-describedby="password-requirements"
              sensitive={true}
              className="bg-[var(--validation-error-bg)] hover:opacity-[var(--validation-error-opacity)] transition-all duration-[var(--validation-error-timing)] border-[var(--sensitivity-personal-border)] focus:ring-[var(--ring-width-enhanced)]"
            />
            <div id="password-requirements" className="text-xs text-muted-foreground">
              Must include: 8+ characters, numbers, and symbols
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Validation messages use appropriate ARIA live regions for immediate feedback
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-base font-medium">Form Group Context</h4>
          <fieldset className="space-y-3 border border-border rounded-md p-4">
            <legend className="text-sm font-medium px-2">Billing Address</legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="billing-first" className="text-sm font-medium">
                  First Name <span className="text-destructive" aria-label="required">*</span>
                </label>
                <Input
                  id="billing-first"
                  type="text"
                  placeholder="John"
                  required
                  aria-required="true"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="billing-last" className="text-sm font-medium">
                  Last Name <span className="text-destructive" aria-label="required">*</span>
                </label>
                <Input
                  id="billing-last"
                  type="text"
                  placeholder="Doe"
                  required
                  aria-required="true"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="billing-address" className="text-sm font-medium">
                Street Address <span className="text-destructive" aria-label="required">*</span>
              </label>
              <Input
                id="billing-address"
                type="text"
                placeholder="123 Main Street"
                required
                aria-required="true"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <label htmlFor="billing-city" className="text-sm font-medium">
                  City <span className="text-destructive" aria-label="required">*</span>
                </label>
                <Input
                  id="billing-city"
                  type="text"
                  placeholder="San Francisco"
                  required
                  aria-required="true"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="billing-state" className="text-sm font-medium">
                  State <span className="text-destructive" aria-label="required">*</span>
                </label>
                <Input
                  id="billing-state"
                  type="text"
                  placeholder="CA"
                  required
                  aria-required="true"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="billing-zip" className="text-sm font-medium">
                  ZIP Code <span className="text-destructive" aria-label="required">*</span>
                </label>
                <Input
                  id="billing-zip"
                  type="text"
                  placeholder="94102"
                  required
                  aria-required="true"
                />
              </div>
            </div>
          </fieldset>
          <p className="text-xs text-muted-foreground">
            Fieldset and legend provide semantic grouping that screen readers announce
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Screen reader optimization techniques that create clear, navigable input experiences through semantic markup and ARIA attributes.',
      },
    },
    layout: 'fullscreen',
  },
};