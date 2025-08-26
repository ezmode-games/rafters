// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../../../components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/Card';

/**
 * Semantic content containers with intelligent spacing and focus management.
 * Cards organize related information with proper visual hierarchy and interaction patterns.
 */
const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic content containers with embedded spacing intelligence and focus management patterns.',
      },
    },
  },
  argTypes: {
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
      description: 'Content density affecting internal spacing',
    },
    prominence: {
      control: 'select',
      options: ['default', 'elevated', 'subtle'],
      description: 'Visual prominence level',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable hover and focus states for clickable cards',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// === BASIC CARD ===

export const Basic: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>A brief description of the card content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Card content goes here. This can include any type of information or interactive elements.
        </p>
      </CardContent>
    </Card>
  ),
};

// === WITH ACTIONS ===

export const WithActions: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Project Setup</CardTitle>
        <CardDescription>Configure your new project settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Framework</span>
            <span className="text-sm font-medium">React</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">TypeScript</span>
            <span className="text-sm font-medium">Enabled</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Create Project</Button>
      </CardFooter>
    </Card>
  ),
};

// === DENSITY VARIANTS ===

export const DensityVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      <Card density="compact" className="w-full">
        <CardHeader density="compact">
          <CardTitle level={4}>Compact</CardTitle>
          <CardDescription>Tight spacing for dense layouts</CardDescription>
        </CardHeader>
        <CardContent density="compact">
          <p className="text-sm">Minimal padding and spacing.</p>
        </CardContent>
      </Card>

      <Card density="comfortable" className="w-full">
        <CardHeader density="comfortable">
          <CardTitle level={4}>Comfortable</CardTitle>
          <CardDescription>Balanced spacing for most use cases</CardDescription>
        </CardHeader>
        <CardContent density="comfortable">
          <p className="text-sm">Standard padding and spacing.</p>
        </CardContent>
      </Card>

      <Card density="spacious" className="w-full">
        <CardHeader density="spacious">
          <CardTitle level={4}>Spacious</CardTitle>
          <CardDescription>Generous spacing for premium feels</CardDescription>
        </CardHeader>
        <CardContent density="spacious">
          <p className="text-sm">Generous padding and spacing.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// === INTERACTIVE STATES ===

export const InteractiveStates: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      <Card interactive className="cursor-pointer">
        <CardHeader>
          <CardTitle level={4}>Clickable Card</CardTitle>
          <CardDescription>Hover and focus states enabled</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This card responds to interaction with hover and focus states.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle level={4}>Static Card</CardTitle>
          <CardDescription>No interaction states</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This card is for display only with no interactive feedback.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// === PROMINENCE LEVELS ===

export const ProminenceLevels: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      <Card prominence="subtle">
        <CardHeader>
          <CardTitle level={4}>Subtle</CardTitle>
          <CardDescription prominence="subtle">Low visual weight</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Minimal visual impact for background content.</p>
        </CardContent>
      </Card>

      <Card prominence="default">
        <CardHeader>
          <CardTitle level={4}>Default</CardTitle>
          <CardDescription prominence="default">Standard visual weight</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Standard prominence for most content.</p>
        </CardContent>
      </Card>

      <Card prominence="elevated">
        <CardHeader>
          <CardTitle level={4}>Elevated</CardTitle>
          <CardDescription prominence="elevated">Higher visual weight</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Increased prominence for important content.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// === CONTENT PATTERNS ===

export const ContentPatterns: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      {/* Information Display */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Account information and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm">user@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Role</span>
              <span className="text-sm">Admin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Last Login</span>
              <span className="text-sm">2 hours ago</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            Edit Profile
          </Button>
        </CardFooter>
      </Card>

      {/* Action Card */}
      <Card interactive className="cursor-pointer">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>Start building something amazing</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Set up a new project with our guided wizard. Choose from templates or start from
            scratch.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="primary" size="sm">
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
