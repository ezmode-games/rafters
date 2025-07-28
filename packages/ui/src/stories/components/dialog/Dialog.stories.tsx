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
        component:
          'Trust-building dialog system with progressive confirmation and cognitive load optimization.',
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
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Common dialog demonstrations showing all trust levels and key variants.
 * Trust-building patterns with clear action hierarchy and consequence explanation.
 */
export const Common: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-6">
        <strong>Dialog Trust Levels:</strong> Low → Medium → High → Critical with increasing visual
        hierarchy
      </div>

      <div className="flex gap-4 flex-wrap">
        {/* Low Trust */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Low Trust
            </Button>
          </DialogTrigger>
          <DialogContent trustLevel="low" size="sm" {...args}>
            <DialogHeader>
              <DialogTitle>Save Draft</DialogTitle>
              <DialogDescription>Save your changes as a draft?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" onClick={fn()}>
                Save Draft
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Medium Trust */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Medium Trust</Button>
          </DialogTrigger>
          <DialogContent trustLevel="medium" size="md" {...args}>
            <DialogHeader>
              <DialogTitle>Publish Article</DialogTitle>
              <DialogDescription>
                Your article will be published immediately and visible to all subscribers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Save as Draft</Button>
              </DialogClose>
              <Button variant="primary" onClick={fn()}>
                Publish Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* High Trust */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">High Trust</Button>
          </DialogTrigger>
          <DialogContent trustLevel="high" size="md" {...args}>
            <DialogHeader>
              <DialogTitle>Process Payment</DialogTitle>
              <DialogDescription>
                You will be charged $49.99 for Premium Plan. This will automatically renew monthly
                unless cancelled.
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

        {/* Critical Trust */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Critical Trust</Button>
          </DialogTrigger>
          <DialogContent trustLevel="critical" destructive size="md" {...args}>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                all your data.
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
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete overview of dialog trust levels and their visual hierarchy. Each level provides appropriate visual weight and confirmation patterns for the sensitivity of the operation.',
      },
    },
  },
};
