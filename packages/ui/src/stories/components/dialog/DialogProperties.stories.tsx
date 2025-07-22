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
 * Properties shape behavior and interaction patterns.
 * Each property serves the interface's functional requirements.
 */
const meta = {
  title: '03 Components/Interaction/Dialog/Properties & States',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Properties that control size, trust levels, and behavioral characteristics of dialogs within interface contexts.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compact Interfaces
 *
 * Small dialogs fit naturally in constrained layouts and quick confirmations.
 * They maintain functionality while conserving screen space.
 */
export const Small: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Small Dialog</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Quick Confirmation</DialogTitle>
          <DialogDescription>Save your current changes?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">Cancel</Button>
          </DialogClose>
          <Button size="sm" onClick={fn()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Small dialogs conserve space for quick confirmations and simple interactions. Perfect for mobile interfaces or when space is limited.',
      },
    },
  },
};

/**
 * Balanced Presence
 *
 * Medium dialogs provide the optimal balance of content space and screen efficiency.
 * This is the default size for most interface contexts.
 */
export const Medium: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Medium Dialog</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Standard Action</DialogTitle>
          <DialogDescription>
            This dialog provides enough space for detailed descriptions and multiple actions
            while maintaining a comfortable reading experience.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="primary" onClick={fn()}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Medium dialogs offer the ideal balance of content space and visual presence. Use as the default size for most dialog contexts.',
      },
    },
  },
};

/**
 * Prominent Actions
 *
 * Large dialogs command attention and provide ample space for complex content.
 * They excel in desktop interfaces and detailed form contexts.
 */
export const Large: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Large Dialog</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Detailed Configuration</DialogTitle>
          <DialogDescription>
            Large dialogs provide extensive space for complex forms, detailed explanations,
            and multiple sections of content. They work best on desktop interfaces where
            screen real estate allows for comprehensive interactions without overwhelming
            the user experience.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="primary" onClick={fn()}>Apply Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Large dialogs provide maximum content space and visual prominence. Ideal for desktop interfaces, detailed forms, or complex configuration panels.',
      },
    },
  },
};

/**
 * Cognitive Complexity
 *
 * Different complexity levels affect spacing and information density.
 * They guide users through varying levels of decision-making difficulty.
 */
export const CognitiveComplexity: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-6">
        <strong>Complexity Levels:</strong> Simple → Moderate → Complex with increasing cognitive load consideration
      </div>
      
      <div className="flex gap-4 flex-wrap">
        {/* Simple */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Simple</Button>
          </DialogTrigger>
          <DialogContent cognitiveComplexity="simple" size="sm">
            <DialogHeader>
              <DialogTitle>Simple Choice</DialogTitle>
              <DialogDescription>Yes or no?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm">No</Button>
              </DialogClose>
              <Button size="sm" onClick={fn()}>Yes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Moderate */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Moderate</Button>
          </DialogTrigger>
          <DialogContent cognitiveComplexity="moderate" size="md">
            <DialogHeader>
              <DialogTitle>Configure Settings</DialogTitle>
              <DialogDescription>
                Choose your preferences. These settings will affect how the application behaves.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="primary" onClick={fn()}>Save Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Complex */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">Complex</Button>
          </DialogTrigger>
          <DialogContent cognitiveComplexity="complex" size="lg">
            <DialogHeader>
              <DialogTitle>Advanced Configuration</DialogTitle>
              <DialogDescription>
                This complex operation involves multiple systems and dependencies. 
                Please review all options carefully before proceeding. Changes may 
                affect data integrity and system performance.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="primary" onClick={fn()}>Execute Configuration</Button>
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
          'Cognitive complexity levels adjust spacing and information density to match the decision-making difficulty. Simple choices get minimal friction, complex decisions get careful presentation.',
      },
    },
  },
};

/**
 * Size Comparison
 *
 * Understanding the scale relationships helps choose appropriate sizes
 * for different interface contexts and content requirements.
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Small</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Small</DialogTitle>
            <DialogDescription>Compact dialog</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button size="md">Medium</Button>
        </DialogTrigger>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Medium</DialogTitle>
            <DialogDescription>Standard dialog with balanced proportions</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg">Large</Button>
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Large</DialogTitle>
            <DialogDescription>Spacious dialog for complex content and detailed interactions</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A side-by-side comparison of all dialog sizes showing their scale relationships and appropriate use contexts.',
      },
    },
  },
};