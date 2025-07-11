import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';

const meta = {
  title: '03 Components/Form/Label/Intelligence',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic-first label intelligence that guides users through forms with clarity and accessibility. Labels communicate importance, provide context, and reduce cognitive load through intelligent hierarchy.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Semantic Hierarchy
 *
 * Labels communicate importance through visual weight and semantic meaning.
 * This reduces cognitive load by helping users prioritize their attention.
 */
export const SemanticHierarchy: Story = {
  render: () => (
    <>
      <h3>Importance-Based Visual Hierarchy</h3>

      <div className="space-y-4 w-80">
        <div>
          <Label importance="critical" required>
            Critical Information
          </Label>
          <Input placeholder="Required for account security" />
        </div>

        <div>
          <Label importance="standard" required>
            Standard Field
          </Label>
          <Input placeholder="Standard required field" />
        </div>

        <div>
          <Label importance="optional">Optional Enhancement</Label>
          <Input placeholder="Nice to have information" />
        </div>
      </div>

      <p>Visual weight matches functional importance, guiding user attention naturally</p>
    </>
  ),
};

/**
 * Form Guidance Intelligence
 *
 * Help text provides contextual guidance that reduces errors and builds confidence.
 * Smart validation states give immediate feedback.
 */
export const FormGuidance: Story = {
  render: () => (
    <>
      <h3>Contextual Guidance Patterns</h3>

      <div className="space-y-4 w-80">
        <div>
          <Label
            importance="critical"
            required
            helpText="We use this to verify your identity and protect your account"
          >
            Email Address
          </Label>
          <Input type="email" placeholder="your@email.com" />
        </div>

        <div>
          <Label validationState="warning" helpText="Password strength could be improved">
            Password
          </Label>
          <Input type="password" placeholder="Enter password" />
        </div>

        <div>
          <Label validationState="success" helpText="Perfect! This username is available">
            Username
          </Label>
          <Input placeholder="Choose a unique username" />
        </div>

        <div>
          <Label validationState="error" helpText="This field is required to continue" required>
            Confirmation
          </Label>
          <Input placeholder="Please confirm your choice" />
        </div>
      </div>

      <p>
        Guidance text adapts to validation states, providing helpful context without overwhelming
      </p>
    </>
  ),
};

/**
 * Context-Aware Labeling
 *
 * Different label contexts serve different purposes.
 * Each context has appropriate styling and behavior patterns.
 */
export const ContextAwareness: Story = {
  render: () => (
    <>
      <h3>Context-Specific Behavior</h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <h4>Form Context</h4>
          <div className="space-y-2 w-80">
            <Label context="form" required>
              Form Field Label
            </Label>
            <Input placeholder="Interactive form input" />
            <p className="text-xs text-muted-foreground">
              Optimized for form interaction and accessibility
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4>Descriptive Context</h4>
          <div className="space-y-2">
            <Label context="descriptive">Data Description</Label>
            <p className="text-sm">This label describes static content or read-only information</p>
            <p className="text-xs text-muted-foreground">
              Used for content organization and information hierarchy
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4>Action Context</h4>
          <div className="space-y-2">
            <Label context="action">Interactive Label</Label>
            <p className="text-sm">This label can trigger actions or navigation</p>
            <p className="text-xs text-muted-foreground">
              Includes hover states and interactive affordances
            </p>
          </div>
        </div>
      </div>
    </>
  ),
};

/**
 * Accessibility Excellence
 *
 * Labels provide comprehensive accessibility support through semantic markup,
 * proper ARIA attributes, and screen reader optimization.
 */
export const AccessibilityExcellence: Story = {
  render: () => (
    <>
      <h3>Comprehensive Accessibility</h3>

      <div className="space-y-4 w-80">
        <div>
          <Label
            htmlFor="accessible-input"
            importance="critical"
            required
            helpText="Screen readers announce: 'Email Address, required field, edit text'"
          >
            Email Address
          </Label>
          <Input
            id="accessible-input"
            type="email"
            aria-describedby="email-help"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label
            htmlFor="validation-input"
            validationState="error"
            helpText="Error state uses assertive aria-live for immediate announcement"
            required
          >
            Password
          </Label>
          <Input
            id="validation-input"
            type="password"
            aria-invalid="true"
            aria-describedby="password-error"
          />
        </div>

        <div>
          <Label
            htmlFor="optional-input"
            importance="optional"
            helpText="Optional fields are clearly marked to reduce cognitive load"
          >
            Phone Number
          </Label>
          <Input id="optional-input" type="tel" placeholder="Optional contact method" />
        </div>
      </div>

      <p>Proper semantic markup and ARIA attributes ensure perfect screen reader support</p>
    </>
  ),
};
