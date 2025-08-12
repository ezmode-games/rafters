import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/Select';

const meta = {
  title: 'Components/Select/Accessibility',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessibility is design quality, not compliance. Every accessibility feature improves the experience for all users. Accessibility features that enhance usability for all users while ensuring inclusive design principles are met.',
      },
    },
  },
  args: { onValueChange: fn() },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Foundation Principles
 *
 * Accessible selects work for everyone, not just assistive technology users.
 * They provide clear context, proper semantics, and predictable behavior.
 */
export const AccessibilityBasics: Story = {
  render: () => (
    <>
      <h3>Clear Labeling</h3>
      <label htmlFor="country-select">Country</label>
      <Select>
        <SelectTrigger id="country-select" aria-describedby="country-help">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
        </SelectContent>
      </Select>
      <p id="country-help">Required for shipping calculation</p>

      <h3>Keyboard Navigation</h3>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Navigate with arrow keys" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">First Option</SelectItem>
          <SelectItem value="option2">Second Option</SelectItem>
          <SelectItem value="option3">Third Option</SelectItem>
          <SelectItem value="option4">Fourth Option</SelectItem>
        </SelectContent>
      </Select>
      <p>Use Tab to focus, Enter/Space to open, arrows to navigate, Enter to select</p>

      <h3>Motor Accessibility</h3>
      <Select>
        <SelectTrigger size="large">
          <SelectValue placeholder="Enhanced touch targets" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="large1">Larger Touch Target 1</SelectItem>
          <SelectItem value="large2">Larger Touch Target 2</SelectItem>
          <SelectItem value="large3">Larger Touch Target 3</SelectItem>
        </SelectContent>
      </Select>
      <p>44px minimum touch targets improve usability for all interaction methods</p>
    </>
  ),
};

/**
 * Screen Reader Support
 *
 * Proper ARIA attributes and semantic structure support assistive technology.
 * These patterns enhance understanding for all users.
 */
export const ScreenReaderSupport: Story = {
  render: () => (
    <>
      <h3>Required Field</h3>
      <label htmlFor="priority-select">
        Priority <span className="text-destructive">*</span>
      </label>
      <Select required>
        <SelectTrigger id="priority-select" aria-required="true" aria-describedby="priority-error">
          <SelectValue placeholder="Select priority level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">High Priority</SelectItem>
          <SelectItem value="medium">Medium Priority</SelectItem>
          <SelectItem value="low">Low Priority</SelectItem>
        </SelectContent>
      </Select>
      <p id="priority-error" role="alert">
        Priority selection is required
      </p>

      <h3>Choice Count</h3>
      <label htmlFor="department-select">Department</label>
      <Select>
        <SelectTrigger id="department-select" showCount itemCount={5}>
          <SelectValue placeholder="Choose department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="support">Support</SelectItem>
        </SelectContent>
      </Select>
      <p>Item count helps users understand the scope of available choices</p>
    </>
  ),
};

/**
 * Error States
 *
 * Clear error communication helps users understand and resolve issues.
 * Visual and semantic indicators work together.
 */
export const ErrorStates: Story = {
  render: () => (
    <>
      <h3>Validation Error</h3>
      <label htmlFor="status-select">Status</label>
      <Select>
        <SelectTrigger
          id="status-select"
          className="border-destructive focus:ring-destructive"
          aria-invalid="true"
          aria-describedby="status-error"
        >
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
      <p id="status-error" role="alert">
        Please select a valid status from the list
      </p>

      <h3>Disabled State</h3>
      <label htmlFor="locked-select">Locked Selection</label>
      <Select disabled>
        <SelectTrigger id="locked-select" aria-describedby="locked-help">
          <SelectValue placeholder="Not available" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
      <p id="locked-help">This selection is locked until previous steps are completed</p>
    </>
  ),
};
