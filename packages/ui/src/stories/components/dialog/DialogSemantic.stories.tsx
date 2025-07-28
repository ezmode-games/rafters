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
 * Trust levels communicate consequence through progressive visual hierarchy.
 * They provide immediate understanding of action significance and risk.
 */
const meta = {
  title: '03 Components/Interaction/Dialog/Trust Levels & Semantic Context',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dialog trust levels that communicate specific meaning and consequence through carefully chosen visual hierarchy and confirmation patterns.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Low-Stakes Decisions
 *
 * Low trust dialogs handle routine confirmations and reversible actions.
 * They provide confirmation without creating anxiety or decision fatigue.
 */
export const LowTrust: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Low Trust Action</Button>
      </DialogTrigger>
      <DialogContent trustLevel="low" size="sm">
        <DialogHeader>
          <DialogTitle>Save Draft</DialogTitle>
          <DialogDescription>Save your current work as a draft?</DialogDescription>
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
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Low trust dialogs handle routine, reversible actions with minimal friction. Use for drafts, preferences, or other low-stakes decisions.',
      },
    },
  },
};

/**
 * Moderate Significance
 *
 * Medium trust dialogs balance accessibility with appropriate caution.
 * They signal importance without creating excessive friction.
 */
export const MediumTrust: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Medium Trust Action</Button>
      </DialogTrigger>
      <DialogContent trustLevel="medium" size="md">
        <DialogHeader>
          <DialogTitle>Publish Article</DialogTitle>
          <DialogDescription>
            Your article will be published immediately and visible to all subscribers. You can edit
            or unpublish it later if needed.
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
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Medium trust dialogs balance accessibility with appropriate caution for moderately significant actions like publishing content or making changes.',
      },
    },
  },
};

/**
 * High-Stakes Operations
 *
 * High trust dialogs create deliberate friction for consequential actions.
 * They ensure users understand the scope and impact of their decisions.
 */
export const HighTrust: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">High Trust Action</Button>
      </DialogTrigger>
      <DialogContent trustLevel="high" size="md">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            You will be charged $49.99 for Premium Plan. This will automatically renew monthly
            unless cancelled. You can manage your subscription in account settings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Review Plan</Button>
          </DialogClose>
          <Button variant="primary" onClick={fn()}>
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'High trust dialogs create appropriate friction for consequential actions like payments, data changes, or subscription modifications.',
      },
    },
  },
};

/**
 * Critical Consequences
 *
 * Critical trust dialogs emphasize permanent, irreversible consequences.
 * They create maximum deliberate friction for destructive actions.
 */
export const CriticalTrust: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Critical Trust Action</Button>
      </DialogTrigger>
      <DialogContent trustLevel="critical" destructive size="md">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account, remove all your
            data, and cancel any active subscriptions. All your content will be lost forever.
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
  parameters: {
    docs: {
      description: {
        story:
          'Critical trust dialogs emphasize permanent consequences with maximum visual weight and clear escape routes for destructive actions.',
      },
    },
  },
};

/**
 * Trust Context Examples
 *
 * Understanding how trust levels work together helps create
 * interfaces that communicate risk and consequence appropriately.
 */
export const TrustContexts: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Content Management Context</h3>
        <div className="p-4 bg-muted/30 rounded border space-y-3">
          <div className="text-sm text-muted-foreground">
            Progressive trust levels for content lifecycle actions
          </div>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Save Draft
                </Button>
              </DialogTrigger>
              <DialogContent trustLevel="low" size="sm">
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
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Publish</Button>
              </DialogTrigger>
              <DialogContent trustLevel="medium" size="md">
                <DialogHeader>
                  <DialogTitle>Publish Content</DialogTitle>
                  <DialogDescription>Make this content visible to all users?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="primary" onClick={fn()}>
                    Publish
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </DialogTrigger>
              <DialogContent trustLevel="critical" destructive size="md">
                <DialogHeader>
                  <DialogTitle>Delete Content</DialogTitle>
                  <DialogDescription>
                    This will permanently delete the content and cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Keep Content</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={fn()}>
                    Delete Forever
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Account Management Context</h3>
        <div className="p-4 bg-muted/30 rounded border space-y-3">
          <div className="text-sm text-muted-foreground">
            Trust-appropriate actions for account security and data
          </div>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Update Profile</Button>
              </DialogTrigger>
              <DialogContent trustLevel="low" size="sm">
                <DialogHeader>
                  <DialogTitle>Update Profile</DialogTitle>
                  <DialogDescription>Save changes to your profile?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button size="sm" onClick={fn()}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="warning">Change Password</Button>
              </DialogTrigger>
              <DialogContent trustLevel="high" size="md">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    This will log you out of all devices. Continue?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="primary" onClick={fn()}>
                    Change Password
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </DialogTrigger>
              <DialogContent trustLevel="critical" destructive size="md">
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This permanently deletes your account and all data.
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
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Real-world examples showing how trust levels create appropriate friction and visual hierarchy across different action contexts.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Trust Level Comparison
 *
 * Side-by-side comparison helps understand the trust hierarchy
 * and appropriate usage patterns for each level.
 */
export const TrustComparison: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Low Trust
          </Button>
        </DialogTrigger>
        <DialogContent trustLevel="low" size="sm">
          <DialogHeader>
            <DialogTitle>Low Trust</DialogTitle>
            <DialogDescription>Minimal friction, routine action</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" onClick={fn()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Medium Trust</Button>
        </DialogTrigger>
        <DialogContent trustLevel="medium" size="md">
          <DialogHeader>
            <DialogTitle>Medium Trust</DialogTitle>
            <DialogDescription>Balanced caution, moderate significance</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="primary" onClick={fn()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">High Trust</Button>
        </DialogTrigger>
        <DialogContent trustLevel="high" size="md">
          <DialogHeader>
            <DialogTitle>High Trust</DialogTitle>
            <DialogDescription>Deliberate friction, consequential action</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="primary" onClick={fn()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Critical Trust</Button>
        </DialogTrigger>
        <DialogContent trustLevel="critical" destructive size="md">
          <DialogHeader>
            <DialogTitle>Critical Trust</DialogTitle>
            <DialogDescription>Maximum friction, permanent consequence</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={fn()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A side-by-side comparison of all trust levels showing their visual hierarchy and appropriate friction levels.',
      },
    },
  },
};
