import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../../../components/Button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../../../components/Dialog'

/**
 * Critical moments require trust. The dialog is where user confidence meets consequential decisions.
 * Our dialog system is built on progressive disclosure, clear escape hatches, and trust-building
 * patterns that reduce anxiety during important interactions.
 */
const meta = {
  title: '03 Components/Interaction/Dialog',
  component: Dialog,
  tags: ['!autodocs', '!dev', 'test'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Trust-building dialog system with progressive confirmation and cognitive load optimization.',
      },
    },
  },
  argTypes: {
    trustLevel: {
      control: 'select',
      options: ['low', 'medium', 'high', 'critical'],
      description: 'Trust level affects visual hierarchy and confirmation patterns',
    },
    destructive: {
      control: 'boolean',
      description: 'Destructive actions require enhanced confirmation patterns',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Size variant for content hierarchy and cognitive load',
    },
    cognitiveComplexity: {
      control: 'select',
      options: ['simple', 'moderate', 'complex'],
      description: 'Complexity level affects spacing and information density',
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic confirmation dialog with trust-building patterns.
 * Uses medium trust level with clear action hierarchy.
 */
export const Basic: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent trustLevel="medium" size="md" {...args}>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            This action will save your changes. You can always edit them later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={fn()}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * High-trust dialog for sensitive operations.
 * Enhanced visual hierarchy and clear consequence explanation.
 */
export const HighTrust: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Process Payment</Button>
      </DialogTrigger>
      <DialogContent trustLevel="high" size="md" {...args}>
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            You will be charged $49.99 for the Premium Plan. This will automatically 
            renew monthly unless cancelled. You can manage your subscription anytime 
            from your account settings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="primary" onClick={fn()}>
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * Critical trust dialog for destructive actions.
 * Maximum visual hierarchy and consequence explanation.
 */
export const Critical: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent trustLevel="critical" destructive size="md" {...args}>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account 
            and remove all your data from our servers. All your projects, files, 
            and settings will be lost forever.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep Account</Button>
          </DialogClose>
          <Button variant="destructive" onClick={fn()}>
            Delete Forever
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

/**
 * Size variants demonstrate content hierarchy and cognitive load management.
 * Different sizes handle different amounts of information appropriately.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Small</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Quick Action</DialogTitle>
            <DialogDescription>Simple confirmation needed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Cancel</Button>
            </DialogClose>
            <Button size="sm" onClick={fn()}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Medium</Button>
        </DialogTrigger>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Standard Dialog</DialogTitle>
            <DialogDescription>
              This is a standard dialog with moderate amount of content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={fn()}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg">Large</Button>
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Detailed Information</DialogTitle>
            <DialogDescription>
              This larger dialog can handle more complex content and detailed explanations.
              It provides more space for comprehensive information while maintaining
              readability and trust-building patterns.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={fn()}>Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
}