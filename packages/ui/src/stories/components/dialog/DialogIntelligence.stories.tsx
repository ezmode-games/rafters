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
  title: 'Components/Dialog/Intelligence',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Progressive confirmation for destructive actions.
 * Step-by-step confirmation reduces accidental destructive actions while
 * building user confidence through clear process understanding.
 */
export const ProgressiveConfirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Project</Button>
      </DialogTrigger>
      <DialogContent trustLevel="critical" destructive size="md">
        <DialogHeader>
          <DialogTitle>Delete Project "My App"</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the project, all its files,
            and remove it from all team members.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="confirm-text">
              Type <strong>delete my app</strong> to confirm:
            </Label>
            <Input id="confirm-text" placeholder="delete my app" className="mt-2" />
          </div>

          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <strong>What will be deleted:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>All project files and folders</li>
              <li>Version history and git repositories</li>
              <li>Team member access and permissions</li>
              <li>Analytics and usage data</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep Project</Button>
          </DialogClose>
          <Button variant="destructive" disabled onClick={fn()}>
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Attention hierarchy demonstration shows proper visual priority.
 * Primary action gets highest attention, secondary gets medium, escape gets low.
 */
export const AttentionHierarchy: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Low-stakes decision */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Save Draft</Button>
          </DialogTrigger>
          <DialogContent trustLevel="low" size="sm">
            <DialogHeader>
              <DialogTitle>Save Draft</DialogTitle>
              <DialogDescription>Save your changes as a draft?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" onClick={fn()}>
                Save Draft
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Medium-stakes decision */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">Publish Article</Button>
          </DialogTrigger>
          <DialogContent trustLevel="medium" size="md">
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

        {/* High-stakes decision */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Cancel Subscription</Button>
          </DialogTrigger>
          <DialogContent trustLevel="high" destructive size="md">
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Your subscription will end immediately. You'll lose access to premium features and
                your data will be scheduled for deletion in 30 days.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Keep Subscription</Button>
              </DialogClose>
              <Button variant="destructive" onClick={fn()}>
                Cancel Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  ),
};

/**
 * Trust-building patterns reduce user anxiety during critical decisions.
 * Clear explanations, escape hatches, and familiar confirmation flows.
 */
export const TrustBuilding: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Connect Bank Account</Button>
      </DialogTrigger>
      <DialogContent trustLevel="critical" size="lg">
        <DialogHeader>
          <DialogTitle>Connect Your Bank Account</DialogTitle>
          <DialogDescription>
            We use bank-level security to protect your financial information. Your login credentials
            are encrypted and never stored on our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-md">
            <h4 className="font-medium text-sm mb-2">🔒 Your Security is Our Priority</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 256-bit SSL encryption for all data transmission</li>
              <li>• We never store your banking credentials</li>
              <li>• Read-only access - we cannot initiate transactions</li>
              <li>• Powered by Plaid, trusted by over 5,000 companies</li>
            </ul>
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>What we'll access:</strong> Account balances, transaction history (last 90
            days), and account details for verification. You can disconnect anytime from Settings.
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Not Now</Button>
          </DialogClose>
          <Button variant="primary" onClick={fn()}>
            Connect Securely
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Cognitive load optimization through clear information hierarchy.
 * Complex information is organized to reduce mental overhead.
 */
export const CognitiveLoad: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Simple complexity */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Simple Dialog</Button>
          </DialogTrigger>
          <DialogContent cognitiveComplexity="simple" size="sm">
            <DialogHeader>
              <DialogTitle>Sign Out</DialogTitle>
              <DialogDescription>Are you sure you want to sign out?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="primary" size="sm" onClick={fn()}>
                Sign Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Complex cognitive load */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Complex Dialog</Button>
          </DialogTrigger>
          <DialogContent cognitiveComplexity="complex" size="xl">
            <DialogHeader>
              <DialogTitle>Export Project Data</DialogTitle>
              <DialogDescription>
                Choose how you want to export your project data. This process may take several
                minutes depending on the amount of data.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Export Format</h4>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-muted/50">
                    <input type="radio" name="format" value="json" defaultChecked />
                    <div>
                      <div className="font-medium text-sm">JSON</div>
                      <div className="text-xs text-muted-foreground">Structured data</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-muted/50">
                    <input type="radio" name="format" value="csv" />
                    <div>
                      <div className="font-medium text-sm">CSV</div>
                      <div className="text-xs text-muted-foreground">Spreadsheet format</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Include Data</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">User profiles and settings</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Project files and folders</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Analytics and usage data</span>
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="primary" onClick={fn()}>
                Start Export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  ),
};
