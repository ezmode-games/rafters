import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/Dialog';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';

const meta = {
  title: '03 Components/Interaction/Dialog/Accessibility',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Comprehensive ARIA labeling and descriptions.
 * Screen readers get full context about dialog purpose and actions.
 */
export const AriaLabeling: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" aria-describedby="delete-warning">
          Delete File
        </Button>
      </DialogTrigger>
      <DialogContent trustLevel="critical" destructive>
        <DialogHeader>
          <DialogTitle id="dialog-title">Permanently Delete "document.pdf"</DialogTitle>
          <DialogDescription id="dialog-description">
            This file will be permanently deleted and cannot be recovered. It will be removed from
            all shared folders and team member access. This action affects 3 team members who have
            access to this file.
          </DialogDescription>
        </DialogHeader>

        <div
          id="delete-warning"
          className="bg-destructive/10 border border-destructive/20 p-3 rounded-md"
          role="alert"
          aria-live="polite"
        >
          <strong>⚠️ Warning:</strong> This action cannot be undone. The file will be permanently
          removed from all locations.
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" aria-label="Cancel deletion and keep the file">
              Keep File
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={fn()}
            aria-label="Permanently delete document.pdf - this cannot be undone"
            aria-describedby="dialog-description delete-warning"
          >
            Delete Forever
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Keyboard navigation patterns and focus management.
 * Proper tab order, escape handling, and focus trapping.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          <strong>Keyboard Navigation Instructions:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>
            <kbd>Tab</kbd> - Move to next focusable element
          </li>
          <li>
            <kbd>Shift + Tab</kbd> - Move to previous focusable element
          </li>
          <li>
            <kbd>Escape</kbd> - Close dialog
          </li>
          <li>
            <kbd>Enter</kbd> or <kbd>Space</kbd> - Activate focused button
          </li>
        </ul>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">Open Keyboard Navigation Demo</Button>
        </DialogTrigger>
        <DialogContent trustLevel="medium" size="md">
          <DialogHeader>
            <DialogTitle>Keyboard Navigation Test</DialogTitle>
            <DialogDescription>
              Use Tab to navigate between form fields and buttons. Press Escape to close this
              dialog.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Enter your first name" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Enter your last name" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" className="mt-1" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={fn()}>Save Information</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

/**
 * Screen reader compatibility with proper semantic markup.
 * Live regions, role attributes, and descriptive content.
 */
export const ScreenReader: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Process Payment</Button>
      </DialogTrigger>
      <DialogContent trustLevel="critical" size="lg">
        <DialogHeader>
          <DialogTitle>Confirm Payment of $49.99</DialogTitle>
          <DialogDescription>
            Review your order details before completing your purchase. You will be charged
            immediately and receive a confirmation email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order summary with semantic structure */}
          <section aria-labelledby="order-summary">
            <h3 id="order-summary" className="font-medium mb-3">
              Order Summary
            </h3>
            <div className="bg-muted/50 p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span>Premium Plan (Monthly)</span>
                <span>$49.99</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax</span>
                <span>$4.50</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>$54.49</span>
              </div>
            </div>
          </section>

          {/* Payment method with proper labeling */}
          <section aria-labelledby="payment-method">
            <h3 id="payment-method" className="font-medium mb-3">
              Payment Method
            </h3>
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-5 bg-primary rounded-sm flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">VISA</span>
                </div>
                <span>•••• •••• •••• 4242</span>
                <span className="text-sm text-muted-foreground">Expires 12/25</span>
              </div>
            </div>
          </section>

          {/* Status region for live updates */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            id="payment-status"
          >
            Payment form ready for submission
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" aria-label="Cancel payment and return to previous page">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            onClick={fn()}
            aria-label="Complete payment of $54.49 for Premium Plan"
            aria-describedby="order-summary payment-method"
          >
            Complete Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Color contrast verification and visual accessibility.
 * Meets WCAG AAA standards with enhanced contrast ratios.
 */
export const ColorContrast: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          <strong>Accessibility Features:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>WCAG AAA contrast ratios (7:1 for normal text, 4.5:1 for large text)</li>
          <li>Enhanced focus indicators with 3px outline</li>
          <li>Color-blind friendly color combinations</li>
          <li>No reliance on color alone for meaning</li>
        </ul>
      </div>

      {/* Test different contrast scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* High contrast destructive */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">High Contrast Destructive</Button>
          </DialogTrigger>
          <DialogContent trustLevel="critical" destructive>
            <DialogHeader>
              <DialogTitle>⚠️ Delete All Data</DialogTitle>
              <DialogDescription>
                This will permanently delete all your data. This action cannot be undone. High
                contrast styling ensures visibility for users with visual impairments.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={fn()}>
                ⚠️ Delete All Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* High contrast primary */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">High Contrast Primary</Button>
          </DialogTrigger>
          <DialogContent trustLevel="high">
            <DialogHeader>
              <DialogTitle>✓ Save Changes</DialogTitle>
              <DialogDescription>
                Your changes will be saved immediately. High contrast ensures readability across
                different vision capabilities and lighting conditions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="primary" onClick={fn()}>
                ✓ Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  ),
};

/**
 * Motor accessibility with enhanced touch targets.
 * 44px minimum touch targets and generous spacing.
 */
export const MotorAccessibility: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" size="lg">
          Enhanced Touch Targets
        </Button>
      </DialogTrigger>
      <DialogContent trustLevel="medium" size="md">
        <DialogHeader>
          <DialogTitle>Motor Accessibility Demo</DialogTitle>
          <DialogDescription>
            All interactive elements meet 44px minimum touch target requirements with generous
            spacing for easier interaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Motor Accessibility Features:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>44px minimum touch targets for mobile</li>
              <li>40px minimum for desktop interactions</li>
              <li>Generous spacing between interactive elements</li>
              <li>Large click areas extend beyond visual bounds</li>
            </ul>
          </div>

          {/* Large touch targets */}
          <div className="space-y-4">
            <Label htmlFor="large-input" className="text-base">
              Large Input Field
            </Label>
            <Input
              id="large-input"
              placeholder="Enhanced touch target"
              className="h-12 text-base px-4"
            />
          </div>
        </div>

        <DialogFooter className="space-y-3 sm:space-y-0">
          <DialogClose asChild>
            <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[44px]">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto min-h-[44px]"
            onClick={fn()}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
