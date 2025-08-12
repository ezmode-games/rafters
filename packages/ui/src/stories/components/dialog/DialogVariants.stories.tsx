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

const meta = {
  title: 'Components/Dialog/Variants',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard Information
 *
 * The default dialog treatment provides clean, accessible presentation for general use.
 * Use for informational content, standard confirmations, and routine interactions.
 */
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Standard Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Information</DialogTitle>
          <DialogDescription>
            This is a standard dialog with default styling for general information and
            confirmations.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="primary" onClick={fn()}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The default dialog variant provides clean, accessible presentation for general use cases like information display and standard confirmations.',
      },
    },
  },
};

/**
 * Destructive Context
 *
 * Destructive dialogs create appropriate visual tension for dangerous actions.
 * The visual treatment emphasizes consequence and encourages careful consideration.
 */
export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Destructive Action</Button>
      </DialogTrigger>
      <DialogContent destructive>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the project and remove all
            associated data, files, and configurations.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep Project</Button>
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
          'Destructive dialogs create appropriate visual emphasis for dangerous actions that permanently remove data or cannot be undone.',
      },
    },
  },
};

/**
 * Full-Screen Experience
 *
 * Full-size dialogs provide maximum content space for complex interactions.
 * They work best for multi-step processes, detailed forms, or rich content.
 */
export const FullSize: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Full-Screen Dialog</Button>
      </DialogTrigger>
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle>Advanced Configuration</DialogTitle>
          <DialogDescription>
            This full-screen dialog provides maximum space for complex forms, detailed configuration
            panels, or any content that requires extensive screen real estate for optimal user
            experience.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="primary" onClick={fn()}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Full-size dialogs provide maximum content space for complex interactions, detailed forms, or rich content that benefits from extensive screen real estate.',
      },
    },
  },
};

/**
 * Confirmation Patterns
 *
 * Different confirmation patterns based on action significance.
 * Visual variants support the trust-building hierarchy through appropriate emphasis.
 */
export const ConfirmationPatterns: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Confirmation Hierarchy</h3>
        <div className="p-4 bg-muted/30 rounded border space-y-3">
          <div className="text-sm text-muted-foreground">
            Visual variants that match confirmation patterns to action significance
          </div>
          <div className="flex gap-3">
            {/* Simple Confirmation */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Simple
                </Button>
              </DialogTrigger>
              <DialogContent size="sm">
                <DialogHeader>
                  <DialogTitle>Save Changes</DialogTitle>
                  <DialogDescription>Save your changes?</DialogDescription>
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

            {/* Standard Confirmation */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Standard</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Publish Content</DialogTitle>
                  <DialogDescription>
                    Your content will be published and visible to all users. Continue?
                  </DialogDescription>
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

            {/* High-Stakes Confirmation */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Critical</Button>
              </DialogTrigger>
              <DialogContent destructive>
                <DialogHeader>
                  <DialogTitle>Permanent Action</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone and will permanently affect your data.
                  </DialogDescription>
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
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Size-Based Contexts</h3>
        <div className="p-4 bg-muted/30 rounded border space-y-3">
          <div className="text-sm text-muted-foreground">
            Visual variants optimized for different content complexity levels
          </div>
          <div className="flex gap-3">
            {/* Compact */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Compact
                </Button>
              </DialogTrigger>
              <DialogContent size="sm">
                <DialogHeader>
                  <DialogTitle>Quick Action</DialogTitle>
                  <DialogDescription>Proceed?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">
                      No
                    </Button>
                  </DialogClose>
                  <Button size="sm" onClick={fn()}>
                    Yes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Balanced */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Balanced</Button>
              </DialogTrigger>
              <DialogContent size="md">
                <DialogHeader>
                  <DialogTitle>Standard Operation</DialogTitle>
                  <DialogDescription>
                    This operation will make changes to your data. Continue with the action?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="primary" onClick={fn()}>
                    Continue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Spacious */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="primary">Spacious</Button>
              </DialogTrigger>
              <DialogContent size="lg">
                <DialogHeader>
                  <DialogTitle>Detailed Configuration</DialogTitle>
                  <DialogDescription>
                    This dialog provides extensive space for complex content, detailed explanations,
                    and comprehensive user interactions. The larger format allows for better
                    organization of information and reduces cognitive load through proper spacing.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="primary" onClick={fn()}>
                    Apply
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
          'Real-world examples showing how visual variants support different confirmation patterns and content complexity levels.',
      },
    },
    layout: 'fullscreen',
  },
};

/**
 * Visual Treatment Comparison
 *
 * Side-by-side comparison helps understand the visual hierarchy
 * and appropriate usage patterns for each variant.
 */
export const VisualComparison: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Default</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Default Dialog</DialogTitle>
            <DialogDescription>Standard visual treatment for general use</DialogDescription>
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
          <Button variant="destructive">Destructive</Button>
        </DialogTrigger>
        <DialogContent destructive>
          <DialogHeader>
            <DialogTitle>Destructive Dialog</DialogTitle>
            <DialogDescription>Enhanced visual emphasis for dangerous actions</DialogDescription>
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

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Full Screen</Button>
        </DialogTrigger>
        <DialogContent size="full">
          <DialogHeader>
            <DialogTitle>Full-Screen Dialog</DialogTitle>
            <DialogDescription>
              Maximum space for complex content and interactions
            </DialogDescription>
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
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A side-by-side comparison of all visual variants showing their emphasis levels and appropriate use contexts.',
      },
    },
  },
};
